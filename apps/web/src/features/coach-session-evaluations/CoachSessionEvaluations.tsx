/**
 * AK Golf Academy - Coach Session Evaluations
 * Design System v3.0 - Blue Palette 01
 *
 * Purpose:
 * - Allow coaches to view their athletes' session evaluations
 * - Filter by athlete, date, session type
 * - View evaluation details and trends
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, Target, Zap, Brain, Battery,
  ChevronRight, Filter, User
} from 'lucide-react';

import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import StateCard from '../../ui/composites/StateCard';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';

// Semantic color mappings
const colors = {
  primary: 'var(--accent)',
  snow: 'var(--bg-secondary)',
  surface: 'var(--bg-tertiary)',
  white: 'var(--bg-primary)',
  charcoal: 'var(--text-primary)',
  steel: 'var(--text-secondary)',
  mist: 'var(--border-default)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
  gold: 'var(--achievement)',
};

const borderRadius = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
};

const shadows = {
  card: 'var(--shadow-card)',
};

const typography = {
  title1: { fontSize: '28px', lineHeight: '34px', fontWeight: 700 },
  title3: { fontSize: '17px', lineHeight: '22px', fontWeight: 600 },
  body: { fontSize: '15px', lineHeight: '20px', fontWeight: 400 },
  caption: { fontSize: '13px', lineHeight: '18px', fontWeight: 400 },
  label: { fontSize: '12px', lineHeight: '16px', fontWeight: 500 },
};

// Types
interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  category: string;
}

interface SessionEvaluation {
  id: string;
  sessionType: string;
  sessionDate: string;
  duration: number;
  evaluationFocus: number | null;
  evaluationTechnical: number | null;
  evaluationEnergy: number | null;
  evaluationMental: number | null;
  focusArea: string | null;
  notes: string | null;
  completionStatus: string;
  player: Athlete;
}

// Mock data - will be replaced with API
const mockAthletes: Athlete[] = [
  { id: '1', firstName: 'Emma', lastName: 'Larsen', category: 'A' },
  { id: '2', firstName: 'Jonas', lastName: 'Pedersen', category: 'B' },
  { id: '3', firstName: 'Sofie', lastName: 'Andersen', category: 'A' },
];

const mockEvaluations: SessionEvaluation[] = [
  {
    id: '1',
    sessionType: 'driving_range',
    sessionDate: '2025-01-19T10:00:00',
    duration: 90,
    evaluationFocus: 8,
    evaluationTechnical: 7,
    evaluationEnergy: 9,
    evaluationMental: 8,
    focusArea: 'Driver konsistens',
    notes: 'Bra okt, fokuserte pa timing',
    completionStatus: 'completed',
    player: mockAthletes[0],
  },
  {
    id: '2',
    sessionType: 'putting',
    sessionDate: '2025-01-18T14:00:00',
    duration: 60,
    evaluationFocus: 6,
    evaluationTechnical: 5,
    evaluationEnergy: 7,
    evaluationMental: 6,
    focusArea: 'Korte putter',
    notes: 'Sliten, men fullforte',
    completionStatus: 'completed',
    player: mockAthletes[1],
  },
  {
    id: '3',
    sessionType: 'chipping',
    sessionDate: '2025-01-17T09:00:00',
    duration: 45,
    evaluationFocus: 9,
    evaluationTechnical: 8,
    evaluationEnergy: 8,
    evaluationMental: 9,
    focusArea: 'Lob shots',
    notes: 'Utmerket fokus hele okten',
    completionStatus: 'completed',
    player: mockAthletes[2],
  },
];

// Session type labels
const SESSION_TYPE_LABELS: Record<string, string> = {
  driving_range: 'Driving Range',
  putting: 'Putting',
  chipping: 'Chipping',
  pitching: 'Pitching',
  bunker: 'Bunker',
  course_play: 'Banespill',
  physical: 'Fysisk',
  mental: 'Mental',
};

// Rating bar component
function RatingBar({ label, value, icon: Icon, color }: { label: string; value: number | null; icon: React.ElementType; color: string }) {
  if (!value) return null;

  const percentage = (value / 10) * 100;

  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Icon size={14} color={color} />
          <span style={{ ...typography.caption, color: colors.steel }}>{label}</span>
        </div>
        <span style={{ ...typography.label, color: colors.charcoal }}>{value}/10</span>
      </div>
      <div style={{
        height: '6px',
        backgroundColor: colors.mist,
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          backgroundColor: color,
          borderRadius: '3px',
        }} />
      </div>
    </div>
  );
}

// Session card component
interface SessionCardProps {
  evaluation: SessionEvaluation;
  onClick: () => void;
}
const SessionCard: React.FC<SessionCardProps> = ({ evaluation, onClick }) => {
  const date = new Date(evaluation.sessionDate);
  const avgRating = [
    evaluation.evaluationFocus,
    evaluation.evaluationTechnical,
    evaluation.evaluationEnergy,
    evaluation.evaluationMental,
  ].filter(Boolean).reduce((a, b) => a! + b!, 0)! / 4;

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        padding: '16px',
        marginBottom: '12px',
        boxShadow: shadows.card,
        cursor: 'pointer',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <User size={16} color={colors.primary} />
            <span style={{ ...typography.title3, color: colors.charcoal }}>
              {evaluation.player.firstName} {evaluation.player.lastName}
            </span>
            <span style={{
              padding: '2px 8px',
              backgroundColor: colors.snow,
              borderRadius: '4px',
              ...typography.label,
              color: colors.steel,
            }}>
              {evaluation.player.category}
            </span>
          </div>
          <span style={{ ...typography.body, color: colors.charcoal }}>
            {SESSION_TYPE_LABELS[evaluation.sessionType] || evaluation.sessionType}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 700,
            color: avgRating >= 7 ? colors.success : avgRating >= 5 ? colors.warning : colors.error,
          }}>
            {avgRating.toFixed(1)}
          </div>
          <span style={{ ...typography.label, color: colors.steel }}>snitt</span>
        </div>
      </div>

      {/* Date and duration */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} color={colors.steel} />
          <span style={{ ...typography.caption, color: colors.steel }}>
            {date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={14} color={colors.steel} />
          <span style={{ ...typography.caption, color: colors.steel }}>
            {evaluation.duration} min
          </span>
        </div>
      </div>

      {/* Ratings */}
      <div style={{ marginBottom: '12px' }}>
        <RatingBar label="Fokus" value={evaluation.evaluationFocus} icon={Target} color={colors.success} />
        <RatingBar label="Teknikk" value={evaluation.evaluationTechnical} icon={Zap} color={colors.primary} />
        <RatingBar label="Energi" value={evaluation.evaluationEnergy} icon={Battery} color={colors.warning} />
        <RatingBar label="Mental" value={evaluation.evaluationMental} icon={Brain} color={colors.gold} />
      </div>

      {/* Focus area */}
      {evaluation.focusArea && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: colors.snow,
          borderRadius: borderRadius.sm,
        }}>
          <span style={{ ...typography.caption, color: colors.steel }}>Fokusomrade: </span>
          <span style={{ ...typography.body, color: colors.charcoal }}>{evaluation.focusArea}</span>
        </div>
      )}

      {/* View arrow */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
        <ChevronRight size={20} color={colors.steel} />
      </div>
    </div>
  );
}

