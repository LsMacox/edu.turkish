# Repository Contracts - Service Cards Migration

**Feature**: Migrate Service Cards to Database with Translations and Dynamic Currency  
**Version**: 1.0  
**Date**: 2025-01-14

## Overview

This document defines the contracts for repository classes that handle data access for services and exchange rates.

---

## ServiceRepository

**Purpose**: Data access layer for service categories and sub-services

**Location**: `server/repositories/ServiceRepository.ts`

### Methods

#### findAllCategories

**Signature**:

```typescript
async findAllCategories(locale: SupportedLocale): Promise<ServiceCategoryListItem[]>
```

**Purpose**: Get all active service categories with translations

**Parameters**:

- `locale`: Language code (en, ru, kk, tr)

**Returns**:

```typescript
interface ServiceCategoryListItem {
  id: number
  slug: string
  title: string
  subtitle: string | null
  localizedSlug: string
  order: number
}
```

**Behavior**:

- Returns only active categories (`isActive = true`)
- Orders by `order` field ascending
- Falls back to English if translation missing
- Throws error if database query fails

**Example**:

```typescript
const repository = new ServiceRepository(prisma)
const categories = await repository.findAllCategories('ru')
// Returns: [{ id: 1, slug: 'document-translations', title: 'Перевод документов', ... }]
```

---

#### findCategoryBySlug

**Signature**:

```typescript
async findCategoryBySlug(
  slug: string,
  locale: SupportedLocale
): Promise<ServiceCategoryDetail | null>
```

**Purpose**: Get category details with sub-services by slug

**Parameters**:

- `slug`: Category slug (e.g., "turkish-english-course")
- `locale`: Language code (en, ru, kk, tr)

**Returns**:

```typescript
interface ServiceCategoryDetail {
  id: number
  slug: string
  title: string
  subtitle: string | null
  localizedSlug: string
  metadata: Record<string, unknown> | null
  subServices: SubServiceDetail[]
}

interface SubServiceDetail {
  id: number
  slug: string
  name: string
  description: string
  priceUsd: number
  deliveryTimeDays: number | null
  order: number
}
```

**Behavior**:

- Returns `null` if category not found or inactive
- Includes only active sub-services
- Orders sub-services by `order` field
- Falls back to English if translation missing
- Eager loads translations to avoid N+1 queries

**Example**:

```typescript
const category = await repository.findCategoryBySlug('turkish-english-course', 'ru')
if (!category) {
  throw new Error('Category not found')
}
// Returns: { id: 5, slug: 'turkish-english-course', subServices: [...], ... }
```

---

#### createSubService (Future - Admin Only)

**Signature**:

```typescript
async createSubService(input: CreateSubServiceInput): Promise<SubService>
```

**Purpose**: Create a new sub-service with translations

**Parameters**:

```typescript
interface CreateSubServiceInput {
  serviceCategoryId: number
  slug: string
  priceUsd: number
  deliveryTimeDays?: number
  order?: number
  translations: {
    locale: SupportedLocale
    name: string
    description: string
  }[]
}
```

**Returns**: Created `SubService` entity

**Behavior**:

- Validates slug uniqueness within category
- Validates all 4 locales have translations
- Validates priceUsd >= 0
- Throws error if validation fails
- Creates sub-service and translations in transaction

**Example**:

```typescript
const subService = await repository.createSubService({
  serviceCategoryId: 5,
  slug: 'language-turkish-advanced',
  priceUsd: 500.0,
  order: 3,
  translations: [
    { locale: 'en', name: 'Advanced Turkish', description: '...' },
    { locale: 'ru', name: 'Турецкий продвинутый', description: '...' },
    { locale: 'kk', name: 'Жоғары түрік', description: '...' },
    { locale: 'tr', name: 'İleri Türkçe', description: '...' },
  ],
})
```

---

#### updateSubService (Future - Admin Only)

**Signature**:

```typescript
async updateSubService(
  id: number,
  input: UpdateSubServiceInput
): Promise<SubService>
```

**Purpose**: Update sub-service details

**Parameters**:

```typescript
interface UpdateSubServiceInput {
  priceUsd?: number
  deliveryTimeDays?: number
  order?: number
  isActive?: boolean
}
```

**Returns**: Updated `SubService` entity

