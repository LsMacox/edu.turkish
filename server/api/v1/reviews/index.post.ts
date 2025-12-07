import { z, ZodError } from 'zod'
import { prisma } from '~~/lib/prisma'
import { getReviewRepository } from '~~/server/repositories'
import type { CreateReviewResponse } from '~~/server/types/api'
import { SUPPORTED_LOCALES } from '~~/lib/locales'
import { parsePositiveInt } from '~~/lib/number'
import { formatZodError } from '~~/server/utils/zod'

const ReviewSchema = z.object({
  name: z.string().min(2, 'min_length').max(100, 'max_length'),
  university: z.string().min(1, 'required').max(200, 'max_length'),
  faculty: z.string().max(200, 'max_length').optional(),
  year: z
    .string()
    .regex(/^\d{4}$/, 'invalid_year')
    .optional()
    .or(z.literal('')),
  rating: z.number().min(1, 'min_value').max(5, 'max_value'),
  contact: z.string().max(200, 'max_length').optional(),
  review: z.string().min(10, 'min_length').max(2000, 'max_length'),
  helpfulAspects: z.array(z.string()).optional(),
  recommendation: z.string().max(500, 'max_length').optional(),
  type: z.enum(['student', 'parent']).optional(),
})

export default defineEventHandler(async (event): Promise<CreateReviewResponse> => {
  try {
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

    const reviewRepository = getReviewRepository()

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

    const translations = [
      {
        locale: translationLocale,
        name: data.name,
        quote: data.review,
        universityName: data.university,
      },
    ]

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

    const parsedYear =
      typeof data.year === 'string' && /^\d{4}$/.test(data.year)
        ? parsePositiveInt(data.year)
        : undefined

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