// Main component
export function CoachSessionEvaluations() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [evaluations, setEvaluations] = useState<SessionEvaluation[]>(mockEvaluations);
  const [athletes] = useState<Athlete[]>(mockAthletes);
  const [selectedAthlete, setSelectedAthlete] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  // Filter evaluations
  const filteredEvaluations = selectedAthlete
    ? evaluations.filter(e => e.player.id === selectedAthlete)
    : evaluations;

  // Calculate summary stats
  const stats = {
    totalSessions: filteredEvaluations.length,
    avgFocus: filteredEvaluations.reduce((acc, e) => acc + (e.evaluationFocus || 0), 0) / filteredEvaluations.length || 0,
    avgTechnical: filteredEvaluations.reduce((acc, e) => acc + (e.evaluationTechnical || 0), 0) / filteredEvaluations.length || 0,
  };

  const handleBack = () => navigate(-1);
  const handleSessionClick = (evaluation: SessionEvaluation) => {
    navigate(`/coach/athletes/${evaluation.player.id}/sessions/${evaluation.id}`);
  };

  return (
    <div style={{
      backgroundColor: colors.surface,
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
    }}>
      {/* Header */}
      <PageHeader
        title="Øktevalueringer"
        subtitle="Se dine spilleres evalueringer"
        onBack={handleBack}
        divider={false}
      />

      {/* Athlete filter */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '0 24px 16px',
        borderBottom: `1px solid ${colors.mist}`,
      }}>
        <select
          value={selectedAthlete}
          onChange={(e) => setSelectedAthlete(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 12px',
            backgroundColor: colors.snow,
            border: `1px solid ${colors.mist}`,
            borderRadius: borderRadius.sm,
            ...typography.body,
          }}
        >
          <option value="">Alle spillere</option>
          {athletes.map(a => (
            <option key={a.id} value={a.id}>
              {a.firstName} {a.lastName} ({a.category})
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 16px',
            backgroundColor: showFilters ? colors.primary : colors.snow,
            color: showFilters ? colors.white : colors.charcoal,
            border: `1px solid ${showFilters ? colors.primary : colors.mist}`,
            borderRadius: borderRadius.sm,
            cursor: 'pointer',
            gap: '6px',
            ...typography.label,
          }}
        >
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Summary stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        padding: '16px',
      }}>
        <div style={{
          backgroundColor: colors.white,
          borderRadius: borderRadius.md,
          padding: '16px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '24px', fontWeight: 700, color: colors.primary, margin: 0 }}>
            {stats.totalSessions}
          </p>
          <p style={{ ...typography.caption, color: colors.steel }}>Okter</p>
        </div>
        <div style={{
          backgroundColor: colors.white,
          borderRadius: borderRadius.md,
          padding: '16px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '24px', fontWeight: 700, color: colors.success, margin: 0 }}>
            {stats.avgFocus.toFixed(1)}
          </p>
          <p style={{ ...typography.caption, color: colors.steel }}>Snitt fokus</p>
        </div>
        <div style={{
          backgroundColor: colors.white,
          borderRadius: borderRadius.md,
          padding: '16px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '24px', fontWeight: 700, color: colors.primary, margin: 0 }}>
            {stats.avgTechnical.toFixed(1)}
          </p>
          <p style={{ ...typography.caption, color: colors.steel }}>Snitt teknikk</p>
        </div>
      </div>

      {/* Sessions list */}
      <div style={{ padding: '0 16px 16px' }}>
        <h2 style={{ ...typography.title3, color: colors.charcoal, marginBottom: '12px' }}>
          Siste evalueringer
        </h2>

        {isLoading ? (
          <StateCard variant="loading" title="Laster evalueringer..." />
        ) : filteredEvaluations.length === 0 ? (
          <StateCard
            variant="empty"
            title="Ingen evalueringer funnet"
            description="Prøv å justere filteret for å se flere evalueringer."
          />
        ) : (
          filteredEvaluations.map(evaluation => (
            <SessionCard
              key={evaluation.id}
              evaluation={evaluation}
              onClick={() => handleSessionClick(evaluation)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CoachSessionEvaluations;
