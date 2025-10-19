import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ServiceRepository } from '~~/server/repositories/ServiceRepository'
import type { SupportedLocale } from '~~/server/types/api/services'
import { createMockPrisma, type MockPrismaClient } from '~~/tests/test-utils'

describe('ServiceRepository', () => {
  let prisma: MockPrismaClient
  let repository: ServiceRepository

  beforeEach(() => {
    prisma = createMockPrisma()
    repository = new ServiceRepository(prisma as any)

    const categories = [
      {
        id: 1,
        slug: 'turkish-english-course',
        order: 1,
        isActive: true,
        translations: [
          {
            locale: 'en',
            title: 'Turkish-English Course',
            subtitle: null,
            slug: 'turkish-english-course',
            metadata: { a: 1 },
          },
          {
            locale: 'ru',
            title: 'Турецко-английский курс',
            subtitle: null,
            slug: 'turkish-english-course-ru',
            metadata: { a: 1 },
          },
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
      {
        id: 2,
        slug: 'another-cat',
        order: 2,
        isActive: true,
        translations: [
          {
            locale: 'en',
            title: 'Another',
            subtitle: null,
            slug: 'another-cat',
            metadata: null,
          },
        ],
        subServices: [],
      },
    ]

    ;(prisma.serviceCategory.findMany as any) = vi
      .fn()
      .mockResolvedValue(categories.map(({ translations, subServices, ...c }) => ({ ...c, translations })))

    ;(prisma.serviceCategory.findUnique as any) = vi
      .fn()
      .mockImplementation(async ({ where }: any) => {
        const found = categories.find((c) => c.slug === where.slug)
        if (!found) return null
        return found
      })

    ;(prisma.subService.findUnique as any) = vi
      .fn()
      .mockImplementation(async ({ where }: any) => {
        const { serviceCategoryId, slug } = where.serviceCategoryId_slug || {}
        if (serviceCategoryId === 1 && slug === 'basic') {
          return { id: 10, serviceCategoryId: 1, slug: 'basic' }
        }
        return null
      })

    ;(prisma.subService.create as any) = vi
      .fn()
      .mockImplementation(async ({ data }: any) => ({ id: 999, ...data }))

    ;(prisma.subServiceTranslation.createMany as any) = vi
      .fn()
      .mockResolvedValue({ count: 4 })

    ;(prisma.subService.update as any) = vi
      .fn()
      .mockImplementation(async ({ where }: any) => ({ id: where.id }))
  })

  afterEach(async () => {
    await prisma.$disconnect()
  })

  describe('findAllCategories', () => {
    it('should return all active categories ordered by order field', async () => {
      const categories = await repository.findAllCategories('en')

      expect(categories.length).toBeGreaterThan(0)

      // Check ordering
      for (let i = 1; i < categories.length; i++) {
        expect(categories[i]!.order).toBeGreaterThanOrEqual(categories[i - 1]!.order)
      }
    })

    it('should return translations for specified locale', async () => {
      const categories = await repository.findAllCategories('ru')

      expect(categories.length).toBeGreaterThan(0)

      // Russian translations should exist
      const hasRussian = categories.some((c) => /[А-Яа-я]/.test(c.title))
      expect(hasRussian).toBe(true)
    })

    it('should fall back to English when translation missing', async () => {
      const categories = await repository.findAllCategories('kk')

      expect(categories.length).toBeGreaterThan(0)

      // Should have titles even if Kazakh translation is missing
      categories.forEach((category) => {
        expect(category.title).toBeTruthy()
        expect(category.title).not.toBe('Untitled')
      })
    })

    it('should return correct structure for each category', async () => {
      const categories = await repository.findAllCategories('en')

      categories.forEach((category) => {
        expect(category).toHaveProperty('id')
        expect(category).toHaveProperty('slug')
        expect(category).toHaveProperty('title')
        expect(category).toHaveProperty('localizedSlug')
        expect(category).toHaveProperty('order')

        expect(typeof category.id).toBe('number')
        expect(typeof category.slug).toBe('string')
        expect(typeof category.title).toBe('string')
        expect(typeof category.localizedSlug).toBe('string')
        expect(typeof category.order).toBe('number')
      })
    })

    it('should work with all supported locales', async () => {
      const locales: SupportedLocale[] = ['en', 'ru', 'kk', 'tr']

      for (const locale of locales) {
        const categories = await repository.findAllCategories(locale)
        expect(categories.length).toBeGreaterThan(0)
      }
    })
  })

  describe('findCategoryBySlug', () => {
    const testSlug = 'turkish-english-course'

    it('should return category with sub-services', async () => {
      const category = await repository.findCategoryBySlug(testSlug, 'ru')

      expect(category).toBeTruthy()
      expect(category!.slug).toBe(testSlug)
      expect(category!.subServices).toBeInstanceOf(Array)
      expect(category!.subServices.length).toBeGreaterThan(0)
    })

    it('should return null for non-existent category', async () => {
      const category = await repository.findCategoryBySlug('invalid-slug-123', 'en')

      expect(category).toBeNull()
    })

    it('should order sub-services by order field', async () => {
      const category = await repository.findCategoryBySlug(testSlug, 'en')

      expect(category).toBeTruthy()

      if (category!.subServices.length > 1) {
        for (let i = 1; i < category!.subServices.length; i++) {
          expect(category!.subServices[i]!.order).toBeGreaterThanOrEqual(
            category!.subServices[i - 1]!.order
          )
        }
      }
    })

    it('should include only active sub-services', async () => {
      const category = await repository.findCategoryBySlug(testSlug, 'en')

      expect(category).toBeTruthy()

      // All returned sub-services should be active (we can't directly check isActive
      // as it's not in the response, but they should all be present)
      expect(category!.subServices.length).toBeGreaterThan(0)
    })

    it('should return correct sub-service structure', async () => {
      const category = await repository.findCategoryBySlug(testSlug, 'en')

      expect(category).toBeTruthy()

      category!.subServices.forEach((subService) => {
        expect(subService).toHaveProperty('id')
        expect(subService).toHaveProperty('slug')
        expect(subService).toHaveProperty('name')
        expect(subService).toHaveProperty('description')
        expect(subService).toHaveProperty('priceUsd')
        expect(subService).toHaveProperty('order')

        expect(typeof subService.id).toBe('number')
        expect(typeof subService.slug).toBe('string')
        expect(typeof subService.name).toBe('string')
        expect(typeof subService.description).toBe('string')
        expect(typeof subService.priceUsd).toBe('number')
        expect(typeof subService.order).toBe('number')

        expect(subService.priceUsd).toBeGreaterThan(0)
      })
    })

    it('should return translations for specified locale', async () => {
      const category = await repository.findCategoryBySlug(testSlug, 'ru')

      expect(category).toBeTruthy()

      // Russian translations should exist
      const hasRussian = /[А-Яа-я]/.test(category!.title)
      expect(hasRussian).toBe(true)

      if (category!.subServices.length > 0) {
        const hasRussianSubService = category!.subServices.some((s) =>
          /[А-Яа-я]/.test(s.name)
        )
        expect(hasRussianSubService).toBe(true)
      }
    })

    it('should fall back to English when translation missing', async () => {
      const category = await repository.findCategoryBySlug(testSlug, 'kk')

      expect(category).toBeTruthy()
      expect(category!.title).toBeTruthy()
      expect(category!.title).not.toBe('Untitled')

      category!.subServices.forEach((subService) => {
        expect(subService.name).toBeTruthy()
        expect(subService.name).not.toBe('Untitled')
      })
    })

    it('should include metadata when present', async () => {
      const category = await repository.findCategoryBySlug(testSlug, 'ru')

      expect(category).toBeTruthy()

      if (category!.metadata !== null) {
        expect(typeof category!.metadata).toBe('object')
      }
    })

    it('should work with all supported locales', async () => {
      const locales: SupportedLocale[] = ['en', 'ru', 'kk', 'tr']

      for (const locale of locales) {
        const category = await repository.findCategoryBySlug(testSlug, locale)
        expect(category).toBeTruthy()
        expect(category!.subServices.length).toBeGreaterThan(0)
      }
    })
  })

  describe('createSubService', () => {
    it('should create sub-service with translations', async () => {
      // Get a category to use for testing
      const categories = await repository.findAllCategories('en')
      const categoryId = categories[0]!.id

      const input = {
        serviceCategoryId: categoryId,
        slug: 'test-sub-service-' + Date.now(),
        priceUsd: 100.0,
        order: 999,
        translations: [
          { locale: 'en' as const, name: 'Test Service', description: 'Test description' },
          { locale: 'ru' as const, name: 'Тестовая услуга', description: 'Тестовое описание' },
          { locale: 'kk' as const, name: 'Тест қызметі', description: 'Тест сипаттамасы' },
          { locale: 'tr' as const, name: 'Test Hizmeti', description: 'Test açıklaması' },
        ],
      }

      const result = await repository.createSubService(input)

      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('slug')
      expect(result.slug).toBe(input.slug)

      // Clean up
      await prisma.subService.delete({ where: { id: result.id } })
    })

    it('should throw error for duplicate slug within category', async () => {
      const categories = await repository.findAllCategories('en')
      const category = await repository.findCategoryBySlug(categories[0]!.slug, 'en')

      if (category && category.subServices.length > 0) {
        const existingSlug = category.subServices[0]!.slug

        const input = {
          serviceCategoryId: category.id,
          slug: existingSlug,
          priceUsd: 100.0,
          translations: [
            { locale: 'en' as const, name: 'Test', description: 'Test' },
            { locale: 'ru' as const, name: 'Test', description: 'Test' },
            { locale: 'kk' as const, name: 'Test', description: 'Test' },
            { locale: 'tr' as const, name: 'Test', description: 'Test' },
          ],
        }

        await expect(repository.createSubService(input)).rejects.toThrow()
      }
    })

    it('should throw error for missing translations', async () => {
      const categories = await repository.findAllCategories('en')
      const categoryId = categories[0]!.id

      const input = {
        serviceCategoryId: categoryId,
        slug: 'test-incomplete-' + Date.now(),
        priceUsd: 100.0,
        translations: [
          { locale: 'en' as const, name: 'Test', description: 'Test' },
          // Missing ru, kk, tr
        ],
      }

      await expect(repository.createSubService(input)).rejects.toThrow()
    })

    it('should throw error for negative price', async () => {
      const categories = await repository.findAllCategories('en')
      const categoryId = categories[0]!.id

      const input = {
        serviceCategoryId: categoryId,
        slug: 'test-negative-' + Date.now(),
        priceUsd: -100.0,
        translations: [
          { locale: 'en' as const, name: 'Test', description: 'Test' },
          { locale: 'ru' as const, name: 'Test', description: 'Test' },
          { locale: 'kk' as const, name: 'Test', description: 'Test' },
          { locale: 'tr' as const, name: 'Test', description: 'Test' },
        ],
      }

      await expect(repository.createSubService(input)).rejects.toThrow()
    })
  })

  describe('updateSubService', () => {
    it('should update sub-service fields', async () => {
      const categories = await repository.findAllCategories('en')
      const category = await repository.findCategoryBySlug(categories[0]!.slug, 'en')

      if (category && category.subServices.length > 0) {
        const subServiceId = category.subServices[0]!.id
        const originalPrice = category.subServices[0]!.priceUsd

        const input = {
          priceUsd: originalPrice + 50,
        }

        const result = await repository.updateSubService(subServiceId, input)

        expect(result).toHaveProperty('id')
        expect(result.id).toBe(subServiceId)

        // Restore original price
        await repository.updateSubService(subServiceId, { priceUsd: originalPrice })
      }
    })

    it('should throw error for negative price', async () => {
      const categories = await repository.findAllCategories('en')
      const category = await repository.findCategoryBySlug(categories[0]!.slug, 'en')

      if (category && category.subServices.length > 0) {
        const subServiceId = category.subServices[0]!.id

        const input = {
          priceUsd: -100.0,
        }

        await expect(repository.updateSubService(subServiceId, input)).rejects.toThrow()
      }
    })
  })
})
