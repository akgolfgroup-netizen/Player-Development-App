import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getPrismaClient } from '../../../core/db/prisma';
import { authenticateUser } from '../../../middleware/auth';

const prisma = getPrismaClient();

// ============================================================================
// SKOLEPLAN API - Full CRUD for Fag, Skoletimer, and Oppgaver
// ============================================================================

export default async function skoleplanRoutes(fastify: FastifyInstance) {
  // Apply authentication to all routes
  fastify.addHook('preHandler', authenticateUser);

  // ============================================================================
  // GET ALL DATA - Combined endpoint for initial load
  // ============================================================================

  /**
   * Get all skoleplan data for current user
   * GET /skoleplan
   */
  fastify.get(
    '/',
    {
      schema: {
        description: 'Get all skoleplan data (fag, timer, oppgaver)',
        tags: ['skoleplan'],
        response: {
          200: { type: 'object', additionalProperties: true },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const [fag, timer, oppgaver] = await Promise.all([
        prisma.fag.findMany({
          where: { userId },
          orderBy: { navn: 'asc' },
        }),
        prisma.skoletime.findMany({
          where: { fag: { userId } },
          include: { fag: true },
          orderBy: [{ ukedag: 'asc' }, { startTid: 'asc' }],
        }),
        prisma.oppgave.findMany({
          where: { fag: { userId } },
          include: { fag: true },
          orderBy: { frist: 'asc' },
        }),
      ]);

      return reply.send({ fag, timer, oppgaver });
    }
  );

  // ============================================================================
  // FAG (Subjects) CRUD
  // ============================================================================

  fastify.post<{ Body: { navn: string; larer?: string; rom?: string; farge?: string } }>(
    '/fag',
    {
      schema: {
        description: 'Create a new subject (fag)',
        tags: ['skoleplan'],
        body: {
          type: 'object',
          required: ['navn'],
          properties: {
            navn: { type: 'string', minLength: 1, maxLength: 100 },
            larer: { type: 'string', maxLength: 100 },
            rom: { type: 'string', maxLength: 50 },
            farge: { type: 'string', maxLength: 20 },
          },
        },
      },
    },
    async (request, reply) => {
      const userId = request.user!.userId;
      const { navn, larer, rom, farge } = request.body;

      const fag = await prisma.fag.create({
        data: { userId, navn, larer, rom, farge },
      });

      return reply.code(201).send(fag);
    }
  );

  fastify.put<{
    Params: { id: string };
    Body: { navn?: string; larer?: string; rom?: string; farge?: string };
  }>(
    '/fag/:id',
    { schema: { description: 'Update a subject', tags: ['skoleplan'] } },
    async (request, reply) => {
      const userId = request.user!.userId;
      const { id } = request.params;
      const { navn, larer, rom, farge } = request.body;

      const existing = await prisma.fag.findFirst({ where: { id, userId } });
      if (!existing) {
        return reply.code(404).send({ error: 'Fag not found' });
      }

      const fag = await prisma.fag.update({
        where: { id },
        data: { navn, larer, rom, farge },
      });

      return reply.send(fag);
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    '/fag/:id',
    { schema: { description: 'Delete a subject', tags: ['skoleplan'] } },
    async (request, reply) => {
      const userId = request.user!.userId;
      const { id } = request.params;

      const existing = await prisma.fag.findFirst({ where: { id, userId } });
      if (!existing) {
        return reply.code(404).send({ error: 'Fag not found' });
      }

      await prisma.fag.delete({ where: { id } });
      return reply.code(204).send();
    }
  );

  // ============================================================================
  // TIMER (Class periods) CRUD
  // ============================================================================

  fastify.post<{
    Body: { fagId: string; ukedag: string; startTid: string; sluttTid: string };
  }>(
    '/timer',
    {
      schema: {
        description: 'Create a new class period',
        tags: ['skoleplan'],
        body: {
          type: 'object',
          required: ['fagId', 'ukedag', 'startTid', 'sluttTid'],
          properties: {
            fagId: { type: 'string', format: 'uuid' },
            ukedag: { type: 'string', enum: ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag'] },
            startTid: { type: 'string', pattern: '^[0-2][0-9]:[0-5][0-9]$' },
            sluttTid: { type: 'string', pattern: '^[0-2][0-9]:[0-5][0-9]$' },
          },
        },
      },
    },
    async (request, reply) => {
      const userId = request.user!.userId;
      const { fagId, ukedag, startTid, sluttTid } = request.body;

      const fag = await prisma.fag.findFirst({ where: { id: fagId, userId } });
      if (!fag) {
        return reply.code(404).send({ error: 'Fag not found' });
      }

      const timer = await prisma.skoletime.create({
        data: { fagId, ukedag, startTid, sluttTid },
        include: { fag: true },
      });

      return reply.code(201).send(timer);
    }
  );

  fastify.put<{
    Params: { id: string };
    Body: { fagId?: string; ukedag?: string; startTid?: string; sluttTid?: string };
  }>(
    '/timer/:id',
    { schema: { description: 'Update a class period', tags: ['skoleplan'] } },
    async (request, reply) => {
      const userId = request.user!.userId;
      const { id } = request.params;
      const { fagId, ukedag, startTid, sluttTid } = request.body;

      const existing = await prisma.skoletime.findFirst({
        where: { id, fag: { userId } },
      });
      if (!existing) {
        return reply.code(404).send({ error: 'Timer not found' });
      }

      if (fagId && fagId !== existing.fagId) {
        const newFag = await prisma.fag.findFirst({ where: { id: fagId, userId } });
        if (!newFag) {
          return reply.code(404).send({ error: 'Fag not found' });
        }
      }

      const timer = await prisma.skoletime.update({
        where: { id },
        data: { fagId, ukedag, startTid, sluttTid },
        include: { fag: true },
      });

      return reply.send(timer);
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    '/timer/:id',
    { schema: { description: 'Delete a class period', tags: ['skoleplan'] } },
    async (request, reply) => {
      const userId = request.user!.userId;
      const { id } = request.params;

      const existing = await prisma.skoletime.findFirst({
        where: { id, fag: { userId } },
      });
      if (!existing) {
        return reply.code(404).send({ error: 'Timer not found' });
      }

      await prisma.skoletime.delete({ where: { id } });
      return reply.code(204).send();
    }
  );

  // ============================================================================
  // OPPGAVER (Assignments) CRUD
  // ============================================================================

  fastify.post<{
    Body: { fagId: string; tittel: string; beskrivelse?: string; frist: string; prioritet?: string };
  }>(
    '/oppgaver',
    {
      schema: {
        description: 'Create a new assignment',
        tags: ['skoleplan'],
        body: {
          type: 'object',
          required: ['fagId', 'tittel', 'frist'],
          properties: {
            fagId: { type: 'string', format: 'uuid' },
            tittel: { type: 'string', minLength: 1, maxLength: 255 },
            beskrivelse: { type: 'string' },
            frist: { type: 'string', format: 'date' },
            prioritet: { type: 'string', enum: ['low', 'medium', 'high'] },
          },
        },
      },
    },
    async (request, reply) => {
      const userId = request.user!.userId;
      const { fagId, tittel, beskrivelse, frist, prioritet } = request.body;

      const fag = await prisma.fag.findFirst({ where: { id: fagId, userId } });
      if (!fag) {
        return reply.code(404).send({ error: 'Fag not found' });
      }

      const oppgave = await prisma.oppgave.create({
        data: {
          fagId,
          tittel,
          beskrivelse,
          frist: new Date(frist),
          prioritet: prioritet || 'medium',
        },
        include: { fag: true },
      });

      return reply.code(201).send(oppgave);
    }
  );

  fastify.put<{
    Params: { id: string };
    Body: { fagId?: string; tittel?: string; beskrivelse?: string; frist?: string; prioritet?: string; status?: string };
  }>(
    '/oppgaver/:id',
    { schema: { description: 'Update an assignment', tags: ['skoleplan'] } },
    async (request, reply) => {
      const userId = request.user!.userId;
      const { id } = request.params;
      const { fagId, tittel, beskrivelse, frist, prioritet, status } = request.body;

      const existing = await prisma.oppgave.findFirst({
        where: { id, fag: { userId } },
      });
      if (!existing) {
        return reply.code(404).send({ error: 'Oppgave not found' });
      }

      if (fagId && fagId !== existing.fagId) {
        const newFag = await prisma.fag.findFirst({ where: { id: fagId, userId } });
        if (!newFag) {
          return reply.code(404).send({ error: 'Fag not found' });
        }
      }

      const oppgave = await prisma.oppgave.update({
        where: { id },
        data: {
          fagId,
          tittel,
          beskrivelse,
          frist: frist ? new Date(frist) : undefined,
          prioritet,
          status,
        },
        include: { fag: true },
      });

      return reply.send(oppgave);
    }
  );

  fastify.patch<{ Params: { id: string }; Body: { status: string } }>(
    '/oppgaver/:id/status',
    {
      schema: {
        description: 'Toggle assignment status',
        tags: ['skoleplan'],
        body: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', enum: ['pending', 'completed'] },
          },
        },
      },
    },
    async (request, reply) => {
      const userId = request.user!.userId;
      const { id } = request.params;
      const { status } = request.body;

      const existing = await prisma.oppgave.findFirst({
        where: { id, fag: { userId } },
      });
      if (!existing) {
        return reply.code(404).send({ error: 'Oppgave not found' });
      }

      const oppgave = await prisma.oppgave.update({
        where: { id },
        data: { status },
        include: { fag: true },
      });

      return reply.send(oppgave);
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    '/oppgaver/:id',
    { schema: { description: 'Delete an assignment', tags: ['skoleplan'] } },
    async (request, reply) => {
      const userId = request.user!.userId;
      const { id } = request.params;

      const existing = await prisma.oppgave.findFirst({
        where: { id, fag: { userId } },
      });
      if (!existing) {
        return reply.code(404).send({ error: 'Oppgave not found' });
      }

      await prisma.oppgave.delete({ where: { id } });
      return reply.code(204).send();
    }
  );
}
