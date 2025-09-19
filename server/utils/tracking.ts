import { randomUUID } from 'node:crypto'

export function generateTrackingCode(): string {
  const prefix = 'EDU'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}
