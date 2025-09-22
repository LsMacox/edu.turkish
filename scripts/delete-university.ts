/*
 CLI: Delete a University and all related data by slug.

 Usage:
  - npx tsx scripts/delete-university.ts --slug=bogazici-university [--locale=ru] [--dry-run] [--yes]

 Behavior:
  - Resolves university by UniversityTranslation.slug (optionally narrowed by --locale).
  - Deletes the University record. Due to onDelete: Cascade in Prisma schema, all related rows
    (translations, programs (+translations), facilities (+translations), requirements (+translations),
     documents (+translations), dates (+translations), scholarships (+translations), media (+translations),
     universityStudyDirections link table) are removed automatically.
  - Reviews have onDelete SetNull; this script will explicitly delete reviews (their translations cascade from review).
  - Supports --dry-run to preview what would be deleted.
  - Use --yes for non-interactive confirmation.
*/

import { prisma } from '../lib/prisma'

interface CliOptions {
  slug: string | null
  locale: string | null
  dryRun: boolean
  yes: boolean
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = { slug: null, locale: null, dryRun: false, yes: false }
  for (const arg of argv) {
    if (arg.startsWith('--slug=')) {
      const v = arg.split('=')[1]
      if (v) opts.slug = v
    } else if (arg.startsWith('--locale=')) {
      const v = arg.split('=')[1]
      if (v) opts.locale = v
    } else if (arg === '--dry-run') {
      opts.dryRun = true
    } else if (arg === '--yes' || arg === '-y') {
      opts.yes = true
    }
  }
  return opts
}

async function resolveUniversityBySlug(slug: string, locale?: string) {
  const where: any = { slug }
  if (locale) where.locale = locale

  const matches = await prisma.universityTranslation.findMany({
    where,
    select: { universityId: true, locale: true },
  })

  if (matches.length === 0) return null

  if (!locale) {
    const uniqueUniversityIds = Array.from(new Set(matches.map((m) => m.universityId)))
    if (uniqueUniversityIds.length > 1) {
      throw new Error(
        `Slug '${slug}' matches multiple universities across locales. Provide --locale to disambiguate.`,
      )
    }
  }

  const { universityId, locale: matchedLocale } = matches[0]
  return { id: universityId, matchedLocale, matchedSlug: slug }
}

async function countRelated(universityId: number) {
  const [
    translations,
    programs,
    programTranslations,
    facilities,
    facilityTranslations,
    requirements,
    requirementTranslations,
    documents,
    documentTranslations,
    dates,
    dateTranslations,
    scholarships,
    scholarshipTranslations,
    uniDirections,
    media,
    mediaTranslations,
    reviews,
    reviewTranslations,
  ] = await Promise.all([
    prisma.universityTranslation.count({ where: { universityId } }),
    prisma.universityProgram.count({ where: { universityId } }),
    prisma.universityProgramTranslation.count({ where: { program: { universityId } } }),
    prisma.universityCampusFacility.count({ where: { universityId } }),
    prisma.universityCampusFacilityTranslation.count({ where: { facility: { universityId } } }),
    prisma.universityAdmissionRequirement.count({ where: { universityId } }),
    prisma.universityAdmissionRequirementTranslation.count({ where: { admissionRequirement: { universityId } } }),
    prisma.universityRequiredDocument.count({ where: { universityId } }),
    prisma.universityRequiredDocumentTranslation.count({ where: { document: { universityId } } }),
    prisma.universityImportantDate.count({ where: { universityId } }),
    prisma.universityImportantDateTranslation.count({ where: { importantDate: { universityId } } }),
    prisma.universityScholarship.count({ where: { universityId } }),
    prisma.universityScholarshipTranslation.count({ where: { scholarship: { universityId } } }),
    prisma.universityStudyDirection.count({ where: { universityId } }),
    (prisma as any).universityMedia.count({ where: { universityId } }),
    (prisma as any).universityMediaTranslation.count({ where: { media: { universityId } } }),
    prisma.universityReview.count({ where: { universityId } }),
    prisma.universityReviewTranslation.count({ where: { review: { universityId } } }),
  ])
  return {
    translations,
    programs,
    programTranslations,
    facilities,
    facilityTranslations,
    requirements,
    requirementTranslations,
    documents,
    documentTranslations,
    dates,
    dateTranslations,
    scholarships,
    scholarshipTranslations,
    uniDirections,
    media,
    mediaTranslations,
    reviews,
    reviewTranslations,
  }
}

async function confirm(question: string, assumeYes: boolean): Promise<boolean> {
  if (assumeYes) return true
  console.log(question + ' Use --yes to confirm in non-interactive mode.')
  return false
}

async function deleteUniversityBySlug(
  slug: string,
  locale: string | null,
  dryRun: boolean,
  yes: boolean,
): Promise<void> {
  const resolved = await resolveUniversityBySlug(slug, locale ?? undefined)
  if (!resolved) {
    console.error(`University not found by slug: ${slug}`)
    process.exit(1)
  }

  const related = await countRelated(resolved.id)
  const totalCascade =
    related.translations +
    related.programs +
    related.programTranslations +
    related.facilities +
    related.facilityTranslations +
    related.requirements +
    related.requirementTranslations +
    related.documents +
    related.documentTranslations +
    related.dates +
    related.dateTranslations +
    related.scholarships +
    related.scholarshipTranslations +
    related.uniDirections +
    related.media +
    related.mediaTranslations
  const totalReviews = related.reviews + related.reviewTranslations

  console.log(
    `About to delete university id=${resolved.id} matchedSlug=${resolved.matchedSlug} locale=${resolved.matchedLocale}`,
  )
  console.log(`Cascade-related records to remove: ${totalCascade}`)
  console.log(`Reviews (+translations) to remove: ${totalReviews}`)

  if (dryRun) {
    console.log('[DryRun] No changes performed')
    return
  }

  const ok = await confirm('Proceed with deletion?', yes)
  if (!ok) {
    console.log('Aborted')
    return
  }

  await prisma.$transaction([
    prisma.universityReview.deleteMany({ where: { universityId: resolved.id } }),
    prisma.university.delete({ where: { id: resolved.id } }),
  ])

  console.log(`Deleted university id=${resolved.id} and related data.`)
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (!opts.slug) {
    console.error(
      'Usage: tsx scripts/delete-university.ts --slug=your-university-slug [--locale=ru] [--dry-run] [--yes]',
    )
    process.exit(1)
  }
  try {
    await deleteUniversityBySlug(opts.slug, opts.locale, opts.dryRun, opts.yes)
  } finally {
    await prisma.$disconnect().catch(() => {})
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
