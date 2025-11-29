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
        description:
          'Официальный перевод с нотариальным заверением, принимается университетами Турции',
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
      'university-admission': {
        name: 'University Admission',
        description: 'Basic admission package',
        priceUsd: 200,
        deliveryTimeDays: null,
      },
      'relocation-standard': {
        name: 'Settlement in Turkey',
        description: 'Standard package including admission',
        priceUsd: 1500,
        deliveryTimeDays: null,
      },
      'relocation-vip': {
        name: 'VIP Settlement in Turkey',
        description: 'Premium package including admission and settlement',
        priceUsd: 2500,
        deliveryTimeDays: null,
      },
    },
  },
  'tr-yos-courses': {
    title: 'Курсы TR-YÖS',
    subtitle: 'Профессиональная подготовка к вступительным экзаменам в турецкие университеты',
    subServices: {
      'basic-package': {
        name: 'Базовый',
        description:
          'Длительность: 7+ месяцев\nГруппа: до 10 человек\nПрограмма: полная подготовка по всем темам\nГрафик: 3 занятия в неделю',
        priceUsd: 300,
        deliveryTimeDays: 210,
      },
      'individual-package': {
        name: 'Индивидуальный',
        description:
          'Длительность: 7+ месяцев\nФормат: индивидуальные занятия\nПрограмма: та же база + адаптация под твой уровень\nГрафик: 3 занятия в неделю',
        priceUsd: 700,
        deliveryTimeDays: 210,
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
              calculator: {
                documentTypes: [
                  { name: 'Загранпаспорт', priceUsd: 20 },
                  { name: 'Школьный аттестат', priceUsd: 30 },
                  { name: 'Диплом', priceUsd: 45 },
                  { name: 'Доверенность/Согласие', priceUsd: 40 },
                  { name: 'Финансовые справки', priceUsd: 25 },
                  { name: 'Остальное', priceUsd: null },
                ],
                languagePairs: ['Русский – Турецкий', 'Турецкий – Русский'],
                urgency: [
                  { name: 'Стандарт (1-3 дня)', surcharge: 0 },
                  { name: 'Срочно (до 3 часов)', surcharge: 10 },
                ],
              },
              serviceCards: [
                {
                  title: 'Аттестат / Диплом / Приложение к диплому',
                  description:
                    'Перевод и нотариальное заверение аттестатов, дипломов и приложений для поступления в турецкие университеты',
                  icon: 'mdi:certificate',
                },
                {
                  title: 'Справки из школы / университета',
                  description:
                    'Академические справки, выписки об оценках и другие документы из учебных заведений',
                  icon: 'mdi:school',
                },
                {
                  title: 'Паспорт / ID / Свидетельства',
                  description:
                    'Переводы паспортов, удостоверений личности, свидетельств о рождении, браке и других личных документов',
                  icon: 'mdi:card-account-details',
                },
                {
                  title: 'Справки о несудимости / медицинские справки',
                  description:
                    'Справки об отсутствии судимости, медицинские заключения и другие официальные справки',
                  icon: 'mdi:file-document-check',
                },
                {
                  title: 'Доверенности/Согласия',
                  description:
                    'Нотариальные доверенности, согласия родителей и другие юридические документы',
                  icon: 'mdi:file-sign',
                },
                {
                  title: 'Финансовые справки',
                  description:
                    'Банковские выписки, справки о доходах, гарантийные письма и финансовые документы',
                  icon: 'mdi:bank',
                },
                {
                  title: 'Другое',
                  description:
                    'Любые другие документы, требующие нотариального перевода - оценка стоимости индивидуально',
                  icon: 'mdi:file-question',
                },
              ],
            },
            en: {
              calculator: {
                documentTypes: [
                  { name: 'Passport', priceUsd: 20 },
                  { name: 'High School Certificate', priceUsd: 30 },
                  { name: 'Diploma', priceUsd: 45 },
                  { name: 'Power of Attorney/Consent', priceUsd: 40 },
                  { name: 'Financial Statements', priceUsd: 25 },
                  { name: 'Other', priceUsd: null },
                ],
                languagePairs: ['Russian – Turkish', 'Turkish – Russian'],
                urgency: [
                  { name: 'Standard (1-3 days)', surcharge: 0 },
                  { name: 'Rush (up to 3 hours)', surcharge: 10 },
                ],
              },
              serviceCards: [
                {
                  title: 'Certificate / Diploma / Transcript',
                  description:
                    'Translation and notarization of certificates, diplomas and transcripts for university admission in Turkey',
                  icon: 'mdi:certificate',
                },
                {
                  title: 'School / University Documents',
                  description:
                    'Academic certificates, grade transcripts and other documents from educational institutions',
                  icon: 'mdi:school',
                },
                {
                  title: 'Passport / ID / Certificates',
                  description:
                    'Translation of passports, identity cards, birth certificates, marriage certificates and other personal documents',
                  icon: 'mdi:card-account-details',
                },
                {
                  title: 'Criminal Record / Medical Certificates',
                  description:
                    'Criminal record checks, medical reports and other official certificates',
                  icon: 'mdi:file-document-check',
                },
                {
                  title: 'Power of Attorney/Consents',
                  description:
                    'Notarized powers of attorney, parental consents and other legal documents',
                  icon: 'mdi:file-sign',
                },
                {
                  title: 'Financial Documents',
                  description:
                    'Bank statements, income certificates, guarantee letters and financial documents',
                  icon: 'mdi:bank',
                },
                {
                  title: 'Other',
                  description:
                    'Any other documents requiring notarized translation - individual cost assessment',
                  icon: 'mdi:file-question',
                },
              ],
            },
            kk: {
              calculator: {
                documentTypes: [
                  { name: 'Шетелдік паспорт', priceUsd: 20 },
                  { name: 'Мектеп аттестаты', priceUsd: 30 },
                  { name: 'Диплом', priceUsd: 45 },
                  { name: 'Сенімхат/Келісім', priceUsd: 40 },
                  { name: 'Қаржылық анықтамалар', priceUsd: 25 },
                  { name: 'Басқалары', priceUsd: null },
                ],
                languagePairs: ['Орыс – Түрік', 'Түрік – Орыс'],
                urgency: [
                  { name: 'Стандарт (1-3 күн)', surcharge: 0 },
                  { name: 'Шұғыл (3 сағатқа дейін)', surcharge: 10 },
                ],
              },
              serviceCards: [
                {
                  title: 'Аттестат / Диплом / Дипломға қосымша',
                  description:
                    'Түрік университеттеріне түсу үшін аттестаттар, дипломдар мен қосымшаларды аударма және нотариалдық куәландыру',
                  icon: 'mdi:certificate',
                },
                {
                  title: 'Мектеп / университет құжаттары',
                  description:
                    'Академиялық анықтамалар, бағалар туралы үзінді көшірмелер және оқу орындарының басқа құжаттары',
                  icon: 'mdi:school',
                },
                {
                  title: 'Паспорт / ID / Куәліктер',
                  description:
                    'Паспорттар, жеке куәліктер, туу туралы куәліктер, неке туралы куәліктер және басқа жеке құжаттарды аудару',
                  icon: 'mdi:card-account-details',
                },
                {
                  title: 'Соттылық жоқ туралы / медициналық анықтамалар',
                  description:
                    'Соттылық жоқ туралы анықтамалар, медициналық қорытындылар және басқа ресми анықтамалар',
                  icon: 'mdi:file-document-check',
                },
                {
                  title: 'Сенімхаттар/Келісімдер',
                  description:
                    'Нотариалды сенімхаттар, ата-аналардың келісімдері және басқа заңды құжаттар',
                  icon: 'mdi:file-sign',
                },
                {
                  title: 'Қаржылық анықтамалар',
                  description:
                    'Банк шоттары, табыс туралы анықтамалар, кепілдік хаттар және қаржылық құжаттар',
                  icon: 'mdi:bank',
                },
                {
                  title: 'Басқа',
                  description:
                    'Нотариалды аудармасы қажет кез келген басқа құжаттар - құнын жеке бағалау',
                  icon: 'mdi:file-question',
                },
              ],
            },
            tr: {
              calculator: {
                documentTypes: [
                  { name: 'Pasaport', priceUsd: 20 },
                  { name: 'Lise Diploması', priceUsd: 30 },
                  { name: 'Diploma', priceUsd: 45 },
                  { name: 'Vekaletname/Muvafakatname', priceUsd: 40 },
                  { name: 'Mali Belgeler', priceUsd: 25 },
                  { name: 'Diğer', priceUsd: null },
                ],
                languagePairs: ['Rusça – Türkçe', 'Türkçe – Rusça'],
                urgency: [
                  { name: 'Standart (1-3 gün)', surcharge: 0 },
                  { name: 'Acil (3 saate kadar)', surcharge: 10 },
                ],
              },
              serviceCards: [
                {
                  title: 'Lise Diploması / Üniversite Diploması / Transkript',
                  description:
                    'Türk üniversitelerine başvuru için lise diplomaları, üniversite diplomaları ve transkriptlerin tercümesi ve noterce onayı',
                  icon: 'mdi:certificate',
                },
                {
                  title: 'Okul / Üniversite Belgeleri',
                  description:
                    'Akademik belgeler, not dökümü ve eğitim kurumlarından diğer belgeler',
                  icon: 'mdi:school',
                },
                {
                  title: 'Pasaport / Kimlik / Nüfus Belgeleri',
                  description:
                    'Pasaport, kimlik kartı, doğum belgesi, evlilik cüzdanı ve diğer kişisel belgelerin tercümesi',
                  icon: 'mdi:card-account-details',
                },
                {
                  title: 'Sabıka Kaydı / Sağlık Raporları',
                  description: 'Sabıka kaydı belgeleri, sağlık raporları ve diğer resmi belgeler',
                  icon: 'mdi:file-document-check',
                },
                {
                  title: 'Vekaletnameler/Muvafakatnameler',
                  description:
                    'Noterce onaylı vekaletnameler, veli muvafakatnameleri ve diğer hukuki belgeler',
                  icon: 'mdi:file-sign',
                },
                {
                  title: 'Mali Belgeler',
                  description:
                    'Banka hesap özetleri, gelir belgeleri, taahhütnameler ve mali belgeler',
                  icon: 'mdi:bank',
                },
                {
                  title: 'Diğer',
                  description:
                    'Noterce onaylı tercümesi gereken diğer belgeler - bireysel maliyet değerlendirmesi',
                  icon: 'mdi:file-question',
                },
              ],
            },
          }
        : null

    // Upsert translations for all locales, only updating metadata when provided
    for (const locale of LOCALES) {
      const localeMetadata =
        (perLocaleMetadata && perLocaleMetadata[locale]) || (hasMetadata ? metadata : undefined)

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
            (subServiceData.type === 'calculator' ? ' [calculator]' : ''),
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

        // Upsert translations for all locales (fallback to provided name)
        const defaultName = subServiceData.name || subSlug
        const specialNames: Record<string, Record<string, string>> = {
          'university-admission': {
            en: 'University Admission',
            ru: 'Поступление в университет',
            kk: 'Университетке түсу',
            tr: 'Üniversiteye Giriş',
          },
          'relocation-standard': {
            en: 'Settlement in Turkey',
            ru: 'Обустройство по Турции',
            kk: 'Түркиядағы орналастыру',
            tr: "Türkiye'de Yerleşim",
          },
          'relocation-vip': {
            en: 'VIP Settlement in Turkey',
            ru: 'Вип обустройство по Турции',
            kk: 'VIP Түркиядағы орналастыру',
            tr: "VIP Türkiye'de Yerleşim",
          },
        }
        const namesByLocale = specialNames[subSlug] || {}
        for (const locale of LOCALES) {
          const name = (namesByLocale as any)[locale] || defaultName
          await prisma.subServiceTranslation.upsert({
            where: {
              subServiceId_locale: {
                subServiceId: subService.id,
                locale,
              },
            },
            update: {
              name,
              description: subServiceData.description || '',
            },
            create: {
              subServiceId: subService.id,
              locale,
              name,
              description: subServiceData.description || '',
            },
          })
        }
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
