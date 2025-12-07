import { getBlogRepository, getFAQRepository } from '~~/server/repositories'
import { calculatePagination } from '~~/server/utils/api/pagination'
import type { BlogArticlesResponse } from '~~/server/types/api'

export default defineEventHandler(async (event): Promise<BlogArticlesResponse> => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 6
  const category = typeof query.category === 'string' ? query.category : undefined
  const search = typeof query.q === 'string' ? query.q : undefined
  const queryLocale = typeof query.lang === 'string' ? query.lang.trim() : ''
  const locale = queryLocale || event.context?.locale || 'ru'

  const result = await getBlogRepository().findArticles(
    { page, limit, category, q: search, lang: queryLocale || undefined },
    locale,
  )

  const faqResult = await getFAQRepository().findAll({ limit: 1 }, locale)

  return {
    data: result.articles,
    meta: calculatePagination(result.total, page, limit),
    featured: result.featured,
    categories: result.categories,
    popular: result.popular,
    totalArticles: result.total,
    totalFAQs: faqResult.meta.count,
  }
})
