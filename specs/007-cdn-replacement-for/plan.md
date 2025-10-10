# Implementation Plan: CDN Asset Delivery

**Branch**: `007-cdn-replacement-for` | **Date**: 2025-10-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/home/lsmacox/projects/edu.turkish/specs/007-cdn-replacement-for/spec.md`
**User Context**: toCdn composable deleted, need new solution

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

Implement flexible CDN asset delivery system that transforms any `/public/` asset path to CDN URL (`https://cdn.edu-turkish.com/`). System must preserve path structure, support all asset types (images, videos, documents) without hardcoded directory mappings, and provide simple developer API. No fallback logic - CDN is single source of truth.

## Technical Context

**Language/Version**: TypeScript 5.9.3, Vue 3.5.22, Nuxt 4.1.3  
**Primary Dependencies**: Nuxt Image (@nuxt/image 1.11.0), Nuxt runtime config  
**Storage**: N/A (CDN external, no local storage)  
**Testing**: Vitest 3.2.4, @nuxt/test-utils 3.19.2  
**Target Platform**: Web (SSR + Client), Linux server (Node.js)
**Project Type**: Web application (Nuxt SSR)  
**Performance Goals**: Instant URL transformation (<1ms), no runtime overhead  
**Constraints**: Must work in SSR and client contexts, preserve existing image optimization  
**Scale/Scope**: All public assets across entire application, ~100+ asset references

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
app/
├── composables/
│   └── useCdn.ts          # New: CDN URL transformation composable
├── components/
│   └── [existing components use new composable]
└── utils/
    └── cdn.ts             # New: Core CDN transformation logic

server/
└── [no changes - CDN is client-side concern]

tests/
├── composables/
│   └── useCdn.test.ts     # New: Composable tests
└── utils/
    └── cdn.test.ts        # New: Utility tests

public/
├── images/
│   ├── universities/      # Assets to be served from CDN
│   └── reviews/
└── videos/
    └── reviews/
```

**Structure Decision**: Nuxt web application structure. CDN transformation implemented as:

1. Core utility function in `~/utils/cdn.ts` for pure transformation logic
2. Composable in `~/composables/useCdn.ts` for reactive/component usage
3. Runtime config in `nuxt.config.ts` for CDN base URL
4. Integration with existing @nuxt/image module

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

- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Contract test task from `contracts/cdn-transformation.contract.ts` [P]
- Utility implementation task for `~/utils/cdn.ts` [P]
- Composable implementation task for `~/composables/useCdn.ts`
- Runtime config update task for `nuxt.config.ts`
- Environment variable documentation tasks
- Component migration tasks (optional, can be done incrementally)

**Ordering Strategy**:

1. **Setup Phase** (parallel):
   - [P] Add runtime config to `nuxt.config.ts`
   - [P] Update `.env.example` with CDN URL
2. **Core Implementation** (sequential):
   - Create utility function `~/utils/cdn.ts` (pure logic)
   - Create composable `~/composables/useCdn.ts` (uses utility)
   - Create contract test `tests/utils/cdn.test.ts`
   - Create composable test `tests/composables/useCdn.test.ts`

3. **Validation Phase**:
   - Run contract tests
   - Verify SSR rendering
   - Performance validation

**Estimated Output**: 10-12 numbered, ordered tasks in tasks.md

**Key Dependencies**:

- Runtime config must be added before composable (needs config access)
- Utility must exist before composable (composable uses utility)
- Tests can run in parallel after implementation

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

**No violations** - This feature fully complies with the constitution:

✅ Uses standard Nuxt structure (`~/utils/`, `~/composables/`)  
✅ Follows auto-import conventions (no manual imports needed)  
✅ Uses runtime config per Principle VII  
✅ No database changes (client-side only)  
✅ No new dependencies (uses existing Nuxt APIs)  
✅ Testable with Vitest (existing test infrastructure)

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
- [x] Complexity deviations documented (none needed)

**Artifacts Generated**:

- [x] research.md - Technical decisions and rationale
- [x] data-model.md - Configuration schema and transformation logic
- [x] contracts/cdn-transformation.contract.ts - Contract tests
- [x] quickstart.md - Usage guide and verification steps
- [x] .windsurf/rules/specify-rules.md - Updated agent context

---

---

_Based on Constitution v1.2.0 - See `/memory/constitution.md`_
