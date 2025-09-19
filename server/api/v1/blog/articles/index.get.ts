import { prisma } from '../../../../../lib/prisma'
import { BlogRepository } from '../../../../repositories'
import { calculatePagination } from '../../../../utils/api-helpers'
import type { BlogArticlesResponse } from '../../../../types/api'

export default defineEventHandler(async (event): Promise<BlogArticlesResponse> => {
  const locale = event.context.locale || 'ru'
  const query = getQuery(event)

  const page = query.page ? Number(query.page) : 1
  const limit = query.limit ? Number(query.limit) : 6
  const category = typeof query.category === 'string' ? query.category : undefined
  const search = typeof query.q === 'string' ? query.q : undefined

  try {
    const repository = new BlogRepository(prisma)
    const result = await repository.findArticles({ page, limit, category, q: search }, locale)

    return {
      data: result.articles,
      meta: calculatePagination(result.total, page, limit),
      featured: result.featured,
      categories: result.categories,
      popular: result.popular,
    }
  } catch (error) {
    console.error('Error fetching blog articles:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch blog articles',
    })
  }
})
