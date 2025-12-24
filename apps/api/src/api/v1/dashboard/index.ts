/**
 * ================================================================
 * Dashboard API Routes - AK Golf Academy
 * ================================================================
 */

import { FastifyPluginAsync } from 'fastify';
import { DashboardService } from './service';
import { DashboardQuerySchema } from './schema';
import { z } from 'zod';
import { authenticateUser } from '../../../middleware/auth';
import { injectTenantContext } from '../../../middleware/tenant';
import { getPrismaClient } from '../../../core/db/prisma';

const dashboardRoutes: FastifyPluginAsync = async (fastify) => {
  const prisma = getPrismaClient();
  const dashboardService = new DashboardService(prisma);
  const preHandlers = [authenticateUser, injectTenantContext];

  /**
   * GET /dashboard
   * Get dashboard data for the authenticated player
   */
  fastify.get<{
    Querystring: z.infer<typeof DashboardQuerySchema>;
  }>(
    '/',
    {
      schema: {
        tags: ['Dashboard'],
        summary: 'Get player dashboard',
        description: 'Returns complete dashboard data for the authenticated player',
        querystring: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              description: 'Date in YYYY-MM-DD format, defaults to today',
            },
          },
        },
        response: {
          200: {
            type: 'object',
            additionalProperties: true,
            properties: {
              player: { type: 'object', additionalProperties: true },
              period: { type: 'object', additionalProperties: true },
              todaySessions: { type: 'array' },
              badges: { type: 'array' },
              goals: { type: 'array' },
              weeklyStats: { type: 'object', additionalProperties: true },
              messages: { type: 'array' },
              unreadCount: { type: 'number' },
              nextTournament: { type: 'object', nullable: true },
              nextTest: { type: 'object', nullable: true },
              breakingPoints: { type: 'array' },
              recentTests: { type: 'array' },
            },
          },
        },
      },
      preHandler: preHandlers,
    },
    async (request, reply) => {
      const { tenantId, userId: _userId, role } = request.user!;

      // Get player ID from user context
      // For players, userId corresponds to their player record
      // For coaches viewing a player's dashboard, playerId would be in query
      let playerId: string;

      if (role === 'player') {
        // Find player by user email
        const player = await prisma.player.findFirst({
          where: {
            tenantId,
            email: request.user!.email,
          },
        });

        if (!player) {
          return reply.status(404).send({ error: 'Player not found' });
        }
        playerId = player.id;
      } else {
        return reply.status(403).send({ error: 'Dashboard only available for players' });
      }

      const date = request.query.date ? new Date(request.query.date) : new Date();

      const dashboard = await dashboardService.getDashboard(tenantId, playerId, date);

      return dashboard;
    }
  );

  /**
   * GET /dashboard/:playerId
   * Get dashboard data for a specific player (coach/admin access)
   */
  fastify.get<{
    Params: { playerId: string };
    Querystring: z.infer<typeof DashboardQuerySchema>;
  }>(
    '/:playerId',
    {
      schema: {
        tags: ['Dashboard'],
        summary: 'Get player dashboard (coach view)',
        description: 'Returns dashboard data for a specific player (requires coach or admin role)',
        params: {
          type: 'object',
          properties: {
            playerId: { type: 'string', format: 'uuid' },
          },
          required: ['playerId'],
        },
        querystring: {
          type: 'object',
          properties: {
            date: { type: 'string' },
          },
        },
      },
      preHandler: preHandlers,
    },
    async (request, reply) => {
      const { tenantId, role } = request.user!;
      const { playerId } = request.params;

      // Only coaches and admins can view other players' dashboards
      if (role !== 'coach' && role !== 'admin') {
        return reply.status(403).send({ error: 'Insufficient permissions' });
      }

      const date = request.query.date ? new Date(request.query.date) : new Date();

      const dashboard = await dashboardService.getDashboard(tenantId, playerId, date);

      return dashboard;
    }
  );

  /**
   * GET /dashboard/weekly-stats
   * Get weekly stats for authenticated player
   */
  fastify.get<{
    Querystring: { week?: number; year?: number };
  }>(
    '/weekly-stats',
    {
      schema: {
        tags: ['Dashboard'],
        summary: 'Get weekly training stats',
        querystring: {
          type: 'object',
          properties: {
            week: { type: 'number' },
            year: { type: 'number' },
          },
        },
      },
      preHandler: preHandlers,
    },
    async (request, reply) => {
      const { tenantId, role } = request.user!;

      if (role !== 'player') {
        return reply.status(403).send({ error: 'Stats only available for players' });
      }

      const player = await prisma.player.findFirst({
        where: { tenantId, email: request.user!.email },
      });

      if (!player) {
        return reply.status(404).send({ error: 'Player not found' });
      }

      const now = new Date();
      const year = request.query.year || now.getFullYear();
      const week = request.query.week || getWeekNumber(now);

      const stats = await prisma.weeklyTrainingStats.findFirst({
        where: {
          playerId: player.id,
          year,
          weekNumber: week,
        },
      });

      return stats || { message: 'No stats for this week' };
    }
  );

  /**
   * GET /dashboard/badges
   * Get all badges for authenticated player
   */
  fastify.get(
    '/badges',
    {
      schema: {
        tags: ['Dashboard'],
        summary: 'Get all player badges',
      },
      preHandler: preHandlers,
    },
    async (request, reply) => {
      const { tenantId, role } = request.user!;

      if (role !== 'player') {
        return reply.status(403).send({ error: 'Badges only available for players' });
      }

      const player = await prisma.player.findFirst({
        where: { tenantId, email: request.user!.email },
      });

      if (!player) {
        return reply.status(404).send({ error: 'Player not found' });
      }

      const achievements = await prisma.playerAchievement.findMany({
        where: { playerId: player.id },
        include: { achievement: true },
        orderBy: { earnedAt: 'desc' },
      });

      return achievements.map(a => ({
        id: a.id,
        code: a.achievement.code,
        name: a.achievement.name,
        description: a.achievement.description,
        icon: a.achievement.icon,
        tier: a.achievement.tier,
        category: a.achievement.category,
        earnedAt: a.earnedAt.toISOString(),
        context: a.context,
      }));
    }
  );

  /**
   * GET /dashboard/goals
   * Get all goals for authenticated player
   */
  fastify.get<{
    Querystring: { status?: string };
  }>(
    '/goals',
    {
      schema: {
        tags: ['Dashboard'],
        summary: 'Get player goals',
        querystring: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['active', 'completed', 'paused', 'cancelled'] },
          },
        },
      },
      preHandler: preHandlers,
    },
    async (request, reply) => {
      const { tenantId, role } = request.user!;

      if (role !== 'player') {
        return reply.status(403).send({ error: 'Goals only available for players' });
      }

      const player = await prisma.player.findFirst({
        where: { tenantId, email: request.user!.email },
      });

      if (!player) {
        return reply.status(404).send({ error: 'Player not found' });
      }

      const goals = await prisma.playerGoal.findMany({
        where: {
          playerId: player.id,
          ...(request.query.status && { status: request.query.status }),
        },
        orderBy: { targetDate: 'asc' },
      });

      return goals;
    }
  );
};

// Helper function
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export default dashboardRoutes;
