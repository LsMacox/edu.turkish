import type { BlogArticleContentBlock } from '~~/lib/types'
import { stripHtmlTags, slugify } from '~~/lib/utils/text'

export type NormalizedBlock =
  | Exclude<BlogArticleContentBlock, { type: 'heading' }>
  | (Extract<BlogArticleContentBlock, { type: 'heading' }> & { id: string })

export type HeadingBlockWithId = Extract<NormalizedBlock, { type: 'heading' }>

export interface TableOfContentsItem {
  id: string
  order: string
  title: string
  level: number
}

export interface ContentParserOptions {
  maxTocLevel?: number
}

export const createHeadingId = (text: string, counts: Map<string, number>): string => {
  const sanitized = slugify(stripHtmlTags(text)) || 'section'

  const count = counts.get(sanitized) ?? 0
  counts.set(sanitized, count + 1)
  return count === 0 ? sanitized : `${sanitized}-${count}`
}

export const getHeadingTag = (level: number): string => {
  if (level <= 2) return 'h2'
  if (level === 3) return 'h3'
  if (level === 4) return 'h4'
  return 'h5'
}

export const isHeadingBlock = (block: NormalizedBlock): block is HeadingBlockWithId =>
  block.type === 'heading'

export function useContentParser(
  content: Ref<BlogArticleContentBlock[]> | ComputedRef<BlogArticleContentBlock[]>,
  options: ContentParserOptions = {},
) {
  const { maxTocLevel = 3 } = options

  const normalizedContent = computed<NormalizedBlock[]>(() => {
    const blocks = unref(content)
    if (!blocks?.length) return []

    const counts = new Map<string, number>()

    return blocks.map((block) => {
      if (block.type === 'heading') {
        return {
          ...block,
          id: createHeadingId(block.text, counts),
        }
      }
      return block
    })
  })

  const tableOfContents = computed<TableOfContentsItem[]>(() => {
    const headings = normalizedContent.value
      .filter(isHeadingBlock)
      .filter((block) => block.level <= maxTocLevel)

    return headings.map((block, index) => ({
      id: block.id,
      order: String(index + 1).padStart(2, '0'),
      title: stripHtmlTags(block.text),
      level: block.level,
    }))
  })

  return {
    normalizedContent,
    tableOfContents,
    getHeadingTag,
    isHeadingBlock,
  }
}
