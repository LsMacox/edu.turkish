/**
 * Composable for university-related formatting utilities
 */
export function useUniversityFormatters() {
  const { t, locale } = useI18n()

  /**
   * Format number with space separators (e.g., 1 000 000)
   */
  const formatNumber = (num: number | string): string => {
    const value = typeof num === 'string' ? parseInt(num, 10) : num
    if (isNaN(value)) return '0'
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  /**
   * Format price with currency symbol
   */
  const formatPrice = (price: number): string => {
    return '$' + formatNumber(price)
  }

  /**
   * Format tuition with "от" prefix
   */
  const formatTuitionFrom = (tuition: number): string => {
    return tuition > 0 ? `от $${formatNumber(tuition)}/год` : ''
  }

  /**
   * Format program duration in years
   */
  const formatDuration = (years: number): string => {
    return t('universityDetail.programDuration.durationYears', { count: years })
  }

  /**
   * Create currency formatter for current locale
   */
  const currencyFormatter = computed(() =>
    new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
  )

  /**
   * Format price using Intl.NumberFormat
   */
  const formatCurrency = (price: number): string => {
    return currencyFormatter.value.format(price)
  }

  return {
    formatNumber,
    formatPrice,
    formatTuitionFrom,
    formatDuration,
    formatCurrency,
  }
}
