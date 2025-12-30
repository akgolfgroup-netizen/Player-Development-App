# Intake/Onboarding → Årsplan Generering

> Komplett flyt fra spillerregistrering til ferdig treningsplan

## Visuell Oversikt

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ONBOARDING FLOW                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Steg 1    │    │   Steg 2    │    │   Steg 3    │    │   Steg 4    │  │
│  │  Bakgrunn   │───▶│Tilgjengelig │───▶│   Mål      │───▶│ Svakheter   │  │
│  │             │    │    het      │    │             │    │             │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│         │                 │                 │                 │            │
│         ▼                 ▼                 ▼                 ▼            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Steg 5    │    │   Steg 6    │    │   Steg 7    │    │   Steg 8    │  │
│  │   Helse     │───▶│  Livsstil   │───▶│  Utstyr     │───▶│  Læring     │  │
│  │             │    │             │    │             │    │             │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                                             │
│                                   │                                         │
│                                   ▼                                         │
│                         ┌─────────────────┐                                 │
│                         │  isComplete?    │                                 │
│                         │  100% fullført  │                                 │
│                         └────────┬────────┘                                 │
│                                  │ JA                                       │
│                                  ▼                                          │
│                    ┌──────────────────────────┐                             │
│                    │ POST /intake/:id/        │                             │
│                    │      generate-plan       │                             │
│                    └────────────┬─────────────┘                             │
│                                 │                                           │
└─────────────────────────────────┼───────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTAKE PROCESSING SERVICE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. processIntakeData()          2. convertToPlanGenerationInput()          │
│  ┌─────────────────────────┐     ┌─────────────────────────────────────┐   │
│  │ • Kategoriser spiller   │     │ • Hent baseline metrics            │   │
│  │ • Beregn ukentlige timer│────▶│ • Bygg GenerateAnnualPlanInput     │   │
│  │ • Prosesser turneringer │     │ • Legg til foretrukne dager        │   │
│  │ • Ekstraher svakheter   │     │ • Sett intensitetsmodifikatorer    │   │
│  │ • Identifiser restriksjoner│  └─────────────────────────────────────┘   │
│  └─────────────────────────┘                     │                          │
│                                                  ▼                          │
│                              ┌─────────────────────────────────────────┐   │
│                              │ PlanGenerationService.generateAnnualPlan│   │
│                              └─────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GENERERT ÅRSPLAN                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐ │
│  │ AnnualTrainingPlan  │  │ Periodization ×52   │  │ DailyAssignment ×365│ │
│  │ - playerCategory    │  │ - weekNumber        │  │ - assignedDate      │ │
│  │ - weeklyHoursTarget │  │ - period (E/G/S/T)  │  │ - sessionType       │ │
│  │ - intensityProfile  │  │ - volumeIntensity   │  │ - estimatedDuration │ │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Intake-skjemaet (8 seksjoner)

### Påkrevde seksjoner (5)

| Seksjon | Felt | Påvirker plan |
|---------|------|---------------|
| **1. Bakgrunn** | yearsPlaying, currentHandicap, averageScore, roundsPerYear, trainingHistory | Spillerkategori (E1-B1), periodiseringsmal |
| **2. Tilgjengelighet** | hoursPerWeek, preferredDays, canTravelToFacility, hasHomeEquipment | Ukentlige timer, hvile-/treningsdager |
| **3. Mål** | primaryGoal, targetHandicap, timeframe, tournaments | Turneringskalender, intensitet |
| **4. Svakheter** | biggestFrustration, problemAreas, mentalChallenges | Breaking points, fokusområder |
| **5. Helse** | currentInjuries, chronicConditions, ageGroup | Restriksjoner, intensitetsreduksjon |

### Valgfrie seksjoner (3)

