import { z } from 'zod'

// ==========================================
// Common validation schemas
// ==========================================

/**
 * Pagination parameters schema
 */
export const PaginationParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

/**
 * Optional trimmed string (empty becomes undefined)
 */
export const OptionalStringSchema = z
  .string()
  .optional()
  .transform((s) => s?.trim() || undefined)
