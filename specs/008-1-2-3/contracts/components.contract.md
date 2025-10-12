# Component Contracts

## ServicePageLayout.vue

**Purpose**: Shared layout component for all service category pages

**Props**:

```typescript
interface Props {
  title: string // Service category title (from i18n)
  subtitle?: string // Service category subtitle (from i18n)
}
```

**Slots**:

- `sub-services`: Content area for SubServiceCard components

**Emits**: None

**Usage**:

```vue
<ServicePageLayout :title="$t('services.trYos.title')" :subtitle="$t('services.trYos.subtitle')">
  <template #sub-services>
    <SubServiceCard v-for="..." />
  </template>
</ServicePageLayout>
```

---

## SubServiceCard.vue

**Purpose**: Display individual sub-service with description, pricing, and apply button

**Props**:

```typescript
interface Props {
  subServiceId: SubServiceId // Unique identifier
  name: string // Localized name
  description: string // Localized description
  pricing: Record<Currency, string> // Prices in all currencies
}
```

**Emits**:

```typescript
{
  (e: 'apply', subServiceId: SubServiceId, name: string): void
}
```

**Behavior**:

- Displays name and description
- Shows price in currently selected currency (from useCurrencyStore)
- "Apply" button emits apply event with sub-service details

**Usage**:

```vue
<SubServiceCard
  :sub-service-id="'tr-yos-basic-preparation'"
  :name="$t('services.trYos.subServices.trYosBasicPreparation.name')"
  :description="$t('services.trYos.subServices.trYosBasicPreparation.description')"
  :pricing="{ KZT: '250,000', TRY: '8,500', RUB: '50,000', USD: '500' }"
  @apply="handleApply"
/>
```

---

## CurrencyPrice.vue

**Purpose**: Display price with currency symbol, reactive to currency selection

**Props**:

```typescript
interface Props {
  pricing: Record<Currency, string> // All currency prices
  size?: 'sm' | 'md' | 'lg' // Display size (default: 'md')
}
```

**Emits**: None

**Behavior**:

- Reads current currency from useCurrencyStore
- Displays price with appropriate symbol
- Updates reactively when currency changes

**Usage**:

```vue
<CurrencyPrice :pricing="{ KZT: '250,000', TRY: '8,500', RUB: '50,000', USD: '500' }" size="lg" />
<!-- Renders: $500 (if USD selected) -->
```

---

## SiteHeader.vue (Enhancement)

**Existing Component - Changes Required**:

**New State**:

```typescript
const currencyStore = useCurrencyStore()
const showCurrencyDropdown = ref(false)
```

**New UI Elements**:

- Currency dropdown button (similar to language selector)
- Currency options dropdown menu
- Position: Between language selector and CTA button

**Behavior**:

- Click to toggle currency dropdown
- Select currency → update store → close dropdown
- Persist selection via store (localStorage)

---

## ApplicationModal.vue (Enhancement)

**Existing Component - Changes Required**:

**Enhanced Props**:

```typescript
interface Props {
  isOpen: boolean
  userPreferences?: ApplicationPreferences | null
  subServiceContext?: {
    // NEW
    subServiceId: SubServiceId
    subServiceName: string
  } | null
}
```

**New Display Section**:

```vue
<!-- Add to preferences display area -->
<div v-if="subServiceContext" class="bg-blue-50 border border-blue-200 rounded-xl p-4">
  <h4 class="text-base md:text-sm font-semibold text-blue-800 mb-2.5">
    {{ $t('modal.service_context_label') }}
  </h4>
  <p class="text-sm md:text-xs text-blue-700">
    • {{ $t('modal.applying_for') }}: {{ subServiceContext.subServiceName }}
  </p>
</div>
```

**Behavior**:

- When `subServiceContext` provided, display selected sub-service
- Include sub-service info in form submission (source_description field)
- Backward compatible (works without subServiceContext)

---

## Contract Test Requirements

All components must:

1. Accept props matching TypeScript interfaces
2. Emit events with correct payloads
3. Handle missing/optional props gracefully
4. Be responsive (mobile, tablet, desktop)
5. Follow Tailwind styling conventions
6. Use Nuxt auto-import (no manual component imports)
7. Support all 4 locales (en, ru, kk, tr)
