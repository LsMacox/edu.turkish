import type { Prisma, PrismaClient, UserType } from '@prisma/client'
import type { Review, ReviewQueryParams } from '~~/lib/types'
import { normalizeLocale } from '~~/server/utils/locale'
import { ReviewCreateSchema, type ReviewCreate } from '~~/lib/schemas/review'
import {
  reviewInclude,
  reviewIncludeAll,
  mapReview,
  mapMediaReview,
  type ReviewWithRelations,
} from '~~/server/mappers/review'

const DEFAULT_LOCALE = 'ru'

export class ReviewRepository {
  constructor(private prisma: PrismaClient) { }

  async findAll(
    params: ReviewQueryParams,
    locale = DEFAULT_LOCALE,
  ): Promise<{ data: Review[]; total: number }> {
    const loc = normalizeLocale(locale)
    const { type, featured, mediaType, page = 1, limit = 10 } = params

    const where: Prisma.UniversityReviewWhereInput = {
      ...(type && type !== 'all' && { type }),
      ...(featured && { featured: true }),
      ...(mediaType && { mediaType }),
    }

    const [reviews, total] = await this.prisma.$transaction([
      this.prisma.universityReview.findMany({
        where,
        include: reviewInclude(loc.normalized),
        orderBy: [{ featured: 'desc' }, { rating: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.universityReview.count({ where }),
    ])

    return { data: reviews.map((r) => mapReview(r as ReviewWithRelations, loc)), total }
  }

  async getMediaReviews(options: {
    featured?: boolean
    limit?: number
    mediaType?: 'video' | 'image'
    locale: string
  }) {
    const { featured = true, limit = 12, mediaType, locale } = options
    const loc = normalizeLocale(locale)

    const reviews = await this.prisma.universityReview.findMany({
      where: { featured, mediaType: mediaType ?? { in: ['video', 'image'] } },
      take: limit,
      include: reviewInclude(loc.normalized),
      orderBy: { createdAt: 'desc' },
    })

    return reviews.map((r) => mapMediaReview(r as ReviewWithRelations, loc))
  }

  async create(data: ReviewCreate): Promise<Review> {
    const validated = ReviewCreateSchema.parse(data)
    const { translations, achievements, name, quote, universityId, type, ...rest } = validated

    const review = await this.prisma.universityReview.create({
      data: {
        ...rest,
        type: type as UserType,
        ...(universityId ? { university: { connect: { id: universityId } } } : {}),
        translations: {
          create: translations.map((t) => ({
            locale: t.locale,
            name: t.name ?? name,
            quote: t.quote ?? quote,
            universityName: t.universityName,
            ...((t.achievements ?? (t.locale === DEFAULT_LOCALE ? achievements : null))
              ? { achievements: t.achievements ?? achievements }
              : {}),
          })),
        },
      },
      include: reviewIncludeAll,
    })

    return mapReview(review, normalizeLocale(DEFAULT_LOCALE))
  }

}
