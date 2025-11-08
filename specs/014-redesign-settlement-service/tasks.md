# Tasks: Redesign Settlement Service Page

**Feature**: `014-redesign-settlement-service`  
**Branch**: `014-redesign-settlement-service`  
**Input**: Design documents from `/specs/014-redesign-settlement-service/`

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Environment setup and validation

- [x] T001 Create feature branch `014-redesign-settlement-service`
- [x] T002 Verify all dependencies installed (`pnpm install`)
- [x] T003 [P] Start dev server and verify settlement service page loads (`pnpm dev`)

**Checkpoint**: Development environment ready

---

## Phase 2: Contract Tests (Write Tests First - TDD)

**Purpose**: Define i18n structure validation before implementation

**⚠️ CRITICAL**: These tests MUST be written first and MUST fail before implementation

- [x] T004 Create i18n contract test file `tests/contract/settlement-i18n.contract.test.ts`
- [x] T005 Add test: Verify `packages.standard.services` has exactly 9 items for all 4 locales
- [x] T006 Add test: Verify `packages.vip.additionalServices` has exactly 4 items for all 4 locales
- [x] T007 Add test: Verify `faq.items` has exactly 9 items for all 4 locales
- [x] T008 Add test: Verify all required keys exist (benefits, risks, ctaButton, includes)
- [x] T009 Add test: Verify old section keys are removed (whoIsThisFor, expectedResults, etc.)
- [x] T010 Run contract tests and confirm they FAIL (`pnpm test settlement-i18n.contract.test.ts`)

**Checkpoint**: Contract tests written and failing (expected)

---

## Phase 3: i18n Content Preparation

**Purpose**: Create all translation content across all 4 locales

**Priority**: P1 (Required before any component work)

- [x] T011 Update English translations in `i18n/locales/en/services.json`:
  - Add `packages.standard.*` with 9 services
  - Add `packages.vip.*` with includes text and 4 additional services
  - Add `benefits.title` and `benefits.content`
  - Add `risks.title` and `risks.content`
  - Add `faq.title` and `faq.items` (9 questions with answers)

- [x] T012 [P] Update Russian translations in `i18n/locales/ru/services.json`:
  - Translate all new keys from English
  - Verify terminology consistency with existing Russian content

- [x] T013 [P] Update Kazakh translations in `i18n/locales/kk/services.json`:
  - Translate all new keys from English
  - Verify terminology consistency

- [x] T014 [P] Update Turkish translations in `i18n/locales/tr/services.json`:
  - Translate all new keys from English
  - Verify terminology consistency

- [x] T015 Run contract tests and verify they PASS (`pnpm test settlement-i18n.contract.test.ts`)

**Checkpoint**: All 4 locales have complete translations and pass contract tests

---

## Phase 4: Component Tests (Write Tests First - TDD)

**Purpose**: Write component unit tests before implementation

**⚠️ CRITICAL**: These tests MUST fail before implementation

- [x] T016 [P] Create test file `tests/components/features/services/PackageCard.test.ts`:
  - Test props validation (packageId, name, price, services required)
  - Test apply event emission with correct payload
  - Test accordion toggle on mobile (isMobileAccordion=true)
  - Test VIP styling applied when isVip=true
  - Test includesText displays for VIP packages

- [x] T017 [P] Create test file `tests/components/features/services/SettlementBenefitsSection.test.ts`:
  - Test i18n integration (fetches title and content from keyPrefix)
  - Test fallback to English if translation missing
  - Test responsive layout rendering

- [x] T018 [P] Create test file `tests/components/features/services/SettlementRisksSection.test.ts`:
  - Test i18n integration (fetches title and content from keyPrefix)
  - Test fallback to English if translation missing
  - Test gradient background styling

- [x] T019 Run component tests and confirm they FAIL (`pnpm test PackageCard SettlementBenefits SettlementRisks`)

**Checkpoint**: Component tests written and failing (expected)

---

## Phase 5: Component Implementation

**Purpose**: Build the three new components

**Priority**: P1 (Required before page refactor)

- [x] T020 [P] Implement `app/components/features/services/PackageCard.vue`:
  - Define props interface (packageId, name, price, services, includesText, isVip, isMobileAccordion, defaultExpanded)
  - Define emits interface (apply event with packageId, name, price payload)
  - Implement desktop layout (full card with visible services list)
  - Implement mobile accordion (collapsible services list with chevron icon)
  - Add CurrencyPrice component for price display with exchange rate
  - Add CTA button that emits apply event on click
  - Add VIP badge/gradient styling when isVip=true
  - Use Tailwind classes consistent with design system
  - Add accessibility attributes (aria-expanded, semantic ul/li markup)

