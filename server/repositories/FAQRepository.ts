import { Prisma, PrismaClient } from '@prisma/client'
import type { FAQItem, FAQQueryParams, FAQCategory } from '../types/api'
import { mapFaqCategoryToApi, mapFaqItemToApi } from './faqMapper'

export class FAQRepository {
  constructor(private prisma: PrismaClient) {}

  private normalizeLocale(input?: string): { normalized: string; fallbacks: string[] } {
    const base = (input || 'ru').toLowerCase()
    const raw = base.split('-')[0]
    // Normalize URL/code 'kz' to stored locale 'kk'
    const normalized = raw === 'kz' ? 'kk' : raw
    // Include both 'kk' and 'kz' in fallbacks to support legacy records
    const kkVariants = normalized === 'kk' ? ['kk', 'kz'] : (normalized === 'kz' ? ['kk', 'kz'] : [normalized])
    const fallbacks = Array.from(new Set([...kkVariants, 'ru']))
    return { normalized: normalized === 'kz' ? 'kk' : normalized, fallbacks }
  }

  // ===== Helper utilities to reduce duplication =====

  private buildTranslationWhere(fallbacks: string[], q?: string): Prisma.FaqTranslationWhereInput {
    const where: Prisma.FaqTranslationWhereInput = { locale: { in: fallbacks } }
    if (q) {
      where.OR = [
        { question: { contains: q } },
        { answer: { contains: q } }
      ]
    }
    return where
  }

  private buildIncludes(fallbacks: string[]): Prisma.FaqItemInclude {
    return {
      translations: { where: { locale: { in: fallbacks } } },
      category: { include: { translations: { where: { locale: { in: fallbacks } } } } }
    }
  }

  private buildCategoryInclude(fallbacks: string[]): Prisma.FaqCategoryInclude {
    return {
      translations: { where: { locale: { in: fallbacks } } },
      _count: { select: { items: true } }
    }
  }

  /**
   * Find all FAQs with filtering and search
   */
  async findAll(params: FAQQueryParams, locale: string = 'ru'): Promise<{
    data: FAQItem[]
    categories: FAQCategory[]
    meta: {
      total: number
      filtered: number
      query?: string | null
    }
  }> {
    const { normalized, fallbacks } = this.normalizeLocale(locale)
    const { q, category, featured, limit = 50 } = params

    // Build where clause for FAQ items
    const where: Prisma.FaqItemWhereInput = {}

    // Interpret category as categoryId
    if (category && String(category).trim().length > 0) {
      const categoryId = Number(category)
      if (!Number.isNaN(categoryId) && categoryId > 0) {
        where.categoryId = categoryId
      }
    }

    if (featured) {
      where.featured = true
    }

    // Build where clause for translations (for search)
    const translationWhere = this.buildTranslationWhere(fallbacks, q)
    const include = this.buildIncludes(fallbacks)

    // Execute queries
    const [faqs, filteredCount] = await this.prisma.$transaction([
      this.prisma.faqItem.findMany({
        where: {
          ...where,
          ...(q ? { translations: { some: translationWhere } } : {})
        },
        include,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'asc' }
        ],
        take: limit
      }),
      this.prisma.faqItem.count({
        where: {
          ...where,
          ...(q ? { translations: { some: translationWhere } } : {})
        }
      })
    ])

    // Get categories list with counts
    const categoriesRaw = await this.prisma.faqCategory.findMany({
      include: this.buildCategoryInclude(fallbacks)
    })

    const categories: FAQCategory[] = categoriesRaw.map(cat => mapFaqCategoryToApi(cat, normalized))

    // Transform to API format
    const transformedFAQs: FAQItem[] = faqs.map(faq => mapFaqItemToApi(faq, normalized, q))

    // Sort by relevance if searching
    if (q) {
      transformedFAQs.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0))
    }

    const totalFAQs = await this.prisma.faqItem.count()

    return {
      data: transformedFAQs,
      categories,
      meta: {
        total: totalFAQs,
        filtered: filteredCount,
        query: q || null
      }
    }
  }

  /**
   * Find FAQ by ID
   */
  async findById(id: number, locale: string = 'ru'): Promise<FAQItem | null> {
    const { normalized, fallbacks } = this.normalizeLocale(locale)
    const faq = await this.prisma.faqItem.findUnique({
      where: { id },
      include: this.buildIncludes(fallbacks)
    })

    if (!faq) return null

    return mapFaqItemToApi(faq, normalized)
  }

  /**
   * Find featured FAQs
   */
  async findFeatured(locale: string = 'ru', limit: number = 10): Promise<FAQItem[]> {
    const { normalized, fallbacks } = this.normalizeLocale(locale)
    const faqs = await this.prisma.faqItem.findMany({
      where: { featured: true },
      include: this.buildIncludes(fallbacks),
      orderBy: [
        { createdAt: 'asc' }
      ],
      take: limit
    })

    return faqs.map(faq => mapFaqItemToApi(faq, normalized))
  }

  /**
   * Search FAQs by query
   */
  async search(query: string, locale: string = 'ru', limit: number = 20): Promise<FAQItem[]> {
    const { normalized, fallbacks } = this.normalizeLocale(locale)
    const faqs = await this.prisma.faqItem.findMany({
      where: {
        translations: {
          some: this.buildTranslationWhere(fallbacks, query)
        }
      },
      include: this.buildIncludes(fallbacks),
      take: limit
    })

    return faqs
      .map(faq => mapFaqItemToApi(faq, normalized, query))
      .sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0))
  }

  /**
   * Get FAQ categories
   */
  async getCategories(locale: string = 'ru'): Promise<FAQCategory[]> {
    const { normalized, fallbacks } = this.normalizeLocale(locale)
    const categories = await this.prisma.faqCategory.findMany({
      include: this.buildCategoryInclude(fallbacks)
    })

    return categories.map(cat => mapFaqCategoryToApi(cat, normalized))
  }

  /**
   * Create a new FAQ
   */
  async create(data: {
    categoryId?: number
    featured?: boolean
    translations: Array<{
      locale: string
      question: string
      answer: string
    }>
  }): Promise<FAQItem> {
    const { translations, categoryId, featured } = data
    const { normalized, fallbacks } = this.normalizeLocale('ru')

    const faq = await this.prisma.faqItem.create({
      data: {
        featured: Boolean(featured),
        categoryId: categoryId ?? null,
        translations: { create: translations }
      },
      include: this.buildIncludes(fallbacks)
    })

    return mapFaqItemToApi(faq, normalized)
  }
}
