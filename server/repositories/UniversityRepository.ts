import type { Prisma, PrismaClient, DegreeType, UniversityType } from '@prisma/client'
import type {
  University,
  UniversityDetail,
  UniversityFilters,
  UniversityQueryParams,
  UniversityProgram,
  UniversityAdmissionRequirement,
  UniversityCampusFacility,
  UniversityCampusGalleryItem,
  UniversityImportantDate,
  UniversityRequiredDocument,
  UniversityScholarship,
  UniversityStudyDirection,
} from '~~/server/types/api'
import {
  normalizeLocale,
  selectTranslation,
  getSlugForLocale,
  decimalToNumber,
  asRecord,
  extractStringRecord,
  extractStringArray,
  type NormalizedLocale,
} from '~~/server/utils/locale'

const VALID_TYPES: UniversityType[] = ['state', 'private', 'tech', 'elite']
const VALID_LEVELS: DegreeType[] = ['bachelor', 'master', 'phd']
const isValidType = (v: string): v is UniversityType => VALID_TYPES.includes(v as UniversityType)
const isValidLevel = (v: string): v is DegreeType => VALID_LEVELS.includes(v as DegreeType)

const IMPORTANT_DATE_TYPE_MAP: Record<string, UniversityImportantDate['deadline_type']> = {
  deadline: 'application',
  event: 'document',
  exam: 'exam',
  notification: 'notification',
}

const universityListInclude = {
  include: {
    translations: true,
    academicPrograms: true,
    city: { include: { translations: true } },
  },
} as const

const universityDetailInclude = {
  include: {
    translations: true,
    academicPrograms: { include: { translations: true } },
    campusFacilities: { include: { translations: true } },
    admissionRequirements: { include: { translations: true } },
    requiredDocuments: { include: { translations: true } },
    importantDates: { include: { translations: true } },
    scholarships: { include: { translations: true } },
    universityDirections: { include: { direction: { include: { translations: true } } } },
    media: { include: { translations: true } },
    country: { include: { translations: true } },
    city: { include: { translations: true } },
  },
} as const

type UniversityListItem = Prisma.UniversityGetPayload<typeof universityListInclude>
type UniversityDetailRow = Prisma.UniversityGetPayload<typeof universityDetailInclude>

function buildWhere(params: UniversityQueryParams, locale: NormalizedLocale): Prisma.UniversityWhereInput {
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
        { translations: { some: { locale: loc, OR: [{ title: { contains: q } }, { description: { contains: q } }] } } },
        { city: { translations: { some: { locale: loc, name: { contains: q } } } } },
      ],
    })
  }

  if (params.city) {
    and.push({ city: { translations: { some: { locale: loc, name: params.city } } } })
  }

  if (params.type && isValidType(params.type)) where.type = params.type
  if (params.level && isValidLevel(params.level)) where.academicPrograms = { some: { degreeType: params.level } }
  if (params.langs?.length) and.push({ academicPrograms: { some: { languageCode: { in: params.langs } } } })

  if (and.length) where.AND = and
  return where
}

function buildOrder(sort?: string): Prisma.UniversityOrderByWithRelationInput {
  if (sort === 'price_asc') return { tuitionMin: 'asc' }
  if (sort === 'price_desc') return { tuitionMax: 'desc' }
  return { id: 'asc' }
}

function postSort(list: University[], sort?: string): University[] {
  if (sort === 'lang_en') {
    return [...list].sort((a, b) => {
      const aEn = a.languages.some((l) => l.toLowerCase() === 'en')
      const bEn = b.languages.some((l) => l.toLowerCase() === 'en')
      return aEn !== bEn ? (aEn ? -1 : 1) : a.title.localeCompare(b.title)
    })
  }
  if (sort === 'alpha') return [...list].sort((a, b) => a.title.localeCompare(b.title))
  return list
}

function generateBadge(u: { type?: string | null; scholarships?: unknown[] }): { labelKey: string; color: string } | undefined {
  if (u.scholarships?.length) return { labelKey: 'universities_page.card.badges.scholarships', color: 'green' }
  if (u.type === 'tech') return { labelKey: 'universities_page.card.badges.technical', color: 'purple' }
  return undefined
}

