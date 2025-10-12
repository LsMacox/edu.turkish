import type { Prisma, PrismaClient  } from '@prisma/client'
import type { DegreeType, UniversityType } from '~/types/domain'
import type { University, UniversityDetail, UniversityFilters, UniversityQueryParams } from '~~/server/types/api'
import { SUPPORTED_LOCALES, type SupportedLocale } from '~~/lib/locales'
import { normalizeLocale, type NormalizedLocale } from '~~/server/utils/locale'
import type { UniversityFilterParams } from './university-filter'
import { buildUniversityOrder, buildUniversityWhere, applyPostProcessSort } from './university-filter'
import { universityListInclude, universityDetailInclude, studyDirectionListSelect } from './university.prisma'
import { mapUniversityListItem, mapUniversityDetail, generateBadgeLite } from './university-mapper'

export class UniversityRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Find all universities with filtering, sorting, and pagination
   */
  async findAll(
    params: UniversityQueryParams,
    locale: string = 'ru',
  ): Promise<{ data: University[]; total: number; filters: UniversityFilters }> {
    const localeInfo = normalizeLocale(locale)
    const page = Math.max(1, params.page ?? 1)
    const limit = Math.max(1, params.limit ?? 6)
    const where = buildUniversityWhere(params as UniversityFilterParams, localeInfo)
    const orderBy = buildUniversityOrder(params.sort)

    const [universities, total] = await this.prisma.$transaction([
      this.prisma.university.findMany({
        where,
        ...universityListInclude,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.university.count({ where }),
    ])

    const mapped = universities.map((university) =>
      mapUniversityListItem(university, localeInfo, {
        badge: generateBadgeLite(university),
      }),
    )
    const sorted = applyPostProcessSort(mapped, params.sort)
    const filters = await this.buildFilterOptions(localeInfo)

    return {
      data: sorted,
      total,
      filters,
    }
  }

  private async buildFilterOptions(locale: NormalizedLocale): Promise<UniversityFilters> {
    const [cityGroups, typeGroups, levelGroups, tuitionAggregates, languageGroups] =
      await Promise.all([
        this.prisma.university.groupBy({
          by: ['cityId'],
          where: { cityId: { not: null } },
        }),
        this.prisma.university.groupBy({
          by: ['type'],
        }),
        this.prisma.universityProgram.groupBy({
          by: ['degreeType'],
        }),
        this.prisma.university.aggregate({
          _min: { tuitionMin: true, tuitionMax: true },
          _max: { tuitionMin: true, tuitionMax: true },
        }),
        this.prisma.universityProgram.groupBy({
          by: ['languageCode'],
        }),
      ])

    const cityIds = cityGroups
      .map((group) => group.cityId)
      .filter((value): value is number => value !== null && value !== undefined)

    const localeCode = SUPPORTED_LOCALES.includes(locale.normalized as SupportedLocale)
      ? (locale.normalized as SupportedLocale)
      : locale.normalized

    const cityTranslations = cityIds.length
      ? await this.prisma.cityTranslation.findMany({
          where: {
            cityId: { in: cityIds },
            locale: { in: [localeCode] },
          },
          select: { cityId: true, locale: true, name: true },
        })
      : []

    const cityNames = cityIds
      .map((id) => {
        const translations = cityTranslations.filter((t) => t.cityId === id)
        const best = translations.find((t) => t.locale === localeCode)
        return best?.name
      })
      .filter((name): name is string => Boolean(name))

    const availableCities = Array.from(new Set(cityNames)).sort((a, b) => a.localeCompare(b))
    const availableTypes = typeGroups
      .map((group) => group.type)
      .filter((type): type is UniversityType => Boolean(type))
      .sort((a, b) => a.localeCompare(b))
    const availableLevels = levelGroups
      .map((group) => group.degreeType)
      .filter((level): level is DegreeType => Boolean(level))
      .sort((a, b) => a.localeCompare(b))
    const availableLanguages = languageGroups
      .map((group) => group.languageCode)
      .filter((code): code is string => Boolean(code))
      .sort((a, b) => a.localeCompare(b))

    const minCandidates = [tuitionAggregates._min.tuitionMin, tuitionAggregates._min.tuitionMax]
      .filter((value): value is Prisma.Decimal => value !== null)
      .map((value) => Number(value))
    const maxCandidates = [tuitionAggregates._max.tuitionMin, tuitionAggregates._max.tuitionMax]
      .filter((value): value is Prisma.Decimal => value !== null)
      .map((value) => Number(value))

    const minPrice = minCandidates.length > 0 ? Math.min(...minCandidates) : 0
    const maxPrice = maxCandidates.length > 0 ? Math.max(...maxCandidates) : 50000

    return {
      cities: availableCities,
      types: availableTypes,
      levels: availableLevels,
      languages: availableLanguages,
      priceRange: [minPrice, maxPrice],
    }
  }

  /**
   * Find university by ID with full details
   */
  async findById(id: number, locale: string = 'ru'): Promise<UniversityDetail | null> {
    const localeInfo = normalizeLocale(locale)
    const university = await this.prisma.university.findUnique({
      where: { id },
      ...universityDetailInclude,
    })

    if (!university) {
      return null
    }

    return mapUniversityDetail(university, localeInfo)
  }

  /**
   * Find university by slug with multilingual support
   */
  async findBySlug(slug: string, locale: string = 'ru'): Promise<UniversityDetail | null> {
    // Ищем перевод по слагу и получаем universityId
    const translation = await this.prisma.universityTranslation.findFirst({
      where: { slug },
    })
    if (!translation) return null
    return this.findById(translation.universityId, locale)
  }

  /**
   * Find universities by direction
   */
  async findByDirection(directionSlug: string, locale: string = 'ru'): Promise<University[]> {
    const localeInfo = normalizeLocale(locale)
    const universities = await this.prisma.university.findMany({
      where: {
        universityDirections: {
          some: {
            direction: {
              translations: {
                some: { slug: directionSlug },
              },
            },
          },
        },
      },
      ...universityListInclude,
    })

    return universities.map((university) => mapUniversityListItem(university, localeInfo))
  }

  /**
   * Get all study directions
   */
  async getAllDirections(
    locale: string = 'ru',
    options: { search?: string; page?: number; limit?: number } = {},
  ) {
    const localeInfo = normalizeLocale(locale)
    const localeCode = SUPPORTED_LOCALES.includes(localeInfo.normalized as SupportedLocale)
      ? (localeInfo.normalized as SupportedLocale)
      : localeInfo.normalized
    const search = options.search?.toString().trim()
    const page = Math.max(1, options.page ?? 1)
    const limit = Math.max(1, Math.min(1000, options.limit ?? 100))
    const skip = (page - 1) * limit

    const where: Prisma.StudyDirectionWhereInput = {}

    if (search) {
      where.OR = [
        {
          translations: {
            some: {
              locale: { in: [localeCode] },
              name: { contains: search },
            },
          },
        },
      ]
    }

    const [directions, total] = await Promise.all([
      this.prisma.studyDirection.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
        ...studyDirectionListSelect,
      }),
      this.prisma.studyDirection.count({ where }),
    ])

    return {
      data: directions.map((direction) => {
        const translation = direction.translations.find((t) => t.locale === localeCode)
        return {
          id: direction.id,
          name: translation?.name || '',
          slug: translation?.slug || '',
          universities_count: direction._count.universityDirections,
        }
      }),
      total,
    }
  }
}
