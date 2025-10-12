import type { UniversityImportantDate } from '~~/server/types/api'
import type { SupportedLocale } from '~~/lib/locales'
import enUniversitiesPage from '~~/i18n/locales/en/pages/universities.json'
import kkUniversitiesPage from '~~/i18n/locales/kk/pages/universities.json'
import ruUniversitiesPage from '~~/i18n/locales/ru/pages/universities.json'
import trUniversitiesPage from '~~/i18n/locales/tr/pages/universities.json'

type UniversitiesPageTranslation = (typeof enUniversitiesPage)['universities_page']
export type UniversitiesFilterTranslation = UniversitiesPageTranslation['filters']

export const UNIVERSITIES_PAGE_TRANSLATIONS: Record<SupportedLocale, UniversitiesPageTranslation> =
  {
    en: enUniversitiesPage.universities_page,
    ru: ruUniversitiesPage.universities_page,
    kk: kkUniversitiesPage.universities_page,
    tr: trUniversitiesPage.universities_page,
  }

export const FEATURED_PROGRAM_CATEGORY: Record<SupportedLocale, string> = {
  en: enUniversitiesPage.universities_page.featured_programs_category ?? '',
  ru: ruUniversitiesPage.universities_page.featured_programs_category ?? '',
  kk: kkUniversitiesPage.universities_page.featured_programs_category ?? '',
  tr: trUniversitiesPage.universities_page.featured_programs_category ?? '',
}

export const IMPORTANT_DATE_TYPE_MAP: Record<string, UniversityImportantDate['deadline_type']> = {
  deadline: 'application',
  event: 'document',
  exam: 'exam',
  notification: 'notification',
}
