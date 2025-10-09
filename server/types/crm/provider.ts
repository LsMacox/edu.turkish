/**
 * CRM Provider Configuration Types
 */

export interface CRMProviderConfig {
  provider: 'bitrix' | 'espocrm'
  baseUrl: string
  apiKey?: string
  webhookUrl?: string
  accessToken?: string
  timeout: number
  retries: number
  fieldMappings: FieldMappingConfig
  // EspoCRM-specific optional defaults
  espoAssignedUserId?: string
  espoAssignedTeamId?: string
}

export interface FieldMappingConfig {
  referralCode: string
  userType: string
  language: string
  university: string
  source: string
  fingerprintKey?: string
}
