import { SUPPORTED_CURRENCY, type SupportedCurrency } from '~~/lib/currency'

export type Currency = SupportedCurrency

export const CURRENCIES = {
  KZT: { code: 'KZT' as const, symbol: '₸', label: 'Tenge' },
  TRY: { code: 'TRY' as const, symbol: '₺', label: 'Lira' },
  RUB: { code: 'RUB' as const, symbol: '₽', label: 'Ruble' },
  USD: { code: 'USD' as const, symbol: '$', label: 'Dollar' },
} satisfies Record<Currency, { code: Currency; symbol: string; label: string }>

export const CURRENCY_CODES = SUPPORTED_CURRENCY satisfies readonly Currency[]
