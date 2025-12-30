/**
 * Domain Mapping Service
 * Provides deterministic mapping from test domains to SG components
 * Single source of truth - no UI should reimplement these mappings
 */

import type {
  TestDomainCode,
  SgComponent,
  ApproachSubBucket,
  DomainMappingResult,
  ProofMetric,
  DomainInfoResponse,
  AllDomainsResponse,
  ParsedSuccessRule,
  SuccessRuleFormat,
} from './domain-mapping.types';

import {
  DOMAIN_COMPONENT_MAPPINGS,
  DOMAIN_BENCHMARK_CONFIGS,
  TEST_TO_DOMAIN_MAP,
  ALL_DOMAIN_CODES,
  isValidDomainCode,
} from './domain-mapping.config';

import {
  DOMAIN_PROOF_METRICS,
  getAllMetricsForDomain,
  getMetricById,
} from './proof-metrics.config';

// ============================================================================
// CORE MAPPING FUNCTIONS
// ============================================================================

/**
 * Map a test domain code to its SG component and optional sub-bucket
 * This is THE definitive mapping function - all consumers should use this
 */
export function mapTestDomainToComponent(domainCode: TestDomainCode): DomainMappingResult {
  const mapping = DOMAIN_COMPONENT_MAPPINGS[domainCode];

  return {
    sgComponent: mapping.sgComponent,
    subBucket: mapping.subBucket,
    relatedTestNumbers: mapping.relatedTestNumbers,
  };
}

/**
 * Map a test number to its primary domain code
 * Useful when a test result comes in and we need to know which domain it affects
 */
export function mapTestNumberToDomain(testNumber: number): TestDomainCode | undefined {
  return TEST_TO_DOMAIN_MAP[testNumber];
}

/**
 * Get all test numbers that contribute to a domain
 */
export function getTestNumbersForDomain(domainCode: TestDomainCode): number[] {
  const mapping = DOMAIN_COMPONENT_MAPPINGS[domainCode];
  return mapping.relatedTestNumbers;
}

/**
 * Get SG component for a domain
 */
export function getSgComponentForDomain(domainCode: TestDomainCode): SgComponent {
  return DOMAIN_COMPONENT_MAPPINGS[domainCode].sgComponent;
}

/**
 * Get approach sub-bucket for a domain (if applicable)
 */
export function getSubBucketForDomain(domainCode: TestDomainCode): ApproachSubBucket | undefined {
  return DOMAIN_COMPONENT_MAPPINGS[domainCode].subBucket;
}

// ============================================================================
// PROOF METRICS FUNCTIONS
// ============================================================================

/**
 * Get all proof metrics for a domain
 * Returns primary metric first, then secondary metrics
 */
export function getProofMetricsForDomain(domainCode: TestDomainCode): ProofMetric[] {
  return getAllMetricsForDomain(domainCode);
}

/**
 * Get primary proof metric for a domain
 */
export function getPrimaryProofMetric(domainCode: TestDomainCode): ProofMetric {
  return DOMAIN_PROOF_METRICS[domainCode].primaryMetric;
}

/**
 * Get a proof metric by its ID
 */
export function getProofMetricById(metricId: string): ProofMetric | undefined {
  return getMetricById(metricId);
}

// ============================================================================
// BENCHMARK TEST FUNCTIONS
// ============================================================================

/**
 * Get default benchmark test IDs for a domain
 * These are the tests that should be used to measure progress
 */
export function getDefaultBenchmarkTestIdsForDomain(domainCode: TestDomainCode): number[] {
  return DOMAIN_BENCHMARK_CONFIGS[domainCode].benchmarkTestIds;
}

/**
 * Get benchmark window (days) for a domain
 */
export function getBenchmarkWindowDays(domainCode: TestDomainCode): number {
  return DOMAIN_BENCHMARK_CONFIGS[domainCode].benchmarkWindowDays;
}

// ============================================================================
// SUCCESS RULE PARSING
// ============================================================================

