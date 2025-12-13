import { getUniversityRepository } from '~~/server/repositories'
import { calculatePagination } from '~~/server/utils/api/pagination'
import { UniversityQueryParamsSchema } from '~~/lib/schemas'
import type { UniversityListResponse } from '~~/lib/types'

export default defineEventHandler(async (event): Promise<UniversityListResponse> => {
  const locale = event.context.locale || 'ru'
  const params = UniversityQueryParamsSchema.parse(getQuery(event))
  const result = await getUniversityRepository().findAll(params, locale)

  return {
    data: result.data,
    meta: calculatePagination(result.total, params.page, params.limit),
  }
})

