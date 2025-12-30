/**
 * Session Selection Service
 * Selects appropriate session templates for daily training assignments
 *
 * V2 Enhancements:
 * - domainCoverageBonus: +50 points if template trains a domain with active BP
 * - constraintRelevance: +40 points if template trains a top-2 constraint
 * - proofProgress: +30 points if session includes proof-metric exercise
 * - recentlyCompleted: -20 points per use in last 7 days
 */

import { Prisma } from '@prisma/client';
import { getPrismaClient } from '../../core/db/prisma';
import type {
  DailyAssignmentContext,
  SessionSelectionCriteria,
  SelectedSession,
} from './plan-generation.types';
import {
  getProofMetricsForDomain,
  type TestDomainCode,
} from '../performance/domain-mapping';
import type { BindingConstraint } from '../performance/category-constraints';

const prisma = getPrismaClient();

/**
 * Session template with count relations
 */
type SessionTemplateWithCount = Prisma.SessionTemplateGetPayload<{
  include: { _count: { select: { dailyAssignments: true } } };
}>;

/**
 * Scored template for ranking
 */
interface ScoredTemplate {
  template: SessionTemplateWithCount;
  score: number;
  scoreBreakdown?: ScoreBreakdown;
}

/**
 * V2: Score breakdown for debugging/analysis
 */
interface ScoreBreakdown {
  periodMatch: number;
  learningPhaseMatch: number;
  durationMatch: number;
  clubSpeedMatch: number;
  settingsMatch: number;
  breakingPointRelevance: number;
  domainCoverageBonus: number;
  constraintRelevance: number;
  proofProgressBonus: number;
  recentUsagePenalty: number;
  intensityMatch: number;
}

/**
 * V2: Extended selection context with domain/constraint awareness
 */
