import React, { useState } from 'react';
import {
  Calendar, Star, ChevronRight, Plus, Target,
  Award, MapPin, CheckCircle,
  AlertCircle
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';

// ============================================================================
// MOCK DATA
// ============================================================================

const TOURNAMENT_EVALUATIONS = [
  {
    id: 't1',
    tournamentName: 'Varturneringen 2025',
    date: '2025-03-15',
    course: 'Holtsmark GK',
    position: 3,
    field: 42,
    rounds: [74, 72, 71],
    total: 217,
    toPar: '+1',
    rating: 4,
    mentalRating: 4,
    physicalRating: 4,
    technicalRating: 3,
    strengths: ['Putting var solid', 'God course management', 'Holdt seg rolig under press'],
    weaknesses: ['Misset noen fairways pa dag 1', 'Kort spill var litt ustabilt'],
    keyMoments: [
      'Birdie pa 18 dag 2 for a komme inn i topp 5',
      'Redning fra bunker pa 16 siste dag',
    ],
    notes: 'Veldig fornord med turneringen. Var konsistent alle tre dagene og forbedret meg for hver runde.',
    coachAnalysis: 'Meget bra turnering! Du viste at du kan prestere under press. Fokusomrade: Tee-shots pa trange hull.',
    stats: {
      fairways: 65,
      gir: 72,
      puttsPerRound: 29,
      scrambling: 60,
    },
  },
  {
    id: 't2',
    tournamentName: 'Sesongapning',
    date: '2025-02-10',
    course: 'Tyrifjord GK',
    position: 1,
    field: 35,
    rounds: [71],
    total: 71,
    toPar: '-1',
    rating: 5,
    mentalRating: 5,
    physicalRating: 4,
    technicalRating: 5,
    strengths: ['Alt klaffet', 'Utmerket ballstriking', 'Aggressiv men smart strategi'],
    weaknesses: [],
    keyMoments: [
      'Eagle pa par 5 hull 7',
      'Clutch par save pa 17 for a holde ledelsen',
    ],
    notes: 'Beste turneringen pa lenge. Folte meg trygg fra forste hull.',
    coachAnalysis: 'Fantastisk prestasjon! Du spilte med selvtillit og tok gode valg hele veien.',
    stats: {
      fairways: 71,
      gir: 78,
      puttsPerRound: 28,
      scrambling: 100,
    },
  },
  {
    id: 't3',
    tournamentName: 'NGF Tour - Runde 1',
    date: '2025-02-28',
    course: 'Drammens GK',
    position: 12,
    field: 78,
    rounds: [75, 73],
    total: 148,
    toPar: '+4',
    rating: 3,
    mentalRating: 2,
    physicalRating: 4,
    technicalRating: 3,
    strengths: ['Fysisk utholdende', 'Forbedring dag 2'],
    weaknesses: ['Slet med nervositet dag 1', 'For mange 3-putter', 'Darllige valg i treskudd'],
    keyMoments: [
      'Trippelbogey pa hull 3 dag 1 odela starten',
      'God comeback back 9 dag 2',
    ],
    notes: 'Vanskelig turnering mentalt. Forste dag var jeg alt for nervos. Dag 2 var mye bedre.',
    coachAnalysis: 'Lærdom: Fokuser pa pre-shot rutine for a roe ned nervene. Putting pa lengre distanser trenger arbeid.',
    stats: {
      fairways: 58,
      gir: 64,
      puttsPerRound: 32,
      scrambling: 45,
    },
  },
  {
    id: 't4',
    tournamentName: 'Vinterturneringen',
    date: '2025-01-25',
    course: 'Miklagard Golf',
    position: 8,
    field: 48,
    rounds: [73, 74],
    total: 147,
    toPar: '+3',
    rating: 3,
    mentalRating: 3,
    physicalRating: 3,
    technicalRating: 4,
    strengths: ['Solid ballstriking', 'Gode jern-slag'],
    weaknesses: ['Putting var inkonsistent', 'Mistet fokus pa back 9 dag 2'],
    keyMoments: [
      'God start med par-par-birdie',
      'Tre bogeys pa rad dag 2 back 9',
    ],
    notes: 'Ok turnering, men mistet noen muligheter. Putting ma forbedres.',
    coachAnalysis: 'Teknikken er pa plass. Mental utholdenhet over 36 hull er neste steg.',
    stats: {
      fairways: 60,
      gir: 66,
      puttsPerRound: 31,
      scrambling: 50,
    },
  },
];

const SEASON_STATS = {
  tournaments: 8,
  wins: 1,
  topThrees: 2,
  topTens: 4,
  avgPosition: 9,
  avgRating: 3.6,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ============================================================================
// RATING COMPONENT
// ============================================================================

const RatingStars = ({ rating, size = 14 }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={size}
        fill={star <= rating ? tokens.colors.gold : 'none'}
        color={star <= rating ? tokens.colors.gold : tokens.colors.mist}
      />
    ))}
  </div>
);

// ============================================================================
// TOURNAMENT EVALUATION CARD
// ============================================================================

