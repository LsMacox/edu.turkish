import type { Prisma, DegreeType, UniversityType } from '@prisma/client'
import { SUPPORTED_LOCALES } from '~~/lib/locales'
import type { University } from '~~/server/types/api'
import type { NormalizedLocale } from '../utils/locale'
import { resolveSupportedLocale } from '../utils/university-locale'
import {
  UNIVERSITIES_PAGE_TRANSLATIONS,
  type UniversitiesFilterTranslation,
} from './university.constants'

export type UniversityFilterParams = {
  q?: string
  city?: string
  type?: string
  level?: string
  langs?: string[]
  price_min?: number
  price_max?: number
  sort?: 'pop' | 'price_asc' | 'price_desc' | 'lang_en' | 'alpha'
}

const CITY_ALL_VALUES = new Set<string>()
const TYPE_ALL_VALUES = new Set<string>()
const LEVEL_ALL_VALUES = new Set<string>()

const UNIVERSITY_TYPE_VALUES = ['state', 'private', 'tech', 'elite'] as const
const DEGREE_TYPE_VALUES = ['bachelor', 'master', 'phd'] as const

const TYPE_LABEL_MAP: Record<string, UniversityType> = {
  state: 'state',
  private: 'private',
  tech: 'tech',
  elite: 'elite',
}

const LEVEL_LABEL_MAP: Record<string, DegreeType> = {
  bachelor: 'bachelor',
  master: 'master',
  phd: 'phd',
  PhD: 'phd',
  Doctorate: 'phd',
  doctorate: 'phd',
}

export const VALID_UNIVERSITY_TYPES: readonly UniversityType[] = UNIVERSITY_TYPE_VALUES
export const VALID_DEGREE_TYPES: readonly DegreeType[] = DEGREE_TYPE_VALUES

export const appendFilterValues = (translations: UniversitiesFilterTranslation | undefined) => {
  if (!translations) return

  if (typeof translations.all_cities === 'string' && translations.all_cities.trim()) {
    CITY_ALL_VALUES.add(translations.all_cities.trim())
  }
  if (typeof translations.all_types === 'string' && translations.all_types.trim()) {
    TYPE_ALL_VALUES.add(translations.all_types.trim())
  }
  if (typeof translations.all_levels === 'string' && translations.all_levels.trim()) {
    LEVEL_ALL_VALUES.add(translations.all_levels.trim())
  }

  if (translations.types) {
    for (const [typeKey, label] of Object.entries(translations.types)) {
      if (typeof label === 'string' && label.trim()) {
        TYPE_LABEL_MAP[label.trim()] = typeKey as UniversityType
      }
    }
  }

  if (translations.levels) {
    for (const [levelKey, label] of Object.entries(translations.levels)) {
      if (typeof label === 'string' && label.trim()) {
        const normalized = levelKey === 'doctorate' ? 'phd' : (levelKey as DegreeType)
        LEVEL_LABEL_MAP[label.trim()] = normalized
      }
    }
  }
}

for (const locale of SUPPORTED_LOCALES) {
  appendFilterValues(UNIVERSITIES_PAGE_TRANSLATIONS[locale]?.filters)
}

const normalizePriceRange = (min?: number, max?: number): { min?: number; max?: number } | null => {
  const hasValidMin = typeof min === 'number' && Number.isFinite(min) && min >= 0
  const hasValidMax = typeof max === 'number' && Number.isFinite(max) && max >= 0

  if (!hasValidMin && !hasValidMax) {
    return null
  }

  let normalizedMin = hasValidMin ? min : undefined
  let normalizedMax = hasValidMax ? max : undefined

  if (normalizedMin !== undefined && normalizedMax !== undefined && normalizedMin > normalizedMax) {
    const temp = normalizedMin
    normalizedMin = normalizedMax
    normalizedMax = temp
  }

  return {
    min: normalizedMin,
    max: normalizedMax,
  }
}

export const buildUniversityWhere = (
  params: UniversityFilterParams,
  locale: NormalizedLocale,
): Prisma.UniversityWhereInput => {
  const where: Prisma.UniversityWhereInput = {}
  const andConditions: Prisma.UniversityWhereInput[] = []
  const localeCode = resolveSupportedLocale(locale) ?? locale.normalized
  const locales = [localeCode]

  const priceRange = normalizePriceRange(params.price_min, params.price_max)
  if (priceRange) {
    if (priceRange.max !== undefined) {
      andConditions.push({
        OR: [{ tuitionMin: { lte: priceRange.max } }, { tuitionMin: { equals: null } }],
      })
    }

    if (priceRange.min !== undefined) {
      andConditions.push({
        OR: [{ tuitionMax: { gte: priceRange.min } }, { tuitionMax: { equals: null } }],
      })
    }
  }

  if (params.q?.trim()) {
    const query = params.q.trim()
    andConditions.push({
      OR: [
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

  if (params.city && !CITY_ALL_VALUES.has(params.city)) {
    andConditions.push({
      OR: [{ city: { translations: { some: { locale: { in: locales }, name: params.city } } } }],
    })
  }

  if (params.type && !TYPE_ALL_VALUES.has(params.type)) {
    const normalizedType = (TYPE_LABEL_MAP[params.type] ?? params.type) as string
    if ((VALID_UNIVERSITY_TYPES as readonly string[]).includes(normalizedType)) {
      where.type = normalizedType as UniversityType
    }
  }

  if (params.level && !LEVEL_ALL_VALUES.has(params.level)) {
    const mappedLevel = (LEVEL_LABEL_MAP[params.level] ?? (params.level as DegreeType)) as string
    if ((VALID_DEGREE_TYPES as readonly string[]).includes(mappedLevel)) {
      where.academicPrograms = {
        some: { degreeType: mappedLevel as DegreeType },
      }
    }
  }

  if (params.langs?.length) {
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

export const buildUniversityOrder = (
  sort?: UniversityFilterParams['sort'],
): Prisma.UniversityOrderByWithRelationInput => {
  switch (sort) {
    case 'price_asc':
      return { tuitionMin: 'asc' }
    case 'price_desc':
      return { tuitionMax: 'desc' }
    default:
      return { id: 'asc' }
  }
}

export const applyPostProcessSort = (
  universities: University[],
  sort?: UniversityFilterParams['sort'],
): University[] => {
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
