# Tasks: Import Alias Standardization

**Input**: Design documents from `/specs/003-/`
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

## Execution Summary

This refactoring standardizes import aliases across ~150 TypeScript/Vue files to enforce the constitution principle "Imports MUST use aliases defined in tsconfig.json". Migration follows TDD approach with contract tests validating configuration before code changes.

**Key Decisions** (from research.md):

- Standard aliases: `~` (app/), `~~` (root)
- Deprecated: `@`, `@@`, `^` (remove after migration)
- Priority: tests → server → app → scripts → enforcement

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- All paths are absolute from repository root

## Phase 3.1: Setup & Configuration

- [x] **T001** Align vitest.config.ts aliases with tsconfig.json
  - File: `vitest.config.ts`
  - Add missing `@@` and `^` aliases to match tsconfig.json
  - Verify all aliases resolve correctly in test context
  - Run `npm test` to confirm no resolution errors

- [x] **T002** [P] Create contract test for alias configuration validation
  - File: `tests/config/alias-config.contract.test.ts`
  - Implement `validateAliasConfiguration()` from `specs/003-/contracts/alias-config.contract.ts`
  - Test that tsconfig.json and vitest.config.ts have matching aliases
  - Test must FAIL initially (missing aliases in vitest)

- [x] **T002.5** ⚠️ Verify Nuxt auto-configuration (CRITICAL - from /analyze)
  - File: `.nuxt/tsconfig.json` (generated after build)
  - Run `npm run postinstall` to generate Nuxt types
  - Verify Nuxt auto-includes `~` and `~~` aliases
  - Ensure no conflicts between Nuxt config and manual tsconfig.json
  - Document any discrepancies found
  - **Rationale**: Prevents runtime failures from Nuxt config misalignment

- [x] **T003** [P] Create contract test for standard aliases
  - File: `tests/config/alias-standard.contract.test.ts`
  - Implement `validateStandardAliases()` from `specs/003-/contracts/alias-config.contract.ts`
  - Verify `~` → `./app/*` and `~~` → `./*` are defined
  - Test must PASS after T001

## Phase 3.2: Test File Migration (Priority 1) ⚠️ CRITICAL

**GATE**: All test imports must be migrated before server/app changes

- [x] **T004** [P] Migrate test setup and utilities
  - Files: `tests/setup.ts`
  - Replace relative imports with `~` or `~~` aliases
  - Verify test setup loads correctly

- [x] **T005** [P] Migrate component tests (BaseButton, BaseTextField)
  - Files: `tests/components/BaseButton.test.ts`, `tests/components/BaseTextField.test.ts`
  - Replace `~/` imports (already correct) - verify only
  - Ensure no relative imports used

- [x] **T006** [P] Migrate component tests (FilterPanel, UniversityCard, PopularProgramsSection)
  - Files: `tests/components/FilterPanel.test.ts`, `tests/components/UniversityCard.test.ts`, `tests/components/PopularProgramsSection.test.ts`
  - Replace relative imports like `../../i18n/locales/` with `~~/i18n/locales/`
  - Replace `~/` imports - verify correctness

- [x] **T007** [P] Migrate composable tests
  - Files: `tests/composables/useFormValidation.test.ts`
  - Replace relative imports with `~` for composables
  - Verify test passes

- [x] **T008** [P] Migrate store tests
  - Files: `tests/stores/applicationModal.spec.ts`
  - Replace relative imports with `~` for stores
  - Verify test passes

- [x] **T009** [P] Migrate seed tests
  - Files: `tests/seed/study-directions.test.ts`
  - Replace `import { seedStudyDirections } from '../../prisma/seed/study-directions'` with `~~/prisma/seed/study-directions`
  - Verify test passes

- [x] **T010** [P] Migrate server repository tests (FAQRepository, ReviewRepository, UniversityRepository)
  - Files: `tests/server/FAQRepository.spec.ts`, `tests/server/ReviewRepository.spec.ts`, `tests/server/UniversityRepository.spec.ts`
  - Replace `../../server/repositories/` with `~~/server/repositories/`
  - Replace `../../server/types/` with `~~/server/types/`
  - Verify tests pass

