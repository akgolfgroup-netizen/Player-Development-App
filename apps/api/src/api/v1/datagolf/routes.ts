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

const approachSkillQuerySchema = z.object({
  tour: z.string().optional(),
  season: z.coerce.number().int().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  sortBy: z.enum(['skill50to75', 'skill75to100', 'skill100to125', 'skill125to150', 'skill150to175', 'skill175to200', 'skill200plus', 'playerName']).default('skill100to125'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const approachSkillPlayerQuerySchema = z.object({
  tour: z.string().optional(),
  season: z.coerce.number().int().optional(),
});

const approachSkillTopQuerySchema = z.object({
  distance: z.enum(['50-75', '75-100', '100-125', '125-150', '150-175', '175-200', '200+']),
  tour: z.string().optional(),
  season: z.coerce.number().int().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

type PlayerIdParam = z.infer<typeof playerIdParamSchema>;
type CompareToTourQuery = z.infer<typeof compareToTourQuerySchema>;
type TourAveragesQuery = z.infer<typeof tourAveragesQuerySchema>;
type ApproachSkillQuery = z.infer<typeof approachSkillQuerySchema>;
type ApproachSkillPlayerQuery = z.infer<typeof approachSkillPlayerQuerySchema>;
type ApproachSkillTopQuery = z.infer<typeof approachSkillTopQuerySchema>;

const coachDashboardQuerySchema = z.object({
  tour: z.string().default('pga'),
  season: z.coerce.number().int().optional(),
});

const proPlayersQuerySchema = z.object({
  tour: z.string().default('pga'),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

type CoachDashboardQuery = z.infer<typeof coachDashboardQuerySchema>;
type ProPlayersQuery = z.infer<typeof proPlayersQuerySchema>;

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

  // ============================================================================
  // APPROACH SKILL ENDPOINTS
  // ============================================================================

  /**
   * GET /api/v1/datagolf/approach-skill
   * Get approach skill data with optional filters
   */
  app.get<{ Querystring: ApproachSkillQuery }>(
    '/approach-skill',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Get approach skill data for pro players by distance buckets',
        tags: ['datagolf'],
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            tour: { type: 'string', description: 'Filter by tour (pga, euro, kft)' },
            season: { type: 'number', description: 'Filter by season year' },
            limit: { type: 'number', default: 50, description: 'Number of results (max 100)' },
            offset: { type: 'number', default: 0, description: 'Offset for pagination' },
            sortBy: { type: 'string', default: 'skill100to125', description: 'Sort by distance bucket' },
            sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: { type: 'array' },
              total: { type: 'number' },
              pagination: { type: 'object' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Querystring: ApproachSkillQuery }>, reply: FastifyReply) => {
      const query = validate(approachSkillQuerySchema, request.query);
      const result = await service.getApproachSkillData(query);
      return reply.send({ success: true, ...result });
    }
  );

  /**
   * GET /api/v1/datagolf/approach-skill/averages
   * Get tour averages for approach skill by distance
   */
  app.get<{ Querystring: ApproachSkillPlayerQuery }>(
    '/approach-skill/averages',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Get tour averages for approach skill by distance bucket',
        tags: ['datagolf'],
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            tour: { type: 'string', description: 'Filter by tour (pga, euro, kft)' },
            season: { type: 'number', description: 'Filter by season year' },
          },
        },
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
    async (request: FastifyRequest<{ Querystring: ApproachSkillPlayerQuery }>, reply: FastifyReply) => {
      const query = validate(approachSkillPlayerQuerySchema, request.query);
      const averages = await service.getApproachSkillAverages(query.tour, query.season);
      return reply.send({ success: true, data: averages });
    }
  );

  /**
   * GET /api/v1/datagolf/approach-skill/top
   * Get top players for a specific distance bucket
   */
  app.get<{ Querystring: ApproachSkillTopQuery }>(
    '/approach-skill/top',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Get top players for a specific approach distance',
        tags: ['datagolf'],
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          required: ['distance'],
          properties: {
            distance: { type: 'string', enum: ['50-75', '75-100', '100-125', '125-150', '150-175', '175-200', '200+'], description: 'Distance bucket in yards' },
            tour: { type: 'string', description: 'Filter by tour (pga, euro, kft)' },
            season: { type: 'number', description: 'Filter by season year' },
            limit: { type: 'number', default: 20, description: 'Number of results (max 100)' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: { type: 'array' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Querystring: ApproachSkillTopQuery }>, reply: FastifyReply) => {
      const query = validate(approachSkillTopQuerySchema, request.query);
      const topPlayers = await service.getTopApproachSkillByDistance(query.distance, {
        tour: query.tour,
        season: query.season,
        limit: query.limit,
      });
      return reply.send({ success: true, data: topPlayers });
    }
  );

  /**
   * GET /api/v1/datagolf/approach-skill/player/:playerName
   * Get approach skill for a specific player by name
   */
  app.get<{ Params: { playerName: string }; Querystring: ApproachSkillPlayerQuery }>(
    '/approach-skill/player/:playerName',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Get approach skill data for a specific player by name',
        tags: ['datagolf'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['playerName'],
          properties: {
            playerName: { type: 'string', description: 'Player name (partial match supported)' },
          },
        },
        querystring: {
          type: 'object',
          properties: {
            tour: { type: 'string', description: 'Filter by tour (pga, euro, kft)' },
            season: { type: 'number', description: 'Filter by season year' },
          },
        },
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
    async (request: FastifyRequest<{ Params: { playerName: string }; Querystring: ApproachSkillPlayerQuery }>, reply: FastifyReply) => {
      const { playerName } = request.params;
      const query = validate(approachSkillPlayerQuerySchema, request.query);
      const player = await service.getApproachSkillByPlayer(playerName, query.tour, query.season);
      return reply.send({ success: true, data: player });
    }
  );

  // ============================================================================
  // COACH DASHBOARD ENDPOINTS
  // ============================================================================

  /**
   * GET /api/v1/datagolf/coach/dashboard
   * Get all coach players with their DataGolf stats for the dashboard
   */
  app.get<{ Querystring: CoachDashboardQuery }>(
    '/coach/dashboard',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Get coach players with DataGolf stats for dashboard',
        tags: ['datagolf'],
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            tour: { type: 'string', default: 'pga', description: 'Tour to compare against' },
            season: { type: 'number', description: 'Season year' },
          },
        },
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
    async (request: FastifyRequest<{ Querystring: CoachDashboardQuery }>, reply: FastifyReply) => {
      const query = validate(coachDashboardQuerySchema, request.query);
      const season = query.season || new Date().getFullYear();

      // Get coach ID from authenticated user
      let coachId = request.user?.id;

      // If user is a coach, look up their coach record
      if (request.user?.role === 'coach') {
        const coach = await prisma.coach.findFirst({
          where: { userId: request.user.id },
          select: { id: true },
        });
        if (coach) {
          coachId = coach.id;
        }
      }

      if (!coachId) {
        return reply.status(403).send({ success: false, error: 'Coach access required' });
      }

      const dashboard = await service.getCoachPlayersDashboard(
        request.tenant!.id,
        coachId,
        query.tour,
        season
      );
      return reply.send({ success: true, data: dashboard });
    }
  );

  /**
   * GET /api/v1/datagolf/pro-players
   * Get top pro players for comparison
   */
  app.get<{ Querystring: ProPlayersQuery }>(
    '/pro-players',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Get top pro players from DataGolf for comparison',
        tags: ['datagolf'],
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            tour: { type: 'string', default: 'pga', description: 'Tour (pga, euro, kft)' },
            limit: { type: 'number', default: 50, description: 'Number of players (max 100)' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: { type: 'array' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Querystring: ProPlayersQuery }>, reply: FastifyReply) => {
      const query = validate(proPlayersQuerySchema, request.query);
      const proPlayers = await service.getProPlayers({
        tour: query.tour,
        limit: query.limit,
      });
      return reply.send({ success: true, data: proPlayers });
    }
  );
}
