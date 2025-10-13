---
description: 'Task list for Enhanced Service Page Content Blocks implementation'
---

# Tasks: Enhanced Service Page Content Blocks

**Input**: Design documents from `/specs/012-x-30-60/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- Nuxt 3 web application structure
- Components: `app/components/features/services/sections/`
- Pages: `app/pages/services/`
- i18n: `i18n/locales/{en,ru,kk,tr}/services.json`
- Tests: `tests/components/features/services/sections/`, `tests/contract/`
- Types: `app/types/services.ts`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create `app/components/features/services/sections/` directory
- [x] T002 [P] Create `tests/components/features/services/sections/` directory
- [x] T003 [P] Verify TypeScript, ESLint, Prettier, Vitest configurations are working

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Update `app/components/features/services/ServicePageLayout.vue` to add new slots (who-is-this-for, expected-results, timeline-plan, responsibility-matrix, risk-mitigation, course-goal, diagnostic-test, program-content, format-schedule, student-results, level-progression, teachers, price-calculator, university-requirements, sample-documents, faq)
- [x] T005 [P] Update `app/types/services.ts` to add new TypeScript interfaces from `specs/012-x-30-60/contracts/component-props.ts`
- [x] T006 [P] Update `tests/contract/services-i18n.contract.test.ts` to add validation for new i18n keys using `specs/012-x-30-60/contracts/i18n-keys.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Relocation Service Transparency (Priority: P1) 🎯 MVP

**Goal**: Add 6 new sections to Relocation to Turkey service page to reduce client anxiety and improve conversion

**Independent Test**: Visit `/services/relocation-in-turkey` and verify all 6 sections render with i18n content in all 4 locales

### Tests for User Story 1

**NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T007 [P] [US1] Unit test for WhoIsThisForSection in `tests/components/features/services/sections/WhoIsThisForSection.test.ts`
- [x] T008 [P] [US1] Unit test for ExpectedResultsSection in `tests/components/features/services/sections/ExpectedResultsSection.test.ts`
- [x] T009 [P] [US1] Unit test for TimelinePlanSection in `tests/components/features/services/sections/TimelinePlanSection.test.ts`
- [x] T010 [P] [US1] Unit test for ResponsibilityMatrixSection in `tests/components/features/services/sections/ResponsibilityMatrixSection.test.ts`
- [x] T011 [P] [US1] Unit test for RiskMitigationSection in `tests/components/features/services/sections/RiskMitigationSection.test.ts`
- [x] T012 [P] [US1] Unit test for ServiceFAQSection in `tests/components/features/services/sections/ServiceFAQSection.test.ts`

### Implementation for User Story 1

- [x] T013 [P] [US1] Create WhoIsThisForSection component in `app/components/features/services/sections/WhoIsThisForSection.vue`
- [x] T014 [P] [US1] Create ExpectedResultsSection component in `app/components/features/services/sections/ExpectedResultsSection.vue`
- [x] T015 [P] [US1] Create TimelinePlanSection component in `app/components/features/services/sections/TimelinePlanSection.vue`
- [x] T016 [P] [US1] Create ResponsibilityMatrixSection component in `app/components/features/services/sections/ResponsibilityMatrixSection.vue`
- [x] T017 [P] [US1] Create RiskMitigationSection component in `app/components/features/services/sections/RiskMitigationSection.vue`
- [x] T018 [P] [US1] Create ServiceFAQSection component in `app/components/features/services/sections/ServiceFAQSection.vue`
- [x] T019 [US1] Add i18n keys for relocation-in-turkey service in `i18n/locales/en/services.json` (whoIsThisFor, expectedResults, timelinePlan, responsibilityMatrix, riskMitigation, faq)
- [x] T020 [P] [US1] Copy i18n structure to `i18n/locales/ru/services.json` with placeholders
- [x] T021 [P] [US1] Copy i18n structure to `i18n/locales/kk/services.json` with placeholders
- [x] T022 [P] [US1] Copy i18n structure to `i18n/locales/tr/services.json` with placeholders
- [x] T023 [US1] Update `app/pages/services/relocation-in-turkey.vue` to use new sections in appropriate slots
- [ ] T024 [US1] Manual testing: verify all sections render correctly on mobile (375px), tablet (768px), desktop (1280px)
- [ ] T025 [US1] Manual testing: verify locale switching works for all 4 languages

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - TR-YÖS Course Program Clarity (Priority: P1)

**Goal**: Add 6 new sections to TR-YÖS course page to improve enrollment conversion

