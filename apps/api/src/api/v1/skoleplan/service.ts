import { getPrismaClient } from '../../../core/db/prisma';
import { AppError } from '../../../core/errors';

const prisma = getPrismaClient();

// ============================================================================
// TYPES
// ============================================================================

export interface CreateFagInput {
  navn: string;
  larer?: string;
  rom?: string;
  farge?: string;
}

export interface UpdateFagInput {
  navn?: string;
  larer?: string;
  rom?: string;
  farge?: string;
}

export interface CreateSkoletimeInput {
  fagId: string;
  ukedag: string;
  startTid: string;
  sluttTid: string;
}

export interface UpdateSkoletimeInput {
  fagId?: string;
  ukedag?: string;
  startTid?: string;
  sluttTid?: string;
}

export interface CreateOppgaveInput {
  fagId: string;
  tittel: string;
  beskrivelse?: string;
  frist: string;
  prioritet?: string;
}

export interface UpdateOppgaveInput {
  fagId?: string;
  tittel?: string;
  beskrivelse?: string;
  frist?: string;
  prioritet?: string;
}

// ============================================================================
// FAG SERVICE
// ============================================================================

export class FagService {
  async listFag(userId: string) {
    return prisma.fag.findMany({
      where: { userId },
      orderBy: { navn: 'asc' }
    });
  }

  async getFagById(fagId: string, userId: string) {
    const fag = await prisma.fag.findUnique({
      where: { id: fagId }
    });

    if (!fag) {
      throw new AppError('validation_error', 'Fag ikke funnet', 404, { fagId });
    }

    if (fag.userId !== userId) {
      throw new AppError('authorization_error', 'Du har ikke tilgang til dette faget', 403);
    }

    return fag;
  }

  async createFag(userId: string, input: CreateFagInput) {
    return prisma.fag.create({
      data: {
        userId,
        navn: input.navn,
        larer: input.larer,
        rom: input.rom,
        farge: input.farge || '#10456A' // default primary color
      }
    });
  }

  async updateFag(fagId: string, userId: string, input: UpdateFagInput) {
    await this.getFagById(fagId, userId);

    return prisma.fag.update({
      where: { id: fagId },
      data: {
        ...input,
        updatedAt: new Date()
      }
    });
  }

  async deleteFag(fagId: string, userId: string) {
    await this.getFagById(fagId, userId);

    await prisma.fag.delete({
      where: { id: fagId }
    });

    return { success: true };
  }
}

// ============================================================================
// SKOLETIME SERVICE
// ============================================================================

export class SkoletimeService {
  private fagService = new FagService();

  async listTimer(userId: string) {
    // Get all user's fag IDs first
    const userFag = await prisma.fag.findMany({
      where: { userId },
      select: { id: true }
    });
    const fagIds = userFag.map(f => f.id);

    return prisma.skoletime.findMany({
      where: { fagId: { in: fagIds } },
      include: { fag: true },
      orderBy: [
        { ukedag: 'asc' },
        { startTid: 'asc' }
      ]
    });
  }

  async getSkoletimeById(timeId: string, userId: string) {
    const time = await prisma.skoletime.findUnique({
      where: { id: timeId },
      include: { fag: true }
    });

    if (!time) {
      throw new AppError('validation_error', 'Skoletime ikke funnet', 404, { timeId });
    }

    // Verify user owns the fag
    if (time.fag.userId !== userId) {
      throw new AppError('authorization_error', 'Du har ikke tilgang til denne timen', 403);
    }

    return time;
  }

  async createSkoletime(userId: string, input: CreateSkoletimeInput) {
    // Verify user owns the fag
    await this.fagService.getFagById(input.fagId, userId);

    return prisma.skoletime.create({
      data: {
        fagId: input.fagId,
        ukedag: input.ukedag,
        startTid: input.startTid,
        sluttTid: input.sluttTid
      },
      include: { fag: true }
    });
  }