**Behavior**:

- Validates priceUsd >= 0 if provided
- Throws error if sub-service not found
- Only updates provided fields

---

## ExchangeRateRepository

**Purpose**: Data access layer for exchange rate caching

**Location**: `server/repositories/ExchangeRateRepository.ts`

### Methods

#### getCurrentRates

**Signature**:

```typescript
async getCurrentRates(): Promise<Record<Currency, number>>
```

**Purpose**: Get current exchange rates for all currencies

**Returns**:

```typescript
{
  KZT: number,
  TRY: number,
  RUB: number,
  USD: number
}
```

**Behavior**:

- Returns cached rates if not expired
- Returns fallback rates if no valid cache
- USD rate is always 1.0
- Throws error if database query fails

**Example**:

```typescript
const repository = new ExchangeRateRepository(prisma)
const rates = await repository.getCurrentRates()
// Returns: { KZT: 450.25, TRY: 32.15, RUB: 90.50, USD: 1.0 }
```

---

#### updateRates

**Signature**:

```typescript
async updateRates(rates: Record<Currency, number>): Promise<void>
```

**Purpose**: Update exchange rates in cache

**Parameters**:

- `rates`: Object with rates for all currencies

**Behavior**:

- Upserts rates for each currency
- Sets `fetchedAt` to current time
- Sets `expiresAt` to current time + 1 hour
- Uses transaction for atomicity
- Validates rates > 0

**Example**:

```typescript
await repository.updateRates({
  KZT: 450.25,
  TRY: 32.15,
  RUB: 90.5,
  USD: 1.0,
})
```

---

#### getRateDetails

**Signature**:

```typescript
async getRateDetails(): Promise<ExchangeRateDetails>
```

**Purpose**: Get exchange rates with metadata

**Returns**:

```typescript
interface ExchangeRateDetails {
  rates: Record<Currency, number>
  fetchedAt: Date
  expiresAt: Date
  isExpired: boolean
}
```

**Behavior**:

- Returns rates with timestamps
- Calculates `isExpired` based on current time
- Returns fallback if no cache exists

**Example**:

```typescript
const details = await repository.getRateDetails()
if (details.isExpired) {
  // Trigger rate refresh
}
```

---

#### cleanupExpiredRates (Background Job)

**Signature**:

```typescript
async cleanupExpiredRates(): Promise<number>
```

**Purpose**: Delete expired exchange rates from database

**Returns**: Number of deleted records

**Behavior**:

- Deletes rates where `expiresAt < now()`
- Runs as scheduled job (daily)
- Keeps last 7 days of history for debugging

**Example**:

```typescript
const deleted = await repository.cleanupExpiredRates()
console.log(`Cleaned up ${deleted} expired rates`)
```

---

## Error Handling

### Repository Errors

**NotFoundError**:

```typescript
class NotFoundError extends Error {
  constructor(entity: string, identifier: string) {
    super(`${entity} not found: ${identifier}`)
    this.name = 'NotFoundError'
  }
}
```

**ValidationError**:

```typescript
class ValidationError extends Error {
  constructor(message: string, details?: unknown) {
    super(message)
    this.name = 'ValidationError'
    this.details = details
  }
}
```

**Usage**:

```typescript
const category = await repository.findCategoryBySlug('invalid-slug', 'en')
if (!category) {
  throw new NotFoundError('ServiceCategory', 'invalid-slug')
}
```

---

## Testing Contracts

### ServiceRepository Tests

**Location**: `tests/repositories/ServiceRepository.test.ts`

