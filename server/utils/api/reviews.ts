import { parsePositiveInt } from '~~/lib/number'

const allowedMediaTypes = ['text', 'video', 'image'] as const

type AllowedMediaType = (typeof allowedMediaTypes)[number]

const toPositiveIntegerWithDefault = (value: unknown, defaultValue: number) => {
  const candidate = Array.isArray(value) ? value[0] : value
  const parsed = parsePositiveInt(candidate)
  return parsed ?? defaultValue
}

const toTrimmedString = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const resolveMediaType = (candidate: unknown): AllowedMediaType | undefined => {
  if (typeof candidate !== 'string') {
    return undefined
  }

  const normalized = candidate.trim().toLowerCase()
  if (normalized === '') {
    return undefined
  }
  return allowedMediaTypes.includes(normalized as AllowedMediaType)
    ? (normalized as AllowedMediaType)
    : undefined
}

export function parseReviewFilters(query: Record<string, any>) {
  const type = toTrimmedString(query.type)
  const lang = toTrimmedString(query.lang)
  const mediaType = resolveMediaType(query.mediaType)

  return {
    type: type !== '' ? type : 'all',
    featured: query.featured === 'true',
    page: toPositiveIntegerWithDefault(query.page, 1),
    limit: toPositiveIntegerWithDefault(query.limit, 50),
    ...(lang ? { lang } : {}),
    ...(mediaType ? { mediaType } : {}),
  }
}
