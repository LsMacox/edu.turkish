# Test-Utils API Contract

**Module**: `tests/test-utils`  
**Purpose**: Programmatic API for test mocking utilities

## Exports

### Mock Factories

```typescript
// Prisma mock factory
function createMockPrisma(overrides?: Partial<PrismaClient>): PrismaClient

// Redis/Queue mock factories
function createMockQueue(): MockQueue
function createMockRedis(): MockRedis

// Nuxt composable mocks
function mockUseI18n(locale: string, messages: Record<string, any>): MockI18n
function mockFetch(routes: Record<string, any>): MockFetch
function mockNuxtApp(config?: Partial<MockNuxtApp>): MockNuxtApp

// Test data fixtures
function createUniversity(overrides?: Partial<University>): University
function createFAQ(overrides?: Partial<FAQ>): FAQ
function createApplication(overrides?: Partial<LeadData>): LeadData
function createReview(overrides?: Partial<Review>): Review
```

## Interface Contracts

### MockPrismaClient

```typescript
interface PrismaModel {
  findMany: Mock<any, any>
  findUnique: Mock<any, any>
  findFirst: Mock<any, any>
  create: Mock<any, any>
  update: Mock<any, any>
  delete: Mock<any, any>
  count: Mock<any, any>
}

interface MockPrismaClient {
  [model: string]: PrismaModel
  $transaction: Mock<any, any>
  $connect: Mock<any, any>
  $disconnect: Mock<any, any>
}
```

### MockQueue

```typescript
interface MockQueue {
  addJob(operation: string, provider: string, data: any): Promise<Job>
  getJob(jobId: string): Promise<Job | null>
  getQueueLength(): Promise<number>
  getDeadLetterQueue(): Promise<Job[]>
  clear(): Promise<void>
}

interface Job {
  id: string
  operation: string
  provider: string
  data: any
  status: 'pending' | 'processing' | 'completed' | 'failed'
  attempts: number
  nextRetryAt?: Date
  error?: string
}
```

### MockI18n

```typescript
interface MockI18n {
  locale: Ref<string>
  t: (key: string, params?: Record<string, unknown>) => string
}
```

## Usage Examples

### Repository Test with Mock Prisma

```typescript
import { createMockPrisma } from '~~/tests/test-utils'

const prisma = createMockPrisma({
  university: {
    findMany: vi.fn().mockResolvedValue([testUniversity])
  }
})

const repository = new UniversityRepository(prisma)
const result = await repository.findAll()
expect(prisma.university.findMany).toHaveBeenCalled()
```

### Component Test with Mock Composables

```typescript
import { mockUseI18n, mockFetch } from '~~/tests/test-utils'

const i18n = mockUseI18n('en', enMessages)
globalThis.useI18n = () => i18n

const wrapper = mount(MyComponent)
expect(wrapper.text()).toContain(enMessages.key)
```

### Integration Test with Mock Queue

```typescript
import { createMockQueue } from '~~/tests/test-utils'

const queue = createMockQueue()
const job = await queue.addJob('createLead', 'espocrm', leadData)
expect(job.status).toBe('pending')
```

## Behavioral Contracts

### createMockPrisma

- Returns object matching PrismaClient interface
- All methods are vi.fn() mocks
- Overrides merge with default structure
- $transaction accepts array of promises

### createMockQueue

- In-memory job storage
- Sequential job IDs (job-1, job-2, ...)
- clear() resets all state
- Jobs persist within test scope

### mockUseI18n

- locale is reactive Ref
- t() function resolves keys by path (dot notation)
- Returns key if translation missing
- Supports {param} interpolation

### Test Fixtures

- All dates use `new Date('2024-01-01')`
- Sequential IDs starting from 1
- All required fields have defaults
- Overrides merge with defaults (deep)
