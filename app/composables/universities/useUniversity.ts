import {
  TYPE_LABEL_KEYS,
  LEVEL_LABEL_KEYS,
  LANGUAGE_LABEL_KEYS,
} from '~~/lib/universities/constants'
import { formatNumber, formatPrice } from '~~/lib/number'

/**
 * Unified composable for university-related utilities:
 * - Formatting (prices, durations)
 * - Label translations (types, levels, languages)
 */
export function useUniversity() {
  const { t } = useI18n()

  // ============================================================================
  // FORMATTING
  // ============================================================================

  /**
   * Format tuition with "from" prefix (localized)
   */
  const formatTuitionFrom = (tuition: number): string => {
    if (tuition <= 0) return ''
    return t('universities_page.tuitionFrom', { price: formatNumber(tuition) })
  }

  /**
   * Format program duration in years
   */
  const formatDuration = (years: number): string => {
    return t('universityDetail.programDuration.durationYears', { count: years })
  }

  // ============================================================================
  // LABEL TRANSLATIONS
  // ============================================================================

  /**
   * Get translated label from a key map
   */
  const getLabel = (map: Record<string, string>, key: string): string => {
    const translationKey = map[key] ?? map[key.toUpperCase()]
    return translationKey ? t(translationKey) : key
  }

  /**
   * Get translated university type label
   */
  const getTypeLabel = (type: string): string => getLabel(TYPE_LABEL_KEYS, type)

  /**
   * Get translated education level label
   */
  const getLevelLabel = (level: string): string => getLabel(LEVEL_LABEL_KEYS, level)

  /**
   * Get translated language label
   */
  const getLanguageLabel = (lang: string): string =>
    getLabel(LANGUAGE_LABEL_KEYS, lang.toUpperCase())

  return {
    // Formatting (re-exported from lib/number)
    formatNumber,
    formatPrice,
    formatTuitionFrom,
    formatDuration,
    // Labels
    getLabel,
    getTypeLabel,
    getLevelLabel,
    getLanguageLabel,
  }
}
