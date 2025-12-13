/*
Simple translation backfill CLI aligned with current Prisma schema.
Usage examples:
  - npx tsx scripts/translate.ts universities --targets=kk,en,tr --source=ru
  - npx tsx scripts/translate.ts programs --targets=en --source=ru --limit=50 --dry-run
Environment:
  - OPENROUTER_API_KEY must be set for writes (otherwise use --dry-run)
*/

import { prisma } from '../lib/infrastructure/prisma'

type EntityType =
  | 'universities'
  | 'reviews'
  | 'programs'
  | 'faqs'
  | 'facilities'
  | 'requirements'
  | 'documents'
  | 'dates'
  | 'directions'
  | 'scholarships'
  | 'articles'
  | 'blog_categories'
  | 'faq_categories'
  | 'all'

interface CliOptions {
  entity: EntityType
  sourceLocale: string
  targetLocales: string[]
  limit?: number
  dryRun: boolean
  concurrency: number
}

async function translateWithDryRun(
  input: Record<string, string | null | undefined>,
  sourceLocale: string,
  targetLocale: string,
  context: string,
  dryRun: boolean,
): Promise<Record<string, string>> {
  if (dryRun || !process.env.OPENROUTER_API_KEY) {
    const out: Record<string, string> = {}
    for (const k of Object.keys(input)) {
      out[k] = stringifyMaybeJson(input[k]) || ''
    }
    return out
  }
  return callOpenRouterTranslate(input, sourceLocale, targetLocale, context)
}

const DEFAULT_SOURCE = 'ru'
const DEFAULT_TARGETS = ['kk', 'en', 'tr']
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_MODEL = 'z-ai/glm-4.5'

function parseArgs(argv: string[]): CliOptions {
  const [entityRaw, ...rest] = argv
  const allowed: EntityType[] = [
    'universities',
    'reviews',
    'programs',
    'faqs',
    'facilities',
    'requirements',
    'documents',
    'dates',
    'directions',
    'scholarships',
    'articles',
    'blog_categories',
    'faq_categories',
    'all',
  ]
  if (!entityRaw || !allowed.includes(entityRaw as EntityType)) {
    console.error(`First argument must be one of: ${allowed.join(', ')}`)
    process.exit(1)
  }
  const opts: CliOptions = {
    entity: entityRaw as EntityType,
    sourceLocale: DEFAULT_SOURCE,
    targetLocales: [...DEFAULT_TARGETS],
    dryRun: false,
    concurrency: 2,
  }
  for (const arg of rest) {
    if (arg.startsWith('--source=')) {
      opts.sourceLocale = arg.split('=')[1] || DEFAULT_SOURCE
    } else if (arg.startsWith('--targets=')) {
      const v = arg.split('=')[1]
      if (v)
        opts.targetLocales = v
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
    } else if (arg.startsWith('--limit=')) {
      const v = Number(arg.split('=')[1])
      if (!Number.isNaN(v) && v > 0) opts.limit = v
    } else if (arg === '--dry-run') {
      opts.dryRun = true
    } else if (arg.startsWith('--concurrency=')) {
      const v = Number(arg.split('=')[1])
      if (!Number.isNaN(v) && v >= 1 && v <= 8) opts.concurrency = v
    }
  }
  opts.targetLocales = opts.targetLocales.filter((l) => l !== opts.sourceLocale)
  return opts
}

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) {
    console.error(`Environment variable ${name} is required`)
    process.exit(1)
  }
  return v
}

