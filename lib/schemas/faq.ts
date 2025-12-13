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
      if (!v || v === 'all') return undefined
      const id = Number(v)
      return !Number.isNaN(id) && id > 0 ? v : undefined
    }),
  featured: z.coerce.boolean().optional(),
  lang: OptionalStringSchema,
})


