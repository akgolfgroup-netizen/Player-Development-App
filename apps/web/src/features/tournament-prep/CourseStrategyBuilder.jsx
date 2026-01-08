/**
 * CourseStrategyBuilder
 * Build course-level strategy for tournament
 *
 * Features:
 * - Course information (name, par, yardage)
 * - Weather conditions
 * - Key challenges
 * - Overall strategy notes
 * - Integrate with hole-by-hole planning
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTournamentPrep } from '../../hooks/useTournamentPrep';
import Button from '../../ui/primitives/Button';
import { track } from '../../analytics/track';

// ═══════════════════════════════════════════
// TAILWIND CLASSES
// ═══════════════════════════════════════════

const tw = {
  container: 'flex flex-col gap-6',
  header: 'flex items-center justify-between',
  title: 'text-xl font-semibold text-[var(--text-inverse)] m-0',
  form: 'flex flex-col gap-4',
  formRow: 'grid grid-cols-1 md:grid-cols-3 gap-4',
  formGroup: 'flex flex-col gap-2',
  label: 'text-sm font-semibold text-[var(--text-inverse)]',
  required: 'text-tier-error ml-1',
  input: 'w-full py-2 px-3 bg-surface-elevated border border-border rounded-lg text-[var(--text-inverse)] text-sm placeholder-[var(--video-text-tertiary)]',
  textarea: 'w-full py-2 px-3 bg-surface-elevated border border-border rounded-lg text-[var(--text-inverse)] text-sm placeholder-[var(--video-text-tertiary)] min-h-[100px] resize-y',
  select: 'w-full py-2 px-3 bg-surface-elevated border border-border rounded-lg text-[var(--text-inverse)] text-sm',
  helperText: 'text-xs text-[var(--video-text-secondary)] mt-1',
  infoCard: 'p-4 bg-purple-500/10 rounded-xl border border-purple-500',
  infoTitle: 'text-sm font-semibold text-[var(--text-inverse)] mb-2',
  infoText: 'text-xs text-[var(--video-text-secondary)]',
  actions: 'flex gap-3 justify-end pt-4 border-t border-border',
  errorMessage: 'py-2 px-3 bg-tier-error/20 border border-tier-error rounded-lg text-tier-error text-sm',
  successMessage: 'py-2 px-3 bg-tier-success/20 border border-tier-success rounded-lg text-tier-success text-sm',
};

// ═══════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════

export function CourseStrategyBuilder({
  className = '',
  preparation,
  onSave,
  onCancel,
}) {
  const {
    saveCourseStrategy,
    saving,
    error: apiError,
  } = useTournamentPrep();

  const existingStrategy = preparation?.courseStrategy;

  // Form state
  const [formData, setFormData] = useState({
    courseName: existingStrategy?.courseName || '',
    totalPar: existingStrategy?.totalPar || 72,
    totalYardage: existingStrategy?.totalYardage || '',
    weatherConditions: existingStrategy?.weatherConditions || '',
    keyChallenges: existingStrategy?.keyChallenges || '',
    overallStrategy: existingStrategy?.overallStrategy || '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Update form when strategy changes
  useEffect(() => {
    if (existingStrategy) {
      setFormData({
        courseName: existingStrategy.courseName || '',
        totalPar: existingStrategy.totalPar || 72,
        totalYardage: existingStrategy.totalYardage || '',
        weatherConditions: existingStrategy.weatherConditions || '',
        keyChallenges: existingStrategy.keyChallenges || '',
        overallStrategy: existingStrategy.overallStrategy || '',
      });
    }
  }, [existingStrategy]);

  // Handle input change
  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
    setSuccess(false);
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    if (!formData.courseName) {
      setError('Banenavn er påkrevd');
      return false;
    }

    return true;
  }, [formData]);

  // Handle save
  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      if (!preparation?.id) {
        setError('Ingen forberedelse valgt');
        return;
      }

      try {
        const savedStrategy = await saveCourseStrategy(preparation.id, formData);

        setSuccess(true);

        track('course_strategy_saved', {
          screen: 'CourseStrategyBuilder',
          prepId: preparation.id,
        });

        if (onSave) {
          onSave(savedStrategy);
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        console.error('Failed to save course strategy:', err);
        setError('Kunne ikke lagre banestrategi');
      }
    },
    [formData, preparation, validateForm, saveCourseStrategy, onSave]
  );

  return (
    <div className={`${tw.container} ${className}`}>
      {/* Header */}
      <div className={tw.header}>
        <h2 className={tw.title}>Banestrategi</h2>
      </div>

      {/* Info Card */}
      <div className={tw.infoCard}>
        <h3 className={tw.infoTitle}>💡 Tips for banestrategi</h3>
        <p className={tw.infoText}>
          Definer en overordnet strategi for banen basert på spillerens styrker,
          værets påvirkning, og banens utfordringer. Dette vil hjelpe deg å planlegge
          hvert hull mer effektivt.
        </p>
      </div>

      {/* Error Message */}
      {(error || apiError) && (
        <div className={tw.errorMessage}>{error || apiError}</div>
      )}

      {/* Success Message */}
      {success && (
        <div className={tw.successMessage}>✓ Banestrategi lagret!</div>
      )}

      {/* Form */}
      <form className={tw.form} onSubmit={handleSave}>
        {/* Course Info Row */}
        <div className={tw.formRow}>
          <div className={tw.formGroup}>
            <label className={tw.label}>
              Banenavn<span className={tw.required}>*</span>
            </label>
            <input
              type="text"
              value={formData.courseName}
              onChange={(e) => handleChange('courseName', e.target.value)}
              placeholder="F.eks. Augusta National"
              className={tw.input}
              required
            />
          </div>

          <div className={tw.formGroup}>
            <label className={tw.label}>Total Par</label>
            <input
              type="number"
              value={formData.totalPar}
              onChange={(e) => handleChange('totalPar', parseInt(e.target.value))}
              placeholder="72"
              className={tw.input}
              min="60"
              max="80"
            />
          </div>

          <div className={tw.formGroup}>
            <label className={tw.label}>Total Lengde (meter)</label>
            <input
              type="number"
              value={formData.totalYardage}
              onChange={(e) => handleChange('totalYardage', parseInt(e.target.value))}
              placeholder="F.eks. 6500"
              className={tw.input}
              min="4000"
              max="8000"
            />
          </div>
        </div>

        {/* Weather Conditions */}
        <div className={tw.formGroup}>
          <label className={tw.label}>Værforhold</label>
          <select
            value={formData.weatherConditions}
            onChange={(e) => handleChange('weatherConditions', e.target.value)}
            className={tw.select}
          >
            <option value="">Velg værforhold...</option>
            <option value="sunny">sun Solskinn</option>
            <option value="cloudy">☁️ Overskyet</option>
            <option value="windy">💨 Blåsende</option>
            <option value="rainy">🌧️ Regnvær</option>
            <option value="cold">❄️ Kaldt</option>
            <option value="hot"> Varmt</option>
          </select>
          <p className={tw.helperText}>
            Velg forventet vær for turneringen (påvirker klubbvalg og strategi)
          </p>
        </div>

        {/* Key Challenges */}
        <div className={tw.formGroup}>
          <label className={tw.label}>Viktige utfordringer</label>
          <textarea
            value={formData.keyChallenges}
            onChange={(e) => handleChange('keyChallenges', e.target.value)}
            placeholder="Beskriv banens viktigste utfordringer (f.eks. smale fairways, dype bunkere, raske greener)..."
            className={tw.textarea}
          />
          <p className={tw.helperText}>
            Identifiser de største utfordringene på denne banen
          </p>
        </div>

        {/* Overall Strategy */}
        <div className={tw.formGroup}>
          <label className={tw.label}>Overordnet strategi</label>
          <textarea
            value={formData.overallStrategy}
            onChange={(e) => handleChange('overallStrategy', e.target.value)}
            placeholder="Beskriv den overordnede strategien for banen (f.eks. spill konservativt, fokus på fairway, aggressiv på par 5-ere)..."
            className={tw.textarea}
          />
          <p className={tw.helperText}>
            Din generelle tilnærming til banen basert på spillerens styrker
          </p>
        </div>

        {/* Actions */}
        <div className={tw.actions}>
          {onCancel && (
            <Button variant="secondary" onClick={onCancel} disabled={saving}>
              Avbryt
            </Button>
          )}
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? 'Lagrer...' : '💾 Lagre banestrategi'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CourseStrategyBuilder;
