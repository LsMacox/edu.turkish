import type { UserType } from '@prisma/client'
import type { ServiceApplicationContext } from './services'

export interface ApplicationPreferences {
  source: FormSource | 'service-page'
  description: string
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
  university_detail: 'Заявка с детальной страницы университета',
  service_page: 'Заявка со страницы услуг',
  about_hero: 'Заявка из Hero-секции страницы О нас',
} as const

export type FormSource = keyof typeof FORM_SOURCES
