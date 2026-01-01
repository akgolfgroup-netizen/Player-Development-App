/**
 * Goal Domain Module
 *
 * Centralized exports for goal-related domain logic including:
 * - Type mappers (canonical → UI)
 * - Timeframe/status mappings with semantic gap handling
 * - Utility functions for goal calculations
 * - Semantic gap documentation
 *
 * NAMING CONVENTION: See docs/naming.md
 * - All exports use English names
 * - Canonical types re-exported from @iup/shared-types
 */

// ============================================================================
// CANONICAL TYPES (Re-exported from @iup/shared-types)
// ============================================================================

export type {
  Goal,
  GoalMilestone,
  GoalCreateInput,
  GoalUpdateInput,
  GoalFilters,
  GoalSummary,
  GoalProgress,
  GoalActivity,
  GoalType,
  GoalTimeframe,
  GoalStatus,
  GoalProgressTrend,
  GoalActivityType,
} from '@iup/shared-types';

export {
  GOAL_TYPES,
  GOAL_TIMEFRAMES,
  GOAL_STATUSES,
  GOAL_PROGRESS_TRENDS,
  GOAL_ACTIVITY_TYPES,
} from '@iup/shared-types';

// ============================================================================
// UI TYPES & MAPPERS
// ============================================================================

export {
  // UI Types
  type UIGoal,
  type UIGoalStatus,
  type UIGoalType,
  type UIGoalStatsItem,
  type UIGoalsData,

  // API Types
  type ApiGoalResponse,
  type ApiGoalsListResponse,

  // Canonical → UI mappers
  mapGoalTimeframeToUIType,
  mapGoalStatusToUI,
  mapCanonicalGoalToUI,
  mapGoalSummaryToUI,

  // API/String → UI mappers (with fallback)
  mapStringToUIGoalType,
  mapStringToUIGoalStatus,
  mapApiGoalToUI,
  mapApiGoalsToUIData,

  // Utility functions
  calculateAverageProgress,
  groupGoalsByType,
  groupGoalsByStatus,

  // Deprecated aliases
  mapGoalStatus,
} from './mappers';
