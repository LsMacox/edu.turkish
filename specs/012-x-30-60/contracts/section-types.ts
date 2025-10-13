/**
 * Section Types Contract
 *
 * Defines the section types and their usage patterns across service pages.
 * This helps maintain consistency and documents which sections are used where.
 */

// ============================================================================
// Section Type Enum
// ============================================================================

export enum SectionType {
  // Qualification & Targeting
  WHO_IS_THIS_FOR = 'who-is-this-for',
  COURSE_GOAL = 'course-goal',
  LEVEL_PROGRESSION = 'level-progression',

  // Outcomes & Results
  EXPECTED_RESULTS = 'expected-results',
  STUDENT_RESULTS = 'student-results',

  // Process & Timeline
  TIMELINE_PLAN = 'timeline-plan',
  PROGRAM_CONTENT = 'program-content',
  FORMAT_SCHEDULE = 'format-schedule',

  // Responsibilities & Risks
  RESPONSIBILITY_MATRIX = 'responsibility-matrix',
  RISK_MITIGATION = 'risk-mitigation',

  // Social Proof & Trust
  TEACHERS = 'teachers',

  // Pricing & Requirements
  PRICE_CALCULATOR = 'price-calculator',
  UNIVERSITY_REQUIREMENTS = 'university-requirements',
  SAMPLE_DOCUMENTS = 'sample-documents',

  // FAQ
  FAQ = 'faq',
}

// ============================================================================
// Service Page Section Mapping
// ============================================================================

/**
 * Defines which sections are used on each service page
 */
export const ServicePageSections: Record<string, SectionType[]> = {
  'relocation-in-turkey': [
    SectionType.WHO_IS_THIS_FOR,
    SectionType.EXPECTED_RESULTS,
    SectionType.TIMELINE_PLAN,
    SectionType.RESPONSIBILITY_MATRIX,
    SectionType.RISK_MITIGATION,
    SectionType.FAQ,
  ],
  'tr-yos-courses': [
    SectionType.COURSE_GOAL,
    SectionType.PROGRAM_CONTENT,
    SectionType.FORMAT_SCHEDULE,
    SectionType.STUDENT_RESULTS,
    SectionType.FAQ,
  ],
  'sat-courses': [
    SectionType.COURSE_GOAL,
    SectionType.PROGRAM_CONTENT,
    SectionType.FORMAT_SCHEDULE,
    SectionType.STUDENT_RESULTS,
    SectionType.FAQ,
  ],
  'turkish-english-course': [
    SectionType.LEVEL_PROGRESSION,
    SectionType.FORMAT_SCHEDULE,
    SectionType.TEACHERS,
    SectionType.EXPECTED_RESULTS,
    SectionType.FAQ,
  ],
  'document-translations': [
    SectionType.PRICE_CALCULATOR,
    SectionType.UNIVERSITY_REQUIREMENTS,
    SectionType.SAMPLE_DOCUMENTS,
  ],
}

// ============================================================================
// Section Component Mapping
// ============================================================================

/**
 * Maps section types to their Vue component names
 */
export const SectionComponentMap: Record<SectionType, string> = {
  [SectionType.WHO_IS_THIS_FOR]: 'WhoIsThisForSection',
  [SectionType.COURSE_GOAL]: 'CourseGoalSection',
  [SectionType.LEVEL_PROGRESSION]: 'LevelProgressionSection',
  [SectionType.EXPECTED_RESULTS]: 'ExpectedResultsSection',
  [SectionType.STUDENT_RESULTS]: 'StudentResultsSection',
  [SectionType.TIMELINE_PLAN]: 'TimelinePlanSection',
  [SectionType.PROGRAM_CONTENT]: 'ProgramContentSection',
  [SectionType.FORMAT_SCHEDULE]: 'FormatScheduleSection',
  [SectionType.RESPONSIBILITY_MATRIX]: 'ResponsibilityMatrixSection',
  [SectionType.RISK_MITIGATION]: 'RiskMitigationSection',
  [SectionType.TEACHERS]: 'TeachersSection',
  [SectionType.PRICE_CALCULATOR]: 'PriceCalculatorSection',
  [SectionType.UNIVERSITY_REQUIREMENTS]: 'UniversityRequirementsSection',
  [SectionType.SAMPLE_DOCUMENTS]: 'SampleDocumentsSection',
  [SectionType.FAQ]: 'ServiceFAQSection',
}

// ============================================================================
// Section Slot Mapping
// ============================================================================

/**
 * Maps section types to their ServicePageLayout slot names
 */
export const SectionSlotMap: Record<SectionType, string> = {
  [SectionType.WHO_IS_THIS_FOR]: 'who-is-this-for',
  [SectionType.COURSE_GOAL]: 'course-goal',
  [SectionType.LEVEL_PROGRESSION]: 'level-progression',
  [SectionType.EXPECTED_RESULTS]: 'expected-results',
  [SectionType.STUDENT_RESULTS]: 'student-results',
  [SectionType.TIMELINE_PLAN]: 'timeline-plan',
  [SectionType.PROGRAM_CONTENT]: 'program-content',
  [SectionType.FORMAT_SCHEDULE]: 'format-schedule',
  [SectionType.RESPONSIBILITY_MATRIX]: 'responsibility-matrix',
  [SectionType.RISK_MITIGATION]: 'risk-mitigation',
  [SectionType.TEACHERS]: 'teachers',
  [SectionType.PRICE_CALCULATOR]: 'price-calculator',
  [SectionType.UNIVERSITY_REQUIREMENTS]: 'university-requirements',
  [SectionType.SAMPLE_DOCUMENTS]: 'sample-documents',
  [SectionType.FAQ]: 'faq',
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get all sections for a service page
 */
export function getSectionsForService(serviceName: string): SectionType[] {
  return ServicePageSections[serviceName] || []
}

/**
 * Get component name for a section type
 */
export function getComponentForSection(sectionType: SectionType): string {
  return SectionComponentMap[sectionType]
}

/**
 * Get slot name for a section type
 */
export function getSlotForSection(sectionType: SectionType): string {
  return SectionSlotMap[sectionType]
}

/**
 * Get all unique sections across all service pages
 */
export function getAllUniqueSections(): SectionType[] {
  const allSections = Object.values(ServicePageSections).flat()
  return [...new Set(allSections)]
}

/**
 * Get services that use a specific section type
 */
export function getServicesUsingSection(sectionType: SectionType): string[] {
  return Object.entries(ServicePageSections)
    .filter(([_, sections]) => sections.includes(sectionType))
    .map(([serviceName]) => serviceName)
}
