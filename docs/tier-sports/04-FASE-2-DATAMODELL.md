# Fase 2: Data-modell utvidelse

> Teknisk implementeringsguide

**Mål:** Støtte lagring av data per idrett
**Estimat:** 12 timer
**Avhengigheter:** Fase 1

---

## Oversikt

Uten sportId på data-tabellene vil all data "blande seg" mellom idretter. Denne fasen legger til sport-tracking på alle relevante modeller.

---

## Oppgave 2.1: Database schema endringer

### Modeller som trenger sportId

| Modell | Beskrivelse | Prioritet |
|--------|-------------|-----------|
| TrainingSession | Treningsøkter | Høy |
| Event | Turneringer/kamper | Høy |
| Test | Testresultater | Høy |
| Goal | Målsettinger | Høy |
| Exercise | Øvelser | Medium |
| SessionTemplate | Øktsplanmaler | Medium |

### Schema endringer

**Fil:** `apps/api/prisma/schema.prisma`

```prisma
model TrainingSession {
  id          String    @id @default(cuid())
  // ... eksisterende felt

  // LEGG TIL:
  sportId     SportId   @default(GOLF)

  // Indeks for rask filtrering
  @@index([sportId])
  @@index([playerId, sportId])
}

model Event {
  id          String    @id @default(cuid())
  // ... eksisterende felt

  // LEGG TIL:
  sportId     SportId   @default(GOLF)

  @@index([sportId])
  @@index([playerId, sportId])
}

model Test {
  id          String    @id @default(cuid())
  // ... eksisterende felt

  // LEGG TIL:
  sportId     SportId   @default(GOLF)

  @@index([sportId])
  @@index([playerId, sportId])
}

model Goal {
  id          String    @id @default(cuid())
  // ... eksisterende felt

  // LEGG TIL:
  sportId     SportId   @default(GOLF)

  @@index([sportId])
  @@index([playerId, sportId])
}

model Exercise {
  id          String    @id @default(cuid())
  // ... eksisterende felt

  // LEGG TIL:
  sportId     SportId   @default(GOLF)

  @@index([sportId])
}

model SessionTemplate {
  id          String    @id @default(cuid())
  // ... eksisterende felt

  // LEGG TIL:
  sportId     SportId   @default(GOLF)

  @@index([sportId])
  @@index([tenantId, sportId])
}
```

### Migrering

**Lag migreringsfil:** `prisma/migrations/[timestamp]_add_sport_to_data_models/migration.sql`

```sql
-- Legg til sportId kolonne på alle tabeller
-- Default til GOLF for eksisterende data

-- TrainingSession
ALTER TABLE "TrainingSession"
ADD COLUMN "sportId" "SportId" NOT NULL DEFAULT 'GOLF';

CREATE INDEX "TrainingSession_sportId_idx" ON "TrainingSession"("sportId");
CREATE INDEX "TrainingSession_playerId_sportId_idx" ON "TrainingSession"("playerId", "sportId");

-- Event
ALTER TABLE "Event"
ADD COLUMN "sportId" "SportId" NOT NULL DEFAULT 'GOLF';

CREATE INDEX "Event_sportId_idx" ON "Event"("sportId");
CREATE INDEX "Event_playerId_sportId_idx" ON "Event"("playerId", "sportId");

-- Test
ALTER TABLE "Test"
ADD COLUMN "sportId" "SportId" NOT NULL DEFAULT 'GOLF';

CREATE INDEX "Test_sportId_idx" ON "Test"("sportId");
CREATE INDEX "Test_playerId_sportId_idx" ON "Test"("playerId", "sportId");

-- Goal
ALTER TABLE "Goal"
ADD COLUMN "sportId" "SportId" NOT NULL DEFAULT 'GOLF';

CREATE INDEX "Goal_sportId_idx" ON "Goal"("sportId");
CREATE INDEX "Goal_playerId_sportId_idx" ON "Goal"("playerId", "sportId");

-- Exercise
ALTER TABLE "Exercise"
ADD COLUMN "sportId" "SportId" NOT NULL DEFAULT 'GOLF';

CREATE INDEX "Exercise_sportId_idx" ON "Exercise"("sportId");

-- SessionTemplate
ALTER TABLE "SessionTemplate"
ADD COLUMN "sportId" "SportId" NOT NULL DEFAULT 'GOLF';

CREATE INDEX "SessionTemplate_sportId_idx" ON "SessionTemplate"("sportId");
CREATE INDEX "SessionTemplate_tenantId_sportId_idx" ON "SessionTemplate"("tenantId", "sportId");
```

