import type { Prisma } from '@prisma/client'
import type {
  BlogArticleListItem,
  BlogArticleDetail,
  BlogArticleContentBlock,
  BlogArticleQuickFact,
  ProgramListItem,
  ProgramDetail,
} from '~~/server/types/api'
import { pickTranslation, resolveLocaleTag, extractStringArray } from '~~/server/utils/locale'
import { sanitizeRichText } from '~~/server/utils/sanitize'
import { parseBlogContent, type BlogContentBlock } from '~~/server/schemas/blog'

// ==========================================
// Types
// ==========================================

export type ArticleWithRelations = Prisma.BlogArticleGetPayload<{
  include: {
    translations: true
    category: {
      include: {
        translations: true
      }
    }
  }
}>

type ArticleTranslation = ArticleWithRelations['translations'][number]

// ==========================================
// Content normalization
// ==========================================

function sanitizeContentBlocks(blocks: BlogContentBlock[]): BlogArticleContentBlock[] {
  return blocks
    .map((block): BlogArticleContentBlock | null => {
      switch (block.type) {
        case 'heading': {
          const text = sanitizeRichText(block.text)
          return text ? { type: 'heading', level: block.level, text } : null
        }
        case 'paragraph': {
          const text = sanitizeRichText(block.text)
          return text ? { type: 'paragraph', text } : null
        }
        case 'list': {
          const items = block.items.map((item) => sanitizeRichText(item)).filter(Boolean)
          return items.length > 0
            ? { type: 'list', ordered: block.ordered, items, style: block.style }
            : null
        }
        case 'quote': {
          const text = sanitizeRichText(block.text)
          return text ? { type: 'quote', text, author: block.author } : null
        }
        case 'image': {
          return block.url
            ? {
                type: 'image',
                url: block.url,
                alt: block.alt,
                caption: block.caption ? sanitizeRichText(block.caption) : undefined,
                width: block.width,
              }
            : null
        }
        case 'spacer':
          return { type: 'spacer', size: block.size }
        case 'divider':
          return { type: 'divider' }
        case 'faq': {
          const items = block.items
            .map((item) => ({
              question: sanitizeRichText(item.question),
              answer: sanitizeRichText(item.answer),
            }))
            .filter((item) => item.question && item.answer)
          return items.length > 0 ? { type: 'faq', items } : null
        }
        default:
          return null
      }
    })
    .filter((block): block is BlogArticleContentBlock => block !== null)
}

export function normalizeContent(
  content: Prisma.JsonValue | null | undefined,
): BlogArticleContentBlock[] {
  const blocks = parseBlogContent(content)
  return sanitizeContentBlocks(blocks)
}

// ==========================================
// Metadata extraction
// ==========================================

export function parseQuickFacts(value: unknown): BlogArticleQuickFact[] {
  if (!Array.isArray(value)) {
    return []
  }

  return (value as Array<Record<string, unknown>>)
    .map((fact): BlogArticleQuickFact | null => {
      if (!fact || typeof fact !== 'object') {
        return null
      }

      const title = typeof fact.title === 'string' ? fact.title.trim() : ''
      const factValue = typeof fact.value === 'string' ? fact.value.trim() : ''
      const icon = typeof fact.icon === 'string' ? fact.icon.trim() : undefined

      if (!title || !factValue) {
        return null
      }

      return { title, value: factValue, icon }
    })
    .filter((fact): fact is BlogArticleQuickFact => fact !== null)
}

function extractTranslationMetadata(translation?: ArticleTranslation | null): {
  quickFacts: BlogArticleQuickFact[]
  tags: string[]
} {
  return {
    quickFacts: parseQuickFacts(translation?.quickFacts ?? null),
    tags: extractStringArray(translation?.tags),
  }
}

// ==========================================
// Date formatting
// ==========================================

