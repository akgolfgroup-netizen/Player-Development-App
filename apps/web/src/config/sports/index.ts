/**
 * Sports Configuration Index
 *
 * Central registry for all sport configurations.
 * Import sport configs from here to ensure consistent access.
 *
 * Usage:
 *   import { GOLF_CONFIG, getSportConfig } from '@/config/sports';
 *   const config = getSportConfig('golf');
 */

export * from './types';
export { GOLF_CONFIG, default as GolfConfig } from './golf.config';

import type { SportConfig, SportId } from './types';
import { GOLF_CONFIG } from './golf.config';

// ============================================================================
// SPORT REGISTRY
// ============================================================================

/**
 * Registry of all available sport configurations.
 * Add new sports here as they are implemented.
 */
export const SPORTS_REGISTRY: Record<SportId, SportConfig> = {
  golf: GOLF_CONFIG,
  // Future sports (placeholder configs will be added):
  running: GOLF_CONFIG, // Placeholder - will be replaced
  handball: GOLF_CONFIG, // Placeholder - will be replaced
  football: GOLF_CONFIG, // Placeholder - will be replaced
  javelin: GOLF_CONFIG, // Placeholder - will be replaced
  tennis: GOLF_CONFIG, // Placeholder - will be replaced
  swimming: GOLF_CONFIG, // Placeholder - will be replaced
};

/**
 * Get sport configuration by ID
 * @param sportId - The sport identifier
 * @returns SportConfig for the requested sport
 * @throws Error if sport is not found
 */
export function getSportConfig(sportId: SportId): SportConfig {
  const config = SPORTS_REGISTRY[sportId];
  if (!config) {
    throw new Error(`Sport configuration not found for: ${sportId}`);
  }
  return config;
}

/**
 * Check if a sport is available
 * @param sportId - The sport identifier
 * @returns true if sport has a real config (not placeholder)
 */
export function isSportAvailable(sportId: SportId): boolean {
  // For now, only golf is fully implemented
  return sportId === 'golf';
}

/**
 * Get list of all available sports
 * @returns Array of sport IDs that are fully implemented
 */
export function getAvailableSports(): SportId[] {
  return (Object.keys(SPORTS_REGISTRY) as SportId[]).filter(isSportAvailable);
}

/**
 * Get all sports (including placeholders)
 * @returns Array of all sport IDs
 */
export function getAllSports(): SportId[] {
  return Object.keys(SPORTS_REGISTRY) as SportId[];
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

/**
 * Default sport configuration (Golf)
 * Used when no specific sport is selected
 */
export const DEFAULT_SPORT_CONFIG = GOLF_CONFIG;
export const DEFAULT_SPORT_ID: SportId = 'golf';
