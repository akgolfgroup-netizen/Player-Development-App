import React from 'react';
// UiCanon: Using CSS variables
import { PageHeader } from '../../components/layout/PageHeader';
import StateCard from '../../ui/composites/StateCard';

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
    <div style={{ minHeight: '100vh', backgroundColor: colors.snow }}>
      <PageHeader
        title="Min Fremgang"
        subtitle="Oversikt over treningsfremgang"
      />

      <div style={{ padding: '24px', maxWidth: '1536px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Overview Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px'
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
          padding: '24px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: colors.charcoal,
            margin: 0,
            marginBottom: '16px'
          }}>
            12-ukers trend
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {weeklyTrend.map((week, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
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
                      paddingRight: '8px'
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
          padding: '24px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: colors.charcoal,
            margin: 0,
            marginBottom: '16px'
          }}>
            Periodeoversikt
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px'
          }}>
            {Object.entries(periodBreakdown).map(([period, stats]) => (
              <div key={period} style={{
                textAlign: 'center',
                padding: '16px',
                backgroundColor: colors.snow,
                borderRadius: 'var(--radius-lg)'
              }}>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: colors.charcoal
                }}>
                  {getPeriodName(period)}
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: colors.success,
                  marginTop: '8px'
                }}>
                  {Math.round(stats.completionRate)}%
                </div>
                <div style={{
                  fontSize: '13px',
                  color: colors.steel,
                  marginTop: '4px'
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
          padding: '24px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: colors.charcoal,
            margin: 0,
            marginBottom: '16px'
          }}>
            Neste 7 dager
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {upcomingSessions.map((session, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: `${colors.primary}08`,
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
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorMap = {
    primary: { bg: `${colors.primary}10`, text: colors.primary },
    success: { bg: `${colors.success}15`, text: colors.success },
    warning: { bg: `${colors.warning}15`, text: colors.warning },
    gold: { bg: `${colors.gold}15`, text: colors.gold },
  };

  const colorStyle = colorMap[color] || colorMap.primary;

  return (
    <div style={{
      backgroundColor: colors.white,
      borderRadius: 'var(--radius-lg)',
      padding: '16px',
      boxShadow: 'var(--shadow-card)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px'
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
        fontSize: '24px',
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
