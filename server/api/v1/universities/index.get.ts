import { getUniversityRepository } from '~~/server/repositories'
import { calculatePagination } from '~~/server/utils/api/pagination'
import { parseUniversityFilters } from '~~/server/utils/api/filters'
import type { UniversityResponse } from '~~/server/types/api'

export default defineEventHandler(async (event): Promise<UniversityResponse> => {
  const locale = event.context.locale || 'ru'
  const filters = parseUniversityFilters(getQuery(event))
  const result = await getUniversityRepository().findAll(filters, locale)

  return {
    data: result.data,
    meta: calculatePagination(result.total, filters.page ?? 1, filters.limit ?? 6),
    filters: result.filters,
  }
})
