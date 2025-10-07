import type {
  ApplicationRequest,
  CrmResult,
  EspoCrmConfig,
  ICrmProvider,
  MessengerEventPayload,
} from '~~/server/types/api/crm'

/**
 * EspoCRM Service
 *
 * Implements ICrmProvider interface for EspoCRM REST API integration.
 * Handles lead creation, messenger event logging, and connection testing.
 */
export class EspoCrmService implements ICrmProvider {
  private config: EspoCrmConfig

  constructor(config: EspoCrmConfig) {
    if (!config.apiUrl || !config.apiKey) {
      throw new Error('EspoCRM configuration incomplete: apiUrl and apiKey are required')
    }
    this.config = config
  }

  /**
   * Fetch with timeout and retry logic
   */
  private async fetchWithTimeout(
    input: RequestInfo | URL,
    init: RequestInit & { timeoutMs?: number; retries?: number } = {},
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutMs = init.timeoutMs ?? 15000
    const retries = init.retries ?? 0

    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(input, { ...init, signal: controller.signal })
      clearTimeout(timeout)
      return response
    } catch (error: any) {
      clearTimeout(timeout)

      // Retry on abort error or network issues
      if ((error.name === 'AbortError' || error.message?.includes('aborted')) && retries > 0) {
        console.warn(`EspoCRM request aborted, retrying... (${retries} attempts left)`)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return this.fetchWithTimeout(input, { ...init, retries: retries - 1 })
      }

      throw error
    }
  }

  /**
   * Create a lead in EspoCRM from application data
   */
  async createLead(data: ApplicationRequest): Promise<CrmResult> {
    try {
      const leadPayload = this.transformApplicationToLead(data)
      const url = `${this.config.apiUrl}/Lead`

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': this.config.apiKey,
        },
        body: JSON.stringify(leadPayload),
        timeoutMs: 15000,
        retries: 2,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.message || errorData.error || `HTTP ${response.status}`

        // Don't retry on 4xx errors (except 429)
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          console.error('EspoCRM lead creation failed (client error):', errorMessage)
          return {
            success: false,
            error: errorMessage,
          }
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()

      return {
        success: true,
        id: result.id,
      }
    } catch (error: any) {
      console.error('Error creating EspoCRM lead:', error)
      return {
        success: false,
        error: error.message || 'Unknown error',
      }
    }
  }

  /**
   * Log a messenger event as an Activity in EspoCRM
   */
  async logMessengerEvent(payload: MessengerEventPayload): Promise<CrmResult> {
    try {
      // Validate required fields
      if (!payload.channel || !payload.referralCode) {
        console.error('Invalid messenger event payload: channel and referralCode are required')
        return {
          success: false,
          error: 'Invalid messenger event payload',
        }
      }

      const activityPayload = this.transformEventToActivity(payload)
      const url = `${this.config.apiUrl}/Activity`

      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': this.config.apiKey,
        },
        body: JSON.stringify(activityPayload),
        timeoutMs: 10000,
        retries: 1,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.message || errorData.error || `HTTP ${response.status}`

        // Don't retry on 4xx errors (except 429)
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          console.error('EspoCRM activity creation failed (client error):', errorMessage)
          return {
            success: false,
            error: errorMessage,
          }
        }

        throw new Error(errorMessage)
      }

      const result = await response.json()

      return {
        success: true,
        id: result.id,
      }
    } catch (error: any) {
      console.error('Error logging EspoCRM messenger event:', error)
      return {
        success: false,
        error: error.message || 'Unknown error',
      }
    }
  }

  /**
   * Transform application data to EspoCRM Lead format
   */
  private transformApplicationToLead(data: ApplicationRequest): Record<string, any> {
    const { personal_info, source, additional_info, referral_code, preferences } = data

    // Build description with additional info
    const descriptionParts: string[] = []

    if (additional_info) {
      descriptionParts.push(additional_info)
    }

    if (referral_code) {
      descriptionParts.push(`Referral: ${referral_code}`)
    }

    if (preferences?.universities && preferences.universities.length > 0) {
      descriptionParts.push(`Universities: ${preferences.universities.join(', ')}`)
    }

    if (preferences?.budget) {
      descriptionParts.push(`Budget: ${preferences.budget}`)
    }

    if (preferences?.start_date) {
      descriptionParts.push(`Start Date: ${preferences.start_date}`)
    }

    return {
      name: `Application - ${personal_info.first_name} ${personal_info.last_name}`,
      firstName: personal_info.first_name,
      lastName: personal_info.last_name,
      emailAddress: personal_info.email,
      phoneNumber: personal_info.phone,
      source,
      description: descriptionParts.join('\n'),
    }
  }

  /**
   * Transform messenger event to EspoCRM Activity format
   */
  private transformEventToActivity(payload: MessengerEventPayload): Record<string, any> {
    const now = new Date().toISOString()

    // Build description with event details
    const descriptionParts: string[] = [
      `Channel: ${payload.channel}`,
      `Referral: ${payload.referralCode}`,
    ]

    if (payload.session) {
      descriptionParts.push(`Session: ${payload.session}`)
    }

    if (payload.utm) {
      descriptionParts.push(`UTM: ${JSON.stringify(payload.utm)}`)
    }

    if (payload.metadata) {
      descriptionParts.push(`Metadata: ${JSON.stringify(payload.metadata)}`)
    }

    return {
      name: `Messenger click: ${payload.channel}`,
      type: 'Call',
      status: 'Held',
      dateStart: now,
      dateEnd: now,
      description: descriptionParts.join('\n'),
    }
  }
}
