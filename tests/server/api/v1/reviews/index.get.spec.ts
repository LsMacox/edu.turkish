import { beforeEach, describe, expect, it, vi } from 'vitest'

const getQueryMock = vi.fn()
const repositoryInstance = {
  findAll: vi.fn(),
}
const ReviewRepositoryMock = vi.fn(() => repositoryInstance)

beforeEach(() => {
  getQueryMock.mockReset()
  repositoryInstance.findAll.mockReset()
  ReviewRepositoryMock.mockClear()
  vi.resetModules()
})

vi.stubGlobal('defineEventHandler', (<T>(handler: T) => handler) as any)
vi.stubGlobal('getQuery', getQueryMock)
vi.stubGlobal('createError', (input: unknown) => input)

vi.mock('../../../../../lib/prisma', () => ({
  prisma: {},
}))

vi.mock('../../../../../server/repositories', () => ({
  ReviewRepository: ReviewRepositoryMock,
}))

describe('GET /api/v1/reviews', () => {
  it('falls back to default pagination when query contains non-numeric values', async () => {
    getQueryMock.mockReturnValue({
      page: 'abc',
      limit: 'not-a-number',
      type: '',
      featured: 'false',
    })

    const repositoryResponse = {
      data: [{ id: 1, name: 'Student A' }],
      total: 5,
    }

    repositoryInstance.findAll.mockResolvedValue(repositoryResponse)

    const handlerModule = await import('../../../../../server/api/v1/reviews/index.get')
    const handler = handlerModule.default

    const event = { context: { locale: 'tr' } }
    const result = await handler(event as any)

    expect(ReviewRepositoryMock).toHaveBeenCalledWith(expect.any(Object))
    expect(repositoryInstance.findAll).toHaveBeenCalledWith(
      {
        type: 'all',
        featured: false,
        page: 1,
        limit: 50,
      },
      'tr',
    )

    expect(result).toEqual({
      data: repositoryResponse.data,
      meta: {
        total: 5,
        page: 1,
        limit: 50,
        totalPages: 1,
      },
    })
  })

  it('passes lang=kk locale to repository and returns localized reviews', async () => {
    getQueryMock.mockReturnValue({ lang: 'kk' })

    repositoryInstance.findAll.mockImplementation(async (_filters, locale) => {
      expect(locale).toBe('kk')
      return {
        data: [{ id: 7, name: 'Әружан', quote: 'Kazakh review' }],
        total: 1,
      }
    })

    const handlerModule = await import('../../../../../server/api/v1/reviews/index.get')
    const handler = handlerModule.default

    const event = { context: { locale: 'kk' } }
    const result = await handler(event as any)

    expect(repositoryInstance.findAll).toHaveBeenCalledWith(expect.any(Object), 'kk')
    expect(result.data).toEqual([{ id: 7, name: 'Әружан', quote: 'Kazakh review' }])
  })
})
