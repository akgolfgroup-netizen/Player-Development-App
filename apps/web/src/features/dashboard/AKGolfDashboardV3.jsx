import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Trophy, Target, CheckCircle2,
  Play, Bell, ChevronRight
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import Button from '../../ui/primitives/Button';

/**
 * AKGolfDashboard V3 - Premium Player Dashboard
 *
 * Redesigned for clarity and focus:
 * - Zone A: Control & Focus (orientation + action)
 * - Zone B: Progress & Status (confirmation without stress)
 * - Zone C: Follow-up & Signals (tasks & notifications)
 *
 * Design principles:
 * - Answer "What's important now?" in 5 seconds
 * - Single primary CTA
 * - Large numbers, small labels
 * - Premium = controlled absence
 */

// ===== HELPER FUNCTIONS =====

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'God morgen';
  if (hour < 18) return 'God dag';
  return 'God kveld';
};

const getDaysUntil = (date) => {
  if (!date) return null;
  const targetDate = new Date(date);
  const today = new Date();
  const diffTime = targetDate - today;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

// ===== ZONE A COMPONENTS =====

const WelcomeSection = ({ playerName, category }) => (
  <div style={styles.welcomeSection}>
    <p style={styles.greetingText}>{getGreeting()}</p>
    <h1 style={styles.playerName}>{playerName?.split(' ')[0] || 'Spiller'}</h1>
    <p style={styles.categoryText}>Kategori {category || 'B'}</p>
  </div>
);

const QuickStats = ({ sessions, hours, streak }) => (
  <div style={styles.quickStatsRow}>
    <div style={styles.quickStat}>
      <span style={styles.quickStatValue}>{sessions.completed}</span>
      <span style={styles.quickStatLabel}>Økter denne uke</span>
      <span style={styles.quickStatSub}>av {sessions.total}</span>
    </div>
    <div style={styles.quickStatDivider} />
    <div style={styles.quickStat}>
      <span style={styles.quickStatValue}>{hours.current}t</span>
      <span style={styles.quickStatLabel}>Treningstid</span>
      <span style={styles.quickStatSub}>mål: {hours.goal}t</span>
    </div>
    <div style={styles.quickStatDivider} />
    <div style={styles.quickStat}>
      <span style={styles.quickStatValue}>{streak}</span>
      <span style={styles.quickStatLabel}>Streak</span>
      <span style={styles.quickStatSub}>dager på rad</span>
    </div>
  </div>
);

const NextMilestone = ({ tournament, test }) => {
  const tournamentDays = getDaysUntil(tournament?.date);
  const testDays = getDaysUntil(test?.date);

  const showTournament = tournamentDays !== null && (testDays === null || tournamentDays <= testDays);

  if (showTournament && tournamentDays !== null) {
    return (
      <div style={styles.milestoneCard}>
        <div style={styles.milestoneLeft}>
          <div style={styles.milestoneIcon}>
            <Trophy size={20} />
          </div>
          <div>
            <p style={styles.milestoneLabel}>Neste turnering</p>
            <p style={styles.milestoneTitle}>{tournament?.title || 'Ikke planlagt'}</p>
            {tournament?.location && (
              <p style={styles.milestoneLocation}>{tournament.location}</p>
            )}
          </div>
        </div>
        <div style={styles.milestoneRight}>
          <span style={styles.milestoneDays}>{tournamentDays}</span>
          <span style={styles.milestoneDaysLabel}>dager</span>
        </div>
      </div>
    );
  }

  if (testDays !== null) {
    return (
      <div style={styles.milestoneCard}>
        <div style={styles.milestoneLeft}>
          <div style={{ ...styles.milestoneIcon, backgroundColor: 'var(--accent-muted)', color: 'var(--accent)' }}>
            <Target size={20} />
          </div>
          <div>
            <p style={styles.milestoneLabel}>Neste test</p>
            <p style={styles.milestoneTitle}>{test?.title || 'Ikke planlagt'}</p>
            {test?.location && (
              <p style={styles.milestoneLocation}>{test.location}</p>
            )}
          </div>
        </div>
        <div style={styles.milestoneRight}>
          <span style={styles.milestoneDays}>{testDays}</span>
          <span style={styles.milestoneDaysLabel}>dager</span>
        </div>
      </div>
    );
  }

  return null;
};

// ===== ZONE B COMPONENTS =====

const PlanProgress = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div style={styles.progressCard}>
      <div style={styles.progressHeader}>
        <CheckCircle2 size={16} style={{ color: 'var(--accent)' }} />
        <span style={styles.progressTitle}>Fullførte økter</span>
        <span style={styles.progressMeta}>Denne uken</span>
      </div>
      <div style={styles.progressBarContainer}>
        <div style={{ ...styles.progressBar, width: `${percentage}%` }} />
      </div>
      <div style={styles.progressFooter}>
        <span style={styles.progressValue}>{completed}/{total}</span>
        <span style={styles.progressPercent}>{percentage}%</span>
      </div>
    </div>
  );
};

