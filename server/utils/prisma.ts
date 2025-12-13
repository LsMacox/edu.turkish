import type { Prisma } from '@prisma/client'

export const decimalToNumber = (value: Prisma.Decimal | number | null | undefined): number =>
    value == null ? 0 : typeof value === 'number' ? value : Number(value)

export const asRecord = (
    value: Prisma.JsonValue | null | undefined,
): Record<string, unknown> | null =>
    value && typeof value === 'object' && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : null

export const extractStringRecord = (
    value: Prisma.JsonValue | null | undefined,
): Record<string, string> | undefined => {
    const record = asRecord(value)
    if (!record) return undefined
    const entries = Object.entries(record).filter(([, v]) => typeof v === 'string')
    return entries.length > 0 ? (Object.fromEntries(entries) as Record<string, string>) : undefined
}

export const extractStringArray = (value: Prisma.JsonValue | null | undefined): string[] =>
    Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
