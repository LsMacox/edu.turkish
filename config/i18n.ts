import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '../lib/config/locales'

type LocaleCode = (typeof SUPPORTED_LOCALES)[number]

/**
 * Locale file mappings - static configuration
 * Each locale has the same flat file structure (no subdirectories)
 */
const LOCALE_FILES = [
  'common.json',
  'components.json',
  'home.json',
  'about.json',
  'universities.json',
  'blog.json',
  'programs.json',
  'reviews.json',
  'services.json',
  'faq.json',
  'contract.json',
  'privacy.json',
] as const

function getLanguageTag(code: LocaleCode): string {
  const languageMap: Record<LocaleCode, string> = {
    kk: 'kk-KZ',
    ru: 'ru-RU',
    en: 'en-US',
    tr: 'tr-TR',
  }
  return languageMap[code]
}

function getLocaleFiles(code: LocaleCode): string[] {
  return LOCALE_FILES.map((file) => `${code}/${file}`)
}

/**
 * I18n module configuration
 * Returns config object for @nuxtjs/i18n module
 */
export function createI18nConfig(siteUrl: string) {
  return {
    baseUrl: siteUrl,
    langDir: 'locales',
    locales: SUPPORTED_LOCALES.map((code) => ({
      code,
      language: getLanguageTag(code),
      files: getLocaleFiles(code),
    })),
    defaultLocale: DEFAULT_LOCALE,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
    },
    strategy: 'prefix',
  }
}
