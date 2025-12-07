import { getUniversityRepository } from '~~/server/repositories'
import type { UniversityDetail } from '~~/server/types/api'

export default defineEventHandler(async (event): Promise<UniversityDetail> => {
  const locale = event.context.locale || 'ru'
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'University ID is required' })
  }

  const repo = getUniversityRepository()

  // Try by numeric ID first, then by slug
  const university = !isNaN(Number(id))
    ? ((await repo.findById(Number(id), locale)) ?? (await repo.findBySlug(id, locale)))
    : await repo.findBySlug(id, locale)

  if (!university) {
    throw createError({ statusCode: 404, statusMessage: 'University not found' })
  }

  return university
})
