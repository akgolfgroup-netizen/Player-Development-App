import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, MapPin, Trophy, Target, CheckCircle2,
  MessageCircle, Award, Flame, TrendingUp,
  Play, Bell, Users, Star, Calendar, Info, AlertCircle, RefreshCw
} from 'lucide-react';
import DagensPlan from '../../components/dashboard/DagensPlan';
import WeatherWidget from '../../components/dashboard/WeatherWidget';
import StrokesGainedWidget from '../../components/dashboard/StrokesGainedWidget';
import { SGJourneyWidget, SkillDNAWidget, BountyBoardWidget } from '../../components/insights';
import { useDashboard } from '../../hooks/useDashboard';
import { useStrokesGained } from '../../hooks/useStrokesGained';
import { useSGJourney, useSkillDNA, useBountyBoard } from '../../hooks/usePlayerInsights';
import { FocusWidget } from '../focus-engine';
import SessionEvaluationWidget from '../sessions/SessionEvaluationWidget';
import { DashboardTemplate } from '../../ui/templates';
import { Button } from '../../ui/primitives';
import Badge from '../../ui/primitives/Badge.primitive';
import Card from '../../ui/primitives/Card';
import StateCard from '../../ui/composites/StateCard';
import { DashboardSkeleton } from '../../ui/skeletons';
import { WidgetHeader, DashboardCard, SkeletonLoader } from '../../ui/widgets';

// ===== SKELETON COMPONENTS (now using shared widgets) =====

const StatsSkeleton = () => <SkeletonLoader variant="stats-grid" />;
const TasksSkeleton = () => <SkeletonLoader variant="tasks" count={4} />;
const CountdownSkeleton = () => <SkeletonLoader variant="countdown" />;

// ===== COUNTDOWN WIDGET =====
const CountdownWidget = ({ title, date, type, location }) => {
  const targetDate = new Date(date);
  const today = new Date();
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const getIcon = () => {
    switch (type) {
      case 'tournament': return <Trophy size={20} style={{ color: 'var(--warning)' }} />;
      case 'test': return <Target size={20} style={{ color: 'var(--accent)' }} />;
      default: return <Calendar size={20} style={{ color: 'var(--accent)' }} />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'tournament': return 'linear-gradient(to bottom right, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))';
      case 'test': return 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))';
      default: return 'var(--bg-secondary)';
    }
  };

  return (
    <div style={{
      padding: '16px',
      borderRadius: 'var(--radius-lg)',
      background: getBgColor(),
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          {getIcon()}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: 0,
          }}>
            {type === 'tournament' ? 'Neste turnering' : 'Neste test'}
          </p>
          <p style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginTop: '2px',
            margin: '2px 0 0 0',
          }}>
            {title}
          </p>
          {location && (
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '4px',
              margin: '4px 0 0 0',
            }}>
              <MapPin size={12} /> {location}
            </p>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--accent)',
            margin: 0,
          }}>
            {diffDays}
          </p>
          <p style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            margin: 0,
          }}>
            dager
          </p>
        </div>
      </div>
    </div>
  );
};

// ===== TASKS WIDGET =====
const TasksWidget = ({ tasks, onToggle, onViewAll }) => {
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <DashboardCard padding="lg">
      <WidgetHeader
        title="Mine oppgaver"
        icon={CheckCircle2}
        action={onViewAll}
        actionLabel={`${completedCount}/${tasks.length} fullført`}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tasks.map(task => (
          <div
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: task.completed ? 'rgba(34, 197, 94, 0.1)' : 'var(--bg-secondary)',
            }}
            onClick={() => onToggle(task.id)}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: `2px solid ${task.completed ? 'var(--success)' : 'var(--border-default)'}`,
              backgroundColor: task.completed ? 'var(--success)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              {task.completed && (
                <svg style={{ width: '12px', height: '12px', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: '14px',
                color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                textDecoration: task.completed ? 'line-through' : 'none',
                margin: 0,
              }}>
                {task.title}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: 0 }}>
                {task.area}
              </p>
            </div>
            {task.priority === 'high' && !task.completed && (
              <Badge variant="error" size="sm" pill>Viktig</Badge>
            )}
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

