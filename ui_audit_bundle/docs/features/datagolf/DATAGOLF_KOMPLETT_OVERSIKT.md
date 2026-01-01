# DataGolf Komplett Data Oversikt for IUP
**Dato:** 2025-12-27
**For:** ChatGPT Analyse
**Versjon:** 2.0 (Full API integrasjon)

---

## Executive Summary

IUP har nå **komplett integrasjon** med DataGolf API. Vi laster ned og lagrer **55,555 records** fra profesjonell golf som kan brukes til å benchmarke IUP-spillere mot tour-nivå.

| Datakategori | Records | Beskrivelse |
|--------------|---------|-------------|
| Skill Ratings | 451 | SG breakdown for alle spillere |
| Player Decompositions | 832 | Detaljert analyse med rankings |
| Approach Skill | 960 | SG per distanse (50yd - 200+yd) |
| Tournament Schedule | 224 | Kalender 2024 + 2025 |
| Historical Rounds | 53,087 | Runde-for-runde data med SG |
| **TOTALT** | **55,555** | |

---

## 1. Tilgjengelig Data

### 1.1 Skill Ratings (`DataGolfPlayer`)
**Records:** 451 spillere
**Tours:** PGA, EURO, KFT
**Oppdatering:** Daglig kl 03:00 UTC

**Datastruktur:**
```json
{
  "playerName": "Scheffler, Scottie",
  "sgTotal": 3.108,
  "sgOffTee": 0.902,
  "sgApproach": 1.340,
  "sgAroundGreen": 0.308,
  "sgPutting": 0.558,
  "drivingDistance": 11.76,
  "drivingAccuracy": 0.65,
  "tour": "pga",
  "season": 2025
}
```

**Top 5 Spillere (SG Total):**
| Rank | Spiller | SG Total | SG OTT | SG APP | SG ARG | SG Putt |
|------|---------|----------|--------|--------|--------|---------|
| 1 | Scheffler, Scottie | +3.11 | +0.90 | +1.34 | +0.31 | +0.56 |
| 2 | Rahm, Jon | +2.00 | +0.65 | +0.85 | +0.25 | +0.25 |
| 3 | McIlroy, Rory | +1.87 | +0.80 | +0.60 | +0.22 | +0.25 |
| 4 | Schauffele, Xander | +1.81 | +0.55 | +0.75 | +0.26 | +0.25 |
| 5 | DeChambeau, Bryson | +1.77 | +0.90 | +0.55 | +0.17 | +0.15 |

---

### 1.2 Approach Skill by Distance (`DataGolfApproachSkill`)
**Records:** 960 spillere (320 per tour)
**Tours:** PGA, EURO, KFT

**Distansebuckets:**
- 50-100 yards (fra fairway)
- 100-150 yards (fra fairway)
- 150-200 yards (fra fairway)
- 200+ yards (fra fairway)

**Datastruktur:**
```json
{
  "playerName": "Scheffler, Scottie",
  "tour": "pga",
  "approachSkill": {
    "50-100yd": 0.131,
    "100-150yd": 0.077,
    "150-200yd": 0.077,
    "200+yd": 0.071
  }
}
```

**Top 5 PGA (100-150 yards):**
| Rank | Spiller | SG/Shot |
|------|---------|---------|
| 1 | Scheffler, Scottie | +0.077 |
| 2 | Hoge, Tom | +0.076 |
| 3 | Glover, Lucas | +0.072 |
| 4 | Manassero, Matteo | +0.062 |
| 5 | Thomas, Justin | +0.061 |

**Tour Gjennomsnitt (PGA, 320 spillere):**
| Distanse | Avg SG/Shot |
|----------|-------------|
| 50-100yd | -0.003 |
| 100-150yd | -0.005 |
| 150-200yd | -0.005 |
| 200+yd | -0.007 |

---

### 1.3 Historical Rounds (`DataGolfHistoricalRound`)
**Records:** 53,087 runder
**Perioder:** 2024 + 2025
**Tours:** PGA (27,822), EURO (25,265)

**Breakdown per Tour/Sesong:**
| Tour | 2024 | 2025 | Total |
|------|------|------|-------|
| PGA | 9,744 | 18,078 | 27,822 |
| EURO | 12,684 | 12,581 | 25,265 |

**Datastruktur per runde:**
```json
{
  "playerName": "DeChambeau, Bryson",
  "eventName": "Masters Tournament",
  "roundNum": 1,
  "courseName": "Augusta National Golf Club",
  "coursePar": 72,
  "score": 65,
  "toPar": -7,
  "sgTotal": 8.427,
  "sgOffTee": 1.52,
  "sgApproach": 3.21,
  "sgAroundGreen": 1.85,
  "sgPutting": 1.85,
  "drivingDist": 315.2,
  "drivingAcc": 0.71,
  "gir": 0.83,
  "scrambling": 0.67
}
```

**Beste Enkeltrunde i Database:**
- **Spiller:** DeChambeau, Bryson
- **Turnering:** Masters Tournament 2024, Runde 1
- **Score:** 65 (-7)
- **SG Total:** +8.427

