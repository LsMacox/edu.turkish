import type { Prisma } from '@prisma/client'
import type { FaqCategory, FaqApiItem } from '~~/lib/types'
import { pickTranslation } from '~~/server/utils/locale'

// ─────────────────────────────────────────────────────────────────────────────
// Prisma payload types
// ─────────────────────────────────────────────────────────────────────────────

export type FaqWithRelations = Prisma.FaqGetPayload<{
  include: { translations: true; category: { include: { translations: true } } }
}>

export type FaqCategoryWithRelations = Prisma.FaqCategoryGetPayload<{
  include: { translations: true; _count: { select: { items: true } } }
}>

// ─────────────────────────────────────────────────────────────────────────────
// Relevance type for search
// ─────────────────────────────────────────────────────────────────────────────

export type FaqItemWithRelevance = FaqApiItem & { _relevance?: number }

// ─────────────────────────────────────────────────────────────────────────────
// Mappers
// ─────────────────────────────────────────────────────────────────────────────

export function mapFaqItem(
  faq: FaqWithRelations,
  locale: string,
  searchQuery?: string,
): FaqItemWithRelevance {
  const t = pickTranslation(faq.translations, locale)

  let _relevance: number | undefined
  if (searchQuery && t) {
    const term = searchQuery.toLowerCase()
    const score =
      (t.question?.toLowerCase().includes(term) ? 1 : 0) +
      (t.answer?.toLowerCase().includes(term) ? 0.5 : 0)
    if (score > 0) _relevance = score
  }

  return {
    id: faq.id,
    question: t?.question || '',
    answer: t?.answer || '',
    category: faq.category?.key || '',
    _relevance,
  }
}

export function mapFaqCategory(cat: FaqCategoryWithRelations, locale: string): FaqCategory {
  const t = pickTranslation(cat.translations, locale)
  return {
    key: cat.key,
    name: t?.name || cat.key,
    count: cat._count?.items ?? 0,
  }
}
