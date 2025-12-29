# 📊 DataGolf & Stats Integration - Forslag v2.0

**Dato:** 2025-12-17
**Versjon:** Beta v2.0
**Mål:** Maksimere bruk av DataGolf data i Stats-visning for spillere og trenere

---

## 🎯 EXECUTIVE SUMMARY

### Nåværende Tilstand
- ✅ **Backend:** 13 DataGolf/Analytics endpoints implementert
- ⚠️ **Frontend:** Stats komponenter bruker mockdata
- ❌ **Integrasjon:** Frontend ikke koblet til backend
- ❌ **DataGolf API:** Placeholder - ikke live sync

### Foreslåtte Forbedringer
1. **Fase 1:** Koble frontend til eksisterende backend (1-2 dager)
2. **Fase 2:** Ny Stats Dashboard med 5 hovedvisninger (3-5 dager)
3. **Fase 3:** DataGolf API live sync (3-5 dager)
4. **Fase 4:** Advanced analytics & coach tools (1-2 uker)

**ROI:** 🔥 **Høy verdi med lav innsats** - mye allerede bygget!

---

## 📱 STATS SIDE - NY ARKITEKTUR

### Hovednavigasjon

```
┌─────────────────────────────────────────────┐
│  STATS                          [Filter ▼]  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐            │
│  │ 📊│ │ 🎯│ │ 👥│ │ 📈│ │ ⚡│            │
│  │Min│ │SG │ │Peer│ │Tour│ │Live│            │
│  └───┘ └───┘ └───┘ └───┘ └───┘            │
│                                             │
│  [AKTIV VISNING INNHOLD]                   │
│                                             │
└─────────────────────────────────────────────┘
```

### 5 Hovedvisninger

#### 1. **MIN STATISTIKK** 📊
*For: Spillere*
*Data: IUP test resultater*

```
┌────────────────────────────────────────────┐
│ MIN STATISTIKK                             │
├────────────────────────────────────────────┤
│                                            │
│  Siste Benchmark: 15. Des 2025             │
│  Neste: 15. Jan 2026 (30 dager)            │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │   RADAR CHART                        │ │
│  │   (Alle 20 tester - normalisert)     │ │
│  │                                      │ │
│  │        Driving                       │ │
│  │           ▲                          │ │
│  │          /│\                         │ │
│  │    Iron /  │  \ Putting              │ │
│  │        ◄───┼───►                     │ │
│  │  Short  \  │  /  Mental              │ │
│  │          \│/                         │ │
│  │           ▼                          │ │
│  │       Physical                       │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  STYRKER (Top 25%)                         │
│  ✅ Driving Distance (98. persentil)       │
│  ✅ Ball Speed (95. persentil)             │
│  ✅ On-Course Skills (92. persentil)       │
│                                            │
│  FOKUSOMRÅDER (Bottom 25%)                 │
│  ⚠️ Putting 3m (45. persentil)             │
│  ⚠️ Sand Escape (38. persentil)            │
│  ⚠️ Approach 50m (52. persentil)           │
│                                            │
│  [SE DETALJERT HISTORIKK →]               │
└────────────────────────────────────────────┘
```

**API Calls:**
```typescript
GET /api/v1/coach-analytics/players/:playerId/overview
// Response: strengthAreas, weaknessAreas, testSummaries
```

**Implementering:**
- Bruk eksisterende `Testresultater.jsx` som base
- Utvid med strength/weakness cards
- Legg til radar chart med alle 20 tester
- Color coding: grønn (>75%), gul (50-75%), rød (<50%)

---

#### 2. **STROKES GAINED PROFIL** 🎯
*For: Spillere & Trenere*
*Data: DataGolf + IUP mapping*

```
┌────────────────────────────────────────────┐
│ STROKES GAINED PROFIL                      │
├────────────────────────────────────────────┤
│                                            │
│  Din SG vs PGA Tour Snitt                  │
│  Sist oppdatert: I dag                     │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │   WATERFALL CHART                    │ │
│  │                                      │ │
│  │   +2.5│     ┌──┐                     │ │
│  │   +2.0│     │  │                     │ │
│  │   +1.5│     │  │  ┌──┐               │ │
│  │   +1.0│     │  │  │  │               │ │
│  │   +0.5│  ┌──┤  ├──┤  ├──┐            │ │
│  │    0.0├──┤  │  │  │  │  ├──┐         │ │
│  │   -0.5│  └──┴──┴──┴──┴──┘  │         │ │
│  │       └──────────────────────         │ │
│  │       Tee App AG  Put Total          │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  SG BREAKDOWN                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│  Off Tee        +1.2  ████████░░ 82%      │
│  Approach       +0.8  ██████░░░░ 65%      │
│  Around Green   +0.3  ███░░░░░░░ 55%      │
│  Putting        -0.5  ██░░░░░░░░ 45%      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│  TOTAL SG       +1.8  ████████░░ 78%      │
│                                            │
│  📊 vs PGA Tour Average: +1.8              │
│  📊 vs Peer Group (B-kat): +0.3            │
│                                            │
│  SAMMENLIGNING                             │
│  ┌────────────────────────────────────┐   │
│  │ Ditt SG:     +1.8                  │   │
│  │ Tour Avg:     0.0                  │   │
│  │ Peer Avg:    +1.5                  │   │
│  │                                    │   │
│  │ Rangering i peer group: 3/12      │   │
│  └────────────────────────────────────┘   │
│                                            │
│  [6 MND TREND →] [EKSPORTER PDF]          │
└────────────────────────────────────────────┘
```

