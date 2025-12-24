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
  ArrowLeft, Calendar, Clock, Target, Zap, Brain, Battery,
  ChevronRight, Filter, User
} from 'lucide-react';

// Design tokens - Blue Palette 01
const tokens = {
  colors: {
    primary: '#10456A',
    primaryLight: '#2C5F7F',
    snow: '#EDF0F2',
    surface: '#EBE5DA',
    white: '#FFFFFF',
    charcoal: '#1C1C1E',
    steel: '#8E8E93',
    mist: '#E5E5EA',
    success: '#4A7C59',
    warning: '#D4A84B',
    error: '#C45B4E',
    gold: '#C9A227',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
  },
  shadows: {
    card: '0 2px 4px rgba(0, 0, 0, 0.06)',
  },
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
          <span style={{ ...typography.caption, color: tokens.colors.steel }}>{label}</span>
        </div>
        <span style={{ ...typography.label, color: tokens.colors.charcoal }}>{value}/10</span>
      </div>
      <div style={{
        height: '6px',
        backgroundColor: tokens.colors.mist,
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
        backgroundColor: tokens.colors.white,
        borderRadius: tokens.borderRadius.md,
        padding: '16px',
        marginBottom: '12px',
        boxShadow: tokens.shadows.card,
        cursor: 'pointer',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <User size={16} color={tokens.colors.primary} />
            <span style={{ ...typography.title3, color: tokens.colors.charcoal }}>
              {evaluation.player.firstName} {evaluation.player.lastName}
            </span>
            <span style={{
              padding: '2px 8px',
              backgroundColor: tokens.colors.snow,
              borderRadius: '4px',
              ...typography.label,
              color: tokens.colors.steel,
            }}>
              {evaluation.player.category}
            </span>
          </div>
          <span style={{ ...typography.body, color: tokens.colors.charcoal }}>
            {SESSION_TYPE_LABELS[evaluation.sessionType] || evaluation.sessionType}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 700,
            color: avgRating >= 7 ? tokens.colors.success : avgRating >= 5 ? tokens.colors.warning : tokens.colors.error,
          }}>
            {avgRating.toFixed(1)}
          </div>
          <span style={{ ...typography.label, color: tokens.colors.steel }}>snitt</span>
        </div>
      </div>

      {/* Date and duration */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} color={tokens.colors.steel} />
          <span style={{ ...typography.caption, color: tokens.colors.steel }}>
            {date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={14} color={tokens.colors.steel} />
          <span style={{ ...typography.caption, color: tokens.colors.steel }}>
            {evaluation.duration} min
          </span>
        </div>
      </div>

      {/* Ratings */}
      <div style={{ marginBottom: '12px' }}>
        <RatingBar label="Fokus" value={evaluation.evaluationFocus} icon={Target} color={tokens.colors.success} />
        <RatingBar label="Teknikk" value={evaluation.evaluationTechnical} icon={Zap} color={tokens.colors.primary} />
        <RatingBar label="Energi" value={evaluation.evaluationEnergy} icon={Battery} color={tokens.colors.warning} />
        <RatingBar label="Mental" value={evaluation.evaluationMental} icon={Brain} color={tokens.colors.gold} />
      </div>

      {/* Focus area */}
      {evaluation.focusArea && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: tokens.colors.snow,
          borderRadius: tokens.borderRadius.sm,
        }}>
          <span style={{ ...typography.caption, color: tokens.colors.steel }}>Fokusomrade: </span>
          <span style={{ ...typography.body, color: tokens.colors.charcoal }}>{evaluation.focusArea}</span>
        </div>
      )}

      {/* View arrow */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
        <ChevronRight size={20} color={tokens.colors.steel} />
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
      backgroundColor: tokens.colors.surface,
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: tokens.colors.white,
        padding: '16px',
        borderBottom: `1px solid ${tokens.colors.mist}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button
            onClick={handleBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              backgroundColor: tokens.colors.snow,
              border: 'none',
              borderRadius: tokens.borderRadius.sm,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={20} color={tokens.colors.charcoal} />
          </button>
          <div>
            <h1 style={{ ...typography.title1, color: tokens.colors.charcoal, margin: 0 }}>
              Oktevalueringer
            </h1>
            <p style={{ ...typography.caption, color: tokens.colors.steel, marginTop: '4px' }}>
              Se dine spilleres evalueringer
            </p>
          </div>
        </div>

        {/* Athlete filter */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={selectedAthlete}
            onChange={(e) => setSelectedAthlete(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 12px',
              backgroundColor: tokens.colors.snow,
              border: `1px solid ${tokens.colors.mist}`,
              borderRadius: tokens.borderRadius.sm,
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
              backgroundColor: showFilters ? tokens.colors.primary : tokens.colors.snow,
              color: showFilters ? tokens.colors.white : tokens.colors.charcoal,
              border: `1px solid ${showFilters ? tokens.colors.primary : tokens.colors.mist}`,
              borderRadius: tokens.borderRadius.sm,
              cursor: 'pointer',
              gap: '6px',
              ...typography.label,
            }}
          >
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        padding: '16px',
      }}>
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: tokens.borderRadius.md,
          padding: '16px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.primary, margin: 0 }}>
            {stats.totalSessions}
          </p>
          <p style={{ ...typography.caption, color: tokens.colors.steel }}>Okter</p>
        </div>
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: tokens.borderRadius.md,
          padding: '16px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.success, margin: 0 }}>
            {stats.avgFocus.toFixed(1)}
          </p>
          <p style={{ ...typography.caption, color: tokens.colors.steel }}>Snitt fokus</p>
        </div>
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: tokens.borderRadius.md,
          padding: '16px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '24px', fontWeight: 700, color: tokens.colors.primary, margin: 0 }}>
            {stats.avgTechnical.toFixed(1)}
          </p>
          <p style={{ ...typography.caption, color: tokens.colors.steel }}>Snitt teknikk</p>
        </div>
      </div>

      {/* Sessions list */}
      <div style={{ padding: '0 16px 16px' }}>
        <h2 style={{ ...typography.title3, color: tokens.colors.charcoal, marginBottom: '12px' }}>
          Siste evalueringer
        </h2>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '32px' }}>
            <p style={{ ...typography.body, color: tokens.colors.steel }}>Laster...</p>
          </div>
        ) : filteredEvaluations.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '32px',
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.borderRadius.md,
          }}>
            <Target size={48} color={tokens.colors.mist} style={{ marginBottom: '12px' }} />
            <p style={{ ...typography.body, color: tokens.colors.steel }}>
              Ingen evalueringer funnet
            </p>
          </div>
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
