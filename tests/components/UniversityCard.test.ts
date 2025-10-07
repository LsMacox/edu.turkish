import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UniversityCard from '~/components/features/universities/cards/UniversityCard.vue'

// Mock child components
vi.mock('~/components/features/universities/cards/UniversityCardHeader.vue', () => ({
  default: {
    name: 'UniversityCardHeader',
    template: '<div data-testid="card-header">Header</div>',
    props: ['title', 'type', 'typeLabel', 'featured'],
  },
}))

vi.mock('~/components/features/universities/cards/UniversityCardDetails.vue', () => ({
  default: {
    name: 'UniversityCardDetails',
    template: '<div data-testid="card-details">Details</div>',
    props: ['city', 'languages', 'tuition', 'badge'],
  },
}))

vi.mock('~/components/features/universities/cards/UniversityCardActions.vue', () => ({
  default: {
    name: 'UniversityCardActions',
    template: '<div data-testid="card-actions">Actions</div>',
    props: ['detailHref', 'applyLabel', 'detailLabel'],
    emits: ['apply'],
  },
}))

vi.mock('~/components/ui/display/BaseCard.vue', () => ({
  default: {
    name: 'BaseCard',
    template: '<div class="base-card"><slot /></div>',
    props: ['class', 'hover', 'shadow', 'rounded', 'padding'],
  },
}))

// Mock Nuxt composables
vi.stubGlobal('useI18n', () => ({
  t: (key: string) => key,
  locale: { value: 'ru' },
}))

vi.stubGlobal('useLocalePath', () => {
  return (path: string) => `/ru${path}`
})

vi.stubGlobal('useApplicationModalStore', () => ({
  openModal: vi.fn(),
}))

describe('UniversityCard', () => {
  const defaultProps = {
    title: 'Istanbul Technical University',
    city: 'Istanbul',
    languages: ['TR', 'EN'],
    tuition: 3500,
    image: 'https://example.com/image.jpg',
    type: 'state' as const,
    slug: 'istanbul-tech',
  }

  it('renders all subcomponents correctly', () => {
    const wrapper = mount(UniversityCard, {
      props: defaultProps,
      global: {
        stubs: {
          NuxtImg: true,
          Icon: true,
        },
      },
    })

    expect(wrapper.find('[data-testid="card-header"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="card-details"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="card-actions"]').exists()).toBe(true)
  })

  it('displays university image when provided', () => {
    const wrapper = mount(UniversityCard, {
      props: defaultProps,
      global: {
        stubs: {
          NuxtImg: true,
          Icon: true,
        },
      },
    })

    // Verify that NuxtImg is rendered when image is provided
    const nuxtImg = wrapper.find('nuxtimg')
    expect(nuxtImg.exists()).toBe(true)
    expect(nuxtImg.attributes('src')).toBe(defaultProps.image)
    expect(nuxtImg.attributes('alt')).toBe(`${defaultProps.title} campus`)

    // Verify that the fallback div (with Icon) is NOT rendered when image is provided
    const fallbackDiv = wrapper.find('.bg-gray-200')
    expect(fallbackDiv.exists()).toBe(false)
  })

  it('shows fallback icon when no image provided', () => {
    const wrapper = mount(UniversityCard, {
      props: {
        ...defaultProps,
        image: undefined,
      },
      global: {
        stubs: {
          Icon: {
            template: '<span data-testid="icon" />',
            props: ['name', 'class'],
          },
        },
      },
    })

    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
  })

  it('generates correct detail href from slug', () => {
    const wrapper = mount(UniversityCard, {
      props: defaultProps,
    })

    // Verify the detailHref is passed to the actions component
    const actions = wrapper.findComponent({ name: 'UniversityCardActions' })
    expect(actions.props('detailHref')).toBe('/ru/university/istanbul-tech')
  })

  it('generates fallback href when no slug provided', () => {
    const wrapper = mount(UniversityCard, {
      props: {
        ...defaultProps,
        slug: undefined,
      },
    })

    // Verify the fallback detailHref is passed to the actions component
    const actions = wrapper.findComponent({ name: 'UniversityCardActions' })
    expect(actions.props('detailHref')).toBe('/ru/university/istanbul-technical-university')
  })

  it('computes type label correctly', () => {
    const wrapper = mount(UniversityCard, {
      props: {
        ...defaultProps,
        type: 'private',
      },
    })

    // Verify the typeLabel is passed to the header component
    const header = wrapper.findComponent({ name: 'UniversityCardHeader' })
    expect(header.props('typeLabel')).toBe('universities_page.card.types.private')
  })

  it('handles missing type gracefully', () => {
    const wrapper = mount(UniversityCard, {
      props: {
        ...defaultProps,
        type: undefined,
      },
    })

    // Verify empty typeLabel is passed to the header component
    const header = wrapper.findComponent({ name: 'UniversityCardHeader' })
    expect(header.props('typeLabel')).toBe('')
  })
})
