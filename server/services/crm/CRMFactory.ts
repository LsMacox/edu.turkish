import type { ICRMProvider } from './CRMProvider.interface'
import { BitrixCRMProvider } from './BitrixCRMProvider'
import { EspoCRMProvider } from './EspoCRMProvider'
import { getCRMConfig, validateCRMConfig } from '~~/server/utils/crm-config'

/**
 * CRM Factory
 * 
 * Factory pattern for creating CRM provider instances.
 * Handles provider selection based on configuration.
 */
export class CRMFactory {
  private static providerCache: Map<string, ICRMProvider> = new Map()

  /**
   * Create a CRM provider instance based on the specified provider type
   * 
   * @param provider - The CRM provider type ('bitrix' | 'espocrm')
   * @returns ICRMProvider instance
   * @throws Error if provider is invalid or configuration is invalid
   */
  static create(provider: 'bitrix' | 'espocrm'): ICRMProvider {
    // Check cache first
    const cached = this.providerCache.get(provider)
    if (cached) {
      return cached
    }

    // Get and validate configuration
    const config = getCRMConfig()
    
    // Override provider if specified
    if (provider) {
      config.provider = provider
    }

    validateCRMConfig(config)

    // Create provider instance
    let providerInstance: ICRMProvider

    switch (config.provider) {
      case 'bitrix':
        providerInstance = new BitrixCRMProvider()
        break
      case 'espocrm':
        providerInstance = new EspoCRMProvider()
        break
      default:
        throw new Error(`Invalid CRM provider: ${config.provider}`)
    }

    // Cache the instance
    this.providerCache.set(provider, providerInstance)

    return providerInstance
  }

  /**
   * Create a CRM provider instance from environment configuration
   * 
   * @returns ICRMProvider instance based on CRM_PROVIDER env var
   */
  static createFromEnv(): ICRMProvider {
    const config = getCRMConfig()
    return this.create(config.provider)
  }

  /**
   * Clear the provider cache
   * Useful for testing or when configuration changes
   */
  static clearCache(): void {
    this.providerCache.clear()
  }

  /**
   * Get the current provider name from configuration
   */
  static getCurrentProvider(): 'bitrix' | 'espocrm' {
    const config = getCRMConfig()
    return config.provider
  }
}