| Seksjon | Felt | Påvirker plan |
|---------|------|---------------|
| **6. Livsstil** | workSchedule, stressLevel, sleepQuality | Intensitetsreduksjon ved stress |
| **7. Utstyr** | hasDriverSpeedMeasurement, driverSpeed, accessToTrackMan | Club speed level, øvelsesvalg |
| **8. Læring** | preferredStyle, prefersStructure, motivationType | Personalisering |

---

## 2. Dataflyt: Intake → ProcessedIntake

### Input: PlayerIntakeForm

```typescript
{
  background: {
    yearsPlaying: 5,
    currentHandicap: 12.5,
    averageScore: 82,
    roundsPerYear: 40,
    trainingHistory: "regular"
  },
  availability: {
    hoursPerWeek: 12,
    preferredDays: [1, 3, 5, 6],  // Man, Ons, Fre, Lør
    canTravelToFacility: true,
    hasHomeEquipment: false
  },
  goals: {
    primaryGoal: "lower_handicap",
    targetHandicap: 8,
    timeframe: "12_months",
    tournaments: [
      { name: "Klubbmesterskap", date: "2025-08-15", importance: "major" },
      { name: "Srixon Tour R1", date: "2025-06-10", importance: "important" }
    ]
  },
  weaknesses: {
    biggestFrustration: "Inconsistent putting under pressure",
    problemAreas: ["putting_distance", "course_management"],
    mentalChallenges: ["pressure_situations"]
  },
  health: {
    currentInjuries: [],
    injuryHistory: [
      { type: "Lower back strain", resolved: true, requiresModification: false }
    ],
    ageGroup: "35-45"
  },
  lifestyle: {
    workSchedule: "regular_hours",
    stressLevel: 3,
    sleepQuality: 4,
    physicalActivity: "moderate"
  },
  equipment: {
    hasDriverSpeedMeasurement: true,
    driverSpeed: 105,
    accessToGym: true
  }
}
```

### Prosessering

```typescript
// intake-processing.service.ts

processIntakeData(intake):
  // 1. Kategoriser spiller fra score
  playerCategory = categorizePlayer(82) → "D1" (Developing)

  // 2. Beregn ukentlige timer
  weeklyHoursTarget = calculateWeeklyHours(
    12,           // ønsket
    3,            // stressLevel
    "35-45"       // ageGroup
  ) → 12 timer (ingen reduksjon)

  // 3. Prosesser turneringer
  tournaments = [
    { name: "Klubbmesterskap", importance: "A", startDate: "2025-08-15" },
    { name: "Srixon Tour R1", importance: "B", startDate: "2025-06-10" }
  ]

  // 4. Ekstraher prioritetsområder
  priorityAreas = ["putting_distance", "course_management", "Inconsistent putting..."]

  // 5. Intensitetsmodifikatorer
  intensityModifiers = {
    reduceForAge: false,      // 35-45 = ingen reduksjon
    reduceForInjury: false,   // Ingen aktive skader
    reduceForStress: false,   // stressLevel 3 < 4
    increaseForGoals: false   // primaryGoal != "compete_tournaments"
  }
```

### Output: ProcessedIntake

```typescript
{
  playerCategory: "D1",
  weeklyHoursTarget: 12,
  planDuration: 52,
  startDate: new Date(),
  tournaments: [
    { name: "Klubbmesterskap", startDate: "2025-08-15", importance: "A" },
    { name: "Srixon Tour R1", startDate: "2025-06-10", importance: "B" }
  ],
  priorityAreas: ["putting_distance", "course_management"],
  restrictions: [],
  preferredTrainingDays: [1, 3, 5, 6],
  intensityModifiers: {
    reduceForAge: false,
    reduceForInjury: false,
    reduceForStress: false,
    increaseForGoals: false
  }
}
```

---

## 3. Konvertering til Plan Input

### Hent baseline metrics

```typescript
async getBaselineMetrics(playerId):
  // Fra Player-tabellen
  player = { averageScore: 82, handicap: 12.5 }

  // Fra ClubSpeedCalibration
  calibration = { driverSpeed: 105 }

  return {
    averageScore: 82,
    handicap: 12.5,
    driverSpeed: 105
  }
```

