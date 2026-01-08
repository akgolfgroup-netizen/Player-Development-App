/**
 * TrackMan / Launch Monitor API
 *
 * Track shots, analyze club gapping, import TrackMan data
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getPrismaClient } from '../../../core/db/prisma';
import { authenticateUser } from '../../../middleware/auth';
import { z } from 'zod';

const createSessionSchema = z.object({
  playerId: z.string().uuid(),
  deviceType: z.enum(['TrackMan', 'Foresight', 'GCQuad', 'FlightScope', 'Other']),
  location: z.string().optional(),
  notes: z.string().optional(),
});

const addShotSchema = z.object({
  sessionId: z.string().uuid(),
  club: z.string(),
  ballSpeed: z.number().optional(),
  clubSpeed: z.number().optional(),
  launchAngle: z.number().optional(),
  spinRate: z.number().int().optional(),
  carryDistance: z.number().optional(),
  totalDistance: z.number().optional(),
  smashFactor: z.number().optional(),
  attackAngle: z.number().optional(),
  clubPath: z.number().optional(),
  faceAngle: z.number().optional(),
  sideSpin: z.number().optional(),
  backSpin: z.number().optional(),
});

export async function trackmanRoutes(app: FastifyInstance): Promise<void> {
  const prisma = getPrismaClient();

  // Create session
  app.post<{ Body: z.infer<typeof createSessionSchema> }>(
    '/sessions',
    { preHandler: authenticateUser },
    async (request, reply) => {
      const input = createSessionSchema.parse(request.body);
      const tenantId = request.user!.tenantId;

      const session = await prisma.launchMonitorSession.create({
        data: {
          tenantId,
          playerId: input.playerId,
          coachId: request.user!.coachId,
          deviceType: input.deviceType,
          location: input.location,
          notes: input.notes,
        },
      });

      return reply.status(201).send({ success: true, data: session });
    }
  );

  // Add shot
  app.post<{ Body: z.infer<typeof addShotSchema> }>(
    '/shots',
    { preHandler: authenticateUser },
    async (request, reply) => {
      const input = addShotSchema.parse(request.body);
      const tenantId = request.user!.tenantId;

      const shot = await prisma.launchMonitorShot.create({
        data: {
          tenantId,
          sessionId: input.sessionId,
          club: input.club,
          ballSpeed: input.ballSpeed,
          clubSpeed: input.clubSpeed,
          launchAngle: input.launchAngle,
          spinRate: input.spinRate,
          carryDistance: input.carryDistance,
          totalDistance: input.totalDistance,
          smashFactor: input.smashFactor,
          attackAngle: input.attackAngle,
          clubPath: input.clubPath,
          faceAngle: input.faceAngle,
          sideSpin: input.sideSpin,
          backSpin: input.backSpin,
        },
      });

      // Update session stats
      await prisma.launchMonitorSession.update({
        where: { id: input.sessionId },
        data: { totalShots: { increment: 1 } },
      });

      return reply.status(201).send({ success: true, data: shot });
    }
  );

  // Get session with shots
  app.get<{ Params: { id: string } }>(
    '/sessions/:id',
    { preHandler: authenticateUser },
    async (request, reply) => {
      const session = await prisma.launchMonitorSession.findFirst({
        where: { id: request.params.id, tenantId: request.user!.tenantId },
        include: {
          shots: { orderBy: { createdAt: 'asc' } },
          player: { select: { firstName: true, lastName: true } },
        },
      });

      return reply.send({ success: true, data: session });
    }
  );

  // Club gapping analysis
  app.get<{ Params: { playerId: string } }>(
    '/club-gapping/:playerId',
    { preHandler: authenticateUser },
    async (request, reply) => {
      const { playerId } = request.params;
      const tenantId = request.user!.tenantId;

      // Get all shots for player, grouped by club
      const shots = await prisma.launchMonitorShot.findMany({
        where: {
          tenantId,
          session: { playerId },
        },
        select: {
          club: true,
          carryDistance: true,
          totalDistance: true,
        },
      });

      // Calculate averages per club
      const clubStats = shots.reduce((acc: any, shot) => {
        if (!acc[shot.club]) {
          acc[shot.club] = { carry: [], total: [] };
        }
        if (shot.carryDistance) acc[shot.club].carry.push(shot.carryDistance.toNumber());
        if (shot.totalDistance) acc[shot.club].total.push(shot.totalDistance.toNumber());
        return acc;
      }, {});

      const gapping = Object.entries(clubStats).map(([club, data]: [string, any]) => ({
        club,
        avgCarry: data.carry.length ? data.carry.reduce((a: number, b: number) => a + b) / data.carry.length : 0,
        avgTotal: data.total.length ? data.total.reduce((a: number, b: number) => a + b) / data.total.length : 0,
        shots: data.carry.length,
      }));

      return reply.send({ success: true, data: gapping });
    }
  );
}
