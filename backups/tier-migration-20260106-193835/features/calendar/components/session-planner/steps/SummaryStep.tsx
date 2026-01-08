/**
 * SummaryStep Component
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 *
 * Final step: Review and confirm session
 * - Formula preview (human-readable + raw)
 * - Date, time, duration inputs
 * - Validation errors
 */

import React from 'react';
import { Calendar, Clock, Timer, AlertCircle, CheckCircle } from 'lucide-react';
import { type UseSessionPlannerResult } from '../hooks/useSessionPlanner';
import { SubSectionTitle } from '../../../../../components/typography';

interface SummaryStepProps {
  planner: UseSessionPlannerResult;
}

const DURATION_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 time' },
  { value: 90, label: '1,5 time' },
  { value: 120, label: '2 timer' },
];

export const SummaryStep: React.FC<SummaryStepProps> = ({ planner }) => {
  const { parsedFormula, formState, setDate, setStartTime, setDuration } = planner;

  if (!parsedFormula) {
    return (
      <div className="text-center py-8 text-ak-text-tertiary">
        Noe gikk galt. Gå tilbake og prøv igjen.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formula preview card */}
      <div className="rounded-xl overflow-hidden bg-ak-surface-subtle border border-ak-border-default">
        {/* Header with status */}
        <div
          className={`flex items-center gap-2 px-4 py-3 ${
            parsedFormula.isValid ? 'bg-ak-status-success/10' : 'bg-ak-status-warning/10'
          }`}
        >
          {parsedFormula.isValid ? (
            <CheckCircle size={16} className="text-ak-status-success" />
          ) : (
            <AlertCircle size={16} className="text-ak-status-warning" />
          )}
          <span
            className={`text-sm font-medium ${
              parsedFormula.isValid ? 'text-ak-status-success' : 'text-ak-status-warning'
            }`}
          >
            {parsedFormula.isValid ? 'Klar til å opprettes' : 'Mangler informasjon'}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <SubSectionTitle className="text-lg font-semibold text-ak-text-primary">
            {parsedFormula.title}
          </SubSectionTitle>

          {/* Description */}
          <p className="text-sm text-ak-text-secondary">
            {parsedFormula.description}
          </p>

          {/* Formula */}
          <div className="p-3 rounded-lg font-mono text-xs break-all bg-ak-surface-base text-ak-text-tertiary">
            {parsedFormula.formula}
          </div>

          {/* Errors */}
          {parsedFormula.errors.length > 0 && (
            <div className="space-y-1">
              {parsedFormula.errors.map((error, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-xs text-ak-status-warning"
                >
                  <AlertCircle size={12} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Date/Time/Duration */}
      <div className="space-y-4">
        <SubSectionTitle className="text-sm font-medium text-ak-text-secondary">
          Når?
        </SubSectionTitle>

        {/* Date */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-1 text-ak-text-tertiary">
            <Calendar size={14} />
            Dato
          </label>
          <input
            type="date"
            value={formState.date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm bg-ak-surface-subtle border border-ak-border-default text-ak-text-primary"
          />
        </div>

        {/* Time and Duration row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Start time */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-1 text-ak-text-tertiary">
              <Clock size={14} />
              Starttid
            </label>
            <input
              type="time"
              value={formState.startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm bg-ak-surface-subtle border border-ak-border-default text-ak-text-primary"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-1 text-ak-text-tertiary">
              <Timer size={14} />
              Varighet
            </label>
            <select
              value={formState.duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg text-sm bg-ak-surface-subtle border border-ak-border-default text-ak-text-primary"
            >
              {DURATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStep;
