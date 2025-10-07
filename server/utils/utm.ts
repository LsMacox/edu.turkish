import type { H3Event } from 'h3'
import type { UtmParams } from '~~/server/types/utm'
export type { UtmParams } from '~~/server/types/utm'

// Internal helper to coerce a value to a trimmed string if valid
function coerce(value: unknown, maxLen = 200): string | undefined {
  if (typeof value !== 'string') return undefined
  const v = value.trim()
  if (!v || v.length > maxLen) return undefined
  return v
}

// Build UtmParams from a generic object
export function sanitizeUtm(input: unknown): UtmParams | undefined {
  if (!input || typeof input !== 'object') return undefined
  const obj = input as Record<string, unknown>

  const utm: UtmParams = {}
  const source = coerce(obj.utm_source)
  const medium = coerce(obj.utm_medium)
  const campaign = coerce(obj.utm_campaign)
  const content = coerce(obj.utm_content)
  const term = coerce(obj.utm_term)

  if (source) utm.utm_source = source
  if (medium) utm.utm_medium = medium
  if (campaign) utm.utm_campaign = campaign
  if (content) utm.utm_content = content
  if (term) utm.utm_term = term

  return hasUtmValues(utm) ? utm : undefined
}

// Extract UTM params from query-like object (e.g., getQuery(event))
export function extractUtmFromQuery(query: Record<string, any>): UtmParams | undefined {
  if (!query || typeof query !== 'object') return undefined
  // Accept either exact keys or any keys starting with utm_
  const collected: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(query)) {
    if (key.startsWith('utm_')) {
      collected[key] = value
    }
  }
  return sanitizeUtm(collected)
}

// Convenience method when you already have an H3 event
export function extractUtmFromEvent(event: H3Event): UtmParams | undefined {
  // Lazy import to avoid hard-coupling
   
  const { getQuery } = require('h3') as typeof import('h3')
  const q = getQuery(event) as Record<string, any>
  return extractUtmFromQuery(q)
}

export function hasUtmValues(utm?: UtmParams): utm is UtmParams {
  if (!utm) return false
  return Boolean(
    utm.utm_source || utm.utm_medium || utm.utm_campaign || utm.utm_content || utm.utm_term,
  )
}
