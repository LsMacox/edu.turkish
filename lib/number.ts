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

export function toNonNegativeNumber(value: unknown): number | undefined {
  if (value == null || value === '') return undefined
  const num = Number(value)
  return Number.isFinite(num) && num >= 0 ? num : undefined
}

export function toPositiveInteger(value: unknown): number | undefined {
  return parsePositiveInt(Array.isArray(value) ? value[0] : value)
}

export function toPositiveIntegerWithDefault(value: unknown, defaultValue: number): number {
  return toPositiveInteger(value) ?? defaultValue
}
