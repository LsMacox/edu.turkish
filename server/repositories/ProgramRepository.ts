import type { PrismaClient, Prisma } from '@prisma/client'
import type {
  ProgramListItem,
  ProgramDetail,
  ProgramCategoryWithItems,
  BlogArticleContentBlock,
  BlogArticleQuickFact,
} from '~~/server/types/api'
import { pickTranslation, resolveLocaleTag, extractStringArray } from '~~/server/utils/locale'
import { sanitizeRichText } from '~~/server/utils/sanitize'

type ArticleWithRelations = Prisma.BlogArticleGetPayload<{
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

export class ProgramRepository {
  constructor(private prisma: PrismaClient) {}

  private formatDate(date: Date, locale: string): string {
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

  private normalizeContent(
    content: Prisma.JsonValue | null | undefined,
  ): BlogArticleContentBlock[] {
    if (!content || !Array.isArray(content)) {
      return []
    }

    const blocks: BlogArticleContentBlock[] = []

    for (const rawBlock of content as any[]) {
      if (!rawBlock || typeof rawBlock !== 'object') {
        continue
      }

      const type = String(rawBlock.type || '')
      switch (type) {
        case 'heading': {
          const level = Number(rawBlock.level) || 2
          const text = sanitizeRichText(String(rawBlock.text || ''))
          if (text) {
            blocks.push({ type: 'heading', level, text })
          }
          break
        }
        case 'paragraph': {
          const text = sanitizeRichText(String(rawBlock.text || ''))
          if (text) {
            blocks.push({ type: 'paragraph', text })
          }
          break
        }
        case 'list': {
          const items = Array.isArray(rawBlock.items)
            ? rawBlock.items
                .map((item: any) => sanitizeRichText(String(item)))
                .filter((item: string) => !!item)
            : []
          if (items.length > 0) {
            const style = ['standard', 'checklist', 'steps'].includes(String(rawBlock.style))
              ? (String(rawBlock.style) as 'standard' | 'checklist' | 'steps')
              : undefined
            blocks.push({ type: 'list', ordered: Boolean(rawBlock.ordered), items, style })
          }
          break
        }
        case 'quote': {
          const text = sanitizeRichText(String(rawBlock.text || ''))
          if (text) {
            const author = rawBlock.author ? String(rawBlock.author) : undefined
            blocks.push({ type: 'quote', text, author })
          }
          break
        }
        case 'image': {
          const url = String(rawBlock.url || '')
          const alt = String(rawBlock.alt || '')
          if (url) {
            const caption = rawBlock.caption
              ? sanitizeRichText(String(rawBlock.caption))
              : undefined
            const width = ['standard', 'wide', 'full'].includes(String(rawBlock.width))
              ? (String(rawBlock.width) as 'standard' | 'wide' | 'full')
              : undefined
            blocks.push({ type: 'image', url, alt, caption, width })
          }
          break
        }
        case 'spacer': {
          const size = ['sm', 'md', 'lg', 'xl'].includes(String(rawBlock.size))
            ? (String(rawBlock.size) as 'sm' | 'md' | 'lg' | 'xl')
            : 'md'
          blocks.push({ type: 'spacer', size })
          break
        }
        case 'divider': {
          blocks.push({ type: 'divider' })
          break
        }
        case 'faq': {
          const items = Array.isArray(rawBlock.items)
            ? rawBlock.items.map((item: any) => ({
                question: sanitizeRichText(String(item.question || '')),
                answer: sanitizeRichText(String(item.answer || '')),
              }))
            : []

          if (items.length > 0) {
            blocks.push({ type: 'faq', items })
          }
          break
        }
        default:
          break
      }
    }

    return blocks
  }

  private parseQuickFactsValue(value: unknown): BlogArticleQuickFact[] {
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

  private extractTranslationMetadata(translation?: ArticleTranslation | null): {
    quickFacts: BlogArticleQuickFact[]
    tags: string[]
  } {
    return {
      quickFacts: this.parseQuickFactsValue(translation?.quickFacts ?? null),
      tags: extractStringArray(translation?.tags),
    }
  }

  private mapArticleToListItem(article: ArticleWithRelations, locale: string): ProgramListItem {
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
      publishedAtLabel: this.formatDate(article.publishedAt, locale),
      category: {
        key: article.category.code,
        label: categoryTranslation?.title ?? article.category.code,
      },
    }
  }

  private mapArticleToDetail(article: ArticleWithRelations, locale: string): ProgramDetail {
    const base = this.mapArticleToListItem(article, locale)
    const translation = pickTranslation(article.translations, locale)
    const metadata = this.extractTranslationMetadata(translation)

    const alternates: Record<string, string> = {}
    for (const t of article.translations) {
      if (t.slug && t.locale) {
        alternates[t.locale] = t.slug
      }
    }

    return {
      ...base,
      heroImage: article.heroImage ?? base.image,
      heroImageAlt: translation?.heroImageAlt ?? base.imageAlt,
      heroKicker: translation?.heroKicker ?? undefined,
      heroSubtitle: translation?.heroSubtitle ?? translation?.excerpt ?? undefined,
      heroLocation: translation?.heroLocation ?? undefined,
      seoDescription: translation?.seoDescription ?? undefined,
      content: this.normalizeContent(translation?.content),
      quickFacts: metadata.quickFacts,
      tags: metadata.tags,
      alternates,
    }
  }

  /**
   * Получить все программы сгруппированные по категориям
   */
  async findAllGroupedByCategory(locale: string): Promise<ProgramCategoryWithItems[]> {
    // Получаем категории программ с их статьями
    const categories = await this.prisma.blogCategory.findMany({
      where: {
        isProgram: true,
      },
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
      include: {
        translations: true,
        articles: {
          where: {
            isProgram: true,
            status: 'published',
            publishedAt: {
              lte: new Date(),
            },
          },
          orderBy: { publishedAt: 'desc' },
          include: {
            translations: true,
            category: {
              include: {
                translations: true,
              },
            },
          },
        },
      },
    })

    return categories.map((category) => {
      const categoryTranslation = pickTranslation(category.translations, locale)

      return {
        key: category.code,
        label: categoryTranslation?.title ?? category.code,
        programs: category.articles.map((article) => this.mapArticleToListItem(article, locale)),
      }
    })
  }

  /**
   * Получить программу по slug
   */
  async findBySlug(slug: string, locale: string): Promise<ProgramDetail | null> {
    const primary = await this.prisma.blogArticleTranslation.findFirst({
      where: {
        slug,
        locale,
        article: {
          isProgram: true,
        },
      },
      include: {
        article: {
          include: {
            translations: true,
            category: {
              include: {
                translations: true,
              },
            },
          },
        },
      },
    })

    let article = primary?.article ?? null

    if (!article) {
      const fallback = await this.prisma.blogArticleTranslation.findFirst({
        where: {
          slug,
          article: {
            isProgram: true,
          },
        },
        include: {
          article: {
            include: {
              translations: true,
              category: {
                include: {
                  translations: true,
                },
              },
            },
          },
        },
      })

      article = fallback?.article ?? null
    }

    if (!article || article.status !== 'published' || article.publishedAt > new Date()) {
      return null
    }

    return this.mapArticleToDetail(article, locale)
  }
}
