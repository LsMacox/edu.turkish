import type { PrismaClient, Prisma } from '@prisma/client'
import type {
  BlogArticleDetail,
  BlogArticleListItem,
  BlogArticleQueryParams,
  BlogCategory,
  BlogArticleContentBlock,
  BlogPopularArticle,
  BlogArticleQuickFact,
} from '~~/server/types/api'
import { pickTranslation, resolveLocaleTag } from '~~/server/utils/locale'
import { sanitizeRichText } from '~~/server/utils/sanitize'

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

  private formatDate(date: Date, locale: string): string {
    try {
      const formatter = new Intl.DateTimeFormat(resolveLocaleTag(locale as any), {
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
      return date.toISOString().split('T')[0]!
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
          const text = sanitizeRichText(String(rawBlock.text || ''))
          if (text) {
            blocks.push({ type: 'heading', level, text })
          }
          break
        }
        case 'paragraph': {
          const text = sanitizeRichText(String(rawBlock.text || ''))
          if (text) {
            blocks.push({ type: 'paragraph', text })
          }
          break
        }
        case 'list': {
          const items = Array.isArray(rawBlock.items)
            ? rawBlock.items
                .map((item: any) => sanitizeRichText(String(item)))
                .filter((item: string) => !!item)
            : []
          if (items.length > 0) {
            const style = ['standard', 'checklist', 'steps'].includes(String(rawBlock.style))
              ? (String(rawBlock.style) as 'standard' | 'checklist' | 'steps')
              : undefined
            blocks.push({ type: 'list', ordered: Boolean(rawBlock.ordered), items, style })
          }
          break
        }
        case 'quote': {
          const text = sanitizeRichText(String(rawBlock.text || ''))
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
            const caption = rawBlock.caption
              ? sanitizeRichText(String(rawBlock.caption))
              : undefined
            const width = ['standard', 'wide', 'full'].includes(String(rawBlock.width))
              ? (String(rawBlock.width) as 'standard' | 'wide' | 'full')
              : undefined
            blocks.push({ type: 'image', url, alt, caption, width })
          }
          break
        }
        case 'spacer': {
          const size = ['sm', 'md', 'lg', 'xl'].includes(String(rawBlock.size))
            ? (String(rawBlock.size) as 'sm' | 'md' | 'lg' | 'xl')
            : 'md'
          blocks.push({ type: 'spacer', size })
          break
        }
        case 'divider': {
          blocks.push({ type: 'divider' })
          break
        }
        case 'faq': {
          const items = Array.isArray(rawBlock.items)
            ? rawBlock.items.map((item: any) => ({
                question: sanitizeRichText(String(item.question || '')),
                answer: sanitizeRichText(String(item.answer || '')),
              }))
            : []
          
          if (items.length > 0) {
            blocks.push({ type: 'faq', items })
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
    const translation = pickTranslation(article.translations, locale)
    const categoryTranslation = pickTranslation(article.category.translations, locale)

    const readingTimeLabel =
      translation?.locale === locale && translation?.readingTime
        ? translation.readingTime
        : undefined

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
      readingTimeLabel,
      category: {
        key: article.category.code,
        label: categoryTranslation?.title ?? article.category.code,
      },
      isPowerPage: article.isPowerPage ?? false,
    }
  }

  private mapArticleToPopularItem(
    article: ArticleWithRelations,
    locale: string,
  ): BlogPopularArticle {
    const base = this.mapArticleToListItem(article, locale)

    return {
      id: base.id,
      slug: base.slug,
      title: base.title,
      publishedAt: base.publishedAt,
      publishedAtLabel: base.publishedAtLabel,
    }
  }

  private mapArticleToDetail(article: ArticleWithRelations, locale: string): BlogArticleDetail {
    const base = this.mapArticleToListItem(article, locale)
    const translation = pickTranslation(article.translations, locale)
    const metadata = this.extractTranslationMetadata(translation)

    const alternates: Record<string, string> = {}
    for (const t of article.translations) {
      if (t.slug && t.locale) {
        alternates[t.locale] = t.slug
      }
    }

    return {
      ...base,
      heroImage: article.heroImage ?? base.image,
      heroImageAlt: translation?.heroImageAlt ?? base.imageAlt,
      heroKicker: translation?.heroKicker ?? undefined,
      heroSubtitle: translation?.heroSubtitle ?? translation?.excerpt ?? undefined,
      heroLocation: translation?.heroLocation ?? undefined,
      seoDescription: translation?.seoDescription ?? undefined,
      content: this.normalizeContent(translation?.content),
      quickFacts: metadata.quickFacts,
      tags: metadata.tags,
      alternates,
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

  private extractTranslationMetadata(translation?: ArticleTranslation | null): {
    quickFacts: BlogArticleQuickFact[]
    tags: string[]
  } {
    return {
      quickFacts: this.parseQuickFactsValue(translation?.quickFacts ?? null),
      tags: this.parseStringArrayValue(translation?.tags ?? null),
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
      const translation = pickTranslation(row.translations, locale)
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
      isPowerPage: false,
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
    const mappedFeatured = featured ? this.mapArticleToListItem(featured, locale) : null
    const mappedCategories = categories.map((category) => {
      const translation = pickTranslation(category.translations, locale)
      return {
        key: category.code,
        label: translation?.title ?? category.code,
      }
    })

    const popularCandidates = potentialPopular.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
    )
    const seenPopularIds = new Set<number>()
    const mappedPopular: BlogPopularArticle[] = []

    for (const article of popularCandidates) {
      if (seenPopularIds.has(article.id)) {
        continue
      }

      seenPopularIds.add(article.id)
      mappedPopular.push(this.mapArticleToPopularItem(article, locale))

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
