/**
 * Video Service
 * Business logic for video management
 */

import { PrismaClient } from '@prisma/client';
import { storageService } from '../../../services/storage.service';
import { NotFoundError, BadRequestError, InternalServerError } from '../../../middleware/errors';
import {
  InitiateUploadInput,
  CompleteUploadInput,
  ListVideosInput,
  UpdateVideoInput,
} from './schema';

export class VideoService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Initiate multipart upload
   */
  async initiateUpload(
    input: InitiateUploadInput,
    userId: string,
    tenantId: string
  ): Promise<{
    videoId: string;
    uploadId: string;
    key: string;
    signedUrls: string[];
  }> {
    // Verify player belongs to tenant
    const player = await this.prisma.player.findFirst({
      where: {
        id: input.playerId,
        tenantId,
      },
    });

    if (!player) {
      throw new NotFoundError('Player not found or access denied');
    }

    // Validate mime type
    const allowedMimeTypes = [
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-matroska',
    ];

    if (!allowedMimeTypes.includes(input.mimeType)) {
      throw new BadRequestError(`Unsupported video format. Allowed: ${allowedMimeTypes.join(', ')}`);
    }

    // Initiate S3 multipart upload
    const upload = await storageService.initiateMultipartUpload({
      tenantId,
      playerId: input.playerId,
      fileName: input.fileName,
      mimeType: input.mimeType,
      fileSize: input.fileSize,
    });

    // Create video record in database
    const video = await this.prisma.video.create({
      data: {
        tenantId,
        playerId: input.playerId,
        uploadedById: userId,
        title: input.title,
        description: input.description,
        s3Key: upload.key,
        duration: 0, // Will be updated on complete
        fileSize: BigInt(input.fileSize),
        mimeType: input.mimeType,
        category: input.category,
        clubType: input.clubType,
        viewAngle: input.viewAngle,
        status: 'processing',
      },
    });

    return {
      videoId: video.id,
      uploadId: upload.uploadId,
      key: upload.key,
      signedUrls: upload.signedUrls,
    };
  }

  /**
   * Complete multipart upload
   */
  async completeUpload(
    input: CompleteUploadInput,
    _userId: string,
    tenantId: string
  ): Promise<{
    video: {
      id: string;
      title: string;
      status: string;
      s3Key: string;
    };
  }> {
    // Get video record
    const video = await this.prisma.video.findFirst({
      where: {
        id: input.videoId,
        tenantId,
      },
    });

    if (!video) {
      throw new NotFoundError('Video not found or access denied');
    }

    if (video.status !== 'processing') {
      throw new BadRequestError('Video upload already completed or failed');
    }

    // Complete S3 multipart upload
    try {
      await storageService.completeMultipartUpload({
        key: video.s3Key,
        uploadId: input.uploadId,
        parts: input.parts,
      });
    } catch (error: any) {
      // Mark video as failed
      await this.prisma.video.update({
        where: { id: video.id },
        data: {
          status: 'failed',
          errorCode: 'UPLOAD_FAILED',
          errorMessage: error.message,
        },
      });

      throw new InternalServerError('Failed to complete upload');
    }

    // Update video record
    const updatedVideo = await this.prisma.video.update({
      where: { id: video.id },
      data: {
        status: 'ready',
        duration: input.duration || 0,
        width: input.width,
        height: input.height,
        fps: input.fps,
        processedAt: new Date(),
      },
    });

    return {
      video: {
        id: updatedVideo.id,
        title: updatedVideo.title,
        status: updatedVideo.status,
        s3Key: updatedVideo.s3Key,
      },
    };
  }

  /**
   * Get video by ID
   */
  async getVideo(
    videoId: string,
    tenantId: string
  ): Promise<{
    id: string;
    title: string;
    description: string | null;
    playerId: string;
    uploadedById: string;
    category: string | null;
    clubType: string | null;
    viewAngle: string | null;
    duration: number;
    width: number | null;
    height: number | null;
    fps: number | null;
    fileSize: string;
    status: string;
    visibility: string;
    createdAt: Date;
    updatedAt: Date;
    player: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }> {
    const video = await this.prisma.video.findFirst({
      where: {
        id: videoId,
        tenantId,
        deletedAt: null,
      },
      include: {
        player: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!video) {
      throw new NotFoundError('Video not found');
    }

    return {
      id: video.id,
      title: video.title,
      description: video.description,
      playerId: video.playerId,
      uploadedById: video.uploadedById,
      category: video.category,
      clubType: video.clubType,
      viewAngle: video.viewAngle,
      duration: video.duration,
      width: video.width,
      height: video.height,
      fps: video.fps ? parseFloat(video.fps.toString()) : null,
      fileSize: video.fileSize.toString(),
      status: video.status,
      visibility: video.visibility,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
      player: video.player,
    };
  }

  /**
   * List videos with filters and pagination
   */
  async listVideos(
    input: ListVideosInput,
    tenantId: string
  ): Promise<{
    videos: Array<{
      id: string;
      title: string;
      playerId: string;
      category: string | null;
      duration: number;
      status: string;
      createdAt: Date;
      player: {
        firstName: string;
        lastName: string;
      };
    }>;
    total: number;
    limit: number;
    offset: number;
  }> {
    const where: any = {
      tenantId,
      deletedAt: null,
    };

    if (input.playerId) {
      where.playerId = input.playerId;
    }

    if (input.category) {
      where.category = input.category;
    }

    if (input.status) {
      where.status = input.status;
    }

    const [videos, total] = await Promise.all([
      this.prisma.video.findMany({
        where,
        include: {
          player: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          [input.sortBy]: input.sortOrder,
        },
        take: input.limit,
        skip: input.offset,
      }),
      this.prisma.video.count({ where }),
    ]);

    return {
      videos: videos.map(v => ({
        id: v.id,
        title: v.title,
        playerId: v.playerId,
        category: v.category,
        duration: v.duration,
        status: v.status,
        createdAt: v.createdAt,
        player: v.player,
      })),
      total,
      limit: input.limit,
      offset: input.offset,
    };
  }

  /**
   * Get playback URL
   */
  async getPlaybackUrl(
    videoId: string,
    tenantId: string,
    expiresIn: number = 300
  ): Promise<{
    url: string;
    expiresAt: Date;
  }> {
    const video = await this.prisma.video.findFirst({
      where: {
        id: videoId,
        tenantId,
        deletedAt: null,
      },
    });

    if (!video) {
      throw new NotFoundError('Video not found');
    }

    if (video.status !== 'ready') {
      throw new BadRequestError('Video not ready for playback');
    }

    const url = await storageService.getSignedPlaybackUrl(
      video.s3Key,
      tenantId,
      expiresIn
    );

    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    return {
      url,
      expiresAt,
    };
  }

  /**
   * Update video metadata
   */
  async updateVideo(
    input: UpdateVideoInput,
    tenantId: string
  ): Promise<void> {
    const video = await this.prisma.video.findFirst({
      where: {
        id: input.id,
        tenantId,
        deletedAt: null,
      },
    });

    if (!video) {
      throw new NotFoundError('Video not found');
    }

    const updateData: any = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.category !== undefined) updateData.category = input.category;
    if (input.clubType !== undefined) updateData.clubType = input.clubType;
    if (input.viewAngle !== undefined) updateData.viewAngle = input.viewAngle;
    if (input.visibility !== undefined) updateData.visibility = input.visibility;
    if (input.shareExpiresAt !== undefined) {
      updateData.shareExpiresAt = input.shareExpiresAt ? new Date(input.shareExpiresAt) : null;
    }

    await this.prisma.video.update({
      where: { id: input.id },
      data: updateData,
    });
  }

  /**
   * Delete video
   */
  async deleteVideo(
    videoId: string,
    tenantId: string,
    hardDelete: boolean = false
  ): Promise<void> {
    const video = await this.prisma.video.findFirst({
      where: {
        id: videoId,
        tenantId,
      },
    });

    if (!video) {
      throw new NotFoundError('Video not found');
    }

    if (hardDelete) {
      // Delete from S3
      await storageService.deleteObject(video.s3Key);

      // Delete thumbnail if exists
      if (video.thumbnailKey) {
        await storageService.deleteObject(video.thumbnailKey);
      }

      // Hard delete from database
      await this.prisma.video.delete({
        where: { id: videoId },
      });
    } else {
      // Soft delete
      await this.prisma.video.update({
        where: { id: videoId },
        data: {
          deletedAt: new Date(),
          status: 'deleted',
        },
      });
    }
  }
}
