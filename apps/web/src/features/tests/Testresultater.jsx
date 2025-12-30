import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import Button from '../../ui/primitives/Button';
import {
  HomeIcon, CalendarIcon, GolfScorecard, ChartIcon, ProfileIcon
} from '../../components/icons';

// ===== ICONS =====
const Icons = {
  TrendingUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
      <polyline points="17,6 23,6 23,12"/>
    </svg>
  ),
  TrendingDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,18 13.5,8.5 8.5,13.5 1,6"/>
      <polyline points="17,18 23,18 23,12"/>
    </svg>
  ),
  Minus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6,9 12,15 18,9"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9,6 15,12 9,18"/>
    </svg>
  ),
  Info: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  Download: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21,15 L21,19 C21,20.1 20.1,21 19,21 L5,21 C3.9,21 3,20.1 3,19 L3,15"/>
      <polyline points="7,10 12,15 17,10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Target: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
};

// ===== UI COMPONENTS =====
const Card = ({ children, className = '', padding = true }) => (
  <div className={`bg-white border border-ak-mist rounded-xl ${padding ? 'p-4' : ''} ${className}`}
       style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'neutral', size = 'sm' }) => {
  const variants = {
    neutral: 'bg-gray-100 text-gray-600',
    accent: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    error: 'bg-red-50 text-red-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-[13px]',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};


const ProgressBar = ({ value, max, color = 'var(--accent)' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="h-2 bg-ak-mist rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  );
};

// ===== CHART COMPONENT - Line Chart with Multiple Series =====
const MultiLineChart = ({ data, height = 200 }) => {
  const allValues = data.flatMap(series => series.values.map(v => v.value));
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue || 1;

  const labels = data[0]?.values.map(v => v.label) || [];

  return (
    <div style={{ height }} className="relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {/* Grid lines */}
        <line x1="0" y1="20" x2="100" y2="20" stroke={'var(--border-default)'} strokeWidth="0.3"/>
        <line x1="0" y1="40" x2="100" y2="40" stroke={'var(--border-default)'} strokeWidth="0.3"/>
        <line x1="0" y1="60" x2="100" y2="60" stroke={'var(--border-default)'} strokeWidth="0.3"/>
        <line x1="0" y1="80" x2="100" y2="80" stroke={'var(--border-default)'} strokeWidth="0.3"/>

        {/* Requirement line */}
        {data[0]?.requirement && (
          <line
            x1="0"
            y1={100 - ((data[0].requirement - minValue) / range) * 80 - 10}
            x2="100"
            y2={100 - ((data[0].requirement - minValue) / range) * 80 - 10}
            stroke={'var(--error)'}
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
        )}

        {/* Lines for each series */}
        {data.map((series, seriesIndex) => {
          const points = series.values.map((v, i) => {
            const x = (i / (series.values.length - 1)) * 100;
            const y = 100 - ((v.value - minValue) / range) * 80 - 10;
            return `${x},${y}`;
          }).join(' ');

          return (
            <g key={seriesIndex}>
              <polyline
                fill="none"
                stroke={series.color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
              {series.values.map((v, i) => {
                const x = (i / (series.values.length - 1)) * 100;
                const y = 100 - ((v.value - minValue) / range) * 80 - 10;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="white"
                    stroke={series.color}
                    strokeWidth="1.5"
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-ak-steel px-1">
        {labels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
    </div>
  );
};

// ===== RADAR CHART =====
const RadarChart = ({ data, size = 200 }) => {
  const center = 50;
  const radius = 40;
  const angleStep = (2 * Math.PI) / data.length;

  // Generate points for each data value
  const points = data.map((item, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (item.value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  });

  // Generate requirement points
  const reqPoints = data.map((item, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = ((item.requirement || 0) / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  });

  return (
    <div style={{ width: size, height: size }} className="relative mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background circles */}
        {[0.25, 0.5, 0.75, 1].map((scale, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke={'var(--border-default)'}
            strokeWidth="0.5"
          />
        ))}

        {/* Axis lines */}
        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke={'var(--border-default)'}
              strokeWidth="0.5"
            />
          );
        })}

        {/* Requirement polygon */}
        <polygon
          points={reqPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={'var(--error)'}
          strokeWidth="1"
          strokeDasharray="2,2"
        />

        {/* Data polygon */}
        <polygon
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="rgba(var(--accent-rgb), 0.18)"
          stroke={'var(--accent)'}
          strokeWidth="1.5"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="2.5"
            fill="white"
            stroke={'var(--accent)'}
            strokeWidth="1.5"
          />
        ))}
      </svg>

      {/* Labels */}
      {data.map((item, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const labelRadius = radius + 12;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return (
          <div
            key={i}
            className="absolute text-[9px] text-ak-charcoal font-medium"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              whiteSpace: 'nowrap',
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
};

// ===== MAIN COMPONENT =====
const AKGolfTestresultater = ({ player: apiPlayer = null, testResults: apiTestResults = null }) => {
  const [selectedTest, setSelectedTest] = useState(null);

  // Default player profile (fallback if no API data)
  const defaultPlayer = {
    name: 'Ola Nordmann',
    category: 'B',
    age: 17,
  };

  // Use API data if available, otherwise use default
  const player = apiPlayer || defaultPlayer;

  // Benchmark dates
  const benchmarks = [
    { id: 'u48', label: 'Uke 48', date: '2025-12-01', current: true },
    { id: 'u45', label: 'Uke 45', date: '2025-11-10' },
    { id: 'u42', label: 'Uke 42', date: '2025-10-20' },
    { id: 'u39', label: 'Uke 39', date: '2025-09-29' },
    { id: 'u36', label: 'Uke 36', date: '2025-09-08' },
    { id: 'u33', label: 'Uke 33', date: '2025-08-18' },
  ];

  // Overall stats
  const overallStats = {
    testsPassedCurrent: 12,
    testsPassedPrevious: 10,
    totalTests: 20,
    improvementRate: 75, // % of tests improved
    avgProgressToReq: 89, // % average progress to requirement
  };

  // Radar chart data (normalized to 0-100 based on % of requirement)
  const radarData = [
    { label: 'Driver', value: 98, requirement: 100 },
    { label: 'Jern', value: 95, requirement: 100 },
    { label: 'Wedge', value: 92, requirement: 100 },
    { label: 'Putting', value: 88, requirement: 100 },
    { label: 'Fysisk', value: 85, requirement: 100 },
    { label: 'Mental', value: 82, requirement: 100 },
    { label: 'Strategi', value: 90, requirement: 100 },
  ];

  // Default test results with history (fallback if no API data)
  const defaultTestResults = [
    {
      id: 1,
      name: 'Driver Avstand',
      category: 'golf',
      icon: '🏌️',
      unit: 'm',
      requirement: 260,
      lowerIsBetter: false,
      history: [
        { label: 'U33', value: 242 },
        { label: 'U36', value: 245 },
        { label: 'U39', value: 248 },
        { label: 'U42', value: 252 },
        { label: 'U45', value: 248 },
        { label: 'U48', value: 255 },
      ],
    },
    {
      id: 2,
      name: 'Jern 7 Avstand',
      category: 'golf',
      icon: '🎯',
      unit: 'm',
      requirement: 165,
      lowerIsBetter: false,
      history: [
        { label: 'U33', value: 155 },
        { label: 'U36', value: 157 },
        { label: 'U39', value: 158 },
        { label: 'U42', value: 160 },
        { label: 'U45', value: 158 },
        { label: 'U48', value: 162 },
      ],
    },
    {
      id: 3,
      name: 'Wedge PEI',
      category: 'golf',
      icon: '📐',
      unit: '',
      requirement: 0.05,
      lowerIsBetter: true,
      history: [
        { label: 'U33', value: 0.072 },
        { label: 'U36', value: 0.068 },
        { label: 'U39', value: 0.065 },
        { label: 'U42', value: 0.058 },
        { label: 'U45', value: 0.061 },
        { label: 'U48', value: 0.052 },
      ],
    },
    {
      id: 4,
      name: 'Lag-kontroll Putting',
      category: 'golf',
      icon: '⛳',
      unit: 'cm',
      requirement: 45,
      lowerIsBetter: true,
      history: [
        { label: 'U33', value: 62 },
        { label: 'U36', value: 58 },
        { label: 'U39', value: 55 },
        { label: 'U42', value: 54 },
        { label: 'U45', value: 58 },
        { label: 'U48', value: 52 },
      ],
    },
    {
      id: 5,
      name: 'Klubbfart Driver',
      category: 'teknikk',
      icon: '⚡',
      unit: 'mph',
      requirement: 112,
      lowerIsBetter: false,
      history: [
        { label: 'U33', value: 102 },
        { label: 'U36', value: 104 },
        { label: 'U39', value: 106 },
        { label: 'U42', value: 107 },
        { label: 'U45', value: 106 },
        { label: 'U48', value: 109 },
      ],
    },
    {
      id: 6,
      name: 'Benkpress',
      category: 'fysisk',
      icon: '🏋️',
      unit: 'kg',
      requirement: 82,
      lowerIsBetter: false,
      history: [
        { label: 'U33', value: 65 },
        { label: 'U36', value: 68 },
        { label: 'U39', value: 70 },
        { label: 'U42', value: 72 },
        { label: 'U45', value: 72 },
        { label: 'U48', value: 78 },
      ],
    },
    {
      id: 7,
      name: 'Markløft Trapbar',
      category: 'fysisk',
      icon: '💪',
      unit: 'kg',
      requirement: 130,
      lowerIsBetter: false,
      history: [
        { label: 'U33', value: 105 },
        { label: 'U36', value: 110 },
        { label: 'U39', value: 115 },
        { label: 'U42', value: 118 },
        { label: 'U45', value: 118 },
        { label: 'U48', value: 125 },
      ],
    },
    {
      id: 8,
      name: 'Pressure Putting',
      category: 'mental',
      icon: '🎯',
      unit: '%',
      requirement: 80,
      lowerIsBetter: false,
      history: [
        { label: 'U33', value: 62 },
        { label: 'U36', value: 65 },
        { label: 'U39', value: 68 },
        { label: 'U42', value: 70 },
        { label: 'U45', value: 68 },
        { label: 'U48', value: 75 },
      ],
    },
    {
      id: 9,
      name: 'Mental Toughness',
      category: 'mental',
      icon: '🧠',
      unit: 'pts',
      requirement: 55,
      lowerIsBetter: false,
      history: [
        { label: 'U33', value: 42 },
        { label: 'U36', value: 45 },
        { label: 'U39', value: 48 },
        { label: 'U42', value: 48 },
        { label: 'U45', value: 48 },
        { label: 'U48', value: 52 },
      ],
    },
    {
      id: 10,
      name: 'Klubbvalg',
      category: 'strategisk',
      icon: '🎲',
      unit: '%',
      requirement: 75,
      lowerIsBetter: false,
      history: [
        { label: 'U33', value: 58 },
        { label: 'U36', value: 62 },
        { label: 'U39', value: 65 },
        { label: 'U42', value: 68 },
        { label: 'U45', value: 65 },
        { label: 'U48', value: 72 },
      ],
    },
  ];

  // Use API data if available, otherwise use default
  const testResults = apiTestResults || defaultTestResults;

  // Get test status
  const getTestStatus = (test) => {
    const currentValue = test.history[test.history.length - 1].value;
    const previousValue = test.history[test.history.length - 2].value;
    const firstValue = test.history[0].value;

    const meetsReq = test.lowerIsBetter
      ? currentValue <= test.requirement
      : currentValue >= test.requirement;

    const improved = test.lowerIsBetter
      ? currentValue < previousValue
      : currentValue > previousValue;

    const totalChange = test.lowerIsBetter
      ? firstValue - currentValue
      : currentValue - firstValue;

    const percentChange = ((Math.abs(currentValue - previousValue)) / previousValue * 100).toFixed(1);

    return { currentValue, previousValue, meetsReq, improved, totalChange, percentChange };
  };

  // Category filter
  const [categoryFilter, setCategoryFilter] = useState('all');
  const categories = [
    { id: 'all', label: 'Alle' },
    { id: 'golf', label: 'Golf' },
    { id: 'teknikk', label: 'Teknikk' },
    { id: 'fysisk', label: 'Fysisk' },
    { id: 'mental', label: 'Mental' },
    { id: 'strategisk', label: 'Strategi' },
  ];

  const filteredTests = categoryFilter === 'all'
    ? testResults
    : testResults.filter(t => t.category === categoryFilter);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <PageHeader
        title="Testresultater"
        subtitle="Historikk og fremgang"
        actions={
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 500,
              border: '1px solid var(--border-default)',
              cursor: 'pointer',
            }}
          >
            <Icons.Download />
            Eksporter
          </button>
        }
      />

      <div style={{ padding: '24px', maxWidth: '1536px', margin: '0 auto' }}>
        {/* Benchmark Timeline */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-ak-charcoal">Benchmark-historikk</h3>
            <Badge variant="accent">Kategori {player.category}</Badge>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {benchmarks.map((b) => (
              <button
                key={b.id}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-[12px] font-medium transition-colors ${
                  b.current
                    ? 'bg-ak-primary text-white'
                    : 'bg-ak-snow text-ak-charcoal hover:bg-ak-mist'
                }`}
              >
                <span className="block">{b.label}</span>
                <span className={`block text-[10px] ${b.current ? 'text-white/70' : 'text-ak-steel'}`}>
                  {new Date(b.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="text-center">
            <p className="text-[11px] text-ak-steel uppercase tracking-wide mb-1">Bestått</p>
            <p className="text-[28px] font-bold text-ak-success">
              {overallStats.testsPassedCurrent}/{overallStats.totalTests}
            </p>
            <div className="flex items-center justify-center gap-1 text-[12px] text-ak-success">
              <Icons.TrendingUp />
              +{overallStats.testsPassedCurrent - overallStats.testsPassedPrevious} fra forrige
            </div>
          </Card>

          <Card className="text-center">
            <p className="text-[11px] text-ak-steel uppercase tracking-wide mb-1">Forbedret</p>
            <p className="text-[28px] font-bold text-ak-primary">{overallStats.improvementRate}%</p>
            <p className="text-[12px] text-ak-steel">av alle tester</p>
          </Card>

          <Card className="text-center">
            <p className="text-[11px] text-ak-steel uppercase tracking-wide mb-1">Snitt til krav</p>
            <p className="text-[28px] font-bold text-ak-warning">{overallStats.avgProgressToReq}%</p>
            <p className="text-[12px] text-ak-steel">gjennomsnitt</p>
          </Card>

          <Card className="text-center">
            <p className="text-[11px] text-ak-steel uppercase tracking-wide mb-1">Fokusområder</p>
            <p className="text-[28px] font-bold text-ak-warning">
              {overallStats.totalTests - overallStats.testsPassedCurrent}
            </p>
            <p className="text-[12px] text-ak-steel">under krav</p>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Radar & Categories */}
          <div className="lg:col-span-1 space-y-6">
            {/* Radar Chart */}
            <Card>
              <h3 className="text-[15px] font-semibold text-ak-charcoal mb-4 text-center">Samlet profil</h3>
              <RadarChart data={radarData} size={220} />
              <div className="mt-4 flex items-center justify-center gap-4 text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-ak-primary"></span>
                  Nåværende
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 border-t border-dashed border-ak-error"></span>
                  Krav
                </span>
              </div>
            </Card>

            {/* Category Filter */}
            <Card>
              <h3 className="text-[15px] font-semibold text-ak-charcoal mb-3">Filtrer kategori</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                      categoryFilter === cat.id
                        ? 'bg-ak-primary text-white'
                        : 'bg-ak-snow text-ak-charcoal hover:bg-ak-mist'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Legend */}
            <Card className="bg-ak-primary/5 border-ak-primary/20">
              <div className="flex items-start gap-3">
                <Icons.Info />
                <div>
                  <h4 className="text-[13px] font-semibold text-ak-charcoal mb-2">Slik leser du grafene</h4>
                  <ul className="text-[12px] text-ak-charcoal space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-3 h-0.5 bg-ak-primary"></span>
                      Faktisk resultat
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-3 h-0.5 border-t border-dashed border-ak-error"></span>
                      Krav for kategori {player.category}
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Test Results */}
          <div className="lg:col-span-2 space-y-4">
            {filteredTests.map(test => {
              const status = getTestStatus(test);
              const isExpanded = selectedTest === test.id;

              return (
                <Card
                  key={test.id}
                  padding={false}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isExpanded ? 'ring-2 ring-ak-primary' : ''
                  }`}
                  onClick={() => setSelectedTest(isExpanded ? null : test.id)}
                >
                  <div className="p-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-ak-snow flex items-center justify-center text-lg">
                          {test.icon}
                        </div>
                        <div>
                          <h3 className="text-[14px] font-semibold text-ak-charcoal">{test.name}</h3>
                          <p className="text-[11px] text-ak-steel">
                            Krav: {test.lowerIsBetter ? '≤' : '≥'}{test.requirement}{test.unit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {status.meetsReq ? (
                          <Badge variant="success">Bestått</Badge>
                        ) : (
                          <Badge variant="warning">Under krav</Badge>
                        )}
                        <span className="text-ak-steel">
                          <Icons.ChevronRight />
                        </span>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className={`text-[24px] font-bold ${status.meetsReq ? 'text-ak-success' : 'text-ak-warning'}`}>
                            {status.currentValue}{test.unit}
                          </span>
                          <span className="flex items-center gap-1 text-[12px]">
                            {status.improved ? (
                              <span className="text-ak-success flex items-center gap-1">
                                <Icons.TrendingUp />
                                {status.percentChange}%
                              </span>
                            ) : (
                              <span className="text-ak-error flex items-center gap-1">
                                <Icons.TrendingDown />
                                {status.percentChange}%
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="mt-2">
                          <ProgressBar
                            value={test.lowerIsBetter
                              ? Math.max(0, 100 - ((status.currentValue / test.requirement) * 100 - 100))
                              : (status.currentValue / test.requirement) * 100
                            }
                            max={100}
                            color={status.meetsReq ? 'var(--success)' : 'var(--warning)'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded View with Chart */}
                  {isExpanded && (
                    <div className="border-t border-ak-mist p-4 bg-ak-snow">
                      <h4 className="text-[13px] font-medium text-ak-charcoal mb-3">Historikk (6 benchmark)</h4>
                      <MultiLineChart
                        data={[{
                          color: 'var(--accent)',
                          values: test.history,
                          requirement: test.requirement,
                        }]}
                        height={150}
                      />

                      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-[10px] text-ak-steel uppercase">Første test</p>
                          <p className="text-[14px] font-semibold text-ak-charcoal">
                            {test.history[0].value}{test.unit}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-[10px] text-ak-steel uppercase">Endring</p>
                          <p className={`text-[14px] font-semibold ${
                            (test.lowerIsBetter ? status.totalChange > 0 : status.totalChange > 0)
                              ? 'text-ak-success'
                              : 'text-ak-error'
                          }`}>
                            {status.totalChange > 0 ? '+' : ''}{status.totalChange.toFixed(test.unit === '' ? 3 : 0)}{test.unit}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-[10px] text-ak-steel uppercase">Til krav</p>
                          <p className={`text-[14px] font-semibold ${status.meetsReq ? 'text-ak-success' : 'text-ak-warning'}`}>
                            {status.meetsReq ? 'Oppnådd ✓' : `${Math.abs(status.currentValue - test.requirement).toFixed(test.unit === '' ? 3 : 0)}${test.unit} igjen`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-ak-mist z-50 lg:hidden">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2">
          {[
            { id: 'dashboard', Icon: HomeIcon, label: 'Hjem' },
            { id: 'calendar', Icon: CalendarIcon, label: 'Kalender' },
            { id: 'tests', Icon: GolfScorecard, label: 'Tester' },
            { id: 'results', Icon: ChartIcon, label: 'Resultater', active: true },
            { id: 'profile', Icon: ProfileIcon, label: 'Profil' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                tab.active
                  ? 'text-ak-primary'
                  : 'text-ak-steel hover:text-ak-charcoal'
              }`}
            >
              <span className="mb-1">{tab.Icon && <tab.Icon size={20} />}</span>
              <span className={`text-[11px] font-medium ${
                tab.active ? 'text-ak-primary' : 'text-ak-steel'
              }`}>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AKGolfTestresultater;