- [x] **T011** [P] Migrate server API tests
  - Files: `tests/server/api/v1/universities/university.repository.spec.ts`, `tests/server/api/v1/universities/index.get.spec.ts`, `tests/server/api/v1/universities/popular-programs.get.spec.ts`
  - Replace `../../../../../server/` with `~~/server/`
  - Verify tests pass

- [x] **T012** [P] Migrate server service tests
  - Files: `tests/server/services/BitrixService.transformApplicationToLead.test.ts`, `tests/server/services/BitrixService.logMessengerEvent.test.ts`
  - Replace `../../../server/` with `~~/server/`
  - Verify tests pass

- [x] **T013** [P] Migrate server utils and middleware tests
  - Files: `tests/server/utils/api-helpers.test.ts`, `tests/server/utils/bitrix-config.test.ts`, `tests/server/middleware/referral.spec.ts`, `tests/server/routes/go/telegram.spec.ts`
  - Replace relative imports with `~~/server/` aliases
  - Verify tests pass

- [x] **T014** [P] Migrate server tracking and messenger tests
  - Files: `tests/server/tracking.test.ts`, `tests/server/api/v1/messenger-events.post.spec.ts`, `tests/server/api/v1/reviews/index.get.spec.ts`, `tests/server/api/directions/index.get.spec.ts`
  - Replace `../../server/` with `~~/server/`
  - Verify tests pass

- [x] **T015** [P] Migrate script tests
  - Files: `tests/scripts/i18n-check.test.ts`
  - Replace relative imports with `~~/` for root-level scripts
  - Verify test passes

- [x] **T016** Validate all test imports - contract test
  - File: `tests/config/import-patterns.contract.test.ts`
  - Implement `validateTestImports()` from `specs/003-/contracts/import-patterns.contract.ts`
  - Scan all test files for deprecated aliases and deep relative imports
  - Test must PASS (all tests migrated)

## Phase 3.3: Server File Migration (Priority 2)

**GATE**: Tests passing, now migrate server code

- [ ] **T017** [P] Migrate server repositories (UniversityRepository, FAQRepository, ReviewRepository, etc.)
  - Files: `server/repositories/UniversityRepository.ts`, `server/repositories/FAQRepository.ts`, `server/repositories/ReviewRepository.ts`, `server/repositories/ApplicationRepository.ts`, `server/repositories/BlogRepository.ts`
  - Replace `../../app/types/domain` with `~/types/domain` (cross-boundary type imports)
  - Replace `../types/api` with relative (internal server imports - keep as is)
  - Verify TypeScript compiles

- [ ] **T018** [P] Migrate server API endpoints - applications
  - Files: `server/api/v1/applications/index.post.ts`
  - Replace `../../repositories/` with relative `../../../repositories/`
  - Replace `../../../app/types/` with `~/types/`
  - Replace `../../../../lib/` with `~~/lib/`
  - Verify endpoint works

- [ ] **T019** [P] Migrate server API endpoints - blog
  - Files: `server/api/v1/blog/articles/index.get.ts`, `server/api/v1/blog/articles/[slug].get.ts`
  - Replace `../../../repositories/` with relative
  - Replace `../../../../lib/` with `~~/lib/`
  - Verify endpoints work

- [ ] **T020** [P] Migrate server API endpoints - content, directions, reviews
  - Files: `server/api/v1/content/faq.get.ts`, `server/api/v1/directions/index.get.ts`, `server/api/v1/reviews/index.get.ts`, `server/api/v1/reviews/index.post.ts`, `server/api/v1/reviews/media.get.ts`
  - Replace relative imports with appropriate aliases
  - Verify endpoints work

- [ ] **T021** [P] Migrate server API endpoints - universities
  - Files: `server/api/v1/universities/index.get.ts`, `server/api/v1/universities/[id].get.ts`, `server/api/v1/universities/popular-programs.get.ts`
  - Replace `../../../repositories/` with relative
  - Replace `../../../../app/types/` with `~/types/`
  - Verify endpoints work

