# Total Oversikt: Data, Turneringer, Tester og Dokumentasjon

> Generert: 2025-12-30

## 1. DataGolf API & Statistikk

### API-Integrasjon

| Komponent | Lokasjon |
|-----------|----------|
| API Client | `apps/api/src/integrations/datagolf/client.ts` |
| Routes | `apps/api/src/api/v1/datagolf/` |
| PEI→SG Konvertering | `apps/api/src/api/v1/datagolf/pei-to-sg.ts` (723 linjer) |
| Sync Job | `apps/api/src/jobs/datagolf-sync.job.ts` |

### Tilgjengelige Data (451 proffspillere)

- **Strokes Gained**: Total, OTT, Approach, Around Green, Putting
- **Driving**: Distanse (yards), Accuracy (%)
- **Approach Skill**: 7 avstandsbøtter (50-75m → 200m+)
- **Scoring**: GIR%, Scrambling%, Putts/runde

### 14+ API-Endepunkter

| Endepunkt | Beskrivelse |
|-----------|-------------|
| `/api/v1/datagolf/players/:playerId` | Spillerdata |
| `/api/v1/datagolf/tour-averages` | Tour-snitt (PGA/LPGA/DP) |
| `/api/v1/datagolf/compare` | Sammenligning mot tour |
| `/api/v1/datagolf/approach-skill` | Approach etter avstand |
| `/api/v1/datagolf/approach-skill/averages` | Tour-snitt for approach skill |
| `/api/v1/datagolf/approach-skill/top` | Topp spillere per avstandsbøtte |
| `/api/v1/datagolf/approach-skill/player/:playerName` | Spiller approach data |
| `/api/v1/datagolf/coach/dashboard` | Coach dashboard med spillerstatistikk |
| `/api/v1/datagolf/pro-players` | Topp proffspillere for sammenligning |
| `/api/v1/datagolf/player-sg-summary` | Aggregert SG-sammendrag |
| `/api/v1/datagolf/pei-to-sg` | Konverter PEI til Strokes Gained |
| `/api/v1/datagolf/pei-to-sg/batch` | Batch PEI→SG konvertering |
| `/api/v1/datagolf/pei-to-sg/iup-test` | Konverter IUP testresultater til SG |
| `/api/v1/datagolf/sync` | Trigger manuell sync |
| `/api/v1/datagolf/sync-status` | Hent sync-status |

### IUP Test → DataGolf Mapping

| Test | Testnavn | DataGolf Metrikk | Korrelasjon |
|------|----------|------------------|-------------|
| 1 | Driver Avstand | driving_distance | 0.95 |
| 2 | 3-Tre Avstand | driving_distance | 0.85 |
| 3 | 5-Jern Avstand | strokes_gained_approach | 0.80 |
| 4 | PW Avstand | strokes_gained_approach | 0.75 |
| 5 | Klubbhastighet Driver | club_head_speed | 0.90 |
| 6 | Ballhastighet Driver | ball_speed | 0.92 |
| 7 | Smash Factor | smash_factor | 0.85 |
| 8 | Approach 25m | strokes_gained_approach | 0.70 |
| 9 | Approach 50m | strokes_gained_approach | 0.75 |
| 10 | Approach 75m | strokes_gained_approach | 0.80 |
| 11 | Approach 100m | strokes_gained_approach | 0.85 |
| 15 | Putting 3m | strokes_gained_putting | 0.75 |
| 16 | Putting 6m | strokes_gained_putting | 0.70 |
| 17 | Chipping | strokes_gained_around_green | 0.80 |
| 18 | Bunker | strokes_gained_around_green | 0.75 |
| 19 | 9-Hole Simulering | scoring_average | 0.90 |
| 20 | On-Course Skills | strokes_gained_total | 0.85 |

### Database-Tabeller (DataGolf)

- `datagolf_players` - Spillerdata med SG-komponenter
- `datagolf_tour_averages` - Tour-snitt per sesong
- `datagolf_approach_skills` - Approach skill per avstand
- `datagolf_schedules` - Turneringskalender
- `datagolf_historical_rounds` - Historiske rundedata
- `datagolf_player_decompositions` - Detaljert skill breakdown

---

## 2. Turneringsdata

### GolfBox-Integrasjon

**Script**: `apps/api/scripts/golfbox-import.ts`
**API**: `https://scores.golfbox.dk/Handlers`
**Språkkode**: 1044 (Norsk)
**Kunde-ID**: 18 (Norges Golfforbund)

