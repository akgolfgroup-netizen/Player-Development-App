import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, MapPin, Trophy, Target, CheckCircle2,
  Play, Bell, Calendar, RefreshCw, ChevronRight, Flame,
  Dumbbell, BarChart3, MessageSquare, User
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardWidget } from './components';
import Card from '../../ui/primitives/Card';
import Button from '../../ui/primitives/Button';
import Badge from '../../ui/primitives/Badge.primitive';
import ActionsGrid from '../../ui/composites/ActionsGrid.composite';

/**
 * AKGolfDashboard - Premium Player Dashboard
 *
 * 3-Zone Layout:
 * Zone A (Top): Welcome header + countdown + primary stats
 * Zone B (Mid): Plan completion + hours + notifications
 * Zone C (Bottom): Tasks + activity feed
 *
 * Design principles:
 * - Clear hierarchy: one top header only
 * - Consistent card shell for all modules
 * - Compact error/loading states
 * - Semantic tokens only (no raw colors)
 */

// ===== ZONE A: TOP SECTION =====

const WelcomeHeader = ({ player, greeting }) => (
  <div style={styles.welcomeHeader}>
    <div>
      <p style={styles.greetingLabel}>{greeting}</p>
      <h1 style={styles.playerName}>{player.name?.split(' ')[0] || 'Spiller'}</h1>
      <p style={styles.categoryLabel}>Kategori {player.category || 'B'}</p>
    </div>
  </div>
);

const CountdownCard = ({ title, date, type, location }) => {
  const targetDate = new Date(date);
  const today = new Date();
  const diffTime = targetDate - today;
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const typeConfig = {
    tournament: {
      label: 'Neste turnering',
      icon: Trophy,
      bgColor: 'var(--warning-muted)',
      accentColor: 'var(--ak-warning)',
    },
    test: {
      label: 'Neste test',
      icon: Target,
      bgColor: 'var(--info-muted)',
      accentColor: 'var(--ak-info)',
    },
  };

  const config = typeConfig[type] || typeConfig.test;
  const Icon = config.icon;

  return (
    <div style={{ ...styles.countdownCard, backgroundColor: config.bgColor }}>
      <div style={styles.countdownLeft}>
        <div style={{ ...styles.countdownIcon, color: config.accentColor }}>
          <Icon size={18} />
        </div>
        <div>
          <p style={styles.countdownLabel}>{config.label}</p>
          <p style={styles.countdownTitle}>{title || 'Ikke planlagt'}</p>
          {location && (
            <p style={styles.countdownLocation}>
              <MapPin size={12} /> {location}
            </p>
          )}
        </div>
      </div>
      <div style={styles.countdownRight}>
        <span style={{ ...styles.countdownDays, color: config.accentColor }}>{diffDays}</span>
        <span style={styles.countdownDaysLabel}>dager</span>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subValue, trend }) => {
  const Icon = icon;
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>
        <Icon size={18} />
      </div>
      <div style={styles.statContent}>
        <p style={styles.statValue}>{value}</p>
        <p style={styles.statLabel}>{label}</p>
        {subValue && <p style={styles.statSubValue}>{subValue}</p>}
      </div>
    </div>
  );
};

// ===== ZONE B: MIDDLE SECTION =====

