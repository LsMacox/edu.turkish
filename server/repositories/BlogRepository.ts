import type { PrismaClient, Prisma } from '@prisma/client'
import type {
  BlogArticleDetail,
  BlogArticleListItem,
  BlogArticleQueryParams,
  BlogCategory,
  BlogArticleContentBlock,
  BlogPopularArticle,
  BlogArticleQuickFact,
} from '../types/api'

type ArticleWithRelations = Prisma.BlogArticleGetPayload<{
  include: {
    translations: true
    category: {
      include: {
        translations: true
      }
    }
  }
}>

type ArticleTranslation = ArticleWithRelations['translations'][number]

export class BlogRepository {
  constructor(private prisma: PrismaClient) {}

  private pickTranslation<T extends { locale: string }>(
    translations: T[],
    locale: string,
  ): T | null {
    if (!translations || translations.length === 0) {
      return null
    }

    const exact = translations.find((translation) => translation.locale === locale)
    if (exact) {
      return exact
    }

    const russian = translations.find((translation) => translation.locale === 'ru')
    if (russian) {
      return russian
    }

    return translations[0]
  }

  private resolveLocaleTag(locale: string): string {
    switch (locale) {
      case 'en':
        return 'en-GB'
      case 'kk':
      case 'kz':
        return 'kk-KZ'
      case 'tr':
        return 'tr-TR'
      case 'ru':
      default:
        return 'ru-RU'
    }
  }

  private formatDate(date: Date, locale: string): string {
    try {
      const formatter = new Intl.DateTimeFormat(this.resolveLocaleTag(locale), {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })

      const parts = formatter.formatToParts(date)
      return parts
        .map((part) => part.value)
        .join('')
        .replace(/\s+/g, ' ')
        .replace(', ', ' ')
        .trim()
    } catch (error) {
      console.warn('[BlogRepository] Failed to format date', error)
      return date.toISOString().split('T')[0]
    }
  }

  private formatReadingTime(
    minutes: number | null | undefined,
    locale: string,
  ): string | undefined {
    if (!minutes || minutes <= 0) {
      return undefined
    }

    const safeMinutes = Math.round(minutes)

    switch (locale) {
      case 'en':
        return `${safeMinutes} min read`
      case 'kk':
      case 'kz':
        return `${safeMinutes} мин оқу`
      case 'tr':
        return `${safeMinutes} dk okuma`
      case 'ru':
      default:
        return `${safeMinutes} мин чтения`
    }
  }

  private normalizeContent(
    content: Prisma.JsonValue | null | undefined,
  ): BlogArticleContentBlock[] {
    if (!content || !Array.isArray(content)) {
      return []
    }

    const blocks: BlogArticleContentBlock[] = []

    for (const rawBlock of content as any[]) {
      if (!rawBlock || typeof rawBlock !== 'object') {
        continue
      }

      const type = String(rawBlock.type || '')
      switch (type) {
        case 'heading': {
          const level = Number(rawBlock.level) || 2
          const text = String(rawBlock.text || '')
          if (text) {
            blocks.push({ type: 'heading', level, text })
          }
          break
        }
        case 'paragraph': {
          const text = String(rawBlock.text || '')
          if (text) {
            blocks.push({ type: 'paragraph', text })
          }
          break
        }
        case 'list': {
          const items = Array.isArray(rawBlock.items)
            ? rawBlock.items.map((item: any) => String(item)).filter((item: string) => !!item)
            : []
          if (items.length > 0) {
            blocks.push({ type: 'list', ordered: Boolean(rawBlock.ordered), items })
          }
          break
        }
        case 'quote': {
          const text = String(rawBlock.text || '')
          if (text) {
            const author = rawBlock.author ? String(rawBlock.author) : undefined
            blocks.push({ type: 'quote', text, author })
          }
          break
        }
        case 'image': {
          const url = String(rawBlock.url || '')
          const alt = String(rawBlock.alt || '')
          if (url) {
            const caption = rawBlock.caption ? String(rawBlock.caption) : undefined
            blocks.push({ type: 'image', url, alt, caption })
          }
          break
        }
        default:
          break
      }
    }

    return blocks
  }