### Srixon Tour (Junior Elite)

**Tour Category ID**: 7671

| År | Antall | Competition IDs |
|----|--------|-----------------|
| 2025 | 7 | 4817097, 4826546, 4759945, 4817104, 4759964, 4817196, 4817268 |
| 2024 | 3 | 4335288, 4335303, 4335312 |
| 2023 | 3 | 3692019, 3895054, 3895088 |
| 2022 | 1 | 3182156 |
| 2020 | 1 | 2193454 |
| 2019 | 3 | 1759399, 1875699, 2156433 |
| 2017 | 2 | 978205, 978225 |

### Garmin Norgescup (Voksen Amatør)

**Tour Category ID**: 1276

| År | Antall | Competition IDs |
|----|--------|-----------------|
| 2025 | 3 | 4759973, 4759977, 4759980 |
| 2024 | 1 | 4331158 |
| 2023 | 2 | 3692337, 3692340 |
| 2016 | 1 | 535183 |

### Nordic Golf League (Pro)

**Tour Category ID**: 0 (Ingen NGF-kategori for pro-events)

| År | Turneringer | Competition IDs |
|----|-------------|-----------------|
| 2025 | Holtsmark Open | 4800231 |
| 2024 | Gamle Fredrikstad Open, Holtsmark Open | 4247929, 4247946 |
| 2023 | Gamle Fredrikstad Open | 3722401 |
| 2022 | Holtsmark Open | 3266767 |
| 2019 | Gamle Fredrikstad Open, Borre Open | 1816457, 1816504 |
| 2018 | Gamle Fredrikstad Open | 1407677 |

### Database-Modeller (Turneringer)

#### GolfboxCompetition (`golfbox_competitions`)
```
- id (UUID)
- golfboxId (Int, unique)
- name (VarChar 255)
- tourCategory ("srixon_tour" | "garmin_norgescup")
- tourCategoryId (Int)
- competitionType ("StrokePlay" | "MatchPlay")
- venueName, venueLatitude, venueLongitude
- startDate, endDate, year
- totalPlayers
- classes (String[]) - ["G19", "J19", "G15", "J15"]
```

#### GolfboxResult (`golfbox_results`)
```
- id (UUID)
- competitionId (FK)
- golfboxPlayerId (Int)
- firstName, lastName, clubName
- nationality, countryCode, birthYear, gender
- className, classShortName
- position, totalStrokes, toPar, toParText
- roundScores (JSONB) - { "R1": 72, "R2": 71 }
- handicap, playingHandicap
```

#### Tournament (`tournaments`)
```
- id (UUID)
- eventId (FK)
- tournamentType, level, courseName
- par, courseRating, slopeRating
- format, numberOfRounds
- entryFee, prizePool, registrationUrl
- toppingWeeks, taperingDays, focusAreas
```

#### TournamentResult (`tournament_results`)
```
- id (UUID)
- tournamentId (FK), playerId (FK)
- position, totalScore, scoreToPar
- roundScores (JSONB)
- strokesGained (JSONB)
- fairwaysHit, greensInRegulation, puttsPerRound
```

#### ScheduledTournament (`scheduled_tournaments`)
```
- id (UUID)
- annualPlanId (FK)
- name, startDate, endDate
- importance ("A" | "B" | "C")
- weekNumber, period
- toppingStartWeek, toppingDurationWeeks
- taperingStartDate, taperingDurationDays
- focusAreas, participated, resultId
```

### Frontend-Komponenter (Turneringer)

**Lokasjon**: `apps/web/src/features/coach-tournaments/`

- `CoachTournamentCalendar.tsx` - Kalendervisning med filtre
- `CoachTournamentPlayers.tsx` - Spillerpåmeldinger
- `CoachTournamentResults.tsx` - Resultater og statistikk

---

## 3. Alle Tester i Appen (20 Tester)

### Distansetester (1-4)

| # | Navn | Input | Beregning | Enhet |
|---|------|-------|-----------|-------|
| 1 | Driver Avstand | 6 slag med carry-distanse | Topp 3 snitt | Meter |
| 2 | 3-Tre Avstand | 6 slag med carry-distanse | Topp 3 snitt | Meter |
| 3 | 5-Jern Avstand | 6 slag med carry-distanse | Topp 3 snitt | Meter |
| 4 | PW Avstand | 6 slag med carry-distanse | Topp 3 snitt | Meter |

