/**
 * ============================================================
 * SPILLER NAVIGASJONSKONFIGURASJON - AK Golf Academy
 * ============================================================
 *
 * Komplett navigasjon for spillere i AK Golf Academy.
 * Basert på fullstendig database-skjema analyse.
 *
 * STRUKTUR:
 * - label: Navn som vises i menyen
 * - icon: Ikon fra lucide-react
 * - href: URL-sti (for direktelenker)
 * - submenu: Array med undermenypunkter
 * - badge: Dynamisk badge (f.eks. uleste meldinger)
 *
 * ============================================================
 */

export const navigationConfig = [
  // ────────────────────────────────────────────────────────────
  // DASHBOARD
  // ────────────────────────────────────────────────────────────
  {
    label: 'Dashboard',
    icon: 'Home',
    href: '/'
  },

  // ────────────────────────────────────────────────────────────
  // MIN UTVIKLING
  // Breaking Points, Kategori-fremgang, Benchmark
  // ────────────────────────────────────────────────────────────
  {
    label: 'Min utvikling',
    icon: 'TrendingUp',
    submenu: [
      { href: '/utvikling', label: 'Oversikt' },
      { href: '/utvikling/breaking-points', label: 'Breaking Points' },
      { href: '/utvikling/kategori', label: 'Kategori-fremgang' },
      { href: '/utvikling/benchmark', label: 'Benchmark-historie' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // TRENING
  // Daglige/ukentlige planer, treningsdagbok, øvelser
  // ────────────────────────────────────────────────────────────
  {
    label: 'Trening',
    icon: 'Activity',
    submenu: [
      { href: '/trening/dagens', label: 'Dagens plan' },
      { href: '/trening/ukens', label: 'Ukens plan' },
      { href: '/trening/dagbok', label: 'Treningsdagbok' },
      { href: '/trening/logg', label: 'Logg trening' },
      { href: '/ovelsesbibliotek', label: 'Øvelsesbank' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // KALENDER
  // Treningsplan, månedsoversikt, årsplan, booking
  // ────────────────────────────────────────────────────────────
  {
    label: 'Kalender',
    icon: 'Calendar',
    submenu: [
      { href: '/kalender?view=week', label: 'Treningsplan' },
      { href: '/kalender?view=month', label: 'Månedsoversikt' },
      { href: '/kalender?view=year', label: 'Årsplan' },
      { href: '/kalender/booking', label: 'Book trener' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // TESTING
  // Testprotokoll, resultater, kategori-krav
  // ────────────────────────────────────────────────────────────
  {
    label: 'Testing',
    icon: 'Target',
    submenu: [
      { href: '/testprotokoll', label: 'Testprotokoll' },
      { href: '/testresultater', label: 'Mine resultater' },
      { href: '/testing/krav', label: 'Kategori-krav' },
      { href: '/testing/registrer', label: 'Registrer test' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // TURNERINGER
  // Kalender, mine turneringer, resultater
  // ────────────────────────────────────────────────────────────
  {
    label: 'Turneringer',
    icon: 'Trophy',
    submenu: [
      { href: '/turneringskalender', label: 'Kalender' },
      { href: '/mine-turneringer', label: 'Mine turneringer' },
      { href: '/turneringer/resultater', label: 'Resultater' },
      { href: '/turneringer/registrer', label: 'Registrer resultat' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // KOMMUNIKASJON
  // Meldinger, varsler, fra trener
  // ────────────────────────────────────────────────────────────
  {
    label: 'Kommunikasjon',
    icon: 'MessageSquare',
    badge: 'unreadMessages',
    submenu: [
      { href: '/meldinger', label: 'Meldinger' },
      { href: '/varsler', label: 'Varsler' },
      { href: '/meldinger/trener', label: 'Fra trener' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // MÅLSETNINGER OG PROGRESJON
  // Målsetninger, fremgang, prestasjoner
  // ────────────────────────────────────────────────────────────
  {
    label: 'Målsetninger og progresjon',
    icon: 'Flag',
    submenu: [
      { href: '/maalsetninger', label: 'Mine mål' },
      { href: '/progress', label: 'Fremgang' },
      { href: '/achievements', label: 'Prestasjoner' },
      { href: '/badges', label: 'Badges' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // KUNNSKAP
  // Ressurser, notater, videobevis, arkiv
  // ────────────────────────────────────────────────────────────
  {
    label: 'Kunnskap',
    icon: 'BookMarked',
    submenu: [
      { href: '/ressurser', label: 'Ressurser' },
      { href: '/notater', label: 'Notater' },
      { href: '/bevis', label: 'Videobevis' },
      { href: '/arkiv', label: 'Arkiv' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // SKOLE
  // Timeplan, oppgaver
  // ────────────────────────────────────────────────────────────
  {
    label: 'Skole',
    icon: 'GraduationCap',
    submenu: [
      { href: '/skoleplan', label: 'Timeplan' },
      { href: '/skole/oppgaver', label: 'Oppgaver' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // INNSTILLINGER
  // Profil, kalibrering, trenerteam, preferanser
  // ────────────────────────────────────────────────────────────
  {
    label: 'Innstillinger',
    icon: 'Settings',
    submenu: [
      { href: '/profil', label: 'Min profil' },
      { href: '/kalibrering', label: 'Kalibrering' },
      { href: '/trenerteam', label: 'Trenerteam' },
      { href: '/innstillinger/varsler', label: 'Varselinnstillinger' },
    ]
  },
];

/**
 * ============================================================
 * HURTIGHANDLINGER FOR SPILLER
 * ============================================================
 *
 * Vises i dashboard for rask tilgang.
 */

export const playerQuickActions = [
  {
    label: 'Logg trening',
    icon: 'Plus',
    href: '/trening/logg',
    variant: 'primary'
  },
  {
    label: 'Registrer test',
    icon: 'Target',
    href: '/testing/registrer',
    variant: 'secondary'
  },
  {
    label: 'Book trener',
    icon: 'Calendar',
    href: '/kalender/booking',
    variant: 'secondary'
  },
];

/**
 * ============================================================
 * BADGE KONFIGURASJONER
 * ============================================================
 *
 * Dynamiske badges som vises ved menypunkter.
 */

export const badgeConfig = {
  unreadMessages: {
    source: 'notifications',
    color: 'error',
    max: 99,
  },
  pendingTests: {
    source: 'tests',
    color: 'warning',
    max: 9,
  },
  newAchievements: {
    source: 'achievements',
    color: 'success',
    max: 9,
  },
};

/**
 * ============================================================
 * SEKSJONER FOR SIDEBAR
 * ============================================================
 */

export const sidebarSections = {
  main: navigationConfig.slice(0, 6),      // Dashboard, Utvikling, Trening, Kalender, Testing, Turneringer
  communication: navigationConfig.slice(6, 8), // Kommunikasjon, Mål & Fremgang
  resources: navigationConfig.slice(8, 10),    // Kunnskap, Skole
  settings: navigationConfig.slice(10),        // Innstillinger
};

/**
 * ============================================================
 * TILGJENGELIGE IKONER (fra lucide-react)
 * ============================================================
 *
 * Home, Users, Trophy, ClipboardList, TrendingUp,
 * Activity, Calendar, GraduationCap, BookMarked,
 * Target, Settings, BarChart3, FileText, MessageSquare,
 * Bell, Star, Award, Zap, Heart, Flag, Map, Compass,
 * Clock, CheckCircle, AlertCircle, Info, HelpCircle,
 * FileCheck, Edit, Trash, Download, Plus, Send
 *
 * Se alle ikoner: https://lucide.dev/icons
 * ============================================================
 */
