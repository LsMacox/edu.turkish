import type { SupportedCurrency } from '~~/lib/currency'

// Fallback rates in case API fails
const FALLBACK_RATES: Record<SupportedCurrency, number> = {
  KZT: 450.0,
  TRY: 32.0,
  RUB: 90.0,
  USD: 1.0,
}

interface ExchangeRateApiResponse {
  base: string
  rates: Record<string, number>
}

export class ExchangeRateService {
  private apiUrl = 'https://open.er-api.com/v6/latest/USD'

  /**
   * Fetch exchange rates from external API
   * Returns fallback rates on error
   */
  async fetchRates(): Promise<Record<SupportedCurrency, number>> {
    try {
      const response = await fetch(this.apiUrl, {
        headers: {
          'User-Agent': 'edu-turkish-app/1.0',
        },
      })

      if (!response.ok) {
        console.error(
          `Exchange rate API returned status ${response.status}: ${response.statusText}`
        )
        return FALLBACK_RATES
      }

      const data = (await response.json()) as ExchangeRateApiResponse

      // Extract rates for our supported currencies
      const rates: Record<SupportedCurrency, number> = {
        KZT: data.rates.KZT ?? FALLBACK_RATES.KZT,
        TRY: data.rates.TRY ?? FALLBACK_RATES.TRY,
        RUB: data.rates.RUB ?? FALLBACK_RATES.RUB,
        USD: 1.0,
      }

      // Validate rates are positive numbers
      for (const [currency, rate] of Object.entries(rates)) {
        if (typeof rate !== 'number' || rate <= 0) {
          console.error(
            `Invalid rate for ${currency}: ${rate}, using fallback`
          )
          return FALLBACK_RATES
        }
      }

      return rates
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error)
      return FALLBACK_RATES
    }
  }
}