**Kjønnsspesifikke krav (eksempel Test 1 Driver)**:
- Menn: 170m (K) → 270m (A)
- Kvinner: 140m (K) → 240m (A)

### Hastighet/Effektivitet (5-7)

| # | Navn | Input | Beregning | Enhet |
|---|------|-------|-----------|-------|
| 5 | Klubbhastighet Driver | 6 slag | Topp 3 snitt | km/h |
| 6 | Ballhastighet Driver | 6 slag | Topp 3 snitt | km/h |
| 7 | Smash Factor | 6 slag (ball/klubb) | Topp 3 snitt | Ratio |

**Kjønnsspesifikke krav (eksempel Test 5)**:
- Menn: 113 km/h (K) → 193 km/h (A)
- Kvinner: 89 km/h (K) → 169 km/h (A)

### Approach med PEI (8-11)

| # | Avstand | Ideell Leave | Formel | Sammenligning |
|---|---------|--------------|--------|---------------|
| 8 | 25m | 2.5m | PEI = avg_dist / ideal | <= (lavere er bedre) |
| 9 | 50m | 5.0m | PEI = avg_dist / ideal | <= (lavere er bedre) |
| 10 | 75m | 7.5m | PEI = avg_dist / ideal | <= (lavere er bedre) |
| 11 | 100m | 10.0m | PEI = avg_dist / ideal | <= (lavere er bedre) |

**PEI-krav**: 1.0 (A) → 3.0 (K) for alle approach-tester

**PEI til Strokes Gained konvertering**:
```
SG = (E_before - 1) - E_after
- E_before = Forventet slag fra startavstand
- E_after = Forventet putts fra leave-avstand
- Leave-avstand = Startavstand × (PEI / 100)
```

### Fysiske Tester (12-14)

| # | Navn | Input | Enhet | Sammenligning |
|---|------|-------|-------|---------------|
| 12 | Benkpress 1RM | Vekt i kg | kg | >= (høyere er bedre) |
| 13 | Trap Bar Markløft 1RM | Vekt i kg | kg | >= (høyere er bedre) |
| 14 | 3000m Løp | Tid i sekunder | sekunder (MM:SS) | <= (raskere er bedre) |

### Short Game (15-18)

| # | Navn | Input | Beregning | Enhet |
|---|------|-------|-----------|-------|
| 15 | Putting 3m | 10 putts (holed/miss) | Suksessrate | % |
| 16 | Putting 6m | 10 putts (holed/miss) | Suksessrate | % |
| 17 | Chipping | 10 chips med avstand til hull | Snitt avstand | cm |
| 18 | Bunker | 10 bunkerslag med avstand | Snitt avstand | cm |

### On-Course (19-20)

| # | Navn | Input | Metrics |
|---|------|-------|---------|
| 19 | 9-Hole Simulering | 9 hull med detaljert data | Score, FW%, GIR%, Putts/hull, Up&Down% |
| 20 | On-Course Skills | 3-6 hull med detaljert data | Score, FW%, GIR%, Putts, Scrambling, Penalties |

**Input per hull (Test 19/20)**:
- Par-verdi
- Score
- Fairway hit (boolean)
- GIR nådd (boolean)
- Antall putts
- Up & Down (boolean)
- Scrambling (boolean) - kun Test 20
- Penalties - kun Test 20

### Kategori-System (A-K)

| Kategori | Nivå | Beskrivelse |
|----------|------|-------------|
| A | Topp | Elite/Proff-nivå |
| B | Meget høy | Nær-proff |
| C | Høy | Sterk amatør |
| D | Over middels | God klubbspiller |
| E | Middels+ | Erfaren spiller |
| F | Middels | Gjennomsnittlig |
| G | Under middels | Utviklende spiller |
| H | Lav+ | Nybegynner+ |
| I | Lav | Nybegynner |
| J | Meget lav | Fersk nybegynner |
| K | Basis | Helt ny |

**Totalt**: 440 kategorikrav (20 tester × 11 kategorier × 2 kjønn)

### Kode-Lokasjon (Tester)