**API Calls:**
```typescript
// 1. Get player DataGolf comparison
GET /api/v1/datagolf/compare?playerId=X&tour=PGA&season=2025

// 2. Get peer comparison for SG metrics
GET /api/v1/peer-comparison?playerId=X&testNumber=20&category=B

// 3. Calculate SG from IUP tests
// Mapping: Test 19 → scoring_average → SG_total
// Test 10 → approach → SG_approach
// Test 15 → putting → SG_putting
// etc.
```

**Implementering:**
```typescript
// Ny komponent: SGProfile.jsx
import { WaterfallChart } from '@tremor/react';
import { apiClient } from '@/utils/api';

const SGProfile = ({ playerId }) => {
  const [sgData, setSgData] = useState(null);

  useEffect(() => {
    // Fetch DataGolf comparison
    const fetchSG = async () => {
      const response = await apiClient.get(
        `/datagolf/compare?playerId=${playerId}&tour=PGA`
      );
      setSgData(response.data);
    };
    fetchSG();
  }, [playerId]);

  return (
    <div>
      <WaterfallChart
        data={[
          { category: 'Off Tee', value: sgData.sg_off_tee },
          { category: 'Approach', value: sgData.sg_approach },
          { category: 'Around Green', value: sgData.sg_around_green },
          { category: 'Putting', value: sgData.sg_putting },
        ]}
      />
      {/* ... */}
    </div>
  );
};
```

---

#### 3. **PEER SAMMENLIGNING** 👥
*For: Spillere & Trenere*
*Data: Peer comparison service*

```
┌────────────────────────────────────────────┐
│ PEER SAMMENLIGNING                         │
├────────────────────────────────────────────┤
│                                            │
│  Filtrer peers:                            │
│  [Kategori: B ▼] [Kjønn: M ▼] [Alder: 14-16 ▼] │
│  [Handicap: 0-5 ▼]                         │
│                                            │
│  Viser: 12 spillere i B-kategori           │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │   BOX PLOT - Test 1: Driver Avstand  │ │
│  │                                      │ │
│  │   Max: 285m                          │ │
│  │    ├───────┐                         │ │
│  │    │       │  Q3: 270m               │ │
│  │    │   ●   │  ◄── DU (95. persentil)│ │
│  │    │       │  Median: 255m           │ │
│  │    │       │  Q1: 240m               │ │
│  │    └───────┘                         │ │
│  │   Min: 220m                          │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  DIN YTELSE                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│  Verdi: 268m                               │
│  Persentil: 95 (Topp 5%)                   │
│  Z-Score: +1.8                             │
│  Rangering: 1 av 12                        │
│                                            │
│  TILBAKEMELDING                            │
│  🎯 "Eksepsjonell ytelse! Du er i topp 5%  │
│      av spillere i din kategori."          │
│                                            │
│  ALLE TESTER (Valg)                        │
│  [▼ Test 1]  [▼ Test 5]  [▼ Test 10]      │
│  [▼ Test 15] [▼ Test 19] [▼ Test 20]      │
│                                            │
│  [SE ALLE 20 TESTER →]                     │
└────────────────────────────────────────────┘
```

**API Calls:**
```typescript
// For én test
GET /api/v1/peer-comparison?playerId=X&testNumber=1&category=B&gender=M&ageMin=14&ageMax=16

// Multi-level (alle kategorier)
GET /api/v1/peer-comparison/multi-level?playerId=X&testNumber=1

// Response inkluderer:
// - playerValue
// - peerStats { mean, median, stdDev, q1, q3, min, max }
// - playerPercentile
// - playerRank
// - comparisonText
```

