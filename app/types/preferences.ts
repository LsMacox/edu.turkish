import type { UserType } from '@prisma/client'
import type { ServiceApplicationContext } from './services'

export interface SimplePreferences {
  source: string
  description: string
}

export interface QuestionnairePreferences extends SimplePreferences {
  source: 'home_questionnaire'
  userType: UserType
  universityChosen: 'yes' | 'no'
  language: 'turkish' | 'english' | 'both'
  scholarship: 'yes' | 'no'
}

export interface ApplicationPreferences {
  source: FormSource | 'service-page'
  description: string
  timestamp?: Date
  metadata?: Record<string, unknown>
  universityName?: string
  universityCity?: string
  universityTuition?: number
  userType?: UserType
  universityChosen?: 'yes' | 'no'
  language?: 'turkish' | 'english' | 'both'
  scholarship?: 'yes' | 'no'
  serviceContext?: ServiceApplicationContext
}

export const FORM_SOURCES = {
  universities_cta: 'Заявка из CTA секции страницы университетов',
  universities_not_found: 'Запрос персональной подборки университетов',
  home_questionnaire: 'Заявка на основе анкеты с главной страницы',
  home_faq: 'Заявка из блока FAQ на главной странице',
  university_detail: 'Заявка с детальной страницы университета',
  service_page: 'Заявка со страницы услуг',
  about_hero: 'Заявка из Hero-секции страницы О нас',
} as const

export type FormSource = keyof typeof FORM_SOURCES

export interface FAQItem {
  id: string
  category: string
  question: string
  answer: string
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

export interface FormSubmissionData {
  name: string
  phone: string
  email: string
  message?: string
  privacyAgreement: boolean
  preferences?: ApplicationPreferences
  timestamp: Date
}
