/**
 * Telegram Notification Type Definitions
 *
 * Types for Telegram Bot API and notification queue jobs
 */

/**
 * Telegram notification job data
 */
export interface TelegramNotificationJob {
  channelId: string
  message: string
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2'
  disableWebPagePreview?: boolean
  disableNotification?: boolean
}

/**
 * Telegram API sendMessage request
 */
export interface TelegramSendMessageRequest {
  chat_id: string | number
  text: string
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2'
  disable_web_page_preview?: boolean
  disable_notification?: boolean
}

/**
 * Telegram API response
 */
export interface TelegramAPIResponse<T = any> {
  ok: boolean
  result?: T
  description?: string
  error_code?: number
}

/**
 * Telegram message result
 */
export interface TelegramMessage {
  message_id: number
  date: number
  chat: {
    id: number
    type: string
    title?: string
  }
  text?: string
}

/**
 * Notification result
 */
export interface TelegramNotificationResult {
  success: boolean
  messageId?: number
  error?: string
  timestamp: Date
}