| Komponent | Fil |
|-----------|-----|
| Test Types | `apps/api/src/domain/tests/types.ts` |
| Kalkulator | `apps/api/src/domain/tests/test-calculator.ts` |
| Distansetester | `apps/api/src/domain/tests/calculations/distance-tests.ts` |
| Approach-tester | `apps/api/src/domain/tests/calculations/approach-tests.ts` |
| Fysiske tester | `apps/api/src/domain/tests/calculations/physical-tests.ts` |
| Short game | `apps/api/src/domain/tests/calculations/short-game-tests.ts` |
| On-course | `apps/api/src/domain/tests/calculations/on-course-tests.ts` |
| Krav-repository | `apps/api/src/domain/tests/requirements-repository.ts` |
| Prisma Schema | `apps/api/prisma/schema.prisma` (linjer 389-930) |
| Test Seeds | `apps/api/prisma/seeds/tests.ts` |
| Krav Seeds | `apps/api/prisma/seeds/category-requirements.ts` |
| API Service | `apps/api/src/api/v1/tests/service.ts` |

### Badge/Achievement System (Relatert til Tester)

**Lokasjon**: `apps/api/src/domain/gamification/achievement-definitions.ts`

**Volum-badges**:
- hours_10 → hours_2500 (treningstimer)
- sessions_25 → sessions_500 (økter)

**Prestasjons-badges**:
- Fitness-tester fullført
- Fysiske tester (medisinball, vertikalhopp)
- Putting-nøyaktighet
- Distanse-milepæler
- Hastighets-milepæler

**85 unike badges** med tiered progression (standard → bronze → silver → gold → platinum)

---

## 4. Dokumentasjon (281+ filer)

### Mappestruktur

```
docs/
├── api/                           # API-dokumentasjon (12 filer)
│   ├── API_DOCUMENTATION.md       # Hoved API-guide
│   ├── openapi-spec.yaml          # OpenAPI 3.0.3 spec
│   ├── coach.md                   # Coach-endepunkter
│   ├── booking.md                 # Booking-endepunkter
│   ├── ERROR_CODES.md             # Feilkoder
│   └── ...
├── architecture/                  # Systemdesign (8 filer)
│   ├── ARCHITECTURE.md
│   ├── DATABASE_FORMLER_KOMPLETT.md
│   ├── KOMPLETT_SYSTEMDOKUMENTASJON.md
│   ├── PROJECT_STRUCTURE.md
│   ├── ENDPOINT_MAPPING.md
│   └── ...
├── specs/                         # Spesifikasjoner (20 filer)
│   ├── PROGRESS_SEMANTICS.md
│   ├── CONFIG_KATEGORI_KRAV.md
│   ├── AK_ICON_BADGE_SYSTEM_SPEC.md
│   ├── SAMMENLIGNING_OG_ANALYTICS.md
│   └── ...
├── integrations/                  # Integrasjoner (8 filer)
│   ├── DATAGOLF_DATA_INVENTORY.md
│   ├── DATAGOLF_OPPORTUNITY_ANALYSIS.md
│   ├── DATAGOLF_DATABASE_OVERSIKT.md
│   ├── DATAGOLF_IMPLEMENTATION_STATUS.md
│   └── ...
├── features/                      # Feature-dokumentasjon (20+ filer)
│   ├── ANNUAL_PLAN_GENERATION.md
│   ├── GAMIFICATION_METRICS_SPEC.md
│   ├── datagolf/
│   │   ├── DATAGOLF_QUICKSTART.md
│   │   ├── DATAGOLF_KOMPLETT_OVERSIKT.md
│   │   └── DATAGOLF_STATS_FORSLAG.md
│   └── ...
├── reference/                     # Referansedokumenter
│   ├── golf-categories.md
│   ├── GAMIFICATION_METRICS_SPEC.md
│   ├── STRATEGI_AARSPLAN_OG_DATA.md
│   ├── MATEMATISKE_FORMLER_ALLE_TESTER.md
│   └── notion_original/           # Original Notion-schemas (11 JSON-filer)
│       ├── 01_SPILLERE_schema.json
│       ├── 02_PERIODISERING_schema.json
│       ├── 03_TRENINGSOKTER_schema.json
│       ├── 04_OVELSER_schema.json
│       ├── 05_TESTER_schema.json
│       ├── 06_TURNERINGER_schema.json
│       ├── 07_BENCHMARKING_schema.json
│       ├── 08_UKEPLANER_TEMPLATES_schema.json
│       ├── 09_BRUDDPUNKTER_schema.json
│       ├── 10_PROGRESJON_LOGG_schema.json
│       └── 11_REFERANSER_schema.json
├── contracts/                     # Kontrakter
├── deployment/                    # Deployment-guider
├── operations/                    # Drift
├── guides/                        # Utviklerguider
├── completed-sessions/            # 18+ sesjonsrapporter
├── design/                        # Designsystem
└── archive/                       # Historisk dokumentasjon
```

