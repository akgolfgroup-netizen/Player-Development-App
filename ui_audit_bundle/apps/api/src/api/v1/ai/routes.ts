/**
 * AI Coaching API Routes
 *
 * Endpoints for AI-powered golf coaching:
 * - Chat with AI coach
 * - Get training recommendations
 * - Breaking point analysis
 */

import { FastifyPluginAsync } from 'fastify';
import { aiCoach, ChatMessage } from '../../../services/ai';

// Request/Response types
interface ChatRequest {
  message: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

interface ChatResponse {
  success: boolean;
  data: {
    response: string;
    tokens: {
      input: number;
      output: number;
    };
  };
}

interface RecommendationsResponse {
  success: boolean;
  data: {
    recommendations: string;
  };
}

interface BreakingPointAnalysisRequest {
  area: string;
  description?: string;
}

interface BreakingPointAnalysisResponse {
  success: boolean;
  data: {
    analysis: string;
  };
}

interface StatusResponse {
  success: boolean;
  data: {
    available: boolean;
    model: string;
  };
}

const aiRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * GET /api/v1/ai/status
   * Get AI coach availability status
   */
  fastify.get<{ Reply: StatusResponse }>(
    '/status',
    {
      schema: {
        description: 'Get AI coach status',
        tags: ['AI'],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  available: { type: 'boolean' },
                  model: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async () => {
      const status = aiCoach.getStatus();
      return {
        success: true,
        data: status,
      };
    }
  );

  /**
   * POST /api/v1/ai/chat
   * Chat with AI coach
   */
  fastify.post<{
    Body: ChatRequest;
    Reply: ChatResponse;
  }>(
    '/chat',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Chat with AI golf coach',
        tags: ['AI'],
        body: {
          type: 'object',
          required: ['message'],
          properties: {
            message: {
              type: 'string',
              minLength: 1,
              maxLength: 2000,
            },
            conversationHistory: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  role: { type: 'string', enum: ['user', 'assistant'] },
                  content: { type: 'string' },
                },
              },
              maxItems: 20,
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
                  response: { type: 'string' },
                  tokens: {
                    type: 'object',
                    properties: {
                      input: { type: 'number' },
                      output: { type: 'number' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { message, conversationHistory = [] } = request.body;
      const playerId = request.user?.playerId;

      if (!playerId) {
        return reply.code(401).send({
          success: false,
          error: 'Player ID required',
        } as unknown as ChatResponse);
      }

      const result = await aiCoach.chat(
        playerId,
        message,
        conversationHistory as ChatMessage[]
      );

      return {
        success: true,
        data: result,
      };
    }
  );

  /**
   * GET /api/v1/ai/recommendations
   * Get AI training recommendations
   */
  fastify.get<{ Reply: RecommendationsResponse }>(
    '/recommendations',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Get AI training recommendations',
        tags: ['AI'],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  recommendations: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const playerId = request.user?.playerId;

      if (!playerId) {
        return reply.code(401).send({
          success: false,
          error: 'Player ID required',
        } as unknown as RecommendationsResponse);
      }

      const recommendations = await aiCoach.getTrainingRecommendations(playerId);

      return {
        success: true,
        data: { recommendations },
      };
    }
  );

  /**
   * POST /api/v1/ai/analyze-breaking-point
   * Analyze a breaking point and get suggestions
   */
  fastify.post<{
    Body: BreakingPointAnalysisRequest;
    Reply: BreakingPointAnalysisResponse;
  }>(
    '/analyze-breaking-point',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Analyze breaking point with AI',
        tags: ['AI'],
        body: {
          type: 'object',
          required: ['area'],
          properties: {
            area: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
            },
            description: {
              type: 'string',
              maxLength: 500,
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
                  analysis: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { area, description } = request.body;
      const playerId = request.user?.playerId;

      if (!playerId) {
        return reply.code(401).send({
          success: false,
          error: 'Player ID required',
        } as unknown as BreakingPointAnalysisResponse);
      }

      const analysis = await aiCoach.analyzeBreakingPoint(
        playerId,
        area,
        description
      );

      return {
        success: true,
        data: { analysis },
      };
    }
  );
};

export default aiRoutes;
