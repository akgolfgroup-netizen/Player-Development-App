import React, { useState } from 'react';
import {
  Calendar, Clock, Target, CheckCircle, ChevronRight, ChevronLeft,
  Dumbbell, Brain, Flag, RotateCcw, Flame
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';

// ============================================================================
// MOCK DATA - Will be replaced with API data
// ============================================================================

const getWeekDates = (weekOffset = 0) => {
  const now = new Date();
  const currentDay = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (currentDay === 0 ? 6 : currentDay - 1) + (weekOffset * 7));

  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const WEEK_DATA = {
  weekNumber: 3,
  theme: 'Langt spill og styrke',
  period: 'Vintertrening',
  totalPlannedHours: 12,
  completedHours: 5.5,
  days: [
    {
      dayName: 'Mandag',
      date: '2025-01-13',
      isToday: false,
      isCompleted: true,
      sessions: [
        { type: 'physical', name: 'Styrketrening', duration: 60, status: 'completed' },
        { type: 'mental', name: 'Visualisering', duration: 20, status: 'completed' },
      ],
    },
    {
      dayName: 'Tirsdag',
      date: '2025-01-14',
      isToday: false,
      isCompleted: true,
      sessions: [
        { type: 'technical', name: 'Simulator - Driver', duration: 90, status: 'completed' },
        { type: 'short_game', name: 'Putting drill', duration: 30, status: 'completed' },
      ],
    },
    {
      dayName: 'Onsdag',
      date: '2025-01-15',
      isToday: false,
      isCompleted: true,
      sessions: [
        { type: 'rest', name: 'Hviledag', duration: 0, status: 'completed' },
      ],
    },
    {
      dayName: 'Torsdag',
      date: '2025-01-16',
      isToday: true,
      isCompleted: false,
      sessions: [
        { type: 'technical', name: 'Lange jern', duration: 120, status: 'in_progress' },
        { type: 'short_game', name: 'Chipping', duration: 40, status: 'pending' },
      ],
    },
    {
      dayName: 'Fredag',
      date: '2025-01-17',
      isToday: false,
      isCompleted: false,
      sessions: [
        { type: 'physical', name: 'Mobilitet', duration: 45, status: 'pending' },
        { type: 'mental', name: 'Mental forberedelse', duration: 30, status: 'pending' },
      ],
    },
    {
      dayName: 'Lordag',
      date: '2025-01-18',
      isToday: false,
      isCompleted: false,
      sessions: [
        { type: 'technical', name: 'Simulert runde', duration: 150, status: 'pending' },
      ],
    },
    {
      dayName: 'Sondag',
      date: '2025-01-19',
      isToday: false,
      isCompleted: false,
      sessions: [
        { type: 'rest', name: 'Hviledag', duration: 0, status: 'pending' },
      ],
    },
  ],
  weeklyGoals: [
    { text: 'Gjennomfore alle planlagte styrkeokter', progress: 50 },
    { text: 'Minimum 200 baller med driver', progress: 75 },
    { text: '2 timer putting-trening', progress: 30 },
  ],
  stats: {
    technicalHours: 6,
    physicalHours: 2,
    mentalHours: 1,
    shortGameHours: 1.5,
    restDays: 2,
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getSessionTypeConfig = (type) => {
  switch (type) {
    case 'technical':
      return { color: tokens.colors.primary, icon: Target, label: 'Teknikk' };
    case 'physical':
      return { color: tokens.colors.error, icon: Dumbbell, label: 'Fysisk' };
    case 'mental':
      return { color: tokens.colors.gold, icon: Brain, label: 'Mental' };
    case 'short_game':
      return { color: tokens.colors.success, icon: Flag, label: 'Kortspill' };
    case 'warmup':
      return { color: tokens.colors.warning, icon: Flame, label: 'Oppvarming' };
    case 'rest':
      return { color: tokens.colors.steel, icon: RotateCcw, label: 'Hvile' };
    default:
      return { color: tokens.colors.steel, icon: Calendar, label: type };
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
};

// ============================================================================
// DAY CARD COMPONENT
// ============================================================================

const DayCard = ({ day, onClick }) => {
  const totalDuration = day.sessions.reduce((acc, s) => acc + s.duration, 0);
  const isRest = day.sessions.length === 1 && day.sessions[0].type === 'rest';

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: tokens.colors.white,
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: day.isToday ? `2px solid ${tokens.colors.primary}` : '2px solid transparent',
        opacity: day.isCompleted ? 0.7 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
      }}>
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: day.isToday ? tokens.colors.primary : tokens.colors.charcoal,
          }}>
            {day.dayName}
          </div>
          <div style={{ fontSize: '12px', color: tokens.colors.steel }}>
            {formatDate(day.date)}
          </div>
        </div>
        {day.isToday && (
          <span style={{
            fontSize: '10px',
            fontWeight: 600,
            color: tokens.colors.white,
            backgroundColor: tokens.colors.primary,
            padding: '2px 8px',
            borderRadius: '4px',
          }}>
            I DAG
          </span>
        )}
        {day.isCompleted && (
          <CheckCircle size={20} color={tokens.colors.success} />
        )}
      </div>

      {/* Sessions */}
      {isRest ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          color: tokens.colors.steel,
          fontSize: '13px',
        }}>
          <RotateCcw size={16} style={{ marginRight: '8px' }} />
          Hviledag
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {day.sessions.map((session, idx) => {
            const config = getSessionTypeConfig(session.type);
            const Icon = config.icon;

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  backgroundColor: session.status === 'completed'
                    ? `${tokens.colors.success}08`
                    : session.status === 'in_progress'
                      ? `${tokens.colors.primary}08`
                      : tokens.colors.snow,
                  borderRadius: '8px',
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: `${config.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {session.status === 'completed' ? (
                    <CheckCircle size={14} color={tokens.colors.success} />
                  ) : (
                    <Icon size={14} color={config.color} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: session.status === 'completed' ? tokens.colors.steel : tokens.colors.charcoal,
                    textDecoration: session.status === 'completed' ? 'line-through' : 'none',
                  }}>
                    {session.name}
                  </div>
                </div>
                <span style={{
                  fontSize: '11px',
                  color: tokens.colors.steel,
                }}>
                  {session.duration} min
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {!isRest && (
        <div style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: `1px solid ${tokens.colors.mist}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} color={tokens.colors.steel} />
            <span style={{ fontSize: '12px', color: tokens.colors.steel }}>
              {Math.floor(totalDuration / 60)}t {totalDuration % 60}min
            </span>
          </div>
          <ChevronRight size={16} color={tokens.colors.steel} />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// STATS CARD COMPONENT
// ============================================================================

const StatsOverview = ({ stats, totalPlanned, completed }) => {
  const progressPercent = Math.round((completed / totalPlanned) * 100);

  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <h3 style={{
        fontSize: '14px',
        fontWeight: 600,
        color: tokens.colors.charcoal,
        margin: '0 0 16px 0',
      }}>
        Ukeoversikt
      </h3>

      {/* Progress */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '13px', color: tokens.colors.steel }}>Fremgang</span>
          <span style={{ fontSize: '16px', fontWeight: 700, color: tokens.colors.primary }}>
            {progressPercent}%
          </span>
        </div>
        <div style={{
          height: '8px',
          backgroundColor: tokens.colors.snow,
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: tokens.colors.primary,
            borderRadius: '4px',
          }} />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '6px',
          fontSize: '11px',
          color: tokens.colors.steel,
        }}>
          <span>{completed}t fullfort</span>
          <span>{totalPlanned}t planlagt</span>
        </div>
      </div>

      {/* Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        <div style={{
          padding: '12px',
          backgroundColor: `${tokens.colors.primary}08`,
          borderRadius: '10px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: tokens.colors.primary }}>
            {stats.technicalHours}t
          </div>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Teknikk</div>
        </div>
        <div style={{
          padding: '12px',
          backgroundColor: `${tokens.colors.error}08`,
          borderRadius: '10px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: tokens.colors.error }}>
            {stats.physicalHours}t
          </div>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Fysisk</div>
        </div>
        <div style={{
          padding: '12px',
          backgroundColor: `${tokens.colors.gold}08`,
          borderRadius: '10px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: tokens.colors.gold }}>
            {stats.mentalHours}t
          </div>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Mental</div>
        </div>
        <div style={{
          padding: '12px',
          backgroundColor: `${tokens.colors.success}08`,
          borderRadius: '10px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: tokens.colors.success }}>
            {stats.shortGameHours}t
          </div>
          <div style={{ fontSize: '11px', color: tokens.colors.steel }}>Kortspill</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// WEEKLY GOALS COMPONENT
// ============================================================================

const WeeklyGoals = ({ goals }) => {
  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
      }}>
        <Target size={16} color={tokens.colors.gold} />
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: tokens.colors.charcoal,
          margin: 0,
        }}>
          Ukens mal
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {goals.map((goal, idx) => (
          <div key={idx}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}>
              <span style={{ fontSize: '13px', color: tokens.colors.charcoal }}>
                {goal.text}
              </span>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: goal.progress >= 100 ? tokens.colors.success : tokens.colors.primary,
              }}>
                {goal.progress}%
              </span>
            </div>
            <div style={{
              height: '6px',
              backgroundColor: tokens.colors.snow,
              borderRadius: '3px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(goal.progress, 100)}%`,
                backgroundColor: goal.progress >= 100 ? tokens.colors.success : tokens.colors.primary,
                borderRadius: '3px',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const UkensTreningsplanContainer = () => {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekDates = getWeekDates(weekOffset);
  const startDate = weekDates[0].toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  const endDate = weekDates[6].toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Ukens treningsplan"
        subtitle={`Uke ${WEEK_DATA.weekNumber} - ${WEEK_DATA.theme}`}
      />

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Week Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: tokens.colors.white,
              color: tokens.colors.charcoal,
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <ChevronLeft size={16} />
            Forrige uke
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '16px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
            }}>
              Uke {WEEK_DATA.weekNumber}
            </div>
            <div style={{ fontSize: '13px', color: tokens.colors.steel }}>
              {startDate} - {endDate}
            </div>
          </div>

          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: tokens.colors.white,
              color: tokens.colors.charcoal,
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            Neste uke
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Period Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: `${tokens.colors.primary}10`,
          borderRadius: '8px',
          marginBottom: '20px',
        }}>
          <Calendar size={14} color={tokens.colors.primary} />
          <span style={{ fontSize: '12px', fontWeight: 500, color: tokens.colors.primary }}>
            {WEEK_DATA.period}
          </span>
        </div>

        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: '24px',
        }}>
          {/* Days Grid */}
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '12px',
            }}>
              {WEEK_DATA.days.map((day, idx) => (
                <DayCard
                  key={idx}
                  day={day}
                  onClick={() => {/* View day details */}}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <StatsOverview
              stats={WEEK_DATA.stats}
              totalPlanned={WEEK_DATA.totalPlannedHours}
              completed={WEEK_DATA.completedHours}
            />
            <WeeklyGoals goals={WEEK_DATA.weeklyGoals} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UkensTreningsplanContainer;
