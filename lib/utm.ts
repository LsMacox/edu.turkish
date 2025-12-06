export type UtmParams = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
}

const UTM_KEYS: (keyof UtmParams)[] = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
]

function coerceString(value: unknown, maxLen = 200): string | undefined {
  const raw = Array.isArray(value) ? value.find((v) => typeof v === 'string' && v.trim()) : value
  if (typeof raw !== 'string') return undefined
  const trimmed = raw.trim()
  return trimmed && trimmed.length <= maxLen ? trimmed : undefined
}

export function hasUtmValues(utm?: UtmParams): utm is UtmParams {
  return !!utm && UTM_KEYS.some((k) => utm[k])
}

export function sanitizeUtm(input: unknown): UtmParams | undefined {
  if (!input || typeof input !== 'object') return undefined
  const obj = input as Record<string, unknown>

  const utm: UtmParams = {}
  for (const key of UTM_KEYS) {
    const val = coerceString(obj[key])
    if (val) utm[key] = val
  }

  return hasUtmValues(utm) ? utm : undefined
}

