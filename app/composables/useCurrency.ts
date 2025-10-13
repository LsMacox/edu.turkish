import { storeToRefs } from 'pinia'
import { useCurrencyStore } from '~/stores/currency'
import { CURRENCIES, type Currency, CURRENCY_CODES } from '~/types/currency'

/**
 * Composable for currency management and formatting
 * Wraps the currency store and provides formatting utilities
 */
export function useCurrency() {
  const store = useCurrencyStore()
  const { currency: currencyRef } = storeToRefs(store)

  // Initialize currency from localStorage on first use
  if (import.meta.client) {
    store.initCurrency()
  }

  /**
   * Get currency symbol for a given currency (or current if not specified)
   */
  const getCurrencySymbol = (currency?: Currency): string => {
    const curr: Currency = currency ?? currencyRef.value
    return CURRENCIES[curr]?.symbol || '$'
  }

  /**
   * Get localized currency label for a given currency (or current if not specified)
   */
  const getCurrencyLabel = (currency?: Currency): string => {
    const curr: Currency = currency ?? currencyRef.value
    return CURRENCIES[curr]?.label || 'Dollar'
  }

  /**
   * Format price with currency symbol based on current or specified currency
   */
  const formatPrice = (pricing: Record<Currency, string>, currency?: Currency): string => {
    const curr: Currency = currency ?? currencyRef.value
    const price = pricing[curr]
    const symbol = getCurrencySymbol(curr)

    if (!price) {
      return `${symbol}0`
    }

    return `${symbol}${price}`
  }

  /**
   * All available currencies
   */
  const currencies: readonly Currency[] = CURRENCY_CODES

  return {
    currency: store.currency,
    currencyRef,
    setCurrency: store.setCurrency,
    getCurrencySymbol,
    getCurrencyLabel,
    formatPrice,
    currencies,
  }
}
