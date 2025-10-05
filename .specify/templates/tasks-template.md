# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: repositories, services, endpoints
   → Integration: DB (Prisma), Directus, Bitrix, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
   → Constitution gates satisfied? (auto-import policy & alias mappings, runtime config declarations, i18n keys, migrations, Directus usage, partner flows)
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **This repository (Nuxt 4)**: `app/`, `server/`, `prisma/`, `i18n/locales/`, `tests/`
  - Server endpoints: `server/api/**` (for `/api/**`) or `server/routes/**` (for non-`/api` routes)
  - Repositories (Prisma): `server/repositories/**`
  - i18n: `i18n/locales/{en,ru,kk,tr}/**/*.json`
- **Alternative**: If plan.md declares a different structure, adjust paths accordingly

## Phase 3.1: Setup

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [ ] T004 [P] Contract test <HTTP> <endpoint> in `tests/contract/<endpoint>.spec.ts` (Vitest)
- [ ] T005 [P] Contract test <HTTP> <endpoint> in `tests/contract/<endpoint-2>.spec.ts`
- [ ] T006 [P] Integration test: <primary user flow> in `tests/integration/<feature>.spec.ts`
- [ ] T007 [P] Integration test: partner ref propagation in `tests/integration/partner-ref.spec.ts`

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [ ] T008 [P] Repository and types for <entity> in `server/repositories/<entity>.ts` and `server/types/api/<entity>.ts`
- [ ] T009 [P] Server endpoint(s) in `server/api/<path>.ts` or route(s) in `server/routes/<path>.ts`
- [ ] T010 [P] Input validation and error handling (zod/yup or custom) shared between server and app
- [ ] T011 Implement partner redirect(s) `/routes/go/{telegram|instagram|whatsapp}` in `server/routes/go/*.ts` (forward ref to Bitrix)
- [ ] T012 Directus integration for dynamic content (use `NUXT_PUBLIC_DIRECTUS_URL`, service token if required)
- [ ] T013 Logging and request tracing for changed endpoints

## Phase 3.4: Integration

- [ ] T015 Connect repositories to Prisma models; update `prisma/schema.prisma` if needed
- [ ] T016 Create Prisma migration for schema changes and run `npm run db:migrate`
- [ ] T017 [P] Update seed scripts if entities changed (`prisma/seed/*`)
- [ ] T018 CORS and security headers (Nuxt/Nitro config)

## Phase 3.5: Polish

- [ ] T019 [P] Unit tests for validation in `tests/unit/<validation>.spec.ts`
- [ ] T020 Performance tests (<200ms p95 for critical endpoints)
- [ ] T021 [P] Update docs and `README.md` if env vars or flows changed
- [ ] T022 Remove duplication and ensure `tsconfig.json` aliases used
- [ ] T023 Run manual-testing checklist

## Phase 3.6: i18n & Content (mandatory for UI changes)

- [ ] T024 [P] Add/Update i18n keys in `i18n/locales/{en,ru,kk,tr}.json`
- [ ] T025 [P] Validate all UI/validation texts have translations
- [ ] T026 Sync Directus collections/flows and `_translations` tables for new content

## Dependencies

- Tests (T004-T007) before implementation (T008-T013)
- T008 blocks T009, T015
- T016 blocks T018
- Implementation before polish (T019-T023) and i18n/content (T024-T026)

## Parallel Example

```
# Launch T004-T007 together:
Task: "Contract test POST /api/universities in tests/contract/universities_post.spec.ts"
Task: "Contract test GET /api/universities/{id} in tests/contract/universities_get.spec.ts"
Task: "Integration test primary user flow in tests/integration/search_and_apply.spec.ts"
Task: "Integration test partner ref propagation in tests/integration/partner-ref.spec.ts"
```

## Notes

- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules

_Applied during main() execution_

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist

_GATE: Checked by main() before returning_

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task
- [ ] i18n: All new/changed UI strings have `en,ru,kk,tr` keys
- [ ] Prisma: Schema changes include a migration and seeds updated
- [ ] Directus: Dynamic content integrated via API; `_translations` used where applicable
- [ ] Partner: `/routes/go/*` implemented or updated; Bitrix event forwarding included
- [ ] Components: No manual imports in SFCs; usage follows `nuxt.config.ts -> components` (global components, `Ui` prefix for `app/components/ui/*`, no prefix for `app/components/features/*`)
- [ ] Aliases: `~/*` → `./app/*`, `~~/*` → `./*` (must match `tsconfig.json` and alias tests in `tests/config`)
- [ ] Runtime Config: All `useRuntimeConfig()` variables declared in `nuxt.config.ts -> runtimeConfig`; public vs server-only distinction respected

---

_Aligned with Constitution v1.2.0 - See `/memory/constitution.md`_
