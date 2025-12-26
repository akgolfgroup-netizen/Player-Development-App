import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getPrismaClient } from '../../../core/db/prisma';
import { authenticateUser } from '../../../middleware/auth';

/**
 * Register notification routes
 *
 * Endpoints:
 * - GET /notifications - List user notifications (latest 50, sorted desc)
 * - PATCH /notifications/:id/read - Mark single notification as read
 * - POST /notifications/read-all - Mark all user notifications as read
 */
export async function notificationRoutes(app: FastifyInstance): Promise<void> {
  const prisma = getPrismaClient();

  /**
   * GET /notifications
   * List notifications for the authenticated user
   */
  app.get<{
    Querystring: { unreadOnly?: string };
  }>(
    '/',
    {
      preHandler: authenticateUser,
      schema: {
        description: 'List notifications for the authenticated user',
        tags: ['notifications'],
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            unreadOnly: {
              type: 'string',
              enum: ['0', '1', 'true', 'false'],
              description: 'Filter to only unread notifications',
            },
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
                  notifications: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        notificationType: { type: 'string' },
                        title: { type: 'string' },
                        message: { type: 'string' },
                        metadata: { type: 'object' },
                        readAt: { type: ['string', 'null'] },
                        createdAt: { type: 'string' },
                      },
                    },
                  },
                  unreadCount: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Querystring: { unreadOnly?: string } }>,
      reply: FastifyReply
    ) => {
      const userId = request.user!.id;
      const unreadOnly =
        request.query.unreadOnly === '1' || request.query.unreadOnly === 'true';

      // Build where clause
      const whereClause: any = {
        recipientId: userId,
        channels: {
          path: [],
          array_contains: 'app',
        },
      };

      if (unreadOnly) {
        whereClause.readAt = null;
      }

      // Fetch notifications (latest 50, sorted by createdAt desc)
      const [notifications, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
          take: 50,
          select: {
            id: true,
            notificationType: true,
            title: true,
            message: true,
            metadata: true,
            readAt: true,
            createdAt: true,
          },
        }),
        prisma.notification.count({
          where: {
            recipientId: userId,
            readAt: null,
            channels: {
              path: [],
              array_contains: 'app',
            },
          },
        }),
      ]);

      return reply.status(200).send({
        success: true,
        data: {
          notifications,
          unreadCount,
        },
      });
    }
  );

  /**
   * PATCH /notifications/:id/read
   * Mark a single notification as read
   */
  app.patch<{ Params: { id: string } }>(
    '/:id/read',
    {
      preHandler: authenticateUser,
      schema: {
        description: 'Mark a notification as read',
        tags: ['notifications'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
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
          404: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.id;
      const notificationId = request.params.id;

      // Verify notification belongs to user
      const notification = await prisma.notification.findFirst({
        where: {
          id: notificationId,
          recipientId: userId,
        },
      });

      if (!notification) {
        return reply.status(404).send({
          success: false,
          error: 'Notification not found',
        });
      }

      // Mark as read
      await prisma.notification.update({
        where: { id: notificationId },
        data: { readAt: new Date() },
      });

      return reply.status(200).send({
        success: true,
        message: 'Notification marked as read',
      });
    }
  );

  /**
   * POST /notifications/read-all
   * Mark all user notifications as read
   */
  app.post(
    '/read-all',
    {
      preHandler: authenticateUser,
      schema: {
        description: 'Mark all notifications as read',
        tags: ['notifications'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              count: { type: 'number' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;

      // Mark all unread notifications as read
      const result = await prisma.notification.updateMany({
        where: {
          recipientId: userId,
          readAt: null,
        },
        data: { readAt: new Date() },
      });

      return reply.status(200).send({
        success: true,
        message: 'All notifications marked as read',
        count: result.count,
      });
    }
  );
}