```typescript
describe('ServiceRepository', () => {
  describe('findAllCategories', () => {
    it('returns all active categories ordered by order field', async () => {
      const categories = await repository.findAllCategories('en')
      expect(categories).toHaveLength(5)
      expect(categories[0].order).toBeLessThanOrEqual(categories[1].order)
    })

    it('returns translations for specified locale', async () => {
      const categories = await repository.findAllCategories('ru')
      expect(categories[0].title).toContain('Перевод')
    })

    it('falls back to English when translation missing', async () => {
      // Create category with only English translation
      const categories = await repository.findAllCategories('kk')
      expect(categories[0].title).toBeTruthy()
    })
  })

  describe('findCategoryBySlug', () => {
    it('returns category with sub-services', async () => {
      const category = await repository.findCategoryBySlug('turkish-english-course', 'ru')
      expect(category).toBeTruthy()
      expect(category!.subServices).toBeInstanceOf(Array)
      expect(category!.subServices.length).toBeGreaterThan(0)
    })

    it('returns null for non-existent category', async () => {
      const category = await repository.findCategoryBySlug('invalid-slug', 'en')
      expect(category).toBeNull()
    })

    it('orders sub-services by order field', async () => {
      const category = await repository.findCategoryBySlug('sat-courses', 'en')
      const orders = category!.subServices.map((s) => s.order)
      expect(orders).toEqual([...orders].sort((a, b) => a - b))
    })

    it('includes only active sub-services', async () => {
      // Deactivate a sub-service
      const category = await repository.findCategoryBySlug('tr-yos-courses', 'en')
      const allActive = category!.subServices.every((s) => s.isActive !== false)
      expect(allActive).toBe(true)
    })
  })
})
```

### ExchangeRateRepository Tests

**Location**: `tests/repositories/ExchangeRateRepository.test.ts`

```typescript
describe('ExchangeRateRepository', () => {
  describe('getCurrentRates', () => {
    it('returns rates for all currencies', async () => {
      const rates = await repository.getCurrentRates()
      expect(rates).toHaveProperty('KZT')
      expect(rates).toHaveProperty('TRY')
      expect(rates).toHaveProperty('RUB')
      expect(rates).toHaveProperty('USD')
      expect(rates.USD).toBe(1.0)
    })

    it('returns cached rates when not expired', async () => {
      await repository.updateRates({ KZT: 450, TRY: 32, RUB: 90, USD: 1 })
      const rates = await repository.getCurrentRates()
      expect(rates.KZT).toBe(450)
    })

    it('returns fallback rates when cache expired', async () => {
      // Clear cache
      const rates = await repository.getCurrentRates()
      expect(rates.KZT).toBeGreaterThan(0)
    })
  })

  describe('updateRates', () => {
    it('upserts rates for all currencies', async () => {
      await repository.updateRates({ KZT: 451, TRY: 33, RUB: 91, USD: 1 })
      const rates = await repository.getCurrentRates()
      expect(rates.KZT).toBe(451)
    })

    it('sets expiration to 1 hour from now', async () => {
      await repository.updateRates({ KZT: 450, TRY: 32, RUB: 90, USD: 1 })
      const details = await repository.getRateDetails()
      const expectedExpiry = new Date(Date.now() + 3600000)
      expect(details.expiresAt.getTime()).toBeCloseTo(expectedExpiry.getTime(), -3)
    })
  })

  describe('cleanupExpiredRates', () => {
    it('deletes expired rates', async () => {
      // Create expired rate
      const deleted = await repository.cleanupExpiredRates()
      expect(deleted).toBeGreaterThanOrEqual(0)
    })
  })
})
```

---

## Performance Contracts

### Query Performance

**ServiceRepository.findAllCategories**:

- Max execution time: 50ms
- Max database queries: 1 (with eager loading)
- Expected result size: 5 categories

**ServiceRepository.findCategoryBySlug**:

- Max execution time: 100ms
- Max database queries: 1 (with eager loading)
- Expected result size: 1 category + 3-5 sub-services

**ExchangeRateRepository.getCurrentRates**:

- Max execution time: 20ms (cached)
- Max database queries: 1
- Expected result size: 4 rates

### Optimization Strategies

**Eager Loading**:

```typescript
// Good: Single query with includes
const category = await prisma.serviceCategory.findUnique({
  where: { slug },
  include: {
    translations: { where: { locale } },
    subServices: {
      where: { isActive: true },
      include: { translations: { where: { locale } } },
      orderBy: { order: 'asc' },
    },
  },
})

// Bad: N+1 queries
const category = await prisma.serviceCategory.findUnique({ where: { slug } })
const translations = await prisma.serviceCategoryTranslation.findMany({
  where: { serviceCategoryId: category.id },
})
const subServices = await prisma.subService.findMany({ where: { serviceCategoryId: category.id } })
```

**Indexing**:

- All foreign keys indexed
- Unique constraints on slugs
- Composite indexes on frequently queried combinations

---

## Data Integrity Contracts

### Constraints

