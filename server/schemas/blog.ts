import { z } from 'zod'

// ==========================================
// BlogArticleTranslation.content JSON schema
// ==========================================

const HeadingBlockSchema = z.object({
  type: z.literal('heading'),
  level: z.number().min(1).max(6),
  text: z.string(),
})

const ParagraphBlockSchema = z.object({
  type: z.literal('paragraph'),
  text: z.string(),
})

const ListBlockSchema = z.object({
  type: z.literal('list'),
  ordered: z.boolean(),
  items: z.array(z.string()),
  style: z.enum(['standard', 'checklist', 'steps']).optional(),
})

const QuoteBlockSchema = z.object({
  type: z.literal('quote'),
  text: z.string(),
  author: z.string().optional(),
})

const ImageBlockSchema = z.object({
  type: z.literal('image'),
  url: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  width: z.enum(['standard', 'wide', 'full']).optional(),
})

const SpacerBlockSchema = z.object({
  type: z.literal('spacer'),
  size: z.enum(['sm', 'md', 'lg', 'xl']),
})

const DividerBlockSchema = z.object({
  type: z.literal('divider'),
})

const FaqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
})

const FaqBlockSchema = z.object({
  type: z.literal('faq'),
  items: z.array(FaqItemSchema),
})

const BlogContentBlockSchema = z.discriminatedUnion('type', [
  HeadingBlockSchema,
  ParagraphBlockSchema,
  ListBlockSchema,
  QuoteBlockSchema,
  ImageBlockSchema,
  SpacerBlockSchema,
  DividerBlockSchema,
  FaqBlockSchema,
])

const BlogContentSchema = z.array(BlogContentBlockSchema)

export type BlogContentBlock = z.infer<typeof BlogContentBlockSchema>

/**
 * Safely parse BlogArticleTranslation.content JSON field
 */
export function parseBlogContent(data: unknown): BlogContentBlock[] {
  const result = BlogContentSchema.safeParse(data)
  return result.success ? result.data : []
}
