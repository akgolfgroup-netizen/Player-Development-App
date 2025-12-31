import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SectionTitle, SubSectionTitle, CardTitle } from '../../components/typography';
import { tokens } from '../../design-tokens';

// Period colors (Blue Palette 01)
const periodColors = {
  evaluering: 'var(--text-muted)',
  grunnlag: 'var(--ak-session-teknikk)',
  spesialisering: 'var(--ak-session-golfslag)',
  turnering: 'var(--achievement)',
};

// ===== ICONS =====
const Icons = {
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6,9 12,15 18,9"/>
    </svg>
  ),
  Target: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="6"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Flag: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
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

const Badge = ({ children, color, bg }) => (
  <span
    className="inline-flex items-center px-2.5 py-1 rounded-lg text-[12px] font-medium"
    style={{ backgroundColor: bg, color: color }}
  >
    {children}
  </span>
);

const Avatar = ({ name, size = 40 }) => {
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AK';
  return (
    <div
      className="rounded-full flex items-center justify-center font-medium text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: 'var(--accent)',
        fontSize: size * 0.4
      }}
    >
      {initials}
    </div>
  );
};

// ===== PRIORITY BAR COMPONENT =====
const PriorityBar = ({ value, maxValue = 3, color }) => (
  <div className="flex gap-0.5">
    {[...Array(maxValue)].map((_, i) => (
      <div
        key={i}
        className="h-2.5 w-2.5 rounded-sm transition-all duration-300"
        style={{
          backgroundColor: i < value ? color : 'var(--border-default)'
        }}
      />
    ))}
  </div>
);

// ===== MAIN ÅRSPLAN COMPONENT =====
/**
 * @param {object} player - Player profile data
 * @param {object} annualPlan - Annual plan data
 * @param {function} onRefresh - Callback to refresh data
 * @param {string} initialView - Initial view mode: 'overview' | 'periods' | 'focus' | 'timeline' | 'grid'
 */