const TournamentEvaluationCard = ({ evaluation, onClick }) => {
  const isWin = evaluation.position === 1;
  const isTopThree = evaluation.position <= 3;

  return (
    <div
      onClick={() => onClick(evaluation)}
      style={{
        backgroundColor: tokens.colors.white,
        borderRadius: '16px',
        padding: '18px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: isWin ? `2px solid ${tokens.colors.gold}` : '2px solid transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        {/* Position Badge */}
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          backgroundColor: isTopThree ? `${tokens.colors.gold}15` : tokens.colors.snow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {isTopThree ? (
            <Award size={24} color={tokens.colors.gold} />
          ) : (
            <span style={{ fontSize: '18px', fontWeight: 700, color: tokens.colors.charcoal }}>
              {evaluation.position}
            </span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: tokens.colors.charcoal,
                margin: 0,
              }}>
                {evaluation.tournamentName}
              </h3>
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
                  {formatDate(evaluation.date)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} />
                  {evaluation.course}
                </span>
              </div>
            </div>
            <RatingStars rating={evaluation.rating} />
          </div>

          {/* Score Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
          }}>
            <div style={{
              padding: '8px 12px',
              backgroundColor: tokens.colors.snow,
              borderRadius: '8px',
            }}>
              <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Plassering</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: tokens.colors.charcoal }}>
                {evaluation.position}/{evaluation.field}
              </div>
            </div>
            <div style={{
              padding: '8px 12px',
              backgroundColor: tokens.colors.snow,
              borderRadius: '8px',
            }}>
              <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Score</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: tokens.colors.charcoal }}>
                {evaluation.total} ({evaluation.toPar})
              </div>
            </div>
            <div style={{
              padding: '8px 12px',
              backgroundColor: tokens.colors.snow,
              borderRadius: '8px',
            }}>
              <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Runder</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: tokens.colors.charcoal }}>
                {evaluation.rounds.join(' - ')}
              </div>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Target size={14} color={tokens.colors.primary} />
              <span style={{ fontSize: '12px', color: tokens.colors.steel }}>Teknikk:</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: tokens.colors.charcoal }}>
                {evaluation.technicalRating}/5
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={14} color={tokens.colors.gold} />
              <span style={{ fontSize: '12px', color: tokens.colors.steel }}>Mental:</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: tokens.colors.charcoal }}>
                {evaluation.mentalRating}/5
              </span>
            </div>
          </div>

          {/* Key Points */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {evaluation.strengths.slice(0, 2).map((strength, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '11px',
                  color: tokens.colors.success,
                  backgroundColor: `${tokens.colors.success}10`,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CheckCircle size={10} />
                {strength}
              </span>
            ))}
            {evaluation.weaknesses.slice(0, 1).map((weakness, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '11px',
                  color: tokens.colors.error,
                  backgroundColor: `${tokens.colors.error}10`,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <AlertCircle size={10} />
                {weakness}
              </span>
            ))}
          </div>
        </div>

        <ChevronRight size={20} color={tokens.colors.steel} style={{ flexShrink: 0 }} />
      </div>
    </div>
  );
};

// ============================================================================
// STATS OVERVIEW COMPONENT
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
        {stats.tournaments}
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
      <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Seiere</div>
    </div>
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '14px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: tokens.colors.gold }}>
        {stats.topThrees}
      </div>
      <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Topp 3</div>
    </div>
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '14px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: tokens.colors.success }}>
        {stats.topTens}
      </div>
      <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Topp 10</div>
    </div>
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '14px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: tokens.colors.charcoal }}>
        {stats.avgPosition}
      </div>
      <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Gj.sn. plass</div>
    </div>
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '14px',
      textAlign: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
        <span style={{ fontSize: '22px', fontWeight: 700, color: tokens.colors.gold }}>
          {stats.avgRating}
        </span>
        <Star size={14} fill={tokens.colors.gold} color={tokens.colors.gold} />
      </div>
      <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Gj.sn. rating</div>
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TurneringsevalueringContainer = () => {
  const [sortBy, setSortBy] = useState('date');

  const sortedEvaluations = [...TOURNAMENT_EVALUATIONS].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'position') return a.position - b.position;
    return 0;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Turneringsevalueringer"
        subtitle="Evaluering av turneringsprestasjoner"
      />

      <div style={{ padding: '16px 24px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Stats */}
        <StatsOverview stats={SEASON_STATS} />

        {/* Filters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: tokens.colors.steel }}>Sorter:</span>
            {[
              { key: 'date', label: 'Dato' },
              { key: 'rating', label: 'Rating' },
              { key: 'position', label: 'Plassering' },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setSortBy(option.key)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: sortBy === option.key ? tokens.colors.primary : tokens.colors.white,
                  color: sortBy === option.key ? tokens.colors.white : tokens.colors.charcoal,
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.white,
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            Ny evaluering
          </button>
        </div>

        {/* Evaluations List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedEvaluations.map((evaluation) => (
            <TournamentEvaluationCard
              key={evaluation.id}
              evaluation={evaluation}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TurneringsevalueringContainer;
