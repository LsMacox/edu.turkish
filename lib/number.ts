// Shared number utilities (usable in both app and server)
export function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
}

/**
 * Parse positive integer from string | number.
 * Returns undefined if not a finite integer > 0 or not parsable.
 */
export function parsePositiveInt(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return isPositiveInteger(value) ? value : undefined
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return undefined
    const num = Number.parseInt(trimmed, 10)
    return Number.isFinite(num) && Number.isInteger(num) && num > 0 ? num : undefined
  }
  return undefined
}