### Kjør migrering

```bash
cd apps/api
npx prisma migrate dev --name add_sport_to_data_models
npx prisma generate
```

---

## Oppgave 2.2: API oppdateringer

### Oppdater session queries

**Fil:** `apps/api/src/api/v1/sessions/service.ts`

```typescript
// FØR:
async getSessions(playerId: string) {
  return prisma.trainingSession.findMany({
    where: { playerId },
    orderBy: { date: 'desc' }
  });
}

// ETTER:
async getSessions(playerId: string, sportId?: SportId) {
  return prisma.trainingSession.findMany({
    where: {
      playerId,
      // Filtrer på sport hvis spesifisert
      ...(sportId && { sportId })
    },
    orderBy: { date: 'desc' }
  });
}

// Opprett med sport
async createSession(data: CreateSessionDto, sportId: SportId) {
  return prisma.trainingSession.create({
    data: {
      ...data,
      sportId  // Alltid sett sportId ved opprettelse
    }
  });
}
```

### Oppdater event queries

**Fil:** `apps/api/src/api/v1/events/service.ts`

```typescript
async getEvents(playerId: string, sportId?: SportId) {
  return prisma.event.findMany({
    where: {
      playerId,
      ...(sportId && { sportId })
    },
    orderBy: { date: 'desc' }
  });
}

async createEvent(data: CreateEventDto, sportId: SportId) {
  return prisma.event.create({
    data: {
      ...data,
      sportId
    }
  });
}
```

### Oppdater test queries

**Fil:** `apps/api/src/api/v1/tests/service.ts`

```typescript
async getTests(playerId: string, sportId?: SportId) {
  return prisma.test.findMany({
    where: {
      playerId,
      ...(sportId && { sportId })
    },
    orderBy: { date: 'desc' }
  });
}

async createTest(data: CreateTestDto, sportId: SportId) {
  return prisma.test.create({
    data: {
      ...data,
      sportId
    }
  });
}
```

### Oppdater goal queries

**Fil:** `apps/api/src/api/v1/goals/service.ts`

```typescript
async getGoals(playerId: string, sportId?: SportId) {
  return prisma.goal.findMany({
    where: {
      playerId,
      ...(sportId && { sportId })
    },
    orderBy: { deadline: 'asc' }
  });
}

async createGoal(data: CreateGoalDto, sportId: SportId) {
  return prisma.goal.create({
    data: {
      ...data,
      sportId
    }
  });
}
```

### Validering ved opprettelse

**Fil:** `apps/api/src/middleware/sportValidation.ts`

```typescript
import { Request, Response, NextFunction } from 'express';

export async function validateSportMatch(req: Request, res: Response, next: NextFunction) {
  const tenantId = req.user?.tenantId;
  const { sportId } = req.body;

  if (!sportId) {
    return next(); // sportId er optional i noen tilfeller
  }

  // Hent tenant's aktive sport
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { sportId: true }
  });

  if (tenant?.sportId !== sportId) {
    return res.status(400).json({
      error: 'Sport mismatch',
      message: `Cannot create ${sportId} data for a ${tenant?.sportId} tenant`
    });
  }

  next();
}
```

### Bruk middleware i routes

