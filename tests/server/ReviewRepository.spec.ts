import { describe, expect, it, vi } from 'vitest'
import type { PrismaClient, Prisma } from '@prisma/client'

import { ReviewRepository } from '~~/server/repositories/ReviewRepository'

type ReviewRecord = Prisma.UniversityReviewGetPayload<{
  include: {
    translations: true
    university: { include: { translations: true } }
  }
}>

const baseDate = new Date('2024-01-01T00:00:00.000Z')

const createRepositoryWithMocks = () => {
  const reviewFindMany = vi.fn()
  const reviewCount = vi.fn()
  const reviewAggregate = vi.fn()
  const reviewCreate = vi.fn()
  const universityCount = vi.fn()
  const universityFindMany = vi.fn()
  const academicProgramCount = vi.fn()
  const scholarshipCount = vi.fn()
  const applicationCount = vi.fn()
  const universityTranslationFindMany = vi.fn()
  const programTranslationFindMany = vi.fn()
  const reviewTranslationFindMany = vi.fn()
  const faqTranslationFindMany = vi.fn()
  const transaction = vi.fn(async (queries: Promise<unknown>[]) => Promise.all(queries))

  const prisma = {
    universityReview: {
      findMany: reviewFindMany,
      count: reviewCount,
      aggregate: reviewAggregate,
      create: reviewCreate,
    },
    university: {
      count: universityCount,
      findMany: universityFindMany,
    },
    universityProgram: {
      count: academicProgramCount,
    },
    universityScholarship: {
      count: scholarshipCount,
    },
    application: {
      count: applicationCount,
    },
    universityTranslation: {
      findMany: universityTranslationFindMany,
    },
    universityProgramTranslation: {
      findMany: programTranslationFindMany,
    },
    universityReviewTranslation: {
      findMany: reviewTranslationFindMany,
    },
    faqTranslation: {
      findMany: faqTranslationFindMany,
    },
    $transaction: transaction,
  } as unknown as PrismaClient

  const repository = new ReviewRepository(prisma)

  return {
    repository,
    mocks: {
      reviewFindMany,
      reviewCount,
      reviewAggregate,
      reviewCreate,
      universityCount,
      universityFindMany,
      academicProgramCount,
      scholarshipCount,
      applicationCount,
      universityTranslationFindMany,
      programTranslationFindMany,
      reviewTranslationFindMany,
      faqTranslationFindMany,
      transaction,
    },
  }
}