### Bygg GenerateAnnualPlanInput

```typescript
{
  playerId: "uuid",
  tenantId: "uuid",
  startDate: new Date("2025-01-01"),
  baselineAverageScore: 82,
  baselineHandicap: 12.5,
  baselineDriverSpeed: 105,
  planName: "2025 Treningsplan",
  weeklyHoursTarget: 12,
  tournaments: [
    { name: "Srixon Tour R1", startDate: "2025-06-10", importance: "B" },
    { name: "Klubbmesterskap", startDate: "2025-08-15", importance: "A" }
  ],
  preferredTrainingDays: [1, 3, 5, 6]
}
```

---

## 4. Plan Generering

### Steg-for-steg

```
1. Velg periodiseringsmal
   averageScore: 82 → Developing (D1)
   → basePeriodWeeks: 28
   → specializationWeeks: 16
   → tournamentWeeks: 6
   → weeklyHours: [10, 15]

2. Opprett AnnualTrainingPlan
   → id, playerId, planName, status: "active"

3. Planlegg turneringer
   Srixon Tour R1 (B):
   → weekNumber: 24
   → toppingStartWeek: 22 (2 uker)
   → taperingDays: 5

   Klubbmesterskap (A):
   → weekNumber: 33
   → toppingStartWeek: 30 (3 uker)
   → taperingDays: 7

4. Generer 52 periodiseringer
   Uke 1-28: Base (E/G)
   Uke 29-44: Spesialisering (G/S)
   Uke 45-50: Turnering (S/T)
   Uke 51-52: Recovery (G)

5. Hent club speed level
   driverSpeed: 105 mph → CS110

6. Generer 365 daglige oppdrag
   → Kun treningsdager: Man, Ons, Fre, Lør
   → Hviledag: Søn, Tir, Tor
   → Økter valgt basert på periode, læringsfase, CS-nivå
```

---

## 5. API-endepunkter

### Intake Flow

```http
# 1. Start/oppdater intake (kan gjøres i flere steg)
POST /api/v1/intake
{
  "playerId": "uuid",
  "background": { ... }
}

Response:
{
  "success": true,
  "data": {
    "id": "intake-uuid",
    "completionPercentage": 25,
    "isComplete": false
  }
}

# 2. Fortsett med flere seksjoner
POST /api/v1/intake
{
  "playerId": "uuid",
  "availability": { ... },
  "goals": { ... }
}

Response:
{
  "completionPercentage": 62,
  "isComplete": false
}

# 3. Fullfør alle påkrevde seksjoner
POST /api/v1/intake
{
  "playerId": "uuid",
  "weaknesses": { ... },
  "health": { ... }
}

Response:
{
  "completionPercentage": 100,
  "isComplete": true
}

# 4. Generer plan fra fullført intake
POST /api/v1/intake/{intakeId}/generate-plan

Response:
{
  "success": true,
  "data": {
    "annualPlan": {
      "id": "plan-uuid",
      "playerCategory": "D1",
      "basePeriodWeeks": 28,
      ...
    },
    "periodizations": { "created": 52 },
    "dailyAssignments": { "created": 365 },
    "tournaments": { "scheduled": 2 }
  }
}
```

---

## 6. Fullført flyt med tall

