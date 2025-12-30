/**
 * CalendarOversiktWidget
 *
 * Compact dashboard widget showing 7-day calendar stripe.
 * Displays colored dots for each event source.
 * Click navigates to full calendar overview page.
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';

import { useUnifiedCalendar } from './hooks/useUnifiedCalendar';
import { EventLegend } from './components/EventLegend';
import {
  CalendarOversiktWidgetProps,
  UnifiedCalendarEvent,
  EVENT_SOURCE_COLORS,
  formatDateKey,
} from './types';

const DAY_NAMES_SHORT = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDates(date: Date): Date[] {
  const dates: Date[] = [];
  const monday = getWeekStart(date);
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }
  return dates;
}

export const CalendarOversiktWidget: React.FC<CalendarOversiktWidgetProps> = ({
  onDayClick,
  className = '',
}) => {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const todayKey = formatDateKey(today);
  const weekDates = useMemo(() => getWeekDates(today), [today]);

  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];
  weekEnd.setHours(23, 59, 59, 999);

  const { events, isLoading } = useUnifiedCalendar({
    startDate: weekStart,
    endDate: weekEnd,
  });

  const eventsByDate = useMemo(() => {
    const map: Record<string, UnifiedCalendarEvent[]> = {};
    for (const event of events) {
      if (!map[event.date]) {
        map[event.date] = [];
      }
      map[event.date].push(event);
    }
    return map;
  }, [events]);

  const handleDayClick = (date: Date) => {
    if (onDayClick) {
      onDayClick(date);
    } else {
      navigate(`/kalender/oversikt?view=day&date=${formatDateKey(date)}`);
    }
  };

  const handleViewAll = () => {
    navigate('/kalender/oversikt?view=week');
  };

  return (
    <div
      className={`rounded-xl p-4 ${className}`}
      style={{
        backgroundColor: 'var(--card-background)',
        border: '1px solid var(--card-border)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={18} style={{ color: 'var(--text-secondary)' }} />
          <h3
            className="text-sm font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            Kalender Oversikt
          </h3>
        </div>
        <button
          onClick={handleViewAll}
          className="flex items-center gap-1 text-xs font-medium transition-colors"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-tertiary)';
          }}
        >
          Se alt
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Week stripe */}
      <div className="flex gap-1 mb-3">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 7 }).map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-16 rounded-lg animate-pulse"
              style={{ backgroundColor: 'var(--skeleton-bg)' }}
            />
          ))
        ) : (
          weekDates.map((date, idx) => {
            const dateKey = formatDateKey(date);
            const isToday = dateKey === todayKey;
            const dayEvents = eventsByDate[dateKey] || [];
            const dayOfWeek = date.getDay();

            // Get unique sources for this day
            const sourcesForDay = Array.from(
              new Set(dayEvents.map((e) => e.source))
            );

            return (
              <button
                key={dateKey}
                onClick={() => handleDayClick(date)}
                className="flex-1 flex flex-col items-center py-2 px-1 rounded-lg transition-colors"
                style={{
                  backgroundColor: isToday
                    ? 'var(--calendar-surface-today)'
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isToday) {
                    e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isToday) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {/* Day name */}
                <span
                  className="text-[10px] font-medium mb-1"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {DAY_NAMES_SHORT[dayOfWeek]}
                </span>

                {/* Day number */}
                <span
                  className={`text-sm font-semibold ${
                    isToday
                      ? 'w-6 h-6 flex items-center justify-center rounded-full'
                      : ''
                  }`}
                  style={{
                    backgroundColor: isToday
                      ? 'var(--calendar-today-marker-bg)'
                      : 'transparent',
                    color: isToday
                      ? 'var(--calendar-today-marker-text)'
                      : 'var(--text-primary)',
                  }}
                >
                  {date.getDate()}
                </span>

                {/* Event dots */}
                <div className="flex gap-0.5 mt-1 flex-wrap justify-center max-w-full">
                  {sourcesForDay.slice(0, 4).map((source) => {
                    const colors = EVENT_SOURCE_COLORS[source];
                    return (
                      <span
                        key={source}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: colors.border }}
                        title={colors.label}
                      />
                    );
                  })}
                  {sourcesForDay.length > 4 && (
                    <span
                      className="text-[8px]"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      +{sourcesForDay.length - 4}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Legend */}
      <EventLegend compact className="justify-center" />
    </div>
  );
};

export default CalendarOversiktWidget;
