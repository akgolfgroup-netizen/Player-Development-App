# Eksekveringsplan: Spillerstyrt Årsplan-generering
**Automatisk implementering - Fase 1 & 2**
**Opprettet:** 2026-01-08
**Estimert tid:** 6-8 timer

---

## 🎯 Mål
Implementere komplett spillerstyrt årsplan-funksjonalitet med:
- Backend API (CRUD)
- Frontend wizard (5 steg)
- Kalenderintegrasjon
- PDF/iCal eksport
- Testing

---

## 📦 FASE 1: BACKEND API (2-3 timer)

### 1.1 Database Schema (Eksisterende - verifiser)

Tabellen `AnnualTrainingPlan` finnes allerede. Verifiser at følgende kolonner eksisterer:
```prisma
model AnnualTrainingPlan {
  id           String   @id @default(uuid())
  tenantId     String
  playerId     String
  coachId      String?
  name         String
  startDate    DateTime
  endDate      DateTime
  periods      Json
  status       String   @default("active")
  createdBy    String   @default("coach")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

Hvis `createdBy` mangler, kjør migration:
```sql
ALTER TABLE "AnnualTrainingPlan" ADD COLUMN "createdBy" VARCHAR(50) DEFAULT 'coach';
```

---

### 1.2 API Service Implementation

**Fil:** `apps/api/src/api/v1/players/annual-plan-service.ts`

```typescript
/**
 * Player Annual Plan Service
 * Self-service annual plan creation for players
 */

import { PrismaClient } from '@prisma/client';

export interface Period {
  id: string;
  type: 'E' | 'G' | 'S' | 'T';
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  weeklyFrequency: number;
  goals: string[];
  color: string;
  textColor: string;
}

export interface CreatePlayerAnnualPlanInput {
  name: string;
  startDate: string;
  endDate: string;
  periods: Period[];
}

export interface UpdatePlayerAnnualPlanInput {
  name?: string;
  startDate?: string;
  endDate?: string;
  periods?: Period[];
  status?: 'active' | 'completed' | 'paused' | 'cancelled';
}

