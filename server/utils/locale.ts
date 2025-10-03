import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type SupportedLocale } from '../../lib/locales'

export { SUPPORTED_LOCALES, DEFAULT_LOCALE, type SupportedLocale }

export interface NormalizedLocale {
  normalized: string
  fallbacks: string[]
}

/**
 * Locale to IETF language tag mapping for Intl APIs
 */
const LOCALE_TAGS: Record<string, string> = {
  en: 'en-GB',
  kk: 'kk-KZ',
  tr: 'tr-TR',
  ru: 'ru-RU',
}

/**
 * Normalize locale codes and provide fallback variants.
 * Provides fallbacks to Russian as the ultimate fallback.
 * Extracts base code from language tags (e.g., en-US -> en).
 */
export function normalizeLocale(input?: string | null): NormalizedLocale {
  const base = (input ?? 'ru').toLowerCase()
  const normalized = base.split(/[-_]/)[0]
  const fallbacks = [normalized, 'ru'].filter((v, i, a) => a.indexOf(v) === i)

  return {
    normalized,
    fallbacks,
  }
}

/**
 * Convert locale code to IETF language tag for Intl APIs
 * @example resolveLocaleTag('kk') // 'kk-KZ'
 */
export function resolveLocaleTag(locale: string): string {
  return LOCALE_TAGS[locale] ?? LOCALE_TAGS.ru
}

/**
 * Pick translation from array with fallback logic
 * Tries exact match first, then Russian, then first available
 */
export function pickTranslation<T extends { locale: string | null | undefined }>(
  translations: readonly T[] | null | undefined,
  locale: string,
): T | null {
  if (!translations || translations.length === 0) {
    return null
  }

  const exact = translations.find((t) => t.locale === locale)
  if (exact) {
    return exact
  }

  const russian = translations.find((t) => t.locale === 'ru')
  if (russian) {
    return russian
  }

  return translations[0] ?? null
}

/**
 * Find translation using normalized locale with fallbacks
 * More advanced than pickTranslation - uses fallback chain
 */
export function findTranslation<T extends { locale: string | null | undefined }>(
  translations: readonly T[] | null | undefined,
  localeInfo: NormalizedLocale,
): T | undefined {
  if (!translations?.length) {
    return undefined
  }

  const localesToCheck = Array.from(new Set([...localeInfo.fallbacks, 'ru']))

  for (const candidate of localesToCheck) {
    const match = translations.find((t) => t.locale === candidate)
    if (match) {
      return match
    }
  }

  return undefined
}
