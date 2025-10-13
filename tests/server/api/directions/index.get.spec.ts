import { beforeEach, describe, expect, it, vi } from 'vitest'

const getQueryMock = vi.fn()
const repoInstance = { getAllDirections: vi.fn() }
const UniversityRepositoryMock = vi.fn(() => repoInstance)

beforeEach(() => {
  getQueryMock.mockReset()
  repoInstance.getAllDirections.mockReset()
  UniversityRepositoryMock.mockClear()
})

vi.stubGlobal('defineEventHandler', (<T>(handler: T) => handler) as any)
vi.stubGlobal('getQuery', getQueryMock)
vi.stubGlobal('createError', (input: unknown) => input)

vi.mock('../../../../lib/prisma', () => ({
  prisma: {},
}))

vi.mock('../../../../server/repositories', () => ({
  UniversityRepository: UniversityRepositoryMock,
}))

describe('GET /api/v1/directions', () => {
  it('returns paginated directions with metadata from repository', async () => {
    const queryParams = { q: 'search term', page: '2', limit: '5', lang: 'en' }
    getQueryMock.mockReturnValue(queryParams)

    // Override global getQuery for this test
    ;(globalThis as any).getQuery = getQueryMock

    const repoResponse = {
      data: [
        {
          id: 1,
          name: 'Direction 1',
          slug: 'direction-1',
          universities_count: 3,
        },
        {
          id: 2,
          name: 'Direction 2',
          slug: 'direction-2',
          universities_count: 5,
        },
      ],
      total: 42,
    }

    repoInstance.getAllDirections.mockResolvedValue(repoResponse)

    const handlerModule = await import('../../../../server/api/v1/directions/index.get')
    const handler = handlerModule.default

    const event = { context: { locale: 'en' } }
    const result = await handler(event as any)

    expect(UniversityRepositoryMock).toHaveBeenCalledWith(expect.any(Object))
    expect(repoInstance.getAllDirections).toHaveBeenCalledWith('en', {
      search: 'search term',
      page: 2,
      limit: 5,
    })

    expect(result).toEqual({
      data: repoResponse.data,
      meta: {
        total: 42,
        page: 2,
        limit: 5,
        totalPages: 9,
      },
    })
  })

  it('falls back to locale context values when query params missing', async () => {
    getQueryMock.mockReturnValue({})

    const repoResponse = {
      data: [],
      total: 0,
    }

    repoInstance.getAllDirections.mockResolvedValue(repoResponse)

    const handlerModule = await import('../../../../server/api/v1/directions/index.get')
    const handler = handlerModule.default

    const event = { context: { locale: 'tr' } }
    const result = await handler(event as any)

    expect(repoInstance.getAllDirections).toHaveBeenCalledWith('tr', {
      search: undefined,
      page: 1,
      limit: 100,
    })

    expect(result.meta).toEqual({
      total: 0,
      page: 1,
      limit: 100,
      totalPages: 0,
    })
  })
})
