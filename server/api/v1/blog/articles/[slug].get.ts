import { getBlogRepository } from '~~/server/repositories'
import type { BlogArticleDetail } from '~~/server/types/api'

export default defineEventHandler(async (event): Promise<{ data: BlogArticleDetail }> => {
  const locale = event.context.locale || 'ru'
  const slug = event.context.params?.slug

  if (!slug || typeof slug !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Article slug is required' })
  }

  const article = await getBlogRepository().findBySlug(slug, locale)

  if (!article) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  return { data: article }
})
