/**
 * ============================================================
 * COACH NAVIGATION CONFIG - TIER Golf
 * ============================================================
 *
 * Single source of truth for coach navigation.
 * Updated based on COACH_MODULE_FUNCTIONS.md specification.
 *
 * STRUCTURE (10 top-level items):
 * 1. Oversikt (Dashboard)
 * 2. Spillere (Athletes)
 * 3. Planlegging (Planning)
 * 4. Varsler (Alerts)
 * 5. Kalender (Booking & Calendar)
 * 6. Meldinger (Messages)
 * 7. Bibliotek (Exercises & Templates)
 * 8. Innsikt (Statistics)
 * 9. Turneringer (Tournaments)
 * 10. Mer (Status, Evaluations, Requests, Settings)
 *
 * DESIGN PRINCIPLES:
 * - Neutrality: No athlete ranking, alphabetical A-Å
 * - Parity: Proof/Trajectory viewers identical to player
 * - Immutability: Past sessions cannot be edited
 * - Clarity: Clear statuses and labeling
 * ============================================================
 */

export interface NavItem {
  label: string;
  labelNO: string;  // Norwegian label
  icon: string;
  href?: string;
  badge?: string | 'unreadCount';
  mobileNav?: boolean;  // Show in mobile bottom nav
  hideFromSidebar?: boolean;  // Hide from main navigation sidebar (accessible via Overview)
  submenu?: Array<{
    href: string;
    label: string;
    labelNO: string;
    icon?: string;  // Icon for card display
    badge?: string;
  }>;
}

export const coachNavigationConfig: NavItem[] = [
  // ────────────────────────────────────────────────────────────
  // 1. OVERSIKT (Dashboard)
  // "What needs attention today?"
  // ────────────────────────────────────────────────────────────
  {
    label: 'Dashboard',
    labelNO: 'Oversikt',
    icon: 'HomeIcon',
    href: '/coach',
    mobileNav: true,
  },

  // ────────────────────────────────────────────────────────────
  // 2. SPILLERE (Athletes)
  // Alphabetical list A-Å, neutral presentation, no ranking
  // Accessible via Overview quick actions
  // ────────────────────────────────────────────────────────────
  {
    label: 'Athletes',
    labelNO: 'Spillere',
    icon: 'ProfileIcon',
    href: '/coach/athletes',
    mobileNav: true,
    hideFromSidebar: true,
  },

  // ────────────────────────────────────────────────────────────
  // 3. PLANLEGGING (Planning)
  // "Who has plans and who needs plans?"
  // Tabs: Spillere vs Grupper
  // ────────────────────────────────────────────────────────────
  {
    label: 'Planning',
    labelNO: 'Planlegging',
    icon: 'LessonsIcon',
    href: '/coach/planning',
    mobileNav: true,
    submenu: [
      { href: '/coach/planning', label: 'Overview', labelNO: 'Oversikt', icon: 'HomeIcon' },
      { href: '/coach/planning/annual-plan', label: 'Annual Plan', labelNO: 'Årsplan', icon: 'CalendarIcon' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 4. VARSLER (Alerts)
  // "What requires coach attention"
  // Always grouped alphabetically by athlete name
  // Accessible via Overview quick actions
  // ────────────────────────────────────────────────────────────
  {
    label: 'Alerts',
    labelNO: 'Varsler',
    icon: 'NotificationsIcon',
    href: '/coach/alerts',
    badge: 'unreadCount',
    mobileNav: true,
    hideFromSidebar: true,
  },

  // ────────────────────────────────────────────────────────────
  // 5. KALENDER (Booking & Calendar)
  // Manage schedule and requests
  // ────────────────────────────────────────────────────────────
  {
    label: 'Calendar',
    labelNO: 'Kalender',
    icon: 'CalendarIcon',
    href: '/coach/booking',
    mobileNav: true,
    submenu: [
      { href: '/coach/booking', label: 'Calendar', labelNO: 'Kalender', icon: 'CalendarIcon' },
      { href: '/coach/booking/requests', label: 'Requests', labelNO: 'Forespørsler', icon: 'ChatIcon' },
      { href: '/coach/booking/settings', label: 'Availability', labelNO: 'Tilgjengelighet', icon: 'SettingsIcon' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 6. MELDINGER (Messages)
  // Coach outbound messaging
  // Accessible via Overview quick actions
  // ────────────────────────────────────────────────────────────
  {
    label: 'Messages',
    labelNO: 'Meldinger',
    icon: 'ChatIcon',
    href: '/coach/messages',
    mobileNav: true,
    hideFromSidebar: true,
    submenu: [
      { href: '/coach/messages', label: 'Sent', labelNO: 'Sendt', icon: 'ChatIcon' },
      { href: '/coach/messages/compose', label: 'Compose', labelNO: 'Ny melding', icon: 'EditIcon' },
      { href: '/coach/messages/scheduled', label: 'Scheduled', labelNO: 'Planlagt', icon: 'CalendarIcon' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 7. BIBLIOTEK (Exercises & Templates)
  // Coaching library with exercises, templates, and training system
  // ────────────────────────────────────────────────────────────
  {
    label: 'Library',
    labelNO: 'Bibliotek',
    icon: 'ClubIcon',
    submenu: [
      { href: '/coach/exercises', label: 'Exercise Library', labelNO: 'Øvelser', icon: 'ClubIcon' },
      { href: '/coach/exercises/mine', label: 'My Exercises', labelNO: 'Mine øvelser', icon: 'ProfileIcon' },
      { href: '/coach/exercises/templates', label: 'Templates', labelNO: 'Maler', icon: 'LessonsIcon' },
      { href: '/coach/training-system', label: 'Training System', labelNO: 'Treningssystem', icon: 'SettingsIcon' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 8. INNSIKT (Statistics)
  // Team-level overview
  // ────────────────────────────────────────────────────────────
  {
    label: 'Insights',
    labelNO: 'Innsikt',
    icon: 'StatsIcon',
    submenu: [
      { href: '/coach/stats', label: 'Overview', labelNO: 'Oversikt', icon: 'HomeIcon' },
      { href: '/coach/stats/progress', label: 'Progress', labelNO: 'Fremgang', icon: 'StatsIcon' },
      { href: '/coach/stats/regression', label: 'Regression', labelNO: 'Tilbakegang', icon: 'StatsIcon' },
      { href: '/training/statistics', label: 'Training Analysis', labelNO: 'Treningsanalyse', icon: 'StatsIcon' },
      { href: '/coach/stats/datagolf', label: 'Tools', labelNO: 'Verktøy', icon: 'ScorecardIcon' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 9. TURNERINGER (Tournaments)
  // Team competition overview
  // ────────────────────────────────────────────────────────────
  {
    label: 'Tournaments',
    labelNO: 'Turneringer',
    icon: 'GolfFlagIcon',
    submenu: [
      { href: '/coach/tournaments', label: 'Calendar', labelNO: 'Kalender', icon: 'CalendarIcon' },
      { href: '/coach/tournaments/players', label: 'Participants', labelNO: 'Deltakere', icon: 'ProfileIcon' },
      { href: '/coach/tournaments/results', label: 'Results', labelNO: 'Resultater', icon: 'HandicapIcon' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 10. MER (More)
  // Status, Evaluations, Requests, Settings
  // ────────────────────────────────────────────────────────────
  {
    label: 'More',
    labelNO: 'Mer',
    icon: 'SettingsIcon',
    submenu: [
      { href: '/coach/groups', label: 'Groups', labelNO: 'Grupper', icon: 'ProfileIcon' },
      { href: '/coach/athlete-status', label: 'Athlete Status', labelNO: 'Spillerstatus', icon: 'StatsIcon' },
      { href: '/coach/session-evaluations', label: 'Evaluations', labelNO: 'Evalueringer', icon: 'CheckIcon' },
      { href: '/coach/modification-requests', label: 'Requests', labelNO: 'Forespørsler', icon: 'ChatIcon' },
      { href: '/coach/samlinger', label: 'Training Camps', labelNO: 'Samlinger', icon: 'GolfFlagIcon' },
      { href: '/coach/settings', label: 'Settings', labelNO: 'Innstillinger', icon: 'SettingsIcon' },
    ],
  },
];

/**
 * ============================================================
 * QUICK ACTIONS FOR COACH SIDEBAR
 * ============================================================
 */
export const coachQuickActions = [
  {
    label: 'Ny beskjed',
    icon: 'ChatIcon',
    href: '/coach/messages/compose',
    variant: 'primary' as const,
  },
  {
    label: 'Ny økt',
    icon: 'AddIcon',
    href: '/coach/planning',
    variant: 'secondary' as const,
  },
];

/**
 * ============================================================
 * MOBILE BOTTOM NAV ITEMS
 * First 5-6 most used areas
 * ============================================================
 */
export const coachMobileNavItems = coachNavigationConfig
  .filter(item => item.mobileNav)
  .slice(0, 6);

/**
 * ============================================================
 * COACH ALERT TYPES
 * ============================================================
 */
export const coachAlertTypes = {
  PROOF_UPLOADED: { label: 'Bevis lastet opp', labelNO: 'Bevis lastet opp', icon: 'VideoIcon', color: 'info' },
  PLAN_PENDING: { label: 'Plan venter', labelNO: 'Plan venter', icon: 'LessonsIcon', color: 'warning' },
  NOTE_REQUEST: { label: 'Notat-forespørsel', labelNO: 'Notat-forespørsel', icon: 'ChatIcon', color: 'info' },
  MILESTONE: { label: 'Milepæl oppnådd', labelNO: 'Milepæl oppnådd', icon: 'GolfFlagIcon', color: 'success' },
  INJURY: { label: 'Sykdom/skade', labelNO: 'Sykdom/skade', icon: 'NotificationsIcon', color: 'error' },
  TEST_COMPLETED: { label: 'Test fullført', labelNO: 'Test fullført', icon: 'CheckIcon', color: 'success' },
} as const;

/**
 * ============================================================
 * ATHLETE ACTIONS (for Athlete Detail hub)
 * 5 main actions as tiles
 * ============================================================
 */
export const athleteDetailActions = [
  {
    id: 'proof',
    label: 'Se Bevis',
    icon: 'VideoIcon',
    href: (id: string) => `/coach/athletes/${id}/proof`,
    description: 'Se treningsvideoer og bilder',
  },
  {
    id: 'trajectory',
    label: 'Se Utvikling',
    icon: 'StatsIcon',
    href: (id: string) => `/coach/athletes/${id}/trajectory`,
    description: 'Historisk progresjon',
  },
  {
    id: 'tests',
    label: 'Testprotokoll',
    icon: 'TargetIcon',
    href: (id: string) => `/coach/athletes/${id}/tests`,
    description: 'Se testresultater og progresjon',
  },
  {
    id: 'plan',
    label: 'Treningsplan',
    icon: 'LessonsIcon',
    href: (id: string) => `/coach/athletes/${id}/plan`,
    description: 'Se og rediger treningsplan',
  },
  {
    id: 'notes',
    label: 'Notater',
    icon: 'ScorecardIcon',
    href: (id: string) => `/coach/athletes/${id}/notes`,
    description: 'Trenernotater',
  },
] as const;

/**
 * ============================================================
 * EXERCISE CATEGORIES
 * 7 categories per spec
 * ============================================================
 */
export const exerciseCategories = [
  { id: 'putting', label: 'Putting', labelNO: 'Putting', icon: 'target' },
  { id: 'driving', label: 'Driving', labelNO: 'Driving', icon: 'swing' },
  { id: 'iron', label: 'Iron', labelNO: 'Jern', icon: 'flag' },
  { id: 'wedge', label: 'Wedge', labelNO: 'Wedge', icon: 'triangle' },
  { id: 'bunker', label: 'Bunker', labelNO: 'Bunker', icon: 'mountain' },
  { id: 'mental', label: 'Mental', labelNO: 'Mental', icon: 'brain' },
  { id: 'fitness', label: 'Fitness', labelNO: 'Kondisjon', icon: 'dumbbell' },
] as const;

/**
 * ============================================================
 * DIFFICULTY LEVELS
 * ============================================================
 */
export const difficultyLevels = [
  { id: 'beginner', label: 'Beginner', labelNO: 'Nybegynner' },
  { id: 'intermediate', label: 'Intermediate', labelNO: 'Middels' },
  { id: 'advanced', label: 'Advanced', labelNO: 'Avansert' },
] as const;

/**
 * ============================================================
 * BOOKING STATUSES
 * ============================================================
 */
export const bookingStatuses = {
  available: { label: 'Available', labelNO: 'Tilgjengelig', color: 'success', icon: 'circle-check' },
  booked: { label: 'Booked', labelNO: 'Booket', color: 'info', icon: 'circle-dot' },
  pending: { label: 'Pending', labelNO: 'Venter', color: 'warning', icon: 'circle-alert' },
  blocked: { label: 'Blocked', labelNO: 'Blokkert', color: 'error', icon: 'circle-x' },
} as const;

/**
 * ============================================================
 * MESSAGE CATEGORIES
 * ============================================================
 */
export const messageCategories = [
  { id: 'training', label: 'Training', labelNO: 'Trening', icon: 'dumbbell' },
  { id: 'tournament', label: 'Tournament', labelNO: 'Turnering', icon: 'trophy' },
  { id: 'important', label: 'Important', labelNO: 'Viktig', icon: 'alert-triangle' },
  { id: 'general', label: 'General', labelNO: 'Generelt', icon: 'message-circle' },
] as const;

/**
 * ============================================================
 * ATHLETE STATUS OPTIONS
 * ============================================================
 */
export const athleteStatusOptions = [
  { id: 'ready', label: 'Ready', labelNO: 'Klar', color: 'success', icon: 'circle-check' },
  { id: 'limited', label: 'Limited', labelNO: 'Begrenset', color: 'warning', icon: 'circle-alert' },
  { id: 'injured', label: 'Injured', labelNO: 'Skadet', color: 'error', icon: 'circle-x' },
] as const;

/**
 * ============================================================
 * MODIFICATION REQUEST STATUSES
 * ============================================================
 */
export const modificationRequestStatuses = [
  { id: 'waiting', label: 'Waiting', labelNO: 'Venter', icon: 'clock' },
  { id: 'in_review', label: 'In Review', labelNO: 'Under vurdering', icon: 'search' },
  { id: 'resolved', label: 'Resolved', labelNO: 'Løst', icon: 'check-circle' },
  { id: 'rejected', label: 'Rejected', labelNO: 'Avvist', icon: 'x-circle' },
] as const;

/**
 * ============================================================
 * MODIFICATION REQUEST PRIORITY
 * ============================================================
 */
export const modificationRequestPriority = [
  { id: 'low', label: 'Low', labelNO: 'Lav', color: 'success' },
  { id: 'medium', label: 'Medium', labelNO: 'Medium', color: 'warning' },
  { id: 'high', label: 'High', labelNO: 'Høy', color: 'error' },
] as const;

// Default export for backwards compatibility
export default coachNavigationConfig;