**Independent Test**: Visit `/services/tr-yos-courses` and verify all 6 sections render with diagnostic test button functional

### Tests for User Story 2

- [x] T026 [P] [US2] Unit test for CourseGoalSection in `tests/components/features/services/sections/CourseGoalSection.test.ts`
- [x] T027 [P] [US2] Unit test for DiagnosticTestSection in `tests/components/features/services/sections/DiagnosticTestSection.test.ts`
- [x] T028 [P] [US2] Unit test for ProgramContentSection in `tests/components/features/services/sections/ProgramContentSection.test.ts`
- [x] T029 [P] [US2] Unit test for FormatScheduleSection in `tests/components/features/services/sections/FormatScheduleSection.test.ts`
- [x] T030 [P] [US2] Unit test for StudentResultsSection in `tests/components/features/services/sections/StudentResultsSection.test.ts`

### Implementation for User Story 2

- [x] T031 [P] [US2] Create CourseGoalSection component in `app/components/features/services/sections/CourseGoalSection.vue`
- [x] T032 [P] [US2] Create DiagnosticTestSection component in `app/components/features/services/sections/DiagnosticTestSection.vue`
- [x] T033 [P] [US2] Create ProgramContentSection component in `app/components/features/services/sections/ProgramContentSection.vue`
- [x] T034 [P] [US2] Create FormatScheduleSection component in `app/components/features/services/sections/FormatScheduleSection.vue`
- [x] T035 [P] [US2] Create StudentResultsSection component in `app/components/features/services/sections/StudentResultsSection.vue`
- [x] T036 [US2] Add i18n keys for tr-yos-courses service in `i18n/locales/en/services.json` (courseGoal, diagnosticTest, programContent, formatSchedule, studentResults, faq)
- [x] T037 [P] [US2] Copy i18n structure to `i18n/locales/ru/services.json` with placeholders
- [x] T038 [P] [US2] Copy i18n structure to `i18n/locales/kk/services.json` with placeholders
- [x] T039 [P] [US2] Copy i18n structure to `i18n/locales/tr/services.json` with placeholders
- [x] T040 [US2] Update `app/pages/services/tr-yos-courses.vue` to use new sections (reuse ServiceFAQSection from US1)
- [ ] T041 [US2] Manual testing: verify diagnostic test button is clickable and navigates correctly
- [ ] T042 [US2] Manual testing: verify responsive design on all viewports

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - SAT Course Digital Focus (Priority: P1)

**Goal**: Add 6 new sections to SAT course page with Digital SAT focus

**Independent Test**: Visit `/services/sat-courses` and verify all sections render with score targets displayed

### Implementation for User Story 3

**NOTE**: This story reuses all components from US2, only needs i18n keys and page integration

- [x] T043 [US3] Add i18n keys for sat-courses service in `i18n/locales/en/services.json` (courseGoal, diagnosticTest, programContent, formatSchedule, studentResults, faq)
- [x] T044 [P] [US3] Copy i18n structure to `i18n/locales/ru/services.json` with placeholders
- [x] T045 [P] [US3] Copy i18n structure to `i18n/locales/kk/services.json` with placeholders
- [x] T046 [P] [US3] Copy i18n structure to `i18n/locales/tr/services.json` with placeholders
- [x] T047 [US3] Update `app/pages/services/sat-courses.vue` to use sections (reuse all components from US2)
- [ ] T048 [US3] Manual testing: verify all sections render correctly with SAT-specific content

**Checkpoint**: All P1 user stories (US1, US2, US3) should now be independently functional

---

## Phase 6: User Story 4 - Language Course Level Progression (Priority: P2)

**Goal**: Add 6 new sections to language course page with CEFR level progression

**Independent Test**: Visit `/services/turkish-english-course` and verify level progression and teacher profiles display

### Tests for User Story 4

- [x] T049 [P] [US4] Unit test for LevelProgressionSection in `tests/components/features/services/sections/LevelProgressionSection.test.ts`
- [x] T050 [P] [US4] Unit test for TeachersSection in `tests/components/features/services/sections/TeachersSection.test.ts`

### Implementation for User Story 4

