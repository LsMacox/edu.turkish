import { formatNumber, formatPrice } from '~~/lib/utils/number'
import { namespace, key } from '~~/lib/i18n'

const filtersNs = namespace('universities.list.filters')

export function useUniversity() {
  const { t } = useI18n()

  const formatTuitionFrom = (tuition: number): string => {
    if (tuition <= 0) return ''
    return t(key('universities.list.tuitionFrom'), { price: formatNumber(tuition) })
  }

  const formatDuration = (years: number): string => {
    return t(key('universities.detail.programDuration.durationYears'), { count: years })
  }

  const getTypeLabel = (type: string): string => {
    const k = type.toLowerCase()
    const labels: Record<string, string> = {
      state: t(filtersNs('types.state')),
      private: t(filtersNs('types.private')),
      tech: t(filtersNs('types.tech')),
      elite: t(filtersNs('types.elite')),
    }
    return labels[k] ?? type
  }

  const getLevelLabel = (level: string): string => {
    const k = level.toLowerCase()
    const labels: Record<string, string> = {
      bachelor: t(filtersNs('levels.bachelor')),
      master: t(filtersNs('levels.master')),
      phd: t(filtersNs('levels.doctorate')),
    }
    return labels[k] ?? level
  }

  const getLanguageLabel = (lang: string): string => {
    const k = lang.toUpperCase()
    const labels: Record<string, string> = {
      EN: t(filtersNs('languages.en')),
      TR: t(filtersNs('languages.tr')),
      RU: t(filtersNs('languages.ru')),
    }
    return labels[k] ?? lang
  }

  return {
    // Formatting (re-exported from lib/number)
    formatNumber,
    formatPrice,
    formatTuitionFrom,
    formatDuration,
    // Labels
    getTypeLabel,
    getLevelLabel,
    getLanguageLabel,
  }
}
