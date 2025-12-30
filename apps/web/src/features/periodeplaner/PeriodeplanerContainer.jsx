import React, { useState } from 'react';
import {
  Calendar, Target, ChevronDown,
  Snowflake, Sun, Leaf, Flower2, CheckCircle, Clock, Play,
  Dumbbell, Brain
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';

// ============================================================================
// MOCK DATA - Will be replaced with API data
// ============================================================================

const MOCK_PERIODS = [
  {
    id: 'p1',
    name: 'Vintertrening',
    phase: 'off-season',
    startDate: '2025-01-01',
    endDate: '2025-03-15',
    status: 'active',
    progress: 65,
    focus: ['Fysisk grunnlag', 'Tekniske justeringer', 'Mental trening'],
    goals: [
      { id: 'g1', text: 'Oke rotasjonshastighet med 5%', completed: true },
      { id: 'g2', text: 'Forbedre hip-mobil mobilitet', completed: true },
      { id: 'g3', text: 'Gjennomfore 20 simulator-okter', completed: false, current: 14 },
      { id: 'g4', text: 'Lese 2 mentale treningsboker', completed: false, current: 1 },
    ],
    weeklyHours: { technical: 6, physical: 4, mental: 2 },
    keyActivities: ['Simulator-trening', 'Styrketrening', 'Video-analyse', 'Visualisering'],
    coach: 'Anders Kristiansen',
    notes: 'Fokus pa a bygge et sterkt fysisk fundament for sesongen. Spesielt viktig med hoftemobilitet.',
  },
  {
    id: 'p2',
    name: 'Varforberedelse',
    phase: 'pre-season',
    startDate: '2025-03-16',
    endDate: '2025-04-30',
    status: 'upcoming',
    progress: 0,
    focus: ['Banespill', 'Konkurranseforberedelse', 'Kortspill-finpuss'],
    goals: [
      { id: 'g5', text: 'Spille 10 treningsrunder', completed: false },
      { id: 'g6', text: 'Forbedre sand-save % til 50%', completed: false },
      { id: 'g7', text: 'Etablere pre-shot rutine', completed: false },
      { id: 'g8', text: 'Delta pa 2 treningsturneringer', completed: false },
    ],
    weeklyHours: { technical: 10, physical: 3, mental: 2 },
    keyActivities: ['Banespill', 'Short game', 'Treningsturneringer', 'Mentaltrening'],
    coach: 'Anders Kristiansen',
    notes: 'Gradvis overgang fra innendors til utendors. Prioriter kortspill og putting.',
  },
  {
    id: 'p3',
    name: 'Konkurransesesong',
    phase: 'competition',
    startDate: '2025-05-01',
    endDate: '2025-09-15',
    status: 'upcoming',
    progress: 0,
    focus: ['Turneringsprestasjoner', 'Score-fokus', 'Recovery'],
    goals: [
      { id: 'g9', text: 'Topp 10 i NM Junior', completed: false },
      { id: 'g10', text: 'Senke handicap til +2', completed: false },
      { id: 'g11', text: 'Vinne minst 2 klubbturneringer', completed: false },
      { id: 'g12', text: 'Gjennomsnittsscore under 74', completed: false },
    ],
    weeklyHours: { technical: 8, physical: 2, mental: 3 },
    keyActivities: ['Turneringer', 'Treningsrunder', 'Recovery', 'Turneringsanalyse'],
    coach: 'Anders Kristiansen',
    notes: 'Hovedfokus pa a prestere i turneringer. Balansere trening med recovery.',
  },
  {
    id: 'p4',
    name: 'Hostperiode',
    phase: 'transition',
    startDate: '2025-09-16',
    endDate: '2025-11-30',
    status: 'upcoming',
    progress: 0,
    focus: ['Sesongevaluering', 'Tekniske endringer', 'Planlegging'],
    goals: [
      { id: 'g13', text: 'Gjennomfore sesongevaluering med trener', completed: false },
      { id: 'g14', text: 'Identifisere 3 forbedringsomrader', completed: false },
      { id: 'g15', text: 'Sette mal for 2026', completed: false },
      { id: 'g16', text: 'Starte pa tekniske justeringer', completed: false },
    ],
    weeklyHours: { technical: 6, physical: 3, mental: 1 },
    keyActivities: ['Analyse', 'Teknikkarbeid', 'Planlegging', 'Lett trening'],
    coach: 'Anders Kristiansen',
    notes: 'Tid for refleksjon og planlegging. Start arbeid med eventuelle swing-endringer.',
  },
];

const CURRENT_WEEK_PLAN = {
  week: 3,
  periodId: 'p1',
  theme: 'Rotasjonskraft',
  sessions: [
    { day: 'Mandag', type: 'Styrke', duration: 60, focus: 'Bein og core', completed: true },
    { day: 'Tirsdag', type: 'Simulator', duration: 90, focus: 'Driver og lange jern', completed: true },
    { day: 'Onsdag', type: 'Hvile', duration: 0, focus: 'Aktiv restitusjon', completed: true },
    { day: 'Torsdag', type: 'Teknikk', duration: 120, focus: 'Video-analyse + drill', completed: false },
    { day: 'Fredag', type: 'Mental', duration: 45, focus: 'Visualisering', completed: false },
    { day: 'Lordag', type: 'Simulator', duration: 120, focus: '18 hull simulert runde', completed: false },
    { day: 'Sondag', type: 'Hvile', duration: 0, focus: 'Hvile', completed: false },
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatDateRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startStr = startDate.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  const endStr = endDate.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
  return `${startStr} - ${endStr}`;
};

const getPhaseConfig = (phase) => {
  switch (phase) {
    case 'off-season':
      return {
        label: 'Off-season',
        color: 'var(--accent)',
        icon: Snowflake,
        description: 'Grunnlagsperiode',
      };
    case 'pre-season':
      return {
        label: 'Forberedelse',
        color: 'var(--success)',
        icon: Flower2,
        description: 'Oppkjoring',
      };
    case 'competition':
      return {
        label: 'Konkurranse',
        color: 'var(--achievement)',
        icon: Sun,
        description: 'Turneringssesong',
      };
    case 'transition':
      return {
        label: 'Overgang',
        color: 'var(--warning)',
        icon: Leaf,
        description: 'Evaluering og planlegging',
      };
    default:
      return {
        label: phase,
        color: 'var(--text-secondary)',
        icon: Calendar,
        description: '',
      };
  }
};

const getStatusConfig = (status) => {
  switch (status) {
    case 'active':
      return { label: 'Aktiv', color: 'var(--success)', icon: Play };
    case 'upcoming':
      return { label: 'Kommende', color: 'var(--text-secondary)', icon: Clock };
    case 'completed':
      return { label: 'Fullfort', color: 'var(--accent)', icon: CheckCircle };
    default:
      return { label: status, color: 'var(--text-secondary)', icon: Clock };
  }
};

const getSessionTypeConfig = (type) => {
  switch (type) {
    case 'Styrke':
      return { color: 'var(--error)', icon: Dumbbell };
    case 'Simulator':
    case 'Teknikk':
      return { color: 'var(--accent)', icon: Target };
    case 'Mental':
      return { color: 'var(--achievement)', icon: Brain };
    case 'Hvile':
      return { color: 'var(--text-secondary)', icon: Clock };
    default:
      return { color: 'var(--text-secondary)', icon: Calendar };
  }
};

// ============================================================================
// PERIOD CARD COMPONENT
// ============================================================================

const PeriodCard = ({ period, isExpanded, onToggle }) => {
  const phaseConfig = getPhaseConfig(period.phase);
  const statusConfig = getStatusConfig(period.status);
  const PhaseIcon = phaseConfig.icon;
  const StatusIcon = statusConfig.icon;

  const completedGoals = period.goals.filter(g => g.completed).length;
  const totalGoals = period.goals.length;

  return (
    <div style={{
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      border: period.status === 'active' ? '2px solid var(--success)' : '2px solid transparent',
    }}>
      {/* Header */}
      <div
        onClick={onToggle}
        style={{
          padding: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: `${phaseConfig.color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <PhaseIcon size={24} color={phaseConfig.color} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
              }}>
                {period.name}
              </h3>
              <span style={{
                fontSize: '11px',
                fontWeight: 500,
                color: statusConfig.color,
                backgroundColor: `${statusConfig.color}15`,
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <StatusIcon size={10} />
                {statusConfig.label}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {formatDateRange(period.startDate, period.endDate)} - {phaseConfig.description}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {period.status === 'active' && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent)' }}>
                {period.progress}%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>fullfort</div>
            </div>
          )}
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}>
            <ChevronDown size={18} color={'var(--text-secondary)'} />
          </div>
        </div>
      </div>

      {/* Progress bar for active period */}
      {period.status === 'active' && (
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{
            height: '6px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${period.progress}%`,
              backgroundColor: 'var(--success)',
              borderRadius: '3px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{
          padding: '0 20px 20px',
          borderTop: '1px solid var(--border-default)',
        }}>
          {/* Focus Areas */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Fokusomrader
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {period.focus.map((item, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '12px',
                    color: phaseConfig.color,
                    backgroundColor: `${phaseConfig.color}10`,
                    padding: '6px 12px',
                    borderRadius: '8px',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div style={{ marginTop: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Mal for perioden
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {completedGoals}/{totalGoals} fullfort
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {period.goals.map((goal) => (
                <div
                  key={goal.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    backgroundColor: goal.completed ? 'rgba(var(--success-rgb), 0.08)' : 'var(--bg-secondary)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: goal.completed ? 'var(--success)' : 'var(--bg-primary)',
                    border: goal.completed ? 'none' : '2px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {goal.completed && <CheckCircle size={14} color={'var(--bg-primary)'} />}
                  </div>
                  <span style={{
                    fontSize: '13px',
                    color: goal.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                    textDecoration: goal.completed ? 'line-through' : 'none',
                    flex: 1,
                  }}>
                    {goal.text}
                  </span>
                  {goal.current !== undefined && !goal.completed && (
                    <span style={{
                      fontSize: '11px',
                      color: 'var(--accent)',
                      backgroundColor: 'rgba(var(--accent-rgb), 0.10)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}>
                      {goal.current} av mal
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Hours Distribution */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Ukentlig treningstid
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{
                flex: 1,
                backgroundColor: 'rgba(var(--accent-rgb), 0.10)',
                padding: '12px',
                borderRadius: '10px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent)' }}>
                  {period.weeklyHours.technical}t
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Teknisk</div>
              </div>
              <div style={{
                flex: 1,
                backgroundColor: 'rgba(var(--error-rgb), 0.10)',
                padding: '12px',
                borderRadius: '10px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--error)' }}>
                  {period.weeklyHours.physical}t
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Fysisk</div>
              </div>
              <div style={{
                flex: 1,
                backgroundColor: 'rgba(var(--achievement-rgb), 0.10)',
                padding: '12px',
                borderRadius: '10px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--achievement)' }}>
                  {period.weeklyHours.mental}t
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Mental</div>
              </div>
            </div>
          </div>

          {/* Coach Note */}
          {period.notes && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '10px',
              borderLeft: `3px solid ${phaseConfig.color}`,
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Trenernotat - {period.coach}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {period.notes}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// CURRENT WEEK COMPONENT
// ============================================================================

const CurrentWeekPlan = ({ weekPlan }) => {
  const completedSessions = weekPlan.sessions.filter(s => s.completed).length;
  const totalSessions = weekPlan.sessions.filter(s => s.type !== 'Hvile').length;

  return (
    <div style={{
      backgroundColor: 'var(--bg-primary)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
          }}>
            Denne uken (Uke {weekPlan.week})
          </h3>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Tema: {weekPlan.theme}
          </div>
        </div>
        <div style={{
          backgroundColor: 'rgba(var(--success-rgb), 0.10)',
          padding: '8px 12px',
          borderRadius: '8px',
        }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--success)' }}>
            {completedSessions}/{totalSessions} okter
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {weekPlan.sessions.map((session, idx) => {
          const config = getSessionTypeConfig(session.type);
          const Icon = config.icon;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: session.completed ? 'rgba(var(--success-rgb), 0.05)' : 'var(--bg-secondary)',
                borderRadius: '10px',
                opacity: session.type === 'Hvile' ? 0.6 : 1,
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: session.completed ? 'rgba(var(--success-rgb), 0.15)' : `${config.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {session.completed ? (
                  <CheckCircle size={18} color={'var(--success)'} />
                ) : (
                  <Icon size={18} color={config.color} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                }}>
                  {session.day}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {session.type} - {session.focus}
                </div>
              </div>
              {session.duration > 0 && (
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-primary)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}>
                  {session.duration} min
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const PeriodeplanerContainer = () => {
  const [expandedPeriod, setExpandedPeriod] = useState('p1');

  const activePeriod = MOCK_PERIODS.find(p => p.status === 'active');
  const totalWeeklyHours = activePeriod
    ? activePeriod.weeklyHours.technical + activePeriod.weeklyHours.physical + activePeriod.weeklyHours.mental
    : 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      <PageHeader
        title="Periodeplaner"
        subtitle="Sesongplanlegging og periodisering"
      />

      <div style={{ padding: '16px 24px 24px', maxWidth: '1536px', margin: '0 auto' }}>
        {/* Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)' }}>
              {activePeriod?.name.split(' ')[0] || '-'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Aktiv periode</div>
          </div>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)' }}>
              {activePeriod?.progress || 0}%
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Fullfort</div>
          </div>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--achievement)' }}>
              {totalWeeklyHours}t
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Timer/uke</div>
          </div>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {MOCK_PERIODS.length}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Perioder i ar</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
        }}>
          {/* Left: Period Cards */}
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: '0 0 16px 0',
            }}>
              Arsplan 2025
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {MOCK_PERIODS.map((period) => (
                <PeriodCard
                  key={period.id}
                  period={period}
                  isExpanded={expandedPeriod === period.id}
                  onToggle={() => setExpandedPeriod(expandedPeriod === period.id ? null : period.id)}
                />
              ))}
            </div>
          </div>

          {/* Right: Current Week */}
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: '0 0 16px 0',
            }}>
              Ukeoversikt
            </h2>
            <CurrentWeekPlan weekPlan={CURRENT_WEEK_PLAN} />

            {/* Period Timeline Visual */}
            <div style={{
              marginTop: '24px',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: '0 0 16px 0',
              }}>
                Arshjul
              </h3>
              <div style={{ display: 'flex', gap: '4px', height: '24px' }}>
                {MOCK_PERIODS.map((period) => {
                  const phaseConfig = getPhaseConfig(period.phase);
                  const startMonth = new Date(period.startDate).getMonth();
                  const endMonth = new Date(period.endDate).getMonth();
                  const width = ((endMonth - startMonth + 1) / 12) * 100;

                  return (
                    <div
                      key={period.id}
                      style={{
                        flex: `0 0 ${width}%`,
                        backgroundColor: period.status === 'active' ? phaseConfig.color : `${phaseConfig.color}40`,
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title={period.name}
                    >
                      {width > 15 && (
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          color: period.status === 'active' ? 'var(--bg-primary)' : phaseConfig.color,
                        }}>
                          {period.name.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '8px',
                fontSize: '10px',
                color: 'var(--text-secondary)',
              }}>
                <span>Jan</span>
                <span>Apr</span>
                <span>Jul</span>
                <span>Okt</span>
                <span>Des</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodeplanerContainer;
