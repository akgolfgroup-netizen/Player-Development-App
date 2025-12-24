import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, MapPin, Trophy, Target, CheckCircle2,
  MessageCircle, Award, Flame, TrendingUp, ChevronRight,
  Play, Bell, Users, Star, Calendar, Info, AlertCircle, RefreshCw
} from 'lucide-react';
import DagensPlan from '../../components/dashboard/DagensPlan';
import { useDashboard } from '../../hooks/useDashboard';
import SessionEvaluationWidget from '../sessions/SessionEvaluationWidget';
import { DashboardTemplate } from '../../ui/templates';
import { Button } from '../../ui/primitives';

// ===== SKELETON COMPONENTS =====

const SkeletonPulse = ({ className = '' }) => (
  <div className={`animate-pulse bg-ak-mist rounded ${className}`} />
);

const CardSkeleton = ({ children }) => (
  <div className="bg-white rounded-xl border border-ak-mist p-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
    {children}
  </div>
);

const StatsSkeleton = () => (
  <CardSkeleton>
    <SkeletonPulse className="h-5 w-32 mb-4" />
    <div className="grid grid-cols-3 gap-4 mb-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="text-center p-3 bg-ak-snow rounded-xl">
          <SkeletonPulse className="h-8 w-12 mx-auto mb-2" />
          <SkeletonPulse className="h-3 w-16 mx-auto" />
        </div>
      ))}
    </div>
    <div className="space-y-3">
      <SkeletonPulse className="h-2 w-full rounded-full" />
      <SkeletonPulse className="h-2 w-full rounded-full" />
    </div>
  </CardSkeleton>
);

const TasksSkeleton = () => (
  <CardSkeleton>
    <SkeletonPulse className="h-5 w-28 mb-4" />
    <div className="space-y-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-3 p-3 bg-ak-snow rounded-lg">
          <SkeletonPulse className="h-5 w-5 rounded-full" />
          <div className="flex-1">
            <SkeletonPulse className="h-4 w-3/4 mb-1" />
            <SkeletonPulse className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  </CardSkeleton>
);

const CountdownSkeleton = () => (
  <CardSkeleton>
    <div className="flex items-start gap-3">
      <SkeletonPulse className="h-10 w-10 rounded-lg" />
      <div className="flex-1">
        <SkeletonPulse className="h-3 w-20 mb-2" />
        <SkeletonPulse className="h-4 w-32 mb-1" />
        <SkeletonPulse className="h-3 w-24" />
      </div>
      <div className="text-right">
        <SkeletonPulse className="h-8 w-10 mb-1" />
        <SkeletonPulse className="h-3 w-8" />
      </div>
    </div>
  </CardSkeleton>
);

// ===== ERROR COMPONENT =====

const ErrorState = ({ message, onRetry }) => (
  <div className="bg-ak-error/10 border border-ak-error/20 rounded-xl p-6 text-center">
    <AlertCircle size={32} className="text-ak-error mx-auto mb-3" />
    <p className="text-[14px] text-ak-charcoal font-medium mb-2">Noe gikk galt</p>
    <p className="text-[13px] text-ak-steel mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-ak-primary text-white rounded-lg text-[13px] font-medium hover:bg-ak-primary-light transition-colors"
      >
        <RefreshCw size={14} />
        Prøv igjen
      </button>
    )}
  </div>
);

// ===== DASHBOARD WIDGETS =====

// Card wrapper component
const Card = ({ children, className = '', onClick }) => (
  <div
    className={`bg-white rounded-xl border border-ak-mist ${onClick ? 'cursor-pointer hover:border-ak-primary/30 transition-all' : ''} ${className}`}
    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
    onClick={onClick}
  >
    {children}
  </div>
);

// Widget Header
const WidgetHeader = ({ title, action, actionLabel = 'Se alle', icon: Icon }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      {Icon && <Icon size={18} className="text-ak-primary" />}
      <h3 className="text-[15px] font-semibold text-ak-charcoal">{title}</h3>
    </div>
    {action && (
      <button
        onClick={action}
        className="text-[13px] text-ak-primary font-medium hover:underline flex items-center gap-1"
      >
        {actionLabel} <ChevronRight size={14} />
      </button>
    )}
  </div>
);

