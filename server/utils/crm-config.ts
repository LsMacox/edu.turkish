import type { CRMProviderConfig, FieldMappingConfig } from '~~/server/types/crm'

export function getCRMConfig(): CRMProviderConfig {
  const config = useRuntimeConfig()
  
  const provider = (config.crmProvider || 'bitrix') as 'bitrix' | 'espocrm'
  
  const fieldMappings: FieldMappingConfig = provider === 'espocrm' 
    ? {
        referralCode: 'referralCodeC',
        userType: 'userTypeC',
        language: 'languageC',
        fieldOfStudy: 'fieldOfStudyC',
        university: 'universityC',
        source: 'source',
      }
    : {
        referralCode: 'UF_CRM_REFERRAL_CODE',
        userType: 'UF_CRM_1234567893',
        language: 'UF_CRM_1234567894',
        fieldOfStudy: 'UF_CRM_1234567896',
        university: 'UF_CRM_1234567897',
        source: 'SOURCE_ID',
      }

  const crmConfig: CRMProviderConfig = {
    provider,
    baseUrl: provider === 'espocrm' 
      ? (String(config.espocrmUrl) || 'http://espocrm:8080')
      : (String(config.bitrixWebhookUrl) || ''),
    apiKey: provider === 'espocrm' ? String(config.espocrmApiKey) : undefined,
    webhookUrl: provider === 'bitrix' ? String(config.bitrixWebhookUrl) : undefined,
    accessToken: provider === 'bitrix' ? String(config.bitrixAccessToken) : undefined,
    timeout: 30000,
    retries: 3,
    fieldMappings,
  }

  return crmConfig
}

export function validateCRMConfig(config: CRMProviderConfig): void {
  if (!['bitrix', 'espocrm'].includes(config.provider)) {
    throw new Error(`Invalid CRM provider: ${config.provider}`)
  }

  if (!config.baseUrl) {
    throw new Error('CRM base URL is required')
  }

  if (config.timeout <= 0 || config.timeout > 30000) {
    throw new Error('CRM timeout must be between 0 and 30000ms')
  }

  if (config.retries < 0 || config.retries > 5) {
    throw new Error('CRM retries must be between 0 and 5')
  }

  if (config.provider === 'espocrm' && !config.apiKey) {
    throw new Error('EspoCRM API key is required')
  }

  if (config.provider === 'bitrix' && !config.webhookUrl && !config.accessToken) {
    throw new Error('Bitrix webhook URL or access token is required')
  }
}
