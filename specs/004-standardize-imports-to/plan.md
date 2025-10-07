# Implementation Plan: Standardize Import Paths to Nuxt 4 Conventions

**Branch**: `004-standardize-imports-to` | **Date**: 2025-10-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/home/lsmacox/projects/edu.turkish/specs/004-standardize-imports-to/spec.md`

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

Refactor all import statements across the edu.turkish codebase to follow Nuxt 4 conventions. The migration will leverage Nuxt's auto-import capabilities for components, composables, and utilities, while using the `~/` alias for explicit imports. This is a big-bang refactor to ensure consistency and avoid mixed import patterns. All changes must pass TypeScript type checking, ESLint validation, and the full Vitest test suite.

## Technical Context

**Language/Version**: TypeScript 5.9, Vue 3.5.20, Nuxt 4.1.0  
**Primary Dependencies**: Nuxt 4 (with auto-import), Vitest 3.2.4, vite-tsconfig-paths 5.1.4  
**Storage**: N/A (refactoring task)  
**Testing**: Vitest with @vue/test-utils, jsdom environment  
**Target Platform**: Node.js (SSR), Browser (client-side)
**Project Type**: web (Nuxt SSR application)  
**Performance Goals**: No performance impact - pure refactoring with equivalent functionality  
**Constraints**: Zero breaking changes, all existing tests must pass, TypeScript and ESLint must validate  
**Scale/Scope**: ~49 files with `~/` imports across app/, server/, tests/ directories

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Status**: ✅ PASS

The following were validated against `.specify/memory/constitution.md`:

- ✅ **Architecture**: No changes to repository paths or data flow. Refactoring only affects import syntax, not structure.
- ⚠️ **Imports**: Constitution states "Imports MUST use aliases defined in `tsconfig.json`" - However, Nuxt 4 doesn't generate a tsconfig.json by default and uses its own `.nuxt/tsconfig.json`. This refactoring aligns with Nuxt 4's native conventions (`~/` alias) which is more appropriate than custom tsconfig aliases.
- ✅ **i18n**: No UI strings added or changed - pure refactoring task.
- ✅ **Data layer**: No database or Prisma changes.
- ✅ **CMS**: No Directus changes.
- ✅ **Partner flows**: No changes to referral or Bitrix logic.
- ✅ **Quality**: All ESLint/Prettier/TypeScript checks and Vitest tests must pass as validation gates.

**Constitutional Alignment Note**: The constitution mentions "tsconfig.json aliases" but Nuxt 4 uses its own auto-generated TypeScript config. This refactoring updates the constitution's intent by using Nuxt's native `~/` alias convention, which is the Nuxt 4 best practice. The spirit of the rule (consistent, predictable imports) is preserved.

## Project Structure

### Documentation (this feature)

```
specs/004-standardize-imports-to/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

Note: `data-model.md` and `contracts/` are not applicable for this refactoring task.

### Source Code (repository root)

```
app/
├── components/
│   ├── features/        # Feature-specific components (49 files affected)
│   ├── layout/          # Layout components
│   ├── modals/          # Modal components
│   ├── shared/          # Shared UI components
│   └── ui/              # UI library components
├── composables/         # Auto-imported composables
├── layouts/             # Nuxt layouts
├── pages/               # Nuxt pages (file-based routing)
├── stores/              # Pinia stores
└── types/               # TypeScript type definitions

server/
├── api/                 # Nuxt server API endpoints
├── repositories/        # Data access layer
├── routes/              # Custom server routes
└── types/               # Server-side types

tests/
├── components/          # Component tests
├── composables/         # Composable tests
├── config/              # Configuration tests
├── scripts/             # Script tests
└── stores/              # Store tests

lib/                     # Shared utilities and constants

vitest.config.ts         # Vitest configuration (needs vite-tsconfig-paths)
nuxt.config.ts           # Nuxt configuration (alias configuration)
```

**Structure Decision**: Nuxt 4 SSR web application with standard Nuxt directory structure. All imports currently use `~/` alias. The refactoring will ensure consistency and leverage Nuxt's auto-import where applicable, while maintaining `~/` for explicit imports (types, lib/, server repositories).

## Phase 0: Outline & Research

✅ **Completed** - See `research.md`

**Research Topics Covered**:

