import { PrismaClient } from '@prisma/client'

export async function seedFaqCategories(prisma: PrismaClient) {
  const categories: Array<{ key: string; translations: Record<string, string> }> = [
    { key: 'documents', translations: { ru: 'Документы', en: 'Documents', tr: 'Belgeler', kk: 'Құжаттар' } },
    { key: 'technology', translations: { ru: 'Технологии', en: 'Technology', tr: 'Teknoloji', kk: 'Технологиялар' } },
    { key: 'education', translations: { ru: 'Образование', en: 'Education', tr: 'Eğitim', kk: 'Білім беру' } },
    { key: 'residence', translations: { ru: 'ВНЖ', en: 'Residence permit', tr: 'İkamet', kk: 'Ықтиярхат' } },
    { key: 'relocation', translations: { ru: 'Переезд', en: 'Relocation', tr: 'Taşınma', kk: 'Көшу' } },
    { key: 'insurance', translations: { ru: 'Страхование', en: 'Insurance', tr: 'Sigorta', kk: 'Сақтандыру' } },
    { key: 'transport', translations: { ru: 'Транспорт', en: 'Transport', tr: 'Ulaşım', kk: 'Көлік' } },
    { key: 'housing', translations: { ru: 'Жилье', en: 'Housing', tr: 'Konut', kk: 'Тұрғын үй' } }
  ]

  const createdMap: Record<string, number> = {}

  for (const categoryDef of categories) {
    const category = await (prisma as any).faqCategory.create({
      data: {
        translations: {
          create: Object.entries(categoryDef.translations).map(([locale, name]) => ({
            locale,
            name
          }))
        }
      },
      include: { translations: true }
    })

    createdMap[categoryDef.key] = category.id
    console.log(`  ✅ Created FAQ category: ${categoryDef.key} (id: ${category.id})`)
  }

  return createdMap
}