const PlanProgressWidget = ({ completed, total, loading, error }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <DashboardWidget
      title="Fullførte økter"
      subtitle="Denne uken"
      loading={loading}
      error={error}
      compact
    >
      <div style={styles.progressContent}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${percentage}%` }} />
        </div>
        <div style={styles.progressStats}>
          <span style={styles.progressValue}>{completed}/{total}</span>
          <span style={styles.progressPercent}>{percentage}%</span>
        </div>
      </div>
    </DashboardWidget>
  );
};

const HoursWidget = ({ hours, goal, loading, error }) => {
  const percentage = goal > 0 ? Math.round((hours / goal) * 100) : 0;

  return (
    <DashboardWidget
      title="Timer denne uke"
      subtitle={`Mål: ${goal}t`}
      loading={loading}
      error={error}
      compact
    >
      <div style={styles.hoursContent}>
        <span style={styles.hoursValue}>{hours}t</span>
        <div style={styles.hoursProgress}>
          <div style={{ ...styles.hoursProgressFill, width: `${Math.min(percentage, 100)}%` }} />
        </div>
      </div>
    </DashboardWidget>
  );
};

const NotificationsWidget = ({ notifications, onViewAll, loading, error }) => {
  return (
    <DashboardWidget
      title="Varslinger"
      action={onViewAll}
      actionLabel={notifications.length > 0 ? `${notifications.length} nye` : 'Se alle'}
      loading={loading}
      error={error}
      empty={notifications.length === 0}
      emptyMessage="Ingen nye varslinger"
      noPadding
    >
      <div style={styles.notificationsList}>
        {notifications.slice(0, 3).map((notif, idx) => (
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
    </DashboardWidget>
  );
};

// ===== ZONE C: BOTTOM SECTION =====

const TasksWidget = ({ tasks, onToggle, onViewAll, loading, error }) => {
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <DashboardWidget
      title="Mine oppgaver"
      subtitle={`${completedCount}/${tasks.length} fullført`}
      action={onViewAll}
      loading={loading}
      error={error}
      empty={tasks.length === 0}
      emptyMessage="Ingen oppgaver"
      emptyAction={onViewAll}
      emptyActionLabel="Legg til oppgave"
      noPadding
    >
      <div style={styles.tasksList}>
        {tasks.slice(0, 5).map(task => (
          <div
            key={task.id}
            style={{
              ...styles.taskItem,
              backgroundColor: task.completed ? 'var(--success-muted)' : 'transparent',
            }}
            onClick={() => onToggle?.(task.id)}
          >
            <div style={{
              ...styles.taskCheckbox,
              borderColor: task.completed ? 'var(--ak-success)' : 'var(--border-default)',
              backgroundColor: task.completed ? 'var(--ak-success)' : 'transparent',
            }}>
              {task.completed && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <div style={styles.taskContent}>
              <p style={{
                ...styles.taskTitle,
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
              }}>
                {task.title}
              </p>
              <p style={styles.taskArea}>{task.area}</p>
            </div>
            {task.priority === 'high' && !task.completed && (
              <Badge variant="error" size="sm">Viktig</Badge>
            )}
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
};

const SessionsWidget = ({ sessions, onViewAll, onSessionClick, loading, error }) => {
  return (
    <DashboardWidget
      title="Dagens økter"
      action={onViewAll}
      loading={loading}
      error={error}
      empty={sessions.length === 0}
      emptyMessage="Ingen økter planlagt i dag"
      emptyAction={onViewAll}
      emptyActionLabel="Gå til kalender"
      noPadding
    >
      <div style={styles.sessionsList}>
        {sessions.map(session => (
          <div
            key={session.id}
            style={styles.sessionItem}
            onClick={() => onSessionClick?.(session)}
          >
            <div style={styles.sessionIcon}>
              <Play size={16} />
            </div>
            <div style={styles.sessionContent}>
              <p style={styles.sessionTitle}>{session.title}</p>
              <p style={styles.sessionMeta}>
                <Clock size={12} /> {session.time} &middot; <MapPin size={12} /> {session.location}
              </p>
            </div>
            <span style={styles.sessionDuration}>{session.duration} min</span>
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
};

// ===== MAIN DASHBOARD =====

const AKGolfDashboard = () => {
  const navigate = useNavigate();
  const { data: dashboardData, loading, error, refetch } = useDashboard();
  const [tasks, setTasks] = useState([]);

  // Update tasks when data loads
  useEffect(() => {
    if (dashboardData?.tasks) {
      setTasks(dashboardData.tasks);
    }
  }, [dashboardData]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'God morgen';
    if (hour < 18) return 'God dag';
    return 'God kveld';
  };

  // Extract data with fallbacks
  const player = dashboardData?.player || { name: 'Spiller', category: 'B' };
  const stats = dashboardData?.stats || { sessionsCompleted: 0, sessionsTotal: 12, hoursThisWeek: 0, hoursGoal: 20, streak: 0 };
  const nextTournament = dashboardData?.nextTournament;
  const nextTest = dashboardData?.nextTest;
  const notifications = dashboardData?.notifications || [];
  const upcomingSessions = dashboardData?.upcomingSessions || [];
  const messages = dashboardData?.messages || [];

  // Quick actions for navigation
  const quickActions = [
    {
      id: 'training',
      title: 'Start trening',
      description: 'Start en ny treningsøkt eller velg fra ukeplanen.',
      href: '/sessions',
      icon: Dumbbell,
      iconForeground: 'text-teal-700',
      iconBackground: 'bg-teal-50',
    },
    {
      id: 'calendar',
      title: 'Kalender',
      description: 'Se og planlegg treningsøkter, tester og turneringer.',
      href: '/kalender',
      icon: Calendar,
      iconForeground: 'text-purple-700',
      iconBackground: 'bg-purple-50',
    },
    {
      id: 'stats',
      title: 'Statistikk',
      description: 'Se din fremgang og strokes gained analyse.',
      href: '/stats',
      icon: BarChart3,
      iconForeground: 'text-sky-700',
      iconBackground: 'bg-sky-50',
    },
    {
      id: 'messages',
      title: 'Meldinger',
      description: 'Kommuniser med treneren din og lagkamerater.',
      href: '/meldinger',
      icon: MessageSquare,
      iconForeground: 'text-yellow-700',
      iconBackground: 'bg-yellow-50',
      badge: messages.filter(m => !m.read).length || undefined,
    },
    {
      id: 'goals',
      title: 'Mål & oppgaver',
      description: 'Følg opp målene dine og daglige oppgaver.',
      href: '/maalsetninger',
      icon: Target,
      iconForeground: 'text-rose-700',
      iconBackground: 'bg-rose-50',
      badge: tasks.filter(t => !t.completed).length || undefined,
    },
    {
      id: 'profile',
      title: 'Min profil',
      description: 'Oppdater profilen din og se din utvikling.',
      href: '/profil',
      icon: User,
      iconForeground: 'text-indigo-700',
      iconBackground: 'bg-indigo-50',
    },
  ];

  return (
    <div style={styles.dashboard}>
      {/* Stale data banner */}
      {error && dashboardData && (
        <div style={styles.staleBanner}>
          <span>Viser tidligere data. Noe kan være utdatert.</span>
          <button style={styles.staleRetry} onClick={refetch}>
            <RefreshCw size={14} /> Oppdater
          </button>
        </div>
      )}

      {/* ZONE A: Top Section */}
      <section style={styles.zoneA}>
        <WelcomeHeader player={player} greeting={getGreeting()} />

        {/* Quick Stats Row */}
        <div style={styles.statsRow}>
          <StatCard
            icon={CheckCircle2}
            label="Økter denne uke"
            value={stats.sessionsCompleted}
            subValue={`av ${stats.sessionsTotal}`}
          />
          <StatCard
            icon={Clock}
            label="Treningstid"
            value={`${stats.hoursThisWeek}t`}
            subValue={`mål: ${stats.hoursGoal}t`}
          />
          <StatCard
            icon={Flame}
            label="Streak"
            value={stats.streak}
            subValue="dager på rad"
          />
        </div>

        {/* Countdown Cards */}
        <div style={styles.countdownRow}>
          <CountdownCard
            title={nextTournament?.title}
            date={nextTournament?.date || '2026-12-31'}
            type="tournament"
            location={nextTournament?.location}
          />
          <CountdownCard
            title={nextTest?.title}
            date={nextTest?.date || '2026-12-31'}
            type="test"
            location={nextTest?.location}
          />
        </div>
      </section>

      {/* ZONE B: Middle Section */}
      <section style={styles.zoneB}>
        <div style={styles.zoneBGrid}>
          <PlanProgressWidget
            completed={stats.sessionsCompleted}
            total={stats.sessionsTotal}
            loading={loading}
          />
          <HoursWidget
            hours={stats.hoursThisWeek}
            goal={stats.hoursGoal}
            loading={loading}
          />
          <NotificationsWidget
            notifications={notifications}
            onViewAll={() => navigate('/varslinger')}
            loading={loading}
          />
        </div>
      </section>

      {/* ZONE C: Bottom Section */}
      <section style={styles.zoneC}>
        <div style={styles.zoneCGrid}>
          <TasksWidget
            tasks={tasks}
            onToggle={toggleTask}
            onViewAll={() => navigate('/maalsetninger')}
            loading={loading}
          />
          <SessionsWidget
            sessions={upcomingSessions}
            onViewAll={() => navigate('/kalender')}
            onSessionClick={(s) => navigate(`/session/${s.id}`)}
            loading={loading}
          />
        </div>
      </section>

      {/* Primary CTA */}
      <div style={styles.primaryCTA}>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/sessions')}
          leftIcon={<Play size={18} />}
          fullWidth
        >
          Start treningsøkt
        </Button>
      </div>
    </div>
  );
};

// ===== STYLES =====

const styles = {
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-6)',
    maxWidth: '800px',
    margin: '0 auto',
    padding: 'var(--spacing-4)',
  },

  // Stale banner
  staleBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-3) var(--spacing-4)',
    backgroundColor: 'var(--warning-muted)',
    borderRadius: 'var(--radius-md)',
    borderLeft: '3px solid var(--ak-warning)',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
  },
  staleRetry: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    color: 'var(--ak-warning)',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '4px 8px',
    cursor: 'pointer',
  },

  // Zone A
  zoneA: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-5)',
  },
  welcomeHeader: {
    paddingBottom: 'var(--spacing-2)',
  },
  greetingLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 4px 0',
  },
  playerName: {
    fontSize: 'var(--font-size-title1)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: '0 0 4px 0',
    letterSpacing: '-0.01em',
  },
  categoryLabel: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
    margin: 0,
  },

  // Stats Row
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--spacing-3)',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-4)',
    backgroundColor: 'var(--card)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
  },
  statIcon: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--accent-muted)',
    color: 'var(--text-brand)',
    borderRadius: 'var(--radius-md)',
  },
  statContent: {
    flex: 1,
    minWidth: 0,
  },
  statValue: {
    fontSize: 'var(--font-size-headline)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
    lineHeight: 1.2,
  },
  statLabel: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
    margin: 0,
  },
  statSubValue: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-secondary)',
    margin: 0,
  },

  // Countdown Row
  countdownRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--spacing-3)',
  },
  countdownCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--spacing-4)',
    borderRadius: 'var(--radius-lg)',
  },
  countdownLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
  },
  countdownIcon: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--card)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
  },
  countdownLabel: {
    fontSize: 'var(--font-size-caption2)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    margin: 0,
  },
  countdownTitle: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '2px 0 0 0',
  },
  countdownLocation: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    margin: '4px 0 0 0',
  },
  countdownRight: {
    textAlign: 'right',
  },
  countdownDays: {
    fontSize: 'var(--font-size-title2)',
    fontWeight: 700,
    display: 'block',
    lineHeight: 1,
  },
  countdownDaysLabel: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-secondary)',
  },

  // Zone B
  zoneB: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
  },
  zoneBGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--spacing-4)',
  },

  // Progress Widget
  progressContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2)',
  },
  progressBar: {
    height: '8px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--ak-success)',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressStats: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  progressPercent: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-tertiary)',
  },

  // Hours Widget
  hoursContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  hoursValue: {
    fontSize: 'var(--font-size-title2)',
    fontWeight: 700,
    color: 'var(--text-brand)',
    minWidth: '48px',
  },
  hoursProgress: {
    flex: 1,
    height: '8px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  hoursProgressFill: {
    height: '100%',
    backgroundColor: 'var(--ak-primary)',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },

  // Notifications
  notificationsList: {
    display: 'flex',
    flexDirection: 'column',
  },
  notificationItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-4)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  notificationDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--ak-info)',
    marginTop: '6px',
    flexShrink: 0,
  },
  notificationContent: {
    flex: 1,
    minWidth: 0,
  },
  notificationTitle: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    margin: 0,
  },
  notificationMessage: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
    margin: '2px 0 0 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  notificationTime: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
    flexShrink: 0,
  },

  // Zone C
  zoneC: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-4)',
  },
  zoneCGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--spacing-4)',
  },

  // Tasks
  tasksList: {
    display: 'flex',
    flexDirection: 'column',
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-3) var(--spacing-4)',
    borderBottom: '1px solid var(--border-subtle)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  taskCheckbox: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.15s ease',
  },
  taskContent: {
    flex: 1,
    minWidth: 0,
  },
  taskTitle: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    margin: 0,
    transition: 'color 0.15s ease',
  },
  taskArea: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
    margin: '2px 0 0 0',
  },

  // Sessions
  sessionsList: {
    display: 'flex',
    flexDirection: 'column',
  },
  sessionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-3) var(--spacing-4)',
    borderBottom: '1px solid var(--border-subtle)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  sessionIcon: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--ak-primary)',
    color: 'white',
    borderRadius: 'var(--radius-md)',
  },
  sessionContent: {
    flex: 1,
    minWidth: 0,
  },
  sessionTitle: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    margin: 0,
  },
  sessionMeta: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    margin: '2px 0 0 0',
  },
  sessionDuration: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    color: 'var(--text-brand)',
    padding: '4px 8px',
    backgroundColor: 'var(--accent-muted)',
    borderRadius: 'var(--radius-sm)',
  },

  // Primary CTA
  primaryCTA: {
    paddingTop: 'var(--spacing-2)',
  },
};

// Add responsive styles via CSS class
const responsiveCSS = `
  @media (max-width: 640px) {
    .dashboard-stats-row { grid-template-columns: 1fr !important; }
    .dashboard-countdown-row { grid-template-columns: 1fr !important; }
    .dashboard-zone-b-grid { grid-template-columns: 1fr !important; }
    .dashboard-zone-c-grid { grid-template-columns: 1fr !important; }
  }
`;

export default AKGolfDashboard;
