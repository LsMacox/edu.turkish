export const SUPPORTED_CURRENCY = ['KZT', 'TRY', 'RUB', 'USD'] as const
export const DEFAULT_CURRENCY = 'USD' as const

export type SupportedCurrency = (typeof SUPPORTED_CURRENCY)[number]
