export const SUPPORTED_CURRENCY = ['KZT', 'TRY', 'RUB', 'USD'] as const

export type SupportedCurrency = (typeof SUPPORTED_CURRENCY)[number]

/**
 * Currency display configuration
 */
export const CURRENCIES = {
    KZT: { code: 'KZT' as const, symbol: '₸', label: 'Tenge' },
    TRY: { code: 'TRY' as const, symbol: '₺', label: 'Lira' },
    RUB: { code: 'RUB' as const, symbol: '₽', label: 'Ruble' },
    USD: { code: 'USD' as const, symbol: '$', label: 'Dollar' },
} satisfies Record<SupportedCurrency, { code: SupportedCurrency; symbol: string; label: string }>

