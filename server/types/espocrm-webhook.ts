/**
 * EspoCRM Webhook Type Definitions
 * 
 * Types for EspoCRM webhook payloads (Lead and Call entities)
 */

/**
 * Base EspoCRM webhook payload structure
 */
export interface EspoCRMWebhookPayload<T = unknown> {
  entityType: string
  entity: T
  event: 'create' | 'update' | 'delete'
  timestamp: string
  userId?: string
  userName?: string
}

/**
 * EspoCRM Lead entity from webhook
 */
export interface EspoCRMLead {
  id: string
  name: string
  firstName?: string
  lastName?: string
  accountName?: string
  status: string
  source?: string
  industry?: string
  website?: string
  emailAddress?: string
  phoneNumber?: string
  description?: string
  assignedUserId?: string
  assignedUserName?: string
  teamsIds?: string[]
  teamsNames?: Record<string, string>
  createdAt: string
  modifiedAt: string
  // Custom fields
  [key: string]: any
}

/**
 * EspoCRM Call entity from webhook
 */
export interface EspoCRMCall {
  id: string
  name: string
  status: 'Planned' | 'Held' | 'Not Held'
  dateStart?: string
  dateEnd?: string
  duration?: number // in seconds
  description?: string
  direction?: 'Outbound' | 'Inbound'
  parentType?: string
  parentId?: string
  parentName?: string
  contactId?: string
  contactName?: string
  accountId?: string
  accountName?: string
  phoneNumber?: string
  assignedUserId?: string
  assignedUserName?: string
  teamsIds?: string[]
  teamsNames?: Record<string, string>
  createdAt: string
  modifiedAt: string
  // Custom fields
  [key: string]: any
}

/**
 * Typed webhook payloads
 */
export type EspoCRMLeadWebhook = EspoCRMWebhookPayload<EspoCRMLead>
export type EspoCRMCallWebhook = EspoCRMWebhookPayload<EspoCRMCall>
