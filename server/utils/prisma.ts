import prismaPkg from '@prisma/client'

const { PrismaClient } = prismaPkg as any

const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

process.on('beforeExit', () => {
  prisma.$disconnect()
})
