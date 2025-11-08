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
    name: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    emailAddress: z.string().optional(),
    status: z.string().optional(),
    source: z.string().optional(),
    description: z.string().optional(),
    assignedUserId: z.string().optional(),
    teamsIds: z.array(z.string()).optional(),
    createdAt: z.string().optional(),
    modifiedAt: z.string().optional(),
  })
  .passthrough()

// Normalize lead webhook payload: accept either envelope or plain entity
export function parseLeadWebhookPayload(
  body: unknown,
): { event: 'create'; entity: Record<string, any> } {
  let candidate: unknown = body

  const entity = espocrmLeadEntitySchema.parse(candidate)
  return { event: 'create', entity: entity as any }
}

// Normalize lead webhook batch payload: accept array or single entity and return array of entities
export function parseLeadWebhookBatchPayload(
  body: unknown,
): { event: 'create'; entities: Record<string, any>[] } {
  let candidate: unknown = body

  if (Array.isArray(candidate)) {
    const entities = candidate.map((item) => espocrmLeadEntitySchema.parse(item))
    return { event: 'create', entities: entities as any }
  }

  const entity = espocrmLeadEntitySchema.parse(candidate)
  return { event: 'create', entities: [entity as any] }
}

/**
 * Zod schema for Call webhook payload
 */
// Plain call entity payload schema (SPSRM format)
export const espocrmCallEntitySchema = z
  .object({
    id: z.string(),
    name: z.string().optional(),
    status: z.enum(['Planned', 'Held', 'Not Held']).optional(),
    dateStart: z.string().optional(),
    dateEnd: z.string().optional(),
    duration: z.number().optional(),
    description: z.string().optional(),
    direction: z.enum(['Outbound', 'Inbound']).optional(),
    assignedUserId: z.string().optional(),
    teamsIds: z.array(z.string()).optional(),
    createdAt: z.string().optional(),
    modifiedAt: z.string().optional(),
  })
  .passthrough()

// Normalize call webhook payload: accept only plain entity
export function parseCallWebhookPayload(
  body: unknown,
): { event: 'create'; entity: Record<string, any> } {
  let candidate: unknown = body

  const entity = espocrmCallEntitySchema.parse(candidate)
  return { event: 'create', entity: entity as any }
}

// Normalize call webhook batch payload: accept array or single entity and return array of entities
export function parseCallWebhookBatchPayload(
  body: unknown,
): { event: 'create'; entities: Record<string, any>[] } {
  let candidate: unknown = body

  if (Array.isArray(candidate)) {
    const entities = candidate.map((item) => espocrmCallEntitySchema.parse(item))
    return { event: 'create', entities: entities as any }
  }

  const entity = espocrmCallEntitySchema.parse(candidate)
  return { event: 'create', entities: [entity as any] }
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
