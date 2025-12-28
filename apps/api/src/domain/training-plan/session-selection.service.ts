/**
 * Session Selection Service
 * Selects appropriate session templates for daily training assignments
 */

import { getPrismaClient } from '../../core/db/prisma';
import type {
  DailyAssignmentContext,
  SessionSelectionCriteria,
  SelectedSession,
} from './plan-generation.types';

const prisma = getPrismaClient();

export class SessionSelectionService {
  // Number of days to look back for recently used templates
  private static TEMPLATE_HISTORY_DAYS = 7;

  /**
   * Get recently used template IDs for a player
   * Helps ensure variety in session selection
   */
  private static async getRecentlyUsedTemplates(
    playerId: string,
    days: number = this.TEMPLATE_HISTORY_DAYS
  ): Promise<string[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentAssignments = await prisma.dailyTrainingAssignment.findMany({
      where: {
        playerId,
        assignedDate: { gte: cutoffDate },
        sessionTemplateId: { not: null },
        status: { in: ['completed', 'in_progress'] },
      },
      select: { sessionTemplateId: true },
      distinct: ['sessionTemplateId'],
    });

    return recentAssignments
      .map((a: { sessionTemplateId: string | null }) => a.sessionTemplateId)
      .filter((id: string | null): id is string => id !== null);
  }

  /**
   * Select session template for a specific day
   */
  static async selectSessionForDay(
    context: DailyAssignmentContext
  ): Promise<SelectedSession | null> {
    // Rest day - no session
    if (context.isRestDay) {
      return null;
    }

    // Calculate available duration for this session
    const remainingHours = context.targetHoursThisWeek - context.hoursAllocatedSoFar;
    const targetDuration = Math.min(remainingHours * 60, 180); // Max 3 hours per session

    if (targetDuration < 30) {
      // Not enough time for a meaningful session
      return null;
    }

    // Get recently used templates to ensure variety
    const recentlyUsedTemplateIds = await this.getRecentlyUsedTemplates(context.playerId);

    // Build selection criteria
    const criteria: SessionSelectionCriteria = {
      period: context.period,
      learningPhases: context.learningPhases,
      clubSpeed: context.clubSpeedLevel,
      settings: context.settings,
      breakingPointIds: context.breakingPointIds,
      targetDuration,
      intensity: context.intensity,
      excludeTemplateIds: recentlyUsedTemplateIds,
    };

    // Select session
    return await this.selectSession(criteria, context.tenantId);
  }

  /**
   * Select best session template based on criteria
   */
  private static async selectSession(
    criteria: SessionSelectionCriteria,
    tenantId: string
  ): Promise<SelectedSession | null> {
    // Query session templates matching criteria
    const templates = await prisma.sessionTemplate.findMany({
      where: {
        tenantId,
        isActive: true,
        periods: {
          hasSome: this.getCompatiblePeriods(criteria.period),
        },
        learningPhase: {
          in: criteria.learningPhases,
        },
        clubSpeed: criteria.clubSpeed,
        setting: {
          in: criteria.settings,
        },
        duration: {
          gte: Math.max(30, criteria.targetDuration - 30),
          lte: criteria.targetDuration + 30,
        },
        id: {
          notIn: criteria.excludeTemplateIds,
        },
      },
      include: {
        _count: {
          select: {
            dailyAssignments: true,
          },
        },
      },
      take: 20,
    });

    if (templates.length === 0) {
      return null;
    }

    // Score and rank templates
    const scored = templates.map((template: any) => {
      const score = this.scoreTemplate(template, criteria);
      return { template, score };
    });

    // Sort by score (descending)
    scored.sort((a: any, b: any) => b.score - a.score);

    // Select top template
    const best = scored[0];
    if (!best) return null;

    return {
      sessionTemplateId: best.template.id,
      sessionType: best.template.sessionType,
      estimatedDuration: best.template.duration,
      learningPhase: best.template.learningPhase,
      setting: (best.template.setting as string) || 'S1',
      period: (best.template.periods as string[])[0] || 'E',
      priority: best.score,
    };
  }

