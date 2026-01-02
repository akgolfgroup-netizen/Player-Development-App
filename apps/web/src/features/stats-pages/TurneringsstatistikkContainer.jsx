/**
 * TurneringsstatistikkContainer.jsx
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */
import React, { useState } from 'react';
import {
  Trophy, TrendingUp, TrendingDown, Target, ChevronRight,
  Calendar, MapPin, Award, BarChart2
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { SectionTitle, SubSectionTitle } from '../../components/typography';

// Color class mapping
const COLOR_CLASSES = {
  brand: { text: 'text-ak-brand-primary', bg: 'bg-ak-brand-primary/15' },
  success: { text: 'text-ak-status-success', bg: 'bg-ak-status-success/15' },
  warning: { text: 'text-ak-status-warning', bg: 'bg-ak-status-warning/15' },
  error: { text: 'text-ak-status-error', bg: 'bg-ak-status-error/15' },
  secondary: { text: 'text-ak-text-secondary', bg: 'bg-ak-surface-subtle' },
};

// ============================================================================
// MOCK DATA
// ============================================================================

const TOURNAMENT_STATS = {
  season: 2025,
  overview: {
    tournamentsPlayed: 8,
    wins: 1,
    topTens: 4,
    avgScore: 73.2,
    avgPosition: 12,
    bestFinish: 1,
    worstFinish: 28,
    totalEarnings: 15500,
  },
  trends: {
    scoring: { current: 73.2, previous: 74.8, trend: 'improving' },
    fairways: { current: 62, previous: 58, trend: 'improving' },
    gir: { current: 68, previous: 65, trend: 'improving' },
    puttsPerRound: { current: 30.5, previous: 31.2, trend: 'improving' },
  },
  tournaments: [
    {
      id: 't1',
      name: 'Varturneringen 2025',
      date: '2025-03-15',
      course: 'Holtsmark GK',
      position: 3,
      field: 42,
      rounds: [74, 72, 71],
      total: 217,
      toPar: '+1',
      earnings: 3500,
      stats: { fairways: 65, gir: 72, putts: 89 },
    },
    {
      id: 't2',
      name: 'NGF Tour - Runde 1',
      date: '2025-02-28',
      course: 'Drammens GK',
      position: 12,
      field: 78,
      rounds: [75, 73],
      total: 148,
      toPar: '+4',
      earnings: 1500,
      stats: { fairways: 58, gir: 64, putts: 62 },
    },
    {
      id: 't3',
      name: 'Sesongapning',
      date: '2025-02-10',
      course: 'Tyrifjord GK',
      position: 1,
      field: 35,
      rounds: [71],
      total: 71,
      toPar: '-1',
      earnings: 5000,
      stats: { fairways: 71, gir: 78, putts: 28 },
    },
    {
      id: 't4',
      name: 'Vinterturneringen',
      date: '2025-01-25',
      course: 'Miklagard Golf',
      position: 8,
      field: 48,
      rounds: [73, 74],
      total: 147,
      toPar: '+3',
      earnings: 2000,
      stats: { fairways: 60, gir: 66, putts: 60 },
    },
  ],
  categoryStats: {
    driving: {
      avgDistance: 268,
      fairwayPct: 62,
      ranking: 15,
    },
    approach: {
      girPct: 68,
      avgProximity: 12.5,
      ranking: 8,
    },
    shortGame: {
      scramblingPct: 55,
      sandSavePct: 42,
      ranking: 22,
    },
    putting: {
      avgPuttsPerRound: 30.5,
      onePuttPct: 32,
      ranking: 12,
    },
  },
};

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

const StatCard = ({ label, value, subValue, icon: Icon, colorKey }) => {
  const colors = COLOR_CLASSES[colorKey] || COLOR_CLASSES.brand;

  return (
    <div className="bg-ak-surface-base rounded-xl p-4 text-center">
      <div className={`w-9 h-9 rounded-[10px] ${colors.bg} flex items-center justify-center mx-auto mb-2.5`}>
        <Icon size={18} className={colors.text} />
      </div>
      <div className="text-[22px] font-bold text-ak-text-primary">
        {value}
      </div>
      <div className="text-xs text-ak-text-secondary">{label}</div>
      {subValue && (
        <div className="text-[11px] text-ak-brand-primary mt-1">
          {subValue}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// TREND INDICATOR COMPONENT
// ============================================================================

const TrendIndicator = ({ trend, current, previous, label, unit = '' }) => {
  const isImproving = trend === 'improving';
  const diff = Math.abs(current - previous).toFixed(1);

  return (
    <div className="bg-ak-surface-base rounded-xl py-3.5 px-4 flex items-center justify-between">
      <div>
        <div className="text-[13px] text-ak-text-secondary">{label}</div>
        <div className="text-lg font-semibold text-ak-text-primary">
          {current}{unit}
        </div>
      </div>
      <div className={`flex items-center gap-1 py-1 px-2 rounded-md ${
        isImproving ? 'bg-ak-status-success/15' : 'bg-ak-status-error/15'
      }`}>
        {isImproving ? (
          <TrendingUp size={14} className="text-ak-status-success" />
        ) : (
          <TrendingDown size={14} className="text-ak-status-error" />
        )}
        <span className={`text-xs font-medium ${
          isImproving ? 'text-ak-status-success' : 'text-ak-status-error'
        }`}>
          {diff}{unit}
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// TOURNAMENT ROW COMPONENT
// ============================================================================

const TournamentRow = ({ tournament }) => {
  const isTopThree = tournament.position <= 3;

  return (
    <div className="bg-ak-surface-base rounded-xl p-4 flex items-center gap-4">
      {/* Position */}
      <div className={`w-11 h-11 rounded-[10px] flex items-center justify-center ${
        isTopThree ? 'bg-ak-status-warning/15' : 'bg-ak-surface-subtle'
      }`}>
        {isTopThree ? (
          <Award size={20} className="text-ak-status-warning" />
        ) : (
          <span className="text-base font-semibold text-ak-text-primary">
            {tournament.position}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="text-sm font-medium text-ak-text-primary">
          {tournament.name}
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-ak-text-secondary">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {tournament.date}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {tournament.course}
          </span>
        </div>
      </div>

      {/* Rounds */}
      <div className="flex gap-1.5">
        {tournament.rounds.map((round, idx) => (
          <span
            key={idx}
            className={`text-xs font-medium bg-ak-surface-subtle py-1 px-2 rounded-md ${
              round <= 72 ? 'text-ak-status-success' : 'text-ak-text-primary'
            }`}
          >
            {round}
          </span>
        ))}
      </div>

      {/* Score */}
      <div className="text-right min-w-[80px]">
        <div className="text-base font-semibold text-ak-text-primary">
          {tournament.total}
        </div>
        <div className={`text-xs ${
          tournament.toPar.startsWith('-') ? 'text-ak-status-success' : 'text-ak-status-error'
        }`}>
          {tournament.toPar}
        </div>
      </div>

      {/* Earnings */}
      {tournament.earnings > 0 && (
        <div className="text-[13px] font-medium text-ak-status-warning min-w-[70px] text-right">
          {tournament.earnings.toLocaleString('nb-NO')} kr
        </div>
      )}

      <ChevronRight size={16} className="text-ak-text-secondary" />
    </div>
  );
};

// ============================================================================
// CATEGORY STATS COMPONENT
// ============================================================================

const CategoryStatsCard = ({ title, stats, fields }) => (
  <div className="bg-ak-surface-base rounded-xl p-4">
    <SubSectionTitle className="text-sm m-0 mb-3">
      {title}
    </SubSectionTitle>
    <div className="flex flex-col gap-2.5">
      {fields.map((field, idx) => (
        <div key={idx} className="flex items-center justify-between">
          <span className="text-[13px] text-ak-text-secondary">{field.label}</span>
          <span className="text-sm font-medium text-ak-text-primary">
            {field.value}{field.unit || ''}
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between pt-2 border-t border-ak-border-default">
        <span className="text-xs text-ak-text-secondary">Tour-ranking</span>
        <span className="text-[13px] font-semibold text-ak-brand-primary">
          #{stats.ranking}
        </span>
      </div>
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TurneringsstatistikkContainer = () => {
  const [selectedSeason, setSelectedSeason] = useState(2025);
  const stats = TOURNAMENT_STATS;

  return (
    <div className="min-h-screen bg-ak-surface-subtle">
      <PageHeader
        title="Turneringsstatistikk"
        subtitle={`Sesong ${selectedSeason}`}
      />

      <div className="p-6 w-full">
        {/* Season Selector */}
        <div className="flex gap-2 mb-5">
          {[2025, 2024, 2023].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedSeason(year)}
              className={`py-2 px-4 rounded-lg border-none text-[13px] font-medium cursor-pointer ${
                selectedSeason === year
                  ? 'bg-ak-brand-primary text-white'
                  : 'bg-ak-surface-base text-ak-text-primary'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 mb-6">
          <StatCard
            label="Turneringer"
            value={stats.overview.tournamentsPlayed}
            icon={Trophy}
            colorKey="brand"
          />
          <StatCard
            label="Seiere"
            value={stats.overview.wins}
            icon={Award}
            colorKey="warning"
          />
          <StatCard
            label="Topp 10"
            value={stats.overview.topTens}
            icon={TrendingUp}
            colorKey="success"
          />
          <StatCard
            label="Gj.sn. score"
            value={stats.overview.avgScore.toFixed(1)}
            icon={Target}
            colorKey="brand"
          />
          <StatCard
            label="Gj.sn. plassering"
            value={stats.overview.avgPosition}
            icon={BarChart2}
            colorKey="secondary"
          />
          <StatCard
            label="Premiepenger"
            value={`${(stats.overview.totalEarnings / 1000).toFixed(1)}k`}
            subValue="kr"
            icon={Award}
            colorKey="warning"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-[1fr_360px] gap-6">
          {/* Left: Tournament List */}
          <div>
            <SectionTitle className="text-base m-0 mb-4">
              Turneringshistorikk
            </SectionTitle>
            <div className="flex flex-col gap-2.5">
              {stats.tournaments.map((tournament) => (
                <TournamentRow key={tournament.id} tournament={tournament} />
              ))}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Trends */}
            <div>
              <SubSectionTitle className="text-sm m-0 mb-3">
                Utvikling fra forrige sesong
              </SubSectionTitle>
              <div className="flex flex-col gap-2">
                <TrendIndicator
                  label="Gj.sn. score"
                  current={stats.trends.scoring.current}
                  previous={stats.trends.scoring.previous}
                  trend={stats.trends.scoring.trend}
                />
                <TrendIndicator
                  label="Fairways %"
                  current={stats.trends.fairways.current}
                  previous={stats.trends.fairways.previous}
                  trend={stats.trends.fairways.trend}
                  unit="%"
                />
                <TrendIndicator
                  label="GIR %"
                  current={stats.trends.gir.current}
                  previous={stats.trends.gir.previous}
                  trend={stats.trends.gir.trend}
                  unit="%"
                />
                <TrendIndicator
                  label="Putter/runde"
                  current={stats.trends.puttsPerRound.current}
                  previous={stats.trends.puttsPerRound.previous}
                  trend={stats.trends.puttsPerRound.trend}
                />
              </div>
            </div>

            {/* Category Stats */}
            <CategoryStatsCard
              title="Driving"
              stats={stats.categoryStats.driving}
              fields={[
                { label: 'Gj.sn. lengde', value: stats.categoryStats.driving.avgDistance, unit: 'm' },
                { label: 'Fairway %', value: stats.categoryStats.driving.fairwayPct, unit: '%' },
              ]}
            />
            <CategoryStatsCard
              title="Approach"
              stats={stats.categoryStats.approach}
              fields={[
                { label: 'GIR %', value: stats.categoryStats.approach.girPct, unit: '%' },
                { label: 'Gj.sn. avstand', value: stats.categoryStats.approach.avgProximity, unit: 'm' },
              ]}
            />
            <CategoryStatsCard
              title="Putting"
              stats={stats.categoryStats.putting}
              fields={[
                { label: 'Putter/runde', value: stats.categoryStats.putting.avgPuttsPerRound },
                { label: 'En-putt %', value: stats.categoryStats.putting.onePuttPct, unit: '%' },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurneringsstatistikkContainer;
