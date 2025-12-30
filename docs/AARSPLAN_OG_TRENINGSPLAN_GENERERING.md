# Årsplan og Treningsplan Generering

> Komplett teknisk dokumentasjon for plan-genereringssystemet

## Oversikt

Systemet genererer komplette 12-måneders treningsplaner med:
- **52 uker** med periodisering
- **365 daglige treningsoppdrag**
- **Turneringsintegrasjon** med topping og tapering
- **Intelligent øktvalg** basert på spillernivå

---

## 1. Hovedtjenester

### Filstruktur

```
apps/api/src/domain/training-plan/
├── plan-generation.service.ts      # Hovedalgoritme (620 linjer)
├── plan-generation.types.ts        # TypeScript-typer
├── periodization-templates.ts      # 5 spillerkategori-maler
├── session-selection.service.ts    # Intelligent øktvalg
├── plan-progress.service.ts        # Fremdriftssporing
├── plan-review.service.ts          # Coach-godkjenningsflyt
├── manual-adjustment.service.ts    # Manuelle justeringer
```

---

## 2. Plan-genereringsalgoritmen

### Hovedmetode: `generateAnnualPlan()`

**Lokasjon**: `apps/api/src/domain/training-plan/plan-generation.service.ts`

```typescript
static async generateAnnualPlan(input: GenerateAnnualPlanInput): Promise<AnnualPlanGenerationResult>
```

### Input-parametere

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `playerId` | UUID | Spiller-ID |
| `tenantId` | UUID | Tenant-ID |
| `startDate` | Date | Planens startdato |
| `baselineAverageScore` | number | Spillerens gjennomsnittsscore |
| `baselineHandicap` | number? | Handicap (valgfritt) |
| `baselineDriverSpeed` | number? | Driver-hastighet (valgfritt) |
| `tournaments` | TournamentInput[] | Liste over turneringer |
| `weeklyHoursTarget` | number? | Ukentlige treningstimer |
| `preferredTrainingDays` | number[]? | Foretrukne treningsdager (0-6) |
| `excludeDates` | Date[]? | Datoer å ekskludere |

### Genererings-steg (9 steg)

```
1. Hent periodiseringsmal basert på gjennomsnittsscore
2. Beregn planstruktur (52 uker)
3. Opprett AnnualTrainingPlan-post i database
4. Planlegg turneringer med topping/tapering
5. Generer periodiseringsstruktur (52 uker)
6. Hent spillerens klubbhastighetsnivå
7. Hent spillerens bruddpunkter (breaking points)
8. Generer daglige oppdrag (365 dager)
9. Bygg og returner resultat
```

---

## 3. Periodiseringsmaler (5 kategorier)

**Lokasjon**: `apps/api/src/domain/training-plan/periodization-templates.ts`

### Spillerkategorier

| Kategori | Score | Base | Spesialisering | Turnering | Recovery | Timer/uke |
|----------|-------|------|----------------|-----------|----------|-----------|
| **Elite (E1)** | <70 | 16 uker | 24 uker | 10 uker | 2 uker | 18-25 |
| **Advanced (A1)** | 70-75 | 20 uker | 20 uker | 10 uker | 2 uker | 15-20 |
| **Intermediate (I1)** | 75-80 | 24 uker | 18 uker | 8 uker | 2 uker | 12-18 |
| **Developing (D1)** | 80-85 | 28 uker | 16 uker | 6 uker | 2 uker | 10-15 |
| **Beginner (B1)** | 85+ | 32 uker | 14 uker | 4 uker | 2 uker | 8-12 |

### Mal-struktur

```typescript
interface PeriodizationTemplate {
  scoringRange: { min: number; max: number };
  basePeriodWeeks: number;
  specializationWeeks: number;
  tournamentWeeks: number;
  recoveryWeeks: number;
  weeklyHours: [min, max];
  intensity: {
    base: IntensityLevel;
    specialization: IntensityLevel;
    tournament: IntensityLevel;
  };
  focusAreas: {
    base: string[];
    specialization: string[];
    tournament: string[];
  };
  learningPhaseDistribution: {
    base: string[];      // ['L1', 'L2', 'L3']
    specialization: string[];
    tournament: string[];
  };
  settingsDistribution: {
    base: string[];      // ['S1', 'S2', 'S3', 'S4', 'S5']
    specialization: string[];
    tournament: string[];
  };
  periodDistribution: {
    base: string[];      // ['E', 'G']
    specialization: string[];
    tournament: string[];
  };
}
```

