import type { Prisma, PrismaClient } from '@prisma/client'
import type { FAQCategory, FAQItem, FAQQueryParams, FAQResponse } from '~~/server/types/api'
import { normalizeLocale, pickTranslation } from '~~/server/utils/locale'

type WithRelevance<T> = T & { _relevance?: number }

type FaqWithRelations = Prisma.FaqGetPayload<{
  include: { translations: true; category: { include: { translations: true } } }
}>

type CategoryWithRelations = Prisma.FaqCategoryGetPayload<{
  include: { translations: true; _count: { select: { items: true } } }
}>

export class FAQRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(params: FAQQueryParams, locale: string = 'ru'): Promise<FAQResponse> {
    const { normalized, fallbacks } = normalizeLocale(locale)
    const { q, category, featured, limit = 50 } = params

    const where: Prisma.FaqWhereInput = {}
    if (category && category !== 'all') {
      const id = Number(category)
      if (!Number.isNaN(id) && id > 0) where.categoryId = id
    }
    if (featured) where.featured = true

    const translationFilter: Prisma.FaqTranslationWhereInput = { locale: { in: fallbacks } }
    if (q) translationFilter.OR = [{ question: { contains: q } }, { answer: { contains: q } }]

    const fullWhere: Prisma.FaqWhereInput = {
      ...where,
      ...(q ? { translations: { some: translationFilter } } : {}),
    }

    const [faqs, count, categories] = await this.prisma.$transaction([
      this.prisma.faq.findMany({
        where: fullWhere,
        include: {
          translations: { where: { locale: { in: fallbacks } } },
          category: { include: { translations: { where: { locale: { in: fallbacks } } } } },
        },
        orderBy: [{ featured: 'desc' }, { createdAt: 'asc' }],
        take: limit,
      }),
      this.prisma.faq.count({ where: fullWhere }),
      this.prisma.faqCategory.findMany({
        include: {
          translations: { where: { locale: { in: fallbacks } } },
          _count: { select: { items: true } },
        },
      }),
    ])

    const mapped = faqs.map((faq) => this.mapItem(faq, normalized, q))
    if (q) mapped.sort((a, b) => (b._relevance ?? 0) - (a._relevance ?? 0))

    return {
      data: mapped.map(({ _relevance, ...item }) => item),
      categories: categories.map((c) => this.mapCategory(c, normalized)),
      meta: { count, query: q || null },
    }
  }

  private mapItem(faq: FaqWithRelations, locale: string, q?: string): WithRelevance<FAQItem> {
    const t = pickTranslation(faq.translations, locale)
    const catT = faq.category ? pickTranslation(faq.category.translations, locale) : undefined

    let _relevance: number | undefined
    if (q && t) {
      const term = q.toLowerCase()
      const score = (t.question?.toLowerCase().includes(term) ? 1 : 0) +
                    (t.answer?.toLowerCase().includes(term) ? 0.5 : 0)
      if (score > 0) _relevance = score
    }

    return {
      id: faq.id,
      question: t?.question || '',
      answer: t?.answer || '',
      category: catT?.name || '',
      _relevance,
    }
  }

  private mapCategory(cat: CategoryWithRelations, locale: string): FAQCategory {
    const t = pickTranslation(cat.translations, locale)
    return {
      key: String(cat.id),
      name: t?.name || String(cat.id),
      count: cat._count?.items ?? 0,
    }
  }
}
