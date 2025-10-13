import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LevelProgressionSection from '~/components/features/services/sections/LevelProgressionSection.vue'

const messages = {
  services: {
    'test-service': {
      levelProgression: {
        title: 'Your Level Progression',
        levels: [
          {
            from: 'A1',
            to: 'A2',
            outcome: 'Basic conversations, daily tasks, simple texts',
          },
          {
            from: 'B1',
            to: 'B2',
            outcome: 'Work meetings, academic discussions, complex texts',
          },
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

describe('LevelProgressionSection', () => {
  beforeEach(() => {
    vi.stubGlobal('useI18n', () => mockUseI18n())
  })

  const createWrapper = (props: any = {}) => {
    return mount(LevelProgressionSection, {
      props: {
        keyPrefix: 'services.test-service.levelProgression',
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

    expect(wrapper.text()).toContain('Your Level Progression')
  })

  it('renders all level progressions', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('A1')
    expect(wrapper.text()).toContain('A2')
    expect(wrapper.text()).toContain('B1')
    expect(wrapper.text()).toContain('B2')
    expect(wrapper.text()).toContain('Basic conversations')
    expect(wrapper.text()).toContain('Work meetings')
  })

  it('allows title override', () => {
    const wrapper = createWrapper({ title: 'Custom Progression' })

    expect(wrapper.text()).toContain('Custom Progression')
  })

  it('handles empty levels array gracefully', () => {
    const emptyMessages = {
      services: {
        'empty-service': {
          levelProgression: {
            title: 'No Levels',
            levels: [],
          },
        },
      },
    }

    vi.stubGlobal('useI18n', () => mockUseI18n(emptyMessages))

    const wrapper = mount(LevelProgressionSection, {
      props: {
        keyPrefix: 'services.empty-service.levelProgression',
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

    expect(wrapper.text()).toContain('No Levels')
  })
})
