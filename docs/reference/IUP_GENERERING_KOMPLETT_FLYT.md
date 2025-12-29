# IUP Årsplan: Komplett Genereringsflyt

> Steg-for-steg oversikt over hvordan en automatisk IUP genereres

---

## OVERSIKT

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   INPUT                    PROSESS                     OUTPUT               │
│   ─────                    ───────                     ──────               │
│                                                                             │
│   Spillerdata    ───►    9 STEG     ───►    1 AnnualTrainingPlan           │
│   Turneringer                               52 Periodization                │
│   Preferanser                              365 DailyAssignments             │
│                                              X ScheduledTournaments         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## STEG 1: INPUT DATA

### API-kall
```http
POST /api/v1/training-plan/generate
Authorization: Bearer {token}
```

### Input-objekt
```typescript
{
  playerId: "uuid",
  tenantId: "uuid",
  startDate: "2025-01-01",

  // Spillerens baseline (PÅKREVD)
  baselineAverageScore: 78.5,      // Hoveddriver for kategorisering

  // Valgfrie baseline-data
  baselineHandicap: 6.2,
  baselineDriverSpeed: 155,         // km/h → maps til CS-nivå
  weeklyHoursTarget: 12,            // Overstyr default timer/uke

  // Turneringer
  tournaments: [
    {
      name: "NM Junior",
      startDate: "2025-07-15",
      endDate: "2025-07-17",
      importance: "A"               // A/B/C
    }
  ],

  // Preferanser
  preferredTrainingDays: [1, 2, 3, 4, 5, 6],  // 0=søn, 1=man, ...
  excludeDates: ["2025-07-01", "2025-07-02"]  // Ferier etc
}
```

---

## STEG 2: KATEGORISERING

### Funksjon: `getTemplateForScoringAverage()`

```
                    SPILLERENS SNITT-SCORE
                            │
                            ▼
    ┌───────────────────────────────────────────────────┐
    │                                                   │
    │   < 70    ───►  ELITE      ───►  18-25 t/uke     │
    │   70-75   ───►  ADVANCED   ───►  15-20 t/uke     │
    │   75-80   ───►  INTERMEDIATE ──► 12-18 t/uke     │
    │   80-85   ───►  DEVELOPING ───►  10-15 t/uke     │
    │   > 85    ───►  BEGINNER   ───►   8-12 t/uke     │
    │                                                   │
    └───────────────────────────────────────────────────┘
                            │
                            ▼
                    PERIODISERINGSMAL
```

### Eksempel: Score 78.5 → INTERMEDIATE

```typescript
{
  scoringRange: { min: 75, max: 80 },
  basePeriodWeeks: 24,           // Lengre grunnperiode
  specializationWeeks: 18,
  tournamentWeeks: 8,
  recoveryWeeks: 2,
  weeklyHours: [12, 18],         // Min/max timer per uke

  intensity: {
    base: 'medium',
    specialization: 'high',
    tournament: 'peak'
  },

  learningPhaseDistribution: {
    base: ['L1', 'L2', 'L3'],
    specialization: ['L2', 'L3', 'L4'],
    tournament: ['L3', 'L4', 'L5']
  },

  settingsDistribution: {
    base: ['S1', 'S2', 'S3', 'S4', 'S5'],
    specialization: ['S4', 'S5', 'S6', 'S7'],
    tournament: ['S7', 'S8', 'S9']
  }
}
```

---

## STEG 3: OPPRETT ÅRSPLAN-RECORD

### Database: `AnnualTrainingPlan`

```sql
INSERT INTO annual_training_plans (
  id,                    -- UUID generert
  player_id,
  tenant_id,
  plan_name,             -- "78.5 avg - 12-month plan"
  start_date,            -- 2025-01-01
  end_date,              -- 2025-12-31 (364 dager)
  status,                -- "active"

  -- Baseline snapshot
  baseline_average_score, -- 78.5
  baseline_handicap,      -- 6.2
  baseline_driver_speed,  -- 155
  player_category,        -- "I1" (Intermediate)

  -- Periodiseringsstruktur
  base_period_weeks,      -- 24
  specialization_weeks,   -- 18
  tournament_weeks,       -- 8

  -- Volum
  weekly_hours_target,    -- 15 (snitt av 12-18)
  intensity_profile,      -- JSON med hele årets intensitetsprofil

  -- Metadata
  generated_at,           -- NOW()
  generation_algorithm    -- "v1.0"
);
```

