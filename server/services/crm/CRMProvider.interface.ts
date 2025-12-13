import type { CrmResult } from '~~/lib/types/server'
import type { LeadData } from '~~/lib/schemas/crm'

export interface ICrmProvider {
  createLead(data: LeadData): Promise<CrmResult>
  readonly providerName: 'espocrm'
}