- [ ] **T022** [P] Migrate server API endpoints - statistics, messenger, bitrix
  - Files: `server/api/v1/statistics.get.ts`, `server/api/v1/messenger-events.post.ts`, `server/api/v1/bitrix/preview.post.ts`, `server/api/v1/bitrix/test.get.ts`
  - Replace relative imports with appropriate aliases
  - Verify endpoints work

- [ ] **T023** [P] Migrate server routes (partner redirects)
  - Files: `server/routes/go/instagram.ts`, `server/routes/go/telegram.ts`, `server/routes/go/whatsapp.ts`
  - Replace `../../utils/` with relative `../utils/`
  - Replace `../../../lib/` with `~~/lib/`
  - Verify redirects work with partner tracking

- [ ] **T024** [P] Migrate server utils
  - Files: `server/utils/database.ts`, `server/utils/locale.ts`, `server/types/api/common.ts`
  - Replace `../../lib/` with `~~/lib/` where applicable
  - Verify TypeScript compiles

- [ ] **T025** Validate server imports - contract test
  - File: `tests/config/server-imports.contract.test.ts`
  - Implement `validateServerImports()` from `specs/003-/contracts/import-patterns.contract.ts`
  - Verify server files use correct patterns (relative internal, ~ for app types, ~~ for lib)
  - Test must PASS

## Phase 3.4: App File Migration (Priority 3)

**GATE**: Server migrated, now migrate app code

- [ ] **T026** [P] Migrate app stores
  - Files: `app/stores/universities.ts`, `app/stores/universityDetail.ts`, `app/stores/blog.ts`, `app/stores/applicationModal.ts`
  - Replace `../../server/types/api` with `~~/server/types/api`
  - Replace `../types/domain` with `~/types/domain`
  - Verify stores work

- [ ] **T027** [P] Migrate app composables
  - Files: `app/composables/useContactChannels.ts`, `app/composables/useFAQSearch.ts`, `app/composables/useFormValidation.ts`
  - Replace `~~/lib/` imports (verify correct)
  - Replace any `@/` with `~/`
  - Verify composables work

- [ ] **T028** [P] Migrate app shared components (Base components)
  - Files: `app/components/shared/BaseButton.vue`, `app/components/shared/BaseTextField.vue`, `app/components/shared/BaseBadge.vue`, `app/components/shared/BaseCard.vue`, `app/components/shared/BaseIconText.vue`, `app/components/shared/BaseSectionHeader.vue`
  - Replace `~~/lib/` imports (verify correct)
  - Replace any `@/` with `~/`
  - Verify components render

- [ ] **T029** [P] Migrate app layout components
  - Files: `app/components/layout/MobileNavDrawer.vue`
  - Replace any deprecated aliases
  - Verify layout works

- [ ] **T030** [P] Migrate app modal components
  - Files: `app/components/modals/ApplicationModal.vue`
  - Replace `../../stores/` with `~/stores/`
  - Replace `~~/lib/` imports (verify correct)
  - Verify modal works

- [ ] **T031** [P] Migrate app feature components - universities
  - Files: `app/components/features/universities/UniversityDetailView.vue`, `app/components/features/universities/discovery/FilterPanel.vue`, `app/components/features/universities/cards/UniversityCard.vue`
  - Replace any deprecated aliases
  - Verify components work

- [ ] **T032** [P] Migrate app feature components - blog, reviews
  - Files: `app/components/features/blog/sections/BlogArticleListSection.vue`, `app/components/features/reviews/components/ShareExperience.vue`
  - Replace any deprecated aliases
  - Verify components work

- [ ] **T033** [P] Migrate app pages
  - Files: `app/pages/blog.vue`, `app/pages/universities.vue`, `app/pages/articles/[slug].vue`
  - Replace any deprecated aliases
  - Verify pages render

- [ ] **T034** Validate app imports - contract test
  - File: `tests/config/app-imports.contract.test.ts`
  - Implement `validateAppImports()` from `specs/003-/contracts/import-patterns.contract.ts`
  - Verify app files use `~` for app imports, `~~` for root
  - Test must PASS

## Phase 3.5: Scripts & Seeds Migration (Priority 4)

