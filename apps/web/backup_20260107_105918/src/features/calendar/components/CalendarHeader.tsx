/**
 * CalendarHeader.tsx
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 *
 * Header for the calendar with:
 * - Month/Year label (contextual)
 * - Week label (when view=week)
 * - View switcher: DAG | UKE | MÅNED | ÅR (segmented control)
 * - Today button ("I dag")
 * - Next/Prev navigation
 * - Primary action: "Ny økt"
 */

import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { CalendarView } from '../hooks/useCalendarState';
import { SectionTitle } from '../../../components/typography';
import { InfoTooltip } from '../../../components/InfoTooltip';

interface CalendarHeaderProps {
  view: CalendarView;
  monthName: string;
  year: number;
  weekNumber: number;
  onViewChange: (view: CalendarView) => void;
  onToday: () => void;
  onPrev: () => void;
  onNext: () => void;
  onNewSession: () => void;
}

const VIEW_OPTIONS: { value: CalendarView; label: string; tooltip: string }[] = [
  { value: 'day', label: 'DAG', tooltip: 'Vis detaljert timeplan for én dag med alle økter' },
  { value: 'week', label: 'UKE', tooltip: 'Vis 7-dagers ukesoversikt med økter fordelt på dager' },
  { value: 'month', label: 'MÅNED', tooltip: 'Vis hele måneden med økter merket på datoene' },
  { value: 'year', label: 'ÅR', tooltip: 'Vis årsoversikt med treningsfordeling per måned' },
];

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  view,
  monthName,
  year,
  weekNumber,
  onViewChange,
  onToday,
  onPrev,
  onNext,
  onNewSession,
}) => {
  // Contextual label based on view
  const getViewLabel = () => {
    switch (view) {
      case 'day':
        return `${monthName} ${year}`;
      case 'week':
        return `${monthName} ${year}`;
      case 'month':
        return `${monthName} ${year}`;
      case 'year':
        return `${year}`;
      default:
        return `${monthName} ${year}`;
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-tier-white border-tier-border-default">
      {/* Left: Navigation and Title */}
      <div className="flex items-center gap-4">
        {/* Prev/Next Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            className="p-2 rounded-lg transition-colors text-tier-text-secondary hover:bg-tier-surface-base"
            aria-label="Forrige"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={onNext}
            className="p-2 rounded-lg transition-colors text-tier-text-secondary hover:bg-tier-surface-base"
            aria-label="Neste"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Title */}
        <SectionTitle className="text-lg font-semibold capitalize text-tier-navy">
          {getViewLabel()}
        </SectionTitle>

        {/* Week number badge (only for week view) */}
        {view === 'week' && (
          <span className="text-sm px-2 py-1 rounded bg-tier-surface-base text-tier-text-tertiary">
            Uke {weekNumber}
          </span>
        )}
      </div>

      {/* Center: View Switcher (Segmented Control) */}
      <div className="hidden md:flex items-center rounded-lg p-1 bg-tier-surface-base">
        {VIEW_OPTIONS.map((option) => (
          <div key={option.value} className="flex items-center gap-1">
            <button
              onClick={() => onViewChange(option.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === option.value
                  ? 'bg-tier-white text-tier-navy shadow-sm'
                  : 'text-tier-text-tertiary'
              }`}
            >
              {option.label}
            </button>
            {view === option.value && (
              <InfoTooltip content={option.tooltip} side="bottom" />
            )}
          </div>
        ))}
      </div>

      {/* Right: Today Button and New Session */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={onToday}
            className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors text-tier-text-secondary hover:bg-tier-surface-base"
          >
            I dag
          </button>
          <InfoTooltip content="Gå til dagens dato i kalenderen" side="bottom" />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onNewSession}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors bg-tier-navy text-white hover:bg-tier-navy/90"
          >
            <Plus size={16} />
            Ny økt
          </button>
          <InfoTooltip content="Planlegg en ny treningsøkt med TIER treningsformelen" side="bottom" />
        </div>
      </div>

      {/* Mobile View Switcher (dropdown or tabs) */}
      <div className="md:hidden">
        <select
          value={view}
          onChange={(e) => onViewChange(e.target.value as CalendarView)}
          className="px-2 py-1 text-sm rounded-md border bg-tier-white border-tier-border-default text-tier-navy"
        >
          {VIEW_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};

export default CalendarHeader;
