/**
 * WorkoutSelectorModal
 * Modal to select a workout from available sessions/exercises
 */

import React, { useState, useEffect } from 'react';
import { X, Search, Clock, Target, Play, Dumbbell } from 'lucide-react';
import { Workout, WorkoutCategory } from './types';
import { SectionTitle } from '../../../components/typography';

interface WorkoutSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (workout: Workout) => void;
  date: Date;
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
    maxWidth: '500px',
    maxHeight: '80vh',
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
  title: {
    fontSize: 'var(--font-size-headline)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
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
  searchContainer: {
    padding: 'var(--spacing-3) var(--spacing-4)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  searchInput: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-3)',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-default)',
  },
  input: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: 'var(--font-size-subheadline)',
    color: 'var(--text-primary)',
    outline: 'none',
  },
  categoryTabs: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-3) var(--spacing-4)',
    overflowX: 'auto' as const,
    borderBottom: '1px solid var(--border-subtle)',
  },
  categoryTab: {
    padding: 'var(--spacing-2) var(--spacing-3)',
    backgroundColor: 'var(--background-surface)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.15s ease',
  },
  categoryTabActive: {
    backgroundColor: 'var(--accent)',
    borderColor: 'var(--accent)',
    color: 'var(--text-inverse)',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: 'var(--spacing-2)',
  },
  workoutItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-3) var(--spacing-4)',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left' as const,
    transition: 'background-color 0.15s ease',
  },
  workoutIcon: {
    width: '44px',
    height: '44px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--accent-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  workoutInfo: {
    flex: 1,
    minWidth: 0,
  },
  workoutName: {
    fontSize: 'var(--font-size-subheadline)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '2px',
  },
  workoutMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
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
};

// Sample workouts (would be fetched from API)
const sampleWorkouts: Workout[] = [
  {
    id: 'w1',
    name: 'Putting Presisjon',
    category: 'teknikk',
    duration: 45,
    status: 'scheduled',
    isRecommended: true,
    isAllDay: false,
    description: 'Fokus på korte putter (1-3 meter) med vekt på linjekontroll.',
  },
  {
    id: 'w2',
    name: 'Driver Teknikk',
    category: 'golfslag',
    duration: 60,
    status: 'scheduled',
    isRecommended: false,
    isAllDay: false,
    description: 'Arbeid med svingtempo og balanse.',
  },
  {
    id: 'w3',
    name: 'Kort Spill',
    category: 'teknikk',
    duration: 30,
    status: 'scheduled',
    isRecommended: false,
    isAllDay: false,
    description: 'Chipping og pitching fra ulike avstander.',
  },
  {
    id: 'w4',
    name: '9-hulls Runde',
    category: 'spill',
    duration: 120,
    status: 'scheduled',
    isRecommended: false,
    isAllDay: false,
    description: 'Fokusert banespill med scoring.',
  },
  {
    id: 'w5',
    name: 'Styrketrening',
    category: 'fysisk',
    duration: 45,
    status: 'scheduled',
    isRecommended: false,
    isAllDay: false,
    description: 'Golfspesifikk styrketrening.',
  },
  {
    id: 'w6',
    name: 'Mental Forberedelse',
    category: 'mental',
    duration: 20,
    status: 'scheduled',
    isRecommended: false,
    isAllDay: false,
    description: 'Visualisering og fokusovelser.',
  },
];

const categoryLabels: Record<WorkoutCategory | 'all', string> = {
  all: 'Alle',
  teknikk: 'Teknikk',
  golfslag: 'Golfslag',
  spill: 'Spill',
  konkurranse: 'Konkurranse',
  fysisk: 'Fysisk',
  mental: 'Mental',
};

export const WorkoutSelectorModal: React.FC<WorkoutSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  date,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | 'all'>('all');
  const [workouts, setWorkouts] = useState<Workout[]>(sampleWorkouts);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedCategory('all');
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

  // Filter workouts
  const filteredWorkouts = workouts.filter((workout) => {
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || workout.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (workout: Workout) => {
    onSelect({
      ...workout,
      scheduledDate: date.toISOString().split('T')[0],
    });
    onClose();
  };

  if (!isOpen) return null;

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
          <SectionTitle style={styles.title}>Velg okt</SectionTitle>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-surface)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={styles.searchContainer}>
          <div style={styles.searchInput}>
            <Search size={18} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Sok etter okt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div style={styles.categoryTabs}>
          {(Object.keys(categoryLabels) as (WorkoutCategory | 'all')[]).map((category) => (
            <button
              key={category}
              style={{
                ...styles.categoryTab,
                ...(selectedCategory === category ? styles.categoryTabActive : {}),
              }}
              onClick={() => setSelectedCategory(category)}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {/* Workout List */}
        <div style={styles.content}>
          {filteredWorkouts.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <Dumbbell size={28} style={{ color: 'var(--text-tertiary)' }} />
              </div>
              <p style={styles.emptyText}>Ingen okter funnet</p>
            </div>
          ) : (
            filteredWorkouts.map((workout) => (
              <button
                key={workout.id}
                style={styles.workoutItem}
                onClick={() => handleSelect(workout)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--background-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={styles.workoutIcon}>
                  <Target size={22} style={{ color: 'var(--accent)' }} />
                </div>
                <div style={styles.workoutInfo}>
                  <div style={styles.workoutName}>{workout.name}</div>
                  <div style={styles.workoutMeta}>
                    <span style={styles.metaItem}>
                      <Clock size={12} />
                      {workout.duration} min
                    </span>
                    <span style={styles.metaItem}>
                      <Target size={12} />
                      {categoryLabels[workout.category]}
                    </span>
                  </div>
                </div>
                <Play size={18} style={{ color: 'var(--text-tertiary)' }} />
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default WorkoutSelectorModal;
