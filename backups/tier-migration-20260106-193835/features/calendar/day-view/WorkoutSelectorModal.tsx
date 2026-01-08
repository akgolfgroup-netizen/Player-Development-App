/**
 * WorkoutSelectorModal
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 *
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
        className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px] max-h-[80vh] z-[101] flex flex-col rounded-xl shadow-lg transition-all duration-200 bg-ak-surface-card ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-ak-border-subtle">
          <SectionTitle className="text-lg font-semibold text-ak-text-primary">
            Velg økt
          </SectionTitle>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-full transition-colors text-ak-text-tertiary hover:bg-ak-surface-subtle"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-ak-border-subtle">
          <div className="flex items-center gap-2 p-3 rounded-lg border border-ak-border-default bg-ak-surface-subtle">
            <Search size={18} className="text-ak-text-tertiary" />
            <input
              type="text"
              placeholder="Søk etter økt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none text-base outline-none text-ak-text-primary placeholder:text-ak-text-tertiary"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-ak-border-subtle">
          {(Object.keys(categoryLabels) as (WorkoutCategory | 'all')[]).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                selectedCategory === category
                  ? 'bg-ak-primary border-ak-primary text-white'
                  : 'bg-ak-surface-subtle border-ak-border-default text-ak-text-secondary'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {/* Workout List */}
        <div className="flex-1 overflow-auto p-2">
          {filteredWorkouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-ak-surface-subtle">
                <Dumbbell size={28} className="text-ak-text-tertiary" />
              </div>
              <p className="text-base text-ak-text-secondary">Ingen økter funnet</p>
            </div>
          ) : (
            filteredWorkouts.map((workout) => (
              <button
                key={workout.id}
                onClick={() => handleSelect(workout)}
                className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-lg transition-colors hover:bg-ak-surface-subtle"
              >
                <div className="w-11 h-11 rounded-lg flex-shrink-0 flex items-center justify-center bg-ak-primary/10">
                  <Target size={22} className="text-ak-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold mb-0.5 text-ak-text-primary">
                    {workout.name}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-ak-text-tertiary">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {workout.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Target size={12} />
                      {categoryLabels[workout.category]}
                    </span>
                  </div>
                </div>
                <Play size={18} className="text-ak-text-tertiary" />
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default WorkoutSelectorModal;
