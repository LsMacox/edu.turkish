import {
  TYPE_LABEL_KEYS,
  LEVEL_LABEL_KEYS,
  LANGUAGE_LABEL_KEYS,
} from '../utils/constants'

/**
 * Composable for translating university-related labels
 */
export function useUniversityLabels() {
  const { t } = useI18n()

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
  const getLanguageLabel = (lang: string): string => getLabel(LANGUAGE_LABEL_KEYS, lang.toUpperCase())

  return {
    getLabel,
    getTypeLabel,
    getLevelLabel,
    getLanguageLabel,
  }
}
