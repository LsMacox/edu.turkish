import { prisma } from '~~/lib/prisma'
import { ReviewRepository } from '~~/server/repositories'
import type { ReviewStatistics } from '~~/server/types/api'

export default defineEventHandler(async (_event): Promise<ReviewStatistics> => {
  try {
    // Initialize repository
    const reviewRepository = new ReviewRepository(prisma)

    // Get comprehensive statistics from database
    const statistics = await reviewRepository.getStatistics()

    return statistics
  } catch (error) {
    console.error('Error fetching general statistics:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch statistics',
    })
  }
})
