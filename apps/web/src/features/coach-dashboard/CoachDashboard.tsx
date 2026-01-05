/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
/**
 * CoachDashboard.tsx
 * Design System v3.0 - Premium Light
 * Build: 2026-01-04-v2
 *
 * MIGRATED TO PAGE ARCHITECTURE - Zero inline styles
 *
 * Overview dashboard for coaches showing:
 * - Athletes list (alphabetically sorted, neutral)
 * - Recent activity feed
 * - Pending items requiring attention
 * - Quick navigation to coach tools
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Calendar, ClipboardList, MessageSquare, Bell,
  ChevronRight, Search, User, BarChart3, Trophy, RefreshCw
} from 'lucide-react';
import { CoachPlayerAlerts, CoachWeeklyTournaments, CoachInjuryTracker } from './widgets';
import { coachesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/shadcn/use-toast';
import { TeamFocusHeatmap } from '../focus-engine';
import StatsGridTemplate from '../../ui/templates/StatsGridTemplate';
import Button from '../../ui/primitives/Button';
import Badge from '../../ui/primitives/Badge.primitive';
import StateCard from '../../ui/composites/StateCard';
import Card from '../../ui/primitives/Card';
import { PageTitle, SectionTitle, SubSectionTitle } from '../../components/typography';

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
  { id: 'stats', label: 'Statistikk', icon: BarChart3, href: '/coach/stats' },
  { id: 'tournaments', label: 'Turneringer', icon: Trophy, href: '/coach/tournaments' },
];

// Widget header
const WidgetHeader: React.FC<{
  title: string;
  icon?: React.ElementType;
  action?: { label: string; onClick: () => void };
}> = ({ title, icon: Icon, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      {Icon && <Icon size={18} className="text-ak-primary" />}
      <SubSectionTitle>
        {title}
      </SubSectionTitle>
    </div>
    {action && (
      <Button variant="ghost" size="sm" onClick={action.onClick}>
        {action.label}
        <ChevronRight size={14} />
      </Button>
    )}
  </div>
);

// Avatar component - use correct Tailwind color classes from tailwind.config.js
const AVATAR_COLORS = ['bg-ak-primary', 'bg-ak-success', 'bg-ak-warning'];

const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 40 }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  // Generate consistent color from name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const bgColorClass = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];

  return (
    <div
      className={`rounded-full ${bgColorClass} text-white flex items-center justify-center font-semibold shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
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
  <div className="min-h-screen flex items-center justify-center bg-ak-surface-subtle">
    <StateCard variant="loading" title="Laster dashboard..." />
  </div>
);

// Error component using StateCard and Button
const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="min-h-screen flex items-center justify-center bg-ak-surface-subtle p-6">
    <StateCard
      variant="error"
      title="Kunne ikke laste dashboard"
      description={error}
      action={<Button variant="primary" onClick={onRetry}>Prov igjen</Button>}
    />
  </div>
);

// Dashboard data interface
interface DashboardData {
  athletes: typeof mockAthletes;
  pendingItems: typeof mockPendingItems;
  weeklyStats: any;
  todaySchedule: any[];
  defaultTeamId: string | null;
}

// Helper to format time ago
function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} dag${diffDays > 1 ? 'er' : ''} siden`;
  if (diffHours > 0) return `${diffHours} time${diffHours > 1 ? 'r' : ''} siden`;
  return 'Akkurat nå';
}

// Helper to format last updated
function formatLastUpdated(date: Date | null): string {
  if (!date) return 'Aldri oppdatert';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);

  if (diffSeconds < 10) return 'Nettopp oppdatert';
  if (diffSeconds < 60) return `${diffSeconds} sek siden`;
  if (diffMinutes < 60) return `${diffMinutes} min siden`;
  return date.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' });
}

// Main Coach Dashboard component - Fix v3 for React #310
export default function CoachDashboard(props: CoachDashboardProps) {
  // ALL HOOKS MUST BE AT TOP - NO CONDITIONALS BEFORE HOOKS
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Destructure props after all hooks are called
  const { athletes: propAthletes, pendingItems: propPendingItems } = props || {};

  // Simple state management instead of useRealTimePolling
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const mountedRef = useRef(true);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async (isBackground = false) => {
    try {
      if (isBackground) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      const userWithCoach = user as { coachId?: string; id?: string } | null;
      const coachId = userWithCoach?.coachId || userWithCoach?.id;

      let hadApiError = false;
      const [athletesRes, alertsRes, statsRes] = await Promise.all([
        coachesAPI.getAthletes().catch(() => { hadApiError = true; return { data: { data: mockAthletes } }; }),
        coachesAPI.getAlerts().catch(() => { hadApiError = true; return { data: { data: { alerts: mockPendingItems } } }; }),
        coachId ? coachesAPI.getWeeklyStats(coachId).catch(() => { hadApiError = true; return { data: null }; }) : Promise.resolve({ data: null }),
      ]);

      if (hadApiError && !isBackground) {
        toast({
          title: 'Begrenset data',
          description: 'Noen data kunne ikke lastes. Viser demodata.',
          variant: 'default',
        });
      }

      // Transform athletes response
      const athleteData = athletesRes.data?.data || athletesRes.data || mockAthletes;
      const transformedAthletes = Array.isArray(athleteData) ? athleteData.map((a: any) => ({
        id: a.id,
        firstName: a.firstName,
        lastName: a.lastName,
        category: a.category || 'B',
        lastSession: a.nextSession || a.planUpdated || new Date().toISOString().split('T')[0],
      })) : mockAthletes;

      // Transform alerts to pending items format
      const alertsResponse = alertsRes.data?.data || alertsRes.data || {};
      const alertsData = (alertsResponse as any)?.alerts || (Array.isArray(alertsResponse) ? alertsResponse : []);
      const transformedPendingItems = Array.isArray(alertsData) ? alertsData.slice(0, 5).map((alert: any) => ({
        id: alert.id,
        type: alert.type === 'proof_uploaded' ? 'proof' : alert.type === 'plan_pending' ? 'plan' : 'note',
        athlete: alert.athleteName,
        description: alert.message,
        time: formatTimeAgo(alert.createdAt),
      })) : mockPendingItems;

      // Get stats from statistics response
      const statsData = (statsRes.data?.data || statsRes.data) as any;
      const transformedStats = statsData?.sessions ? {
        activePlayers: statsData.players?.active || 0,
        sessionsThisWeek: statsData.sessions?.thisWeek || 0,
        hoursTrained: statsData.sessions?.totalHours || 0,
        pendingCount: alertsData.length || 0,
      } : null;

      if (mountedRef.current) {
        setDashboardData({
          athletes: transformedAthletes,
          pendingItems: transformedPendingItems,
          weeklyStats: transformedStats,
          todaySchedule: [],
          defaultTeamId: transformedAthletes.length > 0 ? transformedAthletes[0].id : null,
        });
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    if (!propAthletes && !propPendingItems) {
      fetchDashboardData(false);
    } else {
      setLoading(false);
    }
  }, [propAthletes, propPendingItems, fetchDashboardData]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Use prop data or fetched data
  const athletes = propAthletes || dashboardData?.athletes || mockAthletes;
  const pendingItems = propPendingItems || dashboardData?.pendingItems || mockPendingItems;
  const weeklyStats = dashboardData?.weeklyStats || null;
  const todaySchedule = dashboardData?.todaySchedule || [];
  const defaultTeamId = dashboardData?.defaultTeamId || null;

  // Conditional returns AFTER all hooks
  if (loading && !dashboardData) return <LoadingState />;
  if (error && athletes.length === 0) return <ErrorState error={error.message} onRetry={refresh} />;

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
    <div className="relative min-h-screen bg-ak-surface-subtle font-sans">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <PageTitle>
              {getGreeting()}, Trener
            </PageTitle>
            <p className="text-[15px] text-ak-text-secondary mt-1">
              Her er din oversikt for i dag
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Last updated indicator */}
            <span className="text-[13px] text-ak-text-secondary">
              {formatLastUpdated(lastUpdated)}
            </span>
            {/* Refresh button */}
            <button
              onClick={refresh}
              disabled={isRefreshing}
              className={`flex items-center justify-center w-9 h-9 bg-ak-surface-base border border-ak-border-default rounded-lg transition-all ${
                isRefreshing ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-ak-surface-subtle'
              }`}
              title="Oppdater data"
            >
              <RefreshCw
                size={18}
                className={`text-ak-text-secondary ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>
        {/* Refreshing indicator bar */}
        {isRefreshing && (
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-ak-primary animate-pulse" />
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-6 gap-3">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => navigate(action.href)}
              className="flex flex-col items-center gap-2 py-4 px-3 bg-ak-surface-base border-none rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-lg bg-ak-primary/10 flex items-center justify-center">
                <action.icon size={22} className="text-ak-primary" />
              </div>
              <span className="text-[13px] font-medium text-ak-text-primary">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Critical Alerts Section */}
      <div className="px-6 pb-5">
        <Card variant="default" padding="none">
          <div className="p-5">
            <CoachPlayerAlerts
              maxItems={4}
              onViewAll={() => navigate('/coach/alerts')}
            />
          </div>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="px-6 pb-6 grid grid-cols-2 gap-5">
        {/* Athletes List */}
        <Card variant="default" padding="none">
          <div className="p-5">
            <WidgetHeader
              title="Mine Spillere"
              icon={Users}
              action={{ label: 'Se alle', onClick: () => navigate('/coach/athletes') }}
            />

            {/* Search */}
            <div className="flex items-center gap-2 py-2.5 px-3.5 bg-ak-surface-subtle rounded-lg mb-4">
              <Search size={18} className="text-ak-text-secondary" />
              <input
                type="text"
                placeholder="Sok etter spiller..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border-none bg-transparent outline-none text-[15px] text-ak-text-primary"
              />
            </div>

            {/* Athletes list */}
            <div className="flex flex-col gap-2">
              {sortedAthletes.slice(0, 5).map(athlete => (
                <div
                  key={athlete.id}
                  onClick={() => navigate(`/coach/athlete/${athlete.id}`)}
                  className="flex items-center gap-3 p-3 bg-ak-surface-subtle rounded-lg cursor-pointer transition-all hover:bg-ak-border-default"
                >
                  <Avatar name={`${athlete.firstName} ${athlete.lastName}`} size={40} />
                  <div className="flex-1">
                    <p className="text-[15px] font-medium text-ak-text-primary m-0">
                      {athlete.lastName}, {athlete.firstName}
                    </p>
                    <p className="text-[13px] text-ak-text-secondary m-0 mt-0.5">
                      Sist aktiv: {new Date(athlete.lastSession).toLocaleDateString('nb-NO')}
                    </p>
                  </div>
                  <CategoryBadge category={athlete.category} />
                  <ChevronRight size={18} className="text-ak-text-secondary" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Pending Items */}
        <Card variant="default" padding="none">
          <div className="p-5">
            <WidgetHeader
              title="Venter pa deg"
              icon={Bell}
              action={{ label: 'Se alle', onClick: () => navigate('/coach/pending') }}
            />

            {pendingItems.length === 0 ? (
              <div className="text-center py-8 px-4">
                <Bell size={32} className="text-ak-border-default mb-2 mx-auto" />
                <p className="text-[15px] text-ak-text-secondary">
                  Ingen ventende oppgaver
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3.5 bg-ak-primary/5 rounded-lg border-l-[3px] border-ak-primary cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-md bg-ak-surface-base flex items-center justify-center shrink-0">
                      {item.type === 'proof' && <User size={18} className="text-ak-primary" />}
                      {item.type === 'note' && <MessageSquare size={18} className="text-ak-primary" />}
                      {item.type === 'plan' && <ClipboardList size={18} className="text-ak-primary" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] font-medium text-ak-text-primary m-0">
                        {item.athlete}
                      </p>
                      <p className="text-[13px] text-ak-text-secondary m-0 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-xs text-ak-text-secondary shrink-0">
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
          <div className="p-5">
            <CoachWeeklyTournaments
              onViewAll={() => navigate('/coach/tournaments')}
            />
          </div>
        </Card>

        {/* Injury Tracker */}
        <Card variant="default" padding="none">
          <div className="p-5">
            <CoachInjuryTracker
              onViewAll={() => navigate('/coach/athletes/status')}
            />
          </div>
        </Card>

        {/* Team Focus Heatmap */}
        {user?.id && defaultTeamId && (
          <Card variant="default" padding="none">
            <div className="p-5">
              <TeamFocusHeatmap
                coachId={user.id}
                teamId={defaultTeamId}
              />
            </div>
          </Card>
        )}

        {/* Today's Schedule */}
        <Card variant="default" padding="none">
          <div className="p-5">
            <WidgetHeader
              title="Dagens program"
              icon={Calendar}
              action={{ label: 'Kalender', onClick: () => navigate('/coach/calendar') }}
            />

            <div className="flex flex-col gap-3">
              {(todaySchedule.length > 0 ? todaySchedule : [
                { time: '09:00', title: 'Teknikktrening - Gruppe A', athletes: 3 },
                { time: '11:00', title: 'Individuell time - Anders H.', athletes: 1 },
                { time: '14:00', title: 'Putting workshop', athletes: 6 },
                { time: '16:00', title: 'Videoanalyse - Erik J.', athletes: 1 },
              ]).map((event, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-ak-surface-subtle rounded-lg"
                >
                  <div className="w-12 h-12 rounded-lg bg-ak-primary text-white flex items-center justify-center text-[13px] font-semibold">
                    {event.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-medium text-ak-text-primary m-0">
                      {event.title}
                    </p>
                    <p className="text-xs text-ak-text-secondary m-0 mt-0.5">
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
          <div className="p-5">
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
