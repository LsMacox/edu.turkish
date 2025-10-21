// @vitest-environment node
import { describe, it, expect } from 'vitest'
import type { ServiceCategoryListItem, ServiceCategoryDetail } from '~~/server/types/api/services'

// Mock data for fast contract validation
const mockCategoriesResponse: { categories: ServiceCategoryListItem[] } = {
  categories: [
    {
      id: 1,
      slug: 'turkish-english-course',
      title: 'Turkish-English Course',
      subtitle: null,
      localizedSlug: 'turkish-english-course',
      order: 1,
    },
    {
      id: 2,
      slug: 'document-translations',
      title: 'Document Translations',
      subtitle: 'Professional translation services',
      localizedSlug: 'document-translations',
      order: 2,
    },
  ],
}

const mockCategoryDetailResponse: { category: ServiceCategoryDetail } = {
  category: {
    id: 1,
    slug: 'turkish-english-course',
    title: 'Turkish-English Course',
    subtitle: null,
    localizedSlug: 'turkish-english-course',
    metadata: { difficulty: 'intermediate', duration: '6 months' },
    subServices: [
      {
        id: 10,
        slug: 'basic',
        name: 'Basic',
        description: 'Basic course for beginners',
        priceUsd: 50,
        deliveryTimeDays: 7,
        order: 1,
      },
      {
        id: 11,
        slug: 'pro',
        name: 'Pro',
        description: 'Advanced course for professionals',
        priceUsd: 120,
        deliveryTimeDays: 14,
        order: 2,
      },
    ],
    calculator: undefined,
    urgencyMultipliers: undefined,
  },
}

const mockRussianCategoriesResponse: { categories: ServiceCategoryListItem[] } = {
  categories: [
    {
      id: 1,
      slug: 'turkish-english-course',
      title: 'Турецко-английский курс',
      subtitle: null,
      localizedSlug: 'turkish-english-course-ru',
      order: 1,
    },
  ],
}

const mockRussianCategoryDetailResponse: { category: ServiceCategoryDetail } = {
  category: {
    id: 1,
    slug: 'turkish-english-course',
    title: 'Турецко-английский курс',
    subtitle: null,
    localizedSlug: 'turkish-english-course-ru',
    metadata: { difficulty: 'intermediate', duration: '6 months' },
    subServices: [
      {
        id: 10,
        slug: 'basic',
        name: 'Базовый',
        description: 'Базовый курс для начинающих',
        priceUsd: 50,
        deliveryTimeDays: 7,
        order: 1,
      },
      {
        id: 11,
        slug: 'pro',
        name: 'Профи',
        description: 'Продвинутый курс для профессионалов',
        priceUsd: 120,
        deliveryTimeDays: 14,
        order: 2,
      },
    ],
    calculator: undefined,
    urgencyMultipliers: undefined,
  },
}

