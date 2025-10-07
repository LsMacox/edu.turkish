import { prisma } from '~~/lib/prisma'
import { UniversityRepository } from '~~/server/repositories'
import { calculatePagination } from '~~/server/utils/api/pagination'
import { parseUniversityFilters } from '~~/server/utils/api/universities'
import type { UniversityResponse } from '~~/server/types/api'

export default defineEventHandler(async (event): Promise<UniversityResponse> => {
  try {
    const locale = event.context.locale || 'ru'
    const query = getQuery(event)
    const filters = parseUniversityFilters(query)

    // Initialize repository
    const universityRepository = new UniversityRepository(prisma)

    // Get universities from database
    const result = await universityRepository.findAll(filters, locale)

    return {
      data: result.data,
      meta: calculatePagination(result.total, filters.page ?? 1, filters.limit ?? 6),
      filters: result.filters,
    }
  } catch (error) {
    console.error('Error fetching universities:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch universities',
    })
  }
})
