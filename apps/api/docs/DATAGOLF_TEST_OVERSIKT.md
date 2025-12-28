# DataGolf & IUP Test Oversikt

> Sist oppdatert: 28. desember 2025

## Innhold

1. [DataGolf Data](#1-datagolf-data)
2. [IUP Tester (1-20)](#2-iup-tester)
3. [Test-til-Komponent Mapping](#3-test-til-komponent-mapping)
4. [Focus Engine](#4-focus-engine)
5. [Gap-Analyse](#5-gap-analyse)

---

## 1. DataGolf Data

### 1.1 Spillersesonger (`dg_player_seasons`)

**Totalt:** 11,271 records (2000-2026)

| Felt | Type | Beskrivelse |
|------|------|-------------|
| `player_id` | VARCHAR | Spillernavn (f.eks. "Scheffler, Scottie") |
| `season` | INT | Sesong (2000-2026) |
| `ott_true` | DECIMAL | Strokes Gained Off-the-Tee per runde |
| `app_true` | DECIMAL | Strokes Gained Approach per runde |
| `arg_true` | DECIMAL | Strokes Gained Around-the-Green per runde |
| `putt_true` | DECIMAL | Strokes Gained Putting per runde |
| `t2g_true` | DECIMAL | Strokes Gained Tee-to-Green per runde |
| `total_true` | DECIMAL | Total Strokes Gained per runde |
| `rounds_played` | INT | Antall runder spilt |
| `events_played` | INT | Antall turneringer |
| `wins` | INT | Seiere |
| `x_wins` | DECIMAL | Forventede seiere |

**Toppspillere 2025:**

| Rang | Spiller | Total SG | OTT | APP | ARG | PUTT |
|------|---------|----------|-----|-----|-----|------|
| 1 | Scheffler, Scottie | 3.290 | 0.821 | 1.451 | 0.360 | 0.658 |
| 2 | McIlroy, Rory | 2.191 | 0.712 | 0.892 | 0.287 | 0.300 |
| 3 | Fleetwood, Tommy | 2.070 | 0.445 | 0.823 | 0.412 | 0.390 |
| 4 | DeChambeau, Bryson | 1.920 | 0.891 | 0.634 | 0.195 | 0.200 |
| 5 | Rahm, Jon | 1.906 | 0.556 | 0.789 | 0.311 | 0.250 |

---

### 1.2 Approach Skills (`dg_approach_skill_l24`)

**Totalt:** 8,450 records (siste 24 måneder)

| Felt | Type | Beskrivelse |
|------|------|-------------|
| `player_id` | VARCHAR | Spillernavn |
| `bucket` | VARCHAR | Distanse-bucket |
| `lie` | VARCHAR | Lie-type (fairway/rough) |
| `stat` | VARCHAR | Statistikk-type |
| `value` | DECIMAL | Verdi |
| `shot_count` | INT | Antall slag i sample |

**Distanse-Buckets:**

| Bucket | Beskrivelse | Typisk slag |
|--------|-------------|-------------|
| `50_100` | 50-100 yards fra fairway | Wedge |
| `100_150` | 100-150 yards fra fairway | Short iron |
| `150_200` | 150-200 yards fra fairway | Mid iron |
| `over_200` | 200+ yards fra fairway | Long iron/hybrid |
| `under_150` | Under 150y fra rough | Recovery |
| `over_150` | 150+ yards fra rough | Long recovery |

**Statistikk-Typer:**

| Stat | Beskrivelse |
|------|-------------|
| `sg_per_shot` | Strokes Gained per slag |
| `proximity_ft` | Gjennomsnittlig avstand til hull (fot) |
| `green_hit_rate` | Andel greener truffet |
| `good_shot_rate` | Andel gode slag |
| `poor_shot_avoidance` | Evne til å unngå dårlige slag |

---

### 1.3 Komponent-Vekter (`dg_component_weights`)

Beregnet fra standardavvik i pro-data (høyere varians = viktigere komponent):

| Komponent | Vekt | Std.Dev | Betydning |
|-----------|------|---------|-----------|
| **APP** | 31.6% | 0.603 | Mest differensierende |
| **OTT** | 25.2% | 0.480 | Viktig for scoring |
| **PUTT** | 24.8% | 0.473 | Jevn viktighet |
| **ARG** | 18.5% | 0.353 | Minst variasjon |

*Vindu: 2024-2026, 901 spillere analysert*

---

## 2. IUP Tester

### 2.1 Alle 20 Tester

| # | Navn | Kategori | Type | Utstyr | Forsøk | Metric |
|---|------|----------|------|--------|--------|--------|
| 1 | Driver Carry Distance | Distanse | Distance | Driver, LM | 5 | Snitt 3 beste (m) |
| 2 | 3-Wood Distance | Distanse | Distance | 3-Wood, LM | 5 | Snitt 3 beste (m) |
| 3 | 5-Iron Distance | Distanse | Distance | 5-Iron, LM | 5 | Snitt 3 beste (m) |
| 4 | PW Distance | Distanse | Distance | PW, LM | 5 | Snitt 3 beste (m) |
| 5 | Driver Club Speed | Hastighet | Speed | Driver, LM | 5 | Max (mph) |
| 6 | Driver Ball Speed | Hastighet | Speed | Driver, LM | 5 | Max (mph) |
| 7 | Smash Factor | Hastighet | Speed | Driver, LM | 5 | Ball/Club ratio |
| 8 | Approach @ 25m | Presisjon | Accuracy | Wedges | 10 | Snitt avstand (m) |
| 9 | Approach @ 50m | Presisjon | Accuracy | Wedges | 10 | Snitt avstand (m) |
| 10 | Approach @ 75m | Presisjon | Accuracy | Irons | 10 | Snitt avstand (m) |
| 11 | Approach @ 100m | Presisjon | Accuracy | Irons | 10 | Snitt avstand (m) |
| 12 | Bench Press 1RM | Fysisk | Strength | Vektstang | 3 | Vekt (kg) |
| 13 | Trap Bar Deadlift | Fysisk | Strength | Trap bar | 3 | Vekt (kg) |
| 14 | 3km Løping | Fysisk | Endurance | Tredemølle | 1 | Tid (sek) |
| 15 | Putting @ 3m | Putting | Putting | Putter | 10 | % hullet |
| 16 | Putting @ 6m | Putting | Putting | Putter | 10 | % hullet |
| 17 | Chipping | Kortspill | Scoring | Wedges | 10 | Snitt avstand (cm) |
| 18 | Bunker | Kortspill | Scoring | Sand wedge | 10 | Snitt avstand (m) |
| 19 | 9-Hulls Score | Scoring | Scoring | Full bag | 9 | Score vs par |
| 20 | 3-6 Hulls Bane | Mental | Mental | Full bag | 3-6 | Score + mental |

---

### 2.2 Kategori-Krav (Eksempel: Test 1 - Driver)

| Kategori | Menn (m) | Kvinner (m) |
|----------|----------|-------------|
| A | 270 | 240 |
| B | 260 | 230 |
| C | 250 | 220 |
| D | 240 | 210 |
| E | 230 | 200 |
| F | 220 | 190 |
| G | 210 | 180 |
| H | 200 | 170 |
| I | 190 | 160 |
| J | 180 | 150 |
| K | 170 | 140 |

---

## 3. Test-til-Komponent Mapping

### 3.1 OTT (Off the Tee) - 5 Tester

| Test # | Navn | Vekt | Begrunnelse |
|--------|------|------|-------------|
| 1 | Driver Carry Distance | 1.0 | Primær distanse-metric |
| 2 | 3-Wood Distance | 0.8 | Sekundær lang kølle |
| 5 | Driver Club Speed | 1.0 | Kjernemål for OTT |
| 6 | Driver Ball Speed | 1.0 | Launch-metric |
| 7 | Smash Factor | 0.8 | Effektivitet |

**Total vekt:** 4.6 | **Snitt per test:** 0.92

---

### 3.2 APP (Approach) - 6 Tester

| Test # | Navn | Vekt | DataGolf Bucket |
|--------|------|------|-----------------|
| 3 | 5-Iron Distance | 0.8 | 150_200 |
| 4 | PW Distance | 0.6 | 50_100 |
| 8 | Approach @ 25m | 0.8 | under_50 |
| 9 | Approach @ 50m | 0.9 | 50_100 |
| 10 | Approach @ 75m | 1.0 | 100_150 |
| 11 | Approach @ 100m | 1.0 | 100_150 |

**Total vekt:** 5.3 | **Snitt per test:** 0.88

---

### 3.3 ARG (Around the Green) - 2 Tester

| Test # | Navn | Vekt | Begrunnelse |
|--------|------|------|-------------|
| 17 | Chipping | 1.0 | Kjerne kortspill |
| 18 | Bunker | 1.0 | Kritisk recovery |

**Total vekt:** 2.0 | **Snitt per test:** 1.0

---

### 3.4 PUTT (Putting) - 2 Tester

| Test # | Navn | Vekt | Begrunnelse |
|--------|------|------|-------------|
| 15 | Putting @ 3m | 1.0 | Kort putt - høyest prioritet |
| 16 | Putting @ 6m | 1.0 | Mellomlang putt |

**Total vekt:** 2.0 | **Snitt per test:** 1.0

---

### 3.5 Ikke-Mappede Tester

| Test # | Navn | Kategori | Grunn |
|--------|------|----------|-------|
| 12 | Bench Press 1RM | Fysisk | Ingen SG-ekvivalent |
| 13 | Trap Bar Deadlift | Fysisk | Ingen SG-ekvivalent |
| 14 | 3km Løping | Fysisk | Ingen SG-ekvivalent |
| 19 | 9-Hulls Score | Scoring | Integrert test |
| 20 | 3-6 Hulls Bane | Mental | Prestasjonstest |

---

## 4. Focus Engine

### 4.1 Hvordan Det Fungerer

```
1. Hent spillerens testresultater
2. Beregn score per komponent (vektet snitt)
3. Sammenlign med målpersentil (75%)
4. Beregn svakhet: weakness = (mål - score) / 100
5. Beregn prioritet: priority = weakness × komponent_vekt
6. Fokuskomponent = høyest prioritet
7. Beregn treningssplit med constraints (min 10%, max 50%)
```

### 4.2 Konfidenssnivåer

| Nivå | Kriterier |
|------|-----------|
| `high` | 6+ testresultater |
| `med` | 3-5 testresultater |
| `low` | < 3 testresultater |

### 4.3 Reason Codes

| Kode | Betydning |
|------|-----------|
| `weak_ott_test_cluster` | OTT-tester under målpersentil |
| `weak_app_test_cluster` | APP-tester under målpersentil |
| `weak_arg_test_cluster` | ARG-tester under målpersentil |
| `weak_putt_test_cluster` | PUTT-tester under målpersentil |
| `high_weight_app` | APP har høy vekt (>0.3) |
| `insufficient_test_data` | Lav konfidens pga få tester |

### 4.4 Eksempel Output

```json
{
  "playerId": "00000000-0000-0000-0000-000000000004",
  "playerName": "Andreas Holm",
  "focusComponent": "ARG",
  "focusScores": {
    "OTT": 13,
    "APP": 0,
    "ARG": 50,
    "PUTT": 0
  },
  "recommendedSplit": {
    "OTT": 0.17,
    "APP": 0.17,
    "ARG": 0.49,
    "PUTT": 0.17
  },
  "reasonCodes": ["weak_arg_test_cluster"],
  "confidence": "high"
}
```

---

## 5. Gap-Analyse

### 5.1 Dekning per Komponent

| Komponent | DataGolf Vekt | Antall Tester | Status |
|-----------|---------------|---------------|--------|
| APP | 31.6% | 6 | ✅ Best dekket |
| OTT | 25.2% | 5 | ✅ Godt dekket |
| PUTT | 24.8% | 2 | ⚠️ Underrepresentert |
| ARG | 18.5% | 2 | ⚠️ Underrepresentert |

### 5.2 Mangler

| Problem | Beskrivelse | Anbefaling |
|---------|-------------|------------|
| Lag putting | Mangler test for 10m+ | Legg til Test 23 |
| Pitch shots | Kun chip/bunker for ARG | Legg til pitch-test (20-30m) |
| Fysiske tester | Ikke koblet til SG | Vurder indirekte mapping |
| Pressure putting | Ingen mental putt-test | Legg til prestasjonsputt |

### 5.3 Styrker

- **Approach komplett:** 4 distanser (25m-100m) matcher DataGolf buckets
- **OTT variert:** Både distanse og hastighet dekket
- **Logisk mapping:** Tester → SG-komponenter er korrekt

---

## API Endpoints

| Metode | Endpoint | Beskrivelse |
|--------|----------|-------------|
| GET | `/api/v1/focus-engine/me/focus` | Min fokusanbefaling |
| GET | `/api/v1/focus-engine/users/:id/focus` | Spillers fokus |
| GET | `/api/v1/focus-engine/weights` | Gjeldende vekter |
| GET | `/api/v1/focus-engine/stats` | Ingestion-statistikk |
| POST | `/api/v1/focus-engine/internal/ingest` | Admin: Last data |
| POST | `/api/v1/focus-engine/internal/compute-weights` | Admin: Beregn vekter |

---

## Database-Tabeller

| Tabell | Records | Beskrivelse |
|--------|---------|-------------|
| `dg_player_seasons` | 11,271 | Pro-spillere 2000-2026 |
| `dg_approach_skill_l24` | 8,450 | Approach-skills siste 24 mnd |
| `dg_component_weights` | 1 | Aktive komponent-vekter |
| `test_component_mappings` | 15 | Test → SG mapping |
| `player_focus_cache` | varierer | Cache for fokus-beregninger |

---

## Filstruktur

```
apps/api/
├── prisma/
│   ├── schema.prisma                    # Database-modeller
│   └── migrations/
│       └── 20251227180000_add_focus_engine/
│
├── src/domain/focus-engine/
│   ├── types.ts                         # TypeScript interfaces
│   ├── ingestion.service.ts             # CSV-parsing fra zip
│   ├── weights.service.ts               # Vekt-beregning
│   ├── focus-engine.service.ts          # Fokus-logikk
│   └── index.ts                         # Eksporter
│
├── src/api/v1/focus-engine/
│   └── routes.ts                        # API endpoints
│
├── tests/unit/focus-engine/
│   ├── focus-engine.test.ts             # 9 tester
│   └── ingestion.test.ts                # 10 tester
│
└── docs/
    ├── FOCUS_ENGINE.md                  # Brukerdokumentasjon
    └── DATAGOLF_TEST_OVERSIKT.md        # Denne filen

apps/web/src/features/focus-engine/
├── FocusWidget.jsx                      # Spiller-widget
├── TeamFocusHeatmap.jsx                 # Trener-heatmap
└── index.js                             # Eksporter
```

---

*Generert av Focus Engine - IUP Golf Academy*
