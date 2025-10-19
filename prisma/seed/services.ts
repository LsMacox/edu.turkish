import type { PrismaClient } from '@prisma/client'

// Category slugs in order
const CATEGORY_SLUGS = [
  'document-translations',
  'relocation-in-turkey',
  'tr-yos-courses',
  'sat-courses',
  'turkish-english-course',
] as const

const LOCALES = ['ru', 'en', 'kk', 'tr'] as const

type SubServiceSeed = {
  name: string
  description?: string
  priceUsd: number
  deliveryTimeDays?: number | null
  type?: 'offering' | 'calculator'
}

type CategorySeed = {
  title?: string
  subtitle?: string | null
  metadata?: Record<string, any> | null
  subServices?: Record<string, SubServiceSeed>
  expressMultiplier?: number
  rushMultiplier?: number
}

const SERVICES_SEED: Record<(typeof CATEGORY_SLUGS)[number], CategorySeed> = {
  'document-translations': {
    title: 'Перевод документов',
    expressMultiplier: 1.5,
    rushMultiplier: 2.0,
    subServices: {
      'calculator-standard': {
        name: 'calculator-standard',
        priceUsd: 20,
        type: 'calculator',
      },
      'notarized-translation': {
        name: 'Нотариально заверенный перевод',
        description: 'Официальный перевод с нотариальным заверением, принимается университетами Турции',
        priceUsd: 20,
        deliveryTimeDays: 5,
      },
      'apostille-translation': {
        name: 'Апостиль + нотариальный перевод',
        description: 'Подготовка апостиля и нотариально заверенного перевода',
        priceUsd: 40,
        deliveryTimeDays: 10,
      },
      'consular-legalization': {
        name: 'Консульская легализация',
        description: 'Для стран вне Гаагской конвенции: консульская легализация + перевод',
        priceUsd: 60,
        deliveryTimeDays: 14,
      },
    },
  },
  'relocation-in-turkey': {
    title: 'Переезд в Турцию',
    subServices: {
      'starter-30d': {
        name: 'Стартовый 30 дней',
        description: 'SIM, vergi numarası, банк, жильё, подача на ВНЖ. Поддержка 30 дней',
        priceUsd: 499,
        deliveryTimeDays: 30,
      },
      'premium-60d': {
        name: 'Премиум 60 дней',
        description: 'Полное сопровождение, приоритетные слоты и поддержка 60 дней',
        priceUsd: 899,
        deliveryTimeDays: 60,
      },
    },
  },
  'tr-yos-courses': {
    title: 'Курсы TR-YÖS',
    subServices: {
      basic: {
        name: 'Базовый',
        description: '8 недель, группа до 10 человек, пробные экзамены',
        priceUsd: 299,
        deliveryTimeDays: 56,
      },
      standard: {
        name: 'Стандарт',
        description: 'Больше практики и разборов. Подготовка к 60–70 баллам',
        priceUsd: 499,
        deliveryTimeDays: 56,
      },
      premium: {
        name: 'Премиум',
        description: 'Индивидуальные занятия и план под вас. Цель 70+',
        priceUsd: 799,
        deliveryTimeDays: 56,
      },
    },
  },
  'sat-courses': {
    title: 'Курсы SAT',
    subServices: {
      foundation: {
        name: 'Foundation',
        description: 'Стартовая программа по Digital SAT, основы стратегий',
        priceUsd: 399,
        deliveryTimeDays: 84,
      },
      advanced: {
        name: 'Advanced',
        description: 'Продвинутая практика, еженедельные полноформатные тесты',
        priceUsd: 699,
        deliveryTimeDays: 84,
      },
      elite: {
        name: 'Elite',
        description: 'Максимальный прогресс, персональная аналитика результатов',
        priceUsd: 999,
        deliveryTimeDays: 84,
      },
    },
  },
  'turkish-english-course': {
    title: 'Курсы турецкого и английского',
    subServices: {
      'a1-a2': {
        name: 'A1 → A2',
        description: 'Базовые разговорные навыки и бытовые ситуации',
        priceUsd: 199,
        deliveryTimeDays: 56,
      },
      'b1-b2': {
        name: 'B1 → B2',
        description: 'Рабочие встречи, академическая дискуссия, сложные тексты',
        priceUsd: 349,
        deliveryTimeDays: 84,
      },
      'c1-c2': {
        name: 'C1 → C2',
        description: 'Уровень носителя: профессиональное письмо и нюансы речи',
        priceUsd: 549,
        deliveryTimeDays: 84,
      },
    },
  },
}

