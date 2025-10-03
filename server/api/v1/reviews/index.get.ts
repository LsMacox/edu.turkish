import { prisma } from '~~/lib/prisma'
import { ReviewRepository } from '~~/server/repositories'
import { parseReviewFilters, calculatePagination } from '~~/server/utils/api-helpers'
import type { ReviewResponse, ReviewQueryParams } from '~~/server/types/api'

export default defineEventHandler(async (event): Promise<ReviewResponse> => {
  try {
    const query = getQuery(event)
    const filters = parseReviewFilters(query) as ReviewQueryParams
    const contextLocale =
      typeof event.context?.locale === 'string' ? event.context.locale : undefined
    const locale = filters.lang?.trim() || contextLocale || 'ru'

    // Currently using Prisma until Directus collections are mapped (Phase 2)
    const reviewRepository = new ReviewRepository(prisma)
    const result = await reviewRepository.findAll(filters, locale)

    return {
      data: result.data,
      meta: calculatePagination(result.total, filters.page ?? 1, filters.limit ?? 3),
    }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch reviews',
    })
  }
})
