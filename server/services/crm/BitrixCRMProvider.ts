import type { ICRMProvider } from './CRMProvider.interface'
import type { LeadData, ActivityData, CRMResult } from '~~/server/types/crm'
import { leadDataSchema, activityDataSchema } from '~~/server/types/crm'
import { getCRMConfig } from '~~/server/utils/crm-config'

interface BitrixLead {
  TITLE: string
  NAME: string
  LAST_NAME?: string
  PHONE?: { VALUE: string; VALUE_TYPE: string }[]
  EMAIL?: { VALUE: string; VALUE_TYPE: string }[]
  COMMENTS?: string
  SOURCE_ID?: string
  SOURCE_DESCRIPTION?: string
  UF_CRM_REFERRAL_CODE?: string
  UF_CRM_1234567893?: string // userType
  UF_CRM_1234567894?: string // language
  UF_CRM_1234567897?: string // university
}

interface BitrixActivityFields {
  SUBJECT: string
  DESCRIPTION: string
  TYPE_ID: number
  COMPLETED: 'N' | 'Y'
  START_TIME: string
  END_TIME: string
  COMMUNICATIONS: { TYPE: 'IM'; VALUE: string }[]
}

export class BitrixCRMProvider implements ICRMProvider {
  readonly providerName = 'bitrix' as const
  private config = getCRMConfig()

