import { vi } from 'vitest'
import { ref as vueRef, readonly as vueReadonly } from 'vue'
import '@testing-library/jest-dom'

// Mock Nuxt composables
vi.mock('#imports', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: vueRef('en')
  }),
  useId: () => 'test-id',
  useApplicationModal: () => ({
    openModal: vi.fn()
  })
}))

vi.stubGlobal('useI18n', () => ({
  t: (key: string) => key,
  locale: vueRef('en')
}))

vi.stubGlobal('ref', vueRef)
vi.stubGlobal('readonly', vueReadonly)

// Mock global components
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))