  /**
   * Score a template based on how well it matches criteria
   */
  private static scoreTemplate(template: any, criteria: SessionSelectionCriteria): number {
    let score = 0;

    // Exact period match
    const periods = template.periods as string[];
    if (periods && periods.includes(criteria.period)) {
      score += 100;
    }

    // Learning phase match
    if (criteria.learningPhases.includes(template.learningPhase)) {
      score += 50;
    }

    // Duration match (closer = better)
    const durationDiff = Math.abs(template.duration - criteria.targetDuration);
    score += Math.max(0, 50 - durationDiff);

    // Club speed match
    const clubSpeed = template.clubSpeed as string;
    if (clubSpeed === criteria.clubSpeed) {
      score += 30;
    }

    // Settings match
    const setting = template.setting as string;
    if (setting && criteria.settings.includes(setting)) {
      score += 30;
    }

    // Breaking point relevance
    if (criteria.breakingPointIds.length > 0) {
      // Check if template exercises match breaking point exercises
      score += this.calculateBreakingPointRelevance(template, criteria.breakingPointIds);
    }

    // Prefer less frequently used templates (for variety)
    const usageCount = template._count?.dailyAssignments || 0;
    score -= usageCount * 2;

    // Intensity match
    const intensityMatch = this.matchesIntensity(template.intensity, criteria.intensity);
    if (intensityMatch) {
      score += 40;
    }

    return score;
  }

  /**
   * Calculate how relevant a template is to player's breaking points
   */
  private static calculateBreakingPointRelevance(
    _template: any,
    breakingPointIds: string[]
  ): number {
    // This is a simplified version - in reality, we'd need to:
    // 1. Fetch breaking points
    // 2. Get their assigned exercise IDs
    // 3. Compare with template's exercise IDs
    // For now, just return a base score
    return breakingPointIds.length > 0 ? 20 : 0;
  }

  /**
   * Check if template intensity matches criteria
   */
  private static matchesIntensity(templateIntensity: number, criteriaIntensity: string): boolean {
    const intensityMap: Record<string, [number, number]> = {
      low: [1, 4],
      medium: [4, 7],
      high: [7, 9],
      peak: [9, 10],
      taper: [3, 6],
    };

    const range = intensityMap[criteriaIntensity];
    if (!range) return false;

    return templateIntensity >= range[0] && templateIntensity <= range[1];
  }

  /**
   * Get compatible periods (e.g., 'S' sessions can work in 'T' period)
   */
  private static getCompatiblePeriods(period: string): string[] {
    const compatibility: Record<string, string[]> = {
      E: ['E'],
      G: ['E', 'G'],
      S: ['G', 'S'],
      T: ['S', 'T'],
    };

    return compatibility[period] || [period];
  }

  /**
   * Get session type distribution for a week
   */
  static getWeeklySessionDistribution(
    periodPhase: string,
    weeklyHours: number
  ): Record<string, number> {
    // Default distribution based on period phase
    const distributions: Record<string, Record<string, number>> = {
      base: {
        technical: 0.4,
        physical: 0.3,
        mental: 0.15,
        recovery: 0.15,
      },
      specialization: {
        technical: 0.35,
        physical: 0.25,
        mental: 0.2,
        tactical: 0.2,
      },
      tournament: {
        tactical: 0.4,
        mental: 0.3,
        technical: 0.2,
        recovery: 0.1,
      },
      recovery: {
        recovery: 0.6,
        mental: 0.2,
        technical: 0.2,
      },
    };

    const distribution = distributions[periodPhase] || distributions.base;

    // Convert percentages to hours
    const result: Record<string, number> = {};
    for (const [type, percentage] of Object.entries(distribution)) {
      result[type] = Math.round(weeklyHours * percentage);
    }

    return result;
  }

  /**
   * Determine if a day should be a rest day
   */
  static shouldBeRestDay(
    dayOfWeek: number,
    _weekNumber: number,
    intensity: string,
    preferredTrainingDays?: number[]
  ): boolean {
    // If preferred training days specified, check if this day is included
    if (preferredTrainingDays && preferredTrainingDays.length > 0) {
      return !preferredTrainingDays.includes(dayOfWeek);
    }

    // Default rest day logic
    // Sunday (0) is typically a rest day
    if (dayOfWeek === 0) return true;

    // High intensity periods: 1 rest day per week (Sunday)
    if (intensity === 'peak' || intensity === 'high') {
      return dayOfWeek === 0;
    }

    // Medium intensity: 2 rest days per week (Sunday and Wednesday)
    if (intensity === 'medium') {
      return dayOfWeek === 0 || dayOfWeek === 3;
    }

    // Low/taper: 3 rest days per week (Sunday, Wednesday, Friday)
    if (intensity === 'low' || intensity === 'taper') {
      return dayOfWeek === 0 || dayOfWeek === 3 || dayOfWeek === 5;
    }

    return dayOfWeek === 0;
  }
}
