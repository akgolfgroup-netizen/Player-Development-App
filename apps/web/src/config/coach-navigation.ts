/**
 * ============================================================
 * COACH NAVIGATION CONFIG - AK Golf Academy
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
  submenu?: Array<{
    href: string;
    label: string;
    labelNO: string;
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
    icon: 'LayoutDashboard',
    href: '/coach',
    mobileNav: true,
  },

  // ────────────────────────────────────────────────────────────
  // 2. SPILLERE (Athletes)
  // Alphabetical list A-Å, neutral presentation, no ranking
  // ────────────────────────────────────────────────────────────
  {
    label: 'Athletes',
    labelNO: 'Spillere',
    icon: 'Users',
    href: '/coach/athletes',
    mobileNav: true,
  },

  // ────────────────────────────────────────────────────────────
  // 3. PLANLEGGING (Planning)
  // "Who has plans and who needs plans?"
  // Tabs: Spillere vs Grupper
  // ────────────────────────────────────────────────────────────
  {
    label: 'Planning',
    labelNO: 'Planlegging',
    icon: 'ClipboardList',
    href: '/coach/planning',
    mobileNav: true,
  },

  // ────────────────────────────────────────────────────────────
  // 4. VARSLER (Alerts)
  // "What requires coach attention"
  // Always grouped alphabetically by athlete name
  // ────────────────────────────────────────────────────────────
  {
    label: 'Alerts',
    labelNO: 'Varsler',
    icon: 'Bell',
    href: '/coach/alerts',
    badge: 'unreadCount',
    mobileNav: true,
  },

  // ────────────────────────────────────────────────────────────
  // 5. KALENDER (Booking & Calendar)
  // Manage schedule and requests
  // ────────────────────────────────────────────────────────────
  {
    label: 'Calendar',
    labelNO: 'Kalender',
    icon: 'CalendarCheck',
    href: '/coach/booking',
    mobileNav: true,
    submenu: [
      { href: '/coach/booking', label: 'Calendar', labelNO: 'Kalender' },
      { href: '/coach/booking/requests', label: 'Requests', labelNO: 'Forespørsler' },
      { href: '/coach/booking/settings', label: 'Availability', labelNO: 'Tilgjengelighet' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 6. MELDINGER (Messages)
  // Coach outbound messaging
  // ────────────────────────────────────────────────────────────
  {
    label: 'Messages',
    labelNO: 'Meldinger',
    icon: 'MessageCircle',
    href: '/coach/messages',
    mobileNav: true,
    submenu: [
      { href: '/coach/messages', label: 'Sent', labelNO: 'Sendt' },
      { href: '/coach/messages/compose', label: 'Compose', labelNO: 'Ny melding' },
      { href: '/coach/messages/scheduled', label: 'Scheduled', labelNO: 'Planlagt' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 7. BIBLIOTEK (Exercises & Templates)
  // Coaching library with 7 categories
  // ────────────────────────────────────────────────────────────
  {
    label: 'Library',
    labelNO: 'Bibliotek',
    icon: 'Dumbbell',
    submenu: [
      { href: '/coach/exercises', label: 'Exercise Library', labelNO: 'Øvelser' },
      { href: '/coach/exercises/mine', label: 'My Exercises', labelNO: 'Mine øvelser' },
      { href: '/coach/exercises/templates', label: 'Templates', labelNO: 'Maler' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 8. INNSIKT (Statistics)
  // Team-level overview
  // ────────────────────────────────────────────────────────────
  {
    label: 'Insights',
    labelNO: 'Innsikt',
    icon: 'BarChart3',
    submenu: [
      { href: '/coach/stats', label: 'Overview', labelNO: 'Oversikt' },
      { href: '/coach/stats/progress', label: 'Progress', labelNO: 'Fremgang' },
      { href: '/coach/stats/regression', label: 'Regression', labelNO: 'Tilbakegang' },
      { href: '/coach/stats/datagolf', label: 'DataGolf', labelNO: 'DataGolf' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 9. TURNERINGER (Tournaments)
  // Team competition overview
  // ────────────────────────────────────────────────────────────
  {
    label: 'Tournaments',
    labelNO: 'Turneringer',
    icon: 'Trophy',
    submenu: [
      { href: '/coach/tournaments', label: 'Calendar', labelNO: 'Kalender' },
      { href: '/coach/tournaments/players', label: 'Participants', labelNO: 'Deltakere' },
      { href: '/coach/tournaments/results', label: 'Results', labelNO: 'Resultater' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 10. MER (More)
  // Status, Evaluations, Requests, Settings
  // ────────────────────────────────────────────────────────────
  {
    label: 'More',
    labelNO: 'Mer',
    icon: 'MoreHorizontal',
    submenu: [
      { href: '/coach/groups', label: 'Groups', labelNO: 'Grupper' },
      { href: '/coach/athlete-status', label: 'Athlete Status', labelNO: 'Spillerstatus' },
      { href: '/coach/session-evaluations', label: 'Evaluations', labelNO: 'Evalueringer' },
      { href: '/coach/modification-requests', label: 'Requests', labelNO: 'Forespørsler' },
      { href: '/coach/samlinger', label: 'Training Camps', labelNO: 'Samlinger' },
      { href: '/coach/settings', label: 'Settings', labelNO: 'Innstillinger' },
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
    icon: 'Send',
    href: '/coach/messages/compose',
    variant: 'primary' as const,
  },
  {
    label: 'Ny økt',
    icon: 'Plus',
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
  PROOF_UPLOADED: { label: 'Bevis lastet opp', labelNO: 'Bevis lastet opp', icon: 'Video', color: 'info' },
  PLAN_PENDING: { label: 'Plan venter', labelNO: 'Plan venter', icon: 'ClipboardList', color: 'warning' },
  NOTE_REQUEST: { label: 'Notat-forespørsel', labelNO: 'Notat-forespørsel', icon: 'MessageSquare', color: 'info' },
  MILESTONE: { label: 'Milepæl oppnådd', labelNO: 'Milepæl oppnådd', icon: 'Trophy', color: 'success' },
  INJURY: { label: 'Sykdom/skade', labelNO: 'Sykdom/skade', icon: 'Stethoscope', color: 'error' },
  TEST_COMPLETED: { label: 'Test fullført', labelNO: 'Test fullført', icon: 'CheckCircle', color: 'success' },
} as const;

/**
 * ============================================================
 * ATHLETE ACTIONS (for Athlete Detail hub)
 * 4 main actions as tiles
 * ============================================================
 */
export const athleteDetailActions = [
  {
    id: 'proof',
    label: 'Se Bevis',
    icon: 'Video',
    href: (id: string) => `/coach/athletes/${id}/proof`,
    description: 'Se treningsvideoer og bilder',
  },
  {
    id: 'trajectory',
    label: 'Se Utvikling',
    icon: 'TrendingUp',
    href: (id: string) => `/coach/athletes/${id}/trajectory`,
    description: 'Historisk progresjon',
  },
  {
    id: 'plan',
    label: 'Treningsplan',
    icon: 'ClipboardList',
    href: (id: string) => `/coach/athletes/${id}/plan`,
    description: 'Se og rediger treningsplan',
  },
  {
    id: 'notes',
    label: 'Notater',
    icon: 'FileText',
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
  { id: 'putting', label: 'Putting', labelNO: 'Putting', icon: '🎯' },
  { id: 'driving', label: 'Driving', labelNO: 'Driving', icon: '🏌️' },
  { id: 'iron', label: 'Iron', labelNO: 'Jern', icon: '⛳' },
  { id: 'wedge', label: 'Wedge', labelNO: 'Wedge', icon: '🔺' },
  { id: 'bunker', label: 'Bunker', labelNO: 'Bunker', icon: '⛱️' },
  { id: 'mental', label: 'Mental', labelNO: 'Mental', icon: '🧠' },
  { id: 'fitness', label: 'Fitness', labelNO: 'Kondisjon', icon: '💪' },
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
  available: { label: 'Available', labelNO: 'Tilgjengelig', color: 'success', icon: '🟢' },
  booked: { label: 'Booked', labelNO: 'Booket', color: 'info', icon: '🔵' },
  pending: { label: 'Pending', labelNO: 'Venter', color: 'warning', icon: '🟡' },
  blocked: { label: 'Blocked', labelNO: 'Blokkert', color: 'error', icon: '🔴' },
} as const;

/**
 * ============================================================
 * MESSAGE CATEGORIES
 * ============================================================
 */
export const messageCategories = [
  { id: 'training', label: 'Training', labelNO: 'Trening', icon: '🏋️' },
  { id: 'tournament', label: 'Tournament', labelNO: 'Turnering', icon: '🏆' },
  { id: 'important', label: 'Important', labelNO: 'Viktig', icon: '⚠️' },
  { id: 'general', label: 'General', labelNO: 'Generelt', icon: '📢' },
] as const;

/**
 * ============================================================
 * ATHLETE STATUS OPTIONS
 * ============================================================
 */
export const athleteStatusOptions = [
  { id: 'ready', label: 'Ready', labelNO: 'Klar', color: 'success', icon: '🟢' },
  { id: 'limited', label: 'Limited', labelNO: 'Begrenset', color: 'warning', icon: '🟡' },
  { id: 'injured', label: 'Injured', labelNO: 'Skadet', color: 'error', icon: '🔴' },
] as const;

/**
 * ============================================================
 * MODIFICATION REQUEST STATUSES
 * ============================================================
 */
export const modificationRequestStatuses = [
  { id: 'waiting', label: 'Waiting', labelNO: 'Venter', icon: '⏳' },
  { id: 'in_review', label: 'In Review', labelNO: 'Under vurdering', icon: '🔍' },
  { id: 'resolved', label: 'Resolved', labelNO: 'Løst', icon: '✅' },
  { id: 'rejected', label: 'Rejected', labelNO: 'Avvist', icon: '❌' },
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
