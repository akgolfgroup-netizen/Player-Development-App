# Plan: Generering av Årsplaner med Eksisterende Data og Tester

## Oversikt

Denne planen beskriver hvordan IUP Golf-plattformen kan bruke eksisterende data (tester, benchmarks, turneringsresultater) til å generere personaliserte årsplaner for spillere.

---

## Eksisterende Datakilder

### 1. Interne Testdata (20 IUP-tester)

| Kategori | Tester | Kobling til Strokes Gained |
|----------|--------|---------------------------|
| Speed | Test 1-2 (Driver/7-iron speed) | OTT (Off the Tee) |
| Distance | Test 3 (Driver carry) | OTT |
| Accuracy | Test 4-6 (PEI, Fairway, GIR) | OTT + APP |
| Short Game | Test 7-8 (Up&Down, Bunker) | ARG (Around the Green) |
| Putting | Test 9-11 (1.5m, 3m, 10m) | PUTT |
| Physical | Test 12-16 (Power, Mobility, Core) | Alle komponenter |
| Mental | Test 18-20 (Focus, Routine, Pressure) | Scoring |
| Scoring | Test 17 (9-hull score) | Total |

### 2. Eksterne Benchmarks

| Kilde | Antall | Beskrivelse |
|-------|--------|-------------|
| DataGolf | 11,271 spiller-sesonger | Strokes gained 2000-2026 |
| WAGR | 8,302 rankinger | World Amateur Golf Ranking |
| Golfbox | 35 turneringer, 2,305 resultater | Norske turneringer |

### 3. Kategorikrav

- 440 entries (11 nivåer × 40 krav)
- Definerer målverdier for hver test per nivå (K → A)

---

## Arkitektur for Årsplan-Generering

### Dataflyt

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATAINNSAMLING                               │
├─────────────────────────────────────────────────────────────────┤
│  TestResult      CategoryRequirement      DgPlayerSeason        │
│  (spillerens     (målverdier per          (pro benchmarks       │
│   resultater)     nivå)                    strokes gained)      │
└────────┬─────────────────┬────────────────────────┬─────────────┘
         │                 │                        │
         ▼                 ▼                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FOKUS-ANALYSE                                │
├─────────────────────────────────────────────────────────────────┤
│  FocusEngineService                                             │
│  ├─ calculatePlayerFocus()                                      │
│  ├─ mapTestsToComponents() → OTT, APP, ARG, PUTT               │
│  ├─ identifyWeaknesses() → gap til neste nivå                  │
│  └─ generateFocusSplit() → % fordeling per komponent           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PERIODISERING                                │
├─────────────────────────────────────────────────────────────────┤
│  PlanGenerationService                                          │
│  ├─ Fase 1: Grunnlag (uke 1-12) → Teknikk + Fysisk             │
│  ├─ Fase 2: Utvikling (uke 13-24) → Spesifikk trening          │
│  ├─ Fase 3: Konkurranse (uke 25-36) → Turneringsforberedelse   │
│  └─ Fase 4: Vedlikehold (uke 37-52) → Evaluering + Hvile       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DAGLIGE OPPDRAG                              │
├─────────────────────────────────────────────────────────────────┤
│  DailyTrainingAssignment (365 dager)                            │
│  ├─ sessionType: RANGE | SHORT_GAME | PUTTING | PHYSICAL | PLAY │
│  ├─ focusComponent: OTT | APP | ARG | PUTT                      │
│  ├─ suggestedDrills: [øvelser fra SessionTemplate]              │
│  └─ targetDuration: minutter                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementeringsplan

### Steg 1: Koble Tester til Strokes Gained Komponenter

**Fil:** `src/domain/focus-engine/test-component-mapping.ts`

