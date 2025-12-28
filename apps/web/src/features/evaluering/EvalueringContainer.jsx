import React, { useState } from 'react';
import {
  ClipboardCheck, Star, ChevronRight,
  Trophy, Dumbbell, Search, Plus
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';

// ============================================================================
// MOCK DATA
// ============================================================================

const EVALUATIONS = [
  {
    id: 'e1',
    type: 'training',
    title: 'Teknisk okt - Driver',
    date: '2025-01-15',
    rating: 4,
    summary: 'God fremgang med tempo. Fortsatt litt inkonsistent pa impact.',
    tags: ['Teknikk', 'Driver', 'Simulator'],
    coachNote: 'Bra jobba! Fokuser pa hofterotasjon neste okt.',
  },
  {
    id: 'e2',
    type: 'tournament',
    title: 'Vinterturneringen',
    date: '2025-01-12',
    rating: 3,
    summary: 'Ok turnering, men slet med putting pa back 9.',
    tags: ['Turnering', 'Miklagard'],
    result: { position: 8, score: 147 },
  },
  {
    id: 'e3',
    type: 'training',
    title: 'Kortspill-okt',
    date: '2025-01-10',
    rating: 5,
    summary: 'Utmerket okt! Sand saves var 80% i dag.',
    tags: ['Kortspill', 'Bunker', 'Chipping'],
    coachNote: 'Fantastisk! Hold fokus pa dette nivaet.',
  },
  {
    id: 'e4',
    type: 'tournament',
    title: 'Sesongapning',
    date: '2025-02-10',
    rating: 5,
    summary: 'Seier! Spilte kontrollert hele runden.',
    tags: ['Turnering', 'Tyrifjord'],
    result: { position: 1, score: 71 },
  },
  {
    id: 'e5',
    type: 'training',
    title: 'Styrketrening',
    date: '2025-01-08',
    rating: 4,
    summary: 'Ny PR i squat! Core-ovelser gikk bra.',
    tags: ['Fysisk', 'Styrke'],
  },
  {
    id: 'e6',
    type: 'training',
    title: 'Mental trening',
    date: '2025-01-05',
    rating: 3,
    summary: 'Visualisering var vanskelig i dag. Trenger mer ovelse.',
    tags: ['Mental', 'Visualisering'],
  },
];

const STATS = {
  totalEvaluations: 24,
  avgRating: 3.8,
  trainingCount: 18,
  tournamentCount: 6,
  trend: 'improving',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getTypeConfig = (type) => {
  switch (type) {
    case 'training':
      return { label: 'Trening', color: 'var(--accent)', icon: Dumbbell };
    case 'tournament':
      return { label: 'Turnering', color: 'var(--achievement)', icon: Trophy };
    default:
      return { label: type, color: 'var(--text-secondary)', icon: ClipboardCheck };
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ============================================================================
// RATING STARS COMPONENT
// ============================================================================

const RatingStars = ({ rating, size = 14 }) => {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          fill={star <= rating ? 'var(--achievement)' : 'none'}
          color={star <= rating ? 'var(--achievement)' : 'var(--border-default)'}
        />
      ))}
    </div>
  );
};

// ============================================================================
// EVALUATION CARD COMPONENT
// ============================================================================

const EvaluationCard = ({ evaluation, onClick }) => {
  const typeConfig = getTypeConfig(evaluation.type);
  const TypeIcon = typeConfig.icon;

  return (
    <div
      onClick={() => onClick(evaluation)}
      style={{
        backgroundColor: 'var(--bg-primary)',
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
        gap: '14px',
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          backgroundColor: `${typeConfig.color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <TypeIcon size={20} color={typeConfig.color} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '4px',
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              {evaluation.title}
            </h3>
            <RatingStars rating={evaluation.rating} />
          </div>

          <div style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: `${typeConfig.color}15`,
              color: typeConfig.color,
              fontWeight: 500,
            }}>
              {typeConfig.label}
            </span>
            <span>{formatDate(evaluation.date)}</span>
          </div>

          <p style={{
            fontSize: '13px',
            color: 'var(--text-primary)',
            margin: '0 0 8px 0',
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {evaluation.summary}
          </p>

          {evaluation.result && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 10px',
              backgroundColor: evaluation.result.position <= 3 ? 'rgba(var(--achievement-rgb), 0.15)' : 'var(--bg-secondary)',
              borderRadius: '6px',
              marginBottom: '8px',
            }}>
              <Trophy size={14} color={evaluation.result.position <= 3 ? 'var(--achievement)' : 'var(--text-secondary)'} />
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}>
                {evaluation.result.position}. plass - Score: {evaluation.result.score}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {evaluation.tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <ChevronRight size={18} color={'var(--text-secondary)'} style={{ flexShrink: 0 }} />
      </div>
    </div>
  );
};

// ============================================================================
// STATS OVERVIEW COMPONENT
// ============================================================================

const StatsOverview = ({ stats }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '12px',
      marginBottom: '24px',
    }}>
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)' }}>
          {stats.totalEvaluations}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Totalt</div>
      </div>
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--achievement)' }}>
            {stats.avgRating.toFixed(1)}
          </span>
          <Star size={18} fill={'var(--achievement)'} color={'var(--achievement)'} />
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Gj.sn. rating</div>
      </div>
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)' }}>
          {stats.trainingCount}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Treninger</div>
      </div>
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--achievement)' }}>
          {stats.tournamentCount}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Turneringer</div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const EvalueringContainer = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvaluations = EVALUATIONS.filter((e) => {
    if (filter !== 'all' && e.type !== filter) return false;
    if (searchQuery && !e.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filters = [
    { key: 'all', label: 'Alle' },
    { key: 'training', label: 'Trening' },
    { key: 'tournament', label: 'Turnering' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <PageHeader
        title="Evalueringer"
        subtitle="Oversikt over alle dine evalueringer"
      />

      <div style={{ padding: '16px 24px 24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Stats Overview */}
        <StatsOverview stats={STATS} />

        {/* Filters and Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: filter === f.key ? 'var(--accent)' : 'var(--bg-primary)',
                  color: filter === f.key ? 'var(--bg-primary)' : 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{
            flex: 1,
            minWidth: '200px',
            position: 'relative',
          }}>
            <Search
              size={16}
              color={'var(--text-secondary)'}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sok i evalueringer..."
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                fontSize: '13px',
              }}
            />
          </div>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-primary)',
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
              <EvaluationCard
                key={evaluation.id}
                evaluation={evaluation}
                onClick={() => {}}
              />
            ))
          ) : (
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '14px',
              padding: '40px',
              textAlign: 'center',
            }}>
              <ClipboardCheck size={40} color={'var(--text-secondary)'} style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                Ingen evalueringer funnet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvalueringContainer;