export class PlayerAnnualPlanService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get player's current annual plan
   */
  async getPlayerPlan(tenantId: string, playerId: string) {
    const plan = await this.prisma.annualTrainingPlan.findFirst({
      where: {
        playerId,
        tenantId,
        status: { not: 'cancelled' },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      plan,
      hasActivePlan: !!plan && plan.status === 'active',
    };
  }

  /**
   * Create new annual plan for player
   */
  async createPlayerPlan(
    tenantId: string,
    playerId: string,
    data: CreatePlayerAnnualPlanInput
  ) {
    // Validate player exists
    const player = await this.prisma.player.findFirst({
      where: { id: playerId, tenantId },
    });

    if (!player) {
      throw new Error('Player not found');
    }

    // Check if active plan exists
    const existingPlan = await this.prisma.annualTrainingPlan.findFirst({
      where: {
        playerId,
        tenantId,
        status: 'active',
      },
    });

    if (existingPlan) {
      throw new Error(
        'An active annual plan already exists. Please complete or cancel it first.'
      );
    }

    // Validate periods don't overlap
    this.validatePeriods(data.periods);

    // Validate date range
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end <= start) {
      throw new Error('End date must be after start date');
    }

    // Create plan
    const plan = await this.prisma.annualTrainingPlan.create({
      data: {
        tenantId,
        playerId,
        coachId: null, // Player-generated
        name: data.name,
        startDate: start,
        endDate: end,
        periods: data.periods as any,
        status: 'active',
        createdBy: 'player',
      },
    });

    return plan;
  }

  /**
   * Update existing annual plan
   */
  async updatePlayerPlan(
    tenantId: string,
    playerId: string,
    data: UpdatePlayerAnnualPlanInput
  ) {
    const plan = await this.prisma.annualTrainingPlan.findFirst({
      where: {
        playerId,
        tenantId,
        status: { not: 'cancelled' },
      },
    });

    if (!plan) {
      throw new Error('No active annual plan found');
    }

    // Validate periods if provided
    if (data.periods) {
      this.validatePeriods(data.periods);
    }

    // Validate dates if provided
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (end <= start) {
        throw new Error('End date must be after start date');
      }
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    if (data.periods) updateData.periods = data.periods;
    if (data.status) updateData.status = data.status;

    return await this.prisma.annualTrainingPlan.update({
      where: { id: plan.id },
      data: updateData,
    });
  }

  /**
   * Cancel annual plan
   */
  async cancelPlayerPlan(tenantId: string, playerId: string) {
    const plan = await this.prisma.annualTrainingPlan.findFirst({
      where: {
        playerId,
        tenantId,
        status: { not: 'cancelled' },
      },
    });

    if (!plan) {
      throw new Error('No active annual plan found');
    }

    return await this.prisma.annualTrainingPlan.update({
      where: { id: plan.id },
      data: { status: 'cancelled' },
    });
  }

  /**
   * Get predefined templates
   */
  async getTemplates() {
    return ANNUAL_PLAN_TEMPLATES;
  }

  /**
   * Validate periods don't overlap
   */
  private validatePeriods(periods: Period[]) {
    if (periods.length === 0) {
      throw new Error('At least one period is required');
    }

    const sorted = [...periods].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];

      const currentEnd = new Date(current.endDate);
      const nextStart = new Date(next.startDate);

      if (currentEnd >= nextStart) {
        throw new Error(
          `Period overlap detected: ${current.name} and ${next.name}`
        );
      }

      // Validate period has valid dates
      const periodStart = new Date(current.startDate);
      const periodEnd = new Date(current.endDate);
      if (periodEnd <= periodStart) {
        throw new Error(
          `Invalid period dates for ${current.name}: end date must be after start date`
        );
      }

      // Validate weekly frequency
      if (current.weeklyFrequency < 1 || current.weeklyFrequency > 7) {
        throw new Error(
          `Invalid weekly frequency for ${current.name}: must be between 1 and 7`
        );
      }
    }

    // Validate last period
    const last = sorted[sorted.length - 1];
    const lastStart = new Date(last.startDate);
    const lastEnd = new Date(last.endDate);
    if (lastEnd <= lastStart) {
      throw new Error(
        `Invalid period dates for ${last.name}: end date must be after start date`
      );
    }
    if (last.weeklyFrequency < 1 || last.weeklyFrequency > 7) {
      throw new Error(
        `Invalid weekly frequency for ${last.name}: must be between 1 and 7`
      );
    }
  }
}

// Predefined templates
const ANNUAL_PLAN_TEMPLATES = [
  {
    id: 'elite-52weeks',
    name: 'Elite Årsplan (52 uker)',
    description: 'Komplett periodisert plan for elite-spillere',
    targetLevel: 'elite',
    durationWeeks: 52,
    periods: [
      {
        id: 'e1',
        type: 'E' as const,
        name: 'Etablering',
        description: 'Bygge grunnlag etter sesong',
        weeklyFrequency: 3,
        weeks: 6,
        goals: ['Restitusjon', 'Grunnkondisjon', 'Teknisk evaluering'],
        color: '#10B981',
        textColor: '#065F46',
      },
      {
        id: 'g1',
        type: 'G' as const,
        name: 'Grunntrening Fase 1',
        description: 'Bygge volum og styrke',
        weeklyFrequency: 5,
        weeks: 12,
        goals: ['Øke treningsvolum', 'Styrketrening', 'Teknisk utvikling'],
        color: '#3B82F6',
        textColor: '#1E3A8A',
      },
      {
        id: 's1',
        type: 'S' as const,
        name: 'Pre-sesong Spesialisering',
        description: 'Golf-spesifikk forberedelse',
        weeklyFrequency: 4,
        weeks: 10,
        goals: [
          'Turnerings-forberedelse',
          'Short game fokus',
          'Mental trening',
        ],
        color: '#F59E0B',
        textColor: '#92400E',
      },
      {
        id: 't1',
        type: 'T' as const,
        name: 'Konkurransesesong',
        description: 'Prestere og vedlikeholde',
        weeklyFrequency: 4,
        weeks: 20,
        goals: ['Prestere i turneringer', 'Vedlikeholde form', 'Analysere'],
        color: '#EF4444',
        textColor: '#991B1B',
      },
      {
        id: 'g2',
        type: 'G' as const,
        name: 'Mid-sesong Grunntrening',
        description: 'Regenerering og vedlikehold',
        weeklyFrequency: 3,
        weeks: 4,
        goals: ['Restitusjon', 'Vedlikeholde styrke', 'Mental pause'],
        color: '#3B82F6',
        textColor: '#1E3A8A',
      },
    ],
  },
  {
    id: 'talent-40weeks',
    name: 'Talent Årsplan (40 uker)',
    description: 'Periodisert plan for talent-spillere',
    targetLevel: 'talent',
    durationWeeks: 40,
    periods: [
      {
        id: 'e1',
        type: 'E' as const,
        name: 'Etablering',
        weeklyFrequency: 3,
        weeks: 6,
        goals: ['Bygge treningsvaner', 'Grunnleggende teknikk', 'Baseline'],
        color: '#10B981',
        textColor: '#065F46',
      },
      {
        id: 'g1',
        type: 'G' as const,
        name: 'Grunntrening',
        weeklyFrequency: 4,
        weeks: 16,
        goals: ['Teknisk utvikling', 'Øke volum', 'Fysisk grunnlag'],
        color: '#3B82F6',
        textColor: '#1E3A8A',
      },
      {
        id: 's1',
        type: 'S' as const,
        name: 'Spesialisering',
        weeklyFrequency: 4,
        weeks: 8,
        goals: ['Golf-spesifikk', 'Pre-sesong', 'Mental forberedelse'],
        color: '#F59E0B',
        textColor: '#92400E',
      },
      {
        id: 't1',
        type: 'T' as const,
        name: 'Turnering',
        weeklyFrequency: 3,
        weeks: 10,
        goals: ['Konkurransesesong', 'Prestere', 'Lære av resultater'],
        color: '#EF4444',
        textColor: '#991B1B',
      },
    ],
  },
];
```

---

### 1.3 API Routes

**Fil:** `apps/api/src/api/v1/players/annual-plan-routes.ts`

```typescript
/**
 * Player Annual Plan API Routes
 * Self-service endpoints for players to manage their annual plans
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import {
  PlayerAnnualPlanService,
  type CreatePlayerAnnualPlanInput,
  type UpdatePlayerAnnualPlanInput,
} from './annual-plan-service';
import { getPrismaClient } from '../../../core/db/prisma';
import { authenticateUser } from '../../../middleware/auth';
import { injectTenantContext } from '../../../middleware/tenant';

// ============================================================================
// SCHEMAS
// ============================================================================

const periodSchema = z.object({
  id: z.string(),
  type: z.enum(['E', 'G', 'S', 'T']),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  weeklyFrequency: z.number().int().min(1).max(7),
  goals: z.array(z.string()),
  color: z.string(),
  textColor: z.string(),
});

const createPlanSchema = z.object({
  name: z.string().min(1).max(255),
  startDate: z.string(),
  endDate: z.string(),
  periods: z.array(periodSchema).min(1),
});

const updatePlanSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  periods: z.array(periodSchema).min(1).optional(),
  status: z.enum(['active', 'completed', 'paused', 'cancelled']).optional(),
});

type CreatePlanBody = z.infer<typeof createPlanSchema>;
type UpdatePlanBody = z.infer<typeof updatePlanSchema>;

// Helper to get playerId from request
function getPlayerId(request: FastifyRequest): string | null {
  const user = request.user as
    | { playerId?: string; role?: string; id?: string }
    | undefined;
  if (user?.playerId) return user.playerId;
  if (user?.role === 'player' && user?.id) return user.id;
  return null;
}

// ============================================================================
// ROUTES
// ============================================================================

export async function playerAnnualPlanRoutes(
  app: FastifyInstance
): Promise<void> {
  const prisma = getPrismaClient();
  const service = new PlayerAnnualPlanService(prisma);

  const preHandlers = [authenticateUser, injectTenantContext];

  /**
   * GET /api/v1/players/:playerId/annual-plan
   * Get player's current annual plan
   */
  app.get<{ Params: { playerId: string } }>(
    '/:playerId/annual-plan',
    {
      preHandler: preHandlers,
      schema: {
        description: "Get player's annual plan",
        tags: ['players', 'annual-plans'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            playerId: { type: 'string', format: 'uuid' },
          },
          required: ['playerId'],
        },
      },
    },
    async (request, reply) => {
      try {
        const { playerId } = request.params;
        const tenantId = (request as any).tenantId;

        // Verify user can access this player's data
        const requestPlayerId = getPlayerId(request);
        if (requestPlayerId !== playerId) {
          return reply.code(403).send({
            success: false,
            message: 'You can only access your own annual plan',
          });
        }

        const result = await service.getPlayerPlan(tenantId, playerId);

        return reply.send({
          success: true,
          data: result,
        });
      } catch (error: any) {
        request.log.error(error);
        return reply.code(500).send({
          success: false,
          message: 'Failed to fetch annual plan',
          error: error.message,
        });
      }
    }
  );

  /**
   * POST /api/v1/players/:playerId/annual-plan
   * Create new annual plan
   */
  app.post<{ Params: { playerId: string }; Body: CreatePlanBody }>(
    '/:playerId/annual-plan',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Create new annual plan for player',
        tags: ['players', 'annual-plans'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            playerId: { type: 'string', format: 'uuid' },
          },
          required: ['playerId'],
        },
        body: {
          type: 'object',
          required: ['name', 'startDate', 'endDate', 'periods'],
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 255 },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            periods: {
              type: 'array',
              minItems: 1,
              items: {
                type: 'object',
                required: [
                  'id',
                  'type',
                  'name',
                  'startDate',
                  'endDate',
                  'weeklyFrequency',
                  'goals',
                  'color',
                  'textColor',
                ],
                properties: {
                  id: { type: 'string' },
                  type: { type: 'string', enum: ['E', 'G', 'S', 'T'] },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  startDate: { type: 'string' },
                  endDate: { type: 'string' },
                  weeklyFrequency: { type: 'number', minimum: 1, maximum: 7 },
                  goals: { type: 'array', items: { type: 'string' } },
                  color: { type: 'string' },
                  textColor: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { playerId } = request.params;
        const tenantId = (request as any).tenantId;

        // Verify user can create plan for this player
        const requestPlayerId = getPlayerId(request);
        if (requestPlayerId !== playerId) {
          return reply.code(403).send({
            success: false,
            message: 'You can only create your own annual plan',
          });
        }

        // Validate input
        const validatedData = createPlanSchema.parse(request.body);

        const plan = await service.createPlayerPlan(
          tenantId,
          playerId,
          validatedData
        );

        return reply.code(201).send({
          success: true,
          data: { plan },
        });
      } catch (error: any) {
        request.log.error(error);

        if (error.name === 'ZodError') {
          return reply.code(400).send({
            success: false,
            message: 'Invalid input data',
            errors: error.errors,
          });
        }

        return reply.code(400).send({
          success: false,
          message: error.message || 'Failed to create annual plan',
        });
      }
    }
  );

  /**
   * PUT /api/v1/players/:playerId/annual-plan
   * Update existing annual plan
   */
  app.put<{ Params: { playerId: string }; Body: UpdatePlanBody }>(
    '/:playerId/annual-plan',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Update annual plan',
        tags: ['players', 'annual-plans'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            playerId: { type: 'string', format: 'uuid' },
          },
          required: ['playerId'],
        },
      },
    },
    async (request, reply) => {
      try {
        const { playerId } = request.params;
        const tenantId = (request as any).tenantId;

        // Verify user can update this player's plan
        const requestPlayerId = getPlayerId(request);
        if (requestPlayerId !== playerId) {
          return reply.code(403).send({
            success: false,
            message: 'You can only update your own annual plan',
          });
        }

        // Validate input
        const validatedData = updatePlanSchema.parse(request.body);

        const plan = await service.updatePlayerPlan(
          tenantId,
          playerId,
          validatedData
        );

        return reply.send({
          success: true,
          data: { plan },
        });
      } catch (error: any) {
        request.log.error(error);

        if (error.name === 'ZodError') {
          return reply.code(400).send({
            success: false,
            message: 'Invalid input data',
            errors: error.errors,
          });
        }

        return reply.code(400).send({
          success: false,
          message: error.message || 'Failed to update annual plan',
        });
      }
    }
  );

  /**
   * DELETE /api/v1/players/:playerId/annual-plan
   * Cancel annual plan
   */
  app.delete<{ Params: { playerId: string } }>(
    '/:playerId/annual-plan',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Cancel annual plan',
        tags: ['players', 'annual-plans'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            playerId: { type: 'string', format: 'uuid' },
          },
          required: ['playerId'],
        },
      },
    },
    async (request, reply) => {
      try {
        const { playerId } = request.params;
        const tenantId = (request as any).tenantId;

        // Verify user can cancel this player's plan
        const requestPlayerId = getPlayerId(request);
        if (requestPlayerId !== playerId) {
          return reply.code(403).send({
            success: false,
            message: 'You can only cancel your own annual plan',
          });
        }

        await service.cancelPlayerPlan(tenantId, playerId);

        return reply.send({
          success: true,
          message: 'Annual plan cancelled successfully',
        });
      } catch (error: any) {
        request.log.error(error);
        return reply.code(400).send({
          success: false,
          message: error.message || 'Failed to cancel annual plan',
        });
      }
    }
  );

  /**
   * GET /api/v1/players/:playerId/annual-plan/templates
   * Get predefined templates
   */
  app.get<{ Params: { playerId: string } }>(
    '/:playerId/annual-plan/templates',
    {
      preHandler: preHandlers,
      schema: {
        description: 'Get annual plan templates',
        tags: ['players', 'annual-plans'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            playerId: { type: 'string', format: 'uuid' },
          },
          required: ['playerId'],
        },
      },
    },
    async (request, reply) => {
      try {
        const templates = await service.getTemplates();

        return reply.send({
          success: true,
          data: { templates },
        });
      } catch (error: any) {
        request.log.error(error);
        return reply.code(500).send({
          success: false,
          message: 'Failed to fetch templates',
        });
      }
    }
  );
}
```

---

### 1.4 Register Routes

**Fil:** `apps/api/src/api/v1/players/index.ts`

Add to existing player routes file:

```typescript
import { playerAnnualPlanRoutes } from './annual-plan-routes';

