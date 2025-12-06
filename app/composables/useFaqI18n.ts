import type { FaqAnswer, FaqItem, FaqStructuredAnswer } from '~/types/faq'

/**
 * Composable for working with FAQ data from i18n
 */
export function useFaqI18n() {
  const { t, tm, te } = useI18n()

  /**
   * Parse raw i18n message into FaqAnswer
   */
  function parseAnswer(raw: unknown, fallbackPath: string): FaqAnswer {
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
   * Resolve answer from i18n path
   */
  function resolveAnswer(path: string): FaqAnswer {
    const message = tm(path)
    return parseAnswer(message, path)
  }

  /**
   * Get FAQ items from i18n using indexed keys (q1/a1, q2/a2, etc.)
   * @param keyPrefix - Base path like 'universityDetail.faq'
   * @param count - Number of FAQ items
   */
  function getFaqItemsIndexed(keyPrefix: string, count: number): FaqItem[] {
    return Array.from({ length: count }, (_, i) => ({
      question: t(`${keyPrefix}.q${i + 1}`),
      answer: resolveAnswer(`${keyPrefix}.a${i + 1}`),
    }))
  }

  /**
   * Get FAQ items from i18n array structure
   * @param keyPrefix - Base path like 'services.faq'
   */
  function getFaqItemsArray(keyPrefix: string): FaqItem[] {
    const itemsKey = `${keyPrefix}.items`
    const raw = tm(itemsKey) as unknown

    if (!Array.isArray(raw)) {
      return []
    }

    return raw.map((_, index) => {
      const basePath = `${itemsKey}.${index}`
      const answer = tm(`${basePath}.answer`) as unknown

      return {
        question: String(t(`${basePath}.question`)),
        answer: parseAnswer(answer, `${basePath}.answer`),
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

  return {
    parseAnswer,
    resolveAnswer,
    getFaqItemsIndexed,
    getFaqItemsArray,
    getFaqMeta,
  }
}
