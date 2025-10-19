import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PriceCalculatorSection from '~/components/features/services/sections/PriceCalculatorSection.vue'

const messages = {
  services: {
    'test-service': {
      priceCalculator: {
        title: 'Price Calculator',
      },
    },
  },
  currency: {
    KZT: 'KZT',
    TRY: 'TRY',
    RUB: 'RUB',
    USD: 'USD',
  },
}

const mockUseI18n = (customMessages: any = messages) => ({
  t: (key: string) => {
    const keys = key.split('.')
    let value: any = customMessages
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  },
  tm: (key: string) => {
    const keys = key.split('.')
    let value: any = customMessages
    for (const k of keys) {
      value = value?.[k]
    }
    return value || []
  },
  locale: { value: 'en' },
})

describe('PriceCalculatorSection', () => {
  beforeEach(() => {
    vi.stubGlobal('useI18n', () => mockUseI18n())
    vi.stubGlobal('useCurrency', () => ({
      currencyRef: { value: 'USD' },
      formatPrice: (pricing: any, currency: string) => pricing[currency],
    }))
  })

  const createWrapper = (props: any = {}) => {
    return mount(PriceCalculatorSection, {
      props: {
        keyPrefix: 'services.test-service.priceCalculator',
        documentTypes: ['Diploma', 'Transcript', 'Passport'],
        languages: ['English → Turkish', 'Russian → Turkish'],
        urgency: ['Standard (5 days)', 'Express (2 days)', 'Rush (24 hours)'],
        standardPriceUsd: 20,
        urgencyMultipliers: { express: 1.5, rush: 2.0 },
        ...props,
      },
      global: {
        stubs: {
          BaseSectionHeader: {
            template: '<div><h2>{{ title }}</h2></div>',
            props: ['title'],
          },
          Icon: true,
        },
      },
    })
  }

  it('renders title from i18n', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Price Calculator')
  })

  it('renders document type options', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Diploma')
    expect(wrapper.text()).toContain('Transcript')
    expect(wrapper.text()).toContain('Passport')
  })

  it('renders language options', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('English → Turkish')
    expect(wrapper.text()).toContain('Russian → Turkish')
  })

  it('renders urgency options', () => {
    const wrapper = createWrapper()
  
    expect(wrapper.text()).toContain('Standard (5 days)')
    expect(wrapper.text()).toContain('Express (2 days)')
    expect(wrapper.text()).toContain('Rush (24 hours)')
  })

  it('allows title override', () => {
    const wrapper = createWrapper({ title: 'Calculate Your Price' })

    expect(wrapper.text()).toContain('Calculate Your Price')
  })
})
