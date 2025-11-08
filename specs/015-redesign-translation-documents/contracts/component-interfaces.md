# Component Interface Contracts

**Feature**: Redesign Translation Documents Service Page  
**Date**: 2025-01-08

## ServiceInfoCard.vue

### Purpose

Display service card without price (replacement for SubServiceCard)

### Props Interface

```typescript
interface ServiceInfoCardProps {
  title: string // Card title (e.g., "Аттестат / Диплом")
  description: string // Card description
  icon: string // Iconify icon reference (e.g., 'mdi:certificate')
}
```

### Usage Example

```vue
<ServiceInfoCard
  title="Аттестат / Диплом / Приложение к диплому"
  description="Перевод и нотариальное заверение аттестатов..."
  icon="mdi:certificate"
/>
```

### Rendering Requirements

- White background card with subtle shadow
- Icon displayed at top (size: 48x48px or similar)
- Title in bold, larger font
- Description in normal weight, smaller font
- Hover effect: slight scale increase or shadow enhancement
- Responsive: full width on mobile (<768px), grid layout on desktop
- No price badge or delivery time display

### Accessibility

- Card must be keyboard-focusable (use `<div tabindex="0">` or semantic elements)
- Icon must have `aria-label` or be decorative (`aria-hidden="true"`)
- Title must use semantic heading tag (`<h3>` or similar)

---

## PriceCalculatorSection.vue (Modified)

### Purpose

Interactive price calculator with submit button to open application modal

### Props Interface

```typescript
interface DocumentType {
  name: string
  priceUsd: number | null // null for "by request" option
}

interface UrgencyOption {
  name: string
  surcharge: number // USD surcharge (0 for standard, 10 for rush)
}

interface PriceCalculatorSectionProps {
  keyPrefix?: string // i18n key prefix (default: 'services.common')
  documentTypes: DocumentType[]
  languagePairs: string[]
  urgency: UrgencyOption[]

  // Legacy props (for backward compatibility with other services)
  standardPriceUsd?: number
  urgencyMultipliers?: { express: number; rush: number }
  adjustments?: { byDocumentType: number[]; byLanguage: number[] }
}
```

### Emits

```typescript
interface CalculatorSubmitEvent {
  selectedDocumentType: DocumentType
  selectedLanguagePair: string
  selectedUrgency: UrgencyOption
  calculatedPriceUsd: number | null
  calculatedPriceFormatted: string  // "от 30$" or "По запросу"
}

emit('submit', event: CalculatorSubmitEvent)
```

### Usage Example

```vue
<PriceCalculatorSection
  key-prefix="services.document-translations.calculator"
  :document-types="category.metadata.calculator.documentTypes"
  :language-pairs="category.metadata.calculator.languagePairs"
  :urgency="category.metadata.calculator.urgency"
  @submit="handleCalculatorSubmit"
/>
```

### Calculation Logic

```typescript
// New logic (when documentTypes is array of objects)
const basePrice = documentTypes[selectedDocumentType].priceUsd
const urgencySurcharge = urgency[selectedUrgency].surcharge
const finalPriceUsd = basePrice === null ? null : basePrice + urgencySurcharge

// Legacy logic (when documentTypes is array of strings)
// Use standardPriceUsd * urgencyMultiplier * adjustments
```

### Rendering Requirements

- 3 dropdowns: Document Type, Language Pair, Urgency
- Price display: large, centered, highlighted background
- Submit button: primary style, full width on mobile
- "По запросу" text when priceUsd is null
- Price updates in real-time (<100ms) when selections change
- Convert to selected currency using `useCurrency` composable

### Edge Cases

1. **priceUsd is null**: Display "По запросу" instead of price, button remains active
2. **Empty documentTypes**: Show error message or disable calculator
3. **Exchange rates not loaded**: Fallback to USD display
4. **Legacy props provided**: Use old calculation logic for backward compatibility

---

## FinalCTASection.vue

### Purpose

Bottom call-to-action section encouraging users to submit application

### Props Interface

```typescript
interface FinalCTASectionProps {
  title: string // CTA title/message
  buttonText: string // Button label
  icon: string // Iconify icon reference
}
```

### Usage Example

```vue
<FinalCTASection
  :title="t('services.document-translations.finalCTA.title')"
  :button-text="t('services.document-translations.finalCTA.button')"
  :icon="t('services.document-translations.finalCTA.icon')"
/>
```

