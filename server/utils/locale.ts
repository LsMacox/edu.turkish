import type { Prisma } from '@prisma/client'
import { SUPPORTED_LOCALES, type SupportedLocale } from '~~/lib/locales'

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
  locale: string,
): T | null {
  if (!translations?.length) return null
  return translations.find((t) => t.locale === locale) ?? translations.find((t) => t.locale === 'ru') ?? translations[0] ?? null
}

export function selectTranslation<T extends { locale: string | null | undefined }>(
  translations: readonly T[] | null | undefined,
  locale: NormalizedLocale,
): T | null {
  if (!translations?.length) return null
  return translations.find((t) => t.locale === locale.normalized) ?? null
}

export function getSlugForLocale(
  translations: Array<{ locale: string | null | undefined; slug: string | null | undefined }>,
  locale: NormalizedLocale,
): string {
  return translations.find((t) => t.locale === locale.normalized && t.slug)?.slug ?? ''
}

export const decimalToNumber = (value: Prisma.Decimal | number | null | undefined): number =>
  value == null ? 0 : typeof value === 'number' ? value : Number(value)

export const asRecord = (value: Prisma.JsonValue | null | undefined): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null

export const extractStringRecord = (value: Prisma.JsonValue | null | undefined): Record<string, string> | undefined => {
  const record = asRecord(value)
  if (!record) return undefined
  const entries = Object.entries(record).filter(([, v]) => typeof v === 'string')
  return entries.length > 0 ? (Object.fromEntries(entries) as Record<string, string>) : undefined
}

export const extractStringArray = (value: Prisma.JsonValue | null | undefined): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
