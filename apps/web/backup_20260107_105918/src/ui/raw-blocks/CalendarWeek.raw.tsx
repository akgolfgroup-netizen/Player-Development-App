import React from 'react';

/**
 * CalendarWeek Raw Block
 * A mobile-first weekly calendar component following TIER Golf design system
 */

interface CalendarDay {
  date: Date;
  isToday: boolean;
  isSelected: boolean;
  events?: CalendarEvent[];
}

interface CalendarEvent {
  id: string;
  title: string;
  time?: string;
  type?: 'training' | 'tournament' | 'test' | 'session';
}

interface CalendarWeekProps {
  /** Current selected date */
  selectedDate?: Date;
  /** Callback when a day is selected */
  onDaySelect?: (date: Date) => void;
  /** Events to display */
  events?: Record<string, CalendarEvent[]>;
  /** First day of the week (0 = Sunday, 1 = Monday) */
  firstDayOfWeek?: 0 | 1;
  /** Show week number */
  showWeekNumber?: boolean;
  /** Compact mode for smaller displays */
  compact?: boolean;
}

const CalendarWeek: React.FC<CalendarWeekProps> = ({
  selectedDate = new Date(),
  onDaySelect,
  events = {},
  firstDayOfWeek = 1, // Monday
  showWeekNumber = false,
  compact = false,
}) => {
  // Get the week dates based on selected date
  const getWeekDates = (date: Date): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const current = new Date(date);

    // Find the start of the week
    const day = current.getDay();
    const diff = day === 0 ? (firstDayOfWeek === 1 ? -6 : 0) : day - firstDayOfWeek;
    current.setDate(current.getDate() - diff);
    current.setHours(0, 0, 0, 0);

    // Generate 7 days
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(current);
      dayDate.setDate(current.getDate() + i);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);

      const dateKey = dayDate.toISOString().split('T')[0];

      days.push({
        date: dayDate,
        isToday: dayDate.getTime() === today.getTime(),
        isSelected: dayDate.getTime() === selected.getTime(),
        events: events[dateKey] || [],
      });
    }

    return days;
  };

  // Get week number
  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const weekDates = getWeekDates(selectedDate);
  const weekNumber = getWeekNumber(selectedDate);

  const dayNames = firstDayOfWeek === 1
    ? ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']
    : ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];

  const handleDayClick = (day: CalendarDay) => {
    if (onDaySelect) {
      onDaySelect(day.date);
    }
  };

  const getEventTypeColor = (type?: CalendarEvent['type']) => {
    switch (type) {
      case 'training':
        return 'var(--accent)';
      case 'tournament':
        return 'var(--achievement)';
      case 'test':
        return 'var(--warning)';
      case 'session':
        return 'var(--success)';
      default:
        return 'var(--text-tertiary)';
    }
  };

  return (
    <div style={styles.container}>
      {/* Week Header */}
      {showWeekNumber && (
        <div style={styles.weekHeader}>
          <span style={styles.weekNumber}>Uke {weekNumber}</span>
        </div>
      )}

      {/* Day Headers */}
      <div style={styles.dayHeaders}>
        {dayNames.map((dayName, index) => (
          <div key={index} style={styles.dayHeader}>
            <span style={styles.dayHeaderText}>{compact ? dayName[0] : dayName}</span>
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div style={styles.daysGrid}>
        {weekDates.map((day, index) => {
          const hasEvents = day.events && day.events.length > 0;

          return (
            <button
              key={index}
              onClick={() => handleDayClick(day)}
              style={{
                ...styles.dayCell,
                ...(day.isToday && styles.dayToday),
                ...(day.isSelected && styles.daySelected),
              }}
              aria-label={`${dayNames[index]} ${day.date.getDate()}`}
              aria-current={day.isToday ? 'date' : undefined}
            >
              <div style={styles.dayCellInner}>
                <span
                  style={{
                    ...styles.dayNumber,
                    ...(day.isToday && styles.dayNumberToday),
                    ...(day.isSelected && styles.dayNumberSelected),
                  }}
                >
                  {day.date.getDate()}
                </span>

                {hasEvents && (
                  <div style={styles.eventIndicators}>
                    {day.events!.slice(0, 3).map((event, eventIndex) => (
                      <div
                        key={event.id}
                        style={{
                          ...styles.eventDot,
                          backgroundColor: getEventTypeColor(event.type),
                        }}
                        title={event.title}
                      />
                    ))}
                    {day.events!.length > 3 && (
                      <span style={styles.moreEvents}>+{day.events!.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Events (if not compact) */}
      {!compact && selectedDate && (
        <div style={styles.selectedDayEvents}>
          {weekDates.find(d => d.isSelected)?.events?.map((event) => (
            <div
              key={event.id}
              style={{
                ...styles.eventItem,
                borderLeftColor: getEventTypeColor(event.type),
              }}
            >
              <div style={styles.eventTime}>{event.time || 'Hele dagen'}</div>
              <div style={styles.eventTitle}>{event.title}</div>
            </div>
          ))}
          {weekDates.find(d => d.isSelected)?.events?.length === 0 && (
            <div style={styles.noEvents}>Ingen hendelser</div>
          )}
        </div>
      )}
    </div>
  );
};

// Styles using CSS-in-JS with design tokens
const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: 'var(--background-white)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-4)',
    boxShadow: 'var(--shadow-card)',
  },
  weekHeader: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 'var(--spacing-3)',
    paddingBottom: 'var(--spacing-2)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  weekNumber: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  dayHeaders: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 'var(--spacing-1)',
    marginBottom: 'var(--spacing-2)',
  },
  dayHeader: {
    display: 'flex',
    justifyContent: 'center',
    padding: 'var(--spacing-1)',
  },
  dayHeaderText: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  daysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 'var(--spacing-1)',
    marginBottom: 'var(--spacing-4)',
  },
  dayCell: {
    aspectRatio: '1',
    border: 'none',
    background: 'transparent',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    padding: 'var(--spacing-1)',
    position: 'relative',
    minHeight: '44px', // Touch-friendly
  },
  dayCellInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 'var(--spacing-1)',
  },
  dayToday: {
    backgroundColor: 'var(--accent-muted)',
  },
  daySelected: {
    backgroundColor: 'var(--accent)',
  },
  dayNumber: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  dayNumberToday: {
    color: 'var(--accent)',
    fontWeight: 700,
  },
  dayNumberSelected: {
    color: 'var(--text-inverse)',
    fontWeight: 700,
  },
  eventIndicators: {
    display: 'flex',
    gap: '2px',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  eventDot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
  },
  moreEvents: {
    fontSize: '8px',
    color: 'var(--text-tertiary)',
    marginLeft: '2px',
  },
  selectedDayEvents: {
    borderTop: '1px solid var(--border-subtle)',
    paddingTop: 'var(--spacing-3)',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  eventItem: {
    display: 'flex',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-2)',
    borderLeft: '3px solid',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-sm)',
    marginBottom: 'var(--spacing-2)',
  },
  eventTime: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
    fontWeight: 600,
    minWidth: '60px',
  },
  eventTitle: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-primary)',
    flex: 1,
  },
  noEvents: {
    textAlign: 'center',
    padding: 'var(--spacing-4)',
    color: 'var(--text-secondary)',
    fontSize: 'var(--font-size-footnote)',
  },
};

export default CalendarWeek;
