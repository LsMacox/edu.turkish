import type { PrismaClient } from '@prisma/client'
import {
  FALLBACK_RATES,
  type SupportedCurrency,
  type ExchangeRateDetails,
} from '~~/lib/schemas/exchange-rates'

export { FALLBACK_RATES }

export class ExchangeRateRepository {
  constructor(private prisma: PrismaClient) {}

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
}
