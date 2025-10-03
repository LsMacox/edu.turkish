import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { seedStudyDirections } from '~~/prisma/seed/study-directions'

const prisma = new PrismaClient()

describe('Study Directions Seed', () => {
  beforeAll(async () => {
    // Clean up existing data
    await prisma.studyDirectionTranslation.deleteMany()
    await prisma.studyDirection.deleteMany()
    
    // Run the seeder
    await seedStudyDirections(prisma)
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should seed all directions from university JSONs', async () => {
    const directions = await prisma.studyDirection.findMany({
      include: { translations: true },
    })

    // Should have 43 directions (as found in analysis)
    expect(directions.length).toBeGreaterThanOrEqual(43)
  })

  it('should create translations for all 4 locales', async () => {
    const directions = await prisma.studyDirection.findMany({
      include: { translations: true },
    })

    const locales = ['en', 'ru', 'kk', 'tr']
    
    for (const direction of directions) {
      // Each direction should have exactly 4 translations
      expect(direction.translations.length).toBe(4)
      
      // Check all locales are present
      const directionLocales = direction.translations.map((t) => t.locale)
      for (const locale of locales) {
        expect(directionLocales).toContain(locale)
      }
    }
  })

  it('should have unique slugs per locale', async () => {
    const translations = await prisma.studyDirectionTranslation.findMany()
    
    const locales = ['en', 'ru', 'kk', 'tr']
    
    for (const locale of locales) {
      const localeTranslations = translations.filter((t) => t.locale === locale)
      const slugs = localeTranslations.map((t) => t.slug)
      const uniqueSlugs = new Set(slugs)
      
      // All slugs should be unique within a locale
      expect(slugs.length).toBe(uniqueSlugs.size)
    }
  })

  it('should match direction slugs used in university files', async () => {
    // Expected slugs from university JSON files (from T001 analysis)
    const expectedSlugs = [
      'accounting',
      'aerospace-engineering',
      'architecture',
      'artificial-intelligence',
      'biology',
      'biotechnology',
      'business',
      'civil-engineering',
      'communication',
      'computer-engineering',
      'computer-science',
      'cybersecurity',
      'dentistry',
      'design',
      'economics',
      'education',
      'electrical-electronics-engineering',
      'entrepreneurship',
      'finance',
      'fine-arts',
      'history',
      'industrial-engineering',
      'information-systems',
      'international-relations',
      'journalism-media',
      'languages-linguistics',
      'law',
      'management',
      'marketing',
      'mechanical-engineering',
      'mechatronics',
      'medicine',
      'music',
      'nursing',
      'pharmacy',
      'philosophy',
      'political-science',
      'psychology',
      'public-health',
      'sociology',
      'software-engineering',
      'theatre',
      'tourism-hospitality',
    ]

    const translations = await prisma.studyDirectionTranslation.findMany({
      where: { locale: 'en' }, // Check English translations
    })

    const seededSlugs = translations.map((t) => t.slug).sort()
    
    // All expected slugs should be present
    for (const expectedSlug of expectedSlugs) {
      expect(seededSlugs).toContain(expectedSlug)
    }
  })

  it('should have non-empty names for all translations', async () => {
    const translations = await prisma.studyDirectionTranslation.findMany()
    
    for (const translation of translations) {
      expect(translation.name).toBeTruthy()
      expect(translation.name).not.toBeNull()
      if (translation.name) {
        expect(translation.name.length).toBeGreaterThan(0)
      }
    }
  })

  it('should have valid slug format', async () => {
    const translations = await prisma.studyDirectionTranslation.findMany()
    
    // Slug should be lowercase with hyphens only
    const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/
    
    for (const translation of translations) {
      expect(translation.slug).toMatch(slugPattern)
    }
  })
})
