# Data Model: Redesign Translation Documents Service Page

**Branch**: `015-redesign-translation-documents` | **Date**: 2025-01-08

## Schema Overview

This feature does NOT require Prisma schema changes. All data is stored in existing tables using JSON `metadata` field.

### Existing Database Tables

#### ServiceCategory

**Table**: `ServiceCategory`

```prisma
model ServiceCategory {
  id                Int      @id @default(autoincrement())
  slug              String   @unique
  order             Int      @default(0)
  isActive          Boolean  @default(true)
  expressMultiplier Decimal  @default(1.50) @db.Decimal(3, 2)
  rushMultiplier    Decimal  @default(2.00) @db.Decimal(3, 2)

  translations      ServiceCategoryTranslation[]
  subServices       SubService[]
}
```

**Used for**: Storing service category metadata and urgency multipliers (not used in new calculator logic, but kept for backward compatibility)

#### ServiceCategoryTranslation

**Table**: `ServiceCategoryTranslation`

```prisma
model ServiceCategoryTranslation {
  id                Int      @id @default(autoincrement())
  serviceCategoryId Int
  locale            String   // 'en' | 'ru' | 'kk' | 'tr'
  title             String
  subtitle          String?  @db.Text
  slug              String
  metadata          Json?    // ⭐ KEY FIELD for storing calculator config and service cards

  serviceCategory   ServiceCategory @relation(fields: [serviceCategoryId], references: [id])

  @@unique([serviceCategoryId, locale])
}
```

**Used for**: Storing localized title, subtitle, and **metadata** containing calculator configuration and service cards

#### SubService (Not used for new design)

**Table**: `SubService`

**Used for**: Legacy sub-services (notarized-translation, apostille-translation, etc.) - will remain in database but NOT displayed on page

**Note**: We keep existing sub-services for potential future use or admin panel, but page will NOT render `SubServiceCard` components.

## Metadata JSON Structure

### ServiceCategoryMetadata Type

**Location**: `server/types/api/services.ts` or `app/types/services.ts`

```typescript
export interface DocumentType {
  name: string
  priceUsd: number | null // null for "Остальное" (by request)
}

export interface UrgencyOption {
  name: string
  surcharge: number // USD surcharge amount (0 for standard, 10 for rush)
}

export interface ServiceCard {
  title: string
  description: string
  icon: string // Iconify icon name (e.g., 'mdi:certificate')
}

export interface CalculatorMetadata {
  documentTypes: DocumentType[]
  languagePairs: string[]
  urgency: UrgencyOption[]
}

export interface ServiceCategoryMetadata {
  calculator?: CalculatorMetadata
  serviceCards?: ServiceCard[]
}
```

### Example: document-translations metadata (Russian locale)

```json
{
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
}
```

### Validation Rules

1. **calculator.documentTypes**:
   - MUST have at least 1 item
   - Each item MUST have `name` (string) and `priceUsd` (number | null)
   - At most one item can have `priceUsd: null` (for "by request" option)

2. **calculator.languagePairs**:
   - MUST have at least 1 item
   - Each item is a string

3. **calculator.urgency**:
   - MUST have at least 1 item
   - Each item MUST have `name` (string) and `surcharge` (number >= 0)

4. **serviceCards**:
   - OPTIONAL (if missing, section is not rendered)
   - If present, MUST have at least 1 item
   - Each item MUST have `title`, `description`, `icon` (all strings)
   - Icons MUST be valid Iconify references (e.g., 'mdi:certificate')

## i18n Data Structure

### Location

`i18n/locales/{locale}/services.json`

### Structure

