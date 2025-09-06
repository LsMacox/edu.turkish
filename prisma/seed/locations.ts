import { PrismaClient } from '@prisma/client'

export async function seedLocations(prisma: PrismaClient) {
  console.log('🗺️  Seeding countries and cities...')

  // Upsert country Turkey (ISO Alpha-3 code: TUR)
  const country = await prisma.country.upsert({
    where: { code: 'TUR' },
    update: {},
    create: { code: 'TUR' }
  })

  const countryNames: Record<string, string> = {
    ru: 'Турция',
    en: 'Turkey',
    tr: 'Türkiye'
  }

  for (const [locale, name] of Object.entries(countryNames)) {
    await prisma.countryTranslation.upsert({
      where: { countryId_locale: { countryId: country.id, locale } },
      update: { name },
      create: { countryId: country.id, locale, name }
    })
  }

  const cities: Array<{ key: string; ru: string; en: string; tr: string }> = [
    { key: 'istanbul', ru: 'Стамбул', en: 'Istanbul', tr: 'İstanbul' },
    { key: 'izmir', ru: 'Измир', en: 'Izmir', tr: 'İzmir' },
    { key: 'ankara', ru: 'Анкара', en: 'Ankara', tr: 'Ankara' },
    { key: 'antalya', ru: 'Анталия', en: 'Antalya', tr: 'Antalya' },
    { key: 'bursa', ru: 'Бурса', en: 'Bursa', tr: 'Bursa' },
    { key: 'kocaeli', ru: 'Коджаэли', en: 'Kocaeli', tr: 'Kocaeli' }
  ]

  const createdCityIds: Record<string, number> = {}

  for (const cityDef of cities) {
    const city = await prisma.city.create({
      data: {
        countryId: country.id,
        translations: {
          create: [
            { locale: 'ru', name: cityDef.ru },
            { locale: 'en', name: cityDef.en },
            { locale: 'tr', name: cityDef.tr }
          ]
        }
      },
      include: { translations: true }
    })

    createdCityIds[cityDef.key] = city.id
    console.log(`  🏙️  Created city: ${cityDef.en} (id: ${city.id})`)
  }

  console.log('✅ Locations seeding finished')

  return { countryId: country.id, cityIds: createdCityIds }
}


