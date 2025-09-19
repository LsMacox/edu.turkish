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

let popularProgramsModule: PopularProgramsModule
let getDirectionStats: PopularProgramsModule['getDirectionStats']
let popularProgramsHandler: PopularProgramsModule['default']
let resolveLanguage: PopularProgramsModule['resolveLanguage']

beforeAll(async () => {
  popularProgramsModule = await import('../../../../../server/api/v1/universities/popular-programs.get')
  getDirectionStats = popularProgramsModule.getDirectionStats
  popularProgramsHandler = popularProgramsModule.default
  resolveLanguage = popularProgramsModule.resolveLanguage
})

describe('resolveLanguage', () => {
  it('returns default locale when input missing', () => {
    expect(resolveLanguage()).toEqual({ locale: 'ru', variants: ['ru'] })
  })

  it('normalizes complex codes to base locale', () => {
    expect(resolveLanguage('en-US')).toEqual({ locale: 'en', variants: ['en'] })
  })

  it('treats kazakh locale aliases uniformly', () => {
    expect(resolveLanguage('kk-KZ')).toEqual({ locale: 'kz', variants: ['kz', 'kk'] })
    expect(resolveLanguage('kz')).toEqual({ locale: 'kz', variants: ['kz', 'kk'] })
  })
})

describe('getDirectionStats', () => {

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
            locale: { in: ['ru'] },
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

  it('normalizes locale values before querying Prisma', async () => {
    mocks.studyDirectionFindMany.mockResolvedValueOnce([{ id: 5 }])
    mocks.universityCount.mockResolvedValueOnce(0)

    await getDirectionStats(['computer-science'], 'kZ')

    expect(mocks.studyDirectionFindMany).toHaveBeenCalledWith({
      where: {
        translations: {
          some: {
            locale: { in: ['kz', 'kk'] },
            slug: { in: ['computer-science'] }
          }
        }
      },
      select: {
        id: true
      }
    })

    expect(mocks.universityAggregate).not.toHaveBeenCalled()
  })
})

describe('popular programs handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getQueryMock.mockReturnValue({})
  })

  it('normalizes query language before fetching stats', async () => {
    mocks.studyDirectionFindMany.mockResolvedValue([{ id: 42 }])
    mocks.universityCount.mockResolvedValue(2)
    mocks.universityAggregate.mockResolvedValue({
      _min: {
        tuitionMin: 5000,
        tuitionMax: 7000
      }
    })

    getQueryMock.mockReturnValue({ lang: 'kz' })

    const result = await popularProgramsHandler({} as never)

    expect(mocks.studyDirectionFindMany).toHaveBeenCalled()
    expect(mocks.studyDirectionFindMany.mock.calls[0][0]).toMatchObject({
      where: {
        translations: {
          some: {
            locale: { in: ['kz', 'kk'] }
          }
        }
      }
    })
    expect(mocks.studyDirectionFindMany).toHaveBeenCalledTimes(6)

    expect(result.success).toBe(true)
    expect(result.data.it).toEqual({
      universities_count: 2,
      price_from: 5000,
      direction_slugs: ['it', 'computer-science', 'software-engineering']
    })
  })
})
