import { describe, expect, it } from 'vitest'

import { calculatePagination } from '~~/server/utils/api/pagination'

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
