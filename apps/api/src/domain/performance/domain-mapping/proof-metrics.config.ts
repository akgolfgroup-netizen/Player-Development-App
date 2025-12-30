/**
 * Proof Metrics Configuration
 * Defines measurable outcomes that prove improvement in each domain
 */

import type {
  TestDomainCode,
  ProofMetric,
  DomainProofMetrics,
  CategoryTargets,
} from './domain-mapping.types';

// ============================================================================
// HELPER: Category targets from seed data
// ============================================================================

/**
 * Build category targets from min (K) to max (A)
 * Assumes linear progression between categories
 */
function buildCategoryTargets(
  categoryA: number,
  categoryK: number,
  direction: 'higher_better' | 'lower_better'
): CategoryTargets {
  const categories = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'] as const;
  const step = (categoryA - categoryK) / 10;

  const targets: CategoryTargets = {};
  categories.forEach((cat, index) => {
    targets[cat] = direction === 'higher_better'
      ? categoryA - (step * index)
      : categoryK + (step * index);
  });

  return targets;
}

// ============================================================================
// TEE DOMAIN PROOF METRICS
// ============================================================================

const TEE_METRICS: DomainProofMetrics = {
  domainCode: 'TEE',
  primaryMetric: {
    metricId: 'DRIVER_DISTANCE_CARRY',
    label: 'Driver Carry Distance',
    description: 'Average carry distance with driver (meters)',
    unit: 'meters',
    direction: 'higher_better',
    minSamples: 6,
    benchmarkTestIds: [1],
    targetsByCategory: {
      M: buildCategoryTargets(270, 170, 'higher_better'),
      K: buildCategoryTargets(240, 140, 'higher_better'),
    },
    dataSource: 'test_result',
  },
  secondaryMetrics: [
    {
      metricId: 'CLUB_SPEED_DRIVER',
      label: 'Driver Club Speed',
      description: 'Average club head speed with driver (km/h)',
      unit: 'km/h',
      direction: 'higher_better',
      minSamples: 6,
      benchmarkTestIds: [5],
      targetsByCategory: {
        M: buildCategoryTargets(193, 113, 'higher_better'),
        K: buildCategoryTargets(169, 89, 'higher_better'),
      },
      dataSource: 'test_result',
    },
    {
      metricId: 'BALL_SPEED_DRIVER',
      label: 'Driver Ball Speed',
      description: 'Average ball speed with driver (km/h)',
      unit: 'km/h',
      direction: 'higher_better',
      minSamples: 6,
      benchmarkTestIds: [6],
      targetsByCategory: {
        M: buildCategoryTargets(285, 145, 'higher_better'),
        K: buildCategoryTargets(250, 130, 'higher_better'),
      },
      dataSource: 'test_result',
    },
    {
      metricId: 'SMASH_FACTOR',
      label: 'Smash Factor',
      description: 'Ball speed / club speed ratio',
      unit: 'ratio',
      direction: 'higher_better',
      minSamples: 6,
      benchmarkTestIds: [7],
      targetsByCategory: {
        M: buildCategoryTargets(1.48, 1.28, 'higher_better'),
        K: buildCategoryTargets(1.48, 1.28, 'higher_better'),
      },
      dataSource: 'test_result',
    },
    {
      metricId: 'FAIRWAY_PCT',
      label: 'Fairway Hit Percentage',
      description: 'Percentage of fairways hit in regulation',
      unit: 'percent',
      direction: 'higher_better',
      minSamples: 18, // 18 holes for meaningful data
      benchmarkTestIds: [19, 20],
      targetsByCategory: {
        M: buildCategoryTargets(75, 40, 'higher_better'),
        K: buildCategoryTargets(75, 40, 'higher_better'),
      },
      dataSource: 'round_stats',
    },
  ],
};

// ============================================================================
// INN150 DOMAIN PROOF METRICS (150-200m approaches)
// ============================================================================

