# Phase 1: Data Model - Service Cards Migration

**Feature**: Migrate Service Cards to Database with Translations and Dynamic Currency  
**Date**: 2025-01-14  
**Status**: Complete

## Entity Relationship Diagram

```
┌─────────────────────┐
│  ServiceCategory    │
│─────────────────────│
│ id (PK)             │
│ slug (UK)           │
│ order               │
│ isActive            │
│ createdAt           │
│ updatedAt           │
└──────────┬──────────┘
           │ 1
           │
           │ N
┌──────────┴──────────────────────┐
│ ServiceCategoryTranslation      │
│─────────────────────────────────│
│ id (PK)                         │
│ serviceCategoryId (FK)          │
│ locale (UK with categoryId)     │
│ title                           │
│ subtitle                        │
│ slug                            │
│ metadata (JSON)                 │
└─────────────────────────────────┘

┌─────────────────────┐
│  ServiceCategory    │
└──────────┬──────────┘
           │ 1
           │
           │ N
┌──────────┴──────────┐
│    SubService       │
│─────────────────────│
│ id (PK)             │
│ serviceCategoryId   │
│ slug (UK with cat)  │
│ priceUsd            │
│ deliveryTimeDays    │
│ order               │
│ isActive            │
│ createdAt           │
│ updatedAt           │
└──────────┬──────────┘
           │ 1
           │
           │ N
┌──────────┴──────────────────┐
│  SubServiceTranslation      │
│─────────────────────────────│
│ id (PK)                     │
│ subServiceId (FK)           │
│ locale (UK with serviceId)  │
│ name                        │
│ description                 │
└─────────────────────────────┘

┌─────────────────────┐
│   ExchangeRate      │
│─────────────────────│
│ id (PK)             │
│ baseCurrency (UK)   │
│ targetCurrency (UK) │
│ rate                │
│ fetchedAt           │
│ expiresAt           │
└─────────────────────┘
```

## Entity Definitions

### ServiceCategory

**Purpose**: Represents a major service category page (e.g., "document-translations", "tr-yos-courses")

**Attributes**:
- `id`: Auto-increment primary key
- `slug`: URL-friendly identifier (e.g., "turkish-english-course"), unique
- `order`: Display order for category listing (default: 0)
- `isActive`: Soft delete flag (default: true)
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

**Relationships**:
- Has many `ServiceCategoryTranslation` (1:N, cascade delete)
- Has many `SubService` (1:N, cascade delete)

**Constraints**:
- `slug` must be unique
- `slug` must match existing page routes

**Indexes**:
- Primary key on `id`
- Unique index on `slug`
- Composite index on `(isActive, order)` for listing queries

**Business Rules**:
- Only 5 categories exist (fixed by page structure)
- Cannot delete category if it has active sub-services
- Slug changes require route updates

---

### ServiceCategoryTranslation

**Purpose**: Localized content for service category pages

**Attributes**:
- `id`: Auto-increment primary key
- `serviceCategoryId`: Foreign key to ServiceCategory
- `locale`: Language code (en, ru, kk, tr)
- `title`: Category title (max 255 chars)
- `subtitle`: Category subtitle (text, nullable)
- `slug`: Localized URL slug (max 255 chars)
- `metadata`: JSON field for page-specific content (FAQ, features, etc.)

**Relationships**:
- Belongs to `ServiceCategory` (N:1, cascade delete)

**Constraints**:
- Unique constraint on `(serviceCategoryId, locale)`
- `locale` must be one of: en, ru, kk, tr

**Indexes**:
- Primary key on `id`
- Unique index on `(serviceCategoryId, locale)`
- Index on `locale` for locale-based queries

**Business Rules**:
- All categories must have translations for all 4 locales
- Fallback to English if translation missing
- `metadata` JSON structure varies by category (flexible)

**Metadata JSON Examples**:

```typescript
// For document-translations
{
  "howItWorks": {
    "steps": [
      { "title": "...", "description": "...", "icon": "mdi:upload" }
    ]
  },
  "whyChooseUs": {
    "factors": [
      { "title": "...", "description": "...", "icon": "mdi:certificate" }
    ]
  },
  "trustIndicators": {
    "workingSince": "...",
    "documentsCount": "..."
  }
}

// For tr-yos-courses
{
  "courseGoal": {
    "description": "...",
    "packages": [
      { "name": "Старт", "targetScore": "50-60" }
    ]
  },
  "programContent": {
    "items": [
      { "title": "...", "description": "...", "icon": "mdi:book-open" }
    ]
  },
  "formatSchedule": {
    "format": "...",
    "duration": "...",
    "homework": "...",
    "support": "..."
  }
}
```

---

### SubService

**Purpose**: Individual service offering within a category

