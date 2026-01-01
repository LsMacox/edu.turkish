import type { PrismaClient, Prisma } from '@prisma/client'
import type {
  BlogArticleDetail,
  BlogArticleListItem,
  BlogArticleQueryParams,
  BlogCategory,
  BlogPopularArticle,
  ProgramCategoryWithItems,
  ProgramDetail,
} from '~~/lib/types'
import { pickTranslation } from '~~/server/utils/locale'
import {
  mapArticleToListItem,
  mapArticleToDetail,
  mapArticleToProgramListItem,
  mapArticleToProgramDetail,
  type ArticleWithRelations,
} from '~~/server/mappers/blog'

// Include configuration for article list queries (only needed locale)
const articleListInclude = (locale: string) =>
  ({
    include: {
      translations: { where: { locale } },
      category: { include: { translations: { where: { locale } } } },
    },
  }) as const

// Include configuration for article detail queries (all translations for alternates)
const articleDetailInclude = {
  include: {
    translations: true,
    category: { include: { translations: true } },
  },
} as const

export class BlogRepository {
  constructor(private prisma: PrismaClient) { }

  async getCategories(locale: string, options?: { isProgram?: boolean }): Promise<BlogCategory[]> {
    const where: Prisma.BlogCategoryWhereInput = {}

    if (options?.isProgram !== undefined) {
      where.isProgram = options.isProgram
    }

    const rows = await this.prisma.blogCategory.findMany({
      where,
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
        isProgram: row.isProgram,
      }
    })
  }

  async getProgramCategories(locale: string): Promise<BlogCategory[]> {
    return this.getCategories(locale, { isProgram: true })
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
      isProgram: false,
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
        ...articleListInclude(locale),
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

    const [total, rows, categories, popularRows] = await this.prisma.$transaction([
      this.prisma.blogArticle.count({ where: listWhere }),
      this.prisma.blogArticle.findMany({
        where: listWhere,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        ...articleListInclude(locale),
      }),
      this.prisma.blogCategory.findMany({
        where: { isProgram: false },
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
        include: { translations: true },
      }),
      this.prisma.blogArticle.findMany({
        where: baseWhere,
        orderBy: { publishedAt: 'desc' },
        take: 4,
        select: {
          id: true,
          publishedAt: true,
          translations: { select: { locale: true, slug: true, title: true } },
        },
      }),
    ])

    const mappedArticles = rows.map((row) => mapArticleToListItem(row, locale))
    const mappedFeatured = featured ? mapArticleToListItem(featured, locale) : null
    const mappedCategories = categories.map((cat) => {
      const t = pickTranslation(cat.translations, locale)
      return { key: cat.code, label: t?.title ?? cat.code }
    })

    const mappedPopular = popularRows.map((row) => {
      const t = pickTranslation(row.translations, locale)
      return {
        id: row.id,
        slug: t?.slug ?? String(row.id),
        title: t?.title ?? '',
        publishedAt: row.publishedAt.toISOString(),
      }
    })

    return {
      articles: mappedArticles,
      total,
      featured: mappedFeatured,
      categories: mappedCategories,
      popular: mappedPopular,
    }
  }

  async findBySlug(slug: string, locale: string): Promise<BlogArticleDetail | null> {
    const article = await this.findArticleBySlug(slug, locale)
    return article ? mapArticleToDetail(article, locale) : null
  }

  private async findArticleBySlug(
    slug: string,
    locale: string,
    extraWhere: Prisma.BlogArticleWhereInput = {},
  ): Promise<ArticleWithRelations | null> {
    // Try primary locale first, then fallback to any locale
    const translation =
      (await this.prisma.blogArticleTranslation.findFirst({
        where: { slug, locale, article: extraWhere },
        include: { article: articleDetailInclude },
      })) ??
      (await this.prisma.blogArticleTranslation.findFirst({
        where: { slug, article: extraWhere },
        include: { article: articleDetailInclude },
      }))

    const article = translation?.article
    if (!article || article.status !== 'published' || article.publishedAt > new Date()) {
      return null
    }
    return article
  }

  // ==========================================
  // Programs (isProgram: true articles)
  // ==========================================

  async findProgramsGroupedByCategory(locale: string): Promise<ProgramCategoryWithItems[]> {
    const categories = await this.prisma.blogCategory.findMany({
      where: {
        isProgram: true,
      },
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
      include: {
        translations: { where: { locale } },
        articles: {
          where: {
            isProgram: true,
            status: 'published',
            publishedAt: {
              lte: new Date(),
            },
          },
          orderBy: { publishedAt: 'desc' },
          ...articleListInclude(locale),
        },
      },
    })

    return categories.map((category) => {
      const categoryTranslation = pickTranslation(category.translations, locale)

      return {
        key: category.code,
        label: categoryTranslation?.title ?? category.code,
        programs: category.articles.map((article) => mapArticleToProgramListItem(article, locale)),
      }
    })
  }

  async findProgramBySlug(slug: string, locale: string): Promise<ProgramDetail | null> {
    const article = await this.findArticleBySlug(slug, locale, { isProgram: true })
    return article ? mapArticleToProgramDetail(article, locale) : null
  }
}