describe('ReviewRepository.findAll', () => {
  it('builds filters and maps reviews with localized data', async () => {
    const { repository, mocks } = createRepositoryWithMocks()

    const review: ReviewRecord = {
      id: 1,
      universityId: null,
      type: 'student',
      year: 2022,
      rating: 4,
      avatar: 'avatar.jpg',
      featured: true,
      createdAt: baseDate,
      updatedAt: baseDate,
      translations: [
        {
          id: 10,
          reviewId: 1,
          locale: 'en',
          name: 'John Doe',
          quote: 'Amazing experience',
          universityName: 'Tech University',
          achievements: {
            yos_score: 95,
            helpful_aspects: ['Scholarships', 123],
            recommendation: 'Highly recommend',
            faculty: 'Law Faculty',
            contact: 'hidden@example.com',
          },
          createdAt: baseDate,
          updatedAt: baseDate,
        },
        {
          id: 11,
          reviewId: 1,
          locale: 'ru',
          name: 'Иван Иванов',
          quote: 'Отличный опыт',
          universityName: 'Технический университет',
          achievements: null,
          createdAt: baseDate,
          updatedAt: baseDate,
        },
      ],
      university: null,
    }

    mocks.reviewFindMany.mockResolvedValue([review])
    mocks.reviewCount.mockResolvedValue(1)

    const result = await repository.findAll(
      { type: 'student', featured: true, page: 2, limit: 1 },
      'en',
    )

    expect(mocks.reviewFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { type: 'student', featured: true },
        skip: 1,
        take: 1,
        orderBy: [{ featured: 'desc' }, { rating: 'desc' }, { createdAt: 'desc' }],
      }),
    )
    expect(mocks.reviewCount).toHaveBeenCalledWith({ where: { type: 'student', featured: true } })

    expect(result).toEqual({
      data: [
        {
          id: 1,
          type: 'student',
          name: 'John Doe',
          university: 'Tech University',
          year: 2022,
          quote: 'Amazing experience',
          rating: 4,
          avatar: 'avatar.jpg',
          featured: true,
          achievements: {
            yos_score: 95,
            helpful_aspects: ['Scholarships'],
            recommendation: 'Highly recommend',
            faculty: 'Law Faculty',
            contact: 'hidden@example.com',
          },
        },
      ],
      total: 1,
    })
  })

  it('selects kk translations when locale is requested as kk', async () => {
    const { repository, mocks } = createRepositoryWithMocks()

    const review: ReviewRecord = {
      id: 3,
      universityId: null,
      type: 'student',
      year: 2023,
      rating: 5,
      avatar: null,
      featured: false,
      createdAt: baseDate,
      updatedAt: baseDate,
      translations: [
        {
          id: 30,
          reviewId: 3,
          locale: 'kk',
          name: 'Әружан',
          quote: 'Тамаша тәжірибе',
          universityName: 'Қазақ ұлттық университеті',
          achievements: null,
          createdAt: baseDate,
          updatedAt: baseDate,
        },
        {
          id: 31,
          reviewId: 3,
          locale: 'ru',
          name: 'Аружан',
          quote: 'Отличный опыт',
          universityName: 'Казахский национальный университет',
          achievements: null,
          createdAt: baseDate,
          updatedAt: baseDate,
        },
      ],
      university: {
        id: 11,
        countryId: null,
        cityId: null,
        createdAt: baseDate,
        updatedAt: baseDate,
        translations: [
          {
            id: 40,
            universityId: 11,
            locale: 'ru',
            title: 'КазНУ',
            description: null,
            slug: 'kaznu',
            about: null,
            keyInfoTexts: null,
            createdAt: baseDate,
            updatedAt: baseDate,
          },
        ],
      },
    }

    mocks.reviewFindMany.mockResolvedValue([review])
    mocks.reviewCount.mockResolvedValue(1)

    const result = await repository.findAll({ type: 'all', page: 1, limit: 1 }, 'kk')

    expect(result.data).toHaveLength(1)
    expect(result.data[0]).toMatchObject({
      name: 'Әружан',
      quote: 'Тамаша тәжірибе',
      university: 'Қазақ ұлттық университеті',
    })
  })

  it('falls back to Russian translations when Kazakh variants are absent', async () => {
    const { repository, mocks } = createRepositoryWithMocks()

    const review: ReviewRecord = {
      id: 4,
      universityId: null,
      type: 'student',
      year: null,
      rating: 4,
      avatar: null,
      featured: false,
      createdAt: baseDate,
      updatedAt: baseDate,
      translations: [
        {
          id: 41,
          reviewId: 4,
          locale: 'ru',
          name: 'Ирина',
          quote: 'Опыт только на русском',
          universityName: 'МГУ',
          achievements: null,
          createdAt: baseDate,
          updatedAt: baseDate,
        },
      ],
      university: null,
    }

    mocks.reviewFindMany.mockResolvedValue([review])
    mocks.reviewCount.mockResolvedValue(1)

    const result = await repository.findAll({ type: 'all', page: 1, limit: 1 }, 'kk')

    expect(result.data).toHaveLength(1)
    expect(result.data[0]).toMatchObject({
      name: 'Ирина',
      quote: 'Опыт только на русском',
      university: 'МГУ',
    })
  })
})

describe('ReviewRepository.findFeatured', () => {
  it('uses locale fallbacks for translations', async () => {
    const { repository, mocks } = createRepositoryWithMocks()

    const review: ReviewRecord = {
      id: 2,
      universityId: 50,
      type: 'student',
      year: null,
      rating: null,
      avatar: null,
      featured: true,
      createdAt: baseDate,
      updatedAt: baseDate,
      translations: [
        {
          id: 20,
          reviewId: 2,
          locale: 'ru',
          name: 'Иван Петров',
          quote: 'Отличная программа',
          universityName: null,
          achievements: { english_level: 'C1' },
          createdAt: baseDate,
          updatedAt: baseDate,
        },
      ],
      university: {
        id: 50,
        countryId: null,
        cityId: null,
        foundedYear: null,
        type: 'state',
        tuitionMin: null,
        tuitionMax: null,
        currency: 'USD',
        totalStudents: null,
        internationalStudents: null,
        rankingScore: null,
        hasAccommodation: false,
        hasScholarships: false,
        heroImage: null,
        image: null,
        createdAt: baseDate,
        updatedAt: baseDate,
        translations: [
          {
            id: 30,
            universityId: 50,
            locale: 'en',
            title: 'Global University',
            description: null,
            slug: 'global-university',
            about: null,
            keyInfoTexts: null,
            createdAt: baseDate,
            updatedAt: baseDate,
          },
        ],
      },
    }

    mocks.reviewFindMany.mockResolvedValue([review])

    const result = await repository.findFeatured('en', 2)

    expect(mocks.reviewFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { featured: true },
        take: 2,
        orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
      }),
    )

    expect(result).toEqual([
      {
        id: 2,
        type: 'student',
        name: 'Иван Петров',
        university: 'Global University',
        year: undefined,
        quote: 'Отличная программа',
        rating: 5,
        avatar: '',
        featured: true,
        achievements: {
          english_level: 'C1',
        },
      },
    ])
  })
})

