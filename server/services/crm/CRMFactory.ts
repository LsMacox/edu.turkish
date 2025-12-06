import type { ICRMProvider } from './CRMProvider.interface'
import { EspoCRMProvider } from './EspoCRMProvider'
import { getCRMConfig, validateCRMConfig } from '~~/server/utils/crm-config'

let providerInstance: ICRMProvider | null = null

function create(_provider: 'espocrm' = 'espocrm'): ICRMProvider {
  if (providerInstance) {
    return providerInstance
  }

  validateCRMConfig(getCRMConfig())
  providerInstance = new EspoCRMProvider()
  return providerInstance
}

function createFromEnv(): ICRMProvider {
  return create()
}

function clearCache(): void {
  providerInstance = null
}

export const CRMFactory = {
  create,
  createFromEnv,
  clearCache,
}