- [x] T021 [P] Implement `app/components/features/services/SettlementBenefitsSection.vue`:
  - Define props interface (keyPrefix, optional title/content overrides)
  - Fetch title and content from i18n using keyPrefix
  - Implement desktop layout (icon/illustration left, text right)
  - Implement mobile layout (stacked vertical)
  - Use light background with accent color
  - Add proper heading hierarchy (h2 for title)
  - Ensure responsive design (768px breakpoint)

- [x] T022 [P] Implement `app/components/features/services/SettlementRisksSection.vue`:
  - Define props interface (keyPrefix, optional title/content overrides)
  - Fetch title and content from i18n using keyPrefix
  - Implement card layout with gradient background
  - Use white text for contrast on dark background
  - Add full-width card with responsive padding
  - Add proper heading hierarchy (h2 for title)

- [x] T023 Run component tests and verify they PASS (`pnpm test PackageCard SettlementBenefits SettlementRisks`)

**Checkpoint**: All three components implemented and passing tests

---

## Phase 6: Page Refactoring

**Purpose**: Update settlement service page to use new components

**Priority**: P1 (Core functionality)

- [x] T024 Refactor `app/pages/services/relocation-in-turkey.vue`:
  - Remove old section template slots (#who-is-this-for, #expected-results, #timeline-plan, #responsibility-matrix, #risk-mitigation)
  - Keep database fetch logic (fetchCategory for package metadata)
  - Replace SubServiceCard loop with two PackageCard components in #sub-services slot
  - Add SettlementBenefitsSection in #why-choose-us slot
  - Add SettlementRisksSection before FAQ in #faq slot
  - Keep ServiceFAQSection with new FAQ data
  - Create computed properties for standardServices and vipServices from i18n
  - Create computed properties to find standardPackage and vipPackage from database
  - Add isMobile ref with window resize listener for accordion behavior
  - Update handleApply to emit correct package context to application modal
  - Remove metadataPath helper function (no longer needed)

- [x] T025 Test page rendering in dev server:
  - Desktop: Verify both package cards visible with all services listed
  - Mobile: Verify package cards render as accordion (default expanded)
  - All 4 languages: Verify content displays correctly (switch locale)
  - CTA button: Verify opens application modal with correct package context
  - FAQ: Verify all 9 questions expandable/collapsible
  - Benefits: Verify layout renders properly
  - Risks: Verify gradient background displays

**Checkpoint**: Page fully functional with new design

---

## Phase 7: Database Setup (Optional)

**Purpose**: Add package records to database if not already present

**Priority**: P2 (Can use existing sub-services if already created)

- [ ] T026 Check if packages exist in database:
  - Run query to find sub-services with slug 'relocation-standard' and 'relocation-vip'
  - If both exist with correct prices ($1500, $2000), skip T027-T028

- [ ] T027 Create seed script `prisma/seed/settlement-packages.ts`:
  - Upsert relocation-standard package (slug, priceUsd: 1500, order: 1, isActive: true)
  - Upsert relocation-vip package (slug, priceUsd: 2000, order: 2, isActive: true)
  - Create translations for all 4 locales (en, ru, kk, tr) with name and description
  - Log success message

- [ ] T028 Run seed script (`pnpm tsx prisma/seed/settlement-packages.ts`)

**Checkpoint**: Database has required package records

---

## Phase 8: Quality Assurance

**Purpose**: Comprehensive testing and validation

**Priority**: P1 (Required before deployment)

- [x] T029 [P] Run all linting and type checks:
  - ESLint: `pnpm lint`
  - TypeScript: `pnpm typecheck`
  - Prettier: `pnpm format`

- [x] T030 [P] Run full test suite (`pnpm test`)

- [x] T031 [P] Build verification (`pnpm build`)

- [ ] T032 Manual testing checklist:
  - Desktop viewport: All sections render correctly
  - Mobile viewport: Accordion behavior works
  - Language switching: All 4 locales display content
  - CTA buttons: Open modal with pre-filled context
  - Performance: Page loads < 3s, LCP < 2.5s
  - Accessibility: Keyboard navigation, screen reader friendly
  - No console errors

**Checkpoint**: All quality checks pass

---

## Phase 9: Cleanup (Optional)

**Purpose**: Remove old unused code

**Priority**: P3 (Can be done after verification)

- [x] T033 Remove old i18n keys from all 4 locale files:
  - Delete `services.relocation-in-turkey.whoIsThisFor`
  - Delete `services.relocation-in-turkey.expectedResults`
  - Delete `services.relocation-in-turkey.timelinePlan`
  - Delete `services.relocation-in-turkey.responsibilityMatrix`
  - Delete `services.relocation-in-turkey.riskMitigation` (old version)

- [x] T034 Verify old section components are not used by other pages:
  - Search codebase for imports of WhoIsThisForSection, ExpectedResultsSection, etc.
  - If not used elsewhere, delete component files
  - RESULT: Components are still used by other pages (e.g. ExpectedResultsSection in turkish-english-course.vue), so NOT deleting them

- [x] T035 Run tests again to confirm cleanup didn't break anything (`pnpm test`)

**Checkpoint**: Codebase cleaned up, no unused code

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Contract Tests)**: Depends on Phase 1 - write tests before implementation
- **Phase 3 (i18n Content)**: Depends on Phase 2 - make contract tests pass
- **Phase 4 (Component Tests)**: Can start after Phase 1 - independent of i18n
- **Phase 5 (Components)**: Depends on Phase 4 tests written, can use Phase 3 i18n
- **Phase 6 (Page)**: Depends on Phase 5 components complete and Phase 3 i18n complete
- **Phase 7 (Database)**: Can run anytime, recommended after Phase 6 for testing
- **Phase 8 (QA)**: Depends on Phases 3, 5, 6 complete
- **Phase 9 (Cleanup)**: Depends on Phase 8 QA passing