export async function seedServices(prisma: PrismaClient) {
  console.log('🌱 Seeding services...')

  const servicesData = SERVICES_SEED as Record<string, CategorySeed>

  for (const [index, categorySlug] of CATEGORY_SLUGS.entries()) {
    const categoryData = servicesData[categorySlug]

    if (!categoryData) {
      console.warn(`⚠️  No data found for category: ${categorySlug}`)
      continue
    }

    console.log(`  📦 Processing category: ${categorySlug}`)

    const { title, subtitle, subServices, metadata } = (categoryData || {}) as CategorySeed
    const hasMetadata = !!(metadata && Object.keys(metadata as any).length > 0)

    // Upsert ServiceCategory
    const category = await prisma.serviceCategory.upsert({
      where: { slug: categorySlug },
      update: {
        order: index + 1,
        isActive: true,
        ...(typeof (categoryData as any).expressMultiplier === 'number'
          ? { expressMultiplier: (categoryData as any).expressMultiplier }
          : {}),
        ...(typeof (categoryData as any).rushMultiplier === 'number'
          ? { rushMultiplier: (categoryData as any).rushMultiplier }
          : {}),
      },
      create: {
        slug: categorySlug,
        order: index + 1,
        isActive: true,
        ...(typeof (categoryData as any).expressMultiplier === 'number'
          ? { expressMultiplier: (categoryData as any).expressMultiplier }
          : {}),
        ...(typeof (categoryData as any).rushMultiplier === 'number'
          ? { rushMultiplier: (categoryData as any).rushMultiplier }
          : {}),
      },
    })

    // Build per-locale priceCalculator metadata for 'document-translations'
    const perLocaleMetadata: Record<string, any> | null =
      categorySlug === 'document-translations'
        ? {
            ru: {
              priceCalculator: {
                documentTypes: [
                  'Диплом',
                  'Транскрипт',
                  'Паспорт',
                  'Свидетельство о рождении',
                  'Свидетельство о браке',
                  'Другое',
                ],
                languages: [
                  'Английский → Турецкий',
                  'Русский → Турецкий',
                  'Казахский → Турецкий',
                  'Турецкий → Английский',
                ],
                urgency: [
                  'Стандарт (5 рабочих дней)',
                  'Экспресс (2 рабочих дня)',
                  'Срочно (24 часа)',
                ],
                adjustments: {
                  byDocumentType: [1, 1.2, 1.1, 1.3, 1.4, 1],
                  byLanguage: [1, 1.1, 1.05, 1.2],
                },
              },
            },
            en: {
              priceCalculator: {
                documentTypes: [
                  'Diploma',
                  'Transcript',
                  'Passport',
                  'Birth Certificate',
                  'Marriage Certificate',
                  'Other',
                ],
                languages: [
                  'English → Turkish',
                  'Russian → Turkish',
                  'Kazakh → Turkish',
                  'Turkish → English',
                ],
                urgency: [
                  'Standard (5 business days)',
                  'Express (2 business days)',
                  'Rush (24 hours)',
                ],
                adjustments: {
                  byDocumentType: [1, 1.2, 1.1, 1.3, 1.4, 1],
                  byLanguage: [1, 1.1, 1.05, 1.2],
                },
              },
            },
            kk: {
              priceCalculator: {
                documentTypes: [
                  'Диплом',
                  'Транскрипт',
                  'Паспорт',
                  'Туу туралы куәлік',
                  'Неке туралы куәлік',
                  'Басқа',
                ],
                languages: [
                  'Ағылшын → Түрік',
                  'Орыс → Түрік',
                  'Қазақ → Түрік',
                  'Түрік → Ағылшын',
                ],
                urgency: [
                  'Стандарт (5 жұмыс күні)',
                  'Экспресс (2 жұмыс күні)',
                  'Шұғыл (24 сағат)',
                ],
                adjustments: {
                  byDocumentType: [1, 1.2, 1.1, 1.3, 1.4, 1],
                  byLanguage: [1, 1.1, 1.05, 1.2],
                },
              },
            },
            tr: {
              priceCalculator: {
                documentTypes: [
                  'Diploma',
                  'Transkript',
                  'Pasaport',
                  'Doğum Belgesi',
                  'Evlilik Belgesi',
                  'Diğer',
                ],
                languages: [
                  'İngilizce → Türkçe',
                  'Rusça → Türkçe',
                  'Kazakça → Türkçe',
                  'Türkçe → İngilizce',
                ],
                urgency: [
                  'Standart (5 iş günü)',
                  'Ekspres (2 iş günü)',
                  'Acil (24 saat)',
                ],
                adjustments: {
                  byDocumentType: [1, 1.2, 1.1, 1.3, 1.4, 1],
                  byLanguage: [1, 1.1, 1.05, 1.2],
                },
              },
            },
          }
        : null

    // Upsert translations for all locales, only updating metadata when provided
    for (const locale of LOCALES) {
      const localeMetadata = (perLocaleMetadata && perLocaleMetadata[locale]) || (hasMetadata ? metadata : undefined)

      await prisma.serviceCategoryTranslation.upsert({
        where: {
          serviceCategoryId_locale: {
            serviceCategoryId: category.id,
            locale,
          },
        },
        update: (() => {
          const updateData: Record<string, any> = {
            title: title || categorySlug,
            subtitle: subtitle || null,
            slug: categorySlug,
          }
          if (localeMetadata) {
            updateData.metadata = localeMetadata
          }
          return updateData
        })(),
        create: {
          serviceCategoryId: category.id,
          locale,
          title: title || categorySlug,
          subtitle: subtitle || null,
          slug: categorySlug,
          ...(localeMetadata ? { metadata: localeMetadata } : {}),
        },
      })
    }

    // Process sub-services
    if (subServices && typeof subServices === 'object') {
      const subServiceEntries = Object.entries(subServices)

      for (const [subIndex, [subSlug, subData]] of subServiceEntries.entries()) {
        const subServiceData = subData as any

        const priceUsd = Number(subServiceData.priceUsd)
        if (!isFinite(priceUsd)) {
          console.warn(`    ⚠️  Invalid USD price for sub-service: ${subSlug}`)
          continue
        }

        console.log(
          `    ├─ Sub-service: ${subSlug} ($${priceUsd})` +
            (subServiceData.type === 'calculator' ? ' [calculator]' : '')
        )

        // Upsert SubService
        const subService = await prisma.subService.upsert({
          where: {
            serviceCategoryId_slug: {
              serviceCategoryId: category.id,
              slug: subSlug,
            },
          },
          update: {
            priceUsd,
            deliveryTimeDays: subServiceData.deliveryTimeDays ?? null,
            order: subIndex + 1,
            isActive: true,
            ...(subServiceData.type ? { type: subServiceData.type as any } : {}),
          },
          create: {
            serviceCategoryId: category.id,
            slug: subSlug,
            priceUsd,
            deliveryTimeDays: subServiceData.deliveryTimeDays ?? null,
            order: subIndex + 1,
            isActive: true,
            ...(subServiceData.type ? { type: subServiceData.type as any } : {}),
          },
        })

        // Upsert Russian translation for sub-service
        await prisma.subServiceTranslation.upsert({
          where: {
            subServiceId_locale: {
              subServiceId: subService.id,
              locale: 'ru',
            },
          },
          update: {
            name: subServiceData.name || subSlug,
            description: subServiceData.description || '',
          },
          create: {
            subServiceId: subService.id,
            locale: 'ru',
            name: subServiceData.name || subSlug,
            description: subServiceData.description || '',
          },
        })
      }
    }

    console.log(`  ✅ Category ${categorySlug} seeded`)
  }

  // Count results
  const categoryCount = await prisma.serviceCategory.count()
  const subServiceCount = await prisma.subService.count()

  console.log(`\n✅ Services seeded successfully!`)
  console.log(`   📊 ${categoryCount} categories`)
  console.log(`   📊 ${subServiceCount} sub-services`)
}
