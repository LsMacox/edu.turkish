# Quickstart Guide: Redesign Settlement Service Page

**Feature**: `014-redesign-settlement-service`  
**Branch**: `014-redesign-settlement-service`  
**Date**: 2025-01-08

## Overview

This guide provides step-by-step instructions for implementing the settlement service page redesign. Follow the order below to ensure dependencies are satisfied.

---

## Prerequisites

Before starting implementation:

1. ✅ Constitution compliance verified (see `plan.md`)
2. ✅ Research completed (see `research.md`)
3. ✅ Data model defined (see `data-model.md`)
4. ✅ Contracts specified (see `contracts/`)
5. ✅ Branch created: `014-redesign-settlement-service`

### Environment Setup

```bash
# Ensure you're on the feature branch
git checkout 014-redesign-settlement-service

# Install dependencies (if needed)
pnpm install

# Start dev server
pnpm dev

# Run tests in watch mode (separate terminal)
pnpm test
```

---

## Implementation Order

### Phase 1: i18n Content Preparation

**Priority**: P1 (Required before any component work)

Create all i18n translations for the new structure across all 4 locales.

#### Steps

1. **Update English** (`i18n/locales/en/services.json`):
   - Add `packages.standard.*` with 9 services
   - Add `packages.vip.*` with 4 additional services
   - Add `benefits.*` section
   - Add `risks.*` section
   - Add `faq.*` with 9 questions
   - Remove old section keys (keep for rollback until page is updated)

2. **Update Russian** (`i18n/locales/ru/services.json`):
   - Translate all new keys from English
   - Verify terminology consistency with existing Russian content

3. **Update Kazakh** (`i18n/locales/kk/services.json`):
   - Translate all new keys from English
   - Verify terminology consistency

4. **Update Turkish** (`i18n/locales/tr/services.json`):
   - Translate all new keys from English
   - Verify terminology consistency

#### Validation

```bash
# Run i18n contract tests
pnpm test tests/contract/settlement-i18n.contract.test.ts
```

Expected: All 4 locales pass structure validation (9 standard services, 4 VIP services, 9 FAQ items).

#### Reference

See `contracts/i18n-structure.md` for complete key structure and examples.

---

### Phase 2: Create New Components

**Priority**: P1 (Required before page refactor)

Build the three new components with tests.

#### 2.1 PackageCard Component

**File**: `app/components/features/services/PackageCard.vue`

**Implementation checklist**:
- [ ] Create component file
- [ ] Define props interface (packageId, name, price, services, includesText, isVip, isMobileAccordion, defaultExpanded)
- [ ] Define emits interface (apply event)
- [ ] Implement desktop layout (full card with visible services)
- [ ] Implement mobile accordion (collapsible services list)
- [ ] Add CurrencyPrice component for price display
- [ ] Add CTA button with apply event emission
- [ ] Add VIP badge/styling when isVip=true
- [ ] Add Tailwind styles (consistent with design system)

**Test file**: `tests/components/features/services/PackageCard.test.ts`

```bash
# Create test file
touch tests/components/features/services/PackageCard.test.ts

# Run tests
pnpm test PackageCard
```

**Test cases**:
- Props validation
- Event emission on CTA click
- Accordion toggle on mobile
- VIP styling applied correctly
- Price displays with currency conversion

#### 2.2 SettlementBenefitsSection Component

**File**: `app/components/features/services/SettlementBenefitsSection.vue`

**Implementation checklist**:
- [ ] Create component file
- [ ] Define props interface (keyPrefix, optional title/content overrides)
- [ ] Fetch content from i18n using keyPrefix
- [ ] Implement layout (icon/illustration + text on desktop, stacked on mobile)
- [ ] Add light background with accent color
- [ ] Ensure responsive design (switches at 768px breakpoint)

**Test file**: `tests/components/features/services/SettlementBenefitsSection.test.ts`

```bash
# Create test file
touch tests/components/features/services/SettlementBenefitsSection.test.ts

# Run tests
pnpm test SettlementBenefitsSection
```

**Test cases**:
- i18n integration (fetches title and content)
- Fallback to English if translation missing
- Responsive layout (desktop vs mobile)

#### 2.3 SettlementRisksSection Component

**File**: `app/components/features/services/SettlementRisksSection.vue`

**Implementation checklist**:
- [ ] Create component file
- [ ] Define props interface (keyPrefix, optional title/content overrides)
- [ ] Fetch content from i18n using keyPrefix
- [ ] Implement card layout with gradient background
- [ ] Use white text for contrast
- [ ] Ensure full-width card with responsive padding

