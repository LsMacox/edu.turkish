import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import CurrencyPrice from '~/components/features/services/CurrencyPrice.vue'
import type { Currency } from '~/types/currency'
import { useCurrency } from '~/composables/useCurrency'

describe('CurrencyPrice', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockPricing: Record<Currency, string> = {
    KZT: '250,000',
    TRY: '8,500',
    RUB: '50,000',
    USD: '500',
  }

  it('should render price with default currency (USD)', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        pricing: mockPricing,
      },
    })

    expect(wrapper.text()).toContain('$500')
  })

  it('should display correct symbol for each currency', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        pricing: mockPricing,
      },
    })

    const { setCurrency } = useCurrency()

    setCurrency('KZT')
    return wrapper.vm
      .$nextTick()
      .then(() => {
        expect(wrapper.text()).toContain('₸250,000')

        setCurrency('TRY')
        return wrapper.vm.$nextTick()
      })
      .then(() => {
        expect(wrapper.text()).toContain('₺8,500')

        setCurrency('RUB')
        return wrapper.vm.$nextTick()
      })
      .then(() => {
        expect(wrapper.text()).toContain('₽50,000')

        setCurrency('USD')
        return wrapper.vm.$nextTick()
      })
      .then(() => {
        expect(wrapper.text()).toContain('$500')
      })
  })

  it('should apply size classes correctly', () => {
    const wrapperSm = mount(CurrencyPrice, {
      props: {
        pricing: mockPricing,
        size: 'sm',
      },
    })

    const wrapperMd = mount(CurrencyPrice, {
      props: {
        pricing: mockPricing,
        size: 'md',
      },
    })

    const wrapperLg = mount(CurrencyPrice, {
      props: {
        pricing: mockPricing,
        size: 'lg',
      },
    })

    expect(wrapperSm.find('.price').classes()).toContain('text-sm')
    expect(wrapperMd.find('.price').classes()).toContain('text-base')
    expect(wrapperLg.find('.price').classes()).toContain('text-lg')
  })

  it('should default to medium size when size prop not provided', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        pricing: mockPricing,
      },
    })

    expect(wrapper.find('.price').classes()).toContain('text-base')
  })

  it('should reactively update when currency changes', async () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        pricing: mockPricing,
      },
    })

    const { setCurrency } = useCurrency()

    expect(wrapper.text()).toContain('$500')

    setCurrency('KZT')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('₸250,000')

    setCurrency('TRY')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('₺8,500')
  })

  it('should handle missing price gracefully', async () => {
    const incompletePricing = {
      USD: '500',
    } as Record<Currency, string>

    const wrapper = mount(CurrencyPrice, {
      props: {
        pricing: incompletePricing,
      },
    })

    const { setCurrency } = useCurrency()
    setCurrency('KZT')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('₸0')
  })

  it('should display currency symbol before price', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        pricing: mockPricing,
      },
    })

    const text = wrapper.text()
    const dollarIndex = text.indexOf('$')
    const priceIndex = text.indexOf('500')

    expect(dollarIndex).toBeLessThan(priceIndex)
  })
})
