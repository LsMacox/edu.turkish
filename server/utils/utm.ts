import { getQuery } from 'h3'
import type { H3Event } from 'h3'
import { extractUtmFromQuery } from '~~/lib/utm'

export { sanitizeUtm, extractUtmFromQuery, hasUtmValues } from '~~/lib/utm'
export type { UtmParams } from '~~/lib/utm'

export function extractUtmFromEvent(event: H3Event) {
  return extractUtmFromQuery(getQuery(event) as Record<string, unknown>)
}
