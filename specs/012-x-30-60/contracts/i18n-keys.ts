/**
 * i18n Keys Contract
 *
 * Defines the expected i18n key structure for all service page sections.
 * This serves as documentation and can be used for contract testing.
 */

// ============================================================================
// Service-Specific Key Structures
// ============================================================================

/**
 * Relocation to Turkey Service Keys
 * Base: services.relocation-in-turkey
 */
export const RelocationInTurkeyKeys = {
  whoIsThisFor: {
    title: 'services.relocation-in-turkey.whoIsThisFor.title',
    criteria: 'services.relocation-in-turkey.whoIsThisFor.criteria', // array
  },
  expectedResults: {
    title: 'services.relocation-in-turkey.expectedResults.title',
    items: 'services.relocation-in-turkey.expectedResults.items', // array
    durationOptions: 'services.relocation-in-turkey.expectedResults.durationOptions', // array
  },
  timelinePlan: {
    title: 'services.relocation-in-turkey.timelinePlan.title',
    weeks: 'services.relocation-in-turkey.timelinePlan.weeks', // array of { number, activities }
  },
  responsibilityMatrix: {
    title: 'services.relocation-in-turkey.responsibilityMatrix.title',
    weDo: {
      title: 'services.relocation-in-turkey.responsibilityMatrix.weDo.title',
      items: 'services.relocation-in-turkey.responsibilityMatrix.weDo.items', // array
    },
    youDo: {
      title: 'services.relocation-in-turkey.responsibilityMatrix.youDo.title',
      items: 'services.relocation-in-turkey.responsibilityMatrix.youDo.items', // array
    },
  },
  riskMitigation: {
    title: 'services.relocation-in-turkey.riskMitigation.title',
    risks: 'services.relocation-in-turkey.riskMitigation.risks', // array of { risk, mitigation }
  },
  faq: {
    title: 'services.relocation-in-turkey.faq.title',
    items: 'services.relocation-in-turkey.faq.items', // array of { question, answer }
  },
} as const

/**
 * TR-YÖS Courses Service Keys
 * Base: services.tr-yos-courses
 */
export const TrYosCoursesKeys = {
  courseGoal: {
    title: 'services.tr-yos-courses.courseGoal.title',
    description: 'services.tr-yos-courses.courseGoal.description',
    packages: 'services.tr-yos-courses.courseGoal.packages', // array of { name, targetScore }
  },
  programContent: {
    title: 'services.tr-yos-courses.programContent.title',
    items: 'services.tr-yos-courses.programContent.items', // array of { title, description, icon }
  },
  formatSchedule: {
    title: 'services.tr-yos-courses.formatSchedule.title',
    format: 'services.tr-yos-courses.formatSchedule.format',
    duration: 'services.tr-yos-courses.formatSchedule.duration',
    homework: 'services.tr-yos-courses.formatSchedule.homework',
    support: 'services.tr-yos-courses.formatSchedule.support',
  },
  studentResults: {
    title: 'services.tr-yos-courses.studentResults.title',
    cases: 'services.tr-yos-courses.studentResults.cases', // array of { before, after, duration, proof }
  },
  faq: {
    title: 'services.tr-yos-courses.faq.title',
    items: 'services.tr-yos-courses.faq.items', // array of { question, answer }
  },
} as const

/**
 * SAT Courses Service Keys
 * Base: services.sat-courses
 */
export const SatCoursesKeys = {
  courseGoal: {
    title: 'services.sat-courses.courseGoal.title',
    description: 'services.sat-courses.courseGoal.description',
    packages: 'services.sat-courses.courseGoal.packages', // array of { name, targetScore }
  },
  programContent: {
    title: 'services.sat-courses.programContent.title',
    items: 'services.sat-courses.programContent.items', // array of { title, description, icon }
  },
  formatSchedule: {
    title: 'services.sat-courses.formatSchedule.title',
    enrollmentSchedule: 'services.sat-courses.formatSchedule.enrollmentSchedule',
    duration: 'services.sat-courses.formatSchedule.duration',
    recordings: 'services.sat-courses.formatSchedule.recordings',
    taskBank: 'services.sat-courses.formatSchedule.taskBank',
  },
  studentResults: {
    title: 'services.sat-courses.studentResults.title',
    cases: 'services.sat-courses.studentResults.cases', // array of { score, proof, admission }
  },
  faq: {
    title: 'services.sat-courses.faq.title',
    items: 'services.sat-courses.faq.items', // array of { question, answer }
  },
} as const

