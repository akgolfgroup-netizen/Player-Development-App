import React from 'react';
// UiCanon: Using CSS variables
import StateCard from '../../ui/composites/StateCard';
import { SubSectionTitle } from '../../components/typography';

// Design tokens
const colors = {
  primary: 'var(--accent)',
  primaryLight: 'rgba(var(--accent-rgb), 0.1)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
  white: 'var(--bg-primary)',
  snow: 'var(--bg-secondary)',
  charcoal: 'var(--text-primary)',
  steel: 'var(--text-secondary)',
  mist: 'var(--border-default)',
  gold: 'var(--achievement)',
};

export default function ProgressDashboard({ data }) {
  if (!data) return <StateCard variant="loading" title="Laster fremgangsdata..." />;

  const { overview, weeklyTrend, periodBreakdown, upcomingSessions } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
        {/* Overview Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 'var(--spacing-4)'
        }}>
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
        <div style={{
          backgroundColor: colors.white,
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          padding: 'var(--spacing-6)'
        }}>
          <SubSectionTitle style={{ marginBottom: 'var(--spacing-4)' }}>
            12-ukers trend
          </SubSectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {weeklyTrend.map((week, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-3)'
              }}>
                <span style={{
                  fontSize: '13px',
                  color: colors.steel,
                  width: '60px',
                  flexShrink: 0
                }}>
                  Uke {12 - i}
                </span>
                <div style={{
                  flex: 1,
                  backgroundColor: colors.mist,
                  borderRadius: '9999px',
                  height: '28px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div
                    style={{
                      backgroundColor: colors.success,
                      height: '100%',
                      borderRadius: '9999px',
                      transition: 'width 0.3s ease',
                      width: `${week.completionRate}%`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: 'var(--spacing-2)'
                    }}
                  >
                    {week.completionRate > 15 && (
                      <span style={{
                        color: colors.white,
                        fontSize: '12px',
                        fontWeight: 600
                      }}>
                        {Math.round(week.completionRate)}%
                      </span>
                    )}
                  </div>
                </div>
                <span style={{
                  fontSize: '13px',
                  color: colors.charcoal,
                  width: '40px',
                  textAlign: 'right',
                  flexShrink: 0
                }}>
                  {week.totalHours}t
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Period Breakdown */}
        <div style={{
          backgroundColor: colors.white,
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          padding: 'var(--spacing-6)'
        }}>
          <SubSectionTitle style={{ marginBottom: 'var(--spacing-4)' }}>
            Periodeoversikt
          </SubSectionTitle>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 'var(--spacing-4)'
          }}>
            {Object.entries(periodBreakdown).map(([period, stats]) => (
              <div key={period} style={{
                textAlign: 'center',
                padding: 'var(--spacing-4)',
                backgroundColor: colors.snow,
                borderRadius: 'var(--radius-lg)'
              }}>
                <div style={{
                  fontSize: 'var(--font-size-body)',
                  fontWeight: 600,
                  color: colors.charcoal
                }}>
                  {getPeriodName(period)}
                </div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: colors.success,
                  marginTop: 'var(--spacing-2)'
                }}>
                  {Math.round(stats.completionRate)}%
                </div>
                <div style={{
                  fontSize: '13px',
                  color: colors.steel,
                  marginTop: 'var(--spacing-1)'
                }}>
                  {stats.completed}/{stats.planned} økter
                </div>
                <div style={{
                  fontSize: '12px',
                  color: colors.steel
                }}>
                  {stats.totalHours} timer
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div style={{
          backgroundColor: colors.white,
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          padding: 'var(--spacing-6)'
        }}>
          <SubSectionTitle style={{ marginBottom: 'var(--spacing-4)' }}>
            Neste 7 dager
          </SubSectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {upcomingSessions.map((session, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--spacing-3)',
                  backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 500, color: colors.charcoal }}>
                    {session.type}
                  </div>
                  <div style={{ fontSize: '13px', color: colors.steel }}>
                    {new Date(session.date).toLocaleDateString('nb-NO', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: colors.primary }}>
                    {session.duration} min
                  </div>
                  <div style={{ fontSize: '12px', color: colors.steel }}>
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
  // UiCanon: Using rgba with CSS variable RGB values for proper opacity support
  const colorMap = {
    primary: { bg: 'rgba(var(--accent-rgb), 0.1)', text: colors.primary },
    success: { bg: 'rgba(var(--success-rgb), 0.15)', text: colors.success },
    warning: { bg: 'rgba(var(--warning-rgb), 0.15)', text: colors.warning },
    gold: { bg: 'rgba(var(--achievement-rgb), 0.15)', text: colors.gold },
  };

  const colorStyle = colorMap[color] || colorMap.primary;

  return (
    <div style={{
      backgroundColor: colors.white,
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-4)',
      boxShadow: 'var(--shadow-card)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--spacing-2)'
      }}>
        <span style={{ fontSize: '28px' }}>{icon}</span>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: colors.steel
        }}>
          {title}
        </span>
      </div>
      <div style={{
        fontSize: '32px',
        fontWeight: 700,
        color: colorStyle.text
      }}>
        {value}
      </div>
    </div>
  );
}

function getPeriodName(period) {
  const names = { E: 'Basis', G: 'Generell', S: 'Spesifikk', T: 'Turnering' };
  return names[period] || period;
}
