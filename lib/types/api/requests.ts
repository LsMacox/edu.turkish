/**
 * API Request Types
 *
 * These types are inferred from Zod schemas for runtime validation.
 * Import schemas from '~~/lib/schemas' for validation.
 */

// Query params types (from Zod schemas)
export type {
    UniversityQueryParams,
    BlogArticleQueryParams,
    DirectionQueryParams,
    ReviewQueryParams,
} from '~~/lib/schemas/query-params'

// Application request (from Zod schema)
export type { ApplicationRequest } from '~~/lib/schemas/application'
