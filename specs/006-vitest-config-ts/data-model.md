# Data Model: Test Infrastructure Modernization

**Feature**: 006-vitest-config-ts  
**Purpose**: Document test utility modules and mock interfaces

## Overview

This feature does not introduce new application data models. Instead, it defines test infrastructure interfaces and mock implementations to replace external dependencies.

## Test Utility Modules

### MockPrismaClient

**Purpose**: Factory function that creates a mocked Prisma Client for repository tests

**Interface**:
```typescript
interface MockPrismaClient {
  // Core Prisma models
  university: MockPrismaModel
  faq: MockPrismaModel
  faqCategory: MockPrismaModel
  review: MockPrismaModel
  application: MockPrismaModel
  // ... other models
  
  // Prisma utilities
  $transaction: vi.Mock
  $connect: vi.Mock
  $disconnect: vi.Mock
}

interface MockPrismaModel {
  findMany: vi.Mock
  findUnique: vi.Mock
  findFirst: vi.Mock
  create: vi.Mock
  update: vi.Mock
  delete: vi.Mock
  count: vi.Mock
  aggregate: vi.Mock
}
```

**Usage**:
```typescript
const prisma = createMockPrisma({
  university: {
    findMany: vi.fn().mockResolvedValue([...testData])
  }
})
```

### MockRedisQueue

**Purpose**: In-memory implementation of queue interface for testing CRM queue logic

**Interface**:
```typescript
interface MockQueue {
  addJob(operation: string, provider: string, data: unknown): Promise<Job>
  getJob(jobId: string): Promise<Job | null>
  getQueueLength(): Promise<number>
  getDeadLetterQueue(): Promise<Job[]>
  clear(): Promise<void>
}

interface Job {
  id: string
  operation: 'createLead' | 'logActivity'
  provider: 'bitrix' | 'espocrm'
  data: unknown
  status: 'pending' | 'processing' | 'completed' | 'failed'
  attempts: number
  nextRetryAt?: Date
  error?: string
}
```

**Usage**:
```typescript
const queue = createMockQueue()
const job = await queue.addJob('createLead', 'espocrm', leadData)
```

### MockNuxtComposables

**Purpose**: Mock Nuxt auto-imported composables for component tests

**Interface**:
```typescript
interface MockI18n {
  locale: Ref<string>
  t: (key: string, params?: Record<string, unknown>) => string
}

interface MockFetch {
  (url: string, options?: RequestInit): Promise<unknown>
}

interface MockNuxtApp {
  $i18n: MockI18n
  $fetch: MockFetch
}
```

**Usage**:
```typescript
const i18n = mockUseI18n('en', translations)
globalThis.useI18n = () => i18n

const fetch = mockFetch({ '/api/data': mockResponse })
globalThis.$fetch = fetch
```

### TestFixtures

**Purpose**: Factory functions for generating test data

**Entities**:
- University (with translations)
- FAQ (with category and translations)
- Review (with translations)
- Application (LeadData)
- User session data

**Interface**:
```typescript
interface UniversityFixture {
  id: number
  slug: string
  title: string
  translations: UniversityTranslation[]
  // ... other fields
}

function createUniversity(overrides?: Partial<UniversityFixture>): UniversityFixture
function createFAQ(overrides?: Partial<FAQFixture>): FAQFixture
function createApplication(overrides?: Partial<LeadData>): LeadData
function createReview(overrides?: Partial<ReviewFixture>): ReviewFixture
```

**Usage**:
```typescript
const university = createUniversity({ 
  title: 'Custom University',
  tuitionMin: 5000 
})
```

## Dependencies Between Modules

```
test-utils/index.ts (main entry)
  ├── mocks/prisma.ts → createMockPrisma()
  ├── mocks/redis.ts → createMockQueue(), createMockRedis()
  ├── mocks/nuxt.ts → mockUseI18n(), mockFetch(), mockNuxtApp()
  ├── mocks/fetch.ts → mockFetch() implementation
  └── fixtures/index.ts → entity factories
```

## Migration from Current Approach

### Before (inline mocks)
```typescript
// Each test file creates its own mocks
const prisma = {
  university: {
    findMany: vi.fn().mockResolvedValue([...]),
  },
} as unknown as PrismaClient
```

### After (test-utils)
```typescript
import { createMockPrisma } from '~~/tests/test-utils'

const prisma = createMockPrisma({
  university: {
    findMany: vi.fn().mockResolvedValue([...]),
  },
})
```

## Validation Rules

**MockPrismaClient**:
- Must match actual PrismaClient interface
- All mocked methods return Promises
- Support for $transaction with array of operations

**MockRedisQueue**:
- Jobs persist in memory within test
- Exponential backoff simulation (1s, 5s, 25s)
- DLQ after 3 failed attempts
- Clear() resets all state

**MockComposables**:
- useI18n locale is reactive (Ref)
- $fetch returns mocked responses by URL pattern
- Translations resolve with fallback logic (locale → en)

**TestFixtures**:
- All timestamps use consistent base date
- IDs are sequential integers
- Translations include all supported locales by default
- All required fields have sensible defaults
