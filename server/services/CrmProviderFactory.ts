import type { ICrmProvider } from '~~/server/types/api/crm'
import { getBitrixConfig, getCrmProvider, getEspoCrmConfig } from '~~/server/utils/crm-config'
import { BitrixService } from './BitrixService'
import { EspoCrmService } from './EspoCrmService'

/**
 * CRM Provider Factory
 * 
 * Creates CRM provider instances based on environment configuration.
 * Supports Bitrix and EspoCRM providers.
 */
export class CrmProviderFactory {
  /**
   * Create a CRM provider instance based on CRM_PROVIDER environment variable
   * 
   * @returns ICrmProvider instance (BitrixService or EspoCrmService)
   * @throws Error if configuration is invalid
   */
  static create(): ICrmProvider {
    const provider = getCrmProvider()

    if (provider === 'bitrix') {
      const config = getBitrixConfig()
      return new BitrixService(config)
    } 

    const config = getEspoCrmConfig()
    return new EspoCrmService(config)
  }
}