---

## 4. Periode-systemet (E/G/S/T)

### Fire hovedperioder

| Periode | Navn | Fokus | Læringsfaser | Settings | Volum |
|---------|------|-------|--------------|----------|-------|
| **E** | Etablering (Grunnlag) | Teknisk fundamenter | L1-L3 | S1-S3 | Medium→Høy |
| **G** | Generell forberedelse | Allsidig utvikling | L1-L4 | S3-S6 | Medium-Høy |
| **S** | Spesialisering | Konkurransespesifikk | L2-L4/L5 | S5-S8 | Høy |
| **T** | Turnering | Peak prestasjon | L3-L5 | S7-S10 | Peak→Taper |

### Volum-intensitet beregning

```typescript
calculateVolumeIntensity(phase, weekIndex, totalWeeks):
  Base-periode:
    - 0-30%: 'medium'
    - 30-70%: 'high'
    - 70-100%: 'medium' (nedtrapping)

  Spesialiseringsperiode:
    - Konstant 'high'

  Turneringsperiode:
    - 0-50%: 'peak'
    - 50-100%: 'taper'

  Recovery:
    - Konstant 'low'
```

---

## 5. Turneringsintegrasjon

### Topping og Tapering

| Viktighet | Topping-uker | Tapering-dager | Fokusområder |
|-----------|--------------|----------------|--------------|
| **A** (Viktigst) | 3 uker | 7 dager | Mental prep, Banestrategi, Peak prestasjon, Recovery-optimalisering |
| **B** (Viktig) | 2 uker | 5 dager | Konkurranseberedskap, Mentale ferdigheter, Taktisk forberedelse |
| **C** (Normal) | 1 uke | 3 dager | Konkurranseeksponering, Prestasjonsrutiner |

### Turneringsplanlegging

```typescript
scheduleTournaments():
  1. Beregn ukenummer for turneringen
  2. Sett topping-startuken (weekNumber - toppingWeeks)
  3. Beregn tapering-startdato (turnering - taperingDays)
  4. Generer fokusområder basert på viktighet
  5. Opprett ScheduledTournament-post
```

---

## 6. Øktvalg-algoritmen

**Lokasjon**: `apps/api/src/domain/training-plan/session-selection.service.ts`

### Utvelgelseskriterier

```typescript
interface SessionSelectionCriteria {
  period: string;              // E/G/S/T
  learningPhases: string[];    // ['L1', 'L2', 'L3']
  clubSpeed: string;           // 'CS80', 'CS90', etc.
  settings: string[];          // ['S1', 'S2', 'S3']
  breakingPointIds: string[];  // Spillerens bruddpunkter
  targetDuration: number;      // Minutter
  intensity: string;           // 'low', 'medium', 'high', 'peak', 'taper'
  excludeTemplateIds: string[]; // Nylig brukte maler (siste 7 dager)
}
```

### Scoringsalgoritme

```typescript
scoreTemplate(template, criteria):
  +100 poeng: Eksakt periode-match
  +50 poeng:  Læringsfase-match
  +50 poeng:  Varighet nær mål (maks 50 - differanse)
  +30 poeng:  Klubbhastighet-match
  +30 poeng:  Settings-match
  +40 poeng:  Intensitet-match
  +20 poeng:  Bruddpunkt-relevans
  -2 poeng:   Per tidligere bruk (for variasjon)
```

### Kompatible perioder

```typescript
getCompatiblePeriods():
  E → [E]
  G → [E, G]
  S → [G, S]
  T → [S, T]
```

### Hviledager

```typescript
shouldBeRestDay(dayOfWeek, intensity, preferredTrainingDays):
  Peak/High:  1 hviledag (søndag)
  Medium:     2 hviledager (søndag, onsdag)
  Low/Taper:  3 hviledager (søndag, onsdag, fredag)
```

---

## 7. Ukentlig øktfordeling

### Per periode-fase

