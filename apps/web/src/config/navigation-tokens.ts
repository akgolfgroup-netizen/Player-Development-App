/**
 * ============================================================
 * NAVIGATION DESIGN TOKENS - AK Golf Academy
 * ============================================================
 *
 * Fargepalett og design tokens for fargekodet navigasjon.
 * Brukes sammen med player-navigation-v3.ts
 *
 * ============================================================
 */

/**
 * Farger for hvert hovedområde
 */
export const navigationColors = {
  // Dashboard - Brand green (default)
  dashboard: {
    primary: '#1B4D3E',
    light: '#2A6B55',
    dark: '#133629',
    surface: '#F5F7F9',
    surfaceHover: '#EEF1F4',
    text: '#111827',
    textMuted: '#6B7280',
    border: '#E5E7EB',
    accent: '#B8860B', // Gold accent
  },

  // Trening - Green (aktivitet, logging)
  trening: {
    primary: '#059669',
    light: '#10B981',
    dark: '#047857',
    surface: '#ECFDF5',
    surfaceHover: '#D1FAE5',
    text: '#064E3B',
    textMuted: '#047857',
    border: '#A7F3D0',
    accent: '#34D399',
  },

  // Utvikling - Blue (fremgang, statistikk)
  utvikling: {
    primary: '#0284C7',
    light: '#0EA5E9',
    dark: '#0369A1',
    surface: '#F0F9FF',
    surfaceHover: '#E0F2FE',
    text: '#0C4A6E',
    textMuted: '#0369A1',
    border: '#BAE6FD',
    accent: '#38BDF8',
  },

  // Plan - Amber (kalender, mål)
  plan: {
    primary: '#D97706',
    light: '#F59E0B',
    dark: '#B45309',
    surface: '#FFFBEB',
    surfaceHover: '#FEF3C7',
    text: '#78350F',
    textMuted: '#92400E',
    border: '#FCD34D',
    accent: '#FBBF24',
  },

  // Mer - Purple (profil, innstillinger)
  mer: {
    primary: '#7C3AED',
    light: '#8B5CF6',
    dark: '#6D28D9',
    surface: '#F5F3FF',
    surfaceHover: '#EDE9FE',
    text: '#4C1D95',
    textMuted: '#5B21B6',
    border: '#C4B5FD',
    accent: '#A78BFA',
  },
} as const;

export type NavigationColorKey = keyof typeof navigationColors;

/**
 * CSS Custom Properties for navigasjonsfarger
 * Generer disse i runtime eller som CSS variabler
 */
export function getNavigationCSSVars(area: NavigationColorKey): Record<string, string> {
  const colors = navigationColors[area];
  return {
    '--nav-primary': colors.primary,
    '--nav-light': colors.light,
    '--nav-dark': colors.dark,
    '--nav-surface': colors.surface,
    '--nav-surface-hover': colors.surfaceHover,
    '--nav-text': colors.text,
    '--nav-text-muted': colors.textMuted,
    '--nav-border': colors.border,
    '--nav-accent': colors.accent,
  };
}

/**
 * Navigasjonsikoner mapping
 */
export const navigationIcons = {
  dashboard: 'Home',
  trening: 'Dumbbell',
  utvikling: 'TrendingUp',
  plan: 'Calendar',
  mer: 'MoreHorizontal',
} as const;

/**
 * Sidebar konfigurasjon
 */
export const sidebarConfig = {
  width: {
    collapsed: 72,
    expanded: 280,
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
  },
  animation: {
    duration: 200,
    easing: 'ease-in-out',
  },
};

/**
 * Bottom navigation konfigurasjon
 */
export const bottomNavConfig = {
  height: 64,
  iconSize: 24,
  labelSize: 12,
  activeScale: 1.1,
};

/**
 * Hub page layout konfigurasjon
 */
export const hubPageConfig = {
  maxWidth: 1200,
  padding: {
    mobile: 16,
    desktop: 32,
  },
  grid: {
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
    gap: 16,
  },
  section: {
    headerHeight: 48,
    itemHeight: 64,
    borderRadius: 12,
  },
};

/**
 * Quick actions konfigurasjon
 */
export const quickActionsConfig = {
  buttonHeight: 44,
  borderRadius: 10,
  iconSize: 18,
};

/**
 * Badge konfigurasjon
 */
export const badgeConfig = {
  minWidth: 20,
  height: 20,
  borderRadius: 10,
  fontSize: 11,
  maxCount: 99,
};

export default navigationColors;
