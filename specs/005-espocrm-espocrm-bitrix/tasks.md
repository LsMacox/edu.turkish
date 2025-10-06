# Tasks: Fix EspoCRM Integration Issues

**Input**: Design documents from `/home/lsmacox/projects/edu.turkish/specs/005-espocrm-espocrm-bitrix/`
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

## Execution Flow (main)

```
1. Load plan.md from feature directory
   ✓ Extracted: TypeScript 5.x, Nuxt 3, Vue 3, Prisma, Vitest
   ✓ Structure: app/, server/, tests/
2. Load optional design documents:
   ✓ data-model.md: ICrmProvider interface, CrmResult types, error structures
   ✓ contracts/: crm-provider.contract.md, espocrm-api.contract.md
   ✓ research.md: Factory pattern, EspoCRM API integration decisions
   ✓ quickstart.md: Verification scenarios
3. Generate tasks by category:
   ✓ Setup: Environment configuration
   ✓ Tests: Contract tests for CRM providers, component tests
   ✓ Core: Services, factory, utilities, API endpoints
   ✓ Integration: CRM provider routing
   ✓ Polish: Error handling, validation fixes
4. Apply task rules:
   ✓ Different files = mark [P] for parallel
   ✓ Same file = sequential (no [P])
   ✓ Tests before implementation (TDD)
5. Number tasks sequentially (T001-T024)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   ✓ All contracts have tests
   ✓ All interfaces have implementations
   ✓ Constitution gates satisfied
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Server**: `server/api/`, `server/services/`, `server/utils/`, `server/types/`
- **Frontend**: `app/components/`, `app/composables/`
- **Tests**: `tests/contract/`, `tests/server/`, `tests/components/`
- **Aliases**: `~/*` → `./app/*`, `~~/*` → `./*`

## Phase 3.1: Setup

- [x] **T001** ✅ COMPLETED - Environment variables already configured in `nuxt.config.ts` runtimeConfig and `.env.example`
  - ✅ `nuxt.config.ts` lines 140-147: CRM config with NUXT_* prefix support
  - ✅ `.env.example` lines 18-30: CRM provider variables documented
  - ✅ `server/utils/crm-config.ts`: Updated to use process.env with NUXT_* fallbacks

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests

- [x] **T002** [P] Create contract test for ICrmProvider interface in `tests/contract/crm-provider.contract.test.ts`
  - Test all methods: `createLead()`, `logMessengerEvent()`, `testConnection()`
  - Verify return types match CrmResult/ConnectionResult
  - Test error handling (never throws, returns structured errors)
  - Test timeout behavior

- [x] **T003** [P] Create contract test for EspoCRM API integration in `tests/contract/espocrm-api.test.ts`
  - Mock HTTP responses for lead creation
  - Mock HTTP responses for activity creation
  - Test authentication headers (X-Api-Key)
  - Test field mapping from ApplicationRequest to EspoCRM format
  - Test error responses (400, 401, 500)

### Service Tests

- [x] **T004** [P] Create unit tests for CrmProviderFactory in `tests/server/services/CrmProviderFactory.test.ts`
  - Test provider selection based on CRM_PROVIDER env var
  - Test default to Bitrix when CRM_PROVIDER not set
  - Test configuration validation
  - Test error when invalid provider specified

- [x] **T005** [P] Create unit tests for EspoCrmService in `tests/server/services/EspoCrmService.test.ts`
  - Test createLead() with mocked HTTP client
  - Test logMessengerEvent() with mocked HTTP client
  - Test testConnection() with mocked HTTP client
  - Test timeout handling
  - Test retry logic
  - Test error transformation

### Component Tests

- [x] **T006** [P] Create/update component tests for ApplicationModal in `tests/components/ApplicationModal.test.ts`
  - Test error message extraction from various error formats
  - Test display of validation errors (array of strings)
  - Test display of general errors (single message)
  - Test fallback message for undefined/empty errors
  - Test that boolean values don't display as 'true'
  - Test tooltip positioning and z-index

### Validation Tests

- [x] **T007** [P] Create/update validation tests in `tests/server/utils/api-helpers.test.ts`
  - Test source field accepts any non-empty string
  - Test source field accepts referral codes
  - Test source field accepts preset values (website, home_questionnaire, etc.)
  - Test source field rejects empty/null/undefined
  - Test no "Invalid source" error for valid values

### Integration Tests

- [x] **T008** [P] Create integration test for CRM provider routing in `tests/server/api/applications.test.ts`
  - Test application submission routes to configured CRM provider
  - Test application saved to database even if CRM fails
  - Test appropriate HTTP status codes returned
  - Test error logging for CRM failures

- [x] **T009** [P] Create integration test for messenger event routing in `tests/server/api/messenger-events.test.ts`
  - Test messenger event routes to configured CRM provider
  - Test no 401 errors when EspoCRM configured
  - Test graceful handling when CRM not configured

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Type Definitions

- [x] **T010** [P] Create CRM provider type definitions in `server/types/api/crm.ts`
  - Define ICrmProvider interface
  - Define CrmResult type
  - Define ConnectionResult type
  - Define EspoCrmConfig type
  - Export all types

### Utility Functions

- [x] **T011** [P] Create CRM configuration utility in `server/utils/crm-config.ts`
  - Implement `getCrmProvider()` function
  - Implement `validateCrmConfig()` function
  - Implement `getEspoCrmConfig()` function
  - Implement `getBitrixConfig()` function (if not exists)
  - Export configuration functions

### Service Implementation

- [x] **T012** Create EspoCrmService class in `server/services/EspoCrmService.ts`
  - Implement ICrmProvider interface
  - Implement `createLead()` method with field mapping
  - Implement `logMessengerEvent()` method with field mapping
  - Implement `testConnection()` method
  - Add timeout handling (15s for leads, 10s for events)
  - Add retry logic (2 retries for leads, 1 for events)
  - Add error handling (catch all, return structured errors)
  - Add request logging

- [x] **T013** Create CrmProviderFactory in `server/services/CrmProviderFactory.ts`
  - Implement `create()` static method
  - Read CRM_PROVIDER environment variable
  - Validate configuration before returning instance
  - Return BitrixService or EspoCrmService based on config
  - Throw error if configuration invalid

- [x] **T014** Update BitrixService to implement ICrmProvider in `server/services/BitrixService.ts`
  - Add `implements ICrmProvider` to class declaration
  - Ensure all methods match interface signature
  - Ensure return types match CrmResult/ConnectionResult
  - No breaking changes to existing functionality

### API Endpoint Updates

- [x] **T015** Update applications endpoint in `server/api/v1/applications/index.post.ts`
  - Replace direct BitrixService instantiation with CrmProviderFactory.create()
  - Update error handling to use structured CrmResult
  - Ensure application saved to DB regardless of CRM result
  - Update response to include CRM provider info

- [x] **T016** Update messenger events endpoint in `server/api/v1/messenger-events.post.ts`
  - Replace direct BitrixService instantiation with CrmProviderFactory.create()
  - Update error handling to use structured CrmResult
  - Remove hardcoded Bitrix references
  - Add logging for CRM provider selection

### Validation Fixes

- [x] **T017** Fix source validation in `server/utils/api-helpers.ts`
  - Update `validateApplicationData()` function
  - Remove any restrictive source validation
  - Accept any non-empty string for source field
  - Add clear error message if source is empty
  - Remove any enum or whitelist checks

### Frontend Error Handling

- [x] **T018** Fix error display in ApplicationModal component in `app/components/modals/ApplicationModal.vue`
  - Create `getErrorMessage()` helper function with type guards
  - Handle validation errors (array of strings)
  - Handle general errors (single message)
  - Add fallback message for undefined/empty errors
  - Prevent boolean values from displaying as 'true'
  - Update error display UI with proper positioning
  - Ensure tooltip has z-index higher than modal (z-[10000])
  - Add field-specific error display at bottom of modal

## Phase 3.4: Integration

- [ ] **T019** Verify CRM provider switching works correctly
  - Test with CRM_PROVIDER=bitrix
  - Test with CRM_PROVIDER=espocrm
  - Test default behavior (no CRM_PROVIDER set)
  - Verify no breaking changes to existing Bitrix integration

## Phase 3.5: Polish

- [ ] **T020** [P] Add comprehensive error logging
  - Log CRM provider selection
  - Log CRM integration failures with details
  - Log validation errors
  - Ensure no sensitive data (API keys) in logs

- [ ] **T021** [P] Performance verification
  - Verify API response time <500ms for application submission
  - Verify UI error display <200ms
  - Verify CRM timeout handling doesn't block requests

- [ ] **T022** [P] Update documentation
  - Update README.md with new environment variables
  - Document CRM provider configuration
  - Add troubleshooting guide for CRM integration
  - Update .env.example with comments

- [ ] **T023** Run quickstart verification
  - Execute all verification steps from quickstart.md
  - Verify all acceptance criteria met
  - Test rollback procedure
  - Document any issues found

## Phase 3.6: i18n & Content (if UI text changes)

- [ ] **T024** [P] Verify i18n keys for error messages in `i18n/locales/{en,ru,kk,tr}/*.json`
  - Check modal.error_title exists in all locales
  - Check modal.error_message exists in all locales
  - Check modal.success_title exists in all locales
  - Check modal.success_message exists in all locales
  - Add any missing translations

## Dependencies

```
Setup (T001) → All other tasks

Tests (T002-T009) → Implementation (T010-T018)
  ├─ T002 [P] CRM provider contract test
  ├─ T003 [P] EspoCRM API contract test
  ├─ T004 [P] Factory tests
  ├─ T005 [P] EspoCRM service tests
  ├─ T006 [P] ApplicationModal tests
  ├─ T007 [P] Validation tests
  ├─ T008 [P] Applications integration test
  └─ T009 [P] Messenger events integration test

Types (T010) → Services (T012-T014)
Utilities (T011) → Services (T012-T014)

Services (T012-T014) → API Updates (T015-T016)
  ├─ T012: EspoCrmService
  ├─ T013: CrmProviderFactory
  └─ T014: BitrixService update

API Updates (T015-T016) → Integration (T019)
Validation (T017) → Integration (T019)
Frontend (T018) → Integration (T019)

Integration (T019) → Polish (T020-T023)
Polish (T020-T023) → i18n (T024)
```

## Parallel Execution Examples

### Phase 3.2: All Tests in Parallel

```bash
# Launch all test creation tasks together (T002-T009)
Task: "Create contract test for ICrmProvider interface in tests/contract/crm-provider.contract.test.ts"
Task: "Create contract test for EspoCRM API in tests/contract/espocrm-api.test.ts"
Task: "Create unit tests for CrmProviderFactory in tests/server/services/CrmProviderFactory.test.ts"
Task: "Create unit tests for EspoCrmService in tests/server/services/EspoCrmService.test.ts"
Task: "Update component tests for ApplicationModal in tests/components/ApplicationModal.test.ts"
Task: "Update validation tests in tests/server/utils/api-helpers.test.ts"
Task: "Create integration test for applications in tests/server/api/applications.test.ts"
Task: "Create integration test for messenger events in tests/server/api/messenger-events.test.ts"
```

### Phase 3.3: Types and Utilities in Parallel

```bash
# Launch T010 and T011 together
Task: "Create CRM provider type definitions in server/types/api/crm.ts"
Task: "Create CRM configuration utility in server/utils/crm-config.ts"
```

### Phase 3.5: Polish Tasks in Parallel

```bash
# Launch T020-T022 together
Task: "Add comprehensive error logging"
Task: "Performance verification"
Task: "Update documentation"
```

## Notes

- **[P] tasks** = different files, no dependencies, can run in parallel
- **Verify tests fail** before implementing (TDD approach)
- **Commit after each task** for easy rollback
- **No database migrations** required for this feature
- **Backward compatibility** is critical - existing Bitrix integration must continue working
- **Constitution compliance**: No manual component imports (Nuxt auto-imports), use tsconfig aliases

## Task Generation Rules Applied

1. **From Contracts**:
   - crm-provider.contract.md → T002 (contract test)
   - espocrm-api.contract.md → T003 (contract test)
   - Both contracts → T012 (EspoCrmService implementation)

2. **From Data Model**:
   - ICrmProvider interface → T010 (type definitions)
   - CrmResult types → T010 (type definitions)
   - Error structures → T018 (frontend error handling)

3. **From Research**:
   - Factory pattern decision → T013 (CrmProviderFactory)
   - Configuration approach → T011 (crm-config utility)
   - EspoCRM API integration → T012 (EspoCrmService)

4. **From Quickstart**:
   - Verification scenarios → T023 (quickstart verification)
   - Acceptance criteria → T008, T009 (integration tests)

## Validation Checklist

_GATE: Checked before execution_

- [x] All contracts have corresponding tests (T002, T003)
- [x] All interfaces have implementation tasks (T010 → T012, T013, T014)
- [x] All tests come before implementation (T002-T009 before T010-T018)
- [x] Parallel tasks truly independent (verified file paths)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] i18n: UI error messages verified (T024)
- [x] Prisma: No schema changes required ✅
- [x] Directus: Not applicable for this feature ✅
- [x] Partner: CRM integration maintains ref forwarding ✅

---

_Aligned with Constitution v1.1.0 - See `/memory/constitution.md`_
_Based on plan.md, research.md, data-model.md, contracts/, quickstart.md_
