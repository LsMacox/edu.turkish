import { prisma } from '~~/lib/prisma'
import { ServiceRepository } from '~~/server/repositories/ServiceRepository'
import { SUPPORTED_LOCALES, type SupportedLocale } from '~~/lib/locales'

export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    // Get slug from route params
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Slug parameter is required',
      })
    }

    // Get locale from query params, default to 'en'
    const query = getQuery(event)
    const locale = (query.locale as string) || 'en'

    // Validate locale
    if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid locale',
        message: `Locale must be one of: ${SUPPORTED_LOCALES.join(', ')}`,
      })
    }

    // Get category from repository
    const repository = new ServiceRepository(prisma)
    const category = await repository.findCategoryBySlug(slug, locale as SupportedLocale)

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: `Service category '${slug}' does not exist`,
      })
    }

    // Performance monitoring
    const duration = Date.now() - startTime
    if (duration > 100) {
      console.warn(`[PERF] Slow query: GET /api/v1/services/${slug} took ${duration}ms`)
    }

    // Add response time header
    setHeader(event, 'X-Response-Time', `${duration}ms`)

    return {
      category,
    }
  } catch (error) {
    // Re-throw HTTP errors
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Log unexpected errors
    console.error('Failed to fetch service category:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
      message: 'Failed to fetch category',
    })
  }
})
