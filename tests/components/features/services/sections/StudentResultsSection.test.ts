import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import StudentResultsSection from '~/components/features/services/sections/StudentResultsSection.vue'

const messages = {
  services: {
    'test-service': {
      studentResults: {
        title: 'Student Results',
        cases: [
          { before: 42, after: 68, duration: '8 weeks', proof: '/images/case-1.png' },
          { before: 55, after: 72, duration: '8 weeks', proof: '/images/case-2.png' },
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

describe('StudentResultsSection', () => {
  beforeEach(() => {
    vi.stubGlobal('useI18n', () => mockUseI18n())
  })

  const createWrapper = (props: any = {}) => {
    return mount(StudentResultsSection, {
      props: {
        keyPrefix: 'services.test-service.studentResults',
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

    expect(wrapper.text()).toContain('Student Results')
  })

  it('renders all case studies', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('42')
    expect(wrapper.text()).toContain('68')
    expect(wrapper.text()).toContain('55')
    expect(wrapper.text()).toContain('72')
  })

  it('renders duration information', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('8 weeks')
  })

  it('allows title override', () => {
    const wrapper = createWrapper({ title: 'Custom Results' })

    expect(wrapper.text()).toContain('Custom Results')
  })

  it('handles empty cases array', () => {
    const emptyMessages = {
      services: {
        'empty-service': {
          studentResults: {
            title: 'Student Results',
            cases: [],
          },
        },
      },
    }

    vi.stubGlobal('useI18n', () => mockUseI18n(emptyMessages))

    const wrapper = mount(StudentResultsSection, {
      props: {
        keyPrefix: 'services.empty-service.studentResults',
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

    expect(wrapper.text()).toContain('Student Results')
  })

  it('handles SAT-style case studies with score and admission', () => {
    const satMessages = {
      services: {
        'sat-courses': {
          studentResults: {
            title: 'Case Studies',
            cases: [{ score: 1420, proof: '/images/sat-1.png', admission: 'MIT' }],
          },
        },
      },
    }

    vi.stubGlobal('useI18n', () => mockUseI18n(satMessages))

    const wrapper = mount(StudentResultsSection, {
      props: {
        keyPrefix: 'services.sat-courses.studentResults',
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

    expect(wrapper.text()).toContain('1420')
    expect(wrapper.text()).toContain('MIT')
  })
})
