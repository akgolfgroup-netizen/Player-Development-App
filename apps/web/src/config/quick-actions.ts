/**
 * ============================================================
 * Quick Actions Configuration
 * TIER Golf Design System v3.1
 * ============================================================
 *
 * Definerer hurtighandlinger for ulike brukerroller.
 * Brukes av QuickActions komponenten på dashboards.
 *
 * ============================================================
 */

import {
  Plus,
  Target,
  Calendar,
  MessageSquare,
  Users,
  BarChart3,
  ClipboardList,
  Dumbbell,
  TrendingUp,
  FileText,
  Clock,
  Award,
} from 'lucide-react';
import type { QuickAction } from '../components/dashboard/QuickActions';

/**
 * Hurtighandlinger for spiller-dashboard
 */
export const playerQuickActions: QuickAction[] = [
  {
    label: 'Logg trening',
    href: '/trening/logg',
    icon: Plus,
    variant: 'primary',
    description: 'Registrer ny treningsøkt',
  },
  {
    label: 'Registrer test',
    href: '/trening/testing/registrer',
    icon: Target,
    variant: 'secondary',
    description: 'Ny testresultat',
  },
  {
    label: 'Se ukeplan',
    href: '/plan/ukeplan',
    icon: Calendar,
    variant: 'secondary',
    description: 'Din ukentlige plan',
  },
];

/**
 * Utvidede hurtighandlinger for spiller (flere valg)
 */
export const playerQuickActionsExtended: QuickAction[] = [
  ...playerQuickActions,
  {
    label: 'Statistikk',
    href: '/utvikling/statistikk',
    icon: TrendingUp,
    variant: 'secondary',
    description: 'Se din fremgang',
  },
];

/**
 * Hurtighandlinger for coach-dashboard
 */
export const coachQuickActions: QuickAction[] = [
  {
    label: 'Ny økt',
    href: '/coach/sessions/create',
    icon: Plus,
    variant: 'primary',
    description: 'Opprett treningsøkt',
  },
  {
    label: 'Se spillere',
    href: '/coach/athletes',
    icon: Users,
    variant: 'secondary',
    description: 'Spilleroversikt',
  },
  {
    label: 'Ukesrapport',
    href: '/coach/reports/weekly',
    icon: BarChart3,
    variant: 'secondary',
    description: 'Denne ukens statistikk',
  },
];

/**
 * Utvidede hurtighandlinger for coach (flere valg)
 */
export const coachQuickActionsExtended: QuickAction[] = [
  ...coachQuickActions,
  {
    label: 'Meldinger',
    href: '/coach/messages',
    icon: MessageSquare,
    variant: 'secondary',
    description: 'Kommunikasjon',
  },
];

/**
 * Hurtighandlinger for Trening-hub
 */
export const treningQuickActions: QuickAction[] = [
  {
    label: 'Logg økt',
    href: '/trening/logg',
    icon: Plus,
    variant: 'primary',
  },
  {
    label: 'Registrer test',
    href: '/trening/testing/registrer',
    icon: Target,
    variant: 'secondary',
  },
  {
    label: 'Se øvelser',
    href: '/trening/ovelser',
    icon: Dumbbell,
    variant: 'secondary',
  },
];

/**
 * Hurtighandlinger for Utvikling-hub
 */
export const utviklingQuickActions: QuickAction[] = [
  {
    label: 'Se statistikk',
    href: '/utvikling/statistikk',
    icon: BarChart3,
    variant: 'primary',
  },
  {
    label: 'Testresultater',
    href: '/utvikling/testresultater',
    icon: ClipboardList,
    variant: 'secondary',
  },
  {
    label: 'Mine merker',
    href: '/utvikling/badges',
    icon: Award,
    variant: 'secondary',
  },
];

/**
 * Hurtighandlinger for Plan-hub
 */
export const planQuickActions: QuickAction[] = [
  {
    label: 'Åpne kalender',
    href: '/plan/kalender',
    icon: Calendar,
    variant: 'primary',
  },
  {
    label: 'Se mål',
    href: '/plan/maal',
    icon: Target,
    variant: 'secondary',
  },
  {
    label: 'Turneringer',
    href: '/plan/turneringer',
    icon: Clock,
    variant: 'secondary',
  },
];

/**
 * Hurtighandlinger for Mer-hub
 */
export const merQuickActions: QuickAction[] = [
  {
    label: 'Meldinger',
    href: '/mer/meldinger',
    icon: MessageSquare,
    variant: 'primary',
  },
  {
    label: 'Min profil',
    href: '/mer/profil',
    icon: Users,
    variant: 'secondary',
  },
  {
    label: 'Innstillinger',
    href: '/mer/innstillinger',
    icon: FileText,
    variant: 'secondary',
  },
];

/**
 * Mapper område-id til hurtighandlinger
 */
export const quickActionsByArea: Record<string, QuickAction[]> = {
  dashboard: playerQuickActions,
  trening: treningQuickActions,
  utvikling: utviklingQuickActions,
  plan: planQuickActions,
  mer: merQuickActions,
};

/**
 * Hent hurtighandlinger for et område
 */
export function getQuickActionsForArea(areaId: string): QuickAction[] {
  return quickActionsByArea[areaId] || [];
}

export default {
  player: playerQuickActions,
  playerExtended: playerQuickActionsExtended,
  coach: coachQuickActions,
  coachExtended: coachQuickActionsExtended,
  byArea: quickActionsByArea,
};