describe('ReviewRepository.create', () => {
  it('creates review with localized translations and returns university matched by translation', async () => {
    const { repository, mocks } = createRepositoryWithMocks()

    const review: ReviewRecord = {
      id: 3,
      universityId: 10,
      type: 'student',
      year: 2024,
      rating: 5,
      avatar: null,
      featured: false,
      createdAt: baseDate,
      updatedAt: baseDate,
      translations: [
        {
          id: 31,
          reviewId: 3,
          locale: 'ru',
          name: 'Анна',
          quote: 'Отличный университет',
          universityName: 'Университет Анкары',
          achievements: { helpful_aspects: ['Общежития'] },
          createdAt: baseDate,
          updatedAt: baseDate,
        },
        {
          id: 32,
          reviewId: 3,
          locale: 'en',
          name: 'Anna',
          quote: 'Great university',
          universityName: 'Ankara University',
          achievements: null,
          createdAt: baseDate,
          updatedAt: baseDate,
        },
      ],
      university: {
        id: 10,
        countryId: null,
        cityId: null,
        foundedYear: 1946,
        type: 'state',
        tuitionMin: null,
        tuitionMax: null,
        currency: 'USD',
        totalStudents: null,
        internationalStudents: null,
        rankingScore: null,
        hasAccommodation: false,
        hasScholarships: false,
        heroImage: null,
        image: null,
        createdAt: baseDate,
        updatedAt: baseDate,
        translations: [
          {
            id: 41,
            universityId: 10,
            locale: 'ru',
            title: 'Университет Анкары',
            description: null,
            slug: 'ankara-university-ru',
            about: null,
            keyInfoTexts: null,
            createdAt: baseDate,
            updatedAt: baseDate,
          },
          {
            id: 42,
            universityId: 10,
            locale: 'en',
            title: 'Ankara University',
            description: null,
            slug: 'ankara-university',
            about: null,
            keyInfoTexts: null,
            createdAt: baseDate,
            updatedAt: baseDate,
          },
        ],
      },
    }

    mocks.reviewCreate.mockResolvedValue(review)

    const result = await repository.create({
      type: 'student',
      name: 'Анна',
      universityId: 10,
      year: 2024,
      quote: 'Отличный университет',
      rating: 5,
      achievements: { helpful_aspects: ['Общежития'] },
      translations: [
        {
          locale: 'ru',
          name: 'Анна',
          quote: 'Отличный университет',
          universityName: 'Университет Анкары',
        },
        {
          locale: 'en',
          name: 'Anna',
          quote: 'Great university',
          universityName: 'Ankara University',
        },
      ],
    })

    expect(mocks.reviewCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          type: 'student',
          universityId: 10,
          year: 2024,
          rating: 5,
          translations: {
            create: [
              {
                locale: 'ru',
                name: 'Анна',
                quote: 'Отличный университет',
                universityName: 'Университет Анкары',
                achievements: { helpful_aspects: ['Общежития'] },
              },
              {
                locale: 'en',
                name: 'Anna',
                quote: 'Great university',
                universityName: 'Ankara University',
              },
            ],
          },
        },
        include: {
          translations: true,
          university: { include: { translations: true } },
        },
      }),
    )

    expect(result).toEqual({
      id: 3,
      type: 'student',
      name: 'Анна',
      university: 'Университет Анкары',
      year: 2024,
      quote: 'Отличный университет',
      rating: 5,
      avatar: '',
      featured: false,
      achievements: { helpful_aspects: ['Общежития'] },
    })
  })
})

describe('ReviewRepository.getStatistics', () => {
  it('aggregates metrics without raw queries', async () => {
    const { repository, mocks } = createRepositoryWithMocks()

    mocks.reviewAggregate.mockResolvedValue({
      _count: { id: 5 },
      _avg: { rating: 4.3333 },
    })
    mocks.universityCount.mockResolvedValue(7)
    mocks.universityFindMany.mockResolvedValue([{ cityId: 1 }, { cityId: 2 }])
    mocks.academicProgramCount.mockResolvedValue(12)
    mocks.scholarshipCount.mockResolvedValue(3)
    mocks.applicationCount.mockResolvedValueOnce(50).mockResolvedValueOnce(30)
    mocks.universityTranslationFindMany.mockResolvedValue([{ locale: 'en' }, { locale: 'ru' }])
    mocks.programTranslationFindMany.mockResolvedValue([{ locale: 'en' }])
    mocks.reviewTranslationFindMany.mockResolvedValue([{ locale: 'ar' }])
    mocks.faqTranslationFindMany.mockResolvedValue([{ locale: null }, { locale: 'ru' }])

    const result = await repository.getStatistics()

    expect(mocks.transaction).toHaveBeenCalledTimes(1)
    expect(mocks.applicationCount).toHaveBeenCalledTimes(2)

    expect(result).toEqual({
      total_students: 5,
      average_rating: 4.3,
      success_rate: 60,
      universities_count: 7,
      scholarships_provided: 3,
      cities_covered: 2,
      languages_supported: 3,
      specialties_available: 12,
    })
  })
})
