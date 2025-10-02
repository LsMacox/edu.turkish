import { prisma } from '../../lib/prisma'
import type { Prisma } from '@prisma/client'

// Do not re-export prisma here to avoid duplicated auto-imports with
// `~/server/utils/prisma`. Import and use locally only.

/**
 * Database connection health check
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

/**
 * Database transaction helper
 */
export async function withTransaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  // Use interactive transaction to get a fully-typed tx client
  return await prisma.$transaction(async (tx) => {
    return await fn(tx)
  })
}

/**
 * Graceful disconnect helper
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect()
}
