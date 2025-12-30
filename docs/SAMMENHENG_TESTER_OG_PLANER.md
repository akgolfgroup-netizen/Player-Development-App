# Sammenheng mellom Tester og Planer

> Hvordan testresultater påvirker og styrer treningsplaner

## Oversikt: Dataflyt

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              TESTER (20 stk)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Distanse    │  │ Hastighet   │  │ Approach    │  │ Short Game  │        │
│  │ (1-4)       │  │ (5-7)       │  │ (8-11)      │  │ (15-18)     │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                │                │
│         └────────────────┴────────────────┴────────────────┘                │
│                                   │                                         │
│                                   ▼                                         │
│                         ┌─────────────────┐                                 │
│                         │  TestResult     │                                 │
│                         │  (Database)     │                                 │
│                         └────────┬────────┘                                 │
└──────────────────────────────────┼──────────────────────────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
        ┌───────────────┐  ┌─────────────┐  ┌──────────────┐
        │ Kategori A-K  │  │ Breaking    │  │ Focus Engine │
        │ Beregning     │  │ Points      │  │ (OTT/APP/    │
        │               │  │             │  │  ARG/PUTT)   │
        └───────┬───────┘  └──────┬──────┘  └──────┬───────┘
                │                 │                │
                └─────────────────┼────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │    PLAN GENERERING      │
                    │  ┌───────────────────┐  │
                    │  │ generateAnnualPlan│  │
                    │  └─────────┬─────────┘  │
                    │            │            │
                    │  ┌─────────▼─────────┐  │
                    │  │ 52 Periodiseringer│  │
                    │  │ 365 Daglige Oppdrag  │
                    │  └───────────────────┘  │
                    └─────────────────────────┘
```

---

## 1. Testresultater → Spillerkategori

### Gjennomsnittsscore bestemmer mal

```typescript
// plan-generation.service.ts
const template = getTemplateForScoringAverage(input.baselineAverageScore);
const playerCategory = getPlayerCategory(input.baselineAverageScore);
```

| Score | Kategori | Base | Spesialisering | Turnering | Timer/uke |
|-------|----------|------|----------------|-----------|-----------|
| <70 | Elite (E1) | 16 uker | 24 uker | 10 uker | 18-25 |
| 70-75 | Advanced (A1) | 20 uker | 20 uker | 10 uker | 15-20 |
| 75-80 | Intermediate (I1) | 24 uker | 18 uker | 8 uker | 12-18 |
| 80-85 | Developing (D1) | 28 uker | 16 uker | 6 uker | 10-15 |
| 85+ | Beginner (B1) | 32 uker | 14 uker | 4 uker | 8-12 |

**Kilde for score**:
- Test 19: 9-Hole Simulering → Direkte score
- Test 20: On-Course Skills → Beregnet score
- Eller: `baselineAverageScore` fra intake/onboarding

---

## 2. Testresultater → Breaking Points

### Automatisk oppretting fra kalibrering

**Lokasjon**: `apps/api/src/domain/breaking-points/auto-creation.service.ts`

```
Club Speed Kalibrering
         │
         ▼
┌─────────────────────────────┐
│  Analyser avvik per klubb   │
│  - Driver vs forventet      │
│  - 3-wood vs forventet      │
│  - Jern vs forventet        │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│  Beregn severity            │
│  - 5-10% avvik → low        │
│  - 10-15% avvik → medium    │
│  - >15% avvik → high        │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│  Opprett Breaking Point     │
│  - processCategory          │
│  - specificArea             │
│  - hoursPerWeek             │
│  - assignedExerciseIds      │
└─────────────────────────────┘
```

### Avviksterskel → Timer per uke

| Severity | Avvik | Timer/uke |
|----------|-------|-----------|
| Low | 5-10% | 2 timer |
| Medium | 10-15% | 3 timer |
| High | >15% | 4 timer |

### Breaking Points brukt i øktvalg

```typescript
// session-selection.service.ts
const criteria: SessionSelectionCriteria = {
  // ...
  breakingPointIds: context.breakingPointIds,
  // ...
};

