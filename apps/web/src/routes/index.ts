/**
 * Routes Module
 *
 * This module provides centralized exports for route-related components and utilities.
 * The actual routing is still handled in App.jsx, but this module makes it easier
 * to migrate to a more modular routing structure in the future.
 *
 * Usage:
 *   import { layouts, lazyImports } from './routes';
 *   // or
 *   import { AuthenticatedLayout, Login } from './routes';
 */

// Re-export all lazy imports
export * from './lazyImports';

// Re-export all layouts
export * from './layouts';

// Route path constants for type-safe navigation
export const ROUTES = {
  // Public
  ROOT: '/',
  LOGIN: '/login',
  WELCOME: '/welcome',

  // Dashboard
  DASHBOARD: '/dashboard',

  // Profile
  PROFILE: '/profil',
  PROFILE_UPDATE: '/profil/oppdater',

  // Player features
  GOALS: '/maalsetninger',
  ANNUAL_PLAN: '/aarsplan',
  TRAINING: '/trening',
  CALENDAR: '/calendar',
  SESSIONS: '/sessions',
  TESTS: '/tester',
  ACHIEVEMENTS: '/prestasjoner',
  BADGES: '/merker',
  TOURNAMENTS: '/turneringer',
  MESSAGES: '/meldinger',
  NOTIFICATIONS: '/varsler',
  NOTES: '/notater',
  RESOURCES: '/ressurser',
  ARCHIVE: '/arkiv',
  SETTINGS: '/innstillinger',

  // Video
  VIDEO_LIBRARY: '/video/library',
  VIDEO_ANALYSIS: '/video/analysis',
  VIDEO_COMPARISON: '/video/comparison',
  VIDEO_PROGRESS: '/video/progress',

  // Stats
  STATS: '/stats',
  PLAYER_STATS: '/player-stats',
  STROKES_GAINED: '/player-stats/strokes-gained',

  // Development
  PROGRESS: '/min-utvikling',
  BREAKING_POINTS: '/min-utvikling/breaking-points',

  // Mobile
  MOBILE_HOME: '/m/home',
  MOBILE_PLAN: '/m/plan',
  MOBILE_LOG: '/m/log',
  MOBILE_CALENDAR: '/m/calendar',
  MOBILE_CALIBRATION: '/m/calibration',

  // Coach
  COACH: {
    DASHBOARD: '/coach/dashboard',
    ATHLETES: '/coach/athletes',
    ATHLETE_DETAIL: '/coach/athletes/:id',
    GROUPS: '/coach/groups',
    TRAINING_PLAN: '/coach/training-plan',
    MESSAGES: '/coach/messages',
    STATS: '/coach/stats',
    BOOKING: '/coach/booking',
    TOURNAMENTS: '/coach/tournaments',
    EXERCISES: '/coach/exercises',
    SETTINGS: '/coach/settings',
  },

  // Admin
  ADMIN: {
    SYSTEM: '/admin/system-overview',
    COACHES: '/admin/coaches',
    FEATURE_FLAGS: '/admin/feature-flags',
    TIER_MANAGEMENT: '/admin/tier-management',
    ESCALATION: '/admin/escalation',
  },

  // Dev (development only)
  DEV: {
    UI_LAB: '/lab/ui',
    STATS_LAB: '/lab/stats',
    CALENDAR_LAB: '/lab/calendar',
    UI_CANON: '/lab/ui-canon',
  },
} as const;

// Type for route paths
export type RoutePath =
  | typeof ROUTES[keyof Omit<typeof ROUTES, 'COACH' | 'ADMIN' | 'DEV'>]
  | typeof ROUTES.COACH[keyof typeof ROUTES.COACH]
  | typeof ROUTES.ADMIN[keyof typeof ROUTES.ADMIN]
  | typeof ROUTES.DEV[keyof typeof ROUTES.DEV];