- [x] T051 [P] [US4] Create LevelProgressionSection component in `app/components/features/services/sections/LevelProgressionSection.vue`
- [x] T052 [P] [US4] Create TeachersSection component in `app/components/features/services/sections/TeachersSection.vue`
- [x] T053 [US4] Add i18n keys for turkish-english-course service in `i18n/locales/en/services.json` (levelProgression, diagnosticTest, formatSchedule, teachers, expectedResults, faq)
- [x] T054 [P] [US4] Copy i18n structure to `i18n/locales/ru/services.json` with placeholders
- [x] T055 [P] [US4] Copy i18n structure to `i18n/locales/kk/services.json` with placeholders
- [x] T056 [P] [US4] Copy i18n structure to `i18n/locales/tr/services.json` with placeholders
- [x] T057 [US4] Update `app/pages/services/turkish-english-course.vue` to use new sections (reuse DiagnosticTestSection, FormatScheduleSection, ExpectedResultsSection, ServiceFAQSection)
- [ ] T058 [US4] Add placeholder teacher photos to `public/images/` directory
- [ ] T059 [US4] Manual testing: verify teacher profiles render with photos and achievements

**Checkpoint**: User Story 4 should be independently functional

---

## Phase 7: User Story 5 - Document Translation Calculator Enhancement (Priority: P3)

**Goal**: Add 3 enhancement sections to document translation page

**Independent Test**: Visit `/services/document-translations` and verify price calculator, requirements, and samples display

### Tests for User Story 5

- [x] T060 [P] [US5] Unit test for PriceCalculatorSection in `tests/components/features/services/sections/PriceCalculatorSection.test.ts`
- [x] T061 [P] [US5] Unit test for UniversityRequirementsSection in `tests/components/features/services/sections/UniversityRequirementsSection.test.ts`
- [x] T062 [P] [US5] Unit test for SampleDocumentsSection in `tests/components/features/services/sections/SampleDocumentsSection.test.ts`

### Implementation for User Story 5

- [x] T063 [P] [US5] Create PriceCalculatorSection component in `app/components/features/services/sections/PriceCalculatorSection.vue`
- [x] T064 [P] [US5] Create UniversityRequirementsSection component in `app/components/features/services/sections/UniversityRequirementsSection.vue`
- [x] T065 [P] [US5] Create SampleDocumentsSection component in `app/components/features/services/sections/SampleDocumentsSection.vue`
- [x] T066 [US5] Add i18n keys for document-translations service in `i18n/locales/en/services.json` (priceCalculator, universityRequirements, sampleDocuments)
- [x] T067 [P] [US5] Copy i18n structure to `i18n/locales/ru/services.json` with placeholders
- [x] T068 [P] [US5] Copy i18n structure to `i18n/locales/kk/services.json` with placeholders
- [x] T069 [P] [US5] Copy i18n structure to `i18n/locales/tr/services.json` with placeholders
- [x] T070 [US5] Update `app/pages/services/document-translations.vue` to use new sections
- [ ] T071 [US5] Add anonymized sample document images to `public/images/` directory
- [ ] T072 [US5] Manual testing: verify price calculator selectors work and calculate correctly
- [ ] T073 [US5] Manual testing: verify sample documents display in gallery layout

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T074 [P] Run full test suite: `pnpm test`
- [x] T075 [P] Run linting: `pnpm lint` and fix any issues
- [x] T076 [P] Run type checking: `pnpm typecheck` and fix any errors
- [ ] T077 [P] Run formatting check: `pnpm format:check` and format if needed
- [x] T078 Verify all i18n keys exist in all 4 locales (contract test should pass)
- [ ] T079 Performance testing: verify page load time increase is < 200ms
- [ ] T080 Accessibility audit: verify keyboard navigation and ARIA labels
- [ ] T081 [P] Professional translation for Russian locale (i18n/locales/ru/services.json)
- [ ] T082 [P] Professional translation for Kazakh locale (i18n/locales/kk/services.json)
- [ ] T083 [P] Professional translation for Turkish locale (i18n/locales/tr/services.json)
- [ ] T084 Content team review: replace placeholder values (N, X) with actual numbers
- [ ] T085 Visual regression testing: compare screenshots before/after
- [ ] T086 Update documentation: add component usage examples to quickstart.md
- [ ] T087 Final manual testing: complete pre-commit checklist for all 5 service pages

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 (P1): Can start after Phase 2 - No dependencies on other stories
  - US2 (P1): Can start after Phase 2 - No dependencies on other stories
  - US3 (P1): Can start after Phase 2 - Reuses components from US2 but can develop in parallel
  - US4 (P2): Can start after Phase 2 - Reuses some components from US1/US2
  - US5 (P3): Can start after Phase 2 - Independent components
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Creates 6 new components
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Creates 5 new components + reuses 1 from US1
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Reuses all components from US2, only needs i18n
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Creates 2 new components + reuses 4 from US1/US2
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Creates 3 new components, independent

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Components can be created in parallel (marked [P])
- i18n keys must be added to English first, then copied to other locales
- Page integration happens after components and i18n are ready
- Manual testing verifies story completion

