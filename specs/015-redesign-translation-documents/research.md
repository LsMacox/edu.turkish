# Research: Redesign Translation Documents Service Page

**Branch**: `015-redesign-translation-documents` | **Date**: 2025-01-08

## Current Implementation Analysis

### Page Structure (document-translations.vue)

**Current State**:

- Uses `ServicePageLayout` component with multiple named slots
- Displays `SubServiceCard` components for 3 sub-services (notarized-translation, apostille-translation, consular-legalization)
- Shows `PriceCalculatorSection` with metadata-driven configuration
- Includes `UniversityRequirementsSection`, `SampleDocumentsSection`, and `TrustIndicatorBadge` components
- Uses `HowItWorksSection` and `ServicesWhyChooseUsSection` for process and trust factors

**Data Flow**:

```
database → ServiceRepository.findCategoryBySlug() → API endpoint → useServices.fetchCategory() → component
```

**Current Components Being Used**:

1. `ServicePageLayout` (wrapper) - **KEEP**
2. `SubServiceCard` (x3 instances) - **REMOVE**
3. `PriceCalculatorSection` - **MODIFY** (add submit button)
4. `UniversityRequirementsSection` - **REMOVE**
5. `SampleDocumentsSection` - **REMOVE**
6. `TrustIndicatorBadge` - **REMOVE**
7. `HowItWorksSection` - **UPDATE** (change data source to document-translations specific)
8. `ServicesWhyChooseUsSection` - **UPDATE** (change data to 5 factors instead of 3)

### Database Schema

**ServiceCategory** table:

- `id`, `slug`, `order`, `isActive`
- `expressMultiplier` (Decimal) - currently 1.5 for document-translations
- `rushMultiplier` (Decimal) - currently 2.0 for document-translations

**ServiceCategoryTranslation** table:

- `serviceCategoryId`, `locale`, `title`, `subtitle`, `slug`
- `metadata` (JSON) - **KEY FIELD** for storing calculator config and service cards

**Current metadata structure** (lines 196-294 in prisma/seed/services.ts):

```json
{
  "priceCalculator": {
    "documentTypes": ["Диплом", "Транскрипт", "Паспорт", ...],
    "languages": ["Английский → Турецкий", ...],
    "urgency": ["Стандарт (5 рабочих дней)", ...],
    "adjustments": {
      "byDocumentType": [1, 1.2, 1.1, 1.3, 1.4, 1],
      "byLanguage": [1, 1.1, 1.05, 1.2]
    }
  }
}
```

**SubService** table (current sub-services for document-translations):

- `calculator-standard` (type: 'calculator', priceUsd: 20) - used for calculator base price
- `notarized-translation` (priceUsd: 20, deliveryTimeDays: 5) - displayed as card
- `apostille-translation` (priceUsd: 40, deliveryTimeDays: 10) - displayed as card
- `consular-legalization` (priceUsd: 60, deliveryTimeDays: 14) - displayed as card

### PriceCalculatorSection Component

**Current Props Interface** (from types/services.ts):

```typescript
{
  keyPrefix: string
  documentTypes?: string[]
  languages?: string[]
  urgency?: string[]
  standardPriceUsd?: number
  urgencyMultipliers?: { express: number, rush: number }
  adjustments?: { byDocumentType: number[], byLanguage: number[] }
}
```

**Current Behavior**:

- Displays 3 dropdowns: Document Type, Language Pair, Urgency
- Calculates price using formula: `baseUsd * urgencyMultiplier * docAdjustment * langAdjustment`
- Converts to selected currency using `useExchangeRatesStore`
- Shows price in read-only display box
- **NO submit button** - users must scroll to SubServiceCard to apply

**Gap Analysis**:

- ❌ No "Submit Application" button
- ❌ No way to open ApplicationModal directly from calculator
- ❌ Calculator metadata structure doesn't match new spec (needs `priceUsd` per document type, `surcharge` for urgency)
- ❌ Adjustment multipliers (byDocumentType, byLanguage) are complex - new spec uses simpler per-document base prices

### i18n Structure

**Current keys** (i18n/locales/ru/services.json, lines 26-74):

```json
{
  "services": {
    "common": {
      "howItWorks": {
        "steps": [
          /* 4 generic steps */
        ]
      },
      "whyChooseUs": {
        "factors": [
          /* 3 generic factors */
        ]
      },
      "trustIndicators": {
        /* 2 badges */
      }
    }
  }
}
```

**Gap Analysis**:

- ❌ No document-translations specific keys (uses generic "common" keys)
- ❌ whyChooseUs has only 3 factors, spec requires 5
- ❌ howItWorks steps are generic, spec requires specific text
- ❌ No finalCTA section

### ServiceRepository

**Current `findCategoryBySlug()` method** (lines 51-154):

