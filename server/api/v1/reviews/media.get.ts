import { prisma } from '~~/lib/prisma'
import { ReviewRepository } from '~~/server/repositories/ReviewRepository'
import type { LocaleKey } from '~~/server/utils/locale'
import { parsePositiveInt } from '~~/lib/number'

export default defineEventHandler(async (event: any) => {
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
      limit: parsePositiveInt(limit as string) ?? 12,
      mediaType: type as 'video' | 'image' | undefined,
      locale: lang as LocaleKey,
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