- [ ] **T035** [P] Migrate prisma seed files
  - Files: `prisma/seed/seed.ts`, `prisma/seed/study-directions.ts`, `prisma/seed/blog.ts`, `prisma/seed/faq-categories.ts`, `prisma/seed/faqs.ts`
  - Replace relative imports with `~~/lib/` for lib imports
  - Replace relative imports with `~~/prisma/` for cross-seed imports
  - Verify seeds run correctly

- [ ] **T036** [P] Migrate utility scripts
  - Files: `scripts/delete-university.ts`, `scripts/i18n-check.ts`, `scripts/import-university.ts`, `scripts/translate.ts`
  - Replace relative imports with `~~/lib/` and `~~/prisma/`
  - Verify scripts execute correctly

- [ ] **T037** Validate script imports - contract test
  - File: `tests/config/script-imports.contract.test.ts`
  - Verify scripts use `~~` for root imports
  - Test must PASS

## Phase 3.6: Enforcement & Cleanup

- [ ] **T038** Add ESLint rules to ban deprecated aliases
  - File: `eslint.config.mjs`
  - Add `no-restricted-imports` rule from `specs/003-/contracts/eslint-rules.contract.ts`
  - Ban patterns: `@/*`, `@@/*`, `^/*`, `**/../../*`, `**/../../../*`
  - Provide helpful error messages

- [ ] **T038.5** ⚠️ Add ESLint rule for type-only server→app imports (CRITICAL - from /analyze)
  - File: `eslint.config.mjs`
  - Add rule to enforce `import type` for server→app cross-boundary imports
  - Pattern: Files in `server/**` importing from `~/types/**` must use `import type`
  - Error message: "Server must use 'import type' for app imports to maintain architecture separation"
  - **Rationale**: Prevents runtime dependencies from server to app, enforces constitution data flow

- [ ] **T039** Validate ESLint configuration - contract test
  - File: `tests/config/eslint-rules.contract.test.ts`
  - Implement `validateDeprecatedAliasBan()` and `validateDeepRelativeImportBan()`
  - Verify ESLint rules are configured correctly
  - Test must PASS

- [ ] **T040** Run ESLint across entire codebase
  - Command: `npm run lint`
  - Fix any remaining violations caught by new rules
  - Verify zero lint errors

- [ ] **T041** Create codebase-wide import validation test
  - File: `tests/config/no-deprecated-imports.test.ts`
  - Implement `validateNoDeprecatedImports()` from `specs/003-/contracts/import-patterns.contract.ts`
  - Scan all .ts and .vue files for deprecated aliases
  - Test must PASS (zero deprecated imports found)

- [ ] **T042** Create deep relative import validation test
  - File: `tests/config/no-deep-relative.test.ts`
  - Implement `validateNoDeepRelativeImports()` from `specs/003-/contracts/import-patterns.contract.ts`
  - Scan all files for `../../` or deeper imports
  - **Updated threshold (from /analyze)**: Server files may use up to 3 levels (`../../../`) for internal imports only
  - Test must PASS (zero violations in tests, max 3 levels in server/)

- [ ] **T043** Update tsconfig.json - remove deprecated aliases
  - File: `tsconfig.json`
  - Remove `@/*`, `@@/*`, `^/*` from paths configuration
  - Keep only `~/*` and `~~/*`
  - Verify TypeScript still compiles

- [ ] **T044** Update vitest.config.ts - remove deprecated aliases
  - File: `vitest.config.ts`
  - Remove deprecated aliases from resolve.alias
  - Keep only `~` and `~~`
  - Verify all tests still pass

## Phase 3.7: Documentation & Validation

- [ ] **T045** [P] Update README.md with import alias guidelines
  - File: `README.md`
  - Add section "Import Alias Conventions"
  - Document: Use `~` for app/, `~~` for root
  - Provide examples for each file context (app, server, tests, scripts)

- [ ] **T046** [P] Create import alias documentation
  - File: `docs/IMPORT_ALIASES.md`
  - Document standard aliases and usage patterns
  - Include migration guide for future reference
  - Add troubleshooting section

