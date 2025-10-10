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
  assignedUserId?: string
  teamsIds?: string[]
}

interface EspoCRMActivity {
  name: string
  status?: 'Planned' | 'Held' | 'Not Held'
  description?: string
  dateStart?: string
  dateEnd?: string
  assignedUserId?: string
  teamsIds?: string[]
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

  // EspoCRM expects datetime in "YYYY-MM-DD HH:mm" format (server local time)
  private formatEspoDateTime(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0')
    const y = date.getFullYear()
    const m = pad(date.getMonth() + 1)
    const d = pad(date.getDate())
    const hh = pad(date.getHours())
    const mm = pad(date.getMinutes())
    return `${y}-${m}-${d} ${hh}:${mm}`
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
        // Handle duplicate (409): update existing lead with new fields and return as duplicate
        if (response.status === 409) {
          try {
            const existing = await response.json()
            const id = Array.isArray(existing) && existing.length > 0 ? existing[0]?.id : undefined
            if (id) {
              // Best-effort update to propagate latest questionnaire fields
              try {
                const updateResult = await this.updateLead(id, sanitizedData)
                if (!updateResult.success) {
                  console.warn('EspoCRM duplicate lead update failed:', updateResult.error)
                }
              } catch (e: any) {
                console.warn('EspoCRM duplicate lead update threw:', e?.message || e)
              }

              return {
                success: true,
                id,
                provider: 'espocrm',
                operation: 'createLead',
                timestamp: new Date(),
                duplicate: true,
              }
            }
          } catch {
            // fall through to generic error handling
          }
        }
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

      const start = new Date()
      const end = new Date(start.getTime() + 60 * 1000) // +1 minute to satisfy dateEnd requirement
      const activity: EspoCRMActivity = {
        name: `Messenger click: ${data.channel}`,
        status: 'Held',
        description: descriptionLines.join('\n'),
        dateStart: this.formatEspoDateTime(start),
        dateEnd: this.formatEspoDateTime(end),
      }

      // Assign to default user/team if provided in config (Espo may require assignment)
      if (this.config.espoAssignedUserId) {
        activity.assignedUserId = this.config.espoAssignedUserId
      }
      if (this.config.espoAssignedTeamId) {
        activity.teamsIds = [this.config.espoAssignedTeamId]
      }

      const url = this.getApiUrl('Call')

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
          referralCode: data.referralCode,
          utm: data.utm,
          session: data.session,
          metadata: data.metadata,
        }),
      }

      // Optional assignment for leads as well
      if (this.config.espoAssignedUserId) {
        lead.assignedUserId = this.config.espoAssignedUserId
      }
      if (this.config.espoAssignedTeamId) {
        lead.teamsIds = [this.config.espoAssignedTeamId]
      }

      const url = this.getApiUrl('Lead')

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        body: JSON.stringify(lead),
      })

      if (!response.ok) {
        // Handle duplicate (409) by returning existing entity id
        if (response.status === 409) {
          try {
            const existing = await response.json()
            const id = Array.isArray(existing) && existing.length > 0 ? existing[0]?.id : undefined
            if (id) {
              return {
                success: true,
                id,
                provider: 'espocrm',
                operation: 'createMinimalLeadFromActivity',
                timestamp: new Date(),
              }
            }
          } catch {
            // fall through to generic error handling
          }
        }
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
    // Use a flexible object to support dynamic custom field keys via config.fieldMappings
    const lead: Partial<EspoCRMLead> & Record<string, any> = {}

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
      lead[this.config.fieldMappings.referralCode] = data.referralCode
    }

    if (data.fingerprintKey && this.config.fieldMappings.fingerprintKey) {
      lead[this.config.fieldMappings.fingerprintKey] = data.fingerprintKey
    }

    if (data.source) {
      const mapped = this.mapEspoSource(data.source)
      if (mapped) {
        lead.source = mapped
      }
    }

    if (data.userType) {
      lead[this.config.fieldMappings.userType] = data.userType
    }

    if (data.language) {
      lead[this.config.fieldMappings.language] = data.language
    }

    if (data.universities && data.universities.length > 0) {
      lead[this.config.fieldMappings.university] = data.universities[0]
    }

    // Build description
    const descriptionParts: string[] = []

    if (data.sourceDescription) {
      descriptionParts.push(data.sourceDescription)
    }

    if (data.additionalInfo) {
      descriptionParts.push(data.additionalInfo)
    }

    if (data.userType) {
      descriptionParts.push(`UserType: ${data.userType}`)
    }

    if (data.language) {
      descriptionParts.push(`Language: ${data.language}`)
    }

    if (data.universityChosen) {
      descriptionParts.push(`UniversityChosen: ${data.universityChosen}`)
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
      website: 'Web Site',
      web: 'Web Site',
      landing: 'Web Site',
      university_detail: 'Web Site',
      universities_cta: 'Web Site',
      universities_not_found: 'Web Site',
      home_questionnaire: 'Web Site',
      home_faq: 'Web Site',
      test: 'Web Site',
      referral: 'Partner',
      partner: 'Partner',
    }
    const mapped = map[normalized]
    if (!mapped) {
      console.warn('EspoCRMProvider: unknown lead source received', input)
    }
    return mapped
  }
}
