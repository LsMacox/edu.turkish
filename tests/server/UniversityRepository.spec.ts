import { describe, expect, it, vi } from 'vitest'
import { Prisma, type PrismaClient } from '@prisma/client'

import {
  UniversityRepository,
  type UniversityListItem,
} from '../../server/repositories/UniversityRepository'
import type { UniversityQueryParams } from '../../server/types/api'

describe('UniversityRepository.findAll', () => {
  const createParams = (overrides: Partial<UniversityQueryParams> = {}): UniversityQueryParams => ({
    q: '',
    city: '',
    langs: [],
    type: '',
    level: '',
    price_min: 0,
    price_max: 20000,
    sort: 'pop',
    page: 1,
    limit: 12,
    ...overrides,
  })

  const createRepositoryWithMocks = () => {
    const findMany = vi.fn().mockResolvedValue([])
    const count = vi.fn().mockResolvedValue(0)
    const universityGroupBy = vi.fn().mockResolvedValue([])
    const aggregate = vi.fn().mockResolvedValue({
      _min: { tuitionMin: new Prisma.Decimal(0), tuitionMax: new Prisma.Decimal(0) },
      _max: { tuitionMin: new Prisma.Decimal(0), tuitionMax: new Prisma.Decimal(0) },
    })
    const academicProgramGroupBy = vi.fn().mockResolvedValue([])
    const cityTranslationFindMany = vi.fn().mockResolvedValue([])
    const transaction = vi.fn(async (queries: Promise<unknown>[]) => Promise.all(queries))

    const prisma = {
      university: {
        findMany,
        count,
        groupBy: universityGroupBy,
        aggregate,
      },
      academicProgram: {
        groupBy: academicProgramGroupBy,
      },
      cityTranslation: {
        findMany: cityTranslationFindMany,
      },
      $transaction: transaction,
    } as unknown as PrismaClient

    const repository = new UniversityRepository(prisma)

    return { repository, findMany, count }
  }

  type TuitionRange = { tuitionMin: Prisma.Decimal | null; tuitionMax: Prisma.Decimal | null }

  const matchesTuitionWhere = (
    where: Prisma.UniversityWhereInput | undefined,
    range: TuitionRange,
  ): boolean => {
    if (!where) return true

    const evaluate = (clause: Prisma.UniversityWhereInput): boolean => {
      const { AND, OR, ...direct } = clause

      if (AND && !AND.every((inner) => evaluate(inner))) {
        return false
      }

      if (OR && !OR.some((inner) => evaluate(inner))) {
        return false
      }

      return Object.entries(direct).every(([field, condition]) => {
        if (field !== 'tuitionMin' && field !== 'tuitionMax') {
          return true
        }

        const value = range[field]
        return Object.entries(condition as Record<string, number | null>).every(
          ([operator, expected]) => {
            if (operator === 'equals') {
              return expected === null
                ? value === null
                : value !== null && Number(value) === expected
            }
            if (operator === 'lte') {
              return value !== null && Number(value) <= (expected as number)
            }
            if (operator === 'gte') {
              return value !== null && Number(value) >= (expected as number)
            }
            return true
          },
        )
      })
    }

    return evaluate(where)
  }

  it('builds filters using aggregate queries and returns transformed data', async () => {
    const baseDate = new Date('2024-01-01T00:00:00.000Z')

    const universities: UniversityListItem[] = [
      {
        id: 1,
        countryId: null,
        cityId: 10,
        foundedYear: 1950,
        type: 'tech',
        tuitionMin: new Prisma.Decimal(1500),
        tuitionMax: new Prisma.Decimal(5500),
        currency: 'USD',
        totalStudents: 12000,
        internationalStudents: 1500,
        rankingScore: null,
        hasAccommodation: true,
        hasScholarships: false,
        heroImage: null,
        image: 'tech-uni.jpg',
        createdAt: baseDate,
        updatedAt: baseDate,
        translations: [
          {
            id: 11,
            universityId: 1,
            locale: 'en',
            title: 'Tech University',
            description: 'Leading technology university',
            slug: 'tech-university',
            about: null,
            keyInfoTexts: { ranking_text: 'Top 100 globally' },
            createdAt: baseDate,
            updatedAt: baseDate,
          },
          {
            id: 12,
            universityId: 1,
            locale: 'ru',
            title: 'Технический университет',
            description: 'Ведущий технический университет',
            slug: 'tekhnicheskiy-universitet',
            about: null,
            keyInfoTexts: { ranking_text: 'Топ-100 в мире' },
            createdAt: baseDate,
            updatedAt: baseDate,
          },
        ],
        academicPrograms: [
          {
            id: 21,
            universityId: 1,
            degreeType: 'bachelor',
            languageCode: 'EN',
            durationYears: 4,
            tuitionPerYear: new Prisma.Decimal(5000),
            createdAt: baseDate,
            updatedAt: baseDate,
          },
          {
            id: 22,
            universityId: 1,
            degreeType: 'master',
            languageCode: 'TR',
            durationYears: 2,
            tuitionPerYear: new Prisma.Decimal(6000),
            createdAt: baseDate,
            updatedAt: baseDate,
          },
        ],
        city: {
          id: 10,
          countryId: 1,
          createdAt: baseDate,
          updatedAt: baseDate,
          translations: [
            {
              id: 31,
              cityId: 10,
              locale: 'en',
              name: 'Ankara',
              createdAt: baseDate,
              updatedAt: baseDate,
            },
            {
              id: 32,
              cityId: 10,
              locale: 'ru',
              name: 'Анкара',
              createdAt: baseDate,
              updatedAt: baseDate,
            },
          ],
        },
      },
    ]

    const findMany = vi.fn().mockResolvedValue(universities)
    const count = vi.fn().mockResolvedValue(universities.length)
    const universityGroupBy = vi.fn().mockImplementation((args: Prisma.UniversityGroupByArgs) => {
      if ('by' in args && Array.isArray(args.by) && args.by.includes('cityId')) {
        return Promise.resolve([{ cityId: 10 }])
      }
      if ('by' in args && Array.isArray(args.by) && args.by.includes('type')) {
        return Promise.resolve([{ type: 'tech' }, { type: 'state' }])
      }
      return Promise.resolve([])
    })
    const aggregate = vi.fn().mockResolvedValue({
      _min: { tuitionMin: new Prisma.Decimal(1000), tuitionMax: new Prisma.Decimal(1200) },
      _max: { tuitionMin: new Prisma.Decimal(7000), tuitionMax: new Prisma.Decimal(8200) },
    })
    const academicProgramGroupBy = vi
      .fn()
      .mockImplementation((args: Prisma.AcademicProgramGroupByArgs) => {
        if ('by' in args && Array.isArray(args.by) && args.by.includes('degreeType')) {
          return Promise.resolve([{ degreeType: 'bachelor' }, { degreeType: 'master' }])
        }
        if ('by' in args && Array.isArray(args.by) && args.by.includes('languageCode')) {
          return Promise.resolve([{ languageCode: 'EN' }, { languageCode: 'TR' }])
        }
        return Promise.resolve([])
      })
    const cityTranslationFindMany = vi.fn().mockResolvedValue([
      { cityId: 10, locale: 'en', name: 'Ankara' },
      { cityId: 10, locale: 'ru', name: 'Анкара' },
    ])
    const transaction = vi.fn(async (queries: Promise<unknown>[]) => Promise.all(queries))

    const prisma = {
      university: {
        findMany,
        count,
        groupBy: universityGroupBy,
        aggregate,
      },
      academicProgram: {
        groupBy: academicProgramGroupBy,
      },
      cityTranslation: {
        findMany: cityTranslationFindMany,
      },
      $transaction: transaction,
    } as unknown as PrismaClient

    const repository = new UniversityRepository(prisma)
    const params: UniversityQueryParams = { page: 1, limit: 12 }

    const result = await repository.findAll(params, 'en')

    expect(transaction).toHaveBeenCalledTimes(1)
    expect(findMany).toHaveBeenCalledTimes(1)
    expect(count).toHaveBeenCalledTimes(1)

    expect(universityGroupBy).toHaveBeenCalledTimes(2)
    expect(academicProgramGroupBy).toHaveBeenCalledTimes(2)
    expect(cityTranslationFindMany).toHaveBeenCalledWith({
      where: { cityId: { in: [10] }, locale: { in: ['en', 'ru'] } },
      select: { cityId: true, locale: true, name: true },
    })

    expect(result.filters).toEqual({
      cities: ['Ankara'],
      types: ['state', 'tech'],
      levels: ['bachelor', 'master'],
      languages: ['EN', 'TR'],
      priceRange: [1000, 8200],
    })

    expect(result.data).toHaveLength(1)
    const university = result.data[0]
    expect(university.title).toBe('Tech University')
    expect(university.city).toBe('Ankara')
    expect(university.tuitionRange).toEqual({ min: 1500, max: 5500, currency: 'USD' })
    expect(university.languages).toEqual(['EN', 'TR'])
    expect(university.ranking?.text).toBe('Top 100 globally')
    expect(university.heroImage).toBe('tech-uni.jpg')
    expect(university.slug).toBe('tech-university')
    expect(university.badge).toEqual({
      labelKey: 'universities_page.card.badges.technical',
      color: 'purple',
    })
  })

  it('builds intersection filter that matches overlapping and nested ranges', async () => {
    const { repository, findMany } = createRepositoryWithMocks()

    await repository.findAll(createParams({ price_min: 2000, price_max: 6000 }), 'ru')

    expect(findMany).toHaveBeenCalledTimes(1)
    const where = findMany.mock.calls[0][0]?.where as Prisma.UniversityWhereInput

    expect(where?.AND).toHaveLength(2)

    const overlapping: TuitionRange = {
      tuitionMin: new Prisma.Decimal(2500),
      tuitionMax: new Prisma.Decimal(6500),
    }
    const nestedInsideQuery: TuitionRange = {
      tuitionMin: new Prisma.Decimal(3200),
      tuitionMax: new Prisma.Decimal(3400),
    }
    const queryInsideRange: TuitionRange = {
      tuitionMin: new Prisma.Decimal(1500),
      tuitionMax: new Prisma.Decimal(7000),
    }

    expect(matchesTuitionWhere(where, overlapping)).toBe(true)
    expect(matchesTuitionWhere(where, nestedInsideQuery)).toBe(true)
    expect(matchesTuitionWhere(where, queryInsideRange)).toBe(true)
  })

  it('includes open-ended tuition ranges and excludes non-overlapping ones', async () => {
    const { repository, findMany } = createRepositoryWithMocks()

    await repository.findAll(createParams({ price_min: 3000, price_max: 8000 }), 'ru')

    const where = findMany.mock.calls[0][0]?.where as Prisma.UniversityWhereInput

    const openLower: TuitionRange = {
      tuitionMin: null,
      tuitionMax: new Prisma.Decimal(3500),
    }
    const openUpper: TuitionRange = {
      tuitionMin: new Prisma.Decimal(5000),
      tuitionMax: null,
    }
    const unbounded: TuitionRange = {
      tuitionMin: null,
      tuitionMax: null,
    }
    const nonOverlapping: TuitionRange = {
      tuitionMin: new Prisma.Decimal(9000),
      tuitionMax: new Prisma.Decimal(12000),
    }

    expect(matchesTuitionWhere(where, openLower)).toBe(true)
    expect(matchesTuitionWhere(where, openUpper)).toBe(true)
    expect(matchesTuitionWhere(where, unbounded)).toBe(true)
    expect(matchesTuitionWhere(where, nonOverlapping)).toBe(false)
  })

  it('applies search, city, type, level and language filters', async () => {
    const { repository, findMany } = createRepositoryWithMocks()

    await repository.findAll(
      createParams({
        q: 'Tech',
        city: 'Ankara',
        type: 'Государственный',
        level: 'Магистратура',
        langs: ['en'],
        price_min: undefined,
        price_max: undefined,
      }),
      'en',
    )

    const where = findMany.mock.calls[0][0]?.where as Prisma.UniversityWhereInput

    expect(where.type).toBe('state')
    expect(where.academicPrograms).toEqual({ some: { degreeType: 'master' } })
    expect(where.AND).toHaveLength(3)
    expect(where.AND?.[2]).toEqual({
      academicPrograms: {
        some: {
          languageCode: {
            in: ['en'],
          },
        },
      },
    })
  })

  it('sorts results alphabetically when requested', async () => {
    const baseDate = new Date('2024-01-01T00:00:00.000Z')
    const { repository, findMany, count } = createRepositoryWithMocks()

    const alphaUniversities: UniversityListItem[] = [
      {
        id: 1,
        countryId: null,
        cityId: null,
        foundedYear: 1950,
        type: 'state',
        tuitionMin: new Prisma.Decimal(1000),
        tuitionMax: new Prisma.Decimal(2000),
        currency: 'USD',
        totalStudents: 1000,
        internationalStudents: 200,
        rankingScore: null,
        hasAccommodation: false,
        hasScholarships: false,
        heroImage: null,
        image: null,
        createdAt: baseDate,
        updatedAt: baseDate,
        translations: [
          {
            id: 1,
            universityId: 1,
            locale: 'en',
            title: 'Zeta Institute',
            description: 'Tech university',
            slug: 'zeta-institute',
            about: null,
            keyInfoTexts: null,
            createdAt: baseDate,
            updatedAt: baseDate,
          },
        ],
        academicPrograms: [],
        city: null,
      },
      {
        id: 2,
        countryId: null,
        cityId: null,
        foundedYear: 1960,
        type: 'state',
        tuitionMin: new Prisma.Decimal(1000),
        tuitionMax: new Prisma.Decimal(2000),
        currency: 'USD',
        totalStudents: 1000,
        internationalStudents: 200,
        rankingScore: null,
        hasAccommodation: false,
        hasScholarships: false,
        heroImage: null,
        image: null,
        createdAt: baseDate,
        updatedAt: baseDate,
        translations: [
          {
            id: 2,
            universityId: 2,
            locale: 'en',
            title: 'Alpha University',
            description: 'Liberal arts',
            slug: 'alpha-university',
            about: null,
            keyInfoTexts: null,
            createdAt: baseDate,
            updatedAt: baseDate,
          },
        ],
        academicPrograms: [],
        city: null,
      },
    ]

    findMany.mockResolvedValue(alphaUniversities)
    count.mockResolvedValue(alphaUniversities.length)

    const result = await repository.findAll(createParams({ sort: 'alpha' }), 'en')

    expect(result.data.map((item) => item.title)).toEqual(['Alpha University', 'Zeta Institute'])
  })

  it('prioritizes English language programs for lang_en sort regardless of case', async () => {
    const baseDate = new Date('2024-01-01T00:00:00.000Z')
    const { repository, findMany, count } = createRepositoryWithMocks()

    const universities: UniversityListItem[] = [
      {
        id: 1,
        countryId: null,
        cityId: null,
        foundedYear: 1950,
        type: 'state',
        tuitionMin: new Prisma.Decimal(1000),
        tuitionMax: new Prisma.Decimal(2000),
        currency: 'USD',
        totalStudents: 1000,
        internationalStudents: 200,
        rankingScore: null,
        hasAccommodation: false,
        hasScholarships: false,
        heroImage: null,
        image: null,
        createdAt: baseDate,
        updatedAt: baseDate,
        translations: [
          {
            id: 1,
            universityId: 1,
            locale: 'en',
            title: 'Turkish Academy',
            description: 'Local language programs',
            slug: 'turkish-academy',
            about: null,
            keyInfoTexts: null,
            createdAt: baseDate,
            updatedAt: baseDate,
          },
        ],
        academicPrograms: [
          {
            id: 1,
            universityId: 1,
            degreeType: 'bachelor',
            languageCode: 'TR',
            durationYears: 4,
            tuitionPerYear: new Prisma.Decimal(3000),
            createdAt: baseDate,
            updatedAt: baseDate,
          },
        ],
        city: null,
      },
      {
        id: 2,
        countryId: null,
        cityId: null,
        foundedYear: 1950,
        type: 'state',
        tuitionMin: new Prisma.Decimal(1000),
        tuitionMax: new Prisma.Decimal(2000),
        currency: 'USD',
        totalStudents: 1000,
        internationalStudents: 200,
        rankingScore: null,
        hasAccommodation: false,
        hasScholarships: false,
        heroImage: null,
        image: null,
        createdAt: baseDate,
        updatedAt: baseDate,
        translations: [
          {
            id: 2,
            universityId: 2,
            locale: 'en',
            title: 'International College',
            description: 'English programs available',
            slug: 'international-college',
            about: null,
            keyInfoTexts: null,
            createdAt: baseDate,
            updatedAt: baseDate,
          },
        ],
        academicPrograms: [
          {
            id: 2,
            universityId: 2,
            degreeType: 'bachelor',
            languageCode: 'EN',
            durationYears: 4,
            tuitionPerYear: new Prisma.Decimal(3000),
            createdAt: baseDate,
            updatedAt: baseDate,
          },
        ],
        city: null,
      },
    ]

    findMany.mockResolvedValue(universities)
    count.mockResolvedValue(universities.length)

    const result = await repository.findAll(createParams({ sort: 'lang_en' }), 'en')

    expect(result.data.map((item) => item.title)).toEqual([
      'International College',
      'Turkish Academy',
    ])
  })

  it('returns Kazakh translations when requested locale is kz', async () => {
    const baseDate = new Date('2024-01-01T00:00:00.000Z')
    const { repository, findMany, count } = createRepositoryWithMocks()

    const universities: UniversityListItem[] = [
      {
        id: 5,
        countryId: 1,
        cityId: 20,
        foundedYear: 1995,
        type: 'state',
        tuitionMin: new Prisma.Decimal(1800),
        tuitionMax: new Prisma.Decimal(3200),
        currency: 'USD',
        totalStudents: 8000,
        internationalStudents: 600,
        rankingScore: null,
        hasAccommodation: true,
        hasScholarships: false,
        heroImage: null,
        image: 'kazakh-uni.jpg',
        createdAt: baseDate,
        updatedAt: baseDate,
        translations: [
          {
            id: 51,
            universityId: 5,
            locale: 'kz',
            title: 'Қазақ Университеті',
            description: 'Қазақ тіліндегі сипаттама',
            slug: 'qazaq-universiteti',
            about: null,
            keyInfoTexts: null,
            createdAt: baseDate,
            updatedAt: baseDate,
          },
          {
            id: 52,
            universityId: 5,
            locale: 'ru',
            title: 'Казахский университет',
            description: 'Описание на русском',
            slug: 'kazahskiy-universitet',
            about: null,
            keyInfoTexts: null,
            createdAt: baseDate,
            updatedAt: baseDate,
          },
        ],
        academicPrograms: [
          {
            id: 501,
            universityId: 5,
            degreeType: 'bachelor',
            languageCode: 'KK',
            durationYears: 4,
            tuitionPerYear: new Prisma.Decimal(2200),
            createdAt: baseDate,
            updatedAt: baseDate,
          },
        ],
        city: {
          id: 20,
          countryId: 1,
          createdAt: baseDate,
          updatedAt: baseDate,
          translations: [
            {
              id: 201,
              cityId: 20,
              locale: 'kz',
              name: 'Алматы',
              createdAt: baseDate,
              updatedAt: baseDate,
            },
            {
              id: 202,
              cityId: 20,
              locale: 'ru',
              name: 'Алма-Ата',
              createdAt: baseDate,
              updatedAt: baseDate,
            },
          ],
        },
      },
    ]

    findMany.mockResolvedValue(universities)
    count.mockResolvedValue(universities.length)

    const result = await repository.findAll(createParams(), 'kz')

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.any(Object),
        include: expect.objectContaining({ translations: true }),
      }),
    )

    expect(result.data).toHaveLength(1)
    expect(result.data[0]).toMatchObject({
      title: 'Қазақ Университеті',
      description: 'Қазақ тіліндегі сипаттама',
      city: 'Алматы',
      slug: 'qazaq-universiteti',
    })
  })

  it('falls back to Russian when Kazakh translation is missing', async () => {
    const baseDate = new Date('2024-01-01T00:00:00.000Z')
    const { repository, findMany, count } = createRepositoryWithMocks()

    const universities: UniversityListItem[] = [
      {
        id: 6,
        countryId: 1,
        cityId: 21,
        foundedYear: 2001,
        type: 'state',
        tuitionMin: new Prisma.Decimal(2000),
        tuitionMax: new Prisma.Decimal(3400),
        currency: 'USD',
        totalStudents: 7000,
        internationalStudents: 400,
        rankingScore: null,
        hasAccommodation: false,
        hasScholarships: false,
        heroImage: null,
        image: 'fallback-uni.jpg',
        createdAt: baseDate,
        updatedAt: baseDate,
        translations: [
          {
            id: 61,
            universityId: 6,
            locale: 'ru',
            title: 'Российский университет',
            description: 'Описание только на русском',
            slug: 'rossiyskiy-universitet',
            about: null,
            keyInfoTexts: null,
            createdAt: baseDate,
            updatedAt: baseDate,
          },
        ],
        academicPrograms: [],
        city: {
          id: 21,
          countryId: 1,
          createdAt: baseDate,
          updatedAt: baseDate,
          translations: [
            {
              id: 211,
              cityId: 21,
              locale: 'ru',
              name: 'Нур-Султан',
              createdAt: baseDate,
              updatedAt: baseDate,
            },
          ],
        },
      },
    ]

    findMany.mockResolvedValue(universities)
    count.mockResolvedValue(universities.length)

    const result = await repository.findAll(createParams(), 'kz')

    expect(result.data).toHaveLength(1)
    expect(result.data[0]).toMatchObject({
      title: 'Российский университет',
      description: 'Описание только на русском',
      city: 'Нур-Султан',
      slug: 'rossiyskiy-universitet',
    })
  })
})
