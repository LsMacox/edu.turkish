import type { SubServiceId } from './categories'

export interface ServiceApplicationContext {
  subServiceId?: SubServiceId
  subServiceName: string
  source: 'service_page'
  sourceDescription: string
  price?: string
}
