/**
 * Test Domain Module
 *
 * Centralized exports for test-related domain logic including:
 * - Type mappers (canonical → UI)
 * - Category mappings with semantic gap handling
 * - Trend calculations
 * - Semantic gap documentation
 *
 * NAMING CONVENTION: See docs/naming.md
 * - All exports use English names
 * - Canonical types re-exported from @iup/shared-types
 */

// ============================================================================
// CANONICAL TYPES (Defined locally to avoid CRA webpack issues)
// ============================================================================

// Re-export canonical types from mappers (defined locally there)
export type {
  CanonicalTestResult as TestResult,
  CanonicalTestDefinition as TestDefinition,
  CanonicalTestCategory as TestCategory,
  TestResultWithDefinition,
} from './mappers';

// Test environment type
export type TestEnvironment = 'indoor' | 'outdoor';

// Constants for canonical types
export const TEST_CATEGORIES = ['putting', 'chipping', 'pitching', 'bunker', 'iron', 'driver', 'physical', 'mental'] as const;
export const TEST_ENVIRONMENTS = ['indoor', 'outdoor'] as const;

// ============================================================================
// UI TYPES & MAPPERS
// ============================================================================

export {
  // Canonical → Dashboard mappers
  mapCanonicalToDashboardResult,
  mapCanonicalToDashboardResults,

  // Canonical TestCategory → UISkillArea (returns null for unmapped)
  mapCanonicalTestCategoryToSkillArea,

  // API/Legacy → UI mappers (with fallback)
  mapTestCategoryToSkillArea,
  mapApiResultToAttempt,
  mapApiDataToUITestResult,
  mapApiDataToUITestResults,

  // Canonical TestResult → UITestResult direct mapper
  mapCanonicalToUITestResult,

  // List page result mapper (for TestResultsPage, etc.)
  mapRawResultsToListPage,

  // Trend calculations
  calculateTrendData,

  // Types
  type ApiTestDefinition,
  type ApiTestResult,
  type TrendData,
  type ListPageTestResult,
  type RawApiTestResultWithTest,

  // Unmappable concept warning
  type PlayerCategoryMappingWarning,
  approximateSkillLevelFromPlayerCategory,
} from './mappers';