async function callOpenRouterTranslate(
  input: Record<string, string | null | undefined>,
  sourceLocale: string,
  targetLocale: string,
  context: string,
): Promise<Record<string, string>> {
  const apiKey = requireEnv('OPENROUTER_API_KEY')
  const payload = {
    model: OPENROUTER_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are a professional, faithful, concise translator. Preserve proper nouns and academic terminology. Return ONLY valid JSON with the same keys as provided. Do not add extra keys or commentary.',
      },
      {
        role: 'user',
        content: [
          `Source language: ${sourceLocale}`,
          `Target language: ${targetLocale}`,
          'Context:',
          context,
          'Translate the following JSON. Keep line breaks. For empty/undefined fields, return an empty string. Respond with JSON only:',
          JSON.stringify(input),
        ].join('\n'),
      },
    ],
  }

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`OpenRouter error ${res.status}: ${txt}`)
  }
  const data = (await res.json()) as any
  const content: string = data?.choices?.[0]?.message?.content ?? ''
  const jsonText = extractJson(content)
  try {
    const parsed = JSON.parse(jsonText)
    const out: Record<string, string> = {}
    for (const k of Object.keys(input)) {
      const val = parsed?.[k]
      if (typeof val === 'string') {
        out[k] = val
      } else if (val == null) {
        out[k] = ''
      } else {
        try {
          out[k] = JSON.stringify(val)
        } catch {
          out[k] = ''
        }
      }
    }
    return out
  } catch (e) {
    throw new Error(
      `Failed to parse OpenRouter JSON: ${e instanceof Error ? e.message : String(e)}\nContent: ${content}`,
    )
  }
}

function extractJson(s: string): string {
  const start = s.indexOf('{')
  const end = s.lastIndexOf('}')
  if (start !== -1 && end !== -1 && end > start) return s.slice(start, end + 1)
  return s
}

function stringifyMaybeJson(v: unknown): string {
  try {
    if (v == null) return ''
    if (typeof v === 'string') return v
    return JSON.stringify(v)
  } catch {
    return ''
  }
}

function slugify(input: string): string {
  const s = (input || '')
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return s || 'item'
}

async function uniqueUniversitySlug(locale: string, base: string): Promise<string> {
  let candidate = base
  let i = 0
  while (true) {
    const exists = await (prisma as any).universityTranslation.findFirst({
      where: { locale, slug: candidate },
    })
    if (!exists) return candidate
    i += 1
    candidate = `${base}-${i}`
  }
}

async function uniqueDirectionSlug(locale: string, base: string): Promise<string> {
  let candidate = base
  let i = 0
  while (true) {
    const exists = await (prisma as any).studyDirectionTranslation.findFirst({
      where: { locale, slug: candidate },
    })
    if (!exists) return candidate
    i += 1
    candidate = `${base}-${i}`
  }
}

async function uniqueArticleSlug(locale: string, base: string): Promise<string> {
  let candidate = base
  let i = 0
  while (true) {
    const exists = await (prisma as any).blogArticleTranslation.findFirst({
      where: { locale, slug: candidate },
    })
    if (!exists) return candidate
    i += 1
    candidate = `${base}-${i}`
  }
}