```typescript
export const TEST_COMPONENT_MAPPING: Record<number, { component: string; weight: number }> = {
  // Speed & Distance → OTT
  1: { component: 'OTT', weight: 1.0 },  // Driver speed
  2: { component: 'OTT', weight: 0.7 },  // 7-iron speed
  3: { component: 'OTT', weight: 1.0 },  // Driver carry

  // Accuracy → OTT + APP
  4: { component: 'APP', weight: 1.0 },  // PEI (approach)
  5: { component: 'OTT', weight: 0.8 },  // Fairway accuracy
  6: { component: 'APP', weight: 1.0 },  // GIR simulation

  // Short Game → ARG
  7: { component: 'ARG', weight: 1.0 },  // Up & Down
  8: { component: 'ARG', weight: 0.8 },  // Bunker

  // Putting → PUTT
  9: { component: 'PUTT', weight: 1.0 },  // 1.5m putting
  10: { component: 'PUTT', weight: 1.0 }, // 3m putting
  11: { component: 'PUTT', weight: 0.8 }, // Lag putting

  // Physical → Alle (fordelt)
  12: { component: 'OTT', weight: 0.5 },  // Med ball throw
  13: { component: 'OTT', weight: 0.5 },  // Vertical jump
  14: { component: 'ALL', weight: 0.3 },  // Hip rotation
  15: { component: 'ALL', weight: 0.3 },  // Thoracic rotation
  16: { component: 'ALL', weight: 0.2 },  // Plank hold
};
```

---

### Steg 2: Beregne Spillerens Fokusområder

**Fil:** `src/domain/focus-engine/focus-engine.service.ts`

**Logikk:**
1. Hent spillerens siste testresultater
2. Sammenlign med CategoryRequirement for neste nivå
3. Beregn "gap" for hver test (% under målverdi)
4. Grupper gaps per strokes gained komponent
5. Generer fokussplit basert på største gaps

**Interface:**

```typescript
export interface PlayerFocus {
  playerId: string;
  currentLevel: string;
  targetLevel: string;
  focusSplit: {
    OTT: number;
    APP: number;
    ARG: number;
    PUTT: number;
  };
  prioritizedTests: number[];
  breakingPoints: string[];
  calculatedAt: Date;
}
```

**Eksempel output:**

```json
{
  "playerId": "uuid",
  "currentLevel": "G",
  "targetLevel": "F",
  "focusSplit": {
    "OTT": 0.25,
    "APP": 0.35,
    "ARG": 0.20,
    "PUTT": 0.20
  },
  "prioritizedTests": [4, 6, 7, 10],
  "breakingPoints": ["Test 4: PEI under 0.75", "Test 10: 3m putt under 60%"]
}
```

---

### Steg 3: Bruke DataGolf Benchmarks

**Fil:** `src/domain/benchmarks/benchmark.service.ts`

**Formål:** Gi spilleren kontekst om hvor pro-spillere scorer

```typescript
export interface BenchmarkContext {
  scoringRange: string;
  avgOTT: number;
  avgAPP: number;
  avgARG: number;
  avgPUTT: number;
  sampleSize: number;
}

export async function getBenchmarkContext(scoringAverage: number): Promise<BenchmarkContext> {
  // Finn lignende scoringsnivå i DataGolf
  const benchmarks = await prisma.dgPlayerSeason.findMany({
    where: {
      totalTrue: { gte: scoringAverage - 1, lte: scoringAverage + 1 }
    },
    select: {
      ottTrue: true,
      appTrue: true,
      argTrue: true,
      puttTrue: true,
    }
  });

  return {
    scoringRange: `${scoringAverage - 1} to ${scoringAverage + 1}`,
    avgOTT: average(benchmarks.map(b => Number(b.ottTrue))),
    avgAPP: average(benchmarks.map(b => Number(b.appTrue))),
    avgARG: average(benchmarks.map(b => Number(b.argTrue))),
    avgPUTT: average(benchmarks.map(b => Number(b.puttTrue))),
    sampleSize: benchmarks.length,
  };
}
```

---

### Steg 4: Generere Periodisert Årsplan

**Fil:** `src/domain/training-plan/periodization.ts`

**Periodiseringsmal basert på scoringsnivå:**

| Nivå | Grunnlag | Utvikling | Konkurranse | Vedlikehold |
|------|----------|-----------|-------------|-------------|
| K-H  | 16 uker  | 16 uker   | 12 uker     | 8 uker      |
| G-D  | 12 uker  | 16 uker   | 16 uker     | 8 uker      |
| C-A  | 8 uker   | 12 uker   | 24 uker     | 8 uker      |

**Ukentlig fordeling per fase:**

