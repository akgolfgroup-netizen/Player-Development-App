import React, { useState } from 'react';
import {
  Dumbbell, Star, ChevronRight, Plus, Target,
  Clock, TrendingUp, Brain, Flag, Flame, CheckCircle
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';

// ============================================================================
// MOCK DATA
// ============================================================================

const TRAINING_EVALUATIONS = [
  {
    id: 't1',
    date: '2025-01-15',
    sessionType: 'technical',
    sessionName: 'Driver-trening',
    duration: 90,
    rating: 4,
    energyLevel: 4,
    focus: 'Tempo og sekvens',
    achievements: ['Ny toppfart 110 mph', 'Konsistent ballbane'],
    challenges: ['Litt inkonsistent pa impact'],
    notes: 'God okt totalt sett. Tempoet er mye bedre etter forrige ukes arbeid.',
    coachFeedback: 'Bra jobba! Fokuser pa a holde venstre arm rett lengre i nedsvingen.',
    drillsCompleted: ['Alignment drill', 'Tempo drill 1-2-3', 'Full sving med mal'],
    metrics: { ballSpeed: '158 mph', clubSpeed: '108 mph', smash: '1.46' },
  },
  {
    id: 't2',
    date: '2025-01-13',
    sessionType: 'short_game',
    sessionName: 'Kortspill-okt',
    duration: 75,
    rating: 5,
    energyLevel: 5,
    focus: 'Bunker og chipping',
    achievements: ['80% sand saves', 'Utmerket avstandskontroll'],
    challenges: [],
    notes: 'En av de beste kortspill-oktene pa lenge. Alt klaffet i dag.',
    coachFeedback: 'Fantastisk okt! Hold dette fokuset.',
    drillsCompleted: ['Gate drill', 'Ladder drill', 'Up-and-down challenge'],
    metrics: { sandSaves: '8/10', upAndDowns: '7/10' },
  },
  {
    id: 't3',
    date: '2025-01-10',
    sessionType: 'physical',
    sessionName: 'Styrketrening',
    duration: 60,
    rating: 4,
    energyLevel: 3,
    focus: 'Core og rotasjon',
    achievements: ['Ny PR i squat', 'God core-aktivering'],
    challenges: ['Litt sliten etter garsagens lange dag'],
    notes: 'Tross litt sliten, fikk jeg ny PR. Core-ovelsene gar bedre og bedre.',
    coachFeedback: null,
    drillsCompleted: ['Squats', 'Rotasjon med band', 'Planke varianter'],
    metrics: { squatPR: '100 kg', coreHold: '90 sek' },
  },
  {
    id: 't4',
    date: '2025-01-08',
    sessionType: 'mental',
    sessionName: 'Mental trening',
    duration: 45,
    rating: 3,
    energyLevel: 4,
    focus: 'Visualisering',
    achievements: ['Fullforte hele visualiseringsokten'],
    challenges: ['Vanskelig a holde fokus', 'Distrahert av tanker'],
    notes: 'Visualisering er fortsatt utfordrende. Trenger mer ovelse.',
    coachFeedback: 'Start med kortere okter (10 min) og bygg opp gradvis.',
    drillsCompleted: ['Pusteovelser', 'Visualisering 18 hull', 'Affirmations'],
    metrics: null,
  },
];

const STATS = {
  totalSessions: 45,
  thisMonth: 12,
  avgRating: 4.1,
  avgDuration: 72,
  mostCommon: 'Teknikk',
  improvement: '+0.3',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getSessionTypeConfig = (type) => {
  switch (type) {
    case 'technical':
      return { label: 'Teknikk', color: tokens.colors.primary, icon: Target };
    case 'short_game':
      return { label: 'Kortspill', color: tokens.colors.success, icon: Flag };
    case 'physical':
      return { label: 'Fysisk', color: tokens.colors.error, icon: Dumbbell };
    case 'mental':
      return { label: 'Mental', color: tokens.colors.gold, icon: Brain };
    case 'warmup':
      return { label: 'Oppvarming', color: tokens.colors.warning, icon: Flame };
    default:
      return { label: type, color: tokens.colors.steel, icon: Dumbbell };
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
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
// EVALUATION CARD COMPONENT
// ============================================================================

const TrainingEvaluationCard = ({ evaluation, onClick }) => {
  const typeConfig = getSessionTypeConfig(evaluation.sessionType);
  const TypeIcon = typeConfig.icon;

  return (
    <div
      onClick={() => onClick(evaluation)}
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
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          backgroundColor: `${typeConfig.color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <TypeIcon size={22} color={typeConfig.color} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
          }}>
            <div>
              <h3 style={{
                fontSize: '15px',
                fontWeight: 600,
                color: tokens.colors.charcoal,
                margin: 0,
              }}>
                {evaluation.sessionName}
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '4px',
              }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: `${typeConfig.color}15`,
                  color: typeConfig.color,
                }}>
                  {typeConfig.label}
                </span>
                <span style={{ fontSize: '12px', color: tokens.colors.steel }}>
                  {formatDate(evaluation.date)}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: tokens.colors.steel,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <Clock size={12} />
                  {evaluation.duration} min
                </span>
              </div>
            </div>
            <RatingStars rating={evaluation.rating} />
          </div>

          <p style={{
            fontSize: '13px',
            color: tokens.colors.charcoal,
            margin: '8px 0',
            lineHeight: 1.4,
          }}>
            {evaluation.notes}
          </p>

          {/* Achievements */}
          {evaluation.achievements.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
              {evaluation.achievements.slice(0, 2).map((achievement, idx) => (
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
                  {achievement}
                </span>
              ))}
            </div>
          )}

          {/* Coach Feedback Indicator */}
          {evaluation.coachFeedback && (
            <div style={{
              marginTop: '10px',
              fontSize: '12px',
              color: tokens.colors.primary,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: tokens.colors.primary,
              }} />
              Trener-feedback tilgjengelig
            </div>
          )}
        </div>

        <ChevronRight size={18} color={tokens.colors.steel} style={{ flexShrink: 0 }} />
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
        {stats.totalSessions}
      </div>
      <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Totalt</div>
    </div>
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '14px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: tokens.colors.success }}>
        {stats.thisMonth}
      </div>
      <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Denne mnd</div>
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
      <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Gj.sn.</div>
    </div>
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '14px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '22px', fontWeight: 700, color: tokens.colors.charcoal }}>
        {stats.avgDuration}
      </div>
      <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Min/okt</div>
    </div>
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '12px',
      padding: '14px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: '16px',
        fontWeight: 700,
        color: tokens.colors.success,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
      }}>
        <TrendingUp size={16} />
        {stats.improvement}
      </div>
      <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Trend</div>
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TreningsevalueringContainer = () => {
  const [filter, setFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'Alle' },
    { key: 'technical', label: 'Teknikk' },
    { key: 'short_game', label: 'Kortspill' },
    { key: 'physical', label: 'Fysisk' },
    { key: 'mental', label: 'Mental' },
  ];

  const filteredEvaluations = TRAINING_EVALUATIONS.filter((e) =>
    filter === 'all' || e.sessionType === filter
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Treningsevalueringer"
        subtitle="Evaluering av dine treningsokter"
      />

      <div style={{ padding: '16px 24px 24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Stats */}
        <StatsOverview stats={STATS} />

        {/* Filters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredEvaluations.length > 0 ? (
            filteredEvaluations.map((evaluation) => (
              <TrainingEvaluationCard
                key={evaluation.id}
                evaluation={evaluation}
                onClick={() => {}}
              />
            ))
          ) : (
            <div style={{
              backgroundColor: tokens.colors.white,
              borderRadius: '14px',
              padding: '40px',
              textAlign: 'center',
            }}>
              <Dumbbell size={40} color={tokens.colors.steel} style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '14px', color: tokens.colors.steel, margin: 0 }}>
                Ingen treningsevalueringer funnet med valgt filter
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreningsevalueringContainer;
