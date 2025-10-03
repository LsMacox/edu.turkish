import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type SupportedLocale } from '../../lib/locales'

export { SUPPORTED_LOCALES, DEFAULT_LOCALE, type SupportedLocale }

export interface NormalizedLocale {
  normalized: string
  fallbacks: string[]
}

/**
 * Normalize locale codes and provide fallback variants.
 * Provides fallbacks to Russian as the ultimate fallback.
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
