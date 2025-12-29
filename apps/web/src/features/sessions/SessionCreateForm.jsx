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
// UiCanon: CSS variables
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
  { id: 'E', label: 'Etableringsfase', color: 'var(--accent)' },
  { id: 'G', label: 'Grunnfase', color: 'var(--success)' },
  { id: 'S', label: 'Spesifikkfase', color: 'var(--warning)' },
  { id: 'T', label: 'Toppfase', color: 'var(--error)' },
];

// Duration options (in minutes)
const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120, 150, 180];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function TypeSelector({ selected, onChange }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          color: 'var(--text-primary)',
          fontSize: '12px', lineHeight: '16px', fontWeight: 500,
        }}
      >
        Type trening *
      </label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
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
              padding: '16px',
              backgroundColor: selected === type.id ? 'var(--accent)' : 'var(--bg-primary)',
              color: selected === type.id ? 'var(--bg-primary)' : 'var(--text-primary)',
              border: `1px solid ${selected === type.id ? 'var(--accent)' : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '24px', marginBottom: '4px' }}>{type.icon}</span>
            <span style={{ fontSize: '12px', lineHeight: '16px', textAlign: 'center' }}>{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DateTimePicker({ date, onDateChange }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          color: 'var(--text-primary)',
          fontSize: '12px', lineHeight: '16px', fontWeight: 500,
        }}
      >
        <Calendar size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
        Dato og tid *
      </label>
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          fontSize: '15px', lineHeight: '20px',
        }}
      />
    </div>
  );
}

function DurationSelector({ duration, onChange }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          color: 'var(--text-primary)',
          fontSize: '12px', lineHeight: '16px', fontWeight: 500,
        }}
      >
        <Clock size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
        Varighet *
      </label>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {DURATION_OPTIONS.map((mins) => (
          <button
            key={mins}
            type="button"
            onClick={() => onChange(mins)}
            style={{
              padding: `${'8px'} ${'16px'}`,
              backgroundColor: duration === mins ? 'var(--accent)' : 'var(--bg-primary)',
              color: duration === mins ? 'var(--bg-primary)' : 'var(--text-primary)',
              border: `1px solid ${duration === mins ? 'var(--accent)' : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: '15px', lineHeight: '20px',
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
    <div style={{ marginBottom: '24px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          color: 'var(--text-primary)',
          fontSize: '12px', lineHeight: '16px', fontWeight: 500,
        }}
      >
        Laeringsfase
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {LEARNING_PHASES.map((phase) => (
          <button
            key={phase.id}
            type="button"
            onClick={() => onChange(selected === phase.id ? null : phase.id)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: selected === phase.id ? 'rgba(var(--accent-rgb), 0.1)' : 'var(--bg-primary)',
              border: `1px solid ${selected === phase.id ? 'var(--accent)' : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div>
              <span style={{ fontSize: '15px', lineHeight: '20px', color: 'var(--text-primary)' }}>
                {phase.label}
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '12px', lineHeight: '16px',
                  color: 'var(--text-secondary)',
                }}
              >
                {phase.description}
              </span>
            </div>
            {selected === phase.id && (
              <span style={{ color: 'var(--accent)', fontSize: '18px' }}>✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function PeriodSelector({ selected, onChange }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          color: 'var(--text-primary)',
          fontSize: '12px', lineHeight: '16px', fontWeight: 500,
        }}
      >
        Treningsperiode
      </label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
        }}
      >
        {PERIODS.map((period) => (
          <button
            key={period.id}
            type="button"
            onClick={() => onChange(selected === period.id ? null : period.id)}
            style={{
              padding: '16px',
              backgroundColor: selected === period.id ? period.color : 'var(--bg-primary)',
              color: selected === period.id ? 'var(--bg-primary)' : 'var(--text-primary)',
              border: `1px solid ${selected === period.id ? period.color : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: '12px', lineHeight: '16px', fontWeight: 500,
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
            marginTop: '4px',
            fontSize: '12px', lineHeight: '16px',
            color: 'var(--text-secondary)',
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
    <div style={{ marginBottom: '24px' }}>
      <label
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
          color: 'var(--text-primary)',
          fontSize: '12px', lineHeight: '16px', fontWeight: 500,
        }}
      >
        <span>
          <Zap size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          Intensitet
        </span>
        <span style={{ color: 'var(--accent)' }}>{value || '-'}/10</span>
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
          borderRadius: '9999px',
          appearance: 'none',
          background: `linear-gradient(to right, var(--accent) ${((value || 5) - 1) * 11.1}%, var(--border-default) ${((value || 5) - 1) * 11.1}%)`,
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '4px',
          fontSize: '12px', lineHeight: '16px',
          color: 'var(--text-secondary)',
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
    <div style={{ marginBottom: '24px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          color: 'var(--text-primary)',
          fontSize: '12px', lineHeight: '16px', fontWeight: 500,
        }}
      >
        {Icon && <Icon size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
        {label}
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          resize: 'vertical',
          fontSize: '15px', lineHeight: '20px',
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
        backgroundColor: 'var(--bg-primary)',
        minHeight: '100vh',
        fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-default)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Button variant="ghost" onClick={onCancel} leftIcon={<ChevronLeft size={20} />}>
          Avbryt
        </Button>
        <span style={{ fontSize: '20px', lineHeight: '25px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Ny treningsokt
        </span>
        <div style={{ width: '60px' }} /> {/* Spacer for centering */}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
        {/* Session Type */}
        <TypeSelector
          selected={formData.sessionType}
          onChange={(value) => updateField('sessionType', value)}
        />
        {errors.sessionType && (
          <span style={{ color: 'var(--error)', fontSize: '12px', lineHeight: '16px' }}>
            {errors.sessionType}
          </span>
        )}

        {/* Date/Time */}
        <DateTimePicker
          date={formData.sessionDate}
          onDateChange={(value) => updateField('sessionDate', value)}
        />
        {errors.sessionDate && (
          <span style={{ color: 'var(--error)', fontSize: '12px', lineHeight: '16px' }}>
            {errors.sessionDate}
          </span>
        )}

        {/* Duration */}
        <DurationSelector
          duration={formData.duration}
          onChange={(value) => updateField('duration', value)}
        />
        {errors.duration && (
          <span style={{ color: 'var(--error)', fontSize: '12px', lineHeight: '16px' }}>
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
          style={{ width: '100%', padding: '16px', marginTop: '24px', fontSize: '20px', fontWeight: 600 }}
        >
          {isLoading ? 'Oppretter...' : 'Opprett treningsokt'}
        </Button>
      </form>
    </div>
  );
}
