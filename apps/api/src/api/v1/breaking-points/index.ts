import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { BreakingPointService } from './service';
import { getPrismaClient } from '../../../core/db/prisma';
import {
  createBreakingPointSchema,
  updateBreakingPointSchema,
  updateProgressSchema,
  listBreakingPointsQuerySchema,
  breakingPointIdParamSchema,
  CreateBreakingPointInput,
  UpdateBreakingPointInput,
  UpdateProgressInput,
  ListBreakingPointsQuery,
  BreakingPointIdParam,
} from './schema';
import { authenticateUser } from '../../../middleware/auth';
import { injectTenantContext } from '../../../middleware/tenant';
import { validate } from '../../../utils/validation';

// Convert Zod schemas to JSON Schema once at module level

/**
 * Register breaking point routes
 */
export async function breakingPointRoutes(app: FastifyInstance): Promise<void> {
  const prisma = getPrismaClient();
  const breakingPointService = new BreakingPointService(prisma);

  const preHandlers = [authenticateUser, injectTenantContext];

  /**
   * Create a new breaking point
   */
  app.post<{ Body: CreateBreakingPointInput }>(
    '/',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Create a new breaking point for a player',
        tags: ['breaking-points'],
        security: [{ bearerAuth: [] }],
        response: {
          201: { type: 'object', additionalProperties: true },
          400: { $ref: 'Error#' },
        },
      },
    },
    async (request: FastifyRequest<{ Body: CreateBreakingPointInput }>, reply: FastifyReply) => {
      const input = validate(createBreakingPointSchema, request.body);
      const breakingPoint = await breakingPointService.createBreakingPoint(request.tenant!.id, input);
      return reply.code(201).send({ success: true, data: breakingPoint });
    }
  );

  /**
   * List breaking points with filters
   */
  app.get<{ Querystring: ListBreakingPointsQuery }>(
    '/',
    {
      preHandler: preHandlers,
      schema: {
        description: 'List breaking points with filters and pagination',
        tags: ['breaking-points'],
        security: [{ bearerAuth: [] }],
        response: {
          200: { type: 'object', additionalProperties: true },
        },
      },
    },
    async (request: FastifyRequest<{ Querystring: ListBreakingPointsQuery }>, reply: FastifyReply) => {
      const query = validate(listBreakingPointsQuerySchema, request.query);
      const result = await breakingPointService.listBreakingPoints(request.tenant!.id, query);
      return reply.send({ success: true, data: result });
    }
  );

  /**
   * Get breaking point by ID
   */
  app.get<{ Params: BreakingPointIdParam }>(
    '/:id',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Get breaking point by ID',
        tags: ['breaking-points'],
        security: [{ bearerAuth: [] }],
        response: {
          200: { type: 'object', additionalProperties: true },
          404: { $ref: 'Error#' },
        },
      },
    },
    async (request: FastifyRequest<{ Params: BreakingPointIdParam }>, reply: FastifyReply) => {
      const params = validate(breakingPointIdParamSchema, request.params);
      const breakingPoint = await breakingPointService.getBreakingPointById(
        request.tenant!.id,
        params.id
      );
      return reply.send({ success: true, data: breakingPoint });
    }
  );

  /**
   * Update breaking point
   */
  app.patch<{ Params: BreakingPointIdParam; Body: UpdateBreakingPointInput }>(
    '/:id',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Update breaking point',
        tags: ['breaking-points'],
        security: [{ bearerAuth: [] }],
        response: {
          200: { type: 'object', additionalProperties: true },
          400: { $ref: 'Error#' },
          404: { $ref: 'Error#' },
        },
      },
    },
    async (request: FastifyRequest<{ Params: BreakingPointIdParam; Body: UpdateBreakingPointInput }>, reply: FastifyReply) => {
      const params = validate(breakingPointIdParamSchema, request.params);
      const input = validate(updateBreakingPointSchema, request.body);
      const breakingPoint = await breakingPointService.updateBreakingPoint(
        request.tenant!.id,
        params.id,
        input
      );
      return reply.send({ success: true, data: breakingPoint });
    }
  );

  /**
   * Update progress (quick update)
   */
  app.post<{ Params: BreakingPointIdParam; Body: UpdateProgressInput }>(
    '/:id/progress',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Update breaking point progress (quick update)',
        tags: ['breaking-points'],
        security: [{ bearerAuth: [] }],
        response: {
          200: { type: 'object', additionalProperties: true },
          404: { $ref: 'Error#' },
        },
      },
    },
    async (request: FastifyRequest<{ Params: BreakingPointIdParam; Body: UpdateProgressInput }>, reply: FastifyReply) => {
      const params = validate(breakingPointIdParamSchema, request.params);
      const input = validate(updateProgressSchema, request.body);
      const breakingPoint = await breakingPointService.updateProgress(
        request.tenant!.id,
        params.id,
        input
      );
      return reply.send({ success: true, data: breakingPoint });
    }
  );

  /**
   * Delete breaking point
   */
  app.delete<{ Params: BreakingPointIdParam }>(
    '/:id',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Delete breaking point',
        tags: ['breaking-points'],
        security: [{ bearerAuth: [] }],
        response: {
          200: { type: 'object', additionalProperties: true },
          404: { $ref: 'Error#' },
        },
      },
    },
    async (request: FastifyRequest<{ Params: BreakingPointIdParam }>, reply: FastifyReply) => {
      const params = validate(breakingPointIdParamSchema, request.params);
      await breakingPointService.deleteBreakingPoint(request.tenant!.id, params.id);
      return reply.send({ success: true, message: 'Breaking point deleted successfully' });
    }
  );
}