---

## STEG 4: PLANLEGG TURNERINGER

### For hver turnering:

```
              TURNERING INPUT
                    │
                    ▼
    ┌───────────────────────────────────┐
    │  Beregn ukenummer i planen        │
    │  (dager fra startdato / 7)        │
    └───────────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────┐
    │  Bestem forberedelsesperioder     │
    │  basert på viktighet (A/B/C)      │
    └───────────────────────────────────┘
```

### Forberedelsesperioder per Viktighet

| Viktighet | Topping (uker) | Tapering (dager) | Fokusområder |
|-----------|----------------|------------------|--------------|
| **A** | 3 uker | 7 dager | Mental prep, Course strategy, Peak performance, Recovery |
| **B** | 2 uker | 5 dager | Competition readiness, Mental skills, Tactical prep |
| **C** | 1 uke | 3 dager | Competition exposure, Performance habits |

### Database: `ScheduledTournament`

```sql
INSERT INTO scheduled_tournaments (
  annual_plan_id,
  tournament_id,
  name,                    -- "NM Junior"
  start_date,              -- 2025-07-15
  end_date,                -- 2025-07-17
  importance,              -- "A"
  week_number,             -- 28 (uke i planen)
  period,                  -- "T"
  topping_start_week,      -- 25 (3 uker før)
  topping_duration_weeks,  -- 3
  tapering_start_date,     -- 2025-07-08 (7 dager før)
  tapering_duration_days,  -- 7
  focus_areas              -- JSON array
);
```

---

## STEG 5: GENERER 52 UKERS PERIODISERING

### Algoritme: `generatePeriodizationStructure()`

```
UKE 1 ──────────────────────────────────────────────────► UKE 52

├──── BASE (24 uker) ────┼─── SPEC (18 uker) ──┼─ TURN (8) ─┼─ REC ─┤

│ E │     G              │    G    │    S      │ S  │   T   │   G   │
│4u │    20u             │    9u   │    9u     │ 3u │   5u  │   2u  │
```

### For hver uke genereres:

```typescript
{
  weekNumber: 15,
  startDate: "2025-04-07",
  endDate: "2025-04-13",

  period: "G",                    // E/G/S/T
  periodPhase: "base",            // base/specialization/tournament/recovery
  weekInPeriod: 15,               // Uke 15 av 24 i base

  learningPhases: ["L1", "L2", "L3"],

  volumeIntensity: "high",        // Beregnet basert på posisjon i periode
  targetHours: 12
}
```

### Intensitetsberegning per Fase

```typescript
function calculateVolumeIntensity(phase, weekIndex, totalWeeks) {
  const progress = weekIndex / totalWeeks;  // 0.0 til 1.0

  if (phase === 'base') {
    if (progress < 0.3) return 'medium';    // Første 30%
    if (progress < 0.7) return 'high';      // Midtre 40%
    return 'medium';                         // Siste 30% (nedtrapping)
  }

  if (phase === 'specialization') {
    return 'high';                           // Konstant høy
  }

  if (phase === 'tournament') {
    if (progress < 0.5) return 'peak';      // Første halvdel
    return 'taper';                          // Andre halvdel
  }

  return 'low';  // Recovery
}
```

### Turneringsjusteringer

For hver planlagt turnering overskriver vi:

```typescript
// TOPPING-UKER (før turnering)
for (i = 0; i < toppingDurationWeeks; i++) {
  week = weeks[toppingStartWeek + i];
  week.period = 'S';
  week.volumeIntensity = 'peak';
}

// TURNERINGS-UKE
tournamentWeek.period = 'T';
tournamentWeek.volumeIntensity = 'taper';
```

### Database: `Periodization` (52 records)