// In your main routes function:
export async function playerRoutes(app: FastifyInstance): Promise<void> {
  // ... existing routes ...

  // Annual plan routes
  await app.register(playerAnnualPlanRoutes, { prefix: '/players' });
}
```

Or if players/index.ts doesn't exist, create it and register in main app.

---

### 1.5 Backend Tests

**Fil:** `apps/api/src/__tests__/player-annual-plan.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { PlayerAnnualPlanService } from '../api/v1/players/annual-plan-service';
import { getPrismaClient } from '../core/db/prisma';

const prisma = getPrismaClient();
const service = new PlayerAnnualPlanService(prisma);

describe('PlayerAnnualPlanService', () => {
  const testTenantId = '00000000-0000-0000-0000-000000000001';
  const testPlayerId = '00000000-0000-0000-0000-000000000004';

  describe('validatePeriods', () => {
    it('should reject overlapping periods', () => {
      const periods = [
        {
          id: 'p1',
          type: 'E' as const,
          name: 'Period 1',
          startDate: '2026-01-01',
          endDate: '2026-03-01',
          weeklyFrequency: 3,
          goals: [],
          color: '#000',
          textColor: '#fff',
        },
        {
          id: 'p2',
          type: 'G' as const,
          name: 'Period 2',
          startDate: '2026-02-15', // Overlaps with p1
          endDate: '2026-04-01',
          weeklyFrequency: 4,
          goals: [],
          color: '#000',
          textColor: '#fff',
        },
      ];

      expect(() => {
        (service as any).validatePeriods(periods);
      }).toThrow('Period overlap detected');
    });

    it('should accept non-overlapping periods', () => {
      const periods = [
        {
          id: 'p1',
          type: 'E' as const,
          name: 'Period 1',
          startDate: '2026-01-01',
          endDate: '2026-02-28',
          weeklyFrequency: 3,
          goals: [],
          color: '#000',
          textColor: '#fff',
        },
        {
          id: 'p2',
          type: 'G' as const,
          name: 'Period 2',
          startDate: '2026-03-01', // No overlap
          endDate: '2026-04-30',
          weeklyFrequency: 4,
          goals: [],
          color: '#000',
          textColor: '#fff',
        },
      ];

      expect(() => {
        (service as any).validatePeriods(periods);
      }).not.toThrow();
    });
  });
});
```

---

## 📱 FASE 2: FRONTEND WIZARD (3-4 timer)

### 2.1 Project Structure

Create directory structure:
```bash
mkdir -p apps/web/src/features/player-annual-plan/{hooks,steps,components,utils}
```

---

### 2.2 Period Defaults and Colors

**Fil:** `apps/web/src/features/player-annual-plan/utils/periodDefaults.ts`

```typescript
export const PERIOD_COLORS = {
  E: {
    primary: '#10B981',
    light: '#D1FAE5',
    dark: '#047857',
    text: '#065F46',
  },
  G: {
    primary: '#3B82F6',
    light: '#DBEAFE',
    dark: '#1E40AF',
    text: '#1E3A8A',
  },
  S: {
    primary: '#F59E0B',
    light: '#FEF3C7',
    dark: '#D97706',
    text: '#92400E',
  },
  T: {
    primary: '#EF4444',
    light: '#FEE2E2',
    dark: '#DC2626',
    text: '#991B1B',
  },
};

export const PERIOD_LABELS = {
  E: 'Etablering',
  G: 'Grunntrening',
  S: 'Spesialisering',
  T: 'Turnering',
};

export const PERIOD_DESCRIPTIONS = {
  E: 'Bygge teknisk grunnlag og grunnkondisjon',
  G: 'Øke treningsvolum og bygge fysisk kapasitet',
  S: 'Golf-spesifikk trening og pre-sesong forberedelse',
  T: 'Konkurransesesong med vedlikeholdstrening',
};

export const PERIOD_DEFAULTS = {
  E: {
    name: 'Etablering',
    description: 'Bygge teknisk grunnlag',
    weeklyFrequency: 3,
    defaultWeeks: 6,
    goals: ['Bygge treningsvaner', 'Grunnleggende teknikk', 'Baseline'],
  },
  G: {
    name: 'Grunntrening',
    description: 'Øke volum og styrke',
    weeklyFrequency: 5,
    defaultWeeks: 16,
    goals: ['Øke styrke', 'Teknisk utvikling', 'Bygge volum'],
  },
  S: {
    name: 'Spesialisering',
    description: 'Golf-spesifikk forberedelse',
    weeklyFrequency: 4,
    defaultWeeks: 10,
    goals: ['Pre-sesong', 'Short game', 'Mental trening'],
  },
  T: {
    name: 'Turnering',
    description: 'Konkurransesesong',
    weeklyFrequency: 4,
    defaultWeeks: 16,
    goals: ['Prestere', 'Vedlikeholde', 'Analysere'],
  },
};
```

---

### 2.3 API Hook

**Fil:** `apps/web/src/features/player-annual-plan/hooks/usePlayerAnnualPlan.ts`

```typescript
import { useState, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import apiClient from '../../../services/apiClient';
import { toast } from 'sonner';

export interface Period {
  id: string;
  type: 'E' | 'G' | 'S' | 'T';
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  weeklyFrequency: number;
  goals: string[];
  color: string;
  textColor: string;
}

export interface AnnualPlan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  periods: Period[];
  status: string;
}