**Attributes**:
- `id`: Auto-increment primary key
- `serviceCategoryId`: Foreign key to ServiceCategory
- `slug`: URL-friendly identifier within category (e.g., "translation-diploma")
- `priceUsd`: Price in USD (Decimal 10,2)
- `deliveryTimeDays`: Estimated delivery time in days (nullable)
- `order`: Display order within category (default: 0)
- `isActive`: Soft delete flag (default: true)
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

**Relationships**:
- Belongs to `ServiceCategory` (N:1, cascade delete)
- Has many `SubServiceTranslation` (1:N, cascade delete)

**Constraints**:
- Unique constraint on `(serviceCategoryId, slug)`
- `priceUsd` must be >= 0

**Indexes**:
- Primary key on `id`
- Unique index on `(serviceCategoryId, slug)`
- Composite index on `(serviceCategoryId, isActive, order)` for category listing

**Business Rules**:
- Price stored only in USD (converted on client)
- `deliveryTimeDays` optional (not all services have delivery time)
- Slug must be unique within category (not globally)

---

### SubServiceTranslation

**Purpose**: Localized names and descriptions for sub-services

**Attributes**:
- `id`: Auto-increment primary key
- `subServiceId`: Foreign key to SubService
- `locale`: Language code (en, ru, kk, tr)
- `name`: Service name (max 255 chars)
- `description`: Service description (text)

**Relationships**:
- Belongs to `SubService` (N:1, cascade delete)

**Constraints**:
- Unique constraint on `(subServiceId, locale)`
- `locale` must be one of: en, ru, kk, tr

**Indexes**:
- Primary key on `id`
- Unique index on `(subServiceId, locale)`
- Index on `locale` for locale-based queries

**Business Rules**:
- All sub-services must have translations for all 4 locales
- Fallback to English if translation missing
- Name and description are plain text (no HTML)

---

### ExchangeRate

**Purpose**: Cache exchange rates from external API

**Attributes**:
- `id`: Auto-increment primary key
- `baseCurrency`: Base currency code (always "USD")
- `targetCurrency`: Target currency code (KZT, TRY, RUB, USD)
- `rate`: Exchange rate (Decimal 12,6 for precision)
- `fetchedAt`: Timestamp when rate was fetched
- `expiresAt`: Timestamp when rate expires (fetchedAt + 1 hour)

**Relationships**: None (standalone cache table)

**Constraints**:
- Unique constraint on `(baseCurrency, targetCurrency)`
- `rate` must be > 0

**Indexes**:
- Primary key on `id`
- Unique index on `(baseCurrency, targetCurrency)`
- Index on `expiresAt` for cleanup queries

**Business Rules**:
- Rates expire after 1 hour
- Fallback to hardcoded rates if API fails
- USD to USD rate is always 1.0
- Rates updated via background job or on-demand

---

## Data Types & Validation

### TypeScript Types

```typescript
// Domain types
export type Currency = 'KZT' | 'TRY' | 'RUB' | 'USD'
export type SupportedLocale = 'en' | 'ru' | 'kk' | 'tr'

// API response types
export interface ServiceCategoryResponse {
  id: number
  slug: string
  title: string
  subtitle: string | null
  localizedSlug: string
  metadata: Record<string, unknown> | null
  subServices: SubServiceResponse[]
}

export interface SubServiceResponse {
  id: number
  slug: string
  name: string
  description: string
  priceUsd: number
  deliveryTimeDays: number | null
  order: number
}

export interface ExchangeRatesResponse {
  rates: Record<Currency, number>
  fetchedAt: string
  expiresAt: string
}

// Repository input types
export interface CreateSubServiceInput {
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

export interface UpdateSubServiceInput {
  priceUsd?: number
  deliveryTimeDays?: number
  order?: number
  isActive?: boolean
}
```

### Validation Rules

**ServiceCategory.slug**:
- Pattern: `^[a-z0-9-]+$`
- Length: 3-100 characters
- Must match existing page route

**SubService.priceUsd**:
- Min: 0
- Max: 999999.99
- Precision: 2 decimal places

**SubService.deliveryTimeDays**:
- Min: 1
- Max: 365
- Nullable

**ExchangeRate.rate**:
- Min: 0.000001
- Max: 999999.999999
- Precision: 6 decimal places

**Locale**:
- Enum: ['en', 'ru', 'kk', 'tr']
- Case-sensitive

---

## Query Patterns

### Common Queries

**1. Get category with sub-services by slug and locale**:
```typescript
const category = await prisma.serviceCategory.findUnique({
  where: { slug: 'turkish-english-course' },
  include: {
    translations: {
      where: { locale: 'ru' },
    },
    subServices: {
      where: { isActive: true },
      include: {
        translations: {
          where: { locale: 'ru' },
        },
      },
      orderBy: { order: 'asc' },
    },
  },
})
```

**2. Get all active categories with translations**:
```typescript
const categories = await prisma.serviceCategory.findMany({
  where: { isActive: true },
  include: {
    translations: {
      where: { locale: 'en' },
    },
  },
  orderBy: { order: 'asc' },
})
```

