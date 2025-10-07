# Implementation Plan: Test Infrastructure Modernization

**Branch**: `006-vitest-config-ts` | **Date**: 2025-10-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-vitest-config-ts/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Modernize test infrastructure to eliminate external dependencies (Docker containers, Postgres, Redis) by implementing a centralized `test-utils` module with reusable mocks. Refactor all test files to follow clean AAA structure with minimal comments, ensure compatibility with updated vitest.config.ts, and provide utilities for mocking Nuxt composables, Prisma database operations, and Redis cache operations.

## Technical Context

**Language/Version**: TypeScript 5.9.3, Node.js (via Nuxt 4.1.3)  
**Primary Dependencies**: Vitest 3.2.4, @nuxt/test-utils 3.19.2, @vue/test-utils 2.4.6, Prisma 6.16.3, ioredis 5.8.1, bullmq 5.61.0  
**Storage**: Mock Prisma Client (test), Mock Redis Client (test)  
**Testing**: Vitest with jsdom environment, @testing-library/vue  
**Target Platform**: Node.js test environment (jsdom for components)  
**Project Type**: Nuxt 4 web application (Nuxt auto-imports, server/client split)  
**Performance Goals**: Fast test execution (<5s for unit tests, <30s for full suite), no container startup overhead  
**Constraints**: Zero external dependencies during test runs, compatible with CI/CD pipelines, preserve existing test coverage  
**Scale/Scope**: 43 existing test files across components/, server/, integration/, contract/ directories

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The following MUST be validated against `/memory/constitution.md`:

- Architecture: repository paths (`app/`, `server/`, `prisma/`, `i18n/locales/`, component split between `app/components/features/` and `app/components/**` per auto-import) and data flow (frontend → Pinia store → server API). No direct repository calls from components.
- Imports use `tsconfig.json` aliases; no ad-hoc paths.
- Components (Nuxt auto-import):
  - No manual imports in SFCs for local components
  - `app/components/layout`, `app/components/modals`, `app/components/shared` are global
  - `app/components/ui/*` uses `Ui` prefix (e.g., `<UiButton/>`)
  - `app/components/features/*` has no prefix (`pathPrefix: false`)
  - Aliases: `~/*` → `./app/*`, `~~/*` → `./*` (must match `tsconfig.json` and tests)
- Runtime Config: All variables accessed via `useRuntimeConfig()` MUST be declared in `runtimeConfig` in `nuxt.config.ts`. `NUXT_*` env vars require explicit declaration.
- i18n: All new/changed UI and validation strings have keys for `en`, `ru`, `kk`, `tr`. No hard-coded literals.
- Data layer: Prisma-only via repositories in `server/repositories/`; any schema change includes a Prisma migration (dev: `npm run db:migrate`, prod: `npm run db:deploy`).
- CMS: Dynamic content through Directus; multilingual via `*_translations` tables.
- Partner flows: `?ref` cookie (30 days); `/routes/go/{telegram|instagram|whatsapp}` forward ref to Bitrix.
- Quality: ESLint/Prettier/TypeScript checks and tests (Vitest) pass; styling centralized in `app/assets/css` and `tailwind.config.ts`.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
app/                     # Nuxt frontend code
├── components/          # Auto-imported Vue components
│   ├── features/        # Feature-specific components (no prefix)
│   ├── layout/          # Global layout components
│   ├── modals/          # Global modal components
│   ├── shared/          # Global shared components
│   └── ui/              # UI components (Ui prefix)
├── composables/         # Auto-imported composables
└── pages/              # Nuxt page routes

server/                  # Nuxt server code
├── api/                # Server API endpoints
├── repositories/       # Data access layer (Prisma)
├── services/           # Business logic services
├── types/              # Shared TypeScript types
└── utils/              # Server utilities

tests/                   # Test files (to be modernized)
├── components/         # Vue component tests
├── composables/        # Composable tests
├── config/             # Configuration contract tests
├── contract/           # API contract tests
├── integration/        # Integration tests (Redis/CRM)
├── scripts/            # Script tests
├── seed/               # Seed data tests
├── server/             # Server-side tests
│   ├── api/           # API endpoint tests
│   ├── repositories/  # Repository tests (Prisma mocking needed)
│   └── services/      # Service tests
├── stores/             # Pinia store tests
├── setup.ts            # Global test setup
└── test-utils/         # NEW: Centralized test utilities module
    ├── index.ts        # Main exports
    ├── mocks/          # Mock implementations
    │   ├── prisma.ts   # Mock Prisma client
    │   ├── redis.ts    # Mock Redis/BullMQ
    │   ├── nuxt.ts     # Mock Nuxt composables
    │   └── fetch.ts    # Mock $fetch
    └── fixtures/       # Test data factories