async function translateUniversities(opts: CliOptions): Promise<void> {
  const { sourceLocale, targetLocales, limit, dryRun, concurrency } = opts
  const universities = await prisma.university.findMany({
    include: { translations: true },
    take: limit,
  })
  const jobs: Array<() => Promise<void>> = []
  for (const u of universities as any[]) {
    const existing = new Set(u.translations.map((t: any) => t.locale))
    const missing = targetLocales.filter((l) => !existing.has(l))
    const incomplete = u.translations
      .filter((t: any) => targetLocales.includes(t.locale) && !t.about)
      .map((t: any) => t.locale)

    const baseT = u.translations.find((t: any) => t.locale === sourceLocale) || u.translations[0]
    const base = { title: baseT?.title || '', description: baseT?.description || '' }
    const baseAbout = stringifyMaybeJson(baseT?.about)
    const baseKeyInfoTexts = stringifyMaybeJson(baseT?.keyInfoTexts)

    for (const target of missing) {
      jobs.push(async () => {
        const input = {
          title: base.title,
          description: base.description,
          about: baseAbout,
          keyInfoTexts: baseKeyInfoTexts,
        }
        const ctx =
          'University translation fields. about is a JSON object with text fields. keyInfoTexts is a JSON object with localized key info texts. Translate values, keep JSON structure.'
        const out = await translateWithDryRun(input, sourceLocale, target, ctx, dryRun)
        if (dryRun) {
          console.log(`[DryRun][University ${u.id}] => ${target}`, out)
          return
        }
        const titleOut = out.title || ''
        const slugBase = slugify(titleOut || base.title || `university-${u.id}`)
        const unique = await uniqueUniversitySlug(target, slugBase)
        await (prisma as any).universityTranslation.create({
          data: {
            universityId: u.id,
            locale: target,
            slug: unique,
            title: titleOut,
            description: out.description || '',
            about: tryParseJson(out.about),
            keyInfoTexts: tryParseJson(out.keyInfoTexts),
          },
        })
        console.log(`[Created] university_translation u=${u.id} ${sourceLocale}->${target}`)
      })
    }

    for (const target of incomplete) {
      jobs.push(async () => {
        if (!baseAbout && !baseKeyInfoTexts) return
        const input: Record<string, string> = {}
        if (baseAbout) input.about = baseAbout
        if (baseKeyInfoTexts) input.keyInfoTexts = baseKeyInfoTexts
        const ctx =
          'Backfill university about and keyInfoTexts (JSON objects). Translate values and preserve JSON.'
        const out = await translateWithDryRun(input, sourceLocale, target, ctx, dryRun)
        if (dryRun) {
          console.log(`[DryRun][University-Backfill ${u.id}] => ${target}`, out)
          return
        }
        const data: any = {}
        if (out.about != null) data.about = tryParseJson(out.about)
        if (out.keyInfoTexts != null) data.keyInfoTexts = tryParseJson(out.keyInfoTexts)
        await (prisma as any).universityTranslation.updateMany({
          where: { universityId: u.id, locale: target },
          data,
        })
        console.log(`[Updated] university_translation u=${u.id} about for ${target}`)
      })
    }
  }
  await runWithConcurrency(jobs, concurrency)
}

async function translateReviews(opts: CliOptions): Promise<void> {
  const { sourceLocale, targetLocales, limit, dryRun, concurrency } = opts
  const reviews = await prisma.universityReview.findMany({
    where: { featured: true },
    include: { translations: true },
    take: limit,
  })
  const jobs: Array<() => Promise<void>> = []
  for (const r of reviews as any[]) {
    if (typeof r.featured === 'boolean' && !r.featured) continue
    const existing = new Set(r.translations.map((t: any) => t.locale))
    const missing = targetLocales.filter((l) => !existing.has(l))
    if (missing.length === 0) continue
    const by = r.translations.find((t: any) => t.locale === sourceLocale) || r.translations[0]
    const base = {
      name: by?.name || '',
      quote: by?.quote || '',
      universityName: by?.universityName || '',
      achievements: stringifyMaybeJson(by?.achievements),
    }
    for (const target of missing) {
      jobs.push(async () => {
        const input = {
          name: base.name,
          quote: base.quote,
          universityName: base.universityName,
          achievements: base.achievements,
        }
        const ctx = 'Review fields. achievements is a JSON array of achievement strings.'
        const out = await translateWithDryRun(input, sourceLocale, target, ctx, dryRun)
        if (dryRun) {
          console.log(`[DryRun][Review ${r.id}] => ${target}`, out)
          return
        }
        await prisma.universityReviewTranslation.create({
          data: {
            reviewId: r.id,
            locale: target,
            name: out.name || '',
            quote: out.quote || '',
            universityName: out.universityName || '',
            achievements: tryParseJson(out.achievements),
          },
        })
        console.log(`[Created] review_translation r=${r.id} ${sourceLocale}->${target}`)
      })
    }
  }
  await runWithConcurrency(jobs, concurrency)
}

