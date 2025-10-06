import { beforeEach, describe, expect, it, vi } from 'vitest'

const getQueryMock = vi.fn()
const repositoryInstance = {
  findAll: vi.fn(),
}
const UniversityRepositoryMock = vi.fn(() => repositoryInstance)

beforeEach(() => {
  getQueryMock.mockReset()
  repositoryInstance.findAll.mockReset()
  UniversityRepositoryMock.mockClear()
})

vi.stubGlobal('defineEventHandler', (<T>(handler: T) => handler) as any)
vi.stubGlobal('getQuery', getQueryMock)
vi.stubGlobal('createError', (input: unknown) => input)

vi.mock('../../../../../lib/prisma', () => ({
  prisma: {},
}))

vi.mock('../../../../../server/repositories', () => ({
  UniversityRepository: UniversityRepositoryMock,
}))

describe('GET /api/v1/universities', () => {
  it('parses price range and sort filters and returns repository data as-is', async () => {
    getQueryMock.mockReturnValue({
      price_min: '1500',
      price_max: '4500',
      sort: 'price_desc',
      page: '2',
      limit: '3',
    })

    const repositoryResponse = {
      data: [
        { id: 1, title: 'Uni C', tuitionRange: { min: 4200, max: 4800, currency: 'USD' } },
        { id: 2, title: 'Uni A', tuitionRange: { min: 3600, max: 4000, currency: 'USD' } },
      ],
      total: 8,
      filters: {
        cities: ['Istanbul'],
        types: ['state'],
        levels: ['bachelor'],
        languages: ['EN'],
        priceRange: [1000, 9000],
      },
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
        limit: 3,
      },
      'en',
    )

    expect(result).toEqual({
      data: repositoryResponse.data,
      meta: {
        total: 8,
        page: 2,
        limit: 3,
        totalPages: 3,
      },
      filters: repositoryResponse.filters,
    })
    expect(result.data.map((item) => item.title)).toEqual(['Uni C', 'Uni A'])
  })

  it('returns localized university data when lang=kk is requested', async () => {
    getQueryMock.mockReturnValue({ lang: 'kk' })

    repositoryInstance.findAll.mockImplementation(async (_filters, locale) => {
      expect(locale).toBe('kk')
      return {
        data: [{ id: 10, title: 'Қазақ Университеті', description: 'Kazakh locale data' }],
        total: 1,
        filters: { cities: [], types: [], levels: [], languages: [], priceRange: [0, 0] },
      }
    })

    const handlerModule = await import('../../../../../server/api/v1/universities/index.get')
    const handler = handlerModule.default

    const event = { context: { locale: 'kk' } }
    const result = await handler(event as any)

    expect(repositoryInstance.findAll).toHaveBeenCalledWith(expect.any(Object), 'kk')
    expect(result.data).toEqual([
      { id: 10, title: 'Қазақ Университеті', description: 'Kazakh locale data' },
    ])
  })
})
