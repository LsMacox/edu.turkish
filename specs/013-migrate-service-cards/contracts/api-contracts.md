# API Contracts - Service Cards Migration

**Feature**: Migrate Service Cards to Database with Translations and Dynamic Currency  
**Version**: 1.0  
**Date**: 2025-01-14

## Overview

This document defines the API contracts for service data and exchange rate endpoints.

---

## GET /api/v1/services/categories

**Purpose**: Get all active service categories with translations

**Authentication**: None (public endpoint)

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `locale` | string | No | 'en' | Language code (en, ru, kk, tr) |

**Request Example**:
```http
GET /api/v1/services/categories?locale=ru
```

**Response Success (200)**:
```typescript
{
  "categories": [
    {
      "id": 1,
      "slug": "document-translations",
      "title": "Перевод документов",
      "subtitle": "Профессиональный заверенный перевод официальных документов",
      "localizedSlug": "perevod-dokumentov",
      "order": 1
    },
    {
      "id": 2,
      "slug": "turkish-english-course",
      "title": "Курсы турецкого и английского",
      "subtitle": "Языковые курсы для студентов и профессионалов",
      "localizedSlug": "kursy-turetskogo-i-anglijskogo",
      "order": 5
    }
  ]
}
```

**Response Error (400)**:
```typescript
{
  "error": "Invalid locale",
  "message": "Locale must be one of: en, ru, kk, tr"
}
```

**Response Error (500)**:
```typescript
{
  "error": "Internal server error",
  "message": "Failed to fetch categories"
}
```

**Contract Tests**:
- [ ] Returns array of categories
- [ ] Each category has required fields (id, slug, title, localizedSlug)
- [ ] Subtitle can be null
- [ ] Categories ordered by `order` field
- [ ] Invalid locale returns 400
- [ ] Missing locale defaults to 'en'
- [ ] Response time < 100ms

---

## GET /api/v1/services/:slug

**Purpose**: Get service category details with sub-services

**Authentication**: None (public endpoint)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | Category slug (e.g., "turkish-english-course") |

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `locale` | string | No | 'en' | Language code (en, ru, kk, tr) |

**Request Example**:
```http
GET /api/v1/services/turkish-english-course?locale=ru
```

**Response Success (200)**:
```typescript
{
  "category": {
    "id": 5,
    "slug": "turkish-english-course",
    "title": "Курсы турецкого и английского",
    "subtitle": "Языковые курсы для студентов и профессионалов",
    "localizedSlug": "kursy-turetskogo-i-anglijskogo",
    "metadata": {
      "levelProgression": {
        "title": "Ваш прогресс по уровням",
        "levels": [
          {
            "from": "A1",
            "to": "A2",
            "outcome": "Базовые разговоры, повседневные задачи, простые тексты"
          }
        ]
      },
      "formatSchedule": {
        "title": "Формат обучения",
        "groupSize": "До 8 студентов в группе",
        "individual": "Доступны индивидуальные занятия"
      }
    },
    "subServices": [
      {
        "id": 15,
        "slug": "language-turkish-beginner",
        "name": "Турецкий для начинающих",
        "description": "Начните изучать турецкий с нуля с носителями языка",
        "priceUsd": 350.00,
        "deliveryTimeDays": null,
        "order": 1
      },
      {
        "id": 16,
        "slug": "language-turkish-intermediate",
        "name": "Турецкий средний уровень",
        "description": "Улучшите свои навыки турецкого до разговорного уровня",
        "priceUsd": 400.00,
        "deliveryTimeDays": null,
        "order": 2
      }
    ]
  }
}
```

**Response Error (404)**:
```typescript
{
  "error": "Category not found",
  "message": "Service category 'invalid-slug' does not exist"
}
```

**Response Error (400)**:
```typescript
{
  "error": "Invalid locale",
  "message": "Locale must be one of: en, ru, kk, tr"
}
```

**Contract Tests**:
- [ ] Returns category with all required fields
- [ ] Metadata is valid JSON object (can be null)
- [ ] SubServices array is present (can be empty)
- [ ] Each sub-service has required fields (id, slug, name, description, priceUsd)
- [ ] deliveryTimeDays can be null
- [ ] Sub-services ordered by `order` field
- [ ] Only active sub-services returned
- [ ] Invalid slug returns 404
- [ ] Invalid locale returns 400
- [ ] Missing translation falls back to English
- [ ] Response time < 100ms

---

## GET /api/v1/exchange-rates

**Purpose**: Get current exchange rates for all supported currencies

**Authentication**: None (public endpoint)

**Query Parameters**: None