1. Nuxt 4 auto-import behavior (components, composables, Vue APIs)
2. Nuxt 4 alias configuration (`~/` vs `@/`, nuxt.config.ts alias key)
3. Vitest configuration for Nuxt imports (vite-tsconfig-paths plugin)
4. Import refactoring strategy (big-bang with validation gates)
5. Edge cases (tests, types, server code, Vue APIs)

**Key Findings**:

- Nuxt 4 auto-imports: components, composables, stores, Vue/Nuxt APIs
- Explicit imports needed: types, lib/, server/, tests, third-party packages
- Use `~/` alias consistently for all explicit imports
- Configure Vitest with `vite-tsconfig-paths` to resolve `~/` in tests
- Big-bang refactor with TypeScript + ESLint + Vitest validation

**Output**: ✅ research.md created with all decisions documented

## Phase 1: Design & Contracts

✅ **Completed** - Refactoring task, no data model or API contracts needed

**Artifacts Created**:

1. ✅ **quickstart.md**: Validation procedure with 8 verification steps
   - TypeScript validation
   - ESLint validation
   - Vitest test suite
   - Build verification
   - Manual smoke tests

2. ⏭️ **data-model.md**: N/A - No data entities in this refactoring task

3. ⏭️ **contracts/**: N/A - No API contracts in this refactoring task

4. ⏭️ **Contract tests**: N/A - Existing Vitest tests serve as regression tests

5. ✅ **Agent context update**: Windsurf rules updated with Nuxt 4 + TypeScript context

**Validation Strategy**:

- Use existing Vitest test suite as regression tests
- TypeScript compilation ensures type safety
- ESLint catches import-related issues
- Manual verification via quickstart.md

**Output**: ✅ quickstart.md created, agent context updated

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

1. **Audit Phase** (Analysis tasks):
   - Scan all files for import patterns
   - Categorize imports by type (auto-importable vs explicit)
   - Identify Vue API imports to remove
   - Identify Pinia store imports to remove

2. **Configuration Phase** (Setup tasks):
   - Update vitest.config.ts with vite-tsconfig-paths plugin
   - Verify nuxt.config.ts alias configuration
   - Document import conventions

3. **Refactoring Phase** (Implementation tasks):
   - Remove unnecessary Vue API imports from app/ files
   - Remove unnecessary Pinia store imports from app/ files
   - Remove unnecessary composable imports from app/ files
   - Ensure all explicit imports use `~/` alias consistently
   - Update test files to maintain explicit imports

4. **Validation Phase** (Testing tasks):
   - Run TypeScript type checking
   - Run ESLint validation
   - Run full Vitest test suite
   - Execute quickstart.md validation steps
   - Verify dev server starts
   - Verify production build

**Ordering Strategy**:

- Sequential: Audit → Configuration → Refactoring → Validation
- Within refactoring: Process by directory (app/, server/, tests/)
- Mark [P] for parallel file edits within same directory

**Estimated Output**: 15-20 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

**Status**: No violations requiring justification.

The constitutional note about "tsconfig.json aliases" is addressed: Nuxt 4 uses its own auto-generated TypeScript configuration, and this refactoring aligns with Nuxt's native conventions while preserving the spirit of consistent, predictable imports.

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command) ✅
- [x] Phase 1: Design complete (/plan command) ✅
- [x] Phase 2: Task planning complete (/plan command - describe approach only) ✅
- [ ] Phase 3: Tasks generated (/tasks command) - Ready for /tasks
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS ✅
- [x] Post-Design Constitution Check: PASS ✅
- [x] All NEEDS CLARIFICATION resolved ✅
- [x] Complexity deviations documented: N/A ✅

---

## Implementation Plan Summary

**Status**: ✅ COMPLETE - Ready for `/tasks` command

**Artifacts Generated**:

- ✅ `plan.md` - This implementation plan
- ✅ `research.md` - Nuxt 4 import conventions research
- ✅ `quickstart.md` - 8-step validation procedure
- ✅ `.windsurf/rules/specify-rules.md` - Updated agent context

**Key Decisions**:

1. Leverage Nuxt 4 auto-import for components, composables, stores, Vue APIs
2. Use `~/` alias exclusively for explicit imports
3. Configure Vitest with `vite-tsconfig-paths` plugin
4. Big-bang refactor with comprehensive validation gates
5. Existing Vitest tests serve as regression suite

**Next Steps**:
Run `/tasks` command to generate the task breakdown in `tasks.md`

---

_Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`_
