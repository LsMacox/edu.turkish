export * from './common'
export * from './blog'
export * from './universities'
export * from './directions'
export * from './reviews'
export * from './faq'
export * from './applications'
export * from './content'
export * from './errors'

// Provide ApplicationStatus type for consumers that relied on it here.
// It comes from Prisma schema, but many parts import it through server/types/api.
export { ApplicationStatus } from '@prisma/client'