**ServiceCategory**:

- `slug` must be unique
- `order` must be >= 0
- `isActive` must be boolean

**SubService**:

- `slug` must be unique within category
- `priceUsd` must be >= 0
- `deliveryTimeDays` must be >= 1 (if not null)
- Must have translations for all 4 locales

**ExchangeRate**:

- `rate` must be > 0
- `expiresAt` must be > `fetchedAt`
- `baseCurrency` must be 'USD'
- `targetCurrency` must be one of: KZT, TRY, RUB, USD

### Validation

**Application-Level** (in repositories):

```typescript
if (priceUsd < 0) {
  throw new ValidationError('Price must be non-negative')
}

if (deliveryTimeDays !== null && deliveryTimeDays < 1) {
  throw new ValidationError('Delivery time must be at least 1 day')
}

if (!['en', 'ru', 'kk', 'tr'].includes(locale)) {
  throw new ValidationError('Invalid locale')
}
```

**Database-Level** (in Prisma schema):

```prisma
model SubService {
  priceUsd Decimal @db.Decimal(10, 2)
  // Application validates >= 0
}
```

---

## Transaction Handling

### Create Sub-Service with Translations

```typescript
async createSubService(input: CreateSubServiceInput): Promise<SubService> {
  return await this.prisma.$transaction(async (tx) => {
    // Create sub-service
    const subService = await tx.subService.create({
      data: {
        serviceCategoryId: input.serviceCategoryId,
        slug: input.slug,
        priceUsd: input.priceUsd,
        deliveryTimeDays: input.deliveryTimeDays,
        order: input.order ?? 0,
      },
    })

    // Create translations
    await tx.subServiceTranslation.createMany({
      data: input.translations.map(t => ({
        subServiceId: subService.id,
        locale: t.locale,
        name: t.name,
        description: t.description,
      })),
    })

    return subService
  })
}
```

### Update Exchange Rates

```typescript
async updateRates(rates: Record<Currency, number>): Promise<void> {
  await this.prisma.$transaction(async (tx) => {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 3600000) // +1 hour

    for (const [currency, rate] of Object.entries(rates)) {
      await tx.exchangeRate.upsert({
        where: {
          baseCurrency_targetCurrency: {
            baseCurrency: 'USD',
            targetCurrency: currency as Currency,
          },
        },
        update: { rate, fetchedAt: now, expiresAt },
        create: {
          baseCurrency: 'USD',
          targetCurrency: currency as Currency,
          rate,
          fetchedAt: now,
          expiresAt,
        },
      })
    }
  })
}
```

---

## Fallback Strategies

### Translation Fallback

```typescript
async findCategoryBySlug(slug: string, locale: SupportedLocale) {
  const category = await this.prisma.serviceCategory.findUnique({
    where: { slug },
    include: {
      translations: {
        where: {
          OR: [
            { locale },
            { locale: 'en' }, // Fallback
          ],
        },
      },
      // ... sub-services
    },
  })

  if (!category) return null

  // Use requested locale if available, otherwise English
  const translation = category.translations.find(t => t.locale === locale)
    || category.translations.find(t => t.locale === 'en')

  return {
    ...category,
    title: translation?.title || 'Untitled',
    subtitle: translation?.subtitle || null,
    // ...
  }
}
```

### Exchange Rate Fallback

```typescript
const FALLBACK_RATES: Record<Currency, number> = {
  KZT: 450.0,
  TRY: 32.0,
  RUB: 90.0,
  USD: 1.0,
}

async getCurrentRates(): Promise<Record<Currency, number>> {
  const rates = await this.prisma.exchangeRate.findMany({
    where: {
      baseCurrency: 'USD',
      expiresAt: { gte: new Date() },
    },
  })

  if (rates.length === 0) {
    return FALLBACK_RATES
  }

  return rates.reduce((acc, rate) => {
    acc[rate.targetCurrency as Currency] = rate.rate.toNumber()
    return acc
  }, {} as Record<Currency, number>)
}
```

---

## Changelog

**v1.0 (2025-01-14)**:

- Initial repository contracts
- ServiceRepository with findAllCategories, findCategoryBySlug
- ExchangeRateRepository with getCurrentRates, updateRates
- Error handling and validation contracts
- Testing and performance contracts
