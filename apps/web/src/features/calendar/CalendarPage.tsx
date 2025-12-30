/**
 * CalendarPage
 *
 * Multi-view calendar system with:
 * - DAG / UKE / MÅNED / ÅR views
 * - URL-based state management
 * - Deterministic seed data fallback
 * - AppShell persistence (renders inside main layout)
 *
 * Uses semantic tokens only (no raw hex values).
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useScreenView } from '../../analytics/useScreenView';
import { track } from '../../analytics/track';
import { useCalendarState } from './hooks/useCalendarState';
import { useCalendarEvents, CalendarEvent } from './hooks/useCalendarEvents';
import {
  CalendarHeader,
  CalendarWeekView,
  CalendarDayView,
  CalendarMonthView,
  CalendarYearView,
  EventDetailsPanel,
  CreateSessionModal,
  NewSession,
} from './components';
import {
  SessionPlannerModal,
  type NewPlannedSession,
} from './components/session-planner';
import StateCard from '../../ui/composites/StateCard';
import Button from '../../ui/primitives/Button';
import { RefreshCw, Info } from 'lucide-react';

const CalendarPage: React.FC = () => {
  useScreenView('Kalender');

  // Calendar state from URL
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
    goToMonth,
  } = useCalendarState();

  // Fetch events for current range
  const {
    events,
    isLoading,
    error,
    refetch,
    isSeedData,
  } = useCalendarEvents(rangeStart, rangeEnd);

  // Track calendar view opens
  useEffect(() => {
    track('calendar_view_open', {
      view,
      week_start_date: rangeStart.toISOString().split('T')[0],
    });
  }, [view, rangeStart]);

  // Wrapped goToToday with analytics
  const handleGoToToday = useCallback(() => {
    track('calendar_click_today', {
      week_start_date: rangeStart.toISOString().split('T')[0],
    });
    goToToday();
  }, [goToToday, rangeStart]);

  // Selected event for detail panel
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDetailPanelOpen, setDetailPanelOpen] = useState(false);

  // Create session modal state (simple mode)
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [createModalInitialDate, setCreateModalInitialDate] = useState<Date | undefined>();
  const [createModalInitialTime, setCreateModalInitialTime] = useState<string | undefined>();

  // Session planner modal state (advanced mode with AK-formula)
  const [isPlannerModalOpen, setPlannerModalOpen] = useState(false);
  const [plannerModalInitialDate, setPlannerModalInitialDate] = useState<Date | undefined>();
  const [plannerModalInitialTime, setPlannerModalInitialTime] = useState<string | undefined>();

  // Handlers
  const handleEventClick = useCallback((event: CalendarEvent) => {
    track('calendar_event_open', {
      event_id: event.id,
      event_type: event.category,
      recommended: event.status === 'recommended',
      planned: event.status === 'planned',
    });
    setSelectedEvent(event);
    setDetailPanelOpen(true);
  }, []);

  const handleCloseDetailPanel = useCallback(() => {
    setDetailPanelOpen(false);
    setSelectedEvent(null);
  }, []);

  // Open session planner (advanced mode - default)
  const handleNewSession = useCallback(() => {
    track('calendar_click_new_session', {
      source: 'calendar_header',
    });
    setPlannerModalInitialDate(anchorDate);
    setPlannerModalInitialTime(undefined);
    setPlannerModalOpen(true);
  }, [anchorDate]);

  // Open from calendar view click (advanced mode)
  const handleAddSessionFromView = useCallback((date: Date, time: string) => {
    setPlannerModalInitialDate(date);
    setPlannerModalInitialTime(time);
    setPlannerModalOpen(true);
  }, []);

  // Handle simple session creation (legacy)
  const handleCreateSession = useCallback((session: NewSession) => {
    console.log('Create session (simple):', session);
    // TODO: API call to create session
    setCreateModalOpen(false);
    refetch();
  }, [refetch]);

  // Handle planned session creation (with AK-formula)
  const handleCreatePlannedSession = useCallback((session: NewPlannedSession) => {
    console.log('Create planned session:', session);
    console.log('Formula:', session.formula);
    // TODO: API call to create session with formula
    setPlannerModalOpen(false);
    refetch();
  }, [refetch]);

  const handleStartSession = useCallback((event: CalendarEvent) => {
    track('calendar_event_start_workout', {
      event_id: event.id,
      source: 'calendar_week',
    });
    console.log('Start session:', event);
    // TODO: API call to start session
    handleCloseDetailPanel();
  }, [handleCloseDetailPanel]);

  const handleCompleteSession = useCallback((event: CalendarEvent) => {
    console.log('Complete session:', event);
    // TODO: API call to complete session
    handleCloseDetailPanel();
  }, [handleCloseDetailPanel]);

  const handlePostponeSession = useCallback((event: CalendarEvent, minutes: number) => {
    console.log('Postpone session:', event, 'by', minutes, 'minutes');
    // TODO: API call to postpone session
  }, []);

  const handleEditEvent = useCallback((event: CalendarEvent) => {
    console.log('Edit event:', event);
    // TODO: Open edit modal
    handleCloseDetailPanel();
  }, [handleCloseDetailPanel]);

  const handleDeleteEvent = useCallback((event: CalendarEvent) => {
    console.log('Delete event:', event);
    // TODO: API call to delete event
    handleCloseDetailPanel();
  }, [handleCloseDetailPanel]);

  const handleDayClick = useCallback((date: Date) => {
    // Navigate to day view
    setDate(date);
    setView('day');
  }, [setDate, setView]);

  const handleMonthClick = useCallback((monthIndex: number) => {
    goToMonth(monthIndex);
  }, [goToMonth]);

  // Loading state (only show when no cached data)
  if (isLoading && events.length === 0) {
    return (
      <div
        className="h-[calc(100vh-160px)] flex items-center justify-center"
        style={{ backgroundColor: 'var(--calendar-surface-base)' }}
      >
        <StateCard
          variant="loading"
          title="Laster kalender..."
          description="Henter dine økter"
        />
      </div>
    );
  }

  // Error state (only show when no cached data)
  if (error && events.length === 0) {
    return (
      <div
        className="h-[calc(100vh-160px)] flex items-center justify-center"
        style={{ backgroundColor: 'var(--calendar-surface-base)' }}
      >
        <StateCard
          variant="error"
          title="Noe gikk galt"
          description={error}
          action={
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<RefreshCw size={14} />}
              onClick={refetch}
            >
              Prøv igjen
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-[calc(100vh-160px)]"
      style={{ backgroundColor: 'var(--calendar-surface-base)' }}
    >
      {/* Seed data info banner */}
      {isSeedData && (
        <div
          className="flex items-center gap-2 px-4 py-2 text-sm"
          style={{
            backgroundColor: 'var(--info-muted)',
            color: 'var(--ak-info)',
          }}
        >
          <Info size={16} />
          Viser demodata. Faktiske økter vil vises når du har lagt dem til.
        </div>
      )}

      {/* Error banner (when showing stale data) */}
      {error && events.length > 0 && (
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{
            backgroundColor: 'var(--warning-muted)',
            borderBottom: '1px solid var(--calendar-border)',
          }}
        >
          <span
            className="text-sm"
            style={{ color: 'var(--ak-warning)' }}
          >
            Viser tidligere data
          </span>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<RefreshCw size={14} />}
            onClick={refetch}
          >
            Oppdater
          </Button>
        </div>
      )}

      {/* Calendar Header */}
      <CalendarHeader
        view={view}
        monthName={monthName}
        year={year}
        weekNumber={weekNumber}
        onViewChange={setView}
        onToday={handleGoToToday}
        onPrev={goToPrev}
        onNext={goToNext}
        onNewSession={handleNewSession}
      />

      {/* Calendar Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main calendar view */}
        <div className="flex-1 overflow-hidden">
          {view === 'week' && (
            <CalendarWeekView
              weekDates={weekDates}
              events={events}
              onEventClick={handleEventClick}
              onAddSession={handleAddSessionFromView}
            />
          )}

          {view === 'day' && (
            <CalendarDayView
              date={anchorDate}
              events={events.filter(e => e.date === anchorDate.toISOString().split('T')[0])}
              onEventClick={handleEventClick}
              onStartSession={handleStartSession}
              onCompleteSession={handleCompleteSession}
              onPostponeSession={handlePostponeSession}
              onAddSession={handleAddSessionFromView}
            />
          )}

          {view === 'month' && (
            <CalendarMonthView
              date={anchorDate}
              events={events}
              onDayClick={handleDayClick}
              onEventClick={handleEventClick}
            />
          )}

          {view === 'year' && (
            <CalendarYearView
              year={year}
              events={events}
              onMonthClick={handleMonthClick}
            />
          )}
        </div>

        {/* Event Details Panel (desktop side panel) */}
        {isDetailPanelOpen && (
          <EventDetailsPanel
            event={selectedEvent}
            isOpen={isDetailPanelOpen}
            onClose={handleCloseDetailPanel}
            onStart={handleStartSession}
            onComplete={handleCompleteSession}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
          />
        )}
      </div>

      {/* Create Session Modal (simple mode - legacy) */}
      <CreateSessionModal
        isOpen={isCreateModalOpen}
        initialDate={createModalInitialDate}
        initialTime={createModalInitialTime}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSession}
      />

      {/* Session Planner Modal (advanced mode with AK-formula) */}
      <SessionPlannerModal
        isOpen={isPlannerModalOpen}
        initialDate={plannerModalInitialDate}
        initialTime={plannerModalInitialTime}
        onClose={() => setPlannerModalOpen(false)}
        onSubmit={handleCreatePlannedSession}
      />
    </div>
  );
};

export default CalendarPage;
