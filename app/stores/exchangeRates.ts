import { defineStore } from 'pinia'
import type { Currency } from '~/types/currency'
import type { ExchangeRatesResponse } from '~~/server/types/api/exchange-rates'

// Fallback rates
const FALLBACK_RATES: Record<Currency, number> = {
  KZT: 450.0,
  TRY: 32.0,
  RUB: 90.0,
  USD: 1.0,
}

interface ExchangeRatesState {
  rates: Record<Currency, number>
  fetchedAt: string | null
  expiresAt: string | null
  isFallback: boolean
  isLoading: boolean
}

export const useExchangeRatesStore = defineStore('exchangeRates', {
  state: (): ExchangeRatesState => ({
    rates: FALLBACK_RATES,
    fetchedAt: null,
    expiresAt: null,
    isFallback: true,
    isLoading: false,
  }),

  getters: {
    /**
     * Check if current rates are expired
     */
    isExpired(): boolean {
      if (!this.expiresAt) return true
      return new Date(this.expiresAt) < new Date()
    },

    /**
     * Get rate for specific currency
     */
    getRate:
      (state) =>
      (currency: Currency): number => {
        return state.rates[currency] ?? FALLBACK_RATES[currency]
      },
  },

  actions: {
    /**
     * Fetch exchange rates from API
     */
    async fetchRates(): Promise<void> {
      if (this.isLoading) return

      this.isLoading = true

      try {
        const response = await $fetch<ExchangeRatesResponse>('/api/v1/exchange-rates')

        this.rates = response.rates
        this.fetchedAt = response.fetchedAt
        this.expiresAt = response.expiresAt
        this.isFallback = response.isFallback ?? false
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error)

        // Keep fallback rates on error
        this.rates = FALLBACK_RATES
        this.isFallback = true
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Ensure rates are fresh, fetch if expired
     */
    async ensureFresh(): Promise<void> {
      if (this.isExpired || this.isFallback) {
        await this.fetchRates()
      }
    },

    /**
     * Convert USD price to target currency
     */
    convertPrice(priceUsd: number, currency: Currency): number {
      const rate = this.getRate(currency)
      return priceUsd * rate
    },
  },
})
