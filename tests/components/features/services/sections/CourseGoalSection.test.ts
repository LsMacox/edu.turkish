import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CourseGoalSection from '~/components/features/services/sections/CourseGoalSection.vue'

const messages = {
  services: {
    'test-service': {
      courseGoal: {
        title: 'Course Goal',
        description: 'We will prepare you for the exam.',
        packages: [
          { name: 'Basic', targetScore: '50-60' },
          { name: 'Standard', targetScore: '60-70' },
          { name: 'Premium', targetScore: '70+' },
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

describe('CourseGoalSection', () => {
  beforeEach(() => {
    vi.stubGlobal('useI18n', () => mockUseI18n())
  })

  const createWrapper = (props: any = {}) => {
    return mount(CourseGoalSection, {
      props: {
        keyPrefix: 'services.test-service.courseGoal',
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

    expect(wrapper.text()).toContain('Course Goal')
  })

  it('renders description', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('We will prepare you for the exam.')
  })

  it('renders all package tiers', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Basic')
    expect(wrapper.text()).toContain('50-60')
    expect(wrapper.text()).toContain('Standard')
    expect(wrapper.text()).toContain('60-70')
    expect(wrapper.text()).toContain('Premium')
    expect(wrapper.text()).toContain('70+')
  })

  it('allows title override', () => {
    const wrapper = createWrapper({ title: 'Custom Title' })

    expect(wrapper.text()).toContain('Custom Title')
  })

  it('handles empty packages array', () => {
    const emptyMessages = {
      services: {
        'empty-service': {
          courseGoal: {
            title: 'Course Goal',
            description: 'Description',
            packages: [],
          },
        },
      },
    }

    vi.stubGlobal('useI18n', () => mockUseI18n(emptyMessages))

    const wrapper = mount(CourseGoalSection, {
      props: {
        keyPrefix: 'services.empty-service.courseGoal',
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

    expect(wrapper.text()).toContain('Course Goal')
  })
})
