import { describe, expect, it } from 'vitest'

import { calculatePagination } from '~~/server/utils/api/pagination'

describe('calculatePagination', () => {
  it('guards against NaN and zero division', () => {
    const meta = calculatePagination(Number.NaN, Number.NaN, Number.NaN)

    expect(meta).toEqual({
      total: 0,
      page: 1,
      limit: 1,
      totalPages: 0,
    })
  })

  it('calculates total pages when there are results', () => {
    const meta = calculatePagination(42, 2, 10)

    expect(meta).toEqual({
      total: 42,
      page: 2,
      limit: 10,
      totalPages: 5,
    })
  })
})
