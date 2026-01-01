# Testdata Behandling - Komplett Oversikt

> Dokumentasjon av hvordan testdata håndteres i IUP Golf Platform

---

## 1. Oversikt

Testdata-systemet består av:
- **20 standardiserte tester** (Team Norway protokoll)
- **Automatisk beregning** av resultater
- **Kategori-evaluering** (A-K nivå)
- **Breaking point auto-oppretting** for svake områder
- **Peer-sammenligning** med spillere på samme nivå
- **Progresjonssporing** over tid

---

## 2. De 20 Team Norway Testene

### Distanse-tester (1-7)

| Test | Navn | Input | Beregning | Enhet |
|------|------|-------|-----------|-------|
| 1 | Driver Avstand | 6 slag | Beste 3 gjennomsnitt (carry) | meter |
| 2 | 3-Tre Avstand | 6 slag | Beste 3 gjennomsnitt (carry) | meter |
| 3 | 5-Jern Avstand | 6 slag | Beste 3 gjennomsnitt (carry) | meter |
| 4 | PW Avstand | 6 slag | Beste 3 gjennomsnitt (carry) | meter |
| 5 | Klubbhastighet | 6 slag | Beste 3 gjennomsnitt | km/t |
| 6 | Ballhastighet | 6 slag | Beste 3 gjennomsnitt | km/t |
| 7 | Smash Factor | 6 slag | Ball-hastighet / Klubb-hastighet | ratio |

### Approach-tester med PEI (8-11)

| Test | Navn | Input | Ideal-avstand | PEI-formel |
|------|------|-------|---------------|------------|
| 8 | Approach 25m | 10 slag | 2.5m | avg_avstand / 2.5 |
| 9 | Approach 50m | 10 slag | 5.0m | avg_avstand / 5.0 |
| 10 | Approach 75m | 10 slag | 7.5m | avg_avstand / 7.5 |
| 11 | Approach 100m | 10 slag | 10.0m | avg_avstand / 10.0 |

**PEI (Precision Efficiency Index)**: Lavere = bedre. PEI = 1.0 betyr perfekt presisjon.

### Fysiske tester (12-14)

| Test | Navn | Input | Beregning | Enhet |
|------|------|-------|-----------|-------|
| 12 | Benkpress | 1RM forsøk | Maks vekt løftet | kg |
| 13 | Markløft Trapbar | 1RM forsøk | Maks vekt løftet | kg |
| 14 | 3000m Løping | Tid på mølle | Total tid | sekunder |

### Kortspill-tester (15-18)

| Test | Navn | Input | Beregning | Enhet |
|------|------|-------|-----------|-------|
| 15 | Putting 3m | 10 putts | Suksessrate | % |
| 16 | Putting 6m | 10 putts | Suksessrate | % |
| 17 | Chipping | 10 chips | Gjennomsnitt avstand fra hull | cm |
| 18 | Bunker | 10 slag | Gjennomsnitt avstand fra hull | cm |

### On-Course tester (19-20)

| Test | Navn | Input | Beregning |
|------|------|-------|-----------|
| 19 | 9-Hulls Simulering | 9 hull | Score + FIR% + GIR% + Avg putts |
| 20 | On-Course Skills | 3-6 hull | Score + Scrambling% + Penalties |

---

## 3. Database-modeller

### Test (test-definisjoner)

```prisma
model Test {
  id              String   @id @db.Uuid
  tenantId        String   @map("tenant_id")
  name            String   // "Driver Distance"
  testNumber      Int      // 1-20
  category        String   // "distance", "approach", "physical", etc.
  testType        String   // "speed", "accuracy", "strength", etc.
  protocolName    String   // "Team Norway Standard"
  protocolVersion String   // "1.0"
  description     String   // Detaljert beskrivelse
  targetCategory  String?  // Hvilken kategori testen er for
  testDetails     Json     // Ekstra konfigurasjonsdata
  benchmarkWeek   Boolean  // Er dette en benchmark-uke test?
  isActive        Boolean  // Er testen aktiv?

  results         TestResult[]
}
```

### TestResult (test-resultater)

