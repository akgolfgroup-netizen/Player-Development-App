/**
 * CalendarDayView Component
 *
 * Execution-oriented day view with:
 * - Decision Anchor (sticky)
 * - Hour grid with now line
 * - Event blocks
 * - State handling (S0-S6)
 *
 * Uses semantic tokens only (no raw hex values).
 */

import React, { useMemo, useEffect, useRef, useState } from 'react';
import { Play, Pause, Check, Clock, ArrowRight } from 'lucide-react';
import type { CalendarEvent } from '../hooks/useCalendarEvents';

interface CalendarDayViewProps {
  date: Date;
  events: CalendarEvent[];
  weeklyFocus?: string;
  onEventClick: (event: CalendarEvent) => void;
  onStartSession: (event: CalendarEvent) => void;
  onCompleteSession: (event: CalendarEvent) => void;
  onPostponeSession: (event: CalendarEvent, minutes: number) => void;
  onAddSession: (date: Date, time: string) => void;
}

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  return `${i.toString().padStart(2, '0')}:00`;
});

const HOUR_HEIGHT = 60;

type DayViewState =
  | 'default' // S0
  | 'recommended_scheduled' // S1
  | 'recommended_not_scheduled' // S2
  | 'no_recommendation' // S3
  | 'collision' // S4
  | 'in_progress' // S5
  | 'completed'; // S6

function getDayViewState(events: CalendarEvent[]): DayViewState {
  const inProgress = events.find((e) => e.status === 'in_progress');
  if (inProgress) return 'in_progress';

  const recommended = events.find((e) => e.status === 'recommended');
  const allCompleted = events.length > 0 && events.every((e) => e.status === 'completed');

  if (allCompleted) return 'completed';
  if (!recommended) return events.length > 0 ? 'default' : 'no_recommendation';

  // Check for collision with recommended
  const hasCollision = events.some((e) => {
    if (e.id === recommended.id) return false;
    return e.start < recommended.end && e.end > recommended.start;
  });

  if (hasCollision) return 'collision';
  return 'recommended_scheduled';
}

function getEventStyle(event: CalendarEvent): React.CSSProperties {
  const [startHour, startMin] = event.start.split(':').map(Number);
  const [endHour, endMin] = event.end.split(':').map(Number);

  const startOffset = startHour * 60 + startMin;
  const endOffset = endHour * 60 + endMin;
  const duration = endOffset - startOffset;

  const top = (startOffset / 60) * HOUR_HEIGHT;
  const height = Math.max((duration / 60) * HOUR_HEIGHT, 40);

  return {
    position: 'absolute',
    top: `${top}px`,
    height: `${height}px`,
    left: '80px',
    right: '16px',
    minHeight: '40px',
  };
}

function getEventColors(event: CalendarEvent): {
  bg: string;
  border: string;
  text: string;
} {
  switch (event.status) {
    case 'recommended':
      return {
        bg: 'var(--calendar-event-recommended-bg)',
        border: 'var(--calendar-event-recommended-border)',
        text: 'var(--calendar-event-recommended-text)',
      };
    case 'in_progress':
      return {
        bg: 'var(--calendar-event-inprogress-bg)',
        border: 'var(--calendar-event-inprogress-border)',
        text: 'var(--calendar-event-inprogress-text)',
      };
    case 'completed':
      return {
        bg: 'var(--calendar-event-completed-bg)',
        border: 'var(--calendar-event-completed-border)',
        text: 'var(--calendar-event-completed-text)',
      };
    case 'ghost':
      return {
        bg: 'var(--calendar-event-ghost-bg)',
        border: 'var(--calendar-event-ghost-border)',
        text: 'var(--calendar-event-ghost-text)',
      };
    default:
      return {
        bg: 'var(--calendar-event-planned-bg)',
        border: 'var(--calendar-event-planned-border)',
        text: 'var(--calendar-event-planned-text)',
      };
  }
}