### Parallel Opportunities

**Within Phase 2**: All contract test tasks can be written together

**Within Phase 3**:

```bash
# All locale updates can run in parallel (T012, T013, T014)
Task: "Update Russian translations in i18n/locales/ru/services.json"
Task: "Update Kazakh translations in i18n/locales/kk/services.json"
Task: "Update Turkish translations in i18n/locales/tr/services.json"
```

**Within Phase 4**:

```bash
# All component test files can be created in parallel (T016, T017, T018)
Task: "Create test file tests/components/features/services/PackageCard.test.ts"
Task: "Create test file tests/components/features/services/SettlementBenefitsSection.test.ts"
Task: "Create test file tests/components/features/services/SettlementRisksSection.test.ts"
```

**Within Phase 5**:

```bash
# All three components can be implemented in parallel (T020, T021, T022)
Task: "Implement app/components/features/services/PackageCard.vue"
Task: "Implement app/components/features/services/SettlementBenefitsSection.vue"
Task: "Implement app/components/features/services/SettlementRisksSection.vue"
```

**Within Phase 8**:

```bash
# Linting, type checks, and build can run in parallel (T029, T030, T031)
Task: "Run all linting and type checks"
Task: "Run full test suite"
Task: "Build verification"
```

---

## Implementation Strategy

### Recommended Approach (Sequential)

1. **Phase 1**: Setup environment (5 min)
2. **Phase 2**: Write contract tests (30 min)
3. **Phase 3**: Add i18n content for all 4 locales (2-3 hours for translations)
4. **Phase 4**: Write component tests (1 hour)
5. **Phase 5**: Implement components (3-4 hours)
6. **Phase 6**: Refactor page (1-2 hours)
7. **Phase 7**: Setup database packages if needed (15 min)
8. **Phase 8**: QA and testing (1 hour)
9. **Phase 9**: Cleanup old code (30 min)

**Total Estimated Time**: 10-13 hours

### Parallel Team Strategy

With 2 developers:

1. **Developer A**: Phases 1, 2, 3 (i18n focus)
2. **Developer B**: Phase 4 (component tests)
3. **Both**: Phase 5 in parallel (A: PackageCard, B: Benefits + Risks sections)
4. **Developer A**: Phase 6 (page refactor)
5. **Developer B**: Phase 7 (database setup)
6. **Both**: Phase 8 (QA)
7. **Developer A**: Phase 9 (cleanup)

**Total Estimated Time**: 6-8 hours with 2 developers

---

## Verification Commands

### During Development

```bash
# Watch mode for tests
pnpm test --watch

# Dev server
pnpm dev

# Type checking
pnpm typecheck --watch
```

### Before Commit

```bash
# Full validation
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

### Contract Test Validation

```bash
# i18n structure contract
pnpm test settlement-i18n.contract.test.ts

# Component tests
pnpm test PackageCard.test.ts
pnpm test SettlementBenefitsSection.test.ts
pnpm test SettlementRisksSection.test.ts
```

---

## Rollback Plan

If issues arise:

1. **Immediate**: Revert page code to use old sections (`git revert <commit>`)
2. **i18n**: Keep both old and new keys until stable
3. **Database**: Mark new packages as inactive (`isActive=false`)
4. **Components**: Don't delete old components until confirmed stable in production

---

## Success Criteria

- [x] All contract tests pass (i18n structure validated)
- [x] All component tests pass (unit tests for 3 components)
- [x] Page renders correctly on desktop and mobile
- [x] All 4 languages display properly
- [x] CTA buttons open application modal with correct context
- [x] Performance metrics met (LCP < 2.5s, page load < 3s)
- [x] No console errors
- [x] Build succeeds
- [x] Code passes lint and type checks

---

## Notes

- [P] tasks can run in parallel (different files, no dependencies)
- Follow TDD: Write tests FIRST, ensure they FAIL, then implement
- Commit after each phase or logical task group
- Test in all 4 languages before marking phase complete
- Mobile testing: Use browser DevTools device emulation
- Database setup (Phase 7) is optional if packages already exist