export function formatDate(date: Date, locale: string): string {
  try {
    return new Intl.DateTimeFormat(resolveLocaleTag(locale as any), {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date)
  } catch {
    return date.toISOString().split('T')[0]!
  }
}

// ==========================================
// Alternates extraction
// ==========================================

function extractAlternates(translations: ArticleTranslation[]): Record<string, string> {
  const alternates: Record<string, string> = {}
  for (const t of translations) {
    if (t.slug && t.locale) {
      alternates[t.locale] = t.slug
    }
  }
  return alternates
}

// ==========================================
// Blog article mappers
// ==========================================

export function mapArticleToListItem(
  article: ArticleWithRelations,
  locale: string,
): BlogArticleListItem {
  const translation = pickTranslation(article.translations, locale)
  const categoryTranslation = pickTranslation(article.category.translations, locale)

  return {
    id: article.id,
    slug: translation?.slug ?? String(article.id),
    title: translation?.title ?? '',
    excerpt: translation?.excerpt ?? '',
    image: article.coverImage ?? null,
    imageAlt: translation?.imageAlt ?? translation?.title ?? undefined,
    publishedAt: article.publishedAt.toISOString(),
    readingTimeMinutes: article.readingTimeMinutes ?? undefined,
    category: {
      key: article.category.code,
      label: categoryTranslation?.title ?? article.category.code,
    },
    isPowerPage: article.isPowerPage ?? false,
  }
}

export function mapArticleToDetail(
  article: ArticleWithRelations,
  locale: string,
): BlogArticleDetail {
  const base = mapArticleToListItem(article, locale)
  const translation = pickTranslation(article.translations, locale)
  const metadata = extractTranslationMetadata(translation)

  return {
    ...base,
    heroImage: article.heroImage ?? base.image,
    heroImageAlt: translation?.heroImageAlt ?? base.imageAlt,
    heroKicker: translation?.heroKicker ?? undefined,
    heroSubtitle: translation?.heroSubtitle ?? translation?.excerpt ?? undefined,
    heroLocation: translation?.heroLocation ?? undefined,
    seoDescription: translation?.seoDescription ?? undefined,
    content: normalizeContent(translation?.content),
    quickFacts: metadata.quickFacts,
    tags: metadata.tags,
    alternates: extractAlternates(article.translations),
  }
}

// ==========================================
// Program mappers (reuse blog mappers with different output types)
// ==========================================

export function mapArticleToProgramListItem(
  article: ArticleWithRelations,
  locale: string,
): ProgramListItem {
  const translation = pickTranslation(article.translations, locale)
  const categoryTranslation = pickTranslation(article.category.translations, locale)

  return {
    id: article.id,
    slug: translation?.slug ?? String(article.id),
    title: translation?.title ?? '',
    excerpt: translation?.excerpt ?? '',
    image: article.coverImage ?? null,
    imageAlt: translation?.imageAlt ?? translation?.title ?? undefined,
    publishedAt: article.publishedAt.toISOString(),
    publishedAtLabel: formatDate(article.publishedAt, locale),
    category: {
      key: article.category.code,
      label: categoryTranslation?.title ?? article.category.code,
    },
  }
}

export function mapArticleToProgramDetail(
  article: ArticleWithRelations,
  locale: string,
): ProgramDetail {
  const base = mapArticleToProgramListItem(article, locale)
  const translation = pickTranslation(article.translations, locale)
  const metadata = extractTranslationMetadata(translation)

  return {
    ...base,
    heroImage: article.heroImage ?? base.image,
    heroImageAlt: translation?.heroImageAlt ?? base.imageAlt,
    heroKicker: translation?.heroKicker ?? undefined,
    heroSubtitle: translation?.heroSubtitle ?? translation?.excerpt ?? undefined,
    heroLocation: translation?.heroLocation ?? undefined,
    seoDescription: translation?.seoDescription ?? undefined,
    content: normalizeContent(translation?.content),
    quickFacts: metadata.quickFacts,
    tags: metadata.tags,
    alternates: extractAlternates(article.translations),
  }
}
