import React from 'react';
import { ChevronLeft, ChevronRight, Clock, MoreHorizontal } from 'lucide-react';
import { SectionTitle } from '../../../components/typography';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const MonthView = ({
  currentDate,
  sessions = {},
  onDateClick,
  onNavigate,
  selectedDate,
  onSessionClick,
  onAddEvent,
}) => {
  const monthNames = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
                      'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'];
  const weekDays = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Get day of week for first day (0 = Sunday, we want Monday = 0)
  let startDay = firstDayOfMonth.getDay() - 1;
  if (startDay < 0) startDay = 6;

  // Get days from previous month to fill first week
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;

  const prevMonthDays = Array.from({ length: startDay }, (_, i) => {
    const day = prevMonthLastDay - startDay + i + 1;
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return {
      date: dateStr,
      day,
      isCurrentMonth: false,
      isPrevMonth: true,
      events: []
    };
  });

  // Current month days
  const today = new Date();
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const isSelected = selectedDate &&
                       day === selectedDate.getDate() &&
                       month === selectedDate.getMonth() &&
                       year === selectedDate.getFullYear();
    return {
      date: dateStr,
      day,
      isCurrentMonth: true,
      isToday,
      isSelected,
      events: sessions[day] || []
    };
  });

  // Next month days to fill last week
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const nextMonthDays = Array.from({ length: totalCells - startDay - daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return {
      date: dateStr,
      day,
      isCurrentMonth: false,
      isNextMonth: true,
      events: []
    };
  });

  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  const getSessionColor = (type) => {
    const colors = {
      teknikk: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
      golfslag: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
      spill: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
      konkurranse: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
      fysisk: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
      mental: { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' },
    };
    return colors[type] || { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-400' };
  };

  // Get selected day's events for mobile view
  const selectedDayEvents = selectedDate
    ? sessions[selectedDate.getDate()] || []
    : currentMonthDays.find(d => d.isToday)?.events || [];

  return (
    <div className="lg:flex lg:h-full lg:flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border-default bg-white px-6 py-4 lg:flex-none">
        <SectionTitle className="text-base font-semibold text-ak-charcoal">
          <time dateTime={`${year}-${String(month + 1).padStart(2, '0')}`}>
            {monthNames[month]} {year}
          </time>
        </SectionTitle>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-ak-md bg-white shadow-sm ring-1 ring-border-default md:items-stretch">
            <button
              type="button"
              onClick={() => onNavigate?.(-1)}
              className="flex h-9 w-12 items-center justify-center rounded-l-ak-md pr-1 text-ak-steel hover:text-ak-charcoal focus:relative md:w-9 md:pr-0 md:hover:bg-ak-snow"
            >
              <span className="sr-only">Forrige måned</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                onDateClick?.(today);
              }}
              className="hidden px-3.5 text-sm font-semibold text-ak-charcoal hover:bg-ak-snow focus:relative md:block"
            >
              I dag
            </button>
            <span className="relative -mx-px h-5 w-px bg-border-default md:hidden" />
            <button
              type="button"
              onClick={() => onNavigate?.(1)}
              className="flex h-9 w-12 items-center justify-center rounded-r-ak-md pl-1 text-ak-steel hover:text-ak-charcoal focus:relative md:w-9 md:pl-0 md:hover:bg-ak-snow"
            >
              <span className="sr-only">Neste måned</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          {onAddEvent && (
            <div className="hidden md:ml-4 md:flex md:items-center">
              <div className="ml-6 h-6 w-px bg-border-default" />
              <button
                type="button"
                onClick={onAddEvent}
                className="ml-6 rounded-ak-md bg-ak-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ak-primary-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ak-primary"
              >
                Ny hendelse
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Calendar Grid */}
      <div className="shadow-sm ring-1 ring-border-default lg:flex lg:flex-auto lg:flex-col">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-px border-b border-border-default bg-ak-mist text-center text-xs font-semibold leading-6 text-ak-steel lg:flex-none">
          {weekDays.map((day, idx) => (
            <div key={day} className="flex justify-center bg-white py-2">
              <span>{day.charAt(0)}</span>
              <span className="sr-only sm:not-sr-only">{day.slice(1)}</span>
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="flex bg-ak-mist text-xs leading-6 text-ak-steel lg:flex-auto">
          {/* Desktop View */}
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
            {allDays.map((dayInfo) => (
              <div
                key={dayInfo.date}
                onClick={() => dayInfo.isCurrentMonth && onDateClick?.(new Date(year, month, dayInfo.day))}
                className={classNames(
                  dayInfo.isCurrentMonth ? 'bg-white' : 'bg-ak-snow/50 text-ak-mist',
                  'group relative min-h-[100px] px-3 py-2 cursor-pointer hover:bg-ak-snow/80 transition-colors'
                )}
              >
                <time
                  dateTime={dayInfo.date}
                  className={classNames(
                    dayInfo.isToday
                      ? 'flex h-6 w-6 items-center justify-center rounded-full bg-ak-primary font-semibold text-white'
                      : dayInfo.isSelected
                      ? 'flex h-6 w-6 items-center justify-center rounded-full bg-ak-primary/10 font-semibold text-ak-primary'
                      : dayInfo.isCurrentMonth
                      ? 'text-ak-charcoal'
                      : 'text-ak-mist',
                    'relative'
                  )}
                >
                  {dayInfo.day}
                </time>
                {dayInfo.events.length > 0 && (
                  <ol className="mt-2">
                    {dayInfo.events.slice(0, 2).map((event) => {
                      const colors = getSessionColor(event.type);
                      return (
                        <li key={event.id}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSessionClick?.(event, new Date(year, month, dayInfo.day));
                            }}
                            className={classNames(
                              'group/event flex w-full text-left rounded px-1 py-0.5 mb-0.5',
                              colors.bg,
                              'hover:opacity-80 transition-opacity'
                            )}
                          >
                            <p className={classNames('flex-auto truncate text-xs font-medium', colors.text)}>
                              {event.name}
                            </p>
                            <time
                              dateTime={event.datetime}
                              className={classNames('ml-2 hidden flex-none xl:block text-xs', colors.text)}
                            >
                              {event.time}
                            </time>
                          </button>
                        </li>
                      );
                    })}
                    {dayInfo.events.length > 2 && (
                      <li className="text-ak-steel text-xs">+ {dayInfo.events.length - 2} mer</li>
                    )}
                  </ol>
                )}
              </div>
            ))}
          </div>

          {/* Mobile View */}
          <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
            {allDays.map((dayInfo) => (
              <button
                key={dayInfo.date}
                type="button"
                onClick={() => dayInfo.isCurrentMonth && onDateClick?.(new Date(year, month, dayInfo.day))}
                className={classNames(
                  dayInfo.isCurrentMonth ? 'bg-white' : 'bg-ak-snow/50',
                  (dayInfo.isSelected || dayInfo.isToday) && 'font-semibold',
                  dayInfo.isSelected && 'text-white',
                  !dayInfo.isSelected && dayInfo.isToday && 'text-ak-primary',
                  !dayInfo.isSelected && dayInfo.isCurrentMonth && !dayInfo.isToday && 'text-ak-charcoal',
                  !dayInfo.isSelected && !dayInfo.isCurrentMonth && !dayInfo.isToday && 'text-ak-mist',
                  'group relative flex h-14 flex-col px-3 py-2 hover:bg-ak-snow focus:z-10'
                )}
              >
                <time
                  dateTime={dayInfo.date}
                  className={classNames(
                    dayInfo.isSelected && 'flex h-6 w-6 items-center justify-center rounded-full',
                    dayInfo.isSelected && dayInfo.isToday && 'bg-ak-primary',
                    dayInfo.isSelected && !dayInfo.isToday && 'bg-ak-charcoal',
                    'ml-auto'
                  )}
                >
                  {dayInfo.day}
                </time>
                <span className="sr-only">{dayInfo.events.length} hendelser</span>
                {dayInfo.events.length > 0 && (
                  <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                    {dayInfo.events.slice(0, 3).map((event) => {
                      const colors = getSessionColor(event.type);
                      return (
                        <span key={event.id} className={classNames('mx-0.5 mb-1 h-1.5 w-1.5 rounded-full', colors.dot)} />
                      );
                    })}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Event List */}
      {selectedDayEvents.length > 0 && (
        <div className="relative px-4 py-10 sm:px-6 lg:hidden">
          <ol className="divide-y divide-border-default overflow-hidden rounded-ak-lg bg-white text-sm shadow-sm ring-1 ring-border-default">
            {selectedDayEvents.map((event) => {
              const colors = getSessionColor(event.type);
              return (
                <li
                  key={event.id}
                  className="group flex p-4 pr-6 focus-within:bg-ak-snow hover:bg-ak-snow"
                >
                  <div className="flex-auto">
                    <p className="font-semibold text-ak-charcoal">{event.name}</p>
                    <time dateTime={event.datetime} className="mt-2 flex items-center text-ak-steel">
                      <Clock className="mr-2 h-5 w-5 text-ak-mist" aria-hidden="true" />
                      {event.time}
                      {event.duration > 0 && <span className="ml-2">· {event.duration} min</span>}
                    </time>
                    {event.location && (
                      <p className="mt-1 text-ak-steel">📍 {event.location}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onSessionClick?.(event, selectedDate)}
                    className="ml-6 flex-none self-center rounded-ak-md bg-white px-3 py-2 font-semibold text-ak-charcoal opacity-0 shadow-sm ring-1 ring-border-default group-hover:opacity-100 hover:ring-ak-steel focus:opacity-100"
                  >
                    Vis<span className="sr-only">, {event.name}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
};

export default MonthView;
