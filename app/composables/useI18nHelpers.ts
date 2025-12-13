import { formatDate as formatDateUtil } from '~~/server/utils/locale'

export function useI18nHelpers() {
  const { t, tm, te } = useI18n()

  function getNumber(key: string, fallback: number): number {
    const val = tm(key) as unknown
    return typeof val === 'number' ? val : fallback
  }

  function exists(key: string): boolean {
    return te(key)
  }

  function getOptional(key: string, fallback = ''): string {
    return te(key) ? t(key) : fallback
  }

  function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
    const { locale } = useI18n()
    return formatDateUtil(date, locale.value, options)
  }

  return {
    // Value extraction
    getNumber,
    getOptional,
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
