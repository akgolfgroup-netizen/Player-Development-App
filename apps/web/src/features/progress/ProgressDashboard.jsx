import React from 'react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';

// Design tokens
const colors = {
  primary: tokens.colors.primary,
  primaryLight: tokens.colors.primaryLight,
  success: tokens.colors.success,
  warning: tokens.colors.warning,
  error: tokens.colors.error,
  white: tokens.colors.white,
  snow: tokens.colors.snow,
  charcoal: tokens.colors.charcoal,
  steel: tokens.colors.steel,
  mist: tokens.colors.mist,
  gold: tokens.colors.gold,
};

export default function ProgressDashboard({ data }) {
  if (!data) return <div style={{ padding: tokens.spacing[8], color: colors.steel }}>Laster data...</div>;

  const { overview, weeklyTrend, periodBreakdown, upcomingSessions } = data;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.snow }}>
      <PageHeader
        title="Min Fremgang"
        subtitle="Oversikt over treningsfremgang"
      />

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: tokens.spacing[6] }}>
        {/* Overview Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: tokens.spacing[4]
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
          borderRadius: tokens.radius.lg,
          boxShadow: tokens.shadows.card,
          padding: tokens.spacing[6]
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: colors.charcoal,
            margin: 0,
            marginBottom: tokens.spacing[4]
          }}>
            12-ukers trend
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
            {weeklyTrend.map((week, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: tokens.spacing[3]
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
                  borderRadius: tokens.radius.full,
                  height: '28px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div
                    style={{
                      backgroundColor: colors.success,
                      height: '100%',
                      borderRadius: tokens.radius.full,
                      transition: 'width 0.3s ease',
                      width: `${week.completionRate}%`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: tokens.spacing[2]
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
          borderRadius: tokens.radius.lg,
          boxShadow: tokens.shadows.card,
          padding: tokens.spacing[6]
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: colors.charcoal,
            margin: 0,
            marginBottom: tokens.spacing[4]
          }}>
            Periodeoversikt
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: tokens.spacing[4]
          }}>
            {Object.entries(periodBreakdown).map(([period, stats]) => (
              <div key={period} style={{
                textAlign: 'center',
                padding: tokens.spacing[4],
                backgroundColor: colors.snow,
                borderRadius: tokens.radius.lg
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
                  marginTop: tokens.spacing[2]
                }}>
                  {Math.round(stats.completionRate)}%
                </div>
                <div style={{
                  fontSize: '13px',
                  color: colors.steel,
                  marginTop: tokens.spacing[1]
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
          borderRadius: tokens.radius.lg,
          boxShadow: tokens.shadows.card,
          padding: tokens.spacing[6]
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: colors.charcoal,
            margin: 0,
            marginBottom: tokens.spacing[4]
          }}>
            Neste 7 dager
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
            {upcomingSessions.map((session, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: tokens.spacing[3],
                  backgroundColor: `${colors.primary}08`,
                  borderRadius: tokens.radius.lg
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
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing[4],
      boxShadow: tokens.shadows.card
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: tokens.spacing[2]
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
