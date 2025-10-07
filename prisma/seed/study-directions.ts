import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import type { PrismaClient } from '@prisma/client'

interface DirectionSeedData {
  slug: string
  translations: Record<'en' | 'ru' | 'kk' | 'tr', string>
}

const UNIVERSITIES_DIR = path.join(process.cwd(), 'app', 'assets', 'json', 'universities')
const LOCALES = ['en', 'ru', 'kk', 'tr'] as const

function loadUniversityDirectionSlugs(): string[] {
  const slugs = new Set<string>()

  const files = readdirSync(UNIVERSITIES_DIR).filter((file) => file.endsWith('.json'))
  for (const file of files) {
    const fullPath = path.join(UNIVERSITIES_DIR, file)
    const content = JSON.parse(readFileSync(fullPath, 'utf-8'))

    if (Array.isArray(content.programs)) {
      for (const program of content.programs) {
        if (typeof program?.direction_slug === 'string' && program.direction_slug.trim()) {
          slugs.add(program.direction_slug.trim())
        }
      }
    }

    if (Array.isArray(content.directions)) {
      for (const direction of content.directions) {
        if (typeof direction === 'string' && direction.trim()) {
          slugs.add(direction.trim())
        }
      }
    }
  }

  return Array.from(slugs).sort()
}

function loadTranslations(): Map<string, DirectionSeedData> {
  const seedData = new Map<string, DirectionSeedData>()
  const slugs = loadUniversityDirectionSlugs()

  for (const slug of slugs) {
    seedData.set(slug, {
      slug,
      translations: {
        en: slug,
        ru: slug,
        kk: slug,
        tr: slug,
      },
    })
  }

  for (const locale of LOCALES) {
    const localeFile = path.join(
      process.cwd(),
      'i18n',
      'locales',
      locale,
      'pages',
      'universities.json',
    )
    const hasFile = (() => {
      try {
        return readFileSync(localeFile, 'utf-8')
      } catch {
        return null
      }
    })()
    if (!hasFile) continue

    const json = JSON.parse(hasFile)
    const programSections = json?.universities_page?.popular_programs?.programs ?? {}

    for (const [programKey, programValue] of Object.entries(programSections)) {
      const slug = programKey
      if (!seedData.has(slug)) continue

      const title =
        typeof (programValue as any)?.title === 'string' ? (programValue as any).title : slug
      seedData.get(slug)!.translations[locale] = title
    }
  }

  return seedData
}

export async function seedStudyDirections(prisma: PrismaClient) {
  const directionsMap = loadTranslations()
  const total = directionsMap.size
  console.log(`📚 Seeding ${total} study directions...`)

  let createdCount = 0
  let updatedCount = 0

  let createdDirections = 0

  for (const directionData of directionsMap.values()) {
    const existingTranslation = await prisma.studyDirectionTranslation.findFirst({
      where: {
        slug: directionData.slug,
      },
      select: {
        directionId: true,
      },
    })

    let directionId: number

    if (existingTranslation?.directionId) {
      directionId = existingTranslation.directionId
    } else {
      const createdDirection = await prisma.studyDirection.create({
        data: {},
      })

      directionId = createdDirection.id
      createdDirections += 1
    }

    for (const locale of LOCALES) {
      const name = directionData.translations[locale]

      const result = await prisma.studyDirectionTranslation.upsert({
        where: {
          unique_direction_slug_per_locale: {
            locale,
            slug: directionData.slug,
          },
        },
        update: {
          name,
          directionId,
        },
        create: {
          directionId,
          locale,
          slug: directionData.slug,
          name,
        },
      })

      if ((result as any).created || (result as any).upserted) {
        createdCount++
      } else {
        updatedCount++
      }
    }
  }

  console.log(`  ✅ Processed ${total} directions with ${total * LOCALES.length} translations`)
  console.log(`  🆕 Created directions: ${createdDirections}`)
  console.log(`  ➕ Created translations: ${createdCount}`)
  console.log(`  ♻️ Updated translations: ${updatedCount}`)
  console.log('✅ Study directions seeding finished')
}