| Fase | Teknisk | Fysisk | Mental | Taktisk | Recovery |
|------|---------|--------|--------|---------|----------|
| **Base** | 40% | 30% | 15% | - | 15% |
| **Spesialisering** | 35% | 25% | 20% | 20% | - |
| **Turnering** | 20% | - | 30% | 40% | 10% |
| **Recovery** | 20% | - | 20% | - | 60% |

---

## 8. Database-modeller

### AnnualTrainingPlan

```prisma
model AnnualTrainingPlan {
  id                    String   @id @default(uuid())
  playerId              String
  tenantId              String
  planName              String
  startDate             DateTime
  endDate               DateTime
  status                String   // 'draft', 'active', 'completed', 'archived'
  baselineAverageScore  Decimal
  baselineHandicap      Decimal?
  baselineDriverSpeed   Decimal?
  playerCategory        String   // 'E1', 'A1', 'I1', 'D1', 'B1'
  basePeriodWeeks       Int
  specializationWeeks   Int
  tournamentWeeks       Int
  weeklyHoursTarget     Int
  intensityProfile      Json
  generatedAt           DateTime

  // Relasjoner
  player                Player
  periodizations        Periodization[]
  dailyAssignments      DailyTrainingAssignment[]
  scheduledTournaments  ScheduledTournament[]
}
```

### Periodization (52 per plan)

```prisma
model Periodization {
  id              String   @id @default(uuid())
  playerId        String
  annualPlanId    String
  weekNumber      Int      // 1-52
  period          String   // 'E', 'G', 'S', 'T'
  periodPhase     String   // 'base', 'specialization', 'tournament', 'recovery'
  weekInPeriod    Int
  volumeIntensity String   // 'low', 'medium', 'high', 'peak', 'taper'
  plannedHours    Decimal

  // Prioriteter (0-10)
  priorityTechnique    Decimal?
  priorityPhysical     Decimal?
  priorityCompetition  Decimal?
  priorityPlay         Decimal?
  priorityGolfShot     Decimal?
}
```

### DailyTrainingAssignment (365 per plan)

```prisma
model DailyTrainingAssignment {
  id                String   @id @default(uuid())
  annualPlanId      String
  playerId          String
  assignedDate      DateTime
  weekNumber        Int
  dayOfWeek         Int      // 0-6
  sessionTemplateId String?
  sessionType       String   // 'technical', 'physical', 'mental', 'tactical', 'rest'
  estimatedDuration Int      // Minutter
  period            String
  learningPhase     String?
  clubSpeed         String
  intensity         Int      // 1-10
  isRestDay         Boolean
  status            String   // 'planned', 'completed', 'skipped', 'rescheduled'

  // Valgfrie felt
  isOptional        Boolean  @default(false)
  canBeSubstituted  Boolean  @default(true)
  actualDuration    Int?
  completedAt       DateTime?
  notes             String?
}
```

### ScheduledTournament

```prisma
model ScheduledTournament {
  id                    String   @id @default(uuid())
  annualPlanId          String
  tournamentId          String?
  name                  String
  startDate             DateTime
  endDate               DateTime
  importance            String   // 'A', 'B', 'C'
  weekNumber            Int
  period                String
  toppingStartWeek      Int
  toppingDurationWeeks  Int
  taperingStartDate     DateTime
  taperingDurationDays  Int
  focusAreas            Json
  participated          Boolean  @default(false)
  resultId              String?
}
```

---

## 9. API-endepunkter

**Lokasjon**: `apps/api/src/api/v1/training-plan/index.ts`

### Generering og henting

| Metode | Endepunkt | Beskrivelse |
|--------|-----------|-------------|
| POST | `/api/v1/training-plan/generate` | Generer ny 12-måneders plan |
| GET | `/api/v1/training-plan` | List alle planer for bruker |
| GET | `/api/v1/training-plan/player/:playerId` | Hent spillerens aktive plan |
| GET | `/api/v1/training-plan/:planId/full` | Komplett plan med alle 365 dager |
| GET | `/api/v1/training-plan/:planId/calendar` | Kalendervisning |
| GET | `/api/v1/training-plan/:planId/today` | Dagens oppdrag |
| GET | `/api/v1/training-plan/:planId/analytics` | Fremdrift og statistikk |

### Administrasjon

