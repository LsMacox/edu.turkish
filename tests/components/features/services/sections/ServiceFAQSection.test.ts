import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ServiceFAQSection from '~/components/features/services/sections/ServiceFAQSection.vue'

const messages = {
  services: {
    'test-service': {
      faq: {
        title: 'Frequently Asked Questions',
        items: [
          {
            question: 'Can I do it without income statement?',
            answer: 'Yes, for students we can use acceptance letter and scholarship confirmation.',
          },
          {
            question: 'What if my address changes?',
            answer:
              'You must notify immigration within 20 days. We will help you update your registration.',
          },
          {
            question: 'Can I bring my family?',
            answer: 'Yes, family members can apply for dependent residence permits.',
          },
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
  te: (key: string) => {
    const keys = key.split('.')
    let value: any = messages
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) return false
    }
    return value !== undefined
  },
  locale: { value: 'en' },
})

describe('ServiceFAQSection', () => {
  beforeEach(() => {
    vi.stubGlobal('useI18n', mockUseI18n)
  })

  const createWrapper = (props: any = {}) => {
    return mount(ServiceFAQSection, {
      props: {
        keyPrefix: 'services.test-service.faq',
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
    expect(wrapper.text()).toContain('Frequently Asked Questions')
  })

  it('renders all FAQ questions', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Can I do it without income statement?')
    expect(wrapper.text()).toContain('What if my address changes?')
    expect(wrapper.text()).toContain('Can I bring my family?')
  })

  it('renders all FAQ answers', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain(
      'Yes, for students we can use acceptance letter and scholarship confirmation.',
    )
    expect(wrapper.text()).toContain('You must notify immigration within 20 days.')
    expect(wrapper.text()).toContain(
      'Yes, family members can apply for dependent residence permits.',
    )
  })

  it('allows title override', () => {
    const wrapper = createWrapper({ title: 'Common Questions' })
    expect(wrapper.text()).toContain('Common Questions')
  })

  it('pairs questions with their answers', () => {
    const wrapper = createWrapper()
    const text = wrapper.text()
    const questionIndex = text.indexOf('Can I do it without income statement?')
    const answerIndex = text.indexOf('Yes, for students we can use acceptance letter')
    expect(questionIndex).toBeLessThan(answerIndex)
  })

  it('accepts defaultExpanded prop', () => {
    const wrapper = createWrapper({ defaultExpanded: true })
    expect(wrapper.exists()).toBe(true)
  })
})
