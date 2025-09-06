import { PrismaClient } from '@prisma/client'
import type { FAQItem, FAQQueryParams, FAQCategory } from '../types/api'

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

  private buildTranslationWhere(fallbacks: string[], q?: string) {
    const where: any = { locale: { in: fallbacks } }
    if (q) {
      where.OR = [
        { question: { contains: q } },
        { answer: { contains: q } }
      ]
    }
    return where
  }

  private buildIncludes(fallbacks: string[]) {
    return ({
      translations: { where: { locale: { in: fallbacks } } },
      category: { include: { translations: { where: { locale: { in: fallbacks } } } } }
    } as any)
  }

  private pickTranslation<T extends { locale: string }>(translations: T[], normalized: string): T | undefined {
    return (
      translations.find(t => t.locale === normalized) ||
      translations.find(t => t.locale === 'ru') ||
      translations[0]
    )
  }

  private pickCategoryName(category: any, normalized: string): string {
    const trans: Array<{ locale: string; name: string }> = category?.translations || []
    return (
      trans.find(t => t.locale === normalized)?.name ||
      trans.find(t => t.locale === 'ru')?.name ||
      trans[0]?.name ||
      ''
    )
  }

  private mapFaqItemToApi(faq: any, normalized: string, q?: string): FAQItem {
    const translation = this.pickTranslation(faq.translations || [], normalized) as any
    const categoryName = this.pickCategoryName((faq as any).category, normalized)

    let relevanceScore: number | undefined
    if (q && translation) {
      const searchTerm = q.toLowerCase()
      const questionScore = translation?.question?.toLowerCase().includes(searchTerm) ? 1 : 0
      const answerScore = translation?.answer?.toLowerCase().includes(searchTerm) ? 0.5 : 0
      relevanceScore = questionScore + answerScore
    }

    return {
      id: faq.id,
      question: translation?.question || '',
      answer: translation?.answer || '',
      category: categoryName,
      featured: faq.featured,
      order: 0,
      relevance_score: relevanceScore
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
    const where: any = {}

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

    // Execute queries
    const [faqs, filteredCount] = await this.prisma.$transaction([
      this.prisma.faqItem.findMany({
        where: {
          ...where,
          ...(q ? { translations: { some: translationWhere } } : {})
        },
        include: this.buildIncludes(fallbacks),
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
    const categoriesRaw = await (this.prisma as any).faqCategory.findMany({
      include: {
        translations: { where: { locale: { in: fallbacks } } },
        _count: { select: { items: true } }
      }
    })

    const categories: FAQCategory[] = categoriesRaw.map((cat: any) => ({
      key: String(cat.id),
      name: this.pickCategoryName(cat, normalized) || String(cat.id),
      count: cat._count?.items || 0
    }))

    // Transform to API format
    const transformedFAQs: FAQItem[] = faqs.map(faq => this.mapFaqItemToApi(faq, normalized, q))

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

    return this.mapFaqItemToApi(faq, normalized)
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

    return faqs.map(faq => this.mapFaqItemToApi(faq, normalized))
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
      .map(faq => this.mapFaqItemToApi(faq, normalized, query))
      .sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0))
  }

  /**
   * Get FAQ categories
   */
  async getCategories(locale: string = 'ru'): Promise<FAQCategory[]> {
    const { normalized, fallbacks } = this.normalizeLocale(locale)
    const categories = await (this.prisma as any).faqCategory.findMany({
      include: {
        translations: { where: { locale: { in: fallbacks } } },
        _count: { select: { items: true } }
      }
    })

    return categories.map((cat: any) => ({
      key: String(cat.id),
      name: this.pickCategoryName(cat, normalized) || String(cat.id),
      count: cat._count?.items || 0
    }))
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

    const faq = await this.prisma.faqItem.create({
      data: ({
        featured: Boolean(featured),
        categoryId: categoryId ?? null,
        translations: { create: translations }
      } as any),
      include: ({
        translations: { where: { locale: { in: ['ru'] } } },
        category: { include: { translations: { where: { locale: { in: ['ru'] } } } } }
      } as any)
    })

    const translation = faq.translations[0]
    const categoryName = (faq as any).category?.translations?.[0]?.name || ''

    return {
      id: faq.id,
      question: translation?.question || '',
      answer: translation?.answer || '',
      category: categoryName,
      featured: faq.featured,
      order: 0
    }
  }
}