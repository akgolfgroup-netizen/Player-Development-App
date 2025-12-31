/**
 * WorkoutContentViewer
 * Read-only view of workout exercises/content
 */

import React, { useState, useEffect } from 'react';
import { X, Clock, Target, CheckCircle2, Circle, ChevronDown, ChevronUp, Dumbbell } from 'lucide-react';
import { Workout } from './types';
import { SectionTitle } from '../../../components/typography';

interface Exercise {
  id: string;
  name: string;
  description?: string;
  sets?: number;
  reps?: number;
  duration?: number;
  isCompleted?: boolean;
}

interface WorkoutContentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  workout: Workout | null;
}

// Semantic styles
const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--overlay-backdrop)',
    zIndex: 100,
    opacity: 0,
    pointerEvents: 'none' as const,
    transition: 'opacity 0.2s ease',
  },
  overlayOpen: {
    opacity: 1,
    pointerEvents: 'auto' as const,
  },
  modal: {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(0.95)',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '85vh',
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-float)',
    zIndex: 101,
    display: 'flex',
    flexDirection: 'column' as const,
    opacity: 0,
    transition: 'opacity 0.2s ease, transform 0.2s ease',
  },
  modalOpen: {
    opacity: 1,
    transform: 'translate(-50%, -50%) scale(1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-4)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 'var(--font-size-headline)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  subtitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    marginTop: 'var(--spacing-1)',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  subtitleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  closeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-tertiary)',
    transition: 'background-color 0.15s ease',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: 'var(--spacing-4)',
  },
  description: {
    fontSize: 'var(--font-size-subheadline)',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    marginBottom: 'var(--spacing-4)',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 600,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: 'var(--spacing-3)',
  },
  exerciseList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--spacing-2)',
  },
  exerciseItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--background-white)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  exerciseItemCompleted: {
    backgroundColor: 'var(--success-muted)',
    borderColor: 'var(--success)',
  },
  exerciseIcon: {
    flexShrink: 0,
    marginTop: '2px',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 'var(--font-size-subheadline)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '2px',
  },
  exerciseMeta: {
    display: 'flex',
    gap: 'var(--spacing-3)',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  exerciseDescription: {
    marginTop: 'var(--spacing-2)',
    padding: 'var(--spacing-2)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  expandIcon: {
    color: 'var(--text-tertiary)',
    flexShrink: 0,
    transition: 'transform 0.2s ease',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-8)',
    textAlign: 'center' as const,
  },
  emptyIcon: {
    width: '64px',
    height: '64px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--background-surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 'var(--spacing-4)',
  },
  emptyText: {
    fontSize: 'var(--font-size-subheadline)',
    color: 'var(--text-secondary)',
  },
  footer: {
    padding: 'var(--spacing-4)',
    borderTop: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--background-surface)',
  },
  footerButton: {
    width: '100%',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--accent)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-subheadline)',
    fontWeight: 600,
    color: 'var(--text-inverse)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
};

// Translate category
const translateCategory = (category: string): string => {
  const translations: Record<string, string> = {
    teknikk: 'Teknikk',
    golfslag: 'Golfslag',
    spill: 'Spill',
    konkurranse: 'Konkurranse',
    fysisk: 'Fysisk',
    mental: 'Mental',
  };
  return translations[category] || category;
};

// Sample exercises (would come from API)
const sampleExercises: Exercise[] = [
  {
    id: 'ex1',
    name: 'Oppvarming',
    description: 'Lett strekking og mobilisering. Fokus pa hofter og skuldre.',
    duration: 5,
    isCompleted: true,
  },
  {
    id: 'ex2',
    name: 'Korte putter (1m)',
    description: 'Putt 20 baller fra 1 meter. Fokuser pa rett linje og fast grep.',
    reps: 20,
    isCompleted: true,
  },
  {
    id: 'ex3',
    name: 'Middels putter (2m)',
    description: 'Putt 15 baller fra 2 meter. Hold oynene pa ballen gjennom hele slaget.',
    reps: 15,
    isCompleted: false,
  },
  {
    id: 'ex4',
    name: 'Lange putter (3m)',
    description: 'Putt 10 baller fra 3 meter. Fokuser pa distansekontroll.',
    reps: 10,
    isCompleted: false,
  },
  {
    id: 'ex5',
    name: 'Avsluttende ovelse',
    description: 'Putt rundt hullet fra forskjellige vinkler. 5 putter pa rad for a fullfare.',
    sets: 3,
    reps: 5,
    isCompleted: false,
  },
];