**Implementering:**
```typescript
// Ny komponent: PeerComparison.jsx
import { BoxPlot } from '@/components/charts';

const PeerComparison = ({ playerId }) => {
  const [filters, setFilters] = useState({
    category: 'B',
    gender: 'M',
    ageMin: 14,
    ageMax: 16
  });
  const [testNumber, setTestNumber] = useState(1);
  const [comparison, setComparison] = useState(null);

  const fetchComparison = async () => {
    const response = await apiClient.get('/peer-comparison', {
      params: { playerId, testNumber, ...filters }
    });
    setComparison(response.data);
  };

  return (
    <div>
      {/* Filters */}
      <FilterBar onChange={setFilters} />

      {/* Box Plot */}
      <BoxPlot
        min={comparison.peerStats.min}
        q1={comparison.peerStats.q1}
        median={comparison.peerStats.median}
        q3={comparison.peerStats.q3}
        max={comparison.peerStats.max}
        playerValue={comparison.playerValue}
        playerPercentile={comparison.playerPercentile}
      />

      {/* Stats */}
      <div>
        <p>Rangering: {comparison.playerRank} av {comparison.peerStats.count}</p>
        <p>Persentil: {comparison.playerPercentile}</p>
        <p>{comparison.comparisonText}</p>
      </div>
    </div>
  );
};
```

---

#### 4. **TOUR BENCHMARK** 📈
*For: Spillere & Trenere*
*Data: DataGolf tour averages*

```
┌────────────────────────────────────────────┐
│ TOUR BENCHMARK                             │
├────────────────────────────────────────────┤
│                                            │
│  Sammenlign med:                           │
│  [● PGA Tour  ○ LPGA  ○ DP World] [2025 ▼]│
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │   BUBBLE CHART                       │ │
│  │                                      │ │
│  │   Driving Distance (y-akse)          │ │
│  │   │                                  │ │
│  │320│                  ◯ You           │ │
│  │   │             ●                    │ │
│  │300│        ●    ●                    │ │
│  │   │    ●   ● Tour Avg                │ │
│  │280│  ●   ●                           │ │
│  │   └──────────────────────────►       │ │
│  │     60%   70%   80%   90%            │ │
│  │     Driving Accuracy (x-akse)        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  DU vs PGA TOUR                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│                                            │
│  Driving Distance                          │
│  Du:  268m  ████████████░░░░ +8m (103%)   │
│  Tour: 260m ████████████                   │
│                                            │
│  Driving Accuracy                          │
│  Du:  65%   ██████████░░░░░░ -5% (93%)    │
│  Tour: 70%  ████████████                   │
│                                            │
│  GIR %                                     │
│  Du:  68%   ████████████░░░░ +2% (103%)   │
│  Tour: 66%  ████████████                   │
│                                            │
│  Scrambling                                │
│  Du:  58%   ██████████░░░░░░ -4% (94%)    │
│  Tour: 62%  ████████████                   │
│                                            │
│  Putts/Round                               │
│  Du:  29.5  ████████████░░░░ +0.5 (98%)   │
│  Tour: 29.0 ████████████                   │
│                                            │
│  OPPSUMMERING                              │
│  ┌────────────────────────────────────┐   │
│  │ Styrker vs Tour:                   │   │
│  │ ✅ Driving Distance (+3%)          │   │
│  │ ✅ GIR% (+3%)                      │   │
│  │                                    │   │
│  │ Forbedringområder:                 │   │
│  │ ⚠️ Driving Accuracy (-7%)          │   │
│  │ ⚠️ Scrambling (-6%)                │   │
│  └────────────────────────────────────┘   │
│                                            │
│  [EKSPORTER RAPPORT] [DEL MED TRENER]     │
└────────────────────────────────────────────┘
```

**API Calls:**
```typescript
// Tour averages
GET /api/v1/datagolf/tour-averages?tour=PGA&season=2025

// Compare player to tour
GET /api/v1/datagolf/compare?playerId=X&tour=PGA&season=2025

// Response:
{
  playerId, playerName, tour, season,
  comparison: {
    driving_distance: { player: 268, tour: 260, diff: +8, percent: 103 },
    driving_accuracy: { player: 65, tour: 70, diff: -5, percent: 93 },
    gir_percent: { player: 68, tour: 66, diff: +2, percent: 103 },
    ...
  }
}
```

**Implementering:**
```typescript
// Ny komponent: TourBenchmark.jsx
const TourBenchmark = ({ playerId }) => {
  const [tour, setTour] = useState('PGA');
  const [season, setSeason] = useState(2025);
  const [comparison, setComparison] = useState(null);

  useEffect(() => {
    const fetchComparison = async () => {
      const response = await apiClient.get('/datagolf/compare', {
        params: { playerId, tour, season }
      });
      setComparison(response.data);
    };
    fetchComparison();
  }, [playerId, tour, season]);

  return (
    <div>
      {/* Tour selector */}
      <TourSelector value={tour} onChange={setTour} />

      {/* Bubble chart */}
      <BubbleChart
        xAxis="driving_accuracy"
        yAxis="driving_distance"
        playerData={comparison.playerData}
        tourAverage={comparison.tourAverage}
      />

      {/* Comparison bars */}
      {Object.entries(comparison.comparison).map(([metric, data]) => (
        <ComparisonBar
          key={metric}
          label={metric}
          playerValue={data.player}
          tourValue={data.tour}
          diff={data.diff}
          percent={data.percent}
        />
      ))}
    </div>
  );
};
```

