import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ExchangeRateRepository } from '~~/server/repositories/ExchangeRateRepository'
import type { Currency } from '~~/server/types/api/services'
import { createMockPrisma, type MockPrismaClient } from '~~/tests/test-utils'

describe('ExchangeRateRepository', () => {
  let prisma: MockPrismaClient
  let repository: ExchangeRateRepository

  beforeEach(() => {
    prisma = createMockPrisma()
    repository = new ExchangeRateRepository(prisma as any)

    type Row = {
      baseCurrency: 'USD'
      targetCurrency: Currency
      rate: { toNumber: () => number }
      fetchedAt: Date
      expiresAt: Date
    }
    const store: Row[] = []

    ;(prisma.exchangeRate.findMany as any) = vi.fn(async (args?: any) => {
      const _now = new Date()
      let rows = [...store]
      if (args?.where?.baseCurrency) {
        rows = rows.filter((r) => r.baseCurrency === args.where.baseCurrency)
      }
      if (args?.where?.expiresAt?.gte) {
        const gte = args.where.expiresAt.gte as Date
        rows = rows.filter((r) => r.expiresAt >= gte)
      }
      if (args?.orderBy?.fetchedAt === 'desc') {
        rows.sort((a, b) => b.fetchedAt.getTime() - a.fetchedAt.getTime())
      }
      if (typeof args?.take === 'number') {
        rows = rows.slice(0, args.take)
      }
      return rows
    })

    ;(prisma.exchangeRate.upsert as any) = vi.fn(async (args: any) => {
      const now = args.update?.fetchedAt ?? new Date()
      const expiresAt = args.update?.expiresAt ?? new Date(now.getTime() + 3600000)
      const targetCurrency = args.where.baseCurrency_targetCurrency.targetCurrency as Currency
      const existingIdx = store.findIndex(
        (r) => r.baseCurrency === 'USD' && r.targetCurrency === targetCurrency
      )
      const rateVal = (args.update?.rate ?? args.create?.rate) as number
      const row: Row = {
        baseCurrency: 'USD',
        targetCurrency,
        rate: { toNumber: () => rateVal },
        fetchedAt: now,
        expiresAt,
      }
      if (existingIdx >= 0) {
        store[existingIdx] = row
      } else {
        store.push(row)
      }
      return row
    })

    ;(prisma.exchangeRate.create as any) = vi.fn(async ({ data }: any) => {
      const row: Row = {
        baseCurrency: data.baseCurrency,
        targetCurrency: data.targetCurrency,
        rate: { toNumber: () => data.rate },
        fetchedAt: data.fetchedAt,
        expiresAt: data.expiresAt,
      }
      store.push(row)
      return row
    })

    ;(prisma.exchangeRate.deleteMany as any) = vi.fn(async (args: any) => {
      const lt: Date | undefined = args?.where?.expiresAt?.lt
      if (!lt) return { count: 0 }
      const before = store.length
      for (let i = store.length - 1; i >= 0; i--) {
        if (store[i]!.expiresAt < lt) store.splice(i, 1)
      }
      return { count: before - store.length }
    })
  })

  afterEach(async () => {
    await prisma.$disconnect()
  })

  describe('getCurrentRates', () => {
    it('should return rates for all currencies', async () => {
      const rates = await repository.getCurrentRates()

      expect(rates).toHaveProperty('KZT')
      expect(rates).toHaveProperty('TRY')
      expect(rates).toHaveProperty('RUB')
      expect(rates).toHaveProperty('USD')
      expect(rates.USD).toBe(1.0)
    })

    it('should return cached rates when not expired', async () => {
      const testRates: Record<Currency, number> = {
        KZT: 450.25,
        TRY: 32.15,
        RUB: 90.50,
        USD: 1.0,
      }

      await repository.updateRates(testRates)
      const rates = await repository.getCurrentRates()

      expect(rates.KZT).toBe(450.25)
      expect(rates.TRY).toBe(32.15)
      expect(rates.RUB).toBe(90.50)
      expect(rates.USD).toBe(1.0)
    })

    it('should return fallback rates when cache is empty', async () => {
      const rates = await repository.getCurrentRates()

      // Fallback rates should be returned
      expect(rates.KZT).toBeGreaterThan(0)
      expect(rates.TRY).toBeGreaterThan(0)
      expect(rates.RUB).toBeGreaterThan(0)
      expect(rates.USD).toBe(1.0)
    })

    it('should return fallback rates when cache is expired', async () => {
      // Create expired rates
      const now = new Date()
      const expiredDate = new Date(now.getTime() - 7200000) // 2 hours ago

      await prisma.exchangeRate.create({
        data: {
          baseCurrency: 'USD',
          targetCurrency: 'KZT',
          rate: 999.99,
          fetchedAt: expiredDate,
          expiresAt: expiredDate,
        },
      })

      const rates = await repository.getCurrentRates()

      // Should return fallback, not the expired 999.99
      expect(rates.KZT).not.toBe(999.99)
      expect(rates.KZT).toBeGreaterThan(0)
    })
  })

  describe('updateRates', () => {
    it('should upsert rates for all currencies', async () => {
      const testRates: Record<Currency, number> = {
        KZT: 451.0,
        TRY: 33.0,
        RUB: 91.0,
        USD: 1.0,
      }

      await repository.updateRates(testRates)
      const rates = await repository.getCurrentRates()

      expect(rates.KZT).toBe(451.0)
      expect(rates.TRY).toBe(33.0)
      expect(rates.RUB).toBe(91.0)
      expect(rates.USD).toBe(1.0)
    })

    it('should set expiration to 1 hour from now', async () => {
      const testRates: Record<Currency, number> = {
        KZT: 450.0,
        TRY: 32.0,
        RUB: 90.0,
        USD: 1.0,
      }

      await repository.updateRates(testRates)
      const details = await repository.getRateDetails()

      const now = Date.now()
      const expectedExpiry = now + 3600000 // +1 hour
      const actualExpiry = details.expiresAt.getTime()

      // Allow 5 second tolerance for test execution time
      expect(actualExpiry).toBeGreaterThan(now)
      expect(actualExpiry).toBeLessThanOrEqual(expectedExpiry + 5000)
    })

    it('should update existing rates', async () => {
      const initialRates: Record<Currency, number> = {
        KZT: 450.0,
        TRY: 32.0,
        RUB: 90.0,
        USD: 1.0,
      }

      await repository.updateRates(initialRates)

      const updatedRates: Record<Currency, number> = {
        KZT: 455.0,
        TRY: 33.5,
        RUB: 92.0,
        USD: 1.0,
      }

      await repository.updateRates(updatedRates)
      const rates = await repository.getCurrentRates()

      expect(rates.KZT).toBe(455.0)
      expect(rates.TRY).toBe(33.5)
      expect(rates.RUB).toBe(92.0)
    })

    it('should throw error for invalid rates', async () => {
      const invalidRates: Record<Currency, number> = {
        KZT: -450.0, // Negative rate
        TRY: 32.0,
        RUB: 90.0,
        USD: 1.0,
      }

      await expect(repository.updateRates(invalidRates)).rejects.toThrow()
    })

    it('should throw error for zero rates', async () => {
      const zeroRates: Record<Currency, number> = {
        KZT: 0, // Zero rate
        TRY: 32.0,
        RUB: 90.0,
        USD: 1.0,
      }

      await expect(repository.updateRates(zeroRates)).rejects.toThrow()
    })
  })

  describe('getRateDetails', () => {
    it('should return rates with metadata', async () => {
      const testRates: Record<Currency, number> = {
        KZT: 450.0,
        TRY: 32.0,
        RUB: 90.0,
        USD: 1.0,
      }

      await repository.updateRates(testRates)
      const details = await repository.getRateDetails()

      expect(details.rates).toEqual(testRates)
      expect(details.fetchedAt).toBeInstanceOf(Date)
      expect(details.expiresAt).toBeInstanceOf(Date)
      expect(typeof details.isExpired).toBe('boolean')
    })

    it('should correctly identify non-expired rates', async () => {
      const testRates: Record<Currency, number> = {
        KZT: 450.0,
        TRY: 32.0,
        RUB: 90.0,
        USD: 1.0,
      }

      await repository.updateRates(testRates)
      const details = await repository.getRateDetails()

      expect(details.isExpired).toBe(false)
    })

    it('should correctly identify expired rates', async () => {
      // Create expired rates
      const now = new Date()
      const expiredDate = new Date(now.getTime() - 7200000) // 2 hours ago

      await prisma.exchangeRate.create({
        data: {
          baseCurrency: 'USD',
          targetCurrency: 'KZT',
          rate: 450.0,
          fetchedAt: expiredDate,
          expiresAt: expiredDate,
        },
      })

      const details = await repository.getRateDetails()

      expect(details.isExpired).toBe(true)
    })

    it('should return fallback when no rates exist', async () => {
      const details = await repository.getRateDetails()

      expect(details.rates.USD).toBe(1.0)
      expect(details.isExpired).toBe(true)
    })
  })

  describe('cleanupExpiredRates', () => {
    it('should delete expired rates older than 7 days', async () => {
      const now = new Date()
      const eightDaysAgo = new Date(now.getTime() - 8 * 24 * 3600000)

      // Create old expired rate
      await prisma.exchangeRate.create({
        data: {
          baseCurrency: 'USD',
          targetCurrency: 'KZT',
          rate: 450.0,
          fetchedAt: eightDaysAgo,
          expiresAt: eightDaysAgo,
        },
      })

      const deleted = await repository.cleanupExpiredRates()

      expect(deleted).toBe(1)
    })

    it('should keep rates newer than 7 days', async () => {
      const now = new Date()
      const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 3600000)

      // Create recent expired rate
      await prisma.exchangeRate.create({
        data: {
          baseCurrency: 'USD',
          targetCurrency: 'KZT',
          rate: 450.0,
          fetchedAt: sixDaysAgo,
          expiresAt: sixDaysAgo,
        },
      })

      const deleted = await repository.cleanupExpiredRates()

      expect(deleted).toBe(0)
    })

    it('should return 0 when no expired rates exist', async () => {
      const deleted = await repository.cleanupExpiredRates()

      expect(deleted).toBe(0)
    })
  })
})
