import { prisma } from '~~/lib/prisma'
import { ProgramRepository } from '~~/server/repositories'
import type { ProgramDetailResponse } from '~~/server/types/api'

export default defineEventHandler(async (event): Promise<ProgramDetailResponse> => {
  const locale = event.context.locale || 'ru'
  const slugParam = event.context.params?.slug

  if (!slugParam || typeof slugParam !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Program slug is required',
    })
  }

  try {
    const repository = new ProgramRepository(prisma)
    const program = await repository.findBySlug(slugParam, locale)

    if (!program) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Program not found',
      })
    }

    return { data: program }
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    console.error('Error fetching program detail:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch program',
    })
  }
})
