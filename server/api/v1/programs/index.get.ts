import { prisma } from '~~/lib/prisma'
import { ProgramRepository } from '~~/server/repositories'
import type { ProgramsResponse } from '~~/server/types/api'

export default defineEventHandler(async (event): Promise<ProgramsResponse> => {
  const query = getQuery(event)

  const queryLocale = typeof query.lang === 'string' ? query.lang.trim() : ''
  const contextLocale = typeof event.context?.locale === 'string' ? event.context.locale : undefined
  const locale = queryLocale || contextLocale || 'ru'

  try {
    const repository = new ProgramRepository(prisma)
    const data = await repository.findAllGroupedByCategory(locale)

    return { data }
  } catch (error) {
    console.error('Error fetching programs:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch programs',
    })
  }
})
