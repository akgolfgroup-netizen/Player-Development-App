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
// CANONICAL TYPES (Re-exported from @iup/shared-types)
// ============================================================================

export type {
  TestResult,
  TestDefinition,
  TestCategory,
  TestEnvironment,
  TestResultWithDefinition,
} from '@iup/shared-types';

export {
  TEST_CATEGORIES,
  TEST_ENVIRONMENTS,
} from '@iup/shared-types';

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
