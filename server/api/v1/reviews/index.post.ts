import { ZodError } from 'zod'
import { prisma } from '~~/lib/prisma'
import { ReviewRepository } from '~~/server/repositories'
import type { CreateReviewResponse } from '~~/server/types/api'
import { SUPPORTED_LOCALES } from '~~/lib/locales'
import { parsePositiveInt } from '~~/lib/number'
import { ReviewSchema } from '~~/server/utils/validation/schemas'
import { formatZodError } from '~~/server/utils/validation/formatters'

export default defineEventHandler(async (event): Promise<CreateReviewResponse> => {
  try {
    // Only allow POST method
    assertMethod(event, 'POST')

    const locale = event.context.locale || 'ru'
    const translationLocale = SUPPORTED_LOCALES.includes(locale) ? locale : 'ru'
    const rawBody = await readBody(event)

    let data: any
    try {
      data = ReviewSchema.parse(rawBody)
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = formatZodError(error)
        throw createError({
          statusCode: 422,
          statusMessage: 'Validation failed',
          data: validationError,
        })
      }
      throw error
    }

    // Initialize repository
    const reviewRepository = new ReviewRepository(prisma)

    // Find university by name (case-insensitive search)
    let universityId: number | undefined
    const titleSearch = {
      contains: data.university,
    }

    const localizedTranslation = await prisma.universityTranslation.findFirst({
      where: {
        locale,
        title: titleSearch,
      },
      select: { universityId: true },
    })

    const fallbackTranslation = localizedTranslation
      ? null
      : await prisma.universityTranslation.findFirst({
          where: {
            title: titleSearch,
          },
          select: { universityId: true },
        })

    const matchedTranslation = localizedTranslation ?? fallbackTranslation

    if (matchedTranslation) {
      universityId = matchedTranslation.universityId
    }

    // Prepare review data for all supported locales
    const translations = [
      {
        locale: translationLocale,
        name: data.name,
        quote: data.review,
        universityName: data.university,
      },
    ]

    // Create additional metadata
    const achievements: any = {}
    if (data.helpfulAspects && data.helpfulAspects.length > 0) {
      achievements.helpful_aspects = data.helpfulAspects
    }
    if (data.recommendation) {
      achievements.recommendation = data.recommendation
    }
    if (data.faculty) {
      achievements.faculty = data.faculty
    }
    if (data.contact) {
      achievements.contact = data.contact
    }

    // Normalize year to a valid 4-digit number if provided, otherwise omit
    const parsedYear =
      typeof data.year === 'string' && /^\d{4}$/.test(data.year)
        ? parsePositiveInt(data.year)
        : undefined

    // Create review
    const review = await reviewRepository.create({
      type: data.type,
      name: data.name,
      universityId,
      year: parsedYear,
      quote: data.review,
      rating: data.rating,
      featured: false, // New reviews are not featured by default
      achievements: Object.keys(achievements).length > 0 ? achievements : undefined,
      translations,
    })

    return {
      success: true,
      id: review.id,
      message: 'Review submitted successfully',
    }
  } catch (err: any) {
    console.error('Error creating review:', err)

    if (err.statusCode === 422) {
      throw err
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to submit review',
    })
  }
})
