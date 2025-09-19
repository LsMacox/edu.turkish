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
import { prisma } from '../lib/prisma'
import { Prisma, UniversityType, DegreeType } from '@prisma/client'
import type { DirectionSlug } from '../app/types/directions'
import { ALL_DIRECTIONS } from '../app/types/directions'
import { readFileSync as fsReadFileSync } from 'node:fs'
import { resolve as pathResolve } from 'node:path'

const Locale = z.string().min(2).max(5)

// Допустимые направления (канонические слаги) — из общего списка
const DirectionSlugZ = z.enum(ALL_DIRECTIONS as [string, ...string[]])

const TranslationString = z.object({
  locale: Locale,
  value: z.string().optional().default('')
})

// Внимание: входной JSON НЕ содержит массивов переводов. Все строки заданы в одном locale.

// Программы в snake_case как в JSON
const ProgramInput = z.object({
  name: z.string(),
  description: z.string().optional(),
  degree_type: z.enum(['bachelor','master','phd']),
  language: z.string().min(2).max(5),
  duration_years: z.number().int().positive(),
  tuition_per_year: z.number().nonnegative(),
  // Необязательная привязка программы к направлению (канонический slug)
  direction_slug: DirectionSlugZ.optional(),
  translation: z.object({
    locale: Locale,
    name: z.string().optional(),
    description: z.string().optional()
  }).optional()
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
  translation: z.object({
    locale: Locale,
    name: z.string().optional(),
    description: z.string().optional()
  }).optional()
})

const RequirementInput = z.object({
  category: z.string(),
  requirement: z.string(),
  details: z.string().optional(),
  translation: z.object({
    locale: Locale,
    category: z.string().optional(),
    requirement: z.string().optional(),
    details: z.string().optional()
  }).optional()
})

const DocumentInput = z.object({
  name: z.string(),
  description: z.string().optional(),
  format_requirements: z.array(z.string()).optional().default([]),
  translation: z.object({
    locale: Locale,
    name: z.string().optional(),
    description: z.string().optional(),
    format_requirements: z.array(z.string()).optional()
  }).optional()
})

const ImportantDateInput = z.object({
  event: z.string(),
  date: z.string(),
  type: z.enum(['deadline','event','exam','notification']),
  translation: z.object({
    locale: Locale,
    event: z.string().optional()
  }).optional()
})

const ScholarshipInput = z.object({
  name: z.string(),
  type: z.enum(['government','university','private']),
  coverage_percentage: z.number().int().min(0).max(100),
  eligibility_criteria: z.array(z.string()).default([]),
  application_deadline: z.string().optional(),
  translation: z.object({
    locale: Locale,
    name: z.string().optional(),
    eligibility_criteria: z.array(z.string()).optional()
  }).optional()
})

const ReviewInput = z.object({
  author: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
  date: z.string().optional()
})

const TuitionRange = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  currency: z.string().min(3).max(3).optional().default('USD')
}).optional()

const AboutBlock = z.object({
  history: z.string(),
  mission: z.string(),
  advantages: z.array(z.union([
    z.string(),
    z.object({ title: z.string(), description: z.string().optional() })
  ])).optional().default([])
})

const RankingInput = z.object({
  national: z.number().int().optional(),
  world: z.number().int().optional(),
  source: z.string().optional()
}).optional()

const StrongProgramCategory = z.object({
  category: z.string(),
  programs: z.array(z.string())
})

const MediaItem = z.object({
  kind: z.enum(['image','video']).default('image'),
  url: z.string(),
  thumbnailUrl: z.string().optional(),
  alt: z.string().optional(),
  title: z.string().optional(),
  caption: z.string().optional(),
  translation: z.object({
    locale: Locale,
    title: z.string().optional(),
    alt: z.string().optional(),
    caption: z.string().optional()
  }).optional()
})

const CampusLife = z.object({
  gallery: z.array(MediaItem).optional().default([]),
  facilities: z.array(FacilityInput).optional().default([])
}).optional()

const AdmissionSection = z.object({
  requirements: z.array(RequirementInput).optional().default([]),
  documents: z.array(DocumentInput).optional().default([]),
  dates: z.array(ImportantDateInput).optional().default([]),
  scholarships: z.array(ScholarshipInput).optional().default([])
}).optional()

const UniversityInput = z.object({
  locale: Locale,
  countryCode: z.string().min(3).max(3),
  countryName: z.string().optional(),
  title: z.string(),
  description: z.string(),
  slug: z.string().min(2),
  city: z.string(),
  foundedYear: z.number().int().optional(),
  type: z.enum(['state','private','tech','elite']),
  tuitionRange: TuitionRange,
  rankingScore: z.number().int().optional(),
  totalStudents: z.number().int().optional(),
  internationalStudents: z.number().int().optional(),
  hasAccommodation: z.boolean().optional(),
  hasScholarships: z.boolean().optional(),
  heroImage: z.string().optional(),
  image: z.string().optional(),
  about: AboutBlock,
  strong_programs: z.array(StrongProgramCategory).optional().default([]),
  key_info_texts: z.record(z.string(), z.unknown()).optional(),
  campus_life: CampusLife,
  admission: AdmissionSection,
  programs: z.array(ProgramInput),
  // Необязательный явный список направлений, к которым относится университет
  directions: z.array(DirectionSlugZ).optional(),
  translation: z.object({
    locale: Locale,
    title: z.string().optional(),
    description: z.string().optional(),
    slug: z.string().optional(),
    about: AboutBlock.partial().optional(),
    strong_programs: z.array(StrongProgramCategory).optional(),
    key_info_texts: z.record(z.string(), z.unknown()).optional()
  }).optional()
})

type UniversityInputType = z.infer<typeof UniversityInput>

async function main(): Promise<void> {
  const [fileArg, ...rest] = process.argv.slice(2)
  if (!fileArg) {
    console.error('Usage: tsx scripts/import-university.ts /path/to/university.json [--upsert-by=slug|title]')
    process.exit(1)
  }
  const upsertBy = (rest.find(a => a.startsWith('--upsert-by='))?.split('=')[1] ?? 'slug') as 'slug' | 'title'

  const abs = resolve(process.cwd(), fileArg)
  const raw = readFileSync(abs, 'utf-8')
  const jsonRaw: any = JSON.parse(raw)
  const data = UniversityInput.parse(jsonRaw)

  const { countryId, cityId } = await ensureCountryAndCity(data)
  const universityId = await upsertUniversity(data, upsertBy, countryId, cityId)

  // Replace related entities with provided payload (simple and deterministic)
  await replacePrograms(universityId, data.locale, data.programs)
  await replaceFeaturedPrograms(universityId, data.locale, data.strong_programs ?? [], data.translation)
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
  cityId: number
): Promise<number> {
  const baseSlug = data.slug
  // Найдём существующий университет по переводу (slug+locale)
  const existingTranslation = await (prisma as any).universityTranslation.findFirst({
    where: { locale: data.locale, slug: baseSlug }
  })

  let universityId: number
  if (existingTranslation) {
    universityId = existingTranslation.universityId
    await (prisma as any).university.update({
      where: { id: universityId },
      data: {
        countryId,
        cityId,
        foundedYear: data.foundedYear,
        type: data.type as UniversityType,
        tuitionMin: data.tuitionRange?.min !== undefined ? new Prisma.Decimal(data.tuitionRange.min) : undefined,
        tuitionMax: data.tuitionRange?.max !== undefined ? new Prisma.Decimal(data.tuitionRange.max) : undefined,
        currency: data.tuitionRange?.currency || 'USD',
        totalStudents: data.totalStudents,
        internationalStudents: data.internationalStudents,
        rankingScore: data.rankingScore,
        hasAccommodation: data.hasAccommodation ?? false,
        hasScholarships: data.hasScholarships ?? false,
        heroImage: data.heroImage,
        image: data.image
      }
    })
  } else {
    const created = await (prisma as any).university.create({
      data: {
        countryId,
        cityId,
        foundedYear: data.foundedYear,
        type: data.type as UniversityType,
        tuitionMin: data.tuitionRange?.min !== undefined ? new Prisma.Decimal(data.tuitionRange.min) : undefined,
        tuitionMax: data.tuitionRange?.max !== undefined ? new Prisma.Decimal(data.tuitionRange.max) : undefined,
        currency: data.tuitionRange?.currency || 'USD',
        totalStudents: data.totalStudents,
        internationalStudents: data.internationalStudents,
        rankingScore: data.rankingScore,
        hasAccommodation: data.hasAccommodation ?? false,
        hasScholarships: data.hasScholarships ?? false,
        heroImage: data.heroImage,
        image: data.image
      }
    })
    universityId = created.id
  }

  // Upsert перевод университета под выбранный locale
  const existingUT = await (prisma as any).universityTranslation.findFirst({ where: { universityId, locale: data.locale } })
  if (existingUT) {
    await (prisma as any).universityTranslation.update({
      where: { id: existingUT.id },
      data: {
        slug: baseSlug,
        title: data.title,
        description: data.description,
        about: data.about as any,
        keyInfoTexts: data.key_info_texts as any
      }
    })
  } else {
    await (prisma as any).universityTranslation.create({
      data: {
        universityId,
        locale: data.locale,
        slug: baseSlug,
        title: data.title,
        description: data.description,
        about: data.about as any,
        keyInfoTexts: data.key_info_texts as any
      }
    })
  }

  // Дополнительный перевод университета (опционально)
  if (data.translation?.locale) {
    const t = data.translation
    await (prisma as any).universityTranslation.upsert({
      where: { universityId_locale: { universityId, locale: t.locale } },
      update: {
        slug: t.slug ?? baseSlug,
        title: t.title,
        description: t.description,
        about: (t.about as any) ?? undefined,
        keyInfoTexts: (t.key_info_texts as any) ?? undefined
      },
      create: {
        universityId,
        locale: t.locale,
        slug: t.slug ?? baseSlug,
        title: t.title ?? data.title,
        description: t.description ?? data.description,
        about: (t.about as any) ?? (data.about as any),
        keyInfoTexts: (t.key_info_texts as any) ?? (data.key_info_texts as any)
      }
    })
  }

  return universityId
}

async function replacePrograms(universityId: number, locale: string, programs: Array<z.infer<typeof ProgramInput>>): Promise<void> {
  await (prisma as any).programTranslation.deleteMany({ where: { program: { universityId } } })
  await (prisma as any).academicProgram.deleteMany({ where: { universityId } })
  for (const p of programs) {
    const created = await (prisma as any).academicProgram.create({
      data: {
        universityId,
        degreeType: p.degree_type as DegreeType,
        languageCode: p.language,
        durationYears: p.duration_years,
        tuitionPerYear: new Prisma.Decimal(p.tuition_per_year)
      }
    })
    await (prisma as any).programTranslation.create({
      data: {
        programId: created.id,
        locale,
        name: p.name,
        description: p.description
      }
    })
    if (p.translation?.locale) {
      await (prisma as any).programTranslation.upsert({
        where: { programId_locale: { programId: created.id, locale: p.translation.locale } },
        update: { name: p.translation.name, description: p.translation.description },
        create: { programId: created.id, locale: p.translation.locale, name: p.translation.name, description: p.translation.description }
      })
    }
  }
}

async function replaceFeaturedPrograms(
  universityId: number,
  baseLocale: string,
  categories: Array<z.infer<typeof StrongProgramCategory>>,
  translation?: z.infer<typeof UniversityInput>['translation']
): Promise<void> {
  await (prisma as any).featuredProgramTranslation.deleteMany({ where: { featuredProgram: { universityId } } })
  await (prisma as any).featuredProgram.deleteMany({ where: { universityId } })

  if (!categories || categories.length === 0) return

  const programTranslations = await (prisma as any).programTranslation.findMany({
    where: { program: { universityId } },
    include: { program: true }
  })

  const normalizeKey = (locale: string, value: string | null | undefined): string =>
    `${locale.toLowerCase()}|${(value || '').trim().toLowerCase()}`

  const programIndex = new Map<string, number>()
  for (const pt of programTranslations) {
    if (!pt.name) continue
    programIndex.set(normalizeKey(pt.locale, pt.name), pt.programId)
  }

  type CreatedEntry = { id: number; categoryIndex: number }
  const createdEntries: CreatedEntry[] = []
  let orderCounter = 0
  // Avoid duplicate featured entries for the same program within one university
  const usedProgramIds = new Set<number>()

  for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
    const category = categories[categoryIndex]
    const label = category?.category?.trim() || null
    const programs = Array.isArray(category?.programs) ? category.programs : []

    for (const programNameRaw of programs) {
      const nameTrimmed = (programNameRaw || '').trim()
      if (!nameTrimmed) continue

      let programId = programIndex.get(normalizeKey(baseLocale, nameTrimmed))
      if (!programId) {
        const fallback = programTranslations.find(
          pt => (pt.name || '').trim().toLowerCase() === nameTrimmed.toLowerCase()
        )
        if (fallback) {
          programId = fallback.programId
        }
      }

      if (!programId) {
        console.warn(`⚠️ Program not found for featured list: ${programNameRaw}`)
        continue
      }

      // Skip duplicates to satisfy unique constraint [universityId, programId]
      if (usedProgramIds.has(programId)) {
        continue
      }

      const created = await (prisma as any).featuredProgram.create({
        data: {
          universityId,
          programId,
          displayOrder: orderCounter++,
          translations: {
            create: {
              locale: baseLocale,
              label
            }
          }
        }
      })

      usedProgramIds.add(programId)
      createdEntries.push({ id: created.id, categoryIndex })
    }
  }

  const translationLocale = translation?.locale
  const translatedCategories = translation?.strong_programs
  if (!translationLocale || !translatedCategories || translatedCategories.length === 0) {
    return
  }

  for (const entry of createdEntries) {
    const translatedCategory = translatedCategories[entry.categoryIndex]
    const translatedLabel = translatedCategory?.category?.trim()
    if (!translatedLabel) continue

    await (prisma as any).featuredProgramTranslation.upsert({
      where: { featuredProgramId_locale: { featuredProgramId: entry.id, locale: translationLocale } },
      update: { label: translatedLabel },
      create: {
        featuredProgramId: entry.id,
        locale: translationLocale,
        label: translatedLabel
      }
    })
  }
}