async function translatePrograms(opts: CliOptions): Promise<void> {
  const { sourceLocale, targetLocales, limit, dryRun, concurrency } = opts
  const rows = await prisma.universityProgram.findMany({
    include: { translations: true },
    take: limit,
  })
  const jobs: Array<() => Promise<void>> = []
  for (const rec of rows as any[]) {
    const existing = new Set(rec.translations.map((t: any) => t.locale))
    const missing = targetLocales.filter((l) => !existing.has(l))
    if (missing.length === 0) continue
    const by = rec.translations.find((t: any) => t.locale === sourceLocale) || rec.translations[0]
    const base = { name: by?.name || '' }
    for (const target of missing) {
      jobs.push(async () => {
        const input = { name: base.name }
        const ctx = 'Academic program fields.'
        const out = await translateWithDryRun(input, sourceLocale, target, ctx, dryRun)
        if (dryRun) {
          console.log(`[DryRun][Program ${rec.id}] => ${target}`, out)
          return
        }
        await prisma.universityProgramTranslation.create({
          data: {
            programId: rec.id,
            locale: target,
            name: out.name || '',
          },
        })
        console.log(`[Created] program_translation id=${rec.id} ${sourceLocale}->${target}`)
      })
    }
  }
  await runWithConcurrency(jobs, concurrency)
}

async function translateFaqs(opts: CliOptions): Promise<void> {
  const { sourceLocale, targetLocales, limit, dryRun, concurrency } = opts
  const rows = await prisma.faq.findMany({
    where: { featured: true },
    include: { translations: true },
    take: limit,
  })
  const jobs: Array<() => Promise<void>> = []
  for (const rec of rows as any[]) {
    if (typeof rec.featured === 'boolean' && !rec.featured) continue
    const existing = new Set(rec.translations.map((t: any) => t.locale))
    const missing = targetLocales.filter((l) => !existing.has(l))
    if (missing.length === 0) continue
    const by = rec.translations.find((t: any) => t.locale === sourceLocale) || rec.translations[0]
    const base = { question: by?.question || '', answer: by?.answer || '' }
    for (const target of missing) {
      jobs.push(async () => {
        const input = { question: base.question, answer: base.answer }
        const ctx = 'FAQ fields.'
        const out = await translateWithDryRun(input, sourceLocale, target, ctx, dryRun)
        if (dryRun) {
          console.log(`[DryRun][FAQ ${rec.id}] => ${target}`, out)
          return
        }
        await prisma.faqTranslation.create({
          data: {
            faqId: rec.id,
            locale: target,
            question: out.question || '',
            answer: out.answer || '',
          },
        })
        console.log(`[Created] faq_translation id=${rec.id} ${sourceLocale}->${target}`)
      })
    }
  }
  await runWithConcurrency(jobs, concurrency)
}

async function translateFacilities(opts: CliOptions): Promise<void> {
  const { sourceLocale, targetLocales, limit, dryRun, concurrency } = opts
  const rows = await prisma.universityCampusFacility.findMany({
    include: { translations: true },
    take: limit,
  })
  const jobs: Array<() => Promise<void>> = []
  for (const rec of rows as any[]) {
    const existing = new Set(rec.translations.map((t: any) => t.locale))
    const missing = targetLocales.filter((l) => !existing.has(l))
    if (missing.length === 0) continue
    const by = rec.translations.find((t: any) => t.locale === sourceLocale) || rec.translations[0]
    const base = { name: by?.name || '', description: by?.description || '' }
    for (const target of missing) {
      jobs.push(async () => {
        const input = { name: base.name, description: base.description }
        const ctx = 'Facility fields.'
        const out = await translateWithDryRun(input, sourceLocale, target, ctx, dryRun)
        if (dryRun) {
          console.log(`[DryRun][Facility ${rec.id}] => ${target}`, out)
          return
        }
        await prisma.universityCampusFacilityTranslation.create({
          data: {
            facilityId: rec.id,
            locale: target,
            name: out.name || '',
            description: out.description || '',
          },
        })
        console.log(`[Created] facility_translation id=${rec.id} ${sourceLocale}->${target}`)
      })
    }
  }
  await runWithConcurrency(jobs, concurrency)
}