const INN150_METRICS: DomainProofMetrics = {
  domainCode: 'INN150',
  primaryMetric: {
    metricId: 'PROX_150M_AVG',
    label: 'Proximity from 150m',
    description: 'Average distance to hole from 150-200m approaches (meters)',
    unit: 'meters',
    direction: 'lower_better',
    minSamples: 10,
    benchmarkTestIds: [11],
    targetsByCategory: {
      // Using PEI-based targets converted to meters (ideal = 10% of distance)
      M: buildCategoryTargets(15, 45, 'lower_better'), // A=15m, K=45m
      K: buildCategoryTargets(15, 45, 'lower_better'),
    },
    dataSource: 'test_result',
  },
  secondaryMetrics: [
    {
      metricId: 'PEI_100M',
      label: 'PEI Score (100m)',
      description: 'Proximity Efficiency Index for 100m approach test',
      unit: 'PEI',
      direction: 'lower_better',
      minSamples: 10,
      benchmarkTestIds: [11],
      targetsByCategory: {
        M: buildCategoryTargets(1.0, 3.0, 'lower_better'),
        K: buildCategoryTargets(1.0, 3.0, 'lower_better'),
      },
      dataSource: 'test_result',
    },
    {
      metricId: 'IRON_5_DISTANCE',
      label: '5-Iron Distance',
      description: 'Average carry distance with 5-iron (meters)',
      unit: 'meters',
      direction: 'higher_better',
      minSamples: 6,
      benchmarkTestIds: [3],
      targetsByCategory: {
        M: buildCategoryTargets(190, 140, 'higher_better'),
        K: buildCategoryTargets(165, 115, 'higher_better'),
      },
      dataSource: 'test_result',
    },
  ],
};

// ============================================================================
// INN100 DOMAIN PROOF METRICS (100-150m approaches)
// ============================================================================

const INN100_METRICS: DomainProofMetrics = {
  domainCode: 'INN100',
  primaryMetric: {
    metricId: 'PROX_100M_AVG',
    label: 'Proximity from 100m',
    description: 'Average distance to hole from 100-150m approaches (meters)',
    unit: 'meters',
    direction: 'lower_better',
    minSamples: 10,
    benchmarkTestIds: [10, 11],
    targetsByCategory: {
      M: buildCategoryTargets(10, 30, 'lower_better'),
      K: buildCategoryTargets(10, 30, 'lower_better'),
    },
    dataSource: 'test_result',
  },
  secondaryMetrics: [
    {
      metricId: 'PEI_75M',
      label: 'PEI Score (75m)',
      description: 'Proximity Efficiency Index for 75m approach test',
      unit: 'PEI',
      direction: 'lower_better',
      minSamples: 10,
      benchmarkTestIds: [10],
      targetsByCategory: {
        M: buildCategoryTargets(1.0, 3.0, 'lower_better'),
        K: buildCategoryTargets(1.0, 3.0, 'lower_better'),
      },
      dataSource: 'test_result',
    },
    {
      metricId: 'WEDGE_PW_DISTANCE',
      label: 'PW Distance',
      description: 'Average carry distance with PW (meters)',
      unit: 'meters',
      direction: 'higher_better',
      minSamples: 6,
      benchmarkTestIds: [4],
      targetsByCategory: {
        M: buildCategoryTargets(130, 80, 'higher_better'),
        K: buildCategoryTargets(110, 60, 'higher_better'),
      },
      dataSource: 'test_result',
    },
  ],
};

// ============================================================================
// INN50 DOMAIN PROOF METRICS (50-100m approaches)
// ============================================================================

const INN50_METRICS: DomainProofMetrics = {
  domainCode: 'INN50',
  primaryMetric: {
    metricId: 'PROX_50M_AVG',
    label: 'Proximity from 50m',
    description: 'Average distance to hole from 50-100m approaches (meters)',
    unit: 'meters',
    direction: 'lower_better',
    minSamples: 10,
    benchmarkTestIds: [9],
    targetsByCategory: {
      M: buildCategoryTargets(5, 15, 'lower_better'),
      K: buildCategoryTargets(5, 15, 'lower_better'),
    },
    dataSource: 'test_result',
  },
  secondaryMetrics: [
    {
      metricId: 'PEI_50M',
      label: 'PEI Score (50m)',
      description: 'Proximity Efficiency Index for 50m approach test',
      unit: 'PEI',
      direction: 'lower_better',
      minSamples: 10,
      benchmarkTestIds: [9],
      targetsByCategory: {
        M: buildCategoryTargets(1.0, 3.0, 'lower_better'),
        K: buildCategoryTargets(1.0, 3.0, 'lower_better'),
      },
      dataSource: 'test_result',
    },
    {
      metricId: 'PEI_25M',
      label: 'PEI Score (25m)',
      description: 'Proximity Efficiency Index for 25m approach test',
      unit: 'PEI',
      direction: 'lower_better',
      minSamples: 10,
      benchmarkTestIds: [8],
      targetsByCategory: {
        M: buildCategoryTargets(1.0, 3.0, 'lower_better'),
        K: buildCategoryTargets(1.0, 3.0, 'lower_better'),
      },
      dataSource: 'test_result',
    },
  ],
};

