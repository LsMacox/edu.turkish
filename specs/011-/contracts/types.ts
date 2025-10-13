/**
 * TypeScript Contracts for Enhanced Service Pages
 *
 * These types define the data structures for new service page components.
 * Add these definitions to app/types/services.ts
 */

/**
 * Represents a single step in the "How It Works" process
 */
export interface ProcessStep {
  /** Step number for visual display (typically 1-4) */
  stepNumber: number
  /** Short title of the step (max 50 chars) */
  title: string
  /** Detailed description of what happens (max 200 chars) */
  description: string
  /** Iconify icon name (e.g., "mdi:upload") */
  icon: string
}

/**
 * Represents a trust factor in "Why Choose Us" section
 */
export interface TrustFactor {
  /** Main heading (max 60 chars) */
  title: string
  /** Supporting detail explaining the trust factor (max 150 chars) */
  description: string
  /** Iconify icon name (e.g., "mdi:certificate") */
  icon: string
}

/**
 * Represents a decorative trust indicator badge
 */
export interface TrustIndicator {
  /** Display text (max 80 chars) */
  text: string
  /** Optional iconify icon name for visual enhancement */
  icon?: string
  /** Visual style variant */
  variant?: 'default' | 'accent'
}

/**
 * Props for HowItWorksSection component
 */
export interface HowItWorksSectionProps {
  /** Optional section title (defaults to i18n value if not provided) */
  title?: string
  /** Array of process steps to display (typically 3-4) */
  steps: ProcessStep[]
}

/**
 * Props for WhyChooseUsSection component
 */
export interface WhyChooseUsSectionProps {
  /** Optional section title (defaults to i18n value if not provided) */
  title?: string
  /** Array of trust factors to display (typically 3) */
  factors: TrustFactor[]
}

/**
 * Props for ProcessStep component (single step display)
 */
export interface ProcessStepProps {
  /** The process step data to display */
  step: ProcessStep
}

/**
 * Props for TrustFactor component (single factor display)
 */
export interface TrustFactorProps {
  /** The trust factor data to display */
  factor: TrustFactor
}

/**
 * Props for TrustIndicatorBadge component
 */
export interface TrustIndicatorBadgeProps {
  /** The trust indicator data to display */
  indicator: TrustIndicator
}

/**
 * Extended SubService interface with delivery timeframe
 * Extends the existing SubService type
 */
export interface SubServiceWithDelivery {
  /** Service identifier */
  id: string
  /** Service name */
  name: string
  /** Service description */
  description: string
  /** Human-readable delivery timeframe (e.g., "1–2 дня") */
  deliveryTime: string
  /** Pricing in multiple currencies */
  pricing: {
    KZT: string
    TRY: string
    RUB: string
    USD: string
  }
}

/**
 * i18n content structure for common service sections
 */
export interface CommonServiceContent {
  deliveryTime: string
  howItWorks: {
    title: string
    steps: Array<Omit<ProcessStep, 'stepNumber'>>
  }
  whyChooseUs: {
    title: string
    factors: TrustFactor[]
  }
  trustIndicators: {
    workingSince: string
    documentsCount: string
  }
}

/**
 * Type guard to check if an object is a valid ProcessStep
 */
export function isProcessStep(obj: unknown): obj is ProcessStep {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'stepNumber' in obj &&
    'title' in obj &&
    'description' in obj &&
    'icon' in obj &&
    typeof (obj as ProcessStep).stepNumber === 'number' &&
    typeof (obj as ProcessStep).title === 'string' &&
    typeof (obj as ProcessStep).description === 'string' &&
    typeof (obj as ProcessStep).icon === 'string'
  )
}

/**
 * Type guard to check if an object is a valid TrustFactor
 */
export function isTrustFactor(obj: unknown): obj is TrustFactor {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'title' in obj &&
    'description' in obj &&
    'icon' in obj &&
    typeof (obj as TrustFactor).title === 'string' &&
    typeof (obj as TrustFactor).description === 'string' &&
    typeof (obj as TrustFactor).icon === 'string'
  )
}