// Локализованные названия по умолчанию для направлений
async function ensureDirectionAndTranslation(slug: DirectionSlug, locale: string): Promise<number> {
  // Ищем направление по любому переводу с этим slug
  const existingDirection = await (prisma as any).studyDirection.findFirst({
    where: { translations: { some: { slug } } },
    include: { translations: true }
  })

  let directionId: number
  if (!existingDirection) {
    // Создаем пустое направление и переводы для ключевых локалей
    const created = await (prisma as any).studyDirection.create({ data: {} })
    directionId = created.id
    const names = getDirectionNames()[slug]
    // Сразу создаем RU/EN/TR/KK переводы для удобства
    const locales = ['ru', 'en', 'tr', 'kk'] as const
    for (const loc of locales) {
      await (prisma as any).directionTranslation.create({
        data: {
          directionId,
          locale: loc,
          slug,
          name: (names as any)?.[loc] ?? slug
        }
      })
    }
  } else {
    directionId = existingDirection.id
    // Убедимся, что есть перевод для текущей локали
    const hasLocale = (existingDirection.translations as any[]).some((t: any) => t.locale === locale)
    if (!hasLocale) {
      const names = getDirectionNames()[slug]
      await (prisma as any).directionTranslation.create({
        data: { directionId, locale, slug, name: (names as any)?.[locale] ?? slug }
      })
    }
  }

  return directionId
}

// Lazy-load and cache i18n/directions.json
type DirectionNames = Record<DirectionSlug, { ru?: string; en?: string; tr?: string }>
let directionNamesCache: DirectionNames | undefined
function getDirectionNames(): DirectionNames {
  if (directionNamesCache) return directionNamesCache as DirectionNames
  const jsonPath = pathResolve(process.cwd(), 'i18n', 'directions.json')
  try {
    const raw = fsReadFileSync(jsonPath, 'utf-8')
    directionNamesCache = JSON.parse(raw) as DirectionNames
  } catch {
    directionNamesCache = {} as DirectionNames
  }
  return directionNamesCache as DirectionNames
}

