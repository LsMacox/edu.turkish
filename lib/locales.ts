export const SUPPORTED_LOCALES = ['en', 'ru', 'kk', 'tr'] as const
export const DEFAULT_LOCALE = 'ru' as const

export type SupportedLocale = typeof SUPPORTED_LOCALES[number]