```sql
INSERT INTO periodizations (
  player_id,
  annual_plan_id,
  week_number,          -- 1-52
  period,               -- E/G/S/T
  period_phase,         -- base/specialization/tournament/recovery
  week_in_period,       -- Uke X av Y i denne perioden
  volume_intensity,     -- low/medium/high/peak/taper
  planned_hours         -- Timer denne uken
);
```

---

## STEG 6: HENT SPILLERENS CLUB SPEED NIVEAU

### Algoritme: `getPlayerClubSpeedLevel()`

```
              HAR BASELINE DRIVER SPEED?
                        │
           ┌────────────┴────────────┐
           │                         │
          JA                        NEI
           │                         │
           ▼                         ▼
    Bruk input-verdi          Sjekk ClubSpeedCalibration
                                     │
                              ┌──────┴──────┐
                              │             │
                           FUNNET      IKKE FUNNET
                              │             │
                              ▼             ▼
                        Bruk fra DB    Default: CS90
```

### Speed → CS-nivå Mapping

| Driver Speed (km/h) | CS-nivå |
|---------------------|---------|
| < 130 | CS60 |
| 130-145 | CS70 |
| 145-160 | CS80 |
| 160-175 | CS90 |
| 175-190 | CS100 |
| > 190 | CS110 |

---

## STEG 7: HENT BREAKING POINTS

### Database Query

```sql
SELECT id FROM breaking_points
WHERE player_id = {playerId}
AND status IN ('not_started', 'in_progress');
```

### Breaking Points påvirker sesjon-valg

- Økter som adresserer breaking points får høyere score
- Maks 30% av treningstid bør fokusere på breaking points

---

## STEG 8: GENERER 365 DAGLIGE TILDELINGER

### Hovedloop: `generateDailyAssignments()`

```
FOR dag = 0 TO 364:

    ┌──────────────────────────────────────────────────────────────────┐
    │  1. Beregn dato                                                  │
    │     currentDate = startDate + dag dager                          │
    │                                                                  │
    │  2. Sjekk ekskluderinger                                         │
    │     IF dato i excludeDates → HOPP OVER                           │
    │                                                                  │
    │  3. Finn ukedata                                                 │
    │     weekNumber = floor(dag / 7) + 1                              │
    │     periodWeek = periodizationWeeks[weekNumber]                  │
    │                                                                  │
    │  4. Bestem hviledag                                              │
    │     isRestDay = shouldBeRestDay(dayOfWeek, intensity, prefs)     │
    │                                                                  │
    │  5. Bygg kontekst for sesjon-valg                                │
    │                                                                  │
    │  6. Velg sesjon (hvis ikke hviledag)                             │
    │     session = SessionSelectionService.selectSessionForDay()      │
    │                                                                  │
    │  7. Lagre til database                                           │
    └──────────────────────────────────────────────────────────────────┘
```

### Hviledag-logikk: `shouldBeRestDay()`

```typescript
function shouldBeRestDay(dayOfWeek, intensity, preferredDays) {

  // Hvis spilleren har angitt foretrukne dager
  if (preferredDays && preferredDays.length > 0) {
    return !preferredDays.includes(dayOfWeek);  // Hviledag = ikke foretrukket
  }

  // Standard logikk basert på intensitet
  switch (intensity) {
    case 'peak':
    case 'high':
      // 1 hviledag: Søndag
      return dayOfWeek === 0;

    case 'medium':
      // 2 hviledager: Søndag + Onsdag
      return dayOfWeek === 0 || dayOfWeek === 3;

    case 'low':
    case 'taper':
      // 3 hviledager: Søndag + Onsdag + Fredag
      return dayOfWeek === 0 || dayOfWeek === 3 || dayOfWeek === 5;

    default:
      return dayOfWeek === 0;
  }
}
```

### Kontekst-objekt for Sesjon-valg

