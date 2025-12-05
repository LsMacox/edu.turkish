import { SUPPORTED_CURRENCY, type SupportedCurrency } from '~~/lib/currency'

export type Currency = SupportedCurrency

export interface CurrencyInfo {
  code: Currency
  symbol: string
  label: string
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  KZT: { code: 'KZT', symbol: '₸', label: 'Tenge' },
  TRY: { code: 'TRY', symbol: '₺', label: 'Lira' },
  RUB: { code: 'RUB', symbol: '₽', label: 'Ruble' },
  USD: { code: 'USD', symbol: '$', label: 'Dollar' },
}

export const CURRENCY_CODES = SUPPORTED_CURRENCY satisfies readonly Currency[]
