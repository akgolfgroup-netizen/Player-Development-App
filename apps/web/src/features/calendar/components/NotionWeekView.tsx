import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { SectionTitle } from '../../../components/typography';

/**
 * NotionWeekView - Notion Calendar-inspired week view
 * Features:
 * - Time column from 05:00 to 23:00
 * - Sessions positioned by time
 * - Weekend days in light gray
 * - Click to add session
 * - Full width layout
 */

export interface CalendarSession {
  id: string;
  title: string;
  start: string; // "08:00"
  end: string; // "09:00"
  date: string; // "YYYY-MM-DD"
  meta?: string; // session type
  location?: string;
}

interface NotionWeekViewProps {
  currentDate: Date;
  sessions: CalendarSession[];
  onDateChange: (date: Date) => void;
  onSessionClick?: (session: CalendarSession) => void;
  onAddSession?: (date: Date, time: string) => void;
}

// Time slots from 05:00 to 23:00
const TIME_SLOTS = Array.from({ length: 19 }, (_, i) => {
  const hour = i + 5;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const DAY_NAMES = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lor', 'Son'];
const FULL_DAY_NAMES = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lordag', 'Sondag'];

const NotionWeekView: React.FC<NotionWeekViewProps> = ({
  currentDate,
  sessions,
  onDateChange,
  onSessionClick,
  onAddSession,
}) => {
  // Get week dates (Monday to Sunday)
  const weekDates = useMemo(() => {
    const dates: Date[] = [];
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentDate]);

  // Get week number
  const weekNumber = useMemo(() => {
    const d = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }, [currentDate]);

  // Navigate weeks
  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  // Format date key
  const getDateKey = (date: Date) => date.toISOString().split('T')[0];

  // Get sessions for a specific date
  const getSessionsForDate = (date: Date) => {
    const dateKey = getDateKey(date);
    return sessions.filter(s => s.date === dateKey);
  };

  // Get session type color - uses semantic tokens from design system
  const getSessionColor = (meta?: string) => {
    const colors: Record<string, string> = {
      training: 'var(--ak-session-spill)',
      tournament: 'var(--ak-status-warning)',
      test: 'var(--ak-session-test)',
      session: 'var(--ak-primary)',
      teknikk: 'var(--ak-session-teknikk)',
      golfslag: 'var(--ak-session-golfslag)',
      spill: 'var(--ak-session-spill)',
      fysisk: 'var(--ak-session-fysisk)',
      mental: 'var(--ak-session-funksjonell)',
      kompetanse: 'var(--ak-session-kompetanse)',
      funksjonell: 'var(--ak-session-funksjonell)',
      hjemme: 'var(--ak-session-hjemme)',
    };
    return colors[meta || ''] || 'var(--ak-text-tertiary)';
  };

  // Calculate session position (top offset based on time)
  const getSessionStyle = (session: CalendarSession) => {
    const [startHour, startMin] = session.start.split(':').map(Number);
    const [endHour, endMin] = session.end.split(':').map(Number);

    // Calculate position relative to 05:00
    const startOffset = (startHour - 5) * 60 + startMin;
    const endOffset = (endHour - 5) * 60 + endMin;
    const duration = endOffset - startOffset;

    // 60px per hour
    const top = (startOffset / 60) * 60;
    const height = Math.max((duration / 60) * 60, 24); // Min height 24px

    return {
      top: `${top}px`,
      height: `${height}px`,
      minHeight: '24px',
    };
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Format month/year for header
  const monthYear = currentDate.toLocaleDateString('nb-NO', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col h-full bg-ak-surface-card">
      {/* Header with navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-ak-border-default">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigateWeek(-1)}
              className="p-2 hover:bg-ak-surface-elevated rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-ak-text-tertiary" />
            </button>
            <button
              onClick={() => navigateWeek(1)}
              className="p-2 hover:bg-ak-surface-elevated rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-ak-text-tertiary" />
            </button>
          </div>

          <SectionTitle className="text-lg font-semibold text-ak-text-primary capitalize">
            {monthYear}
          </SectionTitle>

          <span className="text-sm text-ak-text-muted bg-ak-surface-elevated px-2 py-1 rounded">
            Uke {weekNumber}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium text-ak-text-secondary hover:bg-ak-surface-elevated rounded-lg transition-colors"
          >
            I dag
          </button>
          {onAddSession && (
            <button
              onClick={() => onAddSession(currentDate, '09:00')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-ak-primary text-white text-sm font-medium rounded-lg hover:bg-ak-primary-light transition-colors"
            >
              <Plus size={16} />
              Ny okt
            </button>
          )}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Time column */}
        <div className="w-16 flex-shrink-0 border-r border-ak-border-default">
          <div className="h-14 border-b border-ak-border-default" /> {/* Empty header space */}
          <div className="relative">
            {TIME_SLOTS.map((time, idx) => (
              <div
                key={time}
                className="h-[60px] flex items-start justify-end pr-2 text-xs text-ak-text-muted"
                style={{ marginTop: idx === 0 ? '-6px' : 0 }}
              >
                {time}
              </div>
            ))}
          </div>
        </div>

        {/* Days columns */}
        <div className="flex flex-1 overflow-x-auto">
          {weekDates.map((date, dayIdx) => {
            const isToday = date.getTime() === today.getTime();
            const isWeekend = dayIdx >= 5; // Saturday (5) and Sunday (6)
            const daySessions = getSessionsForDate(date);

            return (
              <div
                key={dayIdx}
                className={`flex-1 min-w-[120px] border-r border-ak-border-default last:border-r-0 ${
                  isWeekend ? 'bg-ak-surface-base' : ''
                }`}
              >
                {/* Day header */}
                <div className={`h-14 flex flex-col items-center justify-center border-b border-ak-border-default ${
                  isWeekend ? 'bg-ak-surface-elevated' : 'bg-ak-surface-card'
                }`}>
                  <span className={`text-xs font-medium ${isWeekend ? 'text-ak-text-muted' : 'text-ak-text-tertiary'}`}>
                    {DAY_NAMES[dayIdx]}
                  </span>
                  <span className={`text-lg font-semibold ${
                    isToday
                      ? 'w-8 h-8 flex items-center justify-center bg-ak-primary text-white rounded-full'
                      : isWeekend ? 'text-ak-text-muted' : 'text-ak-text-primary'
                  }`}>
                    {date.getDate()}
                  </span>
                </div>

                {/* Time slots with sessions */}
                <div className="relative" style={{ height: `${TIME_SLOTS.length * 60}px` }}>
                  {/* Hour lines */}
                  {TIME_SLOTS.map((_, idx) => (
                    <div
                      key={idx}
                      className="absolute w-full border-t border-ak-border-muted"
                      style={{ top: `${idx * 60}px` }}
                    />
                  ))}

                  {/* Sessions */}
                  {daySessions.map(session => {
                    const style = getSessionStyle(session);
                    const color = getSessionColor(session.meta);

                    return (
                      <div
                        key={session.id}
                        className="absolute left-1 right-1 px-2 py-1 rounded cursor-pointer overflow-hidden hover:opacity-90 transition-opacity"
                        style={{
                          ...style,
                          backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
                          borderLeft: `3px solid ${color}`,
                        }}
                        onClick={() => onSessionClick?.(session)}
                      >
                        <div className="text-[10px] font-medium text-ak-text-tertiary">
                          {session.start}
                        </div>
                        <div className="text-xs font-medium text-ak-text-primary truncate">
                          {session.title}
                        </div>
                        {session.location && (
                          <div className="text-[10px] text-ak-text-muted truncate">
                            {session.location}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Click to add (on empty cells) */}
                  {onAddSession && (
                    <div
                      className="absolute inset-0 cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const y = e.clientY - rect.top;
                        const hour = Math.floor(y / 60) + 5;
                        onAddSession(date, `${hour.toString().padStart(2, '0')}:00`);
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NotionWeekView;
