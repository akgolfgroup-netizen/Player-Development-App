/**
 * AK Golf Academy - Design Tokens v3.0
 * Based on: Blue Palette 01 (Production Ready)
 * Source: Design/ak_golf_figma_kit_blue_palette01.svg
 * Font: Inter (Open Source, Cross-Platform)
 * Typography Scale: Apple Human Interface Guidelines
 *
 * Usage:
 * import { tokens } from './design-tokens';
 *
 * <div style={{ backgroundColor: tokens.colors.primary, color: 'white' }}>
 *   Content
 * </div>
 */

export const tokens = {
  // ==================== COLORS ====================
  colors: {
    // Brand Colors - Blue Palette 01
    ink: '#02060D',
    primary: '#10456A',
    primaryLight: '#2C5F7F',
    snow: '#EDF0F2',
    surface: '#EBE5DA',
    gold: '#C9A227',

    // Legacy aliases (backwards compatible)
    forest: '#10456A',
    forestLight: '#2C5F7F',
    foam: '#EDF0F2',
    ivory: '#EBE5DA',

    // Semantic Colors
    success: '#4A7C59',
    warning: '#D4A84B',
    error: '#C45B4E',

    // Neutrals
    charcoal: '#1C1C1E',
    steel: '#8E8E93',
    mist: '#E5E5EA',
    cloud: '#F2F2F7',

    // Common
    white: '#FFFFFF',
    black: '#000000',

    // Session/Training Types (Harmonized with Blue Palette 01)
    sessionTypes: {
      teknikk: '#8B6E9D',      // T - Purple (technique drills)
      golfslag: '#2C5F7F',     // G - Blue (golf shots)
      spill: '#10456A',        // S - Primary Blue (playing sessions)
      kompetanse: '#C45B4E',   // K - Red (competition/skills)
      fysisk: '#D97644',       // Fs - Orange (physical/strength)
      funksjonell: '#5FA696',  // Fu - Turquoise (functional training)
      hjemme: '#8E8E93',       // L1-2 - Gray (home practice)
      test: '#C9A227',         // Test - Gold (testing sessions)
    },
  },

  // ==================== TYPOGRAPHY ====================
  typography: {
    fontFamily: {
      sans: "'Inter', -apple-system, BlinkMacSystemFont, 'system-ui', sans-serif",
    },

    // Display Styles
    largeTitle: {
      fontSize: '34px',
      lineHeight: '41px',
      fontWeight: '700',
      letterSpacing: '-0.4px',
    },
    title1: {
      fontSize: '28px',
      lineHeight: '34px',
      fontWeight: '700',
      letterSpacing: '0.36px',
    },
    title2: {
      fontSize: '22px',
      lineHeight: '28px',
      fontWeight: '700',
      letterSpacing: '-0.26px',
    },
    title3: {
      fontSize: '20px',
      lineHeight: '25px',
      fontWeight: '600',
      letterSpacing: '-0.45px',
    },

    // Text Styles
    headline: {
      fontSize: '17px',
      lineHeight: '22px',
      fontWeight: '600',
      letterSpacing: '-0.43px',
    },
    body: {
      fontSize: '17px',
      lineHeight: '22px',
      fontWeight: '400',
      letterSpacing: '-0.43px',
    },
    callout: {
      fontSize: '16px',
      lineHeight: '21px',
      fontWeight: '400',
      letterSpacing: '-0.31px',
    },
    subhead: {
      fontSize: '15px',
      lineHeight: '20px',
      fontWeight: '400',
      letterSpacing: '-0.23px',
    },
    footnote: {
      fontSize: '13px',
      lineHeight: '18px',
      fontWeight: '400',
      letterSpacing: '-0.08px',
    },
    caption1: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: '400',
      letterSpacing: '0',
    },
    caption2: {
      fontSize: '11px',
      lineHeight: '13px',
      fontWeight: '400',
      letterSpacing: '0.06px',
    },

    // Special Typography
    statNumber: {
      fontSize: '48px',
      lineHeight: '1',
      fontWeight: '700',
      letterSpacing: '-0.5px',
    },
    statLabel: {
      fontSize: '11px',
      lineHeight: '13px',
      fontWeight: '500',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
  },

  // ==================== SPACING ====================
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  // ==================== BORDER RADIUS ====================
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    full: '9999px',
  },

  // ==================== SHADOWS ====================
  shadows: {
    card: '0 2px 4px rgba(0, 0, 0, 0.06)',
    elevated: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },

  // ==================== TRANSITIONS ====================
  transitions: {
    fast: '150ms ease-in-out',
    normal: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },
};

// Helper function to create style objects with typography tokens
export const getTypographyStyle = (variant) => {
  const style = tokens.typography[variant];
  if (!style) {
    console.warn(`Typography variant "${variant}" not found in tokens`);
    return {};
  }
  return {
    fontFamily: tokens.typography.fontFamily.sans,
    ...style,
  };
};

// Helper function to create color with opacity
export const colorWithOpacity = (color, opacity) => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Export individual token categories for convenience
export const colors = tokens.colors;
export const typography = tokens.typography;
export const spacing = tokens.spacing;
export const radius = tokens.radius;
export const shadows = tokens.shadows;
export const transitions = tokens.transitions;

// Default export
export default tokens;
