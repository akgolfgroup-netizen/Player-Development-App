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
import type { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Calendar, ClipboardList, MessageSquare, Bell,
  ChevronRight, Search, User, RefreshCw
} from 'lucide-react';
import { CoachPlayerAlerts } from './widgets';
import { coachesAPI, AthleteDTO, AlertsResponseDTO, CoachAlertDTO, CoachWeeklyStatsDTO } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileOverviewCard } from '../../components/dashboard';
import { useToast } from '../../components/shadcn/use-toast';
import { getNotifications } from '../../services/notificationsApi';
import Button from '../../ui/primitives/Button';
import Badge from '../../ui/primitives/Badge.primitive';
import StateCard from '../../ui/composites/StateCard';
import Card from '../../ui/primitives/Card';
import { SubSectionTitle } from '../../components/typography/Headings';
import Avatar from '../../ui/primitives/Avatar';
import PageHeader from '../../ui/raw-blocks/PageHeader.raw';
import PageContainer from '../../ui/raw-blocks/PageContainer.raw';

// Athlete type for dashboard display
interface DashboardAthlete {
  id: string;
  firstName: string;
  lastName: string;
  category: string;
  lastSession: string;
  profileImageUrl: string | null;
}

// Mock data for athletes (includes profileImageUrl for avatar support)
const mockAthletes: DashboardAthlete[] = [
  { id: '1', firstName: 'Anders', lastName: 'Hansen', category: 'A', lastSession: '2025-12-18', profileImageUrl: null },
  { id: '2', firstName: 'Erik', lastName: 'Johansen', category: 'B', lastSession: '2025-12-17', profileImageUrl: null },
  { id: '3', firstName: 'Lars', lastName: 'Olsen', category: 'A', lastSession: '2025-12-19', profileImageUrl: null },
  { id: '4', firstName: 'Mikkel', lastName: 'Pedersen', category: 'C', lastSession: '2025-12-16', profileImageUrl: null },
  { id: '5', firstName: 'Sofie', lastName: 'Andersen', category: 'B', lastSession: '2025-12-18', profileImageUrl: null },
  { id: '6', firstName: 'Emma', lastName: 'Berg', category: 'A', lastSession: '2025-12-19', profileImageUrl: null },
];

// Mock pending items
const mockPendingItems = [
  { id: '1', type: 'proof', athlete: 'Anders Hansen', description: 'Ny video lastet opp', time: '2 timer siden' },
  { id: '2', type: 'note', athlete: 'Erik Johansen', description: 'Øktnotat til gjennomgang', time: '4 timer siden' },
  { id: '3', type: 'plan', athlete: 'Sofie Andersen', description: 'Treningsplan venter godkjenning', time: '1 dag siden' },
];

// Quick action items - Simplified to max 4
const quickActions = [
  { id: 'athletes', label: 'Spillere', icon: Users, href: '/coach/athletes' },
  { id: 'calendar', label: 'Kalender', icon: Calendar, href: '/coach/calendar' },
  { id: 'plans', label: 'Treningsplaner', icon: ClipboardList, href: '/coach/training-plans/create' },
  { id: 'messages', label: 'Meldinger', icon: MessageSquare, href: '/coach/messages' },
];

// Widget header
const WidgetHeader: React.FC<{
  title: string;
  icon?: React.ElementType;
  action?: { label: string; onClick: () => void };
}> = ({ title, icon: Icon, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      {Icon && <Icon size={18} className="text-tier-navy" />}
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

// Removed local Avatar component - now using Avatar from ui/primitives

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
  athletes?: DashboardAthlete[];
  pendingItems?: typeof mockPendingItems;
}

// Loading component using StateCard
const LoadingState: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-tier-surface-base">
    <StateCard variant="loading" title="Laster dashboard..." />
  </div>
);

// Error component using StateCard and Button
const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="min-h-screen flex items-center justify-center bg-tier-surface-base p-6">
    <StateCard
      variant="error"
      title="Kunne ikke laste dashboard"
      description={error}
      action={<Button variant="primary" onClick={onRetry}>Prøv igjen</Button>}
    />
  </div>
);

// Weekly stats interface
interface WeeklyStats {
  activePlayers: number;
  sessionsThisWeek: number;
  hoursTrained: number;
  pendingCount: number;
}

// Schedule item interface
interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  type: string;
}

