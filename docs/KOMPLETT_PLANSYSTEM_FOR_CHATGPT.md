# IUP Golf - Komplett Plansystem Dokumentasjon

> Denne filen inneholder all informasjon om hvordan årsplaner, periodisering og treningsplaner genereres i IUP Golf-systemet. Dokumentet er strukturert for analyse av AI-systemer.

---

## INNHOLDSFORTEGNELSE

1. [Systemarkitektur](#1-systemarkitektur)
2. [Intake/Onboarding](#2-intakeonboarding)
3. [Plangenerering](#3-plangenerering)
4. [Periodisering](#4-periodisering)
5. [Øktvalg](#5-øktvalg)
6. [Tester og Koblinger](#6-tester-og-koblinger)
7. [Breaking Points](#7-breaking-points)
8. [Focus Engine](#8-focus-engine)
9. [Database-modeller](#9-database-modeller)
10. [API-endepunkter](#10-api-endepunkter)
11. [Algoritmer og Formler](#11-algoritmer-og-formler)
12. [Konfigurasjonsdata](#12-konfigurasjonsdata)

---

## 1. SYSTEMARKITEKTUR

### Overordnet Dataflyt

```
INNDATA                    PROSESSERING                 UTDATA
────────────────────────────────────────────────────────────────────

Intake Form ──────────┐
                      │
Testresultater ───────┼───▶ Plan Generation ───▶ AnnualTrainingPlan
                      │     Service                     │
Club Speed ───────────┤                                 ├──▶ 52 Periodizations
Kalibrering           │                                 │
                      │                                 └──▶ 365 DailyAssignments
Turneringer ──────────┘
```

### Teknisk Stack

- **Backend**: Node.js + Fastify + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Arkitektur**: Domain-Driven Design (DDD)

### Filstruktur

```
apps/api/src/
├── domain/
│   ├── training-plan/
│   │   ├── plan-generation.service.ts      # Hovedalgoritme
│   │   ├── plan-generation.types.ts        # TypeScript-typer
│   │   ├── periodization-templates.ts      # 5 spillermaler
│   │   ├── session-selection.service.ts    # Øktvalg
│   │   ├── plan-progress.service.ts        # Fremdriftssporing
│   │   └── plan-review.service.ts          # Coach-godkjenning
│   ├── breaking-points/
│   │   ├── auto-creation.service.ts        # Auto-oppretting
│   │   └── types.ts                        # Typer
│   ├── focus-engine/
│   │   └── focus-engine.service.ts         # Treningsfordeling
│   ├── intake/
│   │   ├── intake-processing.service.ts    # Intake → Plan
│   │   └── intake.types.ts                 # Skjematyper
│   └── tests/
│       ├── test-calculator.ts              # Testberegninger
│       └── calculations/                   # Per-test logikk
├── api/v1/
│   ├── training-plan/index.ts              # API-ruter
│   └── intake/index.ts                     # Intake-ruter
└── prisma/
    ├── schema.prisma                       # Database-skjema
    └── seeds/                              # Seed-data
```

---

## 2. INTAKE/ONBOARDING

### 2.1 Skjemastruktur

Intake-skjemaet har 8 seksjoner (5 påkrevd, 3 valgfritt):

#### Seksjon 1: Bakgrunn (PÅKREVD)
```typescript
background: {
  yearsPlaying: number;           // 0-100
  currentHandicap: number;        // -5 til 54
  averageScore: number;           // 60-150 (KRITISK for kategorisering)
  roundsPerYear: number;          // 0-200
  trainingHistory: 'none' | 'sporadic' | 'regular' | 'systematic';
}
```

#### Seksjon 2: Tilgjengelighet (PÅKREVD)
```typescript
availability: {
  hoursPerWeek: number;           // 1-40 (anbefalt 8-25)
  preferredDays: number[];        // 0=søn, 1=man, ..., 6=lør
  canTravelToFacility: boolean;
  hasHomeEquipment: boolean;
  seasonalAvailability?: {
    summer: number;               // Timer om sommeren
    winter: number;               // Timer om vinteren
  };
}
```

#### Seksjon 3: Mål (PÅKREVD)
```typescript
goals: {
  primaryGoal: 'lower_handicap' | 'compete_tournaments' | 'consistency' | 'enjoy_more' | 'specific_skill';
  targetHandicap?: number;
  targetScore?: number;
  timeframe: '3_months' | '6_months' | '12_months';
  tournaments?: TournamentGoal[];
  specificFocus?: string[];
}

interface TournamentGoal {
  name: string;
  date: Date;
  importance: 'major' | 'important' | 'minor';  // Mappes til A/B/C
  targetPlacement?: string;
}
```

#### Seksjon 4: Svakheter (PÅKREVD)
```typescript
weaknesses: {
  biggestFrustration: string;     // Fritekst
  problemAreas: WeaknessArea[];   // Se liste under
  mentalChallenges?: MentalChallenge[];
  physicalLimitations?: PhysicalLimitation[];
}

type WeaknessArea =
  | 'driver_distance' | 'driver_accuracy' | 'iron_consistency'
  | 'approach_shots' | 'short_game' | 'putting_distance'
  | 'putting_direction' | 'bunker_play' | 'course_management' | 'mental_game';
```

#### Seksjon 5: Helse (PÅKREVD)
```typescript
health: {
  currentInjuries: Injury[];
  injuryHistory: Injury[];
  chronicConditions?: string[];
  mobilityIssues?: string[];
  ageGroup: '<25' | '25-35' | '35-45' | '45-55' | '55-65' | '65+';
}

interface Injury {
  type: string;
  dateOccurred?: Date;
  resolved: boolean;
  requiresModification: boolean;
  affectedAreas: string[];
}
```

#### Seksjon 6: Livsstil (VALGFRITT)
```typescript
lifestyle: {
  workSchedule: 'flexible' | 'regular_hours' | 'irregular' | 'shift_work';
  stressLevel: 1 | 2 | 3 | 4 | 5;    // 1=lav, 5=høy
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  nutritionFocus: boolean;
  physicalActivity: 'sedentary' | 'light' | 'moderate' | 'active';
}
```

#### Seksjon 7: Utstyr (VALGFRITT)
```typescript
equipment: {
  hasDriverSpeedMeasurement: boolean;
  driverSpeed?: number;              // mph (brukes til CS-level)
  recentClubFitting: boolean;
  accessToTrackMan: boolean;
  accessToGym: boolean;
  willingToInvest: 'minimal' | 'moderate' | 'significant';
}
```

#### Seksjon 8: Læring (VALGFRITT)
```typescript
learning: {
  preferredStyle: 'visual' | 'verbal' | 'kinesthetic' | 'mixed';
  wantsDetailedExplanations: boolean;
  prefersStructure: boolean;
  motivationType: 'competition' | 'personal_growth' | 'social' | 'achievement';
}
```

### 2.2 Intake Prosessering

```typescript
// intake-processing.service.ts

async generatePlanFromIntake(intakeId: string) {
  // 1. Hent intake
  const intake = await prisma.playerIntake.findUnique({ where: { id: intakeId } });

  // 2. Valider fullført
  if (!intake.isComplete) throw new Error('Intake not complete');

  // 3. Prosesser til strukturert format
  const processed = processIntakeData(intake);

  // 4. Konverter til plan-input
  const planInput = await convertToPlanGenerationInput(playerId, tenantId, processed);

  // 5. Generer plan
  const result = await PlanGenerationService.generateAnnualPlan(planInput);

  // 6. Link til intake
  await prisma.playerIntake.update({
    where: { id: intakeId },
    data: { generatedPlanId: result.annualPlan.id }
  });

  return result;
}
```

### 2.3 Prosessert Intake

```typescript
interface ProcessedIntake {
  playerCategory: 'E1' | 'A1' | 'I1' | 'D1' | 'B1';
  weeklyHoursTarget: number;
  planDuration: number;              // uker (typisk 52)
  startDate: Date;
  tournaments: Array<{
    name: string;
    startDate: Date;
    endDate: Date;
    importance: 'A' | 'B' | 'C';
  }>;
  priorityAreas: string[];           // Fra svakheter
  restrictions: string[];            // Fra skader
  preferredTrainingDays: number[];
  intensityModifiers: {
    reduceForAge: boolean;
    reduceForInjury: boolean;
    reduceForStress: boolean;
    increaseForGoals: boolean;
  };
}
```

---

## 3. PLANGENERERING

### 3.1 Hovedalgoritme

```typescript
// plan-generation.service.ts

static async generateAnnualPlan(input: GenerateAnnualPlanInput): Promise<AnnualPlanGenerationResult> {
  // STEG 1: Hent periodiseringsmal basert på score
  const template = getTemplateForScoringAverage(input.baselineAverageScore);
  const playerCategory = getPlayerCategory(input.baselineAverageScore);

  // STEG 2: Beregn planstruktur
  const endDate = new Date(input.startDate);
  endDate.setDate(endDate.getDate() + 364);  // 52 uker

  const weeklyHoursTarget = input.weeklyHoursTarget ||
    Math.round((template.weeklyHours[0] + template.weeklyHours[1]) / 2);

  const intensityProfile = calculateIntensityProfile(template);

  // STEG 3: Opprett AnnualTrainingPlan
  const annualPlan = await prisma.annualTrainingPlan.create({
    data: {
      playerId: input.playerId,
      tenantId: input.tenantId,
      planName: input.planName,
      startDate: input.startDate,
      endDate,
      status: 'active',
      baselineAverageScore: input.baselineAverageScore,
      baselineHandicap: input.baselineHandicap,
      baselineDriverSpeed: input.baselineDriverSpeed,
      playerCategory,
      basePeriodWeeks: template.basePeriodWeeks,
      specializationWeeks: template.specializationWeeks,
      tournamentWeeks: template.tournamentWeeks,
      weeklyHoursTarget,
      intensityProfile,
      generatedAt: new Date(),
    },
  });

  // STEG 4: Planlegg turneringer
  const tournamentSchedules = await scheduleTournaments(
    annualPlan.id,
    input.startDate,
    input.tournaments || [],
    template
  );

  // STEG 5: Generer periodiseringsstruktur (52 uker)
  const periodizationWeeks = generatePeriodizationStructure(
    input.startDate,
    template,
    tournamentSchedules
  );

  await prisma.periodization.createMany({
    data: periodizationWeeks.map(week => ({
      playerId: input.playerId,
      annualPlanId: annualPlan.id,
      weekNumber: week.weekNumber,
      period: week.period,
      periodPhase: week.periodPhase,
      weekInPeriod: week.weekInPeriod,
      volumeIntensity: week.volumeIntensity,
      plannedHours: week.targetHours,
    })),
  });

  // STEG 6: Hent club speed level
  const clubSpeedLevel = await getPlayerClubSpeedLevel(
    input.playerId,
    input.baselineDriverSpeed
  );

  // STEG 7: Hent breaking points
  const breakingPoints = await prisma.breakingPoint.findMany({
    where: {
      playerId: input.playerId,
      status: { in: ['not_started', 'in_progress'] },
    },
    select: { id: true },
  });
  const breakingPointIds = breakingPoints.map(bp => bp.id);

  // STEG 8: Generer daglige oppdrag (365 dager)
  const dailyAssignments = await generateDailyAssignments(
    annualPlan.id,
    input.playerId,
    input.tenantId,
    input.startDate,
    periodizationWeeks,
    clubSpeedLevel,
    breakingPointIds,
    input.preferredTrainingDays,
    input.excludeDates || []
  );

  // STEG 9: Returner resultat
  return {
    annualPlan: { id, playerId, planName, startDate, endDate, playerCategory, ... },
    periodizations: { created: 52, weekRange: { from: 1, to: 52 } },
    dailyAssignments: { created: dailyAssignments.created, ... },
    tournaments: { scheduled: tournamentSchedules.length, ... },
    breakingPoints: { linked: breakingPointIds.length },
  };
}
```

### 3.2 Input-parametere

```typescript
interface GenerateAnnualPlanInput {
  playerId: string;                  // UUID
  tenantId: string;                  // UUID
  startDate: Date;                   // Planens startdato
  baselineAverageScore: number;      // 60-150 (KRITISK)
  baselineHandicap?: number;         // -5 til 54
  baselineDriverSpeed?: number;      // mph (for CS-level)
  planName?: string;                 // Valgfritt navn
  weeklyHoursTarget?: number;        // 8-25 timer
  tournaments?: TournamentInput[];   // Turneringsliste
  preferredTrainingDays?: number[];  // 0-6 (søn-lør)
  excludeDates?: Date[];             // Datoer å ekskludere
}

interface TournamentInput {
  tournamentId?: string;
  name: string;
  startDate: Date;
  endDate: Date;
  importance: 'A' | 'B' | 'C';
}
```

---

## 4. PERIODISERING

### 4.1 Spillerkategorier

```typescript
function getPlayerCategory(averageScore: number): string {
  if (averageScore < 70) return 'E1';   // Elite
  if (averageScore < 75) return 'A1';   // Advanced
  if (averageScore < 80) return 'I1';   // Intermediate
  if (averageScore < 85) return 'D1';   // Developing
  return 'B1';                          // Beginner
}
```

### 4.2 Periodiseringsmaler (5 stk)

```typescript
const PERIODIZATION_TEMPLATES = {
  elite: {
    scoringRange: { min: 0, max: 70 },
    basePeriodWeeks: 16,
    specializationWeeks: 24,
    tournamentWeeks: 10,
    recoveryWeeks: 2,
    weeklyHours: [18, 25],
    intensity: {
      base: 'high',
      specialization: 'peak',
      tournament: 'peak',
    },
    focusAreas: {
      base: ['Technical mastery', 'Physical conditioning', 'Mental resilience'],
      specialization: ['Competition-specific skills', 'Breaking point optimization', 'Course management'],
      tournament: ['Peak performance', 'Mental game', 'Recovery optimization'],
    },
    learningPhaseDistribution: {
      base: ['L1', 'L2', 'L3'],
      specialization: ['L3', 'L4', 'L5'],
      tournament: ['L4', 'L5'],
    },
    settingsDistribution: {
      base: ['S1', 'S2', 'S3', 'S4', 'S5'],
      specialization: ['S5', 'S6', 'S7', 'S8'],
      tournament: ['S8', 'S9', 'S10'],
    },
    periodDistribution: {
      base: ['E', 'G'],
      specialization: ['G', 'S'],
      tournament: ['S', 'T'],
    },
  },

  advanced: {
    scoringRange: { min: 70, max: 75 },
    basePeriodWeeks: 20,
    specializationWeeks: 20,
    tournamentWeeks: 10,
    recoveryWeeks: 2,
    weeklyHours: [15, 20],
    intensity: { base: 'medium', specialization: 'high', tournament: 'peak' },
    learningPhaseDistribution: {
      base: ['L1', 'L2', 'L3'],
      specialization: ['L2', 'L3', 'L4', 'L5'],
      tournament: ['L4', 'L5'],
    },
    // ... lignende struktur
  },

  intermediate: {
    scoringRange: { min: 75, max: 80 },
    basePeriodWeeks: 24,
    specializationWeeks: 18,
    tournamentWeeks: 8,
    recoveryWeeks: 2,
    weeklyHours: [12, 18],
    intensity: { base: 'medium', specialization: 'high', tournament: 'peak' },
    learningPhaseDistribution: {
      base: ['L1', 'L2', 'L3'],
      specialization: ['L2', 'L3', 'L4'],
      tournament: ['L3', 'L4', 'L5'],
    },
  },

  developing: {
    scoringRange: { min: 80, max: 85 },
    basePeriodWeeks: 28,
    specializationWeeks: 16,
    tournamentWeeks: 6,
    recoveryWeeks: 2,
    weeklyHours: [10, 15],
    intensity: { base: 'medium', specialization: 'high', tournament: 'taper' },
    learningPhaseDistribution: {
      base: ['L1', 'L2'],
      specialization: ['L2', 'L3', 'L4'],
      tournament: ['L3', 'L4'],
    },
  },

  beginner: {
    scoringRange: { min: 85, max: 200 },
    basePeriodWeeks: 32,
    specializationWeeks: 14,
    tournamentWeeks: 4,
    recoveryWeeks: 2,
    weeklyHours: [8, 12],
    intensity: { base: 'medium', specialization: 'medium', tournament: 'medium' },
    learningPhaseDistribution: {
      base: ['L1', 'L2'],
      specialization: ['L2', 'L3'],
      tournament: ['L3'],
    },
  },
};
```

### 4.3 Periodeoversikt

| Kategori | Base | Spesialisering | Turnering | Recovery | Timer/uke |
|----------|------|----------------|-----------|----------|-----------|
| Elite (E1) | 16 | 24 | 10 | 2 | 18-25 |
| Advanced (A1) | 20 | 20 | 10 | 2 | 15-20 |
| Intermediate (I1) | 24 | 18 | 8 | 2 | 12-18 |
| Developing (D1) | 28 | 16 | 6 | 2 | 10-15 |
| Beginner (B1) | 32 | 14 | 4 | 2 | 8-12 |

### 4.4 Periode-koder (E/G/S/T)

```
E = Etablering (Grunnlagsperiode tidlig)
G = Generell (Grunnlagsperiode sen)
S = Spesialisering
T = Turnering
```

| Periode | Fokus | Læringsfaser | Settings | Volum |
|---------|-------|--------------|----------|-------|
| E | Teknisk fundamenter | L1-L3 | S1-S3 | Medium→Høy |
| G | Allsidig utvikling | L1-L4 | S3-S6 | Medium-Høy |
| S | Konkurransespesifikk | L2-L5 | S5-S8 | Høy |
| T | Peak prestasjon | L3-L5 | S7-S10 | Peak→Taper |

### 4.5 Periodiserings-generering

```typescript
function generatePeriodizationStructure(
  startDate: Date,
  template: PeriodizationTemplate,
  tournaments: TournamentSchedule[]
): PeriodizationWeek[] {
  const weeks: PeriodizationWeek[] = [];
  const currentDate = new Date(startDate);

  // BASE PERIODE
  for (let i = 0; i < template.basePeriodWeeks; i++) {
    const weekNumber = i + 1;
    const period = i < template.basePeriodWeeks / 2 ? 'E' : 'G';

    weeks.push({
      weekNumber,
      startDate: new Date(currentDate),
      endDate: addDays(currentDate, 6),
      period,
      periodPhase: 'base',
      weekInPeriod: i + 1,
      learningPhases: template.learningPhaseDistribution.base,
      volumeIntensity: calculateVolumeIntensity('base', i, template.basePeriodWeeks),
      targetHours: template.weeklyHours[0],
    });

    currentDate.setDate(currentDate.getDate() + 7);
  }

  // SPESIALISERINGSPERIODE
  for (let i = 0; i < template.specializationWeeks; i++) {
    const weekNumber = template.basePeriodWeeks + i + 1;
    const period = i < template.specializationWeeks / 2 ? 'G' : 'S';

    weeks.push({
      weekNumber,
      period,
      periodPhase: 'specialization',
      volumeIntensity: calculateVolumeIntensity('specialization', i, template.specializationWeeks),
      targetHours: template.weeklyHours[1],
      // ...
    });

    currentDate.setDate(currentDate.getDate() + 7);
  }

  // TURNERINGSPERIODE
  for (let i = 0; i < template.tournamentWeeks; i++) {
    const weekNumber = template.basePeriodWeeks + template.specializationWeeks + i + 1;
    const period = i < template.tournamentWeeks / 3 ? 'S' : 'T';

    weeks.push({
      weekNumber,
      period,
      periodPhase: 'tournament',
      volumeIntensity: calculateVolumeIntensity('tournament', i, template.tournamentWeeks),
      // ...
    });

    currentDate.setDate(currentDate.getDate() + 7);
  }

  // RECOVERY PERIODE
  for (let i = 0; i < template.recoveryWeeks; i++) {
    weeks.push({
      weekNumber: template.basePeriodWeeks + template.specializationWeeks + template.tournamentWeeks + i + 1,
      period: 'G',
      periodPhase: 'recovery',
      volumeIntensity: 'low',
      targetHours: Math.round(template.weeklyHours[0] / 2),
      // ...
    });
  }

  // Juster for turneringer
  applyTournamentAdjustments(weeks, tournaments);

  return weeks;
}
```

### 4.6 Volum-intensitet Beregning

```typescript
function calculateVolumeIntensity(phase: string, weekIndex: number, totalWeeks: number): string {
  const progress = weekIndex / totalWeeks;

  if (phase === 'base') {
    if (progress < 0.3) return 'medium';
    if (progress < 0.7) return 'high';
    return 'medium';  // Nedtrapping mot slutten
  }

  if (phase === 'specialization') {
    return 'high';
  }

  if (phase === 'tournament') {
    if (progress < 0.5) return 'peak';
    return 'taper';
  }

  return 'low';  // Recovery
}
```

---

## 5. ØKTVALG

### 5.1 Session Selection Service

```typescript
// session-selection.service.ts

static async selectSessionForDay(context: DailyAssignmentContext): Promise<SelectedSession | null> {
  // Hviledag = ingen økt
  if (context.isRestDay) return null;

  // Beregn tilgjengelig tid
  const remainingHours = context.targetHoursThisWeek - context.hoursAllocatedSoFar;
  const targetDuration = Math.min(remainingHours * 60, 180);  // Max 3 timer

  if (targetDuration < 30) return null;  // For kort tid

  // Hent nylig brukte maler (siste 7 dager)
  const recentlyUsedTemplateIds = await getRecentlyUsedTemplates(context.playerId);

  // Bygg utvalgskriterier
  const criteria: SessionSelectionCriteria = {
    period: context.period,
    learningPhases: context.learningPhases,
    clubSpeed: context.clubSpeedLevel,
    settings: context.settings,
    breakingPointIds: context.breakingPointIds,
    targetDuration,
    intensity: context.intensity,
    excludeTemplateIds: recentlyUsedTemplateIds,
  };

  return await selectSession(criteria, context.tenantId);
}
```

### 5.2 Utvalgskriterier

```typescript
interface SessionSelectionCriteria {
  period: string;              // 'E' | 'G' | 'S' | 'T'
  learningPhases: string[];    // ['L1', 'L2', 'L3']
  clubSpeed: string;           // 'CS80', 'CS90', etc.
  settings: string[];          // ['S1', 'S2', 'S3']
  breakingPointIds: string[];  // UUIDs til spillerens breaking points
  targetDuration: number;      // Minutter (30-180)
  intensity: string;           // 'low', 'medium', 'high', 'peak', 'taper'
  excludeTemplateIds: string[]; // Nylig brukte
}
```

### 5.3 Scoringsalgoritme

```typescript
function scoreTemplate(template: SessionTemplate, criteria: SessionSelectionCriteria): number {
  let score = 0;

  // +100: Eksakt periode-match
  if (template.periods.includes(criteria.period)) {
    score += 100;
  }

  // +50: Læringsfase-match
  if (criteria.learningPhases.includes(template.learningPhase)) {
    score += 50;
  }

  // +50: Varighet nær mål (maks 50 - differanse)
  const durationDiff = Math.abs(template.duration - criteria.targetDuration);
  score += Math.max(0, 50 - durationDiff);

  // +30: Klubbhastighet-match
  if (template.clubSpeed === criteria.clubSpeed) {
    score += 30;
  }

  // +30: Settings-match
  if (criteria.settings.includes(template.setting)) {
    score += 30;
  }

  // +40: Intensitet-match
  const estimatedIntensity = template.duration >= 90 ? 'high' : template.duration >= 60 ? 'medium' : 'low';
  if (estimatedIntensity === criteria.intensity) {
    score += 40;
  }

  // +20: Breaking point-relevans
  if (criteria.breakingPointIds.length > 0) {
    score += calculateBreakingPointRelevance(template, criteria.breakingPointIds);
  }

  // -2: Per tidligere bruk (for variasjon)
  const usageCount = template._count?.dailyAssignments || 0;
  score -= usageCount * 2;

  return score;
}
```

### 5.4 Periode-kompatibilitet

```typescript
function getCompatiblePeriods(period: string): string[] {
  const compatibility = {
    'E': ['E'],
    'G': ['E', 'G'],
    'S': ['G', 'S'],
    'T': ['S', 'T'],
  };
  return compatibility[period] || [period];
}
```

### 5.5 Hviledag-logikk

```typescript
function shouldBeRestDay(
  dayOfWeek: number,
  intensity: string,
  preferredTrainingDays?: number[]
): boolean {
  // Hvis foretrukne dager er satt
  if (preferredTrainingDays?.length > 0) {
    return !preferredTrainingDays.includes(dayOfWeek);
  }

  // Standard hviledag-logikk
  if (dayOfWeek === 0) return true;  // Søndag alltid hvile

  // Peak/High: 1 hviledag (søndag)
  if (intensity === 'peak' || intensity === 'high') {
    return dayOfWeek === 0;
  }

  // Medium: 2 hviledager (søndag, onsdag)
  if (intensity === 'medium') {
    return dayOfWeek === 0 || dayOfWeek === 3;
  }

  // Low/Taper: 3 hviledager (søndag, onsdag, fredag)
  return dayOfWeek === 0 || dayOfWeek === 3 || dayOfWeek === 5;
}
```

### 5.6 Ukentlig øktfordeling

```typescript
function getWeeklySessionDistribution(periodPhase: string, weeklyHours: number): Record<string, number> {
  const distributions = {
    base: {
      technical: 0.40,
      physical: 0.30,
      mental: 0.15,
      recovery: 0.15,
    },
    specialization: {
      technical: 0.35,
      physical: 0.25,
      mental: 0.20,
      tactical: 0.20,
    },
    tournament: {
      tactical: 0.40,
      mental: 0.30,
      technical: 0.20,
      recovery: 0.10,
    },
    recovery: {
      recovery: 0.60,
      mental: 0.20,
      technical: 0.20,
    },
  };

  const distribution = distributions[periodPhase] || distributions.base;

  const result = {};
  for (const [type, percentage] of Object.entries(distribution)) {
    result[type] = Math.round(weeklyHours * percentage);
  }

  return result;
}
```

---

## 6. TESTER OG KOBLINGER

### 6.1 20 Team Norway Tester

| # | Navn | Kategori | Enhet | Beregning |
|---|------|----------|-------|-----------|
| 1 | Driver Avstand | Distanse | Meter | Topp 3 snitt av 6 |
| 2 | 3-Tre Avstand | Distanse | Meter | Topp 3 snitt av 6 |
| 3 | 5-Jern Avstand | Distanse | Meter | Topp 3 snitt av 6 |
| 4 | PW Avstand | Distanse | Meter | Topp 3 snitt av 6 |
| 5 | Klubbhastighet Driver | Hastighet | km/h | Topp 3 snitt av 6 |
| 6 | Ballhastighet Driver | Hastighet | km/h | Topp 3 snitt av 6 |
| 7 | Smash Factor | Effektivitet | Ratio | Topp 3 snitt |
| 8 | Approach 25m | Accuracy | PEI | avg_dist / 2.5 |
| 9 | Approach 50m | Accuracy | PEI | avg_dist / 5.0 |
| 10 | Approach 75m | Accuracy | PEI | avg_dist / 7.5 |
| 11 | Approach 100m | Accuracy | PEI | avg_dist / 10.0 |
| 12 | Benkpress 1RM | Fysisk | kg | Direkte verdi |
| 13 | Trap Bar Markløft | Fysisk | kg | Direkte verdi |
| 14 | 3000m Løp | Kondisjon | Sekunder | Tid |
| 15 | Putting 3m | Short Game | % | Suksessrate |
| 16 | Putting 6m | Short Game | % | Suksessrate |
| 17 | Chipping | Short Game | cm | Snitt avstand |
| 18 | Bunker | Short Game | cm | Snitt avstand |
| 19 | 9-Hole Simulering | On-Course | Score | Komplett statistikk |
| 20 | On-Course Skills | On-Course | Score | 3-6 hull statistikk |

### 6.2 Test → Komponent Mapping

```typescript
// TestComponentMapping-tabell
const testComponentMappings = [
  { testNumber: 1, component: 'OTT', weight: 1.0 },   // Driver avstand → Off-the-Tee
  { testNumber: 2, component: 'OTT', weight: 0.8 },   // 3-tre
  { testNumber: 5, component: 'OTT', weight: 1.0 },   // Klubbhastighet
  { testNumber: 6, component: 'OTT', weight: 0.9 },   // Ballhastighet
  { testNumber: 8, component: 'APP', weight: 1.0 },   // Approach 25m
  { testNumber: 9, component: 'APP', weight: 1.0 },   // Approach 50m
  { testNumber: 10, component: 'APP', weight: 1.0 },  // Approach 75m
  { testNumber: 11, component: 'APP', weight: 1.0 },  // Approach 100m
  { testNumber: 17, component: 'ARG', weight: 1.0 },  // Chipping → Around-the-Green
  { testNumber: 18, component: 'ARG', weight: 0.9 },  // Bunker
  { testNumber: 15, component: 'PUTT', weight: 1.0 }, // Putting 3m
  { testNumber: 16, component: 'PUTT', weight: 0.9 }, // Putting 6m
];
```

### 6.3 Kategori-krav (A-K)

```typescript
// 11 kategorier × 20 tester × 2 kjønn = 440 krav
const categoryRequirements = {
  // Test 1: Driver Avstand (meter)
  test1: {
    men: { A: 270, B: 260, C: 250, D: 240, E: 230, F: 220, G: 210, H: 200, I: 190, J: 180, K: 170 },
    women: { A: 240, B: 230, C: 220, D: 210, E: 200, F: 190, G: 180, H: 170, I: 160, J: 150, K: 140 },
  },
  // Test 5: Klubbhastighet (km/h)
  test5: {
    men: { A: 193, B: 185, C: 177, D: 169, E: 161, F: 153, G: 145, H: 137, I: 129, J: 121, K: 113 },
    women: { A: 169, B: 161, C: 153, D: 145, E: 137, F: 129, G: 121, H: 113, I: 105, J: 97, K: 89 },
  },
  // Test 8-11: Approach PEI (lavere er bedre)
  test8to11: {
    all: { A: 1.0, B: 1.2, C: 1.4, D: 1.6, E: 1.8, F: 2.0, G: 2.2, H: 2.4, I: 2.6, J: 2.8, K: 3.0 },
  },
  // ... etc for alle 20 tester
};
```

### 6.4 Testresultat → Spillerkategori

```typescript
// averageScore brukes til å velge periodiseringsmal
// Testresultater kan også oppdatere averageScore over tid

function updatePlayerCategoryFromTests(playerId: string, testResults: TestResult[]) {
  // Test 19 (9-hole) og Test 20 (on-course) gir direkte score-indikasjon
  const onCourseTests = testResults.filter(t => t.testNumber >= 19);

  if (onCourseTests.length > 0) {
    const avgScore = calculateAverageFromOnCourseTests(onCourseTests);
    // Oppdater player.averageScore
  }
}
```

---

## 7. BREAKING POINTS

### 7.1 Auto-oppretting fra Kalibrering

```typescript
// breaking-points/auto-creation.service.ts

static async createFromCalibration(input: AutoCreateBreakingPointInput): Promise<BreakingPointCreationResult> {
  const { playerId, tenantId, calibrationId, speedProfile, clubSpeedLevel } = input;
  const createdBreakingPoints = [];

  // SJEKK SVAKESTE KLUBB
  if (speedProfile.weakestClub) {
    const weakClubData = await getClubDeviation(calibrationId, speedProfile.weakestClub);

    if (weakClubData && Math.abs(weakClubData.deviation) >= DEVIATION_THRESHOLDS.LOW) {
      const severity = calculateSeverity(Math.abs(weakClubData.deviation));
      const hoursPerWeek = HOURS_PER_WEEK_BY_SEVERITY[severity];

      const exercises = await findRelevantExercises({
        tenantId,
        clubSpeedLevel,
        clubType: speedProfile.weakestClub,
        processCategory: 'speed',
      });

      const breakingPoint = await prisma.breakingPoint.create({
        data: {
          playerId,
          processCategory: 'speed',
          specificArea: `${formatClubName(speedProfile.weakestClub)} speed efficiency`,
          description: `Club speed is ${deviation}% below expected...`,
          severity,
          baselineMeasurement: `${actualSpeed} mph`,
          targetMeasurement: `${expectedSpeed} mph`,
          assignedExerciseIds: exercises.map(e => e.id),
          hoursPerWeek,
          status: 'not_started',
          sourceType: 'calibration',
          calibrationId,
          clubType: speedProfile.weakestClub,
          deviationPercent: Math.abs(deviation),
          autoDetected: true,
        },
      });

      createdBreakingPoints.push(breakingPoint);
    }
  }

  // SJEKK SPEED DECAY MØNSTER
  if (speedProfile.speedDecay === 'steep') {
    // Opprett breaking point for fysisk kondisjon
    await prisma.breakingPoint.create({
      data: {
        playerId,
        processCategory: 'physical',
        specificArea: 'Speed maintenance through the bag',
        severity: 'medium',
        hoursPerWeek: 3,
        // ...
      },
    });
  }

  return { created: createdBreakingPoints.length, breakingPoints: createdBreakingPoints };
}
```

### 7.2 Avviksterskel → Severity

```typescript
const DEVIATION_THRESHOLDS = {
  LOW: 5,      // 5-10% avvik
  MEDIUM: 10,  // 10-15% avvik
  HIGH: 15,    // >15% avvik
};

const HOURS_PER_WEEK_BY_SEVERITY = {
  low: 2,
  medium: 3,
  high: 4,
};

function calculateSeverity(deviationPercent: number): 'low' | 'medium' | 'high' {
  if (deviationPercent >= DEVIATION_THRESHOLDS.HIGH) return 'high';
  if (deviationPercent >= DEVIATION_THRESHOLDS.MEDIUM) return 'medium';
  return 'low';
}
```

### 7.3 Breaking Point Fremdrift

```typescript
// plan-progress.service.ts

static async updateBreakingPointProgress(playerId: string, completedSessionId: string): Promise<void> {
  const breakingPoints = await prisma.breakingPoint.findMany({
    where: {
      playerId,
      status: { in: ['not_started', 'in_progress'] },
    },
  });

  // Øk progress med 2% per fullført økt
  const updateOperations = breakingPoints.map(bp => {
    const currentProgress = bp.progressPercent || 0;
    const newProgress = Math.min(100, currentProgress + 2);

    return prisma.breakingPoint.update({
      where: { id: bp.id },
      data: {
        progressPercent: newProgress,
        status: newProgress >= 100 ? 'resolved' : newProgress > 0 ? 'in_progress' : 'not_started',
      },
    });
  });

  await prisma.$transaction(updateOperations);
}
```

---

## 8. FOCUS ENGINE

### 8.1 Treningsfordeling Beregning

```typescript
// focus-engine.service.ts

async calculatePlayerFocus(tenantId: string, userId: string): Promise<PlayerFocusResult> {
  const player = await prisma.player.findFirst({ where: { userId, tenantId } });

  // Hent vekter
  const weights = await weightsService.getOrComputeWeights();

  // Hent test-komponent mappinger
  const mappings = await getTestComponentMappings();

  // Hent testresultater (siste 50)
  const testResults = await getPlayerTestResults(player.id);

  // Beregn komponent-scorer
  const componentScores = calculateComponentScores(testResults, mappings);

  // Beregn fokus
  const focusOutput = calculateFocus(componentScores, weights);

  return {
    playerId: player.id,
    playerName: `${player.firstName} ${player.lastName}`,
    ...focusOutput,
    computedAt: new Date(),
  };
}
```

### 8.2 Komponent-score Beregning

```typescript
function calculateComponentScores(testResults, mappings): Record<Component, { score: number; count: number }> {
  const scores = {
    OTT: { total: 0, weightSum: 0, count: 0 },
    APP: { total: 0, weightSum: 0, count: 0 },
    ARG: { total: 0, weightSum: 0, count: 0 },
    PUTT: { total: 0, weightSum: 0, count: 0 },
  };

  // Grupper etter test (bruk nyeste per test)
  const latestByTest = new Map();
  for (const result of testResults) {
    if (!latestByTest.has(result.testNumber)) {
      latestByTest.set(result.testNumber, result.value);
    }
  }

  // Aggreger per komponent
  for (const [testNumber, value] of latestByTest) {
    const mapping = mappings.find(m => m.testNumber === testNumber);
    if (!mapping) continue;

    const component = mapping.component;
    scores[component].total += value * mapping.weight;
    scores[component].weightSum += mapping.weight;
    scores[component].count++;
  }

  // Beregn vektet snitt
  const result = {};
  for (const component of ['OTT', 'APP', 'ARG', 'PUTT']) {
    result[component] = {
      score: scores[component].weightSum > 0
        ? scores[component].total / scores[component].weightSum
        : 0,
      count: scores[component].count,
    };
  }

  return result;
}
```

### 8.3 Fokus Beregning

```typescript
function calculateFocus(componentScores, weights): FocusOutput {
  const components = ['OTT', 'APP', 'ARG', 'PUTT'];
  const weightMap = { OTT: weights.wOtt, APP: weights.wApp, ARG: weights.wArg, PUTT: weights.wPutt };

  // Konverter til persentiler
  const percentiles = {};
  for (const c of components) {
    percentiles[c] = scoreToPercentile(componentScores[c].score);
  }

  // Beregn svakhet (gap fra mål-persentil 75)
  const weaknesses = {};
  for (const c of components) {
    weaknesses[c] = Math.max(0, 75 - percentiles[c]) / 100;
  }

  // Beregn prioritet (svakhet × vekt)
  const priorities = {};
  for (const c of components) {
    priorities[c] = weaknesses[c] * weightMap[c];
  }

  // Finn fokuskomponent (høyest prioritet)
  let focusComponent = 'APP';
  let maxPriority = 0;
  for (const c of components) {
    if (priorities[c] > maxPriority) {
      maxPriority = priorities[c];
      focusComponent = c;
    }
  }

  // Beregn anbefalt fordeling (10-50% per komponent)
  const totalPriority = Object.values(priorities).reduce((a, b) => a + b, 0);
  const recommendedSplit = {};
  for (const c of components) {
    let split = totalPriority > 0 ? priorities[c] / totalPriority : 0.25;
    split = Math.max(0.10, Math.min(0.50, split));  // Clamp til 10-50%
    recommendedSplit[c] = split;
  }

  return {
    focusComponent,
    focusScores: {
      OTT: Math.round(100 - percentiles.OTT),
      APP: Math.round(100 - percentiles.APP),
      ARG: Math.round(100 - percentiles.ARG),
      PUTT: Math.round(100 - percentiles.PUTT),
    },
    recommendedSplit,
    reasonCodes: [...],
    confidence: totalTests >= 6 ? 'high' : totalTests >= 3 ? 'med' : 'low',
  };
}
```

---

## 9. DATABASE-MODELLER

### 9.1 AnnualTrainingPlan

```prisma
model AnnualTrainingPlan {
  id                    String   @id @default(uuid())
  playerId              String
  tenantId              String
  planName              String   @db.VarChar(255)
  startDate             DateTime
  endDate               DateTime
  status                String   @db.VarChar(20)  // 'draft', 'active', 'completed', 'archived'
  baselineAverageScore  Decimal  @db.Decimal(5, 2)
  baselineHandicap      Decimal? @db.Decimal(4, 1)
  baselineDriverSpeed   Decimal? @db.Decimal(5, 1)
  playerCategory        String   @db.VarChar(10)  // 'E1', 'A1', 'I1', 'D1', 'B1'
  basePeriodWeeks       Int
  specializationWeeks   Int
  tournamentWeeks       Int
  weeklyHoursTarget     Int
  intensityProfile      Json
  generatedAt           DateTime

  player                Player   @relation(...)
  periodizations        Periodization[]
  dailyAssignments      DailyTrainingAssignment[]
  scheduledTournaments  ScheduledTournament[]
}
```

### 9.2 Periodization

```prisma
model Periodization {
  id              String   @id @default(uuid())
  playerId        String
  annualPlanId    String
  weekNumber      Int      // 1-52
  period          String   @db.VarChar(1)   // 'E', 'G', 'S', 'T'
  periodPhase     String?  @db.VarChar(20)  // 'base', 'specialization', 'tournament', 'recovery'
  weekInPeriod    Int?
  volumeIntensity String?  @db.VarChar(10)  // 'low', 'medium', 'high', 'peak', 'taper'
  plannedHours    Decimal? @db.Decimal(4, 1)

  // Prioriteter (0-10)
  priorityTechnique    Decimal? @db.Decimal(3, 1)
  priorityPhysical     Decimal? @db.Decimal(3, 1)
  priorityCompetition  Decimal? @db.Decimal(3, 1)
  priorityPlay         Decimal? @db.Decimal(3, 1)
  priorityGolfShot     Decimal? @db.Decimal(3, 1)

  @@unique([annualPlanId, weekNumber])
}
```

### 9.3 DailyTrainingAssignment

```prisma
model DailyTrainingAssignment {
  id                String   @id @default(uuid())
  annualPlanId      String
  playerId          String
  assignedDate      DateTime
  weekNumber        Int
  dayOfWeek         Int      // 0-6
  sessionTemplateId String?
  sessionType       String   @db.VarChar(50)  // 'technical', 'physical', 'mental', 'tactical', 'rest'
  estimatedDuration Int      // Minutter
  period            String   @db.VarChar(1)
  learningPhase     String?  @db.VarChar(5)   // 'L1'-'L5'
  clubSpeed         String?  @db.VarChar(10)  // 'CS80', etc.
  intensity         Int?     // 1-10
  isRestDay         Boolean  @default(false)
  status            String   @db.VarChar(20)  // 'planned', 'completed', 'skipped', 'rescheduled'

  isOptional        Boolean  @default(false)
  canBeSubstituted  Boolean  @default(true)
  actualDuration    Int?
  completedAt       DateTime?
  notes             String?  @db.Text

  @@unique([annualPlanId, assignedDate])
}
```

### 9.4 ScheduledTournament

```prisma
model ScheduledTournament {
  id                    String   @id @default(uuid())
  annualPlanId          String
  tournamentId          String?
  name                  String   @db.VarChar(255)
  startDate             DateTime
  endDate               DateTime
  importance            String   @db.VarChar(1)   // 'A', 'B', 'C'
  weekNumber            Int
  period                String   @db.VarChar(1)
  toppingStartWeek      Int
  toppingDurationWeeks  Int
  taperingStartDate     DateTime
  taperingDurationDays  Int
  focusAreas            Json
  participated          Boolean  @default(false)
  resultId              String?
}
```

### 9.5 BreakingPoint

```prisma
model BreakingPoint {
  id                  String   @id @default(uuid())
  playerId            String
  processCategory     String   @db.VarChar(20)  // 'speed', 'technique', 'physical'
  specificArea        String   @db.VarChar(255)
  description         String?  @db.Text
  identifiedDate      DateTime
  severity            String   @db.VarChar(10)  // 'low', 'medium', 'high'
  baselineMeasurement String?  @db.VarChar(100)
  targetMeasurement   String?  @db.VarChar(100)
  currentMeasurement  String?  @db.VarChar(100)
  progressPercent     Int?     @default(0)      // 0-100
  assignedExerciseIds String[]
  hoursPerWeek        Decimal? @db.Decimal(3, 1)
  status              String   @db.VarChar(20)  // 'not_started', 'in_progress', 'resolved'
  sourceType          String?  @db.VarChar(20)  // 'calibration', 'test', 'coach'
  calibrationId       String?
  clubType            String?  @db.VarChar(20)
  deviationPercent    Decimal? @db.Decimal(5, 2)
  autoDetected        Boolean  @default(false)
  notes               String?  @db.Text
}
```

### 9.6 PlayerIntake

```prisma
model PlayerIntake {
  id                   String   @id @default(uuid())
  playerId             String
  tenantId             String
  background           Json
  availability         Json
  goals                Json
  weaknesses           Json
  health               Json
  lifestyle            Json?
  equipment            Json?
  learning             Json?
  completionPercentage Int      @default(0)
  isComplete           Boolean  @default(false)
  generatedPlanId      String?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}
```

---

## 10. API-ENDEPUNKTER

### 10.1 Intake

```http
POST /api/v1/intake
# Submit/oppdater intake-skjema
Body: { playerId, background?, availability?, goals?, weaknesses?, health?, lifestyle?, equipment?, learning? }
Response: { id, completionPercentage, isComplete }

GET /api/v1/intake/player/:playerId
# Hent spillerens intake
Response: { id, playerId, completionPercentage, isComplete, background, goals, ... }

POST /api/v1/intake/:intakeId/generate-plan
# Generer plan fra fullført intake
Response: { annualPlan, periodizations, dailyAssignments, tournaments }

GET /api/v1/intake/tenant/:tenantId?isComplete=true&hasGeneratedPlan=false
# Admin: Hent alle intakes for tenant
```

### 10.2 Training Plan

```http
POST /api/v1/training-plan/generate
# Generer ny 12-måneders plan
Body: { playerId, tenantId, startDate, baselineAverageScore, tournaments?, weeklyHoursTarget?, preferredTrainingDays? }
Response: { annualPlan, periodizations: { created: 52 }, dailyAssignments: { created: 365 }, tournaments, breakingPoints }

GET /api/v1/training-plan
# List alle planer for bruker

GET /api/v1/training-plan/player/:playerId
# Hent spillerens aktive plan

GET /api/v1/training-plan/:planId/full
# Komplett plan med alle 365 dager

GET /api/v1/training-plan/:planId/calendar?startDate=2025-01-01&endDate=2025-01-31
# Kalendervisning

GET /api/v1/training-plan/:planId/today
# Dagens oppdrag

GET /api/v1/training-plan/:planId/analytics
# Fremdrift og statistikk

PUT /api/v1/training-plan/:planId/daily/:date
# Oppdater daglig oppdrag

PUT /api/v1/training-plan/:planId/daily/:date/quick-action
# Fullfør/hopp over/start økt
Body: { action: 'complete' | 'skip' | 'start' }

POST /api/v1/training-plan/:planId/tournaments
# Legg til turnering
Body: { name, startDate, endDate, importance }

DELETE /api/v1/training-plan/:planId
# Slett plan
```

---

## 11. ALGORITMER OG FORMLER

### 11.1 Spillerkategori fra Score

```
averageScore < 70  → E1 (Elite)
averageScore < 75  → A1 (Advanced)
averageScore < 80  → I1 (Intermediate)
averageScore < 85  → D1 (Developing)
averageScore >= 85 → B1 (Beginner)
```

### 11.2 Ukentlige Timer Justering

```
baseHours = intake.availability.hoursPerWeek

if (stressLevel >= 4):
  baseHours *= 0.85  // -15%

if (ageGroup in ['55-65', '65+']):
  baseHours *= 0.90  // -10%

weeklyHoursTarget = clamp(baseHours, 8, 25)
```

### 11.3 Turneringsplanlegging

```
Viktighet A (major):
  - toppingWeeks = 3
  - taperingDays = 7
  - focusAreas = ['Mental preparation', 'Course strategy', 'Peak performance', 'Recovery optimization']

Viktighet B (important):
  - toppingWeeks = 2
  - taperingDays = 5
  - focusAreas = ['Competition readiness', 'Mental skills', 'Tactical preparation']

Viktighet C (minor):
  - toppingWeeks = 1
  - taperingDays = 3
  - focusAreas = ['Competition exposure', 'Performance habits']
```

### 11.4 Club Speed Level

```
driverSpeed (mph) → Club Speed Level
< 80   → CS20
80-90  → CS40
90-100 → CS70
100-110 → CS90
110-120 → CS110
> 120  → CS120
```

### 11.5 PEI (Performance Efficiency Index)

```
PEI = gjennomsnittlig_avstand_til_hull / ideell_avstand

Test 8 (25m):  ideell = 2.5m
Test 9 (50m):  ideell = 5.0m
Test 10 (75m): ideell = 7.5m
Test 11 (100m): ideell = 10.0m

Lavere PEI = bedre
A-kategori: PEI ≤ 1.0
K-kategori: PEI ≤ 3.0
```

### 11.6 Strokes Gained fra PEI

```
SG = (E_before - 1) - E_after

E_before = Forventet slag fra startavstand (lookup-tabell)
E_after = Forventet putts fra leave-avstand
Leave-avstand = Startavstand × (PEI / 100)
```

### 11.7 Focus Engine Fordeling

```
For hver komponent (OTT, APP, ARG, PUTT):
  percentile = scoreToPercentile(componentScore)
  weakness = max(0, (75 - percentile) / 100)
  priority = weakness × componentWeight

focusComponent = komponent med høyest priority

recommendedSplit[c] = priority[c] / sum(priorities)
recommendedSplit[c] = clamp(recommendedSplit[c], 0.10, 0.50)
```

---

## 12. KONFIGURASJONSDATA

### 12.1 Læringsfaser (L1-L5)

| Fase | Navn | Beskrivelse |
|------|------|-------------|
| L1 | Fundamentale bevegelser | Grunnleggende motorikk |
| L2 | Basis teknikk | Tekniske prinsipper |
| L3 | Mellomnivå ferdigheter | Ferdighetsforbedring |
| L4 | Avansert konkurranse | Konkurranseorientert |
| L5 | Elite prestasjon | Toppnivå optimalisering |

### 12.2 Settings (S1-S10)

| Setting | Beskrivelse | Typisk periode |
|---------|-------------|----------------|
| S1 | Indoor/isolert | E |
| S2 | Range uten mål | E |
| S3 | Range med mål | E/G |
| S4 | Putting green | G |
| S5 | Chipping area | G/S |
| S6 | Short game area | S |
| S7 | Driving range konkurranseformat | S/T |
| S8 | 9-hull simulering | T |
| S9 | 18-hull simulering | T |
| S10 | Full turneringsformat | T |

### 12.3 Intensitetsnivåer

| Nivå | Beskrivelse | Numerisk |
|------|-------------|----------|
| low | Lav belastning, recovery | 3 |
| medium | Moderat belastning | 5 |
| high | Høy belastning | 7 |
| peak | Maksimal belastning | 9 |
| taper | Nedtrapping før konkurranse | 4 |

### 12.4 Økttyper

| Type | Beskrivelse |
|------|-------------|
| technical | Teknisk trening |
| physical | Fysisk trening |
| mental | Mental trening |
| tactical | Taktisk/strategisk |
| recovery | Restitusjon |
| rest | Hviledag |

---

## SAMMENDRAG

### Nøkkelpunkter

1. **Intake-skjema** samler all spillerinformasjon (8 seksjoner, 5 påkrevd)
2. **averageScore** er den kritiske variabelen som bestemmer spillerkategori og periodiseringsmal
3. **52 periodiseringer** fordeles over 4 faser: Base → Spesialisering → Turnering → Recovery
4. **365 daglige oppdrag** velges intelligent basert på periode, læringsfase, CS-level og breaking points
5. **Breaking points** opprettes automatisk fra kalibrering og oppdateres ved øktfullføring
6. **Focus Engine** beregner optimal treningsfordeling (OTT/APP/ARG/PUTT) fra testresultater

### Kritiske Avhengigheter

```
Intake → averageScore → Spillerkategori → Periodiseringsmal → 52 uker
                                                            → 365 dager

Kalibrering → driverSpeed → CS-level → Øktfiltrering
           → speedProfile → Breaking Points → Fokusområder

Testresultater → TestComponentMapping → Focus Engine → Treningsfordeling
```

### Filreferanser

| Komponent | Hovedfil |
|-----------|----------|
| Intake prosessering | `apps/api/src/domain/intake/intake-processing.service.ts` |
| Plan generering | `apps/api/src/domain/training-plan/plan-generation.service.ts` |
| Periodisering | `apps/api/src/domain/training-plan/periodization-templates.ts` |
| Øktvalg | `apps/api/src/domain/training-plan/session-selection.service.ts` |
| Breaking points | `apps/api/src/domain/breaking-points/auto-creation.service.ts` |
| Focus engine | `apps/api/src/domain/focus-engine/focus-engine.service.ts` |
| Database-skjema | `apps/api/prisma/schema.prisma` |

---

*Dokumentet er komplett og klar for AI-analyse.*
