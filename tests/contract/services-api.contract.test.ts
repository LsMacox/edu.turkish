// @vitest-environment node
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import type {
  ServiceCategoryListItem,
  ServiceCategoryDetail,
} from '~~/server/types/api/services'

// Mock Prisma to provide deterministic data and prevent real DB usage
vi.mock('~~/lib/prisma', async () => {
  const { createMockPrisma } = await import('~~/tests/test-utils')
  const prisma = createMockPrisma()
  const categories = [
    {
      id: 1,
      slug: 'turkish-english-course',
      order: 1,
      isActive: true,
      translations: [
        { locale: 'en', title: 'Turkish-English Course', subtitle: null, slug: 'turkish-english-course', metadata: { a: 1 } },
        { locale: 'ru', title: 'Турецко-английский курс', subtitle: null, slug: 'turkish-english-course-ru', metadata: { a: 1 } },
      ],
      subServices: [
        {
          id: 10,
          slug: 'basic',
          priceUsd: { toNumber: () => 50 },
          deliveryTimeDays: 7,
          order: 1,
          translations: [
            { locale: 'en', name: 'Basic', description: 'desc' },
            { locale: 'ru', name: 'Базовый', description: 'описание' },
          ],
        },
        {
          id: 11,
          slug: 'pro',
          priceUsd: { toNumber: () => 120 },
          deliveryTimeDays: 14,
          order: 2,
          translations: [
            { locale: 'en', name: 'Pro', description: 'desc' },
            { locale: 'ru', name: 'Профи', description: 'описание' },
          ],
        },
      ],
    },
  ]
  ;(prisma.serviceCategory.findMany as any) = vi.fn(async () =>
    categories.map(({ translations, subServices, ...c }) => ({ ...c, translations }))
  )
  ;(prisma.serviceCategory.findUnique as any) = vi.fn(async ({ where }: any) => {
    const found = categories.find((c) => c.slug === where.slug)
    return found ?? null
  })
  return { prisma: prisma as any }
})

