import { prisma } from '~~/lib/prisma'
import { ReviewRepository } from '~~/server/repositories/ReviewRepository'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const lang = getHeader(event, 'Accept-Language') || 'ru'

  const {
    featured = 'true',
    limit = '12',
    type, // 'video' | 'image' | undefined (все)
  } = query

  try {
    const repository = new ReviewRepository(prisma)
    const reviews = await repository.getMediaReviews({
      featured: featured === 'true',
      limit: parseInt(limit as string),
      mediaType: type as 'video' | 'image' | undefined,
      locale: lang as string,
    })

    return {
      data: reviews,
      meta: {
        total: reviews.length,
        locale: lang,
      },
    }
  } catch (error) {
    console.error('Error fetching media reviews:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch media reviews',
    })
  }
})
