import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function resolveDatabaseUrl(): string {
  const candidates: Array<string | undefined> = [
    process.env.DATABASE_URL,
    process.env.APP_DATABASE_URL,
    process.env.PRISMA_DATABASE_URL,
    process.env.PRISMA_URL,
  ]

  for (const candidate of candidates) {
    if (candidate && candidate.trim().length > 0) {
      return candidate
    }
  }

  const host = process.env.DB_HOST || 'localhost'
  const port = process.env.DB_PORT || '3306'
  const user = process.env.DB_USER || 'root'
  const password = process.env.DB_PASSWORD || ''
  const database =
    process.env.APP_DB_NAME || process.env.DB_NAME || 'edu_turkish_app'

  return `mysql://${user}:${password}@${host}:${port}/${database}`
}

const databaseUrl = resolveDatabaseUrl()

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ datasources: { db: { url: databaseUrl } } })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

process.on('beforeExit', () => {
  prisma.$disconnect()
})
