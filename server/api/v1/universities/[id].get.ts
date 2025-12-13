import { getUniversityRepository } from '~~/server/repositories'
import type { UniversityDetail } from '~~/lib/types'

export default defineEventHandler(async (event): Promise<UniversityDetail> => {
  const locale = event.context.locale || 'ru'
  const idOrSlug = getRouterParam(event, 'id')

  if (!idOrSlug) {
    throw createError({ statusCode: 400, statusMessage: 'University ID or slug is required' })
  }

  const university = await getUniversityRepository().findByIdOrSlug(idOrSlug, locale)

  if (!university) {
    throw createError({ statusCode: 404, statusMessage: 'University not found' })
  }

  return university
})