```typescript
{
  playerId,
  tenantId,
  annualPlanId,
  date: currentDate,
  weekNumber: 15,
  dayOfWeek: 1,                    // Mandag

  // Fra periodisering
  period: "G",
  periodPhase: "base",
  weekInPeriod: 15,
  learningPhases: ["L1", "L2", "L3"],
  settings: ["S3", "S4", "S5", "S6"],  // Basert på periode

  // Fra spiller
  clubSpeedLevel: "CS80",
  breakingPointIds: ["uuid1", "uuid2"],

  // Volum-kontroll
  targetHoursThisWeek: 12,
  hoursAllocatedSoFar: 4.5,

  // Status
  intensity: "high",
  isRestDay: false,
  isTournamentWeek: false,
  isTaperingWeek: false,
  isToppingWeek: false
}
```

---

## STEG 8b: SESJON-VALG ALGORITME

### Funksjon: `SessionSelectionService.selectSessionForDay()`

```
                    ER DET HVILEDAG?
                          │
              ┌───────────┴───────────┐
              │                       │
             JA                      NEI
              │                       │
              ▼                       ▼
       Return NULL           Beregn tilgjengelig tid
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │ remainingHours = target - used │
                    │ targetDuration = min(remain*60,│
                    │                      180 min)  │
                    └────────────────────────────────┘
                                     │
                          (under 30 min?)
                              │
                    ┌─────────┴─────────┐
                    │                   │
                   JA                  NEI
                    │                   │
                    ▼                   ▼
             Return NULL        Query SessionTemplates
                                        │
                                        ▼
                               Score og Rank
                                        │
                                        ▼
                              Return beste match
```

### Database Query for Sesjonsmaler

```sql
SELECT * FROM session_templates
WHERE tenant_id = {tenantId}
AND is_active = true
AND periods && ARRAY['E', 'G']          -- Kompatible perioder
AND learning_phase IN ('L1', 'L2', 'L3') -- Matching L-fase
AND club_speed = 'CS80'                  -- Matching CS-nivå
AND setting IN ('S3', 'S4', 'S5', 'S6') -- Matching settings
AND duration BETWEEN 60 AND 120          -- Innenfor tidsramme
LIMIT 20;
```

### Scoring-algoritme: `scoreTemplate()`

```typescript
function scoreTemplate(template, criteria) {
  let score = 0;

  // PERIODE-MATCH: +100 poeng
  if (template.periods.includes(criteria.period)) {
    score += 100;
  }

  // LÆRINGSFASE-MATCH: +50 poeng
  if (criteria.learningPhases.includes(template.learningPhase)) {
    score += 50;
  }

  // VARIGHET-MATCH: +50 poeng (nærmere = bedre)
  const durationDiff = Math.abs(template.duration - criteria.targetDuration);
  score += Math.max(0, 50 - durationDiff);

  // CLUB SPEED-MATCH: +30 poeng
  if (template.clubSpeed === criteria.clubSpeed) {
    score += 30;
  }

  // SETTING-MATCH: +30 poeng
  if (criteria.settings.includes(template.setting)) {
    score += 30;
  }

  // BREAKING POINT RELEVANS: +20 poeng
  if (criteria.breakingPointIds.length > 0) {
    score += 20;  // Forenklet - sjekker egentlig øvelsesmatch
  }

  // INTENSITETS-MATCH: +40 poeng
  if (matchesIntensity(template.intensity, criteria.intensity)) {
    score += 40;
  }

  // VARIASJON: -2 poeng per tidligere bruk
  score -= template.usageCount * 2;

  return score;  // Max teoretisk: ~320 poeng
}
```

### Periode-kompatibilitet

```typescript
const compatibility = {
  'E': ['E'],           // Kun E-økter i E-periode
  'G': ['E', 'G'],      // E og G-økter OK i G-periode
  'S': ['G', 'S'],      // G og S-økter OK i S-periode
  'T': ['S', 'T']       // S og T-økter OK i T-periode
};
```

### Database: `DailyTrainingAssignment` (365 records)

```sql
INSERT INTO daily_training_assignments (
  annual_plan_id,
  player_id,

  -- Dato
  assigned_date,          -- 2025-04-07
  week_number,            -- 15
  day_of_week,            -- 1 (mandag)

  -- Sesjon
  session_template_id,    -- UUID til valgt mal
  session_type,           -- "langspill"
  estimated_duration,     -- 90 (minutter)

  -- Kontekst
  period,                 -- "G"
  learning_phase,         -- "L2"
  club_speed,             -- "CS80"
  intensity,              -- 7 (1-10 skala)

  -- Fleksibilitet
  is_rest_day,            -- false
  is_optional,            -- false
  can_be_substituted,     -- true

  -- Status (for sporing)
  status                  -- "planned"
);
```

