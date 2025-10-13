import { describe, expect, it } from 'vitest'

import { extractUtmFromQuery, sanitizeUtm } from '~~/lib/utm'

describe('UTM utilities', () => {
  it('coerces first non-empty string from array values', () => {
    const utm = sanitizeUtm({
      utm_source: ['', ' newsletter ', 'ignored'],
      utm_medium: ['  ', 'Email'],
    })

    expect(utm).toEqual({
      utm_source: 'newsletter',
      utm_medium: 'Email',
    })
  })

  it('extracts utm params from query objects with array values', () => {
    const utm = extractUtmFromQuery({
      utm_campaign: ['Spring', 'Fallback'],
      utm_term: [''],
      unrelated: 'value',
    })

    expect(utm).toEqual({
      utm_campaign: 'Spring',
    })
  })
})
