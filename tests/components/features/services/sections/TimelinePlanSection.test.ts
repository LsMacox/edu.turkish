import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TimelinePlanSection from '~/components/features/services/sections/TimelinePlanSection.vue'

const messages = {
  services: {
    'test-service': {
      timelinePlan: {
        title: '30-Day Plan',
        weeks: [
          { number: 1, activities: 'Documents and visa center appointment' },
          { number: 2, activities: 'Arrival, SIM, tax number' },
          { number: 3, activities: 'Housing and bank account' },
          { number: 4, activities: 'Residence permit submission' },
        ],
      },
    },
  },
}

const mockUseI18n = () => ({
  t: (key: string) => {
    const keys = key.split('.')
    let value: any = messages
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  },
  tm: (key: string) => {
    const keys = key.split('.')
    let value: any = messages
    for (const k of keys) {
      value = value?.[k]
    }
    return value || []
  },
  locale: { value: 'en' },
})

describe('TimelinePlanSection', () => {
  beforeEach(() => {
    vi.stubGlobal('useI18n', mockUseI18n)
  })

  const createWrapper = (props: any = {}) => {
    return mount(TimelinePlanSection, {
      props: {
        keyPrefix: 'services.test-service.timelinePlan',
        ...props,
      },
      global: {
        stubs: {
          BaseSectionHeader: {
            template: '<div><h2>{{ title }}</h2></div>',
            props: ['title'],
          },
        },
      },
    })
  }

  it('renders title from i18n', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('30-Day Plan')
  })

  it('renders all timeline weeks', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Documents and visa center appointment')
    expect(wrapper.text()).toContain('Arrival, SIM, tax number')
    expect(wrapper.text()).toContain('Housing and bank account')
    expect(wrapper.text()).toContain('Residence permit submission')
  })

  it('displays week numbers', () => {
    const wrapper = createWrapper()
    const text = wrapper.text()
    expect(text).toMatch(/1/)
    expect(text).toMatch(/2/)
    expect(text).toMatch(/3/)
    expect(text).toMatch(/4/)
  })

  it('allows title override', () => {
    const wrapper = createWrapper({ title: 'Your Journey' })
    expect(wrapper.text()).toContain('Your Journey')
  })

  it('accepts custom unit prop', () => {
    const wrapper = createWrapper({ unit: 'phase' })
    expect(wrapper.exists()).toBe(true)
  })
})
