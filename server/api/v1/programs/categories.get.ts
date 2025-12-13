import { getBlogRepository } from '~~/server/repositories'
import type { BlogCategory } from '~~/lib/types'

export default defineEventHandler(async (event): Promise<{ data: BlogCategory[] }> => {
  const query = getQuery(event)
  const queryLocale = typeof query.lang === 'string' ? query.lang.trim() : ''
  const locale = queryLocale || event.context?.locale || 'ru'

  const data = await getBlogRepository().getProgramCategories(locale)
  return { data }
})
