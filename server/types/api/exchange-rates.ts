import type { SupportedCurrency } from '~~/lib/currency'

export interface ExchangeRatesResponse {
  rates: Record<SupportedCurrency, number>
  baseCurrency: 'USD'
  fetchedAt: string // ISO 8601
  expiresAt: string // ISO 8601
  isFallback?: boolean
}

export interface ExchangeRateDetails {
  rates: Record<SupportedCurrency, number>
  fetchedAt: Date
  expiresAt: Date
  isExpired: boolean
}