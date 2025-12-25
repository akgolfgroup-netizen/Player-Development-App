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
        description: `
Returns complete dashboard data for the authenticated player including:
- Player profile information
- Training period details
- Today's scheduled sessions
- Active goals and achievements
- Weekly training statistics
- Breaking points requiring attention
- Recent test results
- Upcoming tournaments and tests
- Unread messages

**Authentication:** Requires valid JWT token with 'player' role
**Response Time:** Optimized for <200ms with database indexes
**Caching:** Consider implementing client-side caching for 5-10 minutes
        `,
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date',
              pattern: '^\\d{4}-\\d{2}-\\d{2}$',
              description: 'Date in YYYY-MM-DD format (e.g., 2025-12-25). Defaults to current date.',
              example: '2025-12-25',
            },
          },
        },
        response: {
          200: {
            description: 'Dashboard data retrieved successfully',
            type: 'object',
            required: ['player', 'period', 'todaySessions', 'badges', 'goals', 'weeklyStats', 'messages', 'unreadCount'],
            properties: {
              player: {
                type: 'object',
                description: 'Player profile information',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' },
                  avatar: { type: 'string', nullable: true },
                  tier: { type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'elite'] },
                  hcp: { type: 'number', nullable: true },
                },
              },
              period: {
                type: 'object',
                description: 'Current training period information',
                properties: {
                  week: { type: 'number', description: 'ISO week number (1-53)' },
                  year: { type: 'number' },
                  month: { type: 'number', description: 'Month number (1-12)' },
                  monthName: { type: 'string', description: 'Localized month name' },
                },
              },
              todaySessions: {
                type: 'array',
                description: 'Training sessions scheduled for today',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    sessionType: { type: 'string', enum: ['training', 'test', 'tournament', 'recovery'] },
                    title: { type: 'string' },
                    scheduledTime: { type: 'string', format: 'date-time' },
                    duration: { type: 'number', description: 'Duration in minutes' },
                    status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'skipped'] },
                  },
                },
              },
              badges: {
                type: 'array',
                description: 'Recent achievements and badges',
                items: {
                  type: 'object',
                  properties: {
                    code: { type: 'string' },
                    name: { type: 'string' },
                    tier: { type: 'string', enum: ['bronze', 'silver', 'gold', 'platinum'] },
                    icon: { type: 'string' },
                    earnedAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
              goals: {
                type: 'array',
                description: 'Active training goals',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    title: { type: 'string' },
                    category: { type: 'string' },
                    progress: { type: 'number', minimum: 0, maximum: 100 },
                    status: { type: 'string', enum: ['active', 'completed', 'paused'] },
                    targetDate: { type: 'string', format: 'date' },
                  },
                },
              },
              weeklyStats: {
                type: 'object',
                description: 'Training statistics for current week',
                properties: {
                  sessionsCompleted: { type: 'number' },
                  totalMinutes: { type: 'number' },
                  peiGained: { type: 'number' },
                  streak: { type: 'number', description: 'Consecutive days trained' },
                },
              },
              messages: {
                type: 'array',
                description: 'Recent messages from coaches',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    from: { type: 'string' },
                    subject: { type: 'string' },
                    preview: { type: 'string' },
                    sentAt: { type: 'string', format: 'date-time' },
                    read: { type: 'boolean' },
                  },
                },
              },
              unreadCount: {
                type: 'number',
                description: 'Number of unread messages',
              },
              nextTournament: {
                type: 'object',
                nullable: true,
                description: 'Next scheduled tournament (null if none)',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' },
                  startDate: { type: 'string', format: 'date' },
                  location: { type: 'string' },
                  daysUntil: { type: 'number' },
                },
              },
              nextTest: {
                type: 'object',
                nullable: true,
                description: 'Next scheduled test (null if none)',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  testName: { type: 'string' },
                  scheduledDate: { type: 'string', format: 'date' },
                  category: { type: 'string' },
                  daysUntil: { type: 'number' },
                },
              },
              breakingPoints: {
                type: 'array',
                description: 'Top 3 breaking points requiring attention',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    category: { type: 'string' },
                    area: { type: 'string' },
                    severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                    status: { type: 'string', enum: ['identified', 'working', 'in_progress', 'resolved'] },
                    progress: { type: 'number', minimum: 0, maximum: 100 },
                  },
                },
              },
              recentTests: {
                type: 'array',
                description: 'Last 3 test results',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    testName: { type: 'string' },
                    testDate: { type: 'string', format: 'date' },
                    pei: { type: 'number' },
                    value: { type: 'number' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad request - Invalid date format',
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Invalid date format. Use YYYY-MM-DD' },
            },
          },
          401: {
            description: 'Unauthorized - Missing or invalid JWT token',
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Authentication required' },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions',
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Dashboard only available for players' },
            },
          },
          404: {
            description: 'Not found - Player not found',
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Player not found' },
            },
          },
          500: {
            description: 'Internal server error',
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Failed to retrieve dashboard data' },
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
        description: `
Returns complete dashboard data for a specific player. This endpoint is designed for
coaches and administrators to monitor their athletes' progress and training data.

**Use Cases:**
- Coach reviewing athlete's dashboard before a session
- Admin monitoring player performance metrics
- Multi-player dashboard comparisons

**Authentication:** Requires valid JWT token with 'coach' or 'admin' role
**Authorization:** User must have access to the specified player within their tenant
        `,
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['playerId'],
          properties: {
            playerId: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier of the player',
              example: '00000000-0000-0000-0000-000000000004',
            },
          },
        },
        querystring: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date',
              pattern: '^\\d{4}-\\d{2}-\\d{2}$',
              description: 'Date in YYYY-MM-DD format. Defaults to current date.',
              example: '2025-12-25',
            },
          },
        },
        response: {
          200: {
            description: 'Dashboard data retrieved successfully (same structure as GET /dashboard)',
            type: 'object',
            additionalProperties: true,
          },
          401: {
            description: 'Unauthorized - Missing or invalid JWT token',
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Authentication required' },
            },
          },
          403: {
            description: 'Forbidden - Insufficient permissions (not coach or admin)',
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Insufficient permissions' },
            },
          },
          404: {
            description: 'Not found - Player not found in tenant',
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Player not found' },
            },
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
        description: `
Retrieves aggregated training statistics for a specific week. Defaults to current week.

**Use Cases:**
- Weekly progress tracking
- Historical performance analysis
- Training volume monitoring

**Authentication:** Requires valid JWT token with 'player' role
        `,
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            week: {
              type: 'number',
              minimum: 1,
              maximum: 53,
              description: 'ISO week number (1-53). Defaults to current week.',
              example: 52,
            },
            year: {
              type: 'number',
              minimum: 2000,
              maximum: 2100,
              description: 'Year (YYYY). Defaults to current year.',
              example: 2025,
            },
          },
        },
        response: {
          200: {
            description: 'Weekly statistics retrieved successfully',
            type: 'object',
            properties: {
              week: { type: 'number', description: 'ISO week number' },
              year: { type: 'number' },
              sessionsCompleted: { type: 'number', description: 'Number of sessions completed this week' },
              totalMinutes: { type: 'number', description: 'Total training time in minutes' },
              peiGained: { type: 'number', description: 'Total PEI (Player Engagement Index) gained' },
              streak: { type: 'number', description: 'Current consecutive training days' },
              byCategory: {
                type: 'object',
                description: 'Breakdown by training category',
                additionalProperties: {
                  type: 'object',
                  properties: {
                    sessions: { type: 'number' },
                    minutes: { type: 'number' },
                  },
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Not a player',
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Stats only available for players' },
            },
          },
          404: {
            description: 'Not found - No stats for this week or player not found',
            type: 'object',
            properties: {
              message: { type: 'string', example: 'No stats for this week' },
            },
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
        description: `
Retrieves all earned achievements and badges for the authenticated player.
Returns badges sorted by earned date (most recent first).

**Use Cases:**
- Achievement gallery display
- Player profile badge showcase
- Gamification progress tracking

**Authentication:** Requires valid JWT token with 'player' role
        `,
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'Badges retrieved successfully',
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'code', 'name', 'tier', 'earnedAt'],
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Unique badge assignment ID',
                },
                code: {
                  type: 'string',
                  description: 'Badge code identifier (e.g., "putting_master_silver")',
                  example: 'putting_master_silver',
                },
                name: {
                  type: 'string',
                  description: 'Display name of the badge',
                  example: 'Putting Master - Silver',
                },
                description: {
                  type: 'string',
                  nullable: true,
                  description: 'Badge description and unlock criteria',
                  example: 'Complete 50 putting sessions with 80%+ accuracy',
                },
                icon: {
                  type: 'string',
                  nullable: true,
                  description: 'Icon identifier or emoji',
                  example: '🏅',
                },
                tier: {
                  type: 'string',
                  enum: ['bronze', 'silver', 'gold', 'platinum'],
                  description: 'Badge tier/level',
                },
                category: {
                  type: 'string',
                  nullable: true,
                  description: 'Badge category (e.g., "putting", "driving", "short_game")',
                  example: 'putting',
                },
                earnedAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Timestamp when badge was earned',
                  example: '2025-12-15T10:30:00Z',
                },
                context: {
                  type: 'object',
                  nullable: true,
                  description: 'Additional context about how/when the badge was earned',
                  additionalProperties: true,
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Not a player',
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Badges only available for players' },
            },
          },
          404: {
            description: 'Not found - Player not found',
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Player not found' },
            },
          },
        },
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
        description: `
Retrieves training goals for the authenticated player. Goals can be filtered by status.
Returns goals sorted by target date (nearest first).

**Use Cases:**
- Goal tracker widget
- Progress monitoring
- Historical goal analysis
- Coaching review

**Authentication:** Requires valid JWT token with 'player' role
        `,
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['active', 'completed', 'paused', 'cancelled'],
              description: 'Filter goals by status. Omit to retrieve all goals.',
              example: 'active',
            },
          },
        },
        response: {
          200: {
            description: 'Goals retrieved successfully',
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'title', 'status', 'createdAt'],
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'Unique goal ID',
                },
                title: {
                  type: 'string',
                  description: 'Goal title/description',
                  example: 'Reduce handicap to 10',
                },
                category: {
                  type: 'string',
                  nullable: true,
                  description: 'Goal category (e.g., "handicap", "putting", "driving")',
                  example: 'handicap',
                },
                targetValue: {
                  type: 'number',
                  nullable: true,
                  description: 'Numeric target value (if applicable)',
                  example: 10,
                },
                currentValue: {
                  type: 'number',
                  nullable: true,
                  description: 'Current value/progress',
                  example: 12.5,
                },
                unit: {
                  type: 'string',
                  nullable: true,
                  description: 'Unit of measurement (e.g., "hcp", "meters", "percent")',
                  example: 'hcp',
                },
                progress: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100,
                  nullable: true,
                  description: 'Progress percentage (0-100)',
                  example: 62.5,
                },
                status: {
                  type: 'string',
                  enum: ['active', 'completed', 'paused', 'cancelled'],
                  description: 'Current goal status',
                },
                priority: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                  nullable: true,
                  description: 'Goal priority level',
                },
                targetDate: {
                  type: 'string',
                  format: 'date',
                  nullable: true,
                  description: 'Target completion date',
                  example: '2026-06-01',
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Goal creation timestamp',
                },
                completedAt: {
                  type: 'string',
                  format: 'date-time',
                  nullable: true,
                  description: 'Completion timestamp (if completed)',
                },
              },
            },
          },
          403: {
            description: 'Forbidden - Not a player',
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Goals only available for players' },
            },
          },
          404: {
            description: 'Not found - Player not found',
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Player not found' },
            },
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