// ============================================================================
// INN200 DOMAIN PROOF METRICS (200m+ approaches)
// ============================================================================

const INN200_METRICS: DomainProofMetrics = {
  domainCode: 'INN200',
  primaryMetric: {
    metricId: 'PROX_200M_AVG',
    label: 'Proximity from 200m+',
    description: 'Average distance to hole from 200m+ approaches (meters)',
    unit: 'meters',
    direction: 'lower_better',
    minSamples: 10,
    benchmarkTestIds: [3], // 5-iron as proxy
    targetsByCategory: {
      M: buildCategoryTargets(20, 60, 'lower_better'),
      K: buildCategoryTargets(20, 60, 'lower_better'),
    },
    dataSource: 'test_result',
  },
  secondaryMetrics: [
    {
      metricId: 'THREE_WOOD_DISTANCE',
      label: '3-Wood Distance',
      description: 'Average carry distance with 3-wood (meters)',
      unit: 'meters',
      direction: 'higher_better',
      minSamples: 6,
      benchmarkTestIds: [2],
      targetsByCategory: {
        M: buildCategoryTargets(250, 150, 'higher_better'),
        K: buildCategoryTargets(210, 110, 'higher_better'),
      },
      dataSource: 'test_result',
    },
  ],
};

// ============================================================================
// ARG DOMAIN PROOF METRICS (Around the Green)
// ============================================================================

const ARG_METRICS: DomainProofMetrics = {
  domainCode: 'ARG',
  primaryMetric: {
    metricId: 'CHIP_PROX_AVG',
    label: 'Chipping Proximity',
    description: 'Average distance to hole after chip shots (cm)',
    unit: 'cm',
    direction: 'lower_better',
    minSamples: 10,
    benchmarkTestIds: [17],
    targetsByCategory: {
      M: buildCategoryTargets(100, 350, 'lower_better'),
      K: buildCategoryTargets(100, 350, 'lower_better'),
    },
    dataSource: 'test_result',
  },
  secondaryMetrics: [
    {
      metricId: 'BUNKER_PROX_AVG',
      label: 'Bunker Proximity',
      description: 'Average distance to hole after bunker shots (cm)',
      unit: 'cm',
      direction: 'lower_better',
      minSamples: 10,
      benchmarkTestIds: [18],
      targetsByCategory: {
        M: buildCategoryTargets(150, 400, 'lower_better'),
        K: buildCategoryTargets(150, 400, 'lower_better'),
      },
      dataSource: 'test_result',
    },
    {
      metricId: 'UP_AND_DOWN_PCT',
      label: 'Up & Down Percentage',
      description: 'Percentage of successful up-and-downs',
      unit: 'percent',
      direction: 'higher_better',
      minSamples: 10,
      benchmarkTestIds: [19, 20],
      targetsByCategory: {
        M: buildCategoryTargets(70, 20, 'higher_better'),
        K: buildCategoryTargets(70, 20, 'higher_better'),
      },
      dataSource: 'round_stats',
    },
  ],
};

// ============================================================================
// PUTT DOMAIN PROOF METRICS
// ============================================================================

const PUTT_METRICS: DomainProofMetrics = {
  domainCode: 'PUTT',
  primaryMetric: {
    metricId: 'PUTT_3M_PCT',
    label: '3m Putt Success Rate',
    description: 'Percentage of putts holed from 3 meters',
    unit: 'percent',
    direction: 'higher_better',
    minSamples: 10,
    benchmarkTestIds: [15],
    targetsByCategory: {
      M: buildCategoryTargets(90, 15, 'higher_better'),
      K: buildCategoryTargets(90, 15, 'higher_better'),
    },
    dataSource: 'test_result',
  },
  secondaryMetrics: [
    {
      metricId: 'PUTT_6M_PCT',
      label: '6m Putt Success Rate',
      description: 'Percentage of putts holed from 6 meters',
      unit: 'percent',
      direction: 'higher_better',
      minSamples: 10,
      benchmarkTestIds: [16],
      targetsByCategory: {
        M: buildCategoryTargets(50, 5, 'higher_better'),
        K: buildCategoryTargets(50, 5, 'higher_better'),
      },
      dataSource: 'test_result',
    },
    {
      metricId: 'PUTTS_PER_ROUND',
      label: 'Putts per Round',
      description: 'Average putts per 18 holes',
      unit: 'putts',
      direction: 'lower_better',
      minSamples: 3, // 3 rounds
      benchmarkTestIds: [19, 20],
      targetsByCategory: {
        M: buildCategoryTargets(28, 38, 'lower_better'),
        K: buildCategoryTargets(28, 38, 'lower_better'),
      },
      dataSource: 'round_stats',
    },
  ],
};

