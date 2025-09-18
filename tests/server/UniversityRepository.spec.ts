import { describe, expect, it, vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'
import { Prisma } from '@prisma/client'

import { UniversityRepository } from '../../server/repositories/UniversityRepository'
import type { UniversityQueryParams } from '../../server/types/api'

type UniversityListItem = Prisma.UniversityGetPayload<{
  include: {
    translations: true
    academicPrograms: true
    city: { include: { translations: true } }
  }
}>

describe('UniversityRepository.findAll', () => {
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
            strongPrograms: null,
            keyInfoTexts: { ranking_text: 'Top 100 globally' },
            createdAt: baseDate,
            updatedAt: baseDate
          },
          {
            id: 12,
            universityId: 1,
            locale: 'ru',
            title: 'Технический университет',
            description: 'Ведущий технический университет',
            slug: 'tekhnicheskiy-universitet',
            about: null,
            strongPrograms: null,
            keyInfoTexts: { ranking_text: 'Топ-100 в мире' },
            createdAt: baseDate,
            updatedAt: baseDate
          }
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
            updatedAt: baseDate
          },
          {
            id: 22,
            universityId: 1,
            degreeType: 'master',
            languageCode: 'TR',
            durationYears: 2,
            tuitionPerYear: new Prisma.Decimal(6000),
            createdAt: baseDate,
            updatedAt: baseDate
          }
        ],
        city: {
          id: 10,
          countryId: 1,
          createdAt: baseDate,
          updatedAt: baseDate,
          translations: [
            { id: 31, cityId: 10, locale: 'en', name: 'Ankara', createdAt: baseDate, updatedAt: baseDate },
            { id: 32, cityId: 10, locale: 'ru', name: 'Анкара', createdAt: baseDate, updatedAt: baseDate }
          ]
        }
      }
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
      _max: { tuitionMin: new Prisma.Decimal(7000), tuitionMax: new Prisma.Decimal(8200) }
    })
    const academicProgramGroupBy = vi.fn().mockImplementation((args: Prisma.AcademicProgramGroupByArgs) => {
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
      { cityId: 10, locale: 'ru', name: 'Анкара' }
    ])
    const transaction = vi.fn(async (queries: Promise<unknown>[]) => Promise.all(queries))

    const prisma = {
      university: {
        findMany,
        count,
        groupBy: universityGroupBy,
        aggregate
      },
      academicProgram: {
        groupBy: academicProgramGroupBy
      },
      cityTranslation: {
        findMany: cityTranslationFindMany
      },
      $transaction: transaction
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
      select: { cityId: true, locale: true, name: true }
    })

    expect(result.filters).toEqual({
      cities: ['Ankara'],
      types: ['state', 'tech'],
      levels: ['bachelor', 'master'],
      languages: ['EN', 'TR'],
      priceRange: [1000, 8200]
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
      color: 'purple'
    })
  })
})
