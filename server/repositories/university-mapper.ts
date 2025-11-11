import type {
  UniversityProgram as UniversityProgramDto,
  UniversityAdmissionRequirement,
  UniversityCampusFacility as UniversityCampusFacilityDto,
  UniversityCampusGalleryItem,
  UniversityImportantDate,
  UniversityRequiredDocument,
  UniversityScholarship,
  StrongProgramCategory,
  UniversityStudyDirection,
  University,
  UniversityDetail,
} from '~~/server/types/api'
import type {
  UniversityListItem,
  UniversityDetailWithRelations,
  FeaturedProgramWithRelations,
} from './university.prisma'
import type { NormalizedLocale } from '../utils/locale'
import {
  selectTranslation,
  getSlugForLocale,
  decimalToNumber,
  asRecord,
  extractStringRecord,
  extractStringArray,
  resolveSupportedLocale,
} from '../utils/university-locale'
import { FEATURED_PROGRAM_CATEGORY, IMPORTANT_DATE_TYPE_MAP } from './university.constants'

type Badge = { label?: string; labelKey?: string; color: string } | undefined

export const mapUniversityListItem = (
  university: UniversityListItem | UniversityDetailWithRelations,
  locale: NormalizedLocale,
  options: { badge?: Badge } = {},
): University => {
  const translation = selectTranslation(university.translations, locale)
  const cityTranslation = university.city?.translations
    ? selectTranslation(university.city.translations, locale)
    : null
  const keyInfoTexts = extractStringRecord(translation?.keyInfoTexts)
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
    type: university.type,
    tuitionRange: {
      min: decimalToNumber(university.tuitionMin),
      max: decimalToNumber(university.tuitionMax),
      currency: university.currency ?? 'USD',
    },
    totalStudents: university.totalStudents ?? 0,
    internationalStudents: university.internationalStudents ?? 0,
    ranking: {
      text: typeof keyInfoTexts?.ranking_text === 'string' ? keyInfoTexts.ranking_text : undefined,
    },
    hasAccommodation: university.hasAccommodation ?? false,
    languages,
    slug: getSlugForLocale(
      university.translations.map(({ locale: trLocale, slug }) => ({ locale: trLocale, slug })),
      locale,
    ),
    image: university.image ?? '',
    heroImage: university.heroImage ?? university.image ?? '',
    badge: options.badge,
  }
}

