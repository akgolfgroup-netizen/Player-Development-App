# IUP Golf Platform: Arkitektur og Datastrategi
## Workshop-dokument for Teknisk Rådgivning

> **Møtedeltakere:** Anders Kristiansen (Produkteier), [Onkel] (IT-arkitekt, OUS)
> **Dato:** [Sett inn dato]
> **Formål:** Strategisk diskusjon om dataarkitektur og AI-muligheter

---

## EXECUTIVE SUMMARY

**IUP Golf Platform** er en treningsapp for golfspillere som samler inn strukturert data om spillerprestasjoner, trening og utvikling. Målet er å bruke denne dataen til å generere personaliserte årsplaner og gi evidensbaserte treningsanbefalinger.

**Parallell til helsesektoren:**
- Spiller = Pasient
- Testresultater = Kliniske målinger
- Årsplan = Behandlingsplan
- Coach = Behandler
- DataGolf API = Nasjonale kvalitetsregistre

**Kjerneutfordring:** Hvordan bygge en datainfrastruktur som muliggjør:
1. Personalisert plangenerering basert på individuelle data
2. Kontinuerlig læring fra aggregerte resultater
3. Prediktiv analyse av spillerutvikling

---

## DEL 1: DOMENEFORSTÅELSE

### 1.1 Hva er IUP?

**Individual Development Plan (IUP)** er et systematisk rammeverk for golfutvikling:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    UTVIKLINGSMODELLEN                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   SPILLER        →    TESTING    →    KATEGORISERING    →    PLAN  │
│   (Input)             (20 tester)     (A-K system)           (52 uker)│
│                                                                     │
│   Score: 78           Driver: 235m    Kategori: E             G-periode│
│   Handicap: 6.2       Speed: 155km/h  (Competitive)           14 uker  │
│   Alder: 16           Wedge PEI: 1.2                                │
│                       Putting: 72%                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Kategori-systemet (A-K)

Spillere kategoriseres basert på gjennomsnittsscore:

| Kategori | Score-range | Beskrivelse | Treningstimer/uke |
|----------|-------------|-------------|-------------------|
| **A** | < 70 | World Elite | 20-25 |
| **B** | 70-72 | Tour Pro | 18-22 |
| **C** | 72-74 | Elite Amateur | 15-20 |
| **D** | 74-76 | Advanced | 12-18 |
| **E** | 76-78 | Competitive | 10-15 |
| **F** | 78-80 | Intermediate | 8-12 |
| **G** | 80-82 | Developing | 6-10 |
| **H** | 82-85 | Beginner Adult | 5-8 |
| **I** | 85-88 | Rec Junior | 4-6 |
| **J** | 88-92 | Dev Junior | 4-8 |
| **K** | > 92 | Nybegynner | 2-4 |

### 1.3 Periodisering

Året deles i 4 hovedperioder:

```
┌────────────────────────────────────────────────────────────────────┐
│ UKE:  1    10    20    30    40    52                              │
│       │     │     │     │     │     │                              │
│       ├─────┼─────┼─────┼─────┼─────┤                              │
│       │  E  │  G  │  S  │  T  │ E/G │                              │
│       │ 4u  │ 18u │ 14u │ 14u │ 2u  │                              │
│       │     │     │     │     │     │                              │
│       │EVAL │GRUNN│SPEC │TURN │REC  │                              │
└────────────────────────────────────────────────────────────────────┘

E = Evaluering:    Testing, målsetting, refleksjon
G = Grunnperiode:  Bygge teknisk fundament
S = Spesialisering: Golf-spesifikk utvikling
T = Turnering:     Konkurransefokus, vedlikehold
```

---

## DEL 2: DATAKILDER OG DATAMODELL