async function translateRequirements(opts: CliOptions): Promise<void> {
  const { sourceLocale, targetLocales, limit, dryRun, concurrency } = opts
  const rows = await prisma.universityAdmissionRequirement.findMany({
    include: { translations: true },
    take: limit,
  })
  const jobs: Array<() => Promise<void>> = []
  for (const rec of rows as any[]) {
    const existing = new Set(rec.translations.map((t: any) => t.locale))
    const missing = targetLocales.filter((l) => !existing.has(l))
    if (missing.length === 0) continue
    const by = rec.translations.find((t: any) => t.locale === sourceLocale) || rec.translations[0]
    const base = {
      category: by?.category || '',
      requirement: by?.requirement || '',
      details: by?.details || '',
    }
    for (const target of missing) {
      jobs.push(async () => {
        const input = {
          category: base.category,
          requirement: base.requirement,
          details: base.details,
        }
        const ctx = 'Admission requirement fields.'
        const out = await translateWithDryRun(input, sourceLocale, target, ctx, dryRun)
        if (dryRun) {
          console.log(`[DryRun][Req ${rec.id}] => ${target}`, out)
          return
        }
        await prisma.universityAdmissionRequirementTranslation.create({
          data: {
            requirementId: rec.id,
            locale: target,
            category: out.category || '',
            requirement: out.requirement || '',
            details: out.details || '',
          },
        })
        console.log(`[Created] requirement_translation id=${rec.id} ${sourceLocale}->${target}`)
      })
    }
  }
  await runWithConcurrency(jobs, concurrency)
}

async function translateDocuments(opts: CliOptions): Promise<void> {
  const { sourceLocale, targetLocales, limit, dryRun, concurrency } = opts
  const rows = await prisma.universityRequiredDocument.findMany({
    include: { translations: true },
    take: limit,
  })
  const jobs: Array<() => Promise<void>> = []
  for (const rec of rows as any[]) {
    const existing = new Set(rec.translations.map((t: any) => t.locale))
    const missing = targetLocales.filter((l) => !existing.has(l))
    if (missing.length === 0) continue
    const by = rec.translations.find((t: any) => t.locale === sourceLocale) || rec.translations[0]
    const base = {
      name: by?.name || '',
      description: by?.description || '',
      formatRequirements: stringifyMaybeJson(by?.formatRequirements),
    }
    for (const target of missing) {
      jobs.push(async () => {
        const input = {
          name: base.name,
          description: base.description,
          formatRequirements: base.formatRequirements,
        }
        const ctx =
          'Required document fields. formatRequirements is a JSON-like list; translate values naturally.'
        const out = await translateWithDryRun(input, sourceLocale, target, ctx, dryRun)
        if (dryRun) {
          console.log(`[DryRun][Doc ${rec.id}] => ${target}`, out)
          return
        }
        await prisma.universityRequiredDocumentTranslation.create({
          data: {
            documentId: rec.id,
            locale: target,
            name: out.name || '',
            description: out.description || '',
            formatRequirements: tryParseJson(out.formatRequirements),
          },
        })
        console.log(`[Created] document_translation id=${rec.id} ${sourceLocale}->${target}`)
      })
    }
  }
  await runWithConcurrency(jobs, concurrency)
}

async function translateDates(opts: CliOptions): Promise<void> {
  const { sourceLocale, targetLocales, limit, dryRun, concurrency } = opts
  const rows = await prisma.universityImportantDate.findMany({
    include: { translations: true },
    take: limit,
  })
  const jobs: Array<() => Promise<void>> = []
  for (const rec of rows as any[]) {
    const existing = new Set(rec.translations.map((t: any) => t.locale))
    const missing = targetLocales.filter((l) => !existing.has(l))
    if (missing.length === 0) continue
    const by = rec.translations.find((t: any) => t.locale === sourceLocale) || rec.translations[0]
    const base = { event: by?.event || '' }
    for (const target of missing) {
      jobs.push(async () => {
        const input = { event: base.event }
        const ctx = 'Important date event title.'
        const out = await translateWithDryRun(input, sourceLocale, target, ctx, dryRun)
        if (dryRun) {
          console.log(`[DryRun][Date ${rec.id}] => ${target}`, out)
          return
        }
        await prisma.universityImportantDateTranslation.create({
          data: { dateId: rec.id, locale: target, event: out.event || '' },
        })
        console.log(`[Created] date_translation id=${rec.id} ${sourceLocale}->${target}`)
      })
    }
  }
  await runWithConcurrency(jobs, concurrency)
}

