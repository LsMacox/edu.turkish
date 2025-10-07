# Tasks: Test Infrastructure Modernization

**Input**: Design documents from `/specs/006-vitest-config-ts/`  
**Branch**: `006-vitest-config-ts`  
**Prerequisites**: plan.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)

1. ✅ Load plan.md - tech stack: Vitest 3.2.4, TypeScript 5.9.3, Nuxt 4
2. ✅ Load data-model.md - test utility modules defined
3. ✅ Load contracts/ - test-utils API contract defined
4. ✅ Generate tasks by category: Foundation → Mocks → Refactoring → Cleanup
5. ✅ Apply rules: Different files [P], TDD approach, dependencies ordered
6. ✅ Numbered sequentially T001-T041
7. ✅ Validated: All tests first, constitutional compliance

## Phase 3.1: Foundation - Test-Utils Module Setup

- [x] T001 Create `tests/test-utils/` directory structure with subdirectories `mocks/` and `fixtures/`
- [x] T002 [P] Create `tests/test-utils/index.ts` entry point with placeholder exports
- [x] T003 [P] Create `tests/test-utils/mocks/` directory for mock implementations
- [x] T004 [P] Create `tests/test-utils/fixtures/` directory for test data factories

## Phase 3.2: Mock Implementations

### Prisma Mocks

- [x] T005 Implement `createMockPrisma()` factory in `tests/test-utils/mocks/prisma.ts` that returns PrismaClient-compatible object with vi.fn() methods for all models (university, faq, review, application, etc.) and $transaction, $connect, $disconnect
- [x] T006 Export `createMockPrisma` from `tests/test-utils/index.ts`

### Redis/Queue Mocks

- [x] T007 Implement `MockQueue` class in `tests/test-utils/mocks/redis.ts` with in-memory job storage, methods: addJob, getJob, getQueueLength, getDeadLetterQueue, clear; implement exponential backoff logic (1s, 5s, 25s) and DLQ after 3 attempts
- [x] T008 Implement `createMockQueue()` factory in `tests/test-utils/mocks/redis.ts` that returns new MockQueue instance
- [x] T009 Implement `createMockRedis()` factory in `tests/test-utils/mocks/redis.ts` for basic Redis operations (get, set, del, exists)
- [x] T010 Export `createMockQueue` and `createMockRedis` from `tests/test-utils/index.ts`

### Nuxt Composable Mocks

- [x] T011 Implement `mockUseI18n()` factory in `tests/test-utils/mocks/nuxt.ts` that returns object with reactive locale Ref and t() function supporting dot notation and {param} interpolation
- [x] T012 Implement `mockFetch()` factory in `tests/test-utils/mocks/fetch.ts` that accepts URL→response mapping and returns mock $fetch function
- [x] T013 Implement `mockNuxtApp()` factory in `tests/test-utils/mocks/nuxt.ts` that returns object with $i18n and $fetch properties
- [x] T014 Export `mockUseI18n`, `mockFetch`, `mockNuxtApp` from `tests/test-utils/index.ts`

### Test Fixtures

- [x] T015 [P] Implement `createUniversity()` fixture in `tests/test-utils/fixtures/university.ts` with defaults for all fields, support overrides, include translations for all locales
- [x] T016 [P] Implement `createFAQ()` fixture in `tests/test-utils/fixtures/faq.ts` with category and translations
- [x] T017 [P] Implement `createApplication()` fixture in `tests/test-utils/fixtures/application.ts` based on LeadData type
- [x] T018 [P] Implement `createReview()` fixture in `tests/test-utils/fixtures/review.ts` with translations
- [x] T019 Create `tests/test-utils/fixtures/index.ts` and export all fixture functions
- [x] T020 Export all fixtures from `tests/test-utils/index.ts`

## Phase 3.3: Repository Test Refactoring

- [x] T021 Refactor `tests/server/FAQRepository.spec.ts` to use `createMockPrisma()` instead of inline mocks, remove excessive comments, ensure AAA pattern
- [x] T022 Refactor `tests/server/UniversityRepository.spec.ts` to use `createMockPrisma()` and test fixtures, remove excessive comments, ensure AAA pattern
- [x] T023 Refactor `tests/server/ReviewRepository.spec.ts` to use `createMockPrisma()` and test fixtures, remove excessive comments, ensure AAA pattern

## Phase 3.4: Integration Test Refactoring

- [x] T024 Refactor `tests/integration/crm-lead-creation.test.ts` to use `createMockQueue()` for queue mocking instead of expecting real Redis, update to use test-utils fixtures
- [x] T025 Refactor `tests/integration/crm-queue-retry.test.ts` to use `createMockQueue()` with full retry logic implementation, remove placeholder comments
- [x] T026 Refactor `tests/integration/crm-messenger-activity.test.ts` to use `createMockQueue()` for activity logging tests
- [x] T027 Refactor `tests/integration/crm-provider-switch.test.ts` to use mock implementations instead of expecting real CRM connections

