/**
 * Distance and Speed Test Calculations (Tests 1-7)
 * Based on DATABASE_FORMLER_KOMPLETT.md
 */

import type {
  Test1Input,
  Test2Input,
  Test3Input,
  Test4Input,
  Test5Input,
  Test6Input,
  Test7Input,
  TestResult,
  PlayerContext,
  CategoryRequirement,
} from '../types';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate top N average from an array of values
 */
function calculateTopNAverage(values: number[], n: number): number {
  const sorted = [...values].sort((a, b) => b - a);
  const topN = sorted.slice(0, n);
  return topN.reduce((sum, val) => sum + val, 0) / topN.length;
}

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
  // For now, return a placeholder
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
// TEST 1: DRIVER AVSTAND
// Formula: AVG(TOP 3 OF 6 shots) in meters
// ============================================================================

export function calculateTest1(
  input: Test1Input,
  player: PlayerContext
): TestResult {
  // Extract carry distances
  const distances = input.shots.map((shot) => shot.carryDistanceMeters);

  // Calculate top 3 average
  const averageCarry = calculateTopNAverage(distances, 3);

  // Get requirement
  const requirement = getRequirement(player, 1);

  // Calculate result
  return calculateTestResult(averageCarry, requirement);
}

// ============================================================================
// TEST 2: 3-TRE AVSTAND
// Formula: AVG(TOP 3 OF 6 shots) in meters
// ============================================================================

export function calculateTest2(
  input: Test2Input,
  player: PlayerContext
): TestResult {
  const distances = input.shots.map((shot) => shot.carryDistanceMeters);
  const averageCarry = calculateTopNAverage(distances, 3);
  const requirement = getRequirement(player, 2);
  return calculateTestResult(averageCarry, requirement);
}

// ============================================================================
// TEST 3: JERN AVSTAND (5-JERN)
// Formula: AVG(TOP 3 OF 6 shots) in meters
// ============================================================================

export function calculateTest3(
  input: Test3Input,
  player: PlayerContext
): TestResult {
  const distances = input.shots.map((shot) => shot.carryDistanceMeters);
  const averageCarry = calculateTopNAverage(distances, 3);
  const requirement = getRequirement(player, 3);
  return calculateTestResult(averageCarry, requirement);
}

// ============================================================================
// TEST 4: WEDGE AVSTAND (PW)
// Formula: AVG(TOP 3 OF 6 shots) in meters
// ============================================================================

export function calculateTest4(
  input: Test4Input,
  player: PlayerContext
): TestResult {
  const distances = input.shots.map((shot) => shot.carryDistanceMeters);
  const averageCarry = calculateTopNAverage(distances, 3);
  const requirement = getRequirement(player, 4);
  return calculateTestResult(averageCarry, requirement);
}

// ============================================================================
// TEST 5: KLUBBHASTIGHET (DRIVER)
// Formula: AVG(TOP 3 OF 6 shots) in km/h
// ============================================================================

export function calculateTest5(
  input: Test5Input,
  player: PlayerContext
): TestResult {
  const speeds = input.shots.map((shot) => shot.clubSpeedKmh);
  const averageSpeed = calculateTopNAverage(speeds, 3);
  const requirement = getRequirement(player, 5);
  return calculateTestResult(averageSpeed, requirement);
}

// ============================================================================
// TEST 6: BALLHASTIGHET (DRIVER)
// Formula: AVG(TOP 3 OF 6 shots) in km/h
// ============================================================================

export function calculateTest6(
  input: Test6Input,
  player: PlayerContext
): TestResult {
  const speeds = input.shots.map((shot) => shot.ballSpeedKmh);
  const averageSpeed = calculateTopNAverage(speeds, 3);
  const requirement = getRequirement(player, 6);
  return calculateTestResult(averageSpeed, requirement);
}

// ============================================================================
// TEST 7: SMASH FACTOR (DRIVER)
// Formula: AVG(TOP 3 OF 6 shots) where smash = ball_speed / club_speed
// ============================================================================

export function calculateTest7(
  input: Test7Input,
  player: PlayerContext
): TestResult {
  // Calculate smash factor for each shot
  const smashFactors = input.shots.map(
    (shot) => shot.ballSpeedKmh / shot.clubSpeedKmh
  );

  // Calculate top 3 average
  const averageSmashFactor = calculateTopNAverage(smashFactors, 3);

  // Get requirement
  const requirement = getRequirement(player, 7);

  // Calculate result
  return calculateTestResult(averageSmashFactor, requirement);
}
