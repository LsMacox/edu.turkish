import type { Prisma, PrismaClient } from '@prisma/client'
import type { z } from 'zod'
import type { FaqResponse } from '~~/lib/types'
import { normalizeLocale } from '~~/server/utils/locale'
import { FaqQueryParamsSchema } from '~~/lib/schemas/faq'
import {
  mapFaqItem,
  mapFaqCategory,
  type FaqCategoryWithRelations,
} from '~~/server/mappers/faq'

type FaqQueryParamsInput = z.input<typeof FaqQueryParamsSchema>

export class FAQRepository {
  constructor(private prisma: PrismaClient) { }

  async findAll(params: FaqQueryParamsInput, locale: string = 'ru'): Promise<FaqResponse> {
    const validated = FaqQueryParamsSchema.parse(params)
    const { normalized, fallbacks } = normalizeLocale(locale)
    const { q, category, featured, limit = 50 } = validated

    const where: Prisma.FaqWhereInput = {}
    if (category && category !== 'all') {
      where.category = { key: category }
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

    const mapped = faqs.map((faq) => mapFaqItem(faq, normalized, q))
    if (q) mapped.sort((a, b) => (b._relevance ?? 0) - (a._relevance ?? 0))

    return {
      data: mapped.map(({ _relevance, ...item }) => item),
      categories: categories.map((c) => mapFaqCategory(c as FaqCategoryWithRelations, normalized)),
      meta: { count, query: q || null },
    }
  }
}