---

## STEG 9: BYGG OG RETURNER RESULTAT

### Output-objekt

```typescript
{
  annualPlan: {
    id: "uuid",
    playerId: "uuid",
    planName: "78.5 avg - 12-month plan",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    playerCategory: "I1",
    basePeriodWeeks: 24,
    specializationWeeks: 18,
    tournamentWeeks: 8
  },

  periodizations: {
    created: 52,
    weekRange: { from: 1, to: 52 }
  },

  dailyAssignments: {
    created: 365,
    dateRange: {
      from: "2025-01-01",
      to: "2025-12-31"
    },
    sessionsByType: {
      langspill: 78,
      kortspill: 65,
      putting: 52,
      fysisk: 40,
      mental: 25,
      rest: 105
    }
  },

  tournaments: {
    scheduled: 3,
    list: [
      { name: "NM Junior", startDate: "2025-07-15", importance: "A" },
      { name: "Regionsmesterskap", startDate: "2025-05-10", importance: "B" },
      { name: "Klubbmesterskap", startDate: "2025-09-20", importance: "C" }
    ]
  },

  breakingPoints: {
    linked: 2
  }
}
```

---

## KOMPLETT FLYTDIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                        IUP GENERERINGSFLYT                                  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐                                                           │
│   │   INPUT     │                                                           │
│   │  ─────────  │                                                           │
│   │ • playerId  │                                                           │
│   │ • score:78.5│                                                           │
│   │ • turneringer│                                                          │
│   │ • preferanser│                                                          │
│   └──────┬──────┘                                                           │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────┐     ┌─────────────────────────────────────────────────┐  │
│   │ STEG 1      │     │ getTemplateForScoringAverage(78.5)              │  │
│   │ Kategoriser │────►│ → INTERMEDIATE                                  │  │
│   │             │     │ → 24+18+8+2 = 52 uker                           │  │
│   └──────┬──────┘     │ → 12-18 timer/uke                               │  │
│          │            └─────────────────────────────────────────────────┘  │
│          ▼                                                                  │
│   ┌─────────────┐     ┌─────────────────────────────────────────────────┐  │
│   │ STEG 2      │     │ INSERT INTO annual_training_plans               │  │
│   │ Opprett     │────►│ → id: "abc-123"                                 │  │
│   │ AnnualPlan  │     │ → category: "I1"                                │  │
│   └──────┬──────┘     └─────────────────────────────────────────────────┘  │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────┐     ┌─────────────────────────────────────────────────┐  │
│   │ STEG 3      │     │ FOR hver turnering:                             │  │
│   │ Planlegg    │────►│   → Beregn uke i planen                         │  │
│   │ Turneringer │     │   → Sett topping (1-3 uker før)                 │  │
│   └──────┬──────┘     │   → Sett tapering (3-7 dager før)               │  │
│          │            └─────────────────────────────────────────────────┘  │
│          ▼                                                                  │
│   ┌─────────────┐     ┌─────────────────────────────────────────────────┐  │
│   │ STEG 4      │     │ FOR uke = 1 TO 52:                              │  │
│   │ Generer     │────►│   → Bestem periode (E/G/S/T)                    │  │
│   │ 52 uker     │     │   → Beregn intensitet                           │  │
│   │ periodisering│    │   → INSERT INTO periodizations                  │  │
│   └──────┬──────┘     └─────────────────────────────────────────────────┘  │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────┐     ┌─────────────────────────────────────────────────┐  │
│   │ STEG 5      │     │ Sjekk ClubSpeedCalibration                      │  │
│   │ Hent        │────►│ → Map driver speed til CS-nivå                  │  │
│   │ Club Speed  │     │ → Default: CS90                                 │  │
│   └──────┬──────┘     └─────────────────────────────────────────────────┘  │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────┐     ┌─────────────────────────────────────────────────┐  │
│   │ STEG 6      │     │ SELECT FROM breaking_points                     │  │
│   │ Hent        │────►│ WHERE status IN ('not_started', 'in_progress') │  │
│   │ Breaking Pts│     │ → Brukes til sesjon-scoring                     │  │
│   └──────┬──────┘     └─────────────────────────────────────────────────┘  │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────┐     ┌─────────────────────────────────────────────────┐  │
│   │ STEG 7      │     │ FOR dag = 0 TO 364:                             │  │
│   │ Generer     │────►│   → Sjekk om hviledag                           │  │
│   │ 365 dager   │     │   → Bygg kontekst-objekt                        │  │
│   │             │     │   → Velg beste sesjon (scoring)                 │  │
│   │             │     │   → INSERT INTO daily_training_assignments      │  │
│   └──────┬──────┘     └─────────────────────────────────────────────────┘  │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────┐     ┌─────────────────────────────────────────────────┐  │
│   │ STEG 8      │     │ {                                               │  │
│   │ Returner    │────►│   annualPlan: {...},                            │  │
│   │ Resultat    │     │   periodizations: { created: 52 },              │  │
│   │             │     │   dailyAssignments: { created: 365 },           │  │
│   └─────────────┘     │   tournaments: { scheduled: 3 }                 │  │
│                       │ }                                               │  │
│                       └─────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## EKSEMPEL: KOMPLETT GENERERING

