import type { Prisma } from '@prisma/client'
import { SUPPORTED_LOCALES, type SupportedLocale } from '~~/lib/locales'
import type { NormalizedLocale } from './locale'

export const SUPPORTED_LOCALE_SET = new Set<SupportedLocale>(SUPPORTED_LOCALES)

export const isSupportedLocale = (value: string): value is SupportedLocale =>
  SUPPORTED_LOCALE_SET.has(value as SupportedLocale)

export const resolveSupportedLocale = (
  locale: NormalizedLocale,
): SupportedLocale | null => (isSupportedLocale(locale.normalized) ? locale.normalized : null)

export const selectTranslation = <T extends { locale: string | null | undefined }>(
  translations: readonly T[] | null | undefined,
  locale: NormalizedLocale,
): T | null => {
  if (!translations?.length) {
    return null
  }

  const targetLocale = resolveSupportedLocale(locale) ?? locale.normalized

  return translations.find((translation) => translation.locale === targetLocale) ?? null
}

export const getSlugForLocale = (
  translations: Array<{ locale: string | null | undefined; slug: string | null | undefined }>,
  locale: NormalizedLocale,
): string => {
  const targetLocale = resolveSupportedLocale(locale) ?? locale.normalized
  const match = translations.find(
    (translation) => translation.locale === targetLocale && translation.slug,
  )
  return match?.slug ?? ''
}

export const decimalToNumber = (value: Prisma.Decimal | number | null | undefined): number => {
  if (value == null) return 0
  return typeof value === 'number' ? value : Number(value)
}

export const asRecord = (
  value: Prisma.JsonValue | null | undefined,
): Record<string, unknown> | null => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return null
}

export const extractStringRecord = (
  value: Prisma.JsonValue | null | undefined,
): Record<string, string> | undefined => {
  const record = asRecord(value)
  if (!record) {
    return undefined
  }

  const entries = Object.entries(record).filter(([, v]) => typeof v === 'string')
  return entries.length > 0 ? (Object.fromEntries(entries) as Record<string, string>) : undefined
}

export const extractStringArray = (value: Prisma.JsonValue | null | undefined): string[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === 'string')
}

