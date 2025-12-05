import { prisma } from '~~/lib/prisma'
import { ExchangeRateRepository } from '~~/server/repositories/ExchangeRateRepository'
import { ExchangeRateService } from '~~/server/services/ExchangeRateService'
import type { ExchangeRatesResponse } from '~~/server/types/api/exchange-rates'

export default defineEventHandler(async (_event): Promise<ExchangeRatesResponse> => {
  try {
    const repository = new ExchangeRateRepository(prisma)
    const service = new ExchangeRateService()

    const rateDetails = await repository.getRateDetails()

    if (rateDetails.isExpired) {
      console.log('Exchange rates expired, fetching fresh rates...')

      const freshRates = await service.fetchRates()
      await repository.updateRates(freshRates)

      const updatedDetails = await repository.getRateDetails()

      return {
        rates: updatedDetails.rates,
        baseCurrency: 'USD',
        fetchedAt: updatedDetails.fetchedAt.toISOString(),
        expiresAt: updatedDetails.expiresAt.toISOString(),
        isFallback: false,
      }
    }

    return {
      rates: rateDetails.rates,
      baseCurrency: 'USD',
      fetchedAt: rateDetails.fetchedAt.toISOString(),
      expiresAt: rateDetails.expiresAt.toISOString(),
      isFallback: false,
    }
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)

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
