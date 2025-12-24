import { FastifyInstance } from 'fastify';
import {
  FagService,
  SkoletimeService,
  OppgaveService,
  SkoleplanService
} from './service';
import {
  getSkoleplanSchema,
  // Fag
  createFagSchema,
  updateFagSchema,
  listFagSchema,
  getFagSchema,
  deleteFagSchema,
  // Timer
  createSkoletimeSchema,
  updateSkoletimeSchema,
  listTimerSchema,
  deleteSkoletimeSchema,
  // Oppgaver
  createOppgaveSchema,
  updateOppgaveSchema,
  listOppgaverSchema,
  updateOppgaveStatusSchema,
  deleteOppgaveSchema
} from './schema';
import { authenticateUser } from '../../../middleware/auth';

const fagService = new FagService();
const skoletimeService = new SkoletimeService();
const oppgaveService = new OppgaveService();
const skoleplanService = new SkoleplanService();

export default async function skoleplanRoutes(fastify: FastifyInstance) {
  // Apply authentication to all routes
  fastify.addHook('preHandler', authenticateUser);

  // ============================================================================
  // FULL SKOLEPLAN
  // ============================================================================

  // Get everything (fag, timer, oppgaver)
  fastify.get(
    '/',
    { schema: getSkoleplanSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const skoleplan = await skoleplanService.getFullSkoleplan(userId);
      return reply.code(200).send(skoleplan);
    }
  );

  // ============================================================================
  // FAG ROUTES
  // ============================================================================

  // List all fag
  fastify.get(
    '/fag',
    { schema: listFagSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const fag = await fagService.listFag(userId);
      return reply.code(200).send(fag);
    }
  );

  // Get single fag
  fastify.get(
    '/fag/:id',
    { schema: getFagSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const { id } = request.params as { id: string };
      const fag = await fagService.getFagById(id, userId);
      return reply.code(200).send(fag);
    }
  );

  // Create fag
  fastify.post(
    '/fag',
    { schema: createFagSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const fag = await fagService.createFag(userId, request.body as any);
      return reply.code(201).send(fag);
    }
  );

  // Update fag
  fastify.put(
    '/fag/:id',
    { schema: updateFagSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const { id } = request.params as { id: string };
      const fag = await fagService.updateFag(id, userId, request.body as any);
      return reply.code(200).send(fag);
    }
  );

  // Delete fag
  fastify.delete(
    '/fag/:id',
    { schema: deleteFagSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const { id } = request.params as { id: string };
      const result = await fagService.deleteFag(id, userId);
      return reply.code(200).send(result);
    }
  );

  // ============================================================================
  // TIMER (SKOLETIME) ROUTES
  // ============================================================================

  // List all timer
  fastify.get(
    '/timer',
    { schema: listTimerSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const timer = await skoletimeService.listTimer(userId);
      return reply.code(200).send(timer);
    }
  );

  // Create skoletime
  fastify.post(
    '/timer',
    { schema: createSkoletimeSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const time = await skoletimeService.createSkoletime(userId, request.body as any);
      return reply.code(201).send(time);
    }
  );

  // Update skoletime
  fastify.put(
    '/timer/:id',
    { schema: updateSkoletimeSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const { id } = request.params as { id: string };
      const time = await skoletimeService.updateSkoletime(id, userId, request.body as any);
      return reply.code(200).send(time);
    }
  );

  // Delete skoletime
  fastify.delete(
    '/timer/:id',
    { schema: deleteSkoletimeSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const { id } = request.params as { id: string };
      const result = await skoletimeService.deleteSkoletime(id, userId);
      return reply.code(200).send(result);
    }
  );

  // ============================================================================
  // OPPGAVER ROUTES
  // ============================================================================

  // List oppgaver (with optional filtering)
  fastify.get(
    '/oppgaver',
    { schema: listOppgaverSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const { fagId, status } = request.query as { fagId?: string; status?: string };
      const oppgaver = await oppgaveService.listOppgaver(userId, { fagId, status });
      return reply.code(200).send(oppgaver);
    }
  );

  // Create oppgave
  fastify.post(
    '/oppgaver',
    { schema: createOppgaveSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const oppgave = await oppgaveService.createOppgave(userId, request.body as any);
      return reply.code(201).send(oppgave);
    }
  );

  // Update oppgave
  fastify.put(
    '/oppgaver/:id',
    { schema: updateOppgaveSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const { id } = request.params as { id: string };
      const oppgave = await oppgaveService.updateOppgave(id, userId, request.body as any);
      return reply.code(200).send(oppgave);
    }
  );

  // Update oppgave status (toggle completed)
  fastify.patch(
    '/oppgaver/:id/status',
    { schema: updateOppgaveStatusSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: string };
      const oppgave = await oppgaveService.updateOppgaveStatus(id, userId, status);
      return reply.code(200).send(oppgave);
    }
  );

  // Delete oppgave
  fastify.delete(
    '/oppgaver/:id',
    { schema: deleteOppgaveSchema },
    async (request, reply) => {
      const userId = request.user!.id;
      const { id } = request.params as { id: string };
      const result = await oppgaveService.deleteOppgave(id, userId);
      return reply.code(200).send(result);
    }
  );
}