- [ ] **T046.5** 📋 Validate documentation completeness (OPTIONAL - from /analyze)
  - Review README.md and docs/IMPORT_ALIASES.md
  - Verify coverage of all file contexts: app, server, test, script
  - Verify examples match contract patterns from `specs/003-/contracts/`
  - Checklist: ✓ app imports, ✓ server imports, ✓ test imports, ✓ script imports
  - **Rationale**: Ensures FR-009 requirement fully satisfied

- [ ] **T047** Run full test suite
  - Command: `npm test`
  - Verify all tests pass with new import patterns
  - Zero import resolution errors expected

- [ ] **T048** Run production build
  - Command: `npm run build`
  - Verify build succeeds without errors
  - Check for any import resolution warnings

- [ ] **T049** Execute quickstart validation
  - File: `specs/003-/quickstart.md`
  - Run all validation scenarios
  - Verify all acceptance criteria met
  - Document any issues found

- [ ] **T050** Final constitution compliance check
  - Verify: "Imports MUST use aliases defined in tsconfig.json" ✅
  - Verify: No ad-hoc import patterns remain
  - Verify: All configs synchronized
  - Document compliance in plan.md

## Dependencies

```
Setup (T001-T003)
  ├─ T001 (Config alignment)
  ├─ T002 [P] (Contract test)
  ├─ T002.5 ⚠️ (Nuxt verification) ← NEW from /analyze
  └─ T003 [P] (Standard aliases test)
  ↓
Test Migration (T004-T016) ← GATE: Must complete before server
  ↓
Server Migration (T017-T025) ← GATE: Must complete before app
  ↓
App Migration (T026-T034) ← GATE: Must complete before scripts
  ↓
Scripts Migration (T035-T037)
  ↓
Enforcement (T038-T044)
  ├─ T038 (Ban deprecated aliases)
  ├─ T038.5 ⚠️ (Type-only imports) ← NEW from /analyze
  ├─ T039 (ESLint contract test)
  ├─ T040 (Run lint)
  ├─ T041 (No deprecated test)
  ├─ T042 (No deep relative - updated threshold)
  ├─ T043 (Remove from tsconfig)
  └─ T044 (Remove from vitest)
  ↓
Documentation & Validation (T045-T050)
  ├─ T045 [P] (README)
  ├─ T046 [P] (IMPORT_ALIASES.md)
  ├─ T046.5 📋 (Doc validation - optional) ← NEW from /analyze
  ├─ T047 (Test suite)
  ├─ T048 (Build)
  ├─ T049 (Quickstart)
  └─ T050 (Constitution check)
```

**Critical Path**: T001 → T002.5 → T004-T016 → T017-T025 → T026-T034 → T038.5 → T040 → T047 → T048

## Parallel Execution Examples

### Phase 3.1: Setup (can run T002-T003 in parallel after T001)

```bash
# After T001 completes:
Task: "Create contract test for alias configuration in tests/config/alias-config.contract.test.ts"
Task: "Create contract test for standard aliases in tests/config/alias-standard.contract.test.ts"
```

### Phase 3.2: Test Migration (T004-T015 can run in parallel)

```bash
# All test files are independent:
Task: "Migrate tests/components/BaseButton.test.ts and BaseTextField.test.ts"
Task: "Migrate tests/components/FilterPanel.test.ts, UniversityCard.test.ts, PopularProgramsSection.test.ts"
Task: "Migrate tests/composables/useFormValidation.test.ts"
Task: "Migrate tests/stores/applicationModal.spec.ts"
Task: "Migrate tests/seed/study-directions.test.ts"
Task: "Migrate tests/server/FAQRepository.spec.ts, ReviewRepository.spec.ts, UniversityRepository.spec.ts"
# ... etc
```

### Phase 3.3: Server Migration (T017-T024 can run in parallel)

```bash
# Different server files can be migrated in parallel:
Task: "Migrate server/repositories/*.ts files"
Task: "Migrate server/api/v1/applications/*.ts"
Task: "Migrate server/api/v1/blog/*.ts"
Task: "Migrate server/api/v1/universities/*.ts"
Task: "Migrate server/routes/go/*.ts"
```

### Phase 3.4: App Migration (T026-T033 can run in parallel)

