import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import FilterPanel from '~/components/features/universities/discovery/FilterPanel.vue'
import BaseRangeSlider from '~/components/shared/BaseRangeSlider.vue'
import { useUniversitiesStore } from '~/stores/universities'

const routerReplaceMock = vi.fn(() => Promise.resolve())
const routerPushMock = vi.fn(() => Promise.resolve())
const routeMock = { query: {} as Record<string, unknown> }

vi.stubGlobal('useRouter', () => ({
  replace: routerReplaceMock,
  push: routerPushMock,
}))

vi.stubGlobal('useRoute', () => routeMock)
vi.stubGlobal('useI18n', () => ({
  t: (key: string) => key,
  locale: { value: 'ru' },
}))
;(
  globalThis as unknown as { requestAnimationFrame: (cb: (time: number) => void) => number }
).requestAnimationFrame = (cb: (time: number) => void) => {
  cb(0)
  return 0
}

if (typeof window !== 'undefined') {
  window.scrollTo = vi.fn()
}

const createStoreWithRange = (priceRange: [number, number], levelOptions: string[] = []) => {
  const store = useUniversitiesStore()
  store.availableFilters = {
    cities: [],
    types: [],
    levels: levelOptions,
    languages: [],
    priceRange,
  }
  store.filters = {
    q: '',
    city: 'Все города',
    langs: [],
    type: 'Все',
    level: 'all',
    price: priceRange,
  }

  return store
}

const mountFilterPanel = () =>
  mount(FilterPanel, {
    global: {
      components: {
        BaseRangeSlider,
      },
      config: {
        globalProperties: {
          $t: (key: string) => key,
        } as unknown as Record<string, any>,
      },
      stubs: {
        BaseTextField: {
          name: 'BaseTextField',
          template: '<input />',
          props: ['modelValue'],
        },
        BaseSelect: {
          name: 'BaseSelect',
          template: '<select><slot /></select>',
          props: ['modelValue'],
        },
        BaseCheckbox: {
          name: 'BaseCheckbox',
          template: '<input type="checkbox" />',
          props: ['checked'],
        },
        Icon: {
          name: 'Icon',
          template: '<span />',
          props: ['name'],
        },
      },
    },
  })

describe('FilterPanel', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    routerReplaceMock.mockClear()
    routerPushMock.mockClear()
    routeMock.query = {}
  })

  it('renders language checkboxes from available filters', async () => {
    const store = createStoreWithRange([500, 15000], [])
    // Provide languages in the store's availableFilters
    store.availableFilters = {
      ...store.availableFilters,
      languages: ['TR', 'EN', 'RU'],
    }

    const wrapper = mountFilterPanel()

    await nextTick()

    const checkboxInputs = wrapper.findAll('input[type="checkbox"]')
    expect(checkboxInputs).toHaveLength(3)
  })

  it('renders range slider with available price bounds', async () => {
    const initialRange: [number, number] = [500, 15000]
    const updatedRange: [number, number] = [1000, 20000]
    const store = createStoreWithRange(initialRange, ['bachelor', 'master', 'phd'])

    const wrapper = mountFilterPanel()

    await nextTick()

    const sliderInput = wrapper.find('input[type="range"]')
    expect(sliderInput.exists()).toBe(true)
    expect(sliderInput.attributes('min')).toBe(String(initialRange[0]))
    expect(sliderInput.attributes('max')).toBe(String(initialRange[1]))

    const rangeDisplay = wrapper.find('span.text-gray-600')
    expect(rangeDisplay.exists()).toBe(true)
    expect(rangeDisplay.text()).toBe('$500 - $15,000')

    store.availableFilters = {
      ...store.availableFilters,
      priceRange: updatedRange,
    }
    store.filters = {
      ...store.filters,
      price: updatedRange,
    }

    await nextTick()
    await nextTick()

    const updatedSliderInput = wrapper.find('input[type="range"]')
    expect(updatedSliderInput.attributes('min')).toBe(String(updatedRange[0]))
    expect(updatedSliderInput.attributes('max')).toBe(String(updatedRange[1]))

    const updatedRangeDisplay = wrapper.find('span.text-gray-600')
    expect(updatedRangeDisplay.text()).toBe('$1,000 - $20,000')
  })

  it('triggers a single route update when apply is clicked', async () => {
    createStoreWithRange([500, 15000], ['bachelor'])

    const wrapper = mountFilterPanel()

    await nextTick()

    const applyButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('apply_button'))
    expect(applyButton).toBeDefined()

    await applyButton!.trigger('click')
    await nextTick()

    expect(routerReplaceMock).toHaveBeenCalledTimes(1)
  })
  it('renders level options based on available filters', async () => {
    createStoreWithRange([500, 15000], ['bachelor', 'master', 'phd'])

    const wrapper = mountFilterPanel()

    await nextTick()

    const levelSelect = wrapper
      .findAll('select')
      .find((select) =>
        select
          .findAll('option')
          .some((option) => option.text() === 'universities_page.filters.levels.bachelor'),
      )

    expect(levelSelect).toBeDefined()
    const options = levelSelect!.findAll('option')

    expect(options.map((option) => option.attributes('value'))).toEqual([
      'all',
      'bachelor',
      'master',
      'phd',
    ])
    expect(options.map((option) => option.text())).toEqual([
      'universities_page.filters.all_levels',
      'universities_page.filters.levels.bachelor',
      'universities_page.filters.levels.master',
      'universities_page.filters.levels.doctorate',
    ])
  })
})