### 2.1 Oversikt over Datakilder

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATAKILDER                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │   INTERN DATA   │    │   EKSTERN DATA  │    │  FRAMTIDIG DATA │ │
│  │   (Appen)       │    │   (DataGolf)    │    │   (Integrasjoner)│ │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘ │
│           │                      │                      │          │
│  • 20 golftester      • 451 pro-spillere     • Wearables (søvn)   │
│  • Treningsøkter      • Strokes Gained       • GPS trackers       │
│  • Turneringsres.     • Tour averages        • Launch monitors    │
│  • Video-analyse      • Driving stats        • Fysisk trening     │
│  • Breaking points    • Skill ratings        • Ernæring           │
│  • Spillerprofil                             • Kalenderdata       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Intern Data - Detaljert

#### A. Spillerprofil (Player)

```typescript
Player {
  // Identitet
  id, tenantId, firstName, lastName
  dateOfBirth, gender

  // Golf-metrics
  category: "A" | "B" | ... | "K"    // Nåværende nivå
  averageScore: 78.5                  // Snitt over siste X runder
  handicap: 6.2                       // Offisielt handicap
  wagrRank: 1250                      // Verdensranking (junior)

  // Treningskontekst
  weeklyTrainingHours: 12
  currentPeriod: "G" | "S" | "T" | "E"
  seasonStartDate: Date

  // Koblinger
  coachId → Coach
  parentId → Parent
  annualPlans → AnnualTrainingPlan[]
  testResults → TestResult[]
  trainingSessions → TrainingSession[]
  breakingPoints → BreakingPoint[]
}
```

#### B. Testresultater (TestResult)

**20 standardiserte tester** som måles hver 3. uke:

| # | Test | Kategori | Måleenhet | Eksempel krav (D) |
|---|------|----------|-----------|-------------------|
| 1 | Driver Carry | Distanse | meter | 240m |
| 2 | 3-tre Carry | Distanse | meter | 220m |
| 3 | 5-jern Carry | Distanse | meter | 175m |
| 4 | Wedge PW | Distanse | meter | 115m |
| 5 | Clubhead Speed | Hastighet | km/h | 169 |
| 6 | Ball Speed | Hastighet | km/h | 240 |
| 7 | Smash Factor | Effektivitet | ratio | 1.42 |
| 8-11 | Approach PEI | Presisjon | PEI-verdi | 1.6 |
| 12-14 | Fysiske tester | Styrke | varierende | - |
| 15-18 | Shortgame | Prosent | % | 60% |
| 19-20 | On-course | Score | slag | - |

```typescript
TestResult {
  // Identifikatorer
  testId → Test (1-20)
  playerId → Player
  testDate: Date

  // Kontekst
  environment: "indoor" | "outdoor"
  weather: "calm" | "windy" | ...
  equipment: "TrackMan" | "GCQuad" | ...

  // Resultater
  results: JSON           // Rå data (alle slag/forsøk)
  value: 245.5            // Hovedverdi (beregnet)
  pei: 1.45               // For approach-tester

  // Evaluering mot kategori
  passed: boolean
  categoryRequirement: 240
  percentOfRequirement: 102.3%
  improvementFromLast: +3.2%

  // Feedback
  coachFeedback: "Bra fremgang på..."
  videoUrl: "https://..."
}
```

#### C. Treningsøkter (TrainingSession)

```typescript
TrainingSession {
  // Identifikatorer
  playerId → Player
  coachId → Coach
  dailyAssignmentId → DailyTrainingAssignment  // Kobling til plan

  // Timing
  sessionDate: DateTime
  duration: 90  // minutter

  // Klassifisering
  sessionType: "langspill" | "kortspill" | "putting" | "fysisk" | "mental" | ...
  period: "E" | "G" | "S" | "T"
  learningPhase: "L1" | "L2" | "L3" | "L4" | "L5"
  clubSpeed: "CS60" | "CS80" | "CS100" | ...
  setting: "S1" ... "S10"  // Kontrollert → Turnering

  // Innhold
  focusArea: "driver_consistency"
  drillIds: [uuid, uuid, ...]
  intensity: 1-5

  // Evaluering (spillerens egen)
  evaluationFocus: 8        // 1-10
  evaluationTechnical: 7    // 1-10
  evaluationEnergy: 6       // 1-10
  evaluationMental: 9       // 1-10

  // Pre-shot rutine tracking
  preShotConsistency: "yes" | "partial" | "no"
  preShotCount: 45
  totalShots: 60

  // Notater
  notes: "Fokuserte på..."
  technicalCues: ["hold hodet", "rolig tempo"]
}
```

