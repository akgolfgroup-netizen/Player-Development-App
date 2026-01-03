/**
 * @iup/shared-types - Goal types
 *
 * CANONICAL SOURCE OF TRUTH for player goal models.
 *
 * Write access: goals/
 * Read access: dashboard/, coach/, achievements/
 *
 * Single Goal model with optional milestones.
 */

import type {
  UUID,
  ISODateString,
  ISODateTimeString,
  GoalType,
  GoalTimeframe,
  GoalStatus,
  UserEntity,
} from './common'

// ============================================================================
// CORE GOAL MODEL
// ============================================================================

/**
 * Canonical Goal model.
 * User-scoped (userId) to support both players and coaches having goals.
 */
export interface Goal extends UserEntity {
  // REQUIRED - Goal definition
  title: string
  goalType: GoalType
  timeframe: GoalTimeframe
  startDate: ISODateString
  targetDate: ISODateString
  status: GoalStatus

  // OPTIONAL - Description
  description?: string

  // OPTIONAL - Measurable target
  targetValue?: number
  currentValue?: number
  startValue?: number
  unit?: string // 'score', 'mph', 'meters', 'percent', etc.

  // DERIVED - Progress (computed from values)
  progressPercent: number

  // OPTIONAL - Completion
  completedDate?: ISODateString

  // OPTIONAL - Visual
  icon?: string
  color?: string

  // OPTIONAL - Notes
  notes?: string

  // OPTIONAL - Milestones
  milestones?: GoalMilestone[]
}

/**
 * Goal milestone for tracking intermediate progress.
 */
export interface GoalMilestone {
  id: UUID
  title: string
  targetValue?: number
  completed: boolean
  completedDate?: ISODateString
}

/**
 * Input for creating a new goal.
 */
export interface GoalCreateInput {
  userId: UUID
  title: string
  goalType: GoalType
  timeframe: GoalTimeframe
  startDate: ISODateString
  targetDate: ISODateString
  description?: string
  targetValue?: number
  startValue?: number
  unit?: string
  icon?: string
  color?: string
  notes?: string
  milestones?: Array<{
    title: string
    targetValue?: number
  }>
}

/**
 * Input for updating a goal.
 */
export interface GoalUpdateInput {
  id: UUID
  title?: string
  description?: string | null
  goalType?: GoalType
  timeframe?: GoalTimeframe
  startDate?: ISODateString
  targetDate?: ISODateString
  status?: GoalStatus
  targetValue?: number | null
  currentValue?: number | null
  unit?: string | null
  completedDate?: ISODateString | null
  icon?: string | null
  color?: string | null
  notes?: string | null
}

/**
 * Input for updating a milestone within a goal.
 */
export interface MilestoneUpdateInput {
  goalId: UUID
  milestoneId: UUID
  title?: string
  targetValue?: number | null
  completed?: boolean
  completedDate?: ISODateString | null
}

// ============================================================================
// GOAL QUERY TYPES
// ============================================================================

/**
 * Filters for querying goals.
 */
export interface GoalFilters {
  userId?: UUID
  goalType?: GoalType | GoalType[]
  timeframe?: GoalTimeframe | GoalTimeframe[]
  status?: GoalStatus | GoalStatus[]
  dateFrom?: ISODateString
  dateTo?: ISODateString
}

/**
 * Goal summary for list views.
 */
export interface GoalSummary {
  id: UUID
  title: string
  goalType: GoalType
  timeframe: GoalTimeframe
  status: GoalStatus
  progressPercent: number
  targetDate: ISODateString
  daysRemaining?: number
}

/**
 * Goals grouped by type or timeframe.
 */
export interface GoalsByType {
  type: GoalType
  goals: GoalSummary[]
  totalCount: number
  completedCount: number
}

export interface GoalsByTimeframe {
  timeframe: GoalTimeframe
  goals: GoalSummary[]
  totalCount: number
  completedCount: number
}

// ============================================================================
// GOAL PROGRESS (Computed)
// ============================================================================

/**
 * Computed goal progress with trend analysis.
 */
export interface GoalProgress {
  goalId: UUID
  currentValue: number
  targetValue: number
  startValue: number
  progressPercent: number
  trend: 'on_track' | 'ahead' | 'behind' | 'at_risk'
  projectedCompletionDate?: ISODateString
  milestonesCompleted: number
  milestonesTotal: number
}

/**
 * Goal activity for timeline display.
 */
export interface GoalActivity {
  goalId: UUID
  date: ISODateTimeString
  type: 'created' | 'updated' | 'milestone_completed' | 'value_changed' | 'completed'
  description: string
  previousValue?: number
  newValue?: number
}
