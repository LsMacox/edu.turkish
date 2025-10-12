import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCurrency } from '~/composables/useCurrency'
import type { Currency } from '~/types/services'

describe('useCurrency', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Clear localStorage before each test
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  it('should return default currency (USD)', () => {
    const { currencyRef } = useCurrency()
    expect(currencyRef.value).toBe('USD')
  })

  it('should change currency', () => {
    const { currencyRef, setCurrency } = useCurrency()
    setCurrency('KZT')
    expect(currencyRef.value).toBe('KZT')
  })

  it('should get correct currency symbol', () => {
    const { getCurrencySymbol } = useCurrency()

    expect(getCurrencySymbol('KZT')).toBe('₸')
    expect(getCurrencySymbol('TRY')).toBe('₺')
    expect(getCurrencySymbol('RUB')).toBe('₽')
    expect(getCurrencySymbol('USD')).toBe('$')
  })

  it('should get currency symbol for current currency when not specified', () => {
    const { getCurrencySymbol, setCurrency } = useCurrency()

    setCurrency('TRY')
    expect(getCurrencySymbol()).toBe('₺')

    setCurrency('KZT')
    expect(getCurrencySymbol()).toBe('₸')
  })

  it('should get correct currency label', () => {
    const { getCurrencyLabel } = useCurrency()

    expect(getCurrencyLabel('KZT')).toBe('Tenge')
    expect(getCurrencyLabel('TRY')).toBe('Lira')
    expect(getCurrencyLabel('RUB')).toBe('Ruble')
    expect(getCurrencyLabel('USD')).toBe('Dollar')
  })

  it('should format price correctly', () => {
    const { formatPrice, setCurrency } = useCurrency()

    const pricing: Record<Currency, string> = {
      KZT: '250,000',
      TRY: '8,500',
      RUB: '50,000',
      USD: '500',
    }

    setCurrency('USD')
    expect(formatPrice(pricing)).toBe('$500')

    setCurrency('KZT')
    expect(formatPrice(pricing)).toBe('₸250,000')

    setCurrency('TRY')
    expect(formatPrice(pricing)).toBe('₺8,500')

    setCurrency('RUB')
    expect(formatPrice(pricing)).toBe('₽50,000')
  })

  it('should format price with specified currency', () => {
    const { formatPrice } = useCurrency()

    const pricing: Record<Currency, string> = {
      KZT: '250,000',
      TRY: '8,500',
      RUB: '50,000',
      USD: '500',
    }

    expect(formatPrice(pricing, 'USD')).toBe('$500')
    expect(formatPrice(pricing, 'KZT')).toBe('₸250,000')
  })

  it('should return all available currencies', () => {
    const { currencies } = useCurrency()

    expect(currencies).toEqual(['KZT', 'TRY', 'RUB', 'USD'])
    expect(currencies.length).toBe(4)
  })

  it('should handle missing price gracefully', () => {
    const { formatPrice } = useCurrency()

    const incompletePricing = {
      USD: '500',
    } as Record<Currency, string>

    expect(formatPrice(incompletePricing, 'KZT')).toBe('₸0')
  })

  it('should fallback to USD symbol for invalid currency', () => {
    const { getCurrencySymbol } = useCurrency()

    // @ts-expect-error Testing invalid currency
    expect(getCurrencySymbol('INVALID')).toBe('$')
  })

  it('should fallback to Dollar label for invalid currency', () => {
    const { getCurrencyLabel } = useCurrency()

    // @ts-expect-error Testing invalid currency
    expect(getCurrencyLabel('INVALID')).toBe('Dollar')
  })
})
