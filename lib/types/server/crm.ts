export interface CrmProviderConfig {
    provider: 'espocrm'
    baseUrl: string
    apiKey: string
    timeout: number
    retries: number
    fieldMappings: CrmFieldMappingConfig
    espoAssignedUserId?: string
    espoAssignedTeamId?: string
}

export interface CrmFieldMappingConfig {
    referralCode: string
    userType: string
    language: string
    university: string
    source: string
    fingerprintKey?: string
}

export interface CrmResult {
    success: boolean
    id?: string | number
    error?: string
    provider: 'espocrm'
    operation: 'createLead'
    timestamp: Date
    duplicate?: boolean
    validationErrors?: string[]
}

// Re-export LeadData from Zod schema for backwards compatibility
export type { LeadData, LeadDataOutput } from '~~/lib/schemas/crm'
