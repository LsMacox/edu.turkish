import { beforeAll, describe, expect, it } from 'vitest'
import type { PrismaClient } from '@prisma/client'
import { seedStudyDirections } from '~~/prisma/seed/study-directions'

type Direction = { id: number }
type Translation = { directionId: number; locale: string; slug: string; name: string }

class InMemoryPrisma {
  private directionId = 1
  private directions = new Map<number, Direction>()
  private translations = new Map<string, Translation>()

  studyDirection = {
    create: async ({ data }: { data: Partial<Direction> }) => {
      const id = this.directionId++
      const record: Direction = { id, ...data }
      this.directions.set(id, record)
      return record
    },
    findMany: async ({ include }: { include?: { translations?: boolean } } = {}) => {
      const list = Array.from(this.directions.values())
      if (include?.translations) {
        return list.map((direction) => ({
          ...direction,
          translations: this.getTranslationsForDirection(direction.id),
        }))
      }
      return list
    },
    deleteMany: async () => {
      const count = this.directions.size
      this.directions.clear()
      return { count }
    },
  }

  studyDirectionTranslation = {
    findFirst: async ({ where }: { where: { slug: string } }) => {
      const translation = Array.from(this.translations.values()).find(
        (item) => item.slug === where.slug,
      )
      return translation ? { directionId: translation.directionId } : null
    },
    findMany: async ({ where }: { where?: { locale?: string } } = {}) => {
      const all = Array.from(this.translations.values())
      if (!where?.locale) {
        return all
      }
      return all.filter((item) => item.locale === where.locale)
    },
    upsert: async ({
      where,
      update,
      create,
    }: {
      where: { unique_direction_slug_per_locale: { locale: string; slug: string } }
      update: Partial<Translation>
      create: Translation
    }) => {
      const key = `${where.unique_direction_slug_per_locale.locale}:${where.unique_direction_slug_per_locale.slug}`
      const existing = this.translations.get(key)
      if (existing) {
        const updated = { ...existing, ...update }
        this.translations.set(key, updated)
        return updated
      }
      this.translations.set(key, create)
      return { ...create, created: true }
    },
    deleteMany: async () => {
      const count = this.translations.size
      this.translations.clear()
      return { count }
    },
  }

  async $disconnect() {
    // no-op for in-memory mock
  }

  private getTranslationsForDirection(directionId: number) {
    return Array.from(this.translations.values()).filter(
      (translation) => translation.directionId === directionId,
    )
  }
}

describe('Study Directions Seed', () => {
  const prisma = new InMemoryPrisma()

  beforeAll(async () => {
    await prisma.studyDirection.deleteMany()
    await prisma.studyDirectionTranslation.deleteMany()
    await seedStudyDirections(prisma as unknown as PrismaClient)
  })

  it('should seed all directions from university JSONs', async () => {
    const directions = await prisma.studyDirection.findMany({ include: { translations: true } })
    expect(directions.length).toBeGreaterThan(0)

    const totalTranslations = directions.reduce(
      (count, direction) => count + direction.translations.length,
      0,
    )
    expect(totalTranslations).toBeGreaterThan(0)
  })

  it('should create translations for all 4 locales', async () => {
    const directions = await prisma.studyDirection.findMany({ include: { translations: true } })
    const locales = ['en', 'ru', 'kk', 'tr']

    for (const direction of directions) {
      expect(direction.translations.length).toBe(4)
      const directionLocales = direction.translations.map((t) => t.locale)
      locales.forEach((locale) => expect(directionLocales).toContain(locale))
    }
  })

  it('should have unique slugs per locale', async () => {
    const translations = await prisma.studyDirectionTranslation.findMany()
    const locales = ['en', 'ru', 'kk', 'tr']

    for (const locale of locales) {
      const localeTranslations = translations.filter((t) => t.locale === locale)
      const slugs = localeTranslations.map((t) => t.slug)
      expect(slugs).toHaveLength(new Set(slugs).size)
    }
  })

  it('should include known study direction slugs', async () => {
    const expectedSlugs = [
      'accounting',
      'architecture',
      'computer-science',
      'medicine',
      'psychology',
    ]
    const translations = await prisma.studyDirectionTranslation.findMany({
      where: { locale: 'en' },
    })
    const seededSlugs = translations.map((t) => t.slug)

    expectedSlugs.forEach((slug) => expect(seededSlugs).toContain(slug))
  })

  it('should set non-empty names for translations', async () => {
    const translations = await prisma.studyDirectionTranslation.findMany()
    translations.forEach((translation) => {
      expect(typeof translation.name).toBe('string')
      expect(translation.name.length).toBeGreaterThan(0)
    })
  })
})
