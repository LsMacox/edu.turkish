import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import SubServiceCard from '~/components/features/services/SubServiceCard.vue'
import CurrencyPrice from '~/components/features/services/CurrencyPrice.vue'
import { useCurrency } from '~/composables/useCurrency'
import type { Currency } from '~/types/services'

describe('SubServiceCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockPricing: Record<Currency, string> = {
    KZT: '250,000',
    TRY: '8,500',
    RUB: '50,000',
    USD: '500',
  }

  const baseProps = {
    subServiceId: 'tr-yos-basic-preparation' as const,
    name: 'Basic TR-YÖS Preparation',
    description: 'Foundational course covering all TR-YÖS topics',
    pricing: mockPricing,
  }

  const mountComponent = (propsOverrides: Partial<typeof baseProps> = {}) => {
    return mount(SubServiceCard, {
      props: {
        ...baseProps,
        ...propsOverrides,
      },
      global: {
        components: {
          CurrencyPrice,
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    })
  }

  it('should render sub-service name', () => {
    const wrapper = mountComponent()

    expect(wrapper.text()).toContain('Basic TR-YÖS Preparation')
  })

  it('should render sub-service description', () => {
    const wrapper = mountComponent()

    expect(wrapper.text()).toContain('Foundational course covering all TR-YÖS topics')
  })

  it('should display CurrencyPrice component with pricing', () => {
    const wrapper = mountComponent()

    expect(wrapper.text()).toContain('$500')
  })

  it('should render Apply button', () => {
    const wrapper = mountComponent()

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toMatch(/apply/i)
  })

  it('should emit apply event when Apply button is clicked', async () => {
    const wrapper = mountComponent()

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('apply')
    expect(wrapper.emitted('apply')).toHaveLength(1)
  })

  it('should emit apply event with sub-service details', async () => {
    const wrapper = mountComponent()

    const button = wrapper.find('button')
    await button.trigger('click')

    const emitted = wrapper.emitted('apply')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual([
      {
        subServiceId: 'tr-yos-basic-preparation',
        name: 'Basic TR-YÖS Preparation',
      },
    ])
  })

  it('should have card styling classes', () => {
    const wrapper = mountComponent()

    const card = wrapper.find('.sub-service-card')
    expect(card.exists()).toBe(true)
    expect(card.classes()).toContain('border')
    expect(card.classes()).toContain('rounded-lg')
  })

  it('should display price that updates with currency changes', async () => {
    const wrapper = mountComponent()

    const { setCurrency } = useCurrency()

    expect(wrapper.text()).toContain('$500')

    setCurrency('KZT')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('₸250,000')
  })

  it('should handle long descriptions gracefully', () => {
    const longDescription = 'A'.repeat(500)

    const wrapper = mountComponent({
      description: longDescription,
    })

    expect(wrapper.text()).toContain(longDescription)
  })
})
