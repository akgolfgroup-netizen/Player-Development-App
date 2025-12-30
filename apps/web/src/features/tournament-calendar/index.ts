/**
 * AK Golf Academy - Tournament Calendar Feature
 *
 * Tournament discovery and planning surface with:
 * - Automatic tournament ingestion
 * - Recommended player category mapping
 * - List-first design
 * - Robust filtering
 */

// Main page component
export { default as TournamentCalendarPage } from './TournamentCalendarPage';

// Detail panel
export { default as TournamentDetailsPanel } from './TournamentDetailsPanel';

// Types
export * from './types';

// Hierarchy configuration
export {
  HIERARCHY_RULES,
  findHierarchyRule,
  getRecommendedCategory,
  getCategoryLevelLabel,
  isTournamentRecommendedForPlayer,
  getTourPrestigeScore,
  applyHierarchyMapping,
  getCategoryBadgeConfig,
} from './hierarchy-config';

// Service
export {
  fetchTournaments,
  calculateStats,
  generateSeedTournaments,
  getAvailableCountries,
  getAvailableTours,
  groupTournamentsByPeriod,
} from './tournament-service';