// Dashboard data interface
interface DashboardData {
  athletes: DashboardAthlete[];
  pendingItems: typeof mockPendingItems;
  weeklyStats: WeeklyStats | null;
  todaySchedule: ScheduleItem[];
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
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const mountedRef = useRef(true);
  const hasShownToastRef = useRef(false);

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
      const [athletesRes, alertsRes, statsRes, notificationsRes] = await Promise.all([
        coachesAPI.getAthletes().catch(() => { hadApiError = true; return { data: { data: mockAthletes } }; }),
        coachesAPI.getAlerts().catch(() => { hadApiError = true; return { data: { data: { alerts: mockPendingItems } } }; }),
        coachId ? coachesAPI.getWeeklyStats(coachId).catch(() => { hadApiError = true; return { data: null }; }) : Promise.resolve({ data: null }),
        getNotifications({ unreadOnly: true }).catch(() => ({ unreadCount: 0 })),
      ]);

      // Only show toast once on initial load, not on background refreshes
      if (hadApiError && !isBackground && !hasShownToastRef.current) {
        hasShownToastRef.current = true;
        toast({
          title: 'Begrenset data',
          description: 'Noen data kunne ikke lastes. Viser demodata.',
          variant: 'default',
        });
      }

      // Transform athletes response (includes profile image support)
      const rawAthleteData = athletesRes.data?.data || athletesRes.data;
      let transformedAthletes: DashboardAthlete[];

      if (Array.isArray(rawAthleteData) && rawAthleteData.length > 0) {
        // API returned data - transform from AthleteDTO to DashboardAthlete
        transformedAthletes = (rawAthleteData as AthleteDTO[]).map((a): DashboardAthlete => ({
          id: a.id,
          firstName: a.firstName || '',
          lastName: a.lastName || '',
          category: a.category || 'B',
          lastSession: a.nextSession || a.planUpdated || new Date().toISOString().split('T')[0],
          profileImageUrl: a.profileImageUrl || a.avatar || null,
        }));
      } else {
        // No API data - use mock data
        transformedAthletes = mockAthletes;
      }

      // Transform alerts to pending items format
      const alertsResponse = (alertsRes.data?.data || alertsRes.data || {}) as AlertsResponseDTO | CoachAlertDTO[];
      const alertsData = (alertsResponse as AlertsResponseDTO)?.alerts || (Array.isArray(alertsResponse) ? alertsResponse : []);
      const transformedPendingItems = Array.isArray(alertsData) && alertsData.length > 0 ? alertsData.slice(0, 5).map((alert: CoachAlertDTO) => ({
        id: alert.id,
        type: alert.type === 'proof_uploaded' ? 'proof' : alert.type === 'plan_pending' ? 'plan' : 'note' as const,
        athlete: String(alert.athleteName || alert.playerName || 'Ukjent spiller'),
        description: String(alert.message || alert.text || alert.description || ''),
        time: formatTimeAgo(alert.createdAt || alert.created_at || ''),
      })) : mockPendingItems;