export const WorkoutContentViewer: React.FC<WorkoutContentViewerProps> = ({
  isOpen,
  onClose,
  workout,
}) => {
  const [exercises, setExercises] = useState<Exercise[]>(sampleExercises);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setExpandedExercise(null);
      // In real app, fetch exercises for this workout
      setExercises(sampleExercises);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const toggleExpanded = (id: string) => {
    setExpandedExercise(expandedExercise === id ? null : id);
  };

  const completedCount = exercises.filter((ex) => ex.isCompleted).length;
  const totalCount = exercises.length;

  if (!isOpen || !workout) return null;

  return (
    <>
      {/* Overlay */}
      <div
        style={{ ...styles.overlay, ...(isOpen ? styles.overlayOpen : {}) }}
        onClick={onClose}
      />

      {/* Modal */}
      <div style={{ ...styles.modal, ...(isOpen ? styles.modalOpen : {}) }}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerInfo}>
            <SectionTitle style={styles.title}>{workout.name}</SectionTitle>
            <div style={styles.subtitle}>
              <span style={styles.subtitleItem}>
                <Clock size={12} />
                {workout.duration} min
              </span>
              <span style={styles.subtitleItem}>
                <Target size={12} />
                {translateCategory(workout.category)}
              </span>
              <span style={styles.subtitleItem}>
                <CheckCircle2 size={12} />
                {completedCount}/{totalCount} ovelser
              </span>
            </div>
          </div>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-surface)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Description */}
          {workout.description && (
            <p style={styles.description}>{workout.description}</p>
          )}

          {/* Exercises */}
          <div style={styles.sectionTitle}>
            <Dumbbell size={14} />
            Ovelser
          </div>

          {exercises.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <Dumbbell size={28} style={{ color: 'var(--text-tertiary)' }} />
              </div>
              <p style={styles.emptyText}>Ingen ovelser definert</p>
            </div>
          ) : (
            <div style={styles.exerciseList}>
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  style={{
                    ...styles.exerciseItem,
                    ...(exercise.isCompleted ? styles.exerciseItemCompleted : {}),
                  }}
                  onClick={() => toggleExpanded(exercise.id)}
                  onMouseEnter={(e) => {
                    if (!exercise.isCompleted) {
                      e.currentTarget.style.borderColor = 'var(--border-brand)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!exercise.isCompleted) {
                      e.currentTarget.style.borderColor = 'var(--border-default)';
                    }
                  }}
                >
                  <div style={styles.exerciseIcon}>
                    {exercise.isCompleted ? (
                      <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
                    ) : (
                      <Circle size={20} style={{ color: 'var(--text-tertiary)' }} />
                    )}
                  </div>
                  <div style={styles.exerciseContent}>
                    <div style={styles.exerciseName}>{exercise.name}</div>
                    <div style={styles.exerciseMeta}>
                      {exercise.duration && <span>{exercise.duration} min</span>}
                      {exercise.sets && <span>{exercise.sets} sett</span>}
                      {exercise.reps && <span>{exercise.reps} rep</span>}
                    </div>
                    {expandedExercise === exercise.id && exercise.description && (
                      <div style={styles.exerciseDescription}>
                        {exercise.description}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      ...styles.expandIcon,
                      transform: expandedExercise === exercise.id ? 'rotate(180deg)' : 'none',
                    }}
                  >
                    <ChevronDown size={16} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button
            style={styles.footerButton}
            onClick={onClose}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
          >
            Lukk
          </button>
        </div>
      </div>
    </>
  );
};

export default WorkoutContentViewer;