/**
 * Parse a success rule string into structured format
 *
 * Supported formats:
 * - "metric_id:>=:threshold" (e.g., "DRIVER_DISTANCE_CARRY:>=:250")
 * - "test_id:pass" (e.g., "1:pass")
 * - "improvement:percent:value" (e.g., "improvement:percent:10")
 */
export function parseSuccessRule(rule: SuccessRuleFormat): ParsedSuccessRule | null {
  if (!rule || typeof rule !== 'string') {
    return null;
  }

  const parts = rule.split(':');

  if (parts.length < 2) {
    return null;
  }

  // Test pass format: "test_id:pass"
  if (parts[1] === 'pass') {
    const testId = parseInt(parts[0], 10);
    if (isNaN(testId)) return null;
    return {
      type: 'test_pass',
      testId,
    };
  }

  // Improvement format: "improvement:percent:value"
  if (parts[0] === 'improvement' && parts[1] === 'percent') {
    const percent = parseFloat(parts[2]);
    if (isNaN(percent)) return null;
    return {
      type: 'improvement_percent',
      improvementPercent: percent,
    };
  }

  // Metric threshold format: "metric_id:operator:threshold"
  if (parts.length >= 3) {
    const metricId = parts[0];
    const operator = parts[1] as '>=' | '<=' | '>' | '<' | '==';
    const threshold = parseFloat(parts[2]);

    if (!['>=', '<=', '>', '<', '=='].includes(operator) || isNaN(threshold)) {
      return null;
    }

    return {
      type: 'metric_threshold',
      metricId,
      operator,
      threshold,
    };
  }

  return null;
}

/**
 * Build a success rule string from components
 */
export function buildSuccessRule(
  type: 'metric_threshold' | 'test_pass' | 'improvement_percent',
  options: {
    metricId?: string;
    testId?: number;
    operator?: '>=' | '<=' | '>' | '<' | '==';
    threshold?: number;
    improvementPercent?: number;
  }
): SuccessRuleFormat {
  switch (type) {
    case 'test_pass':
      if (!options.testId) throw new Error('testId required for test_pass rule');
      return `${options.testId}:pass`;

    case 'improvement_percent':
      if (options.improvementPercent === undefined) {
        throw new Error('improvementPercent required for improvement_percent rule');
      }
      return `improvement:percent:${options.improvementPercent}`;

    case 'metric_threshold':
      if (!options.metricId || !options.operator || options.threshold === undefined) {
        throw new Error('metricId, operator, and threshold required for metric_threshold rule');
      }
      return `${options.metricId}:${options.operator}:${options.threshold}`;

    default:
      throw new Error(`Unknown rule type: ${type}`);
  }
}

// ============================================================================
// API RESPONSE BUILDERS
// ============================================================================

/**
 * Get domain info for API response
 */
export function getDomainInfo(domainCode: TestDomainCode): DomainInfoResponse {
  const mapping = DOMAIN_COMPONENT_MAPPINGS[domainCode];
  const proofMetrics = getProofMetricsForDomain(domainCode);
  const benchmarkConfig = DOMAIN_BENCHMARK_CONFIGS[domainCode];

  return {
    domainCode,
    sgComponent: mapping.sgComponent,
    subBucket: mapping.subBucket,
    description: mapping.description,
    proofMetrics: proofMetrics.map(m => ({
      metricId: m.metricId,
      label: m.label,
      unit: m.unit,
      direction: m.direction,
    })),
    benchmarkTestIds: benchmarkConfig.benchmarkTestIds,
  };
}

/**
 * Get all domains info for API response
 */
export function getAllDomainsInfo(): AllDomainsResponse {
  return {
    domains: ALL_DOMAIN_CODES.map(code => getDomainInfo(code)),
    lastUpdated: new Date(),
  };
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate a domain code string
 */
export function validateDomainCode(code: string): code is TestDomainCode {
  return isValidDomainCode(code);
}

/**
 * Get all valid domain codes
 */
export function getAllDomainCodes(): TestDomainCode[] {
  return [...ALL_DOMAIN_CODES];
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Types re-exported for convenience
  type TestDomainCode,
  type SgComponent,
  type ApproachSubBucket,
  type ProofMetric,
  type DomainMappingResult,
  type DomainInfoResponse,
};
