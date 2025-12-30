/**
 * Category Constraints Types
 * Types for A-K category progression and binding constraint analysis
 */

import type { TestDomainCode, SgComponent } from '../domain-mapping';

// ============================================================================
// CATEGORY TYPES
// ============================================================================

/**
 * Player category codes A through K
 * A = highest/elite, K = beginner
 */
export type CategoryAK = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K';

/**
 * Gender codes
 */
export type Gender = 'M' | 'K';

/**
 * Comparison operators for requirements
 */
export type ComparisonOperator = '>=' | '<=' | '>' | '<' | '==' | 'range';

/**
 * Severity level for constraints
 * - hard: Must be met to advance
 * - soft: Should be met but not blocking
 */
export type ConstraintSeverity = 'hard' | 'soft';

/**
 * Confidence level for constraint evaluation
 */
export type ConstraintConfidence = 'high' | 'medium' | 'low' | 'insufficient_data';

// ============================================================================
// REQUIREMENT TYPES
// ============================================================================

/**
 * Category requirement definition
 * Represents what a player must achieve for a specific test at a category level
 */
export interface CategoryRequirementDef {
  requirementId: string;
  category: CategoryAK;
  gender: Gender;
  testNumber: number;
  requirement: number;
  unit: string;
  comparison: ComparisonOperator;
  rangeMin?: number;
  rangeMax?: number;
  domainCode?: TestDomainCode;
  severity: ConstraintSeverity;
  description?: string;
}

/**
 * Requirement with test metadata
 */
export interface RequirementWithMetadata extends CategoryRequirementDef {
  testName: string;
  sgComponent?: SgComponent;
}

// ============================================================================
// BINDING CONSTRAINT TYPES
// ============================================================================

/**
 * Evidence supporting a constraint evaluation
 */
export interface ConstraintEvidence {
  testResultId?: string;
  testDate?: Date;
  source: 'test_result' | 'round_stats' | 'calibration' | 'manual';
  sampleCount: number;
}

/**
 * A binding constraint is a requirement that is currently blocking
 * the player from advancing to the next category
 */
export interface BindingConstraint {
  requirementId: string;
  testNumber: number;
  testName: string;
  label: string;
  domainCode?: TestDomainCode;
  metricId?: string;
  sgComponent?: SgComponent;
  currentValue: number | null;
  requiredValue: number;
  unit: string;
  comparison: ComparisonOperator;
  gapRaw: number; // Raw numeric gap (current - required)
  gapNormalized: number; // 0-1 normalized gap (0 = met, 1 = max gap)
  gapPercent: number; // Gap as percentage of requirement
  severity: ConstraintSeverity;
  confidence: ConstraintConfidence;
  evidence: ConstraintEvidence | null;
  isMet: boolean;
  priority: number; // 1 = highest priority binding constraint
}

// ============================================================================
// RESULT TYPES
// ============================================================================

/**
 * Aggregated counts by constraint status
 */
export interface ConstraintCounts {
  total: number;
  met: number;
  unmet: number;
  hardUnmet: number;
  softUnmet: number;
  insufficientData: number;
}

/**
 * Counts by domain
 */
export interface DomainConstraintCounts {
  domainCode: TestDomainCode;
  total: number;
  met: number;
  unmet: number;
  maxGapNormalized: number;
}

/**
 * Result of computing category constraints for a player
 */
export interface CategoryConstraintsResult {
  playerId: string;
  currentCategory: CategoryAK;
  targetCategory: CategoryAK;
  gender: Gender;
  asOfDate: Date;

  // Top binding constraints (sorted by priority)
  bindingConstraints: BindingConstraint[];

  // All constraints (for detailed view)
  allConstraints: BindingConstraint[];

  // Aggregated statistics
  counts: ConstraintCounts;
  countsByDomain: DomainConstraintCounts[];

  // Overall readiness
  readinessScore: number; // 0-100, higher = more ready for advancement
  canAdvance: boolean; // true if all hard constraints are met

  // Metadata
  computedAt: Date;
}

// ============================================================================
// INPUT TYPES
// ============================================================================

/**
 * Input for computing category constraints
 */
export interface ComputeConstraintsInput {
  playerId: string;
  currentCategory: CategoryAK;
  targetCategory: CategoryAK;
  gender: Gender;
  asOfDate?: Date;
  maxBindingConstraints?: number; // Default: 4
}

/**
 * Player test data for constraint evaluation
 */
export interface PlayerTestData {
  testNumber: number;
  latestValue: number;
  testDate: Date;
  sampleCount: number;
  source: 'test_result' | 'round_stats' | 'calibration' | 'manual';
  testResultId?: string;
}

// ============================================================================
// API TYPES
// ============================================================================

/**
 * API request for category constraints
 */
export interface CategoryConstraintsRequest {
  playerId: string;
  targetCategory?: CategoryAK; // If not provided, assume next category up
  maxBindingConstraints?: number;
}

/**
 * API response for category constraints
 */
export interface CategoryConstraintsResponse {
  playerId: string;
  currentCategory: CategoryAK;
  targetCategory: CategoryAK;
  bindingConstraints: Array<{
    testNumber: number;
    testName: string;
    domainCode?: TestDomainCode;
    currentValue: number | null;
    requiredValue: number;
    unit: string;
    gapPercent: number;
    severity: ConstraintSeverity;
    isMet: boolean;
  }>;
  counts: ConstraintCounts;
  readinessScore: number;
  canAdvance: boolean;
}
