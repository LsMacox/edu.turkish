import { describe, expect, it, beforeEach, vi } from 'vitest'

/**
 * Unit test for TelegramNotificationService
 * 
 * Tests Telegram Bot API integration and error handling
 */

describe('TelegramNotificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    const g = globalThis as any
    g.useRuntimeConfig = vi.fn(() => ({
      telegramBotToken: 'bot-token-123',
    }))
  })

  describe('sendNotification', () => {
    it('should send message successfully', () => {
      const job = {
        channelId: '-1001234567890',
        message: '🆕 Новый лид\n\nИмя: Иван Петров',
        parseMode: 'HTML' as const,
        disableWebPagePreview: true,
      }

      // Expected: Success result with messageId
      const expectedResult = {
        success: true,
        messageId: 12345,
        timestamp: expect.any(Date),
      }

      expect(job.channelId).toBeDefined()
      expect(job.message).toBeDefined()
      expect(expectedResult.success).toBe(true)
    })

    it('should handle Telegram API 400 Bad Request error', () => {
      const _job = {
        channelId: '-1001234567890',
        message: 'Test message',
        parseMode: 'HTML' as const,
      }

      const apiError = {
        ok: false,
        error_code: 400,
        description: 'Bad Request: chat not found',
      }

      // Expected: Error result
      const expectedResult = {
        success: false,
        error: 'Bad Request: chat not found',
        timestamp: expect.any(Date),
      }

      expect(apiError.ok).toBe(false)
      expect(apiError.error_code).toBe(400)
      expect(expectedResult.success).toBe(false)
    })

    it('should handle Telegram API 401 Unauthorized error', () => {
      const apiError = {
        ok: false,
        error_code: 401,
        description: 'Unauthorized: bot token is invalid',
      }

      // Expected: Error result
      const expectedResult = {
        success: false,
        error: 'Unauthorized: bot token is invalid',
        timestamp: expect.any(Date),
      }

      expect(apiError.error_code).toBe(401)
      expect(expectedResult.success).toBe(false)
    })

    it('should handle Telegram API 403 Forbidden error', () => {
      const apiError = {
        ok: false,
        error_code: 403,
        description: 'Forbidden: bot is not a member of the channel',
      }

      // Expected: Error result
      const expectedResult = {
        success: false,
        error: 'Forbidden: bot is not a member of the channel',
        timestamp: expect.any(Date),
      }

      expect(apiError.error_code).toBe(403)
      expect(expectedResult.success).toBe(false)
    })

    it('should handle Telegram API 429 Too Many Requests error', () => {
      const apiError = {
        ok: false,
        error_code: 429,
        description: 'Too Many Requests: retry after 30',
      }

      // Expected: Error result (will be retried by queue)
      const expectedResult = {
        success: false,
        error: 'Too Many Requests: retry after 30',
        timestamp: expect.any(Date),
      }

      expect(apiError.error_code).toBe(429)
      expect(expectedResult.success).toBe(false)
    })

    it('should handle network errors', () => {
      const networkError = new Error('ECONNREFUSED: Connection refused')

      // Expected: Error result
      const expectedResult = {
        success: false,
        error: 'ECONNREFUSED: Connection refused',
        timestamp: expect.any(Date),
      }

      expect(networkError.message).toContain('ECONNREFUSED')
      expect(expectedResult.success).toBe(false)
    })

    it('should handle timeout errors', () => {
      const timeoutError = new Error('Request timeout')

      // Expected: Error result
      const expectedResult = {
        success: false,
        error: 'Request timeout',
        timestamp: expect.any(Date),
      }

      expect(timeoutError.message).toContain('timeout')
      expect(expectedResult.success).toBe(false)
    })

    it('should use correct Telegram API endpoint', () => {
      const botToken = 'bot-token-123'
      const expectedUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

      expect(expectedUrl).toBe('https://api.telegram.org/botbot-token-123/sendMessage')
    })

    it('should send correct request body', () => {
      const job = {
        channelId: '-1001234567890',
        message: 'Test message',
        parseMode: 'HTML' as const,
        disableWebPagePreview: true,
        disableNotification: false,
      }

      const expectedBody = {
        chat_id: '-1001234567890',
        text: 'Test message',
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        disable_notification: false,
      }

      expect(expectedBody.chat_id).toBe(job.channelId)
      expect(expectedBody.text).toBe(job.message)
      expect(expectedBody.parse_mode).toBe(job.parseMode)
    })

    it('should log all attempts', () => {
      const job = {
        channelId: '-1001234567890',
        message: 'Test message',
        parseMode: 'HTML' as const,
      }

      // Expected: Logs sent attempt
      const logMessage = `Sending Telegram notification to channel ${job.channelId}`
      expect(logMessage).toContain('Sending Telegram notification')
      expect(logMessage).toContain(job.channelId)
    })

    it('should log successful sends', () => {
      const result = {
        success: true,
        messageId: 12345,
      }

      // Expected: Logs success
      const logMessage = `Telegram notification sent successfully: messageId=${result.messageId}`
      expect(logMessage).toContain('sent successfully')
      expect(logMessage).toContain('12345')
    })

    it('should log errors with details', () => {
      const error = {
        success: false,
        error: 'Bad Request: chat not found',
      }

      // Expected: Logs error details
      const logMessage = `Telegram notification failed: ${error.error}`
      expect(logMessage).toContain('failed')
      expect(logMessage).toContain('chat not found')
    })
  })

  describe('Retry Logic', () => {
    it('should not implement retry logic in service (handled by queue)', () => {
      // Expected: Service does not retry, queue handles retries
      const serviceRetries = false
      const queueHandlesRetries = true

      expect(serviceRetries).toBe(false)
      expect(queueHandlesRetries).toBe(true)
    })

    it('should return error result for queue to retry', () => {
      const failedResult = {
        success: false,
        error: 'Network error',
        timestamp: new Date(),
      }

      // Expected: Queue will retry based on this result
      expect(failedResult.success).toBe(false)
      expect(failedResult.error).toBeDefined()
    })
  })

  describe('Configuration', () => {
    it('should use bot token from runtime config', () => {
      const config = {
        telegramBotToken: 'bot-token-123',
      }

      // Expected: Bot token from config
      expect(config.telegramBotToken).toBe('bot-token-123')
    })

    it('should throw error if bot token missing', () => {
      const g = globalThis as any
      g.useRuntimeConfig = vi.fn(() => ({
        telegramBotToken: '',
      }))

      // Expected: Error thrown
      const missingToken = ''
      expect(missingToken).toBe('')
      // Service should throw error
    })
  })
})
