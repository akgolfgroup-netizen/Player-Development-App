import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, MapPin, Trophy, Target, CheckCircle2,
  Play, Bell, RefreshCw, Flame, Calendar, TrendingUp, ChevronRight
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardWidget, KPIValue, KPIMeta } from './components';
import Button from '../../ui/primitives/Button';
import Badge from '../../ui/primitives/Badge.primitive';

/**
 * AKGolfDashboard - Premium Player Dashboard
 *
 * Card Shell Contract applied to all modules:
 * - Consistent surface, borders, shadows
 * - Unified header row pattern
 * - Standard KPI typography
 * - Single vertical rhythm
 *
 * Layout:
 * Zone A (Top): Welcome + Quick Stats + Countdowns
 * Zone B (Mid): Plan completion + Hours + Notifications
 * Zone C (Bottom): Tasks + Sessions
 */

// ===== CARD SHELL STYLES =====

const cardShell = {
  base: {
    backgroundColor: 'var(--card)',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
    border: '1px solid var(--border-subtle)',
    overflow: 'hidden',
  },
  padding: {
    default: '20px 24px',
    compact: '16px 20px',
  },
};

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

const ProfileCard = ({ player, stats, onViewProgress, onViewPlan, onViewProfile }) => {
  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'SP';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Category color mapping
  const getCategoryColor = (category) => {
    const colors = {
      'A': 'var(--ak-success)',
      'B': 'var(--text-brand)',
      'C': 'var(--ak-warning)',
      'D': 'var(--text-secondary)',
    };
    return colors[category] || colors['B'];
  };

  return (
    <div style={{ ...cardShell.base, padding: '0' }}>
      <div style={styles.profileContent}>
        {/* Left: Avatar and Info */}
        <div style={styles.profileLeft}>
          {/* Avatar */}
          <div style={styles.avatarContainer}>
            {player.avatarUrl ? (
              <img
                src={player.avatarUrl}
                alt={player.name}
                style={styles.avatarImage}
              />
            ) : (
              <div style={styles.avatarFallback}>
                {getInitials(player.name)}
              </div>
            )}
            <div style={{
              ...styles.categoryBadge,
              backgroundColor: getCategoryColor(player.category),
            }}>
              {player.category || 'B'}
            </div>
          </div>

          {/* Player Info */}
          <div style={styles.profileInfo}>
            <h2 style={styles.profileName}>{player.name || 'Spiller'}</h2>
            <p style={styles.profileClub}>{player.club || 'Klubb ikke satt'}</p>
            <div style={styles.profileMeta}>
              <Badge variant="accent" size="sm">Kategori {player.category || 'B'}</Badge>
              {player.memberSince && (
                <span style={styles.memberSince}>Medlem siden {player.memberSince}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Stats */}
        <div style={styles.profileStats}>
          <div style={styles.profileStatItem}>
            <span style={styles.profileStatValue}>
              {stats?.scoringAverage?.toFixed(1) || '—'}
            </span>
            <span style={styles.profileStatLabel}>Snitt</span>
          </div>
          <div style={styles.profileStatDivider} />
          <div style={styles.profileStatItem}>
            <span style={{
              ...styles.profileStatValue,
              color: (stats?.strokesGained || 0) >= 0 ? 'var(--ak-success)' : 'var(--ak-error)',
            }}>
              {stats?.strokesGained !== undefined
                ? `${stats.strokesGained >= 0 ? '+' : ''}${stats.strokesGained.toFixed(1)}`
                : '—'}
            </span>
            <span style={styles.profileStatLabel}>SG Total</span>
          </div>
          <div style={styles.profileStatDivider} />
          <div style={styles.profileStatItem}>
            <span style={styles.profileStatValue}>
              {stats?.totalSessions || '0'}
            </span>
            <span style={styles.profileStatLabel}>Økter</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Row */}
      <div style={styles.profileActions}>
        <button
          style={styles.profileActionButton}
          onClick={onViewProgress}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <TrendingUp size={14} />
          <span>Se fremgang</span>
        </button>
        <button
          style={styles.profileActionButton}
          onClick={onViewPlan}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Calendar size={14} />
          <span>Treningsplan</span>
        </button>
        <button
          style={{ ...styles.profileActionButton, borderRight: 'none' }}
          onClick={onViewProfile}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ChevronRight size={14} />
          <span>Full profil</span>
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, subValue }) => (
  <div style={{ ...cardShell.base, padding: cardShell.padding.compact }}>
    <div style={styles.statContent}>
      <div style={styles.statIcon}>
        <Icon size={18} />
      </div>
      <div style={styles.statText}>
        <KPIValue style={{ fontSize: '24px' }}>{value}</KPIValue>
        <KPIMeta>{label}</KPIMeta>
        {subValue && <KPIMeta style={{ marginTop: '2px' }}>{subValue}</KPIMeta>}
      </div>
    </div>
  </div>
);

