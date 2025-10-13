/**
 * Service Pages Types
 * Multi-currency pricing and service category structures
 */

import type { Currency } from '~/types/currency'

/**
 * Main service categories shown in navigation dropdown
 * Maps to pages in app/pages/services/
 */
export type ServiceCategoryId =
  | 'relocation-in-turkey'
  | 'tr-yos-courses'
  | 'sat-courses'
  | 'turkish-english-course'
  | 'document-translations'

/**
 * Service category structure
 */
export interface ServiceCategory {
  id: ServiceCategoryId
  slug: string // URL slug (same as id)
  // Title and subtitle come from i18n: services.{id}.title, services.{id}.subtitle
}

/**
 * Individual service offerings under a category
 * Each has own description, pricing, and can trigger application modal
 */
export type SubServiceId =
  // Relocation services
  | 'relocation-visa-support'
  | 'relocation-housing-assistance'
  | 'relocation-bank-account'
  | 'relocation-residence-permit'
  // TR-YÖS Courses
  | 'tr-yos-basic-preparation'
  | 'tr-yos-advanced-preparation'
  | 'tr-yos-individual-tutoring'
  | 'tr-yos-mock-exams'
  // SAT Courses
  | 'sat-basic-preparation'
  | 'sat-advanced-preparation'
  | 'sat-individual-tutoring'
  // Language Courses
  | 'language-turkish-beginner'
  | 'language-turkish-intermediate'
  | 'language-english-beginner'
  | 'language-english-intermediate'
  // Document Translations
  | 'translation-diploma'
  | 'translation-transcript'
  | 'translation-passport'
  | 'translation-other-documents'

/**
 * Sub-service structure
 */
export interface SubService {
  id: SubServiceId
  categoryId: ServiceCategoryId
  pricing: Record<Currency, string> // String to preserve formatting (e.g., "1,500")
  // Name and description come from i18n: services.{categoryId}.subServices.{id}.name/description
}

/**
 * Extended application preferences to include sub-service context
 * Passed to ApplicationModal when user clicks "Apply" on a sub-service
 */
export interface ServiceApplicationContext {
  subServiceId: SubServiceId
  subServiceName: string // Localized name for display
  source: 'service-page'
  sourceDescription: string // Full description for CRM (e.g., "TR-YÖS Basic Preparation")
}

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
 * Extended SubService interface with delivery timeframe
 */
export interface SubServiceWithDelivery extends SubService {
  /** Human-readable delivery timeframe (e.g., "1–2 дня") */
  deliveryTime: string
}

// ============================================================================
// New Section Component Types (Feature 012-x-30-60)
// ============================================================================

/**
 * Common i18n key prefix interface for section components
 */
export interface I18nKeyPrefix {
  /** Base i18n key prefix for the section (e.g., 'services.relocation-in-turkey.whoIsThisFor') */
  keyPrefix: string
}

/**
 * Timeline week structure for TimelinePlanSection
 */
export interface TimelineWeek {
  number: number
  activities: string
}

/**
 * Responsibility item structure for ResponsibilityMatrixSection
 */
export interface ResponsibilityItem {
  title: string
  items: string[]
}

/**
 * Risk item structure for RiskMitigationSection
 */
export interface RiskItem {
  risk: string
  mitigation: string
}

/**
 * Package tier structure for CourseGoalSection
 */
export interface PackageTier {
  name: string
  targetScore: string
}

/**
 * Program item structure for ProgramContentSection
 */
export interface ProgramItem {
  title: string
  description: string
  icon: string
}

/**
 * Case study structure for StudentResultsSection
 */
export interface CaseStudy {
  before?: number
  after?: number
  score?: number
  duration?: string
  proof?: string
  admission?: string
}

/**
 * Level progression structure for LevelProgressionSection
 */
export interface LevelProgression {
  from: string
  to: string
  outcome: string
}

/**
 * Teacher profile structure for TeachersSection
 */
export interface TeacherProfile {
  name: string
  photo: string
  achievements: string
}

/**
 * FAQ item structure for ServiceFAQSection
 */
export interface FAQItem {
  question: string
  answer: string
}

/**
 * Sample document structure for SampleDocumentsSection
 */
export interface SampleDocument {
  type: string
  image: string
}

// ============================================================================
// Section Component Props (Feature 012-x-30-60)
// ============================================================================

/**
 * PriceCalculatorSection
 * Interactive calculator for document pricing
 */
export interface PriceCalculatorSectionProps extends I18nKeyPrefix {
  /** Optional: Override title (defaults to i18n key) */
  title?: string
}

/**
 * UniversityRequirementsSection
 * List of accepted formats and requirements
 */
export interface UniversityRequirementsSectionProps extends I18nKeyPrefix {
  /** Optional: Override title (defaults to i18n key) */
  title?: string
}

/**
 * SampleDocumentsSection
 * Gallery of anonymized document samples
 */
export interface SampleDocumentsSectionProps extends I18nKeyPrefix {
  /** Optional: Override title (defaults to i18n key) */
  title?: string
  /** Optional: Gallery layout */
  layout?: 'grid' | 'carousel'
}
