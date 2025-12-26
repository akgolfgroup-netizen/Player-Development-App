/**
 * Storage Service
 * Handles S3 multipart uploads, signed URLs, and file operations with tenant isolation
 */

import {
  S3Client,
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  UploadPartCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import { config } from '../config';
import { BadRequestError, ForbiddenError } from '../middleware/errors';

export interface InitiateMultipartUploadParams {
  tenantId: string;
  playerId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
}

export interface InitiateMultipartUploadResult {
  uploadId: string;
  key: string;
  signedUrls: string[];
}

export interface CompleteMultipartUploadParams {
  key: string;
  uploadId: string;
  parts: Array<{ etag: string; partNumber: number }>;
}

export interface UploadPartParams {
  key: string;
  uploadId: string;
  partNumber: number;
  body: Buffer;
}

export class StorageService {
  private s3: S3Client;
  private bucket: string;

  constructor() {
    this.s3 = new S3Client({
      region: config.s3.region,
      endpoint: config.s3.endpoint,
      credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
      },
      forcePathStyle: config.s3.forcePathStyle,
    });
    this.bucket = config.s3.bucket;
  }

  /**
   * Generate S3 key with tenant isolation
   */
  private generateKey(tenantId: string, playerId: string, fileName: string): string {
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    return `tenants/${tenantId}/videos/${playerId}/${timestamp}-${sanitizedFileName}`;
  }

  /**
   * Generate S3 key for thumbnails
   */
  private generateThumbnailKey(videoKey: string): string {
    const lastSlash = videoKey.lastIndexOf('/');
    const fileName = videoKey.substring(lastSlash + 1);
    const basePath = videoKey.substring(0, lastSlash);
    return `${basePath}/thumbnails/${fileName.replace(/\.[^.]+$/, '.jpg')}`;
  }

  /**
   * Validate tenant access to a key
   */
  private validateTenantAccess(key: string, tenantId: string): void {
    if (!key.startsWith(`tenants/${tenantId}/`)) {
      throw new ForbiddenError('Access denied: Tenant mismatch');
    }
  }

  /**
   * Calculate number of parts needed for multipart upload
   * S3 minimum part size is 5MB, maximum 10,000 parts
   */
  private calculatePartCount(fileSize: number): number {
    const MIN_PART_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_PARTS = 10000;

    const partCount = Math.ceil(fileSize / MIN_PART_SIZE);

    if (partCount > MAX_PARTS) {
      throw new BadRequestError('File too large for multipart upload');
    }

    return Math.max(partCount, 1);
  }

  /**
   * Initiate multipart upload and generate presigned URLs
   */
  async initiateMultipartUpload(
    params: InitiateMultipartUploadParams
  ): Promise<InitiateMultipartUploadResult> {
    const key = this.generateKey(params.tenantId, params.playerId, params.fileName);

    // Create multipart upload
    const createCommand = new CreateMultipartUploadCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: params.mimeType,
      Metadata: {
        tenantId: params.tenantId,
        playerId: params.playerId,
        originalFileName: params.fileName,
      },
    });

    const response = await this.s3.send(createCommand);

    if (!response.UploadId) {
      throw new BadRequestError('Failed to initiate multipart upload');
    }

    // Calculate number of parts
    const partCount = this.calculatePartCount(params.fileSize);

    // Generate presigned URLs for each part
    const signedUrls: string[] = [];
    for (let partNumber = 1; partNumber <= partCount; partNumber++) {
      const uploadPartCommand = new UploadPartCommand({
        Bucket: this.bucket,
        Key: key,
        UploadId: response.UploadId,
        PartNumber: partNumber,
      });

      const signedUrl = await getSignedUrl(this.s3, uploadPartCommand, {
        expiresIn: 3600, // 1 hour
      });

      signedUrls.push(signedUrl);
    }

    return {
      uploadId: response.UploadId,
      key,
      signedUrls,
    };
  }

  /**
   * Complete multipart upload
   */
  async completeMultipartUpload(params: CompleteMultipartUploadParams): Promise<void> {
    const command = new CompleteMultipartUploadCommand({
      Bucket: this.bucket,
      Key: params.key,
      UploadId: params.uploadId,
      MultipartUpload: {
        Parts: params.parts.map(part => ({
          ETag: part.etag,
          PartNumber: part.partNumber,
        })),
      },
    });

    await this.s3.send(command);
  }

  /**
   * Abort multipart upload
   */
  async abortMultipartUpload(key: string, uploadId: string): Promise<void> {
    const command = new AbortMultipartUploadCommand({
      Bucket: this.bucket,
      Key: key,
      UploadId: uploadId,
    });

    await this.s3.send(command);
  }

  /**
   * Generate signed URL for playback (short-lived, tenant-gated)
   */
  async getSignedPlaybackUrl(
    key: string,
    tenantId: string,
    expiresIn: number = 300 // 5 minutes default
  ): Promise<string> {
    // Validate tenant access
    this.validateTenantAccess(key, tenantId);

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }

  /**
   * Generate signed URL for upload (PUT)
   */
  async getSignedUploadUrl(
    key: string,
    tenantId: string,
    mimeType: string,
    expiresIn: number = 3600 // 1 hour default
  ): Promise<string> {
    // Validate tenant access
    this.validateTenantAccess(key, tenantId);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: mimeType,
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }

  /**
   * Delete object from S3
   */
  async deleteObject(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3.send(command);
  }

  /**
   * Check if object exists
   */
  async objectExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get object metadata
   */
  async getObjectMetadata(key: string): Promise<{
    contentType?: string;
    contentLength?: number;
    lastModified?: Date;
    metadata?: Record<string, string>;
  }> {
    const command = new HeadObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await this.s3.send(command);

    return {
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      lastModified: response.LastModified,
      metadata: response.Metadata,
    };
  }

  /**
   * Upload buffer directly (for small files, thumbnails, etc.)
   */
  async uploadBuffer(
    tenantId: string,
    playerId: string,
    fileName: string,
    buffer: Buffer,
    mimeType: string
  ): Promise<string> {
    const key = this.generateKey(tenantId, playerId, fileName);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      Metadata: {
        tenantId,
        playerId,
      },
    });

    await this.s3.send(command);
    return key;
  }

  /**
   * Upload stream (for larger files)
   */
  async uploadStream(
    tenantId: string,
    playerId: string,
    fileName: string,
    stream: any, // Use any for stream types to avoid type conflicts
    mimeType: string
  ): Promise<string> {
    const key = this.generateKey(tenantId, playerId, fileName);

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: stream,
        ContentType: mimeType,
        Metadata: {
          tenantId,
          playerId,
        },
      },
    });

    await upload.done();
    return key;
  }

  /**
   * Generate thumbnail key for a video
   */
  getThumbnailKey(videoKey: string): string {
    return this.generateThumbnailKey(videoKey);
  }

  /**
   * Upload buffer to a specific key (for thumbnails, etc.)
   */
  async uploadToKey(
    key: string,
    buffer: Buffer,
    mimeType: string,
    metadata?: Record<string, string>
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      Metadata: metadata,
    });

    await this.s3.send(command);
  }
}

// Export singleton instance
export const storageService = new StorageService();
