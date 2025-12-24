/**
 * AK Golf Academy - Coach Dashboard
 * Design System v3.0 - Blue Palette 01
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
  ChevronRight, Search, User, BarChart3, Trophy, AlertCircle
} from 'lucide-react';
import { tokens } from '../../design-tokens';
import { CoachPlayerAlerts, CoachWeeklyTournaments, CoachInjuryTracker } from './widgets';
import { coachesAPI } from '../../services/api';
import StatsGridTemplate from '../../ui/templates/StatsGridTemplate';

// Typography helper from shared tokens
const typography = tokens.typography;

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

// Card component
const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => (
  <div
    style={{
      backgroundColor: tokens.colors.white,
      borderRadius: tokens.borderRadius.lg,
      boxShadow: tokens.shadows.card,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
    }}
    className={className}
    onClick={onClick}
  >
    {children}
  </div>
);

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
      {Icon && <Icon size={18} color={tokens.colors.primary} />}
      <h3 style={{ ...typography.title3, color: tokens.colors.charcoal, margin: 0 }}>
        {title}
      </h3>
    </div>
    {action && (
      <button
        onClick={action.onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          color: tokens.colors.primary,
          cursor: 'pointer',
          ...typography.caption,
          fontWeight: 500,
        }}
      >
        {action.label}
        <ChevronRight size={14} />
      </button>
    )}
  </div>
);

// Avatar component
const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 40 }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  // Generate consistent color from name
  const colors = [tokens.colors.primary, tokens.colors.primaryLight, tokens.colors.success, tokens.colors.gold];
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
        color: tokens.colors.white,
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

// Category badge
const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    A: { bg: `${tokens.colors.primary}15`, text: tokens.colors.primary },
    B: { bg: `${tokens.colors.primaryLight}15`, text: tokens.colors.primaryLight },
    C: { bg: `${tokens.colors.gold}15`, text: '#8B6914' },
  };
  const style = colors[category] || colors.C;

  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: tokens.borderRadius.sm,
        backgroundColor: style.bg,
        color: style.text,
        ...typography.small,
        fontWeight: 600,
      }}
    >
      Kat. {category}
    </span>
  );
};

// Props interface
interface CoachDashboardProps {
  athletes?: typeof mockAthletes;
  pendingItems?: typeof mockPendingItems;
}

// Loading component
const LoadingState: React.FC = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.snow
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 48,
        height: 48,
        border: `4px solid ${tokens.colors.primary}20`,
        borderTop: `4px solid ${tokens.colors.primary}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px'
      }} />
      <p style={{ ...typography.body, color: tokens.colors.steel }}>Laster dashboard...</p>
    </div>
  </div>
);

// Error component
const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.snow,
    padding: '24px'
  }}>
    <div style={{
      maxWidth: 400,
      textAlign: 'center',
      padding: '32px',
      backgroundColor: tokens.colors.white,
      borderRadius: tokens.borderRadius.lg,
      boxShadow: tokens.shadows.card
    }}>
      <AlertCircle size={48} color={tokens.colors.error} style={{ marginBottom: '16px' }} />
      <h2 style={{ ...typography.title2, color: tokens.colors.charcoal, marginBottom: '8px' }}>
        Kunne ikke laste dashboard
      </h2>
      <p style={{ ...typography.body, color: tokens.colors.steel, marginBottom: '24px' }}>
        {error}
      </p>
      <button
        onClick={onRetry}
        style={{
          padding: '12px 24px',
          backgroundColor: tokens.colors.primary,
          color: tokens.colors.white,
          border: 'none',
          borderRadius: tokens.borderRadius.md,
          cursor: 'pointer',
          ...typography.body,
          fontWeight: 600
        }}
      >
        Prøv igjen
      </button>
    </div>
  </div>
);

// Main Coach Dashboard component
export default function CoachDashboard({ athletes: propAthletes, pendingItems: propPendingItems }: CoachDashboardProps = {}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // State for API data
  const [athletes, setAthletes] = useState<typeof mockAthletes>(propAthletes || []);
  const [pendingItems, setPendingItems] = useState<typeof mockPendingItems>(propPendingItems || []);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [athletesRes, pendingRes, scheduleRes, statsRes] = await Promise.all([
        coachesAPI.getAthletes().catch(() => ({ data: mockAthletes })),
        coachesAPI.getPendingItems().catch(() => ({ data: mockPendingItems })),
        coachesAPI.getTodaySchedule().catch(() => ({ data: [] })),
        coachesAPI.getWeeklyStats().catch(() => ({ data: null })),
      ]);

      setAthletes(athletesRes.data?.data || athletesRes.data || mockAthletes);
      setPendingItems(pendingRes.data?.data || pendingRes.data || mockPendingItems);
      setTodaySchedule(scheduleRes.data?.data || scheduleRes.data || []);
      setWeeklyStats(statsRes.data?.data || statsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'En ukjent feil oppstod');
      // Fallback to mock data on error
      setAthletes(mockAthletes);
      setPendingItems(mockPendingItems);
    } finally {
      setLoading(false);
    }
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
        backgroundColor: tokens.colors.snow,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: '24px', paddingBottom: '16px' }}>
        <h1 style={{ ...typography.largeTitle, color: tokens.colors.charcoal, margin: 0 }}>
          {getGreeting()}, Trener
        </h1>
        <p style={{ ...typography.body, color: tokens.colors.steel, marginTop: '4px' }}>
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
                backgroundColor: tokens.colors.white,
                border: 'none',
                borderRadius: tokens.borderRadius.md,
                boxShadow: tokens.shadows.card,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: tokens.borderRadius.md,
                  backgroundColor: `${tokens.colors.primary}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <action.icon size={22} color={tokens.colors.primary} />
              </div>
              <span style={{ ...typography.caption, fontWeight: 500, color: tokens.colors.charcoal }}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Critical Alerts Section */}
      <div style={{ padding: '0 24px 20px' }}>
        <Card>
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
        <Card>
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
                backgroundColor: tokens.colors.snow,
                borderRadius: tokens.borderRadius.md,
                marginBottom: '16px',
              }}
            >
              <Search size={18} color={tokens.colors.steel} />
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
                  ...typography.body,
                  color: tokens.colors.charcoal,
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
                    backgroundColor: tokens.colors.snow,
                    borderRadius: tokens.borderRadius.md,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Avatar name={`${athlete.firstName} ${athlete.lastName}`} size={40} />
                  <div style={{ flex: 1 }}>
                    <p style={{ ...typography.body, fontWeight: 500, color: tokens.colors.charcoal, margin: 0 }}>
                      {athlete.lastName}, {athlete.firstName}
                    </p>
                    <p style={{ ...typography.small, color: tokens.colors.steel, margin: 0, marginTop: '2px' }}>
                      Sist aktiv: {new Date(athlete.lastSession).toLocaleDateString('nb-NO')}
                    </p>
                  </div>
                  <CategoryBadge category={athlete.category} />
                  <ChevronRight size={18} color={tokens.colors.steel} />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Pending Items */}
        <Card>
          <div style={{ padding: '20px' }}>
            <WidgetHeader
              title="Venter på deg"
              icon={Bell}
              action={{ label: 'Se alle', onClick: () => navigate('/coach/pending') }}
            />

            {pendingItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <Bell size={32} color={tokens.colors.mist} style={{ marginBottom: '8px' }} />
                <p style={{ ...typography.body, color: tokens.colors.steel }}>
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
                      backgroundColor: `${tokens.colors.primary}05`,
                      borderRadius: tokens.borderRadius.md,
                      borderLeft: `3px solid ${tokens.colors.primary}`,
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: tokens.borderRadius.sm,
                        backgroundColor: tokens.colors.white,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {item.type === 'proof' && <User size={18} color={tokens.colors.primary} />}
                      {item.type === 'note' && <MessageSquare size={18} color={tokens.colors.primary} />}
                      {item.type === 'plan' && <ClipboardList size={18} color={tokens.colors.primary} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ ...typography.body, fontWeight: 500, color: tokens.colors.charcoal, margin: 0 }}>
                        {item.athlete}
                      </p>
                      <p style={{ ...typography.caption, color: tokens.colors.steel, margin: 0, marginTop: '2px' }}>
                        {item.description}
                      </p>
                    </div>
                    <span style={{ ...typography.small, color: tokens.colors.steel, flexShrink: 0 }}>
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Weekly Tournaments */}
        <Card>
          <div style={{ padding: '20px' }}>
            <CoachWeeklyTournaments
              onViewAll={() => navigate('/coach/tournaments')}
            />
          </div>
        </Card>

        {/* Injury Tracker */}
        <Card>
          <div style={{ padding: '20px' }}>
            <CoachInjuryTracker
              onViewAll={() => navigate('/coach/athletes/status')}
            />
          </div>
        </Card>

        {/* Today's Schedule */}
        <Card>
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
                    backgroundColor: tokens.colors.snow,
                    borderRadius: tokens.borderRadius.md,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: tokens.borderRadius.md,
                      backgroundColor: tokens.colors.primary,
                      color: tokens.colors.white,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...typography.caption,
                      fontWeight: 600,
                    }}
                  >
                    {event.time}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ ...typography.body, fontWeight: 500, color: tokens.colors.charcoal, margin: 0 }}>
                      {event.title}
                    </p>
                    <p style={{ ...typography.small, color: tokens.colors.steel, margin: 0, marginTop: '2px' }}>
                      {event.athletes} {event.athletes === 1 ? 'spiller' : 'spillere'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card>
          <div style={{ padding: '20px' }}>
            <WidgetHeader title="Ukens oversikt" />

            <StatsGridTemplate
              items={(weeklyStats ? [
                { id: 'active-players', label: 'Aktive spillere', value: weeklyStats.activePlayers || '0' },
                { id: 'sessions', label: 'Økter denne uke', value: weeklyStats.sessionsThisWeek || '0' },
                { id: 'hours', label: 'Timer trent', value: weeklyStats.hoursTrained || '0' },
                { id: 'pending', label: 'Ventende', value: weeklyStats.pendingCount || '0' },
              ] : [
                { id: 'active-players', label: 'Aktive spillere', value: '12' },
                { id: 'sessions', label: 'Økter denne uke', value: '24' },
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
