import { SUPPORTED_LOCALES, type SupportedLocale } from '~~/lib/config/locales'

type LocaleKeys = {
  [key in SupportedLocale]: string
}

export interface NormalizedLocale {
  normalized: SupportedLocale
  fallbacks: SupportedLocale[]
}

const LOCALE_TAGS: LocaleKeys = {
  en: 'en-GB',
  kk: 'kk-KZ',
  tr: 'tr-TR',
  ru: 'ru-RU',
}

export function normalizeLocale(input?: string | null): NormalizedLocale {
  const raw = (input ?? '').trim()
  if (!raw) {
    return { normalized: 'ru', fallbacks: ['ru'] }
  }
  const parts = raw.toLowerCase().split(/[-_]/)
  const base = (parts[0] ?? '') as string
  const isSupported = (SUPPORTED_LOCALES as readonly string[]).includes(base)
  if (!isSupported) {
    return { normalized: 'ru', fallbacks: ['ru'] }
  }
  const normalized = base as SupportedLocale
  const fallbacks = [normalized, 'ru'].filter((v, i, a) => a.indexOf(v) === i) as SupportedLocale[]
  return { normalized, fallbacks }
}

export function resolveLocaleTag(locale: SupportedLocale): string {
  return LOCALE_TAGS[locale] ?? LOCALE_TAGS.ru
}

export function pickTranslation<T extends { locale: string | null | undefined }>(
  translations: readonly T[] | null | undefined,
  locale: string | NormalizedLocale,
  useFallback = true,
): T | null {
  if (!translations?.length) return null
  const localeStr = typeof locale === 'string' ? locale : locale.normalized
  const exact = translations.find((t) => t.locale === localeStr)
  if (exact || !useFallback) return exact ?? null
  return translations.find((t) => t.locale === 'ru') ?? translations[0] ?? null
}

export function getSlugForLocale(
  translations: Array<{ locale: string | null | undefined; slug: string | null | undefined }>,
  locale: NormalizedLocale,
): string {
  return translations.find((t) => t.locale === locale.normalized && t.slug)?.slug ?? ''
}

export function formatDate(
  date: Date | string,
  locale: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const formatOptions = options ?? { day: '2-digit', month: 'short', year: 'numeric' }
  try {
    return new Intl.DateTimeFormat(resolveLocaleTag(locale as SupportedLocale), formatOptions).format(d)
  } catch {
    return d.toISOString().split('T')[0]!
  }
}
