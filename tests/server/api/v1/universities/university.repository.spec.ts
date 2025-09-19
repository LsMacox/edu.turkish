import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PrismaClient } from '@prisma/client'

import { UniversityRepository } from '../../../../../server/repositories/UniversityRepository'
import { parseUniversityFilters } from '../../../../../server/utils/api-helpers'

const createPrismaMock = () => {
  const findMany = vi.fn().mockResolvedValue([])
  const count = vi.fn().mockResolvedValue(0)
  const groupBy = vi.fn().mockResolvedValue([])
  const aggregate = vi.fn().mockResolvedValue({ _min: {}, _max: {} })
  const academicProgramGroupBy = vi.fn().mockResolvedValue([])
  const cityTranslationFindMany = vi.fn().mockResolvedValue([])
  const transaction = vi.fn(async (queries: Promise<unknown>[]) => Promise.all(queries))

  const prisma = {
    university: {
      findMany,
      count,
      groupBy,
      aggregate
    },
    academicProgram: {
      groupBy: academicProgramGroupBy
    },
    cityTranslation: {
      findMany: cityTranslationFindMany
    },
    $transaction: transaction
  } as unknown as PrismaClient

  return {
    prisma,
    findMany,
    count,
    groupBy,
    aggregate,
    academicProgramGroupBy,
    cityTranslationFindMany,
    transaction
  }
}

describe('UniversityRepository price filtering', () => {
  let prismaMock: ReturnType<typeof createPrismaMock>
  let repository: UniversityRepository

  beforeEach(() => {
    prismaMock = createPrismaMock()
    repository = new UniversityRepository(prismaMock.prisma)
  })

  it('does not apply price filter when parameters are missing', async () => {
    const filters = parseUniversityFilters({})

    await repository.findAll(filters, 'ru')

    const args = prismaMock.findMany.mock.calls[0][0]
    expect(args.where?.AND).toBeUndefined()
  })

  it('ignores non-numeric values while keeping valid bounds', async () => {
    const filters = parseUniversityFilters({ price_min: 'abc', price_max: '3000' })

    await repository.findAll(filters, 'ru')

    const args = prismaMock.findMany.mock.calls[0][0]
    expect(args.where?.AND?.[0]?.OR).toEqual([
      { tuitionMin: { lte: 3000 } },
      { tuitionMin: { equals: null } }
    ])
  })

  it('drops negative numbers from filters', async () => {
    const filters = parseUniversityFilters({ price_min: '-10', price_max: '2000' })

    await repository.findAll(filters, 'ru')

    const args = prismaMock.findMany.mock.calls[0][0]
    expect(args.where?.AND?.[0]?.OR).toEqual([
      { tuitionMin: { lte: 2000 } },
      { tuitionMin: { equals: null } }
    ])
  })

  it('normalizes inverted ranges by swapping min and max', async () => {
    await repository.findAll({ price_min: 5000, price_max: 2000 }, 'ru')

    const args = prismaMock.findMany.mock.calls[0][0]
    expect(args.where?.AND?.[0]?.OR).toEqual([
      { tuitionMin: { lte: 5000 } },
      { tuitionMin: { equals: null } }
    ])
    expect(args.where?.AND?.[1]?.OR).toEqual([
      { tuitionMax: { gte: 2000 } },
      { tuitionMax: { equals: null } }
    ])
  })
})