```prisma
model TestResult {
  id                   String   @id @db.Uuid
  testId               String   @map("test_id")
  playerId             String   @map("player_id")

  // Metadata
  testDate             DateTime // Når testen ble gjennomført
  testTime             String?  // Klokkeslett (HH:MM)
  location             String?  // Sted
  facility             String?  // Anlegg
  environment          String?  // "indoor" | "outdoor"
  weather              String?  // Værforhold
  equipment            String?  // Utstyr brukt

  // Rådata (JSON)
  results              Json     // Alle individuelle slag/forsøk

  // Beregnede verdier
  value                Decimal  // Hovedverdi (carry, tid, PEI, etc.)
  pei                  Decimal? // For approach-tester (8-11)
  passed               Boolean  // Møtte kategori-krav?
  categoryRequirement  Decimal? // Hva var kravet?
  percentOfRequirement Decimal? // Hvor mange % av kravet?

  // Progresjon
  categoryBenchmark    Boolean  // Benchmark-resultat?
  improvementFromLast  Decimal? // Forbedring fra forrige test

  // Ekstra data
  videoUrl             String?  // Link til video
  trackerData          Json?    // Data fra launch monitor
  coachFeedback        String?  // Trener-kommentarer
  playerFeedback       String?  // Spiller-kommentarer

  // Relasjoner
  test                 Test
  player               Player
  peerComparisons      PeerComparison[]
}
```

### CategoryRequirement (kategori-krav)

```prisma
model CategoryRequirement {
  id          String  @id @db.Uuid
  tenantId    String  @map("tenant_id")
  category    String  // "A", "B", ... "K"
  gender      String  // "M" | "K"
  testNumber  Int     // 1-20
  requirement Decimal // Krav-verdi
  unit        String  // "m", "km/h", "%", "s", etc.
  comparison  String  // ">=", "<=", "range"
  rangeMin    Decimal?
  rangeMax    Decimal?
}
```

---

## 4. Dataflyt-diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SPILLER TAR TEST                             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     RÅDATA REGISTRERES                              │
│  - 6 slag for distanse-tester                                       │
│  - 10 slag for approach/putting/bunker                              │
│  - Tid/vekt for fysiske tester                                      │
│  - Hull-data for on-course tester                                   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 TEST CALCULATOR SERVICE                             │
│  calculateTestResultAsync(testNumber, input, player, repository)    │
│                                                                     │
│  Switch på testNumber (1-20):                                       │
│  - case 1-4: calculateTest1-4() - Beste 3 av 6 gjennomsnitt         │
│  - case 5-7: calculateTest5-7() - Hastighet/Smash factor            │
│  - case 8-11: calculateTest8-11() - PEI-beregning                   │
│  - case 12-14: calculateTest12-14() - Fysiske verdier               │
│  - case 15-18: calculateTest15-18() - Kortspill                     │
│  - case 19-20: calculateTest19-20() - On-course metrics             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                KATEGORI-EVALUERING                                  │
│                                                                     │
│  1. Hent CategoryRequirement for spiller.category + testNumber      │
│  2. Sammenlign beregnet verdi mot krav                              │
│  3. Sett passed = true/false                                        │
│  4. Beregn percentOfRequirement                                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 PEER COMPARISON                                     │
│                                                                     │
│  1. Finn spillere med samme kategori + kjønn                        │
│  2. Beregn percentil-rangering                                      │
│  3. Beregn z-score                                                  │
│  4. Lagre i PeerComparison-tabell                                   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│              BREAKING POINT EVALUERING                              │
│                                                                     │
│  Hvis passed = false OG avvik er signifikant:                       │
│  → Auto-opprett BreakingPoint                                       │
│  → Tildel relevante øvelser                                         │
│  → Sett severity (low/medium/high)                                  │
│  → Beregn hoursPerWeek for trening                                  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│               ÅRSPLAN PÅVIRKNING                                    │
│                                                                     │
│  Breaking points → Session Selection Service                        │
│  → Høyere score for økter som trener svake områder                  │
│  → Mer treningstid allokert til breaking points                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Beregningsformler

### Distanse-tester (1-4)

```typescript
// Beste 3 av 6 slag
function calculateDistanceTest(shots: Shot[]): number {
  const sorted = shots
    .map(s => s.carryDistanceMeters)
    .sort((a, b) => b - a);  // Synkende

  const top3 = sorted.slice(0, 3);
  return top3.reduce((sum, d) => sum + d, 0) / 3;
}
```

### Approach-tester (8-11) - PEI

