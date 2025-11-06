import { timingSafeEqual } from 'node:crypto'
import { z } from 'zod'

/**
 * EspoCRM Webhook Validator
 *
 * Validates webhook payloads and implements business logic for token validation
 * and team filtering
 */

/**
 * Zod schema for Lead webhook payload
 */
export const espocrmLeadWebhookSchema = z.object({
  entityType: z.literal('Lead'),
  event: z.literal('create'),
  entity: z
    .object({
      id: z.string(),
      name: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phoneNumber: z.string().optional(),
      emailAddress: z.string().optional(),
      accountName: z.string().optional(),
      status: z.string(),
      source: z.string().optional(),
      industry: z.string().optional(),
      website: z.string().optional(),
      description: z.string().optional(),
      assignedUserId: z.string().optional(),
      assignedUserName: z.string().optional(),
      teamsIds: z.array(z.string()).optional(),
      teamsNames: z.record(z.string(), z.string()).optional(),
      createdAt: z.string(),
      modifiedAt: z.string(),
    })
    .passthrough(), // Allow additional custom fields
  timestamp: z.string(),
  userId: z.string().optional(),
  userName: z.string().optional(),
})

/**
 * Zod schema for Call webhook payload
 */
export const espocrmCallWebhookSchema = z.object({
  entityType: z.literal('Call'),
  event: z.literal('create'),
  entity: z
    .object({
      id: z.string(),
      name: z.string(),
      status: z.enum(['Planned', 'Held', 'Not Held']),
      dateStart: z.string().optional(),
      dateEnd: z.string().optional(),
      duration: z.number().optional(),
      description: z.string().optional(),
      direction: z.enum(['Outbound', 'Inbound']).optional(),
      parentType: z.string().optional(),
      parentId: z.string().optional(),
      parentName: z.string().optional(),
      contactId: z.string().optional(),
      contactName: z.string().optional(),
      accountId: z.string().optional(),
      accountName: z.string().optional(),
      phoneNumber: z.string().optional(),
      assignedUserId: z.string().optional(),
      assignedUserName: z.string().optional(),
      teamsIds: z.array(z.string()).optional(),
      teamsNames: z.record(z.string(), z.string()).optional(),
      createdAt: z.string(),
      modifiedAt: z.string(),
    })
    .passthrough(), // Allow additional custom fields
  timestamp: z.string(),
  userId: z.string().optional(),
  userName: z.string().optional(),
})

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
