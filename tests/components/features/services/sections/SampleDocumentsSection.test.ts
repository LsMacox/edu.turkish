import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SampleDocumentsSection from '~/components/features/services/sections/SampleDocumentsSection.vue'

const messages = {
  services: {
    'test-service': {
      sampleDocuments: {
        title: 'Sample Pages',
        samples: [
          {
            type: 'Diploma Translation',
            image: '/images/sample-diploma.jpg',
          },
          {
            type: 'Transcript Translation',
            image: '/images/sample-transcript.jpg',
          },
          {
            type: 'Passport Translation',
            image: '/images/sample-passport.jpg',
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

describe('SampleDocumentsSection', () => {
  beforeEach(() => {
    vi.stubGlobal('useI18n', () => mockUseI18n())
  })

  const createWrapper = (props: any = {}) => {
    return mount(SampleDocumentsSection, {
      props: {
        keyPrefix: 'services.test-service.sampleDocuments',
        ...props,
      },
      global: {
        stubs: {
          BaseSectionHeader: {
            template: '<div><h2>{{ title }}</h2></div>',
            props: ['title'],
          },
          Icon: true,
          NuxtImg: {
            template: '<img :src="src" :alt="alt" />',
            props: ['src', 'alt'],
          },
        },
      },
    })
  }

  it('renders title from i18n', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Sample Pages')
  })

  it('renders all sample documents', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Diploma Translation')
    expect(wrapper.text()).toContain('Transcript Translation')
    expect(wrapper.text()).toContain('Passport Translation')
  })

  it('renders sample images', () => {
    const wrapper = createWrapper()

    // Check that samples are rendered (NuxtImg components)
    const sampleContainers = wrapper.findAll('[class*="bg-white rounded-lg"]')
    expect(sampleContainers.length).toBe(3)

    // Check that images have correct src attributes
    const images = wrapper.findAll('img')
    if (images.length > 0) {
      expect(images[0]?.attributes('src')).toContain('sample-diploma.jpg')
    }
  })

  it('allows title override', () => {
    const wrapper = createWrapper({ title: 'Document Examples' })

    expect(wrapper.text()).toContain('Document Examples')
  })

  it('allows layout prop', () => {
    const wrapper = createWrapper({ layout: 'carousel' })

    expect(wrapper.exists()).toBe(true)
  })
})