### Behavior

- When button clicked: Open ApplicationModal via `useApplicationModalStore().openModal(...)`
- Pass generic context (no specific service selected)

### Rendering Requirements

- Section background: light gradient or solid color
- Title: centered, large font
- Button: primary style, centered, with icon
- Padding: generous vertical spacing (py-16 or similar)
- Responsive: stack vertically on mobile

---

## HowItWorksSection.vue (Existing, Data Updated)

### Props Interface

```typescript
interface HowItWorksSectionProps {
  steps: Array<{
    title: string
    description: string
    icon: string
  }>
}
```

### Usage Example

```vue
<HowItWorksSection :steps="howItWorksSteps" />

<!-- Computed property in parent -->
<script setup>
const howItWorksSteps = computed(() => {
  const raw = tm('services.document-translations.howItWorks.steps')
  if (!Array.isArray(raw)) return []
  return raw.map((_, index) => ({
    title: t(`services.document-translations.howItWorks.steps.${index}.title`),
    description: t(`services.document-translations.howItWorks.steps.${index}.description`),
    icon: t(`services.document-translations.howItWorks.steps.${index}.icon`),
  }))
})
</script>
```

### Changes from Current

**Before**: Reads from `services.common.howItWorks.steps` (generic steps)  
**After**: Reads from `services.document-translations.howItWorks.steps` (specific steps)

**Step Count**: 4 steps (same as before, but different content)

---

## ServicesWhyChooseUsSection.vue (Existing, Data Updated)

### Props Interface

```typescript
interface ServicesWhyChooseUsSectionProps {
  factors: Array<{
    title: string
    description: string
    icon: string
  }>
}
```

### Usage Example

```vue
<ServicesWhyChooseUsSection :factors="whyChooseUsFactors" />

<!-- Computed property in parent -->
<script setup>
const whyChooseUsFactors = computed(() => {
  const raw = tm('services.document-translations.whyChooseUs.factors')
  if (!Array.isArray(raw)) return []
  return raw.map((_, index) => ({
    title: t(`services.document-translations.whyChooseUs.factors.${index}.title`),
    description: t(`services.document-translations.whyChooseUs.factors.${index}.description`),
    icon: t(`services.document-translations.whyChooseUs.factors.${index}.icon`),
  }))
})
</script>
```

### Changes from Current

**Before**: Reads from `services.common.whyChooseUs.factors` (3 generic factors)  
**After**: Reads from `services.document-translations.whyChooseUs.factors` (5 specific factors)

**Factor Count**: 5 factors (increased from 3)

---

## document-translations.vue (Page Component)

### Template Structure

```vue
<template>
  <ServicePageLayout
    :title="category?.title || t('services.document-translations.title')"
    :subtitle="category?.subtitle || t('services.document-translations.subtitle')"
  >
    <!-- Service Cards Section (NEW) -->
    <template #service-cards>
      <div
        v-if="serviceCards && serviceCards.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <ServiceInfoCard
          v-for="card in serviceCards"
          :key="card.title"
          :title="card.title"
          :description="card.description"
          :icon="card.icon"
        />
      </div>
    </template>

    <!-- Price Calculator Section (MODIFIED) -->
    <template #price-calculator>
      <PriceCalculatorSection
        key-prefix="services.document-translations.calculator"
        :document-types="calculatorDocumentTypes"
        :language-pairs="calculatorLanguagePairs"
        :urgency="calculatorUrgency"
        @submit="handleCalculatorSubmit"
      />
    </template>

    <!-- How It Works Section (UPDATED DATA) -->
    <template #how-it-works>
      <HowItWorksSection :steps="howItWorksSteps" />
    </template>

    <!-- Why Choose Us Section (UPDATED DATA) -->
    <template #why-choose-us>
      <ServicesWhyChooseUsSection :factors="whyChooseUsFactors" />
    </template>

    <!-- Final CTA Section (NEW) -->
    <template #final-cta>
      <FinalCTASection
        :title="t('services.document-translations.finalCTA.title')"
        :button-text="t('services.document-translations.finalCTA.button')"
        :icon="t('services.document-translations.finalCTA.icon')"
      />
    </template>
  </ServicePageLayout>
</template>
```

### Computed Properties