function mapListItem(u: UniversityListItem | UniversityDetailRow, loc: NormalizedLocale, badge?: { labelKey: string; color: string }): University {
  const t = selectTranslation(u.translations, loc)
  const cityT = u.city?.translations ? selectTranslation(u.city.translations, loc) : null
  const keyInfo = extractStringRecord(t?.keyInfoTexts)
  const langs = [...new Set(u.academicPrograms.map((p) => p.languageCode).filter((c): c is string => Boolean(c)))]

  return {
    id: u.id,
    slug: getSlugForLocale(u.translations.map(({ locale, slug }) => ({ locale, slug })), loc),
    title: t?.title ?? '',
    description: t?.description ?? '',
    image: u.image ?? '',
    heroImage: u.heroImage ?? u.image ?? '',
    city: cityT?.name ?? '',
    type: u.type,
    foundedYear: u.foundedYear ?? 0,
    totalStudents: u.totalStudents ?? 0,
    internationalStudents: u.internationalStudents ?? 0,
    hasAccommodation: u.hasAccommodation ?? false,
    tuitionMin: decimalToNumber(u.tuitionMin),
    tuitionMax: decimalToNumber(u.tuitionMax),
    currency: u.currency ?? 'USD',
    languages: langs,
    rankingText: typeof keyInfo?.ranking_text === 'string' ? keyInfo.ranking_text : undefined,
    badge,
    alternates: u.translations.reduce((acc, tr) => {
      if (tr.slug && tr.locale) acc[tr.locale] = tr.slug
      return acc
    }, {} as Record<string, string>),
  }
}

function mapDetail(u: UniversityDetailRow, loc: NormalizedLocale): UniversityDetail {
  const base = mapListItem(u, loc, generateBadge(u))
  const t = selectTranslation(u.translations, loc)
  const about = (asRecord(t?.about) ?? {}) as Record<string, unknown>

  const advantages = Array.isArray(about.advantages)
    ? about.advantages
        .map((item) => {
          if (typeof item === 'string') return { title: item, description: '' }
          if (item && typeof item === 'object') {
            const r = item as Record<string, unknown>
            return { title: typeof r.title === 'string' ? r.title : '', description: typeof r.description === 'string' ? r.description : '' }
          }
          return null
        })
        .filter((x): x is { title: string; description: string } => x !== null)
    : []

  return {
    ...base,
    about: {
      history: typeof about.history === 'string' ? about.history : '',
      mission: typeof about.mission === 'string' ? about.mission : '',
      campusFeatures: Array.isArray(about.campus_features) ? about.campus_features.filter((x): x is string => typeof x === 'string') : [],
      advantages,
    },
    campusLife: {
      facilities: u.campusFacilities.filter((f) => f.isActive !== false).map((f): UniversityCampusFacility => {
        const ft = selectTranslation(f.translations, loc)
        return { id: f.id, name: ft?.name ?? '', description: ft?.description ?? '', image: f.image ?? undefined, icon: f.icon ?? undefined }
      }),
      gallery: u.media.filter((m) => m.kind === 'image').map((m): UniversityCampusGalleryItem => {
        const mt = selectTranslation(m.translations, loc)
        return { url: m.url, alt: mt?.alt ?? '', title: mt?.title ?? '' }
      }),
      activities: Array.isArray(about.activities) ? about.activities.filter((x): x is string => typeof x === 'string') : [],
    },
    directions: u.universityDirections.map((d): UniversityStudyDirection => {
      const dt = selectTranslation(d.direction.translations, loc)
      return { id: d.direction.id, name: dt?.name ?? '', slug: dt?.slug ?? '', languages: [] }
    }),
    admission: {
      requirements: u.admissionRequirements.map((r): UniversityAdmissionRequirement => {
        const rt = selectTranslation(r.translations, loc)
        return { id: r.id, category: rt?.category ?? '', requirement: rt?.requirement ?? '', is_mandatory: false, details: rt?.details ?? undefined }
      }),
      documents: u.requiredDocuments.map((d): UniversityRequiredDocument => {
        const dt = selectTranslation(d.translations, loc)
        return { id: d.id, name: dt?.name ?? '', description: dt?.description ?? '', is_mandatory: false, format_requirements: extractStringArray(dt?.formatRequirements ?? null) }
      }),
      deadlines: u.importantDates.map((d): UniversityImportantDate => {
        const dt = selectTranslation(d.translations, loc)
        return { id: d.id, event: dt?.event ?? '', date: d.date.toISOString().split('T')[0] ?? '', deadline_type: IMPORTANT_DATE_TYPE_MAP[d.type] ?? 'application' }
      }),
      scholarships: u.scholarships.map((s): UniversityScholarship => {
        const st = selectTranslation(s.translations, loc)
        return {
          id: s.id,
          name: st?.name ?? '',
          type: s.type,
          coverage_percentage: s.coveragePercentage,
          eligibility_criteria: extractStringArray(st?.eligibilityCriteria ?? null),
          application_deadline: s.applicationDeadline ? s.applicationDeadline.toISOString().split('T')[0] : undefined,
        }
      }),
    },
    programs: u.academicPrograms.map((p): UniversityProgram => {
      const pt = selectTranslation(p.translations, loc)
      return { id: p.id, name: pt?.name ?? '', degreeType: p.degreeType, language: p.languageCode ?? '', durationYears: p.durationYears, tuitionPerYear: decimalToNumber(p.tuitionPerYear) }
    }),
  }
}

