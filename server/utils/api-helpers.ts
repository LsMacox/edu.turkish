import type { UniversityQueryParams } from '~~/server/types/api'
import { parsePositiveInt } from '~~/lib/number'

/**
 * Parse query parameters for universities endpoint
 */
export function parseUniversityFilters(query: Record<string, any>): UniversityQueryParams {
  const toString = (value: unknown) => (typeof value === 'string' ? value : undefined)

  const normalizeLanguages = (value: unknown): string[] | undefined => {
    const raw = Array.isArray(value) ? value : value !== undefined ? [value] : []
    const langs = raw.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    )
    return langs.length > 0 ? langs : undefined
  }

  const toNonNegativeNumber = (value: unknown): number | undefined => {
    if (value === undefined || value === null || value === '') {
      return undefined
    }

    const parsed = Number(value)
    if (!Number.isFinite(parsed) || parsed < 0) {
      return undefined
    }

    return parsed
  }

  const toPositiveInteger = (value: unknown): number | undefined => {
    return parsePositiveInt(Array.isArray(value) ? value[0] : value)
  }

  const priceMin = toNonNegativeNumber(query.price_min)
  const priceMax = toNonNegativeNumber(query.price_max)

  const q = toString(query.q)
  const city = toString(query.city)
  const type = toString(query.type)
  const level = toString(query.level)
  const langs = normalizeLanguages(query.langs)
  const page = toPositiveInteger(query.page)
  const limit = toPositiveInteger(query.limit)

  const sortCandidate = toString(query.sort)
  const allowedSorts = ['pop', 'price_asc', 'price_desc', 'alpha', 'lang_en'] as const
  const sort =
    sortCandidate && allowedSorts.includes(sortCandidate as (typeof allowedSorts)[number])
      ? (sortCandidate as UniversityQueryParams['sort'])
      : undefined

  // Start with explicit defaults expected by callers/tests
  const filters: UniversityQueryParams = {
    q: '',
    city: '',
    langs: [],
    type: '',
    level: '',
  }

  if (q !== undefined) {
    filters.q = q.trim() === '' ? '' : q
  }

  if (city !== undefined) {
    filters.city = city
  }

  if (type !== undefined) {
    filters.type = type
  }

  if (level !== undefined) {
    filters.level = level
  }

  if (langs) {
    filters.langs = langs
  }

  if (priceMin !== undefined) {
    filters.price_min = priceMin
  }

  if (priceMax !== undefined) {
    filters.price_max = priceMax
  }

  if (
    filters.price_min !== undefined &&
    filters.price_max !== undefined &&
    filters.price_min > filters.price_max
  ) {
    delete filters.price_min
    delete filters.price_max
  }

  if (sort) {
    filters.sort = sort
  }

  if (page !== undefined) {
    filters.page = page
  }

  if (limit !== undefined) {
    filters.limit = limit
  }

  return filters
}

const toPositiveIntegerWithDefault = (value: unknown, defaultValue: number) => {
  const candidate = Array.isArray(value) ? value[0] : value
  const parsed = parsePositiveInt(candidate)
  return parsed ?? defaultValue
}

/**
 * Parse query parameters for reviews endpoint
 */
export function parseReviewFilters(query: Record<string, any>) {
  const type = typeof query.type === 'string' ? query.type.trim() : ''
  const lang = typeof query.lang === 'string' ? query.lang.trim() : ''
  const mediaTypeCandidate =
    typeof query.mediaType === 'string' ? query.mediaType.trim() : ''
  const allowedMediaTypes = ['text', 'video', 'image'] as const
  const mediaType = allowedMediaTypes.includes(
    mediaTypeCandidate as (typeof allowedMediaTypes)[number],
  )
    ? (mediaTypeCandidate as (typeof allowedMediaTypes)[number])
    : undefined

  return {
    type: type !== '' ? type : 'all',
    featured: query.featured === 'true',
    page: toPositiveIntegerWithDefault(query.page, 1),
    limit: toPositiveIntegerWithDefault(query.limit, 50),
    ...(lang ? { lang } : {}),
    ...(mediaType ? { mediaType } : {}),
  }
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(total: number, page: number, limit: number) {
  const safeTotal = Number.isFinite(total) && total > 0 ? Math.floor(total) : 0
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 1
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
  const totalPages = Math.ceil(safeTotal / safeLimit)

  return {
    total: safeTotal,
    page: Math.max(1, safePage),
    limit: Math.max(1, safeLimit),
    totalPages: Math.max(1, totalPages),
  }
}

/**
 * Validate application request data
 */
export function validateApplicationData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.personal_info?.first_name?.trim()) {
    errors.push('First name is required')
  }

  if (data.personal_info?.email?.trim()) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal_info.email)) {
      errors.push('Invalid email format')
    }
  }

  if (!data.personal_info?.phone?.trim()) {
    errors.push('Phone number is required')
  } else {
    const digits = String(data.personal_info.phone).replace(/\D/g, '')
    if (digits.length < 10) {
      errors.push('Phone number must contain at least 10 digits')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
