/**
 * Domain Mapping Module
 * Single source of truth for test domain → SG component mappings
 */

// Types
export type {
  TestDomainCode,
  SgComponent,
  ApproachSubBucket,
  DomainToComponentMapping,
  DomainMappingResult,
  ProofMetric,
  DomainProofMetrics,
  DomainBenchmarkMapping,
  MetricDirection,
  CategoryTargets,
  CategoryAK,
  Gender,
  SuccessRuleFormat,
  ParsedSuccessRule,
  DomainInfoResponse,
  AllDomainsResponse,
} from './domain-mapping.types';

// Configuration
export {
  DOMAIN_COMPONENT_MAPPINGS,
  DOMAIN_BENCHMARK_CONFIGS,
  TEST_TO_DOMAIN_MAP,
  ALL_DOMAIN_CODES,
  DOMAIN_PRIORITY_ORDER,
  isValidDomainCode,
} from './domain-mapping.config';

// Proof Metrics Configuration
export {
  DOMAIN_PROOF_METRICS,
  getAllMetricsForDomain,
  getMetricById,
  getAllMetricIds,
} from './proof-metrics.config';

// Service Functions
export {
  // Core mapping
  mapTestDomainToComponent,
  mapTestNumberToDomain,
  getTestNumbersForDomain,
  getSgComponentForDomain,
  getSubBucketForDomain,

  // Proof metrics
  getProofMetricsForDomain,
  getPrimaryProofMetric,
  getProofMetricById,

  // Benchmark tests
  getDefaultBenchmarkTestIdsForDomain,
  getBenchmarkWindowDays,

  // Success rules
  parseSuccessRule,
  buildSuccessRule,

  // API responses
  getDomainInfo,
  getAllDomainsInfo,

  // Validation
  validateDomainCode,
  getAllDomainCodes,
} from './domain-mapping.service';
