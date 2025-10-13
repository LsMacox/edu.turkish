# Data Model: EspoCRM Telegram Notifications

**Feature**: EspoCRM Webhook Integration with Telegram Notifications  
**Date**: 2025-10-12

## Overview

This feature introduces new type definitions for EspoCRM webhook payloads and Telegram notifications. No database schema changes are required as all processing is stateless and uses existing Redis queue infrastructure.

---

## Type Definitions

### 1. EspoCRM Webhook Payload Types

**File**: `server/types/espocrm-webhook.ts`

```typescript
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
```

**Validation Rules**:

- `entityType` must match expected type ('Lead' or 'Call')
- `event` must be 'create' (we only process new records)
- `entity` must contain required fields (id, name, createdAt)
- `teamsIds` is optional array (empty = no team assignment)

**Relationships**:

- Lead → Teams (many-to-many via teamsIds)
- Call → Contact/Account (via parentId/contactId)
- Call → Teams (many-to-many via teamsIds)

---

### 2. Telegram Notification Types

**File**: `server/types/telegram.ts`

```typescript
/**
 * Telegram notification job data
 */
export interface TelegramNotificationJob {
  channelId: string
  message: string
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2'
  disableWebPagePreview?: boolean
  disableNotification?: boolean
}

/**
 * Telegram API sendMessage request
 */
export interface TelegramSendMessageRequest {
  chat_id: string | number
  text: string
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2'
  disable_web_page_preview?: boolean
  disable_notification?: boolean
}

/**
 * Telegram API response
 */
export interface TelegramAPIResponse<T = any> {
  ok: boolean
  result?: T
  description?: string
  error_code?: number
}

/**
 * Telegram message result
 */
export interface TelegramMessage {
  message_id: number
  date: number
  chat: {
    id: number
    type: string
    title?: string
  }
  text?: string
}

/**
 * Notification result
 */
export interface TelegramNotificationResult {
  success: boolean
  messageId?: number
  error?: string
  timestamp: Date
}
```

**Validation Rules**:

- `channelId` must be non-empty string
- `message` must be non-empty, max 4096 characters (Telegram limit)
- `parseMode` defaults to 'HTML'

---

### 3. Queue Job Types Extension

**File**: `server/types/crm/operations.ts` (extend existing)

```typescript
// Add to existing CRMQueueJob operation types
export interface TelegramQueueJob {
  id: string
  operation: 'sendTelegramNotification'
  data: TelegramNotificationJob
  attempts: number
  maxAttempts: number
  createdAt: Date
  lastAttemptAt?: Date
  nextRetryAt?: Date
  error?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}
```

---

## Data Flow

### Webhook to Notification Flow

```
1. EspoCRM Webhook
   ↓ (HTTP POST)
2. Webhook Endpoint (/api/webhooks/espocrm/lead or /call-activity)
   ↓ (validate token, parse payload)
3. Team Filter Check
   ↓ (if team matches or no filter)
4. Format Message
   ↓ (entity data → formatted HTML)
5. Queue Job
   ↓ (add to telegram-notifications queue)
6. Return 200 OK
   ↓
7. Queue Worker (async)
   ↓ (process job)
8. Telegram API
   ↓ (sendMessage)
9. Success/Retry/Fail
```

### State Transitions

**Queue Job States**:

```
pending → processing → completed
                    ↓
                   failed (after 3 attempts)
```

**No persistent state** - all data is transient (webhook payload, queue jobs).

---

## Field Mappings

### Lead → Telegram Message

| EspoCRM Field        | Telegram Display | Required | Format                   |
| -------------------- | ---------------- | -------- | ------------------------ |
| firstName + lastName | 👤 Имя           | Yes      | Text                     |
| phoneNumber          | 📱 Телефон       | Yes      | Text                     |
| emailAddress         | 📧 Email         | No       | Text                     |
| accountName          | 🏢 Компания      | No       | Text                     |
| source               | 🌐 Источник      | No       | Text                     |
| status               | 📊 Статус        | Yes      | Text                     |
| description          | 📝 Описание      | No       | Text (truncated if long) |
| assignedUserName     | 👨‍💼 Ответственный | No       | Text                     |
| createdAt            | ⏰ Время         | Yes      | Formatted datetime       |

### Call → Telegram Message

