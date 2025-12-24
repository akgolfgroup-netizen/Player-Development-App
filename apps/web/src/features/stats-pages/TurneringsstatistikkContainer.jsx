import React, { useState } from 'react';
import {
  Trophy, TrendingUp, TrendingDown, Target, ChevronRight,
  Calendar, MapPin, Award, BarChart2
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';

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

const StatCard = ({ label, value, subValue, icon: Icon, color }) => (
  <div style={{
    backgroundColor: tokens.colors.white,
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
  }}>
    <div style={{
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      backgroundColor: `${color}15`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 10px',
    }}>
      <Icon size={18} color={color} />
    </div>
    <div style={{ fontSize: '22px', fontWeight: 700, color: tokens.colors.charcoal }}>
      {value}
    </div>
    <div style={{ fontSize: '12px', color: tokens.colors.steel }}>{label}</div>
    {subValue && (
      <div style={{ fontSize: '11px', color: tokens.colors.primary, marginTop: '4px' }}>
        {subValue}
      </div>
    )}
  </div>
);

// ============================================================================
// TREND INDICATOR COMPONENT
// ============================================================================

const TrendIndicator = ({ trend, current, previous, label, unit = '' }) => {
  const isImproving = trend === 'improving';
  const diff = Math.abs(current - previous).toFixed(1);

  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div>
        <div style={{ fontSize: '13px', color: tokens.colors.steel }}>{label}</div>
        <div style={{ fontSize: '18px', fontWeight: 600, color: tokens.colors.charcoal }}>
          {current}{unit}
        </div>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        borderRadius: '6px',
        backgroundColor: isImproving ? `${tokens.colors.success}15` : `${tokens.colors.error}15`,
      }}>
        {isImproving ? (
          <TrendingUp size={14} color={tokens.colors.success} />
        ) : (
          <TrendingDown size={14} color={tokens.colors.error} />
        )}
        <span style={{
          fontSize: '12px',
          fontWeight: 500,
          color: isImproving ? tokens.colors.success : tokens.colors.error,
        }}>
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
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}>
      {/* Position */}
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '10px',
        backgroundColor: isTopThree ? `${tokens.colors.gold}15` : tokens.colors.snow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {isTopThree ? (
          <Award size={20} color={tokens.colors.gold} />
        ) : (
          <span style={{ fontSize: '16px', fontWeight: 600, color: tokens.colors.charcoal }}>
            {tournament.position}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal }}>
          {tournament.name}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginTop: '4px',
          fontSize: '12px',
          color: tokens.colors.steel,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} />
            {tournament.date}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} />
            {tournament.course}
          </span>
        </div>
      </div>

      {/* Rounds */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {tournament.rounds.map((round, idx) => (
          <span
            key={idx}
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: round <= 72 ? tokens.colors.success : tokens.colors.charcoal,
              backgroundColor: tokens.colors.snow,
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            {round}
          </span>
        ))}
      </div>

      {/* Score */}
      <div style={{ textAlign: 'right', minWidth: '80px' }}>
        <div style={{ fontSize: '16px', fontWeight: 600, color: tokens.colors.charcoal }}>
          {tournament.total}
        </div>
        <div style={{
          fontSize: '12px',
          color: tournament.toPar.startsWith('-') ? tokens.colors.success : tokens.colors.error,
        }}>
          {tournament.toPar}
        </div>
      </div>

      {/* Earnings */}
      {tournament.earnings > 0 && (
        <div style={{
          fontSize: '13px',
          fontWeight: 500,
          color: tokens.colors.gold,
          minWidth: '70px',
          textAlign: 'right',
        }}>
          {tournament.earnings.toLocaleString('nb-NO')} kr
        </div>
      )}

      <ChevronRight size={16} color={tokens.colors.steel} />
    </div>
  );
};

// ============================================================================
// CATEGORY STATS COMPONENT
// ============================================================================

const CategoryStatsCard = ({ title, stats, fields }) => (
  <div style={{
    backgroundColor: tokens.colors.white,
    borderRadius: '12px',
    padding: '16px',
  }}>
    <h3 style={{
      fontSize: '14px',
      fontWeight: 600,
      color: tokens.colors.charcoal,
      margin: '0 0 12px 0',
    }}>
      {title}
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {fields.map((field, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '13px', color: tokens.colors.steel }}>{field.label}</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal }}>
            {field.value}{field.unit || ''}
          </span>
        </div>
      ))}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '8px',
        borderTop: `1px solid ${tokens.colors.mist}`,
      }}>
        <span style={{ fontSize: '12px', color: tokens.colors.steel }}>Tour-ranking</span>
        <span style={{
          fontSize: '13px',
          fontWeight: 600,
          color: tokens.colors.primary,
        }}>
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
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Turneringsstatistikk"
        subtitle={`Sesong ${selectedSeason}`}
      />

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Season Selector */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
        }}>
          {[2025, 2024, 2023].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedSeason(year)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: selectedSeason === year ? tokens.colors.primary : tokens.colors.white,
                color: selectedSeason === year ? tokens.colors.white : tokens.colors.charcoal,
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Overview Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <StatCard
            label="Turneringer"
            value={stats.overview.tournamentsPlayed}
            icon={Trophy}
            color={tokens.colors.primary}
          />
          <StatCard
            label="Seiere"
            value={stats.overview.wins}
            icon={Award}
            color={tokens.colors.gold}
          />
          <StatCard
            label="Topp 10"
            value={stats.overview.topTens}
            icon={TrendingUp}
            color={tokens.colors.success}
          />
          <StatCard
            label="Gj.sn. score"
            value={stats.overview.avgScore.toFixed(1)}
            icon={Target}
            color={tokens.colors.primary}
          />
          <StatCard
            label="Gj.sn. plassering"
            value={stats.overview.avgPosition}
            icon={BarChart2}
            color={tokens.colors.steel}
          />
          <StatCard
            label="Premiepenger"
            value={`${(stats.overview.totalEarnings / 1000).toFixed(1)}k`}
            subValue="kr"
            icon={Award}
            color={tokens.colors.gold}
          />
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '24px',
        }}>
          {/* Left: Tournament List */}
          <div>
            <h2 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
              margin: '0 0 16px 0',
            }}>
              Turneringshistorikk
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats.tournaments.map((tournament) => (
                <TournamentRow key={tournament.id} tournament={tournament} />
              ))}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Trends */}
            <div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: 600,
                color: tokens.colors.charcoal,
                margin: '0 0 12px 0',
              }}>
                Utvikling fra forrige sesong
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
