import type { LeadData, CRMResult } from '~~/server/types/crm'

export interface ICRMProvider {
  createLead(data: LeadData): Promise<CRMResult>
  readonly providerName: 'espocrm'
}
