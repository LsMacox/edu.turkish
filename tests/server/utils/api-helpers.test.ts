import { describe, expect, it } from 'vitest'

import { calculatePagination } from '~~/server/utils/api/pagination'
import { parseFAQFilters } from '~~/server/utils/api/faq'
import { parseReviewFilters } from '~~/server/utils/api/reviews'

describe('parseReviewFilters', () => {
  it('returns defaults for invalid pagination values', () => {
    const filters = parseReviewFilters({
      page: '0',
      limit: '-5',
      type: ['student'],
      featured: 'true',
    })

    expect(filters).toEqual({
      type: 'all',
      featured: true,
      page: 1,
      limit: 50,
    })
  })
})

describe('parseFAQFilters', () => {
  it('uses default limit when query contains non numeric value', () => {
    const filters = parseFAQFilters({
      q: 'visa',
      category: 'documents',
      limit: 'page',
    })

    expect(filters.limit).toBe(50)
  })
})

describe('calculatePagination', () => {
  it('guards against NaN and zero division', () => {
    const meta = calculatePagination(Number.NaN, Number.NaN, Number.NaN)

    expect(meta).toEqual({
      total: 0,
      page: 1,
      limit: 1,
      totalPages: 1,
    })
  })
})
