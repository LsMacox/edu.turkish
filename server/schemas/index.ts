/**
 * Zod Schemas for JSON field validation and API request/response validation
 *
 * These schemas provide runtime validation for:
 * - JSON fields stored in the database
 * - API request parameters and bodies
 * - API response data
 *
 * Use them when reading/writing data to ensure type safety beyond TypeScript.
 */

// Common utilities
export * from './common'

// Domain schemas
export * from './university'
export * from './blog'
export * from './application'
export * from './review'
export * from './faq'
export * from './exchange-rates'
