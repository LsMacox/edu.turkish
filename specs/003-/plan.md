# Implementation Plan: Import Alias Standardization

**Branch**: `003-` | **Date**: 2025-10-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-/spec.md`

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

Standardize import aliases across the edu.turkish codebase to eliminate confusion and ensure consistent module resolution in all contexts (app, server, tests). Currently, the project has multiple overlapping aliases (`~`, `@`, `~~`, `@@`, `^`) with inconsistent usage, particularly in test files using relative paths (`../../`) instead of aliases. This refactoring will establish a single, clear alias pattern aligned with Nuxt 3 conventions and synchronized across `tsconfig.json`, `nuxt.config.ts`, and `vitest.config.ts`.

## Technical Context

**Language/Version**: TypeScript 5.9.2, Vue 3.5.20  
**Primary Dependencies**: Nuxt 4.1.0, Vitest 3.2.4, Prisma 6.15.0, Pinia 3.0.3  
**Storage**: MySQL (via Prisma ORM)  
**Testing**: Vitest with jsdom, @testing-library/vue  
**Target Platform**: Web (SSR + Client), Node.js server
**Project Type**: Web (Nuxt full-stack application)  
**Performance Goals**: Zero import resolution errors, no build-time alias conflicts  
**Constraints**: Must maintain backward compatibility during migration, no breaking changes to runtime behavior  
**Scale/Scope**: ~150 TypeScript/Vue files across app/, server/, tests/, lib/, prisma/ directories

**Current Alias Configuration**:

- `tsconfig.json`: Defines `~/*`, `@/*`, `~~/*`, `@@/*`, `^/*` (5 overlapping aliases)
- `vitest.config.ts`: Defines `~`, `@`, `~~` (3 aliases, missing `@@` and `^`)
- `nuxt.config.ts`: Auto-configures Nuxt-specific aliases

**Identified Issues**:

1. Test files use relative imports (`../../`) instead of aliases
2. Server files inconsistently use `../../app/types` vs aliases
3. `vitest.config.ts` missing `@@` and `^` aliases causing test failures
4. Multiple aliases (`~` and `@`) both point to `./app/` creating ambiguity
5. Constitution principle "Imports MUST use aliases defined in tsconfig.json" is violated

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The following MUST be validated against `/memory/constitution.md`:

- Architecture: repository paths (`app/`, `server/`, `prisma/`, `i18n/locales/`, component split between `app/components/features/` and `components/`) and data flow (frontend → Pinia store → server API). No direct repository calls from components.
- Imports use `tsconfig.json` aliases; no ad-hoc paths.
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
app/                    # Frontend application code (Nuxt app dir)
├── components/
│   ├── features/      # Feature-specific components
│   ├── layout/        # Layout components
│   ├── modals/        # Modal components
│   ├── shared/        # Shared base components
│   └── ui/            # UI library components
├── composables/       # Vue composables
├── layouts/           # Nuxt layouts
├── pages/             # Nuxt pages (routes)
├── stores/            # Pinia stores
└── types/             # Frontend type definitions

server/                # Backend server code (Nuxt server dir)
├── api/v1/           # API endpoints
├── middleware/        # Server middleware
├── repositories/      # Data access layer (Prisma)
├── routes/go/        # Redirect routes (partner tracking)
├── services/          # Business logic services
├── types/            # Server type definitions
└── utils/            # Server utilities

lib/                   # Shared library code
├── contact/          # Contact channel definitions
├── locales.ts        # Locale configuration
└── prisma.ts         # Prisma client singleton

prisma/               # Database schema and migrations
├── migrations/       # Prisma migrations
├── seed/            # Database seeders
└── schema.prisma    # Prisma schema

tests/                # Test files
├── components/       # Component tests
├── composables/      # Composable tests
├── scripts/          # Script tests
├── seed/            # Seed tests
├── server/          # Server tests
├── stores/          # Store tests
└── setup.ts         # Test setup

i18n/locales/         # Internationalization files
├── en/
├── ru/
├── kk/
└── tr/
```

**Structure Decision**: Nuxt 4 full-stack web application with app-dir structure. Frontend code in `app/`, server code in `server/`, shared utilities in `lib/`, database in `prisma/`, tests mirror source structure in `tests/`.

## Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts

_Prerequisites: research.md complete_

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh windsurf`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/\*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

1. **Configuration Tasks** (Phase 1):
   - Align `vitest.config.ts` with `tsconfig.json` aliases
   - Verify Nuxt auto-configuration
   - Create contract test files from contracts/

2. **Migration Tasks** (Phase 2):
   - **Priority 1**: Migrate test files (tests/\*\*)
     - Replace `../../` with `~` or `~~`
     - Replace deprecated aliases
   - **Priority 2**: Migrate server files (server/\*\*)
     - Standardize cross-boundary imports
     - Replace deprecated aliases
   - **Priority 3**: Migrate app files (app/\*\*)
     - Replace `@/` with `~/`
     - Replace `@@/`, `^/` with `~~/`
   - **Priority 4**: Migrate scripts and seeds

3. **Enforcement Tasks** (Phase 3):
   - Add ESLint rules to ban deprecated patterns
   - Update documentation (README.md)
   - Remove deprecated aliases from configs

4. **Validation Tasks** (Phase 4):
   - Run contract tests
   - Verify all tests pass
   - Verify build succeeds
   - Run quickstart validation

**Ordering Strategy**:

- **Sequential by priority**: Config → Tests → Server → App → Scripts → Enforcement
- **Parallel within priority**: Multiple files can be migrated in parallel [P]
- **Validation gates**: Tests must pass before moving to next priority

**Task Categories**:

- Config alignment: 3-4 tasks
- Test migration: 15-20 tasks (one per test file or group)
- Server migration: 20-25 tasks (API endpoints, repositories, utils)
- App migration: 25-30 tasks (components, stores, composables)
- Script migration: 5-7 tasks
- Enforcement: 3-4 tasks
- Validation: 4-5 tasks

**Estimated Output**: 75-95 numbered, ordered tasks in tasks.md

**Migration Batching**:

- Group similar files together (e.g., all component tests, all API endpoints)
- Each batch can be executed in parallel within its priority
- Use automated tools where possible (find/replace with validation)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

**No violations**: This refactoring aligns with and enforces the constitution principle "Imports MUST use aliases defined in tsconfig.json". No complexity deviations required.

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS (enforces constitution principle)
- [x] Post-Design Constitution Check: PASS (no new violations)
- [x] All NEEDS CLARIFICATION resolved (none existed)
- [x] Complexity deviations documented (none required)

**Artifacts Generated**:

- [x] research.md - Import alias best practices and decisions
- [x] data-model.md - Configuration and pattern definitions
- [x] contracts/alias-config.contract.ts - Config validation contracts
- [x] contracts/import-patterns.contract.ts - Import pattern contracts
- [x] contracts/eslint-rules.contract.ts - ESLint enforcement contracts
- [x] quickstart.md - Validation and testing guide
- [x] .windsurf/rules/specify-rules.md - Updated agent context

---

---

_Based on Constitution v1.0.0 - See `/memory/constitution.md`_