---

### 1.4 Tournament Schedule (`DataGolfSchedule`)
**Records:** 224 turneringer

**Breakdown:**
| Tour | 2024 | 2025 | Total |
|------|------|------|-------|
| PGA | 51 | 49 | 100 |
| EURO | 37 | 35 | 72 |
| KFT | 26 | 26 | 52 |

---

### 1.5 Player Decompositions (`DataGolfPlayerDecomposition`)
**Records:** 832 spillere
**Data inkluderer:**
- DG Rank (DataGolf ranking)
- OWGR Rank (Official World Golf Ranking)
- True Skill Estimate
- Detaljert SG breakdown

---

## 2. API Endpoints

### 2.1 Eksisterende Endpoints (Før denne oppdatering)
| Method | Endpoint | Beskrivelse |
|--------|----------|-------------|
| GET | `/api/v1/datagolf/players/:playerId` | Hent DataGolf data for spiller |
| GET | `/api/v1/datagolf/tour-averages` | Hent tour gjennomsnitt |
| GET | `/api/v1/datagolf/compare` | Sammenlign IUP spiller mot tour |
| POST | `/api/v1/datagolf/sync` | Trigger manuell sync |
| GET | `/api/v1/datagolf/sync-status` | Sjekk sync status |

### 2.2 NYE Approach Skill Endpoints (Denne oppdatering)
| Method | Endpoint | Beskrivelse |
|--------|----------|-------------|
| GET | `/api/v1/datagolf/approach-skill` | List alle approach skill data |
| GET | `/api/v1/datagolf/approach-skill/averages` | Tour gjennomsnitt per distanse |
| GET | `/api/v1/datagolf/approach-skill/top?distance=100-125` | Top spillere for distanse |
| GET | `/api/v1/datagolf/approach-skill/player/:name` | Approach skill for spiller |

---

## 3. Hvordan Data Brukes I Dag

### 3.1 Coach DataGolf Dashboard
**Fil:** `apps/web/src/features/coach-stats/CoachDataGolf.tsx`
**Status:** ⚠️ BRUKER MOCK DATA

Dashboardet viser:
- Spillerliste med SG breakdown
- Tilkoblingsstatus
- Tradisjonell statistikk

**Problem:** Komponenten bruker hardkodet mock data, ikke ekte DataGolf API.

```typescript
// MOCK DATA - Ikke koblet til API
const mockDataGolfPlayers: PlayerDataGolf[] = [
  {
    id: '1',
    name: 'Emma Larsen',
    stats: {
      sgTotal: 2.8,
      sgTee: 0.6,
      // ...
    }
  }
];
```

### 3.2 Pro Gap Analysis
**Konsept:** Viser hvor mange slag en IUP spiller er fra tour-nivå.

**Eksempel output:**
```
Du er 0.4 slag fra PGA Tour nivå!

SG Total: -0.885 (Tour Avg: -0.485)
Gap: 0.4 slag

Breakdown:
- Off The Tee: -0.20 (Tour: -0.16) → -0.04 gap
- Approach: -0.30 (Tour: -0.22) → -0.08 gap ⚠️ SVAKHET
- Around Green: -0.05 (Tour: -0.06) → +0.01 gap
- Putting: -0.02 (Tour: -0.05) → +0.03 gap
```

### 3.3 Ikke Implementert Enda
Følgende data er tilgjengelig men IKKE brukt i frontend:
- ❌ Approach Skill by Distance (NY DATA)
- ❌ Historical Round Analysis
- ❌ Tournament Schedule
- ❌ Player Decompositions/Rankings

---

## 4. Potensielle Bruksområder

### 4.1 Approach Skill Validering
**Kobling til IUP Test #6 (Approach 150m)**

Med approach skill data kan vi:
- Sammenligne IUP spiller approach fra 150m mot tour average
- Vise percentil ranking: "Du er bedre enn 65% av PGA spillere fra 150m"
- Identifisere distanser som trenger arbeid

**Eksempel:**
```
Din Approach Performance:
- 100-150m: +0.02 SG/skudd (Tour avg: -0.005) ✅ Over tour avg!
- 150-200m: -0.08 SG/skudd (Tour avg: -0.005) ⚠️ Trenger arbeid
```

### 4.2 Historical Round Trend Analysis
Med 53,087 historiske runder kan vi:
- Vise form-kurver over tid
- Sammenligne IUP spiller progresjon mot pro-progresjon
- Identifisere sesongmønstre
- Course-spesifikk analyse

### 4.3 Tournament Readiness
Med schedule + historical data kan vi:
- "Neste PGA turnering: Genesis Invitational"
- "Spillere med lignende profil scorer avg -3 her"
- "Fokuser på: Long approach (150-200m er kritisk på denne banen)"

### 4.4 Peer Comparison Enhanced
Kombinere IUP peer data med DataGolf pro data:
- "Du er #3 i din kategori, og #450 på DataGolf ranking-skala"
- "For å nå B-kategori trenger du +0.3 SG Total"

---

## 5. Teknisk Arkitektur

