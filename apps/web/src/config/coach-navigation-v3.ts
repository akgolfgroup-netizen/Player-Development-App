/**
 * ============================================================
 * COACH NAVIGATION V3 - TIER Golf Academy
 * ============================================================
 *
 * Ny 5-modus navigasjonsstruktur med fargekodet områder:
 *
 * HOVEDOMRÅDER:
 * 1. Hjem (Navy) - Dashboard, varsler, aktivitet
 * 2. Spillere (Grønn) - Utøvere, treningsplaner, evalueringer
 * 3. Analyse (Blå) - Statistikk, øvelser, maler
 * 4. Plan (Gul/Amber) - Kalender, booking, turneringer
 * 5. Mer (Lilla) - Meldinger, grupper, innstillinger
 *
 * ============================================================
 */

// Area color type (same as player navigation)
export type AreaColor = 'default' | 'green' | 'blue' | 'amber' | 'purple';

// Import shared colors from player navigation
import { areaColors as playerAreaColors } from './player-navigation-v3';
export const areaColors = playerAreaColors;

export interface CoachNavSubItem {
  href: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface CoachNavSection {
  id: string;
  label: string;
  items: CoachNavSubItem[];
}

export interface CoachNavArea {
  id: string;
  label: string;
  icon: string;
  color: AreaColor;
  href: string;
  hubPath: string;
  sections?: CoachNavSection[];
  badge?: string;
}

/**
 * Hovednavigasjon for trenerportalen (5 områder)
 */
export const coachNavigationV3: CoachNavArea[] = [
  // ────────────────────────────────────────────────────────────
  // 1. HJEM - Dashboard, varsler, aktivitet (NAVY)
  // ────────────────────────────────────────────────────────────
  {
    id: 'hjem',
    label: 'Hjem',
    icon: 'Home',
    color: 'default',
    href: '/coach',
    hubPath: '/coach',
    sections: [
      {
        id: 'oversikt',
        label: 'Oversikt',
        items: [
          { href: '/coach', label: 'Dashboard', icon: 'LayoutDashboard', description: 'Hovedoversikt' },
          { href: '/coach/alerts', label: 'Varsler', icon: 'Bell', description: 'Viktige varsler' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 2. SPILLERE - Utøvere, treningsplaner, evalueringer (GRØNN)
  // ────────────────────────────────────────────────────────────
  {
    id: 'spillere',
    label: 'Spillere',
    icon: 'Users',
    color: 'green',
    href: '/coach/spillere',
    hubPath: '/coach/spillere',
    sections: [
      {
        id: 'utovere',
        label: 'Utøvere',
        items: [
          { href: '/coach/athletes', label: 'Alle spillere', icon: 'Users', description: 'Spilleroversikt' },
          { href: '/coach/athlete-status', label: 'Spillerstatus', icon: 'Activity', description: 'Helse og status' },
        ],
      },
      {
        id: 'planer',
        label: 'Treningsplaner',
        items: [
          { href: '/coach/planning', label: 'Planlegging', icon: 'ClipboardList', description: 'Treningsplanlegger' },
          { href: '/coach/planning/annual-plan', label: 'Årsplan', icon: 'Calendar', description: 'Årsplanlegging' },
        ],
      },
      {
        id: 'evaluering',
        label: 'Evaluering',
        items: [
          { href: '/coach/session-evaluations', label: 'Evalueringer', icon: 'CheckCircle', description: 'Øktevalueringer' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 3. ANALYSE - Statistikk, øvelser, maler (BLÅ)
  // ────────────────────────────────────────────────────────────
  {
    id: 'analyse',
    label: 'Analyse',
    icon: 'BarChart3',
    color: 'blue',
    href: '/coach/analyse',
    hubPath: '/coach/analyse',
    sections: [
      {
        id: 'statistikk',
        label: 'Statistikk',
        items: [
          { href: '/coach/stats', label: 'Oversikt', icon: 'LayoutDashboard', description: 'Statistikkoversikt' },
          { href: '/coach/stats/progress', label: 'Fremgang', icon: 'TrendingUp', description: 'Spillerfremgang' },
          { href: '/coach/stats/regression', label: 'Tilbakegang', icon: 'TrendingDown', description: 'Regresjonsanalyse' },
          { href: '/coach/stats/datagolf', label: 'DataGolf', icon: 'Database', description: 'Avansert analyse' },
        ],
      },
      {
        id: 'bibliotek',
        label: 'Bibliotek',
        items: [
          { href: '/coach/exercises', label: 'Øvelser', icon: 'Dumbbell', description: 'Øvelsesbibliotek' },
          { href: '/coach/exercises/mine', label: 'Mine øvelser', icon: 'User', description: 'Egne øvelser' },
          { href: '/coach/exercises/templates', label: 'Maler', icon: 'FileText', description: 'Øktmaler' },
          { href: '/coach/training-system', label: 'Treningssystem', icon: 'Settings', description: 'Kategorisystem' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 4. PLAN - Kalender, booking, turneringer (AMBER)
  // ────────────────────────────────────────────────────────────
  {
    id: 'plan',
    label: 'Plan',
    icon: 'Calendar',
    color: 'amber',
    href: '/coach/plan',
    hubPath: '/coach/plan',
    sections: [
      {
        id: 'kalender',
        label: 'Kalender',
        items: [
          { href: '/coach/booking', label: 'Kalender', icon: 'Calendar', description: 'Bookingkalender' },
          { href: '/coach/booking/requests', label: 'Forespørsler', icon: 'MessageSquare', description: 'Bookingforespørsler' },
          { href: '/coach/booking/settings', label: 'Tilgjengelighet', icon: 'Clock', description: 'Tilgjengelighetsinnstillinger' },
        ],
      },
      {
        id: 'turneringer',
        label: 'Turneringer',
        items: [
          { href: '/coach/tournaments', label: 'Turneringskalender', icon: 'Trophy', description: 'Alle turneringer' },
          { href: '/coach/tournaments/players', label: 'Deltakere', icon: 'Users', description: 'Påmeldte spillere' },
          { href: '/coach/tournaments/results', label: 'Resultater', icon: 'Award', description: 'Turneringsresultater' },
        ],
      },
      {
        id: 'samlinger',
        label: 'Samlinger',
        items: [
          { href: '/coach/samlinger', label: 'Samlinger', icon: 'Tent', description: 'Treningssamlinger' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // 5. MER - Meldinger, grupper, innstillinger (LILLA)
  // ────────────────────────────────────────────────────────────
  {
    id: 'mer',
    label: 'Mer',
    icon: 'MoreHorizontal',
    color: 'purple',
    href: '/coach/mer',
    hubPath: '/coach/mer',
    badge: 'unreadMessages',
    sections: [
      {
        id: 'kommunikasjon',
        label: 'Kommunikasjon',
        items: [
          { href: '/coach/messages', label: 'Meldinger', icon: 'MessageSquare', description: 'Sendte meldinger' },
          { href: '/coach/messages/compose', label: 'Ny melding', icon: 'PenSquare', description: 'Skriv melding' },
          { href: '/coach/messages/scheduled', label: 'Planlagte', icon: 'Clock', description: 'Planlagte meldinger' },
        ],
      },
      {
        id: 'grupper',
        label: 'Grupper',
        items: [
          { href: '/coach/groups', label: 'Grupper', icon: 'Users', description: 'Spillergrupper' },
        ],
      },
      {
        id: 'innstillinger',
        label: 'Innstillinger',
        items: [
          { href: '/coach/settings', label: 'Innstillinger', icon: 'Settings', description: 'Kontoinnstillinger' },
          { href: '/coach/modification-requests', label: 'Endringsforespørsler', icon: 'GitPullRequest', description: 'Håndter forespørsler' },
        ],
      },
    ],
  },
];

/**
 * Hurtighandlinger for coach dashboard
 */
export const coachQuickActionsV3 = [
  {
    label: 'Ny økt',
    icon: 'Plus',
    href: '/coach/planning',
    variant: 'primary' as const,
  },
  {
    label: 'Ny melding',
    icon: 'MessageSquare',
    href: '/coach/messages/compose',
    variant: 'secondary' as const,
  },
];

// ============================================================
// FLAT NAVIGATION - Forenklet 5-modus struktur
// ============================================================

export interface CoachFlatNavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  color: AreaColor;
  badge?: string;
}

/**
 * Forenklet navigasjon med kun 5 hovedelementer (ingen nesting)
 */
export const coachNavigationFlat: CoachFlatNavItem[] = [
  {
    id: 'hjem',
    label: 'Hjem',
    icon: 'Home',
    href: '/coach',
    color: 'default',
  },
  {
    id: 'spillere',
    label: 'Spillere',
    icon: 'Users',
    href: '/coach/spillere',
    color: 'green',
  },
  {
    id: 'analyse',
    label: 'Analyse',
    icon: 'BarChart3',
    href: '/coach/analyse',
    color: 'blue',
  },
  {
    id: 'plan',
    label: 'Plan',
    icon: 'Calendar',
    href: '/coach/plan',
    color: 'amber',
  },
  {
    id: 'mer',
    label: 'Mer',
    icon: 'MoreHorizontal',
    href: '/coach/mer',
    color: 'purple',
    badge: 'unreadMessages',
  },
];

/**
 * Horisontale tabs for hvert område (vises på hub-sider)
 */
export const coachAreaTabsConfig = {
  spillere: [
    { href: '/coach/spillere', label: 'Oversikt', icon: 'LayoutDashboard' },
    { href: '/coach/athletes', label: 'Utøvere', icon: 'Users' },
    { href: '/coach/planning', label: 'Planlegging', icon: 'ClipboardList' },
    { href: '/coach/session-evaluations', label: 'Evalueringer', icon: 'CheckCircle' },
    { href: '/coach/athlete-status', label: 'Status', icon: 'Activity' },
  ],
  analyse: [
    { href: '/coach/analyse', label: 'Oversikt', icon: 'LayoutDashboard' },
    { href: '/coach/stats', label: 'Statistikk', icon: 'BarChart3' },
    { href: '/coach/exercises', label: 'Øvelser', icon: 'Dumbbell' },
    { href: '/coach/training-system', label: 'System', icon: 'Settings' },
  ],
  plan: [
    { href: '/coach/plan', label: 'Oversikt', icon: 'LayoutDashboard' },
    { href: '/coach/booking', label: 'Kalender', icon: 'Calendar' },
    { href: '/coach/tournaments', label: 'Turneringer', icon: 'Trophy' },
    { href: '/coach/samlinger', label: 'Samlinger', icon: 'Tent' },
  ],
  mer: [
    { href: '/coach/mer', label: 'Oversikt', icon: 'LayoutDashboard' },
    { href: '/coach/messages', label: 'Meldinger', icon: 'MessageSquare' },
    { href: '/coach/groups', label: 'Grupper', icon: 'Users' },
    { href: '/coach/settings', label: 'Innstillinger', icon: 'Settings' },
  ],
};

/**
 * Hent tabs for et område
 */
export function getCoachTabsForArea(areaId: string): Array<{ href: string; label: string; icon: string }> {
  return coachAreaTabsConfig[areaId as keyof typeof coachAreaTabsConfig] || [];
}

/**
 * Finn område basert på path
 */
export function getCoachAreaByPath(path: string): CoachNavArea | undefined {
  return coachNavigationV3.find(area => {
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
export function getCoachAreaById(id: string): CoachNavArea | undefined {
  return coachNavigationV3.find(area => area.id === id);
}

/**
 * Finn flat område basert på path
 */
export function getCoachFlatAreaByPath(path: string): CoachFlatNavItem | undefined {
  // Spesialhåndtering for /coach root
  if (path === '/coach') {
    return coachNavigationFlat.find(item => item.id === 'hjem');
  }

  // Sjekk /coach/athletes -> spillere
  if (path.startsWith('/coach/athletes') || path.startsWith('/coach/planning') ||
      path.startsWith('/coach/athlete-status') || path.startsWith('/coach/session-evaluations')) {
    return coachNavigationFlat.find(item => item.id === 'spillere');
  }

  // Sjekk /coach/stats eller /coach/exercises -> analyse
  if (path.startsWith('/coach/stats') || path.startsWith('/coach/exercises') ||
      path.startsWith('/coach/training-system')) {
    return coachNavigationFlat.find(item => item.id === 'analyse');
  }

  // Sjekk /coach/booking eller /coach/tournaments eller /coach/samlinger -> plan
  if (path.startsWith('/coach/booking') || path.startsWith('/coach/tournaments') ||
      path.startsWith('/coach/samlinger')) {
    return coachNavigationFlat.find(item => item.id === 'plan');
  }

  // Sjekk /coach/messages eller /coach/groups eller /coach/settings -> mer
  if (path.startsWith('/coach/messages') || path.startsWith('/coach/groups') ||
      path.startsWith('/coach/settings') || path.startsWith('/coach/modification-requests')) {
    return coachNavigationFlat.find(item => item.id === 'mer');
  }

  // Standard matching
  return coachNavigationFlat.find(item => {
    if (path === item.href) return true;
    if (item.href !== '/coach' && path.startsWith(item.href)) return true;
    return false;
  });
}

/**
 * Route redirects for backward compatibility
 */
export const coachRouteRedirects: Record<string, string> = {
  '/coach/alerts': '/coach',
};

export default coachNavigationV3;