interface EnhancedSelectionContext {
  activeBPDomains: TestDomainCode[];
  topConstraints: BindingConstraint[];
  proofMetricTestNumbers: number[];
  templateUsageCounts: Map<string, number>;
}

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
   * V2: Uses enhanced context for domain/constraint-aware selection
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

    // V2: Build enhanced context for domain/constraint-aware scoring
    const enhancedContext = await this.buildEnhancedContext(context.playerId, context.tenantId);

    // Select session with enhanced context
    return await this.selectSession(criteria, context.tenantId, enhancedContext);
  }

  /**
   * V2: Select session with pre-built enhanced context
   * Use this when you already have constraints from CategoryConstraintsService
   */
  static async selectSessionForDayWithContext(
    context: DailyAssignmentContext,
    topConstraints: BindingConstraint[]
  ): Promise<SelectedSession | null> {
    // Rest day - no session
    if (context.isRestDay) {
      return null;
    }

    // Calculate available duration for this session
    const remainingHours = context.targetHoursThisWeek - context.hoursAllocatedSoFar;
    const targetDuration = Math.min(remainingHours * 60, 180);

    if (targetDuration < 30) {
      return null;
    }

    // Get recently used templates
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

    // Build enhanced context with provided constraints
    const baseContext = await this.buildEnhancedContext(context.playerId, context.tenantId);
    const enhancedContext: EnhancedSelectionContext = {
      ...baseContext,
      topConstraints,
    };

    return await this.selectSession(criteria, context.tenantId, enhancedContext);
  }

  /**
   * Select best session template based on criteria
   * V2: Uses enhanced context for domain/constraint-aware scoring
   */
  private static async selectSession(
    criteria: SessionSelectionCriteria,
    tenantId: string,
    enhancedContext?: EnhancedSelectionContext
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

    // Score and rank templates with V2 enhanced context
    const scored: ScoredTemplate[] = templates.map((template) => {
      const { score, breakdown } = this.scoreTemplate(template, criteria, enhancedContext);
      return { template, score, scoreBreakdown: breakdown };
    });

    // Sort by score (descending)
    scored.sort((a, b) => b.score - a.score);

    // Select top template
    const best = scored[0];
    if (!best) return null;

    return {
      sessionTemplateId: best.template.id,
      sessionType: best.template.sessionType,
      estimatedDuration: best.template.duration,
      learningPhase: best.template.learningPhase || 'N',
      setting: (best.template.setting as string) || 'S1',
      period: (best.template.periods as string[])[0] || 'E',
      priority: best.score,
    };
  }

  /**
   * Score a template based on how well it matches criteria
   * V2: Enhanced with domain/constraint awareness
   */
  private static scoreTemplate(
    template: SessionTemplateWithCount,
    criteria: SessionSelectionCriteria,
    enhancedContext?: EnhancedSelectionContext
  ): { score: number; breakdown: ScoreBreakdown } {
    const breakdown: ScoreBreakdown = {
      periodMatch: 0,
      learningPhaseMatch: 0,
      durationMatch: 0,
      clubSpeedMatch: 0,
      settingsMatch: 0,
      breakingPointRelevance: 0,
      domainCoverageBonus: 0,
      constraintRelevance: 0,
      proofProgressBonus: 0,
      recentUsagePenalty: 0,
      intensityMatch: 0,
    };

    // Exact period match (+100)
    const periods = template.periods as string[];
    if (periods && periods.includes(criteria.period)) {
      breakdown.periodMatch = 100;
    }

    // Learning phase match (+50)
    if (template.learningPhase && criteria.learningPhases.includes(template.learningPhase)) {
      breakdown.learningPhaseMatch = 50;
    }

    // Duration match (closer = better, max +50)
    const durationDiff = Math.abs(template.duration - criteria.targetDuration);
    breakdown.durationMatch = Math.max(0, 50 - durationDiff);

    // Club speed match (+30)
    const clubSpeed = template.clubSpeed as string;
    if (clubSpeed === criteria.clubSpeed) {
      breakdown.clubSpeedMatch = 30;
    }

    // Settings match (+30)
    const setting = template.setting as string;
    if (setting && criteria.settings.includes(setting)) {
      breakdown.settingsMatch = 30;
    }

    // Breaking point relevance (+20 base)
    if (criteria.breakingPointIds.length > 0) {
      breakdown.breakingPointRelevance = this.calculateBreakingPointRelevance(
        template,
        criteria.breakingPointIds
      );
    }

    // V2: Domain coverage bonus (+50)
    if (enhancedContext?.activeBPDomains.length) {
      const templateDomain = this.getDomainForSession(template);
      if (templateDomain && enhancedContext.activeBPDomains.includes(templateDomain)) {
        breakdown.domainCoverageBonus = 50;
      }
    }

    // V2: Constraint relevance (+40)
    if (enhancedContext?.topConstraints.length) {
      const templateDomain = this.getDomainForSession(template);
      const constraintDomains = enhancedContext.topConstraints.map((c) => c.domainCode);
      if (templateDomain && constraintDomains.includes(templateDomain)) {
        breakdown.constraintRelevance = 40;
      }
    }

    // V2: Proof progress bonus (+30)
    if (enhancedContext?.proofMetricTestNumbers.length) {
      const templateTestNumbers = this.getTestNumbersForTemplate(template);
      const hasProofMetric = templateTestNumbers.some((tn) =>
        enhancedContext.proofMetricTestNumbers.includes(tn)
      );
      if (hasProofMetric) {
        breakdown.proofProgressBonus = 30;
      }
    }

    // V2: Recent usage penalty (-20 per use in last 7 days)
    if (enhancedContext?.templateUsageCounts) {
      const usageCount = enhancedContext.templateUsageCounts.get(template.id) || 0;
      breakdown.recentUsagePenalty = -usageCount * 20;
    } else {
      // Fallback: use global count with smaller penalty
      const usageCount = template._count?.dailyAssignments || 0;
      breakdown.recentUsagePenalty = -usageCount * 2;
    }

    // Intensity match (+40)
    const estimatedIntensity = template.duration >= 90 ? 'high' : template.duration >= 60 ? 'medium' : 'low';
    if (estimatedIntensity === criteria.intensity) {
      breakdown.intensityMatch = 40;
    }

    // Calculate total score
    const score = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

    return { score, breakdown };
  }

  /**
   * V2: Get the primary domain for a session template
   */
  private static getDomainForSession(template: SessionTemplateWithCount): TestDomainCode | null {
    // Check template name or type for domain hints
    const name = (template.name || '').toUpperCase();
    const type = (template.sessionType || '').toUpperCase();
    const setting = (template.setting as string || '').toUpperCase();

    // Map common session names/types to domains
    if (name.includes('DRIVER') || name.includes('TEE') || type.includes('DRIVING')) {
      return 'TEE';
    }
    if (name.includes('APPROACH') || name.includes('INN')) {
      // Check for distance hints
      if (name.includes('200') || name.includes('LANG')) return 'INN200';
      if (name.includes('150')) return 'INN150';
      if (name.includes('100')) return 'INN100';
      if (name.includes('50') || name.includes('KORT')) return 'INN50';
      return 'INN100'; // Default approach
    }
    if (name.includes('CHIP') || name.includes('PITCH') || name.includes('ARG') || name.includes('AROUND')) {
      return 'ARG';
    }
    if (name.includes('PUTT') || name.includes('GREEN')) {
      return 'PUTT';
    }
    if (name.includes('FITNESS') || name.includes('STYRKE') || name.includes('PHYSICAL') || type.includes('PHYSICAL')) {
      return 'PHYS';
    }

    // Check setting (S1=range, S2=course, etc.)
    if (setting === 'S1') {
      // Range - likely driving or approach
      return 'TEE';
    }
    if (setting === 'S3') {
      // Short game area
      return 'ARG';
    }
    if (setting === 'S4') {
      // Putting green
      return 'PUTT';
    }

    return null;
  }

  /**
   * V2: Get test numbers associated with a template's exercises
   */
  private static getTestNumbersForTemplate(_template: SessionTemplateWithCount): number[] {
    // In a full implementation, we'd query the template's exercises
    // and map them to test numbers via the domain mapping.
    // For MVP, return empty array - this will be enhanced when
    // session templates have exercise relations.
    return [];
  }

  /**
   * V2: Build enhanced selection context for a player
   */
  static async buildEnhancedContext(
    playerId: string,
    _tenantId: string
  ): Promise<EnhancedSelectionContext> {
    // Get active breaking points with their domains
    const breakingPoints = await prisma.breakingPoint.findMany({
      where: {
        playerId,
        status: { in: ['identified', 'in_progress', 'awaiting_proof'] },
      },
      select: {
        id: true,
        testDomainCode: true,
        benchmarkTestId: true,
      },
    });

    const activeBPDomains = breakingPoints
      .map((bp) => bp.testDomainCode as TestDomainCode)
      .filter((d): d is TestDomainCode => d !== null);

    // Build proof metric test numbers from active BP domains
    const proofMetricTestNumbers: number[] = [];
    for (const domain of activeBPDomains) {
      const metrics = getProofMetricsForDomain(domain);
      metrics.forEach((m) => {
        if (m.testNumber && !proofMetricTestNumbers.includes(m.testNumber)) {
          proofMetricTestNumbers.push(m.testNumber);
        }
      });
    }

    // Get recent template usage counts
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.TEMPLATE_HISTORY_DAYS);

    const recentAssignments = await prisma.dailyTrainingAssignment.findMany({
      where: {
        playerId,
        assignedDate: { gte: cutoffDate },
        sessionTemplateId: { not: null },
      },
      select: { sessionTemplateId: true },
    });

    const templateUsageCounts = new Map<string, number>();
    for (const assignment of recentAssignments) {
      if (assignment.sessionTemplateId) {
        const count = templateUsageCounts.get(assignment.sessionTemplateId) || 0;
        templateUsageCounts.set(assignment.sessionTemplateId, count + 1);
      }
    }

    // Note: topConstraints should be passed in from CategoryConstraintsService
    // For now, return empty array - will be wired in Part 5
    const topConstraints: BindingConstraint[] = [];

    return {
      activeBPDomains,
      topConstraints,
      proofMetricTestNumbers,
      templateUsageCounts,
    };
  }

  /**
   * Calculate how relevant a template is to player's breaking points
   */
  private static calculateBreakingPointRelevance(
    _template: SessionTemplateWithCount,
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
