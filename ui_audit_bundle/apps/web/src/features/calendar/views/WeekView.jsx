import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { SectionTitle } from '../../../components/typography';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const WeekView = ({
  currentDate,
  sessions = {},
  selectedDate,
  onDateSelect,
  onSessionClick,
  onNavigate,
  onAddEvent,
}) => {
  const container = useRef(null);
  const containerNav = useRef(null);
  const containerOffset = useRef(null);

  const weekDays = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];
  const monthNames = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
                      'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'];
  const hours = Array.from({ length: 18 }, (_, i) => i + 5); // 05:00 - 22:00

  // Calculate week dates
  const getWeekDates = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));

    return Array.from({ length: 7 }, (_, i) => {
      const weekDate = new Date(monday);
      weekDate.setDate(monday.getDate() + i);
      return weekDate;
    });
  };

  const weekDates = getWeekDates(currentDate);
  const today = new Date();

  // Get week number
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  // Scroll to current time on mount
  useEffect(() => {
    const currentMinute = new Date().getHours() * 60 + new Date().getMinutes();
    if (container.current) {
      container.current.scrollTop =
        ((currentMinute - 5 * 60) / (18 * 60)) * container.current.scrollHeight - 200;
    }
  }, []);

  const getSessionColor = (type) => {
    const colors = {
      teknikk: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', accent: 'bg-blue-500' },
      golfslag: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', accent: 'bg-green-500' },
      spill: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', accent: 'bg-purple-500' },
      konkurranse: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', accent: 'bg-amber-500' },
      fysisk: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', accent: 'bg-red-500' },
      mental: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', accent: 'bg-gray-500' },
    };
    return colors[type] || { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', accent: 'bg-gray-400' };
  };

  const getSessionsForDay = (date) => {
    const day = date.getDate();
    // Check if we're in the same month as the sessions data
    const sameMonth = date.getMonth() === currentDate.getMonth();
    return sameMonth ? (sessions[day] || []) : [];
  };

  // Calculate session position and height
  const getSessionStyle = (session) => {
    const [hours, minutes] = (session.time || '09:00').split(':').map(Number);
    const startMinutes = (hours - 5) * 60 + minutes; // Offset from 5AM
    const duration = session.duration || 60;

    return {
      top: `${(startMinutes / (18 * 60)) * 100}%`,
      height: `${(duration / (18 * 60)) * 100}%`,
    };
  };

  return (
    <div className="flex h-full flex-col bg-white rounded-ak-lg shadow-sm ring-1 ring-border-default overflow-hidden">
      {/* Header */}
      <header className="flex flex-none items-center justify-between border-b border-border-default px-6 py-4">
        <div>
          <SectionTitle className="text-base font-semibold leading-6 text-ak-charcoal">
            <time dateTime={weekDates[0].toISOString().split('T')[0]}>
              Uke {getWeekNumber(currentDate)} · {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </time>
          </SectionTitle>
          <p className="mt-1 text-sm text-ak-steel">
            {weekDates[0].getDate()}. - {weekDates[6].getDate()}. {monthNames[weekDates[6].getMonth()]}
          </p>
        </div>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-ak-md bg-white shadow-sm ring-1 ring-border-default md:items-stretch">
            <button
              type="button"
              onClick={() => onNavigate?.(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-l-ak-md text-ak-steel hover:text-ak-charcoal focus:relative md:hover:bg-ak-snow"
            >
              <span className="sr-only">Forrige uke</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                onDateSelect?.(today);
              }}
              className="hidden px-3.5 text-sm font-semibold text-ak-charcoal hover:bg-ak-snow focus:relative md:block"
            >
              I dag
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.(1)}
              className="flex h-9 w-9 items-center justify-center rounded-r-ak-md text-ak-steel hover:text-ak-charcoal focus:relative md:hover:bg-ak-snow"
            >
              <span className="sr-only">Neste uke</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          {onAddEvent && (
            <div className="hidden md:ml-4 md:flex md:items-center">
              <div className="ml-6 h-6 w-px bg-border-default" />
              <button
                type="button"
                onClick={onAddEvent}
                className="ml-6 rounded-ak-md bg-ak-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ak-primary-light"
              >
                Ny hendelse
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Week Days Header */}
      <div
        ref={containerNav}
        className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black/5"
      >
        <div className="grid grid-cols-7 text-sm leading-6 text-ak-steel sm:hidden">
          {weekDates.map((date, idx) => {
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onDateSelect?.(date)}
                className="flex flex-col items-center pb-3 pt-2"
              >
                <span>{weekDays[idx].charAt(0)}</span>
                <span
                  className={classNames(
                    'mt-1 flex h-8 w-8 items-center justify-center font-semibold',
                    isToday && 'rounded-full bg-ak-primary text-white',
                    isSelected && !isToday && 'rounded-full bg-ak-charcoal text-white',
                    !isToday && !isSelected && 'text-ak-charcoal'
                  )}
                >
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>

        <div className="-mr-px hidden grid-cols-7 divide-x divide-border-default border-r border-border-default text-sm leading-6 text-ak-steel sm:grid">
          <div className="col-end-1 w-14" />
          {weekDates.map((date, idx) => {
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const daySessions = getSessionsForDay(date);
            const completed = daySessions.filter(s => s.status === 'completed').length;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onDateSelect?.(date)}
                className={classNames(
                  'flex flex-col items-center py-3 hover:bg-ak-snow transition-colors',
                  isSelected && 'bg-ak-primary/5'
                )}
              >
                <span className="text-xs">{weekDays[idx]}</span>
                <span
                  className={classNames(
                    'mt-1 flex h-8 w-8 items-center justify-center text-lg font-semibold',
                    isToday && 'rounded-full bg-ak-primary text-white',
                    isSelected && !isToday && 'rounded-full bg-ak-primary/10 text-ak-primary',
                    !isToday && !isSelected && 'text-ak-charcoal'
                  )}
                >
                  {date.getDate()}
                </span>
                {daySessions.length > 0 && (
                  <span className={classNames(
                    'mt-1 text-xs',
                    completed === daySessions.length ? 'text-ak-success' : 'text-ak-steel'
                  )}>
                    {completed}/{daySessions.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Grid */}
      <div
        ref={container}
        className="flex flex-auto overflow-auto"
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
        <div
          ref={containerOffset}
          className="flex flex-auto flex-col"
        >
          <div className="flex flex-auto">
            {/* Time Labels */}
            <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-border-default">
              <div className="relative h-full">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="absolute w-full"
                    style={{ top: `${((hour - 5) / 18) * 100}%` }}
                  >
                    <span className="absolute right-2 -top-2 text-xs text-ak-steel">
                      {hour.toString().padStart(2, '0')}:00
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Day Columns */}
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal time lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-border-default"
                style={{ gridTemplateRows: `repeat(${hours.length}, minmax(3.5rem, 1fr))` }}
              >
                {hours.map((hour) => (
                  <div key={hour} />
                ))}
              </div>

              {/* Events Grid */}
              <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-border-default sm:grid">
                {weekDates.map((date, dayIdx) => {
                  const daySessions = getSessionsForDay(date);
                  const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

                  return (
                    <div
                      key={dayIdx}
                      className={classNames(
                        'relative',
                        isSelected && 'bg-ak-primary/5'
                      )}
                      style={{ minHeight: `${hours.length * 3.5}rem` }}
                    >
                      {/* Grid lines for hours */}
                      <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(${hours.length}, minmax(3.5rem, 1fr))` }}>
                        {hours.map((hour) => (
                          <div key={hour} className="border-b border-border-default/50" />
                        ))}
                      </div>

                      {/* Sessions */}
                      {daySessions.map((session) => {
                        const colors = getSessionColor(session.type);
                        const style = getSessionStyle(session);

                        return (
                          <button
                            key={session.id}
                            onClick={() => onSessionClick?.(session, date)}
                            className={classNames(
                              'absolute left-1 right-1 rounded-ak-sm p-2 text-left shadow-sm overflow-hidden',
                              colors.bg,
                              'border-l-4',
                              colors.border,
                              'hover:shadow-md transition-shadow cursor-pointer',
                              session.status === 'completed' && 'opacity-60'
                            )}
                            style={{
                              top: style.top,
                              height: style.height,
                              minHeight: '2rem',
                              borderLeftColor: colors.accent.replace('bg-', 'var(--ak-'),
                            }}
                          >
                            <p className={classNames('text-xs font-semibold truncate', colors.text)}>
                              {session.name}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Clock className={classNames('h-3 w-3', colors.text)} />
                              <span className={classNames('text-xs', colors.text)}>
                                {session.time}
                              </span>
                              {session.duration > 0 && (
                                <span className={classNames('text-xs', colors.text)}>
                                  · {session.duration}m
                                </span>
                              )}
                            </div>
                            {session.location && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <MapPin className={classNames('h-3 w-3', colors.text)} />
                                <span className={classNames('text-xs truncate', colors.text)}>
                                  {session.location}
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Mobile: Single day view */}
              <div className="col-start-1 col-end-2 row-start-1 sm:hidden">
                <div
                  className="relative"
                  style={{ minHeight: `${hours.length * 3.5}rem` }}
                >
                  {/* Grid lines */}
                  <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(${hours.length}, minmax(3.5rem, 1fr))` }}>
                    {hours.map((hour) => (
                      <div key={hour} className="border-b border-border-default/50" />
                    ))}
                  </div>

                  {/* Sessions for selected/today */}
                  {(() => {
                    const viewDate = selectedDate || today;
                    const daySessions = getSessionsForDay(viewDate);

                    return daySessions.map((session) => {
                      const colors = getSessionColor(session.type);
                      const style = getSessionStyle(session);

                      return (
                        <button
                          key={session.id}
                          onClick={() => onSessionClick?.(session, viewDate)}
                          className={classNames(
                            'absolute left-1 right-1 rounded-ak-sm p-2 text-left shadow-sm',
                            colors.bg,
                            'border-l-4',
                            colors.border,
                            'hover:shadow-md transition-shadow'
                          )}
                          style={{
                            top: style.top,
                            height: style.height,
                            minHeight: '2.5rem',
                          }}
                        >
                          <p className={classNames('text-sm font-semibold truncate', colors.text)}>
                            {session.name}
                          </p>
                          <p className={classNames('text-xs', colors.text)}>
                            {session.time} · {session.duration}m
                          </p>
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;