// ===== COUNTDOWN WIDGET =====
const CountdownWidget = ({ title, date, type, location }) => {
  const targetDate = new Date(date);
  const today = new Date();
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const getIcon = () => {
    switch (type) {
      case 'tournament': return <Trophy size={20} className="text-ak-gold" />;
      case 'test': return <Target size={20} className="text-ak-primary" />;
      default: return <Calendar size={20} className="text-ak-primary" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'tournament': return 'bg-gradient-to-br from-ak-gold/10 to-ak-gold/5';
      case 'test': return 'bg-gradient-to-br from-ak-primary/10 to-ak-primary/5';
      default: return 'bg-ak-snow';
    }
  };

  return (
    <div className={`p-4 rounded-xl ${getBgColor()}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-medium text-ak-steel uppercase tracking-wide">
            {type === 'tournament' ? 'Neste turnering' : 'Neste test'}
          </p>
          <p className="text-[14px] font-semibold text-ak-charcoal mt-0.5">{title}</p>
          {location && (
            <p className="text-[12px] text-ak-steel flex items-center gap-1 mt-1">
              <MapPin size={12} /> {location}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-[28px] font-bold text-ak-primary">{diffDays}</p>
          <p className="text-[11px] text-ak-steel">dager</p>
        </div>
      </div>
    </div>
  );
};

// ===== TASKS WIDGET =====
const TasksWidget = ({ tasks, onToggle, onViewAll }) => {
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <Card className="p-5">
      <WidgetHeader
        title="Mine oppgaver"
        icon={CheckCircle2}
        action={onViewAll}
        actionLabel={`${completedCount}/${tasks.length} fullført`}
      />

      <div className="space-y-2">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
              task.completed ? 'bg-ak-success/10' : 'bg-ak-snow hover:bg-ak-mist'
            }`}
            onClick={() => onToggle(task.id)}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              task.completed
                ? 'bg-ak-success border-ak-success'
                : 'border-ak-mist hover:border-ak-primary'
            }`}>
              {task.completed && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className={`text-[14px] ${task.completed ? 'text-ak-steel line-through' : 'text-ak-charcoal'}`}>
                {task.title}
              </p>
              <p className="text-[11px] text-ak-steel">{task.area}</p>
            </div>
            {task.priority === 'high' && !task.completed && (
              <span className="px-2 py-0.5 bg-ak-error/10 text-ak-error text-[10px] font-medium rounded-full">
                Viktig
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

// ===== BREAKING POINTS WIDGET =====
const BreakingPointsWidget = ({ points, onViewAll }) => {
  if (!points || points.length === 0) {
    return (
      <Card className="p-5">
        <WidgetHeader title="Breaking Points" icon={Target} />
        <div className="text-center py-6">
          <Info size={24} className="text-ak-mist mx-auto mb-2" />
          <p className="text-[13px] text-ak-steel">Ingen aktive breaking points</p>
        </div>
      </Card>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-ak-error';
      case 'medium': return 'text-ak-warning';
      default: return 'text-ak-steel';
    }
  };

  return (
    <Card className="p-5">
      <WidgetHeader title="Breaking Points" icon={Target} action={onViewAll} />

      <div className="space-y-3">
        {points.map((point) => (
          <div key={point.id} className="p-3 bg-ak-snow rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] px-2 py-0.5 bg-ak-primary/10 text-ak-primary rounded">
                    {point.area}
                  </span>
                  <span className={`text-[11px] font-medium ${getPriorityColor(point.priority)}`}>
                    {point.priority}
                  </span>
                </div>
                <p className="text-[13px] font-medium text-ak-charcoal">{point.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-ak-mist rounded-full overflow-hidden">
                <div
                  className="h-full bg-ak-primary rounded-full transition-all"
                  style={{ width: `${point.progress}%` }}
                />
              </div>
              <span className="text-[11px] text-ak-steel whitespace-nowrap">
                {point.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ===== SESSION CARD WITH LOCATION =====
const SessionCardCompact = ({ session, onClick }) => {
  const statusColors = {
    completed: 'bg-ak-success',
    current: 'bg-ak-primary',
    upcoming: 'bg-ak-steel',
  };

  return (
    <div
      className="flex items-center gap-3 p-3 bg-ak-snow rounded-xl cursor-pointer hover:bg-ak-mist transition-all"
      onClick={onClick}
    >
      <div className={`w-12 h-12 rounded-lg ${statusColors[session.status] || 'bg-ak-primary'} flex items-center justify-center`}>
        <Play size={20} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-ak-charcoal truncate">{session.title}</p>
        <div className="flex items-center gap-3 text-[12px] text-ak-steel">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {session.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {session.location}
          </span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-[11px] px-2 py-1 bg-white rounded-lg text-ak-primary font-medium">
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
    return (
      <div style={{ fontFamily: '"Inter", -apple-system, system-ui, sans-serif' }}>
        <div className="mb-6">
          <SkeletonPulse className="h-8 w-64 mb-2" />
          <SkeletonPulse className="h-5 w-48" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-5 order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CountdownSkeleton />
              <CountdownSkeleton />
            </div>
            <CardSkeleton>
              <SkeletonPulse className="h-5 w-24 mb-4" />
              <SkeletonPulse className="h-[400px] w-full rounded-lg" />
            </CardSkeleton>
          </div>

          <div className="lg:col-span-4 space-y-5 order-1 lg:order-2">
            <StatsSkeleton />
            <TasksSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !dashboardData) {
    return (
      <div style={{ fontFamily: '"Inter", -apple-system, system-ui, sans-serif' }}>
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-ak-charcoal">Dashboard</h1>
        </div>
        <ErrorState message={error} onRetry={refetch} />
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
      icon: <CheckCircle2 size={20} className="text-ak-primary" />,
    },
    {
      id: 'hours',
      label: 'Timer denne uke',
      value: `${trainingStats.hoursThisWeek}t`,
      change: 5,
      trend: 'up',
      icon: <Clock size={20} className="text-ak-primary" />,
    },
    {
      id: 'streak',
      label: 'Dager i strekk',
      value: trainingStats.streak,
      icon: <Flame size={20} className="text-ak-gold" />,
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
        <div className="space-y-5">
          {/* Countdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-4">
              <CountdownWidget
                title={nextTournament?.title || 'Ingen kommende turnering'}
                date={nextTournament?.date || '2026-12-31'}
                type="tournament"
                location={nextTournament?.location || ''}
              />
            </Card>
            <Card className="p-4">
              <CountdownWidget
                title={nextTest?.title || 'Ingen kommende test'}
                date={nextTest?.date || '2026-12-31'}
                type="test"
                location={nextTest?.location || 'AK Golf Academy'}
              />
            </Card>
          </div>

          {/* Calendar Day View */}
          <DagensPlan events={calendarEvents} />

          {/* Upcoming Sessions */}
          <Card className="p-5">
            <WidgetHeader
              title="Dagens økter"
              icon={Play}
              action={() => navigate('/kalender')}
            />
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-8">
                <Calendar size={32} className="text-ak-mist mx-auto mb-2" />
                <p className="text-[14px] text-ak-steel">Ingen økter i dag</p>
                <button
                  onClick={() => navigate('/kalender')}
                  className="mt-3 text-[13px] text-ak-primary font-medium hover:underline"
                >
                  Gå til kalender
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingSessions.map(session => (
                  <SessionCardCompact
                    key={session.id}
                    session={session}
                    onClick={() => navigate(`/session/${session.id}`)}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>
      ),
    },
    {
      id: 'tasks',
      label: 'Oppgaver',
      badge: tasks.filter(t => !t.completed).length,
      content: (
        <div className="space-y-5">
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
    <div style={{ fontFamily: '"Inter", -apple-system, system-ui, sans-serif' }}>
      {/* Error banner if API failed but we have fallback data */}
      {error && (
        <div className="mb-4 p-3 bg-ak-warning/10 border border-ak-warning/20 rounded-lg flex items-center gap-3">
          <AlertCircle size={18} className="text-ak-warning" />
          <span className="text-[13px] text-ak-charcoal">Bruker demo-data. {error}</span>
          <button onClick={refetch} className="ml-auto text-[12px] text-ak-primary font-medium hover:underline">
            Prøv igjen
          </button>
        </div>
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