async function linkDirectionsForUniversity(
  universityId: number,
  locale: string,
  data: z.infer<typeof UniversityInput>
): Promise<void> {
  const isDirectionSlug = (val: unknown): val is DirectionSlug =>
    typeof val === 'string' && (ALL_DIRECTIONS as readonly string[]).includes(val)

  // Соберем список слагов: явные directions + из программ
  const fromPrograms = (data.programs || [])
    .map(p => p.direction_slug)
    .filter(isDirectionSlug)
  const explicit = (data.directions || []).filter(isDirectionSlug)
  const slugs: DirectionSlug[] = Array.from(new Set<DirectionSlug>([...explicit, ...fromPrograms]))
  if (slugs.length === 0) return

  for (const slug of slugs) {
    const directionId = await ensureDirectionAndTranslation(slug, locale)
    // Связь уникальна по [universityId, directionId]
    await (prisma as any).universityDirection.upsert({
      where: { universityId_directionId: { universityId, directionId } },
      update: {},
      create: { universityId, directionId }
    })
  }
}

async function replaceFacilities(universityId: number, locale: string, facilities: Array<z.infer<typeof FacilityInput>>): Promise<void> {
  await (prisma as any).facilityTranslation.deleteMany({ where: { facility: { universityId } } })
  await (prisma as any).campusFacility.deleteMany({ where: { universityId } })
  for (const f of facilities) {
    const created = await (prisma as any).campusFacility.create({
      data: {
        universityId,
        image: f.image,
        isActive: f.is_active ?? true,
        icon: f.icon
      }
    })
    await (prisma as any).facilityTranslation.create({
      data: {
        facilityId: created.id,
        locale,
        name: f.name,
        description: f.description
      }
    })
    if (f.translation?.locale) {
      await (prisma as any).facilityTranslation.upsert({
        where: { facilityId_locale: { facilityId: created.id, locale: f.translation.locale } },
        update: { name: f.translation.name, description: f.translation.description },
        create: { facilityId: created.id, locale: f.translation.locale, name: f.translation.name, description: f.translation.description }
      })
    }
  }
}

async function replaceRequirements(universityId: number, locale: string, reqs: Array<z.infer<typeof RequirementInput>>): Promise<void> {
  await (prisma as any).requirementTranslation.deleteMany({ where: { admissionRequirement: { universityId } } })
  await (prisma as any).admissionRequirement.deleteMany({ where: { universityId } })
  for (const r of reqs) {
    const created = await (prisma as any).admissionRequirement.create({ data: { universityId } })
    await (prisma as any).requirementTranslation.create({
      data: {
        requirementId: created.id,
        locale,
        category: r.category,
        requirement: r.requirement,
        details: r.details
      }
    })
    if (r.translation?.locale) {
      await (prisma as any).requirementTranslation.upsert({
        where: { requirementId_locale: { requirementId: created.id, locale: r.translation.locale } },
        update: { category: r.translation.category, requirement: r.translation.requirement, details: r.translation.details },
        create: { requirementId: created.id, locale: r.translation.locale, category: r.translation.category, requirement: r.translation.requirement, details: r.translation.details }
      })
    }
  }
}

async function replaceDocuments(universityId: number, locale: string, docs: Array<z.infer<typeof DocumentInput>>): Promise<void> {
  await (prisma as any).documentTranslation.deleteMany({ where: { document: { universityId } } })
  await (prisma as any).requiredDocument.deleteMany({ where: { universityId } })
  for (const d of docs) {
    const created = await (prisma as any).requiredDocument.create({ data: { universityId } })
    await (prisma as any).documentTranslation.create({
      data: {
        documentId: created.id,
        locale,
        name: d.name,
        description: d.description,
        formatRequirements: d.format_requirements as any
      }
    })
    if (d.translation?.locale) {
      await (prisma as any).documentTranslation.upsert({
        where: { documentId_locale: { documentId: created.id, locale: d.translation.locale } },
        update: { name: d.translation.name, description: d.translation.description, formatRequirements: d.translation.format_requirements as any },
        create: { documentId: created.id, locale: d.translation.locale, name: d.translation.name, description: d.translation.description, formatRequirements: d.translation.format_requirements as any }
      })
    }
  }
}

async function replaceImportantDates(universityId: number, locale: string, dates: Array<z.infer<typeof ImportantDateInput>>): Promise<void> {
  await (prisma as any).dateTranslation.deleteMany({ where: { importantDate: { universityId } } })
  await (prisma as any).importantDate.deleteMany({ where: { universityId } })
  for (const d of dates) {
    const created = await (prisma as any).importantDate.create({
      data: {
        universityId,
        date: new Date(d.date),
        type: d.type
      }
    })
    await (prisma as any).dateTranslation.create({
      data: {
        dateId: created.id,
        locale,
        event: d.event
      }
    })
    if (d.translation?.locale) {
      await (prisma as any).dateTranslation.upsert({
        where: { dateId_locale: { dateId: created.id, locale: d.translation.locale } },
        update: { event: d.translation.event },
        create: { dateId: created.id, locale: d.translation.locale, event: d.translation.event }
      })
    }
  }
}