// ===== BREAKING POINTS WIDGET =====
const BreakingPointsWidget = ({ points, onViewAll }) => {
  if (!points || points.length === 0) {
    return (
      <DashboardCard padding="lg">
        <WidgetHeader title="Breaking Points" icon={Target} />
        <StateCard
          variant="empty"
          title="Ingen aktive breaking points"
          description="Breaking points legges til når du identifiserer områder som trenger fokus."
          compact
        />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard padding="lg">
      <WidgetHeader title="Breaking Points" icon={Target} action={onViewAll} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {points.map((point) => (
          <div key={point.id} style={{
            padding: '12px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Badge variant="accent" size="sm">{point.area}</Badge>
                  <Badge
                    variant={point.priority === 'high' ? 'error' : point.priority === 'medium' ? 'warning' : 'neutral'}
                    size="sm"
                  >
                    {point.priority}
                  </Badge>
                </div>
                <p style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}>
                  {point.title}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                flex: 1,
                height: '8px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '4px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  backgroundColor: 'var(--accent)',
                  borderRadius: '4px',
                  transition: 'all 0.3s',
                  width: `${point.progress}%`,
                }} />
              </div>
              <span style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
              }}>
                {point.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

// ===== SESSION CARD WITH LOCATION =====
const SessionCardCompact = ({ session, onClick }) => {
  const statusColors = {
    completed: 'var(--success)',
    current: 'var(--accent)',
    upcoming: 'var(--text-secondary)',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onClick={onClick}
    >
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: statusColors[session.status] || 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Play size={20} style={{ color: 'white' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--text-primary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          margin: 0,
        }}>
          {session.title}
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '12px',
          color: 'var(--text-secondary)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> {session.time}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} /> {session.location}
          </span>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{
          fontSize: '11px',
          padding: '4px 8px',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--accent)',
          fontWeight: 500,
        }}>
          {session.duration} min
        </span>
      </div>
    </div>
  );
};

// ===== MAIN DASHBOARD COMPONENT =====
const AKGolfDashboard = () => {
  const navigate = useNavigate();
  const { data: dashboardData, loading, error, refetch } = useDashboard();
  const { data: sgData, loading: sgLoading, error: sgError } = useStrokesGained();

  // Player Insights hooks
  const { data: sgJourneyData, loading: sgJourneyLoading, error: sgJourneyError } = useSGJourney();
  const { data: skillDNAData, loading: skillDNALoading, error: skillDNAError } = useSkillDNA();
  const { data: bountyData, loading: bountyLoading, error: bountyError, activateBounty, updateProgress } = useBountyBoard();

  const [tasks, setTasks] = useState([]);

  // Update tasks when data loads
  React.useEffect(() => {
    if (dashboardData?.tasks) {
      setTasks(dashboardData.tasks);
    }
  }, [dashboardData]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'God morgen';
    if (hour < 18) return 'God dag';
    return 'God kveld';
  };

  // Navigation handlers for "Se alle" buttons
  const handleViewTasks = () => navigate('/maalsetninger');
  const handleViewBreakingPoints = () => navigate('/utvikling/breaking-points');

  // Show loading skeletons
  if (loading) {
    return <DashboardSkeleton />;
  }

  // Show error state (only if no data at all)
  if (error && !dashboardData) {
    return (
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
          }}>
            Dashboard
          </h1>
        </div>
        <StateCard
          variant="error"
          icon={AlertCircle}
          title="Kunne ikke laste dashboard"
          description={error}
          action={
            <Button variant="primary" size="sm" onClick={refetch} leftIcon={<RefreshCw size={14} />}>
              Prøv igjen
            </Button>
          }
        />
      </div>
    );
  }

  // Extract data with fallbacks
  const player = dashboardData?.player || { name: 'Spiller', category: 'B' };
  const trainingStats = dashboardData?.stats || { sessionsCompleted: 0, sessionsTotal: 12, hoursThisWeek: 0, hoursGoal: 20, streak: 0 };
  const nextTournament = dashboardData?.nextTournament;
  const nextTest = dashboardData?.nextTest;
  const breakingPoints = dashboardData?.breakingPoints || [];
  const calendarEvents = dashboardData?.calendarEvents || [];
  const upcomingSessions = dashboardData?.upcomingSessions || [];
  const notifications = dashboardData?.notifications || [];
  const messages = dashboardData?.messages || [];

  // Transform data for DashboardTemplate
  const stats = [
    {
      id: 'sessions',
      label: 'Økter fullført',
      value: trainingStats.sessionsCompleted,
      change: 12,
      trend: 'up',
      icon: <CheckCircle2 size={20} style={{ color: 'var(--accent)' }} />,
    },
    {
      id: 'hours',
      label: 'Timer denne uke',
      value: `${trainingStats.hoursThisWeek}t`,
      change: 5,
      trend: 'up',
      icon: <Clock size={20} style={{ color: 'var(--accent)' }} />,
    },
    {
      id: 'streak',
      label: 'Dager i strekk',
      value: trainingStats.streak,
      icon: <Flame size={20} style={{ color: 'var(--warning)' }} />,
    },
  ];

  // Transform notifications and messages into activities
  const activities = [
    ...notifications.slice(0, 5).map(notif => ({
      id: `notif-${notif.id}`,
      title: notif.title,
      description: notif.message,
      timestamp: notif.time || new Date().toISOString(),
      type: notif.type === 'achievement' ? 'success' : 'info',
    })),
    ...messages.slice(0, 3).map(msg => ({
      id: `msg-${msg.id}`,
      title: msg.from,
      description: msg.preview,
      timestamp: msg.time || new Date().toISOString(),
      type: 'info',
      userName: msg.from,
    })),
  ];

  // Create tabs for different sections
  const tabs = [
    {
      id: 'overview',
      label: 'Oversikt',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Countdown Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            <DashboardCard padding="md">
              <CountdownWidget
                title={nextTournament?.title || 'Ingen kommende turnering'}
                date={nextTournament?.date || '2026-12-31'}
                type="tournament"
                location={nextTournament?.location || ''}
              />
            </DashboardCard>
            <DashboardCard padding="md">
              <CountdownWidget
                title={nextTest?.title || 'Ingen kommende test'}
                date={nextTest?.date || '2026-12-31'}
                type="test"
                location={nextTest?.location || 'AK Golf Academy'}
              />
            </DashboardCard>
          </div>

          {/* Focus Widget */}
          <FocusWidget />

          {/* Strokes Gained Widget */}
          <StrokesGainedWidget
            data={sgData}
            loading={sgLoading}
            error={sgError}
            onViewDetails={() => navigate('/stats/strokes-gained')}
          />

          {/* Player Insights Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '20px',
          }}>
            {/* SG Journey Widget */}
            <SGJourneyWidget
              data={sgJourneyData}
              loading={sgJourneyLoading}
              error={sgJourneyError}
              onViewDetails={() => navigate('/insights/sg-journey')}
            />

            {/* Skill DNA Widget */}
            <SkillDNAWidget
              data={skillDNAData}
              loading={skillDNALoading}
              error={skillDNAError}
              onViewDetails={() => navigate('/insights/skill-dna')}
            />
          </div>

          {/* Bounty Board Widget - Full width */}
          <BountyBoardWidget
            data={bountyData}
            loading={bountyLoading}
            error={bountyError}
            onActivateBounty={activateBounty}
            onUpdateProgress={updateProgress}
            onViewDetails={() => navigate('/insights/bounties')}
          />

          {/* Weather Widget */}
          <WeatherWidget showForecast={true} />

          {/* Calendar Day View */}
          <DagensPlan events={calendarEvents} />

          {/* Upcoming Sessions */}
          <DashboardCard padding="lg">
            <WidgetHeader
              title="Dagens økter"
              icon={Play}
              action={() => navigate('/kalender')}
            />
            {upcomingSessions.length === 0 ? (
              <StateCard
                variant="empty"
                title="Ingen økter i dag"
                description="Du har ingen planlagte treningsøkter i dag."
                action={
                  <Button variant="ghost" size="sm" onClick={() => navigate('/kalender')}>
                    Gå til kalender
                  </Button>
                }
                compact
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {upcomingSessions.map(session => (
                  <SessionCardCompact
                    key={session.id}
                    session={session}
                    onClick={() => navigate(`/session/${session.id}`)}
                  />
                ))}
              </div>
            )}
          </DashboardCard>
        </div>
      ),
    },
    {
      id: 'tasks',
      label: 'Oppgaver',
      badge: tasks.filter(t => !t.completed).length,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <TasksWidget tasks={tasks} onToggle={toggleTask} onViewAll={handleViewTasks} />
          <BreakingPointsWidget
            points={breakingPoints}
            onViewAll={handleViewBreakingPoints}
          />
          <SessionEvaluationWidget />
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Error banner if API failed but we have fallback data */}
      {error && (
        <Card variant="default" padding="md" style={{ marginBottom: '16px', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <AlertCircle size={20} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                marginBottom: '4px',
                margin: '0 0 4px 0',
              }}>
                Kunne ikke laste ny data
              </p>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                margin: 0,
              }}>
                Viser tidligere data. Noe informasjon kan være utdatert.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={refetch} leftIcon={<RefreshCw size={14} />}>
              Prøv igjen
            </Button>
          </div>
        </Card>
      )}

      <DashboardTemplate
        title={`${getGreeting()}, ${player.name.split(' ')[0]}`}
        subtitle={`Kategori ${player.category} · Her er din oversikt for i dag`}
        user={{
          name: player.name,
          avatar: player.avatar,
          role: `Kategori ${player.category}`,
        }}
        stats={stats}
        activities={activities}
        tabs={tabs}
        showActivity={activities.length > 0}
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/sessions')}
            leftIcon={<Play size={16} />}
          >
            Start økt
          </Button>
        }
      />
    </div>
  );
};

export default AKGolfDashboard;