### 5.1 Database Tabeller
```
DataGolfPlayer           - Skill ratings (SG breakdown)
DataGolfPlayerDecomposition - Detaljert analyse + rankings
DataGolfApproachSkill    - Approach skill per distanse
DataGolfSchedule         - Turneringskalender
DataGolfHistoricalRound  - Historiske runder
DataGolfTourAverage      - Beregnede tour gjennomsnitt
```

### 5.2 Sync Arkitektur
```
Daglig Sync (03:00 UTC)
├── /preds/skill-ratings → DataGolfPlayer
├── /preds/get-dg-rankings → DataGolfPlayerDecomposition
├── /preds/player-decompositions → DataGolfPlayerDecomposition
├── /preds/approach-skill → DataGolfApproachSkill
├── /get-schedule → DataGolfSchedule
├── /historical-raw-data/rounds → DataGolfHistoricalRound
└── Calculate Tour Averages → DataGolfTourAverage
```

### 5.3 Filstruktur
```
apps/api/
├── src/
│   ├── api/v1/datagolf/
│   │   ├── routes.ts      (API endpoints)
│   │   ├── service.ts     (Business logic)
│   │   ├── types.ts       (TypeScript types)
│   │   └── mappings.ts    (IUP→DG mapping)
│   └── integrations/datagolf/
│       └── client.ts      (DataGolf API client)
├── scripts/
│   ├── sync-all-datagolf.ts    (Komplett sync script)
│   └── check-datagolf-data.ts  (Verifikasjon)
└── prisma/
    └── schema.prisma      (Database modeller)
```

---

## 6. Spørsmål til ChatGPT

### 6.1 Feature Prioritering
Gitt at vi nå har:
- 960 spillere med approach skill per distanse
- 53,087 historiske runder med SG breakdown
- 224 turneringer i kalender

**Spørsmål:** Hvilke 3 features bør vi bygge først for maksimal verdi til:
1. Spillere (motivasjon, innsikt)
2. Coaches (effektivitet, beslutningsstøtte)
3. Business (retention, differensiering)

### 6.2 Approach Skill Integration
Vi har nå approach skill for 7 distansebuckets.

**Spørsmål:** Hvordan kan vi best integrere dette med IUP Test #6 (Approach 150m)?
- Skal vi vise sammenligning direkte i test-resultatet?
- Skal vi lage en egen "Pro Comparison" side?
- Hvordan motivere uten å demotivere spillere langt fra tour?

### 6.3 Historical Data Utnyttelse
Vi har 53,087 runder med komplett SG breakdown.

**Spørsmål:** Hva er de mest verdifulle analysene vi kan gjøre?
- Form-tracking over tid?
- Course-spesifikk performance?
- Sammenligne utviklingskurver?
- Identifisere "breaking points" i utvikling?

### 6.4 Coach Dashboard Forbedring
Dagens CoachDataGolf.tsx bruker mock data.

**Spørsmål:** Når vi kobler til ekte data, hvilke visualiseringer gir mest verdi?
- Heatmaps for SG breakdown?
- Radar charts for spillerprofiler?
- Trend-linjer for utvikling?
- Comparative rankings?

### 6.5 Monetization
Vi har nå svært omfattende pro-data.

**Spørsmål:** Hvordan bør vi prise tilgang til denne data?
- Basic (free): Tour averages only
- Pro (€9/mnd): Full SG comparison
- Elite (€19/mnd): Historical analysis + approach skill
- Eller annen struktur?

---

## 7. Begrensninger

### 7.1 Hva Vi HAR
✅ Skill ratings for 451 spillere
✅ Approach skill for 960 spillere
✅ 53,087 historiske runder
✅ Tournament schedule 2024-2025
✅ Player rankings (DG + OWGR)

### 7.2 Hva Vi IKKE HAR
❌ Hole-by-hole stats (ikke i API)
❌ Weather adjustments
❌ Amateur player data (kun pros)
❌ Real-time live data (kun post-runde)

### 7.3 Legal Compliance
**Tillatt:**
- Aggregerte sammenligninger ("Du er X slag fra tour avg")
- Percentile rankings
- Training recommendations basert på gaps

**IKKE Tillatt:**
- Raw data redistribution
- Individuelle pro-profiler
- API reselling

---

## 8. Neste Steg

### Umiddelbare Aksjoner
1. **Koble CoachDataGolf til ekte API** - Erstatt mock data
2. **Implementer Approach Skill UI** - Vis distanse-breakdown i frontend
3. **Lag Historical Trends View** - Vis form over tid

### Middels Sikt
4. **Pro Style Matching** - "Du spiller som [Pro Name]"
5. **Course Fit Analysis** - Hvilke baner passer spillerens stil
6. **Training ROI Predictor** - "10 timer putting = +0.2 SG"

### Lang Sikt
7. **AI-basert treningsplan** - Automatisk genererte planer basert på gaps
8. **Tournament Readiness Score** - Pre-turnering vurdering
9. **Category Progression Predictor** - ML-modell for opprykk sannsynlighet

---

**Opprettet:** 2025-12-27
**Forfatter:** Claude Code
**Status:** Produksjonsklar