async function replaceScholarships(universityId: number, locale: string, scholarships: Array<z.infer<typeof ScholarshipInput>>): Promise<void> {
  await (prisma as any).scholarshipTranslation.deleteMany({ where: { scholarship: { universityId } } })
  await (prisma as any).scholarship.deleteMany({ where: { universityId } })
  for (const s of scholarships) {
    const created = await (prisma as any).scholarship.create({
      data: {
        universityId,
        type: s.type,
        coveragePercentage: s.coverage_percentage,
        applicationDeadline: s.application_deadline ? new Date(s.application_deadline) : undefined
      }
    })
    await (prisma as any).scholarshipTranslation.create({
      data: {
        scholarshipId: created.id,
        locale,
        name: s.name,
        eligibilityCriteria: s.eligibility_criteria as any
      }
    })
    if (s.translation?.locale) {
      await (prisma as any).scholarshipTranslation.upsert({
        where: { scholarshipId_locale: { scholarshipId: created.id, locale: s.translation.locale } },
        update: { name: s.translation.name, eligibilityCriteria: s.translation.eligibility_criteria as any },
        create: { scholarshipId: created.id, locale: s.translation.locale, name: s.translation.name, eligibilityCriteria: s.translation.eligibility_criteria as any }
      })
    }
  }
}

async function replaceMedia(universityId: number, locale: string, media: Array<z.infer<typeof MediaItem>>): Promise<void> {
  await (prisma as any).universityMediaTranslation.deleteMany({ where: { media: { universityId } } })
  await (prisma as any).universityMedia.deleteMany({ where: { universityId } })
  for (const m of media) {
    const created = await (prisma as any).universityMedia.create({
      data: {
        universityId,
        kind: m.kind,
        url: m.url,
        thumbnailUrl: m.thumbnailUrl
      }
    })
    await (prisma as any).universityMediaTranslation.create({
      data: {
        mediaId: created.id,
        locale,
        title: m.title,
        alt: m.alt,
        caption: m.caption
      }
    })
    if (m.translation?.locale) {
      await (prisma as any).universityMediaTranslation.upsert({
        where: { mediaId_locale: { mediaId: created.id, locale: m.translation.locale } },
        update: { title: m.translation.title, alt: m.translation.alt, caption: m.translation.caption },
        create: { mediaId: created.id, locale: m.translation.locale, title: m.translation.title, alt: m.translation.alt, caption: m.translation.caption }
      })
    }
  }
}

async function ensureCountryAndCity(data: UniversityInputType): Promise<{ countryId: number; cityId: number }> {
  // Country by ISO Alpha-3 code
  let country = await (prisma as any).country.findUnique({ where: { code: data.countryCode } })
  if (!country) {
    country = await (prisma as any).country.create({ data: { code: data.countryCode } })
  }
  // Optional: upsert country translation for locale
  if (data.countryName) {
    await (prisma as any).countryTranslation.upsert({
      where: { countryId_locale: { countryId: country.id, locale: data.locale } },
      update: { name: data.countryName },
      create: { countryId: country.id, locale: data.locale, name: data.countryName }
    })
  }

  // City: find by translation within the country for the same locale and name
  const cityByTranslation = await (prisma as any).cityTranslation.findFirst({
    where: { locale: data.locale, name: data.city, city: { countryId: country.id } },
    include: { city: true }
  })
  let cityId: number
  if (cityByTranslation) {
    cityId = cityByTranslation.cityId
  } else {
    const city = await (prisma as any).city.create({ data: { countryId: country.id } })
    await (prisma as any).cityTranslation.create({ data: { cityId: city.id, locale: data.locale, name: data.city } })
    cityId = city.id
  }

  return { countryId: country.id, cityId }
}

// Отзывы опущены для простоты импорта

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect().catch(() => {})
  process.exit(1)
})


