/**
 * Time Grid Component
 *
 * Vertical hour grid (00-24) with:
 * - Current time indicator ("now line")
 * - Auto-scroll to "now" on initial load
 * - Event cards positioned based on time
 * - Ghost slot for unscheduled recommendations (S2 state)
 */

import React, { useRef, useEffect, useMemo } from 'react';
import { CalendarEvent, TimeGridProps } from './types';
import { EventCard } from './EventCard';

// Configuration
const HOUR_START = 5; // 05:00
const HOUR_END = 23; // 23:00
const TOTAL_HOURS = HOUR_END - HOUR_START;
const HOUR_HEIGHT_REM = 4; // Height of each hour in rem

// Semantic style tokens (NO raw hex values)
const styles = {
  container: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: 'var(--background-white)',
  },
  grid: {
    display: 'flex',
    position: 'relative' as const,
    minHeight: `${TOTAL_HOURS * HOUR_HEIGHT_REM}rem`,
  },
  timeLabels: {
    width: '60px',
    flexShrink: 0,
    backgroundColor: 'var(--background-white)',
    position: 'sticky' as const,
    left: 0,
    zIndex: 10,
  },
  timeLabel: {
    position: 'absolute' as const,
    right: 'var(--spacing-3)',
    transform: 'translateY(-50%)',
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
    fontVariantNumeric: 'tabular-nums',
  },
  eventsColumn: {
    flex: 1,
    position: 'relative' as const,
    borderLeft: '1px solid var(--border-default)',
  },
  hourLine: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    borderTop: '1px solid var(--border-subtle)',
    cursor: 'pointer',
    transition: 'background-color 0.1s ease',
  },
  hourLineHover: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  nowLine: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none' as const,
  },
  nowDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    marginLeft: '-5px',
    boxShadow: '0 0 0 2px var(--background-white)',
  },
  nowLineBar: {
    flex: 1,
    height: '2px',
    backgroundColor: 'var(--accent)',
  },
  eventWrapper: {
    position: 'absolute' as const,
    left: 'var(--spacing-2)',
    right: 'var(--spacing-2)',
    zIndex: 5,
  },
  ghostEvent: {
    opacity: 0.4,
    border: '2px dashed var(--border-brand)',
  },
  allDayLane: {
    borderBottom: '1px solid var(--border-default)',
    padding: 'var(--spacing-3) var(--spacing-4)',
    paddingLeft: '76px', // Account for time labels
    backgroundColor: 'var(--background-surface)',
    display: 'flex',
    gap: 'var(--spacing-2)',
    flexWrap: 'wrap' as const,
    minHeight: '52px',
  },
  allDayEvent: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-2) var(--spacing-3)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'opacity 0.1s ease',
  },
  allDayEventAK: {
    backgroundColor: 'var(--accent-muted)',
    color: 'var(--text-brand)',
    border: '1px solid var(--border-brand)',
  },
  allDayEventExternal: {
    backgroundColor: 'var(--background-elevated)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-default)',
  },
  emptyState: {
    position: 'absolute' as const,
    left: '50%',
    top: '40%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center' as const,
    color: 'var(--text-tertiary)',
    fontSize: 'var(--font-size-footnote)',
  },
};

// Helper: Calculate position percentage from time
const getPositionFromTime = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = (hours - HOUR_START) * 60 + minutes;
  return (totalMinutes / (TOTAL_HOURS * 60)) * 100;
};

// Helper: Calculate height percentage from duration
const getHeightFromDuration = (duration: number): number => {
  return (duration / (TOTAL_HOURS * 60)) * 100;
};

// Helper: Format hour to display
const formatHour = (hour: number): string => {
  return `${hour.toString().padStart(2, '0')}:00`;
};

