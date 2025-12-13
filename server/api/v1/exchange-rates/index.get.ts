import { getExchangeRateRepository } from '~~/server/repositories'
import { ExchangeRateService } from '~~/server/services/ExchangeRateService'
import { FALLBACK_RATES } from '~~/lib/schemas/exchange-rates'
import type { ExchangeRatesResponse, ExchangeRateDetails } from '~~/lib/types'

function toResponse(
  details: Pick<ExchangeRateDetails, 'rates' | 'fetchedAt' | 'expiresAt'>,
  isFallback = false,
): ExchangeRatesResponse {
  return {
    rates: details.rates,
    baseCurrency: 'USD',
    fetchedAt: details.fetchedAt.toISOString(),
    expiresAt: details.expiresAt.toISOString(),
    isFallback,
  }
}

export default defineEventHandler(async (): Promise<ExchangeRatesResponse> => {
  try {
    const repository = getExchangeRateRepository()
    const rateDetails = await repository.getRateDetails()

    if (rateDetails.isExpired) {
      const freshRates = await new ExchangeRateService().fetchRates()
      await repository.updateRates(freshRates)
      return toResponse(await repository.getRateDetails())
    }

    return toResponse(rateDetails)
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)
    const now = new Date()
    return toResponse({ rates: FALLBACK_RATES, fetchedAt: now, expiresAt: now }, true)
  }
})
