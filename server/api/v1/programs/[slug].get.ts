import { getBlogRepository } from '~~/server/repositories'
import type { ProgramDetailResponse } from '~~/server/types/api'

export default defineEventHandler(async (event): Promise<ProgramDetailResponse> => {
  const locale = event.context.locale || 'ru'
  const slug = event.context.params?.slug

  if (!slug || typeof slug !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Program slug is required' })
  }

  const program = await getBlogRepository().findProgramBySlug(slug, locale)

  if (!program) {
    throw createError({ statusCode: 404, statusMessage: 'Program not found' })
  }

  return { data: program }
})
