import type { BitrixConfig, CrmProviderType, EspoCrmConfig } from '~~/server/types/api/crm'
import type { CRMProviderConfig, FieldMappingConfig } from '~~/server/types/crm'

export function getCrmProvider(): CrmProviderType {
  const provider = (process.env.CRM_PROVIDER || 'espocrm').toLowerCase()
  return provider === 'espocrm' ? 'espocrm' : 'bitrix'
}

export function getBitrixConfig(): BitrixConfig {
  const webhookUrl = process.env.BITRIX_WEBHOOK_URL

  if (!webhookUrl) {
    throw new Error('Bitrix configuration incomplete: BITRIX_WEBHOOK_URL is required')
  }

  // Format: https://domain.bitrix24.com/rest/1/token/
  const urlMatch = webhookUrl.match(/https?:\/\/([^/]+)\/rest\/\d+\/([^/]+)/)
  
  if (!urlMatch || !urlMatch[1] || !urlMatch[2]) {
    throw new Error('Invalid BITRIX_WEBHOOK_URL format')
  }

  const domain = urlMatch[1]
  const accessToken = urlMatch[2]

  return {
    domain,
    accessToken,
    webhookUrl,
  }
}

/**
 * @throws Error if required configuration is missing
 */
export function getEspoCrmConfig(): EspoCrmConfig {
  const apiUrl = process.env.ESPOCRM_URL
  const apiKey = process.env.ESPOCRM_API_KEY

  if (!apiUrl || !apiKey) {
    const missing: string[] = []
    if (!apiUrl) missing.push('ESPOCRM_URL')
    if (!apiKey) missing.push('ESPOCRM_API_KEY')
    throw new Error(`EspoCRM configuration incomplete: ${missing.join(' and ')} ${missing.length === 1 ? 'is' : 'are'} required`)
  }

  return {
    apiUrl,
    apiKey,
  }
}

/**
 * Get CRM configuration for the currently configured provider
 * Builds a unified CRMProviderConfig used by CRMFactory and providers
 *
 * @returns CRMProviderConfig for the active provider
 * @throws Error if configuration is invalid
 */
export function getCRMConfig(): CRMProviderConfig {
  const provider = getCrmProvider()

  const timeout = 15000 // 15 seconds
  const retries = 2

  const base: Pick<CRMProviderConfig, 'provider' | 'timeout' | 'retries' | 'fieldMappings'> = {
    provider,
    timeout,
    retries,
    fieldMappings: getDefaultFieldMappings(),
  }

  if (provider === 'espocrm') {
    const apiUrl = process.env.ESPOCRM_URL
    const apiKey = process.env.ESPOCRM_API_KEY

    if (!apiUrl || !apiKey) {
      throw new Error('EspoCRM configuration incomplete: ESPOCRM_URL and ESPOCRM_API_KEY are required')
    }

    // Normalize base URL to NOT include trailing /api/v1
    const normalizedBase = apiUrl.replace(/\/?api\/v\d+\/?$/, '')

    return {
      ...base,
      baseUrl: normalizedBase,
      apiKey,
    }
  }

  const webhookUrl = process.env.BITRIX_WEBHOOK_URL
  if (!webhookUrl) {
    throw new Error('Bitrix configuration incomplete: BITRIX_WEBHOOK_URL is required')
  }

  const trimmed = webhookUrl.replace(/\/?$/, '')

  return {
    ...base,
    baseUrl: trimmed,
    webhookUrl: trimmed,
  }
}

function getDefaultFieldMappings(): FieldMappingConfig {
  return {
    referralCode: process.env.CRM_MAP_REFERRAL_CODE || 'UF_CRM_REFERRAL_CODE',
    userType: process.env.CRM_MAP_USER_TYPE || 'UF_CRM_1234567893',
    language: process.env.CRM_MAP_LANGUAGE || 'UF_CRM_1234567894',
    university: process.env.CRM_MAP_UNIVERSITY || 'UF_CRM_1234567897',
    source: process.env.CRM_MAP_SOURCE || 'SOURCE_ID',
  }
}

/**
 * Validate CRM configuration for the configured provider
 * 
 * @returns Validation result with provider and errors
 */
export function validateCrmConfig(): {
  isValid: boolean
  provider: CrmProviderType
  errors: string[]
} {
  const provider = getCrmProvider()
  const errors: string[] = []

  try {
    if (provider === 'bitrix') {
      getBitrixConfig()
    } else {
      getEspoCrmConfig()
    }
  } catch (error: any) {
    errors.push(error.message || 'Unknown configuration error')
  }

  return {
    isValid: errors.length === 0,
    provider,
    errors,
  }
}

/**
 * Strict config validation used by CRMFactory
 * Throws on invalid configuration
 */
export function validateCRMConfig(config?: CRMProviderConfig): void {
  const cfg = config || getCRMConfig()

  const urlOk = (u?: string) => !!u && /^https?:\/\//i.test(u)

  if (cfg.provider === 'espocrm') {
    if (!urlOk(cfg.baseUrl)) {
      throw new Error('EspoCRM baseUrl must be a valid http(s) URL')
    }
    if (!cfg.apiKey) {
      throw new Error('EspoCRM apiKey is required')
    }
  } else if (cfg.provider === 'bitrix') {
    if (!urlOk(cfg.webhookUrl || cfg.baseUrl)) {
      throw new Error('Bitrix webhookUrl/baseUrl must be a valid http(s) URL')
    }
  }

  if (!(Number.isFinite(cfg.timeout) && cfg.timeout > 0)) {
    throw new Error('CRM timeout must be a positive number')
  }
  if (!(Number.isFinite(cfg.retries) && cfg.retries >= 0)) {
    throw new Error('CRM retries must be a non-negative number')
  }
}
