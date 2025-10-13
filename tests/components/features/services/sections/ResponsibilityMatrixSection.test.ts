import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ResponsibilityMatrixSection from '~/components/features/services/sections/ResponsibilityMatrixSection.vue'

const messages = {
  services: {
    'test-service': {
      responsibilityMatrix: {
        title: 'We Do / You Do',
        weDo: {
          title: 'We Do',
          items: ['Prepare all documents', 'Book visa appointment', 'Find housing options'],
        },
        youDo: {
          title: 'You Do',
          items: [
            'Provide required documents',
            'Attend visa appointment',
            'Choose housing from options',
          ],
        },
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

describe('ResponsibilityMatrixSection', () => {
  beforeEach(() => {
    vi.stubGlobal('useI18n', mockUseI18n)
  })

  const createWrapper = (props: any = {}) => {
    return mount(ResponsibilityMatrixSection, {
      props: {
        keyPrefix: 'services.test-service.responsibilityMatrix',
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
    expect(wrapper.text()).toContain('We Do / You Do')
  })

  it('renders "We Do" section with items', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('We Do')
    expect(wrapper.text()).toContain('Prepare all documents')
    expect(wrapper.text()).toContain('Book visa appointment')
    expect(wrapper.text()).toContain('Find housing options')
  })

  it('renders "You Do" section with items', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('You Do')
    expect(wrapper.text()).toContain('Provide required documents')
    expect(wrapper.text()).toContain('Attend visa appointment')
    expect(wrapper.text()).toContain('Choose housing from options')
  })

  it('allows title override', () => {
    const wrapper = createWrapper({ title: 'Responsibilities' })
    expect(wrapper.text()).toContain('Responsibilities')
  })

  it('displays both columns in a two-column layout', () => {
    const wrapper = createWrapper()
    const text = wrapper.text()
    expect(text).toContain('We Do')
    expect(text).toContain('You Do')
  })
})
