import { prisma } from '~~/lib/prisma'
import { BlogRepository } from '~~/server/repositories'
import type { BlogCategory } from '~~/server/types/api'

interface ProgramCategoriesResponse {
  data: BlogCategory[]
}

export default defineEventHandler(async (event): Promise<ProgramCategoriesResponse> => {
  const query = getQuery(event)

  const queryLocale = typeof query.lang === 'string' ? query.lang.trim() : ''
  const contextLocale = typeof event.context?.locale === 'string' ? event.context.locale : undefined
  const locale = queryLocale || contextLocale || 'ru'

  try {
    const repository = new BlogRepository(prisma)
    const data = await repository.getProgramCategories(locale)

    return { data }
  } catch (error) {
    console.error('Error fetching program categories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch program categories',
    })
  }
})
