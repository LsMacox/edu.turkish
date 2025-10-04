# Tasks: Standardize Import Paths to Nuxt 4 Conventions

**Input**: Design documents from `/home/lsmacox/projects/edu.turkish/specs/004-standardize-imports-to/`
**Prerequisites**: plan.md ✅, research.md ✅, quickstart.md ✅

## Execution Flow

This is a refactoring task with no new features. The workflow is:
1. **Audit** → Identify all import patterns across the codebase
2. **Configure** → Update Vitest configuration for `~/` alias support
3. **Refactor** → Remove auto-importable items, standardize explicit imports
4. **Validate** → Run all validation gates (TypeScript, ESLint, Vitest, build)

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- All tasks include exact file paths

## Phase 3.1: Audit & Analysis

- [X] **T001** Audit all import statements in `app/` directory
  - Scan for Vue API imports (`from 'vue'`)
  - Scan for Pinia store imports (`from '~/stores/*'`)
  - Scan for composable imports (`from '~/composables/*'`)
  - Scan for component imports (`from '~/components/*'`)
  - Generate list of files to refactor
  - **Output**: List of files categorized by import type
  - **Result**: Found ~20 files with Vue API imports, ~20 files with store imports, ~8 files with composable imports

- [X] **T002** Audit all import statements in `server/` directory
  - Verify all imports use `~/` alias consistently
  - Identify any relative imports (`../`)
  - Identify any `@/` alias usage
  - **Output**: List of server files needing standardization
  - **Result**: Found ~15 files with relative imports (`../`) - need standardization

- [X] **T003** Audit all import statements in `tests/` directory
  - Verify test imports are explicit (no auto-imports expected)
  - Check for relative imports or `@/` aliases
  - **Output**: List of test files needing standardization
  - **Result**: No relative imports or `@/` aliases found - tests already use `~/` consistently

## Phase 3.2: Configuration

- [X] **T004** Update `vitest.config.ts` with vite-tsconfig-paths plugin
  - Import `tsconfigPaths` from `vite-tsconfig-paths`
  - Add `tsconfigPaths()` to plugins array
  - Ensure compatibility with existing Vue plugin
  - **File**: `/home/lsmacox/projects/edu.turkish/vitest.config.ts`
  - **Result**: Added tsconfigPaths() plugin to vitest.config.ts

- [X] **T005** Verify `nuxt.config.ts` alias configuration
  - Confirm `~/` alias is available (default in Nuxt 4)
  - Document any custom aliases if needed
  - **File**: `/home/lsmacox/projects/edu.turkish/nuxt.config.ts`
  - **Result**: Verified - `~/` alias is available by default in Nuxt 4, no custom configuration needed

## Phase 3.3: Refactor app/ Directory

**IMPORTANT**: These tasks remove unnecessary imports that Nuxt 4 auto-imports. Each task processes multiple files in the same directory.

- [ ] **T006** [P] Remove Vue API imports from `app/components/` files
  - Remove `import { ref, computed, watch, onMounted, etc. } from 'vue'`
  - Remove `import { useRouter, useRoute, navigateTo } from 'nuxt/app'`
  - Keep type imports (e.g., `import type { Ref } from 'vue'`)
  - **Files**: All `.vue` and `.ts` files in `app/components/**`

- [ ] **T007** [P] Remove Pinia store imports from `app/components/` files
  - Remove `import { useXxxStore } from '~/stores/xxx'`
  - Stores are auto-imported by Nuxt + Pinia
  - **Files**: All `.vue` and `.ts` files in `app/components/**`

- [ ] **T008** [P] Remove composable imports from `app/components/` files
  - Remove `import { useXxx } from '~/composables/xxx'`
  - Composables are auto-imported by Nuxt
  - Keep explicit imports for types from composables
  - **Files**: All `.vue` and `.ts` files in `app/components/**`

- [ ] **T009** [P] Standardize explicit imports in `app/components/` files
  - Ensure all remaining imports use `~/` alias
  - Replace any `@/` or relative imports with `~/`
  - Keep imports for: types, lib/, third-party packages
  - **Files**: All `.vue` and `.ts` files in `app/components/**`

