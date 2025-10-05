import type { LeadData, ActivityData, CRMResult } from '~~/server/types/crm'

/**
 * CRM Provider Interface
 * 
 * Unified interface that all CRM providers must implement.
 * Ensures consistent behavior regardless of the underlying CRM system.
 */
export interface ICRMProvider {
  /**
   * Create a new lead in the CRM system
   * 
   * @param data - Standardized lead data
   * @returns Promise resolving to CRM operation result
   * @throws Error if validation fails or CRM is unreachable
   */
  createLead(data: LeadData): Promise<CRMResult>

  /**
   * Update an existing lead in the CRM system
   * 
   * @param id - CRM-specific lead ID
   * @param data - Partial lead data to update
   * @returns Promise resolving to CRM operation result
   * @throws Error if lead not found or CRM is unreachable
   */
  updateLead(id: string | number, data: Partial<LeadData>): Promise<CRMResult>

  /**
   * Log an activity/event in the CRM system
   * 
   * @param data - Activity data (messenger clicks, etc.)
   * @returns Promise resolving to CRM operation result
   * @throws Error if validation fails or CRM is unreachable
   */
  logActivity(data: ActivityData): Promise<CRMResult>

  /**
   * Create a minimal lead from activity data
   * Used when user clicks messenger link but hasn't submitted full application
   * 
   * @param data - Activity data containing referral code
   * @returns Promise resolving to CRM operation result
   */
  createMinimalLeadFromActivity(data: ActivityData): Promise<CRMResult>

  /**
   * Test connection to the CRM system
   * 
   * @returns Promise resolving to true if connection successful
   * @throws Error if CRM is unreachable or credentials invalid
   */
  testConnection(): Promise<boolean>

  /**
   * Get the provider name
   */
  readonly providerName: 'bitrix' | 'espocrm'
}
