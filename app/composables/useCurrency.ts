import { storeToRefs } from 'pinia'
import { useCurrencyStore } from '~/stores/currency'
import { CURRENCIES, type Currency, CURRENCY_CODES } from '~/types/currency'

export function useCurrency() {
  const store = useCurrencyStore()
  const { currency: currencyRef } = storeToRefs(store)

  const getCurrencySymbol = (currency?: Currency) =>
    CURRENCIES[currency ?? currencyRef.value]?.symbol || '$'

  const getCurrencyLabel = (currency?: Currency) =>
    CURRENCIES[currency ?? currencyRef.value]?.label || 'Dollar'

  const formatPrice = (pricing: Record<Currency, string>, currency?: Currency) => {
    const curr = currency ?? currencyRef.value
    return `${getCurrencySymbol(curr)}${pricing[curr] || '0'}`
  }

  return {
    currency: store.currency,
    currencyRef,
    setCurrency: store.setCurrency,
    getCurrencySymbol,
    getCurrencyLabel,
    formatPrice,
    currencies: CURRENCY_CODES,
  }
}