| Metode | Endepunkt | Beskrivelse |
|--------|-----------|-------------|
| PUT | `/api/v1/training-plan/:planId/daily/:date` | Oppdater daglig oppdrag |
| PUT | `/api/v1/training-plan/:planId/accept` | Aktiver utkast-plan |
| PUT | `/api/v1/training-plan/:planId/reject` | Arkiver plan |
| POST | `/api/v1/training-plan/:planId/tournaments` | Legg til turnering |
| POST | `/api/v1/training-plan/:planId/modification-request` | Be om endringer |
| PUT | `/api/v1/training-plan/:planId/daily/:date/quick-action` | Fullfør/hopp over/start |
| POST | `/api/v1/training-plan/:planId/daily/:date/substitute` | Finn alternativer |
| DELETE | `/api/v1/training-plan/:planId` | Slett plan |

### Generate-endepunkt payload

```json
POST /api/v1/training-plan/generate
{
  "playerId": "uuid",
  "startDate": "2025-01-01",
  "baselineAverageScore": 78,
  "baselineHandicap": 8.5,
  "baselineDriverSpeed": 155,
  "weeklyHoursTarget": 15,
  "preferredTrainingDays": [1, 2, 4, 5, 6],
  "tournaments": [
    {
      "name": "Srixon Tour Runde 1",
      "startDate": "2025-06-15",
      "endDate": "2025-06-16",
      "importance": "A"
    }
  ],
  "excludeDates": ["2025-07-20", "2025-07-21"]
}
```

### Generate-response

```json
{
  "annualPlan": {
    "id": "uuid",
    "playerId": "uuid",
    "planName": "78 avg - 12-month plan",
    "startDate": "2025-01-01",
    "endDate": "2025-12-31",
    "playerCategory": "I1",
    "basePeriodWeeks": 24,
    "specializationWeeks": 18,
    "tournamentWeeks": 8
  },
  "periodizations": {
    "created": 52,
    "weekRange": { "from": 1, "to": 52 }
  },
  "dailyAssignments": {
    "created": 365,
    "dateRange": { "from": "2025-01-01", "to": "2025-12-31" },
    "sessionsByType": {
      "technical": 120,
      "physical": 80,
      "mental": 45,
      "tactical": 40,
      "rest": 80
    }
  },
  "tournaments": {
    "scheduled": 1,
    "list": [
      {
        "name": "Srixon Tour Runde 1",
        "startDate": "2025-06-15",
        "importance": "A"
      }
    ]
  },
  "breakingPoints": {
    "linked": 3
  }
}
```

---

## 10. Frontend-komponenter

### Årsplan

| Komponent | Fil |
|-----------|-----|
| Årsplan hovedvisning | `apps/web/src/features/annual-plan/Aarsplan.jsx` |
| Container-logikk | `apps/web/src/features/annual-plan/AarsplanContainer.jsx` |
| Plan-forhåndsvisning | `apps/web/src/features/annual-plan/PlanPreview.jsx` |

### Treningsplan

| Komponent | Fil |
|-----------|-----|
| Ukens plan | `apps/web/src/features/trening-plan/UkensTreningsplanContainer.jsx` |
| Dagens plan | `apps/web/src/features/trening-plan/DagensTreningsplanContainer.jsx` |
| Teknisk plan | `apps/web/src/features/trening-plan/TekniskPlanContainer.jsx` |
| Treningslogg | `apps/web/src/features/trening-plan/LoggTreningContainer.jsx` |
| Treningsdagbok | `apps/web/src/features/trening-plan/TreningsdagbokContainer.jsx` |

### Periodisering

| Komponent | Fil |
|-----------|-----|
| Periodeplaner | `apps/web/src/features/periodeplaner/PeriodeplanerContainer.jsx` |

### Coach-verktøy

| Komponent | Fil |
|-----------|-----|
| Coach treningsplan | `apps/web/src/features/coach-training-plan/CoachTrainingPlan.tsx` |
| Plan-editor | `apps/web/src/features/coach-training-plan-editor/CoachTrainingPlanEditor.tsx` |
| Planleggingshub | `apps/web/src/features/coach-planning/CoachPlanningHub.tsx` |

---

## 11. Støttetjenester

### PlanProgressService

