/**
 * CRM Provider Type Definitions
 * 
 * Defines interfaces and types for CRM provider abstraction layer.
 * Supports multiple CRM providers (Bitrix, EspoCRM) with unified interface.
 */

/**
 * Result from CRM operations (lead creation, event logging)
 */
export interface CrmResult {
  /** Whether the operation succeeded */
  success: boolean
  /** Lead or Activity ID from CRM (if successful) */
  id?: number | string
  /** Error message (if failed) */
  error?: string
}

/**
 * Application request data structure
 */
export interface ApplicationRequest {
  personal_info: {
    first_name: string
    last_name: string
    email: string
    phone: string
    [key: string]: any
  }
  preferences: {
    universities?: string[]
    programs?: string[]
    budget?: string
    start_date?: string
    [key: string]: any
  }
  source: string
  additional_info?: string
  referral_code?: string
  user_preferences?: any
  [key: string]: any
}

/**
 * Messenger event payload structure
 */
export interface MessengerEventPayload {
  /** Social media channel (telegram, instagram, whatsapp) */
  channel: string
  /** Referral code */
  referralCode: string
  /** Session ID (optional) */
  session?: string
  /** UTM parameters (optional) */
  utm?: Record<string, unknown>
  /** Additional metadata (optional) */
  metadata?: Record<string, unknown>
}

/**
 * Unified CRM Provider Interface
 * 
 * All CRM providers (Bitrix, EspoCRM) must implement this interface.
 * 
 * Contract:
 * - All methods must catch exceptions and return structured results
 * - Never throw exceptions that block primary operations
 * - Return { success: false, error: 'message' } on failure
 * - Return { success: true, id: 'value' } on success
 */
export interface ICrmProvider {
  /**
   * Create a lead in the CRM system from application data
   * 
   * @param data - Application request data
   * @returns Promise with lead creation result
   * @throws Never - Must catch all errors and return { success: false, error }
   */
  createLead(data: ApplicationRequest): Promise<CrmResult>

  /**
   * Log a messenger event (social media click) in the CRM system
   * 
   * @param payload - Messenger event data
   * @returns Promise with event logging result
   * @throws Never - Must catch all errors and return { success: false, error }
   */
  logMessengerEvent(payload: MessengerEventPayload): Promise<CrmResult>
}

/**
 * Bitrix CRM configuration
 */
export interface BitrixConfig {
  /** Bitrix domain */
  domain: string
  /** Access token */
  accessToken: string
  /** Webhook URL (optional) */
  webhookUrl?: string
}

/**
 * EspoCRM configuration
 */
export interface EspoCrmConfig {
  /** Base URL for EspoCRM API (e.g., https://crm.example.com/api/v1) */
  apiUrl: string
  /** API authentication key */
  apiKey: string
}

/**
 * CRM provider type
 */
export type CrmProviderType = 'bitrix' | 'espocrm'
