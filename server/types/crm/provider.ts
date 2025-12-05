export interface CRMProviderConfig {
  provider: 'espocrm'
  baseUrl: string
  apiKey: string
  timeout: number
  retries: number
  fieldMappings: FieldMappingConfig
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
