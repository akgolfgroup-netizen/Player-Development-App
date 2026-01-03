# Treningsplan - Nåværende Implementasjon

> Detaljert dokumentasjon av hvordan de 7 problemområdene er implementert i dag.
> Hver seksjon viser eksakt kode og logikk som brukes.

---

## 1. Periodoverganger (E→G→S→T)

**Fil:** `plan-generation.service.ts` linje 283-394

### Nåværende Implementasjon

Periodene bestemmes med enkel halvdeling av ukene:

```typescript
// BASE PERIODE (linje 291-313)
for (let i = 0; i < template.basePeriodWeeks; i++) {
  const weekNumber = i + 1;

  // PROBLEM: Brå overgang ved halvveis
  const period = i < template.basePeriodWeeks / 2 ? 'E' : 'G';

  weeks.push({
    weekNumber,
    period,
    periodPhase: 'base',
    weekInPeriod: i + 1,
    learningPhases: template.learningPhaseDistribution.base,
    volumeIntensity: this.calculateVolumeIntensity('base', i, template.basePeriodWeeks),
    targetHours: template.weeklyHours[0],
  });
}

// SPESIALISERING (linje 315-341)
for (let i = 0; i < template.specializationWeeks; i++) {
  const weekNumber = template.basePeriodWeeks + i + 1;

  // PROBLEM: Samme brå overgang
  const period = i < template.specializationWeeks / 2 ? 'G' : 'S';

  weeks.push({...});
}

// TURNERING (linje 343-365)
for (let i = 0; i < template.tournamentWeeks; i++) {
  const weekNumber = template.basePeriodWeeks + template.specializationWeeks + i + 1;

  // PROBLEM: Tredeling her
  const period = i < template.tournamentWeeks / 3 ? 'S' : 'T';

  weeks.push({...});
}
```

### Eksempel: Intermediate (75-80 score)

```
Base: 24 uker
├── Uke 1-12:  Periode E (første halvdel)
├── Uke 13-24: Periode G (andre halvdel)  ← Brå overgang ved uke 13

Spesialisering: 18 uker
├── Uke 25-33: Periode G (første halvdel)
├── Uke 34-42: Periode S (andre halvdel)  ← Brå overgang ved uke 34

Turnering: 8 uker
├── Uke 43-45: Periode S (første tredel)
├── Uke 46-50: Periode T (resten)         ← Brå overgang ved uke 46

Recovery: 2 uker
└── Uke 51-52: Periode G (alltid)
```

### Konsekvens

- Ingen gradvis overgang mellom perioder
- Spilleren går fra 100% E til 100% G over natten
- Ingen "transitional" uker med blandet fokus

---

## 2. Intensitetsprofil

**Fil:** `plan-generation.service.ts` linje 398-422

### Nåværende Implementasjon

```typescript
private static calculateVolumeIntensity(
  phase: string,
  weekIndex: number,
  totalWeeks: number
): string {
  const progress = weekIndex / totalWeeks;

  if (phase === 'base') {
    if (progress < 0.3) return 'medium';   // 0-30%: medium
    if (progress < 0.7) return 'high';     // 30-70%: high
    return 'medium';                        // 70-100%: medium (taper)
  }

  if (phase === 'specialization') {
    return 'high';  // PROBLEM: Alltid high, ingen variasjon
  }

  if (phase === 'tournament') {
    if (progress < 0.5) return 'peak';     // 0-50%: peak
    return 'taper';                         // 50-100%: taper
  }

  return 'low';  // Recovery
}
```

### Eksempel: Intermediate gjennom året

```
Uke  1-7:  base,    progress 0-29%,  intensity = medium
Uke  8-17: base,    progress 30-70%, intensity = high
Uke 18-24: base,    progress 71-100%, intensity = medium

Uke 25-42: specialization, intensity = high (ALLTID)

Uke 43-46: tournament, progress 0-50%, intensity = peak
Uke 47-50: tournament, progress 51-100%, intensity = taper

Uke 51-52: recovery, intensity = low
```

### Konsekvens

- Spesialisering har ingen variasjon (18 uker med konstant "high")
- Ingen individuelle tilpasninger
- Tar ikke hensyn til akkumulert fatigue
- Ingen "deload" uker innebygd

---

## 3. Hviledag-logikk

**Fil:** `session-selection.service.ts` linje 592-623

### Nåværende Implementasjon

