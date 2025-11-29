import type { Currency } from '~/types/currency'
export type ServiceCategoryId =
  | 'relocation-in-turkey'
  | 'tr-yos-courses'
  | 'sat-courses'
  | 'turkish-english-course'
  | 'document-translations'

export interface ServiceCategory {
  id: ServiceCategoryId
  slug: string
}

export type SubServiceId =
  // Relocation
  | 'university-admission'
  | 'relocation-standard'
  | 'relocation-vip'
  // TR-YÖS Courses
  | 'basic-package'
  | 'individual-package'
  // SAT Courses
  | 'foundation'
  | 'advanced'
  | 'elite'
  // Language Courses
  | 'a1-a2'
  | 'b1-b2'
  | 'c1-c2'
  // Document Translations
  | 'calculator-standard'
  | 'notarized-translation'
  | 'apostille-translation'
  | 'consular-legalization'

export type PackageId = 'university-admission' | 'relocation-standard' | 'relocation-vip'

export interface SubService {
  id: SubServiceId
  categoryId: ServiceCategoryId
  pricing: Record<Currency, string>
}

export interface ServiceApplicationContext {
  subServiceId?: SubServiceId
  subServiceName: string
  source: 'service-page'
  sourceDescription: string
  price?: string
}

export interface ProcessStep {
  stepNumber: number
  title: string
  description: string
  icon: string
}

export interface TrustFactor {
  title: string
  description: string
  icon: string
}

export interface I18nKeyPrefix {
  keyPrefix: string
}

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

export interface ProgramItem {
  title: string
  description: string
  icon: string
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

export interface DocumentType {
  name: string
  priceUsd: number | null // null for "by request" option
}

export interface UrgencyOption {
  name: string
  surcharge: number // USD surcharge amount (0 for standard, 10 for rush, etc.)
}

export interface ServiceCard {
  title: string
  description: string
  icon: string // Iconify icon name
}

export interface CalculatorSubmitEvent {
  selectedDocumentType: DocumentType
  selectedLanguagePair: string
  selectedUrgency: UrgencyOption
  calculatedPriceUsd: number | null
  calculatedPriceFormatted: string // "от 30$" or "По запросу"
}

export interface PriceCalculatorSectionProps extends I18nKeyPrefix {
  title?: string
  documentTypesWithPrices?: DocumentType[]
  urgencyOptions?: UrgencyOption[]
  languagePairs?: string[]
  documentTypes?: string[]
  languages?: string[]
  urgency?: string[]
  adjustments?: {
    byDocumentType?: number[]
    byLanguage?: number[]
  }
  standardPriceUsd?: number
  urgencyMultipliers?: {
    express: number
    rush: number
  }
}
