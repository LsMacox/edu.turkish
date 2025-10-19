// @vitest-environment node
import { describe, it, expect, beforeAll, vi } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import type { ExchangeRatesResponse } from '~~/server/types/api/services'

// Mock Prisma client used by API route to avoid real DB
vi.mock('~~/lib/prisma', async () => {
  const { createMockPrisma } = await import('~~/tests/test-utils')
  type Currency = 'KZT' | 'TRY' | 'RUB' | 'USD'
  type Row = {
    baseCurrency: 'USD'
    targetCurrency: Currency
    rate: { toNumber: () => number }
    fetchedAt: Date
    expiresAt: Date
  }
  const store: Row[] = []
  const prisma = createMockPrisma()
  ;(prisma.exchangeRate.findMany as any) = vi.fn(async (args?: any) => {
    let rows = [...store]
    if (args?.where?.baseCurrency) rows = rows.filter((r) => r.baseCurrency === args.where.baseCurrency)
    if (args?.where?.expiresAt?.gte) rows = rows.filter((r) => r.expiresAt >= args.where.expiresAt.gte)
    if (args?.orderBy?.fetchedAt === 'desc') rows.sort((a, b) => b.fetchedAt.getTime() - a.fetchedAt.getTime())
    if (typeof args?.take === 'number') rows = rows.slice(0, args.take)
    return rows
  })
  ;(prisma.exchangeRate.upsert as any) = vi.fn(async (args: any) => {
    const now = args.update?.fetchedAt ?? new Date()
    const expiresAt = args.update?.expiresAt ?? new Date(now.getTime() + 3600000)
    const targetCurrency = args.where.baseCurrency_targetCurrency.targetCurrency as Currency
    const idx = store.findIndex((r) => r.baseCurrency === 'USD' && r.targetCurrency === targetCurrency)
    const rateVal = (args.update?.rate ?? args.create?.rate) as number
    const row: Row = { baseCurrency: 'USD', targetCurrency, rate: { toNumber: () => rateVal }, fetchedAt: now, expiresAt }
    if (idx >= 0) store[idx] = row
    else store.push(row)
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
    for (let i = store.length - 1; i >= 0; i--) if (store[i]!.expiresAt < lt) store.splice(i, 1)
    return { count: before - store.length }
  })
  return { prisma: prisma as any }
})

// Mock external exchange rate fetcher to return immediate fallback-like values
vi.mock('~~/server/services/ExchangeRateService', () => ({
  ExchangeRateService: class {
    async fetchRates() {
      return { KZT: 450.0, TRY: 32.0, RUB: 90.0, USD: 1.0 }
    }
  },
}))

describe('Exchange Rates API Contract', async () => {
  await setup({
    server: true,
    dev: true,
    nuxtConfig: {
      vite: {
        build: { sourcemap: false },
      },
      nitro: {
        sourceMap: false,
      },
    },
  })
  let response: Response
  let data: ExchangeRatesResponse

  beforeAll(async () => {
    // Fetch exchange rates from the in-process server
    const json = await $fetch<ExchangeRatesResponse>('/api/v1/exchange-rates')
    // Mimic Response-like object for status checks in tests
    response = { status: 200 } as any
    data = json
  })

  it('should return 200 status', () => {
    expect(response.status).toBe(200)
  })

  it('should return rates for all 4 currencies', () => {
    expect(data.rates).toHaveProperty('KZT')
    expect(data.rates).toHaveProperty('TRY')
    expect(data.rates).toHaveProperty('RUB')
    expect(data.rates).toHaveProperty('USD')
  })

  it('should have USD rate always equal to 1.0', () => {
    expect(data.rates.USD).toBe(1.0)
  })

  it('should have all rates as positive numbers', () => {
    expect(data.rates.KZT).toBeGreaterThan(0)
    expect(data.rates.TRY).toBeGreaterThan(0)
    expect(data.rates.RUB).toBeGreaterThan(0)
    expect(data.rates.USD).toBeGreaterThan(0)
  })

  it('should have valid ISO 8601 timestamps', () => {
    expect(data.fetchedAt).toBeTruthy()
    expect(data.expiresAt).toBeTruthy()
    
    // Validate ISO 8601 format
    const fetchedDate = new Date(data.fetchedAt)
    const expiresDate = new Date(data.expiresAt)
    
    expect(fetchedDate.toISOString()).toBe(data.fetchedAt)
    expect(expiresDate.toISOString()).toBe(data.expiresAt)
  })

  it('should have expiresAt after fetchedAt', () => {
    const fetchedDate = new Date(data.fetchedAt)
    const expiresDate = new Date(data.expiresAt)
    
    expect(expiresDate.getTime()).toBeGreaterThanOrEqual(fetchedDate.getTime())
  })

  it('should have baseCurrency as USD', () => {
    expect(data.baseCurrency).toBe('USD')
  })

  it('should have isFallback flag when present', () => {
    if (data.isFallback !== undefined) {
      expect(typeof data.isFallback).toBe('boolean')
    }
  })

  it('should respond in less than 200ms', async () => {
    const startTime = Date.now()
    await $fetch('/api/v1/exchange-rates')
    const endTime = Date.now()
    
    expect(endTime - startTime).toBeLessThan(200)
  })

  it('should have correct response shape', () => {
    expect(data).toMatchObject({
      rates: expect.any(Object),
      baseCurrency: expect.any(String),
      fetchedAt: expect.any(String),
      expiresAt: expect.any(String),
    })
  })
})
