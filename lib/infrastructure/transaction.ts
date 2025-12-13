import type { PrismaClient, Prisma } from '@prisma/client'

export type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

export type TransactionCallback<T> = (tx: TransactionClient) => Promise<T>

export interface TransactionOptions {
  maxWait?: number
  timeout?: number
  isolationLevel?: Prisma.TransactionIsolationLevel
}

/**
 * Execute a callback within a Prisma transaction.
 * Provides type-safe transaction client that can be passed to repository methods.
 */
export async function withTransaction<T>(
  prisma: PrismaClient,
  callback: TransactionCallback<T>,
  options?: TransactionOptions,
): Promise<T> {
  return prisma.$transaction(callback, options)
}

/**
 * Base class for repositories that need transaction support.
 * Repositories can accept either a PrismaClient or TransactionClient.
 */
export abstract class TransactionalRepository {
  constructor(protected db: PrismaClient | TransactionClient) {}

  /**
   * Create a new instance of this repository bound to a transaction client.
   * Override in subclasses to return the correct type.
   */
  abstract withTransaction(tx: TransactionClient): this
}
