/**
 * Domain Mapping Configuration
 * Hardcoded MVP mapping from test domains to SG components
 */

import type {
  TestDomainCode,
  DomainToComponentMapping,
  DomainBenchmarkMapping,
} from './domain-mapping.types';

// ============================================================================
// DOMAIN TO COMPONENT MAPPINGS
// ============================================================================

/**
 * Master mapping from test domains to Strokes Gained components
 * This is the single source of truth for domain → component relationships
 */
export const DOMAIN_COMPONENT_MAPPINGS: Record<TestDomainCode, DomainToComponentMapping> = {
  TEE: {
    domainCode: 'TEE',
    sgComponent: 'OTT',
    description: 'Tee shots - driving distance, accuracy, and ball speed',
    relatedTestNumbers: [1, 2, 5, 6, 7], // Driver distance, 3-wood, club speed, ball speed, smash factor
  },

  INN200: {
    domainCode: 'INN200',
    sgComponent: 'APP',
    subBucket: '200_plus',
    description: 'Approach shots from 200+ meters',
    relatedTestNumbers: [3], // 5-iron distance (used as proxy for long approach)
  },

  INN150: {
    domainCode: 'INN150',
    sgComponent: 'APP',
    subBucket: '150_200',
    description: 'Approach shots from 150-200 meters',
    relatedTestNumbers: [3, 11], // 5-iron, 100m approach test
  },

  INN100: {
    domainCode: 'INN100',
    sgComponent: 'APP',
    subBucket: '100_150',
    description: 'Approach shots from 100-150 meters',
    relatedTestNumbers: [4, 10, 11], // PW distance, 75m/100m approach tests
  },

  INN50: {
    domainCode: 'INN50',
    sgComponent: 'APP',
    subBucket: '50_100',
    description: 'Approach shots from 50-100 meters',
    relatedTestNumbers: [8, 9, 10], // 25m, 50m, 75m approach tests
  },

  ARG: {
    domainCode: 'ARG',
    sgComponent: 'ARG',
    description: 'Around the green - chipping, pitching, bunker play',
    relatedTestNumbers: [8, 17, 18], // 25m approach, chipping, bunker
  },

  PUTT: {
    domainCode: 'PUTT',
    sgComponent: 'PUTT',
    description: 'Putting - all distances',
    relatedTestNumbers: [15, 16], // 3m and 6m putting tests
  },

  PHYS: {
    domainCode: 'PHYS',
    sgComponent: 'TOTAL', // Physical affects all components
    description: 'Physical conditioning - strength, endurance, speed',
    relatedTestNumbers: [12, 13, 14], // Bench press, deadlift, 3000m run
  },
};

// ============================================================================
// BENCHMARK WINDOW CONFIGURATIONS
// ============================================================================

/**
 * Default benchmark window by domain
 * Specifies how far back to look for benchmark/test results
 */
export const DOMAIN_BENCHMARK_CONFIGS: Record<TestDomainCode, DomainBenchmarkMapping> = {
  TEE: {
    domainCode: 'TEE',
    benchmarkTestIds: [1, 5, 6, 7],
    benchmarkWindowDays: 21,
  },
  INN200: {
    domainCode: 'INN200',
    benchmarkTestIds: [3],
    benchmarkWindowDays: 21,
  },
  INN150: {
    domainCode: 'INN150',
    benchmarkTestIds: [11],
    benchmarkWindowDays: 21,
  },
  INN100: {
    domainCode: 'INN100',
    benchmarkTestIds: [10, 11],
    benchmarkWindowDays: 21,
  },
  INN50: {
    domainCode: 'INN50',
    benchmarkTestIds: [8, 9],
    benchmarkWindowDays: 21,
  },
  ARG: {
    domainCode: 'ARG',
    benchmarkTestIds: [17, 18],
    benchmarkWindowDays: 21,
  },
  PUTT: {
    domainCode: 'PUTT',
    benchmarkTestIds: [15, 16],
    benchmarkWindowDays: 21,
  },
  PHYS: {
    domainCode: 'PHYS',
    benchmarkTestIds: [12, 13, 14],
    benchmarkWindowDays: 28, // Physical tests need longer window
  },
};

// ============================================================================
// TEST NUMBER TO DOMAIN REVERSE MAPPING
// ============================================================================

/**
 * Reverse mapping: test number → primary domain
 * Used when a test result comes in and we need to know which domain it affects
 */
export const TEST_TO_DOMAIN_MAP: Record<number, TestDomainCode> = {
  // Distance/Speed tests → TEE
  1: 'TEE',  // Driver distance
  2: 'TEE',  // 3-wood distance
  5: 'TEE',  // Club speed
  6: 'TEE',  // Ball speed
  7: 'TEE',  // Smash factor

  // Iron tests → mixed
  3: 'INN150', // 5-iron distance
  4: 'INN100', // PW distance

  // Approach tests by distance
  8: 'INN50',  // 25m approach
  9: 'INN50',  // 50m approach
  10: 'INN100', // 75m approach
  11: 'INN150', // 100m approach

  // Short game
  17: 'ARG',  // Chipping
  18: 'ARG',  // Bunker

  // Putting
  15: 'PUTT', // 3m putting
  16: 'PUTT', // 6m putting

  // Physical
  12: 'PHYS', // Bench press
  13: 'PHYS', // Deadlift
  14: 'PHYS', // 3000m run

  // On-course (maps to TOTAL/multiple)
  19: 'TEE',  // 9-hole sim (primary: tee shots)
  20: 'TEE',  // On-course skills
};

// ============================================================================
// DOMAIN PRIORITY ORDER
// ============================================================================

/**
 * Priority order for domains when multiple are equally important
 * Based on typical strokes gained impact
 */
export const DOMAIN_PRIORITY_ORDER: TestDomainCode[] = [
  'TEE',     // OTT typically highest variance
  'INN150',  // Long approach most challenging
  'INN100',  // Mid approach
  'INN50',   // Short approach
  'INN200',  // Very long approach
  'ARG',     // Around green
  'PUTT',    // Putting
  'PHYS',    // Physical
];

// ============================================================================
// VALID DOMAIN CODES
// ============================================================================

/**
 * All valid test domain codes
 */
export const ALL_DOMAIN_CODES: TestDomainCode[] = [
  'TEE',
  'INN200',
  'INN150',
  'INN100',
  'INN50',
  'ARG',
  'PUTT',
  'PHYS',
];

/**
 * Check if a string is a valid domain code
 */
export function isValidDomainCode(code: string): code is TestDomainCode {
  return ALL_DOMAIN_CODES.includes(code as TestDomainCode);
}
