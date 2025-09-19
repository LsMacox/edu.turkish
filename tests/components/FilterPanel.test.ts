import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import FilterPanel from '~/components/features/universities/discovery/FilterPanel.vue'
import BaseRangeSlider from '~/components/ui/forms/BaseRangeSlider.vue'
import { useUniversitiesStore } from '~/stores/universities'

const routerReplaceMock = vi.fn(() => Promise.resolve())
const routerPushMock = vi.fn(() => Promise.resolve())
const routeMock = { query: {} as Record<string, unknown> }

vi.stubGlobal('useRouter', () => ({
  replace: routerReplaceMock,
  push: routerPushMock
}))

vi.stubGlobal('useRoute', () => routeMock)

;(globalThis as unknown as { requestAnimationFrame: (cb: (time: number) => void) => number }).requestAnimationFrame = (cb: (time: number) => void) => {
  cb(0)
  return 0
}

if (typeof window !== 'undefined') {
  window.scrollTo = vi.fn()
}

const createStoreWithRange = (priceRange: [number, number]) => {
  const store = useUniversitiesStore()
  store.availableFilters = {
    cities: [],
    types: [],
    levels: [],
    languages: [],
    priceRange
  }
  store.filters = {
    q: '',
    city: 'Все города',
    langs: [],
    type: 'Все',
    level: 'Все',
    price: priceRange
  }

  return store
}

const mountFilterPanel = () => mount(FilterPanel, {
  global: {
    components: {
      UiFormsBaseRangeSlider: BaseRangeSlider
    },
    config: {
      globalProperties: {
        $t: (key: string) => key
      }
    },
    stubs: {
      UiFormsBaseTextField: {
        name: 'UiFormsBaseTextField',
        template: '<input />',
        props: ['modelValue']
      },
      UiFormsBaseSelect: {
        name: 'UiFormsBaseSelect',
        template: '<select><slot /></select>',
        props: ['modelValue']
      },
      UiFormsBaseCheckbox: {
        name: 'UiFormsBaseCheckbox',
        template: '<input type="checkbox" />',
        props: ['checked']
      },
      Icon: {
        name: 'Icon',
        template: '<span />',
        props: ['name']
      }
    }
  }
})

describe('FilterPanel', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    routerReplaceMock.mockClear()
    routerPushMock.mockClear()
    routeMock.query = {}
  })

  it('renders range slider with available price bounds', async () => {
    const initialRange: [number, number] = [500, 15000]
    const updatedRange: [number, number] = [1000, 20000]
    const store = createStoreWithRange(initialRange)

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
      priceRange: updatedRange
    }
    store.filters = {
      ...store.filters,
      price: updatedRange
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
    createStoreWithRange([500, 15000])

    const wrapper = mountFilterPanel()

    await nextTick()

    const applyButton = wrapper.findAll('button').find(button => button.text().includes('apply_button'))
    expect(applyButton).toBeDefined()

    await applyButton!.trigger('click')
    await nextTick()

    expect(routerReplaceMock).toHaveBeenCalledTimes(1)
  })
})
