/**
 * Domain Mapping Types
 * Maps test domains (TEE, INN200, etc.) to SG components and proof metrics
 */

// ============================================================================
// TEST DOMAIN CODES
// ============================================================================

/**
 * Test domain codes representing training/test focus areas
 * - TEE: Tee shots / driving (OTT component)
 * - INN200: Approach shots from 200+ meters
 * - INN150: Approach shots from 150-200 meters
 * - INN100: Approach shots from 100-150 meters
 * - INN50: Approach shots from 50-100 meters
 * - ARG: Around the green (chipping, bunker)
 * - PUTT: Putting
 * - PHYS: Physical conditioning
 */
export type TestDomainCode =
  | 'TEE'
  | 'INN200'
  | 'INN150'
  | 'INN100'
  | 'INN50'
  | 'ARG'
  | 'PUTT'
  | 'PHYS';

/**
 * Strokes Gained components from DataGolf
 */
export type SgComponent = 'OTT' | 'APP' | 'ARG' | 'PUTT' | 'TOTAL';

/**
 * Approach sub-buckets for more granular analysis
 */
export type ApproachSubBucket =
  | '200_plus'
  | '150_200'
  | '100_150'
  | '50_100'
  | 'under_50';

// ============================================================================
// DOMAIN MAPPING
// ============================================================================

/**
 * Mapping from test domain to SG component
 */
export interface DomainToComponentMapping {
  domainCode: TestDomainCode;
  sgComponent: SgComponent;
  subBucket?: ApproachSubBucket;
  description: string;
  relatedTestNumbers: number[]; // Team Norway test numbers (1-20)
}

/**
 * Result of mapping a domain to component
 */
export interface DomainMappingResult {
  sgComponent: SgComponent;
  subBucket?: ApproachSubBucket;
  relatedTestNumbers: number[];
}

// ============================================================================
// PROOF METRICS
// ============================================================================

/**
 * Direction indicator for metric improvement
 */
export type MetricDirection = 'higher_better' | 'lower_better';

/**
 * Target values by player category (A-K)
 */
export type CategoryTargets = Partial<Record<CategoryAK, number>>;

/**
 * Category codes A through K
 */
export type CategoryAK = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K';

/**
 * Gender codes
 */
export type Gender = 'M' | 'K';

/**
 * Proof metric definition
 * Represents a measurable outcome that proves improvement in a domain
 */
export interface ProofMetric {
  metricId: string;
  label: string;
  description: string;
  unit: string;
  direction: MetricDirection;
  minSamples: number; // Minimum samples needed for statistical significance
  benchmarkTestIds: number[]; // Team Norway test IDs that measure this
  targetsByCategory: {
    M: CategoryTargets;
    K: CategoryTargets;
  };
  dataSource: 'test_result' | 'round_stats' | 'calibration' | 'datagolf';
}

/**
 * Collection of proof metrics for a domain
 */
export interface DomainProofMetrics {
  domainCode: TestDomainCode;
  primaryMetric: ProofMetric;
  secondaryMetrics: ProofMetric[];
}

// ============================================================================
// BENCHMARK TEST MAPPING
// ============================================================================

/**
 * Mapping from domain to benchmark tests
 */
export interface DomainBenchmarkMapping {
  domainCode: TestDomainCode;
  benchmarkTestIds: number[];
  benchmarkWindowDays: number; // How far back to look for benchmark results
}

// ============================================================================
// SUCCESS RULES
// ============================================================================

/**
 * Success rule definition for breaking point resolution
 * Format: "metric_id:operator:threshold" or "test_id:pass"
 */
export type SuccessRuleFormat = string;

/**
 * Parsed success rule
 */
export interface ParsedSuccessRule {
  type: 'metric_threshold' | 'test_pass' | 'improvement_percent';
  metricId?: string;
  testId?: number;
  operator?: '>=' | '<=' | '>' | '<' | '==';
  threshold?: number;
  improvementPercent?: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Domain info response for API consumers
 */
export interface DomainInfoResponse {
  domainCode: TestDomainCode;
  sgComponent: SgComponent;
  subBucket?: ApproachSubBucket;
  description: string;
  proofMetrics: Array<{
    metricId: string;
    label: string;
    unit: string;
    direction: MetricDirection;
  }>;
  benchmarkTestIds: number[];
}

/**
 * All domains response
 */
export interface AllDomainsResponse {
  domains: DomainInfoResponse[];
  lastUpdated: Date;
}
