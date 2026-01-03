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

const VIEW_OPTIONS: { value: CalendarView; label: string }[] = [
  { value: 'day', label: 'DAG' },
  { value: 'week', label: 'UKE' },
  { value: 'month', label: 'MÅNED' },
  { value: 'year', label: 'ÅR' },
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
    <header className="flex items-center justify-between px-4 py-3 border-b bg-ak-surface-base border-ak-border-default">
      {/* Left: Navigation and Title */}
      <div className="flex items-center gap-4">
        {/* Prev/Next Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            className="p-2 rounded-lg transition-colors text-ak-text-secondary hover:bg-ak-surface-subtle"
            aria-label="Forrige"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={onNext}
            className="p-2 rounded-lg transition-colors text-ak-text-secondary hover:bg-ak-surface-subtle"
            aria-label="Neste"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Title */}
        <SectionTitle className="text-lg font-semibold capitalize text-ak-text-primary">
          {getViewLabel()}
        </SectionTitle>

        {/* Week number badge (only for week view) */}
        {view === 'week' && (
          <span className="text-sm px-2 py-1 rounded bg-ak-surface-subtle text-ak-text-tertiary">
            Uke {weekNumber}
          </span>
        )}
      </div>

      {/* Center: View Switcher (Segmented Control) */}
      <div className="hidden md:flex items-center rounded-lg p-1 bg-ak-surface-subtle">
        {VIEW_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onViewChange(option.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === option.value
                ? 'bg-ak-surface-base text-ak-text-primary shadow-sm'
                : 'text-ak-text-tertiary'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Right: Today Button and New Session */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToday}
          className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors text-ak-text-secondary hover:bg-ak-surface-subtle"
        >
          I dag
        </button>

        <button
          onClick={onNewSession}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors bg-ak-brand-primary text-white hover:bg-ak-brand-primary/90"
        >
          <Plus size={16} />
          Ny økt
        </button>
      </div>

      {/* Mobile View Switcher (dropdown or tabs) */}
      <div className="md:hidden">
        <select
          value={view}
          onChange={(e) => onViewChange(e.target.value as CalendarView)}
          className="px-2 py-1 text-sm rounded-md border bg-ak-surface-base border-ak-border-default text-ak-text-primary"
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