```typescript
export const PHASE_TEMPLATES = {
  FOUNDATION: {
    sessionTypes: {
      RANGE: 3,
      SHORT_GAME: 2,
      PUTTING: 2,
      PHYSICAL: 3,
      PLAY: 1,
    },
    focusWeighting: {
      technique: 0.5,
      physical: 0.3,
      mental: 0.2,
    }
  },
  DEVELOPMENT: {
    sessionTypes: {
      RANGE: 2,
      SHORT_GAME: 3,
      PUTTING: 2,
      PHYSICAL: 2,
      PLAY: 2,
    },
    focusWeighting: {
      technique: 0.4,
      physical: 0.2,
      scoring: 0.4,
    }
  },
  COMPETITION: {
    sessionTypes: {
      RANGE: 2,
      SHORT_GAME: 2,
      PUTTING: 2,
      PHYSICAL: 1,
      PLAY: 4,
    },
    focusWeighting: {
      technique: 0.2,
      physical: 0.1,
      mental: 0.3,
      scoring: 0.4,
    }
  },
  MAINTENANCE: {
    sessionTypes: {
      RANGE: 1,
      SHORT_GAME: 1,
      PUTTING: 1,
      PHYSICAL: 2,
      PLAY: 1,
      REST: 2,
    },
    focusWeighting: {
      recovery: 0.5,
      technique: 0.3,
      evaluation: 0.2,
    }
  }
};
```

---

### Steg 5: Generere Daglige Treningsoppdrag

**Fil:** `src/domain/training-plan/daily-assignment.service.ts`

**Algoritme:**
1. Bestem fase basert på uke i året
2. Velg sesjonstype basert på fasemal + ukedag
3. Velg fokuskomponent basert på spillerens focusSplit
4. Velg øvelser fra SessionTemplate som matcher komponent
5. Juster varighet basert på spillerens tilgjengelighet

**Eksempel daglig oppdrag:**

```json
{
  "date": "2025-03-15",
  "weekNumber": 11,
  "phase": "FOUNDATION",
  "sessionType": "SHORT_GAME",
  "focusComponent": "ARG",
  "title": "Kortspill - Up & Down Focus",
  "targetDuration": 60,
  "suggestedDrills": [
    {
      "name": "Gate Drill - Chipping",
      "duration": 15,
      "description": "Chip gjennom porter på ulike avstander"
    },
    {
      "name": "Up & Down Challenge",
      "duration": 30,
      "description": "10 posisjoner, noter prosent opp-og-ned"
    },
    {
      "name": "Bunker Proximity",
      "duration": 15,
      "description": "10 slag fra bunker, mål avstand til hull"
    }
  ],
  "relatedTest": 7,
  "targetImprovement": "Øke Up & Down fra 45% til 55%"
}
```

---

## Database-endringer

### Nye/Oppdaterte Modeller

Legg til i `prisma/schema.prisma`:

```prisma
model PlayerFocusCache {
  id               String   @id @default(uuid())
  playerId         String   @unique
  player           Player   @relation(fields: [playerId], references: [id])
  focusSplit       Json     // { OTT: 0.25, APP: 0.35, ARG: 0.20, PUTT: 0.20 }
  breakingPoints   Json     // ["Test 4: PEI under 0.75", ...]
  prioritizedTests Int[]    // [4, 6, 7, 10]
  currentLevel     String
  targetLevel      String
  calculatedAt     DateTime @default(now())
  expiresAt        DateTime // Recalculate monthly

  @@map("player_focus_cache")
}

model AnnualTrainingPlan {
  id              String   @id @default(uuid())
  playerId        String
  player          Player   @relation(fields: [playerId], references: [id])
  year            Int
  status          PlanStatus @default(DRAFT)
  periodization   Json     // Fasestruktur med uker
  weeklyTemplates Json     // Ukemaler per fase
  focusAreas      Json     // Fra PlayerFocusCache
  benchmarkData   Json?    // DataGolf kontekst
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  assignments     DailyTrainingAssignment[]

  @@unique([playerId, year])
  @@map("annual_training_plans")
}

model DailyTrainingAssignment {
  id              String   @id @default(uuid())
  planId          String
  plan            AnnualTrainingPlan @relation(fields: [planId], references: [id])
  date            DateTime
  weekNumber      Int
  phase           PlanPhase
  sessionType     SessionType
  focusComponent  StrokesGainedComponent
  title           String
  targetDuration  Int      // minutter
  suggestedDrills Json     // Array av øvelser
  relatedTestId   String?
  completed       Boolean  @default(false)
  actualDuration  Int?
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([planId, date])
  @@map("daily_training_assignments")
}

enum PlanStatus {
  DRAFT
  ACTIVE
  COMPLETED
  ARCHIVED
}

enum PlanPhase {
  FOUNDATION
  DEVELOPMENT
  COMPETITION
  MAINTENANCE
}

enum SessionType {
  RANGE
  SHORT_GAME
  PUTTING
  PHYSICAL
  PLAY
  REST
  MENTAL
}

enum StrokesGainedComponent {
  OTT
  APP
  ARG
  PUTT
  TOTAL
}
```