| EspoCRM Field              | Telegram Display | Required | Format                   |
| -------------------------- | ---------------- | -------- | ------------------------ |
| contactName or parentName  | 👤 Контакт       | Yes      | Text                     |
| phoneNumber (from contact) | 📱 Телефон       | No       | Text                     |
| status                     | 📊 Статус        | Yes      | Text                     |
| direction                  | ↔️ Направление   | No       | Inbound/Outbound         |
| duration                   | ⏱ Длительность  | No       | MM:SS format             |
| description                | 📝 Заметки       | No       | Text (truncated if long) |
| assignedUserName           | 👨‍💼 Ответственный | No       | Text                     |
| dateStart                  | ⏰ Время         | Yes      | Formatted datetime       |

**Excluded Fields** (technical, not useful for consultants):

- id, assignedUserId, teamsIds, parentId, contactId, accountId
- modifiedAt, userId, entityType
- Custom field IDs

---

## Validation Schemas

### Webhook Payload Validation

**File**: `server/utils/espocrm-webhook-validator.ts`

```typescript
import { z } from 'zod'

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
      emailAddress: z.string().email().optional(),
      status: z.string(),
      source: z.string().optional(),
      assignedUserName: z.string().optional(),
      teamsIds: z.array(z.string()).optional(),
      createdAt: z.string(),
    })
    .passthrough(), // Allow additional fields
  timestamp: z.string(),
})

export const espocrmCallWebhookSchema = z.object({
  entityType: z.literal('Call'),
  event: z.literal('create'),
  entity: z
    .object({
      id: z.string(),
      name: z.string(),
      status: z.enum(['Planned', 'Held', 'Not Held']),
      dateStart: z.string().optional(),
      duration: z.number().optional(),
      description: z.string().optional(),
      contactName: z.string().optional(),
      parentName: z.string().optional(),
      assignedUserName: z.string().optional(),
      teamsIds: z.array(z.string()).optional(),
      createdAt: z.string(),
    })
    .passthrough(),
  timestamp: z.string(),
})
```

---

## Configuration Schema

### Runtime Config Extension

**File**: `nuxt.config.ts` (to be updated)

```typescript
runtimeConfig: {
  // Private (server-only)
  espocrmWebhookToken: process.env.NUXT_ESPOCRM_WEBHOOK_TOKEN || '',
  espocrmAssignedTeamId: process.env.NUXT_ESPOCRM_ASSIGNED_TEAM_ID || '',
  telegramBotToken: process.env.NUXT_TELEGRAM_BOT_TOKEN || '',
  telegramLeadsChannelId: process.env.NUXT_TELEGRAM_LEADS_CHANNEL_ID || '',
  telegramCallsChannelId: process.env.NUXT_TELEGRAM_CALLS_CHANNEL_ID || '',

  public: {
    // ... existing public config
  }
}
```

**Validation**: All tokens/IDs are required at runtime, will throw error if missing.

---

## Error Handling

### Error Types

```typescript
export class WebhookValidationError extends Error {
  constructor(
    message: string,
    public details?: any,
  ) {
    super(message)
    this.name = 'WebhookValidationError'
  }
}

export class TelegramAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any,
  ) {
    super(message)
    this.name = 'TelegramAPIError'
  }
}

export class TeamFilterError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TeamFilterError'
  }
}
```

### Error Responses

**Webhook Endpoint Errors**:

- 401 Unauthorized: Invalid webhook token
- 400 Bad Request: Invalid payload structure
- 500 Internal Server Error: Unexpected error (still queues job if possible)

**Queue Worker Errors**:

- Logged to console with full context
- Job retried up to 3 times
- Moved to dead letter queue after max attempts

---

## No Database Schema Changes

This feature does not require any database migrations or schema changes:

- ✅ No new Prisma models
- ✅ No new database tables
- ✅ Uses existing Redis for queue
- ✅ All data is transient (webhook payloads, queue jobs)

---

## Summary

**New Type Files**:

1. `server/types/espocrm-webhook.ts` - EspoCRM webhook payload types
2. `server/types/telegram.ts` - Telegram notification types

**Extended Files**:

1. `server/types/crm/operations.ts` - Add TelegramQueueJob type

**Configuration**:

1. `nuxt.config.ts` - Add 5 new runtime config variables

**No Database Changes**: All processing is stateless and ephemeral.
