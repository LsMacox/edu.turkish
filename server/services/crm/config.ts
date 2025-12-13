import type { CrmProviderConfig, CrmFieldMappingConfig } from '~~/lib/types/server'
import { parsePositiveInt } from '~~/lib/utils/number'

export function getCrmConfig(): CrmProviderConfig {
    const timeout = parsePositiveInt(process.env.CRM_TIMEOUT_MS) ?? 15000
    const retries = (() => {
        const raw = process.env.CRM_RETRIES
        if (raw === undefined) return 2
        const n = Math.floor(Number(raw))
        return Number.isFinite(n) && n >= 0 ? n : 2
    })()

    const apiUrl = process.env.ESPOCRM_URL
    const apiKey = process.env.ESPOCRM_API_KEY
    const espoAssignedUserId = process.env.ESPOCRM_ASSIGNED_USER_ID
    const espoAssignedTeamId = process.env.ESPOCRM_ASSIGNED_TEAM_ID

    if (!apiUrl || !apiKey) {
        throw new Error(
            'EspoCRM configuration incomplete: ESPOCRM_URL and ESPOCRM_API_KEY are required',
        )
    }

    const normalizedBase = apiUrl.replace(/\/?api\/v\d+\/?$/, '')

    return {
        provider: 'espocrm',
        baseUrl: normalizedBase,
        apiKey,
        timeout,
        retries,
        fieldMappings: getEspoFieldMappings(),
        espoAssignedUserId,
        espoAssignedTeamId,
    }
}

function getEspoFieldMappings(): CrmFieldMappingConfig {
    return {
        referralCode: process.env.ESPOCRM_MAP_REFERRAL_CODE || 'referralCodeC',
        userType: process.env.ESPOCRM_MAP_USER_TYPE || 'userTypeC',
        language: process.env.ESPOCRM_MAP_LANGUAGE || 'languageC',
        university: process.env.ESPOCRM_MAP_UNIVERSITY || 'universityC',
        source: 'source',
        fingerprintKey: process.env.ESPOCRM_MAP_FINGERPRINT_KEY || 'fingerprintKeyC',
    }
}

export function validateCrmConfig(config?: CrmProviderConfig): void {
    const cfg = config || getCrmConfig()

    if (!/^https?:\/\//i.test(cfg.baseUrl)) {
        throw new Error('EspoCRM baseUrl must be a valid http(s) URL')
    }
    if (!cfg.apiKey) {
        throw new Error('EspoCRM apiKey is required')
    }
    if (!(Number.isFinite(cfg.timeout) && cfg.timeout > 0)) {
        throw new Error('CRM timeout must be a positive number')
    }
    if (!(Number.isFinite(cfg.retries) && cfg.retries >= 0)) {
        throw new Error('CRM retries must be a non-negative number')
    }
}
