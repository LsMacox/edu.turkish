import type { PrismaClient, Prisma } from '@prisma/client'
import type { DegreeType, UniversityType } from '../../app/types/domain'
import type {
  AcademicProgram as AcademicProgramDto,
  AdmissionRequirement,
  CampusFacility as CampusFacilityDto,
  CampusGalleryItem,
  ImportantDate,
  RequiredDocument,
  ScholarshipInfo,
  StrongProgramCategory,
  StudyDirection,
  University,
  UniversityDetail,
  UniversityFilters,
  UniversityQueryParams,
} from '../types/api'
import { normalizeLocale, type NormalizedLocale } from '../utils/locale'

export type UniversityListItem = Prisma.UniversityGetPayload<{
  include: {
    translations: true
    academicPrograms: true
    city: { include: { translations: true } }
  }
}>

type FeaturedProgramWithRelations = Prisma.FeaturedProgramGetPayload<{
  include: {
    translations: true
    program: { include: { translations: true } }
  }
}>

type UniversityDetailWithRelations = Prisma.UniversityGetPayload<{
  include: {
    translations: true
    academicPrograms: { include: { translations: true } }
    featuredPrograms: {
      include: {
        translations: true
        program: { include: { translations: true } }
      }
    }
    campusFacilities: { include: { translations: true } }
    admissionRequirements: { include: { translations: true } }
    requiredDocuments: { include: { translations: true } }
    importantDates: { include: { translations: true } }
    scholarships: { include: { translations: true } }
    universityDirections: {
      include: {
        direction: { include: { translations: true } }
      }
    }
    media: { include: { translations: true } }
    country: { include: { translations: true } }
    city: { include: { translations: true } }
  }
}>

const CITY_ALL_VALUES = new Set(['Все города', 'All cities'])
const TYPE_ALL_VALUES = new Set(['Все', 'All'])

const TYPE_LABEL_MAP: Record<string, UniversityType> = {
  Государственный: 'state',
  Частный: 'private',
  State: 'state',
  Private: 'private',
  Technical: 'tech',
  Elite: 'elite',
}

const LEVEL_LABEL_MAP: Record<string, DegreeType> = {
  Бакалавриат: 'bachelor',
  Магистратура: 'master',
  Докторантура: 'phd',
  Bachelor: 'bachelor',
  Master: 'master',
  PhD: 'phd',
}

const IMPORTANT_DATE_TYPE_MAP: Record<Prisma.ImportantDateType, ImportantDate['deadline_type']> = {
  deadline: 'application',
  event: 'document',
  exam: 'exam',
  notification: 'notification',
}

