/**
 * ================================================================
 * Dashboard Frontend Type Definitions
 * ================================================================
 *
 * Re-exports types from the API to ensure type safety across the monorepo.
 * Import these types in React components instead of defining them locally.
 */

// Re-export all types from the API (monorepo relative path)
export type {
  // Enums
  PlayerTier,
  SessionType,
  SessionStatus,
  BadgeTier,
  GoalStatus,
  GoalPriority,
  BreakingPointSeverity,
  BreakingPointStatus,

  // Interfaces
  PlayerProfile,
  PeriodInfo,
  TrainingSession,
  Badge,
  Goal,
  WeeklyStats,
  Message,
  Tournament,
  Test,
  BreakingPoint,
  TestResult,
  DashboardResponse,

  // Query params
  DashboardQueryParams,
  WeeklyStatsQueryParams,
  GoalsQueryParams,

  // Error types
  ApiError,
} from '../../../api/src/api/v1/dashboard/types';

// Re-export type guards
export { isDashboardResponse, isApiError } from '../../../api/src/api/v1/dashboard/types';

/**
 * Frontend-specific types
 */

/**
 * Dashboard loading state
 */
export type DashboardLoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * useDashboard hook return type
 */
export interface UseDashboardReturn {
  dashboardData: DashboardResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Dashboard filter options
 */
export interface DashboardFilters {
  date?: Date;
  showOnlyActive?: boolean;
}

/**
 * UI State for dashboard widgets
 */
export interface WidgetState {
  isExpanded: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Chart data point for stats visualization
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
  color?: string;
}

/**
 * Type guard for checking if a session is scheduled today
 */
export function isToday(session: TrainingSession): boolean {
  const sessionDate = new Date(session.scheduledTime);
  const today = new Date();
  return (
    sessionDate.getDate() === today.getDate() &&
    sessionDate.getMonth() === today.getMonth() &&
    sessionDate.getFullYear() === today.getFullYear()
  );
}

/**
 * Type guard for checking if a goal is overdue
 */
export function isOverdue(goal: Goal): boolean {
  if (!goal.targetDate) return false;
  const targetDate = new Date(goal.targetDate);
  const today = new Date();
  return targetDate < today && goal.status === 'active';
}

/**
 * Helper to format session duration
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}t ${mins}min` : `${hours}t`;
}

/**
 * Helper to get severity color class
 */
export function getSeverityColor(severity: BreakingPointSeverity): string {
  const colors: Record<BreakingPointSeverity, string> = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    critical: 'text-red-600',
  };
  return colors[severity];
}

/**
 * Helper to get badge tier color
 */
export function getBadgeTierColor(tier: BadgeTier): string {
  const colors: Record<BadgeTier, string> = {
    bronze: 'text-amber-700',
    silver: 'text-gray-400',
    gold: 'text-yellow-500',
    platinum: 'text-purple-400',
  };
  return colors[tier];
}
