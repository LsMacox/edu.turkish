import typography from '@tailwindcss/typography'
import animate from 'tailwindcss-animate'

export default {
  content: ['./app/**/*.{vue,js,ts}', './server/**/*.{js,ts}'],
  safelist: [
    // Typography classes
    'text-hero',
    'text-hero-subtitle',
    'text-section-title',
    'text-section-subtitle',
    'text-card-title',
    'text-card-subtitle',
    'text-card-body',
    'text-body-lg',
    'text-body',
    'text-body-sm',
    'text-btn-lg',
    'text-btn',
    'text-btn-sm',
    'text-input',
    'text-label',
    'text-helper',
    'text-error',
    'text-nav',
    'text-nav-sm',
  ],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        xs: '1rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '2rem',
        '2xl': '2rem',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1200px',
        '2xl': '1200px',
      },
    },
    extend: {
      colors: {
        primary: '#C62828',
        secondary: '#1F2937',
        background: '#F3F4F6',
        // Enhanced semantic colors
        success: '#047857',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        // Additional semantic variants
        'success-light': '#D1FAE5',
        'success-dark': '#047857',
        'warning-light': '#FEF3C7',
        'warning-dark': '#D97706',
        'error-light': '#FEE2E2',
        'error-dark': '#DC2626',
        'info-light': '#DBEAFE',
        'info-dark': '#1D4ED8',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        custom: '0 4px 20px rgba(0, 0, 0, 0.08)',
        // Enhanced shadow definitions
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        button: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'button-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'input-focus': '0 0 0 3px rgba(244, 67, 54, 0.1)',
        error: '0 0 0 3px rgba(239, 68, 68, 0.1)',
        success: '0 0 0 3px rgba(16, 185, 129, 0.1)',
      },
      spacing: {
        // Safe areas for mobile
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      borderRadius: {
        card: '1rem', // 16px - standard card radius
        'card-lg': '1.5rem', // 24px - large cards
        button: '0.75rem', // 12px - button radius
      },
      minHeight: {
        'touch-44': '44px',
        'touch-48': '48px',
      },
      minWidth: {
        'touch-44': '44px',
        'touch-48': '48px',
      },
      // Enhanced backdrop blur
      backdropBlur: {
        xs: '2px',
      },
      // Enhanced z-index scale
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      // Enhanced transition timing
      transitionDuration: {
        '0': '0ms',
        '2000': '2000ms',
        '3000': '3000ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    typography,
    animate,
    // Custom plugin for component utility classes
    function ({ addComponents }: { addComponents: any }) {
      addComponents({
        // Card hover utilities
        '.card-hover': {
          '@apply transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1': {},
        },
        '.card-hover-soft': {
          '@apply transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5': {},
        },

        // Input focus utilities
        '.input-focus': {
          '@apply focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200':
            {},
        },
        '.input-focus-error': {
          '@apply focus:ring-2 focus:ring-error focus:border-error transition-all duration-200': {},
        },
        '.input-focus-success': {
          '@apply focus:ring-2 focus:ring-success focus:border-success transition-all duration-200':
            {},
        },

        // Text gradient utilities
        '.text-gradient': {
          '@apply bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent': {},
        },
        '.text-gradient-success': {
          '@apply bg-gradient-to-r from-success to-green-600 bg-clip-text text-transparent': {},
        },
        '.text-gradient-info': {
          '@apply bg-gradient-to-r from-info to-blue-600 bg-clip-text text-transparent': {},
        },

        // Button utilities
        '.btn-hover-lift': {
          '@apply transition-all duration-200 hover:-translate-y-0.5 hover:shadow-button-hover active:translate-y-0':
            {},
        },
        '.btn-focus-ring': {
          '@apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus-visible:ring-2': {},
        },

        // Animation utilities
        '.animate-on-scroll': {
          '@apply opacity-0 translate-y-4 transition-all duration-700 ease-out': {},
        },
        '.animate-on-scroll.in-view': {
          '@apply opacity-100 translate-y-0': {},
        },

        // Loading utilities
        '.loading-dots': {
          '@apply relative': {},
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '4px',
            height: '4px',
            'background-color': 'currentColor',
            'border-radius': '50%',
            animation: 'loading-dots 1.4s infinite ease-in-out both',
          },
        },

        // Skeleton loading
        '.skeleton': {
          '@apply animate-pulse bg-gray-200 rounded': {},
        },
        '.skeleton-text': {
          '@apply h-4 bg-gray-200 rounded animate-pulse': {},
        },

        // Accessibility utilities
        '.sr-only-focusable': {
          '@apply sr-only': {},
          '&:focus': {
            '@apply not-sr-only absolute top-0 left-0 z-50 p-2 bg-white border border-gray-300 rounded shadow-lg':
              {},
          },
        },

        // Enhanced focus styles
        '.focus-ring': {
          '@apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary':
            {},
        },
        '.focus-ring-error': {
          '@apply focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus-visible:ring-2 focus-visible:ring-error':
            {},
        },
        '.focus-ring-success': {
          '@apply focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 focus-visible:ring-2 focus-visible:ring-success':
            {},
        },

        // Spacing patterns - Container
        '.container-padding': {
          '@apply px-4 sm:px-5 md:px-6 lg:px-6': {},
        },
        '.container-padding-narrow': {
          '@apply px-4 md:px-6': {},
        },

        // Spacing patterns - Section vertical
        '.section-py': {
          '@apply py-8 md:py-16': {},
        },
        '.section-py-sm': {
          '@apply py-6 md:py-12': {},
        },
        '.section-py-lg': {
          '@apply py-10 md:py-20': {},
        },

        // Spacing patterns - Card padding
        '.card-padding': {
          '@apply p-4 md:p-6': {},
        },
        '.card-padding-sm': {
          '@apply p-3 md:p-4': {},
        },
        '.card-padding-lg': {
          '@apply p-5 md:p-8': {},
        },

        // Spacing patterns - Gap
        '.gap-section': {
          '@apply gap-4 md:gap-6 lg:gap-8': {},
        },
        '.gap-section-sm': {
          '@apply gap-3 md:gap-4 lg:gap-6': {},
        },
        '.gap-section-lg': {
          '@apply gap-6 md:gap-8 lg:gap-12': {},
        },

        // Spacing patterns - Button padding
        '.btn-padding-sm': {
          '@apply px-3 py-1.5 md:px-4 md:py-2': {},
        },
        '.btn-padding-md': {
          '@apply px-3 py-2.5 md:px-6 md:py-3': {},
        },
        '.btn-padding-lg': {
          '@apply px-5 py-3 md:px-8 md:py-4': {},
        },
        '.btn-padding-xl': {
          '@apply px-6 py-4 md:px-10 md:py-5': {},
        },
      })
    },
  ],
}
