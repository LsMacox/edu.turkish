/**
 * Service Pages Types
 * Multi-currency pricing and service category structures
 */

/**
 * Supported currencies for pricing display
 */
export type Currency = 'KZT' | 'TRY' | 'RUB' | 'USD'

/**
 * Currency information with symbol and label
 */
export interface CurrencyInfo {
  code: Currency
  symbol: string
  label: string // Localized name (e.g., "Tenge", "Lira")
}

/**
 * All supported currencies with their display information
 */
export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  KZT: { code: 'KZT', symbol: '₸', label: 'Tenge' },
  TRY: { code: 'TRY', symbol: '₺', label: 'Lira' },
  RUB: { code: 'RUB', symbol: '₽', label: 'Ruble' },
  USD: { code: 'USD', symbol: '$', label: 'Dollar' },
}

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
