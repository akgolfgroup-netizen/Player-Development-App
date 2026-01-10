import { Prisma } from '@prisma/client';
import { getPrismaClient } from '../../../core/db/prisma';
import { AppError } from '../../../core/errors';

const prisma = getPrismaClient();

/**
 * Milestone data structure
 */
interface GoalMilestone {
  title: string;
  targetValue?: number;
  completed?: boolean;
  completedDate?: string;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  goalType: string;
  timeframe: string;
  targetValue?: number;
  currentValue?: number;
  startValue?: number;
  unit?: string;
  startDate: Date;
  targetDate: Date;
  icon?: string;
  color?: string;
  notes?: string;
  milestones?: GoalMilestone[];
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  goalType?: string;
  timeframe?: string;
  targetValue?: number;
  currentValue?: number;
  startValue?: number;
  unit?: string;
  progressPercent?: number;
  startDate?: Date;
  targetDate?: Date;
  completedDate?: Date;
  status?: string;
  icon?: string;
  color?: string;
  notes?: string;
  milestones?: GoalMilestone[];
}

export class GoalsService {
  /**
   * Calculate progress percentage based on current, start, and target values
   */
  private calculateProgress(startValue?: number, currentValue?: number, targetValue?: number): number {
    if (startValue === undefined || currentValue === undefined || targetValue === undefined) {
      return 0;
    }

    if (targetValue === startValue) {
      return currentValue >= targetValue ? 100 : 0;
    }

    const progress = ((currentValue - startValue) / (targetValue - startValue)) * 100;
    return Math.max(0, Math.min(100, Math.round(progress)));
  }

  async listGoals(userId: string, status?: string) {
    const where: Prisma.GoalWhereInput = { userId };

    if (status) {
      where.status = status;
    }

    return prisma.goal.findMany({
      where,
      orderBy: [
        { status: 'asc' }, // active first
        { targetDate: 'asc' } // soonest deadline first
      ]
    });
  }

