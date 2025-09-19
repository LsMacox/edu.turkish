import type { BitrixConfig } from '../services/BitrixService'

export interface BitrixActivityConfig {
  ownerId?: number
  ownerTypeId?: number
  responsibleId?: number
}

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

const parsePositiveInteger = (value: string | undefined, envKey: string, logger: Pick<Console, 'error'>): number | undefined => {
  if (!value) {
    return undefined
  }

  const numericValue = Number(value)

  if (!Number.isFinite(numericValue) || !Number.isInteger(numericValue) || numericValue <= 0) {
    logger.error(`[Bitrix] ${envKey} must be a positive integer. Received: "${value}"`)
    return undefined
  }

  return numericValue
}

export function getBitrixActivityConfig(
  env: NodeJS.ProcessEnv = process.env,
  logger: Pick<Console, 'error'> = console
): BitrixActivityConfig {
  const ownerId = parsePositiveInteger(env.BITRIX_ACTIVITY_OWNER_ID, 'BITRIX_ACTIVITY_OWNER_ID', logger)
  const ownerTypeId = parsePositiveInteger(env.BITRIX_ACTIVITY_OWNER_TYPE_ID, 'BITRIX_ACTIVITY_OWNER_TYPE_ID', logger)
  const responsibleId = parsePositiveInteger(env.BITRIX_ACTIVITY_RESPONSIBLE_ID, 'BITRIX_ACTIVITY_RESPONSIBLE_ID', logger)

  const config: BitrixActivityConfig = {}

  if (ownerId) {
    config.ownerId = ownerId
  }

  if (ownerTypeId) {
    config.ownerTypeId = ownerTypeId
  }

  if (responsibleId) {
    config.responsibleId = responsibleId
  }

  return config
}
