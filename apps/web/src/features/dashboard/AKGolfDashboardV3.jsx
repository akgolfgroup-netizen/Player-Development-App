import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Trophy, Target, CheckCircle2,
  Play, Bell, ChevronRight, Crosshair, Zap, Sparkles
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { useFocus } from '../../hooks/useFocus';

/**
 * AKGolfDashboard V3.1 - UX Redesign
 *
 * Forbedringer basert på UX-analyse:
 * - P1: Redusert KPI-visning, oppgaver flyttet opp
 * - P2: Kontekstualisert CTA med spesifikk info
 * - P3: No 0-shaming, progress feedback
 * - P4: Lavterskel start, adaptiv feedback
 *
 * Ny struktur:
 * - Zone A: Welcome + FocusCard + Primary CTA
 * - Zone B: TasksList (flyttet opp!) + QuickStart
 * - Zone C: ProgressStrip (kompakt) + Notifications
 */

// ===== HELPER FUNCTIONS =====

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'God morgen';
  if (hour < 18) return 'God dag';
  return 'God kveld';
};

const getDayOfWeek = () => new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

const getDaysUntil = (date) => {
  if (!date) return null;
  const targetDate = new Date(date);
  const today = new Date();
  const diffTime = targetDate - today;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

/**
 * Adaptiv motivasjonsmelding basert på progresjon og ukedag
 * P4: Psykologisk friksjonsreduksjon
 */
const getMotivationalMessage = (stats, dayOfWeek) => {
  const { sessionsCompleted, sessionsTotal, streak } = stats;
  const completionRate = sessionsTotal > 0 ? (sessionsCompleted / sessionsTotal) * 100 : 0;

  // Streak-baserte meldinger
  if (streak > 7) return 'Imponerende streak! Hold momentumet.';
  if (streak > 3) return `${streak} dager i rad – du bygger gode vaner!`;

  // Progresjon-baserte meldinger
  if (completionRate >= 100) return 'Uka fullført! Du er en maskin.';
  if (completionRate >= 75) return 'Nesten der – sterk innsats!';
  if (completionRate >= 50) return 'Halvveis – godt på vei!';
  if (completionRate >= 25) return 'God start på uka!';

  // Ukedag-baserte meldinger (ingen økter ennå)
  if (sessionsCompleted === 0) {
    if (dayOfWeek === 1) return 'Ny uke – sett standarden tidlig!';
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'Helgetrening? Alltid bra!';
    if (dayOfWeek <= 3) return 'Kom i gang – uka har bare startet.';
    return 'Ny sjanse i dag!';
  }

  return 'Hver økt teller.';
};

// ===== COMPONENT LABELS =====

const COMPONENT_LABELS = {
  OTT: 'Utslag',
  APP: 'Innspill',
  ARG: 'Kortspill',
  PUTT: 'Putting',
};

const COMPONENT_COLORS = {
  OTT: 'var(--info)',
  APP: 'var(--success)',
  ARG: 'var(--warning)',
  PUTT: 'var(--ak-accent-purple, #8B5CF6)',
};

// ===== ZONE A COMPONENTS =====

/**
 * WelcomeSection - Med adaptiv motivasjonsmelding
 * P4: Personlig feedback basert på progresjon
 */
const WelcomeSection = ({ playerName, category, stats }) => {
  const dayOfWeek = getDayOfWeek();
  const motivationalMessage = getMotivationalMessage(stats, dayOfWeek);

  return (
    <div style={styles.welcomeSection}>
      <p style={styles.greetingText}>{getGreeting()}</p>
      <h1 style={styles.playerName}>{playerName?.split(' ')[0] || 'Spiller'}</h1>
      <p style={styles.motivationalText}>{motivationalMessage}</p>
    </div>
  );
};

/**
 * FocusCard - Ukens fokus med integrert progress
 * P1: Én primær KPI
 */
const FocusCard = ({ focus, loading }) => {
  if (loading) {
    return (
      <div style={styles.focusCard}>
        <div style={styles.focusCardLoading}>
          <div style={styles.focusCardLoadingPulse} />
          <div style={{ ...styles.focusCardLoadingPulse, width: '60%' }} />
        </div>
      </div>
    );
  }

  if (!focus) {
    return (
      <div style={styles.focusCard}>
        <div style={styles.focusCardHeader}>
          <Crosshair size={16} style={{ color: 'var(--accent)' }} />
          <span style={styles.focusCardLabel}>Ukens fokus</span>
        </div>
        <h3 style={styles.focusCardTitle}>Start din første økt</h3>
        <p style={styles.focusCardDescription}>
          Fullfør noen tester for å få personlig anbefaling
        </p>
      </div>
    );
  }

  const focusColor = COMPONENT_COLORS[focus.focusComponent] || 'var(--accent)';
  const focusLabel = COMPONENT_LABELS[focus.focusComponent] || focus.focusComponent;
  const sessionsCompleted = focus.sessionsCompleted || 0;
  const sessionsTarget = focus.sessionsTarget || 4;
  const progressPercent = Math.round((sessionsCompleted / sessionsTarget) * 100);

  return (
    <div style={{ ...styles.focusCard, borderLeftColor: focusColor }}>
      <div style={styles.focusCardHeader}>
        <div style={styles.focusCardHeaderLeft}>
          <Crosshair size={16} style={{ color: focusColor }} />
          <span style={styles.focusCardLabel}>Ukens fokus</span>
        </div>
        <span style={{
          ...styles.focusCardBadge,
          backgroundColor: `${focusColor}15`,
          color: focusColor,
        }}>
          {focusLabel}
        </span>
      </div>

      <h3 style={styles.focusCardTitle}>
        {focus.approachWeakestBucket
          ? `${focusLabel}: ${focus.approachWeakestBucket.replace('_', '-')} yards`
          : focusLabel
        }
      </h3>

      {focus.reasonCodes?.length > 0 && (
        <p style={styles.focusCardDescription}>
          {focus.reasonCodes.includes(`weak_${focus.focusComponent.toLowerCase()}_test_cluster`)
            ? 'Dine tester viser forbedringspotensial her'
            : focus.reasonCodes.includes(`high_weight_${focus.focusComponent.toLowerCase()}`)
            ? 'Dette området har stor påvirkning på scoren din'
            : 'Anbefalt basert på din spillerprofil'
          }
        </p>
      )}

      {/* Progress indicator */}
      <div style={styles.focusProgressContainer}>
        <div style={styles.focusProgressTrack}>
          <div style={{
            ...styles.focusProgressFill,
            width: `${progressPercent}%`,
            backgroundColor: focusColor,
          }} />
        </div>
        <span style={styles.focusProgressLabel}>
          {sessionsCompleted} av {sessionsTarget} økter
        </span>
      </div>

      {/* Confidence indicator */}
      {focus.confidence && (
        <div style={styles.focusConfidence}>
          <span style={{
            ...styles.focusConfidenceBadge,
            backgroundColor: focus.confidence === 'high' ? 'var(--success-muted)' :
                           focus.confidence === 'med' ? 'var(--warning-muted)' : 'var(--bg-tertiary)',
            color: focus.confidence === 'high' ? 'var(--success)' :
                   focus.confidence === 'med' ? 'var(--warning)' : 'var(--text-tertiary)',
          }}>
            {focus.confidence === 'high' ? 'Sikker anbefaling' :
             focus.confidence === 'med' ? 'Moderat sikkerhet' : 'Begrenset data'}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * ContextualCTA - Primær handlingsknapp med spesifikk kontekst
 * P2: "Start {title} ({duration} min)" i stedet for generisk
 */
const ContextualCTA = ({ focus, upcomingSession, onStart }) => {
  // Priority 1: Scheduled session from calendar - SPESIFIKK
  if (upcomingSession) {
    const title = upcomingSession.title || 'Planlagt økt';
    const duration = upcomingSession.duration || 45;

    return (
      <div style={styles.contextualCTA}>
        <button style={styles.ctaButton} onClick={() => onStart(upcomingSession)}>
          <div style={styles.ctaContent}>
            <Play size={20} style={{ flexShrink: 0 }} />
            <div style={styles.ctaTextContainer}>
              <span style={styles.ctaTitle}>Start {title}</span>
              <span style={styles.ctaSubtitle}>
                {duration} min · Fra din kalender
              </span>
            </div>
          </div>
          <ChevronRight size={20} style={styles.ctaArrow} />
        </button>
      </div>
    );
  }

  // Priority 2: Recommended session based on focus - SPESIFIKK
  if (focus?.focusComponent) {
    const focusLabel = COMPONENT_LABELS[focus.focusComponent] || focus.focusComponent;
    const sessionDuration = focus.recommendedDuration || 30;

    return (
      <div style={styles.contextualCTA}>
        <button style={styles.ctaButton} onClick={() => onStart({ type: 'focus', focus })}>
          <div style={styles.ctaContent}>
            <Play size={20} style={{ flexShrink: 0 }} />
            <div style={styles.ctaTextContainer}>
              <span style={styles.ctaTitle}>Start {focusLabel}-økt</span>
              <span style={styles.ctaSubtitle}>
                {sessionDuration} min · Del av ukens mål
              </span>
            </div>
          </div>
          <ChevronRight size={20} style={styles.ctaArrow} />
        </button>
      </div>
    );
  }

  // Priority 3: Fallback - low-threshold session
  return (
    <div style={styles.contextualCTA}>
      <button style={styles.ctaButton} onClick={() => onStart({ type: 'quick' })}>
        <div style={styles.ctaContent}>
          <Play size={20} style={{ flexShrink: 0 }} />
          <div style={styles.ctaTextContainer}>
            <span style={styles.ctaTitle}>Kom i gang</span>
            <span style={styles.ctaSubtitle}>
              Velg en økt som passer deg i dag
            </span>
          </div>
        </div>
        <ChevronRight size={20} style={styles.ctaArrow} />
      </button>
    </div>
  );
};

/**
 * QuickStartCTA - Sekundær lavterskel-knapp
 * P4: Alltid synlig 15-min alternativ
 */
const QuickStartCTA = ({ onStart }) => (
  <button style={styles.quickStartButton} onClick={() => onStart({ type: 'quick', duration: 15 })}>
    <Zap size={16} style={{ color: 'var(--text-secondary)' }} />
    <span>Bare 15 minutter? Start hurtigøkt</span>
    <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />
  </button>
);

// ===== ZONE B COMPONENTS =====

/**
 * TasksList - Oppgaver (FLYTTET OPP fra Zone C)
 * P1: Oppgaver høyere i hierarkiet
 * P2: Koble oppgaver til handling
 */
const TasksList = ({ tasks, onToggle, onViewAll, onStartTask }) => {
  const completedCount = tasks.filter(t => t.completed).length;
  const displayTasks = tasks.slice(0, 3);

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.cardHeaderLeft}>
          <Target size={16} style={{ color: 'var(--text-secondary)' }} />
          <span style={styles.cardTitle}>Dagens oppgaver</span>
        </div>
        {tasks.length > 3 && (
          <button style={styles.cardAction} onClick={onViewAll}>
            +{tasks.length - 3} mer <ChevronRight size={14} />
          </button>
        )}
      </div>
      {tasks.length === 0 ? (
        <div style={styles.emptyState}>
          <Sparkles size={24} style={{ color: 'var(--text-tertiary)', marginBottom: 8 }} />
          <p>Ingen oppgaver i dag – nyt friheten!</p>
        </div>
      ) : (
        <div style={styles.taskList}>
          {displayTasks.map(task => (
            <div
              key={task.id}
              style={{
                ...styles.taskItem,
                backgroundColor: task.completed ? 'var(--success-muted)' : 'transparent',
              }}
            >
              <div
                style={{
                  ...styles.taskCheckbox,
                  borderColor: task.completed ? 'var(--ak-success)' : 'var(--border-default)',
                  backgroundColor: task.completed ? 'var(--ak-success)' : 'transparent',
                }}
                onClick={() => onToggle?.(task.id)}
              >
                {task.completed && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span style={{
                ...styles.taskTitle,
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                flex: 1,
              }}>
                {task.title}
              </span>
              {!task.completed && onStartTask && (
                <button
                  style={styles.taskStartButton}
                  onClick={() => onStartTask(task)}
                >
                  Start
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {tasks.length > 0 && (
        <div style={styles.cardFooterMeta}>
          {completedCount === tasks.length ? (
            <span style={{ color: 'var(--success)' }}>✓ Alle fullført!</span>
          ) : (
            `${completedCount} av ${Math.min(tasks.length, 3)} fullført`
          )}
        </div>
      )}
    </div>
  );
};

// ===== ZONE C COMPONENTS =====

/**
 * ProgressStrip - Kompakt progresjon med "no 0-shaming"
 * P3: Motiverende meldinger i stedet for 0-verdier
 */
const ProgressStrip = ({ sessions, hours, streak }) => {
  const dayOfWeek = getDayOfWeek();
  const sessionsPercent = sessions.total > 0
    ? Math.round((sessions.completed / sessions.total) * 100)
    : 0;
  const hoursPercent = hours.goal > 0
    ? Math.round((hours.current / hours.goal) * 100)
    : 0;

  // P3: "No 0-shaming" - positive messaging based on context
  const showEncouragement = sessions.completed === 0 && hours.current === 0;

  if (showEncouragement) {
    const messages = {
      1: 'Ny uke starter nå – gjør første økt til en vane!',
      2: 'Tirsdag er perfekt for å komme i gang.',
      3: 'Midt i uka – tid for å bygge momentum.',
      4: 'Torsdagsøkt? Alltid en god idé.',
      5: 'Avslutt uka sterkt!',
      6: 'Helgetrening = ekstra poeng.',
      0: 'Søndagsøkt? Du fortjener applaus!',
    };

    return (
      <div style={styles.progressStrip}>
        <div style={styles.progressStripEncouragement}>
          <span style={styles.progressStripEncouragementText}>
            {messages[dayOfWeek] || 'Start uken med din første økt'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.progressStrip}>
      {/* Sessions progress */}
      <div style={styles.progressStripItem}>
        <div style={styles.progressStripHeader}>
          <span style={styles.progressStripLabel}>Økter</span>
          <span style={styles.progressStripValue}>
            {sessions.completed}/{sessions.total}
          </span>
        </div>
        <div style={styles.progressStripBar}>
          <div style={{
            ...styles.progressStripFill,
            width: `${sessionsPercent}%`,
            backgroundColor: sessionsPercent >= 100 ? 'var(--success)' : 'var(--accent)',
          }} />
        </div>
      </div>

      {/* Hours progress */}
      <div style={styles.progressStripItem}>
        <div style={styles.progressStripHeader}>
          <span style={styles.progressStripLabel}>Timer</span>
          <span style={styles.progressStripValue}>
            {hours.current}/{hours.goal}t
          </span>
        </div>
        <div style={styles.progressStripBar}>
          <div style={{
            ...styles.progressStripFill,
            width: `${Math.min(hoursPercent, 100)}%`,
            backgroundColor: hoursPercent >= 100 ? 'var(--success)' : 'var(--info)',
          }} />
        </div>
      </div>

      {/* Streak - show with celebration when high */}
      {streak > 0 && (
        <div style={styles.progressStripStreak}>
          <span style={{
            ...styles.progressStripStreakValue,
            color: streak >= 7 ? 'var(--warning)' : 'var(--text-primary)',
          }}>
            {streak >= 7 ? '🔥' : ''}{streak}
          </span>
          <span style={styles.progressStripStreakLabel}>
            {streak === 1 ? 'dag' : 'dager'}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * NotificationsList - Varslinger (lav prioritet)
 */
const NotificationsList = ({ notifications, onViewAll }) => {
  const displayNotifications = notifications.slice(0, 2);

  if (notifications.length === 0) {
    return null; // Don't show empty notifications section
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.cardHeaderLeft}>
          <Bell size={16} style={{ color: 'var(--text-secondary)' }} />
          <span style={styles.cardTitle}>Varslinger</span>
          {notifications.length > 0 && (
            <span style={styles.notificationBadge}>{notifications.length}</span>
          )}
        </div>
        {notifications.length > 2 && (
          <button style={styles.cardAction} onClick={onViewAll}>
            Se alle <ChevronRight size={14} />
          </button>
        )}
      </div>
      <div style={styles.notificationList}>
        {displayNotifications.map((notif, idx) => (
          <div key={notif.id || idx} style={styles.notificationItem}>
            <div style={styles.notificationDot} />
            <div style={styles.notificationContent}>
              <p style={styles.notificationTitle}>{notif.title}</p>
              <p style={styles.notificationMessage}>{notif.message}</p>
            </div>
            <span style={styles.notificationTime}>{notif.time || 'Nylig'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== MAIN DASHBOARD =====

const AKGolfDashboardV3 = () => {
  const navigate = useNavigate();
  const { data: dashboardData, loading } = useDashboard();
  const { data: focusData, loading: focusLoading } = useFocus();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (dashboardData?.tasks) {
      setTasks(dashboardData.tasks);
    }
  }, [dashboardData]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Extract data with fallbacks
  const player = dashboardData?.player || { name: 'Spiller', category: 'B' };
  const stats = dashboardData?.stats || {
    sessionsCompleted: 0,
    sessionsTotal: 12,
    hoursThisWeek: 0,
    hoursGoal: 20,
    streak: 0,
  };
  const notifications = dashboardData?.notifications || [];

  const handleStartSession = (session) => {
    if (session?.id) {
      navigate(`/session/${session.id}/active`);
    } else if (session?.type === 'focus') {
      navigate('/session/new', { state: { focus: session.focus } });
    } else {
      navigate('/session/new', { state: { quickStart: true, duration: session?.duration || 15 } });
    }
  };

  const handleStartTaskSession = (task) => {
    // Navigate to session creation with task context
    navigate('/session/new', { state: { taskId: task.id, taskTitle: task.title } });
  };

  if (loading) {
    return (
      <div style={styles.dashboard}>
        <div style={styles.loadingState}>Laster dashboard...</div>
      </div>
    );
  }

  return (
    <div style={styles.dashboard}>
      {/* ZONE A: Control & Focus */}
      <section style={styles.zoneA}>
        <WelcomeSection
          playerName={player.name}
          category={player.category}
          stats={stats}
        />

        <FocusCard
          focus={focusData}
          loading={focusLoading}
        />

        <ContextualCTA
          focus={focusData}
          upcomingSession={dashboardData?.upcomingSessions?.[0]}
          onStart={handleStartSession}
        />
      </section>

      {/* ZONE B: Tasks & Quick Actions (OPPGAVER FLYTTET OPP!) */}
      <section style={styles.zoneB}>
        <TasksList
          tasks={tasks}
          onToggle={toggleTask}
          onViewAll={() => navigate('/maalsetninger')}
          onStartTask={handleStartTaskSession}
        />

        {/* P4: Alltid synlig lavterskel-alternativ */}
        <QuickStartCTA onStart={handleStartSession} />
      </section>

      {/* ZONE C: Progress & Notifications (KOMPAKT) */}
      <section style={styles.zoneC}>
        <ProgressStrip
          sessions={{ completed: stats.sessionsCompleted, total: stats.sessionsTotal }}
          hours={{ current: stats.hoursThisWeek, goal: stats.hoursGoal }}
          streak={stats.streak}
        />
        <NotificationsList
          notifications={notifications}
          onViewAll={() => navigate('/varslinger')}
        />
      </section>
    </div>
  );
};

// ===== STYLES =====

const styles = {
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    maxWidth: '640px',
    margin: '0 auto',
    padding: '24px 16px',
  },

  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    color: 'var(--text-tertiary)',
    fontSize: '15px',
  },

  // Zone A: Control & Focus
  zoneA: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  welcomeSection: {
    marginBottom: '4px',
  },
  greetingText: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 4px 0',
  },
  playerName: {
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: '0 0 6px 0',
    letterSpacing: '-0.02em',
  },
  motivationalText: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    margin: 0,
    fontWeight: 500,
  },

  // FocusCard
  focusCard: {
    padding: '20px',
    backgroundColor: 'var(--card)',
    borderRadius: '16px',
    border: '1px solid var(--border-subtle)',
    borderLeft: '4px solid var(--accent)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  focusCardLoading: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  focusCardLoadingPulse: {
    height: '16px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '4px',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  focusCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  focusCardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  focusCardLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  focusCardBadge: {
    fontSize: '11px',
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: '12px',
  },
  focusCardTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: '0 0 8px 0',
    letterSpacing: '-0.01em',
  },
  focusCardDescription: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: '0 0 16px 0',
    lineHeight: 1.5,
  },
  focusProgressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  focusProgressTrack: {
    flex: 1,
    height: '6px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  focusProgressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  focusProgressLabel: {
    fontSize: '13px',
    color: 'var(--text-tertiary)',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  focusConfidence: {
    marginTop: '12px',
  },
  focusConfidenceBadge: {
    fontSize: '11px',
    fontWeight: 500,
    padding: '4px 8px',
    borderRadius: '6px',
  },

  // ContextualCTA
  contextualCTA: {
    marginTop: '4px',
  },
  ctaButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '16px 20px',
    backgroundColor: 'var(--ak-primary, #1B4D3E)',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxShadow: '0 2px 8px rgba(27, 77, 62, 0.25)',
  },
  ctaContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  ctaTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '2px',
  },
  ctaTitle: {
    fontSize: '16px',
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },
  ctaSubtitle: {
    fontSize: '13px',
    fontWeight: 400,
    opacity: 0.85,
  },
  ctaArrow: {
    opacity: 0.7,
    flexShrink: 0,
  },

  // QuickStartCTA
  quickStartButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px dashed var(--border-default)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.15s ease',
  },

  // Zone B: Tasks (MOVED UP)
  zoneB: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  // Zone C: Progress & Notifications
  zoneC: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  // ProgressStrip
  progressStrip: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '14px 18px',
    backgroundColor: 'var(--card)',
    borderRadius: '12px',
    border: '1px solid var(--border-subtle)',
  },
  progressStripItem: {
    flex: 1,
    minWidth: 0,
  },
  progressStripHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  progressStripLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
  },
  progressStripValue: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    fontFeatureSettings: '"tnum"',
  },
  progressStripBar: {
    height: '4px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressStripFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  progressStripStreak: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    paddingLeft: '16px',
    borderLeft: '1px solid var(--border-subtle)',
  },
  progressStripStreakValue: {
    fontSize: '16px',
    fontWeight: 700,
    fontFeatureSettings: '"tnum"',
  },
  progressStripStreakLabel: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    whiteSpace: 'nowrap',
  },
  progressStripEncouragement: {
    flex: 1,
    textAlign: 'center',
    padding: '4px 0',
  },
  progressStripEncouragementText: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },

  // Generic card
  card: {
    backgroundColor: 'var(--card)',
    borderRadius: '12px',
    border: '1px solid var(--border-subtle)',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  cardAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '4px 8px',
    marginRight: '-8px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'color 0.15s ease',
  },
  cardFooterMeta: {
    padding: '10px 16px',
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    borderTop: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-tertiary)',
  },
  emptyState: {
    padding: '24px 16px',
    textAlign: 'center',
    color: 'var(--text-tertiary)',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  // Tasks
  taskList: {
    display: 'flex',
    flexDirection: 'column',
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-subtle)',
    transition: 'background-color 0.15s ease',
  },
  taskCheckbox: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  taskTitle: {
    fontSize: '14px',
    fontWeight: 500,
    transition: 'color 0.15s ease',
  },
  taskStartButton: {
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--accent)',
    backgroundColor: 'var(--accent-muted)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },

  // Notifications
  notificationBadge: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--accent)',
    backgroundColor: 'var(--accent-muted)',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  notificationList: {
    display: 'flex',
    flexDirection: 'column',
  },
  notificationItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 16px',
    borderBottom: '1px solid var(--border-subtle)',
  },
  notificationDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    marginTop: '6px',
    flexShrink: 0,
  },
  notificationContent: {
    flex: 1,
    minWidth: 0,
  },
  notificationTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    margin: 0,
  },
  notificationMessage: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: '2px 0 0 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  notificationTime: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    flexShrink: 0,
  },
};

export default AKGolfDashboardV3;
