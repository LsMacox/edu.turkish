import type { UniversityQueryParams } from '~~/server/types/api'
import { toNonNegativeNumber, toPositiveInteger, toPositiveIntegerWithDefault } from '~~/lib/number'

const REVIEW_MEDIA_TYPES = ['text', 'video', 'image'] as const
const UNIVERSITY_SORTS = ['pop', 'price_asc', 'price_desc', 'alpha', 'lang_en'] as const

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export function parseReviewFilters(query: Record<string, unknown>) {
  const type = str(query.type)
  const lang = str(query.lang)
  const mediaType = str(query.mediaType).toLowerCase()

  return {
    type: type || 'all',
    featured: query.featured === 'true',
    page: toPositiveIntegerWithDefault(query.page, 1),
    limit: toPositiveIntegerWithDefault(query.limit, 50),
    ...(lang && { lang }),
    ...(REVIEW_MEDIA_TYPES.includes(mediaType as (typeof REVIEW_MEDIA_TYPES)[number]) && {
      mediaType,
    }),
  }
}

export function parseFAQFilters(query: Record<string, unknown>) {
  const lang = str(query.lang)

  return {
    q: str(query.q),
    category: str(query.category) || 'all',
    featured: query.featured === 'true',
    limit: toPositiveIntegerWithDefault(query.limit, 50),
    ...(lang && { lang }),
  }
}

export function parseUniversityFilters(query: Record<string, unknown>): UniversityQueryParams {
  const sort = str(query.sort)
  const rawLangs = Array.isArray(query.langs) ? query.langs : query.langs ? [query.langs] : []
  const langs = rawLangs.filter((l): l is string => typeof l === 'string' && l.trim().length > 0)

  let priceMin = toNonNegativeNumber(query.price_min)
  let priceMax = toNonNegativeNumber(query.price_max)
  if (priceMin !== undefined && priceMax !== undefined && priceMin > priceMax) {
    priceMin = undefined
    priceMax = undefined
  }

  return {
    q: str(query.q),
    city: str(query.city),
    type: str(query.type),
    level: str(query.level),
    langs,
    price_min: priceMin,
    price_max: priceMax,
    sort: UNIVERSITY_SORTS.includes(sort as any)
      ? (sort as UniversityQueryParams['sort'])
      : undefined,
    page: toPositiveInteger(query.page),
    limit: toPositiveInteger(query.limit),
  }
}