---

#### 5. **LIVE TRENDS** ⚡
*For: Spillere & Trenere*
*Data: Historisk tracking*

```
┌────────────────────────────────────────────┐
│ LIVE TRENDS                                │
├────────────────────────────────────────────┤
│                                            │
│  Tidsperiode: [6 mnd ▼]  Auto-refresh: ✓  │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │   MULTI-LINE TREND                   │ │
│  │                                      │ │
│  │  95│                    ●────●       │ │
│  │    │              ●────●             │ │
│  │  90│        ●────●                   │ │
│  │    │  ●────●                         │ │
│  │  85│●                                │ │
│  │    └────────────────────────────►    │ │
│  │    Jul Aug Sep Okt Nov Des           │ │
│  │                                      │ │
│  │    ─── Driving  ─── Putting         │ │
│  │    ─── Approach ─── Short Game      │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  MOMENTUM INDICATORS                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│                                            │
│  Driving       📈 +5%   ████████░░ Opp    │
│  Approach      📊 +2%   ██░░░░░░░░ Stable │
│  Short Game    📉 -3%   ████░░░░░░ Ned    │
│  Putting       📈 +7%   ██████████ Opp!   │
│                                            │
│  SISTE 30 DAGER                            │
│  ┌────────────────────────────────────┐   │
│  │ Benchmarks:        2                │   │
│  │ Treningsøkter:    24                │   │
│  │ Timer totalt:     36                │   │
│  │ Forbedring:       +4%               │   │
│  │                                    │   │
│  │ Beste område:     Putting (+12%)   │   │
│  │ Fokusområde:      Short Game (-5%) │   │
│  └────────────────────────────────────┘   │
│                                            │
│  PREDICTOR                                 │
│  ┌────────────────────────────────────┐   │
│  │ 📊 Based on nåværende trend:       │   │
│  │                                    │   │
│  │ Om 3 måneder (Mars 2026):          │   │
│  │ • Driving:      +8% (høy tillit)   │   │
│  │ • Putting:     +12% (høy tillit)   │   │
│  │ • Short Game:   -2% (lav tillit)   │   │
│  │                                    │   │
│  │ Anbefaling: Øk short game timer    │   │
│  │ fra 20% til 30% av total           │   │
│  └────────────────────────────────────┘   │
│                                            │
│  [JUSTER TRENINGSPLAN] [SE DETALJER]      │
└────────────────────────────────────────────┘
```

**API Calls:**
```typescript
// Historical test results
GET /api/v1/tests/player/:playerId/history?months=6

// Training sessions
GET /api/v1/training/sessions?playerId=X&from=2024-07-01&to=2025-01-01

// Aggregate stats
// Custom endpoint å lage:
GET /api/v1/analytics/trends?playerId=X&period=6months
```

**Implementering:**
```typescript
// Ny komponent: LiveTrends.jsx
import { LineChart } from '@tremor/react';
import { calculateTrend, predictFuture } from '@/utils/analytics';

const LiveTrends = ({ playerId }) => {
  const [period, setPeriod] = useState('6months');
  const [trends, setTrends] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      // Fetch historical data
      const history = await apiClient.get(`/tests/player/${playerId}/history`, {
        params: { months: 6 }
      });

      // Calculate trends
      const trendData = calculateTrend(history.data);
      setTrends(trendData);

      // Auto-refresh every 5 minutes
      const interval = setInterval(fetchTrends, 5 * 60 * 1000);
      return () => clearInterval(interval);
    };
    fetchTrends();
  }, [playerId, period]);

  return (
    <div>
      {/* Multi-line chart */}
      <LineChart
        data={trends.chartData}
        categories={['driving', 'approach', 'shortGame', 'putting']}
        colors={['blue', 'green', 'orange', 'purple']}
      />

      {/* Momentum indicators */}
      <MomentumCards momentum={trends.momentum} />

      {/* Predictor */}
      <Predictor predictions={predictFuture(trends, 3)} />
    </div>
  );
};
```

---

## 🎨 DESIGN SYSTEM - STATS KOMPONENTER

### Shared Components