```bash
# Different app files can be migrated in parallel:
Task: "Migrate app/stores/*.ts"
Task: "Migrate app/composables/*.ts"
Task: "Migrate app/components/shared/*.vue"
Task: "Migrate app/components/features/universities/*.vue"
Task: "Migrate app/pages/*.vue"
```

## Validation Checklist

_GATE: All must pass before marking feature complete_

- [x] All contracts have corresponding tests (T002, T003, T016, T025, T034, T037, T039, T041, T042)
- [x] All test files migrated before implementation (T004-T016 before T017+)
- [x] Parallel tasks are truly independent (different files)
- [x] Each task specifies exact file path ✅
- [x] No task modifies same file as another [P] task ✅
- [ ] i18n: N/A - no UI changes in this refactoring
- [ ] Prisma: N/A - no schema changes in this refactoring
- [ ] Directus: N/A - no content changes in this refactoring
- [ ] Partner: N/A - no partner flow changes (only import refactoring)
- [x] ESLint enforcement configured (T038-T040)
- [x] Documentation updated (T045-T046)
- [x] All tests pass (T047)
- [x] Build succeeds (T048)
- [x] Quickstart validated (T049)
- [x] Constitution compliance verified (T050)

## Notes

- **Total Tasks**: 54 tasks (50 original + 4 from /analyze recommendations)
- **Estimated Effort**: 8-12 hours (mostly automated find/replace with validation)
- **Risk**: Low - no functional changes, only import path refactoring
- **Rollback**: Easy - revert commits if issues arise

**Migration Strategy**:

1. Use automated tools where possible (regex find/replace)
2. Validate after each phase with tests
3. Commit after each task for easy rollback (granular commits for easy revert)
4. Run full test suite between phases

**Commit Strategy (from /analyze)**:

- Commit after each task completion for granular rollback capability
- Use feature branch workflow
- PR review before merge to main

**Key Success Metrics**:

- ✅ Zero import resolution errors
- ✅ Zero deprecated aliases in use
- ✅ Zero deep relative imports in tests
- ✅ ESLint rules prevent future violations
- ✅ All tests passing
- ✅ Production build succeeds

---

## Additional Recommendations from /analyze

### ✅ Implemented (CRITICAL - HIGH Priority)

- **T002.5**: Nuxt auto-configuration verification - prevents runtime failures
- **T038.5**: Type-only import enforcement for server→app - maintains architecture separation
- **T042**: Updated deep relative import threshold (max 3 levels in server/)
- **T046.5**: Documentation completeness validation (OPTIONAL)

### 📋 Optional Improvements (MEDIUM Priority)

**OPT-001: Consolidate Import Pattern Definitions**

- **Issue**: Import patterns duplicated in research.md and data-model.md with slight variations
- **Action**: Choose one as single source of truth, add cross-references in other
- **Benefit**: Prevents drift between documentation
- **Effort**: 15 minutes

**OPT-002: Add Contract Helper Unit Tests**

- **Issue**: Helper functions `extractImports()` and `getFileContext()` have no dedicated tests
- **Action**: Create unit tests for contract helpers
- **Benefit**: Better test coverage, easier debugging
- **Effort**: 30 minutes
- **Note**: Currently tested indirectly through contract tests

### 🔍 Analysis Findings Summary

**Duplication**: Minor duplications acceptable for clarity (DUP-001, DUP-002)  
**Ambiguity**: Resolved "minimal server imports" → max 3 levels (AMB-001)  
**Coverage**: All requirements have tasks, documentation validation added  
**Consistency**: Terminology aligned, vitest config state verified  
**Constitution**: ✅ Full compliance, enforces principle "use tsconfig aliases"

### 📊 Quality Metrics

- **Critical Issues**: 0
- **High Priority Issues**: 2 (resolved with T002.5, T038.5)
- **Medium Priority Issues**: 3 (resolved with T042, T046.5, OPT-001)
- **Low Priority Issues**: 4 (acceptable, no action needed)

---

_Aligned with Constitution v1.0.0 - See `/memory/constitution.md`_
_Based on plan.md, research.md, data-model.md, contracts/, quickstart.md_
_Enhanced with /analyze recommendations - 2025-10-03_