#### D. Breaking Points

Svakheter identifisert gjennom testing:

```typescript
BreakingPoint {
  playerId → Player

  // Klassifisering
  processCategory: "distance" | "approach" | "shortgame" | "putting" | "physical" | "mental"
  specificArea: "wedge_distance_control"
  severity: "critical" | "moderate" | "minor"

  // Målinger
  baselineMeasurement: "PEI 2.1"
  targetMeasurement: "PEI 1.6"
  currentMeasurement: "PEI 1.8"
  progressPercent: 60

  // Behandling
  assignedExerciseIds: [...]
  hoursPerWeek: 3

  // Status
  status: "not_started" | "in_progress" | "resolved"
  identifiedDate: Date
  resolvedDate: Date

  // Kilde
  sourceType: "manual" | "auto_detected" | "test_result"
  autoDetected: boolean
}
```

#### E. Statistikk-aggregering

```typescript
// Daglig
DailyTrainingStats {
  date, plannedSessions, completedSessions
  plannedMinutes, actualMinutes
  avgQuality, avgFocus
  streakDay  // Treningsstreak
}

// Ukentlig
WeeklyTrainingStats {
  year, weekNumber
  plannedSessions, completedSessions, skippedSessions
  completionRate: 85%
  sessionTypeBreakdown: { langspill: 120min, kortspill: 90min, ... }
  learningPhaseMinutes: { L1: 30, L2: 45, L3: 60, ... }
  avgQuality, avgFocus
}

// Månedlig
MonthlyTrainingStats {
  year, month
  totalMinutes, avgMinutesPerDay
  testsCompleted
  sessionsChange: +5  // vs forrige måned
}
```

### 2.3 Ekstern Data - DataGolf API

**Abonnement:** Pro tier ($20/mnd)
**Synkronisering:** Daglig kl 03:00 UTC

```typescript
DataGolfPlayer {
  dataGolfId: "18417"
  playerName: "Scheffler, Scottie"

  // Strokes Gained (kjernedata)
  sgTotal: 3.118
  sgOffTee: 0.905
  sgApproach: 1.344
  sgAroundGreen: 0.309
  sgPutting: 0.559

  // Tradisjonelle stats
  drivingDistance: 11.76  // over tour average
  drivingAccuracy: 0.65   // 65%
  girPercent: 72.3
  scramblingPercent: 58.5
  puttsPerRound: 28.4

  // Metadata
  tour: "PGA"
  season: 2025
  lastSynced: DateTime
}

DataGolfTourAverage {
  tour: "PGA" | "LPGA" | "DP_WORLD"
  season: 2025
  stats: {
    sgTotal: -0.485,
    sgOffTee: -0.160,
    sgApproach: -0.217,
    ...
  }
}
```

**Tilgjengelige data:**
- 451 pro-spillere med komplette Strokes Gained
- 3,394 spillere i spillerliste
- Tour averages for PGA, LPGA, DP World Tour

### 2.4 Årsplan-struktur (Generert Data)

