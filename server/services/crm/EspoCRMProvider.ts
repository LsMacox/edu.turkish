import type { ICRMProvider } from './CRMProvider.interface'
import type { LeadData, ActivityData, CRMResult } from '~~/server/types/crm'
import { leadDataSchema, activityDataSchema } from '~~/server/types/crm'
import { getCRMConfig } from '~~/server/utils/crm-config'

interface EspoCRMLead {
  firstName: string
  lastName: string
  phoneNumber?: string
  emailAddress?: string
  referralCodeC: string
  source?: string
  userTypeC?: 'student' | 'parent'
  languageC?: 'turkish' | 'english' | 'both'
  universityC?: string
  description?: string
}

interface EspoCRMActivity {
  name: string
  type: string
  status?: 'Planned' | 'Held' | 'Not Held'
  description?: string
  dateStart?: string
  dateEnd?: string
}

export class EspoCRMProvider implements ICRMProvider {
  readonly providerName = 'espocrm' as const
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
      const headers = {
        ...init.headers,
        'X-Api-Key': this.config.apiKey || '',
        'Content-Type': 'application/json',
      }

      const response = await fetch(input, {
        ...init,
        headers,
        signal: controller.signal,
      })
      clearTimeout(timeout)
      return response
    } catch (error: any) {
      clearTimeout(timeout)

      if ((error.name === 'AbortError' || error.message?.includes('aborted')) && retries > 0) {
        console.warn(`EspoCRM request aborted, retrying... (${retries} attempts left)`)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return this.fetchWithTimeout(input, { ...init, retries: retries - 1 })
      }

      throw error
    }
  }

  private getApiUrl(endpoint: string): string {
    const baseUrl = this.config.baseUrl
    return `${baseUrl}/api/v1/${endpoint}`
  }

  async createLead(data: LeadData): Promise<CRMResult> {
    try {
      // Sanitize and validate input (handle blank lastName from legacy queued jobs)
      const sanitizedData: LeadData = {
        ...data,
        lastName:
          data.lastName && data.lastName.trim().length > 0 ? data.lastName.trim() : undefined,
      }
      leadDataSchema.parse(sanitizedData)

      const lead = this.transformLeadData(sanitizedData)
      const url = this.getApiUrl('Lead')

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        body: JSON.stringify(lead),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        try {
          const parsed = JSON.parse(errorText)
          const label = parsed?.messageTranslation?.label
          const field = parsed?.messageTranslation?.data?.field
          const type = parsed?.messageTranslation?.data?.type
          if (response.status === 400 && label === 'validationFailure' && field) {
            const validationErrors = [`Invalid ${field}${type ? ` (${type})` : ''}`]
            return {
              success: false,
              error: 'Validation failed',
              provider: 'espocrm',
              operation: 'createLead',
              timestamp: new Date(),
              validationErrors,
            }
          }
        } catch {
          // ignore JSON parse error
        }
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const result = await response.json()

      return {
        success: true,
        id: result.id,
        provider: 'espocrm',
        operation: 'createLead',
        timestamp: new Date(),
      }
    } catch (error: any) {
      console.error('EspoCRM createLead error:', error)
      const validationErrors = Array.isArray(error?.issues)
        ? error.issues.map((i: any) => i.message)
        : undefined
      return {
        success: false,
        error: validationErrors ? 'Validation failed' : error?.message || 'Unknown error',
        provider: 'espocrm',
        operation: 'createLead',
        timestamp: new Date(),
        ...(validationErrors ? { validationErrors } : {}),
      }
    }
  }

  async updateLead(id: string | number, data: Partial<LeadData>): Promise<CRMResult> {
    try {
      const lead = this.transformLeadData(data as LeadData, true)
      const url = this.getApiUrl(`Lead/${id}`)

      const response = await this.fetchWithTimeout(url, {
        method: 'PUT',
        body: JSON.stringify(lead),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const result = await response.json()

      return {
        success: true,
        id: result.id || id,
        provider: 'espocrm',
        operation: 'updateLead',
        timestamp: new Date(),
      }
    } catch (error: any) {
      console.error('EspoCRM updateLead error:', error)
      return {
        success: false,
        error: error.message,
        provider: 'espocrm',
        operation: 'updateLead',
        timestamp: new Date(),
      }
    }
  }

  async logActivity(data: ActivityData): Promise<CRMResult> {
    try {
      // Validate input
      activityDataSchema.parse(data)

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

      const activity: EspoCRMActivity = {
        name: `Messenger click: ${data.channel}`,
        type: 'Call',
        status: 'Held',
        description: descriptionLines.join('\n'),
        dateStart: new Date().toISOString(),
      }

      const url = this.getApiUrl('Activity')

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        body: JSON.stringify(activity),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const result = await response.json()

      return {
        success: true,
        id: result.id,
        provider: 'espocrm',
        operation: 'logActivity',
        timestamp: new Date(),
      }
    } catch (error: any) {
      console.error('EspoCRM logActivity error:', error)
      return {
        success: false,
        error: error.message,
        provider: 'espocrm',
        operation: 'logActivity',
        timestamp: new Date(),
      }
    }
  }

  async createMinimalLeadFromActivity(data: ActivityData): Promise<CRMResult> {
    try {
      // Validate input
      activityDataSchema.parse(data)

      const lead: EspoCRMLead = {
        firstName: 'Messenger',
        lastName: 'Lead',
        referralCodeC: data.referralCode,
        // Omit source to avoid enum validation issues; include channel in description
        description: JSON.stringify({
          channel: data.channel,
          utm: data.utm,
          session: data.session,
          metadata: data.metadata,
        }),
      }

      const url = this.getApiUrl('Lead')

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        body: JSON.stringify(lead),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const result = await response.json()

      return {
        success: true,
        id: result.id,
        provider: 'espocrm',
        operation: 'createMinimalLeadFromActivity',
        timestamp: new Date(),
      }
    } catch (error: any) {
      console.error('EspoCRM createMinimalLeadFromActivity error:', error)
      return {
        success: false,
        error: error.message,
        provider: 'espocrm',
        operation: 'createMinimalLeadFromActivity',
        timestamp: new Date(),
      }
    }
  }

  private transformLeadData(data: Partial<LeadData>, isUpdate = false): Partial<EspoCRMLead> {
    const lead: Partial<EspoCRMLead> = {}

    if (data.firstName) {
      lead.firstName = data.firstName
    }

    if (data.lastName) {
      lead.lastName = data.lastName
    }

    if (data.phone) {
      lead.phoneNumber = data.phone
    }

    if (data.email) {
      lead.emailAddress = data.email
    }

    if (data.referralCode) {
      lead.referralCodeC = data.referralCode
    }

    if (data.source) {
      const mapped = this.mapEspoSource(data.source)
      if (mapped) {
        lead.source = mapped
      }
    }

    if (data.userType) {
      lead.userTypeC = data.userType
    }

    if (data.language) {
      lead.languageC = data.language
    }

    if (data.universities && data.universities.length > 0) {
      lead.universityC = data.universities[0]
    }

    // Build description
    const descriptionParts: string[] = []

    if (data.sourceDescription) {
      descriptionParts.push(data.sourceDescription)
    }

    if (data.additionalInfo) {
      descriptionParts.push(data.additionalInfo)
    }

    if (data.utm) {
      descriptionParts.push(`UTM: ${JSON.stringify(data.utm)}`)
    }

    if (data.session) {
      descriptionParts.push(`Session: ${data.session}`)
    }

    if (data.programs && data.programs.length > 0) {
      descriptionParts.push(`Programs: ${data.programs.join(', ')}`)
    }

    if (data.scholarship) {
      descriptionParts.push(`Scholarship: ${data.scholarship}`)
    }

    if (descriptionParts.length > 0) {
      lead.description = descriptionParts.join('\n')
    }

    // Ensure required fields for create operations
    if (!isUpdate) {
      if (!lead.firstName || lead.firstName.trim().length === 0) {
        lead.firstName = 'Unknown'
      }
      if (!lead.lastName || lead.lastName.trim().length === 0) {
        lead.lastName = '-'
      }
    }

    return lead
  }

  private mapEspoSource(input?: string): string | undefined {
    if (!input) return undefined
    const normalized = input.toLowerCase()
    // Map internal sources to EspoCRM enum options; fallback to omit if unknown
    const map: Record<string, string> = {
      website: 'Web',
      web: 'Web',
      landing: 'Web',
      university_detail: 'Web',
      home_questionnaire: 'Web',
      test: 'Web',
      referral: 'Partner',
      partner: 'Partner',
    }
    return map[normalized]
  }
}
