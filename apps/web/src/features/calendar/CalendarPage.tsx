import React, { useState } from 'react';
import AppShellTemplate from '../../ui/templates/AppShellTemplate';
import CalendarTemplate from '../../ui/templates/CalendarTemplate';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import BottomNav from '../../ui/composites/BottomNav';
import { RefreshCw } from 'lucide-react';
import { useCalendarSessions } from '../../data';

/**
 * CalendarPage
 * Calendar page using UI templates
 * Composes AppShellTemplate + CalendarTemplate
 * Data fetched via useCalendarSessions hook
 */

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { data, isLoading, error, refetch } = useCalendarSessions(selectedDate);

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
          <Card>
            <div style={styles.loadingText}>Laster...</div>
          </Card>
        </section>
      </AppShellTemplate>
    );
  }

  const sessions = data?.sessions ?? [];

  return (
    <AppShellTemplate
      title="Kalender"
      subtitle="Plan og logging"
      bottomNav={<BottomNav />}
    >
      {/* Error message */}
      {error && (
        <section style={styles.section}>
          <Card>
            <div style={styles.errorContainer}>
              <span style={styles.errorText}>{error}</span>
              <Button size="sm" variant="ghost" leftIcon={<RefreshCw size={14} />} onClick={refetch}>
                Prøv igjen
              </Button>
            </div>
          </Card>
        </section>
      )}

      {/* Calendar */}
      <section style={styles.section}>
        <CalendarTemplate
          selectedDate={selectedDate}
          sessions={sessions}
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
  loadingText: {
    textAlign: 'center',
    padding: 'var(--spacing-4)',
    color: 'var(--text-secondary)',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--spacing-3)',
  },
  errorText: {
    color: 'var(--color-danger)',
    fontSize: 'var(--font-size-footnote)',
  },
};

export default CalendarPage;
