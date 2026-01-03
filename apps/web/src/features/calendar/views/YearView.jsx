/**
 * YearView Component
 * Design System v3.0 - Premium Light
 *
 * MIGRATED TO PAGE ARCHITECTURE - Minimal inline styles (dynamic colors)
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionTitle } from '../../../components/typography';

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

  // Period colors using semantic tokens
  const getPeriodColor = (month) => {
    const period = periods.find(p => p.months?.includes(month));
    if (period) {
      const periodColors = {
        evaluering: 'var(--ak-text-tertiary)',
        grunnlag: 'var(--ak-session-teknikk)',
        spesialisering: 'var(--ak-session-golfslag)',
        turnering: 'var(--ak-status-warning)',
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
            isToday ? 'bg-ak-brand-primary text-white font-bold' :
            hasSessions ? 'bg-ak-brand-primary/20 text-ak-brand-primary' :
            'text-ak-text-primary'
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
          isCurrentMonth ? 'ring-2 ring-ak-brand-primary' : 'border border-ak-border-subtle'
        }`}
        style={{
          backgroundColor: periodColor ? `${periodColor}08` : 'var(--ak-surface-card)'
        }}
        onClick={() => onMonthClick?.(monthIndex)}
      >
        {/* Month Header */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-semibold ${
            isCurrentMonth ? 'text-ak-brand-primary' : 'text-ak-text-primary'
          }`}>
            {monthNames[monthIndex]}
          </span>
          {totalSessions > 0 && (
            <span className="text-[10px] text-ak-text-secondary">
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
            <div key={i} className="w-4 h-3 flex items-center justify-center text-[8px] text-ak-text-tertiary">
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
    <div className="bg-ak-surface-card rounded-xl border border-ak-border-subtle overflow-hidden">
      {/* Year Header */}
      <div className="flex items-center justify-between p-4 border-b border-ak-border-subtle">
        <button
          onClick={() => onNavigate?.(-1)}
          className="p-2 hover:bg-ak-surface-subtle rounded-lg transition-colors"
        >
          <ChevronLeft size={20} className="text-ak-text-secondary" />
        </button>
        <SectionTitle className="text-xl font-bold text-ak-text-primary">{currentYear}</SectionTitle>
        <button
          onClick={() => onNavigate?.(1)}
          className="p-2 hover:bg-ak-surface-subtle rounded-lg transition-colors"
        >
          <ChevronRight size={20} className="text-ak-text-secondary" />
        </button>
      </div>

      {/* Period Legend */}
      {periods.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-2 border-b border-ak-border-subtle bg-ak-surface-subtle/50">
          <span className="text-xs text-ak-text-secondary">Perioder:</span>
          {[
            { type: 'evaluering', label: 'Evaluering', color: 'var(--ak-text-tertiary)' },
            { type: 'grunnlag', label: 'Grunnlag', color: 'var(--ak-session-teknikk)' },
            { type: 'spesialisering', label: 'Spesialisering', color: 'var(--ak-session-golfslag)' },
            { type: 'turnering', label: 'Turnering', color: 'var(--ak-status-warning)' },
          ].map(p => (
            <div key={p.type} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: p.color }} />
              <span className="text-xs text-ak-text-primary">{p.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Months Grid */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }, (_, i) => renderMiniMonth(i))}
      </div>

      {/* Year Stats */}
      <div className="border-t border-ak-border-subtle p-4 bg-ak-surface-subtle/30">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-ak-brand-primary">
              {Object.values(sessionsByMonth).reduce((acc, month) =>
                acc + Object.values(month).flat().length, 0
              )}
            </div>
            <div className="text-xs text-ak-text-secondary">Totalt økter</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-ak-status-success">
              {Object.values(sessionsByMonth).reduce((acc, month) =>
                acc + Object.values(month).flat().filter(s => s.status === 'completed').length, 0
              )}
            </div>
            <div className="text-xs text-ak-text-secondary">Fullført</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-ak-status-warning">
              {Object.values(sessionsByMonth).reduce((acc, month) =>
                acc + Object.values(month).flat().reduce((sum, s) => sum + (s.duration || 0), 0), 0
              ) / 60}t
            </div>
            <div className="text-xs text-ak-text-secondary">Timer trent</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-ak-text-primary">
              {periods.length || 4}
            </div>
            <div className="text-xs text-ak-text-secondary">Perioder</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearView;