```typescript
// Fremdriftssporing
getProgressSummary()      // Overordnet fullføringsmetrikk
getWeeklyReport()         // Per-uke nedbrytning
getUpcomingSessions()     // Neste 7 dager
updateBreakingPointProgress()  // Auto-oppdater basert på økter
getMonthlySummary()       // Månedlig statistikk
```

### PlanReviewService (Coach-godkjenning)

```typescript
submitForReview()         // Varsle coaches
submitReview()            // Coach godkjenning/avvisning
getPendingReviews()       // Coach dashboard
applySuggestedChanges()   // Auto-oppdater plan
validatePlan()            // Pre-innsendingssjekker
```

### ManualAdjustmentService (Fleksibilitet)

```typescript
updateDailyAssignment()   // Endre enkeltdag
bulkUpdateAssignments()   // Uke/datoområde oppdateringer
swapSessions()            // Bytt to dager
insertRestDay()           // Legg til uplanlagt hvile
removeRestDay()           // Legg til trening på hviledag
adjustWeeklyVolume()      // Beregn timer på nytt
changePeriodType()        // Skift periodisering
rescheduleTournament()    // Flytt turneringsdato
previewChange()           // Konsekvensanalyse før endring
```

---

## 12. Læringsfaser (L1-L5)

| Fase | Navn | Beskrivelse |
|------|------|-------------|
| L1 | Fundamentale bevegelsesmønstre | Grunnleggende motorikk |
| L2 | Basis teknikk | Tekniske grunnprinsipper |
| L3 | Mellomnivå ferdighetsutvikling | Ferdighetsforbedring |
| L4 | Avanserte konkurranseferdigheter | Konkurranseorientert |
| L5 | Elite prestasjon | Toppnivå optimalisering |

---

## 13. Settings (S1-S10)

| Setting | Beskrivelse | Typisk bruk |
|---------|-------------|-------------|
| S1 | Indoor/isolert | Grunnlagsperiode |
| S2 | Range uten mål | Grunnlagsperiode |
| S3 | Range med mål | Grunnlag/Generell |
| S4 | Putting green | Generell forberedelse |
| S5 | Chipping area | Generell/Spesialisering |
| S6 | Short game area | Spesialisering |
| S7 | Driving range konkurranseformat | Spesialisering/Turnering |
| S8 | 9-hull simulering | Turnering |
| S9 | 18-hull simulering | Turnering |
| S10 | Full turneringsformat | Turnering |

---

## 14. Dokumentasjon

### Eksisterende dokumenter

| Dokument | Lokasjon |
|----------|----------|
| UI-kontrakt (850 linjer) | `docs/contracts/ui/plan-generation.contract.ts` |
| Strategi og data | `docs/reference/STRATEGI_AARSPLAN_OG_DATA.md` |
| Årsplan-generering | `docs/features/ANNUAL_PLAN_GENERATION.md` |

### Test-script

| Script | Formål |
|--------|--------|
| `apps/api/scripts/test-training-plan.ts` | Full test av genereringsflyt |
| `apps/api/tests/integration/training-plan.test.ts` | Integrasjonstester |
| `scripts/testing/test-training-plan-endpoints.sh` | API-endepunkt testing |

---

## 15. Seed-data

**Lokasjon**: `apps/api/prisma/seeds/training-plan.ts`

### Demo-ukeskjema

| Dag | Type | Varighet |
|-----|------|----------|
| Mandag | Teknikk | 90 min |
| Tirsdag | Fysisk | 60 min |
| Onsdag | Golfslag | 120 min |
| Torsdag | Spill | 180 min |
| Fredag | Teknikk Putting | 90 min |
| Lørdag | Konkurranse | 240 min |
| Søndag | Hviledag | - |

---

## Oppsummering

| Komponent | Detaljer |
|-----------|----------|
| **Perioder** | 4 hovedperioder (E/G/S/T) |
| **Spillerkategorier** | 5 nivåer (Elite → Beginner) |
| **Læringsfaser** | 5 nivåer (L1-L5) |
| **Settings** | 10 nivåer (S1-S10) |
| **Planvarighet** | 52 uker / 365 dager |
| **Økttyper** | Technical, Physical, Mental, Tactical, Rest |
| **Turneringsviktighet** | A (viktigst), B, C |
| **API-endepunkter** | 14+ for plan-administrasjon |
