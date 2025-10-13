import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TeachersSection from '~/components/features/services/sections/TeachersSection.vue'

const messages = {
  services: {
    'test-service': {
      teachers: {
        title: 'Methodology & Teachers',
        methodology: 'We use a communicative approach with real-world scenarios.',
        profiles: [
          {
            name: 'John Doe',
            photo: '/images/teacher-john.jpg',
            achievements: 'Native speaker, 10+ years experience',
          },
          {
            name: 'Jane Smith',
            photo: '/images/teacher-jane.jpg',
            achievements: 'CELTA certified, MA in Linguistics',
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

describe('TeachersSection', () => {
  beforeEach(() => {
    vi.stubGlobal('useI18n', () => mockUseI18n())
  })

  const createWrapper = (props: any = {}) => {
    return mount(TeachersSection, {
      props: {
        keyPrefix: 'services.test-service.teachers',
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

    expect(wrapper.text()).toContain('Methodology & Teachers')
  })

  it('renders methodology description', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('communicative approach')
  })

  it('renders all teacher profiles', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Jane Smith')
    expect(wrapper.text()).toContain('Native speaker')
    expect(wrapper.text()).toContain('CELTA certified')
  })

  it('renders teacher photos', () => {
    const wrapper = createWrapper()

    const images = wrapper.findAll('img')
    expect(images.length).toBeGreaterThanOrEqual(2)
    expect(images[0]?.attributes('src')).toContain('teacher-john.jpg')
  })

  it('allows title override', () => {
    const wrapper = createWrapper({ title: 'Our Instructors' })

    expect(wrapper.text()).toContain('Our Instructors')
  })
})