/**
 * Turkish/English Language Courses Service Keys
 * Base: services.turkish-english-course
 */
export const LanguageCoursesKeys = {
  levelProgression: {
    title: 'services.turkish-english-course.levelProgression.title',
    levels: 'services.turkish-english-course.levelProgression.levels', // array of { from, to, outcome }
  },
  formatSchedule: {
    title: 'services.turkish-english-course.formatSchedule.title',
    groupSize: 'services.turkish-english-course.formatSchedule.groupSize',
    individual: 'services.turkish-english-course.formatSchedule.individual',
    conversationClubs: 'services.turkish-english-course.formatSchedule.conversationClubs',
    schedule: 'services.turkish-english-course.formatSchedule.schedule',
    platform: 'services.turkish-english-course.formatSchedule.platform',
    certificate: 'services.turkish-english-course.formatSchedule.certificate',
  },
  teachers: {
    title: 'services.turkish-english-course.teachers.title',
    methodology: 'services.turkish-english-course.teachers.methodology',
    profiles: 'services.turkish-english-course.teachers.profiles', // array of { name, photo, achievements }
  },
  expectedResults: {
    title: 'services.turkish-english-course.expectedResults.title',
    duration: 'services.turkish-english-course.expectedResults.duration',
    skills: 'services.turkish-english-course.expectedResults.skills', // array
  },
  faq: {
    title: 'services.turkish-english-course.faq.title',
    items: 'services.turkish-english-course.faq.items', // array of { question, answer }
  },
} as const

/**
 * Document Translations Service Keys
 * Base: services.document-translations
 */
export const DocumentTranslationsKeys = {
  priceCalculator: {
    title: 'services.document-translations.priceCalculator.title',
    documentTypes: 'services.document-translations.priceCalculator.documentTypes', // array
    languages: 'services.document-translations.priceCalculator.languages', // array
    urgency: 'services.document-translations.priceCalculator.urgency', // array
    basePrices: {
      standard: 'services.document-translations.priceCalculator.basePrices.standard', // { KZT, TRY, RUB, USD }
      express: 'services.document-translations.priceCalculator.basePrices.express', // { KZT, TRY, RUB, USD }
      rush: 'services.document-translations.priceCalculator.basePrices.rush', // { KZT, TRY, RUB, USD }
    },
  },
  universityRequirements: {
    title: 'services.document-translations.universityRequirements.title',
    formats: 'services.document-translations.universityRequirements.formats', // array
    acceptedBy: 'services.document-translations.universityRequirements.acceptedBy',
  },
  sampleDocuments: {
    title: 'services.document-translations.sampleDocuments.title',
    samples: 'services.document-translations.sampleDocuments.samples', // array of { type, image }
  },
} as const

// ============================================================================
// Contract Test Helpers
// ============================================================================

/**
 * All service keys for contract testing
 */
export const AllServiceKeys = {
  'relocation-in-turkey': RelocationInTurkeyKeys,
  'tr-yos-courses': TrYosCoursesKeys,
  'sat-courses': SatCoursesKeys,
  'turkish-english-course': LanguageCoursesKeys,
  'document-translations': DocumentTranslationsKeys,
} as const

/**
 * Required locales
 */
export const REQUIRED_LOCALES = ['en', 'ru', 'kk', 'tr'] as const

/**
 * Helper to extract all leaf key paths from a nested object
 */
export function extractKeyPaths(obj: Record<string, any>, prefix = ''): string[] {
  const paths: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'string') {
      paths.push(value)
    } else if (typeof value === 'object' && value !== null) {
      paths.push(...extractKeyPaths(value, fullKey))
    }
  }

  return paths
}

/**
 * Get all required i18n keys for contract testing
 */
export function getAllRequiredKeys(): string[] {
  const allKeys: string[] = []

  for (const serviceKeys of Object.values(AllServiceKeys)) {
    allKeys.push(...extractKeyPaths(serviceKeys))
  }

  return [...new Set(allKeys)] // deduplicate
}
