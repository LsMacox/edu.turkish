import { ApplicationStatus, Prisma, PrismaClient } from '@prisma/client'
import type { Review, ReviewQueryParams } from '../types/api'
import type { UserType } from '../../app/types/domain'
import { normalizeLocale, type NormalizedLocale } from '../utils/locale'

const REVIEW_INCLUDE = {
  translations: true,
  university: {
    include: {
      translations: true
    }
  }
} satisfies Prisma.ReviewInclude

type ReviewWithRelations = Prisma.ReviewGetPayload<{
  include: typeof REVIEW_INCLUDE
}>

type ReviewAchievements = NonNullable<Review['achievements']>

export class ReviewRepository {
  private static readonly DEFAULT_LOCALE = 'ru'

  constructor(private prisma: PrismaClient) {}

  /**
   * Find all reviews with filtering and pagination
   */
  async findAll(params: ReviewQueryParams, locale: string = ReviewRepository.DEFAULT_LOCALE): Promise<{
    data: Review[]
    total: number
  }> {
    const localeInfo = normalizeLocale(locale)
    const { type, featured, page = 1, limit = 10 } = params

    const where: Prisma.ReviewWhereInput = {}

    if (type && type !== 'all') {
      where.type = type
    }

    if (featured) {
      where.featured = true
    }

    const safePage = Math.max(page, 1)
    const safeLimit = Math.max(limit, 1)

    const [reviews, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        include: REVIEW_INCLUDE,
        orderBy: [
          { featured: 'desc' },
          { rating: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: (safePage - 1) * safeLimit,
        take: safeLimit
      }),
      this.prisma.review.count({ where })
    ])

    return {
      data: reviews.map(review => this.mapReview(review, localeInfo)),
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
      universitiesWithCity,
      programCount,
      scholarshipsCount,
      applicationsTotal,
      applicationsApprovedCount,
      universityLocales,
      programLocales,
      reviewLocales,
      faqLocales
    ] = await this.prisma.$transaction([
      this.prisma.review.aggregate({
        _count: { id: true },
        _avg: { rating: true }
      }),
      this.prisma.university.count(),
      this.prisma.university.findMany({
        where: { cityId: { not: null } },
        select: { cityId: true },
        distinct: ['cityId']
      }),
      this.prisma.academicProgram.count(),
      this.prisma.scholarship.count(),
      this.prisma.application.count(),
      this.prisma.application.count({
        where: { status: ApplicationStatus.approved }
      }),
      this.prisma.universityTranslation.findMany({
        distinct: ['locale'],
        select: { locale: true }
      }),
      this.prisma.programTranslation.findMany({
        distinct: ['locale'],
        select: { locale: true }
      }),
      this.prisma.reviewTranslation.findMany({
        distinct: ['locale'],
        select: { locale: true }
      }),
      this.prisma.faqTranslation.findMany({
        distinct: ['locale'],
        select: { locale: true }
      })
    ])

    const languages = new Set<string>()

    for (const locales of [universityLocales, programLocales, reviewLocales, faqLocales]) {
      for (const { locale } of locales) {
        if (locale) {
          languages.add(locale)
        }
      }
    }

    const approvedCount = applicationsApprovedCount ?? 0
    const successRate = applicationsTotal > 0 ? Math.round((approvedCount / applicationsTotal) * 100) : 0
    const avgRatingRaw = reviewStats._avg.rating
    const avgRating = avgRatingRaw === null ? 0 : Number(avgRatingRaw.toFixed(1))