## Phase 3.5: Component Test Refactoring

- [x] T028 [P] Refactor `tests/components/PopularProgramsSection.test.ts` to use `mockUseI18n()` and `mockFetch()` from test-utils, remove inline i18n mock, clean up structure
- [x] T029 [P] Refactor `tests/components/BaseButton.test.ts` to use test-utils if applicable, ensure AAA pattern, remove excessive comments
- [x] T030 [P] Refactor `tests/components/BaseTextField.test.ts` to use test-utils mocks, ensure AAA pattern
- [x] T031 [P] Refactor `tests/components/ApplicationModal.test.ts` to use `mockUseI18n()` and test fixtures
- [x] T032 [P] Refactor `tests/components/FilterPanel.test.ts` to use test-utils mocks
- [x] T033 [P] Refactor `tests/components/UniversityCard.test.ts` to use test-utils mocks and fixtures

## Phase 3.6: Contract Test Refactoring

- [x] T034 [P] Refactor `tests/contract/espocrm-api.test.ts` to use `mockFetch()` from test-utils for HTTP mocking
- [x] T035 [P] Refactor `tests/contract/crm-provider.contract.test.ts` to use appropriate test-utils mocks

## Phase 3.7: Server API & Service Test Refactoring

- [x] T036 [P] Refactor `tests/server/services/BitrixService.logMessengerEvent.test.ts` to use `mockFetch()` from test-utils
- [x] T037 [P] Refactor `tests/server/services/EspoCrmService.test.ts` to use test-utils mocks
- [x] T038 [P] Refactor remaining tests in `tests/server/api/` to use appropriate test-utils mocks (v1 endpoints, directions, applications, messenger-events)

## Phase 3.8: Global Setup & Cleanup

- [x] T039 Update `tests/setup.ts` with common mock initialization and cleanup utilities, document usage patterns
- [x] T040 Update `vitest.config.ts` to use standard Vite config with path aliases (switched from @nuxt/test-utils/config to eliminate external dependencies)
- [x] T041 Run full test suite `pnpm test` and verify: (1) no external dependencies required, (2) test-utils working correctly, (3) execution time <7s, (4) no Docker/Redis/Postgres connections required

## Dependencies

**Sequential Dependencies**:

- T001 blocks T002-T004 (need directory first)
- T002-T004 block T005+ (need structure)
- T005-T020 block T021+ (mocks must exist before refactoring)
- T021-T038 block T039-T041 (refactoring before final cleanup)

**Parallel Groups**:

- **Group A** (T002-T004): Directory setup tasks
- **Group B** (T015-T018): Fixture creation (independent files)
- **Group C** (T028-T033): Component test refactoring (independent files)
- **Group D** (T034-T035): Contract test refactoring (independent files)
- **Group E** (T036-T038): Service test refactoring (independent files)

## Parallel Execution Examples

### After Foundation Complete (T001-T004)

```
Task: "Implement createMockPrisma() factory in tests/test-utils/mocks/prisma.ts"
Task: "Implement MockQueue class in tests/test-utils/mocks/redis.ts"
Task: "Implement mockUseI18n() factory in tests/test-utils/mocks/nuxt.ts"
Task: "Implement mockFetch() factory in tests/test-utils/mocks/fetch.ts"
```

### After Fixtures Complete (T015-T020)

```
Task: "Refactor tests/components/PopularProgramsSection.test.ts to use mockUseI18n and mockFetch"
Task: "Refactor tests/components/BaseButton.test.ts AAA pattern"
Task: "Refactor tests/components/BaseTextField.test.ts with test-utils"
Task: "Refactor tests/components/ApplicationModal.test.ts with mockUseI18n"
Task: "Refactor tests/components/FilterPanel.test.ts with test-utils"
Task: "Refactor tests/components/UniversityCard.test.ts with fixtures"
```

## Validation Checklist

_GATE: All must pass before marking feature complete_

- [x] All test-utils modules have corresponding implementation tasks
- [x] All existing test files have refactoring tasks
- [x] Mock implementations match data-model.md specifications
- [x] Test tasks ensure AAA pattern and minimal comments
- [x] Parallel tasks are truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] i18n: No UI changes in this feature (N/A)
- [x] Prisma: No schema changes (N/A)
- [x] Directus: No content changes (N/A)
- [x] Partner flows: No changes (N/A)
- [x] Components: Test-only changes, no SFC modifications
- [x] Aliases: Uses `~~/tests/*` pattern (constitutional)
- [x] Runtime Config: No config changes (N/A)

## Notes

- **TDD Not Applicable**: Refactoring existing tests, not creating new features
- **Focus**: Mock infrastructure first (T005-T020), then refactor tests (T021-T038)
- **Testing**: After each refactoring task, run affected test file to verify
- **Performance**: Target <30s total execution time (validated in T041)
- **Constitutional Compliance**: Test-only changes, no application code modified

---

_Aligned with Constitution v1.2.0 - See `/memory/constitution.md`_
