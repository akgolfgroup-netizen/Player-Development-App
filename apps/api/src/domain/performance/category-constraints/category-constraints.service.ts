/**
 * Category Constraints Service
 * Computes binding constraints for category advancement
 */

import { PrismaClient } from '@prisma/client';
import type {
  CategoryAK,
  Gender,
  BindingConstraint,
  CategoryConstraintsResult,
  ComputeConstraintsInput,
  PlayerTestData,
  ConstraintCounts,
  DomainConstraintCounts,
  ConstraintConfidence,
  RequirementWithMetadata,
} from './category-constraints.types';
import {
  getRequirementsForCategory,
  getNextCategory,
  TEST_NAMES,
} from './category-requirements.source';
import type { TestDomainCode } from '../domain-mapping';
import { TEST_TO_DOMAIN_MAP, DOMAIN_PRIORITY_ORDER } from '../domain-mapping';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  defaultMaxBindingConstraints: 4,
  minSamplesForHighConfidence: 3,
  minSamplesForMediumConfidence: 1,
  gapNormalizationFactor: 0.5, // How aggressively to normalize gaps
};

// ============================================================================
// MAIN SERVICE
// ============================================================================

export class CategoryConstraintsService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Compute category constraints for a player
   * Returns the top binding constraints preventing advancement
   */
  async computeCategoryConstraints(
    input: ComputeConstraintsInput
  ): Promise<CategoryConstraintsResult> {
    const {
      playerId,
      currentCategory,
      targetCategory,
      gender,
      asOfDate = new Date(),
      maxBindingConstraints = CONFIG.defaultMaxBindingConstraints,
    } = input;

    // 1. Get requirements for target category
    const requirements = await getRequirementsForCategory(
      this.prisma,
      targetCategory,
      gender
    );

    // 2. Get player's current test data
    const playerData = await this.getPlayerTestData(playerId, asOfDate);

    // 3. Evaluate each requirement
    const allConstraints = this.evaluateConstraints(requirements, playerData);

    // 4. Select top binding constraints
    const bindingConstraints = this.selectBindingConstraints(
      allConstraints,
      maxBindingConstraints
    );

    // 5. Compute aggregated statistics
    const counts = this.computeCounts(allConstraints);
    const countsByDomain = this.computeCountsByDomain(allConstraints);
    const readinessScore = this.computeReadinessScore(allConstraints);
    const canAdvance = counts.hardUnmet === 0;

    return {
      playerId,
      currentCategory,
      targetCategory,
      gender,
      asOfDate,
      bindingConstraints,
      allConstraints,
      counts,
      countsByDomain,
      readinessScore,
      canAdvance,
      computedAt: new Date(),
    };
  }

  /**
   * Get simplified constraints result (for API responses)
   */
  async getBindingConstraints(
    playerId: string,
    targetCategory?: CategoryAK
  ): Promise<BindingConstraint[]> {
    // Get player info
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      select: { category: true, gender: true },
    });

    if (!player) {
      throw new Error(`Player not found: ${playerId}`);
    }

    const currentCategory = (player.category || 'K') as CategoryAK;
    const gender = (player.gender || 'M') as Gender;
    const target = targetCategory || getNextCategory(currentCategory) || currentCategory;

    const result = await this.computeCategoryConstraints({
      playerId,
      currentCategory,
      targetCategory: target,
      gender,
    });

    return result.bindingConstraints;
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Get player's latest test data
   */
  private async getPlayerTestData(
    playerId: string,
    asOfDate: Date
  ): Promise<Map<number, PlayerTestData>> {
    const testData = new Map<number, PlayerTestData>();

    // Get latest test results for each test type
    const testResults = await this.prisma.testResult.findMany({
      where: {
        playerId,
        testDate: { lte: asOfDate },
      },
      include: {
        test: { select: { testNumber: true } },
      },
      orderBy: { testDate: 'desc' },
    });

    // Group by test number, take latest
    for (const result of testResults) {
      const testNumber = result.test.testNumber;
      if (!testData.has(testNumber)) {
        // Count samples for this test
        const sampleCount = testResults.filter(
          r => r.test.testNumber === testNumber
        ).length;

        testData.set(testNumber, {
          testNumber,
          latestValue: Number(result.value),
          testDate: result.testDate,
          sampleCount,
          source: 'test_result',
          testResultId: result.id,
        });
      }
    }

    return testData;
  }

  /**
   * Evaluate all constraints
   */
  private evaluateConstraints(
    requirements: RequirementWithMetadata[],
    playerData: Map<number, PlayerTestData>
  ): BindingConstraint[] {
    return requirements.map((req, index) => {
      const data = playerData.get(req.testNumber);
      const currentValue = data?.latestValue ?? null;

      // Determine if constraint is met
      const isMet = this.isConstraintMet(currentValue, req);

      // Calculate gaps
      const { gapRaw, gapNormalized, gapPercent } = this.calculateGaps(
        currentValue,
        req.requirement,
        req.comparison
      );

      // Determine confidence
      const confidence = this.determineConfidence(data?.sampleCount ?? 0);

      // Build evidence
      const evidence = data ? {
        testResultId: data.testResultId,
        testDate: data.testDate,
        source: data.source,
        sampleCount: data.sampleCount,
      } : null;

      return {
        requirementId: req.requirementId,
        testNumber: req.testNumber,
        testName: req.testName,
        label: `${req.testName}: ${req.requirement}${req.unit}`,
        domainCode: req.domainCode,
        metricId: undefined, // Will be enriched if needed
        sgComponent: req.sgComponent,
        currentValue,
        requiredValue: req.requirement,
        unit: req.unit,
        comparison: req.comparison,
        gapRaw,
        gapNormalized,
        gapPercent,
        severity: req.severity,
        confidence,
        evidence,
        isMet,
        priority: index + 1, // Will be re-ordered
      };
    });
  }

  /**
   * Check if a constraint is met
   */
  private isConstraintMet(
    currentValue: number | null,
    req: RequirementWithMetadata
  ): boolean {
    if (currentValue === null) {
      return false; // No data = not met
    }

    switch (req.comparison) {
      case '>=':
        return currentValue >= req.requirement;
      case '>':
        return currentValue > req.requirement;
      case '<=':
        return currentValue <= req.requirement;
      case '<':
        return currentValue < req.requirement;
      case '==':
        return currentValue === req.requirement;
      case 'range':
        return (
          currentValue >= (req.rangeMin ?? -Infinity) &&
          currentValue <= (req.rangeMax ?? Infinity)
        );
      default:
        return false;
    }
  }

  /**
   * Calculate gap metrics
   */
  private calculateGaps(
    currentValue: number | null,
    requiredValue: number,
    comparison: string
  ): { gapRaw: number; gapNormalized: number; gapPercent: number } {
    if (currentValue === null) {
      return {
        gapRaw: requiredValue, // Assume max gap
        gapNormalized: 1.0,
        gapPercent: 100,
      };
    }

    let gapRaw: number;

    // For "lower is better" comparisons, flip the gap calculation
    if (comparison === '<=' || comparison === '<') {
      gapRaw = currentValue - requiredValue;
    } else {
      gapRaw = requiredValue - currentValue;
    }

    // If met, gap is 0
    if (gapRaw <= 0) {
      return { gapRaw: 0, gapNormalized: 0, gapPercent: 0 };
    }

    // Normalize gap (0-1 scale)
    const gapPercent = (gapRaw / Math.abs(requiredValue)) * 100;
    const gapNormalized = Math.min(1, gapPercent / 100);

    return { gapRaw, gapNormalized, gapPercent };
  }

  /**
   * Determine confidence level based on sample count
   */
  private determineConfidence(sampleCount: number): ConstraintConfidence {
    if (sampleCount === 0) return 'insufficient_data';
    if (sampleCount >= CONFIG.minSamplesForHighConfidence) return 'high';
    if (sampleCount >= CONFIG.minSamplesForMediumConfidence) return 'medium';
    return 'low';
  }

  /**
   * Select top binding constraints
   * Prioritizes: hard > soft, then by domain priority, then by gap size
   */
  private selectBindingConstraints(
    allConstraints: BindingConstraint[],
    maxCount: number
  ): BindingConstraint[] {
    // Filter to unmet constraints only
    const unmet = allConstraints.filter(c => !c.isMet);

    // Sort by priority
    const sorted = unmet.sort((a, b) => {
      // 1. Hard constraints first
      if (a.severity !== b.severity) {
        return a.severity === 'hard' ? -1 : 1;
      }

      // 2. By domain priority
      const aPriority = a.domainCode
        ? DOMAIN_PRIORITY_ORDER.indexOf(a.domainCode)
        : 999;
      const bPriority = b.domainCode
        ? DOMAIN_PRIORITY_ORDER.indexOf(b.domainCode)
        : 999;
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      // 3. By gap size (larger gap = higher priority)
      return b.gapNormalized - a.gapNormalized;
    });

    // Take top N and assign priorities
    return sorted.slice(0, maxCount).map((c, i) => ({
      ...c,
      priority: i + 1,
    }));
  }

  /**
   * Compute aggregate counts
   */
  private computeCounts(constraints: BindingConstraint[]): ConstraintCounts {
    return {
      total: constraints.length,
      met: constraints.filter(c => c.isMet).length,
      unmet: constraints.filter(c => !c.isMet).length,
      hardUnmet: constraints.filter(c => !c.isMet && c.severity === 'hard').length,
      softUnmet: constraints.filter(c => !c.isMet && c.severity === 'soft').length,
      insufficientData: constraints.filter(
        c => c.confidence === 'insufficient_data'
      ).length,
    };
  }

  /**
   * Compute counts grouped by domain
   */
  private computeCountsByDomain(
    constraints: BindingConstraint[]
  ): DomainConstraintCounts[] {
    const byDomain = new Map<TestDomainCode, BindingConstraint[]>();

    for (const c of constraints) {
      if (c.domainCode) {
        const existing = byDomain.get(c.domainCode) || [];
        existing.push(c);
        byDomain.set(c.domainCode, existing);
      }
    }

    return Array.from(byDomain.entries()).map(([domainCode, domainConstraints]) => ({
      domainCode,
      total: domainConstraints.length,
      met: domainConstraints.filter(c => c.isMet).length,
      unmet: domainConstraints.filter(c => !c.isMet).length,
      maxGapNormalized: Math.max(...domainConstraints.map(c => c.gapNormalized)),
    }));
  }

  /**
   * Compute overall readiness score (0-100)
   */
  private computeReadinessScore(constraints: BindingConstraint[]): number {
    if (constraints.length === 0) return 100;

    // Weight hard constraints more heavily
    let totalWeight = 0;
    let metWeight = 0;

    for (const c of constraints) {
      const weight = c.severity === 'hard' ? 2 : 1;
      totalWeight += weight;
      if (c.isMet) {
        metWeight += weight;
      }
    }

    return Math.round((metWeight / totalWeight) * 100);
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

/**
 * Create a category constraints service instance
 */
export function createCategoryConstraintsService(
  prisma: PrismaClient
): CategoryConstraintsService {
  return new CategoryConstraintsService(prisma);
}
