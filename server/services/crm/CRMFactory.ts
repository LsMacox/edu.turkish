import type { ICrmProvider } from './CRMProvider.interface'
import { EspoCRMProvider } from './EspoCRMProvider'
import { getCrmConfig, validateCrmConfig } from './config'

let providerInstance: ICrmProvider | null = null

function create(_provider: 'espocrm' = 'espocrm'): ICrmProvider {
  if (providerInstance) {
    return providerInstance
  }

  validateCrmConfig(getCrmConfig())
  providerInstance = new EspoCRMProvider()
  return providerInstance
}

function createFromEnv(): ICrmProvider {
  return create()
}

function clearCache(): void {
  providerInstance = null
}

export const CrmFactory = {
  create,
  createFromEnv,
  clearCache,
}