const HoursProgress = ({ hours, goal }) => {
  const percentage = goal > 0 ? Math.round((hours / goal) * 100) : 0;

  return (
    <div style={styles.progressCard}>
      <div style={styles.progressHeader}>
        <Clock size={16} style={{ color: 'var(--accent)' }} />
        <span style={styles.progressTitle}>Timer denne uke</span>
        <span style={styles.progressMeta}>Mål: {goal}t</span>
      </div>
      <div style={styles.hoursDisplay}>
        <span style={styles.hoursValue}>{hours}t</span>
        <div style={styles.hoursBarContainer}>
          <div style={{ ...styles.hoursBar, width: `${Math.min(percentage, 100)}%` }} />
        </div>
      </div>
    </div>
  );
};

// ===== ZONE C COMPONENTS =====

const TasksList = ({ tasks, onToggle, onViewAll }) => {
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.cardHeaderLeft}>
          <Target size={16} style={{ color: 'var(--text-secondary)' }} />
          <span style={styles.cardTitle}>Mine oppgaver</span>
        </div>
        <button style={styles.cardAction} onClick={onViewAll}>
          Se alle <ChevronRight size={14} />
        </button>
      </div>
      {tasks.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Ingen oppgaver</p>
        </div>
      ) : (
        <div style={styles.taskList}>
          {tasks.slice(0, 4).map(task => (
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
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span style={{
                ...styles.taskTitle,
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
              }}>
                {task.title}
              </span>
            </div>
          ))}
        </div>
      )}
      <div style={styles.cardFooterMeta}>
        {completedCount}/{tasks.length} fullført
      </div>
    </div>
  );
};

const NotificationsList = ({ notifications, onViewAll }) => (
  <div style={styles.card}>
    <div style={styles.cardHeader}>
      <div style={styles.cardHeaderLeft}>
        <Bell size={16} style={{ color: 'var(--text-secondary)' }} />
        <span style={styles.cardTitle}>Varslinger</span>
        {notifications.length > 0 && (
          <span style={styles.notificationBadge}>{notifications.length} nye</span>
        )}
      </div>
      <button style={styles.cardAction} onClick={onViewAll}>
        Se alle <ChevronRight size={14} />
      </button>
    </div>
    {notifications.length === 0 ? (
      <div style={styles.emptyState}>
        <p>Ingen nye varslinger</p>
      </div>
    ) : (
      <div style={styles.notificationList}>
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
    )}
  </div>
);

// ===== MAIN DASHBOARD =====

