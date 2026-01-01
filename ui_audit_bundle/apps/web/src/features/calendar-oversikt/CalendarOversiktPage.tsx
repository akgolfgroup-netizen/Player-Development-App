/**
 * CalendarOversiktPage
 *
 * Full calendar overview page at /kalender/oversikt
 * Read-only unified view of all event types:
 * - Golf training (teknikk, golfslag, spill)
 * - Physical training (fysisk)
 * - School schedule (skole, oppgaver)
 * - Tournaments (turnering)
 *
 * Supports day/week/month views with URL-based state.
 */

import React, { useCallback } from 'react';
import { Loader2 } from 'lucide-react';

import { useOversiktState } from './hooks/useOversiktState';
import { useUnifiedCalendar } from './hooks/useUnifiedCalendar';
import { OversiktHeader } from './components/OversiktHeader';
import { OversiktWeekView } from './components/OversiktWeekView';
import { OversiktMonthView } from './components/OversiktMonthView';
import { OversiktDayView } from './components/OversiktDayView';
import { EventLegend } from './components/EventLegend';
import type { UnifiedCalendarEvent, OversiktView } from './types';

export const CalendarOversiktPage: React.FC = () => {
  const state = useOversiktState();
  const {
    view,
    anchorDate,
    rangeStart,
    rangeEnd,
    weekNumber,
    weekDates,
    monthName,
    year,
    setView,
    setDate,
    goToToday,
    goToNext,
    goToPrev,
  } = state;

  const { events, isLoading, error } = useUnifiedCalendar({
    startDate: rangeStart,
    endDate: rangeEnd,
  });

  const handleViewChange = useCallback(
    (newView: OversiktView) => {
      setView(newView);
    },
    [setView]
  );

  const handleDayClick = useCallback(
    (date: Date) => {
      setDate(date);
      setView('day');
    },
    [setDate, setView]
  );

  const handleEventClick = useCallback((event: UnifiedCalendarEvent) => {
    // Read-only: just show details (could show tooltip or modal)
    console.log('Event clicked:', event);
  }, []);

  const renderView = () => {
    if (isLoading) {
      return (
        <div
          className="flex-1 flex items-center justify-center"
          style={{ backgroundColor: 'var(--calendar-surface-base)' }}
        >
          <Loader2
            className="w-8 h-8 animate-spin"
            style={{ color: 'var(--calendar-text-tertiary)' }}
          />
        </div>
      );
    }

    if (error) {
      return (
        <div
          className="flex-1 flex items-center justify-center p-4"
          style={{ backgroundColor: 'var(--calendar-surface-base)' }}
        >
          <div className="text-center">
            <p
              className="text-sm mb-2"
              style={{ color: 'var(--error)' }}
            >
              Kunne ikke laste kalender
            </p>
            <p
              className="text-xs"
              style={{ color: 'var(--calendar-text-muted)' }}
            >
              {error}
            </p>
          </div>
        </div>
      );
    }

    switch (view) {
      case 'day':
        return (
          <OversiktDayView
            date={anchorDate}
            events={events.filter((e) => e.date === anchorDate.toISOString().split('T')[0])}
            onEventClick={handleEventClick}
          />
        );
      case 'week':
        return (
          <OversiktWeekView
            weekDates={weekDates}
            events={events}
            onEventClick={handleEventClick}
            onDayClick={handleDayClick}
          />
        );
      case 'month':
        return (
          <OversiktMonthView
            anchorDate={anchorDate}
            events={events}
            onEventClick={handleEventClick}
            onDayClick={handleDayClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: 'var(--background-page)' }}
    >
      {/* Header */}
      <OversiktHeader
        view={view}
        anchorDate={anchorDate}
        weekNumber={weekNumber}
        monthName={monthName}
        year={year}
        onViewChange={handleViewChange}
        onToday={goToToday}
        onPrev={goToPrev}
        onNext={goToNext}
      />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar view */}
        <div className="flex-1 overflow-hidden">{renderView()}</div>

        {/* Sidebar with legend (desktop only) */}
        <div
          className="hidden lg:block w-56 p-4 border-l overflow-auto"
          style={{
            backgroundColor: 'var(--calendar-surface-base)',
            borderColor: 'var(--calendar-border)',
          }}
        >
          <EventLegend />
        </div>
      </div>

      {/* Mobile legend (bottom) */}
      <div
        className="lg:hidden p-3 border-t"
        style={{
          backgroundColor: 'var(--calendar-surface-base)',
          borderColor: 'var(--calendar-border)',
        }}
      >
        <EventLegend compact />
      </div>
    </div>
  );
};

export default CalendarOversiktPage;
