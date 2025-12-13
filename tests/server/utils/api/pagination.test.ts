import { describe, expect, it } from 'vitest'

import { calculatePagination } from '~~/server/utils/api/pagination'

describe('calculatePagination', () => {
  it('calculates total pages when there are results', () => {
    const meta = calculatePagination(42, 2, 10)

    expect(meta).toEqual({
      total: 42,
      page: 2,
      limit: 10,
      totalPages: 5,
    })
  })

  it('returns zero total pages when total is 0', () => {
    const meta = calculatePagination(0, 1, 10)

    expect(meta).toEqual({
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    })
  })
})

