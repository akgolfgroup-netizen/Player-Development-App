/**
 * AK GOLF ACADEMY — DESIGN SYSTEM v3.0
 * Premium Light (Forest Green)
 *
 * JavaScript Design Tokens
 * Source: AK_GOLF_PREMIUM_LIGHT_SPEC.html
 *
 * IMPORTANT: This file mirrors the CSS variables in index.css.
 * Use these tokens for inline styles and JavaScript-based styling.
 * For CSS/Tailwind, prefer CSS variables (var(--token-name)).
 */

export const tokens = {
  colors: {
    // Brand Colors - Deep Forest Green (Premium Golf Brand)
    ink: '#111827',
    primary: '#1B4D3E',
    primaryLight: '#2A6B55',
    primaryDark: '#133629',
    snow: '#FAFBFC',
    surface: '#F5F7F9',
    gold: '#B8860B',
    goldLight: '#DAA520',
    white: '#FFFFFF',

    // Legacy aliases (backwards compatible)
    forest: '#1B4D3E',
    forestLight: '#2A6B55',
    foam: '#FAFBFC',
    ivory: '#F5F7F9',

    // Gray scale (Per Premium Light Spec)
    gray50: '#FAFBFC',
    gray100: '#F5F7F9',
    gray200: '#EEF1F4',
    gray300: '#E5E7EB',
    gray400: '#D1D5DB',
    gray500: '#9CA3AF',
    gray600: '#6B7280',
    gray700: '#374151',
    gray900: '#111827',

    // Legacy neutral aliases
    charcoal: '#111827',
    steel: '#6B7280',
    mist: '#E5E7EB',
    cloud: '#F5F7F9',

    // Status colors (Per Premium Light Spec)
    success: '#059669',
    successLight: '#10B981',
    warning: '#D97706',
    warningLight: '#F59E0B',
    error: '#DC2626',
    errorLight: '#EF4444',
    info: '#0284C7',
    infoLight: '#0EA5E9',
  },

  // Semantic tokens
  semantic: {
    background: {
      default: '#FAFBFC',
      surface: '#F5F7F9',
      elevated: '#EEF1F4',
      inverse: '#111827',
      accent: '#1B4D3E',
      white: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#374151',
      tertiary: '#6B7280',
      muted: '#9CA3AF',
      brand: '#1B4D3E',
      inverse: '#FFFFFF',
      accent: '#1B4D3E',
      achievement: '#B8860B',
    },
    border: {
      default: '#E5E7EB',
      strong: '#D1D5DB',
      subtle: '#EEF1F4',
      brand: '#1B4D3E',
      accent: '#1B4D3E',
      achievement: '#B8860B',
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
