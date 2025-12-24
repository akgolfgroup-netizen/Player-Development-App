import { FastifyInstance } from 'fastify';
import { GoalsService } from './service';
import {
  createGoalSchema,
  updateGoalSchema,
  getGoalSchema,
  listGoalsSchema,
  deleteGoalSchema,
  updateProgressSchema
} from './schema';
import { authenticateUser } from '../../../middleware/auth';

const goalsService = new GoalsService();

export default async function goalsRoutes(fastify: FastifyInstance) {
  // Apply authentication to all routes in this plugin
  fastify.addHook('preHandler', authenticateUser);

  // List goals (with optional filtering)
  fastify.get(
    '/',
    { schema: listGoalsSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const { status, goalType } = request.query as { status?: string; goalType?: string };

      let goals;
      if (goalType) {
        goals = await goalsService.getGoalsByType(userId, goalType);
      } else {
        goals = await goalsService.listGoals(userId, status);
      }

      return reply.code(200).send(goals);
    }
  );

  // Get active goals
  fastify.get(
    '/active',
    async (request, reply) => {
      const userId = request.user!.id;
      const goals = await goalsService.getActiveGoals(userId);
      return reply.code(200).send(goals);
    }
  );

  // Get completed goals
  fastify.get(
    '/completed',
    async (request, reply) => {
      const userId = request.user!.id;
      const goals = await goalsService.getCompletedGoals(userId);
      return reply.code(200).send(goals);
    }
  );

  // Get single goal
  fastify.get(
    '/:id',
    { schema: getGoalSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const { id } = request.params as { id: string };

      const goal = await goalsService.getGoalById(id, userId);
      return reply.code(200).send(goal);
    }
  );

  // Create goal
  fastify.post(
    '/',
    { schema: createGoalSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const input = request.body as Parameters<typeof goalsService.createGoal>[1];
      const goal = await goalsService.createGoal(userId, input);
      return reply.code(201).send(goal);
    }
  );

  // Update goal
  fastify.put(
    '/:id',
    { schema: updateGoalSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const { id } = request.params as { id: string };
      const input = request.body as Parameters<typeof goalsService.updateGoal>[2];

      const goal = await goalsService.updateGoal(id, userId, input);
      return reply.code(200).send(goal);
    }
  );

  // Update goal progress (shortcut endpoint)
  fastify.patch(
    '/:id/progress',
    { schema: updateProgressSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const { id } = request.params as { id: string };
      const { currentValue } = request.body as { currentValue: number };

      const goal = await goalsService.updateProgress(id, userId, currentValue);
      return reply.code(200).send(goal);
    }
  );

  // Delete goal
  fastify.delete(
    '/:id',
    { schema: deleteGoalSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const { id } = request.params as { id: string };

      const result = await goalsService.deleteGoal(id, userId);
      return reply.code(200).send(result);
    }
  );
}
