import React, { useState } from 'react';
import {
  Trophy, ChevronRight,
  Target, MapPin
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';

// ============================================================================
// MOCK DATA
// ============================================================================

const TOURNAMENT_RESULTS = [
  {
    id: 't1',
    name: 'Junior Masters Oslo',
    date: '2025-01-12',
    course: 'Oslo Golfklubb',
    type: 'ranking',
    rounds: 2,
    scores: [72, 70],
    total: 142,
    par: 144,
    position: 3,
    participants: 48,
    earnings: 5000,
    rankingPoints: 150,
  },
  {
    id: 't2',
    name: 'Asker Open',
    date: '2025-01-05',
    course: 'Asker Golfklubb',
    type: 'club',
    rounds: 1,
    scores: [74],
    total: 74,
    par: 72,
    position: 5,
    participants: 32,
    earnings: 0,
    rankingPoints: 80,
  },
  {
    id: 't3',
    name: 'Vintercup Finale',
    date: '2024-12-15',
    course: 'Bogstad Golfklubb',
    type: 'ranking',
    rounds: 3,
    scores: [71, 73, 69],
    total: 213,
    par: 216,
    position: 1,
    participants: 56,
    earnings: 15000,
    rankingPoints: 300,
  },
  {
    id: 't4',
    name: 'Junior Tour Runde 4',
    date: '2024-12-01',
    course: 'Drammen Golfklubb',
    type: 'tour',
    rounds: 2,
    scores: [75, 72],
    total: 147,
    par: 144,
    position: 8,
    participants: 42,
    earnings: 2000,
    rankingPoints: 60,
  },
  {
    id: 't5',
    name: 'Hostturnering NGF',
    date: '2024-11-15',
    course: 'Miklagard Golfklubb',
    type: 'ranking',
    rounds: 2,
    scores: [73, 74],
    total: 147,
    par: 144,
    position: 12,
    participants: 64,
    earnings: 1000,
    rankingPoints: 45,
  },
];

const STATS = {
  totalTournaments: 15,
  wins: 2,
  top3: 5,
  top10: 11,
  avgPosition: 6.8,
  avgScore: 72.4,
  bestRound: 69,
  totalEarnings: 28000,
  totalPoints: 1250,
};

// ============================================================================
// HELPERS
// ============================================================================

const getTypeConfig = (type) => {
  switch (type) {
    case 'ranking':
      return { label: 'Ranking', color: tokens.colors.gold };
    case 'tour':
      return { label: 'Tour', color: tokens.colors.primary };
    case 'club':
      return { label: 'Klubb', color: tokens.colors.success };
    default:
      return { label: type, color: tokens.colors.steel };
  }
};

const getPositionColor = (position) => {
  if (position === 1) return tokens.colors.gold;
  if (position === 2) return '#C0C0C0';
  if (position === 3) return '#CD7F32';
  if (position <= 10) return tokens.colors.primary;
  return tokens.colors.steel;
};

// ============================================================================
// RESULT CARD
// ============================================================================

const ResultCard = ({ result, onClick }) => {
  const typeConfig = getTypeConfig(result.type);
  const scoreToPar = result.total - result.par;

  return (
    <div
      onClick={() => onClick(result)}
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px',
          }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: `${typeConfig.color}20`,
              color: typeConfig.color,
            }}>
              {typeConfig.label}
            </span>
            <span style={{ fontSize: '12px', color: tokens.colors.steel }}>
              {new Date(result.date).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: tokens.colors.charcoal,
            margin: 0,
          }}>
            {result.name}
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '4px',
            fontSize: '12px',
            color: tokens.colors.steel,
          }}>
            <MapPin size={12} />
            {result.course}
          </div>
        </div>

        {/* Position Badge */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: `${getPositionColor(result.position)}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 700,
            color: getPositionColor(result.position),
          }}>
            {result.position}
          </div>
          <span style={{ fontSize: '10px', color: tokens.colors.steel }}>
            av {result.participants}
          </span>
        </div>
      </div>

      {/* Scores */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '12px',
        backgroundColor: tokens.colors.snow,
        borderRadius: '10px',
        marginBottom: '12px',
      }}>
        <div>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Runder</div>
          <div style={{ fontSize: '14px', fontWeight: 500, color: tokens.colors.charcoal }}>
            {result.scores.join(' + ')}
          </div>
        </div>
        <div style={{ borderLeft: `1px solid ${tokens.colors.mist}`, height: '30px' }} />
        <div>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Total</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: tokens.colors.charcoal }}>
            {result.total}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Til par</div>
          <div style={{
            fontSize: '16px',
            fontWeight: 600,
            color: scoreToPar < 0 ? tokens.colors.success :
                   scoreToPar > 0 ? tokens.colors.error : tokens.colors.charcoal,
          }}>
            {scoreToPar === 0 ? 'E' : scoreToPar > 0 ? `+${scoreToPar}` : scoreToPar}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          gap: '16px',
        }}>
          {result.rankingPoints > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Target size={14} color={tokens.colors.primary} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: tokens.colors.primary }}>
                +{result.rankingPoints} poeng
              </span>
            </div>
          )}
          {result.earnings > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Trophy size={14} color={tokens.colors.gold} />
              <span style={{ fontSize: '12px', fontWeight: 500, color: tokens.colors.gold }}>
                {result.earnings.toLocaleString()} kr
              </span>
            </div>
          )}
        </div>
        <ChevronRight size={18} color={tokens.colors.steel} />
      </div>
    </div>
  );
};

// ============================================================================
// STATS OVERVIEW
// ============================================================================

const StatsOverview = ({ stats }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '10px',
    marginBottom: '24px',
  }}>
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '14px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: tokens.colors.primary }}>
        {stats.totalTournaments}
      </div>
      <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Turneringer</div>
    </div>
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '14px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: tokens.colors.gold }}>
        {stats.wins}
      </div>
      <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Seire</div>
    </div>
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '14px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: tokens.colors.success }}>
        {stats.top3}
      </div>
      <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Topp 3</div>
    </div>
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '14px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: tokens.colors.charcoal }}>
        {stats.avgScore}
      </div>
      <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Snitt score</div>
    </div>
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '14px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: tokens.colors.error }}>
        {stats.bestRound}
      </div>
      <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Beste runde</div>
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TurneringsResultaterContainer = () => {
  const [filter, setFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'Alle' },
    { key: 'ranking', label: 'Ranking' },
    { key: 'tour', label: 'Tour' },
    { key: 'club', label: 'Klubb' },
  ];

  const filteredResults = TOURNAMENT_RESULTS.filter(
    (r) => filter === 'all' || r.type === filter
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Turneringsresultater"
        subtitle="Dine resultater og statistikk"
      />

      <div style={{ padding: '16px 24px 24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Stats */}
        <StatsOverview stats={STATS} />

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '20px',
          overflowX: 'auto',
        }}>
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: filter === f.key ? tokens.colors.primary : tokens.colors.white,
                color: filter === f.key ? tokens.colors.white : tokens.colors.charcoal,
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredResults.map((result) => (
            <ResultCard
              key={result.id}
              result={result}
              onClick={() => { /* TODO: Navigate to result detail */ }}
            />
          ))}

          {filteredResults.length === 0 && (
            <div style={{
              backgroundColor: tokens.colors.white,
              borderRadius: '14px',
              padding: '40px',
              textAlign: 'center',
            }}>
              <Trophy size={40} color={tokens.colors.steel} style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '14px', color: tokens.colors.steel, margin: 0 }}>
                Ingen resultater funnet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TurneringsResultaterContainer;