**Request Example**:
```http
GET /api/v1/exchange-rates
```

**Response Success (200)**:
```typescript
{
  "rates": {
    "KZT": 450.25,
    "TRY": 32.15,
    "RUB": 90.50,
    "USD": 1.00
  },
  "baseCurrency": "USD",
  "fetchedAt": "2025-01-14T10:30:00.000Z",
  "expiresAt": "2025-01-14T11:30:00.000Z"
}
```

**Response Error (500)**:
```typescript
{
  "error": "Failed to fetch exchange rates",
  "message": "External API unavailable, using fallback rates",
  "rates": {
    "KZT": 450.00,
    "TRY": 32.00,
    "RUB": 90.00,
    "USD": 1.00
  },
  "baseCurrency": "USD",
  "fetchedAt": "2025-01-14T10:00:00.000Z",
  "expiresAt": "2025-01-14T11:00:00.000Z",
  "isFallback": true
}
```

**Contract Tests**:
- [ ] Returns rates for all 4 currencies (KZT, TRY, RUB, USD)
- [ ] USD rate is always 1.00
- [ ] All rates are positive numbers
- [ ] fetchedAt is valid ISO 8601 timestamp
- [ ] expiresAt is fetchedAt + 1 hour
- [ ] baseCurrency is always "USD"
- [ ] Fallback rates used when API fails
- [ ] isFallback flag present when using fallback
- [ ] Response time < 200ms (including external API call)
- [ ] Cached response time < 50ms

---

## POST /api/v1/services/:categorySlug/sub-services (Admin Only - Future)

**Purpose**: Create a new sub-service within a category

**Authentication**: Required (admin role)

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `categorySlug` | string | Yes | Category slug |

**Request Body**:
```typescript
{
  "slug": "language-turkish-advanced",
  "priceUsd": 500.00,
  "deliveryTimeDays": null,
  "order": 3,
  "translations": [
    {
      "locale": "en",
      "name": "Advanced Turkish",
      "description": "Master Turkish at an advanced level"
    },
    {
      "locale": "ru",
      "name": "Турецкий продвинутый уровень",
      "description": "Освойте турецкий на продвинутом уровне"
    },
    {
      "locale": "kk",
      "name": "Жоғары деңгейдегі түрік тілі",
      "description": "Түрік тілін жоғары деңгейде меңгеріңіз"
    },
    {
      "locale": "tr",
      "name": "İleri Seviye Türkçe",
      "description": "Türkçeyi ileri seviyede öğrenin"
    }
  ]
}
```

**Response Success (201)**:
```typescript
{
  "subService": {
    "id": 21,
    "slug": "language-turkish-advanced",
    "priceUsd": 500.00,
    "deliveryTimeDays": null,
    "order": 3,
    "isActive": true,
    "createdAt": "2025-01-14T10:30:00.000Z"
  }
}
```

**Response Error (400)**:
```typescript
{
  "error": "Validation error",
  "message": "Slug already exists in this category"
}
```

**Response Error (401)**:
```typescript
{
  "error": "Unauthorized",
  "message": "Admin authentication required"
}
```

**Note**: This endpoint is out of scope for MVP but included for completeness.

---

## Type Definitions

```typescript
// Shared types across all endpoints
export type Currency = 'KZT' | 'TRY' | 'RUB' | 'USD'
export type SupportedLocale = 'en' | 'ru' | 'kk' | 'tr'

export interface ServiceCategoryListItem {
  id: number
  slug: string
  title: string
  subtitle: string | null
  localizedSlug: string
  order: number
}

export interface ServiceCategoryDetail {
  id: number
  slug: string
  title: string
  subtitle: string | null
  localizedSlug: string
  metadata: Record<string, unknown> | null
  subServices: SubServiceDetail[]
}

export interface SubServiceDetail {
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
  baseCurrency: 'USD'
  fetchedAt: string // ISO 8601
  expiresAt: string // ISO 8601
  isFallback?: boolean
}

export interface ApiError {
  error: string
  message: string
}
```

---

## Versioning Strategy

**Current Version**: v1

**Breaking Changes** (require new version):
- Removing fields from responses
- Changing field types
- Changing endpoint paths
- Changing authentication requirements

**Non-Breaking Changes** (same version):
- Adding new optional fields
- Adding new endpoints
- Adding new query parameters (with defaults)
- Improving error messages

**Deprecation Process**:
1. Announce deprecation 3 months in advance
2. Add deprecation warnings to responses
3. Maintain old version for 6 months
4. Remove old version after migration period

---

## Rate Limiting

**Current Limits**: None (internal API)