async function translateArticles(opts: CliOptions): Promise<void> {
  const { sourceLocale, targetLocales, limit, dryRun, concurrency } = opts
  const rows = await (prisma as any).blogArticle.findMany({
    include: { translations: true },
    take: limit,
  })
  const jobs: Array<() => Promise<void>> = []
  for (const rec of rows as any[]) {
    const existing = new Set(rec.translations.map((t: any) => t.locale))
    const missing = targetLocales.filter((l) => !existing.has(l))
    if (missing.length === 0) continue
    const by = rec.translations.find((t: any) => t.locale === sourceLocale) || rec.translations[0]
    const base = {
      title: by?.title || '',
      excerpt: by?.excerpt || '',
      readingTime: by?.readingTime || '',
      heroKicker: by?.heroKicker || '',
      heroSubtitle: by?.heroSubtitle || '',
      heroLocation: by?.heroLocation || '',
      imageAlt: by?.imageAlt || '',
      heroImageAlt: by?.heroImageAlt || '',
      seoDescription: by?.seoDescription || '',
      content: stringifyMaybeJson(by?.content),
      quickFacts: stringifyMaybeJson(by?.quickFacts),
      tags: stringifyMaybeJson(by?.tags),
    }
    for (const target of missing) {
      jobs.push(async () => {
        const input = {
          title: base.title,
          excerpt: base.excerpt,
          readingTime: base.readingTime,
          heroKicker: base.heroKicker,
          heroSubtitle: base.heroSubtitle,
          heroLocation: base.heroLocation,
          imageAlt: base.imageAlt,
          heroImageAlt: base.heroImageAlt,
          seoDescription: base.seoDescription,
          content: base.content,
          quickFacts: base.quickFacts,
          tags: base.tags,
        }
        const ctx =
          'Blog article translation fields. content is an array of content blocks (JSON). quickFacts is an array of {title, value, icon?}. tags is an array of strings. Translate text values only and keep JSON structure and keys.'
        const out = await translateWithDryRun(input, sourceLocale, target, ctx, dryRun)
        if (dryRun) {
          console.log(`[DryRun][Article ${rec.id}] => ${target}`, out)
          return
        }
        const titleOut = out.title || base.title || `article-${rec.id}`
        const slugBase = slugify(titleOut)
        const unique = await uniqueArticleSlug(target, slugBase)
        await (prisma as any).blogArticleTranslation.create({
          data: {
            articleId: rec.id,
            locale: target,
            slug: unique,
            title: out.title || '',
            excerpt: out.excerpt || '',
            readingTime: out.readingTime || null,
            heroKicker: out.heroKicker || null,
            heroSubtitle: out.heroSubtitle || null,
            heroLocation: out.heroLocation || null,
            imageAlt: out.imageAlt || null,
            heroImageAlt: out.heroImageAlt || null,
            seoDescription: out.seoDescription || null,
            content: tryParseJson(out.content),
            quickFacts: tryParseJson(out.quickFacts),
            tags: tryParseJson(out.tags),
          },
        })
        console.log(`[Created] blog_article_translation id=${rec.id} ${sourceLocale}->${target}`)
      })
    }
  }
  await runWithConcurrency(jobs, concurrency)
}

