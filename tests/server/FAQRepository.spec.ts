import { describe, expect, it, vi } from 'vitest'
import type { PrismaClient, Prisma } from '@prisma/client'

import { FAQRepository } from '~~/server/repositories/FAQRepository'
import type {
  FaqCategoryWithLocalizedRelations,
  FaqItemWithLocalizedRelations,
} from '~~/server/repositories/faqMapper'

const createFaqFixtures = () => {
  const now = new Date('2024-01-01T00:00:00.000Z')

  const categoryTranslations: FaqCategoryWithLocalizedRelations['translations'] = [
    { id: 301, categoryId: 10, locale: 'kk', name: 'KK Category', createdAt: now, updatedAt: now },
    { id: 302, categoryId: 10, locale: 'ru', name: 'RU Category', createdAt: now, updatedAt: now },
  ]

  const categoryForItem: NonNullable<FaqItemWithLocalizedRelations['category']> = {
    id: 10,
    createdAt: now,
    updatedAt: now,
    translations: categoryTranslations,
  }

  const categoryWithCount: FaqCategoryWithLocalizedRelations = {
    id: categoryForItem.id,
    createdAt: categoryForItem.createdAt,
    updatedAt: categoryForItem.updatedAt,
    translations: categoryTranslations,
    _count: { items: 2 },
  }

  const questionTranslations: FaqItemWithLocalizedRelations['translations'] = [
    {
      id: 401,
      faqId: 1,
      locale: 'kk',
      question: 'Visa requirements for students',
      answer: 'Толық түсіндірме',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 402,
      faqId: 1,
      locale: 'ru',
      question: 'Визовые требования',
      answer: 'Подробный ответ',
      createdAt: now,
      updatedAt: now,
    },
  ]

  const answerTranslations: FaqItemWithLocalizedRelations['translations'] = [
    {
      id: 501,
      faqId: 2,
      locale: 'kk',
      question: 'How to apply',
      answer: 'Visa assistance guidance',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 502,
      faqId: 2,
      locale: 'ru',
      question: 'Как подать документы',
      answer: 'Информация о визе',
      createdAt: now,
      updatedAt: now,
    },
  ]

  const faqQuestionMatch: FaqItemWithLocalizedRelations = {
    id: 1,
    categoryId: 10,
    featured: false,
    createdAt: now,
    updatedAt: now,
    translations: questionTranslations,
    category: categoryForItem,
  }

  const faqAnswerMatch: FaqItemWithLocalizedRelations = {
    id: 2,
    categoryId: 10,
    featured: true,
    createdAt: now,
    updatedAt: now,
    translations: answerTranslations,
    category: categoryForItem,
  }

  return {
    faqQuestionMatch,
    faqAnswerMatch,
    categoryWithCount,
  }
}

describe('FAQRepository', () => {
  describe('findAll', () => {
    it('applies localized search filters and sorts results by relevance', async () => {
      const { faqQuestionMatch, faqAnswerMatch, categoryWithCount } = createFaqFixtures()

      const findMany = vi.fn().mockResolvedValue([faqAnswerMatch, faqQuestionMatch])
      const count = vi.fn().mockResolvedValueOnce(2).mockResolvedValueOnce(5)
      const categoryFindMany = vi.fn().mockResolvedValue([categoryWithCount])
      const transaction = vi.fn(async (operations: Array<Promise<unknown>>) =>
        Promise.all(operations),
      )

      const prisma = {
        faq: {
          findMany,
          count,
        },
        faqCategory: {
          findMany: categoryFindMany,
        },
        $transaction: transaction,
      } as unknown as PrismaClient

      const repository = new FAQRepository(prisma)
      const result = await repository.findAll({ q: 'Visa', limit: 10 }, 'kk')

      expect(transaction).toHaveBeenCalledTimes(1)
      expect(findMany).toHaveBeenCalledTimes(1)
      expect(count).toHaveBeenCalledTimes(2)
      expect(categoryFindMany).toHaveBeenCalledTimes(1)

      const [findManyArgs] = findMany.mock.calls[0] as [Prisma.FaqFindManyArgs]
      const include = findManyArgs.include as Prisma.FaqInclude
      const translationInclude = include?.translations as Prisma.FaqTranslationFindManyArgs
      const where = findManyArgs.where as Prisma.FaqWhereInput
      const translationFilter = where?.translations?.some as Prisma.FaqTranslationWhereInput

      expect(findManyArgs.take).toBe(10)
      expect((translationInclude?.where?.locale as any)?.in).toEqual(['kk', 'kk', 'ru'])
      expect(translationFilter?.OR).toEqual([
        { question: { contains: 'Visa' } },
        { answer: { contains: 'Visa' } },
      ])

      expect(result.data.map((item) => item.id)).toEqual([1, 2])
      expect(result.data.map((item) => item.relevance_score)).toEqual([1, 0.5])
      expect(result.data[0]!.category).toBe('KK Category')
      expect(result.categories).toEqual([{ key: '10', name: 'KK Category', count: 2 }])
      expect(result.meta).toEqual({ total: 5, filtered: 2, query: 'Visa' })
    })
  })

  describe('search', () => {
    it('sorts items by relevance when searching with locale fallbacks', async () => {
      const { faqQuestionMatch, faqAnswerMatch } = createFaqFixtures()

      const findMany = vi.fn().mockResolvedValue([faqAnswerMatch, faqQuestionMatch])
      const prisma = {
        faq: {
          findMany,
        },
        faqCategory: {
          findMany: vi.fn(),
        },
        $transaction: vi.fn(),
      } as unknown as PrismaClient

      const repository = new FAQRepository(prisma)
      const result = await repository.search('Visa', 'kk', 2)

      const [findManyArgs] = findMany.mock.calls[0] as [Prisma.FaqFindManyArgs]
      const include = findManyArgs.include as Prisma.FaqInclude
      const translationInclude = include?.translations as Prisma.FaqTranslationFindManyArgs
      const searchFilter = findManyArgs.where?.translations?.some as Prisma.FaqTranslationWhereInput

      expect(findManyArgs.take).toBe(2)
      expect((translationInclude?.where?.locale as any)?.in).toEqual(['kk', 'kk', 'ru'])
      expect(searchFilter?.OR).toEqual([
        { question: { contains: 'Visa' } },
        { answer: { contains: 'Visa' } },
      ])

      expect(result.map((item) => item.id)).toEqual([1, 2])
      expect(result.map((item) => item.relevance_score)).toEqual([1, 0.5])
    })
  })
})
