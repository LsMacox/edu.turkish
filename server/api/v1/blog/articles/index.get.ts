import { prisma } from '~~/lib/prisma'
import { BlogRepository, FAQRepository } from '~~/server/repositories'
import { calculatePagination } from '~~/server/utils/api/pagination'
import type { BlogArticlesResponse } from '~~/server/types/api'

export default defineEventHandler(async (event): Promise<BlogArticlesResponse> => {
  const query = getQuery(event)

  const page = query.page ? Number(query.page) : 1
  const limit = query.limit ? Number(query.limit) : 6
  const category = typeof query.category === 'string' ? query.category : undefined
  const search = typeof query.q === 'string' ? query.q : undefined
  const queryLocale = typeof query.lang === 'string' ? query.lang.trim() : ''
  const contextLocale = typeof event.context?.locale === 'string' ? event.context.locale : undefined
  const locale = queryLocale || contextLocale || 'ru'

  try {
    const repository = new BlogRepository(prisma)
    const result = await repository.findArticles(
      { page, limit, category, q: search, lang: queryLocale || undefined },
      locale,
    )

    const faqRepository = new FAQRepository(prisma)
    const faqResult = await faqRepository.findAll({ limit: 1 }, locale)
    const totalFAQs = faqResult.meta.count

    return {
      data: result.articles,
      meta: calculatePagination(result.total, page, limit),
      featured: result.featured,
      categories: result.categories,
      popular: result.popular,
      totalArticles: result.total,
      totalFAQs,
    }
  } catch (error) {
    console.error('Error fetching blog articles:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch blog articles',
    })
  }
})
