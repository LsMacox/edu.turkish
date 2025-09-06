import { PrismaClient } from '@prisma/client'
import type { Review, ReviewQueryParams } from '../types/api'
import type { UserType } from '../../app/types/domain'

export class ReviewRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Find all reviews with filtering and pagination
   */
  async findAll(params: ReviewQueryParams, locale: string = 'ru'): Promise<{
    data: Review[]
    total: number
  }> {
    const {
      type,
      featured,
      page = 1,
      limit = 10
    } = params

    // Build where clause
    const where: any = {}

    if (type && type !== 'all') {
      where.type = type
    }

    if (featured) {
      where.featured = true
    }

    // Execute queries
    const [reviews, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        include: {
          translations: {
            where: { locale }
          },
          university: {
            include: {
              translations: {
                where: { locale }
              }
            }
          }
        },
        orderBy: [
          { featured: 'desc' },
          { rating: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.review.count({ where })
    ])

    // Transform to API format
    const transformedReviews: Review[] = reviews.map(review => {
      const translation = review.translations[0]
      const universityTranslation = review.university?.translations[0]

      return {
        id: review.id,
        type: review.type as UserType,
        name: translation?.name || review.name || '',
        university: translation?.universityName || universityTranslation?.title || review.university?.title,
        year: review.year ?? undefined,
        quote: translation?.quote || review.quote || '',
        rating: review.rating || 5,
        avatar: review.avatar || '',
        featured: review.featured,
        achievements: review.achievements as any || undefined
      }
    })

    return {
      data: transformedReviews,
      total
    }
  }

  /**
   * Get review statistics
   */
  async getStatistics(): Promise<{
    total_students: number
    average_rating: number
    success_rate: number
    universities_count: number
    scholarships_provided: number
    cities_covered: number
    languages_supported: number
    specialties_available: number
  }> {
    const [
      reviewStats,
      universityCount,
      distinctCityGroups,
      programCount,
      scholarshipsCount,
      applicationsTotal,
      applicationsApproved,
      distinctTranslationLocales
    ] = await this.prisma.$transaction([
      this.prisma.review.aggregate({
        _count: { id: true },
        _avg: { rating: true }
      }),
      this.prisma.university.count(),
      (this.prisma as any).university.groupBy({
        by: ['cityId'],
        where: { cityId: { not: null } }
      }),
      this.prisma.academicProgram.count(),
      // Scholarships available in the system
      (this.prisma as any).scholarship.count(),
      // Applications stats for success rate
      this.prisma.application.count(),
      this.prisma.application.count({ where: { status: 'approved' as any } }),
      // Determine supported languages by distinct locales present in translations across entities
      this.prisma.$queryRawUnsafe<{ locale: string }[]>(
        `SELECT DISTINCT locale FROM (
            SELECT locale FROM university_translations
          UNION ALL
            SELECT locale FROM program_translations
          UNION ALL
            SELECT locale FROM review_translations
          UNION ALL
            SELECT locale FROM faq_translations
        ) t WHERE locale IS NOT NULL`
      )
    ])

    const approvedCount = applicationsApproved || 0
    const successRate = applicationsTotal > 0 ? Math.round((approvedCount / applicationsTotal) * 100) : 0
    const avgRating = reviewStats._avg.rating === null ? 0 : Number(reviewStats._avg.rating.toFixed(1))

    return {
      total_students: reviewStats._count.id,
      average_rating: avgRating,
      success_rate: successRate,
      universities_count: universityCount,
      scholarships_provided: scholarshipsCount,
      cities_covered: (distinctCityGroups as any[]).length,
      languages_supported: distinctTranslationLocales.length,
      specialties_available: programCount
    }
  }

  /**
   * Find featured reviews
   */
  async findFeatured(locale: string = 'ru', limit: number = 3): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({
      where: { featured: true },
      include: {
        translations: {
          where: { locale }
        },
        university: {
          include: {
            translations: {
              where: { locale }
            }
          }
        }
      },
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    })

    return reviews.map(review => {
      const translation = review.translations[0]
      const universityTranslation = review.university?.translations[0]

      return {
        id: review.id,
        type: review.type as UserType,
        name: translation?.name || review.name || '',
        university: translation?.universityName || universityTranslation?.title || review.university?.title,
        year: review.year ?? undefined,
        quote: translation?.quote || review.quote || '',
        rating: review.rating || 5,
        avatar: review.avatar || '',
        featured: review.featured,
        achievements: review.achievements as any || undefined
      }
    })
  }

  /**
   * Create a new review
   */
  async create(data: {
    type: UserType
    name: string
    universityId?: number
    year?: number
    quote: string
    rating: number
    avatar?: string
    featured?: boolean
    achievements?: any
    translations: Array<{
      locale: string
      name: string
      quote: string
      universityName?: string
    }>
  }): Promise<Review> {
    const { translations, ...reviewData } = data

    const review = await this.prisma.review.create({
      data: {
        ...reviewData,
        translations: {
          create: translations
        }
      },
      include: {
        translations: true,
        university: {
          include: {
            translations: true
          }
        }
      }
    })

    // Return the review in the expected format
    const translation = review.translations.find(t => t.locale === 'ru') || review.translations[0]
    const universityTranslation = review.university?.translations.find(t => t.locale === 'ru') || review.university?.translations[0]

    return {
      id: review.id,
      type: review.type as UserType,
      name: translation?.name || review.name || '',
      university: translation?.universityName || universityTranslation?.title || review.university?.title,
      year: review.year ?? undefined,
      quote: translation?.quote || review.quote || '',
      rating: review.rating || 5,
      avatar: review.avatar || '',
      featured: review.featured,
      achievements: review.achievements as any || undefined
    }
  }
}