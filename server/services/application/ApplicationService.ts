import type { H3Event } from 'h3'
import { getCookie } from 'h3'
import { getApplicationRepository } from '~~/server/repositories'
import { mapApplicationToLeadData } from '~~/server/mappers'
import { CrmFactory } from '~~/server/services/crm/CRMFactory'
import { getRedisQueue } from '~~/server/services/queue'
import type { ApplicationRequest, ApplicationResponse } from '~~/lib/types'
import type { LeadData } from '~~/lib/schemas/crm'

export interface CRMSubmitResult {
  provider: string | null
  leadId: string | number | null
  error: string | null
}

export interface SubmitApplicationResult extends ApplicationResponse {
  crm: CRMSubmitResult
}

export interface SubmitContext {
  fingerprintCookie?: string
}

/**
 * Application submission service.
 * Orchestrates: DB persistence → CRM sync → Queue fallback.
 */
export class ApplicationService {
  async submit(
    body: ApplicationRequest,
    ctx: SubmitContext = {},
  ): Promise<SubmitApplicationResult> {
    // 1. Persist to database
    const applicationRepository = getApplicationRepository()
    const application = await applicationRepository.create(body)

    // 2. Prepare CRM data
    const leadData = this.buildLeadData(body, ctx)

    // 3. Sync to CRM
    const crmResult = await this.syncToCRM(leadData)

    return {
      ...application,
      crm: crmResult,
    }
  }

  extractContext(event: H3Event): SubmitContext {
    return {
      fingerprintCookie: getCookie(event, 'fp')?.trim(),
    }
  }

  private buildLeadData(body: ApplicationRequest, ctx: SubmitContext): LeadData {
    const normalizedEmail = body.personal_info.email?.trim().toLowerCase() || undefined
    const normalizedPhone = body.personal_info.phone?.replace(/\D/g, '') || undefined
    const fingerprintKey =
      normalizedEmail && normalizedPhone
        ? `email:${normalizedEmail}|phone:${normalizedPhone}`
        : undefined

    return mapApplicationToLeadData({
      body,
      fingerprintCookie: ctx.fingerprintCookie,
      fingerprintKey,
    })
  }

  private async syncToCRM(leadData: LeadData): Promise<CRMSubmitResult> {
    let crmLeadId: string | number | null = null
    let crmError: string | null = null
    let crmProvider: string | null = null

    try {
      const crmService = CrmFactory.createFromEnv()
      crmProvider = crmService.providerName

      const result = await crmService.createLead(leadData)

      if (result.success) {
        crmLeadId = result.id || null
        const status = result.duplicate ? 'duplicate' : 'created'
        console.log(`✓ CRM lead ${status}: ${crmLeadId} (${crmProvider})`)
      } else if (result.validationErrors?.length) {
        // Validation errors should bubble up, not be queued
        throw {
          isValidationError: true,
          errors: result.validationErrors,
        }
      } else {
        crmError = result.error || 'Unknown CRM error'
        console.error(`✗ CRM lead creation failed (${crmProvider}):`, crmError)
        await this.queueForRetry(leadData)
      }
    } catch (error: any) {
      if (error.isValidationError) {
        throw error
      }

      crmError = error.message
      console.error('Error in CRM integration:', error)
      await this.queueForRetry(leadData)
    }

    return {
      provider: crmProvider,
      leadId: crmLeadId,
      error: crmError,
    }
  }

  private async queueForRetry(leadData: LeadData): Promise<void> {
    try {
      const queue = getRedisQueue()
      await queue.addJob('createLead', 'espocrm', leadData)
      console.log('→ CRM operation queued for retry')
    } catch (queueError: any) {
      console.error('Failed to queue CRM operation:', queueError?.message || queueError)
    }
  }
}

let instance: ApplicationService | null = null

export function getApplicationService(): ApplicationService {
  return (instance ??= new ApplicationService())
}
