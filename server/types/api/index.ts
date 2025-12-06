export * from './common'
export * from './blog'
export * from './programs'
export * from './universities'
export * from './directions'
export * from './reviews'
export * from './faq'
export * from './applications'
export * from './content'
export * from './errors'

// Re-export ApplicationStatus from Prisma for consumers importing from server/types/api
export type { ApplicationStatus } from '@prisma/client'