```typescript
// Service cards from metadata
const serviceCards = computed(() => {
  return category.value?.metadata?.serviceCards || []
})

// Calculator data from metadata
const calculatorDocumentTypes = computed(() => {
  return category.value?.metadata?.calculator?.documentTypes || []
})

const calculatorLanguagePairs = computed(() => {
  return category.value?.metadata?.calculator?.languagePairs || []
})

const calculatorUrgency = computed(() => {
  return category.value?.metadata?.calculator?.urgency || []
})

// How It Works steps from i18n
const howItWorksSteps = computed(() => {
  const raw = tm('services.document-translations.howItWorks.steps')
  if (!Array.isArray(raw)) return []
  return raw.map((_, index) => ({
    title: t(`services.document-translations.howItWorks.steps.${index}.title`),
    description: t(`services.document-translations.howItWorks.steps.${index}.description`),
    icon: t(`services.document-translations.howItWorks.steps.${index}.icon`),
  }))
})

// Why Choose Us factors from i18n
const whyChooseUsFactors = computed(() => {
  const raw = tm('services.document-translations.whyChooseUs.factors')
  if (!Array.isArray(raw)) return []
  return raw.map((_, index) => ({
    title: t(`services.document-translations.whyChooseUs.factors.${index}.title`),
    description: t(`services.document-translations.whyChooseUs.factors.${index}.description`),
    icon: t(`services.document-translations.whyChooseUs.factors.${index}.icon`),
  }))
})
```

### Event Handlers

```typescript
const handleCalculatorSubmit = (event: CalculatorSubmitEvent) => {
  const modal = useApplicationModalStore()

  // Construct service name
  const serviceName = `${event.selectedDocumentType.name} + ${event.selectedUrgency.name}`

  // Determine price display
  const priceDisplay =
    event.calculatedPriceUsd === null ? 'by_request' : event.calculatedPriceFormatted

  modal.openModal({
    source: 'service_page',
    description: serviceName,
    serviceContext: {
      subServiceName: serviceName,
      source: 'service-page',
      sourceDescription: `Перевод документа: ${event.selectedDocumentType.name}, срочность: ${event.selectedUrgency.name}`,
      price: priceDisplay,
    },
  })
}
```

### Removed Elements

- ❌ `SubServiceCard` components (lines 7-16)
- ❌ `UniversityRequirementsSection` (lines 31-37)
- ❌ `SampleDocumentsSection` (lines 39-44)
- ❌ `TrustIndicatorBadge` (lines 54-60)

---

## Type Definitions

### Location

`app/types/services.ts` or `server/types/api/services.ts`

### New Types

```typescript
export interface DocumentType {
  name: string
  priceUsd: number | null
}

export interface UrgencyOption {
  name: string
  surcharge: number
}

export interface ServiceCard {
  title: string
  description: string
  icon: string
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

export interface CalculatorSubmitEvent {
  selectedDocumentType: DocumentType
  selectedLanguagePair: string
  selectedUrgency: UrgencyOption
  calculatedPriceUsd: number | null
  calculatedPriceFormatted: string
}
```

### Updated Types

```typescript
// Update existing PriceCalculatorSectionProps
export interface PriceCalculatorSectionProps {
  keyPrefix?: string
  title?: string

  // New structure
  documentTypes?: DocumentType[]
  languagePairs?: string[]
  urgency?: UrgencyOption[]

  // Legacy structure (for backward compatibility)
  documentTypes?: string[] // DEPRECATED: use DocumentType[] instead
  languages?: string[] // DEPRECATED: use languagePairs instead
  urgency?: string[] // DEPRECATED: use UrgencyOption[] instead
  standardPriceUsd?: number
  urgencyMultipliers?: { express: number; rush: number }
  adjustments?: { byDocumentType: number[]; byLanguage: number[] }
}
```

---

## Summary

### New Components (3)

1. **ServiceInfoCard.vue** - Service card without price
2. **FinalCTASection.vue** - Bottom CTA
3. (None - PriceCalculatorSection is modified, not new)

### Modified Components (1)

1. **PriceCalculatorSection.vue** - Add submit button, support new metadata structure

### Updated Components (2)

1. **HowItWorksSection.vue** - Change data source to document-translations specific
2. **ServicesWhyChooseUsSection.vue** - Change data source to document-translations specific (5 factors)

### Page Changes (1)

1. **document-translations.vue** - Remove 4 sections, add 2 new sections, update 2 existing sections
