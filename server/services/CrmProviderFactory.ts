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
function create(): ICrmProvider {
  const provider = getCrmProvider()

  if (provider === 'bitrix') {
    const config = getBitrixConfig()
    return new BitrixService(config)
  }

  const config = getEspoCrmConfig()
  return new EspoCrmService(config)
}

export const CrmProviderFactory = {
  create,
}
