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
const repositoryInstance = {
  findAll: vi.fn()
}
const UniversityRepositoryMock = vi.fn(() => repositoryInstance)

beforeEach(() => {
  getQueryMock.mockReset()
  repositoryInstance.findAll.mockReset()
  UniversityRepositoryMock.mockClear()
})

globalThis.defineEventHandler = (<T>(handler: T) => handler) as any
globalThis.getQuery = getQueryMock as any
globalThis.createError = (input: any) => input

vi.mock('../../../../../lib/prisma', () => ({
  prisma: {}
}))

vi.mock('../../../../../server/repositories', () => ({
  UniversityRepository: UniversityRepositoryMock
}))

describe('GET /api/v1/universities', () => {
  it('parses price range and sort filters and returns repository data as-is', async () => {
    getQueryMock.mockReturnValue({
      price_min: '1500',
      price_max: '4500',
      sort: 'price_desc',
      page: '2',
      limit: '3'
    })

    const repositoryResponse = {
      data: [
        { id: 1, title: 'Uni C', tuitionRange: { min: 4200, max: 4800, currency: 'USD' } },
        { id: 2, title: 'Uni A', tuitionRange: { min: 3600, max: 4000, currency: 'USD' } }
      ],
      total: 8,
      filters: {
        cities: ['Istanbul'],
        types: ['state'],
        levels: ['bachelor'],
        languages: ['EN'],
        priceRange: [1000, 9000]
      }
    }

    repositoryInstance.findAll.mockResolvedValue(repositoryResponse)

    const handlerModule = await import('../../../../../server/api/v1/universities/index.get')
    const handler = handlerModule.default

    const event = { context: { locale: 'en' } }
    const result = await handler(event as any)

    expect(UniversityRepositoryMock).toHaveBeenCalledWith(expect.any(Object))
    expect(repositoryInstance.findAll).toHaveBeenCalledWith(
      {
        q: '',
        city: '',
        langs: [],
        type: '',
        level: '',
        price_min: 1500,
        price_max: 4500,
        sort: 'price_desc',
        page: 2,
        limit: 3
      },
      'en'
    )

    expect(result).toEqual({
      data: repositoryResponse.data,
      meta: {
        total: 8,
        page: 2,
        limit: 3,
        totalPages: 3
      },
      filters: repositoryResponse.filters
    })
    expect(result.data.map(item => item.title)).toEqual(['Uni C', 'Uni A'])
  })
})
