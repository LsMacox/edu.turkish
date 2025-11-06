export const SUPPORTED_CURRENCY = ['KZT', 'TRY', 'RUB', 'USD'] as const

export type SupportedCurrency = (typeof SUPPORTED_CURRENCY)[number]
