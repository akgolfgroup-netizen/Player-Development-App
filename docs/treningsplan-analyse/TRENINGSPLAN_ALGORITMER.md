# Treningsplan Algoritmer

> Dokumentasjon for årsplan- og treningsplangenerator.
> Bruk dette dokumentet for å analysere og forbedre algoritmene.

---

## Innholdsfortegnelse

1. [Oversikt](#oversikt)
2. [Periodiseringsmaler](#periodiseringsmaler)
3. [Session Selection Service](#session-selection-service)
4. [Plan Generation Service](#plan-generation-service)
5. [Kjente Problemer](#kjente-problemer)
6. [Forbedringsforslag](#forbedringsforslag)

---

## Oversikt

Systemet genererer **12-måneders treningsplaner** med:
- 52 uker periodisert trening (E/G/S/T faser)
- 365 daglige treningsoppdrag
- Turneringsintegrasjon med topping/tapering
- Constraint-aware øktvalg basert på breaking points

### Arkitektur

```
┌─────────────────────────────────────────────────────────────┐
│                    ÅrsplanGenerator.jsx                     │
│                    (4-stegs wizard UI)                       │
└─────────────────────────┬───────────────────────────────────┘
                          │ POST /training-plan/generate
                          ▼
┌─────────────────────────────────────────────────────────────┐
│               PlanGenerationService                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 1. Velg periodiseringsmal (basert på score)         │    │
│  │ 2. Beregn planstruktur (52 uker)                    │    │
│  │ 3. Opprett AnnualTrainingPlan                       │    │
│  │ 4. Planlegg turneringer                             │    │
│  │ 5. Generer periodiseringsstruktur                   │    │
│  │ 6. Hent klubbhastighetsnivå                         │    │
│  │ 7. Hent breaking points                             │    │
│  │ 8. Generer 365 daglige økter                        │    │
│  │ 9. Bygg resultat                                    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              SessionSelectionService                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ - Scorer templates basert på kriterier              │    │
│  │ - V2: Domain/constraint-aware scoring               │    │
│  │ - Returnerer beste match for hver dag               │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Periodiseringsmaler

**Fil:** `apps/api/src/domain/training-plan/periodization-templates.ts`

### Spillerkategorier

| Kategori | Kode | Score-range | Timer/uke |
|----------|------|-------------|-----------|
| Internasjonalt | E1 | <70 | 30+ |
| Europeisk / Skandinavisk | A1 | 70-75 | 25-30 |
| Nasjonalt | I1 | 75-80 | 20-25 |
| Regionalt / Lokalt | D1 | 80-85 | 15-20 |
| Lokalt | B1 | 85+ | 10-15 |

### Template-struktur

```typescript
interface PeriodizationTemplate {
  scoringRange: { min: number; max: number };
  basePeriodWeeks: number;        // Antall uker i grunnperiode
  specializationWeeks: number;    // Antall uker i spesialiseringsperiode
  tournamentWeeks: number;        // Antall uker i turneringsperiode
  recoveryWeeks: number;          // Antall uker recovery
  weeklyHours: [min, max];        // Timer per uke
  intensity: {
    base: IntensityLevel;
    specialization: IntensityLevel;
    tournament: IntensityLevel;
  };
  focusAreas: { ... };
  learningPhaseDistribution: { ... };
  settingsDistribution: { ... };
  periodDistribution: { ... };
}
```

### Detaljerte Maler

#### Elite (<70 score)
```
┌────────────────────────────────────────────────────────────────┐
│ Base: 16 uker │ Spesialisering: 24 uker │ Turnering: 10 │ Rec: 2 │
├────────────────┼────────────────────────┼──────────────┼────────┤
│ E → G          │ G → S                  │ S → T        │ G      │
│ L1, L2, L3     │ L3, L4, L5             │ L4, L5       │ L1, L2 │
│ S1-S5          │ S5-S8                  │ S8-S10       │        │
│ Intensity: HIGH│ Intensity: PEAK        │ Intensity: PEAK      │
└────────────────┴────────────────────────┴──────────────┴────────┘
Timer/uke: 18-25
```

#### Advanced (70-75 score)
```
┌────────────────────────────────────────────────────────────────┐
│ Base: 20 uker │ Spesialisering: 20 uker │ Turnering: 10 │ Rec: 2 │
├────────────────┼────────────────────────┼──────────────┼────────┤
│ E → G          │ G → S                  │ S → T        │ G      │
│ L1, L2, L3     │ L2, L3, L4, L5         │ L4, L5       │        │
│ S1-S5          │ S4-S8                  │ S7-S10       │        │
│ Intensity: MED │ Intensity: HIGH        │ Intensity: PEAK      │
└────────────────┴────────────────────────┴──────────────┴────────┘
Timer/uke: 15-20
```

#### Intermediate (75-80 score)
```
┌────────────────────────────────────────────────────────────────┐
│ Base: 24 uker │ Spesialisering: 18 uker │ Turnering: 8  │ Rec: 2 │
├────────────────┼────────────────────────┼──────────────┼────────┤
│ E → G          │ G → S                  │ S → T        │ G      │
│ L1, L2, L3     │ L2, L3, L4             │ L3, L4, L5   │        │
│ S1-S5          │ S4-S7                  │ S7-S9        │        │
│ Intensity: MED │ Intensity: HIGH        │ Intensity: PEAK      │
└────────────────┴────────────────────────┴──────────────┴────────┘
Timer/uke: 12-18
```

#### Developing (80-85 score)
```
┌────────────────────────────────────────────────────────────────┐
│ Base: 28 uker │ Spesialisering: 16 uker │ Turnering: 6  │ Rec: 2 │
├────────────────┼────────────────────────┼──────────────┼────────┤
│ E → G          │ G → S                  │ S → T        │ G      │
│ L1, L2         │ L2, L3, L4             │ L3, L4       │        │
│ S1-S4          │ S4-S7                  │ S6-S8        │        │
│ Intensity: MED │ Intensity: HIGH        │ Intensity: TAPER     │
└────────────────┴────────────────────────┴──────────────┴────────┘
Timer/uke: 10-15
```

#### Beginner (85+ score)
```
┌────────────────────────────────────────────────────────────────┐
│ Base: 32 uker │ Spesialisering: 14 uker │ Turnering: 4  │ Rec: 2 │
├────────────────┼────────────────────────┼──────────────┼────────┤
│ E → G          │ G → S                  │ S            │ G      │
│ L1, L2         │ L2, L3                 │ L3           │        │
│ S1-S3          │ S3-S6                  │ S5-S7        │        │
│ Intensity: MED │ Intensity: MED         │ Intensity: MED       │
└────────────────┴────────────────────────┴──────────────┴────────┘
Timer/uke: 8-12
```

### Learning Phases (L1-L5)

| Fase | Navn | Beskrivelse |
|------|------|-------------|
| L1 | Acquisition | Lære ny ferdighet |
| L2 | Consolidation | Befeste ferdighet |
| L3 | Automation | Automatisere bevegelse |
| L4 | Transfer | Overføre til spillsituasjon |
| L5 | Competition | Bruke under press |

### Settings (S1-S10)

| Setting | Beskrivelse | Typisk bruk |
|---------|-------------|-------------|
| S1 | Range - grunnøvelser | Base-periode |
| S2 | Range - variasjon | Base |
| S3 | Kortspillområde | Base/Spesialisering |
| S4 | Putting green | Base/Spesialisering |
| S5 | Simulert bane | Spesialisering |
| S6 | Øvelsesbane | Spesialisering |
| S7 | Bane - lav intensitet | Turnering |
| S8 | Bane - moderat | Turnering |
| S9 | Bane - konkurranselikt | Turnering |
| S10 | Turnering | Turnering |

### Perioder (E/G/S/T)

| Periode | Navn | Fokus | Varighet |
|---------|------|-------|----------|
| **E** | Evalueringsperiode | Tekniske grunnlag, nye mønstre | Tidlig base |
| **G** | Grunnperiode | Balansert utvikling, kapasitet | Sen base + tidlig spec |
| **S** | Spesialiseringsperiode | Konkurransespesifikk trening | Sen spec + tidlig turnering |
| **T** | TurneringPeriode | Toppform, mental forberedelse | Turneringsperiode |

---

## Session Selection Service

**Fil:** `apps/api/src/domain/training-plan/session-selection.service.ts`

### Scoring System

Hver økt-template scores basert på hvor godt den matcher dagens kontekst:

```typescript
interface ScoreBreakdown {
  periodMatch: number;           // +100 for eksakt match
  learningPhaseMatch: number;    // +50 for match
  durationMatch: number;         // 0-50 (nærmere = bedre)
  clubSpeedMatch: number;        // +30 for match
  settingsMatch: number;         // +30 for match
  breakingPointRelevance: number;// +20 base
  domainCoverageBonus: number;   // +50 (V2)
  constraintRelevance: number;   // +40 (V2)
  proofProgressBonus: number;    // +30 (V2)
  recentUsagePenalty: number;    // -20 per bruk siste 7 dager
  intensityMatch: number;        // +40 for match
}
```

### Scoring Tabell

| Faktor | Poeng | Beskrivelse |
|--------|-------|-------------|
| `periodMatch` | +100 | Økt matcher nåværende periode (E/G/S/T) |
| `learningPhaseMatch` | +50 | Økt matcher learning phase (L1-L5) |
| `durationMatch` | 0-50 | Nærmere target duration = høyere score |
| `clubSpeedMatch` | +30 | Økt matcher spillerens klubbhastighet |
| `settingsMatch` | +30 | Økt matcher tillatte settings |
| `breakingPointRelevance` | +20 | Økt adresserer aktive breaking points |
| `domainCoverageBonus` | +50 | Økt trener domene med aktiv BP (V2) |
| `constraintRelevance` | +40 | Økt trener topp-2 constraint (V2) |
| `proofProgressBonus` | +30 | Økt inkluderer proof-metric øvelse (V2) |
| `recentUsagePenalty` | -20/bruk | Straff for nylig brukte templates |
| `intensityMatch` | +40 | Økt matcher dagens intensitetsnivå |

### Domain Mapping

Økter mappes til domener basert på navn/type:

```typescript
// Eksempler på mapping
'DRIVER', 'TEE'        → 'TEE'
'APPROACH', 'INN'      → 'INN100' (eller INN50/150/200)
'CHIP', 'PITCH', 'ARG' → 'ARG'
'PUTT', 'GREEN'        → 'PUTT'
'FITNESS', 'STYRKE'    → 'PHYS'

// Settings-basert fallback
S1 (Range)             → 'TEE'
S3 (Short game)        → 'ARG'
S4 (Putting green)     → 'PUTT'
```

### Compatible Periods

Økter kan brukes i nærliggende perioder:

```typescript
const compatibility = {
  E: ['E'],           // Kun E
  G: ['E', 'G'],      // E og G
  S: ['G', 'S'],      // G og S
  T: ['S', 'T'],      // S og T
};
```

### Rest Day Logic

```typescript
function shouldBeRestDay(dayOfWeek, intensity, preferredDays?):
  // Hvis bruker har angitt foretrukne dager
  if (preferredDays) return !preferredDays.includes(dayOfWeek);

  // Søndag (0) er alltid hviledag
  if (dayOfWeek === 0) return true;

  // Peak/High: 1 hviledag (søndag)
  if (intensity === 'peak' || 'high') return dayOfWeek === 0;

  // Medium: 2 hviledager (søndag + onsdag)
  if (intensity === 'medium') return dayOfWeek === 0 || 3;

  // Low/Taper: 3 hviledager (søndag + onsdag + fredag)
  if (intensity === 'low' || 'taper') return dayOfWeek === 0 || 3 || 5;
```

### Weekly Session Distribution

```typescript
const distributions = {
  base: {
    technical: 0.4,  // 40%
    physical: 0.3,   // 30%
    mental: 0.15,    // 15%
    recovery: 0.15,  // 15%
  },
  specialization: {
    technical: 0.35,
    physical: 0.25,
    mental: 0.2,
    tactical: 0.2,
  },
  tournament: {
    tactical: 0.4,
    mental: 0.3,
    technical: 0.2,
    recovery: 0.1,
  },
  recovery: {
    recovery: 0.6,
    mental: 0.2,
    technical: 0.2,
  },
};
```

---

## Plan Generation Service

**Fil:** `apps/api/src/domain/training-plan/plan-generation.service.ts`

### 9-Stegs Algoritme

```typescript
async generateAnnualPlan(input: GenerateAnnualPlanInput) {
  // STEG 1: Velg periodiseringsmal
  const template = getTemplateForScoringAverage(input.baselineAverageScore);
  const playerCategory = getPlayerCategory(input.baselineAverageScore);

  // STEG 2: Beregn planstruktur
  const endDate = startDate + 364 dager;
  const weeklyHoursTarget = average(template.weeklyHours);

  // STEG 3: Opprett AnnualTrainingPlan i database
  const annualPlan = await prisma.annualTrainingPlan.create({...});

  // STEG 4: Planlegg turneringer med topping/tapering
  const tournamentSchedules = await scheduleTournaments(...);

  // STEG 5: Generer 52-ukers periodiseringsstruktur
  const periodizationWeeks = generatePeriodizationStructure(...);
  await prisma.periodization.createMany({...});

  // STEG 6: Hent spillerens klubbhastighetsnivå
  const clubSpeedLevel = await getPlayerClubSpeedLevel(...);

  // STEG 7: Hent breaking points med domain mapping
  const breakingPoints = await prisma.breakingPoint.findMany({...});
  // V2: Tilordne testDomainCode til BPs som mangler

  // STEG 8: Beregn category constraints (V2)
  const categoryConstraints = constraintsService.calculateBindingConstraints({...});
  const topConstraints = categoryConstraints.bindingConstraints;

  // STEG 9: Generer 365 daglige økter
  const dailyAssignments = await generateDailyAssignments(
    ..., topConstraints  // V2: constraint-aware
  );

  return result;
}
```

### Periodization Structure Generation

```typescript
generatePeriodizationStructure(startDate, template, tournaments) {
  const weeks = [];

  // BASE PERIODE
  for (i = 0; i < template.basePeriodWeeks; i++) {
    const period = i < basePeriodWeeks/2 ? 'E' : 'G';
    weeks.push({
      weekNumber: i + 1,
      period,
      periodPhase: 'base',
      learningPhases: template.learningPhaseDistribution.base,
      volumeIntensity: calculateVolumeIntensity('base', i, total),
      targetHours: template.weeklyHours[0],
    });
  }

  // SPESIALISERING
  for (i = 0; i < template.specializationWeeks; i++) {
    const period = i < specializationWeeks/2 ? 'G' : 'S';
    weeks.push({...});
  }

  // TURNERING
  for (i = 0; i < template.tournamentWeeks; i++) {
    const period = i < tournamentWeeks/3 ? 'S' : 'T';
    weeks.push({...});
  }

  // RECOVERY
  for (i = 0; i < template.recoveryWeeks; i++) {
    weeks.push({
      period: 'G',
      volumeIntensity: 'low',
      targetHours: template.weeklyHours[0] / 2,
    });
  }

  // Juster for turneringer
  applyTournamentAdjustments(weeks, tournaments);

  return weeks;
}
```

### Volume Intensity Calculation

```typescript
calculateVolumeIntensity(phase, weekIndex, totalWeeks) {
  const progress = weekIndex / totalWeeks;

  if (phase === 'base') {
    if (progress < 0.3) return 'medium';
    if (progress < 0.7) return 'high';
    return 'medium';  // Taper litt på slutten
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

### Tournament Preparation

```typescript
// Viktighet bestemmer forberedelsestid
const preparation = {
  A: { toppingWeeks: 3, taperingDays: 7 },  // Hovedmål
  B: { toppingWeeks: 2, taperingDays: 5 },  // Viktige
  C: { toppingWeeks: 1, taperingDays: 3 },  // Forberedelse
};

// Topping = build-up med peak intensity
// Tapering = redusert volum, behold intensitet
```

### Daily Assignment Generation

```typescript
generateDailyAssignments(..., topConstraints) {
  const assignments = [];
  const weeklyHoursAllocated = {};  // In-memory tracking

  for (day = 0; day < 365; day++) {
    const currentDate = startDate + day;
    const weekNumber = Math.floor(day / 7) + 1;
    const periodWeek = periodizationWeeks.find(w => w.weekNumber === weekNumber);

    // Sjekk om hviledag
    const isRestDay = shouldBeRestDay(dayOfWeek, periodWeek.volumeIntensity, preferredDays);

    // Bygg kontekst
    const context = {
      period: periodWeek.period,
      learningPhases: periodWeek.learningPhases,
      clubSpeedLevel,
      breakingPointIds,
      targetHoursThisWeek: periodWeek.targetHours,
      hoursAllocatedSoFar: weeklyHoursAllocated[weekNumber] || 0,
      intensity: periodWeek.volumeIntensity,
      isRestDay,
      ...
    };

    // V2: Velg økt med constraint-awareness
    const session = topConstraints.length > 0
      ? await selectSessionForDayWithContext(context, topConstraints)
      : await selectSessionForDay(context);

    assignments.push({
      assignedDate: currentDate,
      sessionTemplateId: session?.sessionTemplateId,
      sessionType: session?.sessionType || 'rest',
      estimatedDuration: session?.estimatedDuration || 0,
      period: periodWeek.period,
      ...
    });

    // Oppdater in-memory timer-tracking
    weeklyHoursAllocated[weekNumber] += (session?.estimatedDuration || 0) / 60;
  }

  // Batch insert alle assignments
  await prisma.dailyTrainingAssignment.createMany({ data: assignments });

  return { created: assignments.length, byType };
}
```

---

## Kjente Problemer

### 1. Periodoverganger
**Problem:** Periodene (E→G→S→T) endres brått midt i uka basert på enkel halvdeling.

**Nåværende logikk:**
```typescript
// I base-periode
const period = i < basePeriodWeeks/2 ? 'E' : 'G';  // Brå overgang
```

**Konsekvens:** Ingen gradvis overgang mellom perioder. 

---

### 2. Intensitetsprofil
**Problem:** Volume intensity beregnes for enkelt, tar ikke hensyn til:
- Spillerens faktiske kapasitet
- Individuelle forskjeller
- Sesongvariasjoner

---

### 3. Hviledag-logikk
**Problem:** Fast hviledag-mønster som ikke tilpasser seg:
- Spillerens restitusjonsbehov
- Akkumulert belastning
- Tidligere ukers intensitet

---

### 4. Session Selection - Domain Mapping
**Problem:** Domain-mapping basert på tekstmatch i øktnavn er upålitelig:
```typescript
// Fungerer kun hvis navnet inneholder nøkkelord
if (name.includes('DRIVER')) return 'TEE';
```

---

### 5. Timer-allokering
**Problem:** Enkel linear fordeling av timer:
```typescript
const targetDuration = Math.min(remainingHours * 60, 180);
```
Tar ikke hensyn til:
- Optimale øktvarioasjoner
- Daglig kapasitet
- Type økt (noen bør være lengre/kortere)

---

### 6. Constraint-prioritering
**Problem:** Alle constraints behandles likt (+40 poeng), ingen rangering.

---

### 7. Learning Phase Progresjon
**Problem:** Learning phases fordeles statisk per periode-fase, ikke basert på faktisk progresjon.

---

## Forbedringsforslag

### 1. Gradvis Periodovergang
```typescript
// Forslag: Overlap-perioder
function getOverlappingPeriod(weekInPhase, totalWeeks, periods) {
  const ratio = weekInPhase / totalWeeks;
  if (ratio < 0.2) return periods[0];           // Ren første periode
  if (ratio > 0.8) return periods[1];           // Ren andre periode
  return `${periods[0]}/${periods[1]}`;         // Overgangsperiode
}
```

### 2. Intelligent Hviledag
```typescript
// Forslag: Akkumulert belastning
function shouldBeRestDay(context) {
  const { accumulatedLoad, weeklyLoad, recoveryRate } = context;

  if (accumulatedLoad > threshold) return true;
  if (consecutiveTrainingDays >= 4) return true;
  // ...
}
```

### 3. Session Domain via Øvelser
```typescript
// Forslag: Hent domene fra øvelser, ikke navn
async function getDomainForSession(templateId) {
  const exercises = await prisma.sessionExercise.findMany({
    where: { templateId },
    include: { exercise: { select: { domainCode: true } } },
  });

  // Returner dominant domene
  return getMostFrequentDomain(exercises);
}
```

### 4. Adaptiv Timer-fordeling
```typescript
// Forslag: Sesjon-spesifikke varigheter
const sessionDurations = {
  technique: { min: 45, optimal: 60, max: 90 },
  physical: { min: 30, optimal: 45, max: 60 },
  play: { min: 120, optimal: 180, max: 240 },
  mental: { min: 20, optimal: 30, max: 45 },
};
```

### 5. Constraint-vekting
```typescript
// Forslag: Prioritert scoring
const constraintBonus = {
  priority1: 60,  // Største gap
  priority2: 45,
  priority3: 30,
  priority4: 15,
};
```

---

## Neste Steg

- [ ] Implementer gradvis periodovergang
- [ ] Forbedre hviledag-logikk med belastningssporing
- [ ] Koble session domains til øvelser (ikke navn)
- [ ] Legge til adaptiv timer-fordeling per økttype
- [ ] Implementer constraint-prioritering
- [ ] Teste mot reelle spillerprofiler