```typescript
const IDEAL_DISTANCES = {
  8: 2.5,   // 25m approach → ideal 2.5m fra hull
  9: 5.0,   // 50m approach → ideal 5.0m fra hull
  10: 7.5,  // 75m approach → ideal 7.5m fra hull
  11: 10.0  // 100m approach → ideal 10.0m fra hull
};

function calculatePEI(testNumber: number, shots: Shot[]): number {
  const avgDistance = shots
    .map(s => s.distanceToHoleMeters)
    .reduce((sum, d) => sum + d, 0) / shots.length;

  const idealDistance = IDEAL_DISTANCES[testNumber];
  return avgDistance / idealDistance;  // Lavere = bedre
}
```

### Smash Factor (Test 7)

```typescript
function calculateSmashFactor(shots: Shot[]): number {
  const smashFactors = shots.map(s =>
    s.ballSpeedKmh / s.clubSpeedKmh
  );

  // Beste 3 gjennomsnitt
  const sorted = smashFactors.sort((a, b) => b - a);
  const top3 = sorted.slice(0, 3);
  return top3.reduce((sum, sf) => sum + sf, 0) / 3;
}
```

### Putting Success Rate (Test 15-16)

```typescript
function calculatePuttingSuccess(putts: Putt[]): number {
  const holed = putts.filter(p => p.holed).length;
  return (holed / putts.length) * 100;  // Prosent
}
```

---

## 6. Breaking Point Auto-Oppretting

### Triggere for auto-oppretting

1. **Test-resultat under krav**
   - passed = false
   - percentOfRequirement < 80%

2. **Kalibrering viser svak kølle**
   - Deviation > 5% fra forventet hastighet

3. **Benchmark-uke analyse**
   - Identifiserer svake områder på tvers av tester

### Severity-beregning

```typescript
const DEVIATION_THRESHOLDS = {
  LOW: 5,     // 5-10% avvik
  MEDIUM: 10, // 10-15% avvik
  HIGH: 15    // >15% avvik
};

const HOURS_PER_WEEK = {
  low: 2,
  medium: 3,
  high: 5
};

function calculateSeverity(deviationPercent: number): Severity {
  if (deviationPercent >= 15) return 'high';
  if (deviationPercent >= 10) return 'medium';
  return 'low';
}
```

### Breaking Point struktur

```prisma
model BreakingPoint {
  id                  String   @id
  playerId            String
  processCategory     String   // "speed", "technique", "physical"
  specificArea        String   // "Driver speed efficiency"
  description         String   // Detaljert beskrivelse
  identifiedDate      DateTime
  severity            String   // "low", "medium", "high"

  // Måling
  baselineMeasurement String?  // "95.5 mph"
  targetMeasurement   String?  // "102.0 mph"
  currentMeasurement  String?  // "97.2 mph"
  progressPercent     Int      // 0-100

  // Trening
  assignedExerciseIds String[] // Øvelser som er tildelt
  hoursPerWeek        Int?     // Timer per uke
  status              String   // "not_started", "in_progress", "resolved"

  // Kilde
  sourceType          String   // "manual", "calibration", "test_result"
  calibrationId       String?  // Hvis fra kalibrering
  autoDetected        Boolean  // Automatisk oppdaget?
}
```

---

## 7. Kategori-krav (A-K)

### Eksempel: Driver Avstand (Test 1)

| Kategori | Menn (carry) | Kvinner (carry) |
|----------|--------------|-----------------|
| A | 270m+ | 225m+ |
| B | 260m+ | 215m+ |
| C | 250m+ | 205m+ |
| D | 240m+ | 195m+ |
| E | 230m+ | 185m+ |
| F | 220m+ | 175m+ |
| G | 210m+ | 165m+ |
| H | 200m+ | 155m+ |
| I | 190m+ | 145m+ |
| J | 180m+ | 135m+ |
| K | 170m+ | 125m+ |

### Eksempel: PEI-krav (Test 8-11)

| Kategori | PEI-krav (lavere = bedre) |
|----------|---------------------------|
| A | ≤ 0.80 |
| B | ≤ 0.90 |
| C | ≤ 1.00 |
| D | ≤ 1.10 |
| E | ≤ 1.20 |
| F | ≤ 1.30 |
| G | ≤ 1.40 |
| H | ≤ 1.50 |
| I | ≤ 1.60 |
| J | ≤ 1.70 |
| K | ≤ 1.80 |

---

## 8. API Endepunkter

### Test-administrasjon

| Metode | Endepunkt | Beskrivelse |
|--------|-----------|-------------|
| POST | `/api/v1/tests` | Opprett test-definisjon |
| GET | `/api/v1/tests` | List tester |
| GET | `/api/v1/tests/:id` | Hent test |
| PATCH | `/api/v1/tests/:id` | Oppdater test |
| DELETE | `/api/v1/tests/:id` | Slett test |

