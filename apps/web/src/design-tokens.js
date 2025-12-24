/**
 * AK GOLF ACADEMY — DESIGN SYSTEM v3.0
 * Blue Palette 01 (Production Ready)
 *
 * JavaScript Design Tokens
 * Source: AK_GOLF_DESIGN_SYSTEM_COMPLETE.html
 *
 * IMPORTANT: This file mirrors the CSS variables in index.css.
 * Use these tokens for inline styles and JavaScript-based styling.
 * For CSS/Tailwind, prefer CSS variables (var(--token-name)).
 */

export const tokens = {
  colors: {
    // Brand Colors
    ink: '#02060D',
    primary: '#10456A',
    primaryLight: '#2C5F7F',
    snow: '#EDF0F2',
    surface: '#EBE5DA',
    gold: '#C9A227',
    white: '#FFFFFF',

    // Legacy aliases (backwards compatible)
    forest: '#10456A',
    forestLight: '#2C5F7F',
    foam: '#EDF0F2',
    ivory: '#EBE5DA',

    // Gray scale
    gray50: '#F9FAFB',
    gray100: '#F2F4F7',
    gray300: '#D5D7DA',
    gray500: '#8E8E93',
    gray600: '#535862',
    gray700: '#414651',
    gray900: '#1C1C1E',

    // Legacy neutral aliases
    charcoal: '#1C1C1E',
    steel: '#8E8E93',
    mist: '#E5E5EA',
    cloud: '#F2F2F7',

    // Status colors
    success: '#4A7C59',
    warning: '#D4A84B',
    error: '#C45B4E',
  },

  // Semantic tokens
  semantic: {
    background: {
      default: '#EDF0F2',
      surface: '#EBE5DA',
      inverse: '#02060D',
      accent: '#10456A',
      white: '#FFFFFF',
    },
    text: {
      primary: '#02060D',
      secondary: '#8E8E93',
      tertiary: '#535862',
      brand: '#10456A',
      inverse: '#FFFFFF',
      accent: '#C9A227',
    },
    border: {
      default: '#D5D7DA',
      subtle: '#E5E5EA',
      brand: '#10456A',
      accent: '#C9A227',
    },
  },

  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontLogo: "'DM Sans', sans-serif",

    // Type scale (Apple HIG)
    largeTitle: { fontSize: '34px', lineHeight: '41px', fontWeight: 700 },
    title1: { fontSize: '28px', lineHeight: '34px', fontWeight: 700 },
    title2: { fontSize: '22px', lineHeight: '28px', fontWeight: 700 },
    title3: { fontSize: '20px', lineHeight: '25px', fontWeight: 600 },
    headline: { fontSize: '17px', lineHeight: '22px', fontWeight: 600 },
    body: { fontSize: '17px', lineHeight: '22px', fontWeight: 400 },
    subheadline: { fontSize: '15px', lineHeight: '20px', fontWeight: 400 },
    footnote: { fontSize: '13px', lineHeight: '18px', fontWeight: 400 },
    caption1: { fontSize: '12px', lineHeight: '16px', fontWeight: 400 },
    caption2: { fontSize: '11px', lineHeight: '13px', fontWeight: 400 },

    // Legacy aliases
    display: { fontSize: '32px', lineHeight: '40px', fontWeight: 700 },
    label: { fontSize: '14px', lineHeight: '20px', fontWeight: 500 },
    callout: { fontSize: '15px', lineHeight: '22px', fontWeight: 400 },
  },

  spacing: {
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
    20: '80px',

    // Legacy aliases
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    full: '999px',
  },

  // Legacy alias
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    full: '9999px',
  },

  shadows: {
    card: '0 2px 4px rgba(0, 0, 0, 0.06)',
    elevated: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },

  icons: {
    size: '24px',
    stroke: '1.5px',
  },
};

/**
 * Typography helper function
 * Returns style object for a given typography key
 *
 * @param {string} key - Typography style key (e.g., 'body', 'title1', 'headline')
 * @returns {Object} Style object with fontFamily, fontSize, lineHeight, fontWeight
 */
export function typographyStyle(key) {
  const t = tokens.typography[key];
  if (!t) return {};
  return {
    fontFamily: tokens.typography.fontFamily,
    fontSize: t.fontSize,
    lineHeight: t.lineHeight,
    fontWeight: t.fontWeight,
  };
}

/**
 * Get CSS variable reference
 * Useful for building dynamic styles that reference CSS variables
 *
 * @param {string} varName - CSS variable name without '--' prefix
 * @returns {string} CSS var() reference
 */
export function cssVar(varName) {
  return `var(--${varName})`;
}

export default tokens;
