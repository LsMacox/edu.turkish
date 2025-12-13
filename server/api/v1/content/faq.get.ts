import { getFAQRepository } from '~~/server/repositories'
import type { FaqResponse } from '~~/lib/types'
import { FaqQueryParamsSchema } from '~~/lib/schemas'

export default defineEventHandler(async (event): Promise<FaqResponse> => {
  const params = FaqQueryParamsSchema.parse(getQuery(event))
  const locale = params.lang?.trim() || event.context?.locale || 'ru'
  return getFAQRepository().findAll(params, locale)
})

