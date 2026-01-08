/**
 * HoleStrategyPlanner
 * Plan strategy for each hole on the course
 *
 * Features:
 * - Select hole number (1-18)
 * - Hole info (par, yardage)
 * - Tee shot strategy
 * - Approach shot strategy
 * - Target areas
 * - Risk assessment
 * - Notes
 */

import React, { useState, useCallback, useEffect } from 'react';
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
  holeSelector: 'grid grid-cols-6 md:grid-cols-9 gap-2',
  holeButton: 'py-2 px-3 bg-surface-elevated border border-border rounded-lg text-[var(--text-inverse)] text-sm font-medium cursor-pointer hover:bg-surface-elevated-hover transition-colors text-center',
  holeButtonActive: 'py-2 px-3 bg-primary border-2 border-primary rounded-lg text-white text-sm font-medium cursor-pointer text-center',
  holeButtonCompleted: 'py-2 px-3 bg-tier-success/20 border-2 border-tier-success rounded-lg text-tier-success text-sm font-medium cursor-pointer text-center',
  form: 'flex flex-col gap-4',
  formRow: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  formGroup: 'flex flex-col gap-2',
  label: 'text-sm font-semibold text-[var(--text-inverse)]',
  input: 'w-full py-2 px-3 bg-surface-elevated border border-border rounded-lg text-[var(--text-inverse)] text-sm placeholder-[var(--video-text-tertiary)]',
  textarea: 'w-full py-2 px-3 bg-surface-elevated border border-border rounded-lg text-[var(--text-inverse)] text-sm placeholder-[var(--video-text-tertiary)] min-h-[80px] resize-y',
  select: 'w-full py-2 px-3 bg-surface-elevated border border-border rounded-lg text-[var(--text-inverse)] text-sm',
  helperText: 'text-xs text-[var(--video-text-secondary)] mt-1',
  infoCard: 'p-4 bg-blue-500/10 rounded-xl border border-blue-500',
  infoRow: 'flex items-center justify-between text-sm',
  infoLabel: 'text-[var(--video-text-secondary)]',
  infoValue: 'text-[var(--text-inverse)] font-semibold',
  actions: 'flex gap-3 justify-between pt-4 border-t border-border',
  navigationButtons: 'flex gap-2',
  saveButtons: 'flex gap-2',
  errorMessage: 'py-2 px-3 bg-tier-error/20 border border-tier-error rounded-lg text-tier-error text-sm',
  successMessage: 'py-2 px-3 bg-tier-success/20 border border-tier-success rounded-lg text-tier-success text-sm',
  emptyState: 'flex flex-col items-center justify-center gap-3 py-12 text-center bg-surface rounded-xl border border-border',
  emptyIcon: 'text-5xl opacity-30',
  emptyTitle: 'text-base font-semibold text-[var(--text-inverse)] m-0',
  emptyDescription: 'text-sm text-[var(--video-text-secondary)] m-0 max-w-xs',
};

// ═══════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════