// Øker score for øvelser som adresserer breaking points
score += calculateBreakingPointRelevance(template, breakingPointIds);
```

---

## 3. Testresultater → Focus Engine

### Test-til-Komponent Mapping

**Database**: `TestComponentMapping`

| Test | Komponent | Vekt |
|------|-----------|------|
| 1 (Driver Avstand) | OTT | 1.0 |
| 2 (3-Tre Avstand) | OTT | 0.8 |
| 5 (Klubbhastighet) | OTT | 1.0 |
| 6 (Ballhastighet) | OTT | 0.9 |
| 8-11 (Approach) | APP | 1.0 |
| 17 (Chipping) | ARG | 1.0 |
| 18 (Bunker) | ARG | 0.9 |
| 15 (Putting 3m) | PUTT | 1.0 |
| 16 (Putting 6m) | PUTT | 0.9 |

### Focus Engine beregning

```typescript
// focus-engine.service.ts
async calculatePlayerFocus(tenantId, userId):
  1. Hent testresultater (siste 50)
  2. Grupper etter test → bruk nyeste per test
  3. Beregn komponentscorer (vektet snitt)
  4. Finn svakhet (gap til 75-persentil)
  5. Beregn prioritet = svakhet × vekt
  6. Anbefal treningsfordeling (10-50% per komponent)
```

### Output: Anbefalt treningsfordeling

```json
{
  "focusComponent": "APP",
  "focusScores": {
    "OTT": 25,
    "APP": 65,
    "ARG": 40,
    "PUTT": 30
  },
  "recommendedSplit": {
    "OTT": 0.15,
    "APP": 0.40,
    "ARG": 0.25,
    "PUTT": 0.20
  },
  "reasonCodes": ["weak_app_test_cluster", "high_weight_app"],
  "confidence": "high"
}
```

---

## 4. Testresultater → Club Speed Level

### Kalibrering bestemmer øvelsesnivå

```typescript
// plan-generation.service.ts
const clubSpeedLevel = await this.getPlayerClubSpeedLevel(
  input.playerId,
  input.baselineDriverSpeed
);
```

### Speed Category Mapping

| Driver Speed (mph) | Club Speed Level |
|--------------------|------------------|
| <80 | CS20 |
| 80-90 | CS40 |
| 90-100 | CS70 |
| 100-110 | CS90 |
| 110-120 | CS110 |
| >120 | CS120 |

### Brukes i øktvalg

```typescript
// session-selection.service.ts
const templates = await prisma.sessionTemplate.findMany({
  where: {
    clubSpeed: criteria.clubSpeed,  // F.eks. "CS90"
    // ...
  }
});
```

---

## 5. Testresultater → Learning Phase

### Kategorinivå bestemmer læringsfaser

| Spillerkategori | Læringsfaser i Base | i Spesialisering | i Turnering |
|-----------------|---------------------|------------------|-------------|
| Elite | L1, L2, L3 | L3, L4, L5 | L4, L5 |
| Advanced | L1, L2, L3 | L2, L3, L4, L5 | L4, L5 |
| Intermediate | L1, L2, L3 | L2, L3, L4 | L3, L4, L5 |
| Developing | L1, L2 | L2, L3, L4 | L3, L4 |
| Beginner | L1, L2 | L2, L3 | L3 |

### Læringsfaser forklart

| Fase | Navn | Beskrivelse |
|------|------|-------------|
| L1 | Fundamentale bevegelser | Grunnleggende motorikk |
| L2 | Basis teknikk | Tekniske prinsipper |
| L3 | Mellomnivå ferdigheter | Ferdighetsforbedring |
| L4 | Avansert konkurranse | Konkurranseorientert |
| L5 | Elite prestasjon | Toppnivå optimalisering |

---

## 6. Plan Progress → Breaking Point oppdatering

### Automatisk fremdrift ved øktfullføring

```typescript
// plan-progress.service.ts
async updateBreakingPointProgress(playerId, completedSessionId):
  1. Hent fullført økt
  2. Finn spillerens breaking points (not_started, in_progress)
  3. For hver breaking point:
     - Øk progressPercent med 2%
     - Oppdater status (in_progress → resolved ved 100%)
```

### Database-oppdatering

```prisma
model BreakingPoint {
  progressPercent     Int      // 0-100
  status              String   // 'not_started' | 'in_progress' | 'resolved'
  currentMeasurement  String   // "Progress: 45%"
}
```

---

## 7. Benchmark Session → Plan justering

### BenchmarkSession fanger nye svakheter

```prisma
model BenchmarkSession {
  strengths             String[]   // Identifiserte styrker
  weaknesses            String[]   // Identifiserte svakheter
  newBreakingPoints     String[]   // UUIDs til nye breaking points
  resolvedBreakingPoints String[]  // UUIDs til løste breaking points
  trainingAdjustments   String     // Anbefalte justeringer
}
```

### Flyt: Benchmark → Breaking Points → Plan

```
Benchmark Session
      │
      ├─► Identifiser svakheter fra testresultater
      │
      ├─► Opprett nye Breaking Points
      │
      ├─► Merk løste Breaking Points
      │
      └─► Foreslå treningsjusteringer
             │
             ▼
      ManualAdjustmentService
             │
             ▼
      Oppdater DailyTrainingAssignments
