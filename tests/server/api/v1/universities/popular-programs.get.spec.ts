import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  studyDirectionFindMany: vi.fn(),
  universityCount: vi.fn(),
  universityAggregate: vi.fn()
}))

const nitroStubs = vi.hoisted(() => ({
  defineEventHandler: <T>(handler: T) => handler,
  getQuery: vi.fn<() => Record<string, unknown>>(),
  createError: vi.fn()
}))

vi.stubGlobal('defineEventHandler', nitroStubs.defineEventHandler)
vi.stubGlobal('getQuery', nitroStubs.getQuery)
vi.stubGlobal('createError', nitroStubs.createError)

const getQueryMock = nitroStubs.getQuery

vi.mock('../../../../../lib/prisma', () => ({
  prisma: {
    studyDirection: {
      findMany: mocks.studyDirectionFindMany
    },
    university: {
      count: mocks.universityCount,
      aggregate: mocks.universityAggregate
    }
  }
}))

type PopularProgramsModule = typeof import('../../../../../server/api/v1/universities/popular-programs.get')

let getDirectionStats: PopularProgramsModule['getDirectionStats']

describe('getDirectionStats', () => {
  beforeAll(async () => {
    const module = await import('../../../../../server/api/v1/universities/popular-programs.get')
    getDirectionStats = module.getDirectionStats
  })

  beforeEach(() => {
    vi.clearAllMocks()
    getQueryMock.mockReturnValue({})
  })

  it('returns aggregated count and min tuition for matching directions', async () => {
    mocks.studyDirectionFindMany.mockResolvedValueOnce([{ id: 1 }, { id: 2 }])
    mocks.universityCount.mockResolvedValueOnce(3)
    mocks.universityAggregate.mockResolvedValueOnce({
      _min: {
        tuitionMin: 4500,
        tuitionMax: 6000
      }
    })

    const result = await getDirectionStats(['it', 'engineering'], 'ru')

    expect(mocks.studyDirectionFindMany).toHaveBeenCalledWith({
      where: {
        translations: {
          some: {
            locale: 'ru',
            slug: { in: ['it', 'engineering'] }
          }
        }
      },
      select: {
        id: true
      }
    })

    expect(mocks.universityCount).toHaveBeenCalledWith({
      where: {
        universityDirections: {
          some: {
            directionId: { in: [1, 2] }
          }
        }
      }
    })

    expect(mocks.universityAggregate).toHaveBeenCalledWith({
      where: {
        universityDirections: {
          some: {
            directionId: { in: [1, 2] }
          }
        }
      },
      _min: {
        tuitionMin: true,
        tuitionMax: true
      }
    })

    expect(result).toEqual({
      universities_count: 3,
      price_from: 4500,
      direction_slugs: ['it', 'engineering']
    })
  })

  it('falls back to tuitionMax when tuitionMin is missing', async () => {
    mocks.studyDirectionFindMany.mockResolvedValueOnce([{ id: 3 }])
    mocks.universityCount.mockResolvedValueOnce(1)
    mocks.universityAggregate.mockResolvedValueOnce({
      _min: {
        tuitionMin: null,
        tuitionMax: 7200
      }
    })

    const result = await getDirectionStats(['medicine'], 'en')

    expect(result).toEqual({
      universities_count: 1,
      price_from: 7200,
      direction_slugs: ['medicine']
    })
  })
})