- [ ] **T010** [P] Remove Vue API imports from `app/pages/` files
  - Remove `import { ref, computed, watch, onMounted, etc. } from 'vue'`
  - Remove `import { useRouter, useRoute, navigateTo } from 'nuxt/app'`
  - Keep type imports
  - **Files**: All `.vue` files in `app/pages/**`

- [ ] **T011** [P] Remove store and composable imports from `app/pages/` files
  - Remove Pinia store imports
  - Remove composable imports
  - **Files**: All `.vue` files in `app/pages/**`

- [ ] **T012** [P] Standardize explicit imports in `app/pages/` files
  - Ensure all remaining imports use `~/` alias
  - Replace any `@/` or relative imports
  - **Files**: All `.vue` files in `app/pages/**`

- [ ] **T013** [P] Remove Vue API imports from `app/layouts/` files
  - Remove auto-importable Vue APIs
  - Keep type imports
  - **Files**: All `.vue` files in `app/layouts/**`

- [ ] **T014** [P] Standardize explicit imports in `app/layouts/` files
  - Ensure `~/` alias usage
  - **Files**: All `.vue` files in `app/layouts/**`

- [ ] **T015** [P] Remove Vue API imports from `app/composables/` files
  - Remove `import { ref, computed, watch, etc. } from 'vue'`
  - Keep type imports
  - **Files**: All `.ts` files in `app/composables/**`

- [ ] **T016** [P] Standardize explicit imports in `app/composables/` files
  - Ensure `~/` alias for lib/, types, server imports
  - **Files**: All `.ts` files in `app/composables/**`

- [ ] **T017** [P] Remove Vue API imports from `app/stores/` files
  - Remove auto-importable Vue APIs
  - Keep type imports
  - **Files**: All `.ts` files in `app/stores/**`

- [ ] **T018** [P] Standardize explicit imports in `app/stores/` files
  - Ensure `~/` alias usage
  - **Files**: All `.ts` files in `app/stores/**`

- [ ] **T019** [P] Standardize explicit imports in `app/types/` files
  - Ensure `~/` alias for any cross-type imports
  - **Files**: All `.ts` files in `app/types/**`

## Phase 3.4: Refactor server/ Directory

- [ ] **T020** [P] Standardize imports in `server/api/` files
  - Ensure all imports use `~/` alias
  - Replace any relative imports or `@/` aliases
  - **Files**: All `.ts` files in `server/api/**`

- [ ] **T021** [P] Standardize imports in `server/repositories/` files
  - Ensure `~/` alias for lib/, types imports
  - **Files**: All `.ts` files in `server/repositories/**`

- [ ] **T022** [P] Standardize imports in `server/routes/` files
  - Ensure `~/` alias usage
  - **Files**: All `.ts` files in `server/routes/**`

- [ ] **T023** [P] Standardize imports in `server/middleware/` files
  - Ensure `~/` alias usage
  - **Files**: All `.ts` files in `server/middleware/**`

- [ ] **T024** [P] Standardize imports in `server/types/` files
  - Ensure `~/` alias for cross-type imports
  - **Files**: All `.ts` files in `server/types/**`

## Phase 3.5: Refactor tests/ Directory

**NOTE**: Test files need explicit imports (no auto-import). Only standardize alias usage.

- [ ] **T025** [P] Standardize imports in `tests/components/` files
  - Ensure `~/` alias for all imports
  - Replace any relative imports or `@/` aliases
  - Keep explicit component imports (required for tests)
  - **Files**: All `.ts` files in `tests/components/**`

- [ ] **T026** [P] Standardize imports in `tests/composables/` files
  - Ensure `~/` alias usage
  - **Files**: All `.ts` files in `tests/composables/**`

- [ ] **T027** [P] Standardize imports in `tests/config/` files
  - Ensure `~/` alias usage
  - **Files**: All `.ts` files in `tests/config/**`

- [ ] **T028** [P] Standardize imports in `tests/scripts/` files
  - Ensure `~/` alias usage
  - **Files**: All `.ts` files in `tests/scripts/**`

- [ ] **T029** [P] Standardize imports in `tests/stores/` files (if exists)
  - Ensure `~/` alias usage
  - **Files**: All `.ts` files in `tests/stores/**`

## Phase 3.6: Refactor lib/ and scripts/

- [ ] **T030** [P] Standardize imports in `lib/` files
  - Ensure `~/` alias for cross-lib imports
  - **Files**: All `.ts` files in `lib/**`

- [ ] **T031** [P] Standardize imports in `scripts/` files
  - Ensure `~/` alias usage
  - **Files**: All `.ts` files in `scripts/**`

## Phase 3.7: Validation (Sequential - Must Run in Order)

**CRITICAL**: These validation tasks must pass before the refactoring is complete.

- [ ] **T032** Run TypeScript type checking
  - Start dev server: `npm run dev`
  - Wait for "Nuxt is ready" message
  - Verify no TypeScript errors in console
  - Stop server (Ctrl+C)
  - **Expected**: Zero TypeScript errors

- [ ] **T033** Run ESLint validation
  - Execute: `npm run lint`
  - **Expected**: Exit code 0, no import-related errors

- [ ] **T034** Run Vitest test suite
  - Execute: `npm run test`
  - **Expected**: All tests pass (same count as before refactoring)
  - **Note**: This validates that vite-tsconfig-paths is working

- [ ] **T035** Verify production build
  - Execute: `npm run build`
  - **Expected**: Build completes without errors

- [ ] **T036** Execute quickstart validation steps
  - Follow all 8 steps in `quickstart.md`
  - Verify no unnecessary imports in app/
  - Verify no relative imports or `@/` aliases
  - Verify manual smoke tests pass
  - **Expected**: All quickstart checks pass

## Dependencies

```
Audit Phase (T001-T003)
  ↓
Configuration Phase (T004-T005)
  ↓
Refactoring Phase (T006-T031) - All [P] tasks can run in parallel
  ↓
Validation Phase (T032-T036) - Must run sequentially
```

**Key Dependencies**:
- T004 (Vitest config) must complete before T034 (test suite)
- All refactoring tasks (T006-T031) must complete before validation (T032-T036)
- Validation tasks (T032-T036) must run in order

## Parallel Execution Examples

### Audit Phase (Parallel)
```bash
# Run T001-T003 together:
Task: "Audit app/ imports"
Task: "Audit server/ imports"
Task: "Audit tests/ imports"
```

### Refactoring Phase (Parallel by Directory)
```bash
# All T006-T031 can run in parallel since they modify different files:
Task: "Remove Vue API imports from app/components/"
Task: "Remove store imports from app/components/"
Task: "Standardize imports in server/api/"
Task: "Standardize imports in tests/components/"
# ... etc
```

### Validation Phase (Sequential)
```bash
# T032-T036 MUST run in order:
1. TypeScript check
2. ESLint validation
3. Test suite
4. Production build
5. Quickstart verification
```

## Notes

- **[P] tasks**: All refactoring tasks (T006-T031) are parallel because they modify different files
- **No [P] for validation**: T032-T036 must run sequentially to catch issues early
- **Commit strategy**: Consider committing after each phase (audit, config, refactor, validate)
- **Rollback**: If validation fails, use quickstart.md rollback procedure

## Task Execution Checklist

_Mark tasks as complete during implementation_

**Audit**: T001-T003 (3 tasks)  
**Configuration**: T004-T005 (2 tasks)  
**Refactoring**: T006-T031 (26 tasks)  
**Validation**: T032-T036 (5 tasks)  

**Total**: 36 tasks

## Success Criteria

✅ All 36 tasks completed  
✅ Zero TypeScript errors  
✅ Zero ESLint errors  
✅ All Vitest tests pass  
✅ Production build succeeds  
✅ All quickstart validation steps pass  
✅ No auto-importable items explicitly imported in app/  
✅ All explicit imports use `~/` alias consistently  
✅ No relative imports (`../`) or `@/` aliases remain

## Constitutional Alignment

Following Constitution v1.0.0:

- ✅ **Architecture**: No structural changes, only import syntax
- ✅ **Imports**: Using Nuxt 4's native `~/` alias (aligned with tsconfig principle)
- ✅ **Quality**: All ESLint/Prettier/TypeScript/Vitest gates enforced
- ✅ **Testing**: Existing test suite serves as regression protection

---

_Based on plan.md, research.md, and quickstart.md from `/home/lsmacox/projects/edu.turkish/specs/004-standardize-imports-to/`_
