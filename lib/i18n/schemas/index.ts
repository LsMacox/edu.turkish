/**
 * I18n Schemas - Single source of truth for all translation keys.
 *
 * This module defines the complete structure of i18n keys used across
 * the application. All locale JSON files must conform to these schemas.
 *
 * Structure (flat files, no subdirectories)
 */

// Shared types
export * from './types'

// Type-safe key paths
export * from './keys'

// Complete schema type (union of all translation files)
export type { I18nSchema } from './schema'


