/**
 * Parse a value into a positive integer.
 * Returns undefined if parsing fails or value is not positive.
 */
export function parsePositiveInt(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return Number.isInteger(value) && value > 0 ? value : undefined
  }
  if (typeof value === 'string') {
    const num = Number.parseInt(value.trim(), 10)
    return num > 0 ? num : undefined
  }
  return undefined
}

/**
 * Convert a value to a non-negative number.
 * Returns undefined for null/empty/invalid inputs.
 */
export function toNonNegativeNumber(value: unknown): number | undefined {
  if (value == null || value === '') return undefined
  const num = Number(value)
  return Number.isFinite(num) && num >= 0 ? num : undefined
}

/**
 * Format number with space separators (e.g., 1 000 000)
 */
export function formatNumber(num: number | string): string {
  const value = typeof num === 'string' ? parseInt(num, 10) : num
  if (isNaN(value)) return '0'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/**
 * Format price with currency symbol (e.g., $1 000)
 */
export function formatPrice(price: number, currency = '$'): string {
  return currency + formatNumber(price)
}
