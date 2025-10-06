import type { UniversityQueryParams } from '~~/server/types/api'
import { parsePositiveInt } from '~~/lib/number'

const allowedSorts = ['pop', 'price_asc', 'price_desc', 'alpha', 'lang_en'] as const

type AllowedSort = (typeof allowedSorts)[number]

const toString = (value: unknown) => (typeof value === 'string' ? value : undefined)

const normalizeLanguages = (value: unknown): string[] | undefined => {
  const raw = Array.isArray(value) ? value : value !== undefined ? [value] : []
  const langs = raw.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
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

const resolveSort = (candidate: unknown): AllowedSort | undefined => {
  if (typeof candidate !== 'string') {
    return undefined
  }

  return allowedSorts.includes(candidate as AllowedSort) ? (candidate as AllowedSort) : undefined
}

export function parseUniversityFilters(query: Record<string, any>): UniversityQueryParams {
  const priceMin = toNonNegativeNumber(query.price_min)
  const priceMax = toNonNegativeNumber(query.price_max)

  const q = toString(query.q)
  const city = toString(query.city)
  const type = toString(query.type)
  const level = toString(query.level)
  const langs = normalizeLanguages(query.langs)
  const page = toPositiveInteger(query.page)
  const limit = toPositiveInteger(query.limit)
  const sort = resolveSort(query.sort)

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
