import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import UniversityRequirementsSection from '~/components/features/services/sections/UniversityRequirementsSection.vue'

const messages = {
  services: {
    'test-service': {
      universityRequirements: {
        title: 'What Universities Accept',
        formats: [
          'Notarized translation (most common)',
          'Apostille + notarized translation (for some countries)',
          'Consular legalization (for non-Hague countries)',
        ],
        acceptedBy:
          'All major Turkish universities including Istanbul University, Boğaziçi, METU, Sabancı, Koç',
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

describe('UniversityRequirementsSection', () => {
  beforeEach(() => {
    vi.stubGlobal('useI18n', () => mockUseI18n())
  })

  const createWrapper = (props: any = {}) => {
    return mount(UniversityRequirementsSection, {
      props: {
        keyPrefix: 'services.test-service.universityRequirements',
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

    expect(wrapper.text()).toContain('What Universities Accept')
  })

  it('renders all format options', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Notarized translation (most common)')
    expect(wrapper.text()).toContain('Apostille + notarized translation')
    expect(wrapper.text()).toContain('Consular legalization')
  })

  it('renders accepted universities text', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Istanbul University')
    expect(wrapper.text()).toContain('Boğaziçi')
    expect(wrapper.text()).toContain('METU')
  })

  it('allows title override', () => {
    const wrapper = createWrapper({ title: 'Accepted Formats' })

    expect(wrapper.text()).toContain('Accepted Formats')
  })
})
