import { describe, expect, it } from 'vitest'

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

  it('normalizes media type regardless of casing', () => {
    const filters = parseReviewFilters({
      mediaType: 'Video',
    })

    expect(filters.mediaType).toBe('video')
  })
})