async function translateDirections(opts: CliOptions): Promise<void> {
  const { sourceLocale, targetLocales, limit, dryRun, concurrency } = opts
  const rows = await (prisma as any).studyDirection.findMany({
    include: { translations: true },
    take: limit,
  })
  const jobs: Array<() => Promise<void>> = []
  for (const rec of rows as any[]) {
    const existing = new Set(rec.translations.map((t: any) => t.locale))
    const missing = targetLocales.filter((l) => !existing.has(l))
    if (missing.length === 0) continue
    const by = rec.translations.find((t: any) => t.locale === sourceLocale) || rec.translations[0]
    const base = { name: by?.name || '', description: by?.description || '' }
    for (const target of missing) {
      jobs.push(async () => {
        const input = { name: base.name }
        const ctx = 'Study direction fields.'
        const out = await translateWithDryRun(input, sourceLocale, target, ctx, dryRun)
        if (dryRun) {
          console.log(`[DryRun][Direction ${rec.id}] => ${target}`, out)
          return
        }
        const nameOut = out.name || ''
        const slugBase = slugify(nameOut || base.name || `direction-${rec.id}`)
        const unique = await uniqueDirectionSlug(target, slugBase)
        await (prisma as any).studyDirectionTranslation.create({
          data: {
            directionId: rec.id,
            locale: target,
            name: nameOut,
            slug: unique,
          },
        })
        console.log(`[Created] direction_translation id=${rec.id} ${sourceLocale}->${target}`)
      })
    }
  }
  await runWithConcurrency(jobs, concurrency)
}

async function translateScholarships(opts: CliOptions): Promise<void> {
  const { sourceLocale, targetLocales, limit, dryRun, concurrency } = opts
  const rows = await prisma.universityScholarship.findMany({
    include: { translations: true },
    take: limit,
  })
  const jobs: Array<() => Promise<void>> = []
  for (const rec of rows as any[]) {
    const existing = new Set(rec.translations.map((t: any) => t.locale))
    const missing = targetLocales.filter((l) => !existing.has(l))
    if (missing.length === 0) continue
    const by = rec.translations.find((t: any) => t.locale === sourceLocale) || rec.translations[0]
    const base = {
      name: by?.name || '',
      eligibilityCriteria: stringifyMaybeJson(by?.eligibilityCriteria),
    }
    for (const target of missing) {
      jobs.push(async () => {
        const input = { name: base.name, eligibilityCriteria: base.eligibilityCriteria }
        const ctx = 'Scholarship name and eligibility criteria (JSON array of strings).'
        const out = await translateWithDryRun(input, sourceLocale, target, ctx, dryRun)
        if (dryRun) {
          console.log(`[DryRun][Scholarship ${rec.id}] => ${target}`, out)
          return
        }
        await prisma.universityScholarshipTranslation.create({
          data: {
            scholarshipId: rec.id,
            locale: target,
            name: out.name || '',
            eligibilityCriteria: tryParseJson(out.eligibilityCriteria),
          },
        })
        console.log(`[Created] scholarship_translation id=${rec.id} ${sourceLocale}->${target}`)
      })
    }
  }
  await runWithConcurrency(jobs, concurrency)
}

async function translateBlogCategories(opts: CliOptions): Promise<void> {
  const { sourceLocale, targetLocales, limit, dryRun, concurrency } = opts
  const rows = await prisma.blogCategory.findMany({
    include: { translations: true },
    take: limit,
  })
  const jobs: Array<() => Promise<void>> = []
  for (const rec of rows as any[]) {
    const existing = new Set(rec.translations.map((t: any) => t.locale))
    const missing = targetLocales.filter((l) => !existing.has(l))
    if (missing.length === 0) continue
    const by = rec.translations.find((t: any) => t.locale === sourceLocale) || rec.translations[0]
    const base = { title: by?.title || '' }
    for (const target of missing) {
      jobs.push(async () => {
        const input = { title: base.title }
        const ctx = 'Blog category title.'
        const out = await translateWithDryRun(input, sourceLocale, target, ctx, dryRun)
        if (dryRun) {
          console.log(`[DryRun][BlogCategory ${rec.id}] => ${target}`, out)
          return
        }
        await prisma.blogCategoryTranslation.create({
          data: {
            categoryId: rec.id,
            locale: target,
            title: out.title || '',
          },
        })
        console.log(`[Created] blog_category_translation id=${rec.id} ${sourceLocale}->${target}`)
      })
    }
  }
  await runWithConcurrency(jobs, concurrency)
}

