import { timingSafeEqual } from 'node:crypto'
import { z } from 'zod'

/**
 * EspoCRM Webhook Validator
 *
 * Validates webhook payloads and implements business logic for token validation
 * and team filtering
 */



// Some EspoCRM integrations can send a plain entity object without the envelope.
export const espocrmLeadEntitySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    emailAddress: z.string().optional(),
    status: z.string(),
    source: z.string().optional(),
    description: z.string().optional(),
    assignedUserId: z.string().optional(),
    teamsIds: z.array(z.string()).optional(),
    createdAt: z.string(),
    modifiedAt: z.string(),
  })
  .passthrough()

// Normalize lead webhook payload: accept either envelope or plain entity
export function parseLeadWebhookPayload(
  body: unknown,
): { event: 'create'; entity: Record<string, any> } {
  let candidate: unknown = body

  // Handle text/plain or raw JSON string
  if (typeof candidate === 'string') {
    try {
      candidate = JSON.parse(candidate)
    } catch {
      // leave as-is; schema will report a clear error
    }
  }

  // Handle urlencoded form like { data: '{...}' }
  if (
    candidate &&
    typeof candidate === 'object' &&
    'data' in (candidate as any) &&
    typeof (candidate as any).data === 'string'
  ) {
    try {
      candidate = JSON.parse((candidate as any).data)
    } catch {
      // leave as-is
    }
  }

  const entity = espocrmLeadEntitySchema.parse(candidate)
  return { event: 'create', entity: entity as any }
}

/**
 * Zod schema for Call webhook payload
 */
// Plain call entity payload schema (SPSRM format)
export const espocrmCallEntitySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    status: z.enum(['Planned', 'Held', 'Not Held']),
    dateStart: z.string().optional(),
    dateEnd: z.string().optional(),
    duration: z.number().optional(),
    description: z.string().optional(),
    direction: z.enum(['Outbound', 'Inbound']).optional(),
    assignedUserId: z.string().optional(),
    teamsIds: z.array(z.string()).optional(),
    createdAt: z.string(),
    modifiedAt: z.string(),
  })
  .passthrough()

// Normalize call webhook payload: accept only plain entity
export function parseCallWebhookPayload(
  body: unknown,
): { event: 'create'; entity: Record<string, any> } {
  let candidate: unknown = body

  if (typeof candidate === 'string') {
    try {
      candidate = JSON.parse(candidate)
    } catch {
      // noop
    }
  }

  if (
    candidate &&
    typeof candidate === 'object' &&
    'data' in (candidate as any) &&
    typeof (candidate as any).data === 'string'
  ) {
    try {
      candidate = JSON.parse((candidate as any).data)
    } catch {
      // noop
    }
  }

  const entity = espocrmCallEntitySchema.parse(candidate)
  return { event: 'create', entity: entity as any }
}

/**
 * Validate webhook token against configured token
 */
export function validateWebhookToken(token: string | undefined, expectedToken: string): boolean {
  if (!token || !expectedToken) {
    return false
  }

  const providedBuffer = Buffer.from(token)
  const expectedBuffer = Buffer.from(expectedToken)

  if (providedBuffer.length !== expectedBuffer.length) {
    return false
  }

  try {
    return timingSafeEqual(providedBuffer, expectedBuffer)
  } catch {
    return false
  }
}

/**
 * Determine if notification should be sent based on team filtering
 *
 * Business rules:
 * - If no team filter configured (empty string), send all notifications
 * - If teamsIds is empty or undefined, send notification (simplified approach)
 * - If teamsIds contains configured team, send notification
 * - Otherwise, don't send notification
 */
export function shouldNotifyByTeam(
  teamsIds: string[] | undefined,
  configuredTeamId: string,
): boolean {
  // No filter configured = send all
  if (!configuredTeamId) {
    return true
  }

  // No teams assigned = send (simplified approach)
  if (!teamsIds || teamsIds.length === 0) {
    return true
  }

  // Check if configured team is in the list
  return teamsIds.includes(configuredTeamId)
}
