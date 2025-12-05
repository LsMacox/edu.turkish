import { prisma } from '~~/lib/prisma'
import { StatisticsRepository } from '~~/server/repositories'
import type { ReviewStatistics } from '~~/server/types/api'

export default defineEventHandler(async (_event): Promise<ReviewStatistics> => {
  try {
    const repo = new StatisticsRepository(prisma)
    return await repo.getStatistics()
  } catch (error) {
    console.error('Error fetching general statistics:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch statistics',
    })
  }
})
