import type { FAQItem, FAQCategory, UniversityQueryParams } from '../types/api'

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
    const parsed = toNonNegativeNumber(value)
    if (parsed === undefined) {
      return undefined
    }

    const rounded = Math.floor(parsed)
    return rounded > 0 ? rounded : undefined
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

  if (candidate === undefined || candidate === null || candidate === '') {
    return defaultValue
  }

  const parsed = Number(candidate)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return defaultValue
  }

  return Math.floor(parsed)
}

/**
 * Parse query parameters for reviews endpoint
 */
export function parseReviewFilters(query: Record<string, any>) {
  const type = typeof query.type === 'string' ? query.type.trim() : ''

  return {
    type: type !== '' ? type : 'all',
    featured: query.featured === 'true',
    page: toPositiveIntegerWithDefault(query.page, 1),
    limit: toPositiveIntegerWithDefault(query.limit, 50),
  }
}

/**
 * Parse query parameters for FAQ endpoint
 */
export function parseFAQFilters(query: Record<string, any>) {
  return {
    q: (query.q as string) || '',
    category: (query.category as string) || 'all',
    featured: query.featured === 'true',
    limit: toPositiveIntegerWithDefault(query.limit, 50),
  }
}

/**
 * Search FAQs by query string with relevance scoring
 * Updated to handle simplified string answers
 */
export function searchFAQs(faqs: FAQItem[], searchQuery: string): FAQItem[] {
  if (!searchQuery.trim()) {
    return faqs
  }

  const query = searchQuery.toLowerCase()
  const searchTerms = query.split(' ').filter((term) => term.length > 1)

  return faqs
    .map((faq) => {
      let score = 0
      const questionLower = faq.question.toLowerCase()
      const answerText = faq.answer.toLowerCase()

      // Exact phrase match in question (highest score)
      if (questionLower.includes(query)) {
        score += 100
      }

      // Exact phrase match in answer (strip HTML tags for search)
      const plainTextAnswer = answerText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')
      if (plainTextAnswer.includes(query)) {
        score += 50
      }

      // Individual term matches
      searchTerms.forEach((term) => {
        if (questionLower.includes(term)) {
          score += 20
        }
        if (plainTextAnswer.includes(term)) {
          score += 10
        }
      })

      // Boost featured items slightly
      if (faq.featured) {
        score += 5
      }

      return { ...faq, relevance_score: score }
    })
    .filter((faq) => faq.relevance_score > 0)
    .sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0))
}

/**
 * Get FAQ categories with counts
 */
export function getFAQCategories(faqs: FAQItem[]): FAQCategory[] {
  const categoryMap = new Map<string, number>()

  faqs.forEach((faq) => {
    const count = categoryMap.get(faq.category) || 0
    categoryMap.set(faq.category, count + 1)
  })

  const categories: FAQCategory[] = [{ key: 'all', name: 'All Questions', count: faqs.length }]

  const categoryNames: Record<string, string> = {
    documents: 'Documents and Application',
    exams: 'Exams and Testing',
    admission: 'Admission Process',
    scholarships: 'Scholarships and Financial Aid',
    languages: 'Language Requirements',
  }

  Array.from(categoryMap.entries()).forEach(([key, count]) => {
    if (categoryNames[key]) {
      categories.push({
        key,
        name: categoryNames[key],
        count,
      })
    }
  })

  return categories
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
  }

  if (!data.education?.level?.trim()) {
    errors.push('Education level is required')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