const buildFeaturedPrograms = (
  featuredPrograms: FeaturedProgramWithRelations[],
  locale: NormalizedLocale,
): { categories: StrongProgramCategory[]; categoryNames: string[] } => {
  const supported = resolveSupportedLocale(locale)
  const defaultCategory = supported ? (FEATURED_PROGRAM_CATEGORY[supported] ?? '') : ''
  const groups = new Map<
    string,
    {
      order: number
      programs: Array<{ order: number; name: string }>
    }
  >()

  for (const fp of featuredPrograms) {
    const order = typeof fp.displayOrder === 'number' ? fp.displayOrder : Number.MAX_SAFE_INTEGER
    const programTranslation = selectTranslation(fp.program?.translations || [], locale)
    const programName = (programTranslation?.name ?? '').trim()
    if (!programName) continue

    const category = defaultCategory

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

const mapCampusFacilities = (
  facilities: UniversityDetailWithRelations['campusFacilities'],
  locale: NormalizedLocale,
): UniversityCampusFacilityDto[] =>
  facilities
    .filter((facility) => facility.isActive !== false)
    .map((facility) => {
      const translation = selectTranslation(facility.translations, locale)
      return {
        id: facility.id,
        name: translation?.name ?? '',
        description: translation?.description ?? '',
        image: facility.image ?? undefined,
        type: 'support',
        isActive: facility.isActive !== false,
      }
    })

const mapGallery = (
  media: UniversityDetailWithRelations['media'],
  locale: NormalizedLocale,
): UniversityCampusGalleryItem[] =>
  media
    .filter((item) => item.kind === 'image')
    .map((item) => {
      const translation = selectTranslation(item.translations, locale)
      return {
        url: item.url,
        alt: translation?.alt ?? '',
        title: translation?.title ?? '',
      }
    })

const mapDirections = (
  directions: UniversityDetailWithRelations['universityDirections'],
  locale: NormalizedLocale,
): UniversityStudyDirection[] =>
  directions.map((direction) => {
    const translation = selectTranslation(direction.direction.translations, locale)
    return {
      id: direction.direction.id,
      name: translation?.name ?? '',
      slug: translation?.slug ?? '',
      languages: [],
    }
  })

const mapAdmissionRequirements = (
  requirements: UniversityDetailWithRelations['admissionRequirements'],
  locale: NormalizedLocale,
): UniversityAdmissionRequirement[] =>
  requirements.map((requirement) => {
    const translation = selectTranslation(requirement.translations, locale)
    return {
      id: requirement.id,
      category: translation?.category ?? '',
      requirement: translation?.requirement ?? '',
      is_mandatory: false,
      details: translation?.details ?? undefined,
    }
  })

const mapRequiredDocuments = (
  documents: UniversityDetailWithRelations['requiredDocuments'],
  locale: NormalizedLocale,
): UniversityRequiredDocument[] =>
  documents.map((document) => {
    const translation = selectTranslation(document.translations, locale)
    const formatRequirements = extractStringArray(translation?.formatRequirements ?? null)
    return {
      id: document.id,
      name: translation?.name ?? '',
      description: translation?.description ?? '',
      is_mandatory: false,
      format_requirements: formatRequirements,
    }
  })

const mapImportantDates = (
  dates: UniversityDetailWithRelations['importantDates'],
  locale: NormalizedLocale,
): UniversityImportantDate[] =>
  dates.map((date) => {
    const translation = selectTranslation(date.translations, locale)
    return {
      id: date.id,
      event: translation?.event ?? '',
      date: date.date.toISOString().split('T')[0] ?? '',
      deadline_type: IMPORTANT_DATE_TYPE_MAP[date.type] ?? 'application',
    }
  })

const mapScholarships = (
  scholarships: UniversityDetailWithRelations['scholarships'],
  locale: NormalizedLocale,
): UniversityScholarship[] =>
  scholarships.map((scholarship) => {
    const translation = selectTranslation(scholarship.translations, locale)
    const criteria = extractStringArray(translation?.eligibilityCriteria ?? null)
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

const mapAcademicPrograms = (
  programs: UniversityDetailWithRelations['academicPrograms'],
  locale: NormalizedLocale,
): UniversityProgramDto[] =>
  programs.map((program) => {
    const translation = selectTranslation(program.translations, locale)
    return {
      id: program.id,
      name: translation?.name ?? '',
      degree_type: program.degreeType,
      language: program.languageCode,
      duration_years: program.durationYears,
      tuition_per_year: decimalToNumber(program.tuitionPerYear),
    }
  })

export const mapUniversityDetail = (
  university: UniversityDetailWithRelations,
  locale: NormalizedLocale,
): UniversityDetail => {
  const base = mapUniversityListItem(university, locale, {
    badge: generateBadge(university),
  })
  const translation = selectTranslation(university.translations, locale)
  const aboutRecord = (asRecord(translation?.about) ?? {}) as Record<string, unknown>
  const { categories: featuredProgramCategories, categoryNames } = buildFeaturedPrograms(
    university.featuredPrograms,
    locale,
  )

  const keyInfoTexts = extractStringRecord(translation?.keyInfoTexts)

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
    : []
  const activitiesRaw = aboutRecord['activities']
  const activities = Array.isArray(activitiesRaw)
    ? (activitiesRaw as unknown[]).filter((item): item is string => typeof item === 'string')
    : []

  return {
    ...base,
    slug: getSlugForLocale(
      university.translations.map(({ locale: trLocale, slug }) => ({ locale: trLocale, slug })),
      locale,
    ),
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
      history: typeof historyRaw === 'string' ? historyRaw : '',
      mission: typeof missionRaw === 'string' ? missionRaw : '',
      campus_features: Array.isArray(campusFeaturesRaw)
        ? (campusFeaturesRaw as unknown[]).filter(
            (item): item is string => typeof item === 'string',
          )
        : [],
      strong_programs: categoryNames,
      advantages,
    },
    campus_life: {
      facilities: mapCampusFacilities(university.campusFacilities, locale),
      gallery: mapGallery(university.media, locale),
      activities,
    },
    strong_programs: featuredProgramCategories,
    directions: mapDirections(university.universityDirections, locale),
    admission: {
      requirements: mapAdmissionRequirements(university.admissionRequirements, locale),
      documents: mapRequiredDocuments(university.requiredDocuments, locale),
      deadlines: mapImportantDates(university.importantDates, locale),
      scholarships: mapScholarships(university.scholarships, locale),
    },
    programs: mapAcademicPrograms(university.academicPrograms, locale),
  }
}

export const generateBadge = (
  university: Pick<UniversityDetailWithRelations, 'type' | 'scholarships'>,
): { label?: string; labelKey?: string; color: string } | undefined => {
  if (university.scholarships?.length > 0) {
    return { labelKey: 'universities_page.card.badges.scholarships', color: 'green' }
  }

  if (university.type === 'tech') {
    return { labelKey: 'universities_page.card.badges.technical', color: 'purple' }
  }

  return undefined
}

export const generateBadgeLite = (university: {
  type?: string
}): { label?: string; labelKey?: string; color: string } | undefined => {
  if (university.type === 'tech') {
    return { labelKey: 'universities_page.card.badges.technical', color: 'purple' }
  }

  return undefined
}