export const CalendarDayView: React.FC<CalendarDayViewProps> = ({
  date,
  events,
  weeklyFocus = 'Kortsteg fokus',
  onEventClick,
  onStartSession,
  onCompleteSession,
  onPostponeSession,
  onAddSession,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [nowLineTop, setNowLineTop] = useState<number | null>(null);

  const dayState = useMemo(() => getDayViewState(events), [events]);

  const recommendedEvent = useMemo(
    () => events.find((e) => e.status === 'recommended'),
    [events]
  );

  const inProgressEvent = useMemo(
    () => events.find((e) => e.status === 'in_progress'),
    [events]
  );

  // Update now line position
  useEffect(() => {
    const updateNowLine = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const offset = hours * 60 + minutes;
      setNowLineTop((offset / 60) * HOUR_HEIGHT);
    };

    updateNowLine();
    const interval = setInterval(updateNowLine, 60000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to current time on mount
  useEffect(() => {
    if (scrollRef.current && nowLineTop !== null) {
      scrollRef.current.scrollTop = Math.max(0, nowLineTop - 200);
    }
  }, [nowLineTop]);

  const formatDate = (d: Date) => {
    const days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
    const months = ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];
    return `${days[d.getDay()]} ${d.getDate()}. ${months[d.getMonth()]}`;
  };

  const renderDecisionAnchor = () => {
    let line1 = `I dag: ${weeklyFocus}`;
    let line2 = '';
    let primaryCta = null;
    let secondaryCta = null;

    switch (dayState) {
      case 'in_progress':
        if (inProgressEvent) {
          line2 = `Pågår: ${inProgressEvent.title} · ${inProgressEvent.duration}min`;
          primaryCta = (
            <button
              onClick={() => onCompleteSession(inProgressEvent)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              style={{
                backgroundColor: 'var(--ak-success)',
                color: 'var(--text-inverse)',
              }}
            >
              <Check size={16} />
              Fullfør
            </button>
          );
          secondaryCta = (
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-sm transition-colors"
              style={{
                backgroundColor: 'var(--calendar-surface-elevated)',
                color: 'var(--calendar-text-secondary)',
              }}
            >
              <Pause size={16} />
              Pause
            </button>
          );
        }
        break;

      case 'recommended_scheduled':
        if (recommendedEvent) {
          line2 = `Anbefalt: ${recommendedEvent.title} · ${recommendedEvent.duration}min · ${recommendedEvent.category || 'trening'}`;
          primaryCta = (
            <button
              onClick={() => onStartSession(recommendedEvent)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              style={{
                backgroundColor: 'var(--ak-primary)',
                color: 'var(--text-inverse)',
              }}
            >
              <Play size={16} />
              Start nå
            </button>
          );
          secondaryCta = (
            <div className="flex items-center gap-2">
              <span
                className="text-sm"
                style={{ color: 'var(--calendar-text-tertiary)' }}
              >
                Utsett:
              </span>
              {[15, 30, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => onPostponeSession(recommendedEvent, mins)}
                  className="px-2 py-1 rounded text-sm"
                  style={{
                    backgroundColor: 'var(--calendar-surface-elevated)',
                    color: 'var(--calendar-text-secondary)',
                  }}
                >
                  {mins}min
                </button>
              ))}
            </div>
          );
        }
        break;

      case 'no_recommendation':
        line2 = 'Ingen anbefalt økt i dag';
        primaryCta = (
          <button
            onClick={() => onAddSession(date, '09:00')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            style={{
              backgroundColor: 'var(--ak-primary)',
              color: 'var(--text-inverse)',
            }}
          >
            <Clock size={16} />
            Start 15 min terskeløkt
          </button>
        );
        secondaryCta = (
          <button
            onClick={() => onAddSession(date, '09:00')}
            className="px-3 py-2 rounded-lg font-medium text-sm"
            style={{
              color: 'var(--calendar-text-secondary)',
            }}
          >
            Velg økt
          </button>
        );
        break;

      case 'collision':
        if (recommendedEvent) {
          line2 = `⚠️ Kollisjon: ${recommendedEvent.title} overlapper med annen økt`;
          primaryCta = (
            <button
              onClick={() => onPostponeSession(recommendedEvent, 30)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              style={{
                backgroundColor: 'var(--ak-warning)',
                color: 'var(--text-inverse)',
              }}
            >
              <ArrowRight size={16} />
              Flytt 30 min
            </button>
          );
          secondaryCta = (
            <button
              onClick={() => onStartSession(recommendedEvent)}
              className="px-3 py-2 rounded-lg font-medium text-sm"
              style={{
                color: 'var(--calendar-text-secondary)',
              }}
            >
              Start likevel
            </button>
          );
        }
        break;

      case 'completed':
        line2 = '✓ Alle økter fullført for i dag';
        primaryCta = (
          <button
            className="px-4 py-2 rounded-lg font-medium text-sm"
            style={{
              backgroundColor: 'var(--calendar-event-completed-bg)',
              color: 'var(--calendar-event-completed-text)',
            }}
          >
            Loggfør notat
          </button>
        );
        break;

      default:
        if (recommendedEvent) {
          line2 = `Anbefalt: ${recommendedEvent.title}`;
        }
    }

    return (
      <div
        className="sticky top-0 z-20 px-4 py-3 border-b"
        style={{
          backgroundColor: 'var(--calendar-surface-base)',
          borderColor: 'var(--calendar-border)',
        }}
      >
        {/* Date header */}
        <div
          className="text-sm font-medium mb-2"
          style={{ color: 'var(--calendar-text-tertiary)' }}
        >
          {formatDate(date)}
        </div>

        {/* Decision anchor content */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div
              className="text-sm"
              style={{ color: 'var(--calendar-text-secondary)' }}
            >
              {line1}
            </div>
            {line2 && (
              <div
                className="text-base font-medium mt-1"
                style={{ color: 'var(--calendar-text-primary)' }}
              >
                {line2}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {secondaryCta}
            {primaryCta}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: 'var(--calendar-surface-base)' }}
    >
      {/* Decision Anchor */}
      {renderDecisionAnchor()}

      {/* Scrollable time grid */}
      <div ref={scrollRef} className="flex-1 overflow-auto relative">
        {/* Time grid container */}
        <div
          className="relative"
          style={{ height: `${24 * HOUR_HEIGHT}px` }}
        >
          {/* Hour lines and labels */}
          {TIME_SLOTS.map((time, idx) => (
            <div
              key={time}
              className="absolute w-full flex items-start"
              style={{ top: `${idx * HOUR_HEIGHT}px` }}
            >
              <div
                className="w-16 flex-shrink-0 text-xs text-right pr-3 -mt-2"
                style={{ color: 'var(--calendar-text-muted)' }}
              >
                {time}
              </div>
              <div
                className="flex-1 border-t"
                style={{ borderColor: 'var(--calendar-grid-line)' }}
              />
            </div>
          ))}

          {/* Now line */}
          {nowLineTop !== null && (
            <div
              className="absolute w-full h-0.5 z-10 pointer-events-none"
              style={{
                top: `${nowLineTop}px`,
                backgroundColor: 'var(--calendar-now-line)',
              }}
            >
              <div
                className="absolute left-14 -top-1 w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: 'var(--calendar-now-line)' }}
              />
            </div>
          )}

          {/* Events */}
          {events.map((event) => {
            const positionStyle = getEventStyle(event);
            const colors = getEventColors(event);

            return (
              <div
                key={event.id}
                className="px-3 py-2 rounded-lg cursor-pointer overflow-hidden hover:opacity-90 transition-opacity"
                style={{
                  ...positionStyle,
                  backgroundColor: colors.bg,
                  borderLeft: `4px solid ${colors.border}`,
                  borderStyle: event.status === 'ghost' ? 'dashed' : 'solid',
                  opacity: event.status === 'completed' ? 0.7 : 1,
                }}
                onClick={() => onEventClick(event)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: colors.text }}
                    >
                      {event.title}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: 'var(--calendar-text-tertiary)' }}
                    >
                      {event.start} – {event.end} · {event.duration}min
                    </div>
                  </div>

                  {/* Status indicator */}
                  {event.status === 'completed' && (
                    <Check
                      size={18}
                      style={{ color: 'var(--calendar-event-completed-text)' }}
                    />
                  )}
                  {event.status === 'in_progress' && (
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: 'var(--calendar-event-inprogress-border)' }}
                    />
                  )}
                </div>

                {/* Badges */}
                {event.badges && event.badges.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {event.badges.slice(0, 2).map((badge) => (
                      <span
                        key={badge}
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor:
                            badge === 'Anbefalt'
                              ? 'var(--calendar-event-recommended-bg)'
                              : badge === 'Fullført'
                              ? 'var(--calendar-event-completed-bg)'
                              : badge === 'Pågår'
                              ? 'var(--calendar-event-inprogress-bg)'
                              : 'var(--calendar-surface-elevated)',
                          color:
                            badge === 'Anbefalt'
                              ? 'var(--calendar-event-recommended-text)'
                              : badge === 'Fullført'
                              ? 'var(--calendar-event-completed-text)'
                              : badge === 'Pågår'
                              ? 'var(--calendar-event-inprogress-text)'
                              : 'var(--calendar-text-secondary)',
                        }}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarDayView;
