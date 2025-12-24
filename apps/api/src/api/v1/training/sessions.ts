import { FastifyPluginAsync } from 'fastify';

const sessionsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/', {
    onRequest: [fastify.authenticate, async (req, reply) => {
      // Apply idempotency middleware
      const key = req.headers['idempotency-key'] as string;
      if (key) {
        const cached = (fastify as any).idempotencyCache?.get(`${req.user!.id}:${key}`);
        if (cached) return reply.send(cached);
      }
    }],
    schema: {
      body: {
        type: 'object',
        required: ['type', 'duration', 'date'],
        properties: {
          type: { type: 'string', enum: ['gym', 'golf', 'cardio', 'flexibility', 'other'] },
          duration: { type: 'number', minimum: 1 },
          intensity: { type: 'string', enum: ['low', 'medium', 'high'] },
          date: { type: 'string' },
          notes: { type: 'string' },
        },
      },
    },
    handler: async (req, _reply) => {
      const session = req.body as any;

      // Store session (mock)
      const sessionId = `session_${Date.now()}`;
      const result = {
        id: sessionId,
        playerId: req.user!.id,
        ...session,
        createdAt: new Date().toISOString(),
      };

      // Cache for idempotency
      const key = req.headers['idempotency-key'] as string;
      if (key) {
        (fastify as any).idempotencyCache = (fastify as any).idempotencyCache || new Map();
        (fastify as any).idempotencyCache.set(`${req.user!.id}:${key}`, result);
      }

      return result;
    },
  });
};

export default sessionsRoutes;
