/**
 * AK Golf Academy - Session Create Form
 * Design System v3.0 - Premium Light
 *
 * Features:
 * - Session type selection
 * - Date/time picker
 * - Duration selection
 * - Learning phase (L1-L5)
 * - Period selection (E/G/S/T)
 * - Intensity slider
 * - Focus area
 * - Notes
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */
import React, { useState, useCallback } from 'react';
import { ChevronLeft, Calendar, Clock, Target, Zap, FileText, Plus } from 'lucide-react';
import Button from '../../ui/primitives/Button';

// Session type options
const SESSION_TYPES = [
  { id: 'driving_range', label: 'Driving Range', icon: '🏌️' },
  { id: 'putting', label: 'Putting', icon: '⛳' },
  { id: 'chipping', label: 'Chipping', icon: '🎯' },
  { id: 'pitching', label: 'Pitching', icon: '📐' },
  { id: 'bunker', label: 'Bunker', icon: '🏖️' },
  { id: 'course_play', label: 'Banespill', icon: '🏕️' },
  { id: 'physical', label: 'Fysisk', icon: '💪' },
  { id: 'mental', label: 'Mental', icon: '🧠' },
];

// Learning phases
const LEARNING_PHASES = [
  { id: 'L1', label: 'L1 - Ball', description: 'Fokus på ballkontakt' },
  { id: 'L2', label: 'L2 - Teknikk', description: 'Teknisk trening' },
  { id: 'L3', label: 'L3 - Transfer', description: 'Overføring til spill' },
  { id: 'L4', label: 'L4 - Variasjon', description: 'Variasjon i trening' },
  { id: 'L5', label: 'L5 - Spill', description: 'Spillsituasjoner' },
];

// Periods
const PERIODS = [
  { id: 'E', label: 'Etableringsfase' },
  { id: 'G', label: 'Grunnfase' },
  { id: 'S', label: 'Spesifikkfase' },
  { id: 'T', label: 'Toppfase' },
];

// Helper to get period color classes
const getPeriodClasses = (periodId, isSelected) => {
  const colors = {
    E: { bg: 'bg-ak-brand-primary', text: 'text-white', border: 'border-ak-brand-primary' },
    G: { bg: 'bg-ak-status-success', text: 'text-white', border: 'border-ak-status-success' },
    S: { bg: 'bg-ak-status-warning', text: 'text-white', border: 'border-ak-status-warning' },
    T: { bg: 'bg-ak-status-error', text: 'text-white', border: 'border-ak-status-error' },
  };
  const colorSet = colors[periodId] || colors.E;
  if (isSelected) {
    return `${colorSet.bg} ${colorSet.text} ${colorSet.border}`;
  }
  return 'bg-ak-surface-base text-ak-text-primary border-ak-border-default';
};

