/**
 * Short Game Test Calculations (Tests 15-18)
 * Based on DATABASE_FORMLER_KOMPLETT.md
 */

import type {
  Test15Input,
  Test16Input,
  Test17Input,
  Test18Input,
  TestResult,
  PlayerContext,
  CategoryRequirement,
} from '../types';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Round to specified decimal places
 */
function round(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Get category requirement (to be implemented with database lookup)
 */
function getRequirement(
  _player: PlayerContext,
  _testNumber: number
): CategoryRequirement {
  // TODO: Implement database lookup
  throw new Error('getRequirement not implemented - requires database');
}

/**
 * Calculate test result with requirement comparison
 */
function calculateTestResult(
  value: number,
  requirement: CategoryRequirement
): TestResult {
  let passed = false;

  switch (requirement.comparison) {
    case '>=':
      passed = value >= requirement.requirement;
      break;
    case '<=':
      passed = value <= requirement.requirement;
      break;
    case 'range':
      if (requirement.rangeMin !== undefined && requirement.rangeMax !== undefined) {
        passed = value >= requirement.rangeMin && value <= requirement.rangeMax;
      }
      break;
  }

  const percentOfRequirement = round(
    (value / requirement.requirement) * 100,
    1
  );

  return {
    value: round(value, 1),
    passed,
    categoryRequirement: requirement.requirement,
    percentOfRequirement,
  };
}

// ============================================================================
// TEST 15: PUTTING - 3M
// Formula: Success rate (%) = (holed_putts / total_putts) * 100
// ============================================================================

export function calculateTest15(
  input: Test15Input,
  player: PlayerContext
): TestResult {
  const totalPutts = input.putts.length;
  const holedPutts = input.putts.filter((putt) => putt.holed).length;

  // Calculate success rate percentage
  const successRate = (holedPutts / totalPutts) * 100;

  const requirement = getRequirement(player, 15);
  return calculateTestResult(successRate, requirement);
}

// ============================================================================
// TEST 16: PUTTING - 6M
// Formula: Success rate (%) = (holed_putts / total_putts) * 100
// ============================================================================

export function calculateTest16(
  input: Test16Input,
  player: PlayerContext
): TestResult {
  const totalPutts = input.putts.length;
  const holedPutts = input.putts.filter((putt) => putt.holed).length;

  // Calculate success rate percentage
  const successRate = (holedPutts / totalPutts) * 100;

  const requirement = getRequirement(player, 16);
  return calculateTestResult(successRate, requirement);
}

// ============================================================================
// TEST 17: CHIPPING
// Formula: Average distance from hole in cm (lower is better)
// ============================================================================

export function calculateTest17(
  input: Test17Input,
  player: PlayerContext
): TestResult {
  // Calculate average distance from hole
  const distances = input.chips.map((chip) => chip.distanceFromHoleCm);
  const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;

  const requirement = getRequirement(player, 17);

  // For "lower is better" tests, invert the percentage calculation
  let passed = false;
  if (requirement.comparison === '<=') {
    passed = avgDistance <= requirement.requirement;
  }

  const percentOfRequirement = round(
    (requirement.requirement / avgDistance) * 100,
    1
  );

  return {
    value: round(avgDistance, 1),
    passed,
    categoryRequirement: requirement.requirement,
    percentOfRequirement,
  };
}

// ============================================================================
// TEST 18: BUNKER
// Formula: Average distance from hole in cm (lower is better)
// ============================================================================

export function calculateTest18(
  input: Test18Input,
  player: PlayerContext
): TestResult {
  // Calculate average distance from hole
  const distances = input.shots.map((shot) => shot.distanceFromHoleCm);
  const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;

  const requirement = getRequirement(player, 18);

  // For "lower is better" tests, invert the percentage calculation
  let passed = false;
  if (requirement.comparison === '<=') {
    passed = avgDistance <= requirement.requirement;
  }

  const percentOfRequirement = round(
    (requirement.requirement / avgDistance) * 100,
    1
  );

  return {
    value: round(avgDistance, 1),
    passed,
    categoryRequirement: requirement.requirement,
    percentOfRequirement,
  };
}