  async getGoalById(goalId: string, userId: string) {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId }
    });

    if (!goal) {
      throw new AppError('validation_error', 'Goal not found', 404, { goalId });
    }

    if (goal.userId !== userId) {
      throw new AppError('authorization_error', 'You do not have permission to access this goal', 403);
    }

    return goal;
  }

  async createGoal(userId: string, input: CreateGoalInput) {
    // Calculate initial progress
    const progressPercent = this.calculateProgress(
      input.startValue ? Number(input.startValue) : undefined,
      input.currentValue ? Number(input.currentValue) : undefined,
      input.targetValue ? Number(input.targetValue) : undefined
    );

    return prisma.goal.create({
      data: {
        userId,
        title: input.title,
        description: input.description,
        goalType: input.goalType,
        timeframe: input.timeframe,
        targetValue: input.targetValue ? new Prisma.Decimal(input.targetValue) : null,
        currentValue: input.currentValue ? new Prisma.Decimal(input.currentValue) : null,
        startValue: input.startValue ? new Prisma.Decimal(input.startValue) : null,
        unit: input.unit,
        progressPercent,
        startDate: input.startDate,
        targetDate: input.targetDate,
        icon: input.icon,
        color: input.color,
        notes: input.notes,
        milestones: (input.milestones || []) as unknown as Prisma.InputJsonValue
      }
    });
  }

  async updateGoal(goalId: string, userId: string, input: UpdateGoalInput) {
    // First verify ownership
    const existingGoal = await this.getGoalById(goalId, userId);

    // Prepare update data
    const updateData: Prisma.GoalUpdateInput = {};

    // Basic fields
    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.goalType !== undefined) updateData.goalType = input.goalType;
    if (input.timeframe !== undefined) updateData.timeframe = input.timeframe;
    if (input.unit !== undefined) updateData.unit = input.unit;
    if (input.startDate !== undefined) updateData.startDate = input.startDate;
    if (input.targetDate !== undefined) updateData.targetDate = input.targetDate;
    if (input.completedDate !== undefined) updateData.completedDate = input.completedDate;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.icon !== undefined) updateData.icon = input.icon;
    if (input.color !== undefined) updateData.color = input.color;
    if (input.notes !== undefined) updateData.notes = input.notes;
    if (input.milestones !== undefined) updateData.milestones = input.milestones as unknown as Prisma.InputJsonValue;

    // Numeric fields (convert to Decimal)
    if (input.targetValue !== undefined) {
      updateData.targetValue = input.targetValue ? new Prisma.Decimal(input.targetValue) : null;
    }
    if (input.currentValue !== undefined) {
      updateData.currentValue = input.currentValue ? new Prisma.Decimal(input.currentValue) : null;
    }
    if (input.startValue !== undefined) {
      updateData.startValue = input.startValue ? new Prisma.Decimal(input.startValue) : null;
    }

    // Recalculate progress if values changed
    const newStartValue = input.startValue !== undefined ? input.startValue : Number(existingGoal.startValue || 0);
    const newCurrentValue = input.currentValue !== undefined ? input.currentValue : Number(existingGoal.currentValue || 0);
    const newTargetValue = input.targetValue !== undefined ? input.targetValue : Number(existingGoal.targetValue || 0);

    if (input.progressPercent !== undefined) {
      updateData.progressPercent = input.progressPercent;
    } else if (input.targetValue !== undefined || input.currentValue !== undefined || input.startValue !== undefined) {
      updateData.progressPercent = this.calculateProgress(newStartValue, newCurrentValue, newTargetValue);
    }

    // Auto-complete goal if progress reaches 100%
    if (updateData.progressPercent === 100 && existingGoal.status === 'active') {
      updateData.status = 'completed';
      updateData.completedDate = new Date();
    }

    updateData.updatedAt = new Date();

    return prisma.goal.update({
      where: { id: goalId },
      data: updateData
    });
  }

  async deleteGoal(goalId: string, userId: string) {
    // First verify ownership
    await this.getGoalById(goalId, userId);

    await prisma.goal.delete({
      where: { id: goalId }
    });

    return { success: true };
  }

  async updateProgress(goalId: string, userId: string, currentValue: number) {
    const goal = await this.getGoalById(goalId, userId);

    const progressPercent = this.calculateProgress(
      Number(goal.startValue || 0),
      currentValue,
      Number(goal.targetValue || 0)
    );

    const updateData: Prisma.GoalUpdateInput = {
      currentValue: new Prisma.Decimal(currentValue),
      progressPercent,
      updatedAt: new Date()
    };

    // Auto-complete if reaches 100%
    if (progressPercent === 100 && goal.status === 'active') {
      updateData.status = 'completed';
      updateData.completedDate = new Date();
    }

    return prisma.goal.update({
      where: { id: goalId },
      data: updateData
    });
  }

  async getGoalsByType(userId: string, goalType: string) {
    return prisma.goal.findMany({
      where: {
        userId,
        goalType
      },
      orderBy: [
        { status: 'asc' },
        { targetDate: 'asc' }
      ]
    });
  }

  async getActiveGoals(userId: string) {
    return this.listGoals(userId, 'active');
  }

  async getCompletedGoals(userId: string) {
    return this.listGoals(userId, 'completed');
  }

  // =============================================================================
  // Streak Methods
  // =============================================================================

  async getStreak(userId: string) {
    // TODO: Replace in-memory storage with database table
    // For now, return demo data
    return {
      currentStreak: 7,
      longestStreak: 14,
      lastActivityDate: new Date().toISOString(),
      streakStatus: 'active' as const,
      daysUntilExpiry: 0
    };
  }

  async updateStreak(userId: string, goalId: string, progressValue: number) {
    // TODO: Implement streak tracking with database
    return {
      success: true,
      currentStreak: 7,
      streakUpdated: true,
      message: 'Streak updated successfully'
    };
  }

  // =============================================================================
  // Stats Methods
  // =============================================================================

  async getStats(userId: string) {
    const allGoals = await this.listGoals(userId);
    const activeGoals = allGoals.filter(g => g.status === 'active');
    const completedGoals = allGoals.filter(g => g.status === 'completed');

    const avgProgress = activeGoals.length > 0
      ? Math.round(activeGoals.reduce((sum, g) => sum + (g.progressPercent || 0), 0) / activeGoals.length)
      : 0;

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const completedThisMonth = completedGoals.filter(
      g => g.completedDate && new Date(g.completedDate) >= thisMonth
    ).length;

    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingDeadlines = activeGoals
      .filter(g => g.targetDate && new Date(g.targetDate) <= sevenDaysFromNow)
      .map(g => ({
        id: g.id,
        title: g.title,
        deadline: g.targetDate?.toISOString() || '',
        progress: g.progressPercent || 0,
        category: g.goalType
      }));

    return {
      totalActive: activeGoals.length,
      totalCompleted: completedGoals.length,
      averageProgress: avgProgress,
      completedThisMonth,
      upcomingDeadlines,
      recentActivity: []
    };
  }

  // =============================================================================
  // Badges Methods
  // =============================================================================

  async getBadges(userId: string) {
    // TODO: Replace with database table
    // For now, return demo badges
    return {
      badges: [
        {
          id: '1',
          badgeId: 'first_goal',
          name: 'Første Mål',
          description: 'Fullført ditt første mål',
          icon: '🎯',
          rarity: 'common' as const,
          unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          viewed: true
        }
      ],
      unlockedCount: 1,
      totalBadges: 16,
      recentUnlocks: [
        {
          id: '1',
          badgeId: 'first_goal',
          name: 'Første Mål',
          icon: '🎯',
          unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    };
  }

  async unlockBadge(userId: string, badgeId: string) {
    // TODO: Implement badge unlocking with database
    return {
      success: true,
      badge: {
        id: 'new-badge-id',
        badgeId,
        name: 'New Badge',
        description: 'Badge description',
        icon: '🏆',
        rarity: 'rare' as const,
        unlockedAt: new Date().toISOString()
      }
    };
  }

  async markBadgeViewed(userId: string, badgeId: string) {
    // TODO: Implement with database
    return { success: true };
  }
}
