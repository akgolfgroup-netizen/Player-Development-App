/**
 * DataGolf Integration API Routes
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { DataGolfService } from './service';
import { getPrismaClient } from '../../../core/db/prisma';
import { authenticateUser } from '../../../middleware/auth';
import { injectTenantContext } from '../../../middleware/tenant';
import { validate } from '../../../utils/validation';

// ============================================================================
// SCHEMAS
// ============================================================================

const playerIdParamSchema = z.object({
  playerId: z.string().uuid(),
});

const compareToTourQuerySchema = z.object({
  playerId: z.string().uuid(),
  tour: z.string().default('PGA'),
  season: z.coerce.number().int().optional(),
});

const tourAveragesQuerySchema = z.object({
  tour: z.string().default('PGA'),
  season: z.coerce.number().int().optional(),
});

type PlayerIdParam = z.infer<typeof playerIdParamSchema>;
type CompareToTourQuery = z.infer<typeof compareToTourQuerySchema>;
type TourAveragesQuery = z.infer<typeof tourAveragesQuerySchema>;

// ============================================================================
// ROUTES
// ============================================================================

export async function dataGolfRoutes(app: FastifyInstance): Promise<void> {
  const prisma = getPrismaClient();
  const service = new DataGolfService(prisma);

  const preHandlers = [authenticateUser, injectTenantContext];

  /**
   * GET /api/v1/datagolf/players/:playerId
   * Get DataGolf data for a player
   */
  app.get<{ Params: PlayerIdParam }>(
    '/players/:playerId',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Get DataGolf player data',
        tags: ['datagolf'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: { type: 'object', nullable: true },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: PlayerIdParam }>, reply: FastifyReply) => {
      const params = validate(playerIdParamSchema, request.params);
      const playerData = await service.getDataGolfPlayer(
        request.tenant!.id,
        params.playerId
      );
      return reply.send({ success: true, data: playerData });
    }
  );

  /**
   * GET /api/v1/datagolf/tour-averages
   * Get tour averages for a specific tour and season
   */
  app.get<{ Querystring: TourAveragesQuery }>(
    '/tour-averages',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Get tour averages for a specific tour and season',
        tags: ['datagolf'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: { type: 'object', nullable: true },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Querystring: TourAveragesQuery }>,
      reply: FastifyReply
    ) => {
      const query = validate(tourAveragesQuerySchema, request.query);
      const season = query.season || new Date().getFullYear();
      const tourAverages = await service.getTourAverages(query.tour, season);
      return reply.send({ success: true, data: tourAverages });
    }
  );

  /**
   * GET /api/v1/datagolf/compare
   * Compare IUP player performance to tour averages
   */
  app.get<{ Querystring: CompareToTourQuery }>(
    '/compare',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Compare IUP player performance to DataGolf tour averages',
        tags: ['datagolf'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: { type: 'object' },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Querystring: CompareToTourQuery }>,
      reply: FastifyReply
    ) => {
      const query = validate(compareToTourQuerySchema, request.query);
      const season = query.season || new Date().getFullYear();
      const comparison = await service.compareToTour(
        request.tenant!.id,
        query.playerId,
        query.tour,
        season
      );
      return reply.send({ success: true, data: comparison });
    }
  );

  /**
   * POST /api/v1/datagolf/sync
   * Trigger DataGolf data sync
   */
  app.post(
    '/sync',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Trigger DataGolf data synchronization',
        tags: ['datagolf'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: { type: 'object' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const syncStatus = await service.syncDataGolf(request.tenant!.id);
      return reply.send({ success: true, data: syncStatus });
    }
  );

  /**
   * GET /api/v1/datagolf/sync-status
   * Get DataGolf sync status
   */
  app.get(
    '/sync-status',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Get DataGolf synchronization status',
        tags: ['datagolf'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: { type: 'object' },
            },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const syncStatus = await service.getSyncStatus();
      return reply.send({ success: true, data: syncStatus });
    }
  );
}
