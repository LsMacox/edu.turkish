import type { Prisma } from '@prisma/client'
import type {
  University,
  UniversityDetail,
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
  selectTranslation,
  getSlugForLocale,
  decimalToNumber,
  asRecord,
  extractStringRecord,
  extractStringArray,
  type NormalizedLocale,
} from '~~/server/utils/locale'

// ─────────────────────────────────────────────────────────────────────────────
// Prisma payload types
// ─────────────────────────────────────────────────────────────────────────────

export const universityListInclude = {
  include: {
    translations: true,
    academicPrograms: true,
    city: { include: { translations: true } },
  },
} as const

export const universityDetailInclude = {
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

export type UniversityListRow = Prisma.UniversityGetPayload<typeof universityListInclude>
export type UniversityDetailRow = Prisma.UniversityGetPayload<typeof universityDetailInclude>

// ─────────────────────────────────────────────────────────────────────────────
// Badge generation
// ─────────────────────────────────────────────────────────────────────────────

export interface UniversityBadge {
  labelKey: string
  color: string
}

export function generateBadge(u: {
  type?: string | null
  scholarships?: unknown[]
}): UniversityBadge | undefined {
  if (u.scholarships?.length) {
    return { labelKey: 'universities_page.card.badges.scholarships', color: 'green' }
  }
  if (u.type === 'tech') {
    return { labelKey: 'universities_page.card.badges.technical', color: 'purple' }
  }
  return undefined
}

// ─────────────────────────────────────────────────────────────────────────────
// List item mapper
// ─────────────────────────────────────────────────────────────────────────────

export function mapUniversityListItem(
  row: UniversityListRow | UniversityDetailRow,
  locale: NormalizedLocale,
  badge?: UniversityBadge,
): University {
  const t = selectTranslation(row.translations, locale)
  const cityT = row.city?.translations ? selectTranslation(row.city.translations, locale) : null
  const keyInfo = extractStringRecord(t?.keyInfoTexts)
  const langs = [
    ...new Set(
      row.academicPrograms.map((p) => p.languageCode).filter((c): c is string => Boolean(c)),
    ),
  ]

  return {
    id: row.id,
    slug: getSlugForLocale(
      row.translations.map(({ locale, slug }) => ({ locale, slug })),
      locale,
    ),
    title: t?.title ?? '',
    description: t?.description ?? '',
    image: row.image ?? '',
    heroImage: row.heroImage ?? row.image ?? '',
    city: cityT?.name ?? '',
    type: row.type,
    foundedYear: row.foundedYear ?? 0,
    totalStudents: row.totalStudents ?? 0,
    internationalStudents: row.internationalStudents ?? 0,
    hasAccommodation: row.hasAccommodation ?? false,
    tuitionMin: decimalToNumber(row.tuitionMin),
    tuitionMax: decimalToNumber(row.tuitionMax),
    currency: row.currency ?? 'USD',
    languages: langs,
    rankingText: typeof keyInfo?.ranking_text === 'string' ? keyInfo.ranking_text : undefined,
    badge,
    alternates: row.translations.reduce(
      (acc, tr) => {
        if (tr.slug && tr.locale) acc[tr.locale] = tr.slug
        return acc
      },
      {} as Record<string, string>,
    ),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Detail mapper
// ─────────────────────────────────────────────────────────────────────────────

export function mapUniversityDetail(
  row: UniversityDetailRow,
  locale: NormalizedLocale,
): UniversityDetail {
  const base = mapUniversityListItem(row, locale, generateBadge(row))
  const t = selectTranslation(row.translations, locale)
  const about = (asRecord(t?.about) ?? {}) as Record<string, unknown>

  const advantages = Array.isArray(about.advantages)
    ? about.advantages
        .map((item) => {
          if (typeof item === 'string') return { title: item, description: '' }
          if (item && typeof item === 'object') {
            const r = item as Record<string, unknown>
            return {
              title: typeof r.title === 'string' ? r.title : '',
              description: typeof r.description === 'string' ? r.description : '',
            }
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
      campusFeatures: Array.isArray(about.campus_features)
        ? about.campus_features.filter((x): x is string => typeof x === 'string')
        : [],
      advantages,
    },
    campusLife: {
      facilities: mapCampusFacilities(row.campusFacilities, locale),
      gallery: mapCampusGallery(row.media, locale),
      activities: Array.isArray(about.activities)
        ? about.activities.filter((x): x is string => typeof x === 'string')
        : [],
    },
    directions: mapStudyDirections(row.universityDirections, locale),
    admission: {
      requirements: mapAdmissionRequirements(row.admissionRequirements, locale),
      documents: mapRequiredDocuments(row.requiredDocuments, locale),
      deadlines: mapImportantDates(row.importantDates, locale),
      scholarships: mapScholarships(row.scholarships, locale),
    },
    programs: mapPrograms(row.academicPrograms, locale),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-entity mappers
// ─────────────────────────────────────────────────────────────────────────────

function mapCampusFacilities(
  facilities: UniversityDetailRow['campusFacilities'],
  locale: NormalizedLocale,
): UniversityCampusFacility[] {
  return facilities
    .filter((f) => f.isActive !== false)
    .map((f): UniversityCampusFacility => {
      const ft = selectTranslation(f.translations, locale)
      return {
        id: f.id,
        name: ft?.name ?? '',
        description: ft?.description ?? '',
        image: f.image ?? undefined,
        icon: f.icon ?? undefined,
      }
    })
}

function mapCampusGallery(
  media: UniversityDetailRow['media'],
  locale: NormalizedLocale,
): UniversityCampusGalleryItem[] {
  return media
    .filter((m) => m.kind === 'image')
    .map((m): UniversityCampusGalleryItem => {
      const mt = selectTranslation(m.translations, locale)
      return {
        url: m.url,
        alt: mt?.alt ?? '',
        title: mt?.title ?? '',
      }
    })
}

function mapStudyDirections(
  directions: UniversityDetailRow['universityDirections'],
  locale: NormalizedLocale,
): UniversityStudyDirection[] {
  return directions.map((d): UniversityStudyDirection => {
    const dt = selectTranslation(d.direction.translations, locale)
    return {
      id: d.direction.id,
      name: dt?.name ?? '',
      slug: dt?.slug ?? '',
      languages: [],
    }
  })
}

function mapAdmissionRequirements(
  requirements: UniversityDetailRow['admissionRequirements'],
  locale: NormalizedLocale,
): UniversityAdmissionRequirement[] {
  return requirements.map((r): UniversityAdmissionRequirement => {
    const rt = selectTranslation(r.translations, locale)
    return {
      id: r.id,
      category: rt?.category ?? '',
      requirement: rt?.requirement ?? '',
      isMandatory: false,
      details: rt?.details ?? undefined,
    }
  })
}

function mapRequiredDocuments(
  documents: UniversityDetailRow['requiredDocuments'],
  locale: NormalizedLocale,
): UniversityRequiredDocument[] {
  return documents.map((d): UniversityRequiredDocument => {
    const dt = selectTranslation(d.translations, locale)
    return {
      id: d.id,
      name: dt?.name ?? '',
      description: dt?.description ?? '',
      isMandatory: false,
      formatRequirements: extractStringArray(dt?.formatRequirements ?? null),
    }
  })
}

function mapImportantDates(
  dates: UniversityDetailRow['importantDates'],
  locale: NormalizedLocale,
): UniversityImportantDate[] {
  return dates.map((d): UniversityImportantDate => {
    const dt = selectTranslation(d.translations, locale)
    return {
      id: d.id,
      event: dt?.event ?? '',
      date: d.date.toISOString().split('T')[0] ?? '',
      deadlineType: d.type,
    }
  })
}

function mapScholarships(
  scholarships: UniversityDetailRow['scholarships'],
  locale: NormalizedLocale,
): UniversityScholarship[] {
  return scholarships.map((s): UniversityScholarship => {
    const st = selectTranslation(s.translations, locale)
    return {
      id: s.id,
      name: st?.name ?? '',
      type: s.type,
      coveragePercentage: s.coveragePercentage,
      eligibilityCriteria: extractStringArray(st?.eligibilityCriteria ?? null),
      applicationDeadline: s.applicationDeadline
        ? s.applicationDeadline.toISOString().split('T')[0]
        : undefined,
    }
  })
}

function mapPrograms(
  programs: UniversityDetailRow['academicPrograms'],
  locale: NormalizedLocale,
): UniversityProgram[] {
  return programs.map((p): UniversityProgram => {
    const pt = selectTranslation(p.translations, locale)
    return {
      id: p.id,
      name: pt?.name ?? '',
      degreeType: p.degreeType,
      language: p.languageCode ?? '',
      durationYears: p.durationYears,
      tuitionPerYear: decimalToNumber(p.tuitionPerYear),
    }
  })
}
