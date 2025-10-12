import type { EspoCRMLead, EspoCRMCall } from '~~/server/types/espocrm-webhook'

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

/**
 * Translate call status to Russian
 */
export function translateStatus(status: string): string {
  const translations: Record<string, string> = {
    Planned: 'Запланирован',
    Held: 'Состоялся',
    'Not Held': 'Не состоялся',
  }
  return translations[status] || status
}

/**
 * Translate call direction to Russian
 */
export function translateDirection(direction: string): string {
  const translations: Record<string, string> = {
    Outbound: 'Исходящий',
    Inbound: 'Входящий',
  }
  return translations[direction] || direction
}

/**
 * Format lead notification message for Telegram
 */
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

/**
 * Format call activity notification message for Telegram
 */
export function formatCallNotification(call: EspoCRMCall): string {
  const lines: string[] = ['📞 <b>Новый звонок</b>', '']

  // Contact name (prefer contactName, fallback to parentName)
  const contactName = call.contactName || call.parentName
  if (contactName) {
    lines.push(`👤 <b>Контакт:</b> ${escapeHtml(contactName)}`)
  }

  // Phone
  if (call.phoneNumber) {
    lines.push(`📱 <b>Телефон:</b> ${escapeHtml(call.phoneNumber)}`)
  }

  // Status (translated)
  if (call.status) {
    lines.push(`📊 <b>Статус:</b> ${translateStatus(call.status)}`)
  }

  // Direction (translated)
  if (call.direction) {
    lines.push(`↔️ <b>Направление:</b> ${translateDirection(call.direction)}`)
  }

  // Duration (formatted as MM:SS)
  if (call.duration !== undefined) {
    lines.push(`⏱ <b>Длительность:</b> ${formatDuration(call.duration)}`)
  }

  // Description (truncated to 300 chars)
  if (call.description) {
    const truncated = truncateText(call.description, 300)
    lines.push(`📝 <b>Заметки:</b> ${escapeHtml(truncated)}`)
  }

  // Assigned user
  if (call.assignedUserName) {
    lines.push(`👨‍💼 <b>Ответственный:</b> ${escapeHtml(call.assignedUserName)}`)
  }

  // Timestamp (use dateStart if available, otherwise createdAt)
  const timestamp = call.dateStart || call.createdAt
  if (timestamp) {
    lines.push(`⏰ <b>Время:</b> ${formatDateTime(timestamp)}`)
  }

  return lines.join('\n')
}
