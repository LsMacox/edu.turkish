import type { PrismaClient } from '@prisma/client'

export async function seedFaqCategories(prisma: PrismaClient) {
  const categories: Array<{ key: string; translations: Record<string, string> }> = [
    {
      key: 'documents',
      translations: { ru: 'Документы', en: 'Documents', tr: 'Belgeler', kk: 'Құжаттар' },
    },
    {
      key: 'technology',
      translations: { ru: 'Технологии', en: 'Technology', tr: 'Teknoloji', kk: 'Технологиялар' },
    },
    {
      key: 'education',
      translations: { ru: 'Образование', en: 'Education', tr: 'Eğitim', kk: 'Білім беру' },
    },
    {
      key: 'residence',
      translations: { ru: 'ВНЖ', en: 'Residence permit', tr: 'İkamet', kk: 'Ықтиярхат' },
    },
    {
      key: 'relocation',
      translations: { ru: 'Переезд', en: 'Relocation', tr: 'Taşınma', kk: 'Көшу' },
    },
    {
      key: 'insurance',
      translations: { ru: 'Страхование', en: 'Insurance', tr: 'Sigorta', kk: 'Сақтандыру' },
    },
    {
      key: 'transport',
      translations: { ru: 'Транспорт', en: 'Transport', tr: 'Ulaşım', kk: 'Көлік' },
    },
    { key: 'housing', translations: { ru: 'Жилье', en: 'Housing', tr: 'Konut', kk: 'Тұрғын үй' } },
  ]

  const createdMap: Record<string, number> = {}

  for (const categoryDef of categories) {
    const ruName = categoryDef.translations.ru

    // Try to find existing category by RU name to avoid duplicates
    const existingRu = await (prisma as any).faqCategoryTranslation.findFirst({
      where: { locale: 'ru', name: ruName },
      select: { categoryId: true },
    })

    let categoryId: number

    if (existingRu) {
      categoryId = existingRu.categoryId
      console.log(`  ♻️ Reusing FAQ category: ${categoryDef.key} (id: ${categoryId})`)
    } else {
      const created = await (prisma as any).faqCategory.create({ data: {} })
      categoryId = created.id
      console.log(`  ✅ Created FAQ category: ${categoryDef.key} (id: ${categoryId})`)
    }

    // Ensure translations are present and up-to-date (idempotent)
    for (const [locale, name] of Object.entries(categoryDef.translations)) {
      await (prisma as any).faqCategoryTranslation.upsert({
        where: { categoryId_locale: { categoryId, locale } },
        update: { name },
        create: { categoryId, locale, name },
      })
    }

    createdMap[categoryDef.key] = categoryId
  }

  return createdMap
}
