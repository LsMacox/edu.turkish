import { getDirectionRepository } from '~~/server/repositories/factory'
import { calculatePagination } from '~~/server/utils/api/pagination'
import { normalizeLocale } from '~~/server/utils/locale'
import type { DirectionResponse, DirectionQueryParams } from '~~/server/types/api'

export default defineEventHandler(async (event): Promise<DirectionResponse> => {
  const locale = event.context.locale || 'ru'
  const query = getQuery(event) as Partial<DirectionQueryParams>

  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.max(1, Math.min(1000, Number(query.limit) || 100))
  const search = (query.q || '').toString().trim() || undefined

  const { data, total } = await getDirectionRepository().findAll(
    normalizeLocale(query.lang || locale),
    { search, page, limit },
  )

  return {
    data,
    meta: calculatePagination(total, page, limit),
  }
})