export class UniversityRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(params: UniversityQueryParams, locale = 'ru'): Promise<{ data: University[]; total: number; filters: UniversityFilters }> {
    const loc = normalizeLocale(locale)
    const page = Math.max(1, params.page ?? 1)
    const limit = Math.max(1, params.limit ?? 6)
    const where = buildWhere(params, loc)

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.university.findMany({ where, ...universityListInclude, orderBy: buildOrder(params.sort), skip: (page - 1) * limit, take: limit }),
      this.prisma.university.count({ where }),
    ])

    const data = postSort(rows.map((u) => mapListItem(u, loc, generateBadge(u))), params.sort)
    const filters = await this.buildFilters(loc)
    return { data, total, filters }
  }

  private async buildFilters(loc: NormalizedLocale): Promise<UniversityFilters> {
    const [cityGroups, typeGroups, levelGroups, tuition, langGroups] = await Promise.all([
      this.prisma.university.groupBy({ by: ['cityId'], where: { cityId: { not: null } } }),
      this.prisma.university.groupBy({ by: ['type'] }),
      this.prisma.universityProgram.groupBy({ by: ['degreeType'] }),
      this.prisma.university.aggregate({ _min: { tuitionMin: true, tuitionMax: true }, _max: { tuitionMin: true, tuitionMax: true } }),
      this.prisma.universityProgram.groupBy({ by: ['languageCode'] }),
    ])

    const cityIds = cityGroups.map((g) => g.cityId).filter((v): v is number => v != null)
    const cityTrans = cityIds.length
      ? await this.prisma.cityTranslation.findMany({ where: { cityId: { in: cityIds }, locale: loc.normalized }, select: { cityId: true, name: true } })
      : []

    const cities = [...new Set(cityIds.map((id) => cityTrans.find((t) => t.cityId === id)?.name).filter((n): n is string => Boolean(n)))].sort((a, b) => a.localeCompare(b))
    const types = typeGroups.map((g) => g.type).filter((t): t is UniversityType => Boolean(t)).sort((a, b) => a.localeCompare(b))
    const levels = levelGroups.map((g) => g.degreeType).filter((l): l is DegreeType => Boolean(l)).sort((a, b) => a.localeCompare(b))
    const languages = langGroups.map((g) => g.languageCode).filter((c): c is string => Boolean(c)).sort((a, b) => a.localeCompare(b))

    const mins = [tuition._min.tuitionMin, tuition._min.tuitionMax].filter((v): v is Prisma.Decimal => v != null).map(Number)
    const maxs = [tuition._max.tuitionMin, tuition._max.tuitionMax].filter((v): v is Prisma.Decimal => v != null).map(Number)

    return { cities, types, levels, languages, priceRange: [mins.length ? Math.min(...mins) : 0, maxs.length ? Math.max(...maxs) : 50000] }
  }

  async findById(id: number, locale = 'ru'): Promise<UniversityDetail | null> {
    const u = await this.prisma.university.findUnique({ where: { id }, ...universityDetailInclude })
    return u ? mapDetail(u, normalizeLocale(locale)) : null
  }

  async findBySlug(slug: string, locale = 'ru'): Promise<UniversityDetail | null> {
    const t = await this.prisma.universityTranslation.findFirst({ where: { slug } })
    return t ? this.findById(t.universityId, locale) : null
  }

  async findByDirection(directionSlug: string, locale = 'ru'): Promise<University[]> {
    const loc = normalizeLocale(locale)
    const rows = await this.prisma.university.findMany({
      where: { universityDirections: { some: { direction: { translations: { some: { slug: directionSlug } } } } } },
      ...universityListInclude,
    })
    return rows.map((u) => mapListItem(u, loc))
  }

  async getAllDirections(locale = 'ru', opts: { search?: string; page?: number; limit?: number } = {}) {
    const loc = normalizeLocale(locale).normalized
    const search = opts.search?.trim()
    const page = Math.max(1, opts.page ?? 1)
    const limit = Math.max(1, Math.min(1000, opts.limit ?? 100))

    const where: Prisma.StudyDirectionWhereInput = search
      ? { translations: { some: { locale: loc, name: { contains: search } } } }
      : {}

    const [rows, total] = await Promise.all([
      this.prisma.studyDirection.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
        select: { id: true, translations: { where: { locale: loc }, select: { name: true, slug: true } }, _count: { select: { universityDirections: true } } },
      }),
      this.prisma.studyDirection.count({ where }),
    ])

    return {
      data: rows.map((d) => ({ id: d.id, name: d.translations[0]?.name ?? '', slug: d.translations[0]?.slug ?? '', universities_count: d._count.universityDirections })),
      total,
    }
  }
}
