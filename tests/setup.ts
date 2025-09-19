import { vi } from 'vitest'
import { ref as vueRef, readonly as vueReadonly } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { config } from '@vue/test-utils'
import '@testing-library/jest-dom'

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
          AR: 'Arabic'
        }
      }
      return {}
    },
    locale: vueRef('en')
  }),
  useId: () => 'test-id',
  useApplicationModal: () => ({
    openModal: vi.fn()
  }),
  useLocalePath: () => (path: string) => path
}))

vi.stubGlobal('useI18n', () => ({
  t: (key: string) => key,
  tm: (key: string) => {
    if (key === 'universities_page.filters.languages') {
      return {
        TR: 'Turkish',
        EN: 'English',
        RU: 'Russian',
        AR: 'Arabic'
      }
    }
    return {}
  },
  locale: vueRef('en')
}))
vi.stubGlobal('useLocalePath', () => (path: string) => path)

// provide global i18n mock for templates and components
config.global.mocks = {
  ...(config.global.mocks || {}),
  $t: (key: string) => key
}

vi.stubGlobal('ref', vueRef)
vi.stubGlobal('readonly', vueReadonly)

// Mock global components
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Activate Pinia for components using stores
setActivePinia(createPinia())