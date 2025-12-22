import typography from '@tailwindcss/typography'
import animate from 'tailwindcss-animate'

export default {
  content: ['./app/**/*.{vue,js,ts}', './server/**/*.{js,ts}'],
  // ============================================================================
  // Safelist - Only for Tailwind JIT utilities used dynamically
  // ============================================================================
  // Note: Custom component classes defined in app/assets/css/components/ with
  // @layer components do NOT need to be safelisted - they are always included.
  // Only safelist Tailwind's generated utilities that can't be detected statically.
  // ============================================================================
  safelist: [

    // Border radius tokens (extended in theme.extend.borderRadius)
    { pattern: /^rounded-(card|card-lg|card-inner|button|badge|icon)$/ },

    // Shadow tokens (extended in theme.extend.boxShadow)
    { pattern: /^shadow-(card|button|elevated|interactive|dropdown|floating|fixed)(-hover)?$/ },

    // Card image heights (extended in theme.extend.height)
    { pattern: /^(md:)?h-card-image(-md|-lg)?$/ },

    // Semantic border colors (extended in theme.extend.borderColor)
    { pattern: /^border(-l)?-(success|error|warning|info|primary|default|muted)$/ },
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
        'primary-light': '#FECACA', // red-200 - soft variant for primary
        'primary-soft': '#FEF2F2', // red-50 - subtle background for selected states
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
        'card-inner': '0.875rem', // 14px - inner card elements (gradient borders)
        button: '0.75rem', // 12px - button radius
        badge: '9999px', // pill/badge radius (same as full)
        icon: '0.5rem', // 8px - icon containers
      },
      borderColor: {
        default: '#E5E7EB', // gray-200 - standard borders
        muted: '#D1D5DB', // gray-300 - subtle/muted borders
        // Semantic border colors - use instead of hardcoded colors
        success: '#22C55E', // green-500
        error: '#EF4444', // red-500
        warning: '#F59E0B', // amber-500
        info: '#3B82F6', // blue-500
      },
      minHeight: {
        'touch-40': '40px',
        'touch-44': '44px',
        'touch-48': '48px',
        'touch-52': '52px',
        'touch-56': '56px',
        'touch-20': '20px',
        'touch-24': '24px',
        'touch-28': '28px',
        'touch-32': '32px',
      },
      height: {
        'card-image': '11rem',      // 176px - standard card image
        'card-image-md': '12rem',   // 192px - medium card image
        'card-image-lg': '14rem',   // 224px - large card image
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
        'toast': '9999',
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
  plugins: [typography, animate],
}