```typescript
static shouldBeRestDay(
  dayOfWeek: number,
  _weekNumber: number,        // PROBLEM: Brukes ikke
  intensity: string,
  preferredTrainingDays?: number[]
): boolean {
  // Alternativ 1: Bruker har angitt foretrukne dager
  if (preferredTrainingDays && preferredTrainingDays.length > 0) {
    return !preferredTrainingDays.includes(dayOfWeek);
  }

  // Alternativ 2: Fast mønster basert på intensitet

  // Søndag (0) er ALLTID hviledag
  if (dayOfWeek === 0) return true;

  // Peak/High intensity: Kun søndag fri
  if (intensity === 'peak' || intensity === 'high') {
    return dayOfWeek === 0;  // 1 hviledag: Søndag
  }

  // Medium intensity: Søndag + Onsdag fri
  if (intensity === 'medium') {
    return dayOfWeek === 0 || dayOfWeek === 3;  // 2 hviledager
  }

  // Low/Taper: Søndag + Onsdag + Fredag fri
  if (intensity === 'low' || intensity === 'taper') {
    return dayOfWeek === 0 || dayOfWeek === 3 || dayOfWeek === 5;  // 3 hviledager
  }

  return dayOfWeek === 0;  // Fallback: kun søndag
}
```

### Hviledag-mønster per Intensitet

```
Peak/High:   Søn
             [X][ ][ ][ ][ ][ ][ ]
              0  1  2  3  4  5  6
             = 1 hviledag, 6 treningsdager

Medium:      Søn       Ons
             [X][ ][ ][X][ ][ ][ ]
              0  1  2  3  4  5  6
             = 2 hviledager, 5 treningsdager

Low/Taper:   Søn       Ons    Fre
             [X][ ][ ][X][ ][X][ ]
              0  1  2  3  4  5  6
             = 3 hviledager, 4 treningsdager
```

### Konsekvens

- `_weekNumber` parameter brukes aldri (kan ikke variere over uker)
- Ingen hensyn til akkumulert belastning
- Ingen hensyn til forrige dags intensitet
- Ingen "aktiv hvile" vs "full hvile" distinksjon
- Samme mønster uke etter uke

---

## 4. Session Selection - Domain Mapping

**Fil:** `session-selection.service.ts` linje 391-434

### Nåværende Implementasjon

```typescript
private static getDomainForSession(template: SessionTemplateWithCount): TestDomainCode | null {
  // Henter navn og type som UPPERCASE
  const name = (template.name || '').toUpperCase();
  const type = (template.sessionType || '').toUpperCase();
  const setting = (template.setting as string || '').toUpperCase();

  // TEKSTMATCH PÅ NAVN
  if (name.includes('DRIVER') || name.includes('TEE') || type.includes('DRIVING')) {
    return 'TEE';
  }

  if (name.includes('APPROACH') || name.includes('INN')) {
    // Sjekker for avstandshint
    if (name.includes('200') || name.includes('LANG')) return 'INN200';
    if (name.includes('150')) return 'INN150';
    if (name.includes('100')) return 'INN100';
    if (name.includes('50') || name.includes('KORT')) return 'INN50';
    return 'INN100';  // Default approach
  }

  if (name.includes('CHIP') || name.includes('PITCH') || name.includes('ARG') || name.includes('AROUND')) {
    return 'ARG';
  }

  if (name.includes('PUTT') || name.includes('GREEN')) {
    return 'PUTT';
  }

  if (name.includes('FITNESS') || name.includes('STYRKE') || name.includes('PHYSICAL') || type.includes('PHYSICAL')) {
    return 'PHYS';
  }

  // FALLBACK: Basert på setting
  if (setting === 'S1') {
    return 'TEE';  // Range = driving
  }
  if (setting === 'S3') {
    return 'ARG';  // Short game area
  }
  if (setting === 'S4') {
    return 'PUTT'; // Putting green
  }

  return null;  // Ingen match
}
```

### Test Numbers fra Template (stub)

```typescript
// Linje 439-445
private static getTestNumbersForTemplate(_template: SessionTemplateWithCount): number[] {
  // PROBLEM: Returnerer alltid tom array
  // Kommentar sier "will be enhanced when session templates have exercise relations"
  return [];
}
```

### Eksempler på Matching