- Fetches ServiceCategory with translations
- Fetches SubServices (filters by `type !== 'calculator'` for offerings)
- Extracts calculator pricing from sub-services with `type = 'calculator'`
- Returns `metadata` field from ServiceCategoryTranslation as-is (Record<string, unknown>)

**Supports our needs**: ✅ Already returns metadata, no changes needed to repository

### Existing Components Review

**HowItWorksSection.vue**:

- Accepts `steps` prop: `Array<{ title: string, description: string, icon: string }>`
- Renders steps in grid layout
- **Reusable**: ✅ Can be used with new document-translations specific steps

**ServicesWhyChooseUsSection.vue**:

- Accepts `factors` prop: `Array<{ title: string, description: string, icon: string }>`
- Renders factors in grid layout
- **Reusable**: ✅ Can be updated with 5 factors instead of 3

## Required Changes Summary

### 1. Database Seed Updates

**File**: `prisma/seed/services.ts` (lines 196-294)

**Changes**:

- Replace `priceCalculator` metadata structure with new `calculator` structure
- Add `serviceCards` array to metadata (7 cards with title, description, icon)
- Update calculator to match new spec:
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
      /* 7 cards */
    ]
  }
  ```
- Remove adjustments (byDocumentType, byLanguage) - no longer needed
- Apply changes to all 4 locales (en, ru, kk, tr)

**Migration Path**: Run `pnpm db:seed` to update metadata in ServiceCategoryTranslation table

### 2. i18n Updates

**Files**: `i18n/locales/{en,ru,kk,tr}/services.json`

**Add new keys**:

```json
{
  "services": {
    "document-translations": {
      "title": "Нотариально заверенные переводы документов в Турции",
      "subtitle": "...",
      "howItWorks": {
        "steps": [
          /* 4 specific steps from spec */
        ]
      },
      "whyChooseUs": {
        "factors": [
          /* 5 specific factors from spec */
        ]
      },
      "calculator": {
        "title": "Калькулятор цены",
        "submitButton": "Подать заявку",
        "byRequest": "По запросу"
      },
      "finalCTA": {
        "title": "Хотите быстро и без ошибок...",
        "button": "Отправить документы",
        "icon": "mdi:send"
      }
    }
  }
}
```

### 3. Component Changes

#### NEW: ServiceInfoCard.vue

**Purpose**: Display service card without price

**Props**:

```typescript
{
  title: string
  description: string
  icon: string
}
```

**Styling**: White card with shadow, icon, title, description, hover effect (no price badge)

#### MODIFY: PriceCalculatorSection.vue

**Changes**:

1. Update props interface to accept new metadata structure:
   - `documentTypes: Array<{name: string, priceUsd: number | null}>`
   - `urgency: Array<{name: string, surcharge: number}>`
2. Remove `adjustments`, `urgencyMultipliers` props
3. Add "Submit Application" button below price display
4. Handle "Остальное" edge case (priceUsd = null) → show "По запросу" text
5. Emit event when button clicked with selected context (documentType, urgency, price)

**New calculation logic**:

```typescript
const basePrice = documentTypes[selectedDocumentType].priceUsd
const urgencySurcharge = urgency[selectedUrgency].surcharge
const finalPriceUsd = basePrice === null ? null : basePrice + urgencySurcharge
```

#### NEW: FinalCTASection.vue

**Purpose**: Bottom call-to-action section

**Props**:

```typescript
{
  title: string
  buttonText: string
  icon: string
}
```

**Behavior**: Opens ApplicationModal when button clicked

#### UPDATE: document-translations.vue

**Changes**:

1. Remove `SubServiceCard` usage (lines 6-17)
2. Remove `UniversityRequirementsSection` (lines 31-37)
3. Remove `SampleDocumentsSection` (lines 39-44)
4. Remove `TrustIndicatorBadge` (lines 54-60)
5. Add ServiceInfoCard rendering from `metadata.serviceCards`
6. Update PriceCalculatorSection props to new structure
7. Add submit button handler to open ApplicationModal with context
8. Update `howItWorksSteps` to read from `services.document-translations.howItWorks.steps` instead of `services.common.howItWorks.steps`
9. Update `whyChooseUsFactors` to read from `services.document-translations.whyChooseUs.factors` (5 items)
10. Add FinalCTASection at bottom

### 4. Type Updates

**File**: `app/types/services.ts` or `server/types/api/services.ts`

**Add new types**:

```typescript
type DocumentType = {
  name: string
  priceUsd: number | null
}

type UrgencyOption = {
  name: string
  surcharge: number
}

type ServiceCard = {
  title: string
  description: string
  icon: string
}

interface CalculatorMetadata {
  documentTypes: DocumentType[]
  languagePairs: string[]
  urgency: UrgencyOption[]
}

