import { defineStore } from 'pinia'
import type { Currency } from '~/types/services'

const STORAGE_KEY = 'preferred-currency'
const DEFAULT_CURRENCY: Currency = 'USD'
const VALID_CURRENCIES: Currency[] = ['KZT', 'TRY', 'RUB', 'USD']

/**
 * Currency store for managing user's preferred currency selection
 * Persists to localStorage for cross-session consistency
 */
export const useCurrencyStore = defineStore('currency', () => {
  const currency = ref<Currency>(DEFAULT_CURRENCY)

  /**
   * Change currency and persist to localStorage
   */
  const setCurrency = (newCurrency: Currency) => {
    if (!VALID_CURRENCIES.includes(newCurrency)) {
      console.warn(`Invalid currency: ${newCurrency}, falling back to ${DEFAULT_CURRENCY}`)
      currency.value = DEFAULT_CURRENCY
      return
    }

    currency.value = newCurrency

    // Persist to localStorage (client-side only)
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, newCurrency)
      } catch (error) {
        console.error('Failed to save currency preference:', error)
      }
    }
  }

  /**
   * Initialize currency from localStorage
   * Called on app mount
   */
  const initCurrency = () => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as Currency | null
        if (saved && VALID_CURRENCIES.includes(saved)) {
          currency.value = saved
        }
      } catch (error) {
        console.error('Failed to load currency preference:', error)
      }
    }
  }

  return {
    currency,
    setCurrency,
    initCurrency,
  }
})
