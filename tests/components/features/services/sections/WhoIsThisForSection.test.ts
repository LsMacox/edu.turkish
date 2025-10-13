import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import WhoIsThisForSection from '~/components/features/services/sections/WhoIsThisForSection.vue'

const messages = {
  services: {
    'test-service': {
      whoIsThisFor: {
        title: 'Who Is This For?',
        criteria: [
          'You have been accepted to a Turkish university',
          'You need visa and housing support',
          'You want professional guidance',
        ],
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

describe('WhoIsThisForSection', () => {
  beforeEach(() => {
    vi.stubGlobal('useI18n', () => mockUseI18n())
  })

  const createWrapper = (props: any = {}) => {
    return mount(WhoIsThisForSection, {
      props: {
        keyPrefix: 'services.test-service.whoIsThisFor',
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

    expect(wrapper.text()).toContain('Who Is This For?')
  })

  it('renders all criteria items', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('You have been accepted to a Turkish university')
    expect(wrapper.text()).toContain('You need visa and housing support')
    expect(wrapper.text()).toContain('You want professional guidance')
  })

  it('allows title override', () => {
    const wrapper = createWrapper({ title: 'Custom Title' })

    expect(wrapper.text()).toContain('Custom Title')
  })

  it('handles empty criteria array gracefully', () => {
    const emptyMessages = {
      services: {
        'empty-service': {
          whoIsThisFor: {
            title: 'Who Is This For?',
            criteria: [],
          },
        },
      },
    }

    vi.stubGlobal('useI18n', () => mockUseI18n(emptyMessages))

    const wrapper = mount(WhoIsThisForSection, {
      props: {
        keyPrefix: 'services.empty-service.whoIsThisFor',
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

    expect(wrapper.text()).toContain('Who Is This For?')
  })
})
