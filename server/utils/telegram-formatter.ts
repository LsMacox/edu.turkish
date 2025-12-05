import type { EspoCRMLead } from '~~/server/types/espocrm-webhook'

/**
 * Telegram Message Formatter
 *
 * Formats EspoCRM entities into HTML-formatted Telegram messages
 */

/**
 * Escape HTML special characters for Telegram
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Format duration in seconds as MM:SS
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Format ISO datetime string as DD.MM.YYYY HH:mm
 */
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

/**
 * Truncate text to max length and add ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength) + '...'
}

export function formatLeadNotification(lead: EspoCRMLead): string {
  const lines: string[] = ['🆕 <b>Новый лид</b>', '']

  // Name
  const fullName = [lead.firstName, lead.lastName].filter(Boolean).join(' ')
  if (fullName) {
    lines.push(`👤 <b>Имя:</b> ${escapeHtml(fullName)}`)
  } else if (lead.name) {
    lines.push(`👤 <b>Имя:</b> ${escapeHtml(lead.name)}`)
  }

  // Phone
  if (lead.phoneNumber) {
    lines.push(`📱 <b>Телефон:</b> ${escapeHtml(lead.phoneNumber)}`)
  }

  // Email
  if (lead.emailAddress) {
    lines.push(`📧 <b>Email:</b> ${escapeHtml(lead.emailAddress)}`)
  }

  // Company
  if (lead.accountName) {
    lines.push(`🏢 <b>Компания:</b> ${escapeHtml(lead.accountName)}`)
  }

  // Source
  if (lead.source) {
    lines.push(`🌐 <b>Источник:</b> ${escapeHtml(lead.source)}`)
  }

  // Status
  if (lead.status) {
    lines.push(`📊 <b>Статус:</b> ${escapeHtml(lead.status)}`)
  }

  // Description (truncated to 200 chars)
  if (lead.description) {
    const truncated = truncateText(lead.description, 200)
    lines.push(`📝 <b>Описание:</b> ${escapeHtml(truncated)}`)
  }

  // Assigned user
  if (lead.assignedUserName) {
    lines.push(`👨‍💼 <b>Ответственный:</b> ${escapeHtml(lead.assignedUserName)}`)
  }

  // Timestamp
  if (lead.createdAt) {
    lines.push(`⏰ <b>Время:</b> ${formatDateTime(lead.createdAt)}`)
  }

  return lines.join('\n')
}

type MessengerChannel = 'whatsapp' | 'telegramBot' | 'instagram'

interface MessengerTouchPayload {
  channel: MessengerChannel
  referralCode?: string
  sessionId?: string
  utm?: Record<string, any> | undefined
  timestamp?: string
}

const messengerChannelLabels: Record<MessengerChannel, string> = {
  whatsapp: 'WhatsApp',
  telegramBot: 'Telegram',
  instagram: 'Instagram',
}

export function formatMessengerTouchNotification(payload: MessengerTouchPayload): string {
  const lines: string[] = ['📨 <b>Новый контакт</b>', '']

  const channelLabel = messengerChannelLabels[payload.channel] || payload.channel
  lines.push(`📡 <b>Канал:</b> ${escapeHtml(channelLabel)}`)

  if (payload.referralCode) {
    lines.push(`🏷 <b>Реферал:</b> ${escapeHtml(payload.referralCode)}`)
  }

  if (payload.sessionId) {
    lines.push(`🆔 <b>Сессия:</b> ${escapeHtml(payload.sessionId)}`)
  }

  if (payload.utm && Object.keys(payload.utm).length > 0) {
    const utmParts: string[] = []
    for (const key of ['source', 'medium', 'campaign', 'term', 'content']) {
      const value = (payload.utm as Record<string, any>)[key]
      if (typeof value === 'string' && value.trim().length > 0) {
        utmParts.push(`${key}=${escapeHtml(value)}`)
      }
    }
    if (utmParts.length > 0) {
      lines.push(`🌐 <b>UTM:</b> ${utmParts.join(', ')}`)
    }
  }

  const ts = payload.timestamp || new Date().toISOString()
  lines.push(`⏰ <b>Время:</b> ${formatDateTime(ts)}`)

  return lines.join('\n')
}
