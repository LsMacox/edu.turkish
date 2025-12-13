export interface TelegramNotificationJob {
    channelId: string
    message: string
    parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2'
    disableWebPagePreview?: boolean
    disableNotification?: boolean
}

export interface TelegramSendMessageRequest {
    chat_id: string | number
    text: string
    parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2'
    disable_web_page_preview?: boolean
    disable_notification?: boolean
}

export interface TelegramAPIResponse<T = any> {
    ok: boolean
    result?: T
    description?: string
    error_code?: number
}

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

export interface TelegramNotificationResult {
    success: boolean
    messageId?: number
    error?: string
    timestamp: Date
}
