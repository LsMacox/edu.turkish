// Test Utils - Main Entry Point
// Centralized testing utilities for edu.turkish project

// Prisma mocks
export { createMockPrisma } from './mocks/prisma'
export type { MockPrismaClient, MockPrismaModel } from './mocks/prisma'

// Redis/Queue mocks
export { createMockQueue, createMockRedis } from './mocks/redis'
export type { MockQueue, MockRedis, Job } from './mocks/redis'

// Nuxt composable mocks
export { mockUseI18n, mockNuxtApp } from './mocks/nuxt'
export { mockFetch } from './mocks/fetch'
export type { MockI18n, MockFetch, MockNuxtApp } from './mocks/nuxt'

// Test fixtures
export {
  createUniversity,
  createFAQ,
  createFAQCategory,
  createApplication,
  createReview,
} from './fixtures'
export type {
  UniversityFixture,
  FaqFixture,
  FaqCategoryFixture,
  ApplicationFixture,
  ReviewFixture,
} from './fixtures'