### Input

```typescript
{
  playerId: "player-123",
  tenantId: "ak-golf-academy",
  startDate: "2025-01-06",  // Første mandag i januar
  baselineAverageScore: 78.5,
  baselineHandicap: 6.2,
  baselineDriverSpeed: 155,
  tournaments: [
    { name: "NM Junior", startDate: "2025-07-15", importance: "A" }
  ],
  preferredTrainingDays: [1, 2, 3, 4, 5, 6],  // Man-Lør
  excludeDates: []
}
```

### Output

```
DATABASE RECORDS OPPRETTET:

1. AnnualTrainingPlan (1)
   ├── id: "plan-abc-123"
   ├── playerCategory: "I1" (Intermediate)
   ├── base: 24 uker, spec: 18 uker, tourn: 8 uker
   └── weeklyHoursTarget: 15

2. ScheduledTournament (1)
   └── NM Junior (uke 28, A-viktighet, 3 uker topping)

3. Periodization (52)
   ├── Uke 1-12:  E→G  (base, medium→high)
   ├── Uke 13-24: G    (base, high→medium)
   ├── Uke 25-27: S    (spec, peak) ← TOPPING FOR NM
   ├── Uke 28:    T    (tourn, taper) ← NM JUNIOR
   ├── Uke 29-42: S→T  (spec/tourn)
   ├── Uke 43-50: T    (tournament)
   └── Uke 51-52: G    (recovery, low)

4. DailyTrainingAssignment (365)
   ├── ~260 treningsdager
   ├── ~105 hviledager (søndager)
   └── Fordelt på økter:
       ├── Langspill:  78
       ├── Kortspill:  65
       ├── Putting:    52
       ├── Fysisk:     40
       ├── Mental:     25
       └── Andre:      variable
```

---

## YTELSE OG TIDBRUK

| Steg | Operasjon | Typisk tid |
|------|-----------|------------|
| 1 | Kategorisering | < 1 ms |
| 2 | Opprett AnnualPlan | 5-10 ms |
| 3 | Planlegg turneringer | 10-20 ms per turnering |
| 4 | Generer 52 periodiseringer | 100-200 ms |
| 5 | Hent club speed | 5-10 ms |
| 6 | Hent breaking points | 5-10 ms |
| 7 | Generer 365 assignments | 2-4 sekunder |
| 8 | Bygg resultat | < 1 ms |
| **TOTAL** | | **2-5 sekunder** |

---

**Dokumentversjon:** 1.0

**Basert på:** `plan-generation.service.ts`, `periodization-templates.ts`, `session-selection.service.ts`

1. **Opprettet:** 27. desember 2025