**Test file**: `tests/components/features/services/SettlementRisksSection.test.ts`

```bash
# Create test file
touch tests/components/features/services/SettlementRisksSection.test.ts

# Run tests
pnpm test SettlementRisksSection
```

**Test cases**:
- i18n integration (fetches title and content)
- Fallback to English if translation missing
- Gradient background applied

---

### Phase 3: Refactor Page

**Priority**: P1 (Core functionality)

Update the settlement service page to use new components and structure.

#### File: `app/pages/services/relocation-in-turkey.vue`

**Implementation checklist**:
- [ ] Remove old section template slots (who-is-this-for, expected-results, timeline-plan, responsibility-matrix, risk-mitigation)
- [ ] Keep database fetch logic (fetchCategory still needed for package metadata)
- [ ] Replace SubServiceCard loop with PackageCard components
- [ ] Add Benefits section in #why-choose-us slot
- [ ] Add Risks section (before FAQ)
- [ ] Keep FAQ section (reuse ServiceFAQSection with new data)
- [ ] Update handleApply to emit correct package context
- [ ] Remove metadataPath helper function (no longer needed)
- [ ] Test mobile accordion behavior

**Code structure**:

```vue
<template>
  <ServicePageLayout :title="category?.title" :subtitle="category?.subtitle">
    <template #sub-services>
      <!-- Standard Package -->
      <PackageCard
        package-id="relocation-standard"
        :name="standardPackage.name"
        :price="standardPackage.priceUsd"
        :services="standardServices"
        :is-mobile-accordion="isMobile"
        @apply="handleApply"
      />
      
      <!-- VIP Package -->
      <PackageCard
        package-id="relocation-vip"
        :name="vipPackage.name"
        :price="vipPackage.priceUsd"
        :services="vipServices"
        :includes-text="$t('services.relocation-in-turkey.packages.vip.includes')"
        is-vip
        :is-mobile-accordion="isMobile"
        @apply="handleApply"
      />
    </template>

    <template #why-choose-us>
      <SettlementBenefitsSection
        key-prefix="services.relocation-in-turkey.benefits"
      />
    </template>

    <!-- Custom slot usage: insert risks before FAQ -->
    <template #faq>
      <SettlementRisksSection
        key-prefix="services.relocation-in-turkey.risks"
      />
      
      <ServiceFAQSection
        key-prefix="services.relocation-in-turkey.faq"
        class="mt-16"
      />
    </template>
  </ServicePageLayout>
</template>

<script setup lang="ts">
// ... existing imports and setup

// Compute services from i18n
const standardServices = computed(() => 
  tm('services.relocation-in-turkey.packages.standard.services') as string[]
)

const vipServices = computed(() => {
  const standard = tm('services.relocation-in-turkey.packages.standard.services') as string[]
  const additional = tm('services.relocation-in-turkey.packages.vip.additionalServices') as string[]
  return [...standard, ...additional]
})

// Map database packages
const standardPackage = computed(() => 
  category.value?.subServices.find(s => s.slug === 'relocation-standard')
)

const vipPackage = computed(() => 
  category.value?.subServices.find(s => s.slug === 'relocation-vip')
)

// Detect mobile for accordion
const isMobile = ref(false)
onMounted(() => {
  isMobile.value = window.innerWidth < 768
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
  })
})
</script>
```

---

### Phase 4: Database Setup (Optional)

**Priority**: P2 (Can use existing sub-services if already created)

If the database doesn't have the two package records, add them via Prisma seed or manual SQL.

#### Option A: Prisma Seed Script

**File**: `prisma/seed/settlement-packages.ts`