      // Get stats from statistics response
      const statsData = (statsRes.data?.data || statsRes.data) as CoachWeeklyStatsDTO | null;
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
        setUnreadNotifications(notificationsRes?.unreadCount || 0);
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
  }, [user, toast]);

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

  // Manual refresh function - MUST BE BEFORE CONDITIONAL RETURNS
  const refresh = useCallback(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Handle notifications button click - MUST BE BEFORE CONDITIONAL RETURNS
  const handleNotificationsClick = useCallback(() => {
    navigate('/coach/notifications');
  }, [navigate]);

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

  // Get user display info
  const coachName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Trener';

  return (
    <div className="min-h-screen bg-tier-surface-base">
      {/* Refreshing indicator bar */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-tier-navy animate-pulse z-50" />
      )}

      {/* TIER-compliant PageHeader */}
      <PageHeader
        title="Dashboard"
        subtitle="Oversikt over dine spillere og aktiviteter"
        helpText="Treneroversikt med alfabetisk liste over spillere, varsler som krever oppfølging og rask tilgang til viktige trenerverktøy. Se aktivitet og planlegg oppfølging av spillere."
      />

      <PageContainer paddingY="md" background="base">
        {/* Profile Overview Card */}
        <div className="pb-4">
        <div className="flex items-end justify-between mb-4">
          <div /> {/* Spacer */}
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-tier-text-secondary">
              {formatLastUpdated(lastUpdated)}
            </span>
            <button
              onClick={refresh}
              disabled={isRefreshing}
              className={`flex items-center justify-center w-9 h-9 bg-tier-white border border-tier-border-default rounded-lg transition-all ${
                isRefreshing ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-tier-surface-base'
              }`}
              title="Oppdater data"
            >
              <RefreshCw
                size={18}
                className={`text-tier-text-secondary ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>

        <ProfileOverviewCard
          name={coachName || 'Trener'}
          role="Trener"
          email={user?.email}
          stats={weeklyStats ? [
            { label: 'aktive spillere', value: weeklyStats.activePlayers || athletes.length },
            { label: 'økter denne uke', value: weeklyStats.sessionsThisWeek || 0 },
            { label: 'timer trent', value: weeklyStats.hoursTrained || 0 },
            { label: 'ventende', value: weeklyStats.pendingCount || pendingItems.length },
          ] : [
            { label: 'aktive spillere', value: athletes.length },
            { label: 'økter denne uke', value: 24 },
            { label: 'timer trent', value: 48 },
            { label: 'ventende', value: pendingItems.length },
          ]}
          profileHref="/coach/settings"
          unreadCount={unreadNotifications}
          onNotificationsClick={handleNotificationsClick}
        />
      </div>

        {/* Quick Actions - Simplified to 4 items */}
        <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map(action => (
            <button
              key={action.id}
              onClick={() => navigate(action.href)}
              className="flex flex-col items-center gap-2 py-4 px-3 bg-tier-white border-none rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-lg bg-tier-navy/10 flex items-center justify-center">
                <action.icon size={22} className="text-tier-navy" />
              </div>
              <span className="text-[13px] font-medium text-tier-navy">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

        {/* Critical Alerts Section */}
        <div className="pb-5">
        <Card variant="default" padding="none">
          <div className="p-5">
            <CoachPlayerAlerts
              maxItems={4}
              onViewAll={() => navigate('/coach/alerts')}
            />
          </div>
        </Card>
      </div>

        {/* Main content grid - Simplified to 2 core widgets */}
        <div className="pb-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Athletes List */}
        <Card variant="default" padding="none">
          <div className="p-5">
            <WidgetHeader
              title="Mine Spillere"
              icon={Users}
              action={{ label: 'Se alle', onClick: () => navigate('/coach/athletes') }}
            />

            {/* Search */}
            <div className="flex items-center gap-2 py-3 px-4 bg-white border border-tier-border-default rounded-lg mb-4 transition-all focus-within:border-tier-navy">
              <Search size={18} className="text-tier-text-secondary" />
              <input
                type="text"
                placeholder="Søk etter spiller..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border-none bg-transparent outline-none text-sm text-tier-navy placeholder:text-tier-text-tertiary"
              />
            </div>

            {/* Athletes list - Max 5 items */}
            <div className="flex flex-col gap-2">
              {sortedAthletes.slice(0, 5).map(athlete => (
                <div
                  key={athlete.id}
                  onClick={() => navigate(`/coach/athlete/${athlete.id}`)}
                  className="flex items-center gap-3 p-3 bg-tier-surface-base rounded-lg cursor-pointer transition-all hover:bg-tier-border-subtle"
                >
                  <Avatar
                    name={`${athlete.firstName} ${athlete.lastName}`}
                    imageUrl={athlete.profileImageUrl || undefined}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-tier-navy truncate">
                      {athlete.lastName}, {athlete.firstName}
                    </p>
                    <p className="text-xs text-tier-text-secondary">
                      Sist aktiv: {new Date(athlete.lastSession).toLocaleDateString('nb-NO')}
                    </p>
                  </div>
                  <CategoryBadge category={athlete.category} />
                  <ChevronRight size={16} className="text-tier-text-tertiary" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Pending Items */}
        <Card variant="default" padding="none">
          <div className="p-5">
            <WidgetHeader
              title="Venter på deg"
              icon={Bell}
              action={{ label: 'Se alle', onClick: () => navigate('/coach/pending') }}
            />

            {pendingItems.length === 0 ? (
              <div className="text-center py-8 px-4">
                <Bell size={32} className="text-tier-border-default mb-2 mx-auto" />
                <p className="text-sm text-tier-text-secondary">
                  Ingen ventende oppgaver
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {pendingItems.slice(0, 5).map(item => {
                  const colorClass = item.type === 'proof' ? 'bg-status-info/5 border-status-info' :
                                    item.type === 'note' ? 'bg-status-warning/5 border-status-warning' :
                                    'bg-status-success/5 border-status-success';
                  const iconColor = item.type === 'proof' ? 'text-status-info' :
                                   item.type === 'note' ? 'text-status-warning' :
                                   'text-status-success';

                  return (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-3 ${colorClass} rounded-lg border-l-3 cursor-pointer transition-all hover:shadow-sm`}
                    >
                      <div className="w-8 h-8 rounded-md bg-tier-white flex items-center justify-center shrink-0">
                        {item.type === 'proof' && <User size={16} className={iconColor} />}
                        {item.type === 'note' && <MessageSquare size={16} className={iconColor} />}
                        {item.type === 'plan' && <ClipboardList size={16} className={iconColor} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-tier-navy truncate">
                          {item.athlete}
                        </p>
                        <p className="text-xs text-tier-text-secondary truncate">
                          {item.description}
                        </p>
                      </div>
                      <span className="text-xs text-tier-text-tertiary shrink-0">
                        {item.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
        </div>
      </PageContainer>
    </div>
  );
}