  private mapArticleToListItem(article: ArticleWithRelations, locale: string): BlogArticleListItem {
    const translation = this.pickTranslation(article.translations, locale)
    const categoryTranslation = this.pickTranslation(article.category.translations, locale)

    return {
      id: article.id,
      slug: translation?.slug ?? String(article.id),
      title: translation?.title ?? '',
      excerpt: translation?.excerpt ?? '',
      image: article.coverImage ?? null,
      imageAlt: translation?.imageAlt ?? translation?.title ?? undefined,
      publishedAt: article.publishedAt.toISOString(),
      publishedAtLabel: this.formatDate(article.publishedAt, locale),
      readingTimeMinutes: article.readingTimeMinutes ?? undefined,
      readingTimeLabel:
        translation?.readingTime ?? this.formatReadingTime(article.readingTimeMinutes, locale),
      category: {
        key: article.category.code,
        label: categoryTranslation?.title ?? article.category.code,
      },
    }
  }

  private extractViewCount(meta: Prisma.JsonValue | null | undefined): number {
    if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
      return 0
    }

    const record = meta as Record<string, unknown>
    const rawValue = record.views ?? record.viewCount ?? record.reads

    if (typeof rawValue === 'number' && Number.isFinite(rawValue)) {
      return Math.max(0, Math.round(rawValue))
    }

    if (typeof rawValue === 'string') {
      const digits = rawValue.replace(/[^\d]/g, '')
      if (digits) {
        const parsed = Number.parseInt(digits, 10)
        if (Number.isFinite(parsed)) {
          return Math.max(0, parsed)
        }
      }
    }

