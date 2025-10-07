# Implementation Plan: Remove Hardcoded Study Directions

**Branch**: `002-remove-hardcoded-directions` | **Date**: 2025-10-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/home/lsmacox/projects/edu.turkish/specs/002-remove-hardcoded-directions/spec.md`

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

Migrate study direction (academic field) data from hardcoded TypeScript files to database-driven storage. Remove `app/types/directions.ts` and i18n direction JSON files, using the existing `study_directions` and `study_direction_translations` tables instead. Create a database seed that includes only the directions actually referenced in university JSON files (`app/assets/json/universities/*.json`). Ensure all directions have translations in all supported locales (en, ru, kk, tr).

## Technical Context

**Language/Version**: TypeScript (Nuxt 3 / Node.js)
**Primary Dependencies**: Prisma ORM, Nuxt 3, Zod (validation)
**Storage**: MySQL database (existing tables: `study_directions`, `study_direction_translations`, `university_pivot_study_directions`)
**Testing**: Vitest (unit tests), TypeScript type checking
**Target Platform**: Web application (SSR/SSG with Nuxt)
**Project Type**: Web (frontend: Nuxt app/ + backend: server/ API)
**Performance Goals**: Standard web app response times (<200ms for queries)
**Constraints**: Must preserve existing university-direction relationships; local development only (no production migration)
**Scale/Scope**: ~60 existing directions in hardcoded files; ~25 actually used in university JSONs; 19 university JSON files

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The following MUST be validated against `/memory/constitution.md`:

- ✅ **Architecture**: Work stays within `prisma/` (schema/migrations/seed), `app/types/` (remove hardcoded), `i18n/locales/` (remove direction JSONs), and `scripts/` (update import script). No new components or UI changes needed.
- ✅ **Data flow**: N/A - This is a backend/data refactor only. No frontend changes.
- ✅ **Imports**: Existing `tsconfig.json` aliases will continue to work. Removing `app/types/directions.ts` eliminates hardcoded imports.
- ✅ **i18n**: Removing hardcoded i18n direction JSON files (`i18n/locales/{en,ru,kk,tr}/directions.json`). Directions now come from `study_direction_translations` table with all 4 locales.
- ✅ **Data layer**: Using existing Prisma schema (`study_directions`, `study_direction_translations` tables). No schema changes needed - tables already exist. Seed file will be created/updated in `prisma/seed/`.
- ✅ **CMS**: N/A - Not using Directus for this feature.
- ✅ **Partner flows**: N/A - No changes to partner attribution.
- ✅ **Quality**: TypeScript types will be updated (remove DirectionSlug type). Seed script will be tested. No ESLint/Prettier violations.

**Result**: PASS - All constitutional requirements satisfied. No violations or deviations needed.

## Project Structure

### Documentation (this feature)

```
specs/002-remove-hardcoded-directions/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
# Nuxt 3 Web Application Structure
app/
├── types/
│   └── directions.ts                    # [TO REMOVE] Hardcoded DirectionSlug type
└── assets/
    └── json/
        └── universities/                # [SCAN] Extract direction_slug references
            ├── istanbul_aydin_university.json
            ├── bahcesehir_university.json
            └── ... (19 files total)

i18n/
└── locales/
    ├── en/
    │   └── directions.json              # [TO REMOVE] Hardcoded English translations
    ├── ru/
    │   └── directions.json              # [TO REMOVE] Hardcoded Russian translations
    ├── kk/
    │   └── directions.json              # [TO REMOVE] Hardcoded Kazakh translations
    └── tr/
        └── directions.json              # [TO REMOVE] Hardcoded Turkish translations

prisma/
├── schema.prisma                        # [NO CHANGE] Tables already exist
└── seed/
    ├── seed.ts                          # [UPDATE] Add study-directions seeder
    └── study-directions.ts              # [CREATE] New seeder file

scripts/
└── import-university.ts                 # [UPDATE] Remove DirectionSlug import/validation

tests/
└── seed/
    └── study-directions.test.ts         # [CREATE] Test seed data integrity
```

**Structure Decision**: Nuxt 3 monorepo with frontend (`app/`) and backend (`server/`, `prisma/`) in one repository. This refactor touches database seeding, type definitions, and i18n files. No API endpoints or UI components are modified.

## Phase 0: Outline & Research ✅ COMPLETE

**Research Completed**: All unknowns resolved, no NEEDS CLARIFICATION remaining.

### Key Findings

1. **Current State**: 60 hardcoded directions, only ~25 actually used in university JSONs
2. **Database Schema**: Existing tables fully support requirements, no migrations needed
3. **Seed Strategy**: Extract unique slugs from university JSON files, create translations from existing i18n files
4. **Type Migration**: Remove `DirectionSlug` TypeScript type, rely on database validation
5. **Translation Migration**: Map existing i18n JSON data into seed data structure
6. **Import Script**: Simplify by removing hardcoded validation, keep DB-driven creation logic

**Output**: ✅ [research.md](./research.md) - All decisions documented with rationale

## Phase 1: Design & Contracts ✅ COMPLETE

_Prerequisites: research.md complete_

### Artifacts Created

1. ✅ **Data Model** → [data-model.md](./data-model.md)
   - Documented existing StudyDirection, StudyDirectionTranslation, UniversityStudyDirection entities
   - Defined seed data structure with translation maps
   - Specified validation rules (database + application level)
   - No schema changes needed

2. ✅ **API Contracts** → [contracts/README.md](./contracts/README.md)
   - Confirmed no new API endpoints needed (refactor only)
   - Documented expected data response formats
   - Defined contract validation approach
   - Noted: existing endpoints continue to work with same contracts

3. ✅ **Quickstart Guide** → [quickstart.md](./quickstart.md)
   - 7-step validation workflow (~15 min)
   - Pre/post migration checks
   - Success criteria checklist
   - Rollback plan
   - Troubleshooting guide

4. ✅ **Agent Context** → `.windsurf/rules/specify-rules.md`
   - Updated with TypeScript/Nuxt/Prisma context
   - Added database schema details
   - Preserved existing rules

**Output**: All Phase 1 artifacts complete, ready for task generation

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

1. **Analysis Phase** (Tasks 1-3):
   - Scan university JSON files to extract unique direction slugs
   - Map slugs to existing i18n translation data
   - Validate data completeness (all locales present)

2. **Implementation Phase** (Tasks 4-8):
   - Create seed file `prisma/seed/study-directions.ts` with extracted data
   - Update `prisma/seed/seed.ts` to call new seeder
   - Update `scripts/import-university.ts` to remove hardcoded validation
   - Update `app/assets/json/universities/types.ts` to remove DirectionSlug import
   - Create seed validation test

3. **Cleanup Phase** (Tasks 9-11):
   - Remove `app/types/directions.ts`
   - Remove i18n direction JSON files (4 files)
   - Run database seed and verify

4. **Validation Phase** (Tasks 12-14):
   - Run TypeScript type check
   - Run all existing tests
   - Execute quickstart manual validation steps

**Ordering Strategy**:

- Sequential for interdependent tasks (analysis → implementation → cleanup → validation)
- Some tasks can be parallel within implementation phase [P]
- Validation tasks must be last

**Estimated Output**: ~14 numbered tasks in tasks.md

**Task Categories**:

- 3 analysis tasks
- 5 implementation tasks (some [P])
- 3 cleanup tasks
- 3 validation tasks

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

- [x] Phase 0: Research complete (/plan command) ✅
- [x] Phase 1: Design complete (/plan command) ✅
- [x] Phase 2: Task planning complete (/plan command - describe approach only) ✅
- [x] Phase 3: Tasks generated (/tasks command) ✅
- [ ] Phase 4: Implementation complete - **NEXT STEP**
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS ✅
- [x] Post-Design Constitution Check: PASS ✅
- [x] All NEEDS CLARIFICATION resolved ✅
- [x] Complexity deviations documented: N/A (no deviations) ✅

---

---

_Based on Constitution v1.0.0 - See `/memory/constitution.md`_
