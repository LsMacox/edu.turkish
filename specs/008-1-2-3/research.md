# Research: Service Pages with Multi-Currency Support

## Overview

Research for implementing service category pages with sub-services, multi-currency pricing, and application modal enhancement.

## Key Research Areas

### 1. Currency Management in Nuxt 3

**Decision**: Use Pinia store + localStorage for currency persistence

**Rationale**:

- Pinia provides reactive state management across components
- localStorage persists selection across sessions
- Cookie alternative considered but localStorage simpler for client-side preference
- No server-side rendering issues since currency is UI-only preference

**Implementation Pattern**:

```typescript
// stores/currency.ts
export const useCurrencyStore = defineStore('currency', () => {
  const currency = ref<Currency>('USD')

  const setCurrency = (newCurrency: Currency) => {
    currency.value = newCurrency
    if (import.meta.client) {
      localStorage.setItem('preferred-currency', newCurrency)
    }
  }

  const initCurrency = () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('preferred-currency')
      if (saved && isValidCurrency(saved)) {
        currency.value = saved as Currency
      }
    }
  }

  return { currency, setCurrency, initCurrency }
})
```

**Alternatives Considered**:

- Cookies: More complex, unnecessary server access
- URL params: Poor UX, pollutes URLs
- Vuex: Deprecated in favor of Pinia

### 2. Multi-Currency Pricing Structure in i18n

**Decision**: Nested pricing object per sub-service in i18n files

**Rationale**:

- Keeps all content in i18n (constitutional requirement)
- Easy to maintain and translate
- Type-safe with TypeScript interfaces
- No database needed for static pricing

**Structure**:

```json
{
  "services": {
    "trYos": {
      "title": "TR-YÖS Courses",
      "subServices": {
        "basic": {
          "name": "Basic TR-YÖS Preparation",
          "description": "...",
          "pricing": {
            "KZT": "150000",
            "TRY": "5000",
            "RUB": "30000",
            "USD": "300"
          }
        }
      }
    }
  }
}
```

**Alternatives Considered**:

- Database storage: Overkill for static pricing
- Separate pricing file: Harder to maintain translations
- Exchange rate API: Unnecessary complexity, prices are fixed per currency

### 3. Application Modal Enhancement for Sub-Service Context

**Decision**: Pass sub-service identifier via props, display in preferences section

**Rationale**:

- Existing modal already has `userPreferences` prop pattern
- Minimal changes to existing component
- Consistent with "Who are you?" section display pattern
- Sub-service info passed to CRM via `source_description` field

**Implementation**:

```typescript
// Enhanced ApplicationModal props
interface Props {
  isOpen: boolean
  userPreferences?: ApplicationPreferences | null
  subServiceId?: string  // NEW: identifies which sub-service
}

// In modal template - add to preferences display
<div v-if="subServiceId" class="bg-blue-50 ...">
  <p>• {{ $t('modal.applying_for') }}: {{ getSubServiceName(subServiceId) }}</p>
</div>
```

**Alternatives Considered**:

- Separate modal for services: Violates DRY, more maintenance
- Global state for sub-service: Unnecessary complexity
- URL-based detection: Fragile, doesn't work for modal reopens

### 4. Service Page Layout Pattern

**Decision**: Shared `ServicePageLayout` component with slot for sub-services

**Rationale**:

- DRY principle - consistent structure across all 5 pages
- Easy to maintain and update design
- Follows constitutional component architecture
- Minimalist as per requirements

**Pattern**:

```vue
<!-- ServicePageLayout.vue -->
<template>
  <div class="container section-py">
    <BaseSectionHeader :title="title" :subtitle="subtitle" />
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <slot name="sub-services" />
    </div>
  </div>
</template>

<!-- Usage in page -->
<ServicePageLayout :title="$t('services.trYos.title')">
  <template #sub-services>
    <SubServiceCard v-for="..." />
  </template>
</ServicePageLayout>
```

**Alternatives Considered**:

- Individual page layouts: Code duplication
- Dynamic component loading: Unnecessary complexity
- CMS-driven: Violates i18n requirement

### 5. Currency Selector UI/UX in Header

**Decision**: Dropdown similar to language selector, positioned near it

**Rationale**:

- Consistent with existing language selector pattern
- Users expect currency near language
- Mobile-friendly dropdown
- Doesn't clutter header

**Placement**: Right side of header, between language selector and CTA button

**Alternatives Considered**:

- Inline on service pages: Not persistent across navigation
- Settings page: Too hidden, poor UX
- Footer: Too far from pricing

### 6. Sub-Service Identification System

**Decision**: Kebab-case string IDs (e.g., "tr-yos-basic", "translation-diploma")

**Rationale**:

- Human-readable
- URL-friendly (future deep linking potential)
- Easy to use in i18n keys
- Type-safe with TypeScript literal types

**Pattern**:

```typescript
type SubServiceId =
  | 'relocation-visa'
  | 'relocation-housing'
  | 'tr-yos-basic'
  | 'tr-yos-advanced'
  | 'translation-diploma'
// ... etc

interface SubService {
  id: SubServiceId
  pricing: Record<Currency, string>
}
```

**Alternatives Considered**:

- Numeric IDs: Not human-readable
- UUIDs: Overkill, hard to maintain
- Category + index: Fragile on reordering

## Constitutional Compliance

✅ **Architecture**: Pages in `app/pages/services/`, components in `app/components/features/services/`  
✅ **i18n**: All content in `i18n/locales/{locale}/services.json` for 4 locales  
✅ **Imports**: Nuxt auto-import for components, explicit for Pinia stores  
✅ **Data Flow**: No server API needed (static content), modal uses existing pattern  
✅ **Styling**: Tailwind classes, reuse existing design tokens  
✅ **Testing**: Vitest for components, contract tests for i18n structure  
✅ **No DB Changes**: No Prisma schema changes needed

## Dependencies

**Existing** (no new packages):

- Nuxt 3 (pages, auto-import)
- Vue 3 (Composition API)
- Pinia (currency store)
- Tailwind CSS (styling)
- Vitest (testing)

**No new dependencies required** ✅

## Performance Considerations

- **Currency switching**: O(1) reactive update, no API calls
- **Page load**: Static content, SSG-friendly
- **Modal opening**: Reuses existing component, minimal overhead
- **i18n loading**: Lazy-loaded per locale (existing pattern)

## Risk Assessment

**Low Risk**:

- No database changes
- No new external dependencies
- Reuses existing patterns
- Static content only

**Medium Risk**:

- Modal enhancement (existing component modification)
  - Mitigation: Thorough testing, backward compatibility

**Minimal Scope Creep**:

- Well-defined requirements
- Clear boundaries (5 pages, ~15-20 sub-services)
- No backend changes needed

## Next Steps (Phase 1)

1. Define data model for services/sub-services
2. Create i18n contracts for all 4 locales
3. Design component interfaces
4. Create quickstart validation steps
