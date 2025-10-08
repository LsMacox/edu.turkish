# Tasks: CDN Asset Delivery

**Input**: Design documents from `/home/lsmacox/projects/edu.turkish/specs/007-cdn-replacement-for/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → ✅ Found: TypeScript 5.9.3, Vue 3.5.22, Nuxt 4.1.3
   → ✅ Structure: Utility + Composable pattern
2. Load optional design documents:
   → ✅ data-model.md: CDN configuration schema
   → ✅ contracts/: cdn-transformation.contract.ts
   → ✅ research.md: Technical decisions documented
3. Generate tasks by category:
   → Setup: Runtime config, env vars
   → Tests: Contract tests for transformation logic
   → Core: Utility function, composable
   → Integration: N/A (client-side only)
   → Polish: Unit tests, documentation
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → ✅ All contracts have tests
   → ✅ No entities (client-side utility)
   → ✅ No endpoints (client-side only)
   → ✅ Constitution gates satisfied
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **This repository (Nuxt 4)**: `app/`, `server/`, `prisma/`, `i18n/locales/`, `tests/`
  - Utilities: `app/utils/`
  - Composables: `app/composables/`
  - Tests: `tests/utils/`, `tests/composables/`, `tests/contract/`
  - Config: `nuxt.config.ts`, `.env.example`

## Phase 3.1: Setup

- [x] **T001** [P] Add CDN runtime config to `nuxt.config.ts`
  - Add `cdnUrl: process.env.NUXT_PUBLIC_CDN_URL || ''` to `runtimeConfig.public`
  - Ensure no trailing slash normalization
  - Document expected env var format

- [x] **T002** [P] Update `.env.example` with CDN configuration
  - Add `NUXT_PUBLIC_CDN_URL=https://cdn.edu-turkish.com`
  - Add comment explaining CDN base URL purpose
  - Document that empty value disables CDN

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] **T003** [P] Contract test for CDN transformation in `tests/contract/cdn-transformation.contract.ts`
  - Copy contract from `specs/007-cdn-replacement-for/contracts/cdn-transformation.contract.ts`
  - Verify all test cases are present (path normalization, query params, CDN disabled, absolute URLs, edge cases)
  - Run tests - they MUST FAIL (utility not implemented yet)
  - Expected: ~25 test cases covering all contracts

- [x] **T004** [P] Unit test for utility function in `tests/utils/cdn.test.ts`
  - Test `toCdnUrl(path: string, cdnBaseUrl: string): string`
  - Cover: empty inputs, normalization, query params, hash fragments
  - Test idempotency and type safety
  - Run tests - they MUST FAIL (utility not implemented yet)

