/**
 * ============================================================
 * PLAYER NAVIGATION V3 - TIER Golf Academy
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
          { href: '/dashboard/deling', label: 'Deling', icon: 'ShareIcon', description: 'Delingsinnstillinger' },
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
          { href: '/bevis', label: 'Mine teknisk plan (Bevis)', icon: 'VideoIcon', description: 'Dokumenter fremgang' },
          { href: '/trening/ovelser', label: 'Mine øvelser', icon: 'ClubIcon', description: 'Mine øvelser' },
          { href: '/trening/ovelser', label: 'Øvelsesbank', icon: 'ClubIcon', description: 'Alle øvelser' },
          { href: '/trening/videoer', label: 'Video', icon: 'VideoIcon', description: 'Instruksjonsvideoer' },
          { href: '/trening/video-sammenligning', label: 'Video sammenligning', icon: 'CompareIcon', description: 'Sammenlign videoer side-ved-side' },
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
    icon: 'StatsIcon',
    color: 'blue',
    href: '/utvikling',
    hubPath: '/utvikling',
    sections: [
      {
        id: 'fremgang',
        label: 'Fremgang & Statistikk',
        items: [
          { href: '/utvikling/oversikt', label: 'Min utvikling', icon: 'StatsIcon', description: 'Din progresjon' },
          { href: '/utvikling/statistikk', label: 'Statistikk', icon: 'ScorecardIcon', description: 'Detaljert statistikk' },
          { href: '/utvikling/strokes-gained', label: 'Strokes Gained', icon: 'StatsIcon', description: 'Avansert SG-analyse' },
          { href: '/utvikling/sammenlign-proff', label: 'Sammenlign med proff', icon: 'StatsIcon', description: 'Sammenlign med tour-spillere' },
          { href: '/utvikling/vendepunkter', label: 'Vendepunkter', icon: 'StatsIcon', description: 'Vendepunkter i prestasjonen' },
          { href: '/utvikling/innsikter', label: 'Spillerinnsikter', icon: 'StatsIcon', description: 'SG Journey, Skill DNA og Bounty Board' },
          { href: '/utvikling/treningsomrader', label: 'Treningsområder', icon: 'TargetIcon', description: 'Statistikk per treningsområde' },
          { href: '/utvikling/peer-sammenligning', label: 'Peer sammenligning', icon: 'StatsIcon', description: 'Sammenlign med lignende spillere' },
          { href: '/utvikling/rapporter', label: 'Fremdriftsrapporter', icon: 'StatsIcon', description: 'Rapporter fra trener' },
          { href: '/utvikling/datagolf', label: 'Verktøy', icon: 'TargetIcon', description: 'Avanserte analyseverktøy' },
          { href: '/utvikling/fremgang', label: 'Fremgangsanalyse', icon: 'StatsIcon', description: 'Analyser din fremgang' },
          { href: '/utvikling/historikk', label: 'Historikk', icon: 'RefreshIcon', description: 'Tidligere resultater' },
        ],
      },
      {
        id: 'tester',
        label: 'Tester',
        items: [
          { href: '/utvikling/testresultater', label: 'Testresultater', icon: 'TargetIcon', description: 'Alle testresultater' },
          { href: '/utvikling/krav', label: 'Kategori-krav', icon: 'HandicapIcon', description: 'Krav per kategori' },
        ],
      },
      {
        id: 'achievements',
        label: 'Prestasjoner',
        items: [
          { href: '/utvikling/badges', label: 'Merker', icon: 'HandicapIcon', description: 'Dine merker' },
          { href: '/utvikling/achievements', label: 'Prestasjoner', icon: 'CheckIcon', description: 'Alle prestasjoner' },
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
          { href: '/plan/ukeplan', label: 'Ukeplan', icon: 'CalendarIcon', description: 'Ukentlig oversikt' },
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
          { href: '/mer/profil/rediger', label: 'Rediger profil', icon: 'EditIcon', description: 'Oppdater info' },
          { href: '/mer/trenerteam', label: 'Trenerteam', icon: 'ProfileIcon', description: 'Dine trenere' },
        ],
      },
      {
        id: 'kommunikasjon',
        label: 'Kommunikasjon',
        items: [
          { href: '/mer/meldinger', label: 'Meldinger', icon: 'ChatIcon', description: 'Innboks' },
          { href: '/mer/feedback', label: 'Trenerfeedback', icon: 'ChatIcon', description: 'Tilbakemeldinger' },
        ],
      },
      {
        id: 'ressurser',
        label: 'Ressurser',
        items: [
          { href: '/mer/kunnskap', label: 'Kunnskapsbase', icon: 'LessonsIcon', description: 'Artikler og guider' },
          { href: '/mer/notater', label: 'Notater', icon: 'ScorecardIcon', description: 'Dine notater' },
          { href: '/mer/baner-vaer', label: 'Baner & Vær', icon: 'CloudIcon', description: 'Finn beste baner basert på værforhold' },
          { href: '/mer/ai-historikk', label: 'AI Treningshistorikk', icon: 'ChatIcon', description: 'Se tidligere AI-samtaler' },
          { href: '/mer/samlinger', label: 'Samlinger', icon: 'FolderIcon', description: 'Organiser videoer, øvelser og planer' },
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
    ],
  },
];

/**
 * Hurtighandlinger for dashboard
 */
export const playerQuickActionsV3 = [
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
