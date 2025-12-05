export class WebhookValidationError extends Error {
  constructor(
    message: string,
    public details?: any,
  ) {
    super(message)
    this.name = 'WebhookValidationError'
  }
}

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

export class TeamFilterError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TeamFilterError'
  }
}
