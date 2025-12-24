/** @type {import('tailwindcss').Config} */
/**
 * AK GOLF ACADEMY — DESIGN SYSTEM v3.0
 * Tailwind CSS Configuration
 *
 * All colors, spacing, radius, and shadows reference CSS variables
 * defined in src/index.css. This ensures a single source of truth.
 */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ═══════════════════════════════════════════
      // COLORS (CSS Variable References)
      // ═══════════════════════════════════════════
      colors: {
        // Brand Colors
        'ak-ink': 'var(--ak-ink)',
        'ak-primary': 'var(--ak-primary)',
        'ak-primary-light': 'var(--ak-primary-light)',
        'ak-snow': 'var(--ak-snow)',
        'ak-surface': 'var(--ak-surface)',
        'ak-gold': 'var(--ak-gold)',
        'ak-white': 'var(--ak-white)',

        // Legacy aliases
        'ak-forest': 'var(--ak-forest)',
        'ak-forest-light': 'var(--ak-forest-light)',
        'ak-foam': 'var(--ak-foam)',
        'ak-ivory': 'var(--ak-ivory)',

        // Gray scale
        'gray-50': 'var(--gray-50)',
        'gray-100': 'var(--gray-100)',
        'gray-300': 'var(--gray-300)',
        'gray-500': 'var(--gray-500)',
        'gray-600': 'var(--gray-600)',
        'gray-700': 'var(--gray-700)',
        'gray-900': 'var(--gray-900)',

        // Legacy neutral aliases
        'ak-charcoal': 'var(--ak-charcoal)',
        'ak-steel': 'var(--ak-steel)',
        'ak-mist': 'var(--ak-mist)',
        'ak-cloud': 'var(--ak-cloud)',

        // Status colors
        'ak-success': 'var(--ak-success)',
        'ak-warning': 'var(--ak-warning)',
        'ak-error': 'var(--ak-error)',

        // Semantic - Background
        'bg-default': 'var(--background-default)',
        'bg-surface': 'var(--background-surface)',
        'bg-inverse': 'var(--background-inverse)',
        'bg-accent': 'var(--background-accent)',
        'bg-white': 'var(--background-white)',

        // Semantic - Text
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-brand': 'var(--text-brand)',
        'text-inverse': 'var(--text-inverse)',
        'text-accent': 'var(--text-accent)',

        // Semantic - Border
        'border-default': 'var(--border-default)',
        'border-subtle': 'var(--border-subtle)',
        'border-brand': 'var(--border-brand)',
        'border-accent': 'var(--border-accent)',
      },

      // ═══════════════════════════════════════════
      // TYPOGRAPHY
      // ═══════════════════════════════════════════
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        logo: ['DM Sans', 'sans-serif'],
      },

      fontSize: {
        'large-title': ['var(--font-size-large-title)', { lineHeight: 'var(--line-height-large-title)' }],
        'title1': ['var(--font-size-title1)', { lineHeight: 'var(--line-height-title1)' }],
        'title2': ['var(--font-size-title2)', { lineHeight: 'var(--line-height-title2)' }],
        'title3': ['var(--font-size-title3)', { lineHeight: 'var(--line-height-title3)' }],
        'headline': ['var(--font-size-headline)', { lineHeight: 'var(--line-height-headline)' }],
        'body': ['var(--font-size-body)', { lineHeight: 'var(--line-height-body)' }],
        'subheadline': ['var(--font-size-subheadline)', { lineHeight: 'var(--line-height-subheadline)' }],
        'footnote': ['var(--font-size-footnote)', { lineHeight: 'var(--line-height-footnote)' }],
        'caption1': ['var(--font-size-caption1)', { lineHeight: 'var(--line-height-caption1)' }],
        'caption2': ['var(--font-size-caption2)', { lineHeight: 'var(--line-height-caption2)' }],
      },

      // ═══════════════════════════════════════════
      // SPACING (CSS Variable References)
      // ═══════════════════════════════════════════
      spacing: {
        'ak-1': 'var(--spacing-1)',
        'ak-2': 'var(--spacing-2)',
        'ak-3': 'var(--spacing-3)',
        'ak-4': 'var(--spacing-4)',
        'ak-5': 'var(--spacing-5)',
        'ak-6': 'var(--spacing-6)',
        'ak-8': 'var(--spacing-8)',
        'ak-10': 'var(--spacing-10)',
        'ak-12': 'var(--spacing-12)',
        'ak-16': 'var(--spacing-16)',
        'ak-20': 'var(--spacing-20)',

        // Legacy aliases
        'ak-xs': 'var(--spacing-xs)',
        'ak-sm': 'var(--spacing-sm)',
        'ak-md': 'var(--spacing-md)',
        'ak-lg': 'var(--spacing-lg)',
        'ak-xl': 'var(--spacing-xl)',
        'ak-xxl': 'var(--spacing-xxl)',
      },

      // ═══════════════════════════════════════════
      // BORDER RADIUS (CSS Variable References)
      // ═══════════════════════════════════════════
      borderRadius: {
        'ak-sm': 'var(--radius-sm)',
        'ak-md': 'var(--radius-md)',
        'ak-lg': 'var(--radius-lg)',
        'ak-full': 'var(--radius-full)',
      },

      // ═══════════════════════════════════════════
      // SHADOWS (CSS Variable References)
      // ═══════════════════════════════════════════
      boxShadow: {
        'ak-card': 'var(--shadow-card)',
        'ak-elevated': 'var(--shadow-elevated)',
      },
    },
  },
  plugins: [],
}