```typescript
import { prisma } from '../../lib/prisma'

export async function seedSettlementPackages() {
  const category = await prisma.serviceCategory.findUnique({
    where: { slug: 'relocation-in-turkey' }
  })
  
  if (!category) {
    console.error('relocation-in-turkey category not found')
    return
  }

  // Standard package
  await prisma.subService.upsert({
    where: {
      serviceCategoryId_slug: {
        serviceCategoryId: category.id,
        slug: 'relocation-standard'
      }
    },
    update: { priceUsd: 1500, order: 1 },
    create: {
      serviceCategoryId: category.id,
      slug: 'relocation-standard',
      type: 'offering',
      priceUsd: 1500,
      order: 1,
      isActive: true,
      translations: {
        create: [
          { locale: 'en', name: 'Settlement in Turkey', description: 'Standard package' },
          { locale: 'ru', name: 'Обустройство по Турции', description: 'Стандартный пакет' },
          { locale: 'kk', name: 'Түркиядағы орналастыру', description: 'Стандартты пакет' },
          { locale: 'tr', name: "Türkiye'de Yerleşim", description: 'Standart paket' }
        ]
      }
    }
  })

  // VIP package
  await prisma.subService.upsert({
    where: {
      serviceCategoryId_slug: {
        serviceCategoryId: category.id,
        slug: 'relocation-vip'
      }
    },
    update: { priceUsd: 2000, order: 2 },
    create: {
      serviceCategoryId: category.id,
      slug: 'relocation-vip',
      type: 'offering',
      priceUsd: 2000,
      order: 2,
      isActive: true,
      translations: {
        create: [
          { locale: 'en', name: 'VIP Settlement in Turkey', description: 'Premium package' },
          { locale: 'ru', name: 'Вип обустройство по Турции', description: 'Премиум пакет' },
          { locale: 'kk', name: 'VIP Түркиядағы орналастыру', description: 'Премиум пакет' },
          { locale: 'tr', name: "VIP Türkiye'de Yerleşim", description: 'Premium paket' }
        ]
      }
    }
  })
  
  console.log('Settlement packages seeded')
}
```

Run seed:
```bash
pnpm tsx prisma/seed/settlement-packages.ts
```

#### Option B: Manual SQL

```sql
-- Get category ID
SELECT id FROM service_categories WHERE slug = 'relocation-in-turkey';

-- Insert standard package (replace CATEGORY_ID with actual ID)
INSERT INTO sub_services (service_category_id, slug, type, price_usd, "order", is_active)
VALUES (CATEGORY_ID, 'relocation-standard', 'offering', 1500.00, 1, true)
RETURNING id;

-- Insert VIP package
INSERT INTO sub_services (service_category_id, slug, type, price_usd, "order", is_active)
VALUES (CATEGORY_ID, 'relocation-vip', 'offering', 2000.00, 2, true)
RETURNING id;

-- Insert translations (replace SUB_SERVICE_ID with IDs from above)
INSERT INTO sub_service_translations (sub_service_id, locale, name, description)
VALUES
  (STANDARD_ID, 'en', 'Settlement in Turkey', 'Standard package'),
  (STANDARD_ID, 'ru', 'Обустройство по Турции', 'Стандартный пакет'),
  (STANDARD_ID, 'kk', 'Түркиядағы орналастыру', 'Стандартты пакет'),
  (STANDARD_ID, 'tr', 'Türkiye''de Yerleşim', 'Standart paket'),
  (VIP_ID, 'en', 'VIP Settlement in Turkey', 'Premium package'),
  (VIP_ID, 'ru', 'Вип обустройство по Турции', 'Премиум пакет'),
  (VIP_ID, 'kk', 'VIP Түркиядағы орналастыру', 'Премиум пакет'),
  (VIP_ID, 'tr', 'VIP Türkiye''de Yerleşim', 'Premium paket');
```

---

### Phase 5: Cleanup (Optional)

**Priority**: P3 (Can be done after verification)

Remove old unused components and i18n keys.

#### Components to Remove

```bash
# Remove old section components (if not used by other pages)
rm app/components/features/services/sections/WhoIsThisForSection.vue
rm app/components/features/services/sections/ExpectedResultsSection.vue
rm app/components/features/services/sections/TimelinePlanSection.vue
rm app/components/features/services/sections/ResponsibilityMatrixSection.vue
rm app/components/features/services/sections/RiskMitigationSection.vue
```

**Note**: Verify these components are not imported by other service pages before deleting!

#### i18n Cleanup

Remove old section keys from all 4 locale files after confirming new page works:

```json
// DELETE from services.relocation-in-turkey:
{
  "whoIsThisFor": { ... },
  "expectedResults": { ... },
  "timelinePlan": { ... },
  "responsibilityMatrix": { ... },
  "riskMitigation": { ... }
}
```

---

## Testing Strategy

### Unit Tests

```bash
# Test individual components
pnpm test PackageCard.test.ts
pnpm test SettlementBenefitsSection.test.ts
pnpm test SettlementRisksSection.test.ts

# Test i18n contract
pnpm test settlement-i18n.contract.test.ts
```

### Integration Tests

