import { defineStore } from 'pinia'
import type { Currency } from '~/types/currency'
import type { ExchangeRatesResponse } from '~~/server/types/api/exchange-rates'

const FALLBACK_RATES: Record<Currency, number> = {
  KZT: 450.0,
  TRY: 32.0,
  RUB: 90.0,
  USD: 1.0,
}

export const useExchangeRatesStore = defineStore('exchangeRates', {
  state: () => ({
    rates: { ...FALLBACK_RATES } as Record<Currency, number>,
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
        this.rates = { ...FALLBACK_RATES }
        this.isFallback = true
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

    convertPrice(priceUsd: number, currency: Currency): number {
      return priceUsd * (this.rates[currency] ?? FALLBACK_RATES[currency])
    },
  },
})
