import type { SupportedLocale } from '~~/lib/locales'
import type { SupportedCurrency } from '~~/lib/currency'
export type { SupportedLocale } from '~~/lib/locales'
export type { ExchangeRatesResponse } from '~~/server/types/api/exchange-rates'
export type Currency = SupportedCurrency

export interface ServiceCategoryListItem {
  id: number
  slug: string
  title: string
  subtitle: string | null
  localizedSlug: string
  order: number
}

export interface ServiceCategoryDetail {
  id: number
  slug: string
  title: string
  subtitle: string | null
  localizedSlug: string
  metadata: Record<string, unknown> | null
  subServices: SubServiceDetail[]
  calculator?: {
    standardUsd: number
    expressUsd?: number
    rushUsd?: number
  }
  urgencyMultipliers?: {
    express: number
    rush: number
  }
}

export interface SubServiceDetail {
  id: number
  slug: string
  name: string
  description: string
  priceUsd: number
  deliveryTimeDays: number | null
  order: number
}

// Repository input types
export interface CreateSubServiceInput {
  serviceCategoryId: number
  slug: string
  priceUsd: number
  deliveryTimeDays?: number
  order?: number
  translations: {
    locale: SupportedLocale
    name: string
    description: string
  }[]
}

export interface UpdateSubServiceInput {
  priceUsd?: number
  deliveryTimeDays?: number
  order?: number
  isActive?: boolean
}