### Parallel Opportunities

- All Setup tasks (T001-T003) can run in parallel
- All Foundational tasks (T004-T006) can run in parallel
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All component tests within a story can run in parallel
- All component implementations within a story can run in parallel
- All i18n locale copies (ru/kk/tr) can run in parallel
- All Polish tasks (T074-T087) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for WhoIsThisForSection in tests/components/features/services/sections/WhoIsThisForSection.test.ts"
Task: "Unit test for ExpectedResultsSection in tests/components/features/services/sections/ExpectedResultsSection.test.ts"
Task: "Unit test for TimelinePlanSection in tests/components/features/services/sections/TimelinePlanSection.test.ts"
Task: "Unit test for ResponsibilityMatrixSection in tests/components/features/services/sections/ResponsibilityMatrixSection.test.ts"
Task: "Unit test for RiskMitigationSection in tests/components/features/services/sections/RiskMitigationSection.test.ts"
Task: "Unit test for ServiceFAQSection in tests/components/features/services/sections/ServiceFAQSection.test.ts"

# Launch all component implementations for User Story 1 together:
Task: "Create WhoIsThisForSection component in app/components/features/services/sections/WhoIsThisForSection.vue"
Task: "Create ExpectedResultsSection component in app/components/features/services/sections/ExpectedResultsSection.vue"
Task: "Create TimelinePlanSection component in app/components/features/services/sections/TimelinePlanSection.vue"
Task: "Create ResponsibilityMatrixSection component in app/components/features/services/sections/ResponsibilityMatrixSection.vue"
Task: "Create RiskMitigationSection component in app/components/features/services/sections/RiskMitigationSection.vue"
Task: "Create ServiceFAQSection component in app/components/features/services/sections/ServiceFAQSection.vue"

# Launch all i18n locale copies for User Story 1 together:
Task: "Copy i18n structure to i18n/locales/ru/services.json with placeholders"
Task: "Copy i18n structure to i18n/locales/kk/services.json with placeholders"
Task: "Copy i18n structure to i18n/locales/tr/services.json with placeholders"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T006) - CRITICAL
3. Complete Phase 3: User Story 1 (T007-T025)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T006)
2. Once Foundational is done:
   - Developer A: User Story 1 (T007-T025)
   - Developer B: User Story 2 (T026-T042)
   - Developer C: User Story 4 (T049-T059)
3. Developer A continues with User Story 3 (T043-T048) - quick win, reuses US2 components
4. Developer C continues with User Story 5 (T060-T073)
5. All developers collaborate on Polish phase (T074-T087)

---

## Component Reuse Matrix

| Component                     | US1 | US2 | US3 | US4 | US5 |
| ----------------------------- | --- | --- | --- | --- | --- |
| WhoIsThisForSection           | ✓   |     |     |     |     |
| ExpectedResultsSection        | ✓   |     |     | ✓   |     |
| TimelinePlanSection           | ✓   |     |     |     |     |
| ResponsibilityMatrixSection   | ✓   |     |     |     |     |
| RiskMitigationSection         | ✓   |     |     |     |     |
| ServiceFAQSection             | ✓   | ✓   | ✓   | ✓   |     |
| CourseGoalSection             |     | ✓   | ✓   |     |     |
| DiagnosticTestSection         |     | ✓   | ✓   | ✓   |     |
| ProgramContentSection         |     | ✓   | ✓   |     |     |
| FormatScheduleSection         |     | ✓   | ✓   | ✓   |     |
| StudentResultsSection         |     | ✓   | ✓   |     |     |
| LevelProgressionSection       |     |     |     | ✓   |     |
| TeachersSection               |     |     |     | ✓   |     |
| PriceCalculatorSection        |     |     |     |     | ✓   |
| UniversityRequirementsSection |     |     |     |     | ✓   |
| SampleDocumentsSection        |     |     |     |     | ✓   |

**Total Unique Components**: 16
**Total Component Usages**: 27
**Reuse Efficiency**: 41% reduction in development effort through component reuse

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Follow quickstart.md for development patterns and testing guide
- Reference data-model.md for i18n schema structure
- Reference contracts/ for TypeScript types and interfaces
- Run `pnpm lint`, `pnpm typecheck`, `pnpm test` frequently
