# Implementation Plan: Fix EspoCRM Integration Issues

**Branch**: `005-espocrm-espocrm-bitrix` | **Date**: 2025-10-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/home/lsmacox/projects/edu.turkish/specs/005-espocrm-espocrm-bitrix/spec.md`

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

Fix three critical EspoCRM integration issues:
1. **CRM Provider Routing**: Messenger events incorrectly attempt to send to Bitrix when EspoCRM is configured, causing 401 errors
2. **Validation Error Display**: Application modal shows 'true' instead of error messages; field-specific errors need proper positioning
3. **Source Validation**: "Invalid source (valid)" error occurs even with correctly filled fields

Technical approach: Add CRM provider abstraction layer, fix validation logic to accept all valid source values, improve error message handling in ApplicationModal component.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20.x  
**Primary Dependencies**: Nuxt 3, Vue 3, Prisma ORM, Vitest  
**Storage**: MySQL (via Prisma), Directus CMS  
**Testing**: Vitest for unit/integration tests, contract tests for API endpoints  
**Target Platform**: Linux server (Docker), web browsers (Chrome, Safari, Firefox)
**Project Type**: web (Nuxt full-stack application)  
**Performance Goals**: <500ms API response time, <200ms UI error display  
**Constraints**: Must maintain backward compatibility with existing Bitrix integration, zero data loss during CRM failures  
**Scale/Scope**: 3 server files, 1 Vue component, 2 utility functions, ~5 test files

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
app/
├── components/
│   └── modals/
│       └── ApplicationModal.vue          # Fix error display logic
└── composables/
    └── useToast.ts                        # Toast notification system

server/
├── api/
│   └── v1/
│       ├── applications/
│       │   └── index.post.ts              # Fix validation, add CRM routing
│       └── messenger-events.post.ts       # Add CRM provider routing
├── services/
│   ├── BitrixService.ts                   # Existing Bitrix integration
│   ├── EspoCrmService.ts                  # NEW: EspoCRM integration
│   └── CrmProviderFactory.ts              # NEW: CRM provider abstraction
├── utils/
│   ├── api-helpers.ts                     # Fix validateApplicationData
│   └── crm-config.ts                      # NEW: CRM provider configuration
└── types/
    └── api/
        └── crm.ts                         # NEW: CRM provider interfaces

tests/
├── contract/
│   ├── crm-provider.contract.test.ts      # NEW: CRM provider contracts
│   └── espocrm-api.test.ts                # NEW: EspoCRM API contracts
├── components/
│   └── ApplicationModal.test.ts           # Update error display tests
└── server/
    ├── services/
    │   ├── CrmProviderFactory.test.ts     # NEW: Factory tests
    │   └── EspoCrmService.test.ts         # NEW: EspoCRM service tests
    └── utils/
        └── api-helpers.test.ts            # Update validation tests
```

**Structure Decision**: Nuxt 3 full-stack web application following edu.turkish constitution. Frontend components in `app/`, server logic in `server/`, tests mirror source structure. CRM abstraction layer added to support multiple providers (Bitrix, EspoCRM) with factory pattern.

## Phase 0: Outline & Research

✅ **COMPLETE**

**Research Topics Covered**:
1. CRM Provider Abstraction Pattern → Factory Pattern selected
2. EspoCRM API Integration → REST API v1 with API key auth
3. Source Field Validation Issue → Remove restrictive validation
4. Error Message Display → Type-safe extraction with fallbacks
5. Testing Strategy → Contract + Integration + Component tests

**Key Decisions**:
- Factory Pattern for CRM provider selection
- Interface-based abstraction (ICrmProvider)
- Environment variable configuration (CRM_PROVIDER)
- No database schema changes required
- Backward compatible with existing Bitrix integration

**Output**: ✅ `research.md` created with all decisions documented

## Phase 1: Design & Contracts

✅ **COMPLETE**

**Artifacts Created**:

1. ✅ **data-model.md**: 
   - ICrmProvider interface definition
   - CrmResult and ConnectionResult types
   - Configuration types (BitrixConfig, EspoCrmConfig)
   - Error response structures
   - Validation rules for source field
   - Component error state model

2. ✅ **contracts/crm-provider.contract.md**:
   - ICrmProvider interface contract
   - Behavioral contracts for all methods
   - Error handling contract
   - Timeout and retry contracts
   - Testing requirements

3. ✅ **contracts/espocrm-api.contract.md**:
   - EspoCRM REST API endpoints
   - Request/response formats
   - Authentication specification
   - Field mapping tables
   - Error handling and retry logic

4. ✅ **quickstart.md**:
   - Environment setup instructions
   - Verification steps for all acceptance criteria
   - Troubleshooting guide
   - Performance verification
   - Success checklist

5. ✅ **Agent context updated**:
   - Windsurf rules updated with TypeScript, Nuxt 3, Prisma
   - Project type: web application
   - Database: MySQL via Prisma

**Output**: All Phase 1 artifacts created and validated

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

1. **Contract Tests** (Phase 1):
   - Task: Create CRM provider contract tests
   - Task: Create EspoCRM API contract tests
   - Mark [P] for parallel execution

2. **Type Definitions** (Phase 2):
   - Task: Create CRM provider interfaces in `server/types/api/crm.ts`
   - Task: Update existing types if needed

3. **Service Implementation** (Phase 3):
   - Task: Create EspoCrmService class
   - Task: Create CrmProviderFactory
   - Task: Create crm-config utility
   - Task: Update messenger-events endpoint
   - Task: Update applications endpoint

4. **Validation Fixes** (Phase 4):
   - Task: Fix validateApplicationData in api-helpers.ts
   - Task: Add source validation tests

5. **UI Error Handling** (Phase 5):
   - Task: Fix error display in ApplicationModal.vue
   - Task: Add error display component tests

6. **Integration Tests** (Phase 6):
   - Task: Test CRM provider switching
   - Task: Test messenger event routing
   - Task: Test application submission with various sources

**Ordering Strategy**:
- TDD order: Contract tests → Types → Implementation → Integration tests
- Parallel execution: Contract tests, type definitions (independent)
- Sequential: Services depend on types, UI depends on API fixes

**Estimated Output**: 20-25 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

**✅ All violations resolved (2025-10-06)**:
- ✅ Architecture: Follows `app/`, `server/`, test structure
- ✅ Data flow: Frontend → API → Service layer
- ✅ Imports: Uses tsconfig aliases
- ✅ No database schema changes
- ✅ No new external dependencies
- ✅ Maintains backward compatibility
- ✅ **Principle VII**: Runtime config properly configured in `nuxt.config.ts` (lines 140-147)
- ✅ **Environment variables**: Use NUXT_* prefix with fallbacks to old names

**Configuration Fix Applied**:
- `server/utils/crm-config.ts` updated to use `process.env.NUXT_*` variables
- All values sourced from `nuxt.config.ts` runtimeConfig
- Backward compatible with existing CRM_PROVIDER, ESPOCRM_URL, etc.

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command) ✅
- [x] Phase 1: Design complete (/plan command) ✅
- [x] Phase 2: Task planning complete (/plan command - describe approach only) ✅
- [x] Phase 3: Tasks generated (/tasks command) ✅
- [ ] Phase 4: Implementation complete - Ready for execution
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS ✅
- [x] Post-Design Constitution Check: PASS ✅
- [x] All NEEDS CLARIFICATION resolved ✅
- [x] Complexity deviations documented (none) ✅

**Artifacts Generated**:
- [x] research.md
- [x] data-model.md
- [x] contracts/crm-provider.contract.md
- [x] contracts/espocrm-api.contract.md
- [x] quickstart.md
- [x] tasks.md
- [x] .windsurf/rules/specify-rules.md (updated)

---

---

_Based on Constitution v1.0.0 - See `/memory/constitution.md`_