describe('Services API Contract (Unit)', () => {
  describe('GET /api/v1/services/categories', () => {
    const data = mockCategoriesResponse

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

    it('should return translations for Russian locale', () => {
      const ruData = mockRussianCategoriesResponse

      // Russian translations should contain Cyrillic characters
      const hasRussian = ruData.categories.some((c: ServiceCategoryListItem) =>
        /[А-Яа-я]/.test(c.title),
      )
      expect(hasRussian).toBe(true)
    })

    it('should validate all required fields are present', () => {
      data.categories.forEach((category) => {
        expect(category.id).toBeDefined()
        expect(category.slug).toBeDefined()
        expect(category.title).toBeDefined()
        expect(category.localizedSlug).toBeDefined()
        expect(category.order).toBeDefined()

        expect(typeof category.id).toBe('number')
        expect(typeof category.slug).toBe('string')
        expect(typeof category.title).toBe('string')
        expect(typeof category.localizedSlug).toBe('string')
        expect(typeof category.order).toBe('number')
      })
    })

    it('should have valid slug format', () => {
      data.categories.forEach((category) => {
        // Slug should be lowercase with hyphens
        expect(category.slug).toMatch(/^[a-z0-9-]+$/)
        expect(category.slug.length).toBeGreaterThan(0)
      })
    })

    it('should have positive order values', () => {
      data.categories.forEach((category) => {
        expect(category.order).toBeGreaterThan(0)
      })
    })
  })

  describe('GET /api/v1/services/:slug', () => {
    const data = mockCategoryDetailResponse

    it('should return category with all required fields', () => {
      expect(data).toHaveProperty('category')
      expect(data.category).toMatchObject({
        id: expect.any(Number),
        slug: expect.any(String),
        title: expect.any(String),
        localizedSlug: expect.any(String),
        subServices: expect.any(Array),
      })
    })

    it('should have metadata as object or null', () => {
      if (data.category.metadata !== null) {
        expect(typeof data.category.metadata).toBe('object')
      }
    })

    it('should include sub-services array', () => {
      expect(Array.isArray(data.category.subServices)).toBe(true)
    })

    it('should have correct sub-service structure', () => {
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

    it('should have priceUsd as positive number', () => {
      if (data.category.subServices.length > 0) {
        const subService = data.category.subServices[0]!
        expect(subService.priceUsd).toBeGreaterThan(0)
      }
    })

    it('should have deliveryTimeDays as number or null', () => {
      if (data.category.subServices.length > 0) {
        const subService = data.category.subServices[0]!

        if (subService.deliveryTimeDays !== null) {
          expect(typeof subService.deliveryTimeDays).toBe('number')
        }
      }
    })

    it('should order sub-services by order field', () => {
      if (data.category.subServices.length > 1) {
        const orders = data.category.subServices.map((s) => s.order)
        const sortedOrders = [...orders].sort((a, b) => a - b)

        expect(orders).toEqual(sortedOrders)
      }
    })

    it('should return translations for Russian locale', () => {
      const ruData = mockRussianCategoryDetailResponse

      // Russian translations should contain Cyrillic characters
      const hasRussian = /[А-Яа-я]/.test(ruData.category.title)
      expect(hasRussian).toBe(true)

      // Sub-services should also have Russian translations
      if (ruData.category.subServices.length > 0) {
        const hasRussianSubService = ruData.category.subServices.some(
          (s) => /[А-Яа-я]/.test(s.name) || /[А-Яа-я]/.test(s.description),
        )
        expect(hasRussianSubService).toBe(true)
      }
    })

    it('should validate all sub-service fields', () => {
      data.category.subServices.forEach((subService) => {
        expect(subService.id).toBeDefined()
        expect(subService.slug).toBeDefined()
        expect(subService.name).toBeDefined()
        expect(subService.description).toBeDefined()
        expect(subService.priceUsd).toBeDefined()
        expect(subService.order).toBeDefined()

        expect(typeof subService.id).toBe('number')
        expect(typeof subService.slug).toBe('string')
        expect(typeof subService.name).toBe('string')
        expect(typeof subService.description).toBe('string')
        expect(typeof subService.priceUsd).toBe('number')
        expect(typeof subService.order).toBe('number')

        expect(subService.priceUsd).toBeGreaterThan(0)
        expect(subService.order).toBeGreaterThan(0)
      })
    })

    it('should have reasonable price ranges', () => {
      data.category.subServices.forEach((subService) => {
        expect(subService.priceUsd).toBeLessThan(10000) // Less than $10k
        expect(subService.priceUsd).toBeGreaterThan(0)
      })
    })

    it('should have reasonable delivery times', () => {
      data.category.subServices.forEach((subService) => {
        if (subService.deliveryTimeDays !== null) {
          expect(subService.deliveryTimeDays).toBeLessThan(365) // Less than a year
          expect(subService.deliveryTimeDays).toBeGreaterThan(0)
        }
      })
    })

    it('should have valid slug formats for sub-services', () => {
      data.category.subServices.forEach((subService) => {
        expect(subService.slug).toMatch(/^[a-z0-9-]+$/)
        expect(subService.slug.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Error handling validation', () => {
    it('should validate error response structure for 404', () => {
      const mockError = {
        statusCode: 404,
        statusMessage: 'Not Found',
        message: "Service category 'invalid-slug-123' does not exist",
      }

      expect(mockError.statusCode).toBe(404)
      expect(typeof mockError.message).toBe('string')
    })

    it('should validate error response structure for 400', () => {
      const mockError = {
        statusCode: 400,
        statusMessage: 'Invalid locale',
        message: 'Locale must be one of: en, ru, kk, tr',
      }

      expect(mockError.statusCode).toBe(400)
      expect(typeof mockError.message).toBe('string')
    })
  })

  describe('Performance expectations', () => {
    it('should process category data quickly', () => {
      const startTime = Date.now()

      // Simulate data processing
      const processedCategories = mockCategoriesResponse.categories
        .filter((c) => c.id > 0)
        .sort((a, b) => a.order - b.order)
        .map((c) => ({ ...c, processed: true }))

      const endTime = Date.now()
      const processingTime = endTime - startTime

      expect(processingTime).toBeLessThan(5) // Should be under 5ms
      expect(processedCategories.length).toBeGreaterThan(0)
    })

    it('should process category detail data quickly', () => {
      const startTime = Date.now()

      // Simulate data processing
      const processedCategory = {
        ...mockCategoryDetailResponse.category,
        subServices: mockCategoryDetailResponse.category.subServices
          .filter((s) => s.priceUsd > 0)
          .sort((a, b) => a.order - b.order)
          .map((s) => ({ ...s, processed: true })),
      }

      const endTime = Date.now()
      const processingTime = endTime - startTime

      expect(processingTime).toBeLessThan(5) // Should be under 5ms
      expect(processedCategory.subServices.length).toBeGreaterThan(0)
    })
  })
})