| Template-navn | Resultat | Korrekt? |
|---------------|----------|----------|
| "Driver Range Session" | TEE ✓ | Ja |
| "Approach 150m" | INN150 ✓ | Ja |
| "Chip & Pitch" | ARG ✓ | Ja |
| "Putting Drills" | PUTT ✓ | Ja |
| "Lange jern" | null ✗ | Nei (burde være INN150/200) |
| "Bunker" | null ✗ | Nei (burde være ARG) |
| "Wedge Work" | null ✗ | Nei (burde være INN50 eller ARG) |
| "Iron Play" | null ✗ | Nei |

### Konsekvens

- Avhengig av at template-navn følger konvensjoner
- Norske navn matchar ikke ("Lange jern", "Korte innspill")
- `getTestNumbersForTemplate()` er ikke implementert
- Proof-metric bonus fungerer aldri (tom array)

### ✅ FIX IMPLEMENTERT (Januar 2026)

**Endringer gjort:**

1. **Schema-endring:** Lagt til `primaryDomain` felt på `SessionTemplate` modellen
   ```prisma
   primaryDomain   String?  @map("primary_domain") @db.VarChar(10)
   // TEE, INN50, INN100, INN150, INN200, ARG, PUTT, PHYS
   ```

2. **Forbedret `getDomainForSession()` algoritme:**
   - **Prioritet 1:** Sjekker eksplisitt `primaryDomain` felt (ny)
   - **Prioritet 2:** Utvidet tekstmatch med norske nøkkelord:
     - TEE: "driver", "tee", "utslagsplass", "lange slag", "3-tre"
     - ARG: "chip", "pitch", "bunker", "sand", "rundt green", "kort spill"
     - PUTT: "putt", "holing", "green"
     - PHYS: "fysisk", "styrke", "kondisjon", "gym", "bevegelighet", "mobilitet"
     - INN: "innspill", "jern", "wedge", "iron" + avstandsdeteksjon (5-jern → INN150, 7-jern → INN100, etc.)
   - **Prioritet 3:** Setting-basert fallback (S3=ARG, S4=PUTT)

3. **Session templates oppdatert:**
   - Alle 40+ templates har nå eksplisitt `primaryDomain` satt
   - Tekniske øvelser: TEE, INN50, INN100, INN150, INN200, ARG, PUTT
   - Fysiske øvelser: PHYS
   - Mentale/taktiske: null (ikke golf-domenerelatert)

**Resultat etter fix:**

| Template-navn | Før | Etter |
|---------------|-----|-------|
| "Lange jern" | null ✗ | INN150 ✓ (tekstmatch "JERN") |
| "Bunker Grunnkurs" | null ✗ | ARG ✓ (eksplisitt primaryDomain) |
| "Jern Grunnkurs" | null ✗ | INN100 ✓ (eksplisitt primaryDomain) |
| "Putting Fundamenter" | PUTT ✓ | PUTT ✓ (uendret) |
| "Driver Introduksjon" | TEE ✓ | TEE ✓ (nå også eksplisitt) |

---

## 5. Timer-allokering

**Fil:** `session-selection.service.ts` linje 114-121 og `plan-generation.service.ts` linje 598-651

### Nåværende Implementasjon

#### Beregning av tilgjengelig tid per økt:

```typescript
// session-selection.service.ts linje 114-121
static async selectSessionForDay(context: DailyAssignmentContext): Promise<SelectedSession | null> {
  if (context.isRestDay) return null;

  // Beregn tilgjengelig varighet
  const remainingHours = context.targetHoursThisWeek - context.hoursAllocatedSoFar;
  const targetDuration = Math.min(remainingHours * 60, 180);  // Max 3 timer per økt

  if (targetDuration < 30) {
    return null;  // Ikke nok tid for meningsfull økt
  }

  // ... fortsetter med selection
}
```

#### Timer-tracking i generering:

```typescript
// plan-generation.service.ts linje 598-651
for (let day = 0; day < 365; day++) {
  // ...

  // Hent timer allokert så langt (in-memory)
  const hoursAllocatedSoFar = weeklyHoursAllocated[weekNumber] || 0;

  const context: DailyAssignmentContext = {
    // ...
    targetHoursThisWeek: periodWeek.targetHours,
    hoursAllocatedSoFar,
    // ...
  };

  const session = await SessionSelectionService.selectSessionForDay(context);

  // Oppdater timer (konverter minutter til timer)
  weeklyHoursAllocated[weekNumber] =
    (weeklyHoursAllocated[weekNumber] || 0) + (session?.estimatedDuration || 0) / 60;
}
```

### Duration Matching i Selection:

