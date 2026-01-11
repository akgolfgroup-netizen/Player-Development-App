/**
 * ============================================================
 * PLAYER NAVIGATION V3 - TIER Golf
 * ============================================================
 *
 * Ny 5-modus navigasjonsstruktur med fargekodet områder:
 *
 * HOVEDOMRÅDER:
 * 1. Dashboard (Hjem) - Oversikt og sammendrag
 * 2. Plan (Gul/Amber) - Kalender, mål, turneringer
 * 3. Trening (Grønn)  - Logging, økter, øvelser, testing
 * 4. Analyse (Blå) - Fremgang, statistikk, sammenligninger (erstatter "Min utvikling")
 * 5. Mer (Lilla) - Profil, innstillinger, ressurser
 *
 * ============================================================
 */

export type AreaColor = 'default' | 'green' | 'blue' | 'amber' | 'purple';

export interface NavSubItem {
  href: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface NavArea {
  id: string;
  label: string;
  icon: string;
  color: AreaColor;
  href: string;
  hubPath: string;
  sections?: NavSection[];
  badge?: string;
}

export interface NavSection {
  id: string;
  label: string;
  items: NavSubItem[];
}

/**
 * Fargepalett for de 5 områdene
 */
export const areaColors: Record<AreaColor, {
  primary: string;
  light: string;
  dark: string;
  surface: string;
  text: string;
}> = {
  default: {
    primary: 'rgb(var(--tier-navy))', // TIER Navy (brand)
    light: 'rgb(var(--tier-navy-light))',
    dark: 'rgb(var(--tier-navy-dark))',
    surface: 'rgb(var(--surface-secondary))',
    text: 'rgb(var(--text-primary))',
  },
  green: {
    primary: 'rgb(var(--status-success))', // Success Green
    light: 'rgb(var(--status-success-light))',
    dark: 'rgb(var(--status-success-dark))',
    surface: 'rgb(var(--surface-tertiary))',
    text: 'rgb(var(--text-primary))',
  },
  blue: {
    primary: 'rgb(var(--status-info))', // Info Blue
    light: 'rgb(var(--status-info-light))',
    dark: 'rgb(var(--status-info-dark))',
    surface: 'rgb(var(--surface-tertiary))',
    text: 'rgb(var(--text-primary))',
  },
  amber: {
    primary: 'rgb(var(--status-warning))', // Warning Amber
    light: 'rgb(var(--status-warning-light))',
    dark: 'rgb(var(--status-warning-dark))',
    surface: 'rgb(var(--surface-tertiary))',
    text: 'rgb(var(--text-primary))',
  },
  purple: {
    primary: 'rgb(var(--category-j))', // Category J Purple
    light: 'rgb(var(--category-k))',
    dark: 'rgb(var(--category-j))',
    surface: 'rgb(var(--category-j-bg))',
    text: 'rgb(var(--text-primary))',
  },
};

/**
 * Hovednavigasjon for spillerportalen (5 områder)
 */
export const playerNavigationV3: NavArea[] = [
  // ────────────────────────────────────────────────────────────
  // 1. DASHBOARD - Oversikt og sammendrag
  // ────────────────────────────────────────────────────────────
  {
    id: 'dashboard',
    label: 'Oversikt',
    icon: 'HomeIcon',
    color: 'default',
    href: '/dashboard',
    hubPath: '/dashboard',
    sections: [
      {
        id: 'overview',
        label: 'Oversikt',
        items: [
          { href: '/dashboard', label: 'Hjem', icon: 'HomeIcon', description: 'Din personlige oversikt' },
          { href: '/dashboard/aktivitet', label: 'Status', icon: 'StatsIcon', description: 'Siste aktiviteter' },
          { href: '/mer/varsler', label: 'Deling', icon: 'ShareIcon', description: 'Delingsinnstillinger' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 2. PLAN - Kalender, mål, turneringer (AMBER)
  // ────────────────────────────────────────────────────────────
  {
    id: 'plan',
    label: 'Plan',
    icon: 'CalendarIcon',
    color: 'amber',
    href: '/plan',
    hubPath: '/plan',
    sections: [
      {
        id: 'kalender',
        label: 'Kalender',
        items: [
          { href: '/plan/kalender', label: 'Kalender', icon: 'CalendarIcon', description: 'Din kalender' },
          { href: '/plan/booking', label: 'Booking', icon: 'CalendarIcon', description: 'Book treningstid' },
          { href: '/samlinger', label: 'Samlinger', icon: 'GolfFlagIcon', description: 'Treningssamlinger' },
        ],
      },
      {
        id: 'skole',
        label: 'Skole',
        items: [
          { href: '/plan/skole', label: 'Skoleplan', icon: 'CalendarIcon', description: 'Skoletimer, fag og oppgaver' },
        ],
      },
      {
        id: 'mal',
        label: 'Mål',
        items: [
          { href: '/plan/maal', label: 'Målsetninger', icon: 'TargetIcon', description: 'Dine mål' },
          { href: '/plan/aarsplan', label: 'Årsplan', icon: 'ScorecardIcon', description: 'Langsiktig plan' },
        ],
      },
      {
        id: 'turneringer',
        label: 'Turneringer',
        items: [
          { href: '/plan/turneringer', label: 'Turneringskalender', icon: 'GolfFlagIcon', description: 'Alle turneringer' },
          { href: '/plan/turneringer/mine', label: 'Mine turneringer', icon: 'GolfFlagIcon', description: 'Påmeldte turneringer' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 3. TRENING - Logging, økter, øvelser, testing (GRØNN)
  // ────────────────────────────────────────────────────────────
  {
    id: 'trening',
    label: 'Trening',
    icon: 'SwingIcon',
    color: 'green',
    href: '/trening',
    hubPath: '/trening',
    sections: [
      {
        id: 'okter',
        label: 'Trening',
        items: [
          { href: '/trening/okter', label: 'Mine økter', icon: 'LessonsIcon', description: 'Planlagte økter' },
          { href: '/trening/plan', label: 'Min treningsplan', icon: 'CalendarIcon', description: 'Ukentlig plan' },
        ],
      },
      {
        id: 'logging',
        label: 'Logg',
        items: [
          { href: '/trening/logg', label: 'Registrer treningsøkt', icon: 'AddIcon', description: 'Registrer treningsøkt' },
          { href: '/trening/dagbok', label: 'Treningshistorikk', icon: 'ScorecardIcon', description: 'Se treningshistorikk' },
          { href: '/training/statistics', label: 'Treningsanalyse', icon: 'StatsIcon', description: 'Ukentlig/månedlig statistikk og analyse' },
        ],
      },
      {
        id: 'ovelser',
        label: 'Teknisk plan',
        items: [
          { href: '/plan/teknisk-plan', label: 'P-System (P1.0-P10.0)', icon: 'TargetIcon', description: 'Teknisk utviklingsplan P-system' },
          { href: '/trening/ovelser', label: 'Øvelser', icon: 'ClubIcon', description: 'Øvelsesbibliotek' },
          { href: '/trening/videoer', label: 'Videoer', icon: 'VideoIcon', description: 'Instruksjonsvideoer' },
          { href: '/videos/compare', label: 'Sammenlign videoer', icon: 'CompareIcon', description: 'Sammenlign videoer side-ved-side' },
          { href: '/trening/trackman-upload', label: 'TrackMan', icon: 'RefreshIcon', description: 'Last opp TrackMan data' },
        ],
      },
      {
        id: 'testing',
        label: 'Testing',
        items: [
          { href: '/trening/testing', label: 'Testprotokoll', icon: 'TargetIcon', description: 'Oversikt tester' },
          { href: '/trening/testing/registrer', label: 'Registrer test', icon: 'AddIcon', description: 'Ny testresultat' },
        ],
      },
      {
        id: 'kunnskap',
        label: 'Kunnskap',
        items: [
          { href: '/trening/kategorisystem', label: 'Kategorisystem', icon: 'LessonsIcon', description: 'Forstå treningssystemet' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 4. ANALYSE - Fremgang, statistikk, sammenligninger (BLÅ)
  // ────────────────────────────────────────────────────────────
  {
    id: 'utvikling',
    label: 'Analyse',
    icon: 'StatsIcon',
    color: 'blue',
    href: '/analyse',
    hubPath: '/analyse',
    sections: [
      {
        id: 'fremgang',
        label: 'Fremgang & Statistikk',
        items: [
          { href: '/analyse', label: 'Oversikt', icon: 'StatsIcon', description: 'Din progresjon' },
          { href: '/analyse/statistikk', label: 'Statistikk', icon: 'ScorecardIcon', description: 'Detaljert statistikk' },
          { href: '/analyse/sammenligninger', label: 'Sammenligninger', icon: 'CompareIcon', description: 'Sammenlign prestasjoner' },
          { href: '/analyse/rapporter', label: 'Rapporter', icon: 'StatsIcon', description: 'Fremdriftsrapporter' },
          { href: '/utvikling/historikk', label: 'Historikk', icon: 'RefreshIcon', description: 'Tidligere resultater' },
        ],
      },
      {
        id: 'tester',
        label: 'Tester',
        items: [
          { href: '/analyse/tester', label: 'Testresultater', icon: 'TargetIcon', description: 'Alle testresultater' },
        ],
      },
      {
        id: 'achievements',
        label: 'Prestasjoner',
        items: [
          { href: '/analyse/prestasjoner', label: 'Prestasjoner', icon: 'CheckIcon', description: 'Merker og prestasjoner' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 5. MER - Profil, innstillinger, ressurser (LILLA)
  // ────────────────────────────────────────────────────────────
  {
    id: 'mer',
    label: 'Mer',
    icon: 'SettingsIcon',
    color: 'purple',
    href: '/mer',
    hubPath: '/mer',
    badge: 'unreadMessages',
    sections: [
      {
        id: 'profil',
        label: 'Profil',
        items: [
          { href: '/mer/profil', label: 'Min profil', icon: 'ProfileIcon', description: 'Din profil' },
          { href: '/mer/trenerteam', label: 'Trenerteam', icon: 'ProfileIcon', description: 'Dine trenere' },
        ],
      },
      {
        id: 'kommunikasjon',
        label: 'Kommunikasjon',
        items: [
          { href: '/mer/meldinger', label: 'Meldinger', icon: 'ChatIcon', description: 'Innboks' },
          { href: '/mer/chat', label: 'Chat', icon: 'ChatIcon', description: 'Sanntids chat med trener' },
          { href: '/mer/feedback', label: 'Trenerfeedback', icon: 'ChatIcon', description: 'Tilbakemeldinger' },
        ],
      },
      {
        id: 'ressurser',
        label: 'Ressurser',
        items: [
          { href: '/mer/kunnskap', label: 'Kunnskapsbase', icon: 'LessonsIcon', description: 'Artikler og guider' },
          { href: '/plan/kalender?action=book', label: 'Book trener', icon: 'UsersIcon', description: 'Bestill time med trener' },
          { href: '/mer/notater', label: 'Notater', icon: 'ScorecardIcon', description: 'Dine notater' },
          { href: '/samlinger', label: 'Samlinger', icon: 'FolderIcon', description: 'Treningssamlinger' },
          { href: '/arkiv', label: 'Arkiv', icon: 'ArchiveIcon', description: 'Arkiverte elementer' },
        ],
      },
      {
        id: 'innstillinger',
        label: 'Innstillinger',
        items: [
          { href: '/mer/innstillinger', label: 'Innstillinger', icon: 'SettingsIcon', description: 'App-innstillinger' },
          { href: '/mer/varsler', label: 'Varsler og deling', icon: 'ShareIcon', description: 'Delingsinnstillinger' },
          { href: '/mer/kalibrering', label: 'Kalibrering', icon: 'SettingsIcon', description: 'Testkalibrering' },
          { href: '/billing', label: 'Abonnement', icon: 'CreditCardIcon', description: 'Administrer abonnement' },
        ],
      },
    ],
  },
];

/**
 * Hurtighandlinger for dashboard
 */
export const playerQuickActionsV3 = [
  {
    label: 'Planlegg ny økt',
    icon: 'AddIcon',
    href: '/session/new',
    variant: 'primary' as const,
  },
  {
    label: 'Hurtigregistrering',
    icon: 'ClockIcon',
    href: '/session/quick',
    variant: 'secondary' as const,
  },
  {
    label: 'Registrer test',
    icon: 'TargetIcon',
    href: '/trening/testing/registrer',
    variant: 'secondary' as const,
  },
];

/**
 * Bottom navigation items (mobile)
 */
export const bottomNavItems = playerNavigationV3.map(area => ({
  id: area.id,
  label: area.label,
  icon: area.icon,
  href: area.hubPath,
  color: area.color,
  badge: area.badge,
}));

/**
 * Finn område basert på path
 */
export function getAreaByPath(path: string): NavArea | undefined {
  return playerNavigationV3.find(area => {
    if (path === area.hubPath || path.startsWith(area.hubPath + '/')) return true;
    if (area.sections) {
      for (const section of area.sections) {
        for (const item of section.items) {
          if (path === item.href || path.startsWith(item.href + '/')) return true;
        }
      }
    }
    return false;
  });
}

/**
 * Finn område basert på ID
 */
export function getAreaById(id: string): NavArea | undefined {
  return playerNavigationV3.find(area => area.id === id);
}

/**
 * Flat liste over alle navigasjonselementer
 */
export function getAllNavItems(): Array<NavSubItem & { areaId: string; areaLabel: string; color: AreaColor }> {
  const items: Array<NavSubItem & { areaId: string; areaLabel: string; color: AreaColor }> = [];

  for (const area of playerNavigationV3) {
    if (area.sections) {
      for (const section of area.sections) {
        for (const item of section.items) {
          items.push({
            ...item,
            areaId: area.id,
            areaLabel: area.label,
            color: area.color,
          });
        }
      }
    }
  }

  return items;
}

/**
 * Route redirects fra gamle til nye paths
 */
export const routeRedirectsV3: Record<string, string> = {
  '/': '/dashboard',
  '/hjem': '/dashboard',
  '/tren/logg': '/trening/logg',
  '/tren/okter': '/trening/okter',
  '/tren/ovelser': '/trening/ovelser',
  '/tren/testing': '/trening/testing',
  '/tren/testing/registrer': '/trening/testing/registrer',
  '/tren/testing/resultater': '/utvikling/testresultater',
  '/tren/testing/krav': '/utvikling/krav',
  '/analyser/utvikling': '/utvikling/oversikt',
  '/analyser/statistikk': '/utvikling/statistikk',
  '/analyser/mal': '/plan/maal',
  '/analyser/historikk': '/utvikling/historikk',
  '/planlegg/ukeplan': '/plan/ukeplan',
  '/planlegg/kalender': '/plan/kalender',
  '/planlegg/turneringer/kalender': '/plan/turneringer',
  '/planlegg/turneringer/mine': '/plan/turneringer/mine',
  '/samhandle/meldinger': '/mer/meldinger',
  '/samhandle/feedback': '/mer/feedback',
  '/samhandle/kunnskap': '/mer/kunnskap',
  '/profil': '/mer/profil',
  '/innstillinger': '/mer/innstillinger',
};

// ============================================================
// FLAT NAVIGATION - Forenklet 5-modus struktur (Fase 1 UX)
// ============================================================
// Brukes av ny sidebar som ikke har nested menyer.
// Undersider vises som horisontale tabs på hver hub-side.

export interface FlatNavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  color: AreaColor;
  badge?: string;
}

/**
 * Forenklet navigasjon med 5 hovedelementer (ingen nesting)
 * Matcher V4 navigasjonsstruktur: Hjem, Plan, Trening, Analyse, Mer
 */
export const playerNavigationFlat: FlatNavItem[] = [
  {
    id: 'dashboard',
    label: 'Hjem',
    icon: 'Home',
    href: '/dashboard',
    color: 'default',
  },
  {
    id: 'plan',
    label: 'Plan',
    icon: 'Calendar',
    href: '/plan',
    color: 'amber',
  },
  {
    id: 'trening',
    label: 'Trening',
    icon: 'Dumbbell',
    href: '/trening',
    color: 'green',
  },
  {
    id: 'fremgang',
    label: 'Analyse',
    icon: 'TrendingUp',
    href: '/analyse',
    color: 'blue',
  },
  {
    id: 'mer',
    label: 'Mer',
    icon: 'MoreHorizontal',
    href: '/mer',
    color: 'purple',
    badge: 'unreadMessages',
  },
];

/**
 * Brukermeny dropdown-items (vises i header)
 */
export const userMenuItems = [
  { href: '/mer/profil', label: 'Min profil', icon: 'User' },
  { href: '/mer/innstillinger', label: 'Innstillinger', icon: 'Settings' },
  { href: '/billing', label: 'Abonnement', icon: 'CreditCard' },
  { href: '/mer/kunnskap', label: 'Hjelp & Support', icon: 'HelpCircle' },
];

/**
 * Horisontale tabs for hvert område (vises på hub-sider)
 */
export const areaTabsConfig = {
  trening: [
    { href: '/trening', label: 'Oversikt', icon: 'LayoutDashboard' },
    { href: '/trening/logg', label: 'Logg økt', icon: 'Plus' },
    { href: '/trening/dagbok', label: 'Historikk', icon: 'History' },
    { href: '/trening/ovelser', label: 'Øvelser', icon: 'Dumbbell' },
    { href: '/trening/testing', label: 'Testing', icon: 'Target' },
  ],
  fremgang: [
    { href: '/analyse', label: 'Oversikt', icon: 'LayoutDashboard' },
    { href: '/analyse/statistikk', label: 'Statistikk', icon: 'BarChart3' },
    { href: '/analyse/tester', label: 'Tester', icon: 'ClipboardList' },
    { href: '/analyse/prestasjoner', label: 'Prestasjoner', icon: 'Award' },
  ],
  // Keep utvikling as alias for fremgang for backwards compatibility
  utvikling: [
    { href: '/analyse', label: 'Oversikt', icon: 'LayoutDashboard' },
    { href: '/analyse/statistikk', label: 'Statistikk', icon: 'BarChart3' },
    { href: '/analyse/tester', label: 'Tester', icon: 'ClipboardList' },
    { href: '/analyse/prestasjoner', label: 'Prestasjoner', icon: 'Award' },
  ],
  plan: [
    { href: '/plan', label: 'Oversikt', icon: 'LayoutDashboard' },
    { href: '/plan/maal', label: 'Mål', icon: 'Target' },
    { href: '/plan/kalender', label: 'Planlegger', icon: 'Calendar' },
    { href: '/plan/turneringer', label: 'Turneringer', icon: 'Trophy' },
  ],
};

/**
 * Hent tabs for et område
 */
export function getTabsForArea(areaId: string): Array<{ href: string; label: string; icon: string }> {
  return areaTabsConfig[areaId as keyof typeof areaTabsConfig] || [];
}

/**
 * Finn område basert på path (for flat navigasjon)
 */
export function getFlatAreaByPath(path: string): FlatNavItem | undefined {
  return playerNavigationFlat.find(item => {
    if (path === item.href) return true;
    if (item.href !== '/' && path.startsWith(item.href + '/')) return true;
    return false;
  });
}

export default playerNavigationV3;
