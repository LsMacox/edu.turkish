# Implementation Plan: i18n Translation Keys Quality Control Script

**Branch**: `001-i18n` | **Date**: 2025-10-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/home/lsmacox/projects/edu.turkish/specs/001-i18n/spec.md`

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

Create a TypeScript script (`scripts/i18n-check.ts`) that analyzes i18n translation files to detect:

1. **Duplicate keys** within the same locale
2. **Unused keys** that are defined but never referenced in the codebase
3. **Missing keys** that exist in some locales but not in others

The script will scan all JSON files in `i18n/locales/{en,ru,kk,tr}/` and analyze usage across `.vue`, `.ts`, `.js` files in `app/`, `server/`, `components/`, `pages/`, and `composables/` directories. Output will be a structured report with file paths to help LLM tools understand and fix inconsistencies. The script will be executable via `npm run i18n:check` and documented in Russian at `docs/scripts/I18N_CHECK.md`.

## Technical Context

**Language/Version**: TypeScript 5.9+ (Node.js runtime via tsx)  
**Primary Dependencies**: Node.js fs/path modules, glob pattern matching for file discovery  
**Storage**: File system (read-only access to i18n JSON files and source code)  
**Testing**: Vitest (unit tests for key detection, duplicate detection, and usage analysis)  
**Target Platform**: Linux/macOS/Windows (Node.js script executed via npm/tsx)
**Project Type**: Single utility script (part of existing Nuxt.js web application)  
**Performance Goals**: Process ~100 translation files and ~500 source files in <5 seconds  
**Constraints**: Must handle nested JSON keys (dot notation), dynamic key construction patterns (e.g., `t(\`pages.${page}.title\`)`), and commented-out code  
**Scale/Scope**: 4 locales × ~16 files per locale = ~64 JSON files; scan ~200-500 source files

**User-provided implementation details**:

- Script location: `scripts/i18n-check.ts` (single file)
- Documentation: `docs/scripts/I18N_CHECK.md` (Russian language)
- Execution: Add npm script `i18n:check` to `package.json`
- Style: Follow existing script patterns (see `scripts/translate.ts`)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Status**: ✅ PASS

### Validation against Constitution v1.0.0

- ✅ **Architecture**: Script is a standalone utility in `scripts/` directory (established pattern). Does not touch `app/`, `server/`, or data flow.
- ✅ **Imports**: Script uses Node.js built-in modules and standard TypeScript imports. No tsconfig aliases needed for utility scripts.
- ✅ **i18n**: This script enforces i18n quality (validates all 4 locales: `en`, `ru`, `kk`, `tr`). No new UI strings introduced.
- ✅ **Data layer**: Script is read-only file system analysis. No database access, no Prisma, no repositories.
- ✅ **CMS**: Not applicable - script does not interact with Directus.
- ✅ **Partner flows**: Not applicable - script does not touch partner attribution or Bitrix.
- ✅ **Quality**: Script will include TypeScript types, follow ESLint/Prettier standards, and have Vitest unit tests.
- ✅ **Documentation**: Russian documentation in `docs/scripts/` follows existing pattern (see `TRANSLATE.md`, `IMPORT_UNIVERSITY.md`).
- ✅ **npm scripts**: Adding `i18n:check` to `package.json` follows existing pattern (`translate`, `import:university`).

**Conclusion**: No constitutional violations. This is a developer tooling script that aligns with existing script patterns and enforces constitutional i18n requirements.

## Project Structure

### Documentation (this feature)

```
specs/001-i18n/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
scripts/
└── i18n-check.ts        # Main script file (new)

docs/scripts/
└── I18N_CHECK.md        # Russian documentation (new)

tests/
└── scripts/
    └── i18n-check.test.ts  # Unit tests (new)

i18n/locales/            # Analyzed by script (existing)
├── en/
├── ru/
├── kk/
└── tr/

app/                     # Scanned for key usage (existing)
server/                  # Scanned for key usage (existing)
components/              # Scanned for key usage (existing)
pages/                   # Scanned for key usage (existing)
composables/             # Scanned for key usage (existing)

package.json             # Add i18n:check script (modified)
```

**Structure Decision**: Single utility script following the established pattern in `scripts/` directory. The script is self-contained with no external dependencies beyond Node.js built-ins. Tests follow the existing pattern in `tests/scripts/`. Documentation follows the Russian-language pattern in `docs/scripts/`.

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
- Follow TDD approach: tests before implementation
- Each contract → contract test task
- Each function/module → unit test task
- Implementation tasks to make tests pass

**Task Categories**:

1. **Setup Tasks** (1-2 tasks):
   - Add npm script to package.json
   - Create test directory structure

2. **Type Definition Tasks** (1 task, [P]):
   - Define TypeScript interfaces from data-model.md
   - Create type definitions at top of script file

3. **Core Function Tasks** (5-7 tasks, TDD order):
   - Write test for key flattening → Implement key flattening
   - Write test for file loading → Implement file loading
   - Write test for duplicate detection → Implement duplicate detection
   - Write test for usage scanning → Implement usage scanning
   - Write test for missing key detection → Implement missing key detection

4. **Output & CLI Tasks** (2-3 tasks):
   - Write test for report formatting → Implement report formatting
   - Write test for CLI argument parsing → Implement CLI parsing
   - Write test for JSON output → Implement JSON output

5. **Integration Tasks** (2-3 tasks):
   - Write integration test for full workflow
   - Implement main() orchestration function
   - Add error handling and exit codes

6. **Documentation Tasks** (1 task, [P]):
   - Create Russian documentation at docs/scripts/I18N_CHECK.md

**Ordering Strategy**:

- Setup first (package.json, types)
- TDD order: Test → Implementation for each function
- Core functions before CLI/output
- Integration last
- Documentation can be parallel with implementation

**Parallelization**:

- Type definitions [P]
- Documentation [P]
- Independent function tests [P] (after types)
- Implementation must be sequential (depends on tests)

**Estimated Output**: 15-20 numbered, ordered tasks in tasks.md

**Dependencies**:

- All tasks depend on: research.md, data-model.md, contracts/
- Implementation tasks depend on: corresponding test tasks
- Integration tasks depend on: all core function tasks
- Documentation can start anytime after contracts are defined

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

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

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none - no violations)

**Artifacts Generated**:

- [x] research.md - Technical decisions and approach
- [x] data-model.md - Data structures and entities
- [x] contracts/cli-interface.md - CLI contract specification
- [x] contracts/output-format.md - Output format specification
- [x] quickstart.md - Verification and testing guide
- [x] .windsurf/rules/specify-rules.md - Updated agent context

---

---

_Based on Constitution v1.0.0 - See `/memory/constitution.md`_
