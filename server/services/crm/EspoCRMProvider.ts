import type { ICrmProvider } from './CRMProvider.interface'
import type { CrmResult } from '~~/lib/types/server'
import { leadDataSchema, type LeadData } from '~~/lib/schemas/crm'
import { getCrmConfig } from './config'

export class EspoCRMProvider implements ICrmProvider {
  readonly providerName = 'espocrm' as const
  private config = getCrmConfig()

  async createLead(data: LeadData): Promise<CrmResult> {
    try {
      const sanitized: LeadData = {
        ...data,
        lastName: data.lastName?.trim() || undefined,
      }
      leadDataSchema.parse(sanitized)

      const lead = this.transformLeadData(sanitized)
      return this.postLead(lead)
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

  private async postLead(lead: Record<string, any>): Promise<CrmResult> {
    try {
      const response = await this.fetch(this.getApiUrl('Lead'), {
        method: 'POST',
        body: JSON.stringify(lead),
      })

      if (!response.ok) {
        if (response.status === 409) {
          const existing = await response.json().catch(() => null)
          const id = Array.isArray(existing) ? existing[0]?.id : undefined
          if (id) {
            return {
              success: true,
              id,
              provider: 'espocrm',
              operation: 'createLead',
              timestamp: new Date(),
              duplicate: true,
            }
          }
        }

        const errorText = await response.text().catch(() => '')
        if (response.status === 400) {
          const parsed = JSON.parse(errorText).catch?.(() => null)
          if (parsed?.messageTranslation?.label === 'validationFailure') {
            const field = parsed.messageTranslation.data?.field
            return {
              success: false,
              error: 'Validation failed',
              provider: 'espocrm',
              operation: 'createLead',
              timestamp: new Date(),
              validationErrors: [field ? `Invalid ${field}` : 'Validation error'],
            }
          }
        }
        throw new Error(`HTTP ${response.status}: ${errorText}`)
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
      console.error('EspoCRM postLead error:', error)
      return {
        success: false,
        error: error?.message || 'Unknown error',
        provider: 'espocrm',
        operation: 'createLead',
        timestamp: new Date(),
      }
    }
  }

  private async fetch(url: string, init: RequestInit): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          'X-Api-Key': this.config.apiKey,
          'Content-Type': 'application/json',
          ...init.headers,
        },
        signal: controller.signal,
      })
      return response
    } catch (error: any) {
      if (error.name === 'AbortError' && this.config.retries > 0) {
        await new Promise((r) => setTimeout(r, 1000))
        return this.fetch(url, init)
      }
      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }

  private getApiUrl(endpoint: string): string {
    return `${this.config.baseUrl}/api/v1/${endpoint}`
  }

  private transformLeadData(data: LeadData): Record<string, any> {
    const lead: Record<string, any> = {
      firstName: data.firstName || 'Unknown',
      lastName: data.lastName || '-',
    }

    if (data.phone) lead.phoneNumber = data.phone
    if (data.email) lead.emailAddress = data.email
    if (data.referralCode) lead[this.config.fieldMappings.referralCode] = data.referralCode
    if (data.fingerprintKey && this.config.fieldMappings.fingerprintKey) {
      lead[this.config.fieldMappings.fingerprintKey] = data.fingerprintKey
    }
    if (data.source) lead.source = this.mapSource(data.source)
    if (data.userType) lead[this.config.fieldMappings.userType] = data.userType
    if (data.language) lead[this.config.fieldMappings.language] = data.language
    if (data.universities?.length) lead[this.config.fieldMappings.university] = data.universities[0]

    const desc = this.buildDescription(data)
    if (desc) lead.description = desc

    return lead
  }

  private buildDescription(data: LeadData): string | undefined {
    const parts: string[] = []

    if (data.sourceDescription) parts.push(`Источник: ${data.sourceDescription}`)
    if (data.additionalInfo) parts.push(`Комментарий: ${data.additionalInfo}`)
    if (data.userType) parts.push(`Тип пользователя: ${data.userType}`)
    if (data.language) parts.push(`Язык: ${data.language}`)
    if (data.universityChosen) parts.push(`Выбранный университет: ${data.universityChosen}`)
    if (data.programs?.length) parts.push(`Программы: ${data.programs.join(', ')}`)
    if (data.scholarship) parts.push(`Стипендия: ${data.scholarship}`)

    return parts.length ? parts.join('\n') : undefined
  }

  private mapSource(_source: string): string {
    return 'Sait_SEO'
  }
}