```json
{
  "services": {
    "document-translations": {
      "title": "Нотариально заверенные переводы документов в Турции",
      "subtitle": "Мы помогаем студентам и клиентам перевести все необходимые документы для поступления в университеты Турции и оформления вида на жительство. Наши переводы выполнены лицензированными переводчиками (yeminli tercüman) и принимаются всеми государственными учреждениями.",
      "calculator": {
        "title": "Калькулятор цены",
        "documentTypeLabel": "Тип документа",
        "languagePairLabel": "Языковая пара",
        "urgencyLabel": "Срочность",
        "estimatedPrice": "Ориентировочная цена",
        "submitButton": "Подать заявку",
        "byRequest": "По запросу"
      },
      "howItWorks": {
        "title": "Как это работает",
        "steps": [
          {
            "title": "Загружаете документ",
            "description": "Вы отправляете нам документы онлайн подав заявку (PDF/фото) — не обязательно приносить оригиналы лично",
            "icon": "mdi:upload"
          },
          {
            "title": "Мы уточняем детали",
            "description": "Наш менеджер свяжется с вами для уточнения требований",
            "icon": "mdi:message-text"
          },
          {
            "title": "Переводим и заверяем",
            "description": "Лицензированные переводчики выполняют перевод с нотариальным заверением",
            "icon": "mdi:translate"
          },
          {
            "title": "Получаете готовый файл",
            "description": "Готовые переводы отправляем в электронном формате либо бумажном виде на руки, при необходимости — курьером по Турции",
            "icon": "mdi:check-circle"
          }
        ]
      },
      "whyChooseUs": {
        "title": "Почему выбирают нас",
        "factors": [
          {
            "title": "Работают только аккредитованные переводчики",
            "description": "Все наши специалисты имеют официальную аккредитацию yeminli tercüman с правом заверения документов",
            "icon": "mdi:certificate"
          },
          {
            "title": "Переводы принимаются всеми гос. учреждениями Турции",
            "description": "Наши переводы гарантированно принимают университеты, миграционная служба и другие государственные органы",
            "icon": "mdi:bank-check"
          },
          {
            "title": "Возможность онлайн-перевода без визита в офис",
            "description": "Весь процесс можно пройти дистанционно — отправляете сканы, получаете готовые переводы",
            "icon": "mdi:web"
          },
          {
            "title": "Проверка и коррекция документа перед заверением",
            "description": "Мы внимательно проверяем каждый перевод на соответствие требованиям турецких учреждений",
            "icon": "mdi:file-document-check"
          },
          {
            "title": "Срочные переводы — в течение пару часов",
            "description": "Если нужно быстро, делаем перевод и заверение в течение 2-3 часов",
            "icon": "mdi:clock-fast"
          }
        ]
      },
      "finalCTA": {
        "title": "Хотите быстро и без ошибок перевести документы для поступления или ВНЖ? Свяжитесь с нами прямо сейчас - мы проверим ваши документы и подскажем, какой тип перевода вам нужен",
        "button": "Отправить документы",
        "icon": "mdi:send"
      }
    }
  }
}
```

## Component Data Flow

### Page Load Sequence

```
1. User navigates to /services/document-translations
2. document-translations.vue calls useAsyncData('document-translations', ...)
3. useAsyncData calls useServices().fetchCategory('document-translations')
4. fetchCategory calls /api/v1/services/document-translations
5. API handler calls ServiceRepository.findCategoryBySlug('document-translations', locale)
6. Repository fetches ServiceCategory + ServiceCategoryTranslation (with metadata)
7. API returns ServiceCategoryDetail with metadata
8. Component receives data and renders sections
```

### ServiceCategoryDetail Response Type

```typescript
export interface ServiceCategoryDetail {
  id: number
  slug: string
  title: string
  subtitle: string | null
  localizedSlug: string
  metadata: ServiceCategoryMetadata | null // ⭐ Contains calculator + serviceCards
  subServices: SubServiceDetail[] // Empty or legacy entries (NOT rendered)
  calculator?: {
    standardUsd: number
    expressUsd?: number
    rushUsd?: number
  } // Legacy field (NOT used in new design)
  urgencyMultipliers?: {
    express: number
    rush: number
  } // Legacy field (NOT used in new design)
}
```

### Component Props Flow

#### ServiceInfoCard

```typescript
// Input: metadata.serviceCards[index]
{
  title: string
  description: string
  icon: string
}
```

#### PriceCalculatorSection

```typescript
// Input: metadata.calculator + i18n keys
{
  documentTypes: DocumentType[]  // from metadata.calculator.documentTypes
  languagePairs: string[]        // from metadata.calculator.languagePairs
  urgency: UrgencyOption[]       // from metadata.calculator.urgency
  keyPrefix: 'services.document-translations.calculator'
}

// Output: Submit button click event
{
  selectedDocumentType: DocumentType
  selectedLanguagePair: string
  selectedUrgency: UrgencyOption
  calculatedPriceUsd: number | null
  calculatedPriceFormatted: string  // "от 30$" or "По запросу"
}
```

#### HowItWorksSection

```typescript
// Input: i18n keys
{
  steps: Array<{
    title: string
    description: string
    icon: string
  }>
}
// From: t('services.document-translations.howItWorks.steps')
```

#### ServicesWhyChooseUsSection

```typescript
// Input: i18n keys
{
  factors: Array<{
    title: string
    description: string
    icon: string
  }>
}
// From: t('services.document-translations.whyChooseUs.factors')
```

#### FinalCTASection

```typescript
// Input: i18n keys
{
  title: string
  buttonText: string
  icon: string
}
// From: t('services.document-translations.finalCTA')
```

## Seed Data Structure

**File**: `prisma/seed/services.ts`

### Update for document-translations

