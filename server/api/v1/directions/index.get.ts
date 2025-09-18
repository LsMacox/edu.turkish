import { prisma } from '../../../../lib/prisma'
import { UniversityRepository } from '../../../repositories'
import { calculatePagination } from '../../../utils/api-helpers'
import type { DirectionResponse, DirectionQueryParams } from '../../../types/api'

export default defineEventHandler(async (event): Promise<DirectionResponse> => {
  try {
    const locale = event.context.locale || 'ru'
    const query = getQuery(event) as Partial<DirectionQueryParams>

    const page = Math.max(1, Number(query.page) || 1)
    const limit = Math.max(1, Math.min(1000, Number(query.limit) || 100))
    const search = (query.q || '').toString().trim()
    const searchTerm = search.length > 0 ? search : undefined

    const repo = new UniversityRepository(prisma)
    const { data, total } = await repo.getAllDirections(query.lang || locale, {
      search: searchTerm,
      page,
      limit
    })

    return {
      data,
      meta: calculatePagination(total, page, limit)
    }
  } catch (error) {
    console.error('Error fetching directions:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch directions'
    })
  }
})


