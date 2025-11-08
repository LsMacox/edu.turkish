# Research: Redesign Settlement Service Page

**Feature**: `014-redesign-settlement-service`  
**Phase**: 0 (Discovery & Analysis)  
**Date**: 2025-01-08

## Executive Summary

This research analyzes the current implementation of the settlement service page to inform the redesign. The current page uses a generic `ServicePageLayout` with multiple section slots and fetches data from the database. The redesign will simplify this to two package cards, benefits, risks, and FAQ sections, with all content migrated to i18n files.

### Key Findings

1. **Current Architecture**: Page fetches `ServiceCategory` with `SubService` items from database via `/api/v1/services/[slug]`
2. **Content Location**: Mix of database (metadata JSON) and i18n files for translations
3. **Reusable Components**: `ServiceFAQSection` and `FAQ` components can be reused as-is
4. **No Schema Changes**: Existing `SubService` model already supports basic package info (name, price, slug)
5. **Mobile Support**: Need new accordion component for package cards on mobile

---

## Current Implementation Analysis

### Page Structure

**File**: `app/pages/services/relocation-in-turkey.vue`

The current page:
- Uses `ServicePageLayout` with 7 section slots
- Fetches category data via `useServices().fetchCategory('relocation-in-turkey')`
- Maps database `SubService` items to display format
- Passes metadata paths to section components for i18n keys

**Sections Currently Used**:
1. `#sub-services` - Grid of SubServiceCard components
2. `#who-is-this-for` - WhoIsThisForSection
3. `#expected-results` - ExpectedResultsSection
4. `#timeline-plan` - TimelinePlanSection
5. `#responsibility-matrix` - ResponsibilityMatrixSection
6. `#risk-mitigation` - RiskMitigationSection
7. `#faq` - ServiceFAQSection

### Data Flow

```
Page Component
    ↓
useServices().fetchCategory(slug)
    ↓
$fetch('/api/v1/services/:slug')
    ↓
ServiceRepository.findCategoryBySlug()
    ↓
Prisma: ServiceCategory + SubService + translations
    ↓
Returns: ServiceCategoryDetail
```

### Current i18n Structure

**Location**: `i18n/locales/{locale}/services.json`

Current structure for `relocation-in-turkey`:
- `title`, `subtitle` - Page header
- `whoIsThisFor.*` - Who Is This For section
- `expectedResults.*` - Expected Results section
- `timelinePlan.*` - Timeline Plan section
- `responsibilityMatrix.*` - Responsibility Matrix section
- `riskMitigation.*` - Risk Mitigation section
- `faq.*` - FAQ section

All sections have translations for en, ru, kk, tr.

### Database Schema

**Models**: `ServiceCategory`, `SubService`, `SubServiceTranslation`

```prisma
model SubService {
  id                Int
  serviceCategoryId Int
  slug              String
  type              SubServiceType  // 'offering' or 'calculator'
  priceUsd          Decimal
  deliveryTimeDays  Int?
  order             Int
  isActive          Boolean
  translations      SubServiceTranslation[]
}

model SubServiceTranslation {
  id           Int
  subServiceId Int
  locale       String
  name         String
  description  String?
}
```

**Current Data**: The database currently stores sub-service items with name, description, price, and delivery time for the relocation-in-turkey category.

### Components to Reuse

1. **ServicePageLayout** (`app/components/features/services/ServicePageLayout.vue`)
   - Provides consistent page structure with named slots
   - Handles responsive spacing and layout
   - **Action**: Keep as-is, use different slots

2. **ServiceFAQSection** (`app/components/features/services/sections/ServiceFAQSection.vue`)
   - Wraps FAQ component with i18n integration
   - Accepts `keyPrefix` prop for i18n path
   - **Action**: Keep as-is, use with new FAQ data

3. **FAQ** (`app/components/ui/display/FAQ.vue`)
   - Generic accordion component for FAQ items
   - Supports string and structured answers
   - **Action**: Keep as-is, fully reusable

4. **SubServiceCard** (`app/components/features/services/SubServiceCard.vue`)
   - Displays single service with price and CTA button
   - **Action**: Adapt pattern for new PackageCard component

### Components to Create

1. **PackageCard.vue**
   - Display package name, price, service list, CTA button
   - Support accordion mode for mobile
   - Emit apply event to open application modal

2. **SettlementBenefitsSection.vue**
   - Creative visual presentation of benefits
   - Use icon/illustration + text layout
   - Content from i18n

3. **SettlementRisksSection.vue**
   - Creative visual presentation of risks
   - Use card with background/gradient
   - Content from i18n

### Components to Remove

The following section components are used only by relocation-in-turkey page and will be removed:
- WhoIsThisForSection
- ExpectedResultsSection
- TimelinePlanSection
- ResponsibilityMatrixSection
- RiskMitigationSection (old version, replaced by new SettlementRisksSection)

---

## Technical Constraints

### Performance Requirements

