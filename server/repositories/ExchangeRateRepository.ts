import type { PrismaClient } from '@prisma/client'
import type { SupportedCurrency } from '~~/lib/currency'
import type { ExchangeRateDetails } from '~~/server/types/api/exchange-rates'

// Fallback rates (updated quarterly)
const FALLBACK_RATES: Record<SupportedCurrency, number> = {
  KZT: 450.0,
  TRY: 32.0,
  RUB: 90.0,
  USD: 1.0,
}

export class ExchangeRateRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get current exchange rates for all currencies
   * Returns cached rates if not expired, otherwise fallback rates
   */
  async getCurrentRates(): Promise<Record<SupportedCurrency, number>> {
    const rates = await this.prisma.exchangeRate.findMany({
      where: {
        baseCurrency: 'USD',
        expiresAt: { gte: new Date() },
      },
    })

    if (rates.length === 0) {
      return FALLBACK_RATES
    }

    const ratesMap: Partial<Record<SupportedCurrency, number>> = {}
    for (const rate of rates) {
      ratesMap[rate.targetCurrency as SupportedCurrency] = rate.rate.toNumber()
    }

    // Ensure all currencies are present, use fallback for missing ones
    return {
      KZT: ratesMap.KZT ?? FALLBACK_RATES.KZT,
      TRY: ratesMap.TRY ?? FALLBACK_RATES.TRY,
      RUB: ratesMap.RUB ?? FALLBACK_RATES.RUB,
      USD: 1.0, // USD is always 1.0
    }
  }

  /**
   * Update exchange rates in cache
   * Sets expiration to 1 hour from now
   */
  async updateRates(rates: Record<SupportedCurrency, number>): Promise<void> {
    // Validate rates > 0
    for (const [currency, rate] of Object.entries(rates)) {
      if (rate <= 0) {
        throw new Error(`Invalid rate for ${currency}: ${rate}`)
      }
    }

    await this.prisma.$transaction(async (tx) => {
      const now = new Date()
      const expiresAt = new Date(now.getTime() + 3600000) // +1 hour

      for (const [currency, rate] of Object.entries(rates)) {
        await tx.exchangeRate.upsert({
          where: {
            baseCurrency_targetCurrency: {
              baseCurrency: 'USD',
              targetCurrency: currency,
            },
          },
          update: {
            rate,
            fetchedAt: now,
            expiresAt,
          },
          create: {
            baseCurrency: 'USD',
            targetCurrency: currency,
            rate,
            fetchedAt: now,
            expiresAt,
          },
        })
      }
    })
  }

  /**
   * Get exchange rates with metadata (timestamps and expiry status)
   */
  async getRateDetails(): Promise<ExchangeRateDetails> {
    const rates = await this.prisma.exchangeRate.findMany({
      where: {
        baseCurrency: 'USD',
      },
      orderBy: {
        fetchedAt: 'desc',
      },
      take: 4, // One for each currency
    })

    if (rates.length === 0) {
      // Return fallback rates with current timestamp
      const now = new Date()
      return {
        rates: FALLBACK_RATES,
        fetchedAt: now,
        expiresAt: now,
        isExpired: true,
      }
    }

    const ratesMap: Partial<Record<SupportedCurrency, number>> = {}
    const fetchedAt = rates[0]!.fetchedAt
    const expiresAt = rates[0]!.expiresAt

    for (const rate of rates) {
      ratesMap[rate.targetCurrency as SupportedCurrency] = rate.rate.toNumber()
    }

    const now = new Date()
    const isExpired = expiresAt < now

    return {
      rates: {
        KZT: ratesMap.KZT ?? FALLBACK_RATES.KZT,
        TRY: ratesMap.TRY ?? FALLBACK_RATES.TRY,
        RUB: ratesMap.RUB ?? FALLBACK_RATES.RUB,
        USD: 1.0,
      },
      fetchedAt,
      expiresAt,
      isExpired,
    }
  }

  /**
   * Delete expired exchange rates from database (Background job)
   * Keeps last 7 days of history for debugging
   */
  async cleanupExpiredRates(): Promise<number> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600000)

    const result = await this.prisma.exchangeRate.deleteMany({
      where: {
        expiresAt: { lt: sevenDaysAgo },
      },
    })

    return result.count
  }
}
