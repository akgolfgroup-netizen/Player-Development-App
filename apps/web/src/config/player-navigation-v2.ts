/**
 * ============================================================
 * SPILLER NAVIGASJON V2 - TIER Golf
 * ============================================================
 *
 * Forenklet 5-modus navigasjonsstruktur for spillerportalen.
 * Redusert fra 13 til 5 toppnivåvalg for bedre UX.
 *
 * TOPPNIVÅ (5 moduser):
 * 1. Hjem     - Dashboard og oversikt
 * 2. Tren     - Trening, logging, økter, testing
 * 3. Planlegg - Kalender, ukeplan, turneringer
 * 4. Analyser - Utvikling, statistikk, mål, historikk
 * 5. Samhandle - Meldinger, feedback, kunnskap, (skole)
 *
 * ============================================================
 */

export interface NavSubItem {
  href: string;
  label: string;
  icon?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  submenu?: NavSubItem[];
  badge?: string;
}

/**
 * Hovednavigasjon for spillerportalen (5 toppnivå)
 */
export const playerNavigationV2: NavItem[] = [
  // ────────────────────────────────────────────────────────────
  // 1. HJEM - Dashboard og oversikt
  // ────────────────────────────────────────────────────────────
  {
    id: 'hjem',
    label: 'Hjem',
    icon: 'Home',
    href: '/hjem',
  },

  // ────────────────────────────────────────────────────────────
  // 2. TREN - Trening, logging, økter, testing
  // ────────────────────────────────────────────────────────────
  {
    id: 'tren',
    label: 'Tren',
    icon: 'Dumbbell',
    submenu: [
      { href: '/tren/logg', label: 'Logg trening', icon: 'Plus' },
      { href: '/tren/okter', label: 'Mine økter', icon: 'ClipboardList' },
      { href: '/tren/ovelser', label: 'Øvelsesbank', icon: 'Library' },
      { href: '/tren/testing', label: 'Testing', icon: 'Target' },
      { href: '/tren/testing/registrer', label: 'Registrer test', icon: 'PlusCircle' },
      { href: '/tren/testing/resultater', label: 'Testresultater', icon: 'BarChart' },
      { href: '/tren/testing/krav', label: 'Kategori-krav', icon: 'Award' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 3. PLANLEGG - Kalender, ukeplan, turneringer
  // ────────────────────────────────────────────────────────────
  {
    id: 'planlegg',
    label: 'Planlegg',
    icon: 'Calendar',
    submenu: [
      { href: '/planlegg/ukeplan', label: 'Ukeplan', icon: 'CalendarDays' },
      { href: '/planlegg/kalender', label: 'Kalender', icon: 'Calendar' },
      { href: '/planlegg/turneringer/kalender', label: 'Turneringskalender', icon: 'Trophy' },
      { href: '/planlegg/turneringer/mine', label: 'Mine turneringer', icon: 'Flag' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 4. ANALYSER - Utvikling, statistikk, mål, historikk
  // ────────────────────────────────────────────────────────────
  {
    id: 'analyser',
    label: 'Analyser',
    icon: 'TrendingUp',
    submenu: [
      { href: '/analyser/utvikling', label: 'Min utvikling', icon: 'TrendingUp' },
      { href: '/analyser/statistikk', label: 'Statistikk', icon: 'BarChart3' },
      { href: '/analyser/mal', label: 'Målsetninger', icon: 'Target' },
      { href: '/analyser/historikk', label: 'Historikk', icon: 'History' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 5. SAMHANDLE - Meldinger, feedback, kunnskap
  // ────────────────────────────────────────────────────────────
  {
    id: 'samhandle',
    label: 'Samhandle',
    icon: 'MessageCircle',
    badge: 'unreadMessages',
    submenu: [
      { href: '/samhandle/meldinger', label: 'Meldinger', icon: 'Mail' },
      { href: '/samhandle/feedback', label: 'Trenerfeedback', icon: 'MessageSquare' },
      { href: '/samhandle/kunnskap', label: 'Ressurser', icon: 'BookOpen' },
    ],
  },
];

/**
 * Hurtighandlinger for spillerdashboard
 */
export const playerQuickActionsV2 = [
  {
    label: 'Logg trening',
    icon: 'Plus',
    href: '/tren/logg',
    variant: 'primary' as const,
  },
  {
    label: 'Registrer test',
    icon: 'Target',
    href: '/tren/testing/registrer',
    variant: 'secondary' as const,
  },
];

/**
 * Innstillinger-elementer (flyttes til profil-dropdown)
 */
export const settingsMenuItems = [
  { href: '/profil', label: 'Min profil', icon: 'User' },
  { href: '/profil/oppdater', label: 'Rediger profil', icon: 'Edit' },
  { href: '/innstillinger/varsler', label: 'Varselinnstillinger', icon: 'Bell' },
  { href: '/trenerteam', label: 'Trenerteam', icon: 'Users' },
  { href: '/kalibrering', label: 'Kalibrering', icon: 'Sliders' },
];

/**
 * Skole-meny (kun synlig hvis spiller har skole-kontekst)
 * Integrert som underpunkt i Samhandle
 */
export const schoolMenuItem: NavSubItem = {
  href: '/samhandle/skole',
  label: 'Skole',
  icon: 'GraduationCap',
};

/**
 * Badge-konfigurasjoner
 */
export const badgeConfigV2 = {
  unreadMessages: {
    source: 'notifications',
    color: 'error',
    max: 99,
  },
};

/**
 * Mapping fra gammel til ny URL-struktur
 */
export const routeRedirects: Record<string, string> = {
  '/': '/hjem',
  '/dashboard': '/hjem',
  '/trening/logg': '/tren/logg',
  '/trening/dagbok': '/tren/logg',
  '/sessions': '/tren/okter',
  '/ovelsesbibliotek': '/tren/ovelser',
  '/oevelser': '/tren/ovelser',
  '/testprotokoll': '/tren/testing',
  '/testing/registrer': '/tren/testing/registrer',
  '/testresultater': '/tren/testing/resultater',
  '/testing/krav': '/tren/testing/krav',
  '/kalender': '/planlegg/kalender',
  '/turneringskalender': '/planlegg/turneringer/kalender',
  '/mine-turneringer': '/planlegg/turneringer/mine',
  '/statistikk': '/analyser/statistikk',
  '/min-utvikling': '/analyser/utvikling',
  '/utvikling': '/analyser/utvikling',
  '/maalsetninger': '/analyser/mal',
  '/progress': '/analyser/historikk',
  '/meldinger': '/samhandle/meldinger',
  '/kommunikasjon': '/samhandle/meldinger',
  '/ressurser': '/samhandle/kunnskap',
  '/kunnskap': '/samhandle/kunnskap',
  '/skoleplan': '/samhandle/skole',
};

export default playerNavigationV2;
