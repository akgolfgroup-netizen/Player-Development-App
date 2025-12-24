import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { VideoService } from './service';
import { getPrismaClient } from '../../../core/db/prisma';
import {
  initiateUploadSchema,
  completeUploadSchema,
  listVideosSchema,
  getVideoSchema,
  updateVideoSchema,
  InitiateUploadInput,
  CompleteUploadInput,
  ListVideosInput,
  GetVideoInput,
  UpdateVideoInput,
} from './schema';
import { authenticateUser } from '../../../middleware/auth';
import { validate } from '../../../utils/validation';

/**
 * Register video routes
 */
export async function videoRoutes(app: FastifyInstance): Promise<void> {
  const prisma = getPrismaClient();
  const videoService = new VideoService(prisma);

  /**
   * POST /videos/upload/init
   * Initiate multipart video upload
   */
  app.post<{ Body: InitiateUploadInput }>(
    '/upload/init',
    {
      preHandler: authenticateUser,
      schema: {
        description: 'Initiate multipart video upload',
        tags: ['videos'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['clientUploadId', 'title', 'playerId', 'fileName', 'fileSize', 'mimeType'],
          properties: {
            clientUploadId: { type: 'string', format: 'uuid' },
            title: { type: 'string', minLength: 1, maxLength: 255 },
            playerId: { type: 'string', format: 'uuid' },
            fileName: { type: 'string', minLength: 1 },
            fileSize: { type: 'number', minimum: 1, maximum: 5368709120 },
            mimeType: { type: 'string', pattern: '^video/' },
            category: { type: 'string', enum: ['swing', 'putting', 'short_game', 'other'] },
            clubType: { type: 'string', maxLength: 50 },
            viewAngle: { type: 'string', enum: ['face_on', 'down_the_line', 'overhead', 'side'] },
            description: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  videoId: { type: 'string' },
                  uploadId: { type: 'string' },
                  key: { type: 'string' },
                  signedUrls: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: InitiateUploadInput }>, reply: FastifyReply) => {
      const input = validate(initiateUploadSchema, request.body);
      const userId = request.user!.id;
      const tenantId = request.user!.tenantId;

      const result = await videoService.initiateUpload(input, userId, tenantId);

      return reply.status(200).send({
        success: true,
        data: result,
      });
    }
  );

  /**
   * POST /videos/upload/complete
   * Complete multipart video upload
   */
  app.post<{ Body: CompleteUploadInput }>(
    '/upload/complete',
    {
      preHandler: authenticateUser,
      schema: {
        description: 'Complete multipart video upload',
        tags: ['videos'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['videoId', 'uploadId', 'parts'],
          properties: {
            videoId: { type: 'string', format: 'uuid' },
            uploadId: { type: 'string' },
            parts: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                required: ['etag', 'partNumber'],
                properties: {
                  etag: { type: 'string' },
                  partNumber: { type: 'number', minimum: 1 },
                },
              },
            },
            duration: { type: 'number', minimum: 1 },
            width: { type: 'number', minimum: 1 },
            height: { type: 'number', minimum: 1 },
            fps: { type: 'number', minimum: 0 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  video: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      title: { type: 'string' },
                      status: { type: 'string' },
                      s3Key: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: CompleteUploadInput }>, reply: FastifyReply) => {
      const input = validate(completeUploadSchema, request.body);
      const userId = request.user!.id;
      const tenantId = request.user!.tenantId;

      const result = await videoService.completeUpload(input, userId, tenantId);

      return reply.status(200).send({
        success: true,
        data: result,
      });
    }
  );

  /**
   * GET /videos
   * List videos with filters and pagination
   */
  app.get<{ Querystring: ListVideosInput }>(
    '/',
    {
      preHandler: authenticateUser,
      schema: {
        description: 'List videos with filters and pagination',
        tags: ['videos'],
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            playerId: { type: 'string', format: 'uuid' },
            category: { type: 'string', enum: ['swing', 'putting', 'short_game', 'other'] },
            status: { type: 'string', enum: ['processing', 'ready', 'failed', 'deleted'] },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 20 },
            offset: { type: 'number', minimum: 0, default: 0 },
            sortBy: { type: 'string', enum: ['createdAt', 'title', 'duration'], default: 'createdAt' },
            sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  videos: { type: 'array' },
                  total: { type: 'number' },
                  limit: { type: 'number' },
                  offset: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Querystring: ListVideosInput }>, reply: FastifyReply) => {
      const input = validate(listVideosSchema, request.query);
      const tenantId = request.user!.tenantId;

      const result = await videoService.listVideos(input, tenantId);

      return reply.status(200).send({
        success: true,
        data: result,
      });
    }
  );

  /**
   * GET /videos/:id
   * Get video by ID
   */
  app.get<{ Params: GetVideoInput }>(
    '/:id',
    {
      preHandler: authenticateUser,
      schema: {
        description: 'Get video by ID',
        tags: ['videos'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        response: {
          200: { type: 'object', additionalProperties: true },
          404: { $ref: 'Error#' },
        },
      },
    },
    async (request: FastifyRequest<{ Params: GetVideoInput }>, reply: FastifyReply) => {
      const input = validate(getVideoSchema, request.params);
      const tenantId = request.user!.tenantId;

      const video = await videoService.getVideo(input.id, tenantId);

      return reply.status(200).send({
        success: true,
        data: video,
      });
    }
  );

  /**
   * GET /videos/:id/playback
   * Get signed playback URL
   */
  app.get<{ Params: { id: string }; Querystring: { expiresIn?: number } }>(
    '/:id/playback',
    {
      preHandler: authenticateUser,
      schema: {
        description: 'Get signed playback URL for video',
        tags: ['videos'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        querystring: {
          type: 'object',
          properties: {
            expiresIn: { type: 'number', minimum: 1, maximum: 3600, default: 300 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  expiresAt: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: { id: string }; Querystring: { expiresIn?: number } }>,
      reply: FastifyReply
    ) => {
      const tenantId = request.user!.tenantId;
      const expiresIn = request.query.expiresIn || 300;

      const result = await videoService.getPlaybackUrl(request.params.id, tenantId, expiresIn);

      return reply.status(200).send({
        success: true,
        data: result,
      });
    }
  );

  /**
   * PATCH /videos/:id
   * Update video metadata
   */
  app.patch<{ Params: { id: string }; Body: Omit<UpdateVideoInput, 'id'> }>(
    '/:id',
    {
      preHandler: authenticateUser,
      schema: {
        description: 'Update video metadata',
        tags: ['videos'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        body: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 1, maxLength: 255 },
            description: { type: 'string' },
            category: { type: 'string', enum: ['swing', 'putting', 'short_game', 'other'] },
            clubType: { type: 'string', maxLength: 50 },
            viewAngle: { type: 'string', enum: ['face_on', 'down_the_line', 'overhead', 'side'] },
            visibility: { type: 'string', enum: ['private', 'shared', 'public'] },
            shareExpiresAt: { type: ['string', 'null'], format: 'date-time' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: Omit<UpdateVideoInput, 'id'> }>,
      reply: FastifyReply
    ) => {
      const input = validate(updateVideoSchema, { ...request.body, id: request.params.id });
      const tenantId = request.user!.tenantId;

      await videoService.updateVideo(input, tenantId);

      return reply.status(200).send({
        success: true,
        message: 'Video updated successfully',
      });
    }
  );

  /**
   * DELETE /videos/:id
   * Delete video
   */
  app.delete<{ Params: { id: string }; Querystring: { hardDelete?: boolean } }>(
    '/:id',
    {
      preHandler: authenticateUser,
      schema: {
        description: 'Delete video (soft delete by default)',
        tags: ['videos'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        querystring: {
          type: 'object',
          properties: {
            hardDelete: { type: 'boolean', default: false },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: { id: string }; Querystring: { hardDelete?: boolean } }>,
      reply: FastifyReply
    ) => {
      const tenantId = request.user!.tenantId;
      const hardDelete = request.query.hardDelete || false;

      await videoService.deleteVideo(request.params.id, tenantId, hardDelete);

      return reply.status(200).send({
        success: true,
        message: 'Video deleted successfully',
      });
    }
  );
}
