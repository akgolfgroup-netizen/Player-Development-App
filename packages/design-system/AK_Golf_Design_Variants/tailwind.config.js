/** @type {import('tailwindcss').Config} */
// AK Golf Academy Design System v3.0
// Based on: Blue Palette 01 (Production Ready)
// Source: Design/ak_golf_figma_kit_blue_palette01.svg
// Font: Inter (Open Source, Cross-Platform)
// Typography Scale: Apple Human Interface Guidelines

module.exports = {
  content: [
    "./Screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Brand Colors - Blue Palette 01
      colors: {
        // Primary blue scale
        primary: {
          50: '#E8F1F5',
          100: '#D1E3EB',
          200: '#A3C7D7',
          300: '#75ABC3',
          400: '#478FAF',
          500: '#10456A',
          600: '#2C5F7F',
          700: '#10456A',
          800: '#0D3654',
          900: '#0A273E',
          DEFAULT: '#10456A',
          light: '#2C5F7F',
        },
        // Legacy forest alias (maps to primary)
        forest: {
          50: '#E8F1F5',
          100: '#D1E3EB',
          200: '#A3C7D7',
          300: '#75ABC3',
          400: '#478FAF',
          500: '#10456A',
          600: '#2C5F7F',
          700: '#10456A',
          800: '#0D3654',
          900: '#0A273E',
          DEFAULT: '#10456A',
          light: '#2C5F7F',
        },
        // Brand colors
        ink: '#02060D',
        snow: '#EDF0F2',
        surface: '#EBE5DA',
        gold: '#C9A227',

        // Legacy aliases
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

        // Gray scale
        gray: {
          50: '#F9FAFB',
          100: '#F2F4F7',
          300: '#D5D7DA',
          500: '#8E8E93',
          600: '#535862',
          700: '#414651',
          900: '#1C1C1E',
        },
      },

      // Typography
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },

      // Type Scale (Apple HIG-inspired)
      fontSize: {
        // Display Styles
        'large-title': ['34px', {
          lineHeight: '41px',
          letterSpacing: '-0.4px',
          fontWeight: '700',
        }],
        'title-1': ['28px', {
          lineHeight: '34px',
          letterSpacing: '0.36px',
          fontWeight: '700',
        }],
        'title-2': ['22px', {
          lineHeight: '28px',
          letterSpacing: '-0.26px',
          fontWeight: '700',
        }],
        'title-3': ['20px', {
          lineHeight: '25px',
          letterSpacing: '-0.45px',
          fontWeight: '600',
        }],

        // Text Styles
        'headline': ['17px', {
          lineHeight: '22px',
          letterSpacing: '-0.43px',
          fontWeight: '600',
        }],
        'body': ['17px', {
          lineHeight: '22px',
          letterSpacing: '-0.43px',
          fontWeight: '400',
        }],
        'callout': ['16px', {
          lineHeight: '21px',
          letterSpacing: '-0.31px',
          fontWeight: '400',
        }],
        'subhead': ['15px', {
          lineHeight: '20px',
          letterSpacing: '-0.23px',
          fontWeight: '400',
        }],
        'footnote': ['13px', {
          lineHeight: '18px',
          letterSpacing: '-0.08px',
          fontWeight: '400',
        }],
        'caption-1': ['12px', {
          lineHeight: '16px',
          letterSpacing: '0',
          fontWeight: '400',
        }],
        'caption-2': ['11px', {
          lineHeight: '13px',
          letterSpacing: '0.06px',
          fontWeight: '400',
        }],

        // Special
        'stat-number': ['48px', {
          lineHeight: '1',
          letterSpacing: '-0.5px',
          fontWeight: '700',
        }],
        'stat-label': ['11px', {
          lineHeight: '13px',
          letterSpacing: '0.5px',
          fontWeight: '500',
        }],
      },

      // Border Radius
      borderRadius: {
        'ak-sm': '8px',
        'ak-md': '12px',
        'ak-lg': '16px',
      },

      // Shadows
      boxShadow: {
        'ak-card': '0 2px 4px rgba(0, 0, 0, 0.06)',
        'ak-elevated': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
