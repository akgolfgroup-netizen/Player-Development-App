import React, { useState } from 'react';
import {
  Calendar, Clock, Target, CheckCircle, Play,
  ChevronRight, RotateCcw, Flame, Dumbbell, Brain, Flag,
  Video, MessageCircle, Plus, Award
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { PageHeader } from '../../components/layout/PageHeader';

// ============================================================================
// MOCK DATA - Will be replaced with API data
// ============================================================================

const TODAY_PLAN = {
  date: new Date().toISOString().split('T')[0],
  dayName: new Date().toLocaleDateString('nb-NO', { weekday: 'long' }),
  theme: 'Langt spill fokus',
  totalDuration: 150,
  completedDuration: 60,
  sessions: [
    {
      id: 's1',
      type: 'warmup',
      name: 'Oppvarming',
      duration: 15,
      status: 'completed',
      description: 'Dynamisk stretching og lett sving',
      exercises: [
        { name: 'Arm-sirkler', reps: '10 hver vei', completed: true },
        { name: 'Hofte-rotasjon', reps: '10 hver vei', completed: true },
        { name: 'Torso-twist', reps: '20 totalt', completed: true },
        { name: 'Lette svinger', reps: '20 svinger', completed: true },
      ],
    },
    {
      id: 's2',
      type: 'technical',
      name: 'Driver-trening',
      duration: 45,
      status: 'completed',
      description: 'Fokus pa konsistent kontakt og ballbane',
      exercises: [
        { name: 'Alignment-drill', reps: '10 baller', completed: true, notes: 'Fokus pa skulder-linje' },
        { name: 'Tempo-drill (1-2-3)', reps: '20 baller', completed: true },
        { name: 'Full sving med mal', reps: '30 baller', completed: true },
      ],
      trackmanData: {
        avgClubSpeed: '108 mph',
        avgBallSpeed: '158 mph',
        avgCarry: '265 yds',
        avgSmash: '1.46',
      },
    },
    {
      id: 's3',
      type: 'technical',
      name: 'Lange jern (4-6)',
      duration: 40,
      status: 'in_progress',
      description: 'Presisjon og avstandskontroll',
      exercises: [
        { name: 'Alignment check', reps: '5 baller', completed: true },
        { name: '6-jern til mal 175y', reps: '20 baller', completed: false },
        { name: '5-jern til mal 190y', reps: '15 baller', completed: false },
        { name: '4-jern til mal 205y', reps: '15 baller', completed: false },
      ],
      targetZones: [
        { club: '6-jern', distance: '175y', tolerance: '±8y' },
        { club: '5-jern', distance: '190y', tolerance: '±10y' },
        { club: '4-jern', distance: '205y', tolerance: '±12y' },
      ],
    },
    {
      id: 's4',
      type: 'short_game',
      name: 'Kortspill',
      duration: 35,
      status: 'pending',
      description: 'Chipping og pitching',
      exercises: [
        { name: 'Chip fra tight lie', reps: '15 baller', completed: false },
        { name: 'Pitch 30-50 yard', reps: '20 baller', completed: false },
        { name: 'Up-and-down challenge', reps: '10 forsok', completed: false },
      ],
    },
    {
      id: 's5',
      type: 'cooldown',
      name: 'Avslutning',
      duration: 15,
      status: 'pending',
      description: 'Putting og stretching',
      exercises: [
        { name: 'Gate-putting drill', reps: '20 putter', completed: false },
        { name: 'Avstandskontroll 20-40 fot', reps: '10 putter', completed: false },
        { name: 'Stretching', reps: '5 min', completed: false },
      ],
    },
  ],
  coachNote: 'Husk a fokusere pa tempo i dag. Vi justerte litt pa grip forrige okt - vær bevisst pa dette gjennom hele treningen.',
  goals: [
    'Oppna minimum 65% fairway-treff med driver',
    'Gjennomsnittlig avvik fra mal under 10y med lange jern',
    'Minimum 5/10 up-and-downs',
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getSessionTypeConfig = (type) => {
  switch (type) {
    case 'warmup':
      return { color: tokens.colors.warning, icon: Flame, label: 'Oppvarming' };
    case 'technical':
      return { color: tokens.colors.primary, icon: Target, label: 'Teknikk' };
    case 'short_game':
      return { color: tokens.colors.success, icon: Flag, label: 'Kortspill' };
    case 'physical':
      return { color: tokens.colors.error, icon: Dumbbell, label: 'Fysisk' };
    case 'mental':
      return { color: tokens.colors.gold, icon: Brain, label: 'Mental' };
    case 'cooldown':
      return { color: tokens.colors.steel, icon: RotateCcw, label: 'Avslutning' };
    default:
      return { color: tokens.colors.steel, icon: Calendar, label: type };
  }
};

const getStatusConfig = (status) => {
  switch (status) {
    case 'completed':
      return { color: tokens.colors.success, icon: CheckCircle, label: 'Fullfort' };
    case 'in_progress':
      return { color: tokens.colors.primary, icon: Play, label: 'Pagar' };
    case 'pending':
      return { color: tokens.colors.steel, icon: Clock, label: 'Venter' };
    default:
      return { color: tokens.colors.steel, icon: Clock, label: status };
  }
};

// ============================================================================
// SESSION CARD COMPONENT
// ============================================================================

const SessionCard = ({ session, onStart, onComplete }) => {
  const [isExpanded, setIsExpanded] = useState(session.status === 'in_progress');
  const typeConfig = getSessionTypeConfig(session.type);
  const statusConfig = getStatusConfig(session.status);
  const TypeIcon = typeConfig.icon;

  const completedExercises = session.exercises.filter(e => e.completed).length;
  const totalExercises = session.exercises.length;

  return (
    <div style={{
      backgroundColor: tokens.colors.white,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      border: session.status === 'in_progress' ? `2px solid ${tokens.colors.primary}` : '2px solid transparent',
      opacity: session.status === 'completed' ? 0.8 : 1,
    }}>
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          backgroundColor: `${typeConfig.color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {session.status === 'completed' ? (
            <CheckCircle size={22} color={tokens.colors.success} />
          ) : (
            <TypeIcon size={22} color={typeConfig.color} />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: tokens.colors.charcoal,
              margin: 0,
              textDecoration: session.status === 'completed' ? 'line-through' : 'none',
            }}>
              {session.name}
            </h3>
            <span style={{
              fontSize: '11px',
              fontWeight: 500,
              color: statusConfig.color,
              backgroundColor: `${statusConfig.color}15`,
              padding: '2px 6px',
              borderRadius: '4px',
            }}>
              {statusConfig.label}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: tokens.colors.steel, marginTop: '2px' }}>
            {session.duration} min - {completedExercises}/{totalExercises} ovelser
          </div>
        </div>

        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          backgroundColor: tokens.colors.snow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
        }}>
          <ChevronRight size={16} color={tokens.colors.steel} />
        </div>
      </div>

      {/* Progress bar */}
      {session.status !== 'pending' && (
        <div style={{ padding: '0 16px 8px' }}>
          <div style={{
            height: '4px',
            backgroundColor: tokens.colors.snow,
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${(completedExercises / totalExercises) * 100}%`,
              backgroundColor: session.status === 'completed' ? tokens.colors.success : tokens.colors.primary,
              borderRadius: '2px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{
          padding: '0 16px 16px',
          borderTop: `1px solid ${tokens.colors.mist}`,
          marginTop: '8px',
        }}>
          <p style={{
            fontSize: '13px',
            color: tokens.colors.steel,
            margin: '12px 0',
            lineHeight: 1.5,
          }}>
            {session.description}
          </p>

          {/* Exercises */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {session.exercises.map((exercise, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  backgroundColor: exercise.completed ? `${tokens.colors.success}08` : tokens.colors.snow,
                  borderRadius: '8px',
                }}
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: exercise.completed ? tokens.colors.success : tokens.colors.white,
                  border: exercise.completed ? 'none' : `2px solid ${tokens.colors.mist}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                  {exercise.completed && <CheckCircle size={14} color={tokens.colors.white} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '13px',
                    color: exercise.completed ? tokens.colors.steel : tokens.colors.charcoal,
                    textDecoration: exercise.completed ? 'line-through' : 'none',
                  }}>
                    {exercise.name}
                  </div>
                  {exercise.notes && (
                    <div style={{ fontSize: '11px', color: tokens.colors.steel }}>
                      {exercise.notes}
                    </div>
                  )}
                </div>
                <span style={{
                  fontSize: '12px',
                  color: tokens.colors.steel,
                  backgroundColor: tokens.colors.white,
                  padding: '4px 8px',
                  borderRadius: '6px',
                }}>
                  {exercise.reps}
                </span>
              </div>
            ))}
          </div>

          {/* Trackman Data (if available) */}
          {session.trackmanData && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: `${tokens.colors.primary}08`,
              borderRadius: '10px',
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: tokens.colors.primary,
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <Video size={14} />
                TrackMan Data
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {Object.entries(session.trackmanData).map(([key, value]) => (
                  <div key={key} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: tokens.colors.charcoal }}>
                      {value}
                    </div>
                    <div style={{ fontSize: '10px', color: tokens.colors.steel }}>
                      {key.replace('avg', 'Gj.sn ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {session.status === 'pending' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStart(session.id);
              }}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.white,
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Play size={16} />
              Start okt
            </button>
          )}
          {session.status === 'in_progress' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete(session.id);
              }}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: tokens.colors.success,
                color: tokens.colors.white,
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle size={16} />
              Marker som fullfort
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DagensTreningsplanContainer = () => {
  const [plan, setPlan] = useState(TODAY_PLAN);

  const progressPercent = Math.round((plan.completedDuration / plan.totalDuration) * 100);
  const completedSessions = plan.sessions.filter(s => s.status === 'completed').length;

  const handleStartSession = (sessionId) => {
    setPlan(prev => ({
      ...prev,
      sessions: prev.sessions.map(s =>
        s.id === sessionId ? { ...s, status: 'in_progress' } : s
      ),
    }));
  };

  const handleCompleteSession = (sessionId) => {
    setPlan(prev => {
      const session = prev.sessions.find(s => s.id === sessionId);
      return {
        ...prev,
        completedDuration: prev.completedDuration + (session?.duration || 0),
        sessions: prev.sessions.map(s =>
          s.id === sessionId
            ? { ...s, status: 'completed', exercises: s.exercises.map(e => ({ ...e, completed: true })) }
            : s
        ),
      };
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.snow }}>
      <PageHeader
        title="Dagens treningsplan"
        subtitle={`${plan.dayName.charAt(0).toUpperCase() + plan.dayName.slice(1)} - ${plan.theme}`}
      />

      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Progress Overview */}
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: tokens.colors.charcoal,
                margin: 0,
              }}>
                Dagens fremgang
              </h2>
              <div style={{ fontSize: '13px', color: tokens.colors.steel, marginTop: '2px' }}>
                {completedSessions}/{plan.sessions.length} okter fullfort
              </div>
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: 700,
              color: progressPercent >= 100 ? tokens.colors.success : tokens.colors.primary,
            }}>
              {progressPercent}%
            </div>
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
              backgroundColor: progressPercent >= 100 ? tokens.colors.success : tokens.colors.primary,
              borderRadius: '4px',
              transition: 'width 0.5s ease',
            }} />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '12px',
            fontSize: '12px',
            color: tokens.colors.steel,
          }}>
            <span>{plan.completedDuration} min fullfort</span>
            <span>{plan.totalDuration - plan.completedDuration} min gjenstar</span>
          </div>
        </div>

        {/* Coach Note */}
        {plan.coachNote && (
          <div style={{
            backgroundColor: `${tokens.colors.primary}08`,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            borderLeft: `4px solid ${tokens.colors.primary}`,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}>
              <MessageCircle size={16} color={tokens.colors.primary} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: tokens.colors.primary }}>
                Beskjed fra trener
              </span>
            </div>
            <p style={{
              fontSize: '13px',
              color: tokens.colors.charcoal,
              margin: 0,
              lineHeight: 1.5,
            }}>
              {plan.coachNote}
            </p>
          </div>
        )}

        {/* Today's Goals */}
        <div style={{
          backgroundColor: tokens.colors.white,
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}>
            <Award size={16} color={tokens.colors.gold} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: tokens.colors.charcoal }}>
              Dagens mal
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {plan.goals.map((goal, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: tokens.colors.charcoal,
                }}
              >
                <Target size={12} color={tokens.colors.gold} />
                {goal}
              </div>
            ))}
          </div>
        </div>

        {/* Sessions */}
        <h2 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: tokens.colors.charcoal,
          margin: '0 0 16px 0',
        }}>
          Okter
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {plan.sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onStart={handleStartSession}
              onComplete={handleCompleteSession}
            />
          ))}
        </div>

        {/* Add Custom Exercise */}
        <button style={{
          width: '100%',
          marginTop: '16px',
          padding: '14px',
          borderRadius: '12px',
          border: `2px dashed ${tokens.colors.mist}`,
          backgroundColor: 'transparent',
          color: tokens.colors.steel,
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}>
          <Plus size={18} />
          Legg til egen okt
        </button>
      </div>
    </div>
  );
};

export default DagensTreningsplanContainer;
