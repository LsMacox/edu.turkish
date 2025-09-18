import { beforeEach, describe, expect, it, vi } from 'vitest'

declare global {
  // eslint-disable-next-line no-var
  var defineEventHandler: <T>(handler: T) => T
  // eslint-disable-next-line no-var
  var getQuery: (event: any) => Record<string, any>
  // eslint-disable-next-line no-var
  var createError: (input: any) => any
}

const getQueryMock = vi.fn()
const repoInstance = { getAllDirections: vi.fn() }
const UniversityRepositoryMock = vi.fn(() => repoInstance)

beforeEach(() => {
  getQueryMock.mockReset()
  repoInstance.getAllDirections.mockReset()
  UniversityRepositoryMock.mockClear()
})

globalThis.defineEventHandler = (<T>(handler: T) => handler) as any
globalThis.getQuery = getQueryMock as any
globalThis.createError = (input: any) => input

vi.mock('../../../../lib/prisma', () => ({
  prisma: {}
}))

vi.mock('../../../../server/repositories', () => ({
  UniversityRepository: UniversityRepositoryMock
}))

describe('GET /api/v1/directions', () => {
  it('returns paginated directions with metadata from repository', async () => {
    getQueryMock.mockReturnValue({ q: 'search term', page: '2', limit: '5', lang: 'en' })

    const repoResponse = {
      data: [
        { id: 1, name: 'Direction 1', description: 'Desc 1', slug: 'direction-1', universities_count: 3 },
        { id: 2, name: 'Direction 2', description: 'Desc 2', slug: 'direction-2', universities_count: 5 }
      ],
      total: 42
    }

    repoInstance.getAllDirections.mockResolvedValue(repoResponse)

    const handlerModule = await import('../../../../server/api/v1/directions/index.get')
    const handler = handlerModule.default

    const event = { context: { locale: 'ru' } }
    const result = await handler(event as any)

    expect(UniversityRepositoryMock).toHaveBeenCalledWith(expect.any(Object))
    expect(repoInstance.getAllDirections).toHaveBeenCalledWith('en', {
      search: 'search term',
      page: 2,
      limit: 5
    })

    expect(result).toEqual({
      data: repoResponse.data,
      meta: {
        total: 42,
        page: 2,
        limit: 5,
        totalPages: 9
      }
    })
  })

  it('falls back to locale context values when query params missing', async () => {
    getQueryMock.mockReturnValue({})

    const repoResponse = {
      data: [],
      total: 0
    }

    repoInstance.getAllDirections.mockResolvedValue(repoResponse)

    const handlerModule = await import('../../../../server/api/v1/directions/index.get')
    const handler = handlerModule.default

    const event = { context: { locale: 'tr' } }
    const result = await handler(event as any)

    expect(repoInstance.getAllDirections).toHaveBeenCalledWith('tr', {
      search: undefined,
      page: 1,
      limit: 100
    })

    expect(result.meta).toEqual({
      total: 0,
      page: 1,
      limit: 100,
      totalPages: 1
    })
  })
})
