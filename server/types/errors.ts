/**
 * Custom Error Types
 *
 * Structured error classes for better error handling and logging
 */

/**
 * Webhook validation error
 */
export class WebhookValidationError extends Error {
  constructor(
    message: string,
    public details?: any,
  ) {
    super(message)
    this.name = 'WebhookValidationError'
  }
}

/**
 * Telegram API error
 */
export class TelegramAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any,
  ) {
    super(message)
    this.name = 'TelegramAPIError'
  }
}

/**
 * Team filter error
 */
export class TeamFilterError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TeamFilterError'
  }
}