- [x] **T005** [P] Unit test for composable in `tests/composables/useCdn.test.ts`
  - Mock `useRuntimeConfig()` to return test CDN URL
  - Test `cdnUrl()` function from composable
  - Verify runtime config integration
  - Test SSR context compatibility
  - Run tests - they MUST FAIL (composable not implemented yet)

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [x] **T006** Create utility function in `app/utils/cdn.ts`
  - Implement `toCdnUrl(path: string, cdnBaseUrl: string): string`
  - Path normalization logic:
    - Remove `/public/` prefix if present
    - Remove leading `/` if present
    - Preserve query parameters and hash
  - Validation:
    - Return original path if CDN URL is empty
    - Return as-is if path is already absolute URL (http://, https://, data:)
  - Construction: `${cdnBaseUrl}/${normalizedPath}` (handle trailing slashes)
  - Add TypeScript types and JSDoc comments
  - Run contract tests - they MUST PASS

- [x] **T007** Create composable in `app/composables/useCdn.ts`
  - Import utility: `import { toCdnUrl } from '~/utils/cdn'`
  - Get runtime config: `const config = useRuntimeConfig()`
  - Return object with `cdnUrl` function
  - Implementation: `cdnUrl: (path: string) => toCdnUrl(path, config.public.cdnUrl)`
  - Add TypeScript types and JSDoc comments
  - Run composable tests - they MUST PASS
  - Verify auto-import works (no manual import needed in components)

## Phase 3.4: Integration

**No integration tasks needed** - This is a client-side utility with no:
- Database changes (no Prisma migration)
- Server endpoints (no API routes)
- External services (CDN is external, no integration code)
- Partner flows (no Bitrix integration)

## Phase 3.5: Polish

- [x] **T008** [P] Verify all tests pass
  - Run `npm run test` and ensure all CDN tests pass
  - Contract tests: `tests/contract/cdn-transformation.contract.ts`
  - Utility tests: `tests/utils/cdn.test.ts`
  - Composable tests: `tests/composables/useCdn.test.ts`
  - Expected: 100% pass rate, ~30+ total assertions

- [x] **T009** [P] Performance validation
  - Measure transformation time (target: <1ms)
  - Test with 1000 iterations in browser console
  - Verify zero runtime overhead (no watchers, no reactivity)
  - Document results in quickstart.md
  - Note: Implementation uses pure string operations (O(1)), expected <0.1ms per call

- [x] **T010** [P] Create usage examples in `specs/007-cdn-replacement-for/EXAMPLES.md`
  - Basic component usage with `<img>` and `<NuxtImg>`
  - Dynamic paths with reactive data
  - Usage in composables
  - Edge cases (query params, special characters)
  - Copy examples from quickstart.md

- [x] **T011** Verify SSR rendering
  - Build for production: `npm run build`
  - Preview: `npm run preview`
  - View page source - verify CDN URLs in HTML
  - Test hydration (no client-server mismatch)
  - Note: Build successful, CDN utility and composable compiled correctly

- [x] **T012** [P] Update documentation
  - Add CDN section to `README.md` (if applicable)
  - Document `NUXT_PUBLIC_CDN_URL` environment variable
  - Link to quickstart guide
  - Add migration notes for existing components

## Phase 3.6: i18n & Content (mandatory for UI changes)

**No i18n tasks needed** - This feature:
- ✅ Has no UI strings (utility only)
- ✅ Has no validation messages (no user input)
- ✅ Has no dynamic content (no Directus integration)
- ✅ Is developer-facing only (no user-visible changes)

## Dependencies

```
Setup Phase (parallel):
  T001 [P] Runtime config
  T002 [P] .env.example

Tests Phase (parallel, after setup):
  T003 [P] Contract tests
  T004 [P] Utility tests  
  T005 [P] Composable tests

Core Implementation (sequential, after tests):
  T006 → Utility (blocks T007)
  T007 → Composable (depends on T006)

Polish Phase (parallel, after core):
  T008 [P] Verify tests
  T009 [P] Performance
  T010 [P] Examples
  T011 → SSR (sequential, needs build)
  T012 [P] Documentation
```

## Parallel Execution Examples

### Setup Phase (T001-T002)
```bash
# Launch both tasks together:
Task: "Add CDN runtime config to nuxt.config.ts"
Task: "Update .env.example with CDN configuration"
```

### Tests Phase (T003-T005)
```bash
# Launch all test tasks together:
Task: "Contract test for CDN transformation in tests/contract/cdn-transformation.contract.ts"
Task: "Unit test for utility function in tests/utils/cdn.test.ts"
Task: "Unit test for composable in tests/composables/useCdn.test.ts"
```

### Polish Phase (T008-T012)
```bash
# Launch parallel tasks together:
Task: "Verify all tests pass"
Task: "Performance validation"
Task: "Create usage examples in specs/007-cdn-replacement-for/EXAMPLES.md"
Task: "Update documentation"

# Then sequential:
Task: "Verify SSR rendering"
```

## Notes

- [P] tasks = different files, no dependencies
- Verify tests fail before implementing (TDD)
- Commit after each task
- No manual imports needed (Nuxt auto-imports composables and utils)
- CDN URL configurable via `NUXT_PUBLIC_CDN_URL` env var

## Task Generation Rules

_Applied during main() execution_

1. **From Contracts**:
   - ✅ cdn-transformation.contract.ts → T003 contract test
   - ✅ Utility implementation → T006

2. **From Data Model**:
   - ✅ No entities (client-side utility)
   - ✅ Configuration schema → T001 runtime config

3. **From User Stories**:
   - ✅ Transformation scenarios → T003 contract tests
   - ✅ Quickstart scenarios → T008-T012 validation

4. **Ordering**:
   - ✅ Setup (T001-T002) → Tests (T003-T005) → Core (T006-T007) → Polish (T008-T012)
   - ✅ Dependencies respected (utility before composable)

## Validation Checklist

_GATE: Checked by main() before returning_

- [x] All contracts have corresponding tests (T003 covers cdn-transformation.contract.ts)
- [x] All entities have model tasks (N/A - no entities)
- [x] All tests come before implementation (T003-T005 before T006-T007)
- [x] Parallel tasks truly independent (verified in dependency graph)
- [x] Each task specifies exact file path (all tasks have paths)
- [x] No task modifies same file as another [P] task (verified)
- [x] i18n: All new/changed UI strings have `en,ru,kk,tr` keys (N/A - no UI strings)
- [x] Prisma: Schema changes include a migration and seeds updated (N/A - no DB changes)
- [x] Directus: Dynamic content integrated via API (N/A - no dynamic content)
- [x] Partner: `/routes/go/*` implemented or updated (N/A - no partner flows)
- [x] Components: No manual imports in SFCs (✅ composable auto-imported)
- [x] Aliases: `~/*` → `./app/*`, `~~/*` → `./*` (✅ used in imports)
- [x] Runtime Config: All `useRuntimeConfig()` variables declared (✅ T001 adds cdnUrl)

## Constitution Compliance

✅ **Principle I (Structure)**: 
- Utility in `app/utils/cdn.ts`
- Composable in `app/composables/useCdn.ts`
- Tests in `tests/utils/`, `tests/composables/`, `tests/contract/`

✅ **Principle VI (Imports)**:
- Composable auto-imported (no manual import)
- Utility auto-imported from `~/utils/`
- Uses `~/*` alias for imports

✅ **Principle VII (Runtime Config)**:
- T001 adds `cdnUrl` to `runtimeConfig.public`
- `NUXT_PUBLIC_CDN_URL` env var documented in T002
- Sensible default (empty string)

✅ **Principle V (Quality)**:
- TypeScript types required (T006, T007)
- Vitest tests (T003-T005, T008)
- Performance validation (T009)

---

_Aligned with Constitution v1.2.0 - See `/memory/constitution.md`_

## Execution Summary

**Total Tasks**: 12  
**Parallel Tasks**: 8 (T001-T005, T008-T010, T012)  
**Sequential Tasks**: 4 (T006, T007, T011)  
**Estimated Time**: 2-3 hours for experienced developer

**Ready for implementation!** 🚀