  async updateSkoletime(timeId: string, userId: string, input: UpdateSkoletimeInput) {
    await this.getSkoletimeById(timeId, userId);

    // If changing fagId, verify user owns the new fag
    if (input.fagId) {
      await this.fagService.getFagById(input.fagId, userId);
    }

    return prisma.skoletime.update({
      where: { id: timeId },
      data: {
        ...input,
        updatedAt: new Date()
      },
      include: { fag: true }
    });
  }

  async deleteSkoletime(timeId: string, userId: string) {
    await this.getSkoletimeById(timeId, userId);

    await prisma.skoletime.delete({
      where: { id: timeId }
    });

    return { success: true };
  }
}

// ============================================================================
// OPPGAVE SERVICE
// ============================================================================

export class OppgaveService {
  private fagService = new FagService();

  async listOppgaver(userId: string, filters?: { fagId?: string; status?: string }) {
    // Get all user's fag IDs
    const userFag = await prisma.fag.findMany({
      where: { userId },
      select: { id: true }
    });
    const fagIds = userFag.map(f => f.id);

    const where: any = { fagId: { in: fagIds } };

    if (filters?.fagId) {
      where.fagId = filters.fagId;
    }
    if (filters?.status) {
      where.status = filters.status;
    }

    return prisma.oppgave.findMany({
      where,
      include: { fag: true },
      orderBy: [
        { frist: 'asc' },
        { createdAt: 'desc' }
      ]
    });
  }

  async getOppgaveById(oppgaveId: string, userId: string) {
    const oppgave = await prisma.oppgave.findUnique({
      where: { id: oppgaveId },
      include: { fag: true }
    });

    if (!oppgave) {
      throw new AppError('validation_error', 'Oppgave ikke funnet', 404, { oppgaveId });
    }

    // Verify user owns the fag
    if (oppgave.fag.userId !== userId) {
      throw new AppError('authorization_error', 'Du har ikke tilgang til denne oppgaven', 403);
    }

    return oppgave;
  }

  async createOppgave(userId: string, input: CreateOppgaveInput) {
    // Verify user owns the fag
    await this.fagService.getFagById(input.fagId, userId);

    return prisma.oppgave.create({
      data: {
        fagId: input.fagId,
        tittel: input.tittel,
        beskrivelse: input.beskrivelse,
        frist: new Date(input.frist),
        prioritet: input.prioritet || 'medium',
        status: 'pending'
      },
      include: { fag: true }
    });
  }

  async updateOppgave(oppgaveId: string, userId: string, input: UpdateOppgaveInput) {
    await this.getOppgaveById(oppgaveId, userId);

    // If changing fagId, verify user owns the new fag
    if (input.fagId) {
      await this.fagService.getFagById(input.fagId, userId);
    }

    const data: any = { ...input, updatedAt: new Date() };
    if (input.frist) {
      data.frist = new Date(input.frist);
    }

    return prisma.oppgave.update({
      where: { id: oppgaveId },
      data,
      include: { fag: true }
    });
  }

  async updateOppgaveStatus(oppgaveId: string, userId: string, status: string) {
    await this.getOppgaveById(oppgaveId, userId);

    return prisma.oppgave.update({
      where: { id: oppgaveId },
      data: {
        status,
        updatedAt: new Date()
      },
      include: { fag: true }
    });
  }

  async deleteOppgave(oppgaveId: string, userId: string) {
    await this.getOppgaveById(oppgaveId, userId);

    await prisma.oppgave.delete({
      where: { id: oppgaveId }
    });

    return { success: true };
  }
}

// ============================================================================
// COMBINED SKOLEPLAN SERVICE
// ============================================================================

export class SkoleplanService {
  private fagService = new FagService();
  private skoletimeService = new SkoletimeService();
  private oppgaveService = new OppgaveService();

  async getFullSkoleplan(userId: string) {
    const [fag, timer, oppgaver] = await Promise.all([
      this.fagService.listFag(userId),
      this.skoletimeService.listTimer(userId),
      this.oppgaveService.listOppgaver(userId)
    ]);

    return { fag, timer, oppgaver };
  }
}