### Nøkkeldokumenter per Kategori

#### DataGolf & Statistikk
| Dokument | Beskrivelse |
|----------|-------------|
| `docs/integrations/DATAGOLF_DATA_INVENTORY.md` | 55,555 records, komplett dataoversikt |
| `docs/integrations/DATAGOLF_OPPORTUNITY_ANALYSIS.md` | Pro Gap Analysis strategi |
| `docs/features/datagolf/DATAGOLF_KOMPLETT_OVERSIKT.md` | Full integrasjonsoversikt |
| `docs/features/datagolf/DATAGOLF_QUICKSTART.md` | Quickstart-guide |
| `docs/features/datagolf/DATAGOLF_STATS_FORSLAG.md` | Statistikkforslag |

#### Tester & Krav
| Dokument | Beskrivelse |
|----------|-------------|
| `docs/reference/MATEMATISKE_FORMLER_ALLE_TESTER.md` | Alle formler med eksempler |
| `docs/specs/CONFIG_KATEGORI_KRAV.md` | 440 kategorikrav |
| `docs/architecture/DATABASE_FORMLER_KOMPLETT.md` | Komplett databaseformler |

#### Spillerutvikling
| Dokument | Beskrivelse |
|----------|-------------|
| `docs/features/ANNUAL_PLAN_GENERATION.md` | Årsplan-generering |
| `docs/specs/PROGRESS_SEMANTICS.md` | 4 progresjonstilstander |
| `docs/reference/golf-categories.md` | A-K kategorisystem |
| `docs/reference/STRATEGI_AARSPLAN_OG_DATA.md` | Strategisk planlegging |

#### Gamification
| Dokument | Beskrivelse |
|----------|-------------|
| `docs/features/GAMIFICATION_METRICS_SPEC.md` | Komplett metrics-spec |
| `docs/specs/AK_ICON_BADGE_SYSTEM_SPEC.md` | 85-badge system |

#### API
| Dokument | Beskrivelse |
|----------|-------------|
| `docs/api/openapi-spec.yaml` | OpenAPI 3.0.3 spesifikasjon |
| `docs/api/API_DOCUMENTATION.md` | Full API-guide |
| `docs/api/ERROR_CODES.md` | Feilkode-referanse |

#### Arkitektur
| Dokument | Beskrivelse |
|----------|-------------|
| `docs/architecture/ARCHITECTURE.md` | Systemarkitektur |
| `docs/architecture/KOMPLETT_SYSTEMDOKUMENTASJON.md` | Komplett systemdok |
| `docs/architecture/PROJECT_STRUCTURE.md` | Prosjektstruktur |

---

## 5. Datafiler

### DataGolf Performance Data
**Lokasjon**: `data/`

- 27 CSV-filer (2000-2026)
- ~400 spillere per sesong
- 11,271 totale spiller-sesonger
- Kolonner: player_name, events_played, wins, strokes_gained metrics

### WAGR Rankings
- Herrer og damer (2025)
- 8,302 totale spillere

---

## 6. Oppsummering

| Område | Status | Detaljer |
|--------|--------|----------|
| **DataGolf** | ✅ Fullt integrert | 451 proffspillere, daglig sync kl 03:00 UTC |
| **Turneringer** | ✅ GolfBox-import | Srixon Tour, Garmin Norgescup, Nordic Golf League |
| **Tester** | ✅ 20 tester | 440 kategorikrav, PEI→SG konvertering |
| **Dokumentasjon** | ✅ 281+ filer | Komplett API-spec, arkitektur, referanser |
| **Badges** | ✅ 85 badges | Tiered progression, test-relaterte achievements |

### Viktige Lenker (Interne)

- **API Docs**: `docs/api/API_DOCUMENTATION.md`
- **Test Formler**: `docs/reference/MATEMATISKE_FORMLER_ALLE_TESTER.md`
- **DataGolf**: `docs/features/datagolf/DATAGOLF_KOMPLETT_OVERSIKT.md`
- **Årsplan**: `docs/features/ANNUAL_PLAN_GENERATION.md`
- **Kategorier**: `docs/reference/golf-categories.md`