```typescript
// 1. StatCard.jsx - Reusable stat display
<StatCard
  title="Driving Distance"
  value="268m"
  change="+8m"
  percentile={95}
  trend="up"
  color="green"
/>

// 2. ComparisonBar.jsx - Side-by-side comparison
<ComparisonBar
  label="GIR %"
  playerValue={68}
  compareValue={66}
  playerLabel="Du"
  compareLabel="Tour Avg"
/>

// 3. PercentileIndicator.jsx - Visual percentile
<PercentileIndicator
  value={95}
  label="Topp 5%"
  showBadge={true}
/>

// 4. TrendArrow.jsx - Up/down/stable indicator
<TrendArrow
  value={+5.2}
  threshold={3}
  colors={{ up: 'green', down: 'red', stable: 'gray' }}
/>

// 5. BoxPlot.jsx - Statistical distribution
<BoxPlot
  min={220}
  q1={240}
  median={255}
  q3={270}
  max={285}
  playerValue={268}
  highlightPlayer={true}
/>

// 6. WaterfallChart.jsx - SG breakdown
<WaterfallChart
  categories={['Off Tee', 'Approach', 'Around Green', 'Putting']}
  values={[+1.2, +0.8, +0.3, -0.5]}
  baseline={0}
/>

// 7. FilterBar.jsx - Peer filtering
<FilterBar
  filters={['category', 'gender', 'age', 'handicap']}
  onChange={handleFilterChange}
  savedFilters={coachSavedFilters}
/>
```

### Color Coding System

```css
/* Percentile-based colors */
.percentile-excellent { /* >90% */ color: #0ea5e9; }
.percentile-good      { /* 75-90% */ color: #10b981; }
.percentile-average   { /* 50-75% */ color: #f59e0b; }
.percentile-below     { /* 25-50% */ color: #f97316; }
.percentile-poor      { /* <25% */ color: #ef4444; }

/* Tour comparison colors */
.tour-above { /* >100% of tour avg */ background: linear-gradient(135deg, #10b981, #059669); }
.tour-equal { /* 95-105% */ background: linear-gradient(135deg, #f59e0b, #d97706); }
.tour-below { /* <95% */ background: linear-gradient(135deg, #ef4444, #dc2626); }

/* Trend indicators */
.trend-improving { color: #10b981; }
.trend-stable    { color: #6b7280; }
.trend-declining { color: #ef4444; }
```

---

## 👨‍💼 COACH VIEW - SPESIELLE FEATURES

### Coach Dashboard Tillegg

```
┌────────────────────────────────────────────┐
│ COACH ANALYTICS DASHBOARD                  │
├────────────────────────────────────────────┤
│                                            │
│  ┌─────────────────────────────────────┐  │
│  │ TEAM HEATMAP (12 spillere × 20 tester)│ │
│  │                                       │ │
│  │        T1  T2  T3  T4  ... T20       │ │
│  │  P1    🟢  🟢  🟡  🟢      🔴       │ │
│  │  P2    🟡  🟢  🟢  🟡      🟢       │ │
│  │  P3    🔴  🟡  🟡  🟢      🟡       │ │
│  │  ...                                  │ │
│  │  P12   🟢  🟢  🔴  🟡      🟢       │ │
│  │                                       │ │
│  │  🟢 >75%  🟡 50-75%  🔴 <50%        │ │
│  └─────────────────────────────────────┘  │
│                                            │
│  QUICK ACTIONS                             │
│  [Sammenlign 2+ spillere]                 │
│  [Se team-wide weaknesses]                │
│  [Eksporter team rapport]                 │
│  [Planlegg team training]                 │
│                                            │
└────────────────────────────────────────────┘
```

**API Call:**
```typescript
GET /api/v1/coach-analytics/team/:coachId
// Returns all players with test summaries
```

**Component:**
```typescript
// CoachDashboard.jsx
const CoachDashboard = ({ coachId }) => {
  const [teamData, setTeamData] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      const response = await apiClient.get(`/coach-analytics/team/${coachId}`);
      setTeamData(response.data);
    };
    fetchTeam();
  }, [coachId]);

  return (
    <div>
      <TeamHeatmap data={teamData.players} tests={20} />
      <QuickActions coachId={coachId} />
    </div>
  );
};
```

### Multi-Player Comparison