async function translateFaqCategories(opts: CliOptions): Promise<void> {
  const { sourceLocale, targetLocales, limit, dryRun, concurrency } = opts
  const rows = await prisma.faqCategory.findMany({
    include: { translations: true },
    take: limit,
  })
  const jobs: Array<() => Promise<void>> = []
  for (const rec of rows as any[]) {
    const existing = new Set(rec.translations.map((t: any) => t.locale))
    const missing = targetLocales.filter((l) => !existing.has(l))
    if (missing.length === 0) continue
    const by = rec.translations.find((t: any) => t.locale === sourceLocale) || rec.translations[0]
    const base = { name: by?.name || '' }
    for (const target of missing) {
      jobs.push(async () => {
        const input = { name: base.name }
        const ctx = 'FAQ category name.'
        const out = await translateWithDryRun(input, sourceLocale, target, ctx, dryRun)
        if (dryRun) {
          console.log(`[DryRun][FaqCategory ${rec.id}] => ${target}`, out)
          return
        }
        await prisma.faqCategoryTranslation.create({
          data: {
            categoryId: rec.id,
            locale: target,
            name: out.name || '',
          },
        })
        console.log(`[Created] faq_category_translation id=${rec.id} ${sourceLocale}->${target}`)
      })
    }
  }
  await runWithConcurrency(jobs, concurrency)
}

function tryParseJson(s: string | undefined): any {
  if (!s) return null
  try {
    return JSON.parse(s)
  } catch {
    return s
  }
}

async function runWithConcurrency(
  jobs: Array<() => Promise<void>>,
  concurrency: number,
): Promise<void> {
  let index = 0
  const workers = Array.from(
    { length: Math.min(concurrency, Math.max(1, jobs.length)) },
    async () => {
      while (true) {
        const i = index++
        if (i >= jobs.length) return
        try {
          await jobs[i]?.()
          await new Promise((r) => setTimeout(r, 250))
        } catch (e) {
          console.error('[JobError]', e)
        }
      }
    },
  )
  await Promise.all(workers)
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (!process.env.OPENROUTER_API_KEY) {
    console.warn('OPENROUTER_API_KEY is not set. Use --dry-run to preview or set it for writes.')
  }
  console.log(
    `Entity=${opts.entity} source=${opts.sourceLocale} targets=${opts.targetLocales.join(',')} dryRun=${opts.dryRun}`,
  )
  try {
    switch (opts.entity) {
      case 'universities':
        await translateUniversities(opts)
        break
      case 'reviews':
        await translateReviews(opts)
        break
      case 'programs':
        await translatePrograms(opts)
        break
      case 'faqs':
        await translateFaqs(opts)
        break
      case 'facilities':
        await translateFacilities(opts)
        break
      case 'requirements':
        await translateRequirements(opts)
        break
      case 'documents':
        await translateDocuments(opts)
        break
      case 'dates':
        await translateDates(opts)
        break
      case 'directions':
        await translateDirections(opts)
        break
      case 'scholarships':
        await translateScholarships(opts)
        break
      case 'articles':
        await translateArticles(opts)
        break
      case 'blog_categories':
        await translateBlogCategories(opts)
        break
      case 'faq_categories':
        await translateFaqCategories(opts)
        break
      case 'all':
        await translateUniversities(opts)
        await translateReviews(opts)
        await translatePrograms(opts)
        await translateFaqs(opts)
        await translateFacilities(opts)
        await translateRequirements(opts)
        await translateDocuments(opts)
        await translateDates(opts)
        await translateDirections(opts)
        await translateScholarships(opts)
        await translateArticles(opts)
        await translateBlogCategories(opts)
        await translateFaqCategories(opts)
        break
    }
  } finally {
    await prisma.$disconnect().catch(() => { })
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
