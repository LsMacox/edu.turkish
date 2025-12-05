import { defineStore } from 'pinia'
import { useCookie } from '#app'
import type { Currency } from '~/types/currency'
import { CURRENCY_CODES } from '~/types/currency'

const STORAGE_KEY = 'preferred-currency'
const DEFAULT_CURRENCY: Currency = 'USD'

export const useCurrencyStore = defineStore('currency', () => {
  const currencyCookie = useCookie<Currency>(STORAGE_KEY, { path: '/', sameSite: 'lax' })

  const isValidCurrency = (value: unknown): value is Currency =>
    CURRENCY_CODES.includes(value as Currency)

  const currency = ref<Currency>(
    isValidCurrency(currencyCookie.value) ? currencyCookie.value : DEFAULT_CURRENCY,
  )

  const setCurrency = (newCurrency: Currency) => {
    if (!isValidCurrency(newCurrency)) {
      return
    }
    currency.value = newCurrency
    currencyCookie.value = newCurrency
  }

  return { currency, setCurrency }
})
