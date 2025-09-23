import { vi } from 'vitest'
import { ref as vueRef, readonly as vueReadonly } from 'vue'
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
}))

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

// provide global i18n mock for templates and components
config.global.mocks = {
  ...(config.global.mocks || {}),
  $t: (key: string) => key,
}

vi.stubGlobal('ref', vueRef)
vi.stubGlobal('readonly', vueReadonly)

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
