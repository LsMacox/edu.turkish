import { z } from 'zod'

// ==========================================
// Common helpers
// ==========================================

const OptionalStringSchema = z
  .string()
  .optional()
  .transform((s) => s?.trim() || undefined)

// ==========================================
// Review types
// ==========================================

const UserTypeSchema = z.enum(['student', 'parent'])

// ==========================================
// Review achievements schema (object format)
// ==========================================

const ReviewAchievementsSchema = z
  .object({
    yos_score: z.number().int().min(0).max(800).optional(),
    scholarship_percentage: z.number().int().min(0).max(100).optional(),
    sat_score: z.number().int().min(400).max(1600).optional(),
    turkish_level: OptionalStringSchema,
    english_level: OptionalStringSchema,
    helpful_aspects: z.array(z.string()).optional(),
    recommendation: OptionalStringSchema,
    faculty: OptionalStringSchema,
    contact: OptionalStringSchema,
  })
  .optional()

// ==========================================
// Review create schema
// ==========================================

const ReviewTranslationInputSchema = z.object({
  locale: z.string().min(2).max(5),
  name: OptionalStringSchema,
  quote: OptionalStringSchema,
  universityName: OptionalStringSchema,
  achievements: ReviewAchievementsSchema,
})

export const ReviewCreateSchema = z.object({
  type: UserTypeSchema,
  name: z.string().min(1).max(255),
  universityId: z.number().int().positive().optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  quote: z.string().min(1),
  rating: z.number().min(1).max(5),
  avatar: z.string().url().optional(),
  featured: z.boolean().optional(),
  achievements: ReviewAchievementsSchema,
  translations: z.array(ReviewTranslationInputSchema).min(1),
})

export type ReviewCreate = z.infer<typeof ReviewCreateSchema>