```typescript
AnnualTrainingPlan {
  playerId → Player

  // Metadata
  planName: "78 avg - 12-month plan"
  startDate, endDate
  status: "active" | "draft" | "completed"

  // Baseline ved generering
  baselineAverageScore: 78.5
  baselineHandicap: 6.2
  baselineDriverSpeed: 155
  playerCategory: "E"

  // Periodiseringsstruktur
  basePeriodWeeks: 18
  specializationWeeks: 14
  tournamentWeeks: 14

  // Volum
  weeklyHoursTarget: 12
  intensityProfile: { ... }

  // Algoritme-versjon (for A/B testing)
  generationAlgorithm: "v1.0"
}

Periodization {
  annualPlanId → AnnualTrainingPlan
  weekNumber: 1-52
  period: "E" | "G" | "S" | "T"
  periodPhase: "base" | "specialization" | "tournament" | "recovery"
  volumeIntensity: "low" | "medium" | "high" | "peak" | "taper"
  plannedHours: 12
  actualHours: 10
}

DailyTrainingAssignment {
  annualPlanId → AnnualTrainingPlan
  playerId → Player

  // Dato
  assignedDate: Date
  weekNumber, dayOfWeek

  // Økt-tildeling
  sessionTemplateId → SessionTemplate
  sessionType: "langspill"
  estimatedDuration: 90

  // Kontekst
  period: "G"
  learningPhase: "L3"
  clubSpeed: "CS80"
  intensity: 7

  // Fleksibilitet
  isRestDay: false
  isOptional: false
  canBeSubstituted: true

  // Sporing
  status: "planned" | "completed" | "skipped" | "rescheduled"
  completedSessionId → TrainingSession
  completedAt: DateTime
}
```

---

## DEL 3: DATAFLYT OG RELASJONER

### 3.1 Entitetsrelasjoner (ER-diagram)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATAMODELL OVERSIKT                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                              ┌──────────────┐                               │
│                              │    TENANT    │                               │
│                              │   (Klubb)    │                               │
│                              └──────┬───────┘                               │
│                                     │                                       │
│           ┌─────────────────────────┼─────────────────────────┐             │
│           │                         │                         │             │
│           v                         v                         v             │
│   ┌──────────────┐          ┌──────────────┐          ┌──────────────┐     │
│   │    COACH     │◄────────►│    PLAYER    │◄────────►│   PARENT     │     │
│   └──────────────┘          └──────┬───────┘          └──────────────┘     │
│                                    │                                        │
│           ┌────────────────────────┼────────────────────────┐               │
│           │              │         │         │              │               │
│           v              v         v         v              v               │
│   ┌────────────┐ ┌────────────┐ ┌────────┐ ┌────────────┐ ┌────────────┐   │
│   │ TestResult │ │ Training   │ │Breaking│ │ Tournament │ │  Annual    │   │
│   │    (20)    │ │ Session    │ │ Point  │ │   Result   │ │   Plan     │   │
│   └────────────┘ └────────────┘ └────────┘ └────────────┘ └─────┬──────┘   │
│                        │                                        │           │
│                        │         ┌──────────────────────────────┘           │
│                        v         v                                          │
│               ┌────────────────────────┐    ┌──────────────────────┐       │
│               │   DailyTraining        │    │    Periodization     │       │
│               │   Assignment (365)     │    │       (52 uker)      │       │
│               └────────────────────────┘    └──────────────────────┘       │
│                                                                             │
│   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│                           EKSTERN DATA                                      │
│   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│                                                                             │
│   ┌────────────────────┐          ┌────────────────────────┐               │
│   │  DataGolfPlayer    │          │  DataGolfTourAverage   │               │
│   │  (451 pro-spillere)│          │  (PGA, LPGA, DP)       │               │
│   └────────────────────┘          └────────────────────────┘               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Dataflyt: Fra Input til Plan

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PLAN-GENERERING DATAFLYT                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  INPUT DATA                  PROSESSERING              OUTPUT               │
│  ─────────                   ────────────              ──────               │
│                                                                             │
│  ┌─────────────┐                                                            │
│  │ Spiller-    │──┐                                                         │
│  │ profil      │  │                                                         │
│  └─────────────┘  │                                                         │
│                   │     ┌─────────────────────┐                             │
│  ┌─────────────┐  ├────►│ 1. KATEGORISERING   │                             │
│  │ Test-       │  │     │    (A-K basert på   │                             │
│  │ resultater  │──┤     │     snitt-score)    │                             │
│  └─────────────┘  │     └──────────┬──────────┘                             │
│                   │                │                                        │
│  ┌─────────────┐  │                v                                        │
│  │ Historiske  │──┤     ┌─────────────────────┐     ┌──────────────────┐   │
│  │ økter       │  │     │ 2. VELG MAL         │────►│ AnnualPlan       │   │
│  └─────────────┘  │     │    (Periodisering   │     │ (1 per spiller)  │   │
│                   │     │     for kategori)   │     └──────────────────┘   │
│  ┌─────────────┐  │     └──────────┬──────────┘              │              │
│  │ Breaking    │──┤                │                         │              │
│  │ points      │  │                v                         v              │
│  └─────────────┘  │     ┌─────────────────────┐     ┌──────────────────┐   │
│                   │     │ 3. GENERER UKER     │────►│ Periodization    │   │
│  ┌─────────────┐  │     │    (52 uker med     │     │ (52 records)     │   │
│  │ Turneringer │──┤     │     periode/volum)  │     └──────────────────┘   │
│  │ (planlagte) │  │     └──────────┬──────────┘              │              │
│  └─────────────┘  │                │                         │              │
│                   │                v                         v              │
│  ┌─────────────┐  │     ┌─────────────────────┐     ┌──────────────────┐   │
│  │ Club Speed  │──┘     │ 4. TILDEL ØKTER     │────►│ DailyAssignment  │   │
│  │ Calibration │        │    (365 dager med   │     │ (365 records)    │   │
│  └─────────────┘        │     sesjon-valg)    │     └──────────────────┘   │
│                         └─────────────────────┘                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Feedback-loop (Nåværende vs Ønsket)

