// ProSwing Golf App - Design Tokens
// For Create React App + Capacitor

export const theme = {
  colors: {
    // Primary - Forest Green
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#40916c',
      600: '#2d6a4f',
      700: '#1b4332',
      800: '#14532d',
      900: '#0f3d22',
    },

    // Gold - Premium accents
    gold: {
      300: '#e8d5a3',
      400: '#d4af37',
      500: '#c9a227',
      600: '#b8860b',
    },

    // Surface - Dark mode
    surface: {
      black: '#0a0a0a',
      dark: '#141414',
      card: '#1e1e1e',
      elevated: '#2a2a2a',
      border: '#3a3a3a',
    },

    // Text
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      muted: '#737373',
    },

    // Semantic
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#ef4444',
    info: '#3b82f6',
  },

  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },

  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    full: '9999px',
  },

  fontSize: {
    displayLg: '48px',
    displayMd: '36px',
    headline: '28px',
    titleLg: '22px',
    titleMd: '18px',
    bodyLg: '16px',
    bodyMd: '14px',
    label: '12px',
    caption: '11px',
  },

  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  shadows: {
    card: '0 4px 24px rgba(0, 0, 0, 0.4)',
    elevated: '0 8px 32px rgba(0, 0, 0, 0.5)',
    goldGlow: '0 0 20px rgba(212, 175, 55, 0.3)',
    greenGlow: '0 0 20px rgba(45, 106, 79, 0.3)',
  },

  transitions: {
    fast: '100ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
  },
} as const;

export type Theme = typeof theme;
