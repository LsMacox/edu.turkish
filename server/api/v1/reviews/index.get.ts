import { prisma } from '../../../../lib/prisma'
import { ReviewRepository } from '../../../repositories'
import { parseReviewFilters, calculatePagination } from '../../../utils/api-helpers'
import type { ReviewResponse } from '../../../types/api'

export default defineEventHandler(async (event): Promise<ReviewResponse> => {
  try {
    const locale = event.context.locale || 'ru'
    const query = getQuery(event)
    const filters = parseReviewFilters(query)
    
    // Initialize repository
    const reviewRepository = new ReviewRepository(prisma)
    
    // Get reviews from database
    const result = await reviewRepository.findAll(filters, locale)
    
    return {
      data: result.data,
      meta: calculatePagination(result.total, filters.page, filters.limit)
    }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch reviews'
    })
  }
})