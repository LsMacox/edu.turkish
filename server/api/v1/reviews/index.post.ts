import { prisma } from '~~/lib/prisma'
import { ReviewRepository } from '~~/server/repositories'
import type { CreateReviewResponse } from '~~/server/types/api'
import { SUPPORTED_LOCALES } from '~~/lib/locales'
import { z } from 'zod'
import { parsePositiveInt } from '~~/lib/number'

// Validation schema
const createReviewSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  university: z.string().min(2, 'University name is required'),
  faculty: z.string().optional(),
  year: z.string().optional(),
  rating: z.coerce.number().min(1).max(5),
  contact: z.string().optional(),
  review: z.string().min(50, 'Review must be at least 50 characters').max(2000, 'Review too long'),
  helpfulAspects: z.array(z.string()).optional(),
  recommendation: z.string().optional(),
  type: z.enum(['student', 'parent']).optional().default('student'),
})

export default defineEventHandler(async (event): Promise<CreateReviewResponse> => {
  try {
    // Only allow POST method
    assertMethod(event, 'POST')

    const locale = event.context.locale || 'ru'
    const translationLocale = SUPPORTED_LOCALES.includes(locale) ? locale : 'ru'
    const body = await readBody(event)

    // Validate request body
    const validationResult = createReviewSchema.safeParse(body)
    if (!validationResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation error',
        data: validationResult.error.issues,
      })
    }

    const data = validationResult.data

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

    // Handle validation errors
    if (err.statusCode === 400) {
      throw err
    }

    // Handle other errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to submit review',
    })
  }
})
