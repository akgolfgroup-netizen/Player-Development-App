import { FastifyPluginAsync } from 'fastify';
import { authenticationError } from '../../../core/errors';
import prisma from '../../../core/db/prisma';

const meRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', {
    onRequest: [fastify.authenticate],
    handler: async (req, _reply) => {
      if (!req.user) {
        throw authenticationError();
      }

      // Get user details including name based on role
      let firstName = '';
      let lastName = '';

      if (req.user.role === 'player' && req.user.playerId) {
        const player = await prisma.player.findUnique({
          where: { id: req.user.playerId },
          select: { firstName: true, lastName: true },
        });
        firstName = player?.firstName || '';
        lastName = player?.lastName || '';
      } else if (req.user.role === 'coach') {
        const coach = await prisma.coach.findFirst({
          where: { userId: req.user.id },
          select: { firstName: true, lastName: true },
        });
        firstName = coach?.firstName || '';
        lastName = coach?.lastName || '';
      } else {
        const user = await prisma.user.findUnique({
          where: { id: req.user.id },
          select: { firstName: true, lastName: true },
        });
        firstName = user?.firstName || '';
        lastName = user?.lastName || '';
      }

      return {
        id: req.user.id,
        email: req.user.email,
        firstName,
        lastName,
        role: req.user.role,
      };
    },
  });
};

export default meRoutes;
