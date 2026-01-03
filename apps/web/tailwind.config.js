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
    // ═══════════════════════════════════════════
    // FULL-WIDTH CONTAINER (No max-width constraints)
    // ═══════════════════════════════════════════
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',    // 16px - Mobile
        sm: '1.5rem',       // 24px - Small tablet
        md: '1.5rem',       // 24px - Tablet
        lg: '2rem',         // 32px - Desktop
        xl: '2rem',         // 32px - Large desktop
        '2xl': '2rem',      // 32px - Extra large
      },
      // Remove all max-width constraints for full-width
      screens: {
        sm: '100%',
        md: '100%',
        lg: '100%',
        xl: '100%',
        '2xl': '100%',
      },
    },
    extend: {
      // ═══════════════════════════════════════════
      // COLORS (CSS Variable References)
      // ═══════════════════════════════════════════
      colors: {
        // ═══════════════════════════════════════════
        // GREEN SCALE - Primary Brand Hierarchy
        // ═══════════════════════════════════════════
        green: {
          50: 'var(--green-50)',
          100: 'var(--green-100)',
          200: 'var(--green-200)',
          300: 'var(--green-300)',
          400: 'var(--green-400)',
          500: 'var(--green-500)',
          600: 'var(--green-600)',
          700: 'var(--green-700)',
          800: 'var(--green-800)',
          900: 'var(--green-900)',
          950: 'var(--green-950)',
        },

        // ═══════════════════════════════════════════
        // TEAL SCALE - Statistics & Analytics
        // ═══════════════════════════════════════════
        teal: {
          DEFAULT: 'var(--teal-500)',
          50: 'var(--teal-50)',
          100: 'var(--teal-100)',
          200: 'var(--teal-200)',
          300: 'var(--teal-300)',
          400: 'var(--teal-400)',
          500: 'var(--teal-500)',
          600: 'var(--teal-600)',
          700: 'var(--teal-700)',
          800: 'var(--teal-800)',
          900: 'var(--teal-900)',
        },

        // ═══════════════════════════════════════════
        // GOLD/BRONZE SCALE - Achievements & Premium
        // ═══════════════════════════════════════════
        gold: {
          DEFAULT: 'var(--gold-600)',
          50: 'var(--gold-50)',
          100: 'var(--gold-100)',
          200: 'var(--gold-200)',
          300: 'var(--gold-300)',
          400: 'var(--gold-400)',
          500: 'var(--gold-500)',
          600: 'var(--gold-600)',
          700: 'var(--gold-700)',
          800: 'var(--gold-800)',
        },

        // ═══════════════════════════════════════════
        // WARM GRAY SCALE - Premium Cream Aesthetic
        // ═══════════════════════════════════════════
        warm: {
          DEFAULT: 'var(--warm-50)',
          50: 'var(--warm-50)',
          100: 'var(--warm-100)',
          200: 'var(--warm-200)',
          300: 'var(--warm-300)',
          400: 'var(--warm-400)',
          500: 'var(--warm-500)',
          600: 'var(--warm-600)',
          700: 'var(--warm-700)',
          800: 'var(--warm-800)',
          900: 'var(--warm-900)',
          950: 'var(--warm-950)',
        },

        // ═══════════════════════════════════════════
        // STANDARDIZED TOKEN CLASSES (Primary usage)
        // ═══════════════════════════════════════════
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          '2': 'var(--color-surface-2)',
          warm: 'var(--warm-50)',
          cream: 'var(--warm-50)',
        },
        border: 'var(--color-border)',
        text: {
          DEFAULT: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
        },

        // ═══════════════════════════════════════════
        // SEMANTIC SHORTHAND TOKENS
        // Enables: text-accent, bg-accent, border-accent
        // Replaces inline: style={{ color: 'var(--accent)' }}
        // ═══════════════════════════════════════════
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          muted: 'var(--accent-muted)',
          soft: 'var(--accent-soft)',
        },

        // Background shorthand (replaces --bg-primary, --bg-secondary)
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',

        // ═══════════════════════════════════════════
        // STATUS COLORS - Complete Semantic System
        // ═══════════════════════════════════════════
        success: {
          DEFAULT: 'var(--ak-success)',
          light: 'var(--ak-success-light)',
          dark: 'var(--ak-success-dark)',
          bg: 'var(--ak-success-bg)',
          border: 'var(--ak-success-border)',
          muted: 'var(--success-muted)',  // rgba(5, 150, 105, 0.1)
        },
        warning: {
          DEFAULT: 'var(--ak-warning)',
          light: 'var(--ak-warning-light)',
          dark: 'var(--ak-warning-dark)',
          bg: 'var(--ak-warning-bg)',
          border: 'var(--ak-warning-border)',
          muted: 'var(--warning-muted)',  // rgba(217, 119, 6, 0.1)
        },
        danger: {
          DEFAULT: 'var(--ak-error)',
          light: 'var(--ak-error-light)',
          dark: 'var(--ak-error-dark)',
          bg: 'var(--ak-error-bg)',
          border: 'var(--ak-error-border)',
          muted: 'var(--error-muted)',  // rgba(220, 38, 38, 0.08)
        },
        info: {
          DEFAULT: 'var(--ak-info)',
          light: 'var(--ak-info-light)',
          dark: 'var(--ak-info-dark)',
          bg: 'var(--ak-info-bg)',
          border: 'var(--ak-info-border)',
          muted: 'var(--info-muted)',  // rgba(2, 132, 199, 0.1)
        },

        // ═══════════════════════════════════════════
        // BRAND COLORS (Detailed palette)
        // ═══════════════════════════════════════════
        'ak-ink': 'var(--ak-ink)',
        'ak-primary': 'var(--ak-primary)',
        'ak-primary-light': 'var(--ak-primary-light)',
        'ak-snow': 'var(--ak-snow)',
        'ak-surface': 'var(--ak-surface)',
        'ak-gold': 'var(--ak-gold)',
        'ak-white': 'var(--ak-white)',
        'ak-teal': 'var(--ak-teal)',

        // Legacy aliases
        'ak-forest': 'var(--ak-forest)',
        'ak-forest-light': 'var(--ak-forest-light)',
        'ak-foam': 'var(--ak-foam)',
        'ak-ivory': 'var(--ak-ivory)',

        // Gray scale (complete)
        'gray-50': 'var(--gray-50)',
        'gray-100': 'var(--gray-100)',
        'gray-200': 'var(--gray-200)',
        'gray-300': 'var(--gray-300)',
        'gray-400': 'var(--gray-400)',
        'gray-500': 'var(--gray-500)',
        'gray-600': 'var(--gray-600)',
        'gray-700': 'var(--gray-700)',
        'gray-800': 'var(--gray-800)',
        'gray-900': 'var(--gray-900)',
        'gray-950': 'var(--gray-950)',

        // Brand named colors (for semantic usage)
        'brand-forest': 'var(--brand-forest)',
        'brand-pine': 'var(--brand-pine)',
        'brand-sage': 'var(--brand-sage)',
        'brand-cream': 'var(--brand-cream)',

        // Legacy neutral aliases
        'ak-charcoal': 'var(--ak-charcoal)',
        'ak-steel': 'var(--ak-steel)',
        'ak-mist': 'var(--ak-mist)',
        'ak-cloud': 'var(--ak-cloud)',

        // Status colors (legacy - use success/warning/danger instead)
        'ak-success': 'var(--ak-success)',
        'ak-warning': 'var(--ak-warning)',
        'ak-error': 'var(--ak-error)',
        'ak-info': 'var(--ak-info)',

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

        // Training Category Colors
        'category-fys': 'var(--category-fys)',
        'category-fys-muted': 'var(--category-fys-muted)',
        'category-tek': 'var(--category-tek)',
        'category-tek-muted': 'var(--category-tek-muted)',
        'category-slag': 'var(--category-slag)',
        'category-slag-muted': 'var(--category-slag-muted)',
        'category-spill': 'var(--category-spill)',
        'category-spill-muted': 'var(--category-spill-muted)',
        'category-turn': 'var(--category-turn)',
        'category-turn-muted': 'var(--category-turn-muted)',

        // Advanced Filter Colors
        'filter-lfase': 'var(--filter-lfase)',
        'filter-miljo': 'var(--filter-miljo)',
        'filter-press': 'var(--filter-press)',

        // Group Color Picker
        'group-lightblue': 'var(--group-lightblue)',
        'group-purple': 'var(--group-purple)',
        'group-pink': 'var(--group-pink)',
        'group-teal': 'var(--group-teal)',

        // Medal/Rank Colors
        'medal-gold': 'var(--medal-gold)',
        'medal-silver': 'var(--medal-silver)',
        'medal-bronze': 'var(--medal-bronze)',
        'medal-platinum': 'var(--medal-platinum)',
        'rank-legendary': 'var(--rank-legendary)',
        'rank-rookie': 'var(--rank-rookie)',

        // Streak/Achievement Badge Colors
        'streak-gold': 'var(--streak-gold)',
        'streak-gold-muted': 'var(--streak-gold-muted)',
        'streak-gold-border': 'var(--streak-gold-border)',
        'streak-gold-text': 'var(--streak-gold-text)',

        // Data Golf Feature Colors
        'datagolf-accent': 'var(--datagolf-accent)',
        'datagolf-accent-dark': 'var(--datagolf-accent-dark)',
        'datagolf-accent-muted': 'var(--datagolf-accent-muted)',
        'datagolf-accent-border': 'var(--datagolf-accent-border)',

        // Calendar Feature Colors
        'calendar-surface-base': 'var(--calendar-surface-base)',
        'calendar-surface-card': 'var(--calendar-surface-card)',
        'calendar-surface-elevated': 'var(--calendar-surface-elevated)',
        'calendar-surface-weekend': 'var(--calendar-surface-weekend)',
        'calendar-surface-today': 'var(--calendar-surface-today)',
        'calendar-border': 'var(--calendar-border)',
        'calendar-border-subtle': 'var(--calendar-border-subtle)',
        'calendar-border-focus': 'var(--calendar-border-focus)',
        'calendar-grid-line': 'var(--calendar-grid-line)',
        'calendar-text-primary': 'var(--calendar-text-primary)',
        'calendar-text-secondary': 'var(--calendar-text-secondary)',
        'calendar-text-tertiary': 'var(--calendar-text-tertiary)',
        'calendar-text-muted': 'var(--calendar-text-muted)',
        'calendar-text-weekend': 'var(--calendar-text-weekend)',
        'calendar-event-recommended-bg': 'var(--calendar-event-recommended-bg)',
        'calendar-event-recommended-border': 'var(--calendar-event-recommended-border)',
        'calendar-event-recommended-text': 'var(--calendar-event-recommended-text)',
        'calendar-event-planned-bg': 'var(--calendar-event-planned-bg)',
        'calendar-event-planned-border': 'var(--calendar-event-planned-border)',
        'calendar-event-planned-text': 'var(--calendar-event-planned-text)',
        'calendar-event-inprogress-bg': 'var(--calendar-event-inprogress-bg)',
        'calendar-event-inprogress-border': 'var(--calendar-event-inprogress-border)',
        'calendar-event-inprogress-text': 'var(--calendar-event-inprogress-text)',
        'calendar-event-completed-bg': 'var(--calendar-event-completed-bg)',
        'calendar-event-completed-border': 'var(--calendar-event-completed-border)',
        'calendar-event-completed-text': 'var(--calendar-event-completed-text)',
        'calendar-event-ghost-bg': 'var(--calendar-event-ghost-bg)',
        'calendar-event-ghost-border': 'var(--calendar-event-ghost-border)',
        'calendar-event-ghost-text': 'var(--calendar-event-ghost-text)',
        'calendar-event-external-bg': 'var(--calendar-event-external-bg)',
        'calendar-event-external-border': 'var(--calendar-event-external-border)',
        'calendar-event-external-text': 'var(--calendar-event-external-text)',
        'calendar-event-mental-bg': 'var(--calendar-event-mental-bg)',
        'calendar-event-mental-border': 'var(--calendar-event-mental-border)',
        'calendar-event-testing-bg': 'var(--calendar-event-testing-bg)',
        'calendar-event-testing-border': 'var(--calendar-event-testing-border)',
        'calendar-today-marker-bg': 'var(--calendar-today-marker-bg)',
        'calendar-today-marker-text': 'var(--calendar-today-marker-text)',
        'calendar-now-line': 'var(--calendar-now-line)',
        'calendar-hover': 'var(--calendar-hover)',
        'calendar-selected': 'var(--calendar-selected)',
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

      // ═══════════════════════════════════════════
      // BORDER COLORS (Extend default)
      // ═══════════════════════════════════════════
      borderColor: {
        DEFAULT: 'var(--color-border)',
        subtle: 'var(--border-subtle)',
        brand: 'var(--border-brand)',
        accent: 'var(--accent)',
        'accent-muted': 'var(--accent-soft)',
        success: 'var(--ak-success-border)',
        'success-muted': 'var(--success-border-muted)',
        warning: 'var(--ak-warning-border)',
        'warning-muted': 'var(--warning-border-muted)',
        danger: 'var(--ak-error-border)',
        'danger-muted': 'var(--error-border-muted)',
        info: 'var(--ak-info-border)',
        'info-muted': 'var(--info-border-muted)',
      },

      // ═══════════════════════════════════════════
      // ANIMATIONS (shadcn/ui support)
      // ═══════════════════════════════════════════
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.3s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