**Future Considerations**:
- Public API: 100 requests/minute per IP
- Exchange rates: Cached for 1 hour (reduces external API calls)
- Service data: No limit (infrequent changes)

---

## Caching Headers

**Service Endpoints**:
```http
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
```

**Exchange Rate Endpoint**:
```http
Cache-Control: public, max-age=3600, must-revalidate
```

**Rationale**:
- Services change infrequently (1 hour cache acceptable)
- Exchange rates expire after 1 hour (must revalidate)
- Stale-while-revalidate allows graceful degradation

---

## Error Handling

**Standard Error Response**:
```typescript
{
  "error": string,      // Machine-readable error code
  "message": string,    // Human-readable error message
  "details"?: unknown   // Optional additional context
}
```

**HTTP Status Codes**:
- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid auth)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (unexpected error)
- `503` - Service Unavailable (external API down)

---

## Security Considerations

**Public Endpoints**:
- No authentication required
- Rate limiting recommended for production
- Input validation via Zod schemas
- SQL injection prevented by Prisma

**Admin Endpoints** (future):
- JWT authentication required
- Role-based access control
- Audit logging for mutations
- CSRF protection

---

## Testing Strategy

**Contract Tests** (`tests/contract/services-api.contract.test.ts`):
```typescript
describe('GET /api/v1/services/categories', () => {
  it('returns array of categories with correct shape', async () => {
    const response = await fetch('/api/v1/services/categories?locale=ru')
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.categories).toBeInstanceOf(Array)
    expect(data.categories[0]).toMatchObject({
      id: expect.any(Number),
      slug: expect.any(String),
      title: expect.any(String),
      localizedSlug: expect.any(String),
      order: expect.any(Number),
    })
  })
  
  it('returns 400 for invalid locale', async () => {
    const response = await fetch('/api/v1/services/categories?locale=invalid')
    expect(response.status).toBe(400)
  })
})

describe('GET /api/v1/services/:slug', () => {
  it('returns category with sub-services', async () => {
    const response = await fetch('/api/v1/services/turkish-english-course?locale=ru')
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.category.subServices).toBeInstanceOf(Array)
    expect(data.category.subServices[0].priceUsd).toBeGreaterThan(0)
  })
  
  it('returns 404 for non-existent category', async () => {
    const response = await fetch('/api/v1/services/invalid-slug')
    expect(response.status).toBe(404)
  })
})

describe('GET /api/v1/exchange-rates', () => {
  it('returns rates for all currencies', async () => {
    const response = await fetch('/api/v1/exchange-rates')
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.rates).toHaveProperty('KZT')
    expect(data.rates).toHaveProperty('TRY')
    expect(data.rates).toHaveProperty('RUB')
    expect(data.rates).toHaveProperty('USD')
    expect(data.rates.USD).toBe(1.0)
  })
  
  it('uses fallback rates when API fails', async () => {
    // Mock external API failure
    const response = await fetch('/api/v1/exchange-rates')
    const data = await response.json()
    
    if (data.isFallback) {
      expect(data.rates.KZT).toBeGreaterThan(0)
      expect(data.rates.TRY).toBeGreaterThan(0)
      expect(data.rates.RUB).toBeGreaterThan(0)
    }
  })
})
```

---

## Migration Compatibility

**During Migration**:
- Old i18n-based pages continue to work
- New API endpoints available but unused
- No breaking changes to existing functionality

**After Migration**:
- Service pages use API endpoints
- i18n files cleaned up (only common UI strings remain)
- Old code paths removed

**Rollback Strategy**:
- Keep i18n files until verification complete
- Feature flag to switch between old/new implementation
- Database migration can be rolled back via Prisma

---

## Performance Benchmarks

**Target Response Times**:
- GET /api/v1/services/categories: < 100ms
- GET /api/v1/services/:slug: < 100ms
- GET /api/v1/exchange-rates (cached): < 50ms
- GET /api/v1/exchange-rates (fresh): < 200ms

**Load Testing**:
- 100 concurrent requests: < 500ms p95
- 1000 requests/minute: < 1s p95
- Database connection pool: 10 connections

**Monitoring**:
- Log slow queries (> 100ms)
- Alert on error rate > 1%
- Track external API failures

---

## Documentation

**OpenAPI Spec**: Generate from Zod schemas (future)  
**Postman Collection**: Available in `/docs/api/` (future)  
**Integration Guide**: See `quickstart.md`

---

## Changelog

**v1.0 (2025-01-14)**:
- Initial API design
- GET /api/v1/services/categories
- GET /api/v1/services/:slug
- GET /api/v1/exchange-rates