// Duration options (in minutes)
const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120, 150, 180];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function TypeSelector({ selected, onChange }) {
  return (
    <div className="mb-6">
      <label className="block mb-2 text-ak-text-primary text-xs font-medium">
        Type trening *
      </label>
      <div className="grid grid-cols-4 gap-2">
        {SESSION_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => onChange(type.id)}
            className={`flex flex-col items-center p-4 rounded-lg cursor-pointer border ${
              selected === type.id
                ? 'bg-ak-brand-primary text-white border-ak-brand-primary'
                : 'bg-ak-surface-base text-ak-text-primary border-ak-border-default'
            }`}
          >
            <span className="text-2xl mb-1">{type.icon}</span>
            <span className="text-xs text-center">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DateTimePicker({ date, onDateChange }) {
  return (
    <div className="mb-6">
      <label className="block mb-2 text-ak-text-primary text-xs font-medium">
        <Calendar size={16} className="mr-1 align-middle inline-block" />
        Dato og tid *
      </label>
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        className="w-full p-4 bg-ak-surface-subtle border border-ak-border-default rounded-lg text-[15px] text-ak-text-primary"
      />
    </div>
  );
}

function DurationSelector({ duration, onChange }) {
  return (
    <div className="mb-6">
      <label className="block mb-2 text-ak-text-primary text-xs font-medium">
        <Clock size={16} className="mr-1 align-middle inline-block" />
        Varighet *
      </label>
      <div className="flex flex-wrap gap-2">
        {DURATION_OPTIONS.map((mins) => (
          <button
            key={mins}
            type="button"
            onClick={() => onChange(mins)}
            className={`py-2 px-4 rounded-lg cursor-pointer text-[15px] border ${
              duration === mins
                ? 'bg-ak-brand-primary text-white border-ak-brand-primary'
                : 'bg-ak-surface-base text-ak-text-primary border-ak-border-default'
            }`}
          >
            {mins} min
          </button>
        ))}
      </div>
    </div>
  );
}

function LearningPhaseSelector({ selected, onChange }) {
  return (
    <div className="mb-6">
      <label className="block mb-2 text-ak-text-primary text-xs font-medium">
        Laeringsfase
      </label>
      <div className="flex flex-col gap-2">
        {LEARNING_PHASES.map((phase) => (
          <button
            key={phase.id}
            type="button"
            onClick={() => onChange(selected === phase.id ? null : phase.id)}
            className={`flex justify-between items-center p-4 rounded-lg cursor-pointer text-left border ${
              selected === phase.id
                ? 'bg-ak-brand-primary/10 border-ak-brand-primary'
                : 'bg-ak-surface-base border-ak-border-default'
            }`}
          >
            <div>
              <span className="text-[15px] text-ak-text-primary">
                {phase.label}
              </span>
              <span className="block text-xs text-ak-text-secondary">
                {phase.description}
              </span>
            </div>
            {selected === phase.id && (
              <span className="text-ak-brand-primary text-lg">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function PeriodSelector({ selected, onChange }) {
  return (
    <div className="mb-6">
      <label className="block mb-2 text-ak-text-primary text-xs font-medium">
        Treningsperiode
      </label>
      <div className="grid grid-cols-4 gap-2">
        {PERIODS.map((period) => (
          <button
            key={period.id}
            type="button"
            onClick={() => onChange(selected === period.id ? null : period.id)}
            className={`p-4 rounded-lg cursor-pointer text-xs font-medium border ${getPeriodClasses(period.id, selected === period.id)}`}
          >
            {period.id}
          </button>
        ))}
      </div>
      {selected && (
        <span className="block mt-1 text-xs text-ak-text-secondary">
          {PERIODS.find((p) => p.id === selected)?.label}
        </span>
      )}
    </div>
  );
}

function IntensitySlider({ value, onChange }) {
  // Dynamic gradient requires inline style
  const sliderProgress = ((value || 5) - 1) * 11.1;

  return (
    <div className="mb-6">
      <label className="flex justify-between mb-2 text-ak-text-primary text-xs font-medium">
        <span>
          <Zap size={16} className="mr-1 align-middle inline-block" />
          Intensitet
        </span>
        <span className="text-ak-brand-primary">{value || '-'}/10</span>
      </label>
      <input
        type="range"
        min="1"
        max="10"
        value={value || 5}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-full appearance-none"
        style={{
          background: `linear-gradient(to right, var(--ak-brand-primary) ${sliderProgress}%, var(--ak-border-default) ${sliderProgress}%)`,
        }}
      />
      <div className="flex justify-between mt-1 text-xs text-ak-text-secondary">
        <span>Lett</span>
        <span>Moderat</span>
        <span>Hard</span>
      </div>
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, icon: Icon }) {
  return (
    <div className="mb-6">
      <label className="block mb-2 text-ak-text-primary text-xs font-medium">
        {Icon && <Icon size={16} className="mr-1 align-middle inline-block" />}
        {label}
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full p-4 bg-ak-surface-subtle border border-ak-border-default rounded-lg resize-y text-[15px] text-ak-text-primary"
      />
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SessionCreateForm({
  initialValues = {},
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  // Form state
  const [formData, setFormData] = useState({
    sessionType: initialValues.sessionType || '',
    sessionDate: initialValues.sessionDate || new Date().toISOString().slice(0, 16),
    duration: initialValues.duration || 60,
    learningPhase: initialValues.learningPhase || null,
    period: initialValues.period || null,
    intensity: initialValues.intensity || null,
    focusArea: initialValues.focusArea || '',
    notes: initialValues.notes || '',
  });

  const [errors, setErrors] = useState({});

  // Update field
  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  // Validate form
  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.sessionType) {
      newErrors.sessionType = 'Velg type trening';
    }
    if (!formData.sessionDate) {
      newErrors.sessionDate = 'Velg dato og tid';
    }
    if (!formData.duration || formData.duration < 1) {
      newErrors.duration = 'Velg varighet';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle submit
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!validate()) {
        return;
      }

      // Format data for API
      const submitData = {
        sessionType: formData.sessionType,
        sessionDate: new Date(formData.sessionDate).toISOString(),
        duration: formData.duration,
        learningPhase: formData.learningPhase || undefined,
        period: formData.period || undefined,
        intensity: formData.intensity || undefined,
        focusArea: formData.focusArea || undefined,
        notes: formData.notes || undefined,
      };

      onSubmit(submitData);
    },
    [formData, validate, onSubmit]
  );

  return (
    <div className="bg-ak-surface-base min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-ak-surface-base border-b border-ak-border-default sticky top-0 z-10">
        <Button variant="ghost" onClick={onCancel} leftIcon={<ChevronLeft size={20} />}>
          Avbryt
        </Button>
        <span className="text-xl font-semibold text-ak-text-primary">
          Ny treningsokt
        </span>
        <div className="w-[60px]" /> {/* Spacer for centering */}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        {/* Session Type */}
        <TypeSelector
          selected={formData.sessionType}
          onChange={(value) => updateField('sessionType', value)}
        />
        {errors.sessionType && (
          <span className="text-ak-status-error text-xs">
            {errors.sessionType}
          </span>
        )}

        {/* Date/Time */}
        <DateTimePicker
          date={formData.sessionDate}
          onDateChange={(value) => updateField('sessionDate', value)}
        />
        {errors.sessionDate && (
          <span className="text-ak-status-error text-xs">
            {errors.sessionDate}
          </span>
        )}

        {/* Duration */}
        <DurationSelector
          duration={formData.duration}
          onChange={(value) => updateField('duration', value)}
        />
        {errors.duration && (
          <span className="text-ak-status-error text-xs">
            {errors.duration}
          </span>
        )}

        {/* Learning Phase */}
        <LearningPhaseSelector
          selected={formData.learningPhase}
          onChange={(value) => updateField('learningPhase', value)}
        />

        {/* Period */}
        <PeriodSelector
          selected={formData.period}
          onChange={(value) => updateField('period', value)}
        />

        {/* Intensity */}
        <IntensitySlider
          value={formData.intensity}
          onChange={(value) => updateField('intensity', value)}
        />

        {/* Focus Area */}
        <TextAreaField
          label="Fokusomrade"
          value={formData.focusArea}
          onChange={(value) => updateField('focusArea', value)}
          placeholder="Hva vil du fokusere pa i denne okten?"
          icon={Target}
        />

        {/* Notes */}
        <TextAreaField
          label="Notater"
          value={formData.notes}
          onChange={(value) => updateField('notes', value)}
          placeholder="Andre notater eller instruksjoner..."
          icon={FileText}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          loading={isLoading}
          leftIcon={<Plus size={20} />}
          className="w-full p-4 mt-6 text-xl font-semibold"
        >
          {isLoading ? 'Oppretter...' : 'Opprett treningsokt'}
        </Button>
      </form>
    </div>
  );
}
