import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DiagnosticTestSection from '~/components/features/services/sections/DiagnosticTestSection.vue'

const messages = {
  services: {
    'test-service': {
      diagnosticTest: {
        title: '20-Minute Diagnostic',
        description: 'Take a quick test to get a personalized recommendation.',
        buttonText: 'Take Test',
        buttonUrl: '/diagnostic/test',
      },
    },
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

describe('DiagnosticTestSection', () => {
  beforeEach(() => {
    vi.stubGlobal('useI18n', () => mockUseI18n())
  })

  const createWrapper = (props: any = {}) => {
    return mount(DiagnosticTestSection, {
      props: {
        keyPrefix: 'services.test-service.diagnosticTest',
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

    expect(wrapper.text()).toContain('20-Minute Diagnostic')
  })

  it('renders description', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Take a quick test to get a personalized recommendation.')
  })

  it('renders button with text', () => {
    const wrapper = createWrapper()

    const button = wrapper.find('a')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('Take Test')
  })

  it('button has correct href', () => {
    const wrapper = createWrapper()

    const button = wrapper.find('a')
    expect(button.attributes('href')).toBe('/diagnostic/test')
  })

  it('allows title override', () => {
    const wrapper = createWrapper({ title: 'Custom Diagnostic' })

    expect(wrapper.text()).toContain('Custom Diagnostic')
  })
})