// ============================================================================
// PHYS DOMAIN PROOF METRICS (Physical)
// ============================================================================

const PHYS_METRICS: DomainProofMetrics = {
  domainCode: 'PHYS',
  primaryMetric: {
    metricId: 'BENCH_1RM',
    label: 'Bench Press 1RM',
    description: '1-rep max bench press (kg)',
    unit: 'kg',
    direction: 'higher_better',
    minSamples: 1,
    benchmarkTestIds: [12],
    targetsByCategory: {
      M: buildCategoryTargets(140, 40, 'higher_better'),
      K: buildCategoryTargets(100, 25, 'higher_better'),
    },
    dataSource: 'test_result',
  },
  secondaryMetrics: [
    {
      metricId: 'DEADLIFT_1RM',
      label: 'Trap Bar Deadlift 1RM',
      description: '1-rep max trap bar deadlift (kg)',
      unit: 'kg',
      direction: 'higher_better',
      minSamples: 1,
      benchmarkTestIds: [13],
      targetsByCategory: {
        M: buildCategoryTargets(200, 50, 'higher_better'),
        K: buildCategoryTargets(140, 40, 'higher_better'),
      },
      dataSource: 'test_result',
    },
    {
      metricId: 'RUN_3000M_TIME',
      label: '3000m Run Time',
      description: 'Time to complete 3000m run (seconds)',
      unit: 'seconds',
      direction: 'lower_better',
      minSamples: 1,
      benchmarkTestIds: [14],
      targetsByCategory: {
        M: buildCategoryTargets(660, 1080, 'lower_better'), // 11:00 to 18:00
        K: buildCategoryTargets(750, 1200, 'lower_better'), // 12:30 to 20:00
      },
      dataSource: 'test_result',
    },
  ],
};

// ============================================================================
// MASTER PROOF METRICS MAP
// ============================================================================

/**
 * All proof metrics indexed by domain code
 */
export const DOMAIN_PROOF_METRICS: Record<TestDomainCode, DomainProofMetrics> = {
  TEE: TEE_METRICS,
  INN200: INN200_METRICS,
  INN150: INN150_METRICS,
  INN100: INN100_METRICS,
  INN50: INN50_METRICS,
  ARG: ARG_METRICS,
  PUTT: PUTT_METRICS,
  PHYS: PHYS_METRICS,
};

// ============================================================================
// METRIC LOOKUP HELPERS
// ============================================================================

/**
 * Get all proof metrics for a domain (primary + secondary)
 */
export function getAllMetricsForDomain(domainCode: TestDomainCode): ProofMetric[] {
  const domainMetrics = DOMAIN_PROOF_METRICS[domainCode];
  return [domainMetrics.primaryMetric, ...domainMetrics.secondaryMetrics];
}

/**
 * Get a specific metric by ID
 */
export function getMetricById(metricId: string): ProofMetric | undefined {
  for (const domainMetrics of Object.values(DOMAIN_PROOF_METRICS)) {
    if (domainMetrics.primaryMetric.metricId === metricId) {
      return domainMetrics.primaryMetric;
    }
    const secondary = domainMetrics.secondaryMetrics.find(m => m.metricId === metricId);
    if (secondary) return secondary;
  }
  return undefined;
}

/**
 * Get all unique metric IDs
 */
export function getAllMetricIds(): string[] {
  const ids: string[] = [];
  for (const domainMetrics of Object.values(DOMAIN_PROOF_METRICS)) {
    ids.push(domainMetrics.primaryMetric.metricId);
    ids.push(...domainMetrics.secondaryMetrics.map(m => m.metricId));
  }
  return ids;
}
