# Tasks: Redesign Translation Documents Service Page

**Input**: Design documents from `/specs/015-redesign-translation-documents/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Branch**: `015-redesign-translation-documents`

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Checkout feature branch `015-redesign-translation-documents` from main
- [x] T002 Verify development environment (Docker, pnpm, database running)
- [x] T003 [P] Install dependencies if needed (`pnpm install`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database & Seed Data

- [x] T004 Update `prisma/seed/services.ts` (lines 196-294): Replace `priceCalculator` metadata with new `calculator` structure for document-translations category
- [x] T005 [P] Add `serviceCards` array (7 cards) to metadata in seed file for Russian locale
- [x] T006 [P] Add `serviceCards` array (7 cards) to metadata in seed file for English locale
- [x] T007 [P] Add `serviceCards` array (7 cards) to metadata in seed file for Kazakh locale
- [x] T008 [P] Add `serviceCards` array (7 cards) to metadata in seed file for Turkish locale
- [x] T009 Run seed script `pnpm db:seed` and verify metadata in database using `pnpm db:studio`

### i18n Updates

- [x] T010 [P] Add `services.document-translations.*` keys to `i18n/locales/ru/services.json` (calculator, howItWorks, whyChooseUs, finalCTA sections)
- [x] T011 [P] Add `services.document-translations.*` keys to `i18n/locales/en/services.json` (translate from Russian)
- [x] T012 [P] Add `services.document-translations.*` keys to `i18n/locales/kk/services.json` (translate from Russian)
- [x] T013 [P] Add `services.document-translations.*` keys to `i18n/locales/tr/services.json` (translate from Russian)
- [x] T014 Run `pnpm i18n:check` to verify all keys are present

### Type Definitions

- [x] T015 [P] Add new types to `app/types/services.ts`: DocumentType, UrgencyOption, ServiceCard, CalculatorMetadata, ServiceCategoryMetadata, CalculatorSubmitEvent
- [x] T016 [P] Update PriceCalculatorSectionProps interface to support both new and legacy structures (backward compatibility)
- [x] T017 Run `pnpm typecheck` to verify no type errors

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Quick Price Estimation (Priority: P1) 🎯 MVP

**Goal**: Users can select document type and urgency, see price estimate, and submit application via calculator

**Independent Test**: Visit page, select "Диплом" + "Срочно", see price "от 55$", click submit button, verify modal opens with correct context

### Tests for User Story 1

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T018 [P] [US1] Create contract test in `tests/contract/calculator-metadata.contract.test.ts` to validate new metadata structure (calculator.documentTypes, calculator.urgency)
- [ ] T019 [P] [US1] Create unit test in `tests/unit/calculator-price.test.ts` to test price calculation logic (basePrice + surcharge)
- [ ] T020 [P] [US1] Create component test in `tests/components/features/PriceCalculatorSection.test.ts` to test submit button and event emission

### Implementation for User Story 1

- [x] T021 [US1] Modify `app/components/features/services/sections/PriceCalculatorSection.vue`: Add support for new DocumentType[] and UrgencyOption[] props
- [x] T022 [US1] Add price calculation logic for new structure in PriceCalculatorSection.vue (basePrice + surcharge instead of multipliers)
- [x] T023 [US1] Add "Submit Application" button to PriceCalculatorSection.vue below price display
- [x] T024 [US1] Handle "Остальное" edge case (priceUsd: null) - display "По запросу" text
- [x] T025 [US1] Emit 'submit' event from PriceCalculatorSection with CalculatorSubmitEvent data
- [x] T026 [US1] Add `handleCalculatorSubmit` method to `app/pages/services/document-translations.vue` to open ApplicationModal with correct context
- [x] T027 [US1] Update PriceCalculatorSection props in document-translations.vue to pass new metadata structure
- [ ] T028 [US1] Test calculator interaction: select options, verify price updates, click submit, verify modal opens

**Checkpoint**: At this point, User Story 1 should be fully functional - calculator shows prices and submits applications

---

## Phase 4: User Story 2 - Service Discovery and Selection (Priority: P2)

**Goal**: Users can view 7 service cards with descriptions to understand what document types can be translated

**Independent Test**: Scroll to service cards section, verify all 7 cards display with titles, descriptions, and icons (no prices)

### Tests for User Story 2

- [ ] T029 [P] [US2] Create component test in `tests/components/features/ServiceInfoCard.test.ts` to test card rendering (title, description, icon)
- [ ] T030 [P] [US2] Create integration test to verify serviceCards metadata is read correctly from database

### Implementation for User Story 2

- [x] T031 [P] [US2] Create new component `app/components/features/services/ServiceInfoCard.vue` with props: title, description, icon
- [x] T032 [US2] Implement ServiceInfoCard styling: white card, shadow, icon at top, hover effect, responsive layout
- [x] T033 [US2] Add service cards section to `app/pages/services/document-translations.vue`: render ServiceInfoCard from metadata.serviceCards
- [x] T034 [US2] Add fallback logic: if metadata.serviceCards is missing, skip section entirely (don't render)
- [x] T035 [US2] Remove existing SubServiceCard components (lines 6-17) from document-translations.vue
- [ ] T036 [US2] Test service cards section: verify 7 cards render, test responsive layout on mobile/tablet/desktop

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - calculator works, service cards display

---

## Phase 5: User Story 3 - Process Understanding (Priority: P2)

**Goal**: Users can understand the 4-step process for document translation service

**Independent Test**: Scroll to "How It Works" section, verify 4 steps display with specific text about uploading documents, clarification, translation, and delivery

### Tests for User Story 3

- [ ] T037 [P] [US3] Create integration test to verify howItWorks i18n keys are read correctly for all 4 locales

### Implementation for User Story 3

- [x] T038 [US3] Update `howItWorksSteps` computed property in `app/pages/services/document-translations.vue` to read from `services.document-translations.howItWorks.steps` instead of `services.common.howItWorks.steps`
- [ ] T039 [US3] Verify HowItWorksSection component renders 4 steps with correct titles, descriptions, and icons
- [ ] T040 [US3] Test "How It Works" section in all 4 locales (en, ru, kk, tr)

**Checkpoint**: All three user stories should now work independently - calculator, service cards, and process steps all functional

---

## Phase 6: User Story 4 - Trust Building (Priority: P3)

**Goal**: Users see 5 trust factors and final CTA to build confidence in service

**Independent Test**: Scroll to "Why Choose Us" section, verify 5 factors display, scroll to bottom and verify final CTA section appears

### Tests for User Story 4

- [ ] T041 [P] [US4] Create component test in `tests/components/features/FinalCTASection.test.ts` to test CTA button opens modal
- [ ] T042 [P] [US4] Create integration test to verify whyChooseUs i18n keys are read correctly with 5 factors

### Implementation for User Story 4

- [x] T043 [P] [US4] Create new component `app/components/features/services/FinalCTASection.vue` with props: title, buttonText, icon
- [x] T044 [US4] Implement FinalCTASection styling: gradient/solid background, centered layout, primary button with icon
- [x] T045 [US4] Add click handler in FinalCTASection to open ApplicationModal via useApplicationModalStore()
- [x] T046 [US4] Update `whyChooseUsFactors` computed property in `app/pages/services/document-translations.vue` to read from `services.document-translations.whyChooseUs.factors` (5 factors instead of 3)
- [x] T047 [US4] Add FinalCTASection to bottom of document-translations.vue template
- [x] T048 [US4] Remove UniversityRequirementsSection, SampleDocumentsSection, TrustIndicatorBadge components from document-translations.vue (lines 31-60)
- [ ] T049 [US4] Test "Why Choose Us" section displays 5 factors in all locales
- [ ] T050 [US4] Test final CTA button opens modal

**Checkpoint**: All four user stories complete - users can estimate price, view services, understand process, and see trust factors

---

## Phase 7: User Story 5 - Mobile-First Experience (Priority: P3)

**Goal**: All sections render correctly on mobile devices without horizontal scroll

**Independent Test**: Open page on mobile viewport (320px, 375px, 768px), scroll through all sections, verify no layout breaks

### Tests for User Story 5

- [ ] T051 [P] [US5] Create visual regression test or manual test checklist for mobile viewports (320px, 375px, 425px, 768px)
- [ ] T052 [P] [US5] Create visual regression test for tablet viewports (768px, 1024px)
- [ ] T053 [P] [US5] Create visual regression test for desktop viewports (1280px, 1440px)

### Implementation for User Story 5

- [x] T054 [US5] Verify responsive design for service cards: full width on mobile (<768px), 2 columns on tablet, 3 columns on desktop
- [x] T055 [US5] Verify responsive design for calculator: dropdowns are touch-friendly (min 44x44px), price display is readable on small screens
- [x] T056 [US5] Verify responsive design for HowItWorks section: steps stack vertically on mobile
- [x] T057 [US5] Verify responsive design for WhyChooseUs section: factors stack vertically on mobile
- [ ] T058 [US5] Test all sections on actual mobile devices (iOS Safari, Android Chrome) if possible
- [ ] T059 [US5] Fix any layout issues discovered during mobile testing

**Checkpoint**: All user stories complete and mobile-responsive

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality checks

- [ ] T060 [P] Run full test suite `pnpm test` and verify all tests pass
- [x] T061 [P] Run linter `pnpm lint` and fix any issues with `pnpm lint:fix`
- [x] T062 [P] Run formatter `pnpm format:check` and fix with `pnpm format`
- [x] T063 [P] Run type checker `pnpm typecheck` and fix any type errors
- [ ] T064 Build application `pnpm build` and verify successful build
- [ ] T065 [P] Test page performance: verify load time <3s on 3G connection
- [ ] T066 [P] Test calculator responsiveness: verify price updates in <100ms
- [ ] T067 [P] Test accessibility: keyboard navigation, screen reader support for all new components
- [ ] T068 [P] Verify all 4 locales have complete translations (no missing keys)
- [ ] T069 Test edge case: missing metadata.serviceCards (section should not render)
- [ ] T070 Test edge case: "Остальное" document type shows "По запросу"
- [ ] T071 Test edge case: exchange rates not loaded (fallback to USD)
- [ ] T072 Code cleanup: remove commented-out code, add minimal necessary comments
- [ ] T073 Run quickstart.md validation: follow all steps and verify success
- [ ] T074 [P] Update README.md if any new environment variables or setup steps added
- [ ] T075 Final visual QA: review all sections on multiple browsers (Chrome, Firefox, Safari)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1 but integrates with same page
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independent of US1/US2
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Independent of other stories
- **User Story 5 (P3)**: Depends on US1-US4 completion (tests responsive layout of all sections)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Components before page integration
- Core implementation before edge cases
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: All tasks marked [P] can run together

- T002 + T003

**Phase 2 (Foundational)**:

- T005, T006, T007, T008 (serviceCards for different locales) can run in parallel
- T010, T011, T012, T013 (i18n for different locales) can run in parallel
- T015, T016 (type definitions) can run in parallel

**Phase 3 (US1 Tests)**:

- T018, T019, T020 can run in parallel

**Phase 4 (US2 Tests)**:

- T029, T030 can run in parallel
- T031, T032 can run in parallel (component creation + styling)

**Phase 6 (US4 Tests)**:

- T041, T042 can run in parallel
- T043, T044 can run in parallel (component creation + styling)

**Phase 7 (US5 Tests)**:

- T051, T052, T053 can run in parallel

**Phase 8 (Polish)**:

- T060, T061, T062, T063, T065, T066, T067, T068, T074, T075 can run in parallel

---

## Parallel Example: Foundational Phase

```bash
# Launch all serviceCards metadata updates together:
Task: "Add serviceCards array to Russian locale in prisma/seed/services.ts"
Task: "Add serviceCards array to English locale in prisma/seed/services.ts"
Task: "Add serviceCards array to Kazakh locale in prisma/seed/services.ts"
Task: "Add serviceCards array to Turkish locale in prisma/seed/services.ts"

