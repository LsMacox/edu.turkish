import type { PrismaClient } from '@prisma/client'

export async function seedFaqCategories(prisma: PrismaClient) {
  const categories: Array<{ key: string; name: string }> = [
    { key: 'documents', name: 'Документы' },
    { key: 'technology', name: 'Технологии' },
    { key: 'education', name: 'Образование' },
    { key: 'residence', name: 'ВНЖ' },
    { key: 'relocation', name: 'Переезд' },
    { key: 'insurance', name: 'Страхование' },
    { key: 'transport', name: 'Транспорт' },
    { key: 'housing', name: 'Жилье' },
  ]

  const createdMap: Record<string, number> = {}

  for (const categoryDef of categories) {
    const ruName = categoryDef.name

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
    await (prisma as any).faqCategoryTranslation.upsert({
      where: { categoryId_locale: { categoryId, locale: 'ru' } },
      update: { name: ruName },
      create: { categoryId, locale: 'ru', name: ruName },
    })

    createdMap[categoryDef.key] = categoryId
  }

  return createdMap
}
