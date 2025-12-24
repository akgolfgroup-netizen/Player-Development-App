import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const YearView = ({
  currentYear,
  sessionsByMonth = {},
  onMonthClick,
  onNavigate,
  periods = []
}) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
  const weekDays = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYearToday = today.getFullYear();

  const getPeriodColor = (month) => {
    const period = periods.find(p => p.months?.includes(month));
    if (period) {
      const periodColors = {
        evaluering: '#8E8E93',
        grunnlag: '#2C5F7F',
        spesialisering: '#4A7C59',
        turnering: '#C9A227',
      };
      return periodColors[period.type] || null;
    }
    return null;
  };

  const renderMiniMonth = (monthIndex) => {
    const firstDay = new Date(currentYear, monthIndex, 1);
    const lastDay = new Date(currentYear, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();

    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days = [];
    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-4 h-4" />);
    }
    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = currentYear === currentYearToday &&
                      monthIndex === currentMonth &&
                      d === today.getDate();
      const hasSessions = sessionsByMonth[monthIndex]?.[d]?.length > 0;

      days.push(
        <div
          key={d}
          className={`w-4 h-4 flex items-center justify-center text-[9px] rounded-sm ${
            isToday ? 'bg-ak-primary text-white font-bold' :
            hasSessions ? 'bg-ak-primary/20 text-ak-primary' :
            'text-ak-charcoal'
          }`}
        >
          {d}
        </div>
      );
    }

    const periodColor = getPeriodColor(monthIndex);
    const isCurrentMonth = currentYear === currentYearToday && monthIndex === currentMonth;
    const monthSessions = Object.values(sessionsByMonth[monthIndex] || {}).flat();
    const totalSessions = monthSessions.length;
    const completedSessions = monthSessions.filter(s => s.status === 'completed').length;

    return (
      <div
        key={monthIndex}
        className={`p-3 rounded-xl cursor-pointer transition-all hover:shadow-md ${
          isCurrentMonth ? 'ring-2 ring-ak-primary' : 'border border-ak-mist'
        }`}
        style={{
          backgroundColor: periodColor ? `${periodColor}08` : 'white'
        }}
        onClick={() => onMonthClick?.(monthIndex)}
      >
        {/* Month Header */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-semibold ${
            isCurrentMonth ? 'text-ak-primary' : 'text-ak-charcoal'
          }`}>
            {monthNames[monthIndex]}
          </span>
          {totalSessions > 0 && (
            <span className="text-[10px] text-ak-steel">
              {completedSessions}/{totalSessions}
            </span>
          )}
        </div>

        {/* Period Indicator */}
        {periodColor && (
          <div
            className="h-1 rounded-full mb-2"
            style={{ backgroundColor: periodColor }}
          />
        )}

        {/* Mini Week Header */}
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {weekDays.map((day, i) => (
            <div key={i} className="w-4 h-3 flex items-center justify-center text-[8px] text-ak-steel">
              {day}
            </div>
          ))}
        </div>

        {/* Mini Calendar Grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-ak-mist overflow-hidden">
      {/* Year Header */}
      <div className="flex items-center justify-between p-4 border-b border-ak-mist">
        <button
          onClick={() => onNavigate?.(-1)}
          className="p-2 hover:bg-ak-snow rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-ak-charcoal">{currentYear}</h2>
        <button
          onClick={() => onNavigate?.(1)}
          className="p-2 hover:bg-ak-snow rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Period Legend */}
      {periods.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-2 border-b border-ak-mist bg-ak-snow/50">
          <span className="text-xs text-ak-steel">Perioder:</span>
          {[
            { type: 'evaluering', label: 'Evaluering', color: '#8E8E93' },
            { type: 'grunnlag', label: 'Grunnlag', color: '#2C5F7F' },
            { type: 'spesialisering', label: 'Spesialisering', color: '#4A7C59' },
            { type: 'turnering', label: 'Turnering', color: '#C9A227' },
          ].map(p => (
            <div key={p.type} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: p.color }} />
              <span className="text-xs text-ak-charcoal">{p.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Months Grid */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }, (_, i) => renderMiniMonth(i))}
      </div>

      {/* Year Stats */}
      <div className="border-t border-ak-mist p-4 bg-ak-snow/30">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-ak-primary">
              {Object.values(sessionsByMonth).reduce((acc, month) =>
                acc + Object.values(month).flat().length, 0
              )}
            </div>
            <div className="text-xs text-ak-steel">Totalt økter</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-ak-success">
              {Object.values(sessionsByMonth).reduce((acc, month) =>
                acc + Object.values(month).flat().filter(s => s.status === 'completed').length, 0
              )}
            </div>
            <div className="text-xs text-ak-steel">Fullført</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-ak-gold">
              {Object.values(sessionsByMonth).reduce((acc, month) =>
                acc + Object.values(month).flat().reduce((sum, s) => sum + (s.duration || 0), 0), 0
              ) / 60}t
            </div>
            <div className="text-xs text-ak-steel">Timer trent</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-ak-charcoal">
              {periods.length || 4}
            </div>
            <div className="text-xs text-ak-steel">Perioder</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearView;