    return {
      total_students: reviewStats._count.id,
      average_rating: avgRating,
      success_rate: successRate,
      universities_count: universityCount,
      scholarships_provided: scholarshipsCount,
      cities_covered: universitiesWithCity.length,
      languages_supported: languages.size,
      specialties_available: programCount
    }
  }

  /**
   * Find featured reviews
   */
  async findFeatured(locale: string = ReviewRepository.DEFAULT_LOCALE, limit: number = 3): Promise<Review[]> {
    const localeInfo = normalizeLocale(locale)
    const safeLimit = Math.max(limit, 1)

    const reviews = await this.prisma.review.findMany({
      where: { featured: true },
      include: REVIEW_INCLUDE,
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      take: safeLimit
    })

    return reviews.map(review => this.mapReview(review, localeInfo))
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
    achievements?: Review['achievements']
    translations: Array<{
      locale: string
      name?: string
      quote?: string
      universityName?: string
      achievements?: Review['achievements']
    }>
  }): Promise<Review> {
    const {
      translations,
      achievements,
      name,
      quote,
      ...reviewData
    } = data

    const translationPayloads = translations.map(translation => {
      const resolvedAchievements =
        translation.achievements ??
        (translation.locale === ReviewRepository.DEFAULT_LOCALE ? achievements : undefined)

      return {
        locale: translation.locale,
        name: translation.name ?? name,
        quote: translation.quote ?? quote,
        universityName: translation.universityName,
        ...(resolvedAchievements ? { achievements: resolvedAchievements } : {})
      }
    })

    const review = await this.prisma.review.create({
      data: {
        ...reviewData,
        translations: {
          create: translationPayloads
        }
      },
      include: REVIEW_INCLUDE
    })

    return this.mapReview(review, normalizeLocale(ReviewRepository.DEFAULT_LOCALE))
  }

  private mapReview(review: ReviewWithRelations, locale: NormalizedLocale): Review {
    const translations = review.translations ?? []
    const localizedTranslation = this.findTranslation(translations, locale)
    const fallbackLocale = normalizeLocale(ReviewRepository.DEFAULT_LOCALE)
    const fallbackTranslation =
      this.findTranslation(translations, fallbackLocale) ?? translations[0]
    const translation = localizedTranslation ?? fallbackTranslation

    const universityTranslations = review.university?.translations ?? []
    const localizedUniversityTranslation = this.findTranslation(universityTranslations, locale)
    const fallbackUniversityTranslation =
      this.findTranslation(universityTranslations, fallbackLocale) ??
      universityTranslations[0]

    const achievements = this.parseAchievements(
      localizedTranslation?.achievements ?? fallbackTranslation?.achievements
    )

    const universityName =
      translation?.universityName ??
      fallbackTranslation?.universityName ??
      localizedUniversityTranslation?.title ??
      fallbackUniversityTranslation?.title ??
      undefined

    return {
      id: review.id,
      type: review.type as UserType,
      name: translation?.name ?? fallbackTranslation?.name ?? '',
      university: universityName,
      year: review.year ?? undefined,
      quote: translation?.quote ?? fallbackTranslation?.quote ?? '',
      rating: review.rating ?? 5,
      avatar: review.avatar ?? '',
      featured: review.featured,
      achievements
    }
  }

  private findTranslation<T extends { locale: string | null | undefined }>(
    translations: readonly T[] | null | undefined,
    locale: NormalizedLocale
  ): T | undefined {
    if (!translations?.length) {
      return undefined
    }

    const localesToCheck = Array.from(new Set([...locale.fallbacks, 'ru']))

    for (const candidate of localesToCheck) {
      const match = translations.find(translation => translation.locale === candidate)
      if (match) {
        return match
      }
    }

    return undefined
  }

  private parseAchievements(value: Prisma.JsonValue | null | undefined): Review['achievements'] {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return undefined
    }

    const raw = value as Record<string, unknown>
    const achievements: ReviewAchievements = {}

    if (typeof raw.yos_score === 'number') {
      achievements.yos_score = raw.yos_score
    }

    if (typeof raw.scholarship_percentage === 'number') {
      achievements.scholarship_percentage = raw.scholarship_percentage
    }

    if (typeof raw.turkish_level === 'string') {
      achievements.turkish_level = raw.turkish_level
    }

    if (typeof raw.sat_score === 'number') {
      achievements.sat_score = raw.sat_score
    }

    if (typeof raw.english_level === 'string') {
      achievements.english_level = raw.english_level
    }

    if (Array.isArray(raw.helpful_aspects)) {
      const helpfulAspects = raw.helpful_aspects.filter(
        (item): item is string => typeof item === 'string'
      )
      if (helpfulAspects.length > 0) {
        achievements.helpful_aspects = helpfulAspects
      }
    }

    if (typeof raw.recommendation === 'string') {
      achievements.recommendation = raw.recommendation
    }

    return Object.keys(achievements).length > 0 ? achievements : undefined
  }
}