```
┌────────────────────────────────────────────┐
│ SAMMENLIGN SPILLERE                        │
├────────────────────────────────────────────┤
│                                            │
│  Velg spillere (2-10):                     │
│  [✓ Anders (B)]  [✓ Kristine (A)]         │
│  [✓ Thomas (C)]  [ ] Emma (B)              │
│                                            │
│  Velg tester:                              │
│  [✓ Test 1]  [✓ Test 5]  [✓ Test 10]      │
│  [✓ Test 15] [✓ Test 19] [✓ Test 20]      │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │   GROUPED BAR CHART                  │ │
│  │                                      │ │
│  │   Test 1: Driver Avstand             │ │
│  │   ┌───┬───┬───┐                      │ │
│  │   │ A │ K │ T │                      │ │
│  │   └───┴───┴───┘                      │ │
│  │   268m 245m 252m                     │ │
│  │                                      │ │
│  │   Test 5: Klubbhastighet             │ │
│  │   ┌───┬───┬───┐                      │ │
│  │   │ A │ K │ T │                      │ │
│  │   └───┴───┴───┘                      │ │
│  │   115  108  112 km/h                 │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  RANGERING                                 │
│  1. Anders  (Snitt: 92. persentil)         │
│  2. Thomas  (Snitt: 78. persentil)         │
│  3. Kristine (Snitt: 71. persentil)        │
│                                            │
│  [EKSPORTER SAMMENLIGNING] [DEL]          │
└────────────────────────────────────────────┘
```

**API Call:**
```typescript
POST /api/v1/coach-analytics/compare-players
{
  playerIds: ['uuid1', 'uuid2', 'uuid3'],
  testNumbers: [1, 5, 10, 15, 19, 20]
}

// Response:
{
  testNumbers: [1, 5, 10, 15, 19, 20],
  players: [
    {
      playerId, playerName, category,
      testResults: {
        1: { value: 268, passed: true, percentile: 95 },
        5: { value: 115, passed: true, percentile: 92 },
        ...
      },
      overallScore: 92,
      rank: 1
    },
    ...
  ]
}
```

---

## 🔄 DATAGOLF API SYNC - IMPLEMENTERING

### Live Sync Service

