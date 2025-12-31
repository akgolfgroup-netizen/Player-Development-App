// @ts-nocheck
/**
 * Dashboard V5 - AK Golf Academy
 *
 * Clean, modern player dashboard using the design system.
 * Mobile-first responsive layout with semantic tokens.
 *
 * Zones:
 * - Header: Welcome + Profile
 * - Stats: Quick KPIs in grid
 * - Sessions: Today's training schedule
 * - Progress: Goals + Achievements
 * - Quick Actions: Navigation shortcuts
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Target,
  Trophy,
  ChevronRight,
  Play,
  TrendingUp,
  Flame,
  MapPin,
  Bell,
  MessageSquare,
  Plus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// Hooks
import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../contexts/AuthContext';

// UI Components
import Button from '../../ui/primitives/Button';
import Badge from '../../ui/primitives/Badge.primitive';
import StateCard from '../../ui/composites/StateCard';
import { PageTitle, SectionTitle, CardTitle } from '../../components/typography';

// ============================================================================
// TYPES
// ============================================================================

interface QuickStat {
  id: string;
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
  color?: string;
}

interface Session {
  id: string;
  title: string;
  time: string;
  location: string;
  duration: number;
  status?: 'scheduled' | 'in_progress' | 'completed';
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Welcome Header with player info
 */
const WelcomeHeader: React.FC<{
  playerName: string;
  category: string;
  greeting: string;
}> = ({ playerName, category, greeting }) => (
  <div style={styles.welcomeHeader}>
    <div style={styles.welcomeText}>
      <span style={styles.greeting}>{greeting}</span>
      <PageTitle style={styles.playerName}>
        {playerName.split(' ')[0]}
      </PageTitle>
    </div>
    <Badge variant="accent" size="md">
      Kategori {category}
    </Badge>
  </div>
);

/**
 * Stats Grid - Key metrics at a glance
 */
const StatsGrid: React.FC<{ stats: QuickStat[] }> = ({ stats }) => (
  <div style={styles.statsGrid}>
    {stats.map((stat) => (
      <div key={stat.id} style={styles.statCard}>
        <div style={styles.statIcon}>
          {stat.icon}
        </div>
        <div style={styles.statContent}>
          <span style={styles.statValue}>{stat.value}</span>
          <span style={styles.statLabel}>{stat.label}</span>
        </div>
        {stat.change && (
          <span style={{
            ...styles.statChange,
            color: stat.trend === 'up' ? 'var(--success)' :
                   stat.trend === 'down' ? 'var(--error)' : 'var(--text-secondary)',
          }}>
            {stat.change}
          </span>
        )}
      </div>
    ))}
  </div>
);

/**
 * Today's Sessions Card
 */
