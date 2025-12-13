import { getReviewRepository } from '~~/server/repositories'
import { calculatePagination } from '~~/server/utils/api/pagination'
import { ReviewQueryParamsSchema } from '~~/lib/schemas'
import type { ReviewResponse } from '~~/lib/types'

export default defineEventHandler(async (event): Promise<ReviewResponse> => {
  const query = getQuery(event)
  const filters = ReviewQueryParamsSchema.parse(query)
  const contextLocale = typeof event.context?.locale === 'string' ? event.context.locale : undefined
  const locale = filters.lang?.trim() || contextLocale || 'ru'

  const result = await getReviewRepository().findAll(filters, locale)

  return {
    data: result.data,
    meta: calculatePagination(result.total, filters.page, filters.limit),
  }
})