interface ServiceCategoryMetadata {
  calculator?: CalculatorMetadata
  serviceCards?: ServiceCard[]
}
```

## Technical Constraints & Considerations

### 1. Backward Compatibility

**Issue**: Other service pages (relocation-in-turkey) use PriceCalculatorSection with old props structure

**Solution**: Make PriceCalculatorSection support BOTH old and new metadata structures via prop overloading or dual interfaces. Check if `documentTypes` is array of strings (old) or array of objects (new).

**Alternative**: Create `PriceCalculatorSectionV2.vue` for new structure, keep old component for relocation page.

### 2. Migration Safety

**Issue**: Seed script updates metadata, but existing data might be in old format

**Solution**: Seed script uses upsert, so running `pnpm db:seed` will replace old metadata with new structure. Document this in quickstart.md as required step.

### 3. Exchange Rate Dependency

**Current**: Uses `useExchangeRatesStore` for currency conversion

**Risk**: If exchange rates fail to load, calculator should fallback to USD display

**Mitigation**: Already handled in existing code (useCurrency.ts composable)

### 4. Modal Integration

**Current**: ApplicationModal accepts `serviceContext` object

**Required context**:

```typescript
{
  subServiceId?: string  // Optional for calculator
  subServiceName: string  // e.g., "Загранпаспорт + Срочно"
  source: 'service-page'
  sourceDescription: string
  price?: string  // "from 30$" or "by_request"
}
```

**Implementation**: When user clicks "Submit Application" button, construct context from selected calculator options.

### 5. i18n Fallback Strategy

**Spec requirement (FR-031)**: If `metadata.serviceCards` is missing, skip service cards section entirely

**Implementation**:

```vue
<template #service-cards>
  <div v-if="serviceCards && serviceCards.length > 0">
    <ServiceInfoCard v-for="card in serviceCards" :key="card.title" v-bind="card" />
  </div>
</template>
```

If `metadata.calculator` is missing → system error (calculator is mandatory per spec edge case analysis)

### 6. Iconify Icons

**Current**: Uses `@nuxt/icon` module with `mdi` and `ph` collections

**Spec icons**: All use `mdi:*` prefix (mdi:certificate, mdi:school, mdi:card-account-details, etc.)

**Validation**: Check that all specified icons exist in @iconify-json/mdi package

## Performance Considerations

### Current Page Load

**Observed**: ServiceCategory fetched via API, includes translations and sub-services

**New data**: Metadata size increase due to serviceCards array (~7 objects × 4 locales)

**Impact**: Minimal - metadata is JSON field, total increase ~2-3KB per locale

### Calculator Reactivity

**Current**: Uses computed properties with dependency tracking

**New**: Same pattern, no performance degradation expected

**Calculation complexity**: O(1) - simple addition instead of multiplication chain

## Testing Strategy

### Seed Data Tests

**Test**: Verify seed script creates correct metadata structure

**Method**: Unit test that runs seed script in test database, queries ServiceCategoryTranslation, validates JSON schema

### Component Tests

**ServiceInfoCard.test.ts**: Renders title, description, icon correctly

**PriceCalculatorSection.test.ts**:

- Renders calculator with new metadata structure
- Updates price when selections change
- Shows "По запросу" when priceUsd is null
- Emits event when submit button clicked with correct context

**FinalCTASection.test.ts**: Opens ApplicationModal when button clicked

### Integration Tests

**document-translations page**:

- Fetches category data from seeded database
- Renders all sections (hero, service cards, calculator, process, why choose us, final CTA)
- Handles missing metadata.serviceCards gracefully (skips section)
- Opens ApplicationModal with correct context when calculator submit clicked

### Contract Tests

**service-metadata.contract.test.ts**:

- Validates ServiceCategoryMetadata JSON schema
- Ensures all 4 locales have matching structure
- Verifies calculator metadata has required fields (documentTypes, languagePairs, urgency)

## Dependencies

### Existing

- `@nuxt/icon` (with mdi collection) - ✅ Already installed
- `@nuxtjs/i18n` - ✅ Already configured
- `useApplicationModalStore` - ✅ Exists in stores/
- `useExchangeRatesStore` - ✅ Exists in stores/
- `useCurrency` composable - ✅ Exists in composables/
- `ServicePageLayout` - ✅ Exists in components/

### New

None - all required packages and infrastructure already in place

## Open Questions Resolved in Clarifications

1. ✅ "Остальное" document type behavior → Show "По запросу", button active, pass "price: by_request"
2. ✅ Service cards descriptions source → Store in database metadata (ServiceCategory.metadata.serviceCards)
3. ✅ Calculator submit button integration → Modify PriceCalculatorSection to always show button
4. ✅ "Why Choose Us" data source → i18n files (services.document-translations.whyChooseUs.factors)
5. ✅ Fallback for missing serviceCards → Skip section entirely, render other sections normally

## Next Steps

See **data-model.md** for detailed schema design and **contracts/** directory for API contracts.
