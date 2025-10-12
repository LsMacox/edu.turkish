# Tasks: Service Pages with Multi-Currency Support

**Input**: Design documents from `/home/lsmacox/projects/edu.turkish/specs/008-1-2-3/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Overview

Implement 5 service category pages with sub-services, multi-currency pricing (KZT, TRY, RUB, USD), currency selector in header, and enhanced application modal to show sub-service context.

**Tech Stack**: TypeScript 5.x, Vue 3, Nuxt 3, Pinia, Tailwind CSS, Vitest  
**No Database Changes**: All content via i18n JSON files  
**Estimated Tasks**: 35 tasks

---

## Phase 3.1: Setup & Foundation

- [x] **T001** [P] Create TypeScript types in `app/types/services.ts` (Currency, SubServiceId, ServiceCategoryId, SubService, ServiceCategory, ServiceApplicationContext)

- [x] **T002** [P] Create i18n contract test in `tests/contract/services-i18n.contract.test.ts` to validate services.json structure against JSON Schema from `specs/008-1-2-3/contracts/i18n-services.contract.json`

- [x] **T003** [P] Create currency Pinia store in `app/stores/currency.ts` with currency state, setCurrency(), initCurrency() methods and localStorage persistence

---

## Phase 3.2: i18n Content (Required for Development)

**CRITICAL: Complete before component development**

- [x] **T004** Create English i18n file `i18n/locales/en/services.json` with all 5 service categories, sub-services (3-5 per category), pricing in 4 currencies, and currency selector labels

- [x] **T005** [P] Create Russian i18n file `i18n/locales/ru/services.json` (translate from EN, maintain same structure)

- [x] **T006** [P] Create Kazakh i18n file `i18n/locales/kk/services.json` (translate from EN, maintain same structure)

- [x] **T007** [P] Create Turkish i18n file `i18n/locales/tr/services.json` (translate from EN, maintain same structure)

- [x] **T008** Add modal translations to `i18n/locales/en/components/modals.json`: "applying_for" and "service_context_label" keys

- [x] **T009** [P] Add modal translations to `i18n/locales/ru/components/modals.json`: "applying_for" and "service_context_label" keys

- [x] **T010** [P] Add modal translations to `i18n/locales/kk/components/modals.json`: "applying_for" and "service_context_label" keys

- [x] **T011** [P] Add modal translations to `i18n/locales/tr/components/modals.json`: "applying_for" and "service_context_label" keys

---

## Phase 3.3: Composables & Utilities

- [x] **T012** Create `app/composables/useCurrency.ts` composable that wraps currency store and provides: currency (readonly ref), setCurrency(), getCurrencySymbol(), getCurrencyLabel(), formatPrice(), currencies array

- [x] **T013** [P] Create unit test for useCurrency in `tests/composables/useCurrency.test.ts` (test formatting, symbol retrieval, localStorage persistence)

- [x] **T014** Enhance `app/composables/useApplicationModal.ts` (if exists) or create it with openModalForSubService(subServiceId, subServiceName) method that sets serviceContext in preferences

---

## Phase 3.4: Components - Tests First (TDD)

**CRITICAL: Write tests FIRST, verify they FAIL, then implement**

- [x] **T015** [P] Create component test for CurrencyPrice in `tests/components/features/services/CurrencyPrice.test.ts` (test reactive currency switching, symbol display, price formatting)

- [x] **T016** [P] Create component test for SubServiceCard in `tests/components/features/services/SubServiceCard.test.ts` (test props, apply event emission, currency price display)

- [x] **T017** [P] Create component test for ServicePageLayout in `tests/components/features/services/ServicePageLayout.test.ts` (test slot rendering, title/subtitle display)

---

## Phase 3.5: Components - Implementation

**ONLY after T015-T017 tests are failing**

- [x] **T018** [P] Create `app/components/features/services/CurrencyPrice.vue` component (props: pricing Record<Currency, string>, size?: 'sm'|'md'|'lg'; displays price with symbol based on current currency from store)

- [x] **T019** [P] Create `app/components/features/services/SubServiceCard.vue` component (props: subServiceId, name, description, pricing; emits: apply event; includes CurrencyPrice and "Apply" button)

- [x] **T020** [P] Create `app/components/features/services/ServicePageLayout.vue` component (props: title, subtitle; slot: sub-services; uses BaseSectionHeader and grid layout)

---

## Phase 3.6: Header Enhancement - Currency Selector

- [x] **T021** Enhance `app/components/layout/SiteHeader.vue` to add currency selector dropdown (similar to language selector, positioned between language and CTA button, uses useCurrency composable)

- [x] **T022** [P] Add currency selector styles to ensure mobile responsiveness and consistent design with language selector

---

## Phase 3.7: Modal Enhancement - Sub-Service Context

- [x] **T023** Enhance `app/components/modals/ApplicationModal.vue` to accept optional subServiceContext prop ({ subServiceId, subServiceName }) and display it in blue info box similar to preferences section

- [x] **T024** Update ApplicationModal to include subServiceContext.subServiceName in source_description field when submitting to CRM

- [x] **T025** [P] Create component test for ApplicationModal enhancement in `tests/components/modals/ApplicationModal.test.ts` (test sub-service context display, backward compatibility without context)

---

## Phase 3.8: Service Pages

**Can run in parallel after components are complete**

- [x] **T026** [P] Create `/app/pages/services/relocation-in-turkey.vue` page (use ServicePageLayout, map sub-services from i18n, handle apply clicks with useApplicationModal)

- [x] **T027** [P] Create `/app/pages/services/tr-yos-courses.vue` page (use ServicePageLayout, map sub-services from i18n, handle apply clicks with useApplicationModal)

- [x] **T028** [P] Create `/app/pages/services/sat-courses.vue` page (use ServicePageLayout, map sub-services from i18n, handle apply clicks with useApplicationModal)

- [x] **T029** [P] Create `/app/pages/services/turkish-english-course.vue` page (use ServicePageLayout, map sub-services from i18n, handle apply clicks with useApplicationModal)

- [x] **T030** [P] Create `/app/pages/services/document-translations.vue` page (use ServicePageLayout, map sub-services from i18n, handle apply clicks with useApplicationModal)

---

## Phase 3.9: Integration & Polish

- [x] **T031** Verify SiteHeader services dropdown already exists and highlights active service page correctly (from existing implementation)

- [x] **T032** [P] Run i18n contract test (T002) to verify all services.json files match schema and have complete pricing

- [x] **T033** Initialize currency store on app mount (add to app.vue or plugin) to load from localStorage

- [ ] **T034** [P] Run quickstart validation scenarios from `specs/008-1-2-3/quickstart.md` (navigation, currency switching, modal integration, multi-locale, responsive design)

- [ ] **T035** [P] Performance validation: verify <200ms page load, instant currency switching, smooth dropdown interactions

---

## Dependencies

### Sequential Dependencies

- **T004** (EN i18n) blocks **T005-T007** (other locales - use as reference)
- **T012** (useCurrency) blocks **T015** (CurrencyPrice test)
- **T015-T017** (component tests) block **T018-T020** (component implementations)
- **T018-T020** (components) block **T026-T030** (pages)
- **T021** (header enhancement) blocks **T031** (integration check)
- **T023-T024** (modal enhancement) blocks **T025** (modal test)
- **T033** (store init) blocks **T034** (quickstart validation)

### Parallel Groups

- **Group 1 (Foundation)**: T001, T002, T003 - can run simultaneously
- **Group 2 (i18n RU/KK/TR)**: T005, T006, T007 - can run simultaneously after T004
- **Group 3 (Modal i18n)**: T009, T010, T011 - can run simultaneously after T008
- **Group 4 (Component Tests)**: T015, T016, T017 - can run simultaneously
- **Group 5 (Components)**: T018, T019, T020 - can run simultaneously after tests fail
- **Group 6 (Pages)**: T026, T027, T028, T029, T030 - can run simultaneously after components
- **Group 7 (Validation)**: T032, T034, T035 - can run simultaneously after integration

---

## Parallel Execution Examples

### Foundation Setup (T001-T003)

```bash
# All independent files, can run in parallel
Task 1: "Create TypeScript types in app/types/services.ts"
Task 2: "Create i18n contract test in tests/contract/services-i18n.contract.test.ts"
Task 3: "Create currency Pinia store in app/stores/currency.ts"
```

### i18n Locales (T005-T007)

```bash
# After T004 (EN) is complete, translate in parallel
Task 1: "Create i18n/locales/ru/services.json (translate from EN)"
Task 2: "Create i18n/locales/kk/services.json (translate from EN)"
Task 3: "Create i18n/locales/tr/services.json (translate from EN)"
```

### Component Tests (T015-T017)

```bash
# All independent test files, can run in parallel
Task 1: "Create test for CurrencyPrice in tests/components/features/services/CurrencyPrice.test.ts"
Task 2: "Create test for SubServiceCard in tests/components/features/services/SubServiceCard.test.ts"
Task 3: "Create test for ServicePageLayout in tests/components/features/services/ServicePageLayout.test.ts"
```

### Components (T018-T020)

```bash
# After tests fail, implement in parallel (different files)
Task 1: "Create app/components/features/services/CurrencyPrice.vue"
Task 2: "Create app/components/features/services/SubServiceCard.vue"
Task 3: "Create app/components/features/services/ServicePageLayout.vue"
```

### Service Pages (T026-T030)

```bash
# All independent page files, can run in parallel
Task 1: "Create app/pages/services/relocation-in-turkey.vue"
Task 2: "Create app/pages/services/tr-yos-courses.vue"
Task 3: "Create app/pages/services/sat-courses.vue"
Task 4: "Create app/pages/services/turkish-english-course.vue"
Task 5: "Create app/pages/services/document-translations.vue"
```

---

## Validation Checklist

### Constitutional Compliance

- [x] **i18n**: All new UI strings have `en,ru,kk,tr` keys (T004-T011)
- [x] **Prisma**: No schema changes needed ✅
- [x] **Directus**: Not used (static content via i18n) ✅
- [x] **Partner flows**: Not affected ✅
- [x] **Components**: No manual imports in SFCs; Nuxt auto-import used (T018-T020, T026-T030)
- [x] **Aliases**: `~/*` → `./app/*`, `~~/*` → `./*` (used in all tasks)
- [x] **Runtime Config**: No new config variables needed ✅

### Task Completeness

- [x] All contracts have corresponding tests (T002 for i18n, T015-T017 for components)
- [x] All entities have model tasks (T001 for types, T003 for store)
- [x] All tests come before implementation (T015-T017 before T018-T020)
- [x] Parallel tasks truly independent (verified in parallel groups)
- [x] Each task specifies exact file path ✅
- [x] No task modifies same file as another [P] task ✅

### Coverage

- [x] 5 service pages created (T026-T030)
- [x] 3 new components + tests (T015-T020)
- [x] 2 component enhancements (T021, T023-T024)
- [x] 1 Pinia store (T003)
- [x] 2 composables (T012, T014)
- [x] 4 i18n files per locale (T004-T011)
- [x] Integration testing (T031-T035)

---

## Notes

- **TDD Approach**: Tests (T015-T017) MUST fail before implementing components (T018-T020)
- **i18n First**: Complete T004-T011 early to enable component development
- **No Database**: All content static, no migrations needed
- **Backward Compatibility**: Modal enhancement (T023-T024) maintains compatibility with existing usage
- **Performance**: Target <200ms page load, instant currency switching (validated in T035)
- **Accessibility**: Keyboard navigation and screen reader support (validated in T034)

---

_Aligned with Constitution v1.2.0 - See `/memory/constitution.md`_
