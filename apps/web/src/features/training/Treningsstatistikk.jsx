import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import {
  FlameIcon, ClockIcon, ChartIcon, GolfTarget
} from '../../components/icons';
import { tokens } from '../../design-tokens';

// Training area colors (Blue Palette 01)
const areaColors = {
  langspill: 'var(--ak-session-teknikk)',
  innspill: 'var(--ak-session-golfslag)',
  shortgame: 'var(--ak-achievement-gold)',
  putting: 'var(--ak-achievement-gold-light)',
  fysisk: 'var(--ak-status-error)',
  mental: 'var(--ak-text-muted)',
};

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
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12,6 12,12 16,14"/>
    </svg>
  ),
  Target: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
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
  Activity: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
    </svg>
  ),
  Award: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="7"/>
      <polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88"/>
    </svg>
  ),
  Filter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6,9 12,15 18,9"/>
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
    achievement: 'bg-yellow-50 text-yellow-700',
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

const ProgressBar = ({ value, max, color = 'var(--ak-primary)', showLabel = false }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="relative">
      <div className="h-2 bg-ak-mist rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="absolute right-0 -top-5 text-[11px] text-ak-steel">{Math.round(percentage)}%</span>
      )}
    </div>
  );
};

// ===== CHART COMPONENTS =====
const BarChart = ({ data, height = 120 }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t transition-all duration-300 hover:opacity-80"
            style={{
              height: `${(item.value / maxValue) * 100}%`,
              backgroundColor: item.color || 'var(--accent)',
              minHeight: 4,
            }}
          />
          <span className="text-[10px] text-ak-steel">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const LineChart = ({ data, height = 100, color = 'var(--accent)' }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - minValue) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ height }} className="relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {/* Grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke={'var(--border-default)'} strokeWidth="0.5"/>
        <line x1="0" y1="50" x2="100" y2="50" stroke={'var(--border-default)'} strokeWidth="0.5"/>
        <line x1="0" y1="75" x2="100" y2="75" stroke={'var(--border-default)'} strokeWidth="0.5"/>

        {/* Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((d.value - minValue) / range) * 80 - 10;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2.5"
              fill="white"
              stroke={color}
              strokeWidth="1.5"
            />
          );
        })}
      </svg>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-ak-steel">
        {data.filter((_, i) => i % 2 === 0 || i === data.length - 1).map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
};

const DonutChart = ({ value, max, size = 80, color = 'var(--accent)' }) => {
  const percentage = (value / max) * 100;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={'var(--border-default)'}
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[14px] font-bold text-ak-charcoal">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

// ===== MAIN COMPONENT =====
const AKGolfTreningsstatistikk = ({ stats: apiStats = null, player: apiPlayer = null }) => {
  const [timeRange, setTimeRange] = useState('week');

  // Player profile - use API data if available
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const player = apiPlayer || {
    name: 'Ola Nordmann',
    category: 'B',
    age: 17,
  };

  // Time range options
  const timeRanges = [
    { id: 'week', label: 'Denne uken' },
    { id: 'month', label: 'Denne måneden' },
    { id: 'quarter', label: 'Siste 3 mnd' },
    { id: 'year', label: 'I år' },
  ];

  // Weekly stats
  const weeklyStats = {
    totalHours: 18.5,
    targetHours: 25,
    sessionsCompleted: 12,
    targetSessions: 15,
    exercisesCompleted: 87,
    streak: 14, // days
  };

  // Hours by day (this week) - demo data or from API
  const demoHoursByDay = [
    { label: 'Ma', value: 3.5, color: 'var(--accent)' },
    { label: 'Ti', value: 2.0, color: 'var(--accent)' },
    { label: 'On', value: 4.0, color: 'var(--accent)' },
    { label: 'To', value: 2.5, color: 'var(--accent)' },
    { label: 'Fr', value: 3.0, color: 'var(--accent)' },
    { label: 'Lø', value: 3.5, color: 'var(--accent)' },
    { label: 'Sø', value: 0, color: 'var(--border-default)' },
  ];
  const hoursByDay = apiStats?.hoursByDay || demoHoursByDay;

  // Hours trend (last 8 weeks)
  const hoursTrend = [
    { label: 'U43', value: 15 },
    { label: 'U44', value: 18 },
    { label: 'U45', value: 22 },
    { label: 'U46', value: 20 },
    { label: 'U47', value: 24 },
    { label: 'U48', value: 19 },
    { label: 'U49', value: 23 },
    { label: 'U50', value: 18.5 },
  ];

  // Training distribution by area - demo data or from API
  const demoAreaDistribution = [
    { area: 'Langspill', hours: 5.5, percentage: 30, color: areaColors.langspill },
    { area: 'Innspill', hours: 4.0, percentage: 22, color: areaColors.innspill },
    { area: 'Shortgame', hours: 3.5, percentage: 19, color: areaColors.shortgame },
    { area: 'Putting', hours: 3.0, percentage: 16, color: areaColors.putting },
    { area: 'Fysisk', hours: 2.0, percentage: 11, color: areaColors.fysisk },
    { area: 'Mental', hours: 0.5, percentage: 3, color: areaColors.mental },
  ];
  const areaDistribution = apiStats?.areaDistribution || demoAreaDistribution;

  // L-Phase progression - demo data or from API
  const demoLPhaseProgress = [
    { phase: 'L1', label: 'Eksponering', completed: 45, total: 45, color: 'var(--bg-tertiary)' },
    { phase: 'L2', label: 'Kropp+Armer', completed: 38, total: 40, color: 'var(--border-default)' },
    { phase: 'L3', label: 'Kølle', completed: 28, total: 35, color: 'var(--text-secondary)' },
    { phase: 'L4', label: 'Kontrollert', completed: 15, total: 30, color: 'rgba(var(--accent-rgb), 0.8)' },
    { phase: 'L5', label: 'Automatikk', completed: 5, total: 25, color: 'var(--accent)' },
  ];
  const lPhaseProgress = apiStats?.lPhaseProgress || demoLPhaseProgress;

  // Recent sessions
  const recentSessions = [
    {
      id: 1,
      date: '14. des',
      title: 'Driving Range',
      area: 'Langspill',
      duration: 90,
      exercises: 8,
      lPhase: 'L4',
      rating: 4,
    },
    {
      id: 2,
      date: '13. des',
      title: 'Shortgame Practice',
      area: 'Shortgame',
      duration: 60,
      exercises: 6,
      lPhase: 'L3',
      rating: 5,
    },
    {
      id: 3,
      date: '12. des',
      title: 'Putting Drills',
      area: 'Putting',
      duration: 45,
      exercises: 5,
      lPhase: 'L5',
      rating: 4,
    },
    {
      id: 4,
      date: '11. des',
      title: 'Styrketrening',
      area: 'Fysisk',
      duration: 75,
      exercises: 12,
      lPhase: '-',
      rating: 4,
    },
  ];

  // Personal records
  const personalRecords = [
    { metric: 'Lengste streak', value: '21 dager', date: 'Nov 2025', Icon: FlameIcon },
    { metric: 'Flest timer/uke', value: '28.5 timer', date: 'Okt 2025', Icon: ClockIcon },
    { metric: 'Flest økter/uke', value: '18 økter', date: 'Sep 2025', Icon: ChartIcon },
    { metric: 'Beste L5-progresjon', value: '+12 øvelser', date: 'Nov 2025', Icon: GolfTarget },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
      {/* Header */}
      <PageHeader
        title="Treningsstatistikk"
        subtitle="Oversikt over treningsaktivitet"
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Time Range Selector */}
            <div style={{ position: 'relative' }}>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                style={{
                  appearance: 'none',
                  padding: '8px 32px 8px 12px',
                  backgroundColor: 'var(--bg-primary)',
                  border: `1px solid ${'var(--border-default)'}`,
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                }}
              >
                {timeRanges.map(range => (
                  <option key={range.id} value={range.id}>{range.label}</option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }}>
                <Icons.ChevronDown />
              </div>
            </div>
          </div>
        }
      />

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Hours */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-ak-primary/10 flex items-center justify-center text-ak-primary">
                <Icons.Clock />
              </div>
              <Badge variant="success">+15%</Badge>
            </div>
            <p className="text-[32px] font-bold text-ak-charcoal">{weeklyStats.totalHours}t</p>
            <p className="text-[12px] text-ak-steel">av {weeklyStats.targetHours}t mål</p>
            <div className="mt-2">
              <ProgressBar value={weeklyStats.totalHours} max={weeklyStats.targetHours} color={'var(--success)'} />
            </div>
          </Card>

          {/* Sessions Completed */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-ak-success/10 flex items-center justify-center text-ak-success">
                <Icons.Target />
              </div>
              <Badge variant="accent">{weeklyStats.sessionsCompleted}/{weeklyStats.targetSessions}</Badge>
            </div>
            <p className="text-[32px] font-bold text-ak-charcoal">{weeklyStats.sessionsCompleted}</p>
            <p className="text-[12px] text-ak-steel">økter fullført</p>
            <div className="mt-2">
              <ProgressBar value={weeklyStats.sessionsCompleted} max={weeklyStats.targetSessions} color={'var(--accent)'} />
            </div>
          </Card>

          {/* Exercises */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-ak-gold/10 flex items-center justify-center text-ak-gold">
                <Icons.Activity />
              </div>
              <span className="flex items-center gap-1 text-[12px] text-ak-success">
                <Icons.TrendingUp /> +8%
              </span>
            </div>
            <p className="text-[32px] font-bold text-ak-charcoal">{weeklyStats.exercisesCompleted}</p>
            <p className="text-[12px] text-ak-steel">øvelser gjennomført</p>
          </Card>

          {/* Streak */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-ak-error/10 flex items-center justify-center text-ak-error">
                <Icons.Award />
              </div>
              <Badge variant="achievement"><FlameIcon size={12} /> Streak</Badge>
            </div>
            <p className="text-[32px] font-bold text-ak-charcoal">{weeklyStats.streak}</p>
            <p className="text-[12px] text-ak-steel">dager på rad</p>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hours by Day */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-semibold text-ak-charcoal">Timer denne uken</h3>
                <span className="text-[13px] text-ak-steel">Totalt: {weeklyStats.totalHours}t</span>
              </div>
              <BarChart data={hoursByDay} height={140} />
            </Card>

            {/* Hours Trend */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-semibold text-ak-charcoal">Timetrend (8 uker)</h3>
                <span className="flex items-center gap-1 text-[12px] text-ak-success">
                  <Icons.TrendingUp /> +23% snitt
                </span>
              </div>
              <LineChart data={hoursTrend} height={120} color={'var(--accent)'} />
            </Card>

            {/* L-Phase Progression */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-semibold text-ak-charcoal">L-fase progresjon</h3>
                <Badge variant="accent">Totalt: 131 øvelser</Badge>
              </div>
              <div className="space-y-3">
                {lPhaseProgress.map((phase) => (
                  <div key={phase.phase} className="flex items-center gap-3">
                    <div className="w-12 text-[12px] font-medium text-ak-charcoal">{phase.phase}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-ak-steel">{phase.label}</span>
                        <span className="text-[11px] font-medium text-ak-charcoal">
                          {phase.completed}/{phase.total}
                        </span>
                      </div>
                      <ProgressBar
                        value={phase.completed}
                        max={phase.total}
                        color={phase.color}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Area Distribution */}
            <Card>
              <h3 className="text-[15px] font-semibold text-ak-charcoal mb-4">Fordeling per område</h3>
              <div className="flex justify-center mb-4">
                <DonutChart value={weeklyStats.totalHours} max={weeklyStats.targetHours} size={100} />
              </div>
              <div className="space-y-2">
                {areaDistribution.map((area) => (
                  <div key={area.area} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: area.color }}
                    />
                    <span className="flex-1 text-[12px] text-ak-charcoal">{area.area}</span>
                    <span className="text-[12px] text-ak-steel">{area.hours}t</span>
                    <span className="text-[12px] font-medium text-ak-charcoal w-8 text-right">
                      {area.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Sessions */}
            <Card padding={false}>
              <div className="p-4 pb-2">
                <h3 className="text-[15px] font-semibold text-ak-charcoal mb-3">Siste økter</h3>
              </div>
              <div className="divide-y divide-ak-mist">
                {recentSessions.map((session) => (
                  <div key={session.id} className="px-4 py-3 hover:bg-ak-snow transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-medium text-ak-charcoal">{session.title}</span>
                      <span className="text-[11px] text-ak-steel">{session.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="neutral" size="sm">{session.area}</Badge>
                      <span className="text-[11px] text-ak-steel">{session.duration} min</span>
                      {session.lPhase !== '-' && (
                        <Badge variant="accent" size="sm">{session.lPhase}</Badge>
                      )}
                      <span className="text-[11px] text-ak-gold ml-auto">
                        {'★'.repeat(session.rating)}{'☆'.repeat(5 - session.rating)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 pt-2 border-t border-ak-mist">
                <button className="w-full text-center text-[13px] text-ak-primary font-medium hover:underline">
                  Se alle økter →
                </button>
              </div>
            </Card>

            {/* Personal Records */}
            <Card>
              <h3 className="text-[15px] font-semibold text-ak-charcoal mb-3">Personlige rekorder</h3>
              <div className="space-y-3">
                {personalRecords.map((record, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-ak-snow rounded-lg">
                    <span className="text-ak-primary">{record.Icon && <record.Icon size={20} />}</span>
                    <div className="flex-1">
                      <p className="text-[12px] text-ak-steel">{record.metric}</p>
                      <p className="text-[14px] font-semibold text-ak-charcoal">{record.value}</p>
                    </div>
                    <span className="text-[10px] text-ak-steel">{record.date}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AKGolfTreningsstatistikk;
