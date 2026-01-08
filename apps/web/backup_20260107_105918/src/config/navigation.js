/**
 * ============================================================
 * SPILLER NAVIGASJONSKONFIGURASJON - TIER Golf Academy
 * ============================================================
 *
 * Komplett navigasjon for spillere i TIER Golf Academy.
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
    label: 'Oversikt',
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
      { href: '/utvikling', label: 'Oversikt', icon: 'LayoutDashboard' },
      { href: '/utvikling/breaking-points', label: 'Breaking Points', icon: 'Zap' },
      { href: '/utvikling/kategori', label: 'Kategori-fremgang', icon: 'Layers' },
      { href: '/utvikling/benchmark', label: 'Benchmark-historie', icon: 'BarChart2' },
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
      { href: '/trening/dagens', label: 'Dagens plan', icon: 'CalendarCheck' },
      { href: '/trening/ukens', label: 'Ukens plan', icon: 'CalendarDays' },
      { href: '/sessions', label: 'Alle økter', icon: 'ListChecks' },
      { href: '/trening/dagbok', label: 'Treningsdagbok', icon: 'BookOpen' },
      { href: '/trening/logg', label: 'Logg trening', icon: 'Plus' },
      { href: '/evaluering', label: 'Evalueringer', icon: 'ClipboardCheck' },
      { href: '/ovelsesbibliotek', label: 'Øvelsesbank', icon: 'Library' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // KALENDER
  // Treningsplan, månedsoversikt, booking
  // ────────────────────────────────────────────────────────────
  {
    label: 'Kalender',
    icon: 'Calendar',
    submenu: [
      { href: '/kalender?view=week', label: 'Ukeplan', icon: 'CalendarRange' },
      { href: '/kalender?view=month', label: 'Månedsoversikt', icon: 'Calendar' },
      { href: '/kalender/booking', label: 'Book trener', icon: 'UserPlus' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // PLANLEGGER
  // Årsplan med periodisering, turneringsplan, målsetninger
  // ────────────────────────────────────────────────────────────
  {
    label: 'Planlegger',
    icon: 'Map',
    submenu: [
      { href: '/aarsplan', label: 'Årsplan', icon: 'Calendar' },
      { href: '/aarsplan/ny', label: 'Opprett årsplan', icon: 'FilePlus' },
      { href: '/aarsplan/perioder', label: 'Periodisering', icon: 'Layers' },
      { href: '/periodeplaner', label: 'Periodeplaner', icon: 'FileStack' },
      { href: '/turneringer/planlegger', label: 'Turneringsplan', icon: 'Trophy' },
      { href: '/aarsplan/fokus', label: 'Fokusområder', icon: 'Focus' },
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
      { href: '/testprotokoll', label: 'Testprotokoll', icon: 'ClipboardList' },
      { href: '/testresultater', label: 'Mine resultater', icon: 'FileCheck' },
      { href: '/testing/krav', label: 'Kategori-krav', icon: 'ListOrdered' },
      { href: '/testing/registrer', label: 'Registrer test', icon: 'PlusCircle' },
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
      { href: '/turneringskalender', label: 'Kalender', icon: 'CalendarDays' },
      { href: '/mine-turneringer', label: 'Mine turneringer', icon: 'Medal' },
      { href: '/turneringer/resultater', label: 'Resultater', icon: 'Award' },
      { href: '/turneringer/registrer', label: 'Registrer resultat', icon: 'Plus' },
    ]
  },

  // ────────────────────────────────────────────────────────────
  // STATISTIKK
  // Unified hub with tabs: Overview, Strokes Gained, Benchmark, Results, Status
  // ────────────────────────────────────────────────────────────
  {
    label: 'Statistikk',
    icon: 'BarChart3',
    submenu: [
      { href: '/statistikk', label: 'Statistikk-hub', icon: 'LayoutDashboard' },
      { href: '/statistikk?tab=strokes-gained', label: 'Strokes Gained', icon: 'TrendingUp' },
      { href: '/statistikk?tab=benchmark', label: 'Benchmark', icon: 'BarChart2' },
      { href: '/statistikk?tab=testresultater', label: 'Testresultater', icon: 'FileCheck' },
      { href: '/statistikk?tab=status', label: 'Status & Mål', icon: 'Target' },
      { href: '/stats/guide', label: 'Slik fungerer det', icon: 'BookOpen' },
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
      { href: '/meldinger', label: 'Meldinger', icon: 'Mail' },
      { href: '/varsler', label: 'Varsler', icon: 'Bell' },
      { href: '/meldinger/trener', label: 'Fra trener', icon: 'User' },
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
      { href: '/maalsetninger', label: 'Mine mål', icon: 'Target' },
      { href: '/progress', label: 'Fremgang', icon: 'TrendingUp' },
      { href: '/achievements', label: 'Prestasjoner', icon: 'Award' },
      { href: '/badges', label: 'Merker', icon: 'BadgeCheck' },
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
      { href: '/ressurser', label: 'Ressurser', icon: 'FileText' },
      { href: '/videos', label: 'Videoer', icon: 'Video' },
      { href: '/notater', label: 'Notater', icon: 'StickyNote' },
      { href: '/bevis', label: 'Videobevis', icon: 'Film' },
      { href: '/samlinger', label: 'Samlinger', icon: 'FolderOpen' },
      { href: '/arkiv', label: 'Arkiv', icon: 'Archive' },
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
      { href: '/skoleplan', label: 'Timeplan', icon: 'Clock' },
      { href: '/skole/oppgaver', label: 'Oppgaver', icon: 'CheckSquare' },
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
      { href: '/profil', label: 'Min profil', icon: 'User' },
      { href: '/kalibrering', label: 'Kalibrering', icon: 'Sliders' },
      { href: '/trenerteam', label: 'Trenerteam', icon: 'Users' },
      { href: '/innstillinger/varsler', label: 'Varselinnstillinger', icon: 'BellRing' },
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
  main: navigationConfig.slice(0, 8),      // Dashboard, Utvikling, Trening, Kalender, Planlegger, Testing, Turneringer, Statistikk
  communication: navigationConfig.slice(8, 10), // Kommunikasjon, Mål & Fremgang
  resources: navigationConfig.slice(10, 12),    // Kunnskap, Skole
  settings: navigationConfig.slice(12),        // Innstillinger
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
