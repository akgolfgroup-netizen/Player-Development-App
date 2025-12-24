import React, { useState } from 'react';
import {
  TrendingUp, ChevronRight,
  ArrowUp, ArrowDown, Minus, BarChart2
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';

// ============================================================================
// MOCK DATA
// ============================================================================

const BENCHMARK_TESTS = [
  {
    id: 'driving_distance',
    name: 'Driver avstand',
    unit: 'm',
    category: 'Driving',
    history: [
      { date: '2025-01-15', value: 255, percentile: 78 },
      { date: '2024-12-15', value: 248, percentile: 72 },
      { date: '2024-11-15', value: 245, percentile: 70 },
      { date: '2024-10-01', value: 240, percentile: 65 },
      { date: '2024-08-01', value: 235, percentile: 60 },
    ],
    target: 260,
    categoryAvg: 242,
  },
  {
    id: 'driving_accuracy',
    name: 'Fairway treff',
    unit: '%',
    category: 'Driving',
    history: [
      { date: '2025-01-15', value: 68, percentile: 72 },
      { date: '2024-12-15', value: 65, percentile: 68 },
      { date: '2024-11-15', value: 62, percentile: 62 },
      { date: '2024-10-01', value: 58, percentile: 55 },
    ],
    target: 75,
    categoryAvg: 62,
  },
  {
    id: 'gir',
    name: 'GIR',
    unit: '%',
    category: 'Jernspill',
    history: [
      { date: '2025-01-15', value: 55, percentile: 68 },
      { date: '2024-12-15', value: 52, percentile: 62 },
      { date: '2024-11-15', value: 48, percentile: 55 },
      { date: '2024-10-01', value: 45, percentile: 48 },
    ],
    target: 65,
    categoryAvg: 50,
  },
  {
    id: 'scrambling',
    name: 'Scrambling',
    unit: '%',
    category: 'Kortspill',
    history: [
      { date: '2025-01-15', value: 58, percentile: 75 },
      { date: '2024-12-15', value: 55, percentile: 70 },
      { date: '2024-11-15', value: 52, percentile: 65 },
    ],
    target: 65,
    categoryAvg: 48,
  },
  {
    id: 'putts_per_round',
    name: 'Putts per runde',
    unit: '',
    category: 'Putting',
    history: [
      { date: '2025-01-15', value: 31.5, percentile: 62 },
      { date: '2024-12-15', value: 32.2, percentile: 55 },
      { date: '2024-11-15', value: 33.0, percentile: 48 },
    ],
    target: 30,
    categoryAvg: 32.5,
    lowerIsBetter: true,
  },
  {
    id: 'club_speed',
    name: 'Klubbfart driver',
    unit: 'mph',
    category: 'Fysisk',
    history: [
      { date: '2025-01-15', value: 108, percentile: 82 },
      { date: '2024-12-15', value: 106, percentile: 78 },
      { date: '2024-11-15', value: 104, percentile: 72 },
      { date: '2024-10-01', value: 102, percentile: 68 },
    ],
    target: 112,
    categoryAvg: 100,
  },
];

const CATEGORIES = ['Alle', 'Driving', 'Jernspill', 'Kortspill', 'Putting', 'Fysisk'];

// ============================================================================
// HELPERS
// ============================================================================

const getTrend = (history, lowerIsBetter = false) => {
  if (history.length < 2) return 'stable';
  const latest = history[0].value;
  const previous = history[1].value;
  if (lowerIsBetter) {
    return latest < previous ? 'up' : latest > previous ? 'down' : 'stable';
  }
  return latest > previous ? 'up' : latest < previous ? 'down' : 'stable';
};

const getChange = (history) => {
  if (history.length < 2) return '0';
  const diff = history[0].value - history[1].value;
  const prefix = diff > 0 ? '+' : '';
  return `${prefix}${diff.toFixed(1)}`;
};

const TrendIcon = ({ trend }) => {
  if (trend === 'up') return <ArrowUp size={14} color={tokens.colors.success} />;
  if (trend === 'down') return <ArrowDown size={14} color={tokens.colors.error} />;
  return <Minus size={14} color={tokens.colors.steel} />;
};

// ============================================================================
// BENCHMARK CARD
// ============================================================================

const BenchmarkCard = ({ test, onClick }) => {
  const latest = test.history[0];
  const trend = getTrend(test.history, test.lowerIsBetter);
  const change = getChange(test.history);
  const progressToTarget = test.lowerIsBetter
    ? Math.max(0, Math.min(100, ((test.history[test.history.length - 1].value - latest.value) / (test.history[test.history.length - 1].value - test.target)) * 100))
    : Math.max(0, Math.min(100, (latest.value / test.target) * 100));

  return (
    <div
      onClick={() => onClick(test)}
      style={{
        backgroundColor: tokens.colors.white,
        borderRadius: '14px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '12px',
      }}>
        <div>
          <span style={{
            fontSize: '11px',
            fontWeight: 500,
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: `${tokens.colors.primary}15`,
            color: tokens.colors.primary,
          }}>
            {test.category}
          </span>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            margin: '6px 0 0 0',
          }}>
            {test.name}
          </h3>
        </div>
        <ChevronRight size={18} color={tokens.colors.steel} />
      </div>

      {/* Current Value */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '8px',
        marginBottom: '12px',
      }}>
        <span style={{
          fontSize: '28px',
          fontWeight: 700,
          color: tokens.colors.charcoal,
        }}>
          {latest.value}
        </span>
        <span style={{ fontSize: '14px', color: tokens.colors.steel }}>
          {test.unit}
        </span>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginLeft: '8px',
        }}>
          <TrendIcon trend={trend} />
          <span style={{
            fontSize: '13px',
            fontWeight: 500,
            color: trend === 'up' ? tokens.colors.success :
                   trend === 'down' ? tokens.colors.error : tokens.colors.steel,
          }}>
            {change}
          </span>
        </div>
      </div>

      {/* Progress to Target */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: tokens.colors.steel,
          marginBottom: '4px',
        }}>
          <span>Mal: {test.target}{test.unit}</span>
          <span>{Math.round(progressToTarget)}%</span>
        </div>
        <div style={{
          height: '6px',
          backgroundColor: tokens.colors.mist,
          borderRadius: '3px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progressToTarget}%`,
            backgroundColor: progressToTarget >= 100 ? tokens.colors.success :
                           progressToTarget >= 75 ? tokens.colors.primary : tokens.colors.warning,
            borderRadius: '3px',
          }} />
        </div>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'flex',
        gap: '16px',
        paddingTop: '12px',
        borderTop: `1px solid ${tokens.colors.mist}`,
      }}>
        <div>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Persentil</div>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: latest.percentile >= 75 ? tokens.colors.success :
                   latest.percentile >= 50 ? tokens.colors.primary : tokens.colors.warning,
          }}>
            {latest.percentile}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Kat. snitt</div>
          <div style={{ fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal }}>
            {test.categoryAvg}{test.unit}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Malinger</div>
          <div style={{ fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal }}>
            {test.history.length}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const BenchmarkHistorikkContainer = () => {
  const [selectedCategory, setSelectedCategory] = useState('Alle');

  const filteredTests = BENCHMARK_TESTS.filter(
    (t) => selectedCategory === 'Alle' || t.category === selectedCategory
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Benchmark-historie"
        subtitle="Sammenlign dine resultater over tid"
      />

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Summary Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '10px',
          marginBottom: '24px',
        }}>
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.primary }}>
              {BENCHMARK_TESTS.length}
            </div>
            <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Benchmarks</div>
          </div>
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 700,
              color: tokens.colors.success,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}>
              <TrendingUp size={18} />
              {BENCHMARK_TESTS.filter((t) => getTrend(t.history, t.lowerIsBetter) === 'up').length}
            </div>
            <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Forbedret</div>
          </div>
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '12px',
            padding: '14px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.gold }}>
              {Math.round(BENCHMARK_TESTS.reduce((sum, t) => sum + t.history[0].percentile, 0) / BENCHMARK_TESTS.length)}%
            </div>
            <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Snitt persentil</div>
          </div>
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: selectedCategory === cat ? tokens.colors.primary : tokens.colors.white,
                color: selectedCategory === cat ? tokens.colors.white : tokens.colors.charcoal,
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Benchmark Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '12px',
        }}>
          {filteredTests.map((test) => (
            <BenchmarkCard
              key={test.id}
              test={test}
              onClick={() => {/* View test details */}}
            />
          ))}
        </div>

        {filteredTests.length === 0 && (
          <div style={{
            backgroundColor: tokens.colors.white,
            borderRadius: '14px',
            padding: '40px',
            textAlign: 'center',
          }}>
            <BarChart2 size={40} color={tokens.colors.steel} style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '14px', color: tokens.colors.steel, margin: 0 }}>
              Ingen benchmarks funnet i denne kategorien
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BenchmarkHistorikkContainer;
