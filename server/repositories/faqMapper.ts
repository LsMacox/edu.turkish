import type { Prisma } from '@prisma/client'
import type { FAQCategory, FAQItem } from '../types/api'

export type FaqItemWithLocalizedRelations = Prisma.FaqGetPayload<{
  include: {
    translations: true
    category: {
      include: {
        translations: true
      }
    }
  }
}>

export type FaqCategoryWithLocalizedRelations = Prisma.FaqCategoryGetPayload<{
  include: {
    translations: true
    _count: {
      select: {
        items: true
      }
    }
  }
}>

type TranslationWithLocale = { locale: string }

type FaqTranslation = FaqItemWithLocalizedRelations['translations'][number]
type FaqCategoryTranslation = FaqCategoryWithLocalizedRelations['translations'][number]

type CategoryWithTranslations = FaqItemWithLocalizedRelations['category']

const pickByLocale = <T extends TranslationWithLocale>(
  translations: T[] | undefined,
  normalized: string,
): T | undefined => {
  if (!translations || translations.length === 0) {
    return undefined
  }

  return (
    translations.find((t) => t.locale === normalized) ||
    translations.find((t) => t.locale === 'ru') ||
    translations[0]
  )
}

const resolveCategoryName = (category: CategoryWithTranslations, normalized: string): string => {
  const translation = pickByLocale<FaqCategoryTranslation>(category?.translations, normalized)
  return translation?.name || ''
}

const calculateRelevance = (
  translation: FaqTranslation | undefined,
  q?: string,
): number | undefined => {
  if (!q || !translation) {
    return undefined
  }

  const searchTerm = q.toLowerCase()
  const questionScore = translation.question?.toLowerCase().includes(searchTerm) ? 1 : 0
  const answerScore = translation.answer?.toLowerCase().includes(searchTerm) ? 0.5 : 0

  const score = questionScore + answerScore
  return score > 0 ? score : undefined
}

export const mapFaqItemToApi = (
  faq: FaqItemWithLocalizedRelations,
  normalized: string,
  q?: string,
): FAQItem => {
  const translation = pickByLocale<FaqTranslation>(faq.translations, normalized)
  const categoryName = resolveCategoryName(faq.category, normalized)
  const relevanceScore = calculateRelevance(translation, q)

  return {
    id: faq.id,
    question: translation?.question || '',
    answer: translation?.answer || '',
    category: categoryName,
    featured: faq.featured,
    order: 0,
    relevance_score: relevanceScore,
  }
}

export const mapFaqCategoryToApi = (
  category: FaqCategoryWithLocalizedRelations,
  normalized: string,
): FAQCategory => {
  const translation = pickByLocale<FaqCategoryTranslation>(category.translations, normalized)

  return {
    key: String(category.id),
    name: translation?.name || String(category.id),
    count: category._count?.items ?? 0,
  }
}
