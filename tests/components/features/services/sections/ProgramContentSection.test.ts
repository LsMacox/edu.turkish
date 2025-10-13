import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgramContentSection from '~/components/features/services/sections/ProgramContentSection.vue'

const messages = {
  services: {
    'test-service': {
      programContent: {
        title: "What's Inside the Program",
        items: [
          { title: 'Theory', description: 'Mathematics and logic', icon: 'mdi:book-open' },
          { title: 'Practice', description: '12 full mock exams', icon: 'mdi:pencil' },
          { title: 'Error Analysis', description: 'Personalized feedback', icon: 'mdi:chart-line' },
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

describe('ProgramContentSection', () => {
  beforeEach(() => {
    vi.stubGlobal('useI18n', () => mockUseI18n())
  })

  const createWrapper = (props: any = {}) => {
    return mount(ProgramContentSection, {
      props: {
        keyPrefix: 'services.test-service.programContent',
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

    expect(wrapper.text()).toContain("What's Inside the Program")
  })

  it('renders all program items', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Theory')
    expect(wrapper.text()).toContain('Mathematics and logic')
    expect(wrapper.text()).toContain('Practice')
    expect(wrapper.text()).toContain('12 full mock exams')
    expect(wrapper.text()).toContain('Error Analysis')
    expect(wrapper.text()).toContain('Personalized feedback')
  })

  it('allows title override', () => {
    const wrapper = createWrapper({ title: 'Custom Program Content' })

    expect(wrapper.text()).toContain('Custom Program Content')
  })

  it('handles empty items array', () => {
    const emptyMessages = {
      services: {
        'empty-service': {
          programContent: {
            title: 'Program Content',
            items: [],
          },
        },
      },
    }

    vi.stubGlobal('useI18n', () => mockUseI18n(emptyMessages))

    const wrapper = mount(ProgramContentSection, {
      props: {
        keyPrefix: 'services.empty-service.programContent',
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

    expect(wrapper.text()).toContain('Program Content')
  })
})
