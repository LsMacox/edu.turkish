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
    const q = (query.q || '').toString().trim().toLowerCase()

    const repo = new UniversityRepository(prisma)
    const all = await repo.getAllDirections(query.lang || locale)

    const filtered = q
      ? all.filter(d => (d.name || '').toLowerCase().includes(q))
      : all

    const start = (page - 1) * limit
    const data = filtered.slice(start, start + limit)

    return {
      data,
      meta: calculatePagination(filtered.length, page, limit)
    }
  } catch (error) {
    console.error('Error fetching directions:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch directions'
    })
  }
})


