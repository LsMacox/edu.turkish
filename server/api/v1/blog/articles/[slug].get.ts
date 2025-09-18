import { prisma } from '../../../../../lib/prisma'
import { BlogRepository } from '../../../../repositories'
import type { BlogArticleDetail } from '../../../../types/api'

export default defineEventHandler(async (event): Promise<{ data: BlogArticleDetail }> => {
  const locale = event.context.locale || 'ru'
  const slugParam = event.context.params?.slug

  if (!slugParam || typeof slugParam !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Article slug is required'
    })
  }

  try {
    const repository = new BlogRepository(prisma)
    const article = await repository.findBySlug(slugParam, locale)

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      })
    }

    return { data: article }
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    console.error('Error fetching blog article detail:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch article'
    })
  }
})