**3. Get current exchange rates**:
```typescript
const rates = await prisma.exchangeRate.findMany({
  where: {
    baseCurrency: 'USD',
    expiresAt: { gte: new Date() },
  },
})
```

**4. Update exchange rates**:
```typescript
await prisma.exchangeRate.upsert({
  where: {
    baseCurrency_targetCurrency: {
      baseCurrency: 'USD',
      targetCurrency: 'KZT',
    },
  },
  update: {
    rate: 450.5,
    fetchedAt: new Date(),
    expiresAt: new Date(Date.now() + 3600000), // +1 hour
  },
  create: {
    baseCurrency: 'USD',
    targetCurrency: 'KZT',
    rate: 450.5,
    fetchedAt: new Date(),
    expiresAt: new Date(Date.now() + 3600000),
  },
})
```

---

## Migration Strategy

### Seed Data Mapping

**Source**: `/i18n/locales/ru/services.json`  
**Target**: Database tables

**Category Mapping**:
```typescript
const categoryMapping = {
  'document-translations': {
    slug: 'document-translations',
    order: 1,
  },
  'relocation-in-turkey': {
    slug: 'relocation-in-turkey',
    order: 2,
  },
  'tr-yos-courses': {
    slug: 'tr-yos-courses',
    order: 3,
  },
  'sat-courses': {
    slug: 'sat-courses',
    order: 4,
  },
  'turkish-english-course': {
    slug: 'turkish-english-course',
    order: 5,
  },
}
```

**Price Extraction**:
```typescript
// Extract USD price from i18n
const i18nPricing = {
  KZT: "180,000",
  TRY: "6,000",
  RUB: "35,000",
  USD: "350"
}

// Parse USD as base
const priceUsd = parseFloat(i18nPricing.USD.replace(/,/g, ''))
// Result: 350.00
```

**Metadata Extraction**:
```typescript
// Extract page-specific content
const metadata = {
  courseGoal: i18n['services'][category]['courseGoal'],
  programContent: i18n['services'][category]['programContent'],
  formatSchedule: i18n['services'][category]['formatSchedule'],
  // ... other category-specific fields
}
```

---

## Performance Optimization

### Database Indexes

**Critical Indexes**:
1. `service_categories(slug)` - Unique, used in every page load
2. `service_category_translations(serviceCategoryId, locale)` - Unique, used in every query
3. `sub_services(serviceCategoryId, isActive, order)` - Composite, used in listing
4. `sub_service_translations(subServiceId, locale)` - Unique, used in every query
5. `exchange_rates(baseCurrency, targetCurrency)` - Unique, used in rate lookups
6. `exchange_rates(expiresAt)` - Used in cleanup and validation

### Query Optimization

**Eager Loading**:
- Always include translations in category queries
- Use `include` instead of separate queries
- Limit sub-services to active only

**Caching Strategy**:
- Exchange rates: 1 hour TTL (client + server)
- Service data: No cache (infrequent changes, small dataset)
- Consider Redis for exchange rates in production

**Expected Performance**:
- Category query: <50ms (with 5 sub-services)
- Exchange rate query: <10ms (indexed lookup)
- Page load: <2s total (including SSR)

---

## Data Integrity

### Constraints

**Foreign Keys**:
- All translations cascade delete with parent
- Sub-services cascade delete with category

**Unique Constraints**:
- Category slug (global)
- Sub-service slug (per category)
- Translation (per entity + locale)
- Exchange rate (per currency pair)

**Check Constraints** (application-level):
- `priceUsd >= 0`
- `deliveryTimeDays >= 1` (if not null)
- `rate > 0`
- `locale IN ('en', 'ru', 'kk', 'tr')`

### Validation Flow

```
User Request
    ↓
API Endpoint (Zod validation)
    ↓
Repository (business logic)
    ↓
Prisma (type safety)
    ↓
Database (constraints)
```

---

## Rollback Plan

**If migration fails**:
1. Keep i18n files intact until verification complete
2. Feature flag to switch between i18n and database
3. Database rollback via Prisma migration
4. Revert code changes via Git

**Verification Checklist**:
- [ ] All 5 categories seeded
- [ ] All ~20 sub-services seeded
- [ ] All 4 locales have translations
- [ ] Prices match i18n USD values
- [ ] Exchange rates fetching correctly
- [ ] All service pages load without errors
- [ ] Currency conversion accurate
- [ ] No console errors or warnings

---

## Next Steps

1. Create Prisma migration for new tables
2. Implement repositories (ServiceRepository, ExchangeRateRepository)
3. Create API endpoints (/api/v1/services, /api/v1/exchange-rates)
4. Implement seeder script
5. Update components to use database data
6. Write comprehensive tests
7. Clean up i18n files

**Phase 2 Output**: Contracts and Quickstart Guide
