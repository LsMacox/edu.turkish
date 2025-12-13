import { ZodError } from 'zod'
import { prisma } from '~~/lib/infrastructure/prisma'
import { getReviewRepository } from '~~/server/repositories'
import type { CreateReviewResponse } from '~~/lib/types'
import { SUPPORTED_LOCALES } from '~~/lib/config/locales'
import { parsePositiveInt } from '~~/lib/utils/number'
import { formatZodError } from '~~/server/utils/validation'
import { CreateReviewRequestSchema } from '~~/lib/schemas'
import type { ReviewCreate } from '~~/lib/schemas/review'

export default defineEventHandler(async (event): Promise<CreateReviewResponse> => {
  assertMethod(event, 'POST')

  const locale = event.context.locale || 'ru'
  const translationLocale = SUPPORTED_LOCALES.includes(locale) ? locale : 'ru'
  const rawBody = await readBody(event)

  let data: ReturnType<typeof CreateReviewRequestSchema.parse>
  try {
    data = CreateReviewRequestSchema.parse(rawBody)
  } catch (error) {
    if (error instanceof ZodError) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Validation failed',
        data: formatZodError(error),
      })
    }
    throw error
  }

  const reviewRepository = getReviewRepository()

  let universityId: number | undefined
  const titleSearch = { contains: data.university }

  const localizedTranslation = await prisma.universityTranslation.findFirst({
    where: { locale, title: titleSearch },
    select: { universityId: true },
  })

  const fallbackTranslation = localizedTranslation
    ? null
    : await prisma.universityTranslation.findFirst({
      where: { title: titleSearch },
      select: { universityId: true },
    })

  const matchedTranslation = localizedTranslation ?? fallbackTranslation
  if (matchedTranslation) {
    universityId = matchedTranslation.universityId
  }

  const translations = [{
    locale: translationLocale,
    name: data.name,
    quote: data.review,
    universityName: data.university,
  }]

  const achievements = {
    ...(data.helpfulAspects?.length ? { helpful_aspects: data.helpfulAspects } : {}),
    ...(data.recommendation ? { recommendation: data.recommendation } : {}),
    ...(data.faculty ? { faculty: data.faculty } : {}),
    ...(data.contact ? { contact: data.contact } : {}),
  }

  const parsedYear = data.year && /^\d{4}$/.test(data.year)
    ? parsePositiveInt(data.year)
    : undefined

  const review = await reviewRepository.create({
    type: data.type ?? 'student',
    name: data.name,
    universityId,
    year: parsedYear,
    quote: data.review,
    rating: data.rating,
    featured: false,
    achievements: Object.keys(achievements).length > 0 ? achievements as ReviewCreate['achievements'] : undefined,
    translations,
  })

  return {
    success: true,
    id: review.id,
    message: 'Review submitted successfully',
  }
})