- **LCP Target**: < 2.5s
- **Layout Shifts**: Zero CLS
- **Page Load**: < 3s total

**Current Performance**: Page loads in ~2.8s with database fetch and multiple sections.

**Expected Impact**: Simplifying to fewer components should improve load time to ~2.0-2.5s.

### Mobile Responsiveness

**Current Behavior**: 
- SubServiceCard grid uses `md:grid-cols-2 lg:grid-cols-3`
- All sections stack vertically on mobile

**New Requirement**: 
- Package cards must use accordion/collapsible on mobile
- Default expanded state on mobile
- Need CSS media queries or Vue responsive composable

### Localization

**Supported Languages**: en, ru, kk, tr

**Translation Coverage**:
- All new content must have translations for all 4 languages
- FAQ: 9 questions with full answers
- Benefits: 1 section with content
- Risks: 1 section with content
- Packages: Standard (9 services) + VIP (4 additional services)

**Total Translation Keys**: ~30-40 new keys across all languages

---

## Migration Strategy

### Content Migration

**Remove from i18n**:
```
services.relocation-in-turkey.whoIsThisFor.*
services.relocation-in-turkey.expectedResults.*
services.relocation-in-turkey.timelinePlan.*
services.relocation-in-turkey.responsibilityMatrix.*
services.relocation-in-turkey.riskMitigation.* (old version)
services.relocation-in-turkey.faq.* (old items)
```

**Add to i18n**:
```
services.relocation-in-turkey.packages.standard.name
services.relocation-in-turkey.packages.standard.price
services.relocation-in-turkey.packages.standard.services[0-8]
services.relocation-in-turkey.packages.vip.name
services.relocation-in-turkey.packages.vip.price
services.relocation-in-turkey.packages.vip.services[0-3]
services.relocation-in-turkey.benefits.title
services.relocation-in-turkey.benefits.content
services.relocation-in-turkey.risks.title
services.relocation-in-turkey.risks.content
services.relocation-in-turkey.faq.items[0-8].question
services.relocation-in-turkey.faq.items[0-8].answer
```

### Database Migration

**No schema changes required**. The existing `SubService` model can store basic package info:
- Standard package: slug='relocation-standard', priceUsd=1500
- VIP package: slug='relocation-vip', priceUsd=2000

Service lists will be in i18n, not database.

### Code Changes Summary

| File | Action | Lines Changed |
|------|--------|---------------|
| `app/pages/services/relocation-in-turkey.vue` | Major refactor | ~100 lines |
| `app/components/features/services/PackageCard.vue` | Create | ~150 lines |
| `app/components/features/services/SettlementBenefitsSection.vue` | Create | ~80 lines |
| `app/components/features/services/SettlementRisksSection.vue` | Create | ~80 lines |
| `i18n/locales/en/services.json` | Update | +80, -60 lines |
| `i18n/locales/ru/services.json` | Update | +80, -60 lines |
| `i18n/locales/kk/services.json` | Update | +80, -60 lines |
| `i18n/locales/tr/services.json` | Update | +80, -60 lines |

**Total**: ~3 new components, 1 major refactor, 4 i18n file updates

---

## Risk Assessment

### Technical Risks

1. **Mobile Accordion Implementation**
   - **Risk**: Complex state management for accordion on mobile
   - **Mitigation**: Use simple `ref` with media query detection, default expanded

2. **i18n Key Structure**
   - **Risk**: Breaking changes to i18n structure may affect other pages
   - **Mitigation**: Only modify `relocation-in-turkey` namespace, no shared keys affected

3. **Design Consistency**
   - **Risk**: New visual styles may not match existing design system
   - **Mitigation**: Use existing Tailwind utilities and design tokens

### Content Risks

1. **Translation Completeness**
   - **Risk**: Missing translations for some languages
   - **Mitigation**: Create all 4 language versions simultaneously, use fallback to 'en'

2. **Content Accuracy**
   - **Risk**: Service lists may be incomplete or incorrect
   - **Mitigation**: Review with product owner before implementation

---

## Implementation Recommendations

### Phase 1 Priority

1. Create new components (PackageCard, BenefitsSection, RisksSection)
2. Update i18n files with new content structure
3. Refactor page to use new components

### Phase 2 (Optional)

1. Add animations to accordion transitions
2. Add icons/illustrations to benefits and risks sections
3. A/B test different visual styles

### Testing Strategy

1. **Unit Tests**: Test each new component in isolation
2. **Integration Tests**: Test page with mocked i18n data
3. **Visual Regression**: Screenshot tests for desktop and mobile
4. **i18n Tests**: Verify all 4 languages render correctly

---

## Dependencies

### Internal Dependencies
- `ServicePageLayout` component (existing)
- `ServiceFAQSection` component (existing)
- `FAQ` component (existing)
- `useApplicationModalStore` (existing)
- `useI18n` composable (existing)

### External Dependencies
- None (all using existing packages)

### Blocked By
- None

### Blocking
- None