---

## API Endpoints

### Plan-generering

```
POST /api/v1/training-plans/generate
Body: {
  playerId: string,
  year: number,
  preferences?: {
    weeklyHours?: number,
    restDays?: number[],
    tournamentDates?: string[]
  }
}
Response: AnnualTrainingPlan med 52 uker + 365 daglige oppdrag
```

### Hent årsplan

```
GET /api/v1/training-plans/:playerId/:year
Response: AnnualTrainingPlan
```

### Hent daglige oppdrag

```
GET /api/v1/training-plans/:planId/assignments
Query: ?date=2025-03-15 | ?weekNumber=11 | ?from=2025-03-01&to=2025-03-31
Response: DailyTrainingAssignment[]
```

### Marker oppdrag som fullført

```
PATCH /api/v1/training-plans/assignments/:id
Body: {
  completed: true,
  actualDuration?: number,
  notes?: string
}
```

### Oppdater fokus (etter ny test)

```
POST /api/v1/players/:id/recalculate-focus
Response: Oppdatert PlayerFocusCache
```

---

## Implementeringsrekkefølge

| # | Oppgave | Fil(er) | Estimat |
|---|---------|---------|---------|
| 1 | TestComponentMapping | `src/domain/focus-engine/test-component-mapping.ts` | Liten |
| 2 | FocusEngineService utvidelse | `src/domain/focus-engine/focus-engine.service.ts` | Medium |
| 3 | PlayerFocusCache model + migration | `prisma/schema.prisma` | Liten |
| 4 | BenchmarkService | `src/domain/benchmarks/benchmark.service.ts` | Medium |
| 5 | PeriodizationTemplates | `src/domain/training-plan/periodization.ts` | Medium |
| 6 | PlanGenerationService | `src/domain/training-plan/plan-generation.service.ts` | Stor |
| 7 | DailyAssignmentGenerator | `src/domain/training-plan/daily-assignment.service.ts` | Stor |
| 8 | API routes | `src/routes/training-plan.routes.ts` | Medium |
| 9 | Frontend - Årsplan visning | `apps/web/src/features/annual-plan/` | Stor |
| 10 | Frontend - Daglig oppdrag | `apps/web/src/features/daily-training/` | Medium |

---

## Avhengigheter

- [x] TestResult-data for spilleren
- [x] CategoryRequirement seed-data (importert)
- [x] DataGolf DgPlayerSeason-data (importert)
- [ ] SessionTemplate-bibliotek med øvelser
- [ ] Drill-database med beskrivelser

---

## Suksesskriterier

1. En spiller kan få generert en personalisert årsplan basert på sine testresultater
2. Planen tilpasses automatisk når nye testresultater registreres
3. Daglige oppdrag er konkrete og handlingsrettede
4. Fokusområder korrelerer med spillerens svakheter vs. neste nivå
5. Periodiseringen følger sesongkalender med turneringer
6. Spilleren kan markere oppdrag som fullført og se progresjon

---

## Fremtidige Utvidelser

- **AI-drevet tilpasning**: Bruk maskinlæring for å optimalisere treningsfordeling basert på historiske resultater
- **Turneringsintegrasjon**: Automatisk justere periodisering basert på turneringskalender
- **Sosial funksjonalitet**: Sammenligne treningsvolum og progresjon med andre spillere
- **Push-varsler**: Daglige påminnelser om treningsoppdrag
- **Video-integrasjon**: Lenke øvelser til instruksjonsvideoer

---

*Sist oppdatert: 28. desember 2025*
