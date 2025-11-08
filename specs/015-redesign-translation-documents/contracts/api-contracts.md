# API Contracts

**Feature**: Redesign Translation Documents Service Page  
**Date**: 2025-01-08

## API Endpoint

### GET /api/v1/services/:slug

**Endpoint**: `/api/v1/services/document-translations`  
**Method**: `GET`  
**Authentication**: None (public)

### Request

**URL Parameters**:

- `slug`: `document-translations` (string)

**Query Parameters**:

- `locale`: Optional locale override (defaults to current i18n locale)

**Headers**:

- `Accept-Language`: Current locale from i18n

### Response

**Status Code**: `200 OK`

**Content-Type**: `application/json`

**Body**:

```typescript
interface ServiceCategoryDetailResponse {
  id: number
  slug: string
  title: string
  subtitle: string | null
  localizedSlug: string
  metadata: ServiceCategoryMetadata | null
  subServices: SubServiceDetail[]
  calculator?: {
    standardUsd: number
    expressUsd?: number
    rushUsd?: number
  }
  urgencyMultipliers?: {
    express: number
    rush: number
  }
}

interface ServiceCategoryMetadata {
  calculator?: {
    documentTypes: Array<{
      name: string
      priceUsd: number | null
    }>
    languagePairs: string[]
    urgency: Array<{
      name: string
      surcharge: number
    }>
  }
  serviceCards?: Array<{
    title: string
    description: string
    icon: string
  }>
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

### Example Response (Russian Locale)

```json
{
  "id": 1,
  "slug": "document-translations",
  "title": "Нотариально заверенные переводы документов в Турции",
  "subtitle": "Мы помогаем студентам и клиентам перевести все необходимые документы для поступления в университеты Турции и оформления вида на жительство.",
  "localizedSlug": "document-translations",
  "metadata": {
    "calculator": {
      "documentTypes": [
        { "name": "Загранпаспорт", "priceUsd": 20 },
        { "name": "Школьный аттестат", "priceUsd": 30 },
        { "name": "Диплом", "priceUsd": 45 },
        { "name": "Доверенность/Согласие", "priceUsd": 40 },
        { "name": "Финансовые справки", "priceUsd": 25 },
        { "name": "Остальное", "priceUsd": null }
      ],
      "languagePairs": ["Русский – Турецкий", "Турецкий – Русский"],
      "urgency": [
        { "name": "Стандарт (1-3 дня)", "surcharge": 0 },
        { "name": "Срочно (до 3 часов)", "surcharge": 10 }
      ]
    },
    "serviceCards": [
      {
        "title": "Аттестат / Диплом / Приложение к диплому",
        "description": "Перевод и нотариальное заверение аттестатов, дипломов и приложений для поступления в турецкие университеты",
        "icon": "mdi:certificate"
      },
      {
        "title": "Справки из школы / университета",
        "description": "Академические справки, выписки об оценках и другие документы из учебных заведений",
        "icon": "mdi:school"
      },
      {
        "title": "Паспорт / ID / Свидетельства",
        "description": "Переводы паспортов, удостоверений личности, свидетельств о рождении, браке и других личных документов",
        "icon": "mdi:card-account-details"
      },
      {
        "title": "Справки о несудимости / медицинские справки",
        "description": "Справки об отсутствии судимости, медицинские заключения и другие официальные справки",
        "icon": "mdi:file-document-check"
      },
      {
        "title": "Доверенности/Согласия",
        "description": "Нотариальные доверенности, согласия родителей и другие юридические документы",
        "icon": "mdi:file-sign"
      },
      {
        "title": "Финансовые справки",
        "description": "Банковские выписки, справки о доходах, гарантийные письма и финансовые документы",
        "icon": "mdi:bank"
      },
      {
        "title": "Другое",
        "description": "Любые другие документы, требующие нотариального перевода - оценка стоимости индивидуально",
        "icon": "mdi:file-question"
      }
    ]
  },
  "subServices": [],
  "calculator": {
    "standardUsd": 20
  },
  "urgencyMultipliers": {
    "express": 1.5,
    "rush": 2.0
  }
}
```

### Error Responses

**404 Not Found** - Service category not found

```json
{
  "statusCode": 404,
  "statusMessage": "Service category not found",
  "message": "Service category 'document-translations' does not exist or is inactive"
}
```

**500 Internal Server Error** - Database error

```json
{
  "statusCode": 500,
  "statusMessage": "Internal Server Error",
  "message": "Failed to fetch service category"
}
```

---

## Repository Contract

### ServiceRepository.findCategoryBySlug()

**Method**: `findCategoryBySlug(slug: string, locale: SupportedLocale)`

**File**: `server/repositories/ServiceRepository.ts`

**Input**:

- `slug`: `'document-translations'`
- `locale`: `'en' | 'ru' | 'kk' | 'tr'`

**Output**: `ServiceCategoryDetail | null`

**Behavior**:

1. Fetch `ServiceCategory` by slug
2. Include `ServiceCategoryTranslation` for locale (with fallback to 'en')
3. Include `SubService` entries (filter by `isActive = true`)
4. Return `metadata` field as-is from `ServiceCategoryTranslation`
5. Return null if category not found or `isActive = false`

**No Changes Required**: Existing implementation already supports metadata field

---

## Composable Contract

### useServices().fetchCategory()

**Method**: `fetchCategory(slug: string)`

**File**: `app/composables/useServices.ts`

**Input**:

- `slug`: `'document-translations'`

**Output**: `Promise<ServiceCategoryDetail>`

**Behavior**:

1. Call `/api/v1/services/:slug` endpoint
2. Return parsed JSON response
3. Throw error if response is not ok

**No Changes Required**: Existing implementation already works with metadata

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User navigates to /services/document-translations           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. document-translations.vue component loads                   │
│    - useAsyncData('document-translations', ...)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. useServices().fetchCategory('document-translations')        │
│    - Composable makes API call                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. GET /api/v1/services/document-translations                  │
│    - API handler receives request                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. ServiceRepository.findCategoryBySlug()                       │
│    - Query database with Prisma                                 │
│    - Include translations and metadata                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. Database returns ServiceCategory + ServiceCategoryTranslation│
│    - metadata field contains calculator + serviceCards          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. Repository returns ServiceCategoryDetail                     │
│    - Includes metadata as Record<string, unknown>               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. API handler returns JSON response                            │
│    - Status 200, ServiceCategoryDetail body                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 9. Component receives data in category ref                      │
│    - Reactive updates trigger re-render                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 10. Component renders sections:                                 │
│     - ServiceInfoCard (from metadata.serviceCards)              │
│     - PriceCalculatorSection (from metadata.calculator)         │
│     - HowItWorksSection (from i18n)                             │
│     - ServicesWhyChooseUsSection (from i18n)                    │
│     - FinalCTASection (from i18n)                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Backward Compatibility

### Other Service Pages

**Affected Pages**:

- `/services/relocation-in-turkey` - Uses old metadata structure

**Strategy**: PriceCalculatorSection must support BOTH structures

**Detection Logic**:

```typescript
// In PriceCalculatorSection.vue
const isNewStructure = computed(() => {
  return (
    props.documentTypes &&
    props.documentTypes.length > 0 &&
    typeof props.documentTypes[0] === 'object' &&
    'priceUsd' in props.documentTypes[0]
  )
})