```

**Structure Decision**: Nuxt 4 web application with constitutional structure (app/ for frontend, server/ for backend, prisma/ for schema). Test infrastructure follows existing tests/ directory with new test-utils/ module for centralized mocking utilities.

## Phase 0: Outline & Research

**Status**: All technical details known from existing codebase analysis.

### Research Findings

**1. Mock Strategy for Prisma**

- **Decision**: Use Vitest vi.fn() to mock PrismaClient methods, return test data matching Prisma types
- **Rationale**: Lightweight, no need for actual database or Prisma mocking libraries; existing tests already use this pattern
- **Alternatives**: prisma-mock library (too heavy), @prisma/client/edge (not suitable for tests)

**2. Mock Strategy for Redis/BullMQ**

- **Decision**: Create in-memory mock implementations of Queue and Redis interfaces
- **Rationale**: Tests don't need actual Redis; only need to verify queue interactions and job lifecycle
- **Alternatives**: ioredis-mock (external dependency), testcontainers (defeats purpose of removing containers)

**3. Mock Strategy for Nuxt Composables**

- **Decision**: Mock on globalThis for auto-imported composables (useI18n, $fetch, useNuxtApp)
- **Rationale**: Nuxt auto-imports inject these on global scope; existing tests already use this pattern (see PopularProgramsSection.test.ts)
- **Alternatives**: @nuxt/test-utils mountSuspended (too slow for unit tests)

**4. Test Structure Pattern**

- **Decision**: AAA (Arrange-Act-Assert) with describe/it blocks, minimal comments, helper functions for setup
- **Rationale**: Industry standard, self-documenting, existing tests partially follow this
- **Alternatives**: BDD-style (more verbose), flat structure (harder to organize)

**5. Test-Utils Module Structure**

- **Decision**: Single entry point (tests/test-utils/index.ts) with sub-modules for each mock category
- **Rationale**: Easy imports, organized by concern, scalable for future mocks
- **Alternatives**: Flat structure (harder to navigate), per-test mocks (duplication)

**Output**: No research.md needed - all technical decisions documented above

## Phase 1: Design & Contracts

_Prerequisites: Phase 0 research complete_

### 1. Data Model Design

No new data models needed. This feature focuses on test infrastructure, not application data.

**Key Test Utilities Modules**:

- **MockPrismaClient**: Factory function returning mocked PrismaClient with vi.fn() methods
- **MockRedisQueue**: In-memory implementation of Queue interface (addJob, getJob, getQueueLength, clear)
- **MockComposables**: Factory functions for useI18n, $fetch, useNuxtApp
- **TestFixtures**: Data generators for University, FAQ, Application, Review entities

### 2. API Contracts

No new API endpoints. Test utilities expose programmatic interfaces:

```typescript
// tests/test-utils/index.ts
export { createMockPrisma } from './mocks/prisma'
export { createMockRedis, createMockQueue } from './mocks/redis'
export { mockUseI18n, mockFetch, mockNuxtApp } from './mocks/nuxt'
export { createUniversity, createFAQ, createApplication } from './fixtures'
```

### 3. Contract Tests

Contract tests already exist and will be refactored to use test-utils:

- `tests/contract/crm-provider.contract.test.ts` - will use mock CRM
- `tests/contract/espocrm-api.test.ts` - will use mock fetch
- `tests/config/*.contract.test.ts` - no changes needed (path validation)

### 4. Integration Test Scenarios

From acceptance scenarios:

1. Repository tests mock database → use createMockPrisma()
2. Integration tests mock Redis → use createMockQueue()
3. Component tests mock i18n → use mockUseI18n()
4. Component tests mock fetch → use mockFetch()
5. Multiple mocks simultaneously → combine utilities

### 5. Agent Context Update

Executing agent context update...

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

1. **Foundation Tasks** - Create test-utils module structure
   - Create tests/test-utils/index.ts entry point [P]
   - Create tests/test-utils/mocks/ directory with mock implementations [P]
   - Create tests/test-utils/fixtures/ directory with data factories [P]

2. **Mock Implementation Tasks** - Build reusable mocks
   - Implement MockPrismaClient factory
   - Implement MockRedisQueue and MockRedisClient
   - Implement Nuxt composable mocks (useI18n, $fetch, useNuxtApp)
   - Implement test fixtures for common entities

3. **Test Refactoring Tasks** - Update existing tests by category
   - Refactor component tests (6 files) to use test-utils
   - Refactor repository tests (3 files) to use MockPrismaClient
   - Refactor integration tests (4 files) to use MockRedisQueue
   - Refactor contract tests (2 files) to use mock fetch
   - Refactor server API tests (6+ files) to use appropriate mocks
   - Refactor service tests (4 files) to use appropriate mocks

4. **Cleanup Tasks** - Improve structure and remove noise
   - Remove excessive comments from all test files
   - Ensure AAA pattern consistency
   - Update tests/setup.ts with common mock setup

**Ordering Strategy**:

- Foundation first (test-utils structure)
- Mock implementations second (required by tests)
- Test refactoring by priority: components → repositories → integration → others
- Each test file refactoring is [P] (parallel) after mocks exist
- Cleanup is final pass

**Estimated Output**: 35-40 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |

**Justification**: This feature enhances test infrastructure and follows all constitutional principles:

- Tests remain in tests/ directory (existing structure)
- No changes to app/, server/, or prisma/ structure
- test-utils module is test-only, doesn't affect application architecture
- Imports use ~~/tests/_ aliases (constitutional ~/_ and ~~/\* patterns)
- No i18n, data layer, or CMS changes
- Quality improvements: better test structure, faster execution

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---

---

_Based on Constitution v1.2.0 - See `/memory/constitution.md`_