const TodaysSessions: React.FC<{
  sessions: Session[];
  onSessionClick: (id: string) => void;
  onAddSession: () => void;
}> = ({ sessions, onSessionClick, onAddSession }) => (
  <div style={styles.card}>
    <div style={styles.cardHeader}>
      <div style={styles.cardTitleRow}>
        <Calendar size={20} style={{ color: 'var(--accent)' }} />
        <CardTitle>Dagens økter</CardTitle>
      </div>
      <Button variant="ghost" size="sm" onClick={onAddSession}>
        <Plus size={16} />
      </Button>
    </div>

    {sessions.length === 0 ? (
      <div style={styles.emptyState}>
        <p style={styles.emptyText}>Ingen økter planlagt i dag</p>
        <Button variant="secondary" size="sm" leftIcon={<Plus size={16} />} onClick={onAddSession}>
          Planlegg økt
        </Button>
      </div>
    ) : (
      <div style={styles.sessionList}>
        {sessions.map((session, index) => (
          <div
            key={session.id}
            style={{
              ...styles.sessionItem,
              borderTop: index > 0 ? '1px solid var(--border-subtle)' : 'none',
            }}
            onClick={() => onSessionClick(session.id)}
          >
            <div style={styles.sessionTime}>
              <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
              <span>{session.time}</span>
            </div>
            <div style={styles.sessionInfo}>
              <span style={styles.sessionTitle}>{session.title}</span>
              <span style={styles.sessionMeta}>
                <MapPin size={12} />
                {session.location} · {session.duration} min
              </span>
            </div>
            <div style={styles.sessionStatus}>
              {session.status === 'completed' ? (
                <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
              ) : session.status === 'in_progress' ? (
                <Play size={20} style={{ color: 'var(--accent)' }} />
              ) : (
                <ChevronRight size={20} style={{ color: 'var(--text-secondary)' }} />
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

/**
 * Goals Progress Card
 */
const GoalsProgress: React.FC<{
  tasks: Array<{ id: string; title: string; completed: boolean; priority: string }>;
  onViewAll: () => void;
}> = ({ tasks, onViewAll }) => {
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.cardTitleRow}>
          <Target size={20} style={{ color: 'var(--accent)' }} />
          <CardTitle>Ukens mål</CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          Se alle
        </Button>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <span style={styles.progressText}>{completedCount}/{tasks.length} fullført</span>
      </div>

      {/* Task List (show top 3) */}
      <div style={styles.taskList}>
        {tasks.slice(0, 3).map((task) => (
          <div key={task.id} style={styles.taskItem}>
            <div style={{
              ...styles.taskCheckbox,
              backgroundColor: task.completed ? 'var(--success)' : 'transparent',
              borderColor: task.completed ? 'var(--success)' : 'var(--border-default)',
            }}>
              {task.completed && <CheckCircle2 size={12} style={{ color: 'white' }} />}
            </div>
            <span style={{
              ...styles.taskTitle,
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
            }}>
              {task.title}
            </span>
            {task.priority === 'high' && !task.completed && (
              <AlertCircle size={14} style={{ color: 'var(--warning)' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Quick Actions Grid
 */
const QuickActions: React.FC<{
  actions: QuickAction[];
  onActionClick: (href: string) => void;
}> = ({ actions, onActionClick }) => (
  <div style={styles.actionsGrid}>
    {actions.map((action) => (
      <button
        key={action.id}
        style={styles.actionButton}
        onClick={() => onActionClick(action.href)}
      >
        <div style={{ ...styles.actionIcon, backgroundColor: action.color }}>
          {action.icon}
        </div>
        <span style={styles.actionLabel}>{action.label}</span>
      </button>
    ))}
  </div>
);

/**
 * Countdown Card (Tournament/Test)
 */
const CountdownCard: React.FC<{
  title: string;
  eventName: string;
  date: string;
  location: string;
  icon: React.ReactNode;
  onView: () => void;
}> = ({ title, eventName, date, location, icon, onView }) => {
  const daysUntil = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div style={styles.countdownCard} onClick={onView}>
      <div style={styles.countdownHeader}>
        {icon}
        <span style={styles.countdownTitle}>{title}</span>
      </div>
      <div style={styles.countdownContent}>
        <span style={styles.countdownDays}>{daysUntil}</span>
        <span style={styles.countdownLabel}>dager</span>
      </div>
      <div style={styles.countdownEvent}>
        <span style={styles.countdownEventName}>{eventName}</span>
        <span style={styles.countdownLocation}>
          <MapPin size={12} /> {location}
        </span>
      </div>
    </div>
  );
};

/**
 * Messages Preview
 */
const MessagesPreview: React.FC<{
  messages: Array<{ id: string; from: string; preview: string; time: string; read: boolean }>;
  unreadCount: number;
  onViewAll: () => void;
}> = ({ messages, unreadCount, onViewAll }) => (
  <div style={styles.card}>
    <div style={styles.cardHeader}>
      <div style={styles.cardTitleRow}>
        <MessageSquare size={20} style={{ color: 'var(--accent)' }} />
        <CardTitle>Meldinger</CardTitle>
        {unreadCount > 0 && (
          <Badge variant="error" size="sm">{unreadCount}</Badge>
        )}
      </div>
      <Button variant="ghost" size="sm" onClick={onViewAll}>
        Se alle
      </Button>
    </div>

    <div style={styles.messageList}>
      {messages.slice(0, 2).map((msg) => (
        <div key={msg.id} style={styles.messageItem}>
          <div style={styles.messageAvatar}>
            {msg.from.charAt(0)}
          </div>
          <div style={styles.messageContent}>
            <span style={{
              ...styles.messageSender,
              fontWeight: msg.read ? 500 : 600,
            }}>
              {msg.from}
            </span>
            <span style={styles.messagePreview}>{msg.preview}</span>
          </div>
          <span style={styles.messageTime}>{msg.time}</span>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DashboardV5() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, loading, error, refetch } = useDashboard();

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'God morgen';
    if (hour < 17) return 'God ettermiddag';
    return 'God kveld';
  };

  // Build quick stats from data
  const quickStats: QuickStat[] = data ? [
    {
      id: 'streak',
      label: 'Streak',
      value: data.stats?.streak || 0,
      icon: <Flame size={20} style={{ color: 'var(--warning)' }} />,
      trend: 'up',
      change: '+2',
    },
    {
      id: 'sessions',
      label: 'Økter denne uka',
      value: `${data.stats?.sessionsCompleted || 0}/${data.stats?.sessionsTotal || 12}`,
      icon: <Calendar size={20} style={{ color: 'var(--accent)' }} />,
    },
    {
      id: 'hours',
      label: 'Timer denne uka',
      value: data.stats?.hoursThisWeek?.toFixed(1) || '0',
      icon: <Clock size={20} style={{ color: 'var(--success)' }} />,
    },
    {
      id: 'level',
      label: 'Nivå',
      value: data.level || 1,
      icon: <TrendingUp size={20} style={{ color: 'var(--text-brand)' }} />,
    },
  ] : [];

  // Quick actions - aligned with 4+1 navigation structure
  const quickActions: QuickAction[] = [
    { id: 'log-training', label: 'Logg trening', icon: <Play size={20} color="white" />, href: '/trening/logg', color: 'var(--success)' },
    { id: 'take-test', label: 'Ta test', icon: <Target size={20} color="white" />, href: '/testprotokoll', color: 'var(--accent)' },
    { id: 'view-stats', label: 'Statistikk', icon: <TrendingUp size={20} color="white" />, href: '/stats', color: 'var(--text-brand)' },
    { id: 'calendar', label: 'Kalender', icon: <Calendar size={20} color="white" />, href: '/kalender', color: 'var(--warning)' },
  ];

  // Loading state
  if (loading && !data) {
    return (
      <div style={styles.container}>
        <StateCard variant="loading" title="Laster dashboard..." />
      </div>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <div style={styles.container}>
        <StateCard
          variant="error"
          title="Kunne ikke laste dashboard"
          description={error}
          action={
            <Button variant="primary" onClick={refetch}>
              Prøv igjen
            </Button>
          }
        />
      </div>
    );
  }

  const playerName = data?.player?.name || user?.name || 'Spiller';
  const playerCategory = data?.player?.category || user?.category || 'B';
  const sessions = data?.upcomingSessions || [];
  const tasks = data?.tasks || [];
  const messages = data?.messages || [];
  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div style={styles.container}>
      {/* Welcome Header */}
      <WelcomeHeader
        playerName={playerName}
        category={playerCategory}
        greeting={getGreeting()}
      />

      {/* Stats Grid */}
      <StatsGrid stats={quickStats} />

      {/* Quick Actions */}
      <section style={styles.section}>
        <SectionTitle style={styles.sectionTitle}>Hurtigvalg</SectionTitle>
        <QuickActions
          actions={quickActions}
          onActionClick={(href) => navigate(href)}
        />
      </section>

      {/* Countdowns Row */}
      {(data?.nextTournament || data?.nextTest) && (
        <section style={styles.section}>
          <div style={styles.countdownRow}>
            {data?.nextTournament && (
              <CountdownCard
                title="Neste turnering"
                eventName={data.nextTournament.title}
                date={data.nextTournament.date}
                location={data.nextTournament.location}
                icon={<Trophy size={16} style={{ color: 'var(--warning)' }} />}
                onView={() => navigate('/turneringer')}
              />
            )}
            {data?.nextTest && (
              <CountdownCard
                title="Neste test"
                eventName={data.nextTest.title}
                date={data.nextTest.date}
                location={data.nextTest.location}
                icon={<Target size={16} style={{ color: 'var(--accent)' }} />}
                onView={() => navigate('/testing')}
              />
            )}
          </div>
        </section>
      )}

      {/* Today's Sessions */}
      <section style={styles.section}>
        <TodaysSessions
          sessions={sessions}
          onSessionClick={(id) => navigate(`/sessions/${id}`)}
          onAddSession={() => navigate('/logg-trening')}
        />
      </section>

      {/* Goals Progress */}
      <section style={styles.section}>
        <GoalsProgress
          tasks={tasks}
          onViewAll={() => navigate('/goals')}
        />
      </section>

      {/* Messages Preview */}
      <section style={styles.section}>
        <MessagesPreview
          messages={messages}
          unreadCount={unreadCount}
          onViewAll={() => navigate('/meldinger')}
        />
      </section>
    </div>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-5)',
    padding: 'var(--spacing-4)',
    maxWidth: '600px',
    margin: '0 auto',
  },

  // Welcome Header
  welcomeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--spacing-2)',
  },
  welcomeText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  greeting: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
  },
  playerName: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },

  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--spacing-3)',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-4)',
    backgroundColor: 'var(--card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
  },
  statIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--background-surface)',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  statValue: {
    fontSize: 'var(--font-size-title3)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  statLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
  },
  statChange: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 600,
  },

  // Section
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3)',
  },
  sectionTitle: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },

  // Card
  card: {
    backgroundColor: 'var(--card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--spacing-4)',
    borderBottom: '1px solid var(--border-subtle)',
  },
  cardTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },

  // Sessions
  sessionList: {
    display: 'flex',
    flexDirection: 'column',
  },
  sessionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-4)',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  sessionTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    minWidth: '60px',
  },
  sessionInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  sessionTitle: {
    fontSize: 'var(--font-size-body)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  sessionMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
  },
  sessionStatus: {
    display: 'flex',
    alignItems: 'center',
  },

  // Empty State
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-6)',
  },
  emptyText: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-secondary)',
    margin: 0,
  },

  // Progress
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-4)',
    paddingTop: 0,
  },
  progressBar: {
    flex: 1,
    height: '8px',
    backgroundColor: 'var(--background-surface)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--success)',
    borderRadius: 'var(--radius-full)',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
  },

  // Tasks
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 var(--spacing-4) var(--spacing-4)',
    gap: 'var(--spacing-2)',
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
  },
  taskCheckbox: {
    width: '20px',
    height: '20px',
    borderRadius: 'var(--radius-sm)',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskTitle: {
    flex: 1,
    fontSize: 'var(--font-size-footnote)',
  },

  // Quick Actions
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 'var(--spacing-3)',
  },
  actionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    padding: 'var(--spacing-3)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: 'var(--radius-md)',
    transition: 'background-color 0.2s',
  },
  actionIcon: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },

  // Countdown
  countdownRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--spacing-3)',
  },
  countdownCard: {
    backgroundColor: 'var(--card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: 'var(--spacing-4)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  countdownHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
    marginBottom: 'var(--spacing-2)',
  },
  countdownTitle: {
    fontSize: 'var(--font-size-caption1)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  },
  countdownContent: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    marginBottom: 'var(--spacing-2)',
  },
  countdownDays: {
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1,
  },
  countdownLabel: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
  },
  countdownEvent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  countdownEventName: {
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  countdownLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-secondary)',
  },

  // Messages
  messageList: {
    display: 'flex',
    flexDirection: 'column',
  },
  messageItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3)',
    padding: 'var(--spacing-4)',
    borderTop: '1px solid var(--border-subtle)',
  },
  messageAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--accent)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--font-size-footnote)',
    fontWeight: 600,
  },
  messageContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  messageSender: {
    fontSize: 'var(--font-size-footnote)',
    color: 'var(--text-primary)',
  },
  messagePreview: {
    fontSize: 'var(--font-size-caption1)',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  messageTime: {
    fontSize: 'var(--font-size-caption2)',
    color: 'var(--text-tertiary)',
    whiteSpace: 'nowrap',
  },
};
