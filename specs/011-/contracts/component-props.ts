/**
 * Vue Component Props Contracts for Enhanced Service Pages
 *
 * These interfaces define the props for each new component.
 * Use these as the basis for defineProps<T>() in each component.
 */

import type { ProcessStep, TrustFactor, TrustIndicator } from './types'

/**
 * Props for SubServiceCard.vue (MODIFIED)
 *
 * Extends existing component to include delivery timeframe
 */
export interface SubServiceCardProps {
  /** Unique identifier for the sub-service */
  subServiceId: string
  /** Service name (e.g., "Перевод паспорта") */
  name: string
  /** Service description */
  description: string
  /** Pricing in multiple currencies */
  pricing: {
    KZT: string
    TRY: string
    RUB: string
    USD: string
  }
  /** NEW: Delivery timeframe (e.g., "1–2 дня") */
  deliveryTime: string
}

/**
 * Emits for SubServiceCard.vue
 */
export interface SubServiceCardEmits {
  (e: 'apply', payload: { subServiceId: string; name: string }): void
}

/**
 * Props for HowItWorksSection.vue (NEW)
 *
 * Container component for displaying process steps
 */
export interface HowItWorksSectionProps {
  /** Optional section title (defaults to i18n if not provided) */
  title?: string
  /** Array of process steps (typically 3-4) */
  steps: ProcessStep[]
}

/**
 * Props for ProcessStep.vue (NEW)
 *
 * Atomic component for a single process step
 */
export interface ProcessStepProps {
  /** Process step data */
  step: ProcessStep
}

/**
 * Props for WhyChooseUsSection.vue (NEW)
 *
 * Container component for displaying trust factors
 */
export interface WhyChooseUsSectionProps {
  /** Optional section title (defaults to i18n if not provided) */
  title?: string
  /** Array of trust factors (typically 3) */
  factors: TrustFactor[]
}

/**
 * Props for TrustFactor.vue (NEW)
 *
 * Atomic component for a single trust factor
 */
export interface TrustFactorProps {
  /** Trust factor data */
  factor: TrustFactor
}

/**
 * Props for TrustIndicatorBadge.vue (NEW)
 *
 * Atomic component for decorative trust badge
 */
export interface TrustIndicatorBadgeProps {
  /** Trust indicator data */
  indicator: TrustIndicator
}

/**
 * Props for ServicePageLayout.vue (MODIFIED)
 *
 * Extended with new slots for additional sections
 */
export interface ServicePageLayoutProps {
  /** Page title */
  title: string
  /** Optional page subtitle */
  subtitle?: string
}

/**
 * Slots for ServicePageLayout.vue (MODIFIED)
 */
export interface ServicePageLayoutSlots {
  /** Existing slot for sub-service cards */
  'sub-services': undefined
  /** NEW: Slot for "How It Works" section */
  'how-it-works': undefined
  /** NEW: Slot for "Why Choose Us" section */
  'why-choose-us': undefined
  /** NEW: Slot for trust indicator badges */
  'trust-indicators': undefined
  /** Optional: Slot for additional CTA section */
  cta: undefined
}

/**
 * Example usage in component:
 *
 * <script setup lang="ts">
 * import type { HowItWorksSectionProps } from '@/types/services'
 *
 * interface Props extends HowItWorksSectionProps {}
 *
 * const props = withDefaults(defineProps<Props>(), {
 *   title: undefined
 * })
 * </script>
 */
