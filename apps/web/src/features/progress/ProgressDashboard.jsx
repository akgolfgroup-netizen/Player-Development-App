/**
 * AK Golf Academy - Progress Dashboard
 * Design System v3.0 - Premium Light
 *
 * Progress tracking dashboard with weekly trends.
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 */

import React from 'react';
import StateCard from '../../ui/composites/StateCard';
import { SubSectionTitle } from '../../components/typography';

export default function ProgressDashboard({ data }) {
  if (!data) return <StateCard variant="loading" title="Laster fremgangsdata..." />;

  const { overview, weeklyTrend, periodBreakdown, upcomingSessions } = data;

  return (
    <div className="flex flex-col gap-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
        <StatCard
          title="Gjennomføringsgrad"
          value={`${overview.completionRate}%`}
          icon="📊"
          color="primary"
        />
        <StatCard
          title="Daglig streak"
          value={`${overview.currentStreak} dager`}
          icon="🔥"
          color="warning"
        />
        <StatCard
          title="Økter fullført"
          value={`${overview.totalSessionsCompleted}/${overview.totalSessionsPlanned}`}
          icon="✅"
          color="success"
        />
        <StatCard
          title="Totalt timer"
          value={`${overview.totalHoursCompleted}t`}
          icon="⏱️"
          color="gold"
        />
      </div>

      {/* Weekly Trend Chart */}
      <div className="bg-ak-surface-base rounded-xl shadow-sm p-6">
        <SubSectionTitle className="mb-4">
          12-ukers trend
        </SubSectionTitle>
        <div className="flex flex-col gap-2">
          {weeklyTrend.map((week, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[13px] text-ak-text-secondary w-[60px] flex-shrink-0">
                Uke {12 - i}
              </span>
              <div className="flex-1 bg-ak-border-default rounded-full h-7 relative overflow-hidden">
                <div
                  className="bg-ak-status-success h-full rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                  style={{ width: `${week.completionRate}%` }}
                >
                  {week.completionRate > 15 && (
                    <span className="text-white text-xs font-semibold">
                      {Math.round(week.completionRate)}%
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[13px] text-ak-text-primary w-10 text-right flex-shrink-0">
                {week.totalHours}t
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Period Breakdown */}
      <div className="bg-ak-surface-base rounded-xl shadow-sm p-6">
        <SubSectionTitle className="mb-4">
          Periodeoversikt
        </SubSectionTitle>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
          {Object.entries(periodBreakdown).map(([period, stats]) => (
            <div key={period} className="text-center p-4 bg-ak-surface-subtle rounded-xl">
              <div className="text-sm font-semibold text-ak-text-primary">
                {getPeriodName(period)}
              </div>
              <div className="text-[32px] font-bold text-ak-status-success mt-2">
                {Math.round(stats.completionRate)}%
              </div>
              <div className="text-[13px] text-ak-text-secondary mt-1">
                {stats.completed}/{stats.planned} økter
              </div>
              <div className="text-xs text-ak-text-secondary">
                {stats.totalHours} timer
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-ak-surface-base rounded-xl shadow-sm p-6">
        <SubSectionTitle className="mb-4">
          Neste 7 dager
        </SubSectionTitle>
        <div className="flex flex-col gap-2">
          {upcomingSessions.map((session, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-ak-brand-primary/5 rounded-xl"
            >
              <div>
                <div className="font-medium text-ak-text-primary">
                  {session.type}
                </div>
                <div className="text-[13px] text-ak-text-secondary">
                  {new Date(session.date).toLocaleDateString('nb-NO', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-ak-brand-primary">
                  {session.duration} min
                </div>
                <div className="text-xs text-ak-text-secondary">
                  {getPeriodName(session.period)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorConfig = {
    primary: { bg: 'bg-ak-brand-primary/10', text: 'text-ak-brand-primary' },
    success: { bg: 'bg-ak-status-success/15', text: 'text-ak-status-success' },
    warning: { bg: 'bg-ak-status-warning/15', text: 'text-ak-status-warning' },
    gold: { bg: 'bg-amber-500/15', text: 'text-amber-600' },
  };

  const colorStyle = colorConfig[color] || colorConfig.primary;

  return (
    <div className="bg-ak-surface-base rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[28px]">{icon}</span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ak-text-secondary">
          {title}
        </span>
      </div>
      <div className={`text-[32px] font-bold ${colorStyle.text}`}>
        {value}
      </div>
    </div>
  );
}

function getPeriodName(period) {
  const names = { E: 'Evaluering', G: 'Grunnperiode', S: 'Spesialisering', T: 'Turnering' };
  return names[period] || period;
}
