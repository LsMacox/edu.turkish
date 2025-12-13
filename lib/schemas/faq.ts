import { z } from 'zod'
import { PaginationParamsSchema, OptionalStringSchema } from './common'

// ==========================================
// FAQ query params
// ==========================================

export const FaqQueryParamsSchema = PaginationParamsSchema.omit({ page: true }).extend({
  q: OptionalStringSchema,
  category: z
    .string()
    .optional()
    .transform((v) => {
      if (!v) return undefined
      const key = v.trim()
      if (!key || key === 'all') return undefined
      return key
    }),
  featured: z.coerce.boolean().optional(),
  lang: OptionalStringSchema,
})


