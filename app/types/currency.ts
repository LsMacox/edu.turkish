/**
 * Currency domain: types and constants
 * Centralized to decouple from services domain and avoid duplication.
 */

/**
 * Supported currencies for pricing display
 */
export type Currency = 'KZT' | 'TRY' | 'RUB' | 'USD'

/**
 * Currency information with symbol and localized label
 */
export interface CurrencyInfo {
  code: Currency
  symbol: string
  label: string
}

/**
 * All supported currencies with their display information
 */
export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  KZT: { code: 'KZT', symbol: '₸', label: 'Tenge' },
  TRY: { code: 'TRY', symbol: '₺', label: 'Lira' },
  RUB: { code: 'RUB', symbol: '₽', label: 'Ruble' },
  USD: { code: 'USD', symbol: '$', label: 'Dollar' },
}

/**
 * Canonical list of currency codes as a readonly tuple
 */
export const CURRENCY_CODES = ['KZT', 'TRY', 'RUB', 'USD'] as const satisfies readonly Currency[]
