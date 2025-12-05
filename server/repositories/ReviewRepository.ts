import type { Prisma, PrismaClient, UserType } from '@prisma/client'
import type { Review, ReviewQueryParams } from '~~/server/types/api'
import { normalizeLocale, asRecord, type NormalizedLocale } from '~~/server/utils/locale'

const INCLUDE = {
  translations: true,
  university: { include: { translations: true } },
} satisfies Prisma.UniversityReviewInclude

type DbReview = Prisma.UniversityReviewGetPayload<{ include: typeof INCLUDE }>

const DEFAULT_LOCALE = 'ru'

export class ReviewRepository {
  constructor(private prisma: PrismaClient) {}

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
        include: INCLUDE,
        orderBy: [{ featured: 'desc' }, { rating: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.universityReview.count({ where }),
    ])

    return { data: reviews.map((r) => this.toReview(r, loc)), total }
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
      include: INCLUDE,
      orderBy: { createdAt: 'desc' },
    })

    return reviews.map((r) => this.toMediaReview(r, loc))
  }

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
    const { translations, achievements, name, quote, ...rest } = data

    const review = await this.prisma.universityReview.create({
      data: {
        ...rest,
        translations: {
          create: translations.map((t) => ({
            locale: t.locale,
            name: t.name ?? name,
            quote: t.quote ?? quote,
            universityName: t.universityName,
            ...(t.achievements ?? (t.locale === DEFAULT_LOCALE ? achievements : null)
              ? { achievements: t.achievements ?? achievements }
              : {}),
          })),
        },
      },
      include: INCLUDE,
    })

    return this.toReview(review, normalizeLocale(DEFAULT_LOCALE))
  }

  private pick<T extends { locale: string | null }>(list: T[], loc: NormalizedLocale): T | undefined {
    return list.find((t) => t.locale === loc.normalized) ?? list.find((t) => t.locale === DEFAULT_LOCALE) ?? list[0]
  }

  private toReview(r: DbReview, loc: NormalizedLocale): Review {
    const t = this.pick(r.translations, loc)
    const u = this.pick(r.university?.translations ?? [], loc)
    return {
      id: r.id,
      type: r.type as UserType,
      name: t?.name ?? '',
      university: t?.universityName ?? u?.title ?? undefined,
      year: r.year ?? undefined,
      quote: t?.quote ?? '',
      rating: r.rating ?? 5,
      avatar: r.avatar ?? '',
      featured: r.featured,
      achievements: this.parseAchievements(t?.achievements),
    }
  }

  private toMediaReview(r: DbReview, loc: NormalizedLocale) {
    const t = this.pick(r.translations, loc)
    const u = this.pick(r.university?.translations ?? [], loc)
    return {
      id: r.id,
      type: r.type,
      mediaType: r.mediaType,
      name: t?.name ?? '',
      quote: t?.quote ?? '',
      university: u?.title ?? t?.universityName ?? '',
      rating: r.rating,
      year: r.year,
      avatar: r.avatar,
      videoUrl: r.videoUrl,
      videoThumb: r.videoThumb,
      videoDuration: r.videoDuration,
      imageUrl: r.imageUrl,
    }
  }

  private parseAchievements(val: Prisma.JsonValue | null | undefined): Review['achievements'] {
    const raw = asRecord(val)
    if (!raw) return undefined

    const str = (k: string) => (typeof raw[k] === 'string' && raw[k].trim() ? raw[k].trim() : undefined)
    const num = (k: string) => (typeof raw[k] === 'number' ? raw[k] : undefined)
    const arr = Array.isArray(raw.helpful_aspects)
      ? raw.helpful_aspects.filter((x): x is string => typeof x === 'string')
      : undefined

    const result: NonNullable<Review['achievements']> = {
      ...(num('yos_score') !== undefined && { yos_score: num('yos_score') }),
      ...(num('scholarship_percentage') !== undefined && { scholarship_percentage: num('scholarship_percentage') }),
      ...(num('sat_score') !== undefined && { sat_score: num('sat_score') }),
      ...(str('turkish_level') && { turkish_level: str('turkish_level') }),
      ...(str('english_level') && { english_level: str('english_level') }),
      ...(arr?.length && { helpful_aspects: arr }),
      ...(str('recommendation') && { recommendation: str('recommendation') }),
      ...(str('faculty') && { faculty: str('faculty') }),
      ...(str('contact') && { contact: str('contact') }),
    }

    return Object.keys(result).length ? result : undefined
  }
}
