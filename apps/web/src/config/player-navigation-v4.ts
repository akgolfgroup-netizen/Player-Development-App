/**
 * ============================================================
 * PLAYER NAVIGATION V4 - TIER Golf
 * ============================================================
 *
 * Hub-basert navigasjonsstruktur med redusert menyompleksitet:
 *
 * HOVEDOMRÅDER:
 * 1. Dashboard (Hjem) - Oversikt og sammendrag
 * 2. Målsetninger (Gul) - Mål og progresjon
 * 3. Planlegger (Amber) - Årsplan, treningsplan, skoleplan, turneringer
 * 4. Trening (Grønn)  - Logging, økter, øvelser, testing
 * 5. Analyse (Blå)    - Fremgang, statistikk, sammenligninger (erstatter "Min utvikling")
 * 6. Mer (Lilla)      - Profil, innstillinger, ressurser
 *
 * VIKTIGE ENDRINGER I V4:
 * - "Min utvikling" → "Analyse" (17 menyitems → 6 hub-items)
 * - Hub-basert struktur med tabs istedenfor separate sider
 * - Reduksjon på ~60% i menyitems for analyse-området
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
 * Hovednavigasjon for spillerportalen V4 (5 områder, hub-basert)
 */
export const playerNavigationV4: NavArea[] = [
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
          { href: '/dashboard/deling', label: 'Deling', icon: 'ShareIcon', description: 'Delingsinnstillinger' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 2. MÅLSETNINGER - Mål og progresjon (GUL)
  // ────────────────────────────────────────────────────────────
  {
    id: 'maalsetninger',
    label: 'Målsetninger',
    icon: 'TargetIcon',
    color: 'amber',
    href: '/maalsetninger',
    hubPath: '/maalsetninger',
    sections: [
      {
        id: 'maal',
        label: 'Målsetninger',
        items: [
          { href: '/maalsetninger/mine', label: 'Mine målsetninger', icon: 'TargetIcon', description: 'Resultatmål og prosessmål' },
          { href: '/maalsetninger/progresjon', label: 'Progresjon', icon: 'TrendingUpIcon', description: 'Målprogresjon og fremgang' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 3. PLANLEGGER - Årsplan, treningsplan, skoleplan (AMBER/ORANGE)
  // ────────────────────────────────────────────────────────────
  {
    id: 'planlegger',
    label: 'Planlegger',
    icon: 'CalendarIcon',
    color: 'amber',
    href: '/planlegger',
    hubPath: '/planlegger',
    sections: [
      {
        id: 'planer',
        label: 'Planer',
        items: [
          { href: '/planlegger/aarsplan', label: 'Årsplan', icon: 'ScorecardIcon', description: 'Periodisering og årsplan' },
          { href: '/planlegger/treningsplan', label: 'Treningsplan', icon: 'CalendarIcon', description: 'Ukentlig treningsplan' },
          { href: '/planlegger/skoleplan', label: 'Skoleplan', icon: 'CalendarIcon', description: 'Skoletimer, prøver og innleveringer' },
        ],
      },
      {
        id: 'turneringer',
        label: 'Turneringer',
        items: [
          { href: '/planlegger/turneringer/mine', label: 'Mine turneringer', icon: 'GolfFlagIcon', description: 'Påmeldte turneringer' },
          { href: '/planlegger/turneringer', label: 'Turneringskalender', icon: 'GolfFlagIcon', description: 'Alle turneringer' },
          { href: '/planlegger/turneringsforberedelse', label: 'Turneringsforberedelse', icon: 'TargetIcon', description: 'Banestrategi og sjekkliste' },
        ],
      },
      {
        id: 'diverse',
        label: 'Diverse',
        items: [
          { href: '/planlegger/booking', label: 'Booking', icon: 'CalendarIcon', description: 'Book treningstid' },
          { href: '/samlinger', label: 'Samlinger', icon: 'GolfFlagIcon', description: 'Treningssamlinger' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 4. TRENING - Logging, økter, øvelser, testing (GRØNN)
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
          { href: '/trening/logg', label: 'Logg treningsøkt', icon: 'AddIcon', description: 'Registrer treningsøkt' },
          { href: '/trening/dagbok', label: 'Treningshistorikk', icon: 'ScorecardIcon', description: 'Se treningshistorikk' },
          { href: '/training/statistics', label: 'Treningsanalyse', icon: 'StatsIcon', description: 'Ukentlig/månedlig statistikk og analyse' },
        ],
      },
      {
        id: 'ovelser',
        label: 'Teknisk plan',
        items: [
          { href: '/trening/teknikkplan', label: 'Teknikkplan', icon: 'TargetIcon', description: 'Teknisk utviklingsplan' },
          { href: '/trening/ovelser', label: 'Mine øvelser', icon: 'ClubIcon', description: 'Mine øvelser' },
          { href: '/trening/ovelser', label: 'Øvelsesbank', icon: 'ClubIcon', description: 'Alle øvelser' },
          { href: '/trening/video', label: 'Video', icon: 'VideoIcon', description: 'Videoer, sammenligning og annotering' },
          { href: '/trening/trackman-sync', label: 'TrackMan Sync', icon: 'RefreshIcon', description: 'Synkroniser TrackMan data' },
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
          { href: '/trening/fokus', label: 'Treningsfokus', icon: 'TargetIcon', description: 'AI-baserte anbefalinger for hva du bør fokusere på' },
          { href: '/trening/fokus-motor', label: 'Fokusmotor', icon: 'TargetIcon', description: 'AI-drevet treningsprioritering' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 5. ANALYSE - Fremgang, statistikk, sammenligninger (BLÅ)
  // ────────────────────────────────────────────────────────────
  // VIKTIG: Dette erstatter "Min utvikling" og reduserer 17 items til 6 hubs
  // ────────────────────────────────────────────────────────────
  {
    id: 'analyse',
    label: 'Analyse',
    icon: 'StatsIcon',
    color: 'blue',
    href: '/analyse',
    hubPath: '/analyse',
    sections: [
      {
        id: 'analyse-hubs',
        label: 'Analyse',
        items: [
          {
            href: '/analyse/statistikk',
            label: 'Statistikk',
            icon: 'ChartBarIcon',
            description: 'Stats, fremgang, strokes gained, trender'
          },
          {
            href: '/analyse/sammenligninger',
            label: 'Sammenligninger',
            icon: 'UsersIcon',
            description: 'Peer, proff og multi-spiller'
          },
          {
            href: '/analyse/rapporter',
            label: 'Rapporter',
            icon: 'DocumentIcon',
            description: 'Fremdriftsrapporter fra trener'
          },
          {
            href: '/analyse/tester',
            label: 'Tester',
            icon: 'ClipboardCheckIcon',
            description: 'Testresultater og krav'
          },
          {
            href: '/analyse/prestasjoner',
            label: 'Prestasjoner',
            icon: 'TrophyIcon',
            description: 'Merker og achievements'
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 6. MER - Profil, innstillinger, ressurser (LILLA)
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
          { href: '/mer/intake', label: 'Inntak/Onboarding', icon: 'ClipboardIcon', description: 'Fyll ut spillerprofil og vurdering' },
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
          { href: '/plan/kalender?action=book', label: 'Book trener', icon: 'UsersIcon', description: 'Bestill time med trener' },
          { href: '/mer/arkiv', label: 'Arkiv', icon: 'ArchiveIcon', description: 'Administrer arkiverte elementer' },
          { href: '/mer/betaling', label: 'Betaling & Fakturering', icon: 'CreditCardIcon', description: 'Administrer betalingsmåter og abonnementer' },
        ],
      },
      {
        id: 'innstillinger',
        label: 'Innstillinger',
        items: [
          { href: '/mer/innstillinger', label: 'Innstillinger', icon: 'SettingsIcon', description: 'App-innstillinger' },
          { href: '/mer/deling', label: 'Deling', icon: 'ShareIcon', description: 'Delingsinnstillinger' },
          { href: '/mer/kalibrering', label: 'Kalibrering', icon: 'SettingsIcon', description: 'Testkalibrering' },
          { href: '/mer/support', label: 'Support', icon: 'ChatIcon', description: 'Få hjelp og support' },
        ],
      },
      {
        id: 'admin',
        label: 'Administrasjon',
        items: [
          { href: '/mer/admin', label: 'Admin Panel', icon: 'SettingsIcon', description: 'Systemadministrasjon' },
          { href: '/mer/admin/feature-flags', label: 'Feature Flags', icon: 'SettingsIcon', description: 'Funksjonsflags administrasjon' },
          { href: '/mer/admin/audit', label: 'Revisjonslogg', icon: 'ClipboardIcon', description: 'Systemrevisjonslogg' },
        ],
      },
    ],
  },
];

/**
 * Hurtighandlinger for dashboard
 */
export const playerQuickActionsV4 = [
  {
    label: 'Logg trening',
    icon: 'AddIcon',
    href: '/trening/logg',
    variant: 'primary' as const,
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
export const bottomNavItemsV4 = playerNavigationV4.map(area => ({
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
  return playerNavigationV4.find(area => {
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
  return playerNavigationV4.find(area => area.id === id);
}

/**
 * Flat liste over alle navigasjonselementer
 */
export function getAllNavItems(): Array<NavSubItem & { areaId: string; areaLabel: string; color: AreaColor }> {
  const items: Array<NavSubItem & { areaId: string; areaLabel: string; color: AreaColor }> = [];

  for (const area of playerNavigationV4) {
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
 * ============================================================
 * V4 ROUTE REDIRECTS - From old "utvikling/*" to new "analyse/*"
 * ============================================================
 *
 * Disse redirects sikrer at gamle lenker fortsatt fungerer:
 * - Bokmerker
 * - SEO
 * - Eksterne lenker
 *
 * Alle /utvikling/* paths redirectes til tilsvarende /analyse/* paths
 */
export const routeRedirectsV4: Record<string, string> = {
  // Root redirects
  '/': '/dashboard',
  '/hjem': '/dashboard',

  // ===================================================================
  // ANALYSE REDIRECTS - Gamle /utvikling/* → Nye /analyse/* structure
  // ===================================================================

  // Hub redirect
  '/utvikling': '/analyse',
  '/utvikling/oversikt': '/analyse',

  // Statistikk hub (4 tabs: oversikt, strokes-gained, trender, status-maal)
  '/utvikling/statistikk': '/analyse/statistikk',
  '/utvikling/strokes-gained': '/analyse/statistikk?tab=strokes-gained',
  '/utvikling/fremgang': '/analyse/statistikk?tab=trender',
  '/utvikling/historikk': '/analyse/statistikk/historikk',  // Deep page

  // Absorbed into StatistikkHub tabs:
  '/utvikling/vendepunkter': '/analyse/statistikk?tab=oversikt#vendepunkter',
  '/utvikling/innsikter': '/analyse/statistikk?tab=status-maal',
  '/utvikling/treningsomrader': '/analyse/statistikk?tab=trender#treningsomrader',

  // Sammenligninger hub (3 tabs: peer, proff, multi)
  '/utvikling/peer-sammenligning': '/analyse/sammenligninger?tab=peer',
  '/utvikling/sammenlign-proff': '/analyse/sammenligninger?tab=proff',
  '/utvikling/datagolf': '/analyse/sammenligninger?tab=proff',
  '/utvikling/sammenligninger': '/analyse/sammenligninger?tab=multi',

  // Rapporter hub
  '/utvikling/rapporter': '/analyse/rapporter',

  // Tester hub (3 tabs: oversikt, resultater, krav)
  '/utvikling/testresultater': '/analyse/tester?tab=resultater',
  '/utvikling/krav': '/analyse/tester?tab=krav',

  // Prestasjoner hub (2 tabs: badges, achievements)
  '/utvikling/badges': '/analyse/prestasjoner?tab=badges',
  '/utvikling/achievements': '/analyse/prestasjoner?tab=achievements',

  // ===================================================================
  // TRENING REDIRECTS - V2 → V3 (unchanged from v3)
  // ===================================================================
  '/tren': '/trening',
  '/tren/logg': '/trening/logg',
  '/tren/okter': '/trening/okter',
  '/tren/ovelser': '/trening/ovelser',
  '/tren/testing': '/trening/testing',
  '/tren/testing/registrer': '/trening/testing/registrer',
  '/tren/testing/resultater': '/analyse/tester?tab=resultater',
  '/tren/testing/krav': '/analyse/tester?tab=krav',

  // ===================================================================
  // PLAN → PLANLEGGER & MÅLSETNINGER REDIRECTS (V4 restructure)
  // ===================================================================
  // Old /plan/* paths redirected to new structure
  '/plan': '/planlegger',
  '/plan/kalender': '/planlegger/treningsplan',
  '/plan/aarsplan': '/planlegger/aarsplan',
  '/plan/skole': '/planlegger/skoleplan',
  '/plan/turneringer': '/planlegger/turneringer',
  '/plan/turneringer/mine': '/planlegger/turneringer/mine',
  '/plan/turneringsforberedelse': '/planlegger/turneringsforberedelse',
  '/plan/booking': '/planlegger/booking',
  '/plan/sesonger': '/planlegger/aarsplan',
  '/plan/intake': '/mer/intake',

  // Målsetninger
  '/plan/maal': '/maalsetninger/mine',
  '/analyser/mal': '/maalsetninger/mine',

  // Legacy V2 → V4
  '/planlegg': '/planlegger',
  '/planlegg/ukeplan': '/planlegger/treningsplan',
  '/planlegg/kalender': '/planlegger/treningsplan',
  '/planlegg/turneringer/kalender': '/planlegger/turneringer',
  '/planlegg/turneringer/mine': '/planlegger/turneringer/mine',

  // ===================================================================
  // MER REDIRECTS - V2 → V3 (unchanged from v3)
  // ===================================================================
  '/samhandle': '/mer',
  '/samhandle/meldinger': '/mer/meldinger',
  '/samhandle/feedback': '/mer/feedback',
  '/samhandle/kunnskap': '/mer/kunnskap',
  '/profil': '/mer/profil',
  '/profil/oppdater': '/mer/profil/rediger',
  '/innstillinger': '/mer/innstillinger',
  '/innstillinger/varsler': '/mer/varsler',
  '/trenerteam': '/mer/trenerteam',
  '/kalibrering': '/mer/kalibrering',
};

/**
 * ============================================================
 * AREA TABS CONFIGURATION
 * ============================================================
 * Tabs shown at the top of hub pages for quick navigation
 */
export const areaTabsConfig = {
  trening: [
    { href: '/trening', label: 'Oversikt', icon: 'LayoutDashboard' },
    { href: '/trening/logg', label: 'Logg økt', icon: 'Plus' },
    { href: '/trening/dagbok', label: 'Historikk', icon: 'History' },
    { href: '/trening/ovelser', label: 'Øvelser', icon: 'Dumbbell' },
    { href: '/trening/testing', label: 'Testing', icon: 'Target' },
  ],
  analyse: [
    { href: '/analyse', label: 'Oversikt', icon: 'LayoutDashboard' },
    { href: '/analyse/statistikk', label: 'Statistikk', icon: 'BarChart3' },
    { href: '/analyse/tester', label: 'Tester', icon: 'ClipboardList' },
    { href: '/analyse/prestasjoner', label: 'Prestasjoner', icon: 'Award' },
  ],
  maalsetninger: [
    { href: '/maalsetninger', label: 'Oversikt', icon: 'LayoutDashboard' },
    { href: '/maalsetninger/mine', label: 'Mine mål', icon: 'Target' },
    { href: '/maalsetninger/progresjon', label: 'Progresjon', icon: 'TrendingUp' },
  ],
  planlegger: [
    { href: '/planlegger', label: 'Oversikt', icon: 'LayoutDashboard' },
    { href: '/planlegger/aarsplan', label: 'Årsplan', icon: 'Calendar' },
    { href: '/planlegger/treningsplan', label: 'Treningsplan', icon: 'Calendar' },
    { href: '/planlegger/skoleplan', label: 'Skoleplan', icon: 'BookOpen' },
    { href: '/planlegger/turneringer/mine', label: 'Turneringer', icon: 'Trophy' },
  ],
  // Video tabs - consolidated from separate pages
  video: [
    { href: '/trening/video', label: 'Oversikt', icon: 'LayoutDashboard' },
    { href: '/trening/video/bibliotek', label: 'Videoer', icon: 'Video' },
    { href: '/trening/video/sammenligning', label: 'Sammenlign', icon: 'GitCompare' },
    { href: '/trening/video/annotering', label: 'Annot', icon: 'PenTool' },
  ],
};

/**
 * Get tabs for a specific area
 */
export function getAreaTabs(areaId: string) {
  return areaTabsConfig[areaId as keyof typeof areaTabsConfig] || [];
}

export default playerNavigationV4;
