import { describe, expect, it } from 'vitest'

import { normalizeLocale } from '~~/server/utils/locale'

describe('normalizeLocale', () => {
  it('falls back to default locale when input is empty', () => {
    const result = normalizeLocale('')

    expect(result).toEqual({
      normalized: 'ru',
      fallbacks: ['ru'],
    })
  })

  it('normalizes supported locales with fallbacks', () => {
    const result = normalizeLocale('en-US')

    expect(result).toEqual({
      normalized: 'en',
      fallbacks: ['en', 'ru'],
    })
  })

  it('guards against unsupported locales by falling back to default', () => {
    const result = normalizeLocale('es')

    expect(result).toEqual({
      normalized: 'ru',
      fallbacks: ['ru'],
    })
  })
})