    return 0
  }

  private formatViewCount(count: number, locale: string): string {
    const normalizedCount = Math.max(0, Math.round(count))
    const formatter = new Intl.NumberFormat(this.resolveLocaleTag(locale))
    const formattedCount = formatter.format(normalizedCount)

    switch (locale) {
      case 'en':
        return `${formattedCount} views`
      case 'kk':
      case 'kz':
        return `${formattedCount} қаралым`
      case 'tr':
        return `${formattedCount} görüntülenme`
      case 'ru':
      default:
        return `${formattedCount} просмотров`
    }
  }

  private mapArticleToPopularItem(
    article: ArticleWithRelations,
    locale: string,
  ): BlogPopularArticle {
    const base = this.mapArticleToListItem(article, locale)
    const viewCount = this.extractViewCount(article.meta)

    return {
      id: base.id,
      slug: base.slug,
      title: base.title,
      publishedAt: base.publishedAt,
      publishedAtLabel: base.publishedAtLabel,
      viewCount,
      viewCountLabel: this.formatViewCount(viewCount, locale),
    }
  }

  private mapArticleToDetail(article: ArticleWithRelations, locale: string): BlogArticleDetail {
    const base = this.mapArticleToListItem(article, locale)
    const translation = this.pickTranslation(article.translations, locale)
    const meta = this.parseArticleMeta(article.meta, translation)

    return {
      ...base,
      heroImage: article.heroImage ?? base.image,
      heroImageAlt: translation?.heroImageAlt ?? base.imageAlt,
      heroKicker: translation?.heroKicker ?? undefined,
      heroSubtitle: translation?.heroSubtitle ?? translation?.excerpt ?? undefined,
      heroLocation: translation?.heroLocation ?? undefined,
      seoDescription: translation?.seoDescription ?? undefined,
      content: this.normalizeContent(translation?.content),
      quickFacts: meta.quickFacts,
      highlights: meta.highlights,
      tags: meta.tags,
    }
  }

  private parseQuickFactsValue(value: unknown): BlogArticleQuickFact[] {
    if (!Array.isArray(value)) {
      return []
    }

    return (value as Array<Record<string, unknown>>)
      .map((fact): BlogArticleQuickFact | null => {
        if (!fact || typeof fact !== 'object') {
          return null
        }

        const title = typeof fact.title === 'string' ? fact.title.trim() : ''
        const factValue = typeof fact.value === 'string' ? fact.value.trim() : ''
        const icon = typeof fact.icon === 'string' ? fact.icon.trim() : undefined

        if (!title || !factValue) {
          return null
        }

        return { title, value: factValue, icon }
      })
      .filter((fact): fact is BlogArticleQuickFact => fact !== null)
  }

  private parseStringArrayValue(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return []
    }

    return (value as unknown[])
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item): item is string => item.length > 0)
  }

  private parseArticleMeta(
    meta: Prisma.JsonValue | null | undefined,
    translation?: ArticleTranslation | null,
  ): {
    quickFacts: BlogArticleQuickFact[]
    highlights: string[]
    tags: string[]
  } {
    let record: Record<string, unknown> = {}

    if (meta && typeof meta === 'object' && !Array.isArray(meta)) {
      record = meta as Record<string, unknown>
    }

    const baseQuickFacts = this.parseQuickFactsValue(record.quickFacts)
    const baseHighlights = this.parseStringArrayValue(record.highlights)
    const baseTags = this.parseStringArrayValue(record.tags)

    const translationQuickFacts = this.parseQuickFactsValue(translation?.quickFacts ?? null)
    const translationHighlights = this.parseStringArrayValue(translation?.highlights ?? null)
    const translationTags = this.parseStringArrayValue(translation?.tags ?? null)

    return {
      quickFacts: translationQuickFacts.length > 0 ? translationQuickFacts : baseQuickFacts,
      highlights: translationHighlights.length > 0 ? translationHighlights : baseHighlights,
      tags: translationTags.length > 0 ? translationTags : baseTags,
    }
  }

  async getCategories(locale: string): Promise<BlogCategory[]> {
    const rows = await this.prisma.blogCategory.findMany({
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
      include: {
        translations: true,
      },
    })

    return rows.map((row) => {
      const translation = this.pickTranslation(row.translations, locale)
      return {
        key: row.code,
        label: translation?.title ?? row.code,
      }
    })
  }

  async findArticles(
    params: BlogArticleQueryParams,
    locale: string,
  ): Promise<{
    articles: BlogArticleListItem[]
    total: number
    featured: BlogArticleListItem | null
    categories: BlogCategory[]
    popular: BlogPopularArticle[]
  }> {
    const page = Math.max(Number(params.page) || 1, 1)
    const limit = Math.max(Number(params.limit) || 6, 1)
    const categoryFilter =
      params.category && params.category !== 'all' ? String(params.category) : null
    const searchQuery = params.q?.trim() ?? ''

    const baseWhere: Prisma.BlogArticleWhereInput = {
      status: 'published',
      publishedAt: {
        lte: new Date(),
      },
    }

    if (categoryFilter) {
      baseWhere.category = {
        code: categoryFilter,
      }
    }

    if (searchQuery) {
      const searchCondition: Prisma.BlogArticleWhereInput = {
        OR: [
          {
            translations: {
              some: {
                locale,
                OR: [{ title: { contains: searchQuery } }, { excerpt: { contains: searchQuery } }],
              },
            },
          },
          {
            translations: {
              some: {
                locale: 'ru',
                OR: [{ title: { contains: searchQuery } }, { excerpt: { contains: searchQuery } }],
              },
            },
          },
        ],
      }

      baseWhere.AND = Array.isArray(baseWhere.AND)
        ? [...baseWhere.AND, searchCondition]
        : [searchCondition]
    }

    let featured: ArticleWithRelations | null = null
    const shouldSelectFeatured = page === 1 && !searchQuery

    if (shouldSelectFeatured) {
      featured = await this.prisma.blogArticle.findFirst({
        where: {
          ...baseWhere,
          isFeatured: true,
        },
        orderBy: {
          publishedAt: 'desc',
        },
        include: {
          translations: true,
          category: {
            include: {
              translations: true,
            },
          },
        },
      })

      if (featured && categoryFilter && featured.category.code !== categoryFilter) {
        featured = null
      }
    }

    const listWhere: Prisma.BlogArticleWhereInput = {
      ...baseWhere,
    }

    if (featured) {
      listWhere.id = {
        not: featured.id,
      }
    }

    const [total, rows, categories, potentialPopular] = await this.prisma.$transaction([
      this.prisma.blogArticle.count({ where: listWhere }),
      this.prisma.blogArticle.findMany({
        where: listWhere,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          translations: true,
          category: {
            include: {
              translations: true,
            },
          },
        },
      }),
      this.prisma.blogCategory.findMany({
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
        include: { translations: true },
      }),
      this.prisma.blogArticle.findMany({
        where: baseWhere,
        orderBy: { publishedAt: 'desc' },
        take: Math.max(limit * 2, 12),
        include: {
          translations: true,
          category: {
            include: {
              translations: true,
            },
          },
        },
      }),
    ])

    const mappedArticles = rows.map((row) => this.mapArticleToListItem(row, locale))
    let mappedFeatured = featured ? this.mapArticleToListItem(featured, locale) : null
    if (mappedFeatured && featured) {
      const translation = this.pickTranslation(featured.translations, locale)
      const heroImg = featured.heroImage ?? featured.coverImage ?? null
      const heroAlt =
        translation?.heroImageAlt ?? translation?.imageAlt ?? translation?.title ?? undefined
      mappedFeatured = { ...mappedFeatured, image: heroImg, imageAlt: heroAlt }
    }
    const mappedCategories = categories.map((category) => {
      const translation = this.pickTranslation(category.translations, locale)
      return {
        key: category.code,
        label: translation?.title ?? category.code,
      }
    })

    const popularCandidates = potentialPopular
      .map((article) => ({
        article,
        views: this.extractViewCount(article.meta),
      }))
      .sort((a, b) => {
        if (b.views !== a.views) {
          return b.views - a.views
        }
        return b.article.publishedAt.getTime() - a.article.publishedAt.getTime()
      })

    const seenPopularIds = new Set<number>()
    const mappedPopular: BlogPopularArticle[] = []

    for (const candidate of popularCandidates) {
      if (seenPopularIds.has(candidate.article.id)) {
        continue
      }

      seenPopularIds.add(candidate.article.id)
      mappedPopular.push(this.mapArticleToPopularItem(candidate.article, locale))

      if (mappedPopular.length >= 4) {
        break
      }
    }

    return {
      articles: mappedArticles,
      total,
      featured: mappedFeatured,
      categories: mappedCategories,
      popular: mappedPopular,
    }
  }

  async findBySlug(slug: string, locale: string): Promise<BlogArticleDetail | null> {
    const primary = await this.prisma.blogArticleTranslation.findFirst({
      where: {
        slug,
        locale,
      },
      include: {
        article: {
          include: {
            translations: true,
            category: {
              include: {
                translations: true,
              },
            },
          },
        },
      },
    })

    let article = primary?.article ?? null

    if (!article) {
      const fallback = await this.prisma.blogArticleTranslation.findFirst({
        where: { slug },
        include: {
          article: {
            include: {
              translations: true,
              category: {
                include: {
                  translations: true,
                },
              },
            },
          },
        },
      })

      article = fallback?.article ?? null
    }

    if (!article || article.status !== 'published' || article.publishedAt > new Date()) {
      return null
    }

    return this.mapArticleToDetail(article, locale)
  }
}