export function HoleStrategyPlanner({
  className = '',
  preparation,
}) {
  const {
    saveHoleStrategy,
    saving,
    error: apiError,
  } = useTournamentPrep();

  const courseStrategy = preparation?.courseStrategy;
  const holes = courseStrategy?.holes || [];

  const [selectedHole, setSelectedHole] = useState(1);
  const [formData, setFormData] = useState({
    holeNumber: 1,
    par: 4,
    yardage: '',
    teeClub: '',
    teeTarget: '',
    approachClub: '',
    approachTarget: '',
    riskLevel: 'medium',
    notes: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load hole data when selected hole changes
  useEffect(() => {
    const existingHole = holes.find(h => h.holeNumber === selectedHole);
    if (existingHole) {
      setFormData({
        holeNumber: existingHole.holeNumber,
        par: existingHole.par || 4,
        yardage: existingHole.yardage || '',
        teeClub: existingHole.teeClub || '',
        teeTarget: existingHole.teeTarget || '',
        approachClub: existingHole.approachClub || '',
        approachTarget: existingHole.approachTarget || '',
        riskLevel: existingHole.riskLevel || 'medium',
        notes: existingHole.notes || '',
      });
    } else {
      // Reset form for new hole
      setFormData({
        holeNumber: selectedHole,
        par: 4,
        yardage: '',
        teeClub: '',
        teeTarget: '',
        approachClub: '',
        approachTarget: '',
        riskLevel: 'medium',
        notes: '',
      });
    }
  }, [selectedHole, holes]);

  // Handle input change
  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
    setSuccess(false);
  }, []);

  // Handle save
  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();

      if (!courseStrategy?.id) {
        setError('Ingen banestrategi funnet. Opprett banestrategi først.');
        return;
      }

      try {
        await saveHoleStrategy(courseStrategy.id, selectedHole, formData);

        setSuccess(true);

        track('hole_strategy_saved', {
          screen: 'HoleStrategyPlanner',
          holeNumber: selectedHole,
          prepId: preparation?.id,
        });

        // Clear success message after 2 seconds
        setTimeout(() => setSuccess(false), 2000);
      } catch (err) {
        console.error('Failed to save hole strategy:', err);
        setError('Kunne ikke lagre hullstrategi');
      }
    },
    [courseStrategy, selectedHole, formData, saveHoleStrategy, preparation]
  );

  // Handle previous/next hole
  const handlePreviousHole = useCallback(() => {
    if (selectedHole > 1) {
      setSelectedHole(selectedHole - 1);
    }
  }, [selectedHole]);

  const handleNextHole = useCallback(() => {
    if (selectedHole < 18) {
      setSelectedHole(selectedHole + 1);
    }
  }, [selectedHole]);

  // Check if hole is completed
  const isHoleCompleted = useCallback((holeNumber) => {
    return holes.some(h => h.holeNumber === holeNumber);
  }, [holes]);

  // If no course strategy, show message
  if (!courseStrategy) {
    return (
      <div className={`${tw.container} ${className}`}>
        <div className={tw.emptyState}>
          <div className={tw.emptyIcon}>🏌️</div>
          <h3 className={tw.emptyTitle}>Ingen banestrategi</h3>
          <p className={tw.emptyDescription}>
            Du må opprette en banestrategi før du kan planlegge hull-for-hull
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${tw.container} ${className}`}>
      {/* Header */}
      <div className={tw.header}>
        <h2 className={tw.title}>Hull-for-hull Planlegging</h2>
      </div>

      {/* Hole Selector */}
      <div>
        <div className="text-sm font-semibold text-[var(--text-inverse)] mb-2">
          Velg hull
        </div>
        <div className={tw.holeSelector}>
          {Array.from({ length: 18 }, (_, i) => i + 1).map((holeNum) => (
            <button
              key={holeNum}
              type="button"
              onClick={() => setSelectedHole(holeNum)}
              className={
                selectedHole === holeNum
                  ? tw.holeButtonActive
                  : isHoleCompleted(holeNum)
                  ? tw.holeButtonCompleted
                  : tw.holeButton
              }
            >
              {holeNum}
            </button>
          ))}
        </div>
      </div>

      {/* Hole Info Card */}
      <div className={tw.infoCard}>
        <div className={tw.infoRow}>
          <span className={tw.infoLabel}>Hull #{selectedHole}</span>
          <span className={tw.infoValue}>
            Par {formData.par}
            {formData.yardage && ` • ${formData.yardage}m`}
          </span>
        </div>
      </div>

      {/* Error/Success Messages */}
      {(error || apiError) && (
        <div className={tw.errorMessage}>{error || apiError}</div>
      )}
      {success && (
        <div className={tw.successMessage}>✓ Hull #{selectedHole} strategi lagret!</div>
      )}

      {/* Form */}
      <form className={tw.form} onSubmit={handleSave}>
        {/* Basic Info */}
        <div className={tw.formRow}>
          <div className={tw.formGroup}>
            <label className={tw.label}>Par</label>
            <select
              value={formData.par}
              onChange={(e) => handleChange('par', parseInt(e.target.value))}
              className={tw.select}
            >
              <option value={3}>Par 3</option>
              <option value={4}>Par 4</option>
              <option value={5}>Par 5</option>
            </select>
          </div>

          <div className={tw.formGroup}>
            <label className={tw.label}>Lengde (meter)</label>
            <input
              type="number"
              value={formData.yardage}
              onChange={(e) => handleChange('yardage', parseInt(e.target.value))}
              placeholder="F.eks. 380"
              className={tw.input}
            />
          </div>
        </div>

        {/* Tee Shot Strategy */}
        <div className={tw.formRow}>
          <div className={tw.formGroup}>
            <label className={tw.label}>Klubb fra tee</label>
            <input
              type="text"
              value={formData.teeClub}
              onChange={(e) => handleChange('teeClub', e.target.value)}
              placeholder="F.eks. Driver, 3-wood"
              className={tw.input}
            />
          </div>

          <div className={tw.formGroup}>
            <label className={tw.label}>Mål fra tee</label>
            <input
              type="text"
              value={formData.teeTarget}
              onChange={(e) => handleChange('teeTarget', e.target.value)}
              placeholder="F.eks. Venstre side av fairway"
              className={tw.input}
            />
          </div>
        </div>

        {/* Approach Shot Strategy */}
        <div className={tw.formRow}>
          <div className={tw.formGroup}>
            <label className={tw.label}>Klubb til green</label>
            <input
              type="text"
              value={formData.approachClub}
              onChange={(e) => handleChange('approachClub', e.target.value)}
              placeholder="F.eks. 7-jern, pitching wedge"
              className={tw.input}
            />
          </div>

          <div className={tw.formGroup}>
            <label className={tw.label}>Mål på green</label>
            <input
              type="text"
              value={formData.approachTarget}
              onChange={(e) => handleChange('approachTarget', e.target.value)}
              placeholder="F.eks. Midt green, under flagg"
              className={tw.input}
            />
          </div>
        </div>

        {/* Risk Level */}
        <div className={tw.formGroup}>
          <label className={tw.label}>Risikonivå</label>
          <select
            value={formData.riskLevel}
            onChange={(e) => handleChange('riskLevel', e.target.value)}
            className={tw.select}
          >
            <option value="low">🟢 Lav - Spill sikkert</option>
            <option value="medium">🟡 Middels - Balansert tilnærming</option>
            <option value="high">🔴 Høy - Aggressiv spillestil</option>
          </select>
          <p className={tw.helperText}>
            Velg hvor aggressivt spilleren skal angripe dette hullet
          </p>
        </div>

        {/* Notes */}
        <div className={tw.formGroup}>
          <label className={tw.label}>Notater</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Ekstra notater om hullet (farer, vind, spesielle betingelser)..."
            className={tw.textarea}
          />
        </div>

        {/* Actions */}
        <div className={tw.actions}>
          <div className={tw.navigationButtons}>
            <Button
              variant="secondary"
              onClick={handlePreviousHole}
              disabled={selectedHole === 1}
            >
              ← Forrige hull
            </Button>
            <Button
              variant="secondary"
              onClick={handleNextHole}
              disabled={selectedHole === 18}
            >
              Neste hull →
            </Button>
          </div>

          <div className={tw.saveButtons}>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Lagrer...' : '💾 Lagre hull'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default HoleStrategyPlanner;
