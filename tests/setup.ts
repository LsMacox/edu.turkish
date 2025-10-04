import { vi } from 'vitest'
import {
  ref as vueRef,
  readonly as vueReadonly,
  computed as vueComputed,
  reactive as vueReactive,
  watch as vueWatch,
  watchEffect as vueWatchEffect,
  onMounted as vueOnMounted,
  onUnmounted as vueOnUnmounted,
  onBeforeUnmount as vueOnBeforeUnmount,
  nextTick as vueNextTick,
  useSlots as vueUseSlots,
  useId as vueUseId,
} from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { config } from '@vue/test-utils'
import '@testing-library/jest-dom'

// Mock console methods to reduce test noise
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
  log: vi.fn(),
  info: vi.fn(),
}

// Mock Nuxt composables
vi.mock('#imports', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    tm: (key: string) => {
      if (key === 'universities_page.filters.languages') {
        return {
          TR: 'Turkish',
          EN: 'English',
          RU: 'Russian',
          AR: 'Arabic',
        }
      }
      return {}
    },
    locale: vueRef('en'),
  }),
  useId: () => 'test-id',
  useApplicationModal: () => ({
    openModal: vi.fn(),
  }),
  useLocalePath: () => (path: string) => path,
  useRoute: () => ({ query: {}, path: '/' }),
  useRouter: () => ({ push: vi.fn() }),
  useRuntimeConfig: () => ({ public: { siteUrl: 'https://test.com' } }),
  useHead: vi.fn(),
  navigateTo: vi.fn(),
  useSwitchLocalePath: () => vi.fn(),
  useApplicationModalStore: () => ({
    isOpen: vueRef(false),
    openModal: vi.fn(),
    closeModal: vi.fn(),
    submitApplication: vi.fn(),
  }),
  useUniversitiesStore: () => ({
    universities: vueRef([]),
    fetchUniversities: vi.fn(),
  }),
}))

// Stub Nuxt composables globally
vi.stubGlobal('useI18n', () => ({
  t: (key: string) => key,
  tm: (key: string) => {
    if (key === 'universities_page.filters.languages') {
      return {
        TR: 'Turkish',
        EN: 'English',
        RU: 'Russian',
        AR: 'Arabic',
      }
    }
    return {}
  },
  locale: vueRef('en'),
}))
vi.stubGlobal('useLocalePath', () => (path: string) => path)
vi.stubGlobal('useRoute', () => ({ query: {}, path: '/' }))
vi.stubGlobal('useRouter', () => ({ push: vi.fn() }))
vi.stubGlobal('useRuntimeConfig', () => ({ public: { siteUrl: 'https://test.com' } }))
vi.stubGlobal('useHead', vi.fn())
vi.stubGlobal('navigateTo', vi.fn())
vi.stubGlobal('useSwitchLocalePath', () => vi.fn())
vi.stubGlobal('useApplicationModalStore', () => ({
  isOpen: vueRef(false),
  openModal: vi.fn(),
  closeModal: vi.fn(),
  submitApplication: vi.fn(),
}))
vi.stubGlobal('useUniversitiesStore', () => ({
  universities: vueRef([]),
  fetchUniversities: vi.fn(),
}))

// provide global i18n mock for templates and components
config.global.mocks = {
  ...(config.global.mocks || {}),
  $t: (key: string) => key,
}

// Stub all Vue APIs globally for auto-import compatibility
vi.stubGlobal('ref', vueRef)
vi.stubGlobal('readonly', vueReadonly)
vi.stubGlobal('computed', vueComputed)
vi.stubGlobal('reactive', vueReactive)
vi.stubGlobal('watch', vueWatch)
vi.stubGlobal('watchEffect', vueWatchEffect)
vi.stubGlobal('onMounted', vueOnMounted)
vi.stubGlobal('onUnmounted', vueOnUnmounted)
vi.stubGlobal('onBeforeUnmount', vueOnBeforeUnmount)
vi.stubGlobal('nextTick', vueNextTick)
vi.stubGlobal('useSlots', vueUseSlots)
vi.stubGlobal('useId', vueUseId)

// Mock global components
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Global component stubs for Nuxt modules
config.global.stubs = {
  ...config.global.stubs,
  Icon: {
    name: 'Icon',
    template: '<span data-testid="icon" :class="name"><slot /></span>',
    props: ['name'],
  },
  NuxtImg: {
    name: 'NuxtImg',
    template: '<img :src="src" :alt="alt" :loading="loading" :sizes="sizes" />',
    props: ['src', 'alt', 'sizes', 'loading', 'format', 'quality', 'placeholder'],
  },
}

// Activate Pinia for components using stores
setActivePinia(createPinia())