```
INTAKE FORM
    │
    ├── background.averageScore: 82
    │       ↓
    │   categorizePlayer(82) → "D1"
    │       ↓
    │   getTemplateForScoringAverage(82) → DEVELOPING template
    │       │
    │       ├── basePeriodWeeks: 28
    │       ├── specializationWeeks: 16
    │       ├── tournamentWeeks: 6
    │       └── weeklyHours: [10, 15]
    │
    ├── availability.hoursPerWeek: 12
    │       ↓
    │   calculateWeeklyHours(12, 3, "35-45") → 12
    │
    ├── goals.tournaments: 2 stk
    │       ↓
    │   processTournaments() → A + B tournaments
    │
    └── equipment.driverSpeed: 105
            ↓
        mapDriverSpeedToCSLevel(105) → "CS110"
            ↓
        SessionSelection med CS110 filter
            │
            ▼
    ┌─────────────────────────────────────┐
    │        GENERERT ÅRSPLAN             │
    ├─────────────────────────────────────┤
    │ playerCategory: D1                  │
    │ weeklyHoursTarget: 12               │
    │ clubSpeedLevel: CS110               │
    │                                     │
    │ Periodizations: 52                  │
    │ ├── Uke 1-28: Base (E→G)            │
    │ ├── Uke 29-44: Spesialisering (G→S) │
    │ ├── Uke 45-50: Turnering (S→T)      │
    │ └── Uke 51-52: Recovery (G)         │
    │                                     │
    │ DailyAssignments: 365               │
    │ ├── Treningsdager: ~210             │
    │ └── Hviledager: ~155                │
    │                                     │
    │ Tournaments: 2                      │
    │ ├── Srixon Tour R1 (B, uke 24)      │
    │ └── Klubbmesterskap (A, uke 33)     │
    └─────────────────────────────────────┘
```

---

## 7. Filreferanser

| Fil | Beskrivelse | Linjer |
|-----|-------------|--------|
| `apps/api/src/domain/intake/intake.types.ts` | TypeScript-typer for intake | 1-161 |
| `apps/api/src/domain/intake/intake-processing.service.ts` | Prosesseringslogikk | 1-447 |
| `apps/api/src/api/v1/intake/index.ts` | API-ruter | 1-561 |
| `apps/api/src/domain/training-plan/plan-generation.service.ts` | Plangenerering | 1-620 |
| `apps/api/src/domain/training-plan/periodization-templates.ts` | Maler | 1-288 |

---

## 8. Intensitetsmodifikatorer

### Automatiske justeringer

| Faktor | Betingelse | Effekt |
|--------|------------|--------|
| **Alder** | 55-65 eller 65+ | -10% timer |
| **Stress** | stressLevel ≥ 4 | -15% timer |
| **Skader** | currentInjuries.length > 0 | Restriksjoner i øvelsesvalg |
| **Konkurransemål** | primaryGoal = "compete_tournaments" | Økt intensitet |

### Beregning

```typescript
calculateWeeklyHours(requestedHours, stressLevel, ageGroup):
  let hours = requestedHours;

  // Reduser for høyt stress
  if (stressLevel >= 4):
    hours = hours * 0.85;  // -15%

  // Reduser for eldre
  if (ageGroup in ['55-65', '65+']):
    hours = hours * 0.90;  // -10%

  // Begrens til 8-25 timer
  return clamp(hours, 8, 25);
```

---

## Oppsummering

```
┌────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  INTAKE FORM   │ ───▶ │ PROCESSED INTAKE │ ───▶ │  ANNUAL PLAN    │
│  (8 seksjoner) │      │                  │      │                 │
│                │      │ • playerCategory │      │ • 52 uker       │
│ • Bakgrunn     │      │ • weeklyHours    │      │ • 365 dager     │
│ • Mål          │      │ • tournaments    │      │ • Turneringer   │
│ • Svakheter    │      │ • restrictions   │      │ • Breaking pts  │
│ • Helse        │      │ • modifiers      │      │                 │
└────────────────┘      └──────────────────┘      └─────────────────┘
```

**Nøkkelpunkter**:
1. Intake samler all nødvendig info (5 påkrevd + 3 valgfri)
2. `averageScore` bestemmer spillerkategori og periodiseringsmal
3. `hoursPerWeek` justeres for alder/stress
4. Turneringer planlegges med topping/tapering
5. `driverSpeed` bestemmer club speed level for øvelsesvalg
6. Svakheter blir til breaking points/fokusområder
