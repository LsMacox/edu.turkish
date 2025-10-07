const baseDate = new Date('2024-01-01T00:00:00.000Z')
let faqIdCounter = 1
let categoryIdCounter = 1
let faqTranslationIdCounter = 1
let categoryTranslationIdCounter = 1

export interface FAQCategoryFixture {
  id: number
  createdAt: Date
  updatedAt: Date
  translations: Array<{
    id: number
    categoryId: number
    locale: string
    name: string
    createdAt: Date
    updatedAt: Date
  }>
}

export interface FAQFixture {
  id: number
  categoryId: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
  translations: Array<{
    id: number
    faqId: number
    locale: string
    question: string
    answer: string
    createdAt: Date
    updatedAt: Date
  }>
  category?: FAQCategoryFixture
}

export function createFAQCategory(overrides?: Partial<FAQCategoryFixture>): FAQCategoryFixture {
  const id = overrides?.id ?? categoryIdCounter++

  const defaults: FAQCategoryFixture = {
    id,
    createdAt: baseDate,
    updatedAt: baseDate,
    translations: [
      {
        id: categoryTranslationIdCounter++,
        categoryId: id,
        locale: 'en',
        name: `Category ${id}`,
        createdAt: baseDate,
        updatedAt: baseDate,
      },
      {
        id: categoryTranslationIdCounter++,
        categoryId: id,
        locale: 'ru',
        name: `Категория ${id}`,
        createdAt: baseDate,
        updatedAt: baseDate,
      },
      {
        id: categoryTranslationIdCounter++,
        categoryId: id,
        locale: 'kk',
        name: `Санат ${id}`,
        createdAt: baseDate,
        updatedAt: baseDate,
      },
      {
        id: categoryTranslationIdCounter++,
        categoryId: id,
        locale: 'tr',
        name: `Kategori ${id}`,
        createdAt: baseDate,
        updatedAt: baseDate,
      },
    ],
  }

  return {
    ...defaults,
    ...overrides,
    translations: overrides?.translations || defaults.translations,
  }
}

export function createFAQ(overrides?: Partial<FAQFixture>): FAQFixture {
  const id = overrides?.id ?? faqIdCounter++
  const categoryId = overrides?.categoryId ?? 1

  const defaults: FAQFixture = {
    id,
    categoryId,
    featured: false,
    createdAt: baseDate,
    updatedAt: baseDate,
    translations: [
      {
        id: faqTranslationIdCounter++,
        faqId: id,
        locale: 'en',
        question: `Question ${id}`,
        answer: `Answer ${id}`,
        createdAt: baseDate,
        updatedAt: baseDate,
      },
      {
        id: faqTranslationIdCounter++,
        faqId: id,
        locale: 'ru',
        question: `Вопрос ${id}`,
        answer: `Ответ ${id}`,
        createdAt: baseDate,
        updatedAt: baseDate,
      },
      {
        id: faqTranslationIdCounter++,
        faqId: id,
        locale: 'kk',
        question: `Сұрақ ${id}`,
        answer: `Жауап ${id}`,
        createdAt: baseDate,
        updatedAt: baseDate,
      },
      {
        id: faqTranslationIdCounter++,
        faqId: id,
        locale: 'tr',
        question: `Soru ${id}`,
        answer: `Cevap ${id}`,
        createdAt: baseDate,
        updatedAt: baseDate,
      },
    ],
    category: overrides?.category,
  }

  return {
    ...defaults,
    ...overrides,
    translations: overrides?.translations || defaults.translations,
  }
}
