# IUP Golf Platform - Komplett Systemdokumentasjon

> **Versjon:** 1.0
> **Dato:** 27. desember 2025
> **Formål:** Samlet referansedokument for testing, DataGolf API og Årsplan-generering

---

## INNHOLDSFORTEGNELSE

1. [Testing og Kvalitetssikring](#1-testing-og-kvalitetssikring)
2. [DataGolf API Integrasjon](#2-datagolf-api-integrasjon)
3. [Årsplan Generator](#3-årsplan-generator)
4. [Filreferanser](#4-filreferanser)

---

# 1. TESTING OG KVALITETSSIKRING

## 1.1 Test Oversikt

| Metrikk | Verdi |
|---------|-------|
| **Total dekning** | 45%+ |
| **Antall testcases** | 240+ |
| **Sikkerhetstester** | 149 |
| **E2E scenarier** | 40+ |

## 1.2 Test Pyramide

```
         ┌─────────┐
         │   E2E   │  Få, trege, høy tillit
         ├─────────┤
         │ Integr. │  Noen, middels hastighet
         ├─────────┤
         │  Unit   │  Mange, raske, lav tillit
         └─────────┘
```

## 1.3 Test Struktur

```
apps/api/tests/
├── setup.ts              # Global test setup
├── helpers/
│   ├── testUtils.ts      # Test utilities
│   └── testFixtures.ts   # Data factories
├── unit/                 # Unit tester
│   ├── gamification/     # Badge-evaluering
│   ├── datagolf/         # DataGolf service tester
│   ├── notifications/    # E-post tester
│   └── tests/            # Test-kalkulator
├── integration/          # Integrasjonstester
│   ├── auth.test.ts      # Autentisering
│   ├── players.test.ts   # Spillere
│   ├── dashboard.test.ts # Dashboard
│   ├── tests.test.ts     # Golf-tester
│   ├── coaches.test.ts   # Trenere
│   ├── sessions.test.ts  # Økter
│   ├── exercises.test.ts # Øvelser
│   ├── videos.test.ts    # Video
│   └── training-plan.test.ts
├── security/             # Sikkerhetstester (149 stk)
│   ├── rbac.test.ts      # Role-based access control
│   ├── sql-injection.test.ts
│   └── xss.test.ts
└── load/                 # Ytelsestester
    └── k6-load-test.js   # K6 load testing
```

## 1.4 Kjøre Tester

```bash
# Alle tester
pnpm test

# Watch mode
pnpm test -- --watch

# Coverage rapport
pnpm test -- --coverage

# Spesifikk fil
pnpm test -- auth.test.ts

# Spesifikt mønster
pnpm test -- --testNamePattern="login"
```

## 1.5 Kvalitetskontroll - Testkrav Status

### Golf-tester (1-11): ✅ Matcher

| Test | Beskrivelse | Status |
|------|-------------|--------|
| 1-4 | Golf Avstand (Driver, 3-Tre, 5-Jern, Wedge) | ✅ OK |
| 5-7 | Golf Hastighet (Clubhead, Ball Speed, Smash Factor) | ✅ OK |
| 8-11 | Approach PEI (alle distanser) | ✅ OK |

### Fysiske Tester (12-14): ⚠️ Avvik

| Test # | I Dokumentasjon | I Kildekode |
|--------|-----------------|-------------|
| 12 | Benkpress (1RM kg) | Pull-ups (reps) |
| 13 | Markløft Trapbar (1RM kg) | Plank (seconds) |
| 14 | Rotasjonskast 4kg (meter) | Vertical Jump (cm) |

**Anbefaling:** Avklar hvilke fysiske tester som er korrekte!

### Manglende Tester: ❌

- CMJ (Counter Movement Jump) - Finnes i CONFIG, ikke i kode
- 3000m Løping - Finnes i CONFIG, ikke i kode

---

# 2. DATAGOLF API INTEGRASJON

## 2.1 Abonnement og Status

| Parameter | Verdi |
|-----------|-------|
| **Tier** | Pro ($20/måned) |
| **Status** | ✅ Produksjonsklar |
| **API Key** | `73c5ee864270d96fb23f0eac2265` |
| **Base URL** | `https://feeds.datagolf.com` |
| **Rate Limit** | 100 requests/time |
| **Daglig Sync** | 03:00 UTC |

## 2.2 Tilgjengelige API Endpoints

### Aktivt I Bruk ✅

| Endpoint | Beskrivelse | Data |
|----------|-------------|------|
| `/preds/skill-ratings` | Strokes Gained data | 451 spillere |
| `/get-player-list` | Spillerliste | 3,394 spillere |
| `/preds/get-dg-rankings` | DG Rankings | 500 spillere |

### Tilgjengelig, Ikke Implementert ⚪

| Endpoint | Beskrivelse | Potensielt Bruk |
|----------|-------------|-----------------|
| `/preds/player-decompositions` | Tournament predictions | Course fit analysis |
| `/preds/approach-skill` | Proximity per distanse | IUP Test validering |
| `/historical-raw-data/rounds` | Round-by-round data | Form tracking |
| `/live-model/live-tournament-stats` | Real-time stats | Live dashboard |
| `/field-updates` | Tournament fields | "Peers Playing" feature |

## 2.3 Database Struktur

### DataGolfPlayer Table (451 records)

```typescript
{
  id: string;              // UUID
  dataGolfId: number;      // DataGolf player ID
  playerName: string;      // "Lastname, Firstname"
  sgTotal: number;         // Strokes Gained Total
  sgOffTee: number;        // SG: Off The Tee
  sgApproach: number;      // SG: Approach
  sgAroundGreen: number;   // SG: Around The Green
  sgPutting: number;       // SG: Putting
  drivingDistance: number; // Yards relative to baseline
  drivingAccuracy: number; // Percentage
  tour: string;            // PGA/LPGA/DP
  season: string;          // 2025
  lastSynced: Date;
}
```

### DataGolfTourAverage Table (3 records)

```json
{
  "tour": "PGA",
  "season": "2025",
  "avgSgTotal": -0.485,
  "avgSgOffTee": -0.160,
  "avgSgApproach": -0.217,
  "avgSgAroundGreen": -0.059,
  "avgSgPutting": -0.049
}
```

## 2.4 Top 10 Spillere

| Rank | Spiller | SG Total |
|------|---------|----------|
| 1 | Scheffler, Scottie | 3.118 |
| 2 | Rahm, Jon | 1.996 |
| 3 | Fleetwood, Tommy | 1.892 |
| 4 | McIlroy, Rory | 1.867 |
| 5 | Schauffele, Xander | 1.807 |
| 6 | DeChambeau, Bryson | 1.769 |
| 7 | Henley, Russell | 1.679 |
| 8 | Spaun, J.J. | 1.640 |
| 9 | Griffin, Ben | 1.565 |
| 10 | Young, Cameron | 1.443 |

**Norske spillere:**
- Hovland, Viktor: 1.212 SG Total (Top 20)
- Åberg, Ludvig: 1.429 SG Total (Top 15)

## 2.5 Live Features i Produksjon

1. **Pro Gap Analysis** - Gap til tour average
2. **SG Profil Tab** - 5 SG komponenter sammenligning
3. **Tour Benchmark Tab** - Bubble chart: Distance vs Accuracy

## 2.6 Legal Compliance

### Tillatt ✅
- Aggregerte sammenligninger
- Percentile rankings
- Category-level insights
- Trend analysis
- Training recommendations

### Ikke Tillatt ❌
- Raw data redistribution
- Individuelle spillerprofiler
- API reselling
- Data scraping
- Bulk export

## 2.7 Quick Start

```bash
# 1. Konfigurer API-nøkkel i .env
DATAGOLF_API_KEY=din_api_key
DATAGOLF_BASE_URL=https://feeds.datagolf.com
DATAGOLF_SYNC_ENABLED=true
DATAGOLF_SYNC_SCHEDULE=0 3 * * *

# 2. Test tilkobling
npx tsx scripts/test-datagolf.ts

# 3. Kjør første sync
npx tsx scripts/sync-datagolf.ts --tours

# 4. Verifiser i database
npx prisma studio
```

## 2.8 Nedlastet Data

| Fil | Innhold | Størrelse |
|-----|---------|-----------|
| `docs/Men_Ranking_FilteredBy_Year_2025.csv` | Herreranking 500+ spillere | 235 KB |
| `docs/Women_Ranking_FilteredBy_Year_2025.csv` | Dameranking | 156 KB |

---

# 3. ÅRSPLAN GENERATOR

## 3.1 Oversikt

Årsplan-generatoren skaper komplette 12-måneders (52 uker / 365 dager) treningsplaner basert på spillerens nivå og data.

### Hva genereres:
- 1 AnnualTrainingPlan record
- 52 Periodization records (én per uke)
- 365 DailyTrainingAssignment records
- Variable ScheduledTournament records

## 3.2 Kategori-System (A-K)

Spillere kategoriseres basert på gjennomsnittsscore:

| Kategori | Score | Beskrivelse | Timer/uke |
|----------|-------|-------------|-----------|
| **A** | World Elite | < 70 | 20-25t |
| **B** | Tour Pro | 70-72 | 18-22t |
| **C** | Elite Amateur | 72-74 | 15-20t |
| **D** | Advanced | 74-76 | 12-18t |
| **E** | Competitive | 76-78 | 10-15t |
| **F** | Intermediate | 78-80 | 8-12t |
| **G** | Developing | 80-82 | 6-10t |
| **H** | Beginner Adult | 82-85 | 5-8t |
| **I** | Rec Junior | 85-88 | 4-6t |
| **J** | Dev Junior | 88-92 | 4-8t |
| **K** | Nybegynner | > 92 | 2-4t |

## 3.3 Periodisering (52 uker)

### Fire Hovedperioder

| Periode | Navn | Varighet | Fokus |
|---------|------|----------|-------|
| **E** | Evaluering | 4 uker (43-46) | Testing, refleksjon, planlegging |
| **G** | Grunnperiode | 14-28 uker (47-12/14) | Bygge fundament |
| **S** | Spesialisering | 12-24 uker (13-25) | Golf-spesifikk utvikling |
| **T** | Turneringsperiode | 4-18 uker (26-42) | Prestasjon under press |

### Periodisering per Kategori

| Kategori | E (Eval) | G (Grunn) | S (Spec) | T (Turn) |
|----------|----------|-----------|----------|----------|
| **A** | 4 uker | 14 uker | 16 uker | 18 uker |
| **B** | 4 uker | 14 uker | 16 uker | 18 uker |
| **C** | 4 uker | 16 uker | 16 uker | 16 uker |
| **D** | 4 uker | 18 uker | 14 uker | 16 uker |
| **E** | 4 uker | 18 uker | 14 uker | 16 uker |
| **F** | 4 uker | 20 uker | 14 uker | 14 uker |
| **G** | 4 uker | 22 uker | 14 uker | 12 uker |
| **H** | 4 uker | 24 uker | 12 uker | 12 uker |
| **I** | 4 uker | 26 uker | 12 uker | 10 uker |
| **J** | 4 uker | 24 uker | 14 uker | 10 uker |
| **K** | 4 uker | 28 uker | 12 uker | 8 uker |

## 3.4 Treningsfordeling per Periode

### Periode E: Evaluering
| Type | Andel |
|------|-------|
| Testing | 40% |
| Refleksjon | 30% |
| Restitusjon | 20% |
| Planlegging | 10% |

### Periode G: Grunnperiode

**Elite (A-C):**
| Type | Andel | Timer/uke |
|------|-------|-----------|
| Teknikk | 35% | 7t |
| Fysisk | 25% | 5t |
| Shortgame | 25% | 5t |
| Mental | 15% | 3t |

**Competitive (D-F):**
| Type | Andel | Timer/uke |
|------|-------|-----------|
| Teknikk | 40% | 5t |
| Fysisk | 30% | 3.5t |
| Shortgame | 20% | 2.5t |
| Mental | 10% | 1t |

**Developing (G-K):**
| Type | Andel | Timer/uke |
|------|-------|-----------|
| Teknikk | 45% | 3t |
| Lek/Multi-sport | 25% | 1.5t |
| Shortgame | 20% | 1t |
| Fysisk | 10% | 0.5t |

### Periode S: Spesialisering

**Elite (A-C):**
| Type | Andel | Timer/uke |
|------|-------|-----------|
| Shortgame/Putting | 35% | 7t |
| Teknikk | 25% | 5t |
| Spill/Strategi | 25% | 5t |
| Fysisk | 15% | 3t |

### Periode T: Turneringsperiode

**Elite (A-C):**
| Type | Andel | Timer/uke |
|------|-------|-----------|
| Spill/Turneringer | 50% | 10t |
| Shortgame | 25% | 5t |
| Teknikk (vedlikehold) | 15% | 3t |
| Mental/Strategi | 10% | 2t |

## 3.5 L-fase og CS-nivå System

### Læringsfaser (L1-L5)

| Fase | Navn | Beskrivelse |
|------|------|-------------|
| L1 | Introduction | Bevissthet og intro |
| L2 | Fundamental | Grunnleggende utvikling |
| L3 | Variation | Variasjonstrening |
| L4 | Timing | Timing og konkurranse |
| L5 | Automatization | Automatisering |

### Club Speed Nivåer (CS20-CS120)

| CS-nivå | Driver Speed | Spillertype |
|---------|--------------|-------------|
| CS20-40 | < 80 km/h | Very beginner |
| CS40-60 | 80-120 km/h | Beginner/developing |
| CS60-80 | 120-145 km/h | Intermediate |
| CS80-100 | 145-170 km/h | Advanced |
| CS100+ | > 170 km/h | Elite |

### Settings (S1-S10)

| Setting | Miljø |
|---------|-------|
| S1-S3 | Kontrollert/range |
| S4-S5 | Simulert praksis |
| S6-S7 | Treningsrunder |
| S8-S10 | Turneringer |

## 3.6 Turneringsintegrasjon

### Turneringstyper

| Type | Kode | Formål |
|------|------|--------|
| TRENING | TRE | Teste under press |
| UTVIKLING | UTV | Rangering, erfaring |
| RESULTAT | RES | Prestasjon |

### Forberedelsesperioder

| Viktighet | Topping (uker) | Tapering (dager) |
|-----------|----------------|------------------|
| A-klasse | 3 uker | 7 dager |
| B-klasse | 2 uker | 5 dager |
| C-klasse | 1 uke | 3 dager |

### Turneringsfordeling per Kategori (årlig)

| Kategori | TRE | UTV | RES | Totalt |
|----------|-----|-----|-----|--------|
| A | 5 | 8 | 12 | 25 |
| B | 6 | 8 | 10 | 24 |
| C | 8 | 8 | 6 | 22 |
| D | 10 | 6 | 4 | 20 |
| E | 10 | 5 | 3 | 18 |
| F | 8 | 4 | 2 | 14 |
| G | 6 | 3 | 1 | 10 |
| H-K | 4-8 | 2-4 | 0-2 | 6-12 |

## 3.7 Breaking Point Integrasjon

### Identifisering
```
Breaking Point = Test hvor resultat < Kategori-krav

Eksempel Spiller D:
✅ Driver: 245m (krav: 240m)
❌ Wedge PEI: 0.085 (krav: 0.07) → BREAKING POINT
✅ Putting 3m: 78% (krav: 75%)
❌ Bunker: 55% (krav: 60%) → BREAKING POINT
```

### Justering
- Maks **30%** av treningstid på breaking points
- Unngå over-fokus på svakheter

## 3.8 Benchmark Testing

Testing hver 3. uke (13 testsesjoner/år):

| Uke | Periode | Tester |
|-----|---------|--------|
| 3 | G | 1, 5, 8, 12, 13 (Distanse + Fysisk) |
| 6 | G | 2, 3, 4, 14 (Jern + Power) |
| 9 | G | 8, 9, 10, 11 (Approach) |
| 12 | G | 15, 16, 17, 18 (Shortgame) |
| 15 | S | 1, 5, 7, 12 (Distanse + Smash) |
| 18 | S | 8, 9, 10, 11 (Approach) |
| 21 | S | 15, 16, 17, 18 (Shortgame) |
| 24 | S | 19, 20 (On-course + Strategi) |
| 27 | T | 1, 8, 15 (Key metrics) |
| 30 | T | Turnerings-evaluering |
| 33 | T | 1, 8, 15 (Key metrics) |
| 36 | T | Turnerings-evaluering |
| 39 | T | Alle relevante tester |

## 3.9 Generering Algoritme

### Input Data

```typescript
interface GenerateAnnualPlanInput {
  playerId: string;
  tenantId: string;
  startDate: Date;
  planName?: string;
  baselineAverageScore: number;    // Hoveddriver
  baselineHandicap?: number;
  baselineDriverSpeed?: number;    // Maps til CS-nivå
  weeklyHoursTarget?: number;
  tournaments?: TournamentInput[];
  preferredTrainingDays?: number[];
  excludeDates?: Date[];
}
```

### Prosessflyt

```
Spiller → Kategori (A-K) → Periodisering (E/G/S/T) → Ukeplan
                ↓
        Breaking Points → Justert fokus
                ↓
        L-fase + CS-nivå + S-setting = Økt-innhold
                ↓
        Benchmark hver 3. uke → Evaluering → Justering
```

### Sesjon-valg Scoring (100 poeng max)

| Faktor | Poeng |
|--------|-------|
| Eksakt periode-match | +100 |
| Learning phase match | +50 |
| Duration match | +50 |
| Club speed match | +30 |
| Setting match | +30 |
| Breaking point relevans | +20 |
| Intensity match | +40 |
| Frequency penalty | -2 per nylig bruk |

### Hviledag Logikk

| Intensitet | Hviledager/uke |
|------------|----------------|
| Peak/High | 1 (søndag) |
| Medium | 2 (søndag + onsdag) |
| Low/Taper | 3 (søndag + onsdag + fredag) |

## 3.10 Forventet Årlig Forbedring

| Alder | Gjennomsnitt | Normal variasjon |
|-------|--------------|------------------|
| 13-15 år | 3-5 slag/år | 2-6 slag |
| 15-17 år | 2-3 slag/år | 1-4 slag |
| 17-19 år | 1-2 slag/år | 0.5-3 slag |
| 19+ år | 0.5-1 slag/år | 0-2 slag |

## 3.11 Opprykk Kriterier

Alle må oppfylles for kategori-overgang:

1. **Score-krav**: 3 måneder konsekvent i mål-kategoriens område
2. **Fysisk**: Minst 2 av 3 fysiske tester bestått
3. **Benchmark**: Minst 4 av 7 golf-tester bestått
4. **Mental**: Trener-godkjenning av modenhet

## 3.12 API Endpoints

| Metode | Endpoint | Beskrivelse |
|--------|----------|-------------|
| POST | `/generate` | Generer ny 12-måneders plan |
| GET | `/player/:playerId` | Hent spillers aktive plan |
| GET | `/:planId/calendar` | Se assignments per dato |
| GET | `/:planId/full` | Hent komplett 365-dagers plan |
| PUT | `/:planId/daily/:date` | Oppdater daglig assignment |
| GET | `/:planId/analytics` | Progress tracking |
| POST | `/:planId/modification-request` | Spiller ber om endring |
| PUT | `/:planId/accept` | Spiller godtar plan |
| PUT | `/:planId/reject` | Avvis og be om ny generering |

---

# 4. FILREFERANSER

## 4.1 Testing Dokumentasjon

| Fil | Beskrivelse |
|-----|-------------|
| `docs/guides/testing.md` | Komplett testguide |
| `docs/QC-RAPPORT-Testkrav.md` | QC-rapport CONFIG vs kode |
| `docs/release-smoke-test.md` | Post-deployment sjekkliste |
| `apps/api/SETUP_AND_TEST_GUIDE.md` | Database og test-oppsett |

## 4.2 DataGolf Dokumentasjon

| Fil | Størrelse | Beskrivelse |
|-----|-----------|-------------|
| `docs/features/datagolf/DATAGOLF_QUICKSTART.md` | 32 KB | 7-stegs hurtigstart |
| `docs/features/datagolf/DATAGOLF_DATA_INVENTORY.md` | 17 KB | Datainventar |
| `docs/features/datagolf/DATAGOLF_STATS_FORSLAG.md` | 44 KB | Integrasjonsforslag |
| `docs/features/datagolf/DATAGOLF_OPPORTUNITY_ANALYSIS.md` | 25 KB | Mulighetsanalyse |
| `docs/archive/DATAGOLF_DATABASE_OVERSIKT.md` | - | Database-skjema |

## 4.3 Årsplan Dokumentasjon

| Fil | Beskrivelse |
|-----|-------------|
| `docs/archive/norwegian-legacy/AARSPLAN_MAL_NIVAPRINSIPPET.md` | Master-mal (385 linjer) |
| `docs/reference/golf-categories.md` | 11-kategori system |
| `apps/api/docs/API_TRAINING_PLAN.md` | API-referanse (836 linjer) |

## 4.4 Kildekode - DataGolf

| Fil | Linjer | Beskrivelse |
|-----|--------|-------------|
| `apps/api/src/api/v1/datagolf/service.ts` | 483 | Business logic |
| `apps/api/src/api/v1/datagolf/routes.ts` | 236 | 5 endpoints |
| `apps/api/src/api/v1/datagolf/mappings.ts` | 7 KB | IUP→DG mappings |
| `apps/api/src/integrations/datagolf/client.ts` | 152 | HTTP client |
| `apps/api/src/jobs/datagolf-sync.job.ts` | - | Daglig sync cron |

## 4.5 Kildekode - Årsplan Generator

| Fil | Linjer | Beskrivelse |
|-----|--------|-------------|
| `apps/api/src/domain/training-plan/plan-generation.service.ts` | 611 | Hovedalgoritme |
| `apps/api/src/domain/training-plan/periodization-templates.ts` | 283 | 5 nivå-maler |
| `apps/api/src/domain/training-plan/session-selection.service.ts` | 300 | Sesjon-valg |
| `apps/api/src/domain/training-plan/plan-generation.types.ts` | 167 | TypeScript types |
| `apps/api/src/api/v1/training-plan/index.ts` | 1902 | API endpoints |

## 4.6 Frontend Komponenter

| Fil | Beskrivelse |
|-----|-------------|
| `apps/web/src/features/annual-plan/Aarsplan.jsx` | Årsplan visning |
| `apps/web/src/features/annual-plan/AarsplanContainer.jsx` | Container |
| `apps/web/src/features/coach-stats/CoachDataGolf.tsx` | DataGolf sammenligning |

---

## SAMMENDRAG

### Nøkkelprinsipper

1. **Kategori-tilpasset**: Alle planer starter fra spillerens kategori (A-K)
2. **Periodisert**: 4 klare perioder med ulikt fokus (E/G/S/T)
3. **Progressiv**: L1→L5, CS40→CS100, S1→S10
4. **Evidensbasert**: 20 tester måler fremgang
5. **Fleksibel**: Hybrid-kategorier og breaking point-justering
6. **Alderstilpasset**: Junior-spesifikke tilpasninger

### Business Impact

- **DataGolf ROI**: 4000% (€12k årlig / €300 kostnad)
- **Forventet engagement**: +30-40%
- **Coach retention**: +30% renewal rate
- **Competitive moat**: 12-18 måneder lead

---

**Dokumentversjon:** 1.0
**Sist oppdatert:** 27. desember 2025
**Generert av:** Claude Code
