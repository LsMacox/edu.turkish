import { prisma } from '../../../../lib/prisma'
import { FAQRepository } from '../../../repositories'
import type { FAQResponse } from '../../../types/api'
import { parseFAQFilters } from '../../../utils/api-helpers'

export default defineEventHandler(async (event): Promise<FAQResponse> => {
  try {
    const query = getQuery(event)
    const params = parseFAQFilters(query)
    const contextLocale =
      typeof event.context?.locale === 'string' ? event.context.locale : undefined
    const locale = params.lang?.trim() || contextLocale || 'ru'

    const faqRepository = new FAQRepository(prisma)
    const result: FAQResponse = await faqRepository.findAll(params, locale)

    return result
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch FAQs',
    })
  }
})