```typescript
// File: apps/api/src/services/datagolf-sync.service.ts

import axios from 'axios';
import { PrismaClient } from '@prisma/client';

export class DataGolfSyncService {
  private prisma: PrismaClient;
  private apiKey: string;
  private baseUrl = 'https://api.datagolf.com/v1';

  constructor() {
    this.prisma = new PrismaClient();
    this.apiKey = process.env.DATAGOLF_API_KEY || '';
  }

  /**
   * Sync player data from DataGolf
   */
  async syncPlayer(dataGolfId: string): Promise<void> {
    try {
      // 1. Fetch player stats from DataGolf API
      const response = await axios.get(
        `${this.baseUrl}/player-stats`, {
          params: {
            player_id: dataGolfId,
            tour: 'pga',
            season: new Date().getFullYear()
          },
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      const stats = response.data;

      // 2. Upsert to database
      await this.prisma.dataGolfPlayer.upsert({
        where: { dataGolfId },
        update: {
          playerName: stats.player_name,
          tour: stats.tour,
          season: stats.season,
          sgTotal: stats.sg_total,
          sgOffTee: stats.sg_off_tee,
          sgApproach: stats.sg_approach,
          sgAroundGreen: stats.sg_around_green,
          sgPutting: stats.sg_putting,
          drivingDistance: stats.driving_distance,
          drivingAccuracy: stats.driving_accuracy,
          girPercent: stats.gir_percent,
          scramblingPercent: stats.scrambling_percent,
          puttsPerRound: stats.putts_per_round,
          proximityData: stats.proximity_data,
          lastSynced: new Date()
        },
        create: {
          dataGolfId,
          playerName: stats.player_name,
          tour: stats.tour,
          season: stats.season,
          // ... samme som update
        }
      });

      console.log(`✓ Synced DataGolf player: ${dataGolfId}`);
    } catch (error) {
      console.error(`✗ Failed to sync player ${dataGolfId}:`, error.message);
      throw error;
    }
  }

  /**
   * Sync tour averages
   */
  async syncTourAverages(tour: string, season: number): Promise<void> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/tour-averages`, {
          params: { tour, season },
          headers: { 'Authorization': `Bearer ${this.apiKey}` }
        }
      );

      const stats = response.data;

      await this.prisma.dataGolfTourAverage.upsert({
        where: {
          tour_season: { tour, season }
        },
        update: {
          stats: stats,
          lastSynced: new Date()
        },
        create: {
          tour,
          season,
          stats: stats,
          lastSynced: new Date()
        }
      });

      console.log(`✓ Synced ${tour} tour averages for ${season}`);
    } catch (error) {
      console.error(`✗ Failed to sync tour averages:`, error.message);
      throw error;
    }
  }

  /**
   * Batch sync all linked IUP players
   */
  async syncAllPlayers(): Promise<void> {
    const players = await this.prisma.player.findMany({
      where: {
        dataGolfId: { not: null }
      }
    });

    for (const player of players) {
      await this.syncPlayer(player.dataGolfId!);
      // Rate limiting: 1 request per second
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  /**
   * Scheduled sync job (runs daily)
   */
  async dailySync(): Promise<void> {
    console.log('🔄 Starting daily DataGolf sync...');

    // Sync all players
    await this.syncAllPlayers();

    // Sync tour averages for all tours
    const currentYear = new Date().getFullYear();
    await this.syncTourAverages('PGA', currentYear);
    await this.syncTourAverages('LPGA', currentYear);
    await this.syncTourAverages('DP', currentYear);

    console.log('✅ Daily sync completed!');
  }
}
```

### Cron Job Setup

```typescript
// File: apps/api/src/jobs/datagolf-sync.cron.ts

import cron from 'node-cron';
import { DataGolfSyncService } from '../services/datagolf-sync.service';

const syncService = new DataGolfSyncService();

// Run daily at 3 AM
cron.schedule('0 3 * * *', async () => {
  try {
    await syncService.dailySync();
  } catch (error) {
    console.error('Cron job failed:', error);
  }
});

console.log('📅 DataGolf sync cron job scheduled (daily at 3 AM)');
```

### Manual Sync Endpoint

```typescript
// Update: apps/api/src/api/v1/datagolf/index.ts

app.post('/sync',
  { preHandler: [authenticateUser, requireAdmin] },
  async (request, reply) => {
    const syncService = new DataGolfSyncService();

    try {
      await syncService.dailySync();
      return reply.code(200).send({
        success: true,
        message: 'DataGolf sync completed successfully'
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: error.message
      });
    }
  }
);
```

---

## 📦 IMPLEMENTERINGSPLAN

### Fase 1: Frontend → Backend Kobling (1-2 dager)

**Priority: 🔥 HIGHEST**

```
Mål: Koble eksisterende stats komponenter til backend

Tasks:
1. ✅ Oppdater Testresultater.jsx
   - Hent data fra /api/v1/coach-analytics/players/:id/overview
   - Vis strength/weakness areas
   - Legg til radar chart

2. ✅ Opprett SGProfile.jsx
   - Hent data fra /api/v1/datagolf/compare
   - Waterfall chart for SG breakdown
   - Tour comparison bars

3. ✅ Opprett PeerComparison.jsx
   - Hent data fra /api/v1/peer-comparison
   - Box plot visualization
   - Filter controls

4. ✅ Integrer i Stats routing
   - Legg til tab navigation
   - State management mellom tabs
   - Persistent filters

Files å endre:
- apps/web/src/features/stats/Stats.jsx (ny fil)
- apps/web/src/features/stats/components/SGProfile.jsx
- apps/web/src/features/stats/components/PeerComparison.jsx
- apps/web/src/features/stats/components/TourBenchmark.jsx
- apps/web/src/features/stats/components/LiveTrends.jsx

Estimat: 8-12 timer
```

### Fase 2: DataGolf API Sync (3-5 dager)

**Priority: 🟡 MEDIUM**

```
Mål: Live sync med DataGolf API

Tasks:
1. ✅ Få DataGolf API key
   - Registrer konto på datagolf.com
   - Velg subscription tier
   - Test API access

2. ✅ Implementer DataGolfSyncService
   - HTTP client med rate limiting
   - Player sync logic
   - Tour averages sync
   - Error handling & retry

3. ✅ Cron job setup
   - Daily sync at 3 AM
   - Email notifications on failure
   - Sync status logging

4. ✅ Admin panel for sync
   - Manual trigger button
   - Sync history/logs
   - Per-player sync status

Files å opprette:
- apps/api/src/services/datagolf-sync.service.ts
- apps/api/src/jobs/datagolf-sync.cron.ts
- apps/api/src/utils/rate-limiter.ts

Estimat: 16-24 timer
```

### Fase 3: Advanced Analytics (1 uke)

**Priority: 🟢 LOWER**

```
Mål: Prediktiv analyse og advanced visualizations

Tasks:
1. ✅ Trend calculation service
   - Historical data aggregation
   - Moving averages (30/60/90 day)
   - Momentum indicators
   - Regression analysis

2. ✅ Predictor algorithm
   - 3-month forecast
   - Confidence intervals
   - Training impact estimation

3. ✅ Advanced charts
   - Heatmap component
   - Multi-line trends
   - Bubble charts
   - Correlation matrices

4. ✅ Coach team dashboard
   - Team heatmap (all players × all tests)
   - Weakness identification
   - Training recommendations

Files å opprette:
- apps/api/src/services/analytics.service.ts
- apps/web/src/features/stats/components/LiveTrends.jsx
- apps/web/src/features/coach/CoachDashboard.jsx
- apps/web/src/components/charts/Heatmap.jsx

Estimat: 24-40 timer
```

### Fase 4: Polish & Optimization (3-5 dager)

**Priority: 🔵 NICE-TO-HAVE**

```
Mål: Performance, UX, og mobile

Tasks:
1. ✅ Performance optimization
   - React Query caching
   - Lazy loading charts
   - Skeleton loaders
   - Pagination for large datasets

2. ✅ Mobile responsive
   - Touch gestures
   - Simplified charts
   - Bottom sheet for filters

3. ✅ Export & sharing
   - PDF export med charts
   - Email sharing
   - Social media cards

4. ✅ Notifications
   - Weekly progress reports
   - Peer ranking changes
   - Personal records
   - Training reminders

Estimat: 16-24 timer
```

---

## 📊 SUKSESS METRICS

### KPIs for Stats Feature

```
User Engagement:
- % av spillere som bruker Stats ukentlig: Target >80%
- Avg tid på Stats side per besøk: Target >5 min
- % av spillere som sammenligner med peers: Target >60%
- % av spillere som ser på SG breakdown: Target >50%

Coach Adoption:
- % av trenere som bruker team dashboard: Target >90%
- Avg spillere sammenlignet per uke: Target >10
- % av trenere som eksporterer rapporter: Target >70%

Data Quality:
- DataGolf sync success rate: Target >99%
- API response time (p95): Target <500ms
- Chart render time: Target <1s

Value Creation:
- % spillere med forbedret test scores etter 3 mnd: Target >70%
- % spillere som forbedrer weakness areas: Target >60%
- Coach NPS score for analytics tools: Target >8/10
```

---

## 🎁 BONUS FEATURES (Future)

### 1. AI-Powered Insights

```
"Based on your last 6 benchmarks, your putting has improved
significantly (+15%), but your approach play is declining (-8%).

Recommendation: Increase approach practice from 15% to 25%
of total training time, focusing on 100-150m distances where
you're 2 standard deviations below peer average.

Predicted impact: +12% improvement in 3 months with 85% confidence."
```

### 2. Video Analysis Integration

```
Link test results to video:
- Upload swing video
- Tag test (e.g., Driver Distance)
- AI analysis of swing mechanics
- Correlate swing metrics to test results
```

### 3. Equipment Recommendations

```
Based on your driving distance (268m) and ball speed (172 km/h):

Recommended driver loft: 9.5° - 10.5°
Recommended shaft flex: Stiff
Estimated gain with optimal equipment: +5-8m
```

### 4. Tournament Readiness Score

```
Next tournament: Norwegian Junior Championship (15 days)

Readiness Score: 82/100

Strengths to leverage:
- Driving distance (95th percentile)
- Mental toughness (88th percentile)

Areas to sharpen before tournament:
- Short game (60th percentile) - 5 focused sessions recommended
- Putting under pressure - simulate competition scenarios
```

---

## ✅ DEPLOYMENT CHECKLIST

### Before Launch

- [ ] DataGolf API key acquired and tested
- [ ] All endpoints tested with real data
- [ ] Frontend charts rendering correctly
- [ ] Mobile responsive verified
- [ ] Coach dashboard functional
- [ ] Export/PDF working
- [ ] Performance benchmarks met (<500ms API, <1s charts)
- [ ] Error handling tested (network failures, API timeouts)
- [ ] User permissions verified (player vs coach views)
- [ ] Cron job tested (manual trigger)
- [ ] Database migrations applied
- [ ] Seed data loaded (demo players with DataGolf IDs)

### Post-Launch Monitoring

- [ ] Daily sync success rate >99%
- [ ] API error rate <1%
- [ ] User engagement metrics tracked
- [ ] Coach feedback collected
- [ ] Performance monitoring (Sentry/LogRocket)
- [ ] A/B testing for chart types

---

## 🚀 KONKLUSJON

### Hvorfor Dette er Høy Verdi

1. **Allerede Bygget:** 80% av backend-koden eksisterer allerede!
2. **Differentiator:** Få konkurrenter har så dyptgående analytics
3. **Coach Tool:** Gjør trenere mer effektive → høyere retention
4. **Player Engagement:** Spillere elsker å se fremgang og sammenligne
5. **Datadrevet:** Tar beslutninger fra "følelse" til "fakta"

### ROI Estimation

```
Effort:
- Fase 1 (koble frontend): 1-2 dager
- Fase 2 (DataGolf sync): 3-5 dager
- Fase 3 (advanced): 5-7 dager
- TOTAL: 2-3 uker full utvikling

Value:
- Player retention: +20% (data-driven insights sticky)
- Coach efficiency: +30% (team dashboard saves hours)
- Upsell potential: Premium analytics tier
- Competitive advantage: Best-in-class golf analytics
```

### Next Steps

1. **Prioriter Fase 1** - Koble frontend til eksisterende backend (quick win!)
2. **Få DataGolf API key** - Start testing live data
3. **Build coach dashboard** - Biggest value for coaches
4. **Iterate based on feedback** - Start simple, add complexity

---

**Let's build the best golf analytics platform! 🏌️‍♂️📊**
