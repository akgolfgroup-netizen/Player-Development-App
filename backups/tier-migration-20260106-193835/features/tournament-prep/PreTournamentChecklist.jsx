/**
 * PreTournamentChecklist
 * Interactive checklist for pre-tournament preparation
 *
 * Features:
 * - Equipment check
 * - Course reconnaissance
 * - Practice round
 * - Mental routine
 * - Nutrition plan
 * - Track completion status
 * - Auto-save on check/uncheck
 */

import React, { useState, useCallback } from 'react';
import { useTournamentPrep } from '../../hooks/useTournamentPrep';
import { track } from '../../analytics/track';

// ═══════════════════════════════════════════
// TAILWIND CLASSES
// ═══════════════════════════════════════════

const tw = {
  container: 'flex flex-col gap-6',
  header: 'flex items-center justify-between',
  title: 'text-xl font-semibold text-[var(--text-inverse)] m-0',
  subtitle: 'text-sm text-[var(--video-text-secondary)]',
  progressCard: 'p-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-ak-lg border border-primary',
  progressLabel: 'text-sm font-semibold text-[var(--text-inverse)] mb-2',
  progressBar: 'w-full h-3 bg-surface-elevated rounded-full overflow-hidden mb-2',
  progressFill: 'h-full bg-primary transition-all duration-500',
  progressText: 'text-xs text-[var(--video-text-secondary)]',
  checklistSection: 'flex flex-col gap-3',
  checklistItem: 'p-4 bg-surface rounded-ak-lg border border-border hover:border-primary transition-colors',
  checklistItemCompleted: 'p-4 bg-ak-status-success/10 rounded-ak-lg border-2 border-ak-status-success',
  checklistHeader: 'flex items-start gap-3 cursor-pointer',
  checkbox: 'w-5 h-5 mt-0.5 flex-shrink-0 cursor-pointer',
  checklistContent: 'flex-1',
  checklistTitle: 'text-base font-semibold text-[var(--text-inverse)] mb-1',
  checklistDescription: 'text-sm text-[var(--video-text-secondary)]',
  emptyState: 'flex flex-col items-center justify-center gap-3 py-12 text-center bg-surface rounded-ak-lg border border-border',
  emptyIcon: 'text-5xl opacity-30',
  emptyTitle: 'text-base font-semibold text-[var(--text-inverse)] m-0',
  emptyDescription: 'text-sm text-[var(--video-text-secondary)] m-0 max-w-xs',
  errorMessage: 'py-2 px-3 bg-ak-status-error/20 border border-ak-status-error rounded-ak-md text-ak-status-error text-sm',
};

// ═══════════════════════════════════════════
// CHECKLIST ITEMS
// ═══════════════════════════════════════════

const CHECKLIST_ITEMS = [
  {
    key: 'equipmentChecked',
    title: '⛳ Utstyrskontroll',
    description: 'Sjekk at alt utstyr er komplett og i orden (køller, baller, hansker, tees)',
  },
  {
    key: 'courseReconDone',
    title: '🗺️ Banekjennskap',
    description: 'Kjør banen eller studer kart/bilder for å lære layout og utfordringer',
  },
  {
    key: 'practiceRoundCompleted',
    title: '🏌️ Treningsrunde',
    description: 'Spill minst én treningsrunde på banen for å teste strategi',
  },
  {
    key: 'mentalRoutineSet',
    title: '🧠 Mental rutine',
    description: 'Definer og øv på pre-shot rutine og mentale fokuspunkter',
  },
  {
    key: 'nutritionPlanned',
    title: '🍎 Ernæringsplan',
    description: 'Planlegg mat og væske for turneringsdagen',
  },
];

// ═══════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════

export function PreTournamentChecklist({
  className = '',
  preparation,
}) {
  const {
    updateChecklistItem,
    saving,
  } = useTournamentPrep();

  const [error, setError] = useState(null);

  const checklist = preparation?.checklist || {};

  // Calculate completion percentage
  const calculateCompletion = useCallback(() => {
    const completed = CHECKLIST_ITEMS.filter(
      (item) => checklist[item.key] === true
    ).length;
    return Math.round((completed / CHECKLIST_ITEMS.length) * 100);
  }, [checklist]);

  // Handle checkbox toggle
  const handleToggle = useCallback(
    async (itemKey) => {
      if (!preparation?.id) {
        setError('Ingen forberedelse valgt');
        return;
      }

      const newValue = !checklist[itemKey];

      try {
        await updateChecklistItem(preparation.id, {
          [itemKey]: newValue,
        });

        track('checklist_item_toggled', {
          screen: 'PreTournamentChecklist',
          itemKey,
          checked: newValue,
          prepId: preparation.id,
        });

        setError(null);
      } catch (err) {
        console.error('Failed to update checklist:', err);
        setError('Kunne ikke oppdatere sjekkliste');
      }
    },
    [preparation, checklist, updateChecklistItem]
  );

  // If no preparation, show message
  if (!preparation) {
    return (
      <div className={`${tw.container} ${className}`}>
        <div className={tw.emptyState}>
          <div className={tw.emptyIcon}>✅</div>
          <h3 className={tw.emptyTitle}>Ingen forberedelse valgt</h3>
          <p className={tw.emptyDescription}>
            Velg eller opprett en turneringsforberedelse for å bruke sjekklisten
          </p>
        </div>
      </div>
    );
  }

  const completion = calculateCompletion();

  return (
    <div className={`${tw.container} ${className}`}>
      {/* Header */}
      <div className={tw.header}>
        <div>
          <h2 className={tw.title}>Pre-Turnering Sjekkliste</h2>
          <p className={tw.subtitle}>
            Sørg for at alt er klart før turneringen
          </p>
        </div>
      </div>

      {/* Progress Card */}
      <div className={tw.progressCard}>
        <div className={tw.progressLabel}>
          Fremdrift: {completion}% fullført
        </div>
        <div className={tw.progressBar}>
          <div
            className={tw.progressFill}
            style={{ width: `${completion}%` }}
          />
        </div>
        <div className={tw.progressText}>
          {CHECKLIST_ITEMS.filter((item) => checklist[item.key]).length} av{' '}
          {CHECKLIST_ITEMS.length} oppgaver fullført
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={tw.errorMessage}>{error}</div>
      )}

      {/* Checklist Items */}
      <div className={tw.checklistSection}>
        {CHECKLIST_ITEMS.map((item) => {
          const isCompleted = checklist[item.key] === true;

          return (
            <div
              key={item.key}
              className={
                isCompleted ? tw.checklistItemCompleted : tw.checklistItem
              }
            >
              <div
                className={tw.checklistHeader}
                onClick={() => handleToggle(item.key)}
              >
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => handleToggle(item.key)}
                  className={tw.checkbox}
                  disabled={saving}
                />
                <div className={tw.checklistContent}>
                  <h3 className={tw.checklistTitle}>{item.title}</h3>
                  <p className={tw.checklistDescription}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {completion === 100 && (
        <div className="p-4 bg-ak-status-success/20 rounded-ak-lg border-2 border-ak-status-success text-center">
          <div className="text-2xl mb-2">🎉</div>
          <div className="text-base font-semibold text-ak-status-success">
            Gratulerer! Alle forberedelser er fullført!
          </div>
          <div className="text-sm text-[var(--video-text-secondary)] mt-1">
            Du er klar for turneringen. Lykke til! 🍀
          </div>
        </div>
      )}
    </div>
  );
}

export default PreTournamentChecklist;
