import { getBlogRepository } from '~~/server/repositories'
import type { ProgramsResponse } from '~~/lib/types'

export default defineEventHandler(async (event): Promise<ProgramsResponse> => {
  const query = getQuery(event)
  const queryLocale = typeof query.lang === 'string' ? query.lang.trim() : ''
  const locale = queryLocale || event.context?.locale || 'ru'

  const data = await getBlogRepository().findProgramsGroupedByCategory(locale)
  return { data }
})