### Test-resultater

| Metode | Endepunkt | Beskrivelse |
|--------|-----------|-------------|
| POST | `/api/v1/tests/results` | Registrer resultat |
| GET | `/api/v1/tests/results` | List resultater |
| GET | `/api/v1/tests/results/:id` | Hent resultat |
| PATCH | `/api/v1/tests/results/:id` | Oppdater resultat |
| DELETE | `/api/v1/tests/results/:id` | Slett resultat |

### Enhanced (med peer-sammenligning)

| Metode | Endepunkt | Beskrivelse |
|--------|-----------|-------------|
| POST | `/api/v1/tests/results/enhanced` | Registrer med auto-beregning + peer |
| GET | `/api/v1/tests/results/:id/enhanced` | Hent med peer-sammenligning |
| GET | `/api/v1/tests/players/:playerId/history/:testNumber` | Spiller test-historikk |

### Progresjon

| Metode | Endepunkt | Beskrivelse |
|--------|-----------|-------------|
| GET | `/api/v1/tests/progress` | Spiller-progresjon på tvers av tester |

---

## 9. Peer Comparison

### Beregning

```typescript
interface PeerComparison {
  testResultId: string;
  percentile: number;     // 0-100, hvor godt vs peers
  zScore: number;         // Standardavvik fra gjennomsnittet
  peerCount: number;      // Antall peers i sammenligningen
  peerCategory: string;   // Kategori sammenlignet med
  peerGender: string;     // Kjønn sammenlignet med
}

function calculatePercentile(value: number, peerValues: number[]): number {
  const sorted = peerValues.sort((a, b) => a - b);
  const below = sorted.filter(v => v < value).length;
  return (below / sorted.length) * 100;
}

function calculateZScore(value: number, peerValues: number[]): number {
  const mean = peerValues.reduce((a, b) => a + b, 0) / peerValues.length;
  const stdDev = Math.sqrt(
    peerValues.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / peerValues.length
  );
  return (value - mean) / stdDev;
}
```

---

## 10. Input-typer per Test

### Test 1-4 (Distanse)

```typescript
interface DistanceTestInput {
  metadata: {
    testDate: Date;
    testTime?: string;  // "HH:MM"
    location: string;
    facility: string;
    environment: 'indoor' | 'outdoor';
    conditions?: {
      weather?: string;
      wind?: string;
      temperature?: number;
    };
  };
  shots: Array<{
    shotNumber: number;       // 1-6
    carryDistanceMeters: number;
  }>;
}
```

### Test 8-11 (Approach)

```typescript
interface ApproachTestInput {
  metadata: TestMetadata;
  shots: Array<{
    shotNumber: number;           // 1-10
    distanceToHoleMeters: number;
  }>;
  targetDistance: number;  // 25, 50, 75, eller 100
}
```

### Test 15-16 (Putting)

```typescript
interface PuttingTestInput {
  metadata: TestMetadata;
  putts: Array<{
    puttNumber: number;          // 1-10
    holed: boolean;
    distanceFromHoleCm?: number; // Hvis ikke holed
  }>;
}
```

### Test 19 (9-Hulls Simulering)

```typescript
interface NineHoleTestInput {
  metadata: TestMetadata;
  holes: Array<{
    holeNumber: number;     // 1-9
    par: number;            // 3, 4, eller 5
    score: number;          // Faktisk score
    fairwayHit?: boolean;   // Par 4/5 only
    girReached?: boolean;   // Green in regulation
    putts: number;
    upAndDown?: boolean;    // Hvis GIR missed
  }>;
}
```

---

## 11. Nøkkelfiler

| Fil | Formål |
|-----|--------|
| `domain/tests/types.ts` | TypeScript-definisjoner for alle 20 tester |
| `domain/tests/test-calculator.ts` | Hovedberegningsservice |
| `domain/tests/calculations/distance-tests.ts` | Test 1-7 beregninger |
| `domain/tests/calculations/approach-tests.ts` | Test 8-11 PEI-beregninger |
| `domain/tests/calculations/physical-tests.ts` | Test 12-14 beregninger |
| `domain/tests/calculations/short-game-tests.ts` | Test 15-18 beregninger |
| `domain/tests/calculations/on-course-tests.ts` | Test 19-20 beregninger |
| `domain/tests/requirements-repository.ts` | Kategori-krav fra database |
| `domain/breaking-points/auto-creation.service.ts` | Auto-oppretting av breaking points |
| `api/v1/tests/service.ts` | API-service for tester |
| `api/v1/tests/test-results-enhanced.service.ts` | Enhanced med peer-sammenligning |

