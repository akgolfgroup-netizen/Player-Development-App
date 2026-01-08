/**
 * TournamentPrepForm
 * Form for creating and editing tournament preparation
 *
 * Features:
 * - Select tournament and player
 * - Set goal score
 * - Define mental focus areas
 * - Set process goals
 * - Save preparation
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
  formGroup: 'flex flex-col gap-2',
  label: 'text-sm font-semibold text-[var(--text-inverse)]',
  required: 'text-ak-status-error ml-1',
  input: 'w-full py-2 px-3 bg-surface-elevated border border-border rounded-ak-md text-[var(--text-inverse)] text-sm placeholder-[var(--video-text-tertiary)]',
  textarea: 'w-full py-2 px-3 bg-surface-elevated border border-border rounded-ak-md text-[var(--text-inverse)] text-sm placeholder-[var(--video-text-tertiary)] min-h-[100px] resize-y',
  select: 'w-full py-2 px-3 bg-surface-elevated border border-border rounded-ak-md text-[var(--text-inverse)] text-sm',
  helperText: 'text-xs text-[var(--video-text-secondary)] mt-1',
  goalsList: 'flex flex-col gap-2',
  goalItem: 'flex items-center gap-2 p-2 bg-surface-elevated rounded-ak-md border border-border',
  goalText: 'flex-1 text-sm text-[var(--text-inverse)]',
  removeButton: 'py-1 px-2 bg-ak-status-error/20 border border-ak-status-error rounded-ak-sm text-ak-status-error text-xs font-medium cursor-pointer hover:bg-ak-status-error/30 transition-colors',
  addGoalRow: 'flex gap-2',
  addGoalInput: 'flex-1 py-2 px-3 bg-surface-elevated border border-border rounded-ak-md text-[var(--text-inverse)] text-sm',
  addGoalButton: 'py-2 px-4 bg-primary border-2 border-primary rounded-ak-md text-white text-sm font-medium cursor-pointer hover:bg-primary-hover transition-colors',
  actions: 'flex gap-3 justify-end pt-4 border-t border-border',
  errorMessage: 'py-2 px-3 bg-ak-status-error/20 border border-ak-status-error rounded-ak-md text-ak-status-error text-sm',
};

// ═══════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════

export function TournamentPrepForm({
  className = '',
  preparation = null,
  onSave,
  onCancel,
}) {
  const {
    createPreparation,
    updatePreparation,
    saving,
    error: apiError,
  } = useTournamentPrep();

  // Form state
  const [formData, setFormData] = useState({
    tournamentId: preparation?.tournamentId || '',
    playerId: preparation?.playerId || '',
    goalScore: preparation?.goalScore || '',
    mentalFocusAreas: preparation?.mentalFocusAreas || '',
    processGoals: preparation?.processGoals || [],
  });

  const [newGoal, setNewGoal] = useState('');
  const [error, setError] = useState(null);

  // Update form when preparation changes
  useEffect(() => {
    if (preparation) {
      setFormData({
        tournamentId: preparation.tournamentId || '',
        playerId: preparation.playerId || '',
        goalScore: preparation.goalScore || '',
        mentalFocusAreas: preparation.mentalFocusAreas || '',
        processGoals: preparation.processGoals || [],
      });
    }
  }, [preparation]);

  // Handle input change
  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  }, []);

  // Add process goal
  const handleAddGoal = useCallback(() => {
    if (!newGoal.trim()) return;

    setFormData((prev) => ({
      ...prev,
      processGoals: [...prev.processGoals, newGoal.trim()],
    }));
    setNewGoal('');
  }, [newGoal]);

  // Remove process goal
  const handleRemoveGoal = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      processGoals: prev.processGoals.filter((_, i) => i !== index),
    }));
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    if (!formData.tournamentId) {
      setError('Turnering er påkrevd');
      return false;
    }

    if (!formData.playerId) {
      setError('Spiller er påkrevd');
      return false;
    }

    return true;
  }, [formData]);

  // Handle save
  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      try {
        let savedPrep;
        if (preparation?.id) {
          savedPrep = await updatePreparation(preparation.id, formData);
        } else {
          savedPrep = await createPreparation(formData);
        }

        track('tournament_prep_saved', {
          screen: 'TournamentPrepForm',
          mode: preparation?.id ? 'edit' : 'create',
        });

        if (onSave) {
          onSave(savedPrep);
        }
      } catch (err) {
        console.error('Failed to save preparation:', err);
        setError('Kunne ikke lagre forberedelse');
      }
    },
    [formData, preparation, validateForm, createPreparation, updatePreparation, onSave]
  );

  return (
    <div className={`${tw.container} ${className}`}>
      {/* Header */}
      <div className={tw.header}>
        <h2 className={tw.title}>
          {preparation?.id ? 'Rediger Forberedelse' : 'Ny Turneringsforberedelse'}
        </h2>
      </div>

      {/* Error Message */}
      {(error || apiError) && (
        <div className={tw.errorMessage}>{error || apiError}</div>
      )}

      {/* Form */}
      <form className={tw.form} onSubmit={handleSave}>
        {/* Tournament Selection */}
        <div className={tw.formGroup}>
          <label className={tw.label}>
            Turnering<span className={tw.required}>*</span>
          </label>
          <select
            value={formData.tournamentId}
            onChange={(e) => handleChange('tournamentId', e.target.value)}
            className={tw.select}
            required
          >
            <option value="">Velg turnering...</option>
            {/* TODO: Load tournaments from API */}
            <option value="demo-tournament-1">Demo Turnering 2024</option>
          </select>
        </div>

        {/* Player Selection */}
        <div className={tw.formGroup}>
          <label className={tw.label}>
            Spiller<span className={tw.required}>*</span>
          </label>
          <select
            value={formData.playerId}
            onChange={(e) => handleChange('playerId', e.target.value)}
            className={tw.select}
            required
          >
            <option value="">Velg spiller...</option>
            <option value="00000000-0000-0000-0000-000000000004">Demo Spiller</option>
            {/* TODO: Load players from API */}
          </select>
        </div>

        {/* Goal Score */}
        <div className={tw.formGroup}>
          <label className={tw.label}>Målscore</label>
          <input
            type="number"
            value={formData.goalScore}
            onChange={(e) => handleChange('goalScore', e.target.value)}
            placeholder="F.eks. 72"
            className={tw.input}
            min="0"
            max="200"
          />
          <p className={tw.helperText}>
            Sett et realistisk mål for hva spilleren skal score i turneringen
          </p>
        </div>

        {/* Mental Focus Areas */}
        <div className={tw.formGroup}>
          <label className={tw.label}>Mentale fokusområder</label>
          <textarea
            value={formData.mentalFocusAreas}
            onChange={(e) => handleChange('mentalFocusAreas', e.target.value)}
            placeholder="Beskriv hvilke mentale aspekter spilleren skal fokusere på..."
            className={tw.textarea}
          />
          <p className={tw.helperText}>
            F.eks. rolig i press-situasjoner, positiv selvprat, fokus på prosess
          </p>
        </div>

        {/* Process Goals */}
        <div className={tw.formGroup}>
          <label className={tw.label}>Prosessmål</label>
          <div className={tw.goalsList}>
            {formData.processGoals.map((goal, index) => (
              <div key={index} className={tw.goalItem}>
                <span className={tw.goalText}>• {goal}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveGoal(index)}
                  className={tw.removeButton}
                >
                  Fjern
                </button>
              </div>
            ))}
          </div>
          <div className={tw.addGoalRow}>
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Legg til prosessmål..."
              className={tw.addGoalInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddGoal();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddGoal}
              className={tw.addGoalButton}
            >
              ➕ Legg til
            </button>
          </div>
          <p className={tw.helperText}>
            Prosessmål fokuserer på handlinger spilleren kan kontrollere (f.eks. "Hold fokus på hvert slag", "Følg pre-shot rutine")
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
            {saving ? 'Lagrer...' : 'Lagre forberedelse'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default TournamentPrepForm;
