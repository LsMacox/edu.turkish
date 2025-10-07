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
const providerCache = new Map<string, ICRMProvider>()

function instantiateProvider(configProvider: 'bitrix' | 'espocrm'): ICRMProvider {
  switch (configProvider) {
    case 'bitrix':
      return new BitrixCRMProvider()
    case 'espocrm':
      return new EspoCRMProvider()
    default:
      throw new Error(`Invalid CRM provider: ${configProvider}`)
  }
}

function create(provider: 'bitrix' | 'espocrm'): ICRMProvider {
  const cached = providerCache.get(provider)
  if (cached) {
    return cached
  }

  const config = getCRMConfig()
  config.provider = provider
  validateCRMConfig(config)

  const providerInstance = instantiateProvider(config.provider)
  providerCache.set(provider, providerInstance)

  return providerInstance
}

function createFromEnv(): ICRMProvider {
  const config = getCRMConfig()
  return create(config.provider)
}

function clearCache(): void {
  providerCache.clear()
}

function getCurrentProvider(): 'bitrix' | 'espocrm' {
  const config = getCRMConfig()
  return config.provider
}

export const CRMFactory = {
  create,
  createFromEnv,
  clearCache,
  getCurrentProvider,
}
