import { describe, expect, it } from 'vitest'

import { parseFAQFilters } from '~~/server/utils/api/faq'

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