# Launch all i18n updates together:
Task: "Add document-translations keys to i18n/locales/ru/services.json"
Task: "Add document-translations keys to i18n/locales/en/services.json"
Task: "Add document-translations keys to i18n/locales/kk/services.json"
Task: "Add document-translations keys to i18n/locales/tr/services.json"
```

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Contract test for calculator metadata in tests/contract/calculator-metadata.contract.test.ts"
Task: "Unit test for price calculation in tests/unit/calculator-price.test.ts"
Task: "Component test for PriceCalculatorSection in tests/components/features/PriceCalculatorSection.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T017) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T018-T028)
4. **STOP and VALIDATE**: Test calculator independently
5. Deploy/demo if ready - users can now calculate prices and submit applications!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (all data seeded, types defined)
2. Add User Story 1 → Test independently → **Deploy/Demo (MVP!)**
3. Add User Story 2 → Test independently → Deploy/Demo (service cards now visible)
4. Add User Story 3 → Test independently → Deploy/Demo (process steps updated)
5. Add User Story 4 → Test independently → Deploy/Demo (trust factors + CTA added)
6. Add User Story 5 → Test responsive design → Deploy/Demo (mobile-optimized)
7. Complete Polish phase → Final production-ready deployment
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T017)
2. Once Foundational is done:
   - Developer A: User Story 1 (T018-T028) - Calculator
   - Developer B: User Story 2 (T029-T036) - Service cards
   - Developer C: User Story 3 (T037-T040) - Process steps
   - Developer D: User Story 4 (T041-T050) - Trust building
3. All developers sync for User Story 5 (mobile testing)
4. Team completes Polish phase together

---

## File Change Summary

### New Files (Create)

- `app/components/features/services/ServiceInfoCard.vue` (T031)
- `app/components/features/services/FinalCTASection.vue` (T043)
- `tests/contract/calculator-metadata.contract.test.ts` (T018)
- `tests/unit/calculator-price.test.ts` (T019)
- `tests/components/features/ServiceInfoCard.test.ts` (T029)
- `tests/components/features/FinalCTASection.test.ts` (T041)

### Modified Files

- `prisma/seed/services.ts` (T004-T008) - Update metadata structure
- `i18n/locales/ru/services.json` (T010) - Add keys
- `i18n/locales/en/services.json` (T011) - Add keys
- `i18n/locales/kk/services.json` (T012) - Add keys
- `i18n/locales/tr/services.json` (T013) - Add keys
- `app/types/services.ts` (T015-T016) - Add type definitions
- `app/components/features/services/sections/PriceCalculatorSection.vue` (T021-T025) - Add submit button, new logic
- `tests/components/features/PriceCalculatorSection.test.ts` (T020) - Update tests
- `app/pages/services/document-translations.vue` (T026-T027, T033-T035, T038-T039, T046-T048) - Remove old sections, add new sections

### Removed Sections (from document-translations.vue)

- SubServiceCard components (T035)
- UniversityRequirementsSection (T048)
- SampleDocumentsSection (T048)
- TrustIndicatorBadge (T048)

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD approach)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Run `pnpm typecheck`, `pnpm lint`, `pnpm test` frequently
- Use `pnpm db:studio` to inspect database metadata after seed updates
- Use browser DevTools and Vue DevTools to debug component issues
- Test in all 4 locales (en, ru, kk, tr) before considering a task complete

---

## Success Criteria Validation

After completing all tasks, verify these criteria from spec.md:

- [ ] **SC-001**: Calculator interaction completes in <10 seconds
- [ ] **SC-002**: Submit button opens modal with correct context (100% cases)
- [ ] **SC-003**: All 7 service cards visible on mobile without horizontal scroll
- [ ] **SC-004**: Page loads all sections in <3s on 3G
- [ ] **SC-005**: Calculator price updates in <100ms
- [ ] **SC-006**: All 4 locales fully translated with no missing keys
- [ ] **SC-007**: (Post-deployment metric) Conversion rate increases by 15%+ within 30 days

---

## Estimated Effort

**Total Tasks**: 75  
**Estimated Time**: 3-5 days for single developer (sequential), 2-3 days with 2-3 developers (parallel)

**Breakdown by Phase**:

- Phase 1 (Setup): 30 minutes
- Phase 2 (Foundational): 4-6 hours (seed data, i18n, types)
- Phase 3 (US1): 6-8 hours (calculator modification + tests)
- Phase 4 (US2): 4-6 hours (service cards component + integration)
- Phase 5 (US3): 2-3 hours (process steps update)
- Phase 6 (US4): 4-5 hours (trust factors + CTA component)
- Phase 7 (US5): 3-4 hours (mobile testing and fixes)
- Phase 8 (Polish): 4-6 hours (testing, QA, cleanup)

**Critical Path**: T001 → T004-T017 (Foundational) → T021-T028 (US1 Calculator)
