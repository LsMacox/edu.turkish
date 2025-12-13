import { defineStore } from 'pinia'
import type { SupportedCurrency as Currency } from '~~/lib/config/currency'
import type { ExchangeRatesResponse } from '~~/lib/types'

export const useExchangeRatesStore = defineStore('exchangeRates', {
  state: () => ({
    rates: null as Record<Currency, number> | null,
    expiresAt: null as string | null,
    isFallback: true,
    isLoading: false,
  }),

  actions: {
    async fetchRates() {
      if (this.isLoading) return
      this.isLoading = true

      try {
        const response = await $fetch<ExchangeRatesResponse>('/api/v1/exchange-rates')
        this.rates = response.rates
        this.expiresAt = response.expiresAt
        this.isFallback = response.isFallback ?? false
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error)
        // Server always returns valid response, this is network-level failure only
      } finally {
        this.isLoading = false
      }
    },

    async ensureFresh() {
      const isExpired = !this.expiresAt || new Date(this.expiresAt) < new Date()
      if (isExpired || this.isFallback) {
        await this.fetchRates()
      }
    },

    convertPrice(priceUsd: number, currency: Currency): number | null {
      if (!this.rates) return null
      return priceUsd * this.rates[currency]
    },
  },
})
