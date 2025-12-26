import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
import CalendarTemplate from '../../ui/templates/CalendarTemplate';
import Button from '../../ui/primitives/Button';
import BottomNav from '../../ui/composites/BottomNav';
import StateCard from '../../ui/composites/StateCard';
import { RefreshCw } from 'lucide-react';
import { useCalendarSessions } from '../../data';
import { getSimState } from '../../dev/simulateState';
import { useScreenView } from '../../analytics/useScreenView';

/**
 * CalendarPage
 * Calendar page using UI templates
 * Composes AppShellTemplate + CalendarTemplate
 * Data fetched via useCalendarSessions hook
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

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const hookResult = useCalendarSessions(selectedDate);

  // Override data based on simState (DEV only)
  const { data, isLoading, error, refetch } = simState
    ? {
        data: simState === 'empty' ? { sessions: [] } : null,
        isLoading: simState === 'loading',
        error: simState === 'error' ? 'Simulert feil (DEV)' : null,
        refetch: hookResult.refetch,
      }
    : hookResult;

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  // Loading state
  if (isLoading && !data) {
    return (
      <AppShellTemplate
        title="Kalender"
        subtitle="Plan og logging"
        bottomNav={<BottomNav />}
      >
        <section style={styles.section}>
          <StateCard
            variant="info"
            title="Laster..."
            description="Henter dine økter"
          />
        </section>
      </AppShellTemplate>
    );
  }

  // Sort sessions by start time for stable ordering
  const sortedSessions = useMemo(() => {
    const sessions = data?.sessions ?? [];
    return [...sessions].sort((a, b) => a.start.localeCompare(b.start));
  }, [data?.sessions]);

  return (
    <AppShellTemplate
      title="Kalender"
      subtitle="Plan og logging"
      bottomNav={<BottomNav />}
    >
      {/* Error message */}
      {error && (
        <section style={styles.section}>
          <StateCard
            variant="error"
            title="Noe gikk galt"
            description={error}
            action={
              <Button size="sm" variant="ghost" leftIcon={<RefreshCw size={14} />} onClick={refetch}>
                Prøv igjen
              </Button>
            }
          />
        </section>
      )}

      {/* Calendar */}
      <section style={styles.section}>
        <CalendarTemplate
          selectedDate={selectedDate}
          sessions={sortedSessions}
          onSelectDate={handleSelectDate}
        />
      </section>
    </AppShellTemplate>
  );
};

const styles: Record<string, React.CSSProperties> = {
  section: {
    marginBottom: 'var(--spacing-6)',
  },
};

export default CalendarPage;
