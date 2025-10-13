import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FormatScheduleSection from '~/components/features/services/sections/FormatScheduleSection.vue'

const messages = {
  services: {
    'test-service': {
      formatSchedule: {
        title: 'Format & Schedule',
        format: 'Online or in-person, group or individual',
        duration: '8 weeks (24 lessons)',
        homework: 'Yes, with detailed review',
        support: 'Between sessions via Telegram chat',
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

describe('FormatScheduleSection', () => {
  beforeEach(() => {
    vi.stubGlobal('useI18n', () => mockUseI18n())
  })

  const createWrapper = (props: any = {}) => {
    return mount(FormatScheduleSection, {
      props: {
        keyPrefix: 'services.test-service.formatSchedule',
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

    expect(wrapper.text()).toContain('Format & Schedule')
  })

  it('renders format details', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Online or in-person, group or individual')
  })

  it('renders duration', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('8 weeks (24 lessons)')
  })

  it('renders homework information', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Yes, with detailed review')
  })

  it('renders support information', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Between sessions via Telegram chat')
  })

  it('allows title override', () => {
    const wrapper = createWrapper({ title: 'Custom Format' })

    expect(wrapper.text()).toContain('Custom Format')
  })
})
