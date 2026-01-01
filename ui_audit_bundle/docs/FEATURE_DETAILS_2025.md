# AK Golf Academy - Detaljerte Funksjonsbeskrivelser 2025

> **Sist oppdatert:** 31. desember 2024
> **Tilhører:** FEATURE_OVERVIEW_2025.md
> **Innhold:** Dyptgående beskrivelse av kjernefunksjoner

---

## Innholdsfortegnelse

1. [Dashboard](#1-dashboard)
2. [Treningsøkter (Sessions)](#2-treningsøkter-sessions)
3. [Testing & Evaluering](#3-testing--evaluering)
4. [Statistikk & Strokes Gained](#4-statistikk--strokes-gained)
5. [Video-analyse](#5-video-analyse)
6. [Gamification](#6-gamification)

---

## 1. Dashboard

### 1.1 Oversikt

Dashboardet er spillerens hovedside etter innlogging og viser en samlet oversikt over treningsstatus, kommende aktiviteter og fremgang.

### 1.2 Dashboard-versjoner

| Versjon | Fil | Status | Beskrivelse |
|---------|-----|--------|-------------|
| **V5** | `DashboardV5.tsx` | Anbefalt | Nyeste versjon med alle widgets |
| **V2** | `v2/DashboardV2.tsx` | Premium | Komponentbasert elite-design |
| **Page** | `DashboardPage.tsx` | Forenklet | Template-basert minimal versjon |
| **Container** | `DashboardContainer.jsx` | Legacy | Rolle-basert routing |

### 1.3 Widgets & Komponenter

#### Velkomst-header
```
┌─────────────────────────────────────────┐
│ God morgen, [Fornavn]! 👋               │
│ [Kategori B] · [Dato]                   │
│ [Profilbilde]                           │
└─────────────────────────────────────────┘
```

#### Stats Grid (2x2)
| Stat | Beskrivelse | Datakilde |
|------|-------------|-----------|
| **Økter denne uken** | Gjennomførte/planlagte | Sessions API |
| **Treningstimer** | Timer denne uken | Sessions API |
| **Streak** | Dager på rad med trening | Player Insights API |
| **Nivå/Handicap** | Spillerens nivå | Player API |

#### Dagens økter
```
┌─────────────────────────────────────────┐
│ DAGENS ØKTER                            │
├─────────────────────────────────────────┤
│ ⏰ 09:00 │ Putting │ Klubben │ 60 min   │
│    [Planlagt]                           │
│                                         │
│ ⏰ 14:00 │ Driving │ Range │ 45 min     │
│    [Fullført ✓]                         │
└─────────────────────────────────────────┘
```

#### Nedtellinger (V2/V5)
- **Neste turnering**: Dager til neste turneringsstart
- **Neste test**: Dager til neste testbenchmark

#### Strokes Gained-kort (V2)
Visualisering med senterlinjebasert stolpediagram:
- Driving (OTT)
- Approach
- Short Game
- Putting

#### Quick Actions (V5)
| Handling | Ikon | Navigerer til |
|----------|------|---------------|
| Start trening | ▶️ | `/session/new` |
| Kalender | 📅 | `/kalender` |
| Mål | 🎯 | `/maalsetninger` |
| Prestasjoner | 🏆 | `/achievements` |

#### Aktivitetsfeed
Kronologisk liste over nylige hendelser:
- Økt fullført
- Melding fra trener
- Badge opptjent
- Test gjennomført

### 1.4 API-integrasjon

**Hoved-endepunkt:**
```
GET /api/v1/dashboard?date={ISO-dato}
```

**Respons-struktur:**
```typescript
interface DashboardResponse {
  player: {
    firstName: string;
    lastName: string;
    category: 'A1' | 'A2' | 'B' | 'C' | 'D' | ... | 'K';
    profileImageUrl?: string;
    totalXP: number;
  };
  period: 'E' | 'G' | 'S' | 'T';
  todaySessions: Session[];
  weeklyStats: {
    stats: WeeklyStat[];
    streak: number;
  };
  goals: Goal[];
  badges: Badge[];
  messages: Message[];
  nextTournament?: Event;
  nextTest?: Event;
  breakingPoints: BreakingPoint[];
  recentTests: TestResult[];
  gamification: {
    totalXP: number;
    currentLevel: number;
  };
}
```

**Hook-bruk:**
```javascript
const { data, loading, error, refetch } = useDashboard(selectedDate);
```

---

## 2. Treningsøkter (Sessions)

### 2.1 Økt-livssyklus

```
[Opprett] → [Planlagt] → [Aktiv] → [Fullført] → [Evaluert]
                ↓           ↓          ↓
             [Kansellert] [Pause] [Avbrutt]
```

### 2.2 Økt-opprettelse

#### Steg 1: Grunndata

| Felt | Type | Beskrivelse |
|------|------|-------------|
| **Økttype** | Select | driving, iron_play, short_game, putting, on_course, physical, mental, mixed |
| **Dato/tid** | Datetime | Når økten skal gjennomføres |
| **Varighet** | Select | 15, 30, 45, 60, 90, 120, 180 minutter |

#### Steg 2: Treningsparametre

| Parameter | Verdier | Beskrivelse |
|-----------|---------|-------------|
| **Læringsfase (L1-L5)** | L1-L5 | Treningens fokus |
| **Periode** | E/G/S/T | Sesongfase |
| **Intensitet** | 1-10 | Planlagt intensitetsnivå |

**Læringsfaser forklart:**
| Fase | Navn | Fokus |
|------|------|-------|
| L1 | Ball | Ballkontakt og treff |
| L2 | Teknikk | Teknisk trening |
| L3 | Transfer | Overføring til spill |
| L4 | Variasjon | Variasjonstrening |
| L5 | Spill | Spillsituasjoner |

#### Steg 3: Fokus og notater
- Fokusområde (fritekst)
- Instruksjoner/notater

### 2.3 Aktiv økt-gjennomføring

#### Timer-system
```
┌─────────────────────────────────────────┐
│         AKTIV ØKT                       │
├─────────────────────────────────────────┤
│    ⏱️ 00:45:23                          │  ← Total økttid
│                                         │
│    Blokk 3/5 │ Putting drill            │
│    Gjenstår: 08:42                      │  ← Blokk-timer
├─────────────────────────────────────────┤
│ [1✓] [2✓] [3●] [4] [5]                  │  ← Blokk-navigasjon
└─────────────────────────────────────────┘
```

#### Rep-teller
```
┌─────────────────────────────────────────┐
│    REPETITIONS                          │
│                                         │
│      [-10] [-1] [ 47 ] [+1] [+10]       │
│                                         │
│    ████████████░░░░░░ 47/50 (94%)       │
└─────────────────────────────────────────┘
```

#### Data fanget per blokk
```typescript
interface BlockData {
  blockIndex: number;
  exercise: string;
  targetDuration: number;  // sekunder
  actualDuration: number;  // sekunder
  targetReps: number;
  actualReps: number;
  qualityRating: 1 | 2 | 3 | 4 | 5;
  focusRating: 1 | 2 | 3 | 4 | 5;
  intensityRating: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  completedAt: Date;
}
```

### 2.4 Blokk-evaluering (BlockRatingModal)

Etter hver blokk kan spilleren vurdere:

| Rating | Skala | Emojis |
|--------|-------|--------|
| **Kvalitet** | 1-5 | 😟 → 🤩 |
| **Fokus** | 1-5 | 😟 → 🤩 |
| **Intensitet** | 1-5 | 💤 → ⚡ |

### 2.5 Øktevaluering (SessionEvaluationForm)

#### Hovedvurderinger (1-10 skala)

| Vurdering | Lav → Høy |
|-----------|-----------|
| **Fokus** | Distrahert → Laserfokus |
| **Teknisk utførelse** | Mye feil → Svært bra |
| **Energinivå** | Sliten → Full energi |
| **Mental tilstand** | Stresset → Rolig og fokusert |

#### Pre-shot rutine
```
Var du konsekvent med pre-shot rutinen?
[Ja] [Delvis] [Nei]

Antall slag med rutine: [___] / Total slag: [___]
= XX% konsistens
```

#### Tekniske cues
Multi-select med forhåndsdefinerte cues:
- "Hold venstre arm strak"
- "Rolig tempo"
- "Se på ballen"
- [+ Egendefinert]

#### Refleksjon
- Hva gikk bra?
- Fokus til neste økt
- Generelle notater

### 2.6 API-endepunkter

| Endepunkt | Metode | Formål |
|-----------|--------|--------|
| `/bookings` | POST | Opprett økt |
| `/bookings/{id}` | GET | Hent aktiv økt |
| `/bookings/{id}/blocks/{idx}` | POST | Lagre blokkdata |
| `/bookings/{id}` | PATCH | Oppdater status |
| `/sessions/{id}` | GET | Hent for evaluering |
| `/sessions/technicalCues` | GET | Hent cue-alternativer |
| `/sessions/{id}/evaluation` | PATCH | Auto-lagre evaluering |
| `/sessions/{id}/complete` | POST | Fullfør økt |

---

## 3. Testing & Evaluering

### 3.1 Testprotokoller

**20 standardiserte tester fordelt på 6 kategorier:**

#### Golfslag (Test 1-7)
| # | Test | Måleenhet | Beskrivelse |
|---|------|-----------|-------------|
| 1 | Driver Distance | meter | Carry-distanse |
| 2 | Iron 7 Distance | meter | Carry-distanse |
| 3 | Iron 7 Accuracy | meter | Avvik fra mål |
| 4 | Wedge PEI | indeks | Precision Efficiency Index |
| 5 | Lag Control Putting | cm | Avstand fra hull |
| 6 | Green Reading Putting | % | Korrekt linje-valg |
| 7 | Bunker Play | % | Suksessrate |

#### Teknikk (Test 8-11)
| # | Test | Måleenhet |
|---|------|-----------|
| 8 | Club Speed Driver | mph |
| 9 | Smash Factor Driver | ratio |
| 10 | Launch Angle Driver | grader |
| 11 | Spin Rate Driver | rpm |

#### Fysisk (Test 12-14)
| # | Test | Måleenhet |
|---|------|-----------|
| 12 | Bench Press | kg (1RM) |
| 13 | Trap Bar Deadlift | kg (1RM) |
| 14 | Rotation Throw 4kg | meter |

#### Mental (Test 15-18)
| # | Test | Måleenhet |
|---|------|-----------|
| 15 | Pressure Putting | % |
| 16 | Pre-shot Routine Consistency | % |
| 17 | Focus Under Distraction | % |
| 18 | Mental Toughness MTQ48 | poeng |

#### Strategi (Test 19-20)
| # | Test | Måleenhet |
|---|------|-----------|
| 19 | Club Selection & Risk Assessment | % |
| 20 | Course Strategy Planning | poeng |

### 3.2 Kategorikrav (A → K)

Spillere plasseres i kategorier basert på testresultater:

| Kategori | Nivå | Eksempel: Driver Speed |
|----------|------|------------------------|
| A | Elite | 120+ mph |
| B | Avansert | 112+ mph |
| C | Middels-høy | 105+ mph |
| D | Middels | 98+ mph |
| E-K | Lavere nivåer | Gradvis lavere krav |

#### Opprykk-krav
- Minimum 4 av 7 golftester må være bestått
- 10 runder dokumentert
- Handicap-krav oppfylt

### 3.3 Testregistrering (Wizard-flyt)

```
┌─────────────────────────────────────────┐
│ STEG 1: Velg kategori                   │
├─────────────────────────────────────────┤
│ [Driving] [Jernspill] [Kortspill]       │
│ [Putting] [Fysisk]                      │
└─────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────┐
│ STEG 2: Velg tester                     │
├─────────────────────────────────────────┤
│ ☑ Driver Distance                       │
│ ☑ Driver Speed                          │
│ ☐ Smash Factor                          │
└─────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────┐
│ STEG 3: Registrer verdier               │
├─────────────────────────────────────────┤
│ Driver Distance: [275] m                │
│ Driver Speed: [118] mph                 │
└─────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────┐
│ STEG 4: Notater & Lagre                 │
├─────────────────────────────────────────┤
│ [Notater...]                            │
│ [LAGRE RESULTATER]                      │
└─────────────────────────────────────────┘
```

### 3.4 Resultat-beregning

| Beregningstype | Når brukes | Formel |
|----------------|------------|--------|
| **Beste** | Distanse-tester | max(forsøk) |
| **Gjennomsnitt** | Presisjon-tester | sum/antall |
| **Beste 3** | Ved 5+ forsøk | avg(top 3) |
| **Prosent** | Suksessrate | suksess/totalt * 100 |

### 3.5 Statusvisning

| Status | Farge | Betydning |
|--------|-------|-----------|
| **Oppfylt** | 🟢 Grønn | Krav for nåværende kategori møtt |
| **Under krav** | 🔴 Rød | Ikke oppfylt for nåværende kategori |
| **Ikke testet** | ⚪ Grå | Ingen testdata |

### 3.6 Trendanalyse

```
Nåværende: 275m
Forrige: 268m
Endring: +7m (+2.6%)
Status: ↑ Forbedret
```

---

## 4. Statistikk & Strokes Gained

### 4.1 Statistikk Hub (`/statistikk`)

**Tab-navigasjon:**
| Tab | Innhold |
|-----|---------|
| Oversikt | Sammendrag av all statistikk |
| Strokes Gained | Detaljert SG-analyse |
| Benchmark | Sammenligning med proffene |
| Testresultater | Historikk og trender |
| Status & Mål | Fremgang og milepæler |

### 4.2 Strokes Gained-konseptet

**Definisjon:**
Strokes Gained (SG) måler hvor mange slag en spiller vinner eller taper sammenlignet med en referansespiller (Tour-gjennomsnitt eller elite).

```
SG = Forventet slag (referanse) - Faktisk slag

Positiv SG = Bedre enn referanse
Negativ SG = Dårligere enn referanse
```

### 4.3 SG-kategorier

| Kategori | Forkortelse | Beskrivelse |
|----------|-------------|-------------|
| **Off the Tee** | OTT | Driving/utslagsprestasjoner |
| **Approach** | APP | Innspill til green (50-200m) |
| **Around Green** | ARG | Kortspill (< 50m) |
| **Putting** | PUTT | Putting på green |
| **Total** | TOT | Sum av alle kategorier |

### 4.4 DataGolf-integrasjon

**API-endepunkter:**
```
GET /api/v1/datagolf/player-sg-summary
GET /api/v1/datagolf/pei-to-sg
POST /api/v1/datagolf/pei-to-sg/batch
POST /api/v1/datagolf/pei-to-sg/iup-test
```

**PEI til SG konvertering:**
```typescript
interface PeiToSgRequest {
  startDistance: number;  // meter
  pei: number;            // Performance Efficiency Index
  lie: 'fairway' | 'rough' | 'bunker' | 'green';
}
```

### 4.5 Benchmark-data

**Elite-referanser:**

| Nivå | Total SG | Approach | ARG | Putting | OTT |
|------|----------|----------|-----|---------|-----|
| **Top 10 PGA** | +2.45 | +0.85 | +0.38 | +0.42 | +0.80 |
| **Top 50** | +1.65 | +0.55 | +0.25 | +0.35 | +0.50 |
| **Tour Average** | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |

**Distanse-basert Approach-analyse:**
```
75-100m:
  - Fairway: SG +0.12, Prox 8.2m, GIR 72%
  - Rough: SG -0.08, Prox 11.5m, GIR 58%

150-175m:
  - Fairway: SG +0.05, Prox 12.4m, GIR 61%
  - Rough: SG -0.15, Prox 16.8m, GIR 45%
```

### 4.6 Fremgangsvisning

**Progress-indikatorer:**
```
┌─────────────────────────────────────────┐
│ FREMGANG MOT ELITE                      │
├─────────────────────────────────────────┤
│ Scratch     Tour Avg    Top 50    Top 10│
│    ↓           ↓          ↓         ↓   │
│ ───●─────────|──────────|─────────|─────│
│    Du: +0.35                            │
│    Gap til Top 50: -1.30                │
└─────────────────────────────────────────┘
```

### 4.7 Mål og milepæler

**Aktive mål:**
```typescript
interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'approach' | 'putting' | 'around_green' | 'general';
  targetValue: number;
  currentValue: number;
  deadline: Date;
  progress: number;  // 0-100%
}
```

**Milepæler:**
- ✅ Første test fullført
- ✅ Positiv total SG oppnådd
- ☐ 10 tester fullført
- ☐ Approach SG > 0
- ☐ Alle kategorier testet

---

## 5. Video-analyse

### 5.1 Videoer-oversikt (`/videos`)

| Funksjon | Beskrivelse |
|----------|-------------|
| **Opplasting** | Last opp swing-video via AWS S3 |
| **Organisering** | Kategorisering (driver, iron, pitch, etc.) |
| **Søk** | Finn etter dato, type, tags |
| **Deling** | Del med trener for feedback |

### 5.2 Annotasjonsverktøy

| Verktøy | Ikon | Bruk |
|---------|------|------|
| **Linje** | ─ | Markere svingebane |
| **Sirkel** | ○ | Fremheve områder |
| **Pil** | → | Vise bevegelsesretning |
| **Tekst** | A | Legge til notater |
| **Markør** | 📍 | Tidspunkt-markering |

### 5.3 Sammenligning (`/videos/compare`)

**Side-by-side visning:**
```
┌─────────────────┬─────────────────┐
│   VIDEO A       │   VIDEO B       │
│   (Før)         │   (Etter)       │
├─────────────────┼─────────────────┤
│   [▶ Play]      │   [▶ Play]      │
│   00:00 / 00:08 │   00:00 / 00:08 │
└─────────────────┴─────────────────┘
        [🔗 Synkroniser avspilling]
```

### 5.4 Fremgangstidslinje (`/videos/progress`)

Kronologisk visning av alle videoer med milepæler markert.

---

## 6. Gamification

### 6.1 Badge-kategorier

#### Streak Badges
| Badge | Krav | XP |
|-------|------|-----|
| 🔥 3-Day Streak | 3 dager på rad | 50 |
| 🔥 7-Day Streak | 7 dager på rad | 100 |
| 🔥 14-Day Streak | 14 dager på rad | 200 |
| 🔥 30-Day Streak | 30 dager på rad | 500 |
| 🔥 100-Day Streak | 100 dager på rad | 2000 |

#### Volum Badges
| Badge | Krav | XP |
|-------|------|-----|
| ⏱️ 10 Hours | 10 timer trening | 100 |
| ⏱️ 25 Hours | 25 timer trening | 250 |
| ⏱️ 50 Hours | 50 timer trening | 500 |
| ⏱️ 100 Hours | 100 timer trening | 1000 |
| ⏱️ 500 Hours | 500 timer trening | 5000 |

#### Forbedring Badges
| Badge | Krav | XP |
|-------|------|-----|
| 🎯 Personal Best | Ny PB på test | 100 |
| ⬆️ Category Up | Opprykk i kategori | 500 |
| 🏅 Test Master | Bestått alle tester | 1000 |
| 🚀 Double Up | 2x forbedring på test | 200 |

#### Deltakelse Badges
| Badge | Krav | XP |
|-------|------|-----|
| 🌟 First Session | Første økt | 25 |
| 📋 First Test | Første test | 50 |
| 🏆 First Tournament | Første turnering | 75 |
| 📹 Video Upload | Første video | 25 |
| ✅ Profile Complete | Komplett profil | 50 |

### 6.2 XP-system

| Handling | XP |
|----------|-----|
| Logg treningsøkt | 10 |
| Gjennomfør test | 25 |
| Forbedring på test | 50 |
| Badge opptjent | Varierer |
| Turnering fullført | 75 |
| Video lastet opp | 15 |
| Mål oppnådd | 100 |

### 6.3 Nivåsystem

| Nivå | Navn | XP Krav |
|------|------|---------|
| 1 | Rookie | 0 |
| 2 | Beginner | 500 |
| 3 | Intermediate | 2000 |
| 4 | Advanced | 5000 |
| 5 | Expert | 10000 |
| 6 | Master | 25000 |

### 6.4 Anti-Gaming Beskyttelse

| Beskyttelse | Beskrivelse |
|-------------|-------------|
| **Duplikat-sjekk** | Blokkerer identiske økter samme dag |
| **Rimelighetskontroll** | Flagger urealistiske verdier |
| **Tidsvalidering** | Minimum 5 min økt-varighet |
| **Frekvensgrense** | Maks 10 økter per dag |
| **Cooldown** | Minimum 30 min mellom samme testtype |

---

## Appendiks: Data-strukturer

### Session
```typescript
interface Session {
  id: string;
  playerId: string;
  type: SessionType;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  plannedDuration: number;
  actualDuration?: number;
  learningPhase: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  period: 'E' | 'G' | 'S' | 'T';
  intensity: number;
  focusArea?: string;
  blocks: Block[];
  evaluation?: SessionEvaluation;
  createdAt: Date;
  completedAt?: Date;
}
```

### TestResult
```typescript
interface TestResult {
  id: string;
  playerId: string;
  testId: string;
  value: number;
  unit: string;
  attempts?: number[];
  notes?: string;
  categoryAtTest: string;
  meetsRequirement: boolean;
  testedAt: Date;
}
```

### StrokesGainedData
```typescript
interface StrokesGainedData {
  hasData: boolean;
  isDemo: boolean;
  total: number;
  trend: number;
  percentile: number;
  byCategory: {
    approach: CategorySG;
    around_green: CategorySG;
    putting: CategorySG;
  };
  recentTests: TestEntry[];
  weeklyTrend: WeeklyTotal[];
}

interface CategorySG {
  value: number;
  tourAvg: number;
  pgaElite: number;
  testCount: number;
}
```

---

*Dokumentet gir dyptgående beskrivelser av kjernefunksjonene. Se FEATURE_OVERVIEW_2025.md for full funksjonsliste.*
