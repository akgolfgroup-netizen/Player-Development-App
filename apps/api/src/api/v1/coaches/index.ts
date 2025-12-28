import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CoachService } from './service';
import { getPrismaClient } from '../../../core/db/prisma';
import {
  createCoachSchema,
  updateCoachSchema,
  listCoachesQuerySchema,
  coachIdParamSchema,
  availabilityQuerySchema,
  CreateCoachInput,
  UpdateCoachInput,
  ListCoachesQuery,
  CoachIdParam,
  AvailabilityQuery,
} from './schema';
import { authenticateUser, requireAdmin } from '../../../middleware/auth';
import { injectTenantContext } from '../../../middleware/tenant';
import { validate } from '../../../utils/validation';

// Convert Zod schemas to JSON Schema once at module level

/**
 * Register coach routes
 */
export async function coachRoutes(app: FastifyInstance): Promise<void> {
  const prisma = getPrismaClient();
  const coachService = new CoachService(prisma);

  const preHandlers = [authenticateUser, injectTenantContext];

  /**
   * Create a new coach
   */
  app.post<{ Body: CreateCoachInput }>(
    '/',
    {
      preHandler: [...preHandlers, requireAdmin],
      schema: {
        description: 'Create a new coach',
        tags: ['coaches'],
        security: [{ bearerAuth: [] }],
        response: {
          201: { type: 'object', additionalProperties: true },
          400: { $ref: 'Error#' },
          403: { $ref: 'Error#' },
          409: { $ref: 'Error#' },
        },
      },
    },
    async (request: FastifyRequest<{ Body: CreateCoachInput }>, reply: FastifyReply) => {
      const input = validate(createCoachSchema, request.body);
      const coach = await coachService.createCoach(request.tenant!.id, input);
      return reply.code(201).send({ success: true, data: coach });
    }
  );

  /**
   * List coaches with filters and pagination
   */
  app.get<{ Querystring: ListCoachesQuery }>(
    '/',
    {
      preHandler: preHandlers,
      schema: {
        description: 'List coaches with filters and pagination',
        tags: ['coaches'],
        security: [{ bearerAuth: [] }],
        response: {
          200: { type: 'object', additionalProperties: true },
        },
      },
    },
    async (request: FastifyRequest<{ Querystring: ListCoachesQuery }>, reply: FastifyReply) => {
      const query = validate(listCoachesQuerySchema, request.query);
      const result = await coachService.listCoaches(request.tenant!.id, query);
      return reply.send({ success: true, data: result });
    }
  );

  /**
   * Get coach by ID
   */
  app.get<{ Params: CoachIdParam }>(
    '/:id',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Get coach by ID',
        tags: ['coaches'],
        security: [{ bearerAuth: [] }],
        response: {
          200: { type: 'object', additionalProperties: true },
          404: { $ref: 'Error#' },
        },
      },
    },
    async (request: FastifyRequest<{ Params: CoachIdParam }>, reply: FastifyReply) => {
      const params = validate(coachIdParamSchema, request.params);
      const coach = await coachService.getCoachById(request.tenant!.id, params.id);
      return reply.send({ success: true, data: coach });
    }
  );

  /**
   * Update coach
   */
  app.patch<{ Params: CoachIdParam; Body: UpdateCoachInput }>(
    '/:id',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Update coach',
        tags: ['coaches'],
        security: [{ bearerAuth: [] }],
        response: {
          200: { type: 'object', additionalProperties: true },
          400: { $ref: 'Error#' },
          404: { $ref: 'Error#' },
          409: { $ref: 'Error#' },
        },
      },
    },
    async (request: FastifyRequest<{ Params: CoachIdParam; Body: UpdateCoachInput }>, reply: FastifyReply) => {
      const params = validate(coachIdParamSchema, request.params);
      const input = validate(updateCoachSchema, request.body);
      const coach = await coachService.updateCoach(
        request.tenant!.id,
        params.id,
        input
      );
      return reply.send({ success: true, data: coach });
    }
  );

  /**
   * Delete coach
   */
  app.delete<{ Params: CoachIdParam }>(
    '/:id',
    {
      preHandler: [...preHandlers, requireAdmin],
      schema: {
        description: 'Delete coach',
        tags: ['coaches'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              message: { type: 'string', example: 'Coach deleted successfully' },
            },
          },
          403: { $ref: 'Error#' },
          404: { $ref: 'Error#' },
        },
      },
    },
    async (request: FastifyRequest<{ Params: CoachIdParam }>, reply: FastifyReply) => {
      const params = validate(coachIdParamSchema, request.params);
      await coachService.deleteCoach(request.tenant!.id, params.id);
      return reply.send({ success: true, message: 'Coach deleted successfully' });
    }
  );

  /**
   * Get coach availability
   */
  app.get<{ Params: CoachIdParam; Querystring: AvailabilityQuery }>(
    '/:id/availability',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Get coach availability for a date range',
        tags: ['coaches'],
        security: [{ bearerAuth: [] }],
        response: {
          200: { type: 'object', additionalProperties: true },
          400: { $ref: 'Error#' },
          404: { $ref: 'Error#' },
        },
      },
    },
    async (request: FastifyRequest<{ Params: CoachIdParam; Querystring: AvailabilityQuery }>, reply: FastifyReply) => {
      const params = validate(coachIdParamSchema, request.params);
      const query = validate(availabilityQuerySchema, request.query);
      const availability = await coachService.getAvailability(
        request.tenant!.id,
        params.id,
        query.startDate,
        query.endDate
      );
      return reply.send({ success: true, data: availability });
    }
  );

  /**
   * Get coach statistics
   */
  app.get<{ Params: CoachIdParam }>(
    '/:id/statistics',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Get coach statistics (players, sessions)',
        tags: ['coaches'],
        security: [{ bearerAuth: [] }],
        response: {
          200: { type: 'object', additionalProperties: true },
          404: { $ref: 'Error#' },
        },
      },
    },
    async (request: FastifyRequest<{ Params: CoachIdParam }>, reply: FastifyReply) => {
      const params = validate(coachIdParamSchema, request.params);
      const statistics = await coachService.getStatistics(request.tenant!.id, params.id);
      return reply.send({ success: true, data: statistics });
    }
  );

  /**
   * Get coach's players
   */
  app.get<{ Params: CoachIdParam }>(
    '/:id/players',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Get all players assigned to this coach',
        tags: ['coaches'],
        security: [{ bearerAuth: [] }],
        response: {
          200: { type: 'object', additionalProperties: true },
          404: { $ref: 'Error#' },
        },
      },
    },
    async (request: FastifyRequest<{ Params: CoachIdParam }>, reply: FastifyReply) => {
      const params = validate(coachIdParamSchema, request.params);
      const players = await coachService.getCoachPlayers(request.tenant!.id, params.id);
      return reply.send({ success: true, data: players });
    }
  );

  /**
   * Get current coach's players (uses auth user)
   */
  app.get(
    '/me/players',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Get all players assigned to the authenticated coach',
        tags: ['coaches'],
        security: [{ bearerAuth: [] }],
        response: {
          200: { type: 'object', additionalProperties: true },
          403: { $ref: 'Error#' },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const coachId = request.user?.coachId;
      if (!coachId) {
        return reply.code(403).send({ success: false, error: { message: 'Not a coach' } });
      }
      const players = await coachService.getCoachPlayers(request.tenant!.id, coachId);
      return reply.send({ success: true, data: players });
    }
  );

  /**
   * Get current coach's alerts (uses auth user)
   */
  app.get(
    '/me/alerts',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Get alerts for the authenticated coach',
        tags: ['coaches'],
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            unread: { type: 'boolean' },
          },
        },
        response: {
          200: { type: 'object', additionalProperties: true },
          403: { $ref: 'Error#' },
        },
      },
    },
    async (request: FastifyRequest<{ Querystring: { unread?: boolean } }>, reply: FastifyReply) => {
      const coachId = request.user?.coachId;
      if (!coachId) {
        return reply.code(403).send({ success: false, error: { message: 'Not a coach' } });
      }
      const unreadOnly = request.query.unread === true;
      const alerts = await coachService.getCoachAlerts(request.tenant!.id, coachId, unreadOnly);
      return reply.send({ success: true, data: { alerts } });
    }
  );

  /**
   * Dismiss an alert
   */
  app.put<{ Params: { alertId: string } }>(
    '/alerts/:alertId/dismiss',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Mark an alert as dismissed/read',
        tags: ['coaches'],
        security: [{ bearerAuth: [] }],
        response: {
          200: { type: 'object', additionalProperties: true },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { alertId: string } }>, reply: FastifyReply) => {
      // For now, we just acknowledge - alerts are generated dynamically
      return reply.send({ success: true, message: 'Alert dismissed' });
    }
  );
}
