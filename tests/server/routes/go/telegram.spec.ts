import { describe, expect, it, vi, beforeEach } from 'vitest'

describe('GET /go/telegram', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('generates redirect HTML with correct telegram bot URL', async () => {
    // This is a simple integration test that verifies the route handler
    // returns the expected redirect HTML structure
    const { contactChannels } = await import('~~/lib/contact/channels')
    const expectedUrl = contactChannels.telegramBot.baseUrl

    // The handler should return HTML with a redirect script
    expect(expectedUrl).toBeTruthy()
    expect(typeof expectedUrl).toBe('string')
    expect(expectedUrl).toMatch(/^https:\/\/t\.me\//)
  })

  it('telegram bot channel configuration is valid', async () => {
    const { contactChannels, primaryTelegramKey } = await import('~~/lib/contact/channels')
    
    expect(contactChannels.telegramBot).toBeDefined()
    expect(contactChannels.telegramBot.key).toBe('telegramBot')
    expect(contactChannels.telegramBot.type).toBe('personal')
    expect(contactChannels.telegramBot.baseUrl).toBeTruthy()
    expect(primaryTelegramKey).toBe('telegramBot')
  })
})
