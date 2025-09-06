import type { BitrixConfig } from '../services/BitrixService'

/**
 * Получение конфигурации Bitrix из переменных окружения
 */
export function getBitrixConfig(): BitrixConfig {
  const config: BitrixConfig = {
    domain: process.env.BITRIX_DOMAIN || '',
    accessToken: process.env.BITRIX_ACCESS_TOKEN || '',
    webhookUrl: process.env.BITRIX_WEBHOOK_URL
  }

  // Проверяем что есть либо домен + токен, либо webhook URL
  if (!config.webhookUrl && (!config.domain || !config.accessToken)) {
    throw new Error('Bitrix configuration is missing. Please set either BITRIX_WEBHOOK_URL or both BITRIX_DOMAIN and BITRIX_ACCESS_TOKEN environment variables.')
  }

  return config
}

/**
 * Проверка настроек Bitrix
 */
export function validateBitrixConfig(): boolean {
  try {
    getBitrixConfig()
    return true
  } catch {
    return false
  }
}

/**
 * Получение URL для API Bitrix
 */
export function getBitrixApiUrl(method: string): string {
  const config = getBitrixConfig()
  
  if (config.webhookUrl) {
    // Нормализуем: если в webhookUrl уже есть crm.<method>, заменяем его
    const withMethodRegex = /\/crm\.[a-z_]+(?:\.json)?$/
    if (withMethodRegex.test(config.webhookUrl)) {
      return config.webhookUrl.replace(withMethodRegex, `/${method}.json`)
    }
    // Если метод отсутствует в конце, добавляем его
    const trailingSlash = config.webhookUrl.endsWith('/') ? '' : '/'
    return `${config.webhookUrl}${trailingSlash}${method}.json`
  }
  
  // Support two auth modes when webhookUrl is not provided:
  // 1) Webhook style: /rest/<userId>/<code>/{method}.json
  // 2) OAuth style:   /rest/{method}.json?auth=<accessToken>
  const authMode = (process.env.BITRIX_AUTH_MODE || '').toLowerCase()
  const userId = process.env.BITRIX_USER_ID

  if (authMode === 'webhook' || (userId && !authMode)) {
    return `https://${config.domain}/rest/${userId || '1'}/${config.accessToken}/${method}.json`
  }

  // Default to OAuth if mode not specified
  return `https://${config.domain}/rest/${method}.json?auth=${config.accessToken}`
}
