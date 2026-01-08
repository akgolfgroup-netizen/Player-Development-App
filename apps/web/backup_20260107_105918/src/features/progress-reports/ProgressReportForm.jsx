/**
 * ProgressReportForm
 * Form for creating and editing progress reports
 *
 * Features:
 * - Create new progress report
 * - Edit existing draft report
 * - Select player and period
 * - Fill in highlights, improvements, goals
 * - Save as draft or publish immediately
 * - Auto-generate report option
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useProgressReports } from '../../hooks/useProgressReports';
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
  required: 'text-tier-error ml-1',
  input: 'w-full py-2 px-3 bg-surface-elevated border border-border rounded-lg text-[var(--text-inverse)] text-sm placeholder-[var(--video-text-tertiary)]',
  textarea: 'w-full py-2 px-3 bg-surface-elevated border border-border rounded-lg text-[var(--text-inverse)] text-sm placeholder-[var(--video-text-tertiary)] min-h-[120px] resize-y',
  select: 'w-full py-2 px-3 bg-surface-elevated border border-border rounded-lg text-[var(--text-inverse)] text-sm',
  dateRow: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  helperText: 'text-xs text-[var(--video-text-secondary)] mt-1',
  actions: 'flex gap-3 justify-end pt-4 border-t border-border',
  autoGenerateButton: 'py-2 px-4 bg-purple-500/20 border border-purple-500 rounded-lg text-purple-500 text-sm font-medium cursor-pointer hover:bg-purple-500/30 transition-colors',
  errorMessage: 'py-2 px-3 bg-tier-error/20 border border-tier-error rounded-lg text-tier-error text-sm',
};

// ═══════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════

export function ProgressReportForm({
  className = '',
  report = null,
  playerId: initialPlayerId = null,
  onSave,
  onCancel,
}) {
  const {
    createReport,
    updateReport,
    generateReport,
    saving,
    error: apiError,
  } = useProgressReports();

  // Form state
  const [formData, setFormData] = useState({
    playerId: initialPlayerId || report?.playerId || '',
    title: report?.title || '',
    periodStart: report?.periodStart
      ? new Date(report.periodStart).toISOString().split('T')[0]
      : '',
    periodEnd: report?.periodEnd
      ? new Date(report.periodEnd).toISOString().split('T')[0]
      : '',
    highlights: report?.highlights || '',
    areasForImprovement: report?.areasForImprovement || '',
    goalsForNextPeriod: report?.goalsForNextPeriod || '',
    coachComments: report?.coachComments || '',
  });

  const [error, setError] = useState(null);

  // Update form when report changes
  useEffect(() => {
    if (report) {
      setFormData({
        playerId: report.playerId || '',
        title: report.title || '',
        periodStart: report.periodStart
          ? new Date(report.periodStart).toISOString().split('T')[0]
          : '',
        periodEnd: report.periodEnd
          ? new Date(report.periodEnd).toISOString().split('T')[0]
          : '',
        highlights: report.highlights || '',
        areasForImprovement: report.areasForImprovement || '',
        goalsForNextPeriod: report.goalsForNextPeriod || '',
        coachComments: report.coachComments || '',
      });
    }
  }, [report]);

  // Handle input change
  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    if (!formData.playerId) {
      setError('Spiller er påkrevd');
      return false;
    }

    if (!formData.periodStart || !formData.periodEnd) {
      setError('Start- og sluttdato er påkrevd');
      return false;
    }

    if (new Date(formData.periodStart) > new Date(formData.periodEnd)) {
      setError('Startdato må være før sluttdato');
      return false;
    }

    return true;
  }, [formData]);

  // Handle save as draft
  const handleSaveDraft = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      try {
        const payload = {
          ...formData,
          status: 'draft',
        };

        let savedReport;
        if (report?.id) {
          savedReport = await updateReport(report.id, payload);
        } else {
          savedReport = await createReport(payload);
        }

        track('progress_report_saved', {
          screen: 'ProgressReportForm',
          mode: report?.id ? 'edit' : 'create',
          status: 'draft',
        });

        if (onSave) {
          onSave(savedReport);
        }
      } catch (err) {
        console.error('Failed to save report:', err);
        setError('Kunne ikke lagre rapport');
      }
    },
    [formData, report, validateForm, createReport, updateReport, onSave]
  );

  // Handle save and publish
  const handleSaveAndPublish = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      if (!window.confirm('Publisere rapport til foreldre? De vil motta e-post varsling.')) {
        return;
      }

      try {
        const payload = {
          ...formData,
          status: 'published',
        };

        let savedReport;
        if (report?.id) {
          savedReport = await updateReport(report.id, payload);
        } else {
          savedReport = await createReport(payload);
        }

        track('progress_report_published', {
          screen: 'ProgressReportForm',
          mode: report?.id ? 'edit' : 'create',
        });

        alert('Rapport publisert! Foreldre har mottatt e-post.');

        if (onSave) {
          onSave(savedReport);
        }
      } catch (err) {
        console.error('Failed to publish report:', err);
        setError('Kunne ikke publisere rapport');
      }
    },
    [formData, report, validateForm, createReport, updateReport, onSave]
  );

  // Handle auto-generate
  const handleAutoGenerate = useCallback(async () => {
    if (!formData.playerId || !formData.periodStart || !formData.periodEnd) {
      alert('Velg spiller og periode først');
      return;
    }

    if (
      !window.confirm(
        'Automatisk generere rapport basert på spillerens data? Dette vil overskrive eksisterende innhold.'
      )
    ) {
      return;
    }

    try {
      const generatedReport = await generateReport(
        formData.playerId,
        formData.periodStart,
        formData.periodEnd
      );

      // Update form with generated data
      setFormData((prev) => ({
        ...prev,
        highlights: generatedReport.highlights || prev.highlights,
        areasForImprovement:
          generatedReport.areasForImprovement || prev.areasForImprovement,
        goalsForNextPeriod: generatedReport.goalsForNextPeriod || prev.goalsForNextPeriod,
        coachComments: generatedReport.coachComments || prev.coachComments,
      }));

      track('progress_report_generated', {
        screen: 'ProgressReportForm',
        playerId: formData.playerId,
      });

      alert('Rapport generert! Du kan nå redigere og lagre.');
    } catch (err) {
      console.error('Failed to generate report:', err);
      alert('Kunne ikke generere rapport');
    }
  }, [formData, generateReport]);

  return (
    <div className={`${tw.container} ${className}`}>
      {/* Header */}
      <div className={tw.header}>
        <h2 className={tw.title}>
          {report?.id ? 'Rediger Rapport' : 'Ny Fremdriftsrapport'}
        </h2>
        <button onClick={handleAutoGenerate} className={tw.autoGenerateButton} disabled={saving}>
          sparkles Auto-generer
        </button>
      </div>

      {/* Error Message */}
      {(error || apiError) && (
        <div className={tw.errorMessage}>{error || apiError}</div>
      )}

      {/* Form */}
      <form className={tw.form} onSubmit={handleSaveDraft}>
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
            disabled={!!report?.id} // Can't change player for existing report
          >
            <option value="">Velg spiller...</option>
            <option value="00000000-0000-0000-0000-000000000004">Demo Spiller</option>
            {/* TODO: Load players from API */}
          </select>
        </div>

        {/* Title */}
        <div className={tw.formGroup}>
          <label className={tw.label}>Tittel</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="F.eks. Månedsrapport Oktober 2024"
            className={tw.input}
          />
          <p className={tw.helperText}>Valgfri - standard tittel genereres hvis tom</p>
        </div>

        {/* Period Dates */}
        <div className={tw.dateRow}>
          <div className={tw.formGroup}>
            <label className={tw.label}>
              Periode fra<span className={tw.required}>*</span>
            </label>
            <input
              type="date"
              value={formData.periodStart}
              onChange={(e) => handleChange('periodStart', e.target.value)}
              className={tw.input}
              required
            />
          </div>
          <div className={tw.formGroup}>
            <label className={tw.label}>
              Periode til<span className={tw.required}>*</span>
            </label>
            <input
              type="date"
              value={formData.periodEnd}
              onChange={(e) => handleChange('periodEnd', e.target.value)}
              className={tw.input}
              required
            />
          </div>
        </div>

        {/* Highlights */}
        <div className={tw.formGroup}>
          <label className={tw.label}>Høydepunkter</label>
          <textarea
            value={formData.highlights}
            onChange={(e) => handleChange('highlights', e.target.value)}
            placeholder="Beskriv spillerens viktigste prestasjoner og fremgang i perioden..."
            className={tw.textarea}
          />
        </div>

        {/* Areas for Improvement */}
        <div className={tw.formGroup}>
          <label className={tw.label}>Forbedringsområder</label>
          <textarea
            value={formData.areasForImprovement}
            onChange={(e) => handleChange('areasForImprovement', e.target.value)}
            placeholder="Beskriv områder hvor spilleren kan forbedre seg..."
            className={tw.textarea}
          />
        </div>

        {/* Goals for Next Period */}
        <div className={tw.formGroup}>
          <label className={tw.label}>Mål for neste periode</label>
          <textarea
            value={formData.goalsForNextPeriod}
            onChange={(e) => handleChange('goalsForNextPeriod', e.target.value)}
            placeholder="Sett mål for neste periode..."
            className={tw.textarea}
          />
        </div>

        {/* Coach Comments */}
        <div className={tw.formGroup}>
          <label className={tw.label}>Trenerkommentarer</label>
          <textarea
            value={formData.coachComments}
            onChange={(e) => handleChange('coachComments', e.target.value)}
            placeholder="Generelle kommentarer fra trener..."
            className={tw.textarea}
          />
        </div>

        {/* Actions */}
        <div className={tw.actions}>
          {onCancel && (
            <Button variant="secondary" onClick={onCancel} disabled={saving}>
              Avbryt
            </Button>
          )}
          <Button variant="secondary" onClick={handleSaveDraft} disabled={saving}>
            {saving ? 'Lagrer...' : 'Lagre utkast'}
          </Button>
          <Button variant="primary" onClick={handleSaveAndPublish} disabled={saving}>
            {saving ? 'Publiserer...' : '✉️ Publiser til foreldre'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProgressReportForm;
