import { vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock Nuxt composables
vi.mock('#imports', () => ({
  useI18n: () => ({
    t: (key: string) => key
  }),
  useId: () => 'test-id',
  useApplicationModal: () => ({
    openModal: vi.fn()
  })
}))

// Mock global components
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))