```typescript
// sessions/routes.ts
router.post('/',
  requireAuth,
  validateSportMatch,
  async (req, res, next) => {
    // ...
  }
);
```

---

## Oppgave 2.3: Frontend query oppdateringer

### Oppdater session fetching

**Fil:** `src/hooks/useSessions.ts`

```typescript
import { useSportSafe } from '@/contexts/SportContext';

export function useSessions(playerId: string) {
  const { sportId } = useSportSafe();

  return useQuery({
    queryKey: ['sessions', playerId, sportId],
    queryFn: async () => {
      const response = await api.get('/sessions', {
        params: { playerId, sportId }
      });
      return response.data;
    }
  });
}

export function useCreateSession() {
  const { sportId } = useSportSafe();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSessionDto) => {
      const response = await api.post('/sessions', {
        ...data,
        sportId  // Inkluder sport
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    }
  });
}
```

### Oppdater event fetching

**Fil:** `src/hooks/useEvents.ts`

```typescript
export function useEvents(playerId: string) {
  const { sportId } = useSportSafe();

  return useQuery({
    queryKey: ['events', playerId, sportId],
    queryFn: async () => {
      const response = await api.get('/events', {
        params: { playerId, sportId }
      });
      return response.data;
    }
  });
}
```

### Oppdater test fetching

**Fil:** `src/hooks/useTests.ts`

```typescript
export function useTests(playerId: string) {
  const { sportId } = useSportSafe();

  return useQuery({
    queryKey: ['tests', playerId, sportId],
    queryFn: async () => {
      const response = await api.get('/tests', {
        params: { playerId, sportId }
      });
      return response.data;
    }
  });
}
```

### Oppdater goal fetching

**Fil:** `src/hooks/useGoals.ts`

```typescript
export function useGoals(playerId: string) {
  const { sportId } = useSportSafe();

  return useQuery({
    queryKey: ['goals', playerId, sportId],
    queryFn: async () => {
      const response = await api.get('/goals', {
        params: { playerId, sportId }
      });
      return response.data;
    }
  });
}
```

---

## Data-migreringsstrategier

### Strategi 1: Alle eksisterende data er Golf (anbefalt)

Alle eksisterende data settes til GOLF. Dette er safe fordi:
- Systemet har kun vært brukt for golf
- Ingen dataendring nødvendig, bare default-verdi

### Strategi 2: Admin manuell tildeling

Lag et admin-script som lar deg sette sport på eksisterende data:

```typescript
// scripts/migrate-sport-data.ts

async function migrateSportData(tenantId: string, sportId: SportId) {
  // Oppdater alle sessions
  await prisma.trainingSession.updateMany({
    where: {
      player: { tenantId }
    },
    data: { sportId }
  });

  // Tilsvarende for events, tests, goals...
}
```

---

## Sjekkliste

- [ ] Schema oppdatert med sportId på alle modeller
- [ ] Indekser lagt til for ytelse
- [ ] Migrering kjørt uten feil
- [ ] Prisma client regenerert
- [ ] Session service oppdatert
- [ ] Event service oppdatert
- [ ] Test service oppdatert
- [ ] Goal service oppdatert
- [ ] Validering middleware laget
- [ ] Frontend hooks oppdatert med sportId i queryKey
- [ ] Frontend hooks sender sportId ved opprettelse
- [ ] Eksisterende data har GOLF som default
- [ ] API-tester oppdatert

---

## Mulige problemer

### 1. Store migreringer tar tid
Hvis det er mye data, kan ALTER TABLE ta lang tid.

**Løsning:** Kjør migrering i vedlikeholdsvindu.

### 2. Cache invalidering
Queries med gammel queryKey vil ikke refreshe.

**Løsning:** Inkluder sportId i alle queryKeys.

### 3. TypeScript feil
Prisma generate kan gi type-feil.

**Løsning:** Kjør `npx prisma generate` og restart TypeScript server.
