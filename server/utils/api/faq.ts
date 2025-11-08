import { toPositiveIntegerWithDefault } from '~~/lib/number'

/**
 * Parse query parameters for FAQ endpoint
 */
export function parseFAQFilters(query: Record<string, any>) {
  const lang = typeof query.lang === 'string' ? query.lang.trim() : ''

  return {
    q: (query.q as string) || '',
    category: (query.category as string) || 'all',
    featured: query.featured === 'true',
    limit: toPositiveIntegerWithDefault(query.limit, 50),
    ...(lang ? { lang } : {}),
  }
}
