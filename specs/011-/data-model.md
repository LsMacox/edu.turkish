# Data Model: Enhanced Service Pages

**Feature**: Enhanced Service Pages for Document Translation  
**Date**: 2025-10-12  
**Status**: Complete

## Overview

This document defines the data structures and content models for the enhanced service pages. Since this is primarily a frontend content enhancement, data models are lightweight and focus on TypeScript interfaces for component props and i18n content structures.

## Content Entities

### 1. ProcessStep

Represents a single step in the "How It Works" workflow.

**Attributes**:

- `stepNumber`: Number (1-4) - Visual step indicator
- `title`: String - Short title of the step (e.g., "Загружаете документ")
- `description`: String - Detailed explanation of what happens in this step
- `icon`: String - Iconify icon name (e.g., "mdi:upload")

**Validation Rules**:

- `stepNumber`: Must be positive integer, typically 1-4
- `title`: Required, max 50 characters
- `description`: Required, max 200 characters
- `icon`: Required, must be valid Iconify icon name

**Usage Context**: Displayed in HowItWorksSection component, typically 3-4 steps per service

**State**: Immutable (content-driven, no user interaction changes state)

**Example**:

```typescript
{
  stepNumber: 1,
  title: "Загружаете документ",
  description: "Отправьте нам скан или фото документа через форму на сайте",
  icon: "mdi:upload"
}
```

---

### 2. TrustFactor

Represents a single credibility factor in the "Why Choose Us" section.

**Attributes**:

- `title`: String - Main heading (e.g., "Лицензированные переводчики")
- `description`: String - Supporting detail explaining the trust factor
- `icon`: String - Iconify icon name (e.g., "mdi:certificate")

**Validation Rules**:

- `title`: Required, max 60 characters
- `description`: Required, max 150 characters
- `icon`: Required, must be valid Iconify icon name

**Usage Context**: Displayed in WhyChooseUsSection component, typically 3 factors per service

**State**: Immutable (content-driven)

**Example**:

```typescript
{
  title: "Лицензированные переводчики",
  description: "Все наши специалисты имеют официальную аккредитацию",
  icon: "mdi:certificate"
}
```

---

### 3. TrustIndicator

Represents a decorative credibility marker (badge).

**Attributes**:

- `text`: String - Display text (e.g., "Работаем с 2019 года")
- `icon`: String (optional) - Iconify icon name for visual enhancement
- `variant`: String (optional) - Visual style variant ("default" | "accent")

**Validation Rules**:

- `text`: Required, max 80 characters
- `icon`: Optional, must be valid Iconify icon name if provided
- `variant`: Optional, defaults to "default"

**Usage Context**: Displayed inline near CTAs, section footers, or as decorative elements

**State**: Immutable (content-driven)

**Example**:

```typescript
{
  text: "Работаем с 2019 года",
  icon: "mdi:calendar-check",
  variant: "default"
}
```

---

### 4. SubServiceExtended

Extends existing SubService entity with delivery timeframe.

**New Attributes** (in addition to existing name, description, pricing):

- `deliveryTime`: String - Human-readable delivery timeframe (e.g., "1–2 дня")

**Validation Rules**:

- `deliveryTime`: Required, max 50 characters

**Relationship**: One-to-one extension of existing SubService entity

**Usage Context**: Displayed in SubServiceCard component below pricing

**State**: Immutable (content-driven)

**Example**:

```typescript
{
  // Existing fields
  id: "passport-translation",
  name: "Перевод паспорта",
  description: "Нотариально заверенный перевод паспорта",
  pricing: { RUB: "2500", TRY: "500", KZT: "12000", USD: "50" },
  // New field
  deliveryTime: "1–2 дня"
}
```

---

## Internationalization (i18n) Content Structure

### Common Service Content

Shared content used across multiple service pages.

**Path**: `i18n/locales/{locale}/services/common.json`

**Structure**:

```json
{
  "common": {
    "deliveryTime": "Срок",
    "howItWorks": {
      "title": "Как это работает",
      "steps": [
        {
          "title": "Загружаете документ",
          "description": "Отправьте нам скан или фото документа через форму на сайте",
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
          "description": "Высылаем электронную версию и при необходимости оригинал курьером",
          "icon": "mdi:check-circle"
        }
      ]
    },
    "whyChooseUs": {
      "title": "Почему выбирают нас",
      "factors": [
        {
          "title": "Лицензированные переводчики",
          "description": "Все наши специалисты имеют официальную аккредитацию",
          "icon": "mdi:certificate"
        },
        {
          "title": "Переводы принимают турецкие вузы",
          "description": "Работаем со всеми крупными университетами Турции",
          "icon": "mdi:school"
        },
        {
          "title": "Поддержка на русском, турецком и английском",
          "description": "Общайтесь с нами на удобном языке",
          "icon": "mdi:web"
        }
      ]
    },
    "trustIndicators": {
      "workingSince": "Работаем с 2019 года",
      "documentsCount": "1000+ переведённых документов"
    }
  }
}
```

---

### Service-Specific Content

Per-service content including delivery timeframes.

**Path**: `i18n/locales/{locale}/services/document-translations.json`

**Structure** (additions to existing structure):

```json
{
  "document-translations": {
    "title": "Профессиональный перевод документов",
    "subtitle": "Перевод документов для поступления, работы и переезда в Турцию",
    "subServices": {
      "passport-translation": {
        "name": "Перевод паспорта",
        "description": "Нотариально заверенный перевод паспорта",
        "deliveryTime": "1–2 дня",
        "pricing": {
          "RUB": "2500",
          "TRY": "500",
          "KZT": "12000",
          "USD": "50"
        }
      },
      "diploma-translation": {
        "name": "Перевод диплома",
        "description": "Официальный перевод диплома с апостилем",
        "deliveryTime": "2–3 дня",
        "pricing": {
          "RUB": "3500",
          "TRY": "700",
          "KZT": "16000",
          "USD": "70"
        }
      }
      // ... other sub-services
    }
  }
}
```

---

## TypeScript Type Definitions

### Component Props Types

Located in `app/types/services.ts` (additions):

```typescript
/**
 * Represents a single step in the "How It Works" process
 */
export interface ProcessStep {
  stepNumber: number
  title: string
  description: string
  icon: string
}

/**
 * Represents a trust factor in "Why Choose Us" section
 */
export interface TrustFactor {
  title: string
  description: string
  icon: string
}

/**
 * Represents a decorative trust indicator badge
 */
export interface TrustIndicator {
  text: string
  icon?: string
  variant?: 'default' | 'accent'
}

/**
 * Props for HowItWorksSection component
 */
export interface HowItWorksSectionProps {
  title?: string // Optional: can default to i18n value
  steps: ProcessStep[]
}

/**
 * Props for WhyChooseUsSection component
 */
export interface WhyChooseUsSectionProps {
  title?: string // Optional: can default to i18n value
  factors: TrustFactor[]
}

/**
 * Props for ProcessStep component
 */
export interface ProcessStepProps {
  step: ProcessStep
}

/**
 * Props for TrustFactor component
 */
export interface TrustFactorProps {
  factor: TrustFactor
}

/**
 * Props for TrustIndicatorBadge component
 */
export interface TrustIndicatorBadgeProps {
  indicator: TrustIndicator
}

/**
 * Extended SubService with delivery timeframe
 */
export interface SubServiceWithDelivery extends SubService {
  deliveryTime: string
}
```

---

## Data Flow

### 1. Service Page → Components

```
Service Page (e.g., document-translations.vue)
  ↓
  Uses useI18n() composable
  ↓
  Fetches: tm('services.common.howItWorks.steps')
  Fetches: tm('services.common.whyChooseUs.factors')
  Fetches: t('services.document-translations.subServices.*.deliveryTime')
  ↓
  Passes to components as props
  ↓
  Components render content
```

### 2. i18n JSON → Component Props

```typescript
// In service page component
const { t, tm } = useI18n()

// Get process steps from i18n
const processSteps = computed(() => {
  const stepsData = tm('services.common.howItWorks.steps') as ProcessStep[]
  return stepsData
})

// Get trust factors from i18n
const trustFactors = computed(() => {
  const factorsData = tm('services.common.whyChooseUs.factors') as TrustFactor[]
  return factorsData
})

// Get sub-services with delivery time
const subServices = computed(() => {
  const raw = tm('services.document-translations.subServices') as Record<string, unknown>
  return Object.keys(raw).map(id => ({
    id: id as SubServiceId,
    name: t(`services.document-translations.subServices.${id}.name`),
    description: t(`services.document-translations.subServices.${id}.description`),
    deliveryTime: t(`services.document-translations.subServices.${id}.deliveryTime`),
    pricing: { ... }
  }))
})
```

---

