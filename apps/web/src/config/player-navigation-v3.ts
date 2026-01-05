/**
 * ============================================================
 * PLAYER NAVIGATION V3 - AK Golf Academy
 * ============================================================
 *
 * Ny 5-modus navigasjonsstruktur med fargekodet områder:
 *
 * HOVEDOMRÅDER:
 * 1. Dashboard (Hjem) - Oversikt og sammendrag
 * 2. Trening (Grønn)  - Logging, økter, øvelser, testing
 * 3. Min utvikling (Blå) - Fremgang, tester, badges
 * 4. Plan (Gul/Amber) - Kalender, mål, turneringer
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
    primary: '#1B4D3E', // Forest green (brand)
    light: '#2A6B55',
    dark: '#133629',
    surface: '#F5F7F9',
    text: '#111827',
  },
  green: {
    primary: '#059669', // Emerald
    light: '#10B981',
    dark: '#047857',
    surface: '#ECFDF5',
    text: '#064E3B',
  },
  blue: {
    primary: '#0284C7', // Sky blue
    light: '#0EA5E9',
    dark: '#0369A1',
    surface: '#F0F9FF',
    text: '#0C4A6E',
  },
  amber: {
    primary: '#D97706', // Amber
    light: '#F59E0B',
    dark: '#B45309',
    surface: '#FFFBEB',
    text: '#78350F',
  },
  purple: {
    primary: '#7C3AED', // Violet
    light: '#8B5CF6',
    dark: '#6D28D9',
    surface: '#F5F3FF',
    text: '#4C1D95',
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
    icon: 'Home',
    color: 'default',
    href: '/dashboard',
    hubPath: '/dashboard',
    sections: [
      {
        id: 'overview',
        label: 'Oversikt',
        items: [
          { href: '/dashboard', label: 'Hjem', icon: 'Home', description: 'Din personlige oversikt' },
          { href: '/dashboard/aktivitet', label: 'Aktivitet', icon: 'Activity', description: 'Siste aktiviteter' },
          { href: '/dashboard/varsler', label: 'Varsler', icon: 'Bell', description: 'Viktige meldinger' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 2. TRENING - Logging, økter, øvelser, testing (GRØNN)
  // ────────────────────────────────────────────────────────────
  {
    id: 'trening',
    label: 'Trening',
    icon: 'Dumbbell',
    color: 'green',
    href: '/trening',
    hubPath: '/trening',
    sections: [
      {
        id: 'logging',
        label: 'Logging',
        items: [
          { href: '/trening/logg', label: 'Logg trening', icon: 'Plus', description: 'Registrer treningsøkt' },
          { href: '/trening/dagbok', label: 'Dagbok', icon: 'Book', description: 'Se treningshistorikk' },
        ],
      },
      {
        id: 'okter',
        label: 'Økter',
        items: [
          { href: '/trening/okter', label: 'Mine økter', icon: 'ClipboardList', description: 'Planlagte økter' },
          { href: '/trening/plan', label: 'Treningsplan', icon: 'Calendar', description: 'Ukentlig plan' },
        ],
      },
      {
        id: 'ovelser',
        label: 'Øvelser',
        items: [
          { href: '/trening/ovelser', label: 'Øvelsesbank', icon: 'Library', description: 'Alle øvelser' },
          { href: '/trening/videoer', label: 'Videoer', icon: 'Video', description: 'Instruksjonsvideoer' },
        ],
      },
      {
        id: 'testing',
        label: 'Testing',
        items: [
          { href: '/trening/testing', label: 'Testprotokoll', icon: 'Target', description: 'Oversikt tester' },
          { href: '/trening/testing/registrer', label: 'Registrer test', icon: 'PlusCircle', description: 'Ny testresultat' },
        ],
      },
      {
        id: 'kunnskap',
        label: 'Kunnskap',
        items: [
          { href: '/trening/kategorisystem', label: 'Kategorisystem', icon: 'BookOpen', description: 'Forstå treningssystemet' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 3. MIN UTVIKLING - Fremgang, tester, badges (BLÅ)
  // ────────────────────────────────────────────────────────────
  {
    id: 'utvikling',
    label: 'Min utvikling',
    icon: 'TrendingUp',
    color: 'blue',
    href: '/utvikling',
    hubPath: '/utvikling',
    sections: [
      {
        id: 'fremgang',
        label: 'Fremgang',
        items: [
          { href: '/utvikling/oversikt', label: 'Min utvikling', icon: 'TrendingUp', description: 'Din progresjon' },
          { href: '/utvikling/statistikk', label: 'Statistikk', icon: 'BarChart3', description: 'Detaljert statistikk' },
          { href: '/utvikling/historikk', label: 'Historikk', icon: 'History', description: 'Tidligere resultater' },
        ],
      },
      {
        id: 'tester',
        label: 'Tester',
        items: [
          { href: '/utvikling/testresultater', label: 'Testresultater', icon: 'ClipboardCheck', description: 'Alle testresultater' },
          { href: '/utvikling/krav', label: 'Kategori-krav', icon: 'Award', description: 'Krav per kategori' },
        ],
      },
      {
        id: 'achievements',
        label: 'Prestasjoner',
        items: [
          { href: '/utvikling/badges', label: 'Merker', icon: 'Award', description: 'Dine merker' },
          { href: '/utvikling/achievements', label: 'Prestasjoner', icon: 'Trophy', description: 'Alle prestasjoner' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 4. PLAN - Kalender, mål, turneringer (AMBER)
  // ────────────────────────────────────────────────────────────
  {
    id: 'plan',
    label: 'Plan',
    icon: 'Calendar',
    color: 'amber',
    href: '/plan',
    hubPath: '/plan',
    sections: [
      {
        id: 'kalender',
        label: 'Kalender',
        items: [
          { href: '/plan/kalender', label: 'Kalender', icon: 'Calendar', description: 'Din kalender' },
          { href: '/plan/ukeplan', label: 'Ukeplan', icon: 'CalendarDays', description: 'Ukentlig oversikt' },
          { href: '/plan/booking', label: 'Booking', icon: 'Clock', description: 'Book treningstid' },
        ],
      },
      {
        id: 'mal',
        label: 'Mål',
        items: [
          { href: '/plan/maal', label: 'Målsetninger', icon: 'Target', description: 'Dine mål' },
          { href: '/plan/aarsplan', label: 'Årsplan', icon: 'FileText', description: 'Langsiktig plan' },
        ],
      },
      {
        id: 'turneringer',
        label: 'Turneringer',
        items: [
          { href: '/plan/turneringer', label: 'Turneringskalender', icon: 'Trophy', description: 'Alle turneringer' },
          { href: '/plan/turneringer/mine', label: 'Mine turneringer', icon: 'Flag', description: 'Påmeldte turneringer' },
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
    icon: 'MoreHorizontal',
    color: 'purple',
    href: '/mer',
    hubPath: '/mer',
    badge: 'unreadMessages',
    sections: [
      {
        id: 'profil',
        label: 'Profil',
        items: [
          { href: '/mer/profil', label: 'Min profil', icon: 'User', description: 'Din profil' },
          { href: '/mer/profil/rediger', label: 'Rediger profil', icon: 'Edit', description: 'Oppdater info' },
          { href: '/mer/trenerteam', label: 'Trenerteam', icon: 'Users', description: 'Dine trenere' },
        ],
      },
      {
        id: 'kommunikasjon',
        label: 'Kommunikasjon',
        items: [
          { href: '/mer/meldinger', label: 'Meldinger', icon: 'Mail', description: 'Innboks' },
          { href: '/mer/feedback', label: 'Trenerfeedback', icon: 'MessageSquare', description: 'Tilbakemeldinger' },
        ],
      },
      {
        id: 'ressurser',
        label: 'Ressurser',
        items: [
          { href: '/mer/kunnskap', label: 'Kunnskapsbase', icon: 'BookOpen', description: 'Artikler og guider' },
          { href: '/mer/notater', label: 'Notater', icon: 'FileText', description: 'Dine notater' },
        ],
      },
      {
        id: 'innstillinger',
        label: 'Innstillinger',
        items: [
          { href: '/mer/innstillinger', label: 'Innstillinger', icon: 'Settings', description: 'App-innstillinger' },
          { href: '/mer/varsler', label: 'Varsler', icon: 'Bell', description: 'Varselinnstillinger' },
          { href: '/mer/kalibrering', label: 'Kalibrering', icon: 'Sliders', description: 'Testkalibrering' },
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
    label: 'Logg trening',
    icon: 'Plus',
    href: '/trening/logg',
    variant: 'primary' as const,
  },
  {
    label: 'Registrer test',
    icon: 'Target',
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

export default playerNavigationV3;
