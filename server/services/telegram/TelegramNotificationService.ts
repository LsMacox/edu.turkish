import type {
  TelegramNotificationJob,
  TelegramNotificationResult,
  TelegramSendMessageRequest,
  TelegramAPIResponse,
  TelegramMessage,
} from '~~/server/types/telegram'

/**
 * Telegram Notification Service
 *
 * Sends notifications to Telegram channels using Bot API
 */
export class TelegramNotificationService {
  private botToken: string

  constructor(botToken: string) {
    if (!botToken) {
      throw new Error('Telegram bot token is required')
    }
    this.botToken = botToken
  }

  /**
   * Send notification to Telegram channel
   */
  async sendNotification(job: TelegramNotificationJob): Promise<TelegramNotificationResult> {
    const timestamp = new Date()

    try {
      console.log(`Sending Telegram notification to channel ${job.channelId}`)

      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`

      const requestBody: TelegramSendMessageRequest = {
        chat_id: job.channelId,
        text: job.message,
        parse_mode: job.parseMode || 'HTML',
        disable_web_page_preview: job.disableWebPagePreview ?? true,
        disable_notification: job.disableNotification ?? false,
      }

      const response = await $fetch<TelegramAPIResponse<TelegramMessage>>(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      })

      if (response.ok && response.result) {
        console.log(
          `Telegram notification sent successfully: messageId=${response.result.message_id}`,
        )
        return {
          success: true,
          messageId: response.result.message_id,
          timestamp,
        }
      } else {
        const error = response.description || 'Unknown error'
        console.error(`Telegram API error: ${error}`)
        return {
          success: false,
          error,
          timestamp,
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || String(error)
      console.error(`Telegram notification failed: ${errorMessage}`, error)

      return {
        success: false,
        error: errorMessage,
        timestamp,
      }
    }
  }
}

/**
 * Create TelegramNotificationService instance from runtime config
 */
export function createTelegramNotificationService(): TelegramNotificationService {
  const config = useRuntimeConfig()
  return new TelegramNotificationService(config.telegramBotToken)
}
