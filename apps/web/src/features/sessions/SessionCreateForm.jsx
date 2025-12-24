/**
 * SessionCreateForm - Create new training session
 *
 * Design Source: /packages/design-system/figma/ak_golf_complete_figma_kit.svg
 * Spec Source: /Docs/specs/APP_FUNCTIONALITY.md
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
 */
import React, { useState, useCallback } from 'react';
import { tokens, typographyStyle } from '../../design-tokens';
import { ChevronLeft, Calendar, Clock, Target, Zap, FileText, Plus } from 'lucide-react';

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
  { id: 'E', label: 'Etableringsfase', color: tokens.colors.primary },
  { id: 'G', label: 'Grunnfase', color: tokens.colors.success },
  { id: 'S', label: 'Spesifikkfase', color: tokens.colors.warning },
  { id: 'T', label: 'Toppfase', color: tokens.colors.error },
];

// Duration options (in minutes)
const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120, 150, 180];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function TypeSelector({ selected, onChange }) {
  return (
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <label
        style={{
          display: 'block',
          marginBottom: tokens.spacing.sm,
          color: tokens.colors.charcoal,
          ...typographyStyle('label'),
        }}
      >
        Type trening *
      </label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: tokens.spacing.sm,
        }}
      >
        {SESSION_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => onChange(type.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: tokens.spacing.md,
              backgroundColor: selected === type.id ? tokens.colors.primary : tokens.colors.white,
              color: selected === type.id ? tokens.colors.white : tokens.colors.charcoal,
              border: `1px solid ${selected === type.id ? tokens.colors.primary : tokens.colors.mist}`,
              borderRadius: tokens.borderRadius.md,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '24px', marginBottom: tokens.spacing.xs }}>{type.icon}</span>
            <span style={{ ...typographyStyle('caption'), textAlign: 'center' }}>{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DateTimePicker({ date, onDateChange }) {
  return (
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <label
        style={{
          display: 'block',
          marginBottom: tokens.spacing.sm,
          color: tokens.colors.charcoal,
          ...typographyStyle('label'),
        }}
      >
        <Calendar size={16} style={{ marginRight: tokens.spacing.xs, verticalAlign: 'middle' }} />
        Dato og tid *
      </label>
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        style={{
          width: '100%',
          padding: tokens.spacing.md,
          backgroundColor: tokens.colors.snow,
          border: `1px solid ${tokens.colors.mist}`,
          borderRadius: tokens.borderRadius.md,
          ...typographyStyle('body'),
        }}
      />
    </div>
  );
}

function DurationSelector({ duration, onChange }) {
  return (
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <label
        style={{
          display: 'block',
          marginBottom: tokens.spacing.sm,
          color: tokens.colors.charcoal,
          ...typographyStyle('label'),
        }}
      >
        <Clock size={16} style={{ marginRight: tokens.spacing.xs, verticalAlign: 'middle' }} />
        Varighet *
      </label>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: tokens.spacing.sm,
        }}
      >
        {DURATION_OPTIONS.map((mins) => (
          <button
            key={mins}
            type="button"
            onClick={() => onChange(mins)}
            style={{
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
              backgroundColor: duration === mins ? tokens.colors.primary : tokens.colors.white,
              color: duration === mins ? tokens.colors.white : tokens.colors.charcoal,
              border: `1px solid ${duration === mins ? tokens.colors.primary : tokens.colors.mist}`,
              borderRadius: tokens.borderRadius.md,
              cursor: 'pointer',
              ...typographyStyle('body'),
            }}
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
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <label
        style={{
          display: 'block',
          marginBottom: tokens.spacing.sm,
          color: tokens.colors.charcoal,
          ...typographyStyle('label'),
        }}
      >
        Laeringsfase
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
        {LEARNING_PHASES.map((phase) => (
          <button
            key={phase.id}
            type="button"
            onClick={() => onChange(selected === phase.id ? null : phase.id)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: tokens.spacing.md,
              backgroundColor: selected === phase.id ? `${tokens.colors.primary}10` : tokens.colors.white,
              border: `1px solid ${selected === phase.id ? tokens.colors.primary : tokens.colors.mist}`,
              borderRadius: tokens.borderRadius.md,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div>
              <span style={{ ...typographyStyle('body'), color: tokens.colors.charcoal }}>
                {phase.label}
              </span>
              <span
                style={{
                  display: 'block',
                  ...typographyStyle('caption'),
                  color: tokens.colors.steel,
                }}
              >
                {phase.description}
              </span>
            </div>
            {selected === phase.id && (
              <span style={{ color: tokens.colors.primary, fontSize: '18px' }}>✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function PeriodSelector({ selected, onChange }) {
  return (
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <label
        style={{
          display: 'block',
          marginBottom: tokens.spacing.sm,
          color: tokens.colors.charcoal,
          ...typographyStyle('label'),
        }}
      >
        Treningsperiode
      </label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: tokens.spacing.sm,
        }}
      >
        {PERIODS.map((period) => (
          <button
            key={period.id}
            type="button"
            onClick={() => onChange(selected === period.id ? null : period.id)}
            style={{
              padding: tokens.spacing.md,
              backgroundColor: selected === period.id ? period.color : tokens.colors.white,
              color: selected === period.id ? tokens.colors.white : tokens.colors.charcoal,
              border: `1px solid ${selected === period.id ? period.color : tokens.colors.mist}`,
              borderRadius: tokens.borderRadius.md,
              cursor: 'pointer',
              ...typographyStyle('label'),
            }}
          >
            {period.id}
          </button>
        ))}
      </div>
      {selected && (
        <span
          style={{
            display: 'block',
            marginTop: tokens.spacing.xs,
            ...typographyStyle('caption'),
            color: tokens.colors.steel,
          }}
        >
          {PERIODS.find((p) => p.id === selected)?.label}
        </span>
      )}
    </div>
  );
}

function IntensitySlider({ value, onChange }) {
  return (
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <label
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: tokens.spacing.sm,
          color: tokens.colors.charcoal,
          ...typographyStyle('label'),
        }}
      >
        <span>
          <Zap size={16} style={{ marginRight: tokens.spacing.xs, verticalAlign: 'middle' }} />
          Intensitet
        </span>
        <span style={{ color: tokens.colors.primary }}>{value || '-'}/10</span>
      </label>
      <input
        type="range"
        min="1"
        max="10"
        value={value || 5}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{
          width: '100%',
          height: '8px',
          borderRadius: tokens.borderRadius.full,
          appearance: 'none',
          background: `linear-gradient(to right, ${tokens.colors.primary} ${((value || 5) - 1) * 11.1}%, ${tokens.colors.mist} ${((value || 5) - 1) * 11.1}%)`,
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: tokens.spacing.xs,
          ...typographyStyle('caption'),
          color: tokens.colors.steel,
        }}
      >
        <span>Lett</span>
        <span>Moderat</span>
        <span>Hard</span>
      </div>
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, icon: Icon }) {
  return (
    <div style={{ marginBottom: tokens.spacing.lg }}>
      <label
        style={{
          display: 'block',
          marginBottom: tokens.spacing.sm,
          color: tokens.colors.charcoal,
          ...typographyStyle('label'),
        }}
      >
        {Icon && <Icon size={16} style={{ marginRight: tokens.spacing.xs, verticalAlign: 'middle' }} />}
        {label}
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        style={{
          width: '100%',
          padding: tokens.spacing.md,
          backgroundColor: tokens.colors.snow,
          border: `1px solid ${tokens.colors.mist}`,
          borderRadius: tokens.borderRadius.md,
          resize: 'vertical',
          ...typographyStyle('body'),
        }}
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
    <div
      style={{
        backgroundColor: tokens.colors.surface,
        minHeight: '100vh',
        fontFamily: tokens.typography.fontFamily,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: tokens.spacing.md,
          backgroundColor: tokens.colors.white,
          borderBottom: `1px solid ${tokens.colors.mist}`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing.xs,
            background: 'none',
            border: 'none',
            color: tokens.colors.primary,
            cursor: 'pointer',
            ...typographyStyle('body'),
          }}
        >
          <ChevronLeft size={20} />
          Avbryt
        </button>
        <span style={{ ...typographyStyle('title3'), color: tokens.colors.charcoal }}>
          Ny treningsokt
        </span>
        <div style={{ width: '60px' }} /> {/* Spacer for centering */}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ padding: tokens.spacing.lg }}>
        {/* Session Type */}
        <TypeSelector
          selected={formData.sessionType}
          onChange={(value) => updateField('sessionType', value)}
        />
        {errors.sessionType && (
          <span style={{ color: tokens.colors.error, ...typographyStyle('caption') }}>
            {errors.sessionType}
          </span>
        )}

        {/* Date/Time */}
        <DateTimePicker
          date={formData.sessionDate}
          onDateChange={(value) => updateField('sessionDate', value)}
        />
        {errors.sessionDate && (
          <span style={{ color: tokens.colors.error, ...typographyStyle('caption') }}>
            {errors.sessionDate}
          </span>
        )}

        {/* Duration */}
        <DurationSelector
          duration={formData.duration}
          onChange={(value) => updateField('duration', value)}
        />
        {errors.duration && (
          <span style={{ color: tokens.colors.error, ...typographyStyle('caption') }}>
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
        <button
          type="submit"
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: tokens.spacing.sm,
            width: '100%',
            padding: tokens.spacing.md,
            backgroundColor: isLoading ? tokens.colors.steel : tokens.colors.primary,
            color: tokens.colors.white,
            border: 'none',
            borderRadius: tokens.borderRadius.md,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginTop: tokens.spacing.lg,
            ...typographyStyle('title3'),
          }}
        >
          <Plus size={20} />
          {isLoading ? 'Oppretter...' : 'Opprett treningsokt'}
        </button>
      </form>
    </div>
  );
}
