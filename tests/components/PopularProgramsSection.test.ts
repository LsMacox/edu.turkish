import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { mockUseI18n, mockFetch } from '~~/tests/test-utils'
import PopularProgramsSection from '~/components/features/universities/sections/PopularProgramsSection.vue'
import enUniversities from '~~/i18n/locales/en/pages/universities.json'
import ruUniversities from '~~/i18n/locales/ru/pages/universities.json'

type TestLocale = 'en' | 'ru'

const messagesByLocale: Record<TestLocale, typeof enUniversities> = {
  en: enUniversities,
  ru: ruUniversities,
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
  let i18nMock: ReturnType<typeof mockUseI18n>
  let fetchMock: ReturnType<typeof mockFetch>

  beforeEach(() => {
    originalUseI18n = (globalThis as any).useI18n
    originalFetch = (globalThis as any).$fetch

    i18nMock = mockUseI18n('en', enUniversities)
    fetchMock = mockFetch({ '/api/v1/universities/popular-programs': mockResponse })

    ;(globalThis as any).useI18n = () => ({
      locale: i18nMock.locale,
      t: i18nMock.t,
    })

    ;(globalThis as any).$fetch = fetchMock
  })

  afterEach(() => {
    ;(globalThis as any).useI18n = originalUseI18n
    ;(globalThis as any).$fetch = originalFetch
  })

  const mountComponent = () =>
    mount(PopularProgramsSection, {
      global: {
        stubs: {
          Icon: true,
          BaseSectionHeader: {
            name: 'BaseSectionHeader',
            template: '<div data-testid="section-header"><slot /></div>',
            props: ['title', 'subtitle', 'align', 'marginBottom'],
          },
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

    // Update the global i18n mock to return Russian translations
    ;(globalThis as any).useI18n = () => ({
      locale: { value: 'ru' },
      t: (key: string, params?: Record<string, unknown>) => {
        const messages = ruUniversities as any
        const keys = key.split('.')
        let value: any = messages
        for (const k of keys) {
          value = value?.[k]
        }
        
        if (typeof value === 'string' && params) {
          return Object.entries(params).reduce((str, [k, v]) => {
            return str.replace(`{${k}}`, String(v))
          }, value)
        }
        
        return value || key
      },
    })

    // Force re-render by unmounting and remounting
    wrapper.unmount()
    const newWrapper = mountComponent()
    await flushPromises()

    const firstProgramCard = newWrapper.findAll('.grid > div').at(0)
    expect(firstProgramCard).toBeTruthy()

    const universitiesText = firstProgramCard!.find('.text-gray-500').text()
    const priceText = firstProgramCard!.find('.text-primary').text()

    expect(universitiesText).toBe(createUniversitiesText('ru', 42))
    expect(priceText).toBe(createPriceText('ru', 3500))
  })
})
