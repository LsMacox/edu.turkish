import type { Prisma, UniversityType } from '@prisma/client'
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
} from '~~/lib/types'
import {
  pickTranslation,
  getSlugForLocale,
  type NormalizedLocale,
} from '~~/server/utils/locale'
import {
  decimalToNumber,
  asRecord,
  extractStringRecord,
  extractStringArray,
} from '~~/server/utils/prisma'
import { generateBadge, type UniversityBadge } from '~~/lib/domain/universities/constants'

// ─────────────────────────────────────────────────────────────────────────────
// Prisma payload types
// ─────────────────────────────────────────────────────────────────────────────

export const universityListInclude = (locale: string) => ({
  include: {
    translations: { where: { locale } },
    academicPrograms: { select: { languageCode: true } },
    city: { include: { translations: { where: { locale } } } },
  },
} as const)

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

// Тип для list row - используем ReturnType для получения типа из функции
type UniversityListIncludeResult = ReturnType<typeof universityListInclude>
export type UniversityListRow = Prisma.UniversityGetPayload<UniversityListIncludeResult>
export type UniversityDetailRow = Prisma.UniversityGetPayload<typeof universityDetailInclude>

// ─────────────────────────────────────────────────────────────────────────────
// List item mapper
// ─────────────────────────────────────────────────────────────────────────────

function extractLanguages(programs: { languageCode: string | null }[]): string[] {
  return [...new Set(programs.map((p) => p.languageCode).filter((c): c is string => Boolean(c)))]
}

function mapUniversityBase(
  row: { id: number; image: string | null; heroImage: string | null; type: UniversityType; foundedYear: number | null; totalStudents: number | null; internationalStudents: number | null; hasAccommodation: boolean | null; tuitionMin: any; tuitionMax: any; currency: string | null },
  t: { slug?: string | null; title?: string | null; description?: string | null; keyInfoTexts?: any } | null,
  cityName: string,
  langs: string[],
  badge?: UniversityBadge,
): University {
  const keyInfo = extractStringRecord(t?.keyInfoTexts)
  return {
    id: row.id,
    slug: t?.slug ?? '',
    title: t?.title ?? '',
    description: t?.description ?? '',
    image: row.image ?? '',
    heroImage: row.heroImage ?? row.image ?? '',
    city: cityName,
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
  }
}

export function mapUniversityListItem(
  row: UniversityListRow,
  locale: NormalizedLocale,
  badge?: UniversityBadge,
): University {
  const t = row.translations[0] ?? null
  const cityT = row.city?.translations?.[0] ?? null
  return mapUniversityBase(row, t, cityT?.name ?? '', extractLanguages(row.academicPrograms), badge)
}

export function mapUniversityDetailItem(
  row: UniversityDetailRow,
  locale: NormalizedLocale,
  badge?: UniversityBadge,
): University {
  const t = pickTranslation(row.translations, locale)
  const cityT = row.city?.translations ? pickTranslation(row.city.translations, locale) : null
  const base = mapUniversityBase(row, t, cityT?.name ?? '', extractLanguages(row.academicPrograms), badge)

  return {
    ...base,
    slug: getSlugForLocale(
      row.translations.map(({ locale, slug }) => ({ locale, slug })),
      locale,
    ),
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
  const base = mapUniversityDetailItem(row, locale, generateBadge(row))
  const t = pickTranslation(row.translations, locale)
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
      const ft = pickTranslation(f.translations, locale)
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
      const mt = pickTranslation(m.translations, locale)
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
    const dt = pickTranslation(d.direction.translations, locale)
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
    const rt = pickTranslation(r.translations, locale)
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
    const dt = pickTranslation(d.translations, locale)
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
    const dt = pickTranslation(d.translations, locale)
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
    const st = pickTranslation(s.translations, locale)
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
    const pt = pickTranslation(p.translations, locale)
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
