import type { FaqAnswer, FaqItem, FaqStructuredAnswer } from '~/types/faq'
import { resolveLocaleTag } from '~~/server/utils/locale'

/**
 * Options for FAQ extraction
 */
interface FaqOptions {
  /** Use indexed format (q1/a1, q2/a2) instead of array format */
  indexed?: boolean
  /** Number of items for indexed format */
  count?: number
}

/**
 * Unified composable for extracting data from i18n messages.
 * Consolidates functionality from useI18nList, useFaqI18n, and common patterns.
 */
export function useI18nHelpers() {
  const { t, tm, te } = useI18n()

  /**
   * Extract an array of strings from i18n
   * @param key - i18n key pointing to an array
   */
  function getListStrings(key: string): string[] {
    const raw = tm(key)
    if (!Array.isArray(raw)) return []
    return raw.map((_, idx) => t(`${key}[${idx}]`))
  }

  /**
   * Extract an array of objects with specified fields from i18n
   * @param key - i18n key pointing to an array of objects
   * @param fields - Array of field names to extract from each object
   */
  function getListObjects<T extends object>(key: string, fields: (keyof T)[]): T[] {
    const raw = tm(key)
    if (!Array.isArray(raw)) return []
    return raw.map((_, index) => {
      const obj = {} as T
      for (const field of fields) {
        ;(obj as Record<string, unknown>)[String(field)] = String(
          t(`${key}.${index}.${String(field)}`),
        )
      }
      return obj
    })
  }

  /**
   * Extract a numeric value from i18n with fallback
   * Useful for prices and other numeric data stored in i18n
   * @param key - i18n key pointing to a number
   * @param fallback - Default value if key doesn't exist or is not a number
   */
  function getNumber(key: string, fallback: number): number {
    const val = tm(key) as unknown
    return typeof val === 'number' ? val : fallback
  }

  /**
   * Check if a translation key exists
   * @param key - i18n key to check
   */
  function exists(key: string): boolean {
    return te(key)
  }

  /**
   * Get translated value with optional fallback
   * Returns empty string if key doesn't exist and no fallback provided
   * @param key - i18n key
   * @param fallback - Optional fallback value
   */
  function getOptional(key: string, fallback = ''): string {
    return te(key) ? t(key) : fallback
  }

  // ========== FAQ Functions ==========

  /**
   * Parse raw i18n message into FaqAnswer
   */
  function parseFaqAnswer(raw: unknown, fallbackPath: string): FaqAnswer {
    if (typeof raw === 'string') {
      return raw
    }

    if (raw && typeof raw === 'object') {
      const obj = raw as Record<string, unknown>

      if (obj.items || obj.title) {
        const result: FaqStructuredAnswer = {}

        if (typeof obj.title === 'string') {
          result.title = obj.title
        }

        if (Array.isArray(obj.items)) {
          result.items = obj.items.filter((item): item is string => typeof item === 'string')
        }

        if (typeof obj.ordered === 'boolean') {
          result.ordered = obj.ordered
        }

        if (result.title || (result.items && result.items.length > 0)) {
          return result
        }
      }
    }

    return t(fallbackPath)
  }

  /**
   * Get FAQ items from i18n
   * @param keyPrefix - Base path like 'services.faq' or 'universityDetail.faq'
   * @param options - { indexed: true, count: 9 } for q1/a1 format, or omit for array format
   */
  function getFaqItems(keyPrefix: string, options?: FaqOptions): FaqItem[] {
    if (options?.indexed && options.count) {
      // Indexed format: q1/a1, q2/a2, etc.
      return Array.from({ length: options.count }, (_, i) => {
        const answerPath = `${keyPrefix}.a${i + 1}`
        return {
          question: t(`${keyPrefix}.q${i + 1}`),
          answer: parseFaqAnswer(tm(answerPath), answerPath),
        }
      })
    }

    // Array format: items[0].question, items[0].answer, etc.
    const itemsKey = `${keyPrefix}.items`
    const raw = tm(itemsKey) as unknown

    if (!Array.isArray(raw)) {
      return []
    }

    return raw.map((_, index) => {
      const basePath = `${itemsKey}.${index}`
      const answerPath = `${basePath}.answer`

      return {
        question: String(t(`${basePath}.question`)),
        answer: parseFaqAnswer(tm(answerPath), answerPath),
      }
    })
  }

  /**
   * Get FAQ title and subtitle from i18n
   * @param keyPrefix - Base path like 'services.faq'
   */
  function getFaqMeta(keyPrefix: string) {
    const titleKey = `${keyPrefix}.title`
    const subtitleKey = `${keyPrefix}.subtitle`

    return {
      title: te(titleKey) ? t(titleKey) : '',
      subtitle: te(subtitleKey) ? t(subtitleKey) : '',
    }
  }

  /**
   * Format a date string or Date object according to current locale
   */
  function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
    const { locale } = useI18n()
    const d = typeof date === 'string' ? new Date(date) : date
    const formatOptions = options ?? { day: '2-digit', month: 'short', year: 'numeric' }
    try {
      return new Intl.DateTimeFormat(resolveLocaleTag(locale.value as any), formatOptions).format(d)
    } catch {
      return d.toISOString().split('T')[0]!
    }
  }

  return {
    // List extraction
    getListStrings,
    getListObjects,
    // Value extraction
    getNumber,
    getOptional,
    // FAQ extraction
    getFaqItems,
    getFaqMeta,
    // Date formatting
    formatDate,
    // Utilities
    exists,
    // Re-export original i18n functions for convenience
    t,
    tm,
    te,
  }
}
