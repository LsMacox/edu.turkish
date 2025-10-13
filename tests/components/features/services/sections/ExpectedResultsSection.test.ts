import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ExpectedResultsSection from '~/components/features/services/sections/ExpectedResultsSection.vue'

const messages = {
  services: {
    'test-service': {
      expectedResults: {
        title: 'Expected Results',
        items: [
          'Visa obtained and legal entry',
          'Rental contract in your name',
          'Turkish bank account opened',
        ],
      },
    },
    common: {
      selectDuration: 'Select duration:',
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

describe('ExpectedResultsSection', () => {
  beforeEach(() => {
    vi.stubGlobal('useI18n', mockUseI18n)
  })

  const createWrapper = (props: any = {}) => {
    return mount(ExpectedResultsSection, {
      props: {
        keyPrefix: 'services.test-service.expectedResults',
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
    expect(wrapper.text()).toContain('Expected Results')
  })

  it('renders all result items', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Visa obtained and legal entry')
    expect(wrapper.text()).toContain('Rental contract in your name')
    expect(wrapper.text()).toContain('Turkish bank account opened')
  })

  it('allows title override', () => {
    const wrapper = createWrapper({ title: 'What You Get' })
    expect(wrapper.text()).toContain('What You Get')
  })

  // duration selection removed
})
