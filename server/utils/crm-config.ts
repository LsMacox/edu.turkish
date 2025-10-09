import type { CRMProviderConfig, FieldMappingConfig } from '~~/server/types/crm'

export function getCrmProvider(): 'bitrix' | 'espocrm' {
  const provider = (process.env.CRM_PROVIDER || 'espocrm').toLowerCase()
  return provider === 'espocrm' ? 'espocrm' : 'bitrix'
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
    fieldMappings: provider === 'espocrm' ? getEspoFieldMappings() : getBitrixFieldMappings(),
  }

  if (provider === 'espocrm') {
    const apiUrl = process.env.ESPOCRM_URL
    const apiKey = process.env.ESPOCRM_API_KEY
    const espoAssignedUserId = process.env.ESPOCRM_ASSIGNED_USER_ID
    const espoAssignedTeamId = process.env.ESPOCRM_ASSIGNED_TEAM_ID

    if (!apiUrl || !apiKey) {
      throw new Error(
        'EspoCRM configuration incomplete: ESPOCRM_URL and ESPOCRM_API_KEY are required',
      )
    }

    // Normalize base URL to NOT include trailing /api/v1
    const normalizedBase = apiUrl.replace(/\/?api\/v\d+\/?$/, '')

    return {
      ...base,
      baseUrl: normalizedBase,
      apiKey,
      espoAssignedUserId,
      espoAssignedTeamId,
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

function getBitrixFieldMappings(): FieldMappingConfig {
  // Defaults tailored for Bitrix, overridable via CRM_MAP_* env vars
  return {
    referralCode: process.env.CRM_MAP_REFERRAL_CODE || 'UF_CRM_REFERRAL_CODE',
    userType: process.env.CRM_MAP_USER_TYPE || 'UF_CRM_1234567893',
    language: process.env.CRM_MAP_LANGUAGE || 'UF_CRM_1234567894',
    university: process.env.CRM_MAP_UNIVERSITY || 'UF_CRM_1234567897',
    source: process.env.CRM_MAP_SOURCE || 'SOURCE_ID',
    fingerprintKey: process.env.CRM_MAP_FINGERPRINT_KEY,
  }
}

function getEspoFieldMappings(): FieldMappingConfig {
  // Defaults tailored for EspoCRM custom field names, overridable via ESPOCRM_MAP_* env vars
  return {
    referralCode: process.env.ESPOCRM_MAP_REFERRAL_CODE || 'referralCodeC',
    userType: process.env.ESPOCRM_MAP_USER_TYPE || 'userTypeC',
    language: process.env.ESPOCRM_MAP_LANGUAGE || 'languageC',
    university: process.env.ESPOCRM_MAP_UNIVERSITY || 'universityC',
    source: 'source', // built-in Espo field; do not remap
    fingerprintKey: process.env.ESPOCRM_MAP_FINGERPRINT_KEY || 'fingerprintKeyC',
  }
}

/**
 * Validate CRM configuration for the configured provider
 *
 * @returns Validation result with provider and errors
 */
// Soft validator removed; use strict validateCRMConfig(getCRMConfig()) instead

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
