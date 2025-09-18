import { PrismaClient, Prisma } from '@prisma/client'
import type {
  BlogArticleDetail,
  BlogArticleListItem,
  BlogArticleQueryParams,
  BlogCategory,
  BlogArticleContentBlock
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

export class BlogRepository {
  constructor(private prisma: PrismaClient) {}

  private pickTranslation<T extends { locale: string }>(translations: T[], locale: string): T | null {
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
        year: 'numeric'
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

  private formatReadingTime(minutes: number | null | undefined, locale: string): string | undefined {
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

  private normalizeContent(content: Prisma.JsonValue | null | undefined): BlogArticleContentBlock[] {
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
      readingTimeLabel: translation?.readingTime ?? this.formatReadingTime(article.readingTimeMinutes, locale),
      category: {
        key: article.category.code,
        label: categoryTranslation?.title ?? article.category.code
      }
    }
  }

  private mapArticleToDetail(article: ArticleWithRelations, locale: string): BlogArticleDetail {
    const base = this.mapArticleToListItem(article, locale)
    const translation = this.pickTranslation(article.translations, locale)

    return {
      ...base,
      heroImage: article.heroImage ?? base.image,
      heroImageAlt: translation?.heroImageAlt ?? base.imageAlt,
      heroKicker: translation?.heroKicker ?? undefined,
      heroSubtitle: translation?.heroSubtitle ?? translation?.excerpt ?? undefined,
      heroLocation: translation?.heroLocation ?? undefined,
      seoDescription: translation?.seoDescription ?? undefined,
      content: this.normalizeContent(translation?.content)
    }
  }

  async getCategories(locale: string): Promise<BlogCategory[]> {
    const rows = await this.prisma.blogCategory.findMany({
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
      include: {
        translations: true
      }
    })

    return rows.map((row) => {
      const translation = this.pickTranslation(row.translations, locale)
      return {
        key: row.code,
        label: translation?.title ?? row.code
      }
    })
  }

  async findArticles(params: BlogArticleQueryParams, locale: string): Promise<{
    articles: BlogArticleListItem[]
    total: number
    featured: BlogArticleListItem | null
    categories: BlogCategory[]
  }> {
    const page = Math.max(Number(params.page) || 1, 1)
    const limit = Math.max(Number(params.limit) || 6, 1)
    const categoryFilter = params.category && params.category !== 'all' ? String(params.category) : null
    const searchQuery = params.q?.trim() ?? ''

    const baseWhere: Prisma.BlogArticleWhereInput = {
      status: 'published',
      publishedAt: {
        lte: new Date()
      }
    }

    if (categoryFilter) {
      baseWhere.category = {
        code: categoryFilter
      }
    }

    if (searchQuery) {
      baseWhere.AND = (baseWhere.AND || [])
      baseWhere.AND.push({
        OR: [
          {
            translations: {
              some: {
                locale,
                OR: [
                  { title: { contains: searchQuery } },
                  { excerpt: { contains: searchQuery } }
                ]
              }
            }
          },
          {
            translations: {
              some: {
                locale: 'ru',
                OR: [
                  { title: { contains: searchQuery } },
                  { excerpt: { contains: searchQuery } }
                ]
              }
            }
          }
        ]
      })
    }

    let featured: ArticleWithRelations | null = null
    const shouldSelectFeatured = page === 1 && !searchQuery

    if (shouldSelectFeatured) {
      featured = await this.prisma.blogArticle.findFirst({
        where: {
          ...baseWhere,
          isFeatured: true
        },
        orderBy: {
          publishedAt: 'desc'
        },
        include: {
          translations: true,
          category: {
            include: {
              translations: true
            }
          }
        }
      })

      if (featured && categoryFilter && featured.category.code !== categoryFilter) {
        featured = null
      }
    }

    const listWhere: Prisma.BlogArticleWhereInput = {
      ...baseWhere
    }

    if (featured) {
      listWhere.id = {
        not: featured.id
      }
    }

    const [total, rows, categories] = await this.prisma.$transaction([
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
              translations: true
            }
          }
        }
      }),
      this.prisma.blogCategory.findMany({
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
        include: { translations: true }
      })
    ])

    const mappedArticles = rows.map((row) => this.mapArticleToListItem(row, locale))
    const mappedFeatured = featured ? this.mapArticleToListItem(featured, locale) : null
    const mappedCategories = categories.map((category) => {
      const translation = this.pickTranslation(category.translations, locale)
      return {
        key: category.code,
        label: translation?.title ?? category.code
      }
    })

    return {
      articles: mappedArticles,
      total,
      featured: mappedFeatured,
      categories: mappedCategories
    }
  }

  async findBySlug(slug: string, locale: string): Promise<BlogArticleDetail | null> {
    const primary = await this.prisma.blogArticleTranslation.findFirst({
      where: {
        slug,
        locale
      },
      include: {
        article: {
          include: {
            translations: true,
            category: {
              include: {
                translations: true
              }
            }
          }
        }
      }
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
                  translations: true
                }
              }
            }
          }
        }
      })

      article = fallback?.article ?? null
    }

    if (!article || article.status !== 'published' || article.publishedAt > new Date()) {
      return null
    }

    return this.mapArticleToDetail(article, locale)
  }
}