export class UniversityRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Выбор лучшего перевода с fallback логикой
   * 1. Точное совпадение с запрошенным языком
   * 2. Fallback на русский
   * 3. Любой доступный перевод
   */
  private selectBestTranslation<T extends { locale: string | null | undefined }>(
    translations: readonly T[] | null | undefined,
    localeFallbacks: readonly string[],
  ): T | null {
    if (!translations?.length) {
      return null
    }

    const localesToCheck = Array.from(new Set([...localeFallbacks, 'ru']))

    for (const candidate of localesToCheck) {
      const match = translations.find((translation) => translation.locale === candidate)
      if (match) {
        return match
      }
    }

    return translations[0] ?? null
  }

  /**
   * Получение slug из переводов (fallback: ru -> любой)
   */
  private getSlugForLocaleFromTranslations(
    translations: Array<{ locale: string | null | undefined; slug: string | null | undefined }>,
    localeFallbacks: readonly string[],
  ): string {
    const localesToCheck = Array.from(new Set([...localeFallbacks, 'ru']))

    for (const candidate of localesToCheck) {
      const match = translations.find(
        (translation) => translation.locale === candidate && translation.slug,
      )
      if (match?.slug) {
        return match.slug
      }
    }

    const firstWithSlug = translations.find((translation) => Boolean(translation.slug))
    return firstWithSlug?.slug ?? ''
  }

  private buildFeaturedPrograms(
    featuredPrograms: FeaturedProgramWithRelations[],
    locale: NormalizedLocale,
  ): { categories: StrongProgramCategory[]; categoryNames: string[] } {
    const DEFAULT_CATEGORY_MAP: Record<string, string> = {
      ru: 'Сильные программы',
      en: 'Featured Program',
      tr: 'Öne Çıkan Programlar',
      kk: 'Таңдаулы бағдарламалар',
    }
    const DEFAULT_CATEGORY = DEFAULT_CATEGORY_MAP[locale.normalized] || DEFAULT_CATEGORY_MAP.en
    const groups = new Map<
      string,
      {
        order: number
        programs: Array<{ order: number; name: string }>
      }
    >()

    for (const fp of featuredPrograms) {
      const order = typeof fp.displayOrder === 'number' ? fp.displayOrder : Number.MAX_SAFE_INTEGER
      const translation = this.selectBestTranslation(fp.translations || [], locale.fallbacks)
      const programTranslation = this.selectBestTranslation(
        fp.program?.translations || [],
        locale.fallbacks,
      )
      const programName = (programTranslation?.name ?? '').trim()
      if (!programName) continue

      const rawCategory = (translation?.label ?? '').trim()
      const category = rawCategory.length > 0 ? rawCategory : DEFAULT_CATEGORY

      const current = groups.get(category)
      if (!current) {
        groups.set(category, {
          order,
          programs: [{ order, name: programName }],
        })
      } else {
        current.order = Math.min(current.order, order)
        current.programs.push({ order, name: programName })
      }
    }

    const categories = Array.from(groups.entries())
      .sort((a, b) => {
        if (a[1].order !== b[1].order) return a[1].order - b[1].order
        return a[0].localeCompare(b[0])
      })
      .map(([category, data]) => {
        const programsSorted = data.programs
          .slice()
          .sort((a, b) => {
            if (a.order !== b.order) return a.order - b.order
            return a.name.localeCompare(b.name)
          })
          .map((p) => p.name)

        return { category, programs: programsSorted }
      })

    const categoryNames = categories.map((c) => c.category)

    return { categories, categoryNames }
  }

  private buildUniversityWhere(
    params: UniversityQueryParams,
    locale: NormalizedLocale,
  ): Prisma.UniversityWhereInput {
    const where: Prisma.UniversityWhereInput = {}
    const andConditions: Prisma.UniversityWhereInput[] = []
    const locales = Array.from(new Set([...locale.fallbacks, 'ru']))

    const priceRange = this.normalizePriceRange(params.price_min, params.price_max)
    if (priceRange) {
      const programPriceFilter: Prisma.DecimalFilter = {}

      if (priceRange.max !== undefined) {
        programPriceFilter.lte = priceRange.max
        andConditions.push({
          OR: [{ tuitionMin: { lte: priceRange.max } }, { tuitionMin: { equals: null } }],
        })
      }

      if (priceRange.min !== undefined) {
        programPriceFilter.gte = priceRange.min
        andConditions.push({
          OR: [{ tuitionMax: { gte: priceRange.min } }, { tuitionMax: { equals: null } }],
        })
      }

      // Do not add extra tuitionPerYear filter here; intersection is defined by tuitionMin/tuitionMax rules only
    }

    if (params.q) {
      const query = params.q.trim()
      if (query.length > 0) {
        andConditions.push({
          OR: [
            // Match in any locale translation
            {
              translations: {
                some: {
                  locale: { in: locales },
                  OR: [{ title: { contains: query } }, { description: { contains: query } }],
                },
              },
            },
            {
              city: {
                translations: {
                  some: { locale: { in: locales }, name: { contains: query } },
                },
              },
            },
          ],
        })
      }
    }

    if (params.city && !CITY_ALL_VALUES.has(params.city)) {
      andConditions.push({
        OR: [{ city: { translations: { some: { locale: { in: locales }, name: params.city } } } }],
      })
    }

    if (params.type && !TYPE_ALL_VALUES.has(params.type)) {
      const normalizedType = TYPE_LABEL_MAP[params.type] ?? params.type
      where.type = normalizedType as UniversityType
    }

    if (params.level && !TYPE_ALL_VALUES.has(params.level)) {
      const mappedLevel = LEVEL_LABEL_MAP[params.level] ?? (params.level as DegreeType)
      where.academicPrograms = {
        some: { degreeType: mappedLevel },
      }
    }

    if (params.langs && params.langs.length > 0) {
      andConditions.push({
        academicPrograms: {
          some: {
            languageCode: {
              in: params.langs,
            },
          },
        },
      })
    }

    if (andConditions.length > 0) {
      where.AND = andConditions
    }

    return where
  }

  private buildUniversityOrder(
    sort?: UniversityQueryParams['sort'],
  ): Prisma.UniversityOrderByWithRelationInput {
    switch (sort) {
      case 'price_asc':
        return { tuitionMin: 'asc' }
      case 'price_desc':
        return { tuitionMax: 'desc' }
      default:
        return { id: 'asc' }
    }
  }

  private mapUniversityListItem(
    university: UniversityListItem | UniversityDetailWithRelations,
    locale: NormalizedLocale,
  ): University {
    const translation = this.selectBestTranslation(university.translations, locale.fallbacks)
    const cityTranslation = university.city?.translations
      ? this.selectBestTranslation(university.city.translations, locale.fallbacks)
      : null
    const keyInfoTexts = this.asRecord(translation?.keyInfoTexts)
    const languages = Array.from(
      new Set(
        university.academicPrograms
          .map((program) => program.languageCode)
          .filter((code): code is string => Boolean(code)),
      ),
    )

    return {
      id: university.id,
      title: translation?.title ?? '',
      description: translation?.description ?? '',
      city: cityTranslation?.name ?? '',
      foundedYear: university.foundedYear ?? 0,
      type: university.type as UniversityType,
      tuitionRange: {
        min: this.decimalToNumber(university.tuitionMin),
        max: this.decimalToNumber(university.tuitionMax),
        currency: university.currency ?? 'USD',
      },
      totalStudents: university.totalStudents ?? 0,
      internationalStudents: university.internationalStudents ?? 0,
      ranking: {
        text:
          typeof keyInfoTexts?.ranking_text === 'string' ? keyInfoTexts.ranking_text : undefined,
      },
      hasAccommodation: university.hasAccommodation ?? false,
      languages,
      slug: this.getSlugForLocaleFromTranslations(
        university.translations.map(({ locale: trLocale, slug }) => ({ locale: trLocale, slug })),
        locale.fallbacks,
      ),
      image: university.image ?? '',
      heroImage: university.heroImage ?? university.image ?? '',
      badge: this.generateBadgeLite({ type: university.type }, locale.normalized),
    }
  }

  private applyPostProcessSort(
    universities: University[],
    sort?: UniversityQueryParams['sort'],
  ): University[] {
    if (sort === 'lang_en') {
      return [...universities].sort((a, b) => {
        const aHasEn = a.languages.some((lang) => lang.toLowerCase() === 'en')
        const bHasEn = b.languages.some((lang) => lang.toLowerCase() === 'en')
        if (aHasEn !== bHasEn) {
          return aHasEn ? -1 : 1
        }
        return a.title.localeCompare(b.title)
      })
    }

    if (sort === 'alpha') {
      return [...universities].sort((a, b) => a.title.localeCompare(b.title))
    }

    return universities
  }

  private extractStringRecord(
    value: Prisma.JsonValue | null | undefined,
  ): Record<string, string> | undefined {
    const record = this.asRecord(value)
    if (!record) {
      return undefined
    }

    const entries = Object.entries(record).filter(([, v]): v is string => typeof v === 'string')
    return entries.length > 0 ? Object.fromEntries(entries) : undefined
  }

  private extractStringArray(value: Prisma.JsonValue | null | undefined): string[] {
    if (!Array.isArray(value)) {
      return []
    }

    return value.filter((item): item is string => typeof item === 'string')
  }

  private mapCampusFacilities(
    facilities: UniversityDetailWithRelations['campusFacilities'],
    locale: NormalizedLocale,
  ): CampusFacilityDto[] {
    return facilities
      .filter((facility) => facility.isActive !== false)
      .map((facility) => {
        const translation = this.selectBestTranslation(facility.translations, locale.fallbacks)
        return {
          id: facility.id,
          name: translation?.name ?? '',
          description: translation?.description ?? '',
          image: facility.image ?? undefined,
          type: 'support',
          isActive: facility.isActive !== false,
        }
      })
  }

  private mapGallery(
    media: UniversityDetailWithRelations['media'],
    locale: NormalizedLocale,
  ): CampusGalleryItem[] {
    return media
      .filter((item) => item.kind === 'image')
      .map((item) => {
        const translation = this.selectBestTranslation(item.translations, locale.fallbacks)
        return {
          url: item.url,
          alt: translation?.alt ?? '',
          title: translation?.title ?? '',
        }
      })
  }

  private mapDirections(
    directions: UniversityDetailWithRelations['universityDirections'],
    locale: NormalizedLocale,
  ): StudyDirection[] {
    return directions.map((direction) => {
      const translation = this.selectBestTranslation(
        direction.direction.translations,
        locale.fallbacks,
      )
      return {
        id: direction.direction.id,
        name: translation?.name ?? '',
        description: translation?.description ?? '',
        slug: translation?.slug ?? '',
        languages: [],
        duration_years: direction.durationYears ?? undefined,
        cost_per_year: direction.costPerYear != null ? Number(direction.costPerYear) : undefined,
      }
    })
  }

  private mapAdmissionRequirements(
    requirements: UniversityDetailWithRelations['admissionRequirements'],
    locale: NormalizedLocale,
  ): AdmissionRequirement[] {
    return requirements.map((requirement) => {
      const translation = this.selectBestTranslation(requirement.translations, locale.fallbacks)
      return {
        id: requirement.id,
        category: translation?.category ?? '',
        requirement: translation?.requirement ?? '',
        is_mandatory: false,
        details: translation?.details ?? undefined,
      }
    })
  }

  private mapRequiredDocuments(
    documents: UniversityDetailWithRelations['requiredDocuments'],
    locale: NormalizedLocale,
  ): RequiredDocument[] {
    return documents.map((document) => {
      const translation = this.selectBestTranslation(document.translations, locale.fallbacks)
      const formatRequirements = this.extractStringArray(translation?.formatRequirements ?? null)
      return {
        id: document.id,
        name: translation?.name ?? '',
        description: translation?.description ?? '',
        is_mandatory: false,
        format_requirements: formatRequirements,
      }
    })
  }

  private mapImportantDates(
    dates: UniversityDetailWithRelations['importantDates'],
    locale: NormalizedLocale,
  ): ImportantDate[] {
    return dates.map((date) => {
      const translation = this.selectBestTranslation(date.translations, locale.fallbacks)
      return {
        id: date.id,
        event: translation?.event ?? '',
        date: date.date.toISOString().split('T')[0],
        deadline_type: IMPORTANT_DATE_TYPE_MAP[date.type],
      }
    })
  }

  private mapScholarships(
    scholarships: UniversityDetailWithRelations['scholarships'],
    locale: NormalizedLocale,
  ): ScholarshipInfo[] {
    return scholarships.map((scholarship) => {
      const translation = this.selectBestTranslation(scholarship.translations, locale.fallbacks)
      const criteria = this.extractStringArray(translation?.eligibilityCriteria ?? null)
      return {
        id: scholarship.id,
        name: translation?.name ?? '',
        type: scholarship.type,
        coverage_percentage: scholarship.coveragePercentage,
        eligibility_criteria: criteria,
        application_deadline: scholarship.applicationDeadline
          ? scholarship.applicationDeadline.toISOString().split('T')[0]
          : undefined,
      }
    })
  }

  private mapAcademicPrograms(
    programs: UniversityDetailWithRelations['academicPrograms'],
    locale: NormalizedLocale,
  ): AcademicProgramDto[] {
    return programs.map((program) => {
      const translation = this.selectBestTranslation(program.translations, locale.fallbacks)
      return {
        id: program.id,
        name: translation?.name ?? '',
        degree_type: program.degreeType,
        language: program.languageCode,
        duration_years: program.durationYears,
        tuition_per_year: this.decimalToNumber(program.tuitionPerYear),
        description: translation?.description ?? '',
      }
    })
  }

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
    const where = this.buildUniversityWhere(params, localeInfo)
    const orderBy = this.buildUniversityOrder(params.sort)

    const [universities, total] = await this.prisma.$transaction([
      this.prisma.university.findMany({
        where,
        include: {
          translations: true,
          academicPrograms: true,
          city: { include: { translations: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.university.count({ where }),
    ])

    const mapped = universities.map((university) =>
      this.mapUniversityListItem(university, localeInfo),
    )
    const sorted = this.applyPostProcessSort(mapped, params.sort)
    const filters = await this.buildFilterOptions(localeInfo)

    return {
      data: sorted,
      total,
      filters,
    }
  }

  private normalizePriceRange(min?: number, max?: number): { min?: number; max?: number } | null {
    const hasValidMin = typeof min === 'number' && Number.isFinite(min) && min >= 0
    const hasValidMax = typeof max === 'number' && Number.isFinite(max) && max >= 0

    if (!hasValidMin && !hasValidMax) {
      return null
    }

    let normalizedMin = hasValidMin ? min : undefined
    let normalizedMax = hasValidMax ? max : undefined

    if (
      normalizedMin !== undefined &&
      normalizedMax !== undefined &&
      normalizedMin > normalizedMax
    ) {
      const temp = normalizedMin
      normalizedMin = normalizedMax
      normalizedMax = temp
    }

    return {
      min: normalizedMin,
      max: normalizedMax,
    }
  }

  private decimalToNumber(value: Prisma.Decimal | number | null | undefined): number {
    if (value == null) return 0
    return typeof value === 'number' ? value : Number(value)
  }

  private asRecord(value: Prisma.JsonValue | null | undefined): Record<string, unknown> | null {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value as Record<string, unknown>
    }
    return null
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
        this.prisma.academicProgram.groupBy({
          by: ['degreeType'],
        }),
        this.prisma.university.aggregate({
          _min: { tuitionMin: true, tuitionMax: true },
          _max: { tuitionMin: true, tuitionMax: true },
        }),
        this.prisma.academicProgram.groupBy({
          by: ['languageCode'],
        }),
      ])

    const cityIds = cityGroups
      .map((group) => group.cityId)
      .filter((value): value is number => value !== null && value !== undefined)

    const cityTranslations = cityIds.length
      ? await this.prisma.cityTranslation.findMany({
          where: {
            cityId: { in: cityIds },
            locale: { in: locale.fallbacks },
          },
          select: { cityId: true, locale: true, name: true },
        })
      : []

    const cityNames = cityIds
      .map((id) => {
        const translations = cityTranslations.filter((t) => t.cityId === id)
        const best = this.selectBestTranslation(translations, locale.fallbacks)
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
      include: {
        translations: true,
        academicPrograms: { include: { translations: true } },
        featuredPrograms: {
          include: {
            translations: true,
            program: { include: { translations: true } },
          },
          orderBy: { displayOrder: 'asc' },
        },
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
    })

    if (!university) {
      return null
    }

    return this.mapUniversityDetail(university, localeInfo)
  }

  private mapUniversityDetail(
    university: UniversityDetailWithRelations,
    locale: NormalizedLocale,
  ): UniversityDetail {
    const base = this.mapUniversityListItem(university, locale)
    const translation = this.selectBestTranslation(university.translations, locale.fallbacks)
    const aboutRecord = (this.asRecord(translation?.about) ?? {}) as Record<string, unknown>
    const { categories: featuredProgramCategories, categoryNames } = this.buildFeaturedPrograms(
      university.featuredPrograms,
      locale,
    )

    const keyInfoTexts = this.extractStringRecord(translation?.keyInfoTexts)

    const defaultHistory = base.title
      ? `Университет ${base.title} имеет богатую историю образования.`
      : 'Университет имеет богатую историю образования.'

    const historyRaw = aboutRecord['history']
    const missionRaw = aboutRecord['mission']
    const campusFeaturesRaw = aboutRecord['campus_features']
    const advantagesRaw = aboutRecord['advantages']
    const advantages = Array.isArray(advantagesRaw)
      ? advantagesRaw
          .map((item) => {
            if (typeof item === 'string') {
              return { title: item, description: '' }
            }
            if (item && typeof item === 'object') {
              const record = item as Record<string, unknown>
              return {
                title: typeof record.title === 'string' ? record.title : '',
                description: typeof record.description === 'string' ? record.description : '',
              }
            }
            return null
          })
          .filter((item): item is { title: string; description: string } => item !== null)
      : [
          { title: 'Качественное образование', description: 'Высокие стандарты преподавания' },
          { title: 'Международное признание', description: 'Дипломы признаются по всему миру' },
        ]

    return {
      ...base,
      slug: this.getSlugForLocaleFromTranslations(
        university.translations.map(({ locale: trLocale, slug }) => ({ locale: trLocale, slug })),
        locale.fallbacks,
      ),
      badge: this.generateBadge(university, locale.normalized),
      keyInfo: {
        city: base.city,
        foundedYear: base.foundedYear,
        tuitionRange: base.tuitionRange,
        languages: base.languages,
        totalStudents: base.totalStudents,
        internationalStudents: base.internationalStudents,
        hasAccommodation: base.hasAccommodation,
        ranking: base.ranking,
        texts: keyInfoTexts,
      },
      about: {
        history:
          typeof historyRaw === 'string' && historyRaw.length > 0 ? historyRaw : defaultHistory,
        mission:
          typeof missionRaw === 'string' && missionRaw.length > 0
            ? missionRaw
            : 'Миссия университета - предоставление качественного образования.',
        campus_features: Array.isArray(campusFeaturesRaw)
          ? (campusFeaturesRaw as unknown[]).filter(
              (item): item is string => typeof item === 'string',
            )
          : [],
        strong_programs: categoryNames,
        advantages,
      },
      campus_life: {
        facilities: this.mapCampusFacilities(university.campusFacilities, locale),
        gallery: this.mapGallery(university.media, locale),
        activities: ['Студенческие клубы', 'Культурные мероприятия', 'Спортивные соревнования'],
      },
      strong_programs: featuredProgramCategories,
      directions: this.mapDirections(university.universityDirections, locale),
      admission: {
        requirements: this.mapAdmissionRequirements(university.admissionRequirements, locale),
        documents: this.mapRequiredDocuments(university.requiredDocuments, locale),
        deadlines: this.mapImportantDates(university.importantDates, locale),
        scholarships: this.mapScholarships(university.scholarships, locale),
      },
      programs: this.mapAcademicPrograms(university.academicPrograms, locale),
    }
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
   * Generate badge for university
   */
  private generateBadge(
    university: Pick<UniversityDetailWithRelations, 'type' | 'scholarships'>,
    _locale: string,
  ): { label?: string; labelKey?: string; color: string } | undefined {
    // Prefer returning i18n keys; keep label for backward compatibility
    if (university.scholarships?.length > 0) {
      return { labelKey: 'universities_page.card.badges.scholarships', color: 'green' }
    }

    // Numeric ranking removed

    if (university.type === 'tech') {
      return { labelKey: 'universities_page.card.badges.technical', color: 'purple' }
    }

    return undefined
  }

  /**
   * Generate lightweight badge without relying on relations that may not be loaded (e.g., scholarships)
   */
  private generateBadgeLite(
    university: { type?: string },
    _locale: string,
  ): { label?: string; labelKey?: string; color: string } | undefined {
    // Numeric ranking removed

    if (university.type === 'tech') {
      return { labelKey: 'universities_page.card.badges.technical', color: 'purple' }
    }

    return undefined
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
      include: {
        translations: true,
        academicPrograms: true,
        city: { include: { translations: true } },
        universityDirections: {
          include: {
            direction: {
              include: { translations: true },
            },
          },
        },
      },
    })

    return universities.map((university) => this.mapUniversityListItem(university, localeInfo))
  }

  /**
   * Get all study directions
   */
  async getAllDirections(
    locale: string = 'ru',
    options: { search?: string; page?: number; limit?: number } = {},
  ) {
    const localeInfo = normalizeLocale(locale)
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
              locale: { in: localeInfo.fallbacks },
              name: { contains: search },
            },
          },
        },
      ]
    }

    const locales = Array.from(new Set([...localeInfo.fallbacks, 'ru']))

    const [directions, total] = await Promise.all([
      this.prisma.studyDirection.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
        select: {
          id: true,
          translations: {
            where: { locale: { in: locales } },
            orderBy: { locale: 'asc' },
            select: {
              locale: true,
              name: true,
              description: true,
              slug: true,
            },
          },
          _count: {
            select: { universityDirections: true },
          },
        },
      }),
      this.prisma.studyDirection.count({ where }),
    ])

    return {
      data: directions.map((direction) => {
        const translation = this.selectBestTranslation(direction.translations, localeInfo.fallbacks)
        return {
          id: direction.id,
          name: translation?.name || '',
          description: translation?.description || '',
          slug: translation?.slug || '',
          universities_count: direction._count.universityDirections,
        }
      }),
      total,
    }
  }
}