```
NÅVÆRENDE TILSTAND (Ingen feedback-loop):

  Plan genereres → Spiller trener → Data lagres → [STOPP]
                                                    ↓
                                            Data brukes IKKE
                                            til å forbedre
                                            fremtidige planer


ØNSKET TILSTAND (Kontinuerlig læring):

  ┌─────────────────────────────────────────────────────────────┐
  │                                                             │
  │  Plan genereres ──► Spiller trener ──► Data lagres         │
  │       ▲                                      │              │
  │       │                                      │              │
  │       │         ┌────────────────────────────┘              │
  │       │         │                                           │
  │       │         v                                           │
  │       │   Aggreger resultater                               │
  │       │         │                                           │
  │       │         v                                           │
  │       │   Analyser mønstre                                  │
  │       │   • Hva fungerte?                                   │
  │       │   • Hva førte til forbedring?                       │
  │       │   • Hvilke økter fullføres?                         │
  │       │         │                                           │
  │       │         v                                           │
  │       └── Oppdater algoritme/modell                         │
  │                                                             │
  └─────────────────────────────────────────────────────────────┘
```

---

## DEL 4: NØKKELSPØRSMÅL FOR DISKUSJON

### 4.1 Dataarkitektur

**Spørsmål 1: Versjonering og Historikk**
> Hvordan bør vi versjonere årsplaner for å kunne analysere hva som fungerte?

Nåværende: Én aktiv plan per spiller, historikk overskrives.
Behov: Full audit trail av alle planendringer med reasoning.

**Spørsmål 2: Aggregering og Anonymisering**
> Hvordan aggregere data på tvers av spillere uten å bryte personvern?

Parallell fra helse: Kvalitetsregistre, pseudonymisering.

**Spørsmål 3: Real-time vs Batch-prosessering**
> Når skal vi prosessere data i real-time vs i batch-jobber?

| Prosess | Type | Frekvens |
|---------|------|----------|
| Testresultat → Breaking Point | Real-time | Ved registrering |
| Statistikk-aggregering | Batch | Daglig kl 03:00 |
| Plan-justering | Batch | Ukentlig |
| ML-modell trening | Batch | Månedlig |

### 4.2 Datakvalitet og Validering

**Spørsmål 4: Datakvalitet**
> Hvordan sikre at innsamlet data er pålitelig nok for ML?

Utfordringer:
- Selvrapportert treningsdata (kan være upålitelig)
- Testresultater fra forskjellig utstyr
- Manglende data (spillere som ikke logger økter)

**Spørsmål 5: Minimumsdatagrunnlag**
> Hvor mye data trenger vi før vi kan stole på prediksjoner?

