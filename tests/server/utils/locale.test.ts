import { describe, expect, it } from 'vitest'

import { normalizeLocale } from '~~/server/utils/locale'

describe('normalizeLocale', () => {
  it('normalizes supported locale with fallbacks', () => {
    const result = normalizeLocale('en-US')

    expect(result).toEqual({
      normalized: 'en',
      fallbacks: ['en', 'ru'],
    })
  })

  it('falls back to default locale when unsupported', () => {
    const result = normalizeLocale('de-DE')

    expect(result).toEqual({
      normalized: 'ru',
      fallbacks: ['ru'],
    })
  })

  it('uses default locale when input is empty', () => {
    const result = normalizeLocale()

    expect(result).toEqual({
      normalized: 'ru',
      fallbacks: ['ru'],
    })
  })

  it('trims whitespace and handles empty input', () => {
    const result = normalizeLocale('  tr  ')

    expect(result).toEqual({
      normalized: 'tr',
      fallbacks: ['tr', 'ru'],
    })
  })
})
