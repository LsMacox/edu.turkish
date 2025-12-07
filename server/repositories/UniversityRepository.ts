import type { Prisma, PrismaClient, DegreeType, UniversityType } from '@prisma/client'
import type {
  University,
  UniversityDetail,
  UniversityFilters,
  UniversityQueryParams,
} from '~~/server/types/api'
import { isValidUniversityType, isValidDegreeType } from '~~/server/schemas/university'
import { normalizeLocale, type NormalizedLocale } from '~~/server/utils/locale'
import {
  universityListInclude,
  universityDetailInclude,
  mapUniversityListItem,
  mapUniversityDetail,
  generateBadge,
} from '~~/server/mappers/university'

// ─────────────────────────────────────────────────────────────────────────────
// Query builders (pure functions)
// ─────────────────────────────────────────────────────────────────────────────

function buildWhere(
  params: UniversityQueryParams,
  locale: NormalizedLocale,
): Prisma.UniversityWhereInput {
  const where: Prisma.UniversityWhereInput = {}
  const and: Prisma.UniversityWhereInput[] = []
  const loc = locale.normalized

  const { price_min, price_max } = params
  const hasMin = typeof price_min === 'number' && Number.isFinite(price_min) && price_min >= 0
  const hasMax = typeof price_max === 'number' && Number.isFinite(price_max) && price_max >= 0
  if (hasMin || hasMax) {
    let min = hasMin ? price_min : undefined
    let max = hasMax ? price_max : undefined
    if (min !== undefined && max !== undefined && min > max) [min, max] = [max, min]
    if (max !== undefined) and.push({ OR: [{ tuitionMin: { lte: max } }, { tuitionMin: null }] })
    if (min !== undefined) and.push({ OR: [{ tuitionMax: { gte: min } }, { tuitionMax: null }] })
  }

  if (params.q?.trim()) {
    const q = params.q.trim()
    and.push({
      OR: [
        {
          translations: {
            some: {
              locale: loc,
              OR: [{ title: { contains: q } }, { description: { contains: q } }],
            },
          },
        },
        { city: { translations: { some: { locale: loc, name: { contains: q } } } } },
      ],
    })
  }

  if (params.city) {
    and.push({ city: { translations: { some: { locale: loc, name: params.city } } } })
  }

  if (params.type && isValidUniversityType(params.type)) where.type = params.type
  if (params.level && isValidDegreeType(params.level))
    where.academicPrograms = { some: { degreeType: params.level } }
  if (params.langs?.length)
    and.push({ academicPrograms: { some: { languageCode: { in: params.langs } } } })

  if (and.length) where.AND = and
  return where
}

function buildOrder(sort?: string): Prisma.UniversityOrderByWithRelationInput {
  if (sort === 'price_asc') return { tuitionMin: 'asc' }
  if (sort === 'price_desc') return { tuitionMax: 'desc' }
  return { id: 'asc' }
}

// ─────────────────────────────────────────────────────────────────────────────
// Repository (pure data access)
// ─────────────────────────────────────────────────────────────────────────────

export interface UniversityListResult {
  data: University[]
  total: number
  filters: UniversityFilters
}

export class UniversityRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(params: UniversityQueryParams, localeStr = 'ru'): Promise<UniversityListResult> {
    const locale = normalizeLocale(localeStr)
    const page = Math.max(1, params.page ?? 1)
    const limit = Math.max(1, params.limit ?? 6)
    const where = buildWhere(params, locale)

    const [rows, total, filters] = await Promise.all([
      this.prisma.university.findMany({
        where,
        ...universityListInclude,
        orderBy: buildOrder(params.sort),
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.university.count({ where }),
      this.getFilters(locale),
    ])

    const data = rows.map((row) => mapUniversityListItem(row, locale, generateBadge(row)))
    return { data, total, filters }
  }

  /**
   * Get available filter options
   */
  async getFilters(locale: NormalizedLocale): Promise<UniversityFilters> {
    const [cityGroups, typeGroups, levelGroups, tuition, langGroups] = await Promise.all([
      this.prisma.university.groupBy({ by: ['cityId'], where: { cityId: { not: null } } }),
      this.prisma.university.groupBy({ by: ['type'] }),
      this.prisma.universityProgram.groupBy({ by: ['degreeType'] }),
      this.prisma.university.aggregate({
        _min: { tuitionMin: true, tuitionMax: true },
        _max: { tuitionMin: true, tuitionMax: true },
      }),
      this.prisma.universityProgram.groupBy({ by: ['languageCode'] }),
    ])

    const cityIds = cityGroups.map((g) => g.cityId).filter((v): v is number => v != null)
    const cityTrans = cityIds.length
      ? await this.prisma.cityTranslation.findMany({
          where: { cityId: { in: cityIds }, locale: locale.normalized },
          select: { cityId: true, name: true },
        })
      : []

    const cities = [
      ...new Set(
        cityIds
          .map((id) => cityTrans.find((t) => t.cityId === id)?.name)
          .filter((n): n is string => Boolean(n)),
      ),
    ].sort((a, b) => a.localeCompare(b))

    const types = typeGroups
      .map((g) => g.type)
      .filter((t): t is UniversityType => Boolean(t))
      .sort((a, b) => a.localeCompare(b))

    const levels = levelGroups
      .map((g) => g.degreeType)
      .filter((l): l is DegreeType => Boolean(l))
      .sort((a, b) => a.localeCompare(b))

    const languages = langGroups
      .map((g) => g.languageCode)
      .filter((c): c is string => Boolean(c))
      .sort((a, b) => a.localeCompare(b))

    const mins = [tuition._min.tuitionMin, tuition._min.tuitionMax]
      .filter((v): v is Prisma.Decimal => v != null)
      .map(Number)
    const maxs = [tuition._max.tuitionMin, tuition._max.tuitionMax]
      .filter((v): v is Prisma.Decimal => v != null)
      .map(Number)

    return {
      cities,
      types,
      levels,
      languages,
      priceRange: [mins.length ? Math.min(...mins) : 0, maxs.length ? Math.max(...maxs) : 50000],
    }
  }

  async findById(id: number, localeStr = 'ru'): Promise<UniversityDetail | null> {
    const row = await this.prisma.university.findUnique({
      where: { id },
      ...universityDetailInclude,
    })
    return row ? mapUniversityDetail(row, normalizeLocale(localeStr)) : null
  }

  async findBySlug(slug: string, localeStr = 'ru'): Promise<UniversityDetail | null> {
    const t = await this.prisma.universityTranslation.findFirst({ where: { slug } })
    return t ? this.findById(t.universityId, localeStr) : null
  }
}
