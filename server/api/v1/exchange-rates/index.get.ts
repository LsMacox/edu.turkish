import { prisma } from '~~/lib/prisma'
import { ExchangeRateRepository } from '~~/server/repositories/ExchangeRateRepository'
import { ExchangeRateService } from '~~/server/services/ExchangeRateService'
import type { ExchangeRatesResponse } from '~~/server/types/api/exchange-rates'

export default defineEventHandler(async (_event): Promise<ExchangeRatesResponse> => {
  try {
    const repository = new ExchangeRateRepository(prisma)
    const service = new ExchangeRateService()

    // Get current rates from cache
    const rateDetails = await repository.getRateDetails()

    // If rates are expired, fetch fresh rates and update cache
    if (rateDetails.isExpired) {
      console.log('Exchange rates expired, fetching fresh rates...')
      
      const freshRates = await service.fetchRates()
      await repository.updateRates(freshRates)

      // Get updated details
      const updatedDetails = await repository.getRateDetails()

      return {
        rates: updatedDetails.rates,
        baseCurrency: 'USD',
        fetchedAt: updatedDetails.fetchedAt.toISOString(),
        expiresAt: updatedDetails.expiresAt.toISOString(),
        isFallback: false,
      }
    }

    // Return cached rates
    return {
      rates: rateDetails.rates,
      baseCurrency: 'USD',
      fetchedAt: rateDetails.fetchedAt.toISOString(),
      expiresAt: rateDetails.expiresAt.toISOString(),
      isFallback: false,
    }
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)

    // Return fallback rates on error
    const fallbackRates = {
      KZT: 450.0,
      TRY: 32.0,
      RUB: 90.0,
      USD: 1.0,
    }

    const now = new Date()

    return {
      rates: fallbackRates,
      baseCurrency: 'USD',
      fetchedAt: now.toISOString(),
      expiresAt: now.toISOString(),
      isFallback: true,
    }
  }
})
