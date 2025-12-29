import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { tokens } from '../../../design-tokens';

const MonthView = ({
  currentDate,
  sessions = {},
  onDateClick,
  onNavigate,
  selectedDate
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
  const prevMonthDays = Array.from({ length: startDay }, (_, i) => ({
    day: prevMonthLastDay - startDay + i + 1,
    isCurrentMonth: false,
    isPrevMonth: true
  }));

  // Current month days
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: true
  }));

  // Next month days to fill last week
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
  const nextMonthDays = Array.from({ length: totalCells - startDay - daysInMonth }, (_, i) => ({
    day: i + 1,
    isCurrentMonth: false,
    isNextMonth: true
  }));

  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  const today = new Date();
  const isToday = (day, isCurrentMonth) => {
    return isCurrentMonth &&
           day === today.getDate() &&
           month === today.getMonth() &&
           year === today.getFullYear();
  };

  const getSessionColor = (type) => {
    const colors = {
      teknikk: 'var(--ak-session-teknikk)',
      golfslag: 'var(--ak-session-golfslag)',
      spill: 'var(--ak-session-spill)',
      konkurranse: 'var(--ak-achievement-gold)',
      fysisk: 'var(--ak-achievement-gold-light)',
      mental: 'var(--ak-text-muted)',
    };
    return colors[type] || tokens.colors.steel;
  };

  return (
    <div className="bg-white rounded-xl border border-ak-mist overflow-hidden">
      {/* Month Header */}
      <div className="flex items-center justify-between p-4 border-b border-ak-mist">
        <button
          onClick={() => onNavigate?.(-1)}
          className="p-2 hover:bg-ak-snow rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-ak-charcoal">
          {monthNames[month]} {year}
        </h2>
        <button
          onClick={() => onNavigate?.(1)}
          className="p-2 hover:bg-ak-snow rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Week Day Headers */}
      <div className="grid grid-cols-7 border-b border-ak-mist">
        {weekDays.map(day => (
          <div key={day} className="p-2 text-center text-xs font-medium text-ak-steel">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="divide-y divide-ak-mist">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 divide-x divide-ak-mist">
            {week.map((dayInfo, dayIdx) => {
              const { day, isCurrentMonth } = dayInfo;
              const daySessions = isCurrentMonth ? (sessions[day] || []) : [];
              const isTodayDate = isToday(day, isCurrentMonth);
              const isSelected = isCurrentMonth && selectedDate?.getDate() === day;

              return (
                <div
                  key={dayIdx}
                  className={`min-h-[100px] p-2 cursor-pointer transition-colors ${
                    isCurrentMonth ? 'hover:bg-ak-snow/50' : 'bg-ak-snow/30'
                  } ${isSelected ? 'bg-ak-primary/5' : ''}`}
                  onClick={() => isCurrentMonth && onDateClick?.(new Date(year, month, day))}
                >
                  <div className={`text-sm mb-1 ${
                    !isCurrentMonth ? 'text-ak-mist' :
                    isTodayDate ? 'w-7 h-7 rounded-full bg-ak-primary text-white flex items-center justify-center font-semibold' :
                    isSelected ? 'text-ak-primary font-semibold' :
                    'text-ak-charcoal'
                  }`}>
                    {day}
                  </div>

                  {/* Session Indicators */}
                  <div className="space-y-1">
                    {daySessions.slice(0, 3).map((session, idx) => (
                      <div
                        key={session.id || idx}
                        className="text-xs px-1.5 py-0.5 rounded truncate"
                        style={{
                          backgroundColor: `${getSessionColor(session.type)}20`,
                          color: getSessionColor(session.type)
                        }}
                        title={`${session.time} - ${session.name}`}
                      >
                        {session.time} {session.name}
                      </div>
                    ))}
                    {daySessions.length > 3 && (
                      <div className="text-xs text-ak-steel">
                        +{daySessions.length - 3} mer
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
