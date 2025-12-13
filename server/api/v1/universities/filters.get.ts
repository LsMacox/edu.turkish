import { getUniversityRepository } from '~~/server/repositories'
import { normalizeLocale } from '~~/server/utils/locale'
import type { UniversityFilters } from '~~/lib/types'

export default defineEventHandler(async (event): Promise<UniversityFilters> => {
  const locale = normalizeLocale(event.context.locale || 'ru')
  return getUniversityRepository().getFilters(locale)
})
