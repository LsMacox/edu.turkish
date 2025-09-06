import typography from '@tailwindcss/typography'
import animate from 'tailwindcss-animate'

export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}'
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px', 
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px'
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
        '2xl': '2rem'
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px', 
        lg: '1024px',
        xl: '1200px',
        '2xl': '1200px'
      }
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
        'info-dark': '#1D4ED8'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        custom: '0 4px 20px rgba(0, 0, 0, 0.08)',
        // Enhanced shadow definitions
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'button': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'button-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'input-focus': '0 0 0 3px rgba(244, 67, 54, 0.1)',
        'error': '0 0 0 3px rgba(239, 68, 68, 0.1)',
        'success': '0 0 0 3px rgba(16, 185, 129, 0.1)'
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)', 
        'safe-right': 'env(safe-area-inset-right)',
        'section': '4rem',      // 64px - standard section spacing
        'section-sm': '3rem',   // 48px - compact sections
        'section-lg': '5rem'    // 80px - hero sections
      },
      fontSize: {
        'xs-mobile': ['12px', '16px'],
        'sm-mobile': ['14px', '20px'],
        'base-mobile': ['16px', '24px'],
        'lg-mobile': ['18px', '28px'],
        'xl-mobile': ['20px', '28px'],
        '2xl-mobile': ['24px', '32px'],
        '3xl-mobile': ['30px', '36px']
      },
      borderRadius: {
        'card': '1rem',         // 16px - standard card radius
        'card-lg': '1.5rem',    // 24px - large cards
        'button': '0.75rem'     // 12px - button radius
      },
      minHeight: {
        'touch-44': '44px',
        'touch-48': '48px'
      },
      minWidth: {
        'touch-44': '44px',
        'touch-48': '48px'
      },
      // Enhanced backdrop blur
      backdropBlur: {
        xs: '2px'
      },
      // Enhanced z-index scale
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100'
      },
      // Enhanced transition timing
      transitionDuration: {
        '0': '0ms',
        '2000': '2000ms',
        '3000': '3000ms'
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.2s ease-out forwards',
        'fade-in': 'fade-in 0.2s ease-out forwards'
      }
    }
  },
  plugins: [typography, animate, 
    // Custom plugin for component utility classes
    function({ addComponents, theme }) {
      addComponents({
        // Card hover utilities
        '.card-hover': {
          '@apply transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1': {}
        },
        '.card-hover-soft': {
          '@apply transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5': {}
        },
        
        // Input focus utilities
        '.input-focus': {
          '@apply focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200': {}
        },
        '.input-focus-error': {
          '@apply focus:ring-2 focus:ring-error focus:border-error transition-all duration-200': {}
        },
        '.input-focus-success': {
          '@apply focus:ring-2 focus:ring-success focus:border-success transition-all duration-200': {}
        },
        
        // Text gradient utilities
        '.text-gradient': {
          '@apply bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent': {}
        },
        '.text-gradient-success': {
          '@apply bg-gradient-to-r from-success to-green-600 bg-clip-text text-transparent': {}
        },
        '.text-gradient-info': {
          '@apply bg-gradient-to-r from-info to-blue-600 bg-clip-text text-transparent': {}
        },
        
        // Button utilities
        '.btn-hover-lift': {
          '@apply transition-all duration-200 hover:-translate-y-0.5 hover:shadow-button-hover active:translate-y-0': {}
        },
        '.btn-focus-ring': {
          '@apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus-visible:ring-2': {}
        },
        
        // Animation utilities
        '.animate-on-scroll': {
          '@apply opacity-0 translate-y-4 transition-all duration-700 ease-out': {}
        },
        '.animate-on-scroll.in-view': {
          '@apply opacity-100 translate-y-0': {}
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
            animation: 'loading-dots 1.4s infinite ease-in-out both'
          }
        },
        
        // Skeleton loading
        '.skeleton': {
          '@apply animate-pulse bg-gray-200 rounded': {}
        },
        '.skeleton-text': {
          '@apply h-4 bg-gray-200 rounded animate-pulse': {}
        },
        
        // Accessibility utilities
        '.sr-only-focusable': {
          '@apply sr-only': {},
          '&:focus': {
            '@apply not-sr-only absolute top-0 left-0 z-50 p-2 bg-white border border-gray-300 rounded shadow-lg': {}
          }
        },
        
        // Enhanced focus styles
        '.focus-ring': {
          '@apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus-visible:ring-2 focus-visible:ring-primary': {}
        },
        '.focus-ring-error': {
          '@apply focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 focus-visible:ring-2 focus-visible:ring-error': {}
        },
        '.focus-ring-success': {
          '@apply focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2 focus-visible:ring-2 focus-visible:ring-success': {}
        }
      })
    }
  ]
}