const AKGolfDashboardV3 = () => {
  const navigate = useNavigate();
  const { data: dashboardData, loading } = useDashboard();
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
  const nextTournament = dashboardData?.nextTournament;
  const nextTest = dashboardData?.nextTest;
  const notifications = dashboardData?.notifications || [];

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
        />

        <QuickStats
          sessions={{ completed: stats.sessionsCompleted, total: stats.sessionsTotal }}
          hours={{ current: stats.hoursThisWeek, goal: stats.hoursGoal }}
          streak={stats.streak}
        />

        <NextMilestone
          tournament={nextTournament}
          test={nextTest}
        />

        {/* Primary CTA - Single, prominent */}
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/sessions')}
          leftIcon={<Play size={18} />}
          fullWidth
          style={styles.primaryCTA}
        >
          Start treningsøkt
        </Button>
      </section>

      {/* ZONE B: Progress & Status */}
      <section style={styles.zoneB}>
        <div style={styles.progressRow}>
          <PlanProgress
            completed={stats.sessionsCompleted}
            total={stats.sessionsTotal}
          />
          <HoursProgress
            hours={stats.hoursThisWeek}
            goal={stats.hoursGoal}
          />
        </div>
      </section>

      {/* ZONE C: Follow-up & Signals */}
      <section style={styles.zoneC}>
        <TasksList
          tasks={tasks}
          onToggle={toggleTask}
          onViewAll={() => navigate('/maalsetninger')}
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
    gap: '32px',
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
    gap: '24px',
  },

  welcomeSection: {
    marginBottom: '8px',
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
    margin: '0 0 4px 0',
    letterSpacing: '-0.02em',
  },
  categoryText: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    margin: 0,
  },

  // Quick Stats
  quickStatsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    backgroundColor: 'var(--card)',
    borderRadius: '16px',
    border: '1px solid var(--border-subtle)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  },
  quickStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
  },
  quickStatValue: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontFeatureSettings: '"tnum"',
    lineHeight: 1,
  },
  quickStatLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginTop: '6px',
  },
  quickStatSub: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    marginTop: '2px',
  },
  quickStatDivider: {
    width: '1px',
    height: '40px',
    backgroundColor: 'var(--border-subtle)',
    margin: '0 16px',
  },

  // Milestone Card
  milestoneCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    backgroundColor: 'var(--card)',
    borderRadius: '12px',
    border: '1px solid var(--border-subtle)',
    borderLeft: '4px solid var(--accent)',
  },
  milestoneLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  milestoneIcon: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)',
    borderRadius: '10px',
    flexShrink: 0,
  },
  milestoneLabel: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    margin: '0 0 4px 0',
  },
  milestoneTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '0',
  },
  milestoneLocation: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: '4px 0 0 0',
  },
  milestoneRight: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  milestoneDays: {
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--accent)',
    fontFeatureSettings: '"tnum"',
    lineHeight: 1,
  },
  milestoneDaysLabel: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    marginTop: '4px',
  },

  // Primary CTA
  primaryCTA: {
    marginTop: '8px',
  },

  // Zone B: Progress
  zoneB: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  progressRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  progressCard: {
    padding: '16px 20px',
    backgroundColor: 'var(--card)',
    borderRadius: '12px',
    border: '1px solid var(--border-subtle)',
  },
  progressHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  progressTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    flex: 1,
  },
  progressMeta: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
  },
  progressBarContainer: {
    height: '8px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'var(--accent)',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
  },
  progressValue: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontFeatureSettings: '"tnum"',
  },
  progressPercent: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },

  // Hours display
  hoursDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  hoursValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--accent)',
    fontFeatureSettings: '"tnum"',
    minWidth: '48px',
  },
  hoursBarContainer: {
    flex: 1,
    height: '8px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  hoursBar: {
    height: '100%',
    backgroundColor: 'var(--accent)',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },

  // Zone C: Follow-up
  zoneC: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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
    cursor: 'pointer',
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
    transition: 'all 0.15s ease',
  },
  taskTitle: {
    fontSize: '14px',
    fontWeight: 500,
    transition: 'color 0.15s ease',
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