- Per spiller: Minimum X tester, Y økter før personalisering?
- Aggregert: Minimum Z spillere per kategori for statistisk signifikans?

### 4.3 AI/ML Muligheter

**Spørsmål 6: Prediktive Modeller**
> Hvilke prediksjoner er realistiske med våre data?

| Prediksjon | Input-data | Kompleksitet | Verdi |
|------------|------------|--------------|-------|
| Fullføringsgrad | Historisk + plan | Lav | Høy |
| Optimal treningsvolum | Testresultater + økter | Medium | Høy |
| Kategori-oppgradering | Alle metrics | Høy | Svært høy |
| Breaking point prioritering | Tester + resultater | Medium | Høy |

**Spørsmål 7: ML-arkitektur**
> Hvor bør ML-modellen kjøre?

Alternativer:
1. **Edge (i appen)** - Lav latency, offline, begrenset kapasitet
2. **Backend (API)** - Mer kraft, krever nett, personvern-utfordringer
3. **Ekstern ML-tjeneste** - Skalerbart, kostnad per inferens
4. **Hybrid** - Enkel inferens edge, trening backend

**Spørsmål 8: Treningsdata-pipeline**
> Hvordan bygge en robust pipeline for ML-trening?

```
┌─────────────────────────────────────────────────────────────┐
│                   ML TRAINING PIPELINE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Produksjons-DB ──► ETL ──► Feature Store ──► Training     │
│                      │              │              │        │
│                      v              v              v        │
│                 Anonymiser    Versjonér      Eksperimenter │
│                                   │              │         │
│                                   v              v         │
│                            Model Registry ◄── Validation   │
│                                   │                        │
│                                   v                        │
│                            Produksjon (A/B)                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.4 Integrasjoner

**Spørsmål 9: Fremtidige Datakilder**
> Hvilke integrasjoner gir mest verdi?

| Integrasjon | Datatype | Verdi | Kompleksitet |
|-------------|----------|-------|--------------|
| Wearables (Garmin/Apple Watch) | Søvn, HRV, aktivitet | Høy | Medium |
| Launch monitors (TrackMan) | Balldata, klubbdata | Svært høy | Høy |
| GPS-tracking (Arccos) | Shot-by-shot data | Høy | Medium |
| Fysisk trening (Strong/Hevy) | Styrke, utholdenhet | Medium | Lav |
| Kalender (Google/Apple) | Tilgjengelighet | Medium | Lav |

**Spørsmål 10: API-design for Tredjeparter**
> Bør vi tilby et API for partnere/klubber?

Parallell fra helse: FHIR-standard for interoperabilitet.

---

## DEL 5: FORESLÅTT ARKITEKTUR

### 5.1 Målarkitektur

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MÅLARKITEKTUR                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PRESENTASJONSLAG                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                         │
│  │  Web App    │  │  Mobile App │  │  Coach      │                         │
│  │  (React)    │  │  (React N.) │  │  Dashboard  │                         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                         │
│         └────────────────┴────────────────┘                                 │
│                          │                                                  │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│                          │                                                  │
│  API-LAG                 v                                                  │
│         ┌────────────────────────────────┐                                 │
│         │        API Gateway              │                                 │
│         │   (Auth, Rate Limit, Logging)   │                                 │
│         └────────────────┬───────────────┘                                 │
│                          │                                                  │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┼ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│                          │                                                  │
│  TJENESTELAG             v                                                  │
│  ┌───────────────────────────────────────────────────────────────────┐     │
│  │                                                                   │     │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │     │
│  │  │ Plan        │  │ Test        │  │ Training    │              │     │
│  │  │ Generator   │  │ Service     │  │ Service     │              │     │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │     │
│  │         │                │                │                      │     │
│  │         └────────────────┼────────────────┘                      │     │
│  │                          │                                        │     │
│  │                          v                                        │     │
│  │         ┌────────────────────────────────┐                       │     │
│  │         │       ML/AI Service            │◄─────────────────┐    │     │
│  │         │  • Sesjon-valg optimalisering  │                  │    │     │
│  │         │  • Prediksjon                  │                  │    │     │
│  │         │  • Breaking point detection    │                  │    │     │
│  │         └────────────────────────────────┘                  │    │     │
│  │                                                             │    │     │
│  └─────────────────────────────────────────────────────────────│────┘     │
│                                                                │          │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │ ─ ─ ─ ─  │
│                                                                │          │
│  DATALAG                                                       │          │
│  ┌─────────────────────────────────────────────────────────────│────────┐ │
│  │                                                             │        │ │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │        │ │
│  │  │ Operational   │  │ Analytics     │  │ Feature       │◄──┘        │ │
│  │  │ Database      │  │ Database      │  │ Store         │            │ │
│  │  │ (PostgreSQL)  │  │ (ClickHouse?) │  │ (Redis/ML)    │            │ │
│  │  └───────────────┘  └───────────────┘  └───────────────┘            │ │
│  │         │                  ▲                  ▲                      │ │
│  │         │                  │                  │                      │ │
│  │         └──────────► ETL Pipeline ───────────┘                      │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                                                                             │
│  EKSTERNE INTEGRASJONER                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │  DataGolf   │  │  Wearables  │  │  Launch     │  │  Calendar   │       │
│  │  API        │  │  API        │  │  Monitor    │  │  API        │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Data Pipeline for ML

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA PIPELINE FOR ML                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  DATAINNSAMLING          PROSESSERING           MODELLERING                │
│                                                                             │
│  ┌─────────────┐        ┌─────────────┐        ┌─────────────┐            │
│  │ Produksjons-│───────►│ CDC/        │───────►│ Feature     │            │
│  │ Database    │        │ Streaming   │        │ Engineering │            │
│  └─────────────┘        │ (Debezium?) │        └──────┬──────┘            │
│                         └─────────────┘               │                    │
│  ┌─────────────┐                                      │                    │
│  │ DataGolf    │───────────────────────────────►──────┤                    │
│  │ API         │                                      │                    │
│  └─────────────┘                                      │                    │
│                                                       v                    │
│  ┌─────────────┐        ┌─────────────┐        ┌─────────────┐            │
│  │ Wearables   │───────►│ Normali-    │───────►│ Feature     │            │
│  │ (fremtid)   │        │ sering      │        │ Store       │            │
│  └─────────────┘        └─────────────┘        └──────┬──────┘            │
│                                                       │                    │
│                                                       v                    │
│                         ┌─────────────────────────────────────┐           │
│                         │           ML TRAINING               │           │
│                         │                                     │           │
│                         │  ┌───────────┐   ┌───────────┐     │           │
│                         │  │ Training  │   │ Validation│     │           │
│                         │  │ Set       │   │ Set       │     │           │
│                         │  └─────┬─────┘   └─────┬─────┘     │           │
│                         │        │               │           │           │
│                         │        v               v           │           │
│                         │  ┌─────────────────────────┐       │           │
│                         │  │     Model Training      │       │           │
│                         │  │  (scikit-learn / PyTorch)│       │           │
│                         │  └───────────┬─────────────┘       │           │
│                         │              │                     │           │
│                         │              v                     │           │
│                         │  ┌─────────────────────────┐       │           │
│                         │  │   Model Evaluation      │       │           │
│                         │  │   (A/B testing)         │       │           │
│                         │  └───────────┬─────────────┘       │           │
│                         │              │                     │           │
│                         └──────────────┼─────────────────────┘           │
│                                        │                                  │
│                                        v                                  │
│                         ┌─────────────────────────────┐                  │
│                         │      Model Registry         │                  │
│                         │   (MLflow / Weights&Biases) │                  │
│                         └──────────────┬──────────────┘                  │
│                                        │                                  │
│                                        v                                  │
│                         ┌─────────────────────────────┐                  │
│                         │    Inference Service        │                  │
│                         │   (Plan Generator)          │                  │
│                         └─────────────────────────────┘                  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## DEL 6: KONKRETE NESTE STEG

### 6.1 Kortsiktig (1-3 måneder)

| # | Oppgave | Prioritet | Kompleksitet |
|---|---------|-----------|--------------|
| 1 | Implementer plan-versjonering | Høy | Lav |
| 2 | Legg til outcome tracking tabell | Høy | Lav |
| 3 | Bygg aggregerings-pipeline | Høy | Medium |
| 4 | Definer nøkkelmetrikker for ML | Høy | Lav |
| 5 | Evaluer feature store løsninger | Medium | Lav |

### 6.2 Mellomlang (3-6 måneder)

| # | Oppgave | Prioritet | Kompleksitet |
|---|---------|-----------|--------------|
| 6 | Første prediktive modell (fullføringsgrad) | Høy | Medium |
| 7 | A/B testing framework | Høy | Medium |
| 8 | Wearable-integrasjon (pilot) | Medium | Medium |
| 9 | Coach-dashboard med insights | Medium | Medium |

### 6.3 Langsiktig (6-12 måneder)

| # | Oppgave | Prioritet | Kompleksitet |
|---|---------|-----------|--------------|
| 10 | Full ML-basert plangenerering | Høy | Høy |
| 11 | Real-time plan-justering | Medium | Høy |
| 12 | Multi-tenant ML modeller | Medium | Høy |
| 13 | API for partnere/klubber | Lav | Medium |

---

## DEL 7: PARALLELLER TIL HELSESEKTOREN

### 7.1 Konseptuell Mapping

| IUP Golf | Helsesektoren | Likhet |
|----------|---------------|--------|
| Spiller | Pasient | Individet som behandles |
| Coach | Behandler/Lege | Den som foreskriver behandling |
| Årsplan | Behandlingsplan | Strukturert intervensjon |
| Testresultater | Kliniske målinger | Objektive data |
| Breaking Points | Diagnoser | Identifiserte problemer |
| Treningsøkt | Behandlingsøkt | Gjennomført intervensjon |
| DataGolf | Nasjonale kvalitetsregistre | Ekstern benchmark-data |
| Kategori (A-K) | Alvorlighetsgrad/Triage | Kategorisering for prioritering |

### 7.2 Relevante Erfaringer fra OUS

**Spørsmål til diskusjon:**
1. Hvordan håndterer dere consent/samtykke for databruk?
2. Hvilke anonymiseringsteknikker brukes for aggregering?
3. Hvordan sikrer dere datakvalitet fra selvrapportering?
4. Hvilke ML-arkitekturer fungerer best i regulated environments?
5. Hvordan balanserer dere edge vs cloud for sensitive data?

---

## VEDLEGG

### A. Teknisk Stack

| Komponent | Teknologi | Versjon |
|-----------|-----------|---------|
| Backend | Node.js, Fastify | 20.x |
| Database | PostgreSQL | 15 |
| ORM | Prisma | 5.x |
| Frontend | React | 18.x |
| Auth | JWT | - |
| Hosting | Railway | - |
| Ekstern API | DataGolf Pro | - |

### B. Nøkkelfiler i Kodebasen

```
apps/api/
├── prisma/schema.prisma           # Datamodell (1200+ linjer)
├── src/domain/training-plan/
│   ├── plan-generation.service.ts # Hovedalgoritme (611 linjer)
│   ├── periodization-templates.ts # Maler per kategori
│   └── session-selection.service.ts # Økt-valg scoring
├── src/api/v1/datagolf/
│   ├── service.ts                 # DataGolf business logic
│   └── routes.ts                  # API endpoints
└── src/integrations/datagolf/
    └── client.ts                  # HTTP client

docs/
├── KOMPLETT_SYSTEMDOKUMENTASJON.md
└── STRATEGI_AARSPLAN_OG_DATA.md
```

### C. Kontaktinformasjon

**Produkteier:** Anders Kristiansen
**E-post:** [din e-post]
**GitHub:** [repo-link]

---

**Dokumentversjon:** 1.0
**Opprettet:** 27. desember 2025
**Formål:** Workshop-forberedelse for arkitektur-diskusjon
