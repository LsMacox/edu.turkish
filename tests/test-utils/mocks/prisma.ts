import { vi, type Mock } from 'vitest'
import type { PrismaClient } from '@prisma/client'

export interface MockPrismaModel {
  findMany: Mock
  findUnique: Mock
  findFirst: Mock
  create: Mock
  update: Mock
  delete: Mock
  count: Mock
  aggregate: Mock
  upsert: Mock
  deleteMany: Mock
  updateMany: Mock
  createMany: Mock
}

export type MockPrismaClient = {
  [K in keyof Omit<
    PrismaClient,
    | '$connect'
    | '$disconnect'
    | '$executeRaw'
    | '$executeRawUnsafe'
    | '$queryRaw'
    | '$queryRawUnsafe'
    | '$transaction'
    | '$on'
    | '$use'
    | '$extends'
  >]: MockPrismaModel
} & {
  $transaction: Mock
  $connect: Mock
  $disconnect: Mock
}

function createMockModel(): MockPrismaModel {
  return {
    findMany: vi.fn().mockResolvedValue([]),
    findUnique: vi.fn().mockResolvedValue(null),
    findFirst: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
    count: vi.fn().mockResolvedValue(0),
    aggregate: vi.fn().mockResolvedValue({}),
    upsert: vi.fn().mockResolvedValue({}),
    deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
    updateMany: vi.fn().mockResolvedValue({ count: 0 }),
    createMany: vi.fn().mockResolvedValue({ count: 0 }),
  }
}

export function createMockPrisma(overrides?: Partial<MockPrismaClient>): MockPrismaClient {
  const defaultMock = {
    // Core models
    university: createMockModel(),
    universityTranslation: createMockModel(),
    universityProgram: createMockModel(),
    universityFeaturedProgram: createMockModel(),
    universityFeaturedProgramTranslation: createMockModel(),
    application: createMockModel(),
    faq: createMockModel(),
    faqTranslation: createMockModel(),
    faqCategory: createMockModel(),
    faqCategoryTranslation: createMockModel(),
    review: createMockModel(),
    reviewTranslation: createMockModel(),
    studyDirection: createMockModel(),
    studyDirectionTranslation: createMockModel(),
    blog: createMockModel(),
    blogTranslation: createMockModel(),
    blogArticle: createMockModel(),
    blogArticleTranslation: createMockModel(),
    blogCategory: createMockModel(),
    blogCategoryTranslation: createMockModel(),
    city: createMockModel(),
    cityTranslation: createMockModel(),
    country: createMockModel(),
    countryTranslation: createMockModel(),
    crmQueue: createMockModel(),
    universityProgramTranslation: createMockModel(),
    universityReview: createMockModel(),
    universityReviewTranslation: createMockModel(),
    universityMediaAsset: createMockModel(),
    universityMediaAssetTranslation: createMockModel(),
    universityStudyDirection: createMockModel(),
    universityScholarship: createMockModel(),
    universityScholarshipTranslation: createMockModel(),
    universityRequiredDocument: createMockModel(),
    universityRequiredDocumentTranslation: createMockModel(),
    universityAdmissionRequirement: createMockModel(),
    universityAdmissionRequirementTranslation: createMockModel(),
    universityCampusFacility: createMockModel(),
    universityCampusFacilityTranslation: createMockModel(),
    universityImportantDate: createMockModel(),
    universityImportantDateTranslation: createMockModel(),

    // Service models (Feature 013)
    serviceCategory: createMockModel(),
    serviceCategoryTranslation: createMockModel(),
    subService: createMockModel(),
    subServiceTranslation: createMockModel(),
    exchangeRate: createMockModel(),

    // Utility methods
    $transaction: vi.fn(async (operations: any) => {
      if (Array.isArray(operations)) {
        return Promise.all(operations)
      }
      // Provide a minimal transaction client exposing the same model mocks
      const tx = {
        serviceCategory: (defaultMock as any).serviceCategory,
        serviceCategoryTranslation: (defaultMock as any).serviceCategoryTranslation,
        subService: (defaultMock as any).subService,
        subServiceTranslation: (defaultMock as any).subServiceTranslation,
        exchangeRate: (defaultMock as any).exchangeRate,
      }
      return operations(tx)
    }),
    $connect: vi.fn().mockResolvedValue(undefined),
    $disconnect: vi.fn().mockResolvedValue(undefined),
  }

  if (overrides) {
    Object.keys(overrides).forEach((key) => {
      const typedKey = key as keyof typeof defaultMock
      if (overrides[typedKey as keyof MockPrismaClient]) {
        if (
          typeof overrides[typedKey as keyof MockPrismaClient] === 'object' &&
          !vi.isMockFunction(overrides[typedKey as keyof MockPrismaClient])
        ) {
          ;(defaultMock as any)[typedKey] = {
            ...(defaultMock as any)[typedKey],
            ...overrides[typedKey as keyof MockPrismaClient],
          }
        } else {
          ;(defaultMock as any)[typedKey] = overrides[typedKey as keyof MockPrismaClient]
        }
      }
    })
  }

  return defaultMock as MockPrismaClient
}