```typescript
// session-selection.service.ts linje 201-231
const templates = await prisma.sessionTemplate.findMany({
  where: {
    // ...
    duration: {
      gte: Math.max(30, criteria.targetDuration - 30),  // Minimum 30 min
      lte: criteria.targetDuration + 30,                 // ±30 min toleranse
    },
    // ...
  },
});
```

### Eksempel: Uke med 15 timer target

```
Mandag:    remaining = 15t, target = min(15*60, 180) = 180 min
           → Velger 90 min økt
           → allocated = 1.5t

Tirsdag:   remaining = 13.5t, target = min(13.5*60, 180) = 180 min
           → Velger 120 min økt
           → allocated = 3.5t

Onsdag:    HVILEDAG (medium intensity)

Torsdag:   remaining = 11.5t, target = 180 min
           → Velger 90 min økt
           → allocated = 5t

Fredag:    remaining = 10t, target = 180 min
           → Velger 60 min økt
           → allocated = 5t + 1t = 6t

Lørdag:    remaining = 9t, target = 180 min
           → Velger 120 min økt
           → allocated = 8t

Søndag:    HVILEDAG

TOTAL: 8 timer (target var 15t) - UNDERFULFILLED
```

### Konsekvens

- Alle økter forsøker max 180 min uansett type
- Ingen økt-spesifikke varigheter (teknikk vs spill vs fysisk)
- Lineær fordeling uten hensyn til dagstype
- Ofte underfulfillment av ukentlig target
- Ingen "dobbeltøkter" på intense dager

---

## 6. Constraint-prioritering

**Fil:** `session-selection.service.ts` linje 346-353

### Nåværende Implementasjon

```typescript
// Alle constraints får samme bonus: +40
if (enhancedContext?.topConstraints.length) {
  const templateDomain = this.getDomainForSession(template);
  const constraintDomains = enhancedContext.topConstraints.map((c) => c.domainCode);

  // PROBLEM: Ingen differensiering mellom constraints
  if (templateDomain && constraintDomains.includes(templateDomain)) {
    breakdown.constraintRelevance = 40;  // Flat +40 uansett prioritet
  }
}
```

### Hvordan constraints hentes:

```typescript
// plan-generation.service.ts linje 178-211
let categoryConstraints: GetBindingConstraintsOutput | null = null;
let topConstraints: BindingConstraint[] = [];

try {
  const performances: PlayerDomainPerformance[] = Object.entries(latestValues)
    .map(([testNumber, value]) => {
      const domainCode = mapTestNumberToDomain(Number(testNumber));
      if (!domainCode) return null;
      return {
        domainCode,
        currentValue: value,
        testCount: 1,
      };
    })
    .filter((p): p is PlayerDomainPerformance => p !== null);

  const currentCategory = playerCategory as CategoryAK;
  const targetCategory = getNextCategory(currentCategory);

  if (targetCategory) {
    categoryConstraints = constraintsService.calculateBindingConstraints({
      playerId: input.playerId,
      currentCategory,
      targetCategory,
      gender: playerGender,
      performances,
    });

    // Henter ALLE binding constraints, ikke bare topp
    topConstraints = categoryConstraints.bindingConstraints;
  }
} catch (error) {
  console.warn('Failed to compute category constraints:', error);
}
```

### BindingConstraint Interface:

```typescript
interface BindingConstraint {
  domainCode: TestDomainCode;
  currentValue: number;
  requiredValue: number;
  gapPercent: number;      // Hvor langt unna kravet
  priority: number;        // 1 = høyest prioritet
}
```

### Eksempel: Spiller med 4 constraints

```
Constraint 1: TEE,  gap: 25%, priority: 1  → +40 poeng
Constraint 2: PUTT, gap: 18%, priority: 2  → +40 poeng
Constraint 3: ARG,  gap: 12%, priority: 3  → +40 poeng
Constraint 4: INN100, gap: 8%, priority: 4 → +40 poeng

ALLE gir samme bonus selv om TEE er mye viktigere!
```

### Konsekvens

- Priority-feltet i BindingConstraint brukes ikke
- gapPercent brukes ikke i scoring
- En økt som trener priority-4 constraint får like mye bonus som priority-1
- Suboptimal treningsallokering mot viktigste forbedringspunkter

---

## 7. Learning Phase Progresjon

**Fil:** `periodization-templates.ts` linje 64-68 (elite eksempel) og `plan-generation.service.ts`

