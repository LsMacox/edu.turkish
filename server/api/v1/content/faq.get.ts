import { getFAQRepository } from '~~/server/repositories'
import type { FAQResponse } from '~~/server/types/api'
import { parseFAQFilters } from '~~/server/utils/api/filters'

export default defineEventHandler(async (event): Promise<FAQResponse> => {
  const params = parseFAQFilters(getQuery(event))
  const locale = params.lang?.trim() || event.context?.locale || 'ru'
  return getFAQRepository().findAll(params, locale)
})
