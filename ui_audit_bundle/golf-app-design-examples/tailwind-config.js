// tailwind.config.js - Premium Golf Coaching App

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Custom Colors
      colors: {
        // Primary - Forest Green
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#40916c', // Deep Teal
          600: '#2d6a4f', // Emerald
          700: '#1b4332', // Forest Green (Main)
          800: '#14532d',
          900: '#0f3d22',
          950: '#052e16',
        },

        // Gold Accents
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#e8d5a3', // Soft Gold
          400: '#d4af37', // Championship Gold (Main)
          500: '#c9a227',
          600: '#b8860b',
          700: '#92700c',
          800: '#78350f',
          900: '#5c2d0c',
        },

        // Dark Mode Surfaces
        surface: {
          black: '#0a0a0a',    // Pitch Black
          dark: '#141414',     // Dark Surface
          card: '#1e1e1e',     // Card Background
          elevated: '#2a2a2a', // Elevated Surface
          border: '#3a3a3a',   // Border/Divider
        },

        // Text Colors
        text: {
          primary: '#ffffff',
          secondary: '#b3b3b3',
          muted: '#737373',
        },
      },

      // Typography
      fontFamily: {
        sans: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
        body: ['SF Pro Text', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },

      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.5px' }],
        'display-md': ['36px', { lineHeight: '44px', letterSpacing: '-0.25px' }],
        'headline': ['28px', { lineHeight: '36px', letterSpacing: '0px' }],
        'title-lg': ['22px', { lineHeight: '28px', letterSpacing: '0px' }],
        'title-md': ['18px', { lineHeight: '24px', letterSpacing: '0.1px' }],
        'body-lg': ['16px', { lineHeight: '24px', letterSpacing: '0.5px' }],
        'body-md': ['14px', { lineHeight: '20px', letterSpacing: '0.25px' }],
        'label': ['12px', { lineHeight: '16px', letterSpacing: '0.5px' }],
        'caption': ['11px', { lineHeight: '14px', letterSpacing: '0.4px' }],
      },

      // Spacing (8px base)
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '15': '60px',
        '18': '72px',
        '22': '88px',
      },

      // Border Radius
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },

      // Box Shadow
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'elevated': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.3)',
        'green-glow': '0 0 20px rgba(45, 106, 79, 0.3)',
        'inner-subtle': 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
      },

      // Transitions
      transitionDuration: {
        'micro': '100ms',
        'short': '200ms',
        'medium': '300ms',
        'long': '400ms',
      },

      // Animation
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 300ms ease-out',
        'slide-down': 'slideDown 300ms ease-out',
        'fade-in': 'fadeIn 200ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },

      // Background Image (for gradients)
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37, #E8D5A3)',
        'green-gradient': 'linear-gradient(135deg, #1B4332, #2D6A4F)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
      },
    },
  },

  plugins: [
    // Custom plugin for golf-specific utilities
    function({ addUtilities, addComponents, theme }) {
      // Glass effect utility
      addUtilities({
        '.glass': {
          background: 'rgba(30, 30, 30, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-dark': {
          background: 'rgba(20, 20, 20, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      });

      // Premium button component
      addComponents({
        '.btn-primary': {
          backgroundColor: theme('colors.primary.700'),
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '16px',
          transition: 'all 200ms ease',
          '&:hover': {
            backgroundColor: theme('colors.primary.600'),
          },
          '&:active': {
            backgroundColor: theme('colors.primary.800'),
          },
        },
        '.btn-secondary': {
          backgroundColor: 'transparent',
          color: theme('colors.primary.700'),
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '16px',
          border: `1px solid ${theme('colors.primary.700')}`,
          transition: 'all 200ms ease',
          '&:hover': {
            backgroundColor: 'rgba(27, 67, 50, 0.1)',
          },
        },
        '.btn-gold': {
          background: 'linear-gradient(135deg, #D4AF37, #E8D5A3)',
          color: '#1a1a1a',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '16px',
          boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
          transition: 'all 200ms ease',
          '&:hover': {
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.5)',
            transform: 'translateY(-1px)',
          },
        },

        // Card component
        '.card': {
          backgroundColor: theme('colors.surface.card'),
          border: `1px solid ${theme('colors.surface.border')}`,
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
        },
        '.card-elevated': {
          backgroundColor: theme('colors.surface.elevated'),
          border: `1px solid ${theme('colors.surface.border')}`,
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        },

        // Input component
        '.input': {
          backgroundColor: theme('colors.surface.dark'),
          border: `1px solid ${theme('colors.surface.border')}`,
          borderRadius: '8px',
          padding: '12px 16px',
          color: '#ffffff',
          fontSize: '16px',
          transition: 'all 200ms ease',
          '&::placeholder': {
            color: theme('colors.text.muted'),
          },
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.primary.600'),
            boxShadow: '0 0 0 3px rgba(45, 106, 79, 0.2)',
          },
        },

        // Badge components
        '.badge-premium': {
          background: 'linear-gradient(135deg, #D4AF37, #C9A227)',
          color: '#1a1a1a',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600',
        },
        '.badge-status': {
          backgroundColor: 'rgba(45, 106, 79, 0.2)',
          color: theme('colors.primary.400'),
          padding: '4px 12px',
          borderRadius: '16px',
          fontSize: '12px',
          fontWeight: '500',
          border: '1px solid rgba(45, 106, 79, 0.4)',
        },
      });
    },
  ],
};