---

## 12. Integrasjon med Årsplan

### Session Selection Scoring

Når økter velges for årsplanen, får de bonuspoeng for:

```typescript
// Breaking point matching
if (session.focusAreas.includes(breakingPoint.specificArea)) {
  score += 25;  // +25 poeng for økt som trener svak område
}

// Test performance matching
if (session.targetTests.includes(failedTestNumber)) {
  score += 20;  // +20 poeng for økt som forbedrer svak test
}
```

### Treningstid-allokering

```typescript
// Timer per uke basert på breaking point severity
const weeklyHours = {
  low: 2,      // 2 timer/uke
  medium: 3,   // 3 timer/uke
  high: 5      // 5 timer/uke
};
```

---

## 13. Validering

```typescript
function validateTestInput(testNumber: number, input: any): boolean {
  // Felles validering
  if (!input.metadata) throw new Error('Metadata required');
  if (!['indoor', 'outdoor'].includes(input.metadata.environment)) {
    throw new Error('Environment must be indoor or outdoor');
  }

  // Test-spesifikk validering
  switch (testNumber) {
    case 1-4:  // Distanse
      if (input.shots?.length !== 6) throw new Error('Requires 6 shots');
      break;
    case 8-11: // Approach
      if (input.shots?.length !== 10) throw new Error('Requires 10 shots');
      if (!input.targetDistance) throw new Error('Target distance required');
      break;
    case 15-16: // Putting
      if (input.putts?.length !== 10) throw new Error('Requires 10 putts');
      break;
    case 19:   // 9-hull
      if (input.holes?.length !== 9) throw new Error('Requires 9 holes');
      break;
    case 20:   // On-course
      if (input.holes?.length < 3 || input.holes?.length > 6) {
        throw new Error('Requires 3-6 holes');
      }
      break;
  }

  return true;
}
```

---

## 14. Eksempel: Komplett Test-flyt

### 1. Spiller tar Test 8 (Approach 25m)

```json
{
  "metadata": {
    "testDate": "2024-01-15",
    "testTime": "14:30",
    "location": "Miklagard Golf",
    "facility": "Driving Range",
    "environment": "outdoor"
  },
  "shots": [
    { "shotNumber": 1, "distanceToHoleMeters": 2.1 },
    { "shotNumber": 2, "distanceToHoleMeters": 3.5 },
    { "shotNumber": 3, "distanceToHoleMeters": 1.8 },
    { "shotNumber": 4, "distanceToHoleMeters": 4.2 },
    { "shotNumber": 5, "distanceToHoleMeters": 2.9 },
    { "shotNumber": 6, "distanceToHoleMeters": 2.3 },
    { "shotNumber": 7, "distanceToHoleMeters": 3.1 },
    { "shotNumber": 8, "distanceToHoleMeters": 2.7 },
    { "shotNumber": 9, "distanceToHoleMeters": 1.9 },
    { "shotNumber": 10, "distanceToHoleMeters": 2.5 }
  ],
  "targetDistance": 25
}
```

### 2. Beregning kjøres

```typescript
// Gjennomsnitt: (2.1+3.5+1.8+4.2+2.9+2.3+3.1+2.7+1.9+2.5) / 10 = 2.7m
// PEI: 2.7 / 2.5 = 1.08

const result = {
  value: 2.7,                    // Gjennomsnitt avstand
  pei: 1.08,                     // PEI-score
  passed: false,                 // Kategori C krav: ≤1.00
  categoryRequirement: 1.00,     // Kategori C krav
  percentOfRequirement: 92.6     // 1.00/1.08 * 100
};
```

### 3. Breaking Point opprettes

```typescript
// Siden passed = false og PEI > krav:
const breakingPoint = {
  processCategory: 'approach',
  specificArea: 'Approach 25m precision',
  description: 'PEI 1.08 is above category C requirement of 1.00',
  severity: 'low',              // 8% over krav
  hoursPerWeek: 2,
  assignedExerciseIds: ['ex-123', 'ex-456']
};
```

### 4. Årsplan justeres

Session Selection gir høyere score til økter som trener approach 25m.

---

*Generert: 2024*
*Versjon: 1.0*
