import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick, ref } from 'vue'

// @ts-ignore - Vue component type import in test
import type PopularProgramsSectionType from '~/components/features/universities/sections/PopularProgramsSection.vue'

const PopularProgramsSection = {} as typeof PopularProgramsSectionType
import enUniversities from '~~/i18n/locales/en/pages/universities.json'
import ruUniversities from '~~/i18n/locales/ru/pages/universities.json'

// @ts-ignore - Nuxt auto-imports

type TestLocale = 'en' | 'ru'

const messagesByLocale: Record<TestLocale, typeof enUniversities> = {
  en: enUniversities,
  ru: ruUniversities,
}

const resolveTranslation = (locale: TestLocale, key: string): string | undefined => {
  const segments = key.split('.')
  let current: unknown = messagesByLocale[locale] as Record<string, unknown>

  for (const segment of segments) {
    if (typeof current !== 'object' || current === null) {
      return undefined
    }

    current = (current as Record<string, unknown>)[segment]
  }

  return typeof current === 'string' ? current : undefined
}

const createPriceText = (locale: TestLocale, value: number) => {
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

  const template = messagesByLocale[locale].universities_page.popular_programs.dynamic.price_from

  return template.replace('{price}', formattedPrice)
}

const createUniversitiesText = (locale: TestLocale, count: number) => {
  const pluralCategory = new Intl.PluralRules(locale).select(count)
  const dynamicMessages = messagesByLocale[locale].universities_page.popular_programs.dynamic
    .universities_count as Record<string, string>

  const template = dynamicMessages[pluralCategory] ?? dynamicMessages.other

  return template?.replace('{count}', String(count)) ?? ''
}

const createI18nMock = (initialLocale: TestLocale) => {
  const locale = ref<TestLocale>(initialLocale)

  const translate = (key: string, params: Record<string, unknown> = {}) => {
    const message = resolveTranslation(locale.value, key)

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
    t: translate,
  }
}

describe('PopularProgramsSection', () => {
  const mockResponse = {
    success: true,
    data: {
      it: {
        universities_count: 42,
        price_from: 3500,
        direction_slugs: [],
      },
      medicine: {
        universities_count: 28,
        price_from: 8000,
        direction_slugs: [],
      },
      engineering: {
        universities_count: 52,
        price_from: 4200,
        direction_slugs: [],
      },
      business: {
        universities_count: 38,
        price_from: 3800,
        direction_slugs: [],
      },
      design: {
        universities_count: 32,
        price_from: 5500,
        direction_slugs: [],
      },
      international: {
        universities_count: 25,
        price_from: 4000,
        direction_slugs: [],
      },
    },
  }

  let originalUseI18n: any
  let originalFetch: any
  let i18nMock: ReturnType<typeof createI18nMock>
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    i18nMock = createI18nMock('en')
    originalUseI18n = (globalThis as any).useI18n
    originalFetch = (globalThis as any).$fetch
    fetchMock = vi.fn().mockResolvedValue(mockResponse)

    ;(globalThis as any).useI18n = () => ({
      locale: i18nMock.locale,
      t: i18nMock.t,
    })

    ;(globalThis as any).$fetch = fetchMock
  })

  afterEach(() => {
    ;(globalThis as any).useI18n = originalUseI18n
    ;(globalThis as any).$fetch = originalFetch
    vi.clearAllMocks()
  })

  const mountComponent = () =>
    mount(PopularProgramsSection, {
      global: {
        stubs: {
          Icon: true,
        },
        config: {
          globalProperties: {
            $t: (key: string, params?: Record<string, unknown>) => i18nMock.t(key, params ?? {}),
          } as any,
        },
      },
    })

  it('renders dynamic values in the active locale', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    const firstProgramCard = wrapper.findAll('.grid > div').at(0)
    expect(firstProgramCard).toBeTruthy()

    const universitiesText = firstProgramCard!.find('.text-gray-500').text()
    const priceText = firstProgramCard!.find('.text-primary').text()

    expect(universitiesText).toBe(createUniversitiesText('en', 42))
    expect(priceText).toBe(createPriceText('en', 3500))
  })

  it('updates dynamic values when locale changes', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    i18nMock.locale.value = 'ru'
    await nextTick()

    const firstProgramCard = wrapper.findAll('.grid > div').at(0)
    expect(firstProgramCard).toBeTruthy()

    const universitiesText = firstProgramCard!.find('.text-gray-500').text()
    const priceText = firstProgramCard!.find('.text-primary').text()

    expect(universitiesText).toBe(createUniversitiesText('ru', 42))
    expect(priceText).toBe(createPriceText('ru', 3500))
  })
})
