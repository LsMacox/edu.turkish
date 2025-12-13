import { z } from 'zod'
import { PaginationParamsSchema, OptionalStringSchema } from './common'

// ==========================================
// Common helpers
// ==========================================

const LangSchema = OptionalStringSchema

// ==========================================
// University query params
// ==========================================

const UniversitySortSchema = z.enum(['pop', 'price_asc', 'price_desc', 'alpha', 'lang_en', 'rank']).optional()

export const UniversityQueryParamsSchema = PaginationParamsSchema.extend({
    q: OptionalStringSchema,
    city: OptionalStringSchema,
    langs: z.array(z.string()).optional(),
    type: OptionalStringSchema,
    level: OptionalStringSchema,
    price_min: z.coerce.number().optional(),
    price_max: z.coerce.number().optional(),
    sort: UniversitySortSchema,
    lang: LangSchema,
})

export type UniversityQueryParams = z.infer<typeof UniversityQueryParamsSchema>

// ==========================================
// Blog article query params
// ==========================================

export const BlogArticleQueryParamsSchema = PaginationParamsSchema.extend({
    q: OptionalStringSchema,
    category: OptionalStringSchema,
    lang: LangSchema,
})

export type BlogArticleQueryParams = z.infer<typeof BlogArticleQueryParamsSchema>

// ==========================================
// Direction query params
// ==========================================

export const DirectionQueryParamsSchema = PaginationParamsSchema.extend({
    q: OptionalStringSchema,
    lang: LangSchema,
})

export type DirectionQueryParams = z.infer<typeof DirectionQueryParamsSchema>

// ==========================================
// Review query params
// ==========================================

const UserTypeSchema = z.enum(['student', 'parent'])
const MediaTypeSchema = z.enum(['text', 'video', 'image'])

export const ReviewQueryParamsSchema = PaginationParamsSchema.extend({
    type: z.union([UserTypeSchema, z.literal('all')]).optional(),
    featured: z.coerce.boolean().optional(),
    mediaType: MediaTypeSchema.optional(),
    lang: LangSchema,
})

export type ReviewQueryParams = z.infer<typeof ReviewQueryParamsSchema>

// ==========================================
// Create review request
// ==========================================

export const CreateReviewRequestSchema = z.object({
    name: z.string().min(2, 'min_length').max(100, 'max_length'),
    university: z.string().min(1, 'required').max(200, 'max_length'),
    faculty: z.string().max(200, 'max_length').optional(),
    year: z.string().regex(/^\d{4}$/, 'invalid_year').optional().or(z.literal('')),
    rating: z.coerce.number().min(1, 'min_value').max(5, 'max_value'),
    contact: z.string().max(200, 'max_length').optional(),
    review: z.string().min(10, 'min_length').max(2000, 'max_length'),
    helpfulAspects: z.array(z.string()).optional(),
    recommendation: z.string().max(500, 'max_length').optional(),
    type: UserTypeSchema.optional(),
})


