import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import NotionWeekView, { CalendarSession } from './components/NotionWeekView';
import StateCard from '../../ui/composites/StateCard';
import Button from '../../ui/primitives/Button';
import { RefreshCw } from 'lucide-react';
import { useCalendarSessions } from '../../data';
import { getSimState } from '../../dev/simulateState';
import { useScreenView } from '../../analytics/useScreenView';

/**
 * CalendarPage
 * Full-screen Notion-style calendar with week view
 * No header, no bottom nav - clean calendar interface
 *
 * DEV: Test states via querystring:
 *   /kalender?state=loading
 *   /kalender?state=error
 *   /kalender?state=empty
 */

const CalendarPage: React.FC = () => {
  useScreenView('Kalender');
  const location = useLocation();
  const simState = getSimState(location.search);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const hookResult = useCalendarSessions(currentDate);

  // Override data based on simState (DEV only)
  const { data, isLoading, error, refetch } = simState
    ? {
        data: simState === 'empty' ? { sessions: [] } : null,
        isLoading: simState === 'loading',
        error: simState === 'error' ? 'Simulert feil (DEV)' : null,
        refetch: hookResult.refetch,
      }
    : hookResult;

  // Sort sessions by start time for stable ordering
  const sortedSessions = useMemo(() => {
    const sessions = data?.sessions ?? [];
    return [...sessions].sort((a, b) => a.start.localeCompare(b.start)) as CalendarSession[];
  }, [data?.sessions]);

  const handleSessionClick = (session: CalendarSession) => {
    console.log('Session clicked:', session);
    // TODO: Open session detail modal
  };

  const handleAddSession = (date: Date, time: string) => {
    console.log('Add session:', date, time);
    // TODO: Open new session modal
  };

  // Loading state
  if (isLoading && !data) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <StateCard
          variant="loading"
          title="Laster..."
          description="Henter dine okter"
        />
      </div>
    );
  }

  // Error state (full screen)
  if (error && !data) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <StateCard
          variant="error"
          title="Noe gikk galt"
          description={error}
          action={
            <Button size="sm" variant="ghost" leftIcon={<RefreshCw size={14} />} onClick={refetch}>
              Prov igjen
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)]">
      {/* Error banner if stale data */}
      {error && data && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between">
          <span className="text-sm text-amber-800">Viser tidligere data</span>
          <Button size="sm" variant="ghost" leftIcon={<RefreshCw size={14} />} onClick={refetch}>
            Oppdater
          </Button>
        </div>
      )}

      {/* Notion-style week calendar */}
      <NotionWeekView
        currentDate={currentDate}
        sessions={sortedSessions}
        onDateChange={setCurrentDate}
        onSessionClick={handleSessionClick}
        onAddSession={handleAddSession}
      />
    </div>
  );
};

export default CalendarPage;
