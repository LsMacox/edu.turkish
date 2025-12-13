import { getStatisticsRepository } from '~~/server/repositories'
import type { ReviewStatistics } from '~~/lib/types'

export default defineEventHandler(async (_event): Promise<ReviewStatistics> => {
  try {
    const repo = getStatisticsRepository()
    return await repo.getStatistics()
  } catch (error) {
    console.error('Error fetching general statistics:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch statistics',
    })
  }
})