### Nåværende Implementasjon

Learning phases settes **statisk per periode-fase**, ikke basert på faktisk progresjon:

```typescript
// periodization-templates.ts - Elite template
learningPhaseDistribution: {
  base: ['L1', 'L2', 'L3'],           // Base: alltid L1-L3
  specialization: ['L3', 'L4', 'L5'], // Spec: alltid L3-L5
  tournament: ['L4', 'L5'],           // Tournament: alltid L4-L5
},
```

### Hvordan det brukes i generering:

```typescript
// plan-generation.service.ts linje 300-309
weeks.push({
  weekNumber,
  period,
  periodPhase: 'base',
  weekInPeriod: i + 1,

  // PROBLEM: Hentes direkte fra template, ingen progresjon
  learningPhases: template.learningPhaseDistribution.base,

  volumeIntensity: this.calculateVolumeIntensity('base', i, template.basePeriodWeeks),
  targetHours: template.weeklyHours[0],
});
```

### Hvordan det brukes i session selection:

```typescript
// session-selection.service.ts linje 127-129
const criteria: SessionSelectionCriteria = {
  // ...
  learningPhases: context.learningPhases,  // Fra periodization week
  // ...
};

// Linje 208-210 - Query filter
const templates = await prisma.sessionTemplate.findMany({
  where: {
    // ...
    learningPhase: {
      in: criteria.learningPhases,  // Må matche en av tillatte faser
    },
    // ...
  },
});

// Linje 309-311 - Scoring
if (template.learningPhase && criteria.learningPhases.includes(template.learningPhase)) {
  breakdown.learningPhaseMatch = 50;  // +50 for match
}
```

### Eksempel: Elite spiller gjennom året

```
Uke 1-16 (Base):
  - Tillatte learning phases: [L1, L2, L3]
  - Alle økter må ha L1, L2 eller L3
  - INGEN progresjon innenfor base-perioden

Uke 17-40 (Specialization):
  - Tillatte learning phases: [L3, L4, L5]
  - Brå overgang fra L1-L3 til L3-L5
  - INGEN gradvis økning av L4/L5 andel

Uke 41-50 (Tournament):
  - Tillatte learning phases: [L4, L5]
  - Kun L4 og L5 tillatt
  - Ingen L1-L3 selv om nye ferdigheter introduseres
```

### Learning Phase Definisjoner

| Fase | Navn | Beskrivelse |
|------|------|-------------|
| L1 | Acquisition | Lære ny ferdighet, høy kognitiv belastning |
| L2 | Consolidation | Befeste ferdighet, repetisjon |
| L3 | Automation | Automatisere bevegelse, mindre fokus |
| L4 | Transfer | Overføre til spillsituasjon |
| L5 | Competition | Bruke under press/konkurranse |

### Konsekvens

- Spiller på L1 i uke 1 er fortsatt på "L1-L3" i uke 16
- Ingen tracking av faktisk ferdighetsutvikling
- Brå overgang kan føre til for vanskelige økter
- Nye ferdigheter i tournament-periode har ingen L1/L2 mulighet
- Alle spillere i samme kategori får identisk progresjon

---

## Oppsummering: Nåværende Tilstand

| # | Problem | Implementasjon | Fil:Linje |
|---|---------|----------------|-----------|
| 1 | Periodoverganger | `i < weeks/2 ? 'E' : 'G'` | plan-generation:298 |
| 2 | Intensitetsprofil | Statisk per fase, spec alltid "high" | plan-generation:398-422 |
| 3 | Hviledag | Fast mønster per intensitet | session-selection:592-623 |
| 4 | Domain mapping | Tekstmatch på template.name | session-selection:391-434 |
| 5 | Timer-allokering | `min(remaining*60, 180)` | session-selection:114-121 |
| 6 | Constraint-prio | Flat +40 uansett priority | session-selection:346-353 |
| 7 | Learning phase | Statisk array per fase | periodization-templates:64-68 |

---

## Relaterte Filer

```
apps/api/src/domain/training-plan/
├── plan-generation.service.ts    # Hovedalgoritme (736 linjer)
├── plan-generation.types.ts      # TypeScript interfaces
├── periodization-templates.ts    # 5 kategori-maler (288 linjer)
├── session-selection.service.ts  # Øktvalg-logikk (625 linjer)
├── plan-progress.service.ts      # Progress tracking
└── plan-review.service.ts        # Coach approval
```