const documentTypeNames = computed(() => {
  if (isNewStructure.value) {
    return (props.documentTypes as DocumentType[]).map((dt) => dt.name)
  }
  return props.documentTypes as string[]
})

const calculatedPrice = computed(() => {
  if (isNewStructure.value) {
    // New calculation: basePrice + surcharge
    const docType = (props.documentTypes as DocumentType[])[selectedDocumentType.value]
    const basePrice = docType.priceUsd
    const surcharge = (props.urgency as UrgencyOption[])[selectedUrgency.value].surcharge
    // ...
  } else {
    // Legacy calculation: standardPriceUsd * multipliers * adjustments
    // ...
  }
})
```

---

## Cache Strategy

**Current**: No caching implemented for services API

**Recommendation**: Add cache headers to service category responses

```typescript
// In /api/v1/services/[slug].ts
export default defineEventHandler(async (event) => {
  // ... fetch data ...

  // Cache for 5 minutes
  setHeader(event, 'Cache-Control', 'public, max-age=300, stale-while-revalidate=600')

  return categoryDetail
})
```

**Rationale**: Service data changes infrequently (only when admin updates seed data), caching improves performance

---

## Validation

### Server-Side Validation

**Location**: `server/repositories/ServiceRepository.ts` or API handler

**Rules**:

1. `slug` must be non-empty string
2. `locale` must be one of: 'en', 'ru', 'kk', 'tr'
3. Category must exist and be active

### Client-Side Validation

**Location**: Component props validation

**Rules**:

1. `documentTypes` must be non-empty array
2. `languagePairs` must be non-empty array
3. `urgency` must be non-empty array
4. Each `DocumentType` must have `name` (string) and `priceUsd` (number | null)
5. Each `UrgencyOption` must have `name` (string) and `surcharge` (number >= 0)

### Runtime Type Checking

**Recommendation**: Use Zod schema for metadata validation

```typescript
import { z } from 'zod'

const DocumentTypeSchema = z.object({
  name: z.string(),
  priceUsd: z.number().nullable(),
})

const UrgencyOptionSchema = z.object({
  name: z.string(),
  surcharge: z.number().min(0),
})

const ServiceCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
})

const CalculatorMetadataSchema = z.object({
  documentTypes: z.array(DocumentTypeSchema).min(1),
  languagePairs: z.array(z.string()).min(1),
  urgency: z.array(UrgencyOptionSchema).min(1),
})

const ServiceCategoryMetadataSchema = z.object({
  calculator: CalculatorMetadataSchema.optional(),
  serviceCards: z.array(ServiceCardSchema).optional(),
})
```

**Usage in Component**:

```typescript
const metadata = computed(() => {
  const raw = category.value?.metadata
  try {
    return ServiceCategoryMetadataSchema.parse(raw)
  } catch (error) {
    console.error('Invalid metadata structure:', error)
    return { calculator: undefined, serviceCards: undefined }
  }
})
```

---

## Summary

### No API Changes Required

- Existing `/api/v1/services/:slug` endpoint already returns metadata
- Repository already supports metadata field
- Composable already works with current API

### Key Points

1. **Metadata-driven**: All calculator and service cards data comes from database metadata
2. **i18n-driven**: Process steps, trust factors, and CTA come from i18n files
3. **Backward compatible**: Old service pages continue to work
4. **Type-safe**: TypeScript interfaces ensure contract adherence
5. **Validated**: Zod schemas provide runtime validation
