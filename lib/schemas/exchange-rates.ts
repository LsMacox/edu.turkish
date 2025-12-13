import { z } from 'zod'

// ==========================================
// Currency types
// ==========================================

const _SupportedCurrencySchema = z.enum(['KZT', 'TRY', 'RUB', 'USD'])

export type SupportedCurrency = z.infer<typeof _SupportedCurrencySchema>

// ==========================================
// Exchange rate schemas
// ==========================================

const _ExchangeRatesSchema = z.object({
  KZT: z.number().positive(),
  TRY: z.number().positive(),
  RUB: z.number().positive(),
  USD: z.literal(1.0),
})

export type ExchangeRates = z.infer<typeof _ExchangeRatesSchema>

// Re-export ExchangeRateDetails from lib/types (single source of truth)
export type { ExchangeRateDetails } from '~~/lib/types/api/responses'

// ==========================================
// Fallback rates
// ==========================================

export const FALLBACK_RATES: ExchangeRates = {
  KZT: 450.0,
  TRY: 32.0,
  RUB: 90.0,
  USD: 1.0,
}
