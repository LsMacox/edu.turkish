import { prisma } from '../../../../lib/prisma'
import { FAQRepository } from '../../../repositories'
import type { FAQResponse } from '../../../types/api'

export default defineEventHandler(async (event): Promise<FAQResponse> => {
  try {
    // Locale is normalized in i18n middleware (maps 'kz' -> 'kk') and stored on context
    const locale = (event.context && event.context.locale) || 'ru'
    const query = getQuery(event)
    
    // Parse query parameters
    const params = {
      q: query.q as string,
      // category is categoryId now
      category: query.category as string,
      featured: query.featured === 'true',
      limit: query.limit ? Number(query.limit) : undefined
    }
    
    // Initialize repository
    const faqRepository = new FAQRepository(prisma)
    
    // Get FAQs from database
    const result = await faqRepository.findAll(params, locale)
    
    return result
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch FAQs'
    })
  }
})