const AKGolfAarsplan = ({ player: apiPlayer = null, annualPlan: apiAnnualPlan = null, plans = [], onRefresh, initialView = 'overview' }) => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  // Map initialView to internal view state
  const mapInitialView = (view) => {
    switch (view) {
      case 'periods': return 'timeline'; // Periods view shows timeline with period focus
      case 'focus': return 'grid';       // Focus view shows grid with focus areas
      case 'overview':
      default: return 'timeline';
    }
  };
  const [selectedView, setSelectedView] = useState(mapInitialView(initialView)); // 'timeline' | 'grid'
  const [pageMode, setPageMode] = useState(initialView); // 'overview' | 'periods' | 'focus'

  // Default player profile (fallback if no API data)
  const defaultPlayer = {
    name: 'Ola Nordmann',
    category: 'B',
    avgScore: '74.2',
    targetScore: 72,
    club: 'Gamle Fredrikstad GK',
  };

  // Use API data if available, otherwise use default
  const player = apiPlayer || defaultPlayer;

  // Period definitions (Blue Palette 01)
  const periodConfig = {
    E: { name: 'Evaluering', color: 'var(--text-secondary)', bg: 'var(--bg-tertiary)', icon: '📋' },
    G: { name: 'Grunnperiode', color: 'rgba(var(--accent-rgb), 0.8)', bg: `${'var(--success)'}20`, icon: '🏗️' },
    S: { name: 'Spesialperiode', color: 'var(--success)', bg: `${'var(--success)'}15`, icon: '🎯' },
    T: { name: 'Turnering', color: 'var(--achievement)', bg: `${'var(--achievement)'}15`, icon: '🏆' },
  };

  // Priority labels (Blue Palette 01)
  const priorityLabels = {
    3: { label: 'Utvikle', color: 'var(--success)' },
    2: { label: 'Beholde', color: 'var(--warning)' },
    1: { label: 'Vedlikehold', color: 'var(--text-secondary)' },
    0: { label: 'Pause', color: 'var(--border-default)' },
  };

  // Default annual plan data (Week 43 - Week 42) - fallback if no API data
  const defaultYearPlan = [
    {
      month: 'Oktober',
      weeks: [43, 44],
      period: 'E',
      focus: { konkurranse: 0, spill: 1, golfslag: 2, teknikk: 3, fysisk: 2 },
      activities: ['Sesongevaluering', 'Fysiske tester', 'TrackMan-analyse', 'IUP-planlegging'],
      learningPhase: 'L3-L4',
      clubSpeed: 'CS60-80',
      setting: 'S2-S4',
      tournaments: [],
      benchmark: [44],
    },
    {
      month: 'November',
      weeks: [45, 46, 47, 48],
      period: 'G',
      focus: { konkurranse: 0, spill: 1, golfslag: 2, teknikk: 3, fysisk: 3 },
      activities: ['Teknikk-bygging', 'Styrketrening', 'Simulator-trening', 'Indre dialog'],
      learningPhase: 'L1-L3',
      clubSpeed: 'CS40-70',
      setting: 'S1-S3',
      tournaments: [],
      benchmark: [47],
    },
    {
      month: 'Desember',
      weeks: [49, 50, 51, 52],
      period: 'G',
      focus: { konkurranse: 0, spill: 1, golfslag: 2, teknikk: 3, fysisk: 3 },
      activities: ['Teknikk-fokus', 'Fysisk base', 'Mental trening', 'Vintersamling utland'],
      learningPhase: 'L1-L3',
      clubSpeed: 'CS50-80',
      setting: 'S1-S4',
      tournaments: [],
      benchmark: [50],
    },
    {
      month: 'Januar',
      weeks: [1, 2, 3, 4],
      period: 'G',
      focus: { konkurranse: 0, spill: 1, golfslag: 3, teknikk: 3, fysisk: 3 },
      activities: ['Teknikk-integrasjon', 'Styrke-utholdenhet', 'Putting-drill', 'Visualisering'],
      learningPhase: 'L2-L4',
      clubSpeed: 'CS60-90',
      setting: 'S2-S5',
      tournaments: [],
      benchmark: [3],
    },
    {
      month: 'Februar',
      weeks: [5, 6, 7, 8],
      period: 'S',
      focus: { konkurranse: 1, spill: 2, golfslag: 3, teknikk: 2, fysisk: 2 },
      activities: ['Spesifikk trening', 'Scoringsmål', 'Treningssamling', 'Spenningsregulering'],
      learningPhase: 'L3-L5',
      clubSpeed: 'CS70-100',
      setting: 'S4-S7',
      tournaments: ['Treningssamling Spania'],
      benchmark: [6],
    },
    {
      month: 'Mars',
      weeks: [9, 10, 11, 12, 13],
      period: 'S',
      focus: { konkurranse: 1, spill: 3, golfslag: 3, teknikk: 2, fysisk: 2 },
      activities: ['Konkurranseforberedelse', 'Banespill utland', 'Strategitrening', 'Rutinebygging'],
      learningPhase: 'L4-L5',
      clubSpeed: 'CS80-100',
      setting: 'S5-S8',
      tournaments: ['Treningssamling Portugal'],
      benchmark: [9, 12],
    },
    {
      month: 'April',
      weeks: [14, 15, 16, 17],
      period: 'S',
      focus: { konkurranse: 2, spill: 3, golfslag: 2, teknikk: 2, fysisk: 1 },
      activities: ['Sesongoppstart', 'Første turneringer', 'Banestrategi', 'Fokus-trening'],
      learningPhase: 'L4-L5',
      clubSpeed: 'CS90-100',
      setting: 'S6-S9',
      tournaments: ['Olyo Tour 1', 'Klubbmesterskap'],
      benchmark: [15],
    },
    {
      month: 'Mai',
      weeks: [18, 19, 20, 21, 22],
      period: 'T',
      focus: { konkurranse: 3, spill: 3, golfslag: 2, teknikk: 1, fysisk: 1 },
      activities: ['Olyo Tour', 'Klubbmesterskap', 'Vedlikeholdstrening', 'Resultatfokus'],
      learningPhase: 'L5',
      clubSpeed: 'CS100',
      setting: 'S8-S10',
      tournaments: ['Olyo Tour 2', 'Olyo Tour 3'],
      benchmark: [18, 21],
    },
    {
      month: 'Juni',
      weeks: [23, 24, 25, 26],
      period: 'T',
      focus: { konkurranse: 3, spill: 3, golfslag: 2, teknikk: 1, fysisk: 1 },
      activities: ['Hovedturneringer', 'Regionsmesterskap', 'Kortspill-vedlikehold', 'Mental styrke'],
      learningPhase: 'L5',
      clubSpeed: 'CS100',
      setting: 'S9-S10',
      tournaments: ['Regionsmesterskap', 'Junior Tour'],
      benchmark: [24],
    },
    {
      month: 'Juli',
      weeks: [27, 28, 29, 30, 31],
      period: 'T',
      focus: { konkurranse: 3, spill: 3, golfslag: 2, teknikk: 1, fysisk: 1 },
      activities: ['NM', 'Skandinavisk turnering', 'Toppform', 'Prestasjonsfokus'],
      learningPhase: 'L5',
      clubSpeed: 'CS100',
      setting: 'S10',
      tournaments: ['NM Junior', 'Skandinavisk Mesterskap', 'Olyo Tour Finale'],
      benchmark: [27, 30],
    },
    {
      month: 'August',
      weeks: [32, 33, 34, 35],
      period: 'T',
      focus: { konkurranse: 3, spill: 3, golfslag: 2, teknikk: 1, fysisk: 1 },
      activities: ['Avsluttende turneringer', 'Junior Tour finale', 'Sesongavslutning', 'Evaluering'],
      learningPhase: 'L5',
      clubSpeed: 'CS100',
      setting: 'S9-S10',
      tournaments: ['Junior Tour Finale'],
      benchmark: [33],
    },
    {
      month: 'September',
      weeks: [36, 37, 38, 39],
      period: 'E',
      focus: { konkurranse: 1, spill: 2, golfslag: 2, teknikk: 2, fysisk: 2 },
      activities: ['Sesongevaluering', 'Avsluttende turneringer', 'Restitusjon', 'Planlegging neste år'],
      learningPhase: 'L4-L5',
      clubSpeed: 'CS80-100',
      setting: 'S5-S8',
      tournaments: [],
      benchmark: [36, 39],
    },
  ];

  // Use API data if available, otherwise use default
  const yearPlan = apiAnnualPlan || defaultYearPlan;

  // Focus areas config
  const focusAreas = [
    { key: 'konkurranse', label: 'Konkurranse', icon: '🏆' },
    { key: 'spill', label: 'Spill', icon: '⛳' },
    { key: 'golfslag', label: 'Golfslag', icon: '🎯' },
    { key: 'teknikk', label: 'Teknikk', icon: '⚙️' },
    { key: 'fysisk', label: 'Fysisk', icon: '💪' },
  ];

  // Current month calculation (simulated)
  const currentMonthIndex = 2; // December

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
      {/* Header */}
      <PageHeader
        title="Årsplan 2026"
        subtitle="Team Norway"
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', padding: '4px' }}>
            <button
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedView === 'timeline' ? 'var(--bg-primary)' : 'transparent',
                color: selectedView === 'timeline' ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: selectedView === 'timeline' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              }}
              onClick={() => setSelectedView('timeline')}
            >
              Tidslinje
            </button>
            <button
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedView === 'grid' ? 'var(--bg-primary)' : 'transparent',
                color: selectedView === 'grid' ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: selectedView === 'grid' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              }}
              onClick={() => setSelectedView('grid')}
            >
              Rutenett
            </button>
          </div>
        }
      />

      <div style={{ padding: '24px', maxWidth: '1536px', margin: '0 auto' }}>
        {/* Player Summary Card */}
        <Card className="mb-6 bg-gradient-to-r from-ak-primary to-ak-primary-light text-white border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={player.name} size={56} />
              <div>
                <SectionTitle className="text-[20px] font-bold">{player.name}</SectionTitle>
                <p className="text-white/70 text-[13px]">{player.club}</p>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-white/60 text-[11px] uppercase tracking-wide">Kategori</p>
                <p className="text-[24px] font-bold">{player.category}</p>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-[11px] uppercase tracking-wide">Snitt</p>
                <p className="text-[24px] font-bold">{player.avgScore}</p>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-[11px] uppercase tracking-wide">Målscore</p>
                <p className="text-[24px] font-bold text-ak-gold">{player.targetScore}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Period Legend */}
        <div className="mb-6 flex flex-wrap items-center gap-6">
          <span className="text-[12px] text-ak-steel font-medium uppercase tracking-wide">Perioder:</span>
          {Object.entries(periodConfig).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: val.color }} />
              <span className="text-[13px] text-ak-charcoal">{val.name}</span>
            </div>
          ))}
          <div className="h-4 w-px bg-ak-mist" />
          <span className="text-[12px] text-ak-steel font-medium uppercase tracking-wide">Prioritet:</span>
          {[3, 2, 1].map(p => (
            <div key={p} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: priorityLabels[p].color }} />
              <span className="text-[13px] text-ak-charcoal">{priorityLabels[p].label}</span>
            </div>
          ))}
        </div>

        {/* Timeline/Grid View */}
        {selectedView === 'timeline' ? (
          // Timeline View
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[120px] top-0 bottom-0 w-0.5 bg-ak-mist" />

            <div className="space-y-4">
              {yearPlan.map((month, idx) => {
                const period = periodConfig[month.period];
                const isCurrentMonth = idx === currentMonthIndex;
                const isExpanded = selectedMonth === idx;

                return (
                  <div key={month.month} className="relative">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-[112px] w-4 h-4 rounded-full border-4 border-white z-10 ${
                        isCurrentMonth ? 'ring-4 ring-ak-primary/20' : ''
                      }`}
                      style={{ backgroundColor: period.color, top: '24px' }}
                    />

                    <div className="flex gap-4">
                      {/* Month Label */}
                      <div className="w-[100px] text-right pt-4">
                        <p className={`text-[15px] font-semibold ${isCurrentMonth ? 'text-ak-primary' : 'text-ak-charcoal'}`}>
                          {month.month}
                        </p>
                        <p className="text-[11px] text-ak-steel">Uke {month.weeks[0]}-{month.weeks[month.weeks.length - 1]}</p>
                      </div>

                      {/* Content Card */}
                      <Card
                        className={`flex-1 ml-8 cursor-pointer transition-all ${
                          isCurrentMonth ? 'ring-2 ring-ak-primary/20' : ''
                        } ${isExpanded ? 'shadow-lg' : 'hover:shadow-md'}`}
                        onClick={() => setSelectedMonth(isExpanded ? null : idx)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge color={period.color} bg={period.bg}>
                              {period.icon} {period.name}
                            </Badge>
                            {month.benchmark.length > 0 && (
                              <Badge color={'var(--achievement)'} bg={`${'var(--achievement)'}15`}>
                                📊 Benchmark: Uke {month.benchmark.join(', ')}
                              </Badge>
                            )}
                          </div>
                          <Icons.ChevronDown />
                        </div>

                        {/* Focus Areas */}
                        <div className="grid grid-cols-5 gap-4 mb-4">
                          {focusAreas.map(area => (
                            <div key={area.key} className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[12px]">{area.icon}</span>
                                <span className="text-[12px] text-ak-charcoal">{area.label}</span>
                              </div>
                              <PriorityBar value={month.focus[area.key]} color={priorityLabels[month.focus[area.key]]?.color || 'var(--border-default)'} />
                            </div>
                          ))}
                        </div>

                        {/* AK Parameters */}
                        <div className="flex gap-4 mb-3">
                          <div className="bg-ak-snow rounded-lg px-3 py-2 text-center">
                            <p className="text-[10px] text-ak-steel uppercase">Læringsfase</p>
                            <p className="text-[13px] font-semibold text-ak-charcoal">{month.learningPhase}</p>
                          </div>
                          <div className="bg-ak-snow rounded-lg px-3 py-2 text-center">
                            <p className="text-[10px] text-ak-steel uppercase">Clubspeed</p>
                            <p className="text-[13px] font-semibold text-ak-charcoal">{month.clubSpeed}</p>
                          </div>
                          <div className="bg-ak-snow rounded-lg px-3 py-2 text-center">
                            <p className="text-[10px] text-ak-steel uppercase">Setting</p>
                            <p className="text-[13px] font-semibold text-ak-charcoal">{month.setting}</p>
                          </div>
                        </div>

                        {/* Tournaments */}
                        {month.tournaments.length > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            <Icons.Flag />
                            <span className="text-[12px] text-ak-charcoal">
                              {month.tournaments.join(' · ')}
                            </span>
                          </div>
                        )}

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-ak-mist">
                            <CardTitle className="text-[12px] text-ak-steel uppercase tracking-wide mb-2">Aktiviteter</CardTitle>
                            <div className="grid grid-cols-2 gap-2">
                              {month.activities.map((activity, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: period.color }} />
                                  <span className="text-[13px] text-ak-charcoal">{activity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {yearPlan.map((month, idx) => {
              const period = periodConfig[month.period];
              const isCurrentMonth = idx === currentMonthIndex;

              return (
                <Card
                  key={month.month}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isCurrentMonth ? 'ring-2 ring-ak-primary' : ''
                  }`}
                  onClick={() => setSelectedMonth(selectedMonth === idx ? null : idx)}
                >
                  {/* Header */}
                  <div
                    className="p-3 -mx-4 -mt-4 mb-3 rounded-t-xl"
                    style={{ background: `linear-gradient(135deg, ${period.color}15, ${period.color}05)` }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <SubSectionTitle className="text-[17px] font-semibold text-ak-charcoal">{month.month}</SubSectionTitle>
                        <p className="text-[11px] text-ak-steel">Uke {month.weeks[0]}-{month.weeks[month.weeks.length - 1]}</p>
                      </div>
                      <Badge color={period.color} bg={period.bg}>
                        {period.name}
                      </Badge>
                    </div>
                  </div>

                  {/* Focus Areas */}
                  <div className="space-y-2 mb-4">
                    {focusAreas.map(area => (
                      <div key={area.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px]">{area.icon}</span>
                          <span className="text-[12px] text-ak-charcoal">{area.label}</span>
                        </div>
                        <PriorityBar value={month.focus[area.key]} color={priorityLabels[month.focus[area.key]]?.color || 'var(--border-default)'} />
                      </div>
                    ))}
                  </div>

                  {/* Parameters */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-ak-snow rounded-lg p-2">
                      <p className="text-[9px] text-ak-steel">L-fase</p>
                      <p className="text-[11px] font-semibold text-ak-charcoal">{month.learningPhase}</p>
                    </div>
                    <div className="bg-ak-snow rounded-lg p-2">
                      <p className="text-[9px] text-ak-steel">CS</p>
                      <p className="text-[11px] font-semibold text-ak-charcoal">{month.clubSpeed}</p>
                    </div>
                    <div className="bg-ak-snow rounded-lg p-2">
                      <p className="text-[9px] text-ak-steel">Setting</p>
                      <p className="text-[11px] font-semibold text-ak-charcoal">{month.setting}</p>
                    </div>
                  </div>

                  {/* Benchmark indicator */}
                  {month.benchmark.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-ak-mist">
                      <div className="flex items-center gap-1.5 text-[11px] text-ak-gold">
                        <Icons.Target />
                        <span>Benchmark: Uke {month.benchmark.join(', ')}</span>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Five Process Summary */}
        <Card className="mt-8">
          <SectionTitle className="text-[18px] font-bold text-ak-charcoal mb-6 text-center">Fem-prosess Arsoversikt</SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { name: 'Teknisk', icon: '⚙️', color: 'var(--accent)', desc: 'Sving, slag, teknikk' },
              { name: 'Fysisk', icon: '💪', color: 'var(--success)', desc: 'Styrke, utholdenhet, mobilitet' },
              { name: 'Mental', icon: '🧠', color: 'rgba(var(--accent-rgb), 0.8)', desc: 'Fokus, visualisering, rutiner' },
              { name: 'Strategisk', icon: '🎯', color: 'var(--achievement)', desc: 'Banestrategi, beslutninger' },
              { name: 'Sosial', icon: '👥', color: 'var(--warning)', desc: 'Team, kommunikasjon, nettverk' },
            ].map(process => (
              <div
                key={process.name}
                className="bg-ak-snow rounded-xl p-4 text-center border border-ak-mist"
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${process.color}15` }}
                >
                  {process.icon}
                </div>
                <SubSectionTitle className="font-semibold text-ak-charcoal">{process.name}</SubSectionTitle>
                <p className="text-[11px] text-ak-steel mt-1">{process.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="text-center py-6">
        <p className="text-[12px] text-ak-steel">
          Team Norway Golf — Individuell Utviklingsplan
        </p>
      </footer>
    </div>
  );
};

export default AKGolfAarsplan;
