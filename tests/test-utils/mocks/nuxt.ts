import { ref, type Ref } from 'vue'
import { mockFetch, type MockFetch } from './fetch'

export interface MockI18n {
  locale: Ref<string>
  t: (key: string, params?: Record<string, unknown>) => string
}

export interface MockNuxtApp {
  $i18n: MockI18n
  $fetch: MockFetch
}

export type { MockFetch }

export function mockUseI18n(initialLocale: string, messages: Record<string, any>): MockI18n {
  const locale = ref<string>(initialLocale)

  const resolveTranslation = (key: string): string | undefined => {
    const segments = key.split('.')
    let current: any = messages

    for (const segment of segments) {
      if (typeof current !== 'object' || current === null) {
        return undefined
      }
      current = current[segment]
    }

    return typeof current === 'string' ? current : undefined
  }

  const t = (key: string, params: Record<string, unknown> = {}) => {
    const message = resolveTranslation(key)

    if (typeof message !== 'string') {
      return key
    }

    return message.replace(/\{(\w+)\}/g, (_, paramKey) => {
      const value = params[paramKey]
      return value !== undefined ? String(value) : ''
    })
  }

  return {
    locale,
    t,
  }
}

export function mockNuxtApp(config?: Partial<MockNuxtApp>): MockNuxtApp {
  return {
    $i18n: config?.$i18n || mockUseI18n('en', {}),
    $fetch: config?.$fetch || mockFetch({}),
  }
}
