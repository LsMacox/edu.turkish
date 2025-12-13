/*
 CLI: Import/Upsert a full University with related data from a JSON file.
 Usage:
  - npx tsx scripts/import-university.ts /absolute/path/to/university.json [--upsert-by=slug]

 Behavior:
  - Validates input JSON (zod)
  - Upserts University (by slug or title) and creates/updates:
    translations, languages, academic programs (+translations),
    study directions (+translations) and link via UniversityDirection,
    campus facilities (+translations), dormitories (+translations),
    admission requirements (+translations), required documents (+translations),
    important dates (+translations), scholarships (+translations), reviews (+translations)
  - Creates missing StudyDirections by slug/name when linking
*/

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { z } from 'zod'
import { prisma } from '../lib/infrastructure/prisma'
import prismaPkg from '@prisma/client'
import type { UniversityType, DegreeType } from '@prisma/client'
const { Prisma } = prismaPkg as any

const Locale = z.string().min(2).max(5)

// removed unused TranslationString schema

// Внимание: входной JSON НЕ содержит массивов переводов. Все строки заданы в одном locale.

// Программы в snake_case как в JSON
const ProgramInput = z.object({
  name: z.string(),
  description: z.string().optional(),
  degree_type: z.enum(['bachelor', 'master', 'phd']),
  language: z.string().min(2).max(5),
  duration_years: z.number().int().positive(),
  tuition_per_year: z.number().nonnegative(),
  // Необязательная привязка программы к направлению (канонический slug)
  direction_slug: z.string().optional(),
  translation: z
    .object({
      locale: Locale,
      name: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
})

// Направления теперь поддерживаются в упрощённом импорте через список directions на уровне университета
// и/или через programs[].direction_slug

// Инфраструктура кампуса (переводимые поля name/description)
const FacilityInput = z.object({
  name: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  icon: z.string().optional(),
  is_active: z.boolean().optional(),
  translation: z
    .object({
      locale: Locale,
      name: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
})

const RequirementInput = z.object({
  category: z.string(),
  requirement: z.string(),
  details: z.string().optional(),
  translation: z
    .object({
      locale: Locale,
      category: z.string().optional(),
      requirement: z.string().optional(),
      details: z.string().optional(),
    })
    .optional(),
})

const DocumentInput = z.object({
  name: z.string(),
  description: z.string().optional(),
  format_requirements: z.array(z.string()).optional().default([]),
  translation: z
    .object({
      locale: Locale,
      name: z.string().optional(),
      description: z.string().optional(),
      format_requirements: z.array(z.string()).optional(),
    })
    .optional(),
})

const ImportantDateInput = z.object({
  event: z.string(),
  date: z.string(),
  type: z.enum(['deadline', 'event', 'exam', 'notification']),
  translation: z
    .object({
      locale: Locale,
      event: z.string().optional(),
    })
    .optional(),
})

const ScholarshipInput = z.object({
  name: z.string(),
  type: z.enum(['government', 'university', 'private']),
  coverage_percentage: z.number().int().min(0).max(100),
  eligibility_criteria: z.array(z.string()).default([]),
  application_deadline: z.string().optional(),
  translation: z
    .object({
      locale: Locale,
      name: z.string().optional(),
      eligibility_criteria: z.array(z.string()).optional(),
    })
    .optional(),
})

// Removed unused ReviewInput schema

const TuitionRange = z
  .object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().min(3).max(3).optional().default('USD'),
  })
  .optional()

const AboutBlock = z.object({
  history: z.string(),
  mission: z.string(),
  advantages: z
    .array(
      z.union([z.string(), z.object({ title: z.string(), description: z.string().optional() })]),
    )
    .optional()
    .default([]),
})

const MediaItem = z.object({
  kind: z.enum(['image', 'video']).default('image'),
  url: z.string(),
  thumbnailUrl: z.string().optional(),
  alt: z.string().optional(),
  title: z.string().optional(),
  caption: z.string().optional(),
  translation: z
    .object({
      locale: Locale,
      title: z.string().optional(),
      alt: z.string().optional(),
      caption: z.string().optional(),
    })
    .optional(),
})

const CampusLife = z
  .object({
    gallery: z.array(MediaItem).optional().default([]),
    facilities: z.array(FacilityInput).optional().default([]),
  })
  .optional()

const AdmissionSection = z
  .object({
    requirements: z.array(RequirementInput).optional().default([]),
    documents: z.array(DocumentInput).optional().default([]),
    dates: z.array(ImportantDateInput).optional().default([]),
    scholarships: z.array(ScholarshipInput).optional().default([]),
  })
  .optional()

const UniversityInput = z.object({
  locale: Locale,
  countryCode: z.string().min(3).max(3),
  countryName: z.string().optional(),
  title: z.string(),
  description: z.string(),
  slug: z.string().min(2),
  city: z.string(),
  foundedYear: z.number().int().optional(),
  type: z.enum(['state', 'private', 'tech', 'elite']),
  tuitionRange: TuitionRange,
  rankingScore: z.number().int().optional(),
  totalStudents: z.number().int().optional(),
  internationalStudents: z.number().int().optional(),
  hasAccommodation: z.boolean().optional(),
  hasScholarships: z.boolean().optional(),
  heroImage: z.string().optional(),
  image: z.string().optional(),
  about: AboutBlock,
  key_info_texts: z.record(z.string(), z.unknown()).optional(),
  campus_life: CampusLife,
  admission: AdmissionSection,
  programs: z.array(ProgramInput),
  // Необязательный явный список направлений, к которым относится университет
  directions: z.array(z.string()).optional(),
  translation: z
    .object({
      locale: Locale,
      title: z.string().optional(),
      description: z.string().optional(),
      slug: z.string().optional(),
      about: AboutBlock.partial().optional(),
      key_info_texts: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),
})

type UniversityInputType = z.infer<typeof UniversityInput>

async function main(): Promise<void> {
  const [fileArg, ...rest] = process.argv.slice(2)
  if (!fileArg) {
    console.error(
      'Usage: tsx scripts/import-university.ts /path/to/university.json [--upsert-by=slug|title]',
    )
    process.exit(1)
  }
  const upsertBy = (rest.find((a) => a.startsWith('--upsert-by='))?.split('=')[1] ?? 'slug') as
    | 'slug'
    | 'title'

  const abs = resolve(process.cwd(), fileArg)
  const raw = readFileSync(abs, 'utf-8')
  const jsonRaw: any = JSON.parse(raw)
  const data = UniversityInput.parse(jsonRaw)

  const { countryId, cityId } = await ensureCountryAndCity(data)
  const universityId = await upsertUniversity(data, upsertBy, countryId, cityId)

  // Replace related entities with provided payload (simple and deterministic)
  await replacePrograms(universityId, data.locale, data.programs)
  // Link study directions based on explicit list or program-level hints
  await linkDirectionsForUniversity(universityId, data.locale, data)
  await replaceFacilities(universityId, data.locale, data.campus_life?.facilities ?? [])
  await replaceMedia(universityId, data.locale, data.campus_life?.gallery ?? [])
  await replaceRequirements(universityId, data.locale, data.admission?.requirements ?? [])
  await replaceDocuments(universityId, data.locale, data.admission?.documents ?? [])
  await replaceImportantDates(universityId, data.locale, data.admission?.dates ?? [])
  await replaceScholarships(universityId, data.locale, data.admission?.scholarships ?? [])

  await prisma.$disconnect()
  console.log(`Import completed for universityId=${universityId}`)
}

async function upsertUniversity(
  data: UniversityInputType,
  by: 'slug' | 'title',
  countryId: number,
  cityId: number,
): Promise<number> {
  const baseSlug = data.slug
  // Найдём существующий университет по переводу (slug+locale)
  const existingTranslation = await (prisma as any).UniversityTranslation.findFirst({
    where: { locale: data.locale, slug: baseSlug },
  })

  let universityId: number
  if (existingTranslation) {
    universityId = existingTranslation.universityId
    await (prisma as any).University.update({
      where: { id: universityId },
      data: {
        countryId,
        cityId,
        foundedYear: data.foundedYear,
        type: data.type as UniversityType,
        tuitionMin:
          data.tuitionRange?.min !== undefined
            ? new Prisma.Decimal(data.tuitionRange.min)
            : undefined,
        tuitionMax:
          data.tuitionRange?.max !== undefined
            ? new Prisma.Decimal(data.tuitionRange.max)
            : undefined,
        currency: data.tuitionRange?.currency || 'USD',
        totalStudents: data.totalStudents,
        internationalStudents: data.internationalStudents,
        rankingScore: data.rankingScore,
        hasAccommodation: data.hasAccommodation ?? false,
        hasScholarships: data.hasScholarships ?? false,
        heroImage: data.heroImage,
        image: data.image,
      },
    })
  } else {
    const created = await (prisma as any).University.create({
      data: {
        countryId,
        cityId,
        foundedYear: data.foundedYear,
        type: data.type as UniversityType,
        tuitionMin:
          data.tuitionRange?.min !== undefined
            ? new Prisma.Decimal(data.tuitionRange.min)
            : undefined,
        tuitionMax:
          data.tuitionRange?.max !== undefined
            ? new Prisma.Decimal(data.tuitionRange.max)
            : undefined,
        currency: data.tuitionRange?.currency || 'USD',
        totalStudents: data.totalStudents,
        internationalStudents: data.internationalStudents,
        rankingScore: data.rankingScore,
        hasAccommodation: data.hasAccommodation ?? false,
        hasScholarships: data.hasScholarships ?? false,
        heroImage: data.heroImage,
        image: data.image,
      },
    })
    universityId = created.id
  }

  // Upsert перевод университета под выбранный locale
  const existingUT = await (prisma as any).UniversityTranslation.findFirst({
    where: { universityId, locale: data.locale },
  })
  if (existingUT) {
    await (prisma as any).UniversityTranslation.update({
      where: { id: existingUT.id },
      data: {
        slug: baseSlug,
        title: data.title,
        description: data.description,
        about: data.about as any,
        keyInfoTexts: data.key_info_texts as any,
      },
    })
  } else {
    await (prisma as any).UniversityTranslation.create({
      data: {
        universityId,
        locale: data.locale,
        slug: baseSlug,
        title: data.title,
        description: data.description,
        about: data.about as any,
        keyInfoTexts: data.key_info_texts as any,
      },
    })
  }

  // Дополнительный перевод университета (опционально)
  if (data.translation?.locale) {
    const t = data.translation
    await (prisma as any).UniversityTranslation.upsert({
      where: { universityId_locale: { universityId, locale: t.locale } },
      update: {
        slug: t.slug ?? baseSlug,
        title: t.title,
        description: t.description,
        about: (t.about as any) ?? undefined,
        keyInfoTexts: (t.key_info_texts as any) ?? undefined,
      },
      create: {
        universityId,
        locale: t.locale,
        slug: t.slug ?? baseSlug,
        title: t.title ?? data.title,
        description: t.description ?? data.description,
        about: (t.about as any) ?? (data.about as any),
        keyInfoTexts: (t.key_info_texts as any) ?? (data.key_info_texts as any),
      },
    })
  }

  return universityId
}

async function replacePrograms(
  universityId: number,
  locale: string,
  programs: Array<z.infer<typeof ProgramInput>>,
): Promise<void> {
  await (prisma as any).UniversityProgramTranslation.deleteMany({
    where: { program: { universityId } },
  })
  await (prisma as any).UniversityProgram.deleteMany({ where: { universityId } })
  for (const p of programs) {
    const created = await (prisma as any).UniversityProgram.create({
      data: {
        universityId,
        degreeType: p.degree_type as DegreeType,
        languageCode: p.language,
        durationYears: p.duration_years,
        tuitionPerYear: new Prisma.Decimal(p.tuition_per_year),
      },
    })
    await (prisma as any).UniversityProgramTranslation.create({
      data: {
        programId: created.id,
        locale,
        name: p.name,
      },
    })
    if (p.translation?.locale) {
      await (prisma as any).UniversityProgramTranslation.upsert({
        where: { programId_locale: { programId: created.id, locale: p.translation.locale } },
        update: { name: p.translation.name },
        create: {
          programId: created.id,
          locale: p.translation.locale,
          name: p.translation.name,
        },
      })
    }
  }
}

// Ensure direction exists and has translation for given locale
async function ensureDirectionAndTranslation(slug: string, locale: string): Promise<number> {
  // Find direction by any translation with this slug
  const existingDirection = await (prisma as any).StudyDirection.findFirst({
    where: { translations: { some: { slug } } },
    include: { translations: true },
  })

  let directionId: number
  if (!existingDirection) {
    // Create empty direction and translations for all locales
    const created = await (prisma as any).StudyDirection.create({ data: {} })
    directionId = created.id
    // Create translations for all supported locales
    const locales = ['ru', 'en', 'tr', 'kk'] as const
    for (const loc of locales) {
      await (prisma as any).StudyDirectionTranslation.create({
        data: {
          directionId,
          locale: loc,
          slug,
          name: slug, // Use slug as fallback name
        },
      })
    }
  } else {
    directionId = existingDirection.id
    // Ensure translation exists for current locale
    const hasLocale = (existingDirection.translations as any[]).some(
      (t: any) => t.locale === locale,
    )
    if (!hasLocale) {
      // Create translation with slug as name (should exist from seed)
      await (prisma as any).StudyDirectionTranslation.create({
        data: { directionId, locale, slug, name: slug },
      })
    }
  }

  return directionId
}

async function linkDirectionsForUniversity(
  universityId: number,
  locale: string,
  data: z.infer<typeof UniversityInput>,
): Promise<void> {
  const isDirectionSlug = (val: unknown): val is string => typeof val === 'string' && val.length > 0

  // Соберем список слагов: явные directions + из программ
  const fromPrograms = (data.programs || []).map((p) => p.direction_slug).filter(isDirectionSlug)
  const explicit = (data.directions || []).filter(isDirectionSlug)
  const slugs: string[] = Array.from(new Set<string>([...explicit, ...fromPrograms]))
  if (slugs.length === 0) return

  for (const slug of slugs) {
    const directionId = await ensureDirectionAndTranslation(slug, locale)
    // Связь уникальна по [universityId, directionId]
    await (prisma as any).UniversityStudyDirection.upsert({
      where: { universityId_directionId: { universityId, directionId } },
      update: {},
      create: { universityId, directionId },
    })
  }
}

async function replaceFacilities(
  universityId: number,
  locale: string,
  facilities: Array<z.infer<typeof FacilityInput>>,
): Promise<void> {
  await (prisma as any).universityCampusFacilityTranslation.deleteMany({
    where: { facility: { universityId } },
  })
  await (prisma as any).universityCampusFacility.deleteMany({ where: { universityId } })
  for (const f of facilities) {
    const created = await (prisma as any).universityCampusFacility.create({
      data: {
        universityId,
        image: f.image,
        isActive: f.is_active ?? true,
        icon: f.icon,
      },
    })
    await (prisma as any).universityCampusFacilityTranslation.create({
      data: {
        facilityId: created.id,
        locale,
        name: f.name,
        description: f.description,
      },
    })
    if (f.translation?.locale) {
      await (prisma as any).universityCampusFacilityTranslation.upsert({
        where: { facilityId_locale: { facilityId: created.id, locale: f.translation.locale } },
        update: { name: f.translation.name, description: f.translation.description },
        create: {
          facilityId: created.id,
          locale: f.translation.locale,
          name: f.translation.name,
          description: f.translation.description,
        },
      })
    }
  }
}

async function replaceRequirements(
  universityId: number,
  locale: string,
  reqs: Array<z.infer<typeof RequirementInput>>,
): Promise<void> {
  await (prisma as any).UniversityAdmissionRequirementTranslation.deleteMany({
    where: { admissionRequirement: { universityId } },
  })
  await (prisma as any).UniversityAdmissionRequirement.deleteMany({ where: { universityId } })
  for (const r of reqs) {
    const created = await (prisma as any).UniversityAdmissionRequirement.create({
      data: { universityId },
    })
    await (prisma as any).UniversityAdmissionRequirementTranslation.create({
      data: {
        requirementId: created.id,
        locale,
        category: r.category,
        requirement: r.requirement,
        details: r.details,
      },
    })
    if (r.translation?.locale) {
      await (prisma as any).UniversityAdmissionRequirementTranslation.upsert({
        where: {
          requirementId_locale: { requirementId: created.id, locale: r.translation.locale },
        },
        update: {
          category: r.translation.category,
          requirement: r.translation.requirement,
          details: r.translation.details,
        },
        create: {
          requirementId: created.id,
          locale: r.translation.locale,
          category: r.translation.category,
          requirement: r.translation.requirement,
          details: r.translation.details,
        },
      })
    }
  }
}

async function replaceDocuments(
  universityId: number,
  locale: string,
  docs: Array<z.infer<typeof DocumentInput>>,
): Promise<void> {
  await (prisma as any).UniversityRequiredDocumentTranslation.deleteMany({
    where: { document: { universityId } },
  })
  await (prisma as any).UniversityRequiredDocument.deleteMany({ where: { universityId } })
  for (const d of docs) {
    const created = await (prisma as any).UniversityRequiredDocument.create({
      data: { universityId },
    })
    await (prisma as any).UniversityRequiredDocumentTranslation.create({
      data: {
        documentId: created.id,
        locale,
        name: d.name,
        description: d.description,
        formatRequirements: d.format_requirements as any,
      },
    })
    if (d.translation?.locale) {
      await (prisma as any).UniversityRequiredDocumentTranslation.upsert({
        where: { documentId_locale: { documentId: created.id, locale: d.translation.locale } },
        update: {
          name: d.translation.name,
          description: d.translation.description,
          formatRequirements: d.translation.format_requirements as any,
        },
        create: {
          documentId: created.id,
          locale: d.translation.locale,
          name: d.translation.name,
          description: d.translation.description,
          formatRequirements: d.translation.format_requirements as any,
        },
      })
    }
  }
}

async function replaceImportantDates(
  universityId: number,
  locale: string,
  dates: Array<z.infer<typeof ImportantDateInput>>,
): Promise<void> {
  await (prisma as any).UniversityImportantDateTranslation.deleteMany({
    where: { importantDate: { universityId } },
  })
  await (prisma as any).UniversityImportantDate.deleteMany({ where: { universityId } })
  for (const d of dates) {
    const created = await (prisma as any).UniversityImportantDate.create({
      data: {
        universityId,
        date: new Date(d.date),
        type: d.type,
      },
    })
    await (prisma as any).UniversityImportantDateTranslation.create({
      data: {
        dateId: created.id,
        locale,
        event: d.event,
      },
    })
    if (d.translation?.locale) {
      await (prisma as any).UniversityImportantDateTranslation.upsert({
        where: { dateId_locale: { dateId: created.id, locale: d.translation.locale } },
        update: { event: d.translation.event },
        create: { dateId: created.id, locale: d.translation.locale, event: d.translation.event },
      })
    }
  }
}

async function replaceScholarships(
  universityId: number,
  locale: string,
  scholarships: Array<z.infer<typeof ScholarshipInput>>,
): Promise<void> {
  await (prisma as any).UniversityScholarshipTranslation.deleteMany({
    where: { scholarship: { universityId } },
  })
  await (prisma as any).UniversityScholarship.deleteMany({ where: { universityId } })
  for (const s of scholarships) {
    const created = await (prisma as any).UniversityScholarship.create({
      data: {
        universityId,
        type: s.type,
        coveragePercentage: s.coverage_percentage,
        applicationDeadline: s.application_deadline ? new Date(s.application_deadline) : undefined,
      },
    })
    await (prisma as any).UniversityScholarshipTranslation.create({
      data: {
        scholarshipId: created.id,
        locale,
        name: s.name,
        eligibilityCriteria: s.eligibility_criteria as any,
      },
    })
    if (s.translation?.locale) {
      await (prisma as any).UniversityScholarshipTranslation.upsert({
        where: {
          scholarshipId_locale: { scholarshipId: created.id, locale: s.translation.locale },
        },
        update: {
          name: s.translation.name,
          eligibilityCriteria: s.translation.eligibility_criteria as any,
        },
        create: {
          scholarshipId: created.id,
          locale: s.translation.locale,
          name: s.translation.name,
          eligibilityCriteria: s.translation.eligibility_criteria as any,
        },
      })
    }
  }
}

async function replaceMedia(
  universityId: number,
  locale: string,
  media: Array<z.infer<typeof MediaItem>>,
): Promise<void> {
  await (prisma as any).UniversityMediaAssetTranslation.deleteMany({
    where: { media: { universityId } },
  })
  await (prisma as any).UniversityMediaAsset.deleteMany({ where: { universityId } })
  for (const m of media) {
    const created = await (prisma as any).UniversityMediaAsset.create({
      data: {
        universityId,
        kind: m.kind,
        url: m.url,
        thumbnailUrl: m.thumbnailUrl,
      },
    })
    await (prisma as any).UniversityMediaAssetTranslation.create({
      data: {
        mediaId: created.id,
        locale,
        title: m.title,
        alt: m.alt,
        caption: m.caption,
      },
    })
    if (m.translation?.locale) {
      await (prisma as any).UniversityMediaAssetTranslation.upsert({
        where: { mediaId_locale: { mediaId: created.id, locale: m.translation.locale } },
        update: {
          title: m.translation.title,
          alt: m.translation.alt,
          caption: m.translation.caption,
        },
        create: {
          mediaId: created.id,
          locale: m.translation.locale,
          title: m.translation.title,
          alt: m.translation.alt,
          caption: m.translation.caption,
        },
      })
    }
  }
}

async function ensureCountryAndCity(
  data: UniversityInputType,
): Promise<{ countryId: number; cityId: number }> {
  // Country by ISO Alpha-3 code
  let country = await (prisma as any).Country.findUnique({ where: { code: data.countryCode } })
  if (!country) {
    country = await (prisma as any).Country.create({ data: { code: data.countryCode } })
  }
  // Optional: upsert country translation for locale
  if (data.countryName) {
    await (prisma as any).CountryTranslation.upsert({
      where: { countryId_locale: { countryId: country.id, locale: data.locale } },
      update: { name: data.countryName },
      create: { countryId: country.id, locale: data.locale, name: data.countryName },
    })
  }

  // City: find by translation within the country for the same locale and name
  const cityByTranslation = await (prisma as any).CityTranslation.findFirst({
    where: { locale: data.locale, name: data.city, city: { countryId: country.id } },
    include: { city: true },
  })
  let cityId: number
  if (cityByTranslation) {
    cityId = cityByTranslation.cityId
  } else {
    const city = await (prisma as any).City.create({ data: { countryId: country.id } })
    await (prisma as any).CityTranslation.create({
      data: { cityId: city.id, locale: data.locale, name: data.city },
    })
    cityId = city.id
  }

  return { countryId: country.id, cityId }
}

// Отзывы опущены для простоты импорта

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect().catch(() => { })
  process.exit(1)
})
