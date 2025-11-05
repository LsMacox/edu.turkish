/**
 * Global Test Setup
 *
 * This file provides common test utilities and polyfills.
 *
 * Available Test Utilities (from ~~/tests/test-utils):
 *
 * Mocks:
 * - createMockPrisma() - Mock Prisma client for repository tests
 * - createMockQueue() - Mock Redis queue for integration tests
 * - createMockRedis() - Mock Redis client
 * - mockUseI18n(locale, messages) - Mock Nuxt i18n composable
 * - mockFetch(routes) - Mock $fetch with URL pattern matching
 * - mockNuxtApp(config) - Mock Nuxt app instance
 *
 * Fixtures:
 * - createUniversity(overrides) - Generate test university data
 * - createFAQ(overrides) - Generate test FAQ data
 * - createApplication(overrides) - Generate test application data
 * - createReview(overrides) - Generate test review data
 *
 * Usage Examples:
 *
 * Repository tests:
 *   import { createMockPrisma } from '~~/tests/test-utils'
 *   const prisma = createMockPrisma({ university: { findMany: vi.fn().mockResolvedValue([...]) } })
 *
 * Component tests:
 *   import { mockUseI18n } from '~~/tests/test-utils'
 *   const i18n = mockUseI18n('en', enMessages)
 *   globalThis.useI18n = () => i18n
 *
 * Integration tests:
 *   import { createMockQueue } from '~~/tests/test-utils'
 *   const queue = createMockQueue()
 *   const job = await queue.addJob('createLead', 'espocrm', data)
 */

import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { config } from '@vue/test-utils'
import { toCdnUrl } from '~/utils/cdn'
import {
  ref,
  computed,
  reactive,
  watch,
  watchEffect,
  onMounted,
  onUnmounted,
  nextTick,
  readonly,
  toRef,
  toRefs,
  useId,
} from 'vue'

const consoleMethodsToMock = ['debug', 'info', 'log', 'warn', 'error'] as const
type ConsoleMethod = (typeof consoleMethodsToMock)[number]
const consoleSpies: Partial<Record<ConsoleMethod, ReturnType<typeof vi.spyOn>>> = {}

beforeAll(() => {
  // Mock Nuxt server utilities globally
  const g = globalThis as any
  g.defineEventHandler = vi.fn((handler: any) => handler)
  g.getQuery = vi.fn(() => ({}))
  g.setResponseStatus = vi.fn()
  g.setHeader = vi.fn()
  g.getHeader = vi.fn()
  g.getCookie = vi.fn()
  g.setCookie = vi.fn()
  g.useRuntimeConfig = vi.fn(() => ({
    public: {
      siteUrl: 'https://edu-turkish.com',
      directusUrl: 'http://localhost:8055',
      cdnUrl: 'https://cdn.edu-turkish.com',
    },
  }))

  // Mock CDN composable
  g.useCdn = vi.fn(() => {
    const cfg = g.useRuntimeConfig()
    return {
      cdnUrl: (path: string) => toCdnUrl(path, cfg.public.cdnUrl),
    }
  })

  // Export Vue APIs globally for components
  g.ref = ref
  g.computed = computed
  g.reactive = reactive
  g.readonly = readonly
  g.toRef = toRef
  g.toRefs = toRefs
  g.watch = watch
  g.watchEffect = watchEffect
  g.onMounted = onMounted
  g.onUnmounted = onUnmounted
  g.nextTick = nextTick
  g.useId = useId

  // Mock Vue composables
  g.useSlots = vi.fn(() => ({
    default: () => [],
  }))
  g.useAttrs = vi.fn(() => ({}))

  // Mock Nuxt composables
  g.useI18n = vi.fn(() => ({
    t: (key: string) => key,
    tm: (_key: string) => [],
    locale: ref('ru'),
  }))
  g.useLocalePath = vi.fn(() => (path: string) => `/ru${path}`)
  g.useRoute = vi.fn(() => ({
    path: '/',
    query: {},
    params: {},
  }))
  g.useRouter = vi.fn(() => ({
    push: vi.fn(() => Promise.resolve()),
    replace: vi.fn(() => Promise.resolve()),
  }))

  // Mock Pinia stores
  g.useApplicationModalStore = vi.fn(() => ({
    openModal: vi.fn(),
    closeModal: vi.fn(),
    isOpen: false,
  }))

  // Configure Vue Test Utils global stubs
  config.global.stubs = {
    NuxtImg: {
      template: '<img :src="src" :alt="alt" />',
      props: ['src', 'alt', 'width', 'height', 'format', 'quality'],
    },
    Icon: {
      template: '<span :data-icon="name"></span>',
      props: ['name'],
    },
    BaseSectionHeader: {
      template:
        '<div><h2 class="section-title">{{ title }}</h2><p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p><slot /></div>',
      props: ['title', 'subtitle'],
    },
    UiDisplayFAQ: {
      // Minimal FAQ display to expose text content in tests
      template:
        '<section><h2>{{ title }}</h2><p v-if="subtitle">{{ subtitle }}</p><div v-for="(it, idx) in items" :key="idx"><h3>{{ it.question }}</h3><div>{{ typeof it.answer === "string" ? it.answer : (it.answer?.title || "") }}</div></div></section>',
      props: ['items', 'title', 'subtitle', 'background', 'showCta', 'variant'],
    },
  }

  // Mock i18n globally
  config.global.mocks = {
    $t: (key: string) => key,
  }

  // Silence console output during tests while keeping spy visibility
  consoleMethodsToMock.forEach((method) => {
    consoleSpies[method] = vi.spyOn(console, method).mockImplementation(() => {})
  })
  g.__consoleSpies__ = consoleSpies
})

afterEach(() => {
  // Clear mock cookies between tests to avoid state leakage
  const g = globalThis as any
  if (g.__mockCookies__ && typeof g.__mockCookies__.clear === 'function') {
    g.__mockCookies__.clear()
  }

  consoleMethodsToMock.forEach((method) => {
    consoleSpies[method]?.mockClear()
  })
})

afterAll(() => {
  consoleMethodsToMock.forEach((method) => {
    consoleSpies[method]?.mockRestore()
  })

  const g = globalThis as any
  delete g.__consoleSpies__
})
