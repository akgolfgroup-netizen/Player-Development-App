/**
 * ============================================================
 * COACH NAVIGASJONSKONFIGURASJON - AK Golf Academy
 * ============================================================
 *
 * Navigasjon for trenere i AK Golf Academy systemet.
 * Oppdatert basert på Coach:Admin.md kravspesifikasjon.
 *
 * STRUKTUR:
 * - label: Navn som vises i menyen
 * - icon: Ikon fra lucide-react
 * - href: URL-sti
 * - submenu: Array med undermenypunkter (valgfritt)
 * - badge: Badge-tekst (valgfritt, f.eks. "NY" eller tall)
 *
 * ============================================================
 */

export const coachNavigationConfig = [
  // ────────────────────────────────────────────────────────────
  // DASHBOARD
  // ────────────────────────────────────────────────────────────
  {
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    href: '/coach'
  },

  // ────────────────────────────────────────────────────────────
  // MINE SPILLERE (CoachAthleteHub med tabs)
  // Oversikt over alle spillere, status, turneringsdeltakelse
  // ────────────────────────────────────────────────────────────
  {
    label: 'Mine spillere',
    icon: 'Users',
    submenu: [
      { href: '/coach/athletes', label: 'Alle spillere' },
      { href: '/coach/athletes?tab=status', label: 'Status & varsler' },
      { href: '/coach/athletes?tab=turneringer', label: 'Turneringsdeltakelse' },
      { href: '/coach/videos', label: 'Spillervideoer' },
      { href: '/coach/reference-videos', label: 'Referansebibliotek', badge: 'NY' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // MINE GRUPPER
  // Gruppeadministrasjon (WANG Toppidrett, Team Norway, etc.)
  // ────────────────────────────────────────────────────────────
  {
    label: 'Mine grupper',
    icon: 'UsersRound',
    submenu: [
      { href: '/coach/groups', label: 'Alle grupper' },
      { href: '/coach/groups/create', label: 'Ny gruppe' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // SAMLINGER
  // Treningssamlinger med egen kalender og øktplanlegging
  // ────────────────────────────────────────────────────────────
  {
    label: 'Samlinger',
    icon: 'Tent',
    submenu: [
      { href: '/coach/samlinger', label: 'Alle samlinger' },
      { href: '/coach/samlinger/ny', label: 'Ny samling', badge: 'NY' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // BOOKINGSYSTEM
  // Booking av økter med spillere
  // ────────────────────────────────────────────────────────────
  {
    label: 'Booking',
    icon: 'CalendarCheck',
    submenu: [
      { href: '/coach/booking', label: 'Kalender' },
      { href: '/coach/booking/requests', label: 'Forespørsler' },
      { href: '/coach/booking/settings', label: 'Tilgjengelighet' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // STATS VERKTØY
  // Statistikk og analyse for spillere (inkl. Data Golf)
  // ────────────────────────────────────────────────────────────
  {
    label: 'Stats',
    icon: 'BarChart3',
    submenu: [
      { href: '/coach/stats', label: 'Spilleroversikt' },
      { href: '/coach/stats/progress', label: 'Fremgang' },
      { href: '/coach/stats/regression', label: 'Tilbakegang' },
      { href: '/coach/stats/datagolf', label: 'Data Golf' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // TRENINGSPLANLEGGER
  // Årsplan → Periodeplan → Månedplan → Ukeplan → Øktplan
  // ────────────────────────────────────────────────────────────
  {
    label: 'Treningsplanlegger',
    icon: 'ClipboardList',
    submenu: [
      { href: '/coach/planning', label: 'Velg spiller' },
      { href: '/coach/planning/group', label: 'Velg gruppe' },
      { href: '/coach/planning/templates', label: 'Maler' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // TURNERINGSKALENDER
  // Full kalender + mine spilleres deltakelse
  // ────────────────────────────────────────────────────────────
  {
    label: 'Turneringer',
    icon: 'Trophy',
    submenu: [
      { href: '/coach/tournaments', label: 'Kalender' },
      { href: '/coach/tournaments/players', label: 'Mine spillere' },
      { href: '/coach/tournaments/results', label: 'Resultater' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // BESKJED / CHAT
  // Planlagt meldingssending til spillere/grupper
  // ────────────────────────────────────────────────────────────
  {
    label: 'Beskjeder',
    icon: 'MessageCircle',
    submenu: [
      { href: '/coach/messages', label: 'Sendt' },
      { href: '/coach/messages/compose', label: 'Ny beskjed' },
      { href: '/coach/messages/scheduled', label: 'Planlagt' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // ØVELSESBANK
  // Øvelser og treningsplanmaler
  // ────────────────────────────────────────────────────────────
  {
    label: 'Øvelsesbank',
    icon: 'Dumbbell',
    submenu: [
      { href: '/coach/exercises', label: 'Alle øvelser' },
      { href: '/coach/exercises/mine', label: 'Mine øvelser' },
      { href: '/coach/exercises/templates', label: 'Treningsplaner' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // VARSLER
  // ────────────────────────────────────────────────────────────
  {
    label: 'Varsler',
    icon: 'Bell',
    href: '/coach/alerts',
    badge: 'unreadCount'
  },

  // ────────────────────────────────────────────────────────────
  // INNSTILLINGER
  // ────────────────────────────────────────────────────────────
  {
    label: 'Innstillinger',
    icon: 'Settings',
    href: '/coach/settings'
  },
];

/**
 * ============================================================
 * HURTIGHANDLINGER FOR COACH
 * ============================================================
 *
 * Vises øverst i sidemenyen for rask tilgang.
 */

export const coachQuickActions = [
  {
    label: 'Ny beskjed',
    icon: 'Send',
    href: '/coach/messages/compose',
    variant: 'primary'
  },
  {
    label: 'Ny økt',
    icon: 'Plus',
    href: '/coach/planning',
    variant: 'secondary'
  },
];

/**
 * ============================================================
 * DASHBOARD ALERT TYPER
 * ============================================================
 *
 * Røde flagg og varsler som vises på dashboard.
 */

export const coachAlertTypes = {
  INJURY: { label: 'Sykdom/skade', icon: 'Stethoscope', color: 'error' },
  SLEEP: { label: 'Lite søvn', icon: 'Moon', color: 'warning' },
  NUTRITION: { label: 'Ernæring', icon: 'Apple', color: 'warning' },
  STRESS: { label: 'Stress', icon: 'Activity', color: 'warning' },
  TOURNAMENT: { label: 'Turnering', icon: 'Trophy', color: 'primary' },
  PROOF_UPLOADED: { label: 'Ny video', icon: 'Video', color: 'success' },
  TEST_COMPLETED: { label: 'Test fullført', icon: 'CheckCircle', color: 'success' },
};

/**
 * ============================================================
 * COACH SIDEBAR SEKSJONER
 * ============================================================
 */

export const coachSidebarSections = {
  main: coachNavigationConfig.slice(0, 5),     // Dashboard, Spillere, Grupper, Samlinger, Booking
  planning: coachNavigationConfig.slice(5, 8), // Stats, Planlegger, Turneringer
  communication: coachNavigationConfig.slice(8, 10), // Beskjeder, Øvelsesbank
  system: coachNavigationConfig.slice(10),      // Varsler, Innstillinger
};
