import { beforeEach, describe, expect, it, vi } from 'vitest'

const getQueryMock = vi.fn()
const fetchMock = vi.fn()

vi.mock('h3', () => ({
  getRequestURL: vi.fn(() => new URL('https://example.com/go/telegram')),
  getQuery: () => getQueryMock(),
  defineEventHandler: <T>(handler: T) => handler,
  createError: (input: unknown) => input,
}))

vi.mock('~~/lib/contact/channels', () => ({
  contactChannels: {
    telegramBot: {
      key: 'telegramBot',
      type: 'personal',
      baseUrl: 'https://t.me/example',
      defaultCta: 'Contact us',
    },
  },
  primaryTelegramKey: 'telegramBot',
}))

vi.stubGlobal('$fetch', fetchMock)

beforeEach(() => {
  getQueryMock.mockReset()
  fetchMock.mockReset()
})

describe('GET /go/telegram', () => {
  it('returns redirect HTML even when logging fails', async () => {
    const loggingError = new Error('Network failure')
    getQueryMock.mockReturnValue({
      referral_code: 'abc123',
      session: 'session-42',
      utm_source: 'newsletter',
    })
    fetchMock.mockRejectedValue(loggingError)

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const handlerModule = await import('../../../../server/routes/go/telegram')
    const handler = handlerModule.default

    const response = await handler({} as any)

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/messenger-events',
      expect.objectContaining({
        method: 'POST',
        body: expect.objectContaining({
          channel: 'telegramBot',
          referral_code: 'abc123',
          session: 'session-42',
        }),
      }),
    )
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[go/telegram] Failed to process messenger event and create lead',
      loggingError,
    )

    expect(response).toBeInstanceOf(Response)
    expect(response.ok).toBe(true)
    const body = await response.text()
    expect(body).toContain('window.location.replace("https://t.me/example")')

    consoleErrorSpy.mockRestore()
  })

  it('redirects without logging when referral code is missing', async () => {
    getQueryMock.mockReturnValue({})

    const handlerModule = await import('../../../../server/routes/go/telegram')
    const handler = handlerModule.default

    const response = await handler({} as any)

    expect(fetchMock).not.toHaveBeenCalled()
    expect(response).toBeInstanceOf(Response)
    expect(response.ok).toBe(true)
    expect(response.headers.get('content-type')).toContain('text/html')

    const body = await response.text()
    expect(body).toContain('window.location.replace("https://t.me/example")')
  })
})