```bash
# Test full page rendering (create if needed)
pnpm test relocation-in-turkey.page.test.ts
```

### Manual Testing Checklist

- [ ] Desktop: Both package cards visible, services listed
- [ ] Mobile: Package cards render as accordion, default expanded
- [ ] All 4 languages: Content displays correctly (en, ru, kk, tr)
- [ ] CTA button: Opens application modal with correct package context
- [ ] FAQ: All 9 questions expandable/collapsible
- [ ] Benefits: Creative visual layout renders properly
- [ ] Risks: Gradient background displays correctly
- [ ] Performance: Page loads in < 3s, LCP < 2.5s

### Visual Regression Tests (Optional)

```bash
# Take screenshots for comparison
pnpm test:visual settlement-service-desktop.spec.ts
pnpm test:visual settlement-service-mobile.spec.ts
```

---

## Verification Checklist

Before marking feature complete:

### Code Quality

- [ ] ESLint passes: `pnpm lint`
- [ ] TypeScript passes: `pnpm typecheck`
- [ ] Prettier formatted: `pnpm format`
- [ ] Tests pass: `pnpm test`
- [ ] Build succeeds: `pnpm build`

### Functionality

- [ ] Page loads without errors
- [ ] All 4 languages display correctly
- [ ] Package cards render on desktop and mobile
- [ ] Mobile accordion works (toggle collapse/expand)
- [ ] CTA buttons open application modal with pre-filled context
- [ ] FAQ accordion works
- [ ] Benefits and Risks sections display

### Performance

- [ ] Lighthouse score > 90
- [ ] LCP < 2.5s
- [ ] No console errors
- [ ] No layout shifts (CLS = 0)

### i18n

- [ ] All 4 locales have required keys
- [ ] Contract tests pass
- [ ] No missing translations
- [ ] Content displays correctly in all languages

### Database

- [ ] Two package records exist (relocation-standard, relocation-vip)
- [ ] Prices match spec ($1500, $2000)
- [ ] All 4 language translations present

---

## Troubleshooting

### Issue: Package cards not rendering

**Symptom**: Empty grid where package cards should be

**Cause**: Database doesn't have package records or API returns empty subServices array

**Fix**:
```bash
# Check database
pnpm tsx -e "import { prisma } from './lib/prisma'; prisma.subService.findMany({ where: { serviceCategory: { slug: 'relocation-in-turkey' } } }).then(console.log)"

# Run seed if missing
pnpm tsx prisma/seed/settlement-packages.ts
```

### Issue: i18n keys not found

**Symptom**: `[services.relocation-in-turkey.packages.standard.services]` displayed instead of services list

**Cause**: i18n keys not added or incorrect structure

**Fix**:
```bash
# Verify key exists in all locales
grep -r "packages.standard.services" i18n/locales/

# Run contract test to identify missing keys
pnpm test settlement-i18n.contract.test.ts
```

### Issue: Mobile accordion not working

**Symptom**: Package cards don't collapse on mobile

**Cause**: `isMobile` ref not updating or accordion logic not implemented

**Fix**:
- Check `isMobileAccordion` prop is passed to PackageCard
- Verify window resize listener is attached
- Test with browser DevTools mobile emulation

### Issue: TypeScript errors

**Symptom**: Build fails with type errors

**Cause**: Props interface doesn't match usage or SubServiceId type missing new slugs

**Fix**:
```typescript
// Add to app/types/services.ts
export type SubServiceId = 
  | 'relocation-standard'
  | 'relocation-vip'
  | ... // other IDs
```

---

## Deployment Checklist

Before deploying to production:

- [ ] Feature branch tested locally
- [ ] All tests pass in CI
- [ ] Database migration applied (if needed)
- [ ] i18n keys verified in all locales
- [ ] Performance benchmarks met
- [ ] Peer review completed
- [ ] Staging environment tested
- [ ] Rollback plan prepared

### Rollback Plan

If issues arise in production:

1. **Immediate**: Revert page code to use old sections
2. **Database**: Mark new packages as inactive (isActive=false)
3. **i18n**: Keep both old and new keys until stable
4. **Components**: Don't delete old components until confirmed stable

---

## Next Steps

After implementation complete:

1. **Create tasks.md** via `/tasks` command for detailed implementation tasks
2. **Monitor**: Track page performance and user engagement
3. **A/B Test**: Consider testing different visual styles for benefits/risks
4. **Iterate**: Gather feedback and refine content based on conversion metrics
