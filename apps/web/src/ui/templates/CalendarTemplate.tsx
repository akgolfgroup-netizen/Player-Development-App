import React from 'react';
import Card from '../primitives/Card';

/**
 * CalendarTemplate
 * A mobile-first weekly calendar template following AK Golf design system
 * Based on CalendarWeek.raw.tsx
 */

export interface CalendarSession {
  id: string;
  title: string;
  start: string; // "08:00"
  end: string; // "09:00"
  date: string; // "YYYY-MM-DD"
  meta?: string; // e.g. session type
}

interface CalendarDay {
  date: Date;
  dateKey: string;
  isToday: boolean;
  isSelected: boolean;
  sessions: CalendarSession[];
}

interface CalendarTemplateProps {
  /** Current selected date */
  selectedDate: Date;
  /** Sessions to display */
  sessions: CalendarSession[];
  /** Callback when a day is selected */
  onSelectDate?: (date: Date) => void;
  /** Callback when a session is selected */
  onSelectSession?: (id: string) => void;
  /** Additional className for customization */
  className?: string;
}

const CalendarTemplate: React.FC<CalendarTemplateProps> = ({
  selectedDate,
  sessions,
  onSelectDate,
  onSelectSession,
  className = '',
}) => {
  // Get the week dates based on selected date
  const getWeekDates = (date: Date): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const current = new Date(date);

    // Find the start of the week (Monday)
    const day = current.getDay();
    const diff = day === 0 ? -6 : day - 1;
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

      // Filter sessions for this day
      const daySessions = sessions.filter((s) => s.date === dateKey);

      days.push({
        date: dayDate,
        dateKey,
        isToday: dayDate.getTime() === today.getTime(),
        isSelected: dayDate.getTime() === selected.getTime(),
        sessions: daySessions,
      });
    }

    return days;
  };

  // Get week number
  const getWeekNumber = (date: Date): number => {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  const weekDates = getWeekDates(selectedDate);
  const weekNumber = getWeekNumber(selectedDate);
  const dayNames = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

  const handleDayClick = (day: CalendarDay) => {
    if (onSelectDate) {
      onSelectDate(day.date);
    }
  };

  const handleSessionClick = (
    e: React.MouseEvent,
    sessionId: string
  ) => {
    e.stopPropagation();
    if (onSelectSession) {
      onSelectSession(sessionId);
    }
  };

  const getSessionTypeColor = (meta?: string) => {
    switch (meta) {
      case 'training':
        return 'var(--ak-primary)';
      case 'tournament':
        return 'var(--ak-gold)';
      case 'test':
        return 'var(--ak-warning)';
      case 'session':
        return 'var(--ak-success)';
      default:
        return 'var(--gray-500)';
    }
  };

  const selectedDay = weekDates.find((d) => d.isSelected);

  return (
    <Card className={className}>
      {/* Week Header */}
      <div style={styles.weekHeader}>
        <span style={styles.weekNumber}>Uke {weekNumber}</span>
      </div>

      {/* Day Headers */}
      <div style={styles.dayHeaders}>
        {dayNames.map((dayName, index) => (
          <div key={index} style={styles.dayHeader}>
            <span style={styles.dayHeaderText}>{dayName}</span>
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div style={styles.daysGrid}>
        {weekDates.map((day, index) => {
          const hasSessions = day.sessions.length > 0;

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

                {hasSessions && (
                  <div style={styles.eventIndicators}>
                    {day.sessions.slice(0, 3).map((session) => (
                      <div
                        key={session.id}
                        style={{
                          ...styles.eventDot,
                          backgroundColor: getSessionTypeColor(session.meta),
                        }}
                        title={session.title}
                      />
                    ))}
                    {day.sessions.length > 3 && (
                      <span style={styles.moreEvents}>
                        +{day.sessions.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Sessions */}
      <div style={styles.selectedDayEvents}>
        {selectedDay?.sessions.map((session) => (
          <button
            key={session.id}
            onClick={(e) => handleSessionClick(e, session.id)}
            style={{
              ...styles.eventItem,
              borderLeftColor: getSessionTypeColor(session.meta),
            }}
          >
            <div style={styles.eventTime}>
              {session.start} - {session.end}
            </div>
            <div style={styles.eventTitle}>{session.title}</div>
          </button>
        ))}
        {selectedDay?.sessions.length === 0 && (
          <div style={styles.noEvents}>Ingen økter</div>
        )}
      </div>
    </Card>
  );
};

// Styles using CSS-in-JS with design tokens (from raw-block)
const styles: Record<string, React.CSSProperties> = {
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
    minHeight: '44px',
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
    backgroundColor: 'rgba(16, 69, 106, 0.05)',
  },
  daySelected: {
    backgroundColor: 'var(--ak-primary)',
  },
  dayNumber: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  dayNumberToday: {
    color: 'var(--ak-primary)',
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
    border: 'none',
    width: '100%',
    cursor: 'pointer',
    textAlign: 'left',
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

export default CalendarTemplate;
