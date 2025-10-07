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

/**
 * Converts a value to a non-negative number.
 * @param value The value to convert.
 * @returns A non-negative number, or undefined if conversion is not possible.
 */
export function toNonNegativeNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 0) {
    return undefined
  }

  return parsed
}

/**
 * Converts a value to a positive integer.
 * If the value is an array, the first element is used.
 * @param value The value to convert.
 * @returns A positive integer, or undefined if conversion is not possible.
 */
export function toPositiveInteger(value: unknown): number | undefined {
  return parsePositiveInt(Array.isArray(value) ? value[0] : value)
}

/**
 * Converts a value to a positive integer, with a fallback to a default value.
 * If the value is an array, the first element is used.
 * @param value The value to convert.
 * @param defaultValue The default value to return if conversion is not possible.
 * @returns A positive integer or the default value.
 */
export function toPositiveIntegerWithDefault (value: unknown, defaultValue: number) {
  const candidate = Array.isArray(value) ? value[0] : value
  const parsed = parsePositiveInt(candidate)
  return parsed ?? defaultValue
}
