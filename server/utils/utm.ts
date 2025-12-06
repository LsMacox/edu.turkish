import { getQuery } from 'h3'
import type { H3Event } from 'h3'
import { sanitizeUtm } from '~~/lib/utm'

export { sanitizeUtm, hasUtmValues } from '~~/lib/utm'
export type { UtmParams } from '~~/lib/utm'

export function extractUtmFromEvent(event: H3Event) {
  return sanitizeUtm(getQuery(event) as Record<string, unknown>)
}
