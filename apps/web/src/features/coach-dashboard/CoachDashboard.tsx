/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
/**
 * AK Golf Academy - Coach Dashboard
 * Design System v3.0 - Semantic CSS Variables
 *
 * Overview dashboard for coaches showing:
 * - Athletes list (alphabetically sorted, neutral)
 * - Recent activity feed
 * - Pending items requiring attention
 * - Quick navigation to coach tools
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Calendar, ClipboardList, MessageSquare, Bell,
  ChevronRight, Search, User, BarChart3, Trophy
} from 'lucide-react';
import { CoachPlayerAlerts, CoachWeeklyTournaments, CoachInjuryTracker } from './widgets';
import { coachesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { TeamFocusHeatmap } from '../focus-engine';
import StatsGridTemplate from '../../ui/templates/StatsGridTemplate';
import Button from '../../ui/primitives/Button';
import Badge from '../../ui/primitives/Badge.primitive';
import StateCard from '../../ui/composites/StateCard';
import Card from '../../ui/primitives/Card';

// Mock data for athletes
const mockAthletes = [
  { id: '1', firstName: 'Anders', lastName: 'Hansen', category: 'A', lastSession: '2025-12-18' },
  { id: '2', firstName: 'Erik', lastName: 'Johansen', category: 'B', lastSession: '2025-12-17' },
  { id: '3', firstName: 'Lars', lastName: 'Olsen', category: 'A', lastSession: '2025-12-19' },
  { id: '4', firstName: 'Mikkel', lastName: 'Pedersen', category: 'C', lastSession: '2025-12-16' },
  { id: '5', firstName: 'Sofie', lastName: 'Andersen', category: 'B', lastSession: '2025-12-18' },
  { id: '6', firstName: 'Emma', lastName: 'Berg', category: 'A', lastSession: '2025-12-19' },
];

// Mock pending items
const mockPendingItems = [
  { id: '1', type: 'proof', athlete: 'Anders Hansen', description: 'Ny video lastet opp', time: '2 timer siden' },
  { id: '2', type: 'note', athlete: 'Erik Johansen', description: 'Øktnotat til gjennomgang', time: '4 timer siden' },
  { id: '3', type: 'plan', athlete: 'Sofie Andersen', description: 'Treningsplan venter godkjenning', time: '1 dag siden' },
];

// Quick action items
const quickActions = [
  { id: 'athletes', label: 'Spillere', icon: Users, href: '/coach/athletes' },
  { id: 'calendar', label: 'Kalender', icon: Calendar, href: '/coach/calendar' },
  { id: 'plans', label: 'Treningsplaner', icon: ClipboardList, href: '/coach/training-plans/create' },
  { id: 'messages', label: 'Meldinger', icon: MessageSquare, href: '/coach/messages' },
  { id: 'stats', label: 'Stats', icon: BarChart3, href: '/coach/stats' },
  { id: 'tournaments', label: 'Turneringer', icon: Trophy, href: '/coach/tournaments' },
];

// Widget header
const WidgetHeader: React.FC<{
  title: string;
  icon?: React.ElementType;
  action?: { label: string; onClick: () => void };
}> = ({ title, icon: Icon, action }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {Icon && <Icon size={18} style={{ color: 'var(--accent)' }} />}
      <h3 style={{
        fontSize: '17px',
        fontWeight: 600,
        color: 'var(--text-primary)',
        margin: 0,
      }}>
        {title}
      </h3>
    </div>
    {action && (
      <Button variant="ghost" size="sm" onClick={action.onClick}>
        {action.label}
        <ChevronRight size={14} />
      </Button>
    )}
  </div>
);

// Avatar component
const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 40 }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  // Generate consistent color from name
  const colors = ['var(--accent)', 'var(--success)', 'var(--warning)'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const bgColor = colors[Math.abs(hash) % colors.length];

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: bgColor,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

// Category badge using primitive
const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const variantMap: Record<string, 'accent' | 'neutral' | 'achievement'> = {
    A: 'accent',
    B: 'neutral',
    C: 'achievement',
  };
  const variant = variantMap[category] || 'neutral';

  return (
    <Badge variant={variant} size="sm">
      Kat. {category}
    </Badge>
  );
};

// Props interface
interface CoachDashboardProps {
  athletes?: typeof mockAthletes;
  pendingItems?: typeof mockPendingItems;
}

// Loading component using StateCard
const LoadingState: React.FC = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-secondary)'
  }}>
    <StateCard variant="loading" title="Laster dashboard..." />
  </div>
);

// Error component using StateCard and Button
const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-secondary)',
    padding: '24px'
  }}>
    <StateCard
      variant="error"
      title="Kunne ikke laste dashboard"
      description={error}
      action={<Button variant="primary" onClick={onRetry}>Prov igjen</Button>}
    />
  </div>
);

// Main Coach Dashboard component
export default function CoachDashboard({ athletes: propAthletes, pendingItems: propPendingItems }: CoachDashboardProps = {}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // State for API data
  const [athletes, setAthletes] = useState<typeof mockAthletes>(propAthletes || []);
  const [pendingItems, setPendingItems] = useState<typeof mockPendingItems>(propPendingItems || []);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [todaySchedule, _setTodaySchedule] = useState<any[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<any>(null);
  const [defaultTeamId, setDefaultTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const coachId = (user as any)?.coachId || user?.id;

      const [athletesRes, alertsRes, statsRes] = await Promise.all([
        coachesAPI.getAthletes().catch(() => ({ data: { data: mockAthletes } })),
        coachesAPI.getAlerts().catch(() => ({ data: { data: { alerts: mockPendingItems } } })),
        coachId ? coachesAPI.getWeeklyStats(coachId).catch(() => ({ data: null })) : Promise.resolve({ data: null }),
      ]);

      // Transform athletes response
      const athleteData = athletesRes.data?.data || athletesRes.data || mockAthletes;
      setAthletes(Array.isArray(athleteData) ? athleteData.map((a: any) => ({
        id: a.id,
        firstName: a.firstName,
        lastName: a.lastName,
        category: a.category || 'B',
        lastSession: a.nextSession || a.planUpdated || new Date().toISOString().split('T')[0],
      })) : mockAthletes);

      // Transform alerts to pending items format
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const alertsResponse = alertsRes.data?.data || alertsRes.data || {};
      const alertsData = (alertsResponse as any)?.alerts || (Array.isArray(alertsResponse) ? alertsResponse : []);
      setPendingItems(Array.isArray(alertsData) ? alertsData.slice(0, 5).map((alert: any) => ({
        id: alert.id,
        type: alert.type === 'proof_uploaded' ? 'proof' : alert.type === 'plan_pending' ? 'plan' : 'note',
        athlete: alert.athleteName,
        description: alert.message,
        time: formatTimeAgo(alert.createdAt),
      })) : mockPendingItems);

      // Get stats from statistics response
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const statsData = (statsRes.data?.data || statsRes.data) as any;
      if (statsData?.sessions) {
        setWeeklyStats({
          activePlayers: statsData.players?.active || 0,
          sessionsThisWeek: statsData.sessions?.thisWeek || 0,
          hoursTrained: statsData.sessions?.totalHours || 0,
          pendingCount: alertsData.length || 0,
        });
      }

      // Set default team for focus heatmap (use first athlete's ID as team proxy)
      if (athleteData.length > 0) {
        setDefaultTeamId(athleteData[0].id);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'En ukjent feil oppstod');
      // Fallback to mock data on error
      setAthletes(mockAthletes);
      setPendingItems(mockPendingItems);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format time ago
  const formatTimeAgo = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} dag${diffDays > 1 ? 'er' : ''} siden`;
    if (diffHours > 0) return `${diffHours} time${diffHours > 1 ? 'r' : ''} siden`;
    return 'Akkurat nå';
  };

  useEffect(() => {
    // Only fetch if not using props
    if (!propAthletes && !propPendingItems) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [propAthletes, propPendingItems]);

  if (loading) return <LoadingState />;
  if (error && athletes.length === 0) return <ErrorState error={error} onRetry={fetchDashboardData} />;

  // Sort athletes alphabetically by last name
  const sortedAthletes = [...athletes]
    .filter(a =>
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.lastName.localeCompare(b.lastName));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'God morgen';
    if (hour < 18) return 'God dag';
    return 'God kveld';
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: '24px', paddingBottom: '16px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
        }}>
          {getGreeting()}, Trener
        </h1>
        <p style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          marginTop: '4px',
        }}>
          Her er din oversikt for i dag
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => navigate(action.href)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 12px',
                backgroundColor: 'var(--bg-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <action.icon size={22} style={{ color: 'var(--accent)' }} />
              </div>
              <span style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Critical Alerts Section */}
      <div style={{ padding: '0 24px 20px' }}>
        <Card variant="default" padding="none">
          <div style={{ padding: '20px' }}>
            <CoachPlayerAlerts
              maxItems={4}
              onViewAll={() => navigate('/coach/alerts')}
            />
          </div>
        </Card>
      </div>

      {/* Main content grid */}
      <div style={{ padding: '0 24px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Athletes List */}
        <Card variant="default" padding="none">
          <div style={{ padding: '20px' }}>
            <WidgetHeader
              title="Mine Spillere"
              icon={Users}
              action={{ label: 'Se alle', onClick: () => navigate('/coach/athletes') }}
            />

            {/* Search */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
              }}
            >
              <Search size={18} style={{ color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Sok etter spiller..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            {/* Athletes list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sortedAthletes.slice(0, 5).map(athlete => (
                <div
                  key={athlete.id}
                  onClick={() => navigate(`/coach/athlete/${athlete.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Avatar name={`${athlete.firstName} ${athlete.lastName}`} size={40} />
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}>
                      {athlete.lastName}, {athlete.firstName}
                    </p>
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      margin: 0,
                      marginTop: '2px',
                    }}>
                      Sist aktiv: {new Date(athlete.lastSession).toLocaleDateString('nb-NO')}
                    </p>
                  </div>
                  <CategoryBadge category={athlete.category} />
                  <ChevronRight size={18} style={{ color: 'var(--text-secondary)' }} />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Pending Items */}
        <Card variant="default" padding="none">
          <div style={{ padding: '20px' }}>
            <WidgetHeader
              title="Venter pa deg"
              icon={Bell}
              action={{ label: 'Se alle', onClick: () => navigate('/coach/pending') }}
            />

            {pendingItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <Bell size={32} style={{ color: 'var(--bg-tertiary)', marginBottom: '8px' }} />
                <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
                  Ingen ventende oppgaver
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '14px',
                      backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '3px solid var(--accent)',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {item.type === 'proof' && <User size={18} style={{ color: 'var(--accent)' }} />}
                      {item.type === 'note' && <MessageSquare size={18} style={{ color: 'var(--accent)' }} />}
                      {item.type === 'plan' && <ClipboardList size={18} style={{ color: 'var(--accent)' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '15px',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        margin: 0,
                      }}>
                        {item.athlete}
                      </p>
                      <p style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        margin: 0,
                        marginTop: '2px',
                      }}>
                        {item.description}
                      </p>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      flexShrink: 0,
                    }}>
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Weekly Tournaments */}
        <Card variant="default" padding="none">
          <div style={{ padding: '20px' }}>
            <CoachWeeklyTournaments
              onViewAll={() => navigate('/coach/tournaments')}
            />
          </div>
        </Card>

        {/* Injury Tracker */}
        <Card variant="default" padding="none">
          <div style={{ padding: '20px' }}>
            <CoachInjuryTracker
              onViewAll={() => navigate('/coach/athletes/status')}
            />
          </div>
        </Card>

        {/* Team Focus Heatmap */}
        {user?.id && defaultTeamId && (
          <Card variant="default" padding="none">
            <div style={{ padding: '20px' }}>
              <TeamFocusHeatmap
                coachId={user.id}
                teamId={defaultTeamId}
              />
            </div>
          </Card>
        )}

        {/* Today's Schedule */}
        <Card variant="default" padding="none">
          <div style={{ padding: '20px' }}>
            <WidgetHeader
              title="Dagens program"
              icon={Calendar}
              action={{ label: 'Kalender', onClick: () => navigate('/coach/calendar') }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(todaySchedule.length > 0 ? todaySchedule : [
                { time: '09:00', title: 'Teknikktrening - Gruppe A', athletes: 3 },
                { time: '11:00', title: 'Individuell time - Anders H.', athletes: 1 },
                { time: '14:00', title: 'Putting workshop', athletes: 6 },
                { time: '16:00', title: 'Videoanalyse - Erik J.', athletes: 1 },
              ]).map((event, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--accent)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    {event.time}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '15px',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      margin: 0,
                    }}>
                      {event.title}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      margin: 0,
                      marginTop: '2px',
                    }}>
                      {event.athletes} {event.athletes === 1 ? 'spiller' : 'spillere'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card variant="default" padding="none">
          <div style={{ padding: '20px' }}>
            <WidgetHeader title="Ukens oversikt" />

            <StatsGridTemplate
              items={(weeklyStats ? [
                { id: 'active-players', label: 'Aktive spillere', value: weeklyStats.activePlayers || '0' },
                { id: 'sessions', label: 'Okter denne uke', value: weeklyStats.sessionsThisWeek || '0' },
                { id: 'hours', label: 'Timer trent', value: weeklyStats.hoursTrained || '0' },
                { id: 'pending', label: 'Ventende', value: weeklyStats.pendingCount || '0' },
              ] : [
                { id: 'active-players', label: 'Aktive spillere', value: '12' },
                { id: 'sessions', label: 'Okter denne uke', value: '24' },
                { id: 'hours', label: 'Timer trent', value: '48' },
                { id: 'pending', label: 'Ventende', value: '3' },
              ])}
              columns={2}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
