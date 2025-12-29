# 🚀 FASE 1: Frontend → Backend Kobling - Implementeringsguide

**Estimat:** 1-2 dager (8-12 timer)
**Priority:** 🔥 HIGHEST
**Mål:** Koble Stats-siden til eksisterende backend endpoints

---

## 📋 OVERSIKT

Vi har allerede:
- ✅ 13 backend endpoints (DataGolf + Analytics)
- ✅ Stats komponenter med mockdata
- ✅ Type definitions
- ✅ API client setup

Vi trenger:
- ⚡ Koble frontend til backend
- ⚡ Erstatte mockdata med real data
- ⚡ Lage ny Stats hovedside med 5 tabs

---

## 🗂️ FILSTRUKTUR (NY)

```
apps/web/src/features/stats/
├── Stats.jsx                      # 🆕 Hovedside med tabs
├── components/
│   ├── MinStatistikk.jsx          # ✏️ Forbedre eksisterende
│   ├── SGProfile.jsx              # 🆕 Strokes Gained profil
│   ├── PeerComparison.jsx         # 🆕 Peer sammenligning
│   ├── TourBenchmark.jsx          # 🆕 Tour sammenligning
│   ├── LiveTrends.jsx             # 🆕 Historiske trender
│   └── shared/
│       ├── StatCard.jsx           # 🆕 Reusable stat card
│       ├── ComparisonBar.jsx      # 🆕 Side-by-side bars
│       ├── PercentileIndicator.jsx # 🆕 Percentile badge
│       ├── TrendArrow.jsx         # 🆕 Up/down/stable
│       ├── BoxPlot.jsx            # 🆕 Statistical distribution
│       ├── WaterfallChart.jsx     # 🆕 SG waterfall
│       └── FilterBar.jsx          # 🆕 Peer filters
└── hooks/
    ├── usePlayerStats.js          # 🆕 Fetch player overview
    ├── usePeerComparison.js       # 🆕 Fetch peer comparison
    ├── useDataGolfComparison.js   # 🆕 Fetch DataGolf data
    └── useTrends.js               # 🆕 Fetch historical trends
```

---

## 📝 STEG-FOR-STEG IMPLEMENTERING

### Steg 1: Opprett Hovedside med Tabs

**File:** `apps/web/src/features/stats/Stats.jsx`

```jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ChartBarIcon,
  TrophyIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import MinStatistikk from './components/MinStatistikk';
import SGProfile from './components/SGProfile';
import PeerComparison from './components/PeerComparison';
import TourBenchmark from './components/TourBenchmark';
import LiveTrends from './components/LiveTrends';

const Stats = () => {
  const { playerId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      name: 'Min Statistikk',
      icon: ChartBarIcon,
      component: MinStatistikk
    },
    {
      id: 'sg-profile',
      name: 'SG Profil',
      icon: TrophyIcon,
      component: SGProfile
    },
    {
      id: 'peer',
      name: 'Peer',
      icon: UsersIcon,
      component: PeerComparison
    },
    {
      id: 'tour',
      name: 'Tour',
      icon: ArrowTrendingUpIcon,
      component: TourBenchmark
    },
    {
      id: 'trends',
      name: 'Trends',
      icon: BoltIcon,
      component: LiveTrends
    },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Statistikk
            </h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon
                    className={`
                      -ml-0.5 mr-2 h-5 w-5
                      ${activeTab === tab.id
                        ? 'text-blue-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                      }
                    `}
                  />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {ActiveComponent && <ActiveComponent playerId={playerId} />}
        </div>
      </div>
    </div>
  );
};

export default Stats;
```

---

### Steg 2: Custom Hooks for Data Fetching

#### 2.1: usePlayerStats Hook

**File:** `apps/web/src/features/stats/hooks/usePlayerStats.js`

```javascript
import { useState, useEffect } from 'react';
import api from '@/utils/api';

export const usePlayerStats = (playerId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!playerId) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(
          `/coach-analytics/players/${playerId}/overview`
        );

        setData(response.data);
      } catch (err) {
        console.error('Error fetching player stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [playerId]);

  return { data, loading, error };
};
```

#### 2.2: usePeerComparison Hook

**File:** `apps/web/src/features/stats/hooks/usePeerComparison.js`

```javascript
import { useState, useEffect } from 'react';
import api from '@/utils/api';

export const usePeerComparison = (playerId, testNumber, filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!playerId || !testNumber) return;

    const fetchComparison = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          playerId,
          testNumber,
          ...filters
        });

        const response = await api.get(
          `/peer-comparison?${params.toString()}`
        );

        setData(response.data);
      } catch (err) {
        console.error('Error fetching peer comparison:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [playerId, testNumber, JSON.stringify(filters)]);

  return { data, loading, error };
};
```

#### 2.3: useDataGolfComparison Hook

**File:** `apps/web/src/features/stats/hooks/useDataGolfComparison.js`

```javascript
import { useState, useEffect } from 'react';
import api from '@/utils/api';

export const useDataGolfComparison = (playerId, tour = 'PGA', season = new Date().getFullYear()) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!playerId) return;

    const fetchComparison = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/datagolf/compare', {
          params: { playerId, tour, season }
        });

        setData(response.data);
      } catch (err) {
        console.error('Error fetching DataGolf comparison:', err);
        setError(err.message);
        // Fall back to demo data if API fails
        setData(getDemoDataGolfData());
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [playerId, tour, season]);

  return { data, loading, error };
};

// Demo data fallback
const getDemoDataGolfData = () => ({
  sg_off_tee: 1.2,
  sg_approach: 0.8,
  sg_around_green: 0.3,
  sg_putting: -0.5,
  sg_total: 1.8,
  driving_distance: { player: 268, tour: 260, diff: 8, percent: 103 },
  driving_accuracy: { player: 65, tour: 70, diff: -5, percent: 93 },
  gir_percent: { player: 68, tour: 66, diff: 2, percent: 103 },
  scrambling_percent: { player: 58, tour: 62, diff: -4, percent: 94 },
  putts_per_round: { player: 29.5, tour: 29.0, diff: 0.5, percent: 98 }
});
```

---

### Steg 3: Shared Components

#### 3.1: StatCard Component

**File:** `apps/web/src/features/stats/components/shared/StatCard.jsx`

```jsx
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

const StatCard = ({
  title,
  value,
  change,
  percentile,
  trend = 'neutral',
  color = 'blue'
}) => {
  const trendColors = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  };

  const percentileColor =
    percentile >= 90 ? 'bg-blue-100 text-blue-800' :
    percentile >= 75 ? 'bg-green-100 text-green-800' :
    percentile >= 50 ? 'bg-yellow-100 text-yellow-800' :
    percentile >= 25 ? 'bg-orange-100 text-orange-800' :
    'bg-red-100 text-red-800';

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {value}
            </dd>
          </div>
          {percentile !== undefined && (
            <div className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium ${percentileColor}`}>
              {percentile}%
            </div>
          )}
        </div>
        {change !== undefined && (
          <div className={`mt-2 flex items-center text-sm ${trendColors[trend]}`}>
            {trend === 'up' && <ArrowUpIcon className="h-4 w-4 mr-1" />}
            {trend === 'down' && <ArrowDownIcon className="h-4 w-4 mr-1" />}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
```

#### 3.2: ComparisonBar Component

**File:** `apps/web/src/features/stats/components/shared/ComparisonBar.jsx`

```jsx
import React from 'react';

const ComparisonBar = ({
  label,
  playerValue,
  compareValue,
  playerLabel = 'Du',
  compareLabel = 'Snitt',
  unit = '',
  maxValue = null
}) => {
  const max = maxValue || Math.max(playerValue, compareValue) * 1.2;
  const playerPercent = (playerValue / max) * 100;
  const comparePercent = (compareValue / max) * 100;

  const diff = playerValue - compareValue;
  const diffPercent = ((playerValue / compareValue) * 100).toFixed(0);
  const isAbove = diff > 0;

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-semibold ${isAbove ? 'text-green-600' : 'text-red-600'}`}>
          {isAbove ? '+' : ''}{diff.toFixed(1)}{unit} ({diffPercent}%)
        </span>
      </div>

      {/* Player Bar */}
      <div className="space-y-1">
        <div className="flex items-center">
          <span className="text-xs text-gray-500 w-12">{playerLabel}</span>
          <div className="flex-1 bg-gray-200 rounded-full h-6 ml-2 relative">
            <div
              className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
              style={{ width: `${playerPercent}%` }}
            >
              <span className="text-xs font-medium text-white">
                {playerValue}{unit}
              </span>
            </div>
          </div>
        </div>

        {/* Compare Bar */}
        <div className="flex items-center">
          <span className="text-xs text-gray-500 w-12">{compareLabel}</span>
          <div className="flex-1 bg-gray-200 rounded-full h-6 ml-2 relative">
            <div
              className="bg-gray-400 h-6 rounded-full flex items-center justify-end pr-2"
              style={{ width: `${comparePercent}%` }}
            >
              <span className="text-xs font-medium text-white">
                {compareValue}{unit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBar;
```

#### 3.3: BoxPlot Component

**File:** `apps/web/src/features/stats/components/shared/BoxPlot.jsx`

```jsx
import React from 'react';

const BoxPlot = ({
  min,
  q1,
  median,
  q3,
  max,
  playerValue,
  playerPercentile,
  unit = ''
}) => {
  const range = max - min;
  const getPosition = (value) => ((value - min) / range) * 100;

  const q1Pos = getPosition(q1);
  const medianPos = getPosition(median);
  const q3Pos = getPosition(q3);
  const playerPos = getPosition(playerValue);

  return (
    <div className="py-8">
      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>Min: {min}{unit}</span>
        <span>Q1: {q1}{unit}</span>
        <span>Median: {median}{unit}</span>
        <span>Q3: {q3}{unit}</span>
        <span>Max: {max}{unit}</span>
      </div>

      {/* Box Plot */}
      <div className="relative h-24 bg-gray-100 rounded">
        {/* Whisker line */}
        <div
          className="absolute top-1/2 h-0.5 bg-gray-400"
          style={{ left: '0%', right: '0%' }}
        />

        {/* Box (Q1 to Q3) */}
        <div
          className="absolute top-1/4 h-1/2 bg-blue-200 border-2 border-blue-400 rounded"
          style={{
            left: `${q1Pos}%`,
            width: `${q3Pos - q1Pos}%`
          }}
        >
          {/* Median line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-blue-600"
            style={{ left: `${((median - q1) / (q3 - q1)) * 100}%` }}
          />
        </div>

        {/* Player marker */}
        <div
          className="absolute top-0 bottom-0 flex flex-col items-center justify-center"
          style={{ left: `${playerPos}%` }}
        >
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg" />
          <div className="mt-1 text-xs font-semibold text-red-600">
            Du ({playerPercentile}%)
          </div>
        </div>
      </div>

      {/* Player value */}
      <div className="mt-4 text-center">
        <span className="text-lg font-bold text-gray-900">
          {playerValue}{unit}
        </span>
        <span className="ml-2 text-sm text-gray-500">
          (Persentil: {playerPercentile})
        </span>
      </div>
    </div>
  );
};

export default BoxPlot;
```

---

### Steg 4: Tab Components

#### 4.1: MinStatistikk (Forbedre eksisterende)

**File:** `apps/web/src/features/stats/components/MinStatistikk.jsx`

```jsx
import React from 'react';
import { usePlayerStats } from '../hooks/usePlayerStats';
import StatCard from './shared/StatCard';
import { RadarChart } from '@/components/charts'; // Assume vi har dette

const MinStatistikk = ({ playerId }) => {
  const { data, loading, error } = usePlayerStats(playerId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900">Min Statistikk</h2>
        <p className="text-sm text-gray-500 mt-1">
          Siste benchmark: {new Date(data.lastBenchmark).toLocaleDateString('nb-NO')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Tester Fullført"
          value={`${data.testsCompleted}/${data.totalTests}`}
          percentile={data.completionPercentage}
          color="blue"
        />
        <StatCard
          title="Bestått Rate"
          value={`${data.passRate}%`}
          trend={data.passRate >= 75 ? 'up' : data.passRate >= 50 ? 'neutral' : 'down'}
          color="green"
        />
        <StatCard
          title="Overall Persentil"
          value={`${data.overallPercentile}%`}
          percentile={data.overallPercentile}
          color="purple"
        />
      </div>

      {/* Radar Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Test Profil (Alle 20 Tester)
        </h3>
        <RadarChart
          data={data.testSummaries.map(test => ({
            category: test.testName,
            value: test.percentile || 0
          }))}
        />
      </div>

      {/* Strengths */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          ✅ Styrker (Topp 25%)
        </h3>
        <div className="space-y-2">
          {data.strengthAreas.map((area, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-green-50 rounded-lg"
            >
              <span className="font-medium text-green-900">{area.testName}</span>
              <span className="text-sm font-semibold text-green-600">
                {area.percentile}. persentil
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weaknesses */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          ⚠️ Fokusområder (Nederste 25%)
        </h3>
        <div className="space-y-2">
          {data.weaknessAreas.map((area, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-orange-50 rounded-lg"
            >
              <span className="font-medium text-orange-900">{area.testName}</span>
              <span className="text-sm font-semibold text-orange-600">
                {area.percentile}. persentil
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinStatistikk;
```

#### 4.2: SGProfile

**File:** `apps/web/src/features/stats/components/SGProfile.jsx`

```jsx
import React, { useState } from 'react';
import { useDataGolfComparison } from '../hooks/useDataGolfComparison';
import ComparisonBar from './shared/ComparisonBar';

const SGProfile = ({ playerId }) => {
  const [tour, setTour] = useState('PGA');
  const { data, loading, error } = useDataGolfComparison(playerId, tour);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  const sgComponents = [
    { label: 'Off Tee', value: data.sg_off_tee },
    { label: 'Approach', value: data.sg_approach },
    { label: 'Around Green', value: data.sg_around_green },
    { label: 'Putting', value: data.sg_putting },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Strokes Gained Profil</h2>
            <p className="text-sm text-gray-500 mt-1">
              Din SG vs {tour} Tour Snitt
            </p>
          </div>
          <select
            value={tour}
            onChange={(e) => setTour(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="PGA">PGA Tour</option>
            <option value="LPGA">LPGA Tour</option>
            <option value="DP">DP World Tour</option>
          </select>
        </div>
      </div>

      {/* SG Total */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 shadow rounded-lg p-6 text-white">
        <div className="text-sm font-medium opacity-90">Total Strokes Gained</div>
        <div className="text-4xl font-bold mt-2">
          {data.sg_total > 0 ? '+' : ''}{data.sg_total.toFixed(2)}
        </div>
        <div className="text-sm mt-2 opacity-75">
          vs {tour} Tour Average (0.00)
        </div>
      </div>

      {/* SG Breakdown */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          SG Breakdown
        </h3>
        <div className="space-y-4">
          {sgComponents.map((component) => (
            <div key={component.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {component.label}
                </span>
                <span className={`text-sm font-semibold ${
                  component.value > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {component.value > 0 ? '+' : ''}{component.value.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    component.value > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.min(Math.abs(component.value) * 40, 100)}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traditional Stats Comparison */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Tradisjonelle Statistikker
        </h3>
        <div className="space-y-6">
          <ComparisonBar
            label="Driving Distance"
            playerValue={data.driving_distance.player}
            compareValue={data.driving_distance.tour}
            unit="m"
          />
          <ComparisonBar
            label="Driving Accuracy"
            playerValue={data.driving_accuracy.player}
            compareValue={data.driving_accuracy.tour}
            unit="%"
          />
          <ComparisonBar
            label="GIR %"
            playerValue={data.gir_percent.player}
            compareValue={data.gir_percent.tour}
            unit="%"
          />
          <ComparisonBar
            label="Scrambling"
            playerValue={data.scrambling_percent.player}
            compareValue={data.scrambling_percent.tour}
            unit="%"
          />
          <ComparisonBar
            label="Putts per Round"
            playerValue={data.putts_per_round.player}
            compareValue={data.putts_per_round.tour}
            unit=""
          />
        </div>
      </div>
    </div>
  );
};

export default SGProfile;
```

#### 4.3: PeerComparison

**File:** `apps/web/src/features/stats/components/PeerComparison.jsx`

```jsx
import React, { useState } from 'react';
import { usePeerComparison } from '../hooks/usePeerComparison';
import BoxPlot from './shared/BoxPlot';

const PeerComparison = ({ playerId }) => {
  const [testNumber, setTestNumber] = useState(1);
  const [filters, setFilters] = useState({
    category: 'B',
    gender: 'M'
  });

  const { data, loading, error } = usePeerComparison(playerId, testNumber, filters);

  const testOptions = [
    { value: 1, label: 'Test 1: Driver Avstand' },
    { value: 5, label: 'Test 5: Klubbhastighet' },
    { value: 10, label: 'Test 10: Approach 100m' },
    { value: 15, label: 'Test 15: Putting 3m' },
    { value: 19, label: 'Test 19: 9-hulls Sim' },
    { value: 20, label: 'Test 20: On-Course' },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Peer Sammenligning
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test
            </label>
            <select
              value={testNumber}
              onChange={(e) => setTestNumber(Number(e.target.value))}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {testOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="A">A-kategori</option>
              <option value="B">B-kategori</option>
              <option value="C">C-kategori</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kjønn
            </label>
            <select
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="M">Mann</option>
              <option value="F">Kvinne</option>
              <option value="">Alle</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Viser: {data.peerStats.count} spillere i {filters.category}-kategori
        </p>
      </div>

      {/* Box Plot */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Distribusjon
        </h3>
        <BoxPlot
          min={data.peerStats.min}
          q1={data.peerStats.q1}
          median={data.peerStats.median}
          q3={data.peerStats.q3}
          max={data.peerStats.max}
          playerValue={data.playerValue}
          playerPercentile={data.playerPercentile}
          unit="m"
        />
      </div>

      {/* Stats Summary */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Din Ytelse
        </h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <dt className="text-sm font-medium text-gray-500">Verdi</dt>
            <dd className="text-2xl font-bold text-gray-900">{data.playerValue}m</dd>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <dt className="text-sm font-medium text-gray-500">Persentil</dt>
            <dd className="text-2xl font-bold text-gray-900">{data.playerPercentile}</dd>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <dt className="text-sm font-medium text-gray-500">Z-Score</dt>
            <dd className="text-2xl font-bold text-gray-900">{data.playerZScore.toFixed(2)}</dd>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <dt className="text-sm font-medium text-gray-500">Rangering</dt>
            <dd className="text-2xl font-bold text-gray-900">
              {data.playerRank} av {data.peerStats.count}
            </dd>
          </div>
        </dl>
      </div>

      {/* Feedback */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <p className="text-sm text-blue-700">
          🎯 {data.comparisonText}
        </p>
      </div>
    </div>
  );
};

export default PeerComparison;
```

---

### Steg 5: Routing Setup

**File:** `apps/web/src/App.jsx` (eller routing config)

```jsx
import Stats from './features/stats/Stats';

// Add route:
<Route path="/players/:playerId/stats" element={<Stats />} />

// eller hvis du bruker nested routes:
<Route path="/dashboard">
  <Route path="stats" element={<Stats />} />
</Route>
```

---

### Steg 6: Navigation Link

Legg til link i hovedmenyen:

```jsx
<NavLink
  to={`/players/${playerId}/stats`}
  className="nav-link"
>
  📊 Statistikk
</NavLink>
```

---

## ✅ TESTING CHECKLIST

### Backend Verification

```bash
# 1. Test player overview endpoint
curl -X GET \
  'http://localhost:3000/api/v1/coach-analytics/players/PLAYER_UUID/overview' \
  -H 'Authorization: Bearer YOUR_TOKEN'

# Expected: strengths, weaknesses, testSummaries

# 2. Test peer comparison
curl -X GET \
  'http://localhost:3000/api/v1/peer-comparison?playerId=PLAYER_UUID&testNumber=1&category=B' \
  -H 'Authorization: Bearer YOUR_TOKEN'

# Expected: peerStats, playerPercentile, comparisonText

# 3. Test DataGolf comparison
curl -X GET \
  'http://localhost:3000/api/v1/datagolf/compare?playerId=PLAYER_UUID&tour=PGA' \
  -H 'Authorization: Bearer YOUR_TOKEN'

# Expected: SG components or demo data fallback
```

### Frontend Testing

- [ ] Stats page loads without errors
- [ ] All 5 tabs render correctly
- [ ] Tab switching works smoothly
- [ ] MinStatistikk shows real data from backend
- [ ] SGProfile shows SG breakdown (or demo data)
- [ ] PeerComparison shows box plot
- [ ] Filters update peer comparison
- [ ] Charts render correctly
- [ ] Loading states show while fetching
- [ ] Error states handle gracefully
- [ ] Responsive on mobile (tabs scroll horizontally)

---

## 🚀 DEPLOYMENT

```bash
# 1. Install any new dependencies
cd apps/web
npm install @headlessui/react @heroicons/react recharts

# 2. Build frontend
npm run build

# 3. Test production build
npm run preview

# 4. Check bundle size
npm run build -- --stats
# Ensure Stats page doesn't bloat bundle (use code splitting if needed)

# 5. Deploy
# (your deployment process)
```

---

## 📊 SUCCESS METRICS

After Fase 1 implementation, measure:

- **Load Time:** Stats page < 2 seconds
- **API Response:** < 500ms for all endpoints
- **Chart Render:** < 1 second
- **User Adoption:** % of players visiting Stats weekly
- **Bug Reports:** < 5 in first week
- **User Feedback:** NPS score for Stats feature

---

## 🎯 NEXT STEPS (Fase 2)

After Fase 1 is done:

1. Get DataGolf API key
2. Implement DataGolfSyncService
3. Set up daily cron job
4. Migrate from demo data to real DataGolf data
5. Add TourBenchmark tab (real tour averages)
6. Add LiveTrends tab (historical tracking)

---

**Let's ship Fase 1! 🚀**
