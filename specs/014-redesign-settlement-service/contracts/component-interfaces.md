# Component Interfaces Contract

**Feature**: `014-redesign-settlement-service`  
**Type**: Component Props & Events Contract  
**Date**: 2025-01-08

## Overview

This document defines the component interfaces (props, events, slots) for all new and modified components in the settlement service page redesign.

---

## PackageCard Component

**File**: `app/components/features/services/PackageCard.vue`

### Props

```typescript
interface PackageCardProps {
  // Package identification
  packageId: SubServiceId // 'relocation-standard' | 'relocation-vip'
  name: string // Package display name (e.g., "Settlement in Turkey")
  price: number // Package price in USD (e.g., 1500)

  // Package content
  services: string[] // List of service descriptions
  includesText?: string // Optional text before services (e.g., "All Standard services plus:")

  // Visual customization
  isVip?: boolean // If true, applies VIP styling (gradient, badge, etc.)
  isHighlighted?: boolean // If true, adds visual emphasis (recommended badge, border)

  // Mobile behavior
  isMobileAccordion?: boolean // If true, renders as accordion on mobile
  defaultExpanded?: boolean // Default accordion state (default: true)
}
```

### Events

```typescript
interface PackageCardEmits {
  // Emitted when user clicks the CTA button
  (
    e: 'apply',
    payload: {
      packageId: SubServiceId
      name: string
      price: number
    },
  ): void
}
```

### Usage Example

```vue
<PackageCard
  package-id="relocation-standard"
  :name="$t('services.relocation-in-turkey.packages.standard.name')"
  :price="1500"
  :services="standardServices"
  :is-mobile-accordion="isMobile"
  @apply="handleApply"
/>
```

### Behavior Contract

1. **Desktop**: Always shows full card with all services visible
2. **Mobile** (isMobileAccordion=true):
   - Header shows package name, price, and chevron icon
   - Services list is collapsible
   - Default state is expanded (defaultExpanded=true)
   - Clicking header toggles expanded state
3. **CTA Button**: Always visible, emits 'apply' event on click
4. **Pricing**: Displays price using CurrencyPrice component with exchange rate support

---

## SettlementBenefitsSection Component

**File**: `app/components/features/services/SettlementBenefitsSection.vue`

### Props

```typescript
interface SettlementBenefitsSectionProps {
  // i18n key prefix for content
  keyPrefix: string // e.g., 'services.relocation-in-turkey.benefits'

  // Optional overrides
  title?: string // Override title from i18n
  content?: string // Override content from i18n
}
```

### No Events

This is a presentational component with no user interactions.

### Usage Example

```vue
<SettlementBenefitsSection key-prefix="services.relocation-in-turkey.benefits" />
```

### Behavior Contract

1. **Layout**: Icon/illustration on left, text content on right (desktop), stacked on mobile
2. **Content**: Fetches title and content from i18n using keyPrefix
3. **Visual Style**: Uses light background with accent color for icon area
4. **Responsive**: Switches to vertical stack below 768px breakpoint

---

## SettlementRisksSection Component

**File**: `app/components/features/services/SettlementRisksSection.vue`

### Props

```typescript
interface SettlementRisksSectionProps {
  // i18n key prefix for content
  keyPrefix: string // e.g., 'services.relocation-in-turkey.risks'

  // Optional overrides
  title?: string // Override title from i18n
  content?: string // Override content from i18n
}
```

### No Events

This is a presentational component with no user interactions.

### Usage Example

```vue
<SettlementRisksSection key-prefix="services.relocation-in-turkey.risks" />
```

### Behavior Contract

1. **Layout**: Card with gradient background, centered text
2. **Content**: Fetches title and content from i18n using keyPrefix
3. **Visual Style**: Dark gradient background with white text for contrast
4. **Responsive**: Full-width card on all screen sizes, padding adjusts for mobile

---

## Modified: ServicePageLayout Component

**File**: `app/components/features/services/ServicePageLayout.vue`

**Change**: No props or behavior changes. Component already provides flexible slot system.

### Relevant Slots

```typescript
interface ServicePageLayoutSlots {
  'sub-services'?: () => any // For package cards (replaces old SubServiceCard loop)
  'why-choose-us'?: () => any // For benefits section (new usage)
  faq?: () => any // For FAQ section (existing, reused)
  // ... other slots not used by this page
}
```

### Usage Example

```vue
<ServicePageLayout :title="category.title" :subtitle="category.subtitle">
  <template #sub-services>
    <!-- Package cards go here -->
  </template>
  
  <template #why-choose-us>
    <!-- Benefits section goes here -->
  </template>
  
  <template #faq>
    <!-- FAQ section goes here -->
  </template>
</ServicePageLayout>
```

---

## Unchanged: ServiceFAQSection Component

**File**: `app/components/features/services/sections/ServiceFAQSection.vue`

**Change**: No changes. Existing component works as-is with new FAQ data.

### Props

```typescript
interface ServiceFAQSectionProps {
  keyPrefix: string // i18n key prefix (e.g., 'services.relocation-in-turkey.faq')
  title?: string // Optional title override
  defaultExpanded?: boolean // Default accordion state
}
```

### Usage Example

```vue
<ServiceFAQSection key-prefix="services.relocation-in-turkey.faq" />
```

---

## Component Composition

### Page Structure

```
ServicePageLayout
  ├─ BaseSectionHeader (title, subtitle)
  │
  ├─ #sub-services slot
  │   ├─ PackageCard (Standard)
  │   └─ PackageCard (VIP)
  │
  ├─ #why-choose-us slot
  │   └─ SettlementBenefitsSection
  │
  ├─ #faq slot (NEW: custom risks section before FAQ)
  │   ├─ SettlementRisksSection
  │   └─ ServiceFAQSection
  │       └─ UiDisplayFAQ
  │           └─ (FAQ items)
```

---

## Styling Contract

### Shared Design Tokens

All components must use:

- **Colors**: From Tailwind theme (primary, secondary, gray-\*)
- **Spacing**: Tailwind spacing scale (mt-4, p-6, etc.)
- **Typography**: Defined text sizes (text-section-title, text-section-subtitle)
- **Shadows**: Defined shadows (shadow-custom, shadow-lg)
- **Borders**: Consistent border radius (rounded-lg, rounded-xl)

### Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Animation

- **Accordion**: 200ms transition on height/rotation
- **Hover**: 150ms transition on color/shadow changes
- **CTA Button**: 100ms active state transition

---

## Accessibility Contract

### PackageCard

- CTA button has `type="button"` and proper label
- Accordion header has `aria-expanded` attribute
- Services list has semantic `<ul>` markup

### BenefitsSection & RisksSection

- Proper heading hierarchy (h2 for section title)
- Sufficient color contrast (WCAG AA minimum)
- Alt text for any decorative images

### FAQ

- Each FAQ item is a button with proper label
- Expanded content has `aria-hidden` when collapsed
- Keyboard navigation supported (Space/Enter to toggle)

---

## Testing Requirements

### Unit Tests

Each component must have tests for:

1. Props validation (required vs optional)
2. Event emission (correct payload structure)
3. i18n integration (fallback to English)
4. Conditional rendering (isVip, isMobileAccordion)

### Integration Tests

Page must have tests for:

1. Correct component composition
2. Data flow from API to components
3. User interactions (CTA click opens modal)
4. Language switching updates all content

### Visual Regression Tests

Screenshots required for:

1. Desktop view (all packages visible)
2. Mobile view (accordion collapsed/expanded)
3. Different languages (en, ru)
4. Hover states on CTA buttons
