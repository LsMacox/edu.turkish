export interface NormalizedLocale {
  normalized: string
  fallbacks: string[]
}

/**
 * Normalize locale codes and provide fallback variants.
 * Ensures kk/kz aliases are treated uniformly while always
 * including Russian as the ultimate fallback.
 */
export function normalizeLocale(input?: string | null): NormalizedLocale {
  const base = (input ?? 'ru').toLowerCase()
  const raw = base.split(/[-_]/)[0]
  const normalized = raw === 'kz' ? 'kk' : raw
  const variants = normalized === 'kk' ? ['kk', 'kz'] : [normalized]
  const fallbacks = Array.from(new Set([...variants, 'ru']))

  return {
    normalized,
    fallbacks
  }
}
