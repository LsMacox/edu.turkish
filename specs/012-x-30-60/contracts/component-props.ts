/**
 * Component Props Contracts
 *
 * TypeScript interfaces for all new service page section components.
 * These define the expected props and their types.
 */

// ============================================================================
// Common Types
// ============================================================================

export interface I18nKeyPrefix {
  /** Base i18n key prefix for the section (e.g., 'services.relocation-in-turkey.whoIsThisFor') */
  keyPrefix: string
}

export interface Icon {
  /** Iconify icon name (e.g., 'mdi:calendar-check') */
  icon: string
}

// ============================================================================
// Section Component Props
// ============================================================================

/**
 * WhoIsThisForSection
 * Displays a list of qualifying criteria for a service
 */
export interface WhoIsThisForSectionProps extends I18nKeyPrefix {
  /** Optional: Override title (defaults to i18n key) */
  title?: string
}

/**
 * ExpectedResultsSection
 * Displays a list of deliverables/outcomes with optional duration options
 */
export interface ExpectedResultsSectionProps extends I18nKeyPrefix {
  /** Optional: Override title (defaults to i18n key) */
  title?: string
  /** Optional: Show duration selector (e.g., for curator support) */
  showDurationOptions?: boolean
}

/**
 * TimelinePlanSection
 * Displays a phased timeline (weeks/milestones) with activities
 */
export interface TimelinePlanSectionProps extends I18nKeyPrefix {
  /** Optional: Override title (defaults to i18n key) */
  title?: string
  /** Optional: Timeline unit (default: 'week') */
  unit?: 'week' | 'day' | 'phase'
}

/**
 * ResponsibilityMatrixSection
 * Two-column layout showing "We Do" vs "You Do" responsibilities
 */
export interface ResponsibilityMatrixSectionProps extends I18nKeyPrefix {
  /** Optional: Override title (defaults to i18n key) */
  title?: string
}

/**
 * RiskMitigationSection
 * Displays risk scenarios with mitigation strategies
 */
export interface RiskMitigationSectionProps extends I18nKeyPrefix {
  /** Optional: Override title (defaults to i18n key) */
  title?: string
}

/**
 * CourseGoalSection
 * Displays target scores/levels with package tiers
 */
export interface CourseGoalSectionProps extends I18nKeyPrefix {
  /** Optional: Override title (defaults to i18n key) */
  title?: string
  /** Optional: Show as cards vs list */
  layout?: 'cards' | 'list'
}

/**
 * ProgramContentSection
 * Curriculum breakdown with icons
 */
export interface ProgramContentSectionProps extends I18nKeyPrefix {
  /** Optional: Override title (defaults to i18n key) */
  title?: string
  /** Optional: Grid columns (default: 2) */
  columns?: 2 | 3 | 4
}

/**
 * FormatScheduleSectionProps
 * Course format details (online/offline, schedule, etc.)
 */
export interface FormatScheduleSectionProps extends I18nKeyPrefix {
  /** Optional: Override title (defaults to i18n key) */
  title?: string
}

/**
 * StudentResultsSection
 * Case studies with before/after metrics and proof
 */
export interface StudentResultsSectionProps extends I18nKeyPrefix {
  /** Optional: Override title (defaults to i18n key) */
  title?: string
  /** Optional: Show images/proof */
  showProof?: boolean
}

/**
 * LevelProgressionSection
 * CEFR level progression with outcomes
 */
export interface LevelProgressionSectionProps extends I18nKeyPrefix {
  /** Optional: Override title (defaults to i18n key) */
  title?: string
}

/**
 * TeachersSection
 * Teacher profiles with photos and achievements
 */
export interface TeachersSectionProps extends I18nKeyPrefix {
  /** Optional: Override title (defaults to i18n key) */
  title?: string
  /** Optional: Show methodology paragraph */
  showMethodology?: boolean
}

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

/**
 * ServiceFAQSection
 * Accordion-style FAQ list
 */
export interface ServiceFAQSectionProps extends I18nKeyPrefix {
  /** Optional: Override title (defaults to i18n key) */
  title?: string
  /** Optional: Default expanded state */
  defaultExpanded?: boolean
}

// ============================================================================
// Data Structures (from i18n)
// ============================================================================

export interface TimelineWeek {
  number: number
  activities: string
}

export interface ResponsibilityItem {
  title: string
  items: string[]
}

export interface RiskItem {
  risk: string
  mitigation: string
}

export interface PackageTier {
  name: string
  targetScore: string
}

export interface ProgramItem extends Icon {
  title: string
  description: string
}

export interface CaseStudy {
  before?: number
  after?: number
  score?: number
  duration?: string
  proof?: string
  admission?: string
}

export interface LevelProgression {
  from: string
  to: string
  outcome: string
}

export interface TeacherProfile {
  name: string
  photo: string
  achievements: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface SampleDocument {
  type: string
  image: string
}
