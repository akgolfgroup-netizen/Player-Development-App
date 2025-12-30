/**
 * Category Constraints Module
 * Computes binding constraints for A-K category progression
 */

// Types
export type {
  CategoryAK,
  Gender,
  ComparisonOperator,
  ConstraintSeverity,
  ConstraintConfidence,
  CategoryRequirementDef,
  RequirementWithMetadata,
  ConstraintEvidence,
  BindingConstraint,
  ConstraintCounts,
  DomainConstraintCounts,
  CategoryConstraintsResult,
  ComputeConstraintsInput,
  PlayerTestData,
  CategoryConstraintsRequest,
  CategoryConstraintsResponse,
} from './category-constraints.types';

// Requirements source
export {
  TEST_NAMES,
  TEST_SEVERITY,
  getRequirementsForCategory,
  getRequirementsForTest,
  getRequirement,
  getRequirementsForCategories,
  getNextCategory,
  getPreviousCategory,
  getCategoryDistance,
  clearRequirementsCache,
} from './category-requirements.source';

// Service
export {
  CategoryConstraintsService,
  createCategoryConstraintsService,
} from './category-constraints.service';