export const TimeGrid: React.FC<TimeGridProps> = ({
  date,
  events,
  recommendedSlot,
  onEventClick,
  onTimeSlotClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  // Check if date is today
  const isToday = useMemo(() => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, [date]);

  // Calculate current time position
  const nowPosition = useMemo(() => {
    if (!isToday) return null;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    if (hours < HOUR_START || hours >= HOUR_END) return null;

    return getPositionFromTime(`${hours}:${minutes}`);
  }, [isToday]);

  // Auto-scroll to "now" on initial load
  useEffect(() => {
    if (!containerRef.current || hasScrolled.current) return;

    if (isToday && nowPosition !== null) {
      const container = containerRef.current;
      const gridHeight = container.scrollHeight;
      const scrollPosition = (nowPosition / 100) * gridHeight - container.clientHeight / 3;

      container.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: 'smooth',
      });
      hasScrolled.current = true;
    }
  }, [isToday, nowPosition]);

  // Reset scroll flag when date changes
  useEffect(() => {
    hasScrolled.current = false;
  }, [date]);

  // Separate all-day and timed events
  const { allDayEvents, timedEvents } = useMemo(() => {
    const allDay: CalendarEvent[] = [];
    const timed: CalendarEvent[] = [];

    events.forEach((event) => {
      if (event.type === 'ak_workout' && event.workout?.isAllDay) {
        allDay.push(event);
      } else if (event.type === 'external' && event.external?.isAllDay) {
        allDay.push(event);
      } else {
        timed.push(event);
      }
    });

    return { allDayEvents: allDay, timedEvents: timed };
  }, [events]);

  // Generate hour lines
  const hours = Array.from({ length: TOTAL_HOURS }, (_, i) => HOUR_START + i);

  // Get event position and size
  const getEventStyle = (event: CalendarEvent) => {
    let startTime: string;
    let duration: number;

    if (event.type === 'ak_workout' && event.workout) {
      startTime = event.workout.scheduledTime || '09:00';
      duration = event.workout.duration;
    } else if (event.type === 'external' && event.external) {
      startTime = event.external.startTime;
      // Calculate duration from start and end time
      const [startH, startM] = event.external.startTime.split(':').map(Number);
      const [endH, endM] = event.external.endTime.split(':').map(Number);
      duration = (endH * 60 + endM) - (startH * 60 + startM);
    } else {
      return { top: '0%', height: '0%' };
    }

    const top = getPositionFromTime(startTime);
    const height = getHeightFromDuration(duration);

    return {
      top: `${top}%`,
      height: `${Math.max(height, 3)}%`, // Minimum height for visibility
      minHeight: '3rem',
    };
  };

  return (
    <div style={styles.container} ref={containerRef}>
      {/* All-Day Lane */}
      {allDayEvents.length > 0 && (
        <div style={styles.allDayLane}>
          {allDayEvents.map((event) => {
            const isAK = event.type === 'ak_workout';
            const title = isAK ? event.workout?.name : event.external?.title;

            return (
              <button
                key={event.id}
                style={{
                  ...styles.allDayEvent,
                  ...(isAK ? styles.allDayEventAK : styles.allDayEventExternal),
                }}
                onClick={() => onEventClick(event)}
              >
                {title}
              </button>
            );
          })}
        </div>
      )}

      {/* Time Grid */}
      <div style={styles.grid}>
        {/* Time Labels */}
        <div style={styles.timeLabels}>
          {hours.map((hour) => (
            <div
              key={hour}
              style={{
                ...styles.timeLabel,
                top: `${((hour - HOUR_START) / TOTAL_HOURS) * 100}%`,
              }}
            >
              {formatHour(hour)}
            </div>
          ))}
        </div>

        {/* Events Column */}
        <div style={styles.eventsColumn}>
          {/* Hour grid lines */}
          {hours.map((hour) => (
            <div
              key={hour}
              style={{
                ...styles.hourLine,
                top: `${((hour - HOUR_START) / TOTAL_HOURS) * 100}%`,
                height: `${(1 / TOTAL_HOURS) * 100}%`,
              }}
              onClick={() => onTimeSlotClick?.(hour)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            />
          ))}

          {/* Now line */}
          {nowPosition !== null && (
            <div style={{ ...styles.nowLine, top: `${nowPosition}%` }}>
              <div style={styles.nowDot} />
              <div style={styles.nowLineBar} />
            </div>
          )}

          {/* Ghost slot for S2 state */}
          {recommendedSlot && (
            <div
              style={{
                ...styles.eventWrapper,
                top: `${getPositionFromTime(recommendedSlot.time)}%`,
                height: `${getHeightFromDuration(recommendedSlot.duration)}%`,
                minHeight: '3rem',
                ...styles.ghostEvent,
              }}
            >
              <EventCard
                event={{
                  id: 'ghost-slot',
                  type: 'ak_workout',
                  workout: {
                    id: 'ghost',
                    name: 'Foreslått tid',
                    category: 'teknikk',
                    duration: recommendedSlot.duration,
                    scheduledTime: recommendedSlot.time,
                    status: 'scheduled',
                    isRecommended: true,
                    isAllDay: false,
                  },
                }}
                isGhost={true}
                onClick={() => {}}
              />
            </div>
          )}

          {/* Timed events */}
          {timedEvents.map((event) => {
            const eventStyle = getEventStyle(event);

            return (
              <div key={event.id} style={{ ...styles.eventWrapper, ...eventStyle }}>
                <EventCard event={event} onClick={() => onEventClick(event)} />
              </div>
            );
          })}

          {/* Empty state */}
          {timedEvents.length === 0 && allDayEvents.length === 0 && !recommendedSlot && (
            <div style={styles.emptyState}>
              Ingen hendelser denne dagen
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeGrid;