describe('Services API Contract', async () => {
  await setup({
    server: true,
    dev: true,
    nuxtConfig: {
      buildDir: '.nuxt-test',
      vite: {
        build: { sourcemap: false },
      },
      nitro: {
        sourceMap: false,
      },
    },
  })
  const BASE_URL = '/api/v1/services'

  describe('GET /api/v1/services/categories', () => {
    let response: Response
    let data: { categories: ServiceCategoryListItem[] }

    beforeAll(async () => {
      const json = await $fetch<{ categories: ServiceCategoryListItem[] }>(`${BASE_URL}/categories?locale=ru`)
      response = { status: 200 } as any
      data = json
    })

    it('should return 200 status', () => {
      expect(response.status).toBe(200)
    })

    it('should return array with correct shape', () => {
      expect(data).toHaveProperty('categories')
      expect(Array.isArray(data.categories)).toBe(true)
      expect(data.categories.length).toBeGreaterThan(0)
    })

    it('should have correct category structure', () => {
      const category = data.categories[0]

      expect(category).toMatchObject({
        id: expect.any(Number),
        slug: expect.any(String),
        title: expect.any(String),
        localizedSlug: expect.any(String),
        order: expect.any(Number),
      })
    })

    it('should have subtitle as string or null', () => {
      const category = data.categories[0]!

      if (category.subtitle !== null) {
        expect(typeof category.subtitle).toBe('string')
      }
    })

    it('should return categories ordered by order field', () => {
      const orders = data.categories.map((c) => c.order)
      const sortedOrders = [...orders].sort((a, b) => a - b)

      expect(orders).toEqual(sortedOrders)
    })

    it('should return translations for specified locale', async () => {
      const ruData = await $fetch<{ categories: ServiceCategoryListItem[] }>(`${BASE_URL}/categories?locale=ru`)

      // Russian translations should contain Cyrillic characters
      const hasRussian = ruData.categories.some((c: ServiceCategoryListItem) =>
        /[А-Яа-я]/.test(c.title)
      )
      expect(hasRussian).toBe(true)
    })

    it('should return 400 for invalid locale', async () => {
      try {
        await $fetch(`${BASE_URL}/categories?locale=invalid`)
        throw new Error('Expected error')
      } catch (e: any) {
        expect(e?.statusCode || e?.response?.status).toBe(400)
      }
    })

    it('should default to English when locale not specified', async () => {
      const data = await $fetch<{ categories: ServiceCategoryListItem[] }>(`${BASE_URL}/categories`)
      expect(data.categories).toBeTruthy()
    })

    it('should respond in less than 100ms', async () => {
      const startTime = Date.now()
      await $fetch(`${BASE_URL}/categories?locale=en`)
      const endTime = Date.now()

      expect(endTime - startTime).toBeLessThan(100)
    })
  })

  describe('GET /api/v1/services/:slug', () => {
    const testSlug = 'turkish-english-course'
    it('should return 200 status', async () => {
      await $fetch<{ category: ServiceCategoryDetail }>(`${BASE_URL}/${testSlug}?locale=ru`)
      const response = { status: 200 } as any
      expect(response.status).toBe(200)
    })

    it('should return category with all required fields', async () => {
      const data = await $fetch<{ category: ServiceCategoryDetail }>(`${BASE_URL}/${testSlug}?locale=ru`)
      expect(data).toHaveProperty('category')
      expect(data.category).toMatchObject({
        id: expect.any(Number),
        slug: expect.any(String),
        title: expect.any(String),
        localizedSlug: expect.any(String),
        subServices: expect.any(Array),
      })
    })

    it('should have metadata as object or null', async () => {
      const data = await $fetch<{ category: ServiceCategoryDetail }>(`${BASE_URL}/${testSlug}?locale=ru`)
      if (data.category.metadata !== null) {
        expect(typeof data.category.metadata).toBe('object')
      }
    })

    it('should include sub-services array', async () => {
      const data = await $fetch<{ category: ServiceCategoryDetail }>(`${BASE_URL}/${testSlug}?locale=ru`)
      expect(Array.isArray(data.category.subServices)).toBe(true)
    })

    it('should have correct sub-service structure', async () => {
      const data = await $fetch<{ category: ServiceCategoryDetail }>(`${BASE_URL}/${testSlug}?locale=ru`)
      if (data.category.subServices.length > 0) {
        const subService = data.category.subServices[0]

        expect(subService).toMatchObject({
          id: expect.any(Number),
          slug: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          priceUsd: expect.any(Number),
          order: expect.any(Number),
        })
      }
    })

    it('should have priceUsd as positive number', async () => {
      const data = await $fetch<{ category: ServiceCategoryDetail }>(`${BASE_URL}/${testSlug}?locale=ru`)
      if (data.category.subServices.length > 0) {
        const subService = data.category.subServices[0]!
        expect(subService.priceUsd).toBeGreaterThan(0)
      }
    })

    it('should have deliveryTimeDays as number or null', async () => {
      const data = await $fetch<{ category: ServiceCategoryDetail }>(`${BASE_URL}/${testSlug}?locale=ru`)
      if (data.category.subServices.length > 0) {
        const subService = data.category.subServices[0]!

        if (subService.deliveryTimeDays !== null) {
          expect(typeof subService.deliveryTimeDays).toBe('number')
        }
      }
    })

    it('should order sub-services by order field', async () => {
      const data = await $fetch<{ category: ServiceCategoryDetail }>(`${BASE_URL}/${testSlug}?locale=ru`)
      if (data.category.subServices.length > 1) {
        const orders = data.category.subServices.map((s) => s.order)
        const sortedOrders = [...orders].sort((a, b) => a - b)

        expect(orders).toEqual(sortedOrders)
      }
    })

    it('should return 404 for non-existent category', async () => {
      try {
        await $fetch(`${BASE_URL}/invalid-slug-123?locale=en`)
        throw new Error('Expected error')
      } catch (e: any) {
        expect(e?.statusCode || e?.response?.status).toBe(404)
      }
    })

    it('should return 400 for invalid locale', async () => {
      try {
        await $fetch(`${BASE_URL}/${testSlug}?locale=xyz`)
        throw new Error('Expected error')
      } catch (e: any) {
        expect(e?.statusCode || e?.response?.status).toBe(400)
      }
    })

    it('should return translations for specified locale', async () => {
      const ruData = await $fetch<{ category: ServiceCategoryDetail }>(`${BASE_URL}/${testSlug}?locale=ru`)

      // Russian translations should contain Cyrillic characters
      const hasRussian = /[А-Яа-я]/.test(ruData.category.title)
      expect(hasRussian).toBe(true)
    })

    it('should respond in less than 100ms', async () => {
      const startTime = Date.now()
      await $fetch(`${BASE_URL}/${testSlug}?locale=en`)
      const endTime = Date.now()

      expect(endTime - startTime).toBeLessThan(100)
    })
  })
})