export function usePlayerAnnualPlan() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<AnnualPlan | null>(null);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playerId = user?.playerId || user?.id;

  const fetchPlan = useCallback(async () => {
    if (!playerId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(
        `/players/${playerId}/annual-plan`
      );

      if (response.data.success) {
        setPlan(response.data.data.plan);
        setHasActivePlan(response.data.data.hasActivePlan);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to fetch annual plan';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [playerId]);

  const createPlan = useCallback(
    async (data: {
      name: string;
      startDate: string;
      endDate: string;
      periods: Period[];
    }) => {
      if (!playerId) {
        toast.error('Player ID not found');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.post(
          `/players/${playerId}/annual-plan`,
          data
        );

        if (response.data.success) {
          setPlan(response.data.data.plan);
          setHasActivePlan(true);
          toast.success('Årsplan opprettet!');
          return response.data.data.plan;
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message || 'Failed to create annual plan';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [playerId]
  );

  const updatePlan = useCallback(
    async (data: Partial<AnnualPlan>) => {
      if (!playerId) {
        toast.error('Player ID not found');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.put(
          `/players/${playerId}/annual-plan`,
          data
        );

        if (response.data.success) {
          setPlan(response.data.data.plan);
          toast.success('Årsplan oppdatert!');
          return response.data.data.plan;
        }
      } catch (err: any) {
        const message =
          err.response?.data?.message || 'Failed to update annual plan';
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [playerId]
  );

  const cancelPlan = useCallback(async () => {
    if (!playerId) {
      toast.error('Player ID not found');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.delete(
        `/players/${playerId}/annual-plan`
      );

      if (response.data.success) {
        setPlan(null);
        setHasActivePlan(false);
        toast.success('Årsplan kansellert');
        return true;
      }
      return false;
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to cancel annual plan';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [playerId]);

  return {
    plan,
    hasActivePlan,
    isLoading,
    error,
    fetchPlan,
    createPlan,
    updatePlan,
    cancelPlan,
  };
}
```

---

### 2.4 Wizard State Hook

**Fil:** `apps/web/src/features/player-annual-plan/hooks/useAnnualPlanWizard.ts`

```typescript
import { useState, useCallback } from 'react';
import type { Period } from './usePlayerAnnualPlan';

interface WizardState {
  currentStep: number;
  totalSteps: number;
  basicInfo: {
    name: string;
    startDate: string;
    endDate: string;
    playerLevel: string;
  };
  selectedPeriodTypes: Array<'E' | 'G' | 'S' | 'T'>;
  periods: Period[];
  goals: string[];
  focusAreas: string[];
}

const initialState: WizardState = {
  currentStep: 0,
  totalSteps: 5,
  basicInfo: {
    name: '',
    startDate: '',
    endDate: '',
    playerLevel: 'talent',
  },
  selectedPeriodTypes: [],
  periods: [],
  goals: [],
  focusAreas: [],
};

export function useAnnualPlanWizard() {
  const [state, setState] = useState<WizardState>(initialState);

  const goToNext = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.totalSteps - 1),
    }));
  }, []);

  const goToPrevious = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, Math.min(step, prev.totalSteps - 1)),
    }));
  }, []);

  const updateBasicInfo = useCallback(
    (info: Partial<WizardState['basicInfo']>) => {
      setState((prev) => ({
        ...prev,
        basicInfo: { ...prev.basicInfo, ...info },
      }));
    },
    []
  );

  const updatePeriodTypes = useCallback(
    (types: Array<'E' | 'G' | 'S' | 'T'>) => {
      setState((prev) => ({ ...prev, selectedPeriodTypes: types }));
    },
    []
  );

  const updatePeriods = useCallback((periods: Period[]) => {
    setState((prev) => ({ ...prev, periods }));
  }, []);

  const updateGoals = useCallback((goals: string[]) => {
    setState((prev) => ({ ...prev, goals }));
  }, []);

  const updateFocusAreas = useCallback((areas: string[]) => {
    setState((prev) => ({ ...prev, focusAreas: areas }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    goToNext,
    goToPrevious,
    goToStep,
    updateBasicInfo,
    updatePeriodTypes,
    updatePeriods,
    updateGoals,
    updateFocusAreas,
    reset,
    isFirstStep: state.currentStep === 0,
    isLastStep: state.currentStep === state.totalSteps - 1,
    canGoNext: true, // Add validation logic here
  };
}
```

---

**DUE TO LENGTH LIMIT, CONTINUING IN NEXT SECTION...**

This execution plan is **50% complete**. The plan includes:
- ✅ Complete backend API implementation
- ✅ Database schema verification
- ✅ API routes with validation
- ✅ Backend tests
- ✅ Frontend hooks (API & state management)
- ⏳ Frontend wizard components (Step 1-5)
- ⏳ Shared UI components
- ⏳ Integration with App.jsx
- ⏳ Export functionality (PDF/iCal)
- ⏳ Final testing and commit

Should I continue with the remaining wizard components and integration steps?
