import { defineStore } from 'pinia'
import { useCookie } from '#app'
import type { Currency } from '~/types/currency'
import { CURRENCY_CODES } from '~/types/currency'

const STORAGE_KEY = 'preferred-currency'
const DEFAULT_CURRENCY: Currency = 'USD'
const VALID_CURRENCIES: readonly Currency[] = CURRENCY_CODES

/**
 * Currency store for managing user's preferred currency selection
 * Persists to localStorage for cross-session consistency
 */
export const useCurrencyStore = defineStore('currency', () => {
  const currency = ref<Currency>(DEFAULT_CURRENCY)

  // Initialize from cookie on both server and client to avoid SSR hydration mismatches
  const currencyCookie = useCookie<Currency>(STORAGE_KEY)
  if (currencyCookie.value && VALID_CURRENCIES.includes(currencyCookie.value)) {
    currency.value = currencyCookie.value
  }

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

    // Persist to cookie for SSR parity (server and client)
    try {
      const cookie = useCookie<Currency>(STORAGE_KEY, { path: '/', sameSite: 'lax' })
      cookie.value = newCurrency
    } catch (error) {
      console.error('Failed to save currency preference cookie:', error)
    }

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
    // Prefer cookie (available on both server and client)
    try {
      const cookie = useCookie<Currency>(STORAGE_KEY)
      if (cookie.value && VALID_CURRENCIES.includes(cookie.value)) {
        currency.value = cookie.value
        return
      }
    } catch (error) {
      console.error('Failed to read currency preference cookie:', error)
    }

    // Fallback to localStorage on client
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as Currency | null
        if (saved && VALID_CURRENCIES.includes(saved)) {
          currency.value = saved
          // Backfill cookie from existing localStorage so SSR matches next render
          try {
            const cookie = useCookie<Currency>(STORAGE_KEY, { path: '/', sameSite: 'lax' })
            cookie.value = saved
          } catch (err) {
            console.error('Failed to backfill currency cookie from localStorage:', err)
          }
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
