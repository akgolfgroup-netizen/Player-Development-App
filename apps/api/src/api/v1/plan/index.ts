import { FastifyPluginAsync } from 'fastify';

const planRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/current', {
    onRequest: [fastify.authenticate],
    handler: async (req, _reply) => {
      // Mock current plan (in real app, fetch from database)
      return {
        id: 'plan_123',
        playerId: req.user!.id,
        name: 'Vinter Treningsplan 2025',
        startDate: '2025-01-01',
        endDate: '2025-03-31',
        currentWeek: 3,
        totalWeeks: 12,
        focus: 'Styrke og kondisjon',
        weekOverview: {
          completed: 2,
          planned: 5,
          upcoming: 5,
        },
      };
    },
  });

  fastify.get('/month', {
    onRequest: [fastify.authenticate],
    schema: {
      querystring: {
        type: 'object',
        required: ['month'],
        properties: {
          month: { type: 'string', pattern: '^\\d{4}-\\d{2}$' },
        },
      },
    },
    handler: async (req, _reply) => {
      const { month } = req.query as { month: string };

      // Mock monthly plan
      return {
        month,
        weeks: [
          { weekNumber: 1, focus: 'Base building', sessions: 4, completed: 4 },
          { weekNumber: 2, focus: 'Strength', sessions: 5, completed: 3 },
          { weekNumber: 3, focus: 'Power', sessions: 5, completed: 0 },
          { weekNumber: 4, focus: 'Recovery', sessions: 3, completed: 0 },
        ],
      };
    },
  });
};

export default planRoutes;