const CountdownCard = ({ title, date, type, location }) => {
  const targetDate = new Date(date);
  const today = new Date();
  const diffTime = targetDate - today;
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const typeConfig = {
    tournament: { label: 'Neste turnering', icon: Trophy },
    test: { label: 'Neste test', icon: Target },
  };
  const config = typeConfig[type] || typeConfig.test;
  const Icon = config.icon;

  return (
    <div style={{ ...cardShell.base, padding: cardShell.padding.compact }}>
      <div style={styles.countdownContent}>
        <div style={styles.countdownLeft}>
          <div style={styles.countdownIcon}>
            <Icon size={18} />
          </div>
          <div>
            <KPIMeta style={{ textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 500 }}>
              {config.label}
            </KPIMeta>
            <p style={styles.countdownTitle}>{title || 'Ikke planlagt'}</p>
            {location && (
              <p style={styles.countdownLocation}>
                <MapPin size={12} /> {location}
              </p>
            )}
          </div>
        </div>
        <div style={styles.countdownRight}>
          <KPIValue style={{ fontSize: '28px', color: 'var(--text-brand)' }}>{diffDays}</KPIValue>
          <KPIMeta>dager</KPIMeta>
        </div>
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
      icon={CheckCircle2}
      loading={loading}
      error={error}
      compact
    >
      <div style={styles.progressContent}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${percentage}%` }} />
        </div>
        <div style={styles.progressStats}>
          <KPIValue style={{ fontSize: '20px' }}>{completed}/{total}</KPIValue>
          <KPIMeta>{percentage}%</KPIMeta>
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
      icon={Clock}
      loading={loading}
      error={error}
      compact
    >
      <div style={styles.hoursContent}>
        <KPIValue style={{ fontSize: '24px', color: 'var(--text-brand)', minWidth: '48px' }}>{hours}t</KPIValue>
        <div style={styles.hoursProgress}>
          <div style={{ ...styles.hoursProgressFill, width: `${Math.min(percentage, 100)}%` }} />
        </div>
      </div>
    </DashboardWidget>
  );
};

const NotificationsWidget = ({ notifications, onViewAll, loading, error }) => (
  <DashboardWidget
    title="Varslinger"
    icon={Bell}
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
          <KPIMeta>{notif.time || 'Nylig'}</KPIMeta>
        </div>
      ))}
    </div>
  </DashboardWidget>
);

// ===== ZONE C: BOTTOM SECTION =====

const TasksWidget = ({ tasks, onToggle, onViewAll, loading, error }) => {
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <DashboardWidget
      title="Mine oppgaver"
      subtitle={`${completedCount}/${tasks.length} fullført`}
      icon={Target}
      action={onViewAll}
      actionLabel="Se alle"
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
              <KPIMeta>{task.area}</KPIMeta>
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

const SessionsWidget = ({ sessions, onViewAll, onSessionClick, loading, error }) => (
  <DashboardWidget
    title="Dagens økter"
    icon={Calendar}
    action={onViewAll}
    actionLabel="Kalender"
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
            <KPIMeta style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={12} /> {session.time} &middot; <MapPin size={12} /> {session.location}
            </KPIMeta>
          </div>
          <div style={styles.sessionDuration}>
            <KPIMeta style={{ fontWeight: 500 }}>{session.duration} min</KPIMeta>
          </div>
        </div>
      ))}
    </div>
  </DashboardWidget>
);

// ===== MAIN DASHBOARD =====

const AKGolfDashboard = () => {
  const navigate = useNavigate();
  const { data: dashboardData, loading, error, refetch } = useDashboard();
  const [tasks, setTasks] = useState([]);

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
  const stats = dashboardData?.stats || { sessionsCompleted: 0, sessionsTotal: 12, hoursThisWeek: 0, hoursGoal: 20, streak: 0, scoringAverage: 74.2, strokesGained: 1.3, totalSessions: 47 };
  const nextTournament = dashboardData?.nextTournament;
  const nextTest = dashboardData?.nextTest;
  const notifications = dashboardData?.notifications || [];
  const upcomingSessions = dashboardData?.upcomingSessions || [];

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

        {/* Profile Card with Avatar and Stats */}
        <ProfileCard
          player={player}
          stats={stats}
          onViewProgress={() => navigate('/progress')}
          onViewPlan={() => navigate('/kalender?view=week')}
          onViewProfile={() => navigate('/profil')}
        />

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

      {/* Primary CTA - Single button */}
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
    gap: '24px', // Consistent spacing
    maxWidth: '800px',
    margin: '0 auto',
    padding: '16px',
  },

  // Stale banner
  staleBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: 'var(--warning-muted)',
    borderRadius: '12px',
    borderLeft: '3px solid var(--ak-warning)',
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  staleRetry: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '4px 8px',
    cursor: 'pointer',
    textDecoration: 'underline',
  },

  // Zone A
  zoneA: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  welcomeHeader: {
    paddingBottom: '8px',
  },
  greetingLabel: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 4px 0',
  },
  playerName: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: '0 0 4px 0',
    letterSpacing: '-0.01em',
  },
  categoryLabel: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: 0,
  },

  // Profile Card
  profileContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    gap: '24px',
    flexWrap: 'wrap',
  },
  profileLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatarContainer: {
    position: 'relative',
    flexShrink: 0,
  },
  avatarImage: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid var(--border-subtle)',
  },
  avatarFallback: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-muted)',
    color: 'var(--text-brand)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 700,
    border: '3px solid var(--border-subtle)',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    color: 'white',
    fontSize: '11px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--card)',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  profileName: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  profileClub: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  profileMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '4px',
  },
  memberSince: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
  },
  profileStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  profileStatItem: {
    textAlign: 'center',
    minWidth: '48px',
  },
  profileStatValue: {
    display: 'block',
    fontSize: '22px',
    fontWeight: 700,
    fontFeatureSettings: '"tnum"',
    color: 'var(--text-primary)',
    lineHeight: 1,
  },
  profileStatLabel: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    marginTop: '4px',
  },
  profileStatDivider: {
    width: '1px',
    height: '32px',
    backgroundColor: 'var(--border-subtle)',
  },
  profileActions: {
    display: 'flex',
    alignItems: 'center',
    borderTop: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-tertiary)',
  },
  profileActionButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '12px 16px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    backgroundColor: 'transparent',
    border: 'none',
    borderRight: '1px solid var(--border-subtle)',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },

  // Stats Row
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  statContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statIcon: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--accent-muted)',
    color: 'var(--text-brand)',
    borderRadius: '10px',
  },
  statText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },

  // Countdown Row
  countdownRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  countdownContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countdownLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  countdownIcon: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)',
    borderRadius: '10px',
  },
  countdownTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '4px 0 0 0',
  },
  countdownLocation: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    margin: '4px 0 0 0',
  },
  countdownRight: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },

  // Zone B
  zoneB: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  zoneBGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },

  // Progress Widget
  progressContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
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

  // Hours Widget
  hoursContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
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
    gap: '12px',
    padding: '16px 24px',
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

  // Zone C
  zoneC: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  zoneCGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },

  // Tasks
  tasksList: {
    display: 'flex',
    flexDirection: 'column',
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
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
    fontSize: '14px',
    fontWeight: 500,
    margin: 0,
    transition: 'color 0.15s ease',
  },

  // Sessions
  sessionsList: {
    display: 'flex',
    flexDirection: 'column',
  },
  sessionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
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
    borderRadius: '10px',
  },
  sessionContent: {
    flex: 1,
    minWidth: 0,
  },
  sessionTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    margin: 0,
  },
  sessionDuration: {
    padding: '4px 10px',
    backgroundColor: 'var(--accent-muted)',
    borderRadius: '6px',
  },

  // Primary CTA
  primaryCTA: {
    paddingTop: '8px',
  },
};

export default AKGolfDashboard;
