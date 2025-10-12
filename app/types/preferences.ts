import type { UserType } from './domain'
import type { ServiceApplicationContext } from './services'

// Simple preference interface for basic forms
export interface SimplePreferences {
  source: string
  description: string
}

// Questionnaire data from HomeWho component
export interface QuestionnairePreferences extends SimplePreferences {
  source: 'home_questionnaire'
  userType: UserType
  universityChosen: 'yes' | 'no'
  language: 'turkish' | 'english' | 'both'
  scholarship: 'yes' | 'no'
}

// Enhanced application preferences with validation and metadata
export interface ApplicationPreferences {
  source: FormSource | 'service-page'
  description: string
  timestamp?: Date
  metadata?: Record<string, any>
  // University-specific preferences
  universityName?: string
  universityCity?: string
  universityTuition?: number
  // User information
  userType?: UserType
  // Questionnaire responses
  universityChosen?: 'yes' | 'no'
  language?: 'turkish' | 'english' | 'both'
  scholarship?: 'yes' | 'no'
  // Service-specific context (for service pages)
  serviceContext?: ServiceApplicationContext
}

// Union type for all preferences (maintaining backward compatibility)
export type LegacyApplicationPreferences = SimplePreferences | QuestionnairePreferences

// Form sources with descriptions
export const FORM_SOURCES = {
  universities_cta: 'Заявка из CTA секции страницы университетов',
  universities_not_found: 'Запрос персональной подборки университетов',
  home_questionnaire: 'Заявка на основе анкеты с главной страницы',
  home_faq: 'Заявка из блока FAQ на главной странице',
  university_detail: 'Заявка с детальной страницы университета',
  service_page: 'Заявка со страницы услуг',
} as const

export type FormSource = keyof typeof FORM_SOURCES

// FAQ Search Types - Simplified with string answers
export interface FAQItem {
  id: string
  category: string
  question: string
  answer: string // Always HTML string format
  keywords: string[]
  type?: 'simple' | 'complex'
  relevanceScore?: number
}

export interface FAQCategory {
  key: string
  label: string
  icon: string
  items: FAQItem[]
}

export interface SearchState {
  searchQuery: string
  activeCategory: string
  isSearching: boolean
  searchResults: FAQItem[]
  resultCount: number
  searchHistory: string[]
}

export interface SearchOptions {
  debounceMs?: number
  maxHistory?: number
  highlightTags?: { open: string; close: string }
}

// Form submission data interface
export interface FormSubmissionData {
  name: string
  phone: string
  email: string
  message?: string
  privacyAgreement: boolean
  preferences?: ApplicationPreferences
  timestamp: Date
}

// Form validation schema
export interface FormValidationSchema {
  name: {
    required: boolean
    minLength?: number
    maxLength?: number
  }
  phone: {
    required: boolean
    pattern?: RegExp
  }
  email: {
    required: boolean
    pattern?: RegExp
  }
  privacyAgreement: {
    required: boolean
  }
}

// Default form validation schema
export const DEFAULT_FORM_VALIDATION: FormValidationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  phone: {
    required: true,
    // E.164: + followed by 8 to 15 digits
    pattern: /^\+[1-9]\d{7,14}$/,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  privacyAgreement: {
    required: true,
  },
}