## Locale Coverage

All content must be translated for 4 locales:

1. **Russian (ru)**: Primary locale, content created first
2. **English (en)**: Full translation
3. **Turkish (tr)**: Full translation
4. **Kazakh (kk)**: Full translation

**Translation Keys per Locale**:

- Common service content: ~25 keys
- Per-service additions (delivery time): ~8-12 keys per service × 5 services = 40-60 keys
- **Total new keys per locale**: ~65-85 keys

**Translation Verification**:

- All keys must exist in all locales (enforced by i18n check script)
- No missing translations allowed in production
- Use `npm run i18n:check` to validate

---

## Data Validation

### Runtime Validation

No runtime validation needed for content-driven data (provided by i18n, assumed to be correct).

### Build-Time Validation

1. **i18n completeness check**: `npm run i18n:check`
   - Ensures all keys exist in all locales
   - Reports missing translations

2. **TypeScript type checking**: `npm run typecheck`
   - Ensures component props match interfaces
   - Validates type safety

3. **Test suite**:
   - Unit tests verify component rendering with valid data
   - Integration tests ensure i18n keys are resolved correctly

---

## Migration Path

### Phase 1: Add Delivery Time to Existing SubServices

1. Update `app/types/services.ts` with `SubServiceWithDelivery` interface
2. Modify `SubServiceCard.vue` to accept and display `deliveryTime` prop
3. Add `deliveryTime` field to all sub-services in i18n files (4 locales × 5 services)
4. Update service pages to pass delivery time to cards

### Phase 2: Add How It Works Section

1. Create `ProcessStep.vue` component
2. Create `HowItWorksSection.vue` component
3. Add common `howItWorks` content to i18n files (all 4 locales)
4. Update `ServicePageLayout.vue` with `how-it-works` slot
5. Add section to service pages

### Phase 3: Add Why Choose Us Section

1. Create `TrustFactor.vue` component
2. Create `WhyChooseUsSection.vue` component
3. Add common `whyChooseUs` content to i18n files (all 4 locales)
4. Update `ServicePageLayout.vue` with `why-choose-us` slot
5. Add section to service pages

### Phase 4: Add Trust Indicators

1. Create `TrustIndicatorBadge.vue` component
2. Add common `trustIndicators` content to i18n files (all 4 locales)
3. Update `ServicePageLayout.vue` with `trust-indicators` slot
4. Add badges to service pages

---

## Content Management

### Updating Content

**To update text content**:

1. Edit JSON files in `i18n/locales/{locale}/services/`
2. Run `npm run i18n:check` to verify completeness
3. Test in dev environment
4. Commit and deploy

**To add new service**:

1. Add service definition to all locale files
2. Include all required fields (name, description, deliveryTime, pricing)
3. Verify in all 4 locales
4. Create service page component (or add to existing routing)

**To update trust indicators**:

1. Edit `services/common.json` → `trustIndicators` section
2. Update in all 4 locales simultaneously
3. No code changes required

---

## Performance Considerations

**Content Size**:

- Process steps: ~4 steps × 150 chars avg = 600 bytes per locale
- Trust factors: ~3 factors × 150 chars avg = 450 bytes per locale
- Trust indicators: ~2 indicators × 50 chars avg = 100 bytes per locale
- **Total per locale**: ~1.15 KB additional content
- **Total for 4 locales**: ~4.6 KB

**Bundle Impact**: Negligible (<5 KB total)

**Runtime Impact**: None (static content, SSR-rendered)

---

## Testing Data

### Mock Data for Tests

```typescript
// test/fixtures/services.ts

export const mockProcessSteps: ProcessStep[] = [
  {
    stepNumber: 1,
    title: 'Upload document',
    description: 'Send us a scan or photo via the website form',
    icon: 'mdi:upload',
  },
  {
    stepNumber: 2,
    title: 'We clarify details',
    description: 'Our manager will contact you',
    icon: 'mdi:message-text',
  },
]

export const mockTrustFactors: TrustFactor[] = [
  {
    title: 'Licensed translators',
    description: 'All specialists are officially accredited',
    icon: 'mdi:certificate',
  },
]

export const mockTrustIndicators: TrustIndicator[] = [
  {
    text: 'Working since 2019',
    icon: 'mdi:calendar-check',
  },
]
```

---

## Next Steps

1. Create TypeScript contracts in `contracts/` directory
2. Create quickstart guide for developers
3. Update agent context with new types and patterns