  private async fetchWithTimeout(
    input: RequestInfo | URL,
    init: RequestInit & { timeoutMs?: number; retries?: number } = {},
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutMs = init.timeoutMs ?? this.config.timeout
    const retries = init.retries ?? this.config.retries

    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(input, { ...init, signal: controller.signal })
      clearTimeout(timeout)
      return response
    } catch (error: any) {
      clearTimeout(timeout)

      if ((error.name === 'AbortError' || error.message?.includes('aborted')) && retries > 0) {
        console.warn(`Bitrix request aborted, retrying... (${retries} attempts left)`)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return this.fetchWithTimeout(input, { ...init, retries: retries - 1 })
      }

      throw error
    }
  }

  private getBitrixApiUrl(method: string): string {
    const baseUrl = this.config.webhookUrl || this.config.baseUrl
    return `${baseUrl}/${method}.json`
  }

  async createLead(data: LeadData): Promise<CRMResult> {
    try {
      // Sanitize and validate input (handle blank lastName from legacy queued jobs)
      const sanitizedData: LeadData = {
        ...data,
        lastName:
          data.lastName && data.lastName.trim().length > 0 ? data.lastName.trim() : undefined,
      }
      // Validate input
      leadDataSchema.parse(sanitizedData)

      const lead = this.transformLeadData(sanitizedData)
      const url = this.getBitrixApiUrl('crm.lead.add')

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: lead }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error_description || result.error)
      }

      return {
        success: true,
        id: result.result,
        provider: 'bitrix',
        operation: 'createLead',
        timestamp: new Date(),
      }
    } catch (error: any) {
      console.error('Bitrix createLead error:', error)
      const validationErrors = Array.isArray(error?.issues)
        ? error.issues.map((i: any) => i.message)
        : undefined
      return {
        success: false,
        error: validationErrors ? 'Validation failed' : error?.message || 'Unknown error',
        provider: 'bitrix',
        operation: 'createLead',
        timestamp: new Date(),
        ...(validationErrors ? { validationErrors } : {}),
      }
    }
  }

  async updateLead(id: string | number, data: Partial<LeadData>): Promise<CRMResult> {
    try {
      const lead = this.transformLeadData(data as LeadData, true)
      const url = this.getBitrixApiUrl('crm.lead.update')

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, fields: lead }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error_description || result.error)
      }

      return {
        success: true,
        id,
        provider: 'bitrix',
        operation: 'updateLead',
        timestamp: new Date(),
      }
    } catch (error: any) {
      console.error('Bitrix updateLead error:', error)
      return {
        success: false,
        error: error.message,
        provider: 'bitrix',
        operation: 'updateLead',
        timestamp: new Date(),
      }
    }
  }

  async logActivity(data: ActivityData): Promise<CRMResult> {
    try {
      // Validate input
      activityDataSchema.parse(data)

      const now = new Date().toISOString()
      const descriptionLines = [`Channel: ${data.channel}`, `Referral: ${data.referralCode}`]

      if (data.session) {
        descriptionLines.push(`Session: ${data.session}`)
      }

      if (data.utm) {
        descriptionLines.push(`UTM: ${JSON.stringify(data.utm)}`)
      }

      if (data.metadata) {
        descriptionLines.push(`Metadata: ${JSON.stringify(data.metadata)}`)
      }

      const fields: BitrixActivityFields = {
        SUBJECT: `Messenger click: ${data.channel}`,
        DESCRIPTION: descriptionLines.join('\n'),
        TYPE_ID: 4,
        COMPLETED: 'N',
        START_TIME: now,
        END_TIME: now,
        COMMUNICATIONS: [{ TYPE: 'IM', VALUE: data.channel }],
      }

      const url = this.getBitrixApiUrl('crm.activity.add')

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error_description || result.error)
      }

      return {
        success: true,
        id: result.result,
        provider: 'bitrix',
        operation: 'logActivity',
        timestamp: new Date(),
      }
    } catch (error: any) {
      console.error('Bitrix logActivity error:', error)
      return {
        success: false,
        error: error.message,
        provider: 'bitrix',
        operation: 'logActivity',
        timestamp: new Date(),
      }
    }
  }

  async createMinimalLeadFromActivity(data: ActivityData): Promise<CRMResult> {
    try {
      // Validate input
      activityDataSchema.parse(data)

      const lead: BitrixLead = {
        TITLE: `Lead from ${data.channel} click`,
        NAME: 'Messenger Lead',
        SOURCE_ID: 'WEB',
        SOURCE_DESCRIPTION: `Referral: ${data.referralCode}`,
        COMMENTS: JSON.stringify({ utm: data.utm, session: data.session, metadata: data.metadata }),
        UF_CRM_REFERRAL_CODE: data.referralCode,
      }

      const url = this.getBitrixApiUrl('crm.lead.add')

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: lead }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error_description || result.error)
      }

      return {
        success: true,
        id: result.result,
        provider: 'bitrix',
        operation: 'createMinimalLeadFromActivity',
        timestamp: new Date(),
      }
    } catch (error: any) {
      console.error('Bitrix createMinimalLeadFromActivity error:', error)
      return {
        success: false,
        error: error.message,
        provider: 'bitrix',
        operation: 'createMinimalLeadFromActivity',
        timestamp: new Date(),
      }
    }
  }

  private transformLeadData(data: Partial<LeadData>, isUpdate = false): Partial<BitrixLead> {
    const lead: Partial<BitrixLead> = {}

    if (data.firstName) {
      lead.NAME = data.firstName
    }

    if (data.lastName) {
      lead.LAST_NAME = data.lastName
    }

    if (data.phone) {
      lead.PHONE = [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }]
    }

    if (data.email) {
      lead.EMAIL = [{ VALUE: data.email, VALUE_TYPE: 'WORK' }]
    }

    if (!isUpdate) {
      lead.TITLE = `Lead - ${data.firstName || ''} ${data.lastName || ''}`.trim()
      lead.SOURCE_ID = 'WEB'
      lead.SOURCE_DESCRIPTION = data.sourceDescription || data.source
    }

    if (data.referralCode) {
      lead.UF_CRM_REFERRAL_CODE = data.referralCode
    }

    if (data.userType) {
      lead.UF_CRM_1234567893 = data.userType
    }

    if (data.language) {
      lead.UF_CRM_1234567894 = data.language
    }

    if (data.universities && data.universities.length > 0) {
      lead.UF_CRM_1234567897 = data.universities[0]
    }

    // Build comments
    const comments: string[] = []

    if (data.additionalInfo) {
      comments.push(data.additionalInfo)
    }

    if (data.utm) {
      comments.push(`UTM: ${JSON.stringify(data.utm)}`)
    }

    if (data.session) {
      comments.push(`Session: ${data.session}`)
    }

    if (comments.length > 0) {
      lead.COMMENTS = comments.join('\n')
    }

    return lead
  }
}