```typescript
const perLocaleMetadata: Record<string, any> | null =
  categorySlug === 'document-translations'
    ? {
        ru: {
          calculator: {
            documentTypes: [
              { name: 'Загранпаспорт', priceUsd: 20 },
              { name: 'Школьный аттестат', priceUsd: 30 },
              { name: 'Диплом', priceUsd: 45 },
              { name: 'Доверенность/Согласие', priceUsd: 40 },
              { name: 'Финансовые справки', priceUsd: 25 },
              { name: 'Остальное', priceUsd: null },
            ],
            languagePairs: ['Русский – Турецкий', 'Турецкий – Русский'],
            urgency: [
              { name: 'Стандарт (1-3 дня)', surcharge: 0 },
              { name: 'Срочно (до 3 часов)', surcharge: 10 },
            ],
          },
          serviceCards: [
            {
              title: 'Аттестат / Диплом / Приложение к диплому',
              description:
                'Перевод и нотариальное заверение аттестатов, дипломов и приложений для поступления в турецкие университеты',
              icon: 'mdi:certificate',
            },
            // ... 6 more cards
          ],
        },
        en: {
          /* ... English version ... */
        },
        kk: {
          /* ... Kazakh version ... */
        },
        tr: {
          /* ... Turkish version ... */
        },
      }
    : null
```

## State Management

### No Pinia Store Required

This feature does NOT require a new Pinia store. Data flows directly from API to component via `useAsyncData`.

### ApplicationModal State

**Existing Store**: `stores/applicationModal.ts`

**Method**: `openModal(context: ApplicationModalContext)`

**Context Shape**:

```typescript
{
  source: 'service_page'
  description: string  // e.g., "Загранпаспорт + Срочно (до 3 часов)"
  serviceContext: {
    subServiceId?: string  // Optional (not used for calculator)
    subServiceName: string  // Selected document type + urgency
    source: 'service-page'
    sourceDescription: string  // Full description
    price?: string  // "from 30$" or "by_request"
  }
}
```

**Example Call**:

```typescript
modal.openModal({
  source: 'service_page',
  description: 'Диплом + Срочно (до 3 часов)',
  serviceContext: {
    subServiceName: 'Диплом + Срочно (до 3 часов)',
    source: 'service-page',
    sourceDescription: 'Перевод диплома с срочной обработкой',
    price: 'from 55$', // or 'by_request' if priceUsd is null
  },
})
```

## Migration Path

### Step 1: Update Seed File

Modify `prisma/seed/services.ts` (lines 196-294) to replace `priceCalculator` with new `calculator` and add `serviceCards`.

### Step 2: Run Seed Script

```bash
pnpm db:seed
```

This will upsert ServiceCategoryTranslation records with new metadata structure for all 4 locales.

### Step 3: Verify Database

```sql
SELECT locale, metadata FROM ServiceCategoryTranslation
WHERE serviceCategoryId = (SELECT id FROM ServiceCategory WHERE slug = 'document-translations');
```

Expected: 4 rows (en, ru, kk, tr) with metadata containing `calculator` and `serviceCards` fields.

### Step 4: Update i18n Files

Add `document-translations` keys to `i18n/locales/{en,ru,kk,tr}/services.json`.

### Step 5: Update Components

See `contracts/` directory for component interface contracts.

## Data Validation

### Contract Tests

**File**: `tests/contract/service-metadata.contract.test.ts`

```typescript
describe('ServiceCategoryMetadata Contract', () => {
  it('validates calculator structure', () => {
    const metadata = /* fetch from seeded database */
    expect(metadata.calculator).toBeDefined()
    expect(metadata.calculator.documentTypes).toBeInstanceOf(Array)
    expect(metadata.calculator.documentTypes.length).toBeGreaterThan(0)

    metadata.calculator.documentTypes.forEach((docType) => {
      expect(docType).toHaveProperty('name')
      expect(docType).toHaveProperty('priceUsd')
      expect(typeof docType.name).toBe('string')
      expect(docType.priceUsd === null || typeof docType.priceUsd === 'number').toBe(true)
    })
  })

  it('validates serviceCards structure', () => {
    const metadata = /* fetch from seeded database */
    if (metadata.serviceCards) {
      expect(metadata.serviceCards).toBeInstanceOf(Array)
      metadata.serviceCards.forEach((card) => {
        expect(card).toHaveProperty('title')
        expect(card).toHaveProperty('description')
        expect(card).toHaveProperty('icon')
      })
    }
  })
})
```

## Summary

- **No Prisma schema changes required** - uses existing `metadata` JSON field
- **Seed script updates** - replace old `priceCalculator` with new `calculator`, add `serviceCards`
- **i18n additions** - add `services.document-translations.*` keys for all locales
- **Type safety** - TypeScript interfaces ensure metadata structure consistency
- **Validation** - Contract tests verify metadata schema compliance
- **Backward compatibility** - Other services (relocation-in-turkey) unaffected
