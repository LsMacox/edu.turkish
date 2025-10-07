# Implementation Plan: EspoCRM Integration with CRM Abstraction Layer

**Branch**: `005-espocrm-crm-bitrix` | **Date**: 2025-10-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/home/lsmacox/projects/edu.turkish/specs/005-espocrm-crm-bitrix/spec.md`

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

Integrate EspoCRM as the primary CRM system with a minimal abstraction layer to enable future migration between CRM providers (EspoCRM ↔ Bitrix). Deploy EspoCRM in Docker with dedicated database, configure Caddy reverse proxy for `crm.{domain}` subdomain, and implement Redis-backed retry queue for failed CRM operations. The abstraction layer provides a unified interface for lead creation, activity logging, and field mapping while maintaining backward compatibility with existing Bitrix integration.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 22  
**Primary Dependencies**: Nuxt 3, Prisma ORM, Redis (ioredis), EspoCRM (latest stable), Docker, Caddy  
**Storage**: MySQL 8.0 (existing + new dedicated EspoCRM database), Redis for queue persistence  
**Testing**: Vitest for unit/integration tests, contract tests for CRM API  
**Target Platform**: Linux server (Docker containers)  
**Project Type**: Web application (Nuxt 3 fullstack)  
**Performance Goals**: CRM operations <3s timeout, retry queue processing <1min intervals  
**Constraints**: Backward compatible with existing Bitrix integration, minimal code changes for future CRM switches  
**Scale/Scope**: ~10-20 CRM operations per day, support for 2 CRM providers (Bitrix + EspoCRM)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

The following MUST be validated against `/memory/constitution.md`:

### ✅ Architecture Compliance

- **Repository paths**: All CRM services in `server/services/crm/`, queue in `server/services/queue/`, types in `server/types/crm/` - COMPLIANT
- **Data flow**: No frontend changes needed. Existing API endpoints updated to use abstraction layer - COMPLIANT
- **No direct repository calls**: CRM abstraction is service-layer only, no component changes - COMPLIANT

### ✅ Imports & Aliases

- **tsconfig aliases**: All imports use `~/server/` and `~~/` aliases - COMPLIANT
- **No ad-hoc paths**: Following established import patterns - COMPLIANT

### ✅ i18n Compliance

- **No UI changes**: This is backend/infrastructure only, no user-facing strings - N/A
- **Error messages**: CRM errors logged server-side only, not exposed to users - COMPLIANT

### ✅ Data Layer

- **Prisma-only**: No database schema changes required. CRM data lives in external systems - COMPLIANT
- **No migrations needed**: Infrastructure-only feature - COMPLIANT

### ✅ CMS

- **Directus**: Not applicable to this feature - N/A

### ✅ Partner Flows & CRM

- **Existing flows preserved**: `/routes/go/*` updated to use CRM abstraction instead of direct Bitrix calls - COMPLIANT
- **Backward compatible**: Bitrix integration maintained via abstraction layer - COMPLIANT
- **Cookie handling**: No changes to `?ref` cookie logic - COMPLIANT

### ✅ Quality Gates

- **ESLint/Prettier/TS**: All new code follows existing standards - COMPLIANT
- **Tests**: Vitest tests for all CRM providers and queue worker - COMPLIANT
- **No styling changes**: Backend-only feature - N/A

### 🔍 Post-Design Re-validation

All constitutional requirements remain satisfied after Phase 1 design. No violations or deviations required.

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

```
server/
├── services/
│   ├── crm/
│   │   ├── CRMProvider.interface.ts      # Abstraction interface
│   │   ├── BitrixCRMProvider.ts          # Bitrix implementation
│   │   ├── EspoCRMProvider.ts            # EspoCRM implementation
│   │   └── CRMFactory.ts                 # Provider factory
│   ├── queue/
│   │   ├── RedisQueue.ts                 # Redis queue service
│   │   └── CRMQueueWorker.ts             # Retry worker
│   └── BitrixService.ts                  # Existing (to be refactored)
├── api/v1/
│   ├── applications/index.post.ts        # Update to use abstraction
│   └── messenger-events.post.ts          # Update to use abstraction
├── utils/
│   ├── crm-config.ts                     # CRM provider config
│   └── redis.ts                          # Redis client setup
└── types/
    └── crm/
        ├── provider.ts                   # CRM provider types
        └── operations.ts                 # CRM operation types

contrib/
├── Caddyfile                             # Add EspoCRM subdomain
├── docker-compose.yml                    # Add EspoCRM + Redis containers
└── espocrm/
    └── config.php                        # EspoCRM configuration

tests/
├── server/
│   ├── services/crm/
│   │   ├── BitrixCRMProvider.test.ts
│   │   ├── EspoCRMProvider.test.ts
│   │   └── CRMFactory.test.ts
│   └── queue/
│       └── CRMQueueWorker.test.ts
└── contract/
    └── espocrm-api.test.ts               # EspoCRM API contract tests
```

**Structure Decision**: Nuxt 3 fullstack web application. CRM abstraction lives in `server/services/crm/` following the repository pattern. Infrastructure changes in `contrib/`. No frontend changes needed (CRM is backend-only). Follows constitutional architecture with server-side services and proper separation of concerns.

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
- Each contract → contract test task [P]
- Each entity → model creation task [P]
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:

- TDD order: Tests before implementation
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

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
- [x] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

**Artifacts Generated**:

- [x] research.md - Technology decisions and rationale
- [x] data-model.md - CRM entities and validation schemas
- [x] contracts/crm-provider.contract.ts - Provider interface contract
- [x] contracts/espocrm-api.contract.yaml - OpenAPI spec for EspoCRM
- [x] quickstart.md - Setup and validation guide
- [x] .windsurf/rules/specify-rules.md - Updated agent context
- [x] tasks.md - 45 actionable tasks with dependencies and parallel execution guide

---

---

_Based on Constitution v1.0.0 - See `/memory/constitution.md`_
