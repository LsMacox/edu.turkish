import { getBlogRepository, getFAQRepository } from '~~/server/repositories'
import { calculatePagination } from '~~/server/utils/api/pagination'
import { BlogArticleQueryParamsSchema } from '~~/lib/schemas'
import type { BlogArticlesResponse } from '~~/lib/types'

export default defineEventHandler(async (event): Promise<BlogArticlesResponse> => {
  const params = BlogArticleQueryParamsSchema.parse(getQuery(event))
  const locale = params.lang?.trim() || event.context?.locale || 'ru'

  const result = await getBlogRepository().findArticles(
    { page: params.page, limit: params.limit, category: params.category, q: params.q, lang: params.lang },
    locale,
  )

  const faqResult = await getFAQRepository().findAll({ limit: 1 }, locale)

  return {
    data: result.articles,
    meta: calculatePagination(result.total, params.page, params.limit),
    featured: result.featured,
    categories: result.categories,
    popular: result.popular,
    totalArticles: result.total,
    totalFAQs: faqResult.meta.count,
  }
})