```

---

## 8. Komplett dataflyt-diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INNDATA                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Test 1-7    │  │ Test 8-11   │  │ Test 12-14  │  │ Test 15-20  │        │
│  │ Distanse/   │  │ Approach    │  │ Fysisk      │  │ Short Game/ │        │
│  │ Hastighet   │  │ PEI         │  │ Styrke      │  │ On-Course   │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                │                │
└─────────┼────────────────┼────────────────┼────────────────┼────────────────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            BEREGNINGER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ Kategori A-K    │  │ Breaking Points │  │ Focus Engine    │             │
│  │                 │  │                 │  │                 │             │
│  │ baselineScore   │  │ Svakheter fra   │  │ OTT/APP/ARG/    │             │
│  │ → E1/A1/I1/D1/B1│  │ kalibrering     │  │ PUTT fordeling  │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│           └────────────────────┼────────────────────┘                       │
│                                │                                            │
└────────────────────────────────┼────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PLAN GENERERING                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Input:                        Algoritme:                                   │
│  ┌─────────────────────┐       ┌─────────────────────────────────────┐     │
│  │ playerId            │       │ 1. Velg periodiseringsmal (score)   │     │
│  │ baselineAverageScore│  ───► │ 2. Beregn 52 ukers struktur         │     │
│  │ baselineDriverSpeed │       │ 3. Hent breaking points             │     │
│  │ tournaments[]       │       │ 4. Generer 365 daglige oppdrag      │     │
│  │ weeklyHoursTarget   │       │ 5. Velg økter basert på alle data   │     │
│  └─────────────────────┘       └─────────────────────────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              UTDATA                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    AnnualTrainingPlan                               │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │ Periodization│  │ Daily        │  │ Scheduled    │              │   │
│  │  │ (52 records) │  │ Assignments  │  │ Tournaments  │              │   │
│  │  │              │  │ (365 records)│  │              │              │   │
│  │  │ - weekNumber │  │ - date       │  │ - name       │              │   │
│  │  │ - period     │  │ - sessionType│  │ - importance │              │   │
│  │  │ - intensity  │  │ - duration   │  │ - topping    │              │   │
│  │  │ - phase      │  │ - learningPh │  │ - tapering   │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Øktvalg-algoritmen og testdata

### Scoringsformel for øktmaler

```typescript
// session-selection.service.ts
scoreTemplate(template, criteria):
  let score = 0;

  // Fra testbasert kategori
  if (template.periods.includes(criteria.period)) score += 100;
  if (criteria.learningPhases.includes(template.learningPhase)) score += 50;

  // Fra club speed kalibrering
  if (template.clubSpeed === criteria.clubSpeed) score += 30;

  // Fra breaking points (testbasert)
  score += calculateBreakingPointRelevance(template, criteria.breakingPointIds);

  // Fra focus engine (testbasert)
  if (matchesFocusComponent(template, criteria.focusComponent)) score += 40;

  return score;
```

---

## 10. Filreferanser

| Komponent | Fil | Linjenummer |
|-----------|-----|-------------|
| Plan generering | `apps/api/src/domain/training-plan/plan-generation.service.ts` | 30-165 |
| Breaking Point auto-creation | `apps/api/src/domain/breaking-points/auto-creation.service.ts` | 22-178 |
| Focus Engine | `apps/api/src/domain/focus-engine/focus-engine.service.ts` | 30-363 |
| Session Selection | `apps/api/src/domain/training-plan/session-selection.service.ts` | 31-167 |
| Plan Progress | `apps/api/src/domain/training-plan/plan-progress.service.ts` | 61-166 |
| Test Calculator | `apps/api/src/domain/tests/test-calculator.ts` | - |
| Periodisering Templates | `apps/api/src/domain/training-plan/periodization-templates.ts` | 42-228 |

---

## Oppsummering

| Testdata | Påvirker | Hvordan |
|----------|----------|---------|
| **Gjennomsnittsscore** | Spillerkategori | Velger periodiseringsmal (E1→B1) |
| **Club Speed** | Club Speed Level | Filtrerer relevante øktmaler |
| **Avvik fra forventet** | Breaking Points | Oppretter fokusområder med timer/uke |
| **Komponent-scores** | Focus Engine | Beregner OTT/APP/ARG/PUTT fordeling |
| **Kategori (A-K)** | Læringsfaser | Bestemmer L1-L5 per periode |
| **Øktfullføring** | Breaking Point Progress | Øker progressPercent med 2% |
| **Benchmark resultater** | Plan justering | Nye/løste breaking points |
