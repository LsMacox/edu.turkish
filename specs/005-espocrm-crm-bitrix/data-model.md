# Data Model: CRM Abstraction Layer

**Feature**: 005-espocrm-crm-bitrix  
**Date**: 2025-10-04

## Core Entities

### 1. CRM Provider Configuration

**Purpose**: Stores configuration for each CRM provider

```typescript
interface CRMProviderConfig {
  provider: 'bitrix' | 'espocrm'
  baseUrl: string
  apiKey?: string
  webhookUrl?: string
  accessToken?: string
  timeout: number
  retries: number
  fieldMappings: FieldMappingConfig
}

interface FieldMappingConfig {
  referralCode: string
  userType: string
  language: string
  fieldOfStudy: string
  university: string
  source: string
}
```

**Validation Rules**:

- `provider` must be one of: 'bitrix', 'espocrm'
- `baseUrl` must be valid HTTP/HTTPS URL
- `timeout` must be > 0 and < 30000 (30 seconds)
- `retries` must be >= 0 and <= 5
- At least one of `apiKey`, `webhookUrl`, or `accessToken` must be present

### 2. Lead Data

**Purpose**: Standardized lead data structure for CRM operations

```typescript
interface LeadData {
  // Personal Information (required)
  firstName: string
  lastName: string
  phone: string
  email: string

  // Education Preferences (optional)
  fieldOfStudy?: string
  universities?: string[]
  programs?: string[]

  // User Preferences (optional)
  userType?: 'student' | 'parent'
  language?: 'turkish' | 'english' | 'both'
  scholarship?: 'yes' | 'no'
  universityChosen?: string

  // Attribution (required)
  referralCode: string
  source: string
  sourceDescription?: string

  // UTM Parameters (optional)
  utm?: {
    source?: string
    medium?: string
    campaign?: string
    content?: string
    term?: string
  }

  // Additional
  additionalInfo?: string
  session?: string
}
```

**Validation Rules**:

- `firstName`, `lastName`, `phone`, `email`, `referralCode`, `source` are required
- `email` must be valid email format
- `phone` must be valid phone format (E.164 or local)
- `userType` must be one of: 'student', 'parent'
- `language` must be one of: 'turkish', 'english', 'both'
- `scholarship` must be one of: 'yes', 'no'

### 3. Activity Data

**Purpose**: Messenger click events and user interactions

```typescript
interface ActivityData {
  channel: 'telegramBot' | 'whatsapp' | 'instagram'
  referralCode: string
  session?: string
  utm?: {
    source?: string
    medium?: string
    campaign?: string
    content?: string
    term?: string
  }
  metadata?: {
    page?: string
    section?: string
    component?: string
    campaign?: string
    referrer?: string
    notes?: string
  }
}
```

**Validation Rules**:

- `channel` must be one of: 'telegramBot', 'whatsapp', 'instagram'
- `referralCode` is required
- `utm` and `metadata` are optional but if present, must have at least one field

### 4. CRM Operation Result

**Purpose**: Standardized response from CRM operations

```typescript
interface CRMResult {
  success: boolean
  id?: string | number
  error?: string
  provider: 'bitrix' | 'espocrm'
  operation: 'createLead' | 'updateLead' | 'logActivity' | 'testConnection'
  timestamp: Date
}
```

**State Transitions**:

- Initial: Operation queued
- Processing: Operation in progress
- Success: `success: true`, `id` present
- Failed: `success: false`, `error` present
- Retry: Failed operation re-queued

### 5. Queue Job

**Purpose**: Represents a CRM operation in the retry queue

```typescript
interface CRMQueueJob {
  id: string
  operation: 'createLead' | 'updateLead' | 'logActivity'
  provider: 'bitrix' | 'espocrm'
  data: LeadData | ActivityData
  attempts: number
  maxAttempts: number
  createdAt: Date
  lastAttemptAt?: Date
  nextRetryAt?: Date
  error?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}
```

**State Transitions**:

```
pending → processing → completed
              ↓
           failed (if attempts < maxAttempts)
              ↓
           pending (retry)
              ↓
           failed (if attempts >= maxAttempts, move to DLQ)
```

## Relationships

```
CRMProviderConfig (1) ←→ (N) CRMResult
    ↓
CRMProvider Interface
    ↓
BitrixCRMProvider | EspoCRMProvider
    ↓
CRMQueueJob (N) → (1) CRMResult
```

## Field Mapping Examples

### Bitrix → Standard

| Bitrix Field           | Standard Field | Notes           |
| ---------------------- | -------------- | --------------- |
| `NAME`                 | `firstName`    | Direct mapping  |
| `LAST_NAME`            | `lastName`     | Direct mapping  |
| `PHONE[0].VALUE`       | `phone`        | Array to string |
| `EMAIL[0].VALUE`       | `email`        | Array to string |
| `UF_CRM_REFERRAL_CODE` | `referralCode` | Custom field    |
| `UF_CRM_1234567893`    | `userType`     | Custom field    |
| `UF_CRM_1234567894`    | `language`     | Custom field    |
| `UF_CRM_1234567896`    | `fieldOfStudy` | Custom field    |
| `UF_CRM_1234567897`    | `university`   | Custom field    |
| `SOURCE_ID`            | `source`       | Direct mapping  |

### EspoCRM → Standard

| EspoCRM Field   | Standard Field | Notes          |
| --------------- | -------------- | -------------- |
| `firstName`     | `firstName`    | Direct mapping |
| `lastName`      | `lastName`     | Direct mapping |
| `phoneNumber`   | `phone`        | Direct mapping |
| `emailAddress`  | `email`        | Direct mapping |
| `referralCodeC` | `referralCode` | Custom field   |
| `userTypeC`     | `userType`     | Custom field   |
| `languageC`     | `language`     | Custom field   |
| `fieldOfStudyC` | `fieldOfStudy` | Custom field   |
| `universityC`   | `university`   | Custom field   |
| `source`        | `source`       | Direct mapping |

## Validation Schema (Zod)

```typescript
import { z } from 'zod'

export const leadDataSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().min(10).max(20),
  email: z.string().email(),
  fieldOfStudy: z.string().optional(),
  universities: z.array(z.string()).optional(),
  programs: z.array(z.string()).optional(),
  userType: z.enum(['student', 'parent']).optional(),
  language: z.enum(['turkish', 'english', 'both']).optional(),
  scholarship: z.enum(['yes', 'no']).optional(),
  universityChosen: z.string().optional(),
  referralCode: z.string().min(1),
  source: z.string().min(1),
  sourceDescription: z.string().optional(),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      content: z.string().optional(),
      term: z.string().optional(),
    })
    .optional(),
  additionalInfo: z.string().optional(),
  session: z.string().optional(),
})

export const activityDataSchema = z.object({
  channel: z.enum(['telegramBot', 'whatsapp', 'instagram']),
  referralCode: z.string().min(1),
  session: z.string().optional(),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      content: z.string().optional(),
      term: z.string().optional(),
    })
    .optional(),
  metadata: z
    .object({
      page: z.string().optional(),
      section: z.string().optional(),
      component: z.string().optional(),
      campaign: z.string().optional(),
      referrer: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
})
```

## Database Schema Changes

**No Prisma schema changes required** - This feature is infrastructure and service-layer only. All data flows through existing `applications` table and CRM APIs.

## Type Exports

```typescript
// server/types/crm/provider.ts
export type { CRMProviderConfig, FieldMappingConfig }

// server/types/crm/operations.ts
export type { LeadData, ActivityData, CRMResult, CRMQueueJob }

// server/types/crm/index.ts
export * from './provider'
export * from './operations'
```
