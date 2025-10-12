# Implementation Plan: Service Pages with Dropdown Navigation

**Branch**: `008-1-2-3` | **Date**: 2025-10-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/home/lsmacox/projects/edu.turkish/specs/008-1-2-3/spec.md`

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

Create service category pages accessible via dropdown navigation. Each page displays multiple sub-services with descriptions, multi-currency pricing (KZT, TRY, RUB, USD), and "Apply" buttons. The existing application modal will be enhanced to show which sub-service the user is applying for. All content managed via i18n files, with currency selection persisted across navigation.

## Technical Context

**Language/Version**: TypeScript 5.x, Vue 3 (Composition API), Nuxt 3  
**Primary Dependencies**: Nuxt 3, Vue 3, Tailwind CSS, Pinia, Vitest  
**Storage**: i18n JSON files for content, localStorage/cookies for currency preference  
**Testing**: Vitest for unit/component tests, contract tests for i18n structure  
**Target Platform**: Web (SSR/SSG via Nuxt), responsive design (mobile, tablet, desktop)  
**Project Type**: Web application (Nuxt full-stack)  
**Performance Goals**: <200ms page load, instant currency switching, smooth dropdown interactions  
**Constraints**: Must reuse existing ApplicationModal component, all text via i18n (4 locales), constitutional compliance  
**Scale/Scope**: 5 service category pages, ~15-20 sub-services total, currency selector in header, modal enhancement

**User-Provided Context**: На каждой странице услуг будут разные подуслуги, каждая со своими ценами и описаниями. В popup нужно показывать пользователю что он подает заявку по конкретной подуслуге (как в секции "Кто вы?").

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

```
app/
├── pages/
│   └── services/
│       ├── relocation-in-turkey.vue
│       ├── tr-yos-courses.vue
│       ├── sat-courses.vue
│       ├── turkish-english-course.vue
│       └── document-translations.vue
├── components/
│   ├── features/
│   │   └── services/
│   │       ├── ServicePageLayout.vue
│   │       ├── SubServiceCard.vue
│   │       └── CurrencyPrice.vue
│   ├── layout/
│   │   └── SiteHeader.vue (existing - enhance dropdown)
│   └── modals/
│       └── ApplicationModal.vue (existing - enhance for sub-service display)
├── composables/
│   ├── useCurrency.ts (new - currency selection & persistence)
│   └── useApplicationModal.ts (existing - enhance for sub-service context)
├── stores/
│   └── currency.ts (new - Pinia store for currency state)
└── types/
    └── services.ts (new - service & sub-service types)

i18n/
└── locales/
    ├── en/
    │   ├── nav.json (existing - already has servicesDropdown)
    │   └── services.json (new - service & sub-service content)
    ├── ru/
    │   ├── nav.json
    │   └── services.json
    ├── kk/
    │   ├── nav.json
    │   └── services.json
    └── tr/
        ├── nav.json
        └── services.json

tests/
├── components/
│   └── features/
│       └── services/
│           ├── SubServiceCard.test.ts
│           └── CurrencyPrice.test.ts
├── composables/
│   └── useCurrency.test.ts
└── contract/
    └── services-i18n.contract.test.ts
```

**Structure Decision**: Nuxt 3 full-stack web application. Service pages in `app/pages/services/`, feature components in `app/components/features/services/`, i18n content in `i18n/locales/{locale}/services.json`. Currency state managed via Pinia store, modal enhancement reuses existing `ApplicationModal.vue`.

## Phase 0: Outline & Research ✅

**Status**: COMPLETE

**Research Areas Covered**:

1. Currency management in Nuxt 3 (Pinia + localStorage)
2. Multi-currency pricing structure in i18n
3. Application modal enhancement for sub-service context
4. Service page layout pattern
5. Currency selector UI/UX in header
6. Sub-service identification system

**Key Decisions**:

- Pinia store for currency state management
- localStorage for persistence (no cookies needed)
- Nested pricing objects in i18n JSON files
- Reuse existing ApplicationModal with enhanced props
- Shared ServicePageLayout component for consistency
- Kebab-case string IDs for sub-services

**Output**: ✅ research.md created with all decisions documented

## Phase 1: Design & Contracts ✅

**Status**: COMPLETE

**Artifacts Created**:

1. ✅ **data-model.md**:
   - Currency types (KZT, TRY, RUB, USD)
   - Service category and sub-service structures
   - Application context enhancement
   - i18n data structure
   - Pinia store design
   - No database changes required

2. ✅ **contracts/**:
   - `i18n-services.contract.json`: JSON Schema for services.json structure
   - `components.contract.md`: Component interfaces (ServicePageLayout, SubServiceCard, CurrencyPrice, modal enhancements)
   - `composables.contract.md`: Composable interfaces (useCurrency, useApplicationModal enhancement)

3. ✅ **quickstart.md**:
   - 8 validation scenarios
   - Performance benchmarks
   - Accessibility checks
   - Edge case testing
   - Rollback plan

4. ✅ **Agent context updated**:
   - Windsurf rules updated with TypeScript 5.x, Vue 3, Nuxt 3 stack
   - i18n JSON files, localStorage/cookies for currency
   - Nuxt full-stack web application type

**Constitutional Compliance**: ✅ PASS

- No database changes
- All content via i18n (4 locales)
- Components in proper directories
- Nuxt auto-import conventions
- Pinia for state management
- No new external dependencies

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

1. **Foundation Tasks** (can run in parallel):
   - Create TypeScript types (`app/types/services.ts`)
   - Create currency Pinia store (`app/stores/currency.ts`)
   - Create useCurrency composable (`app/composables/useCurrency.ts`)
   - Create i18n contract test (`tests/contract/services-i18n.contract.test.ts`)

2. **i18n Content Tasks** (per locale):
   - Create `i18n/locales/en/services.json` with all service content
   - Create `i18n/locales/ru/services.json` (translate from EN)
   - Create `i18n/locales/kk/services.json` (translate from EN)
   - Create `i18n/locales/tr/services.json` (translate from EN)

3. **Component Tasks** (sequential dependencies):
   - Create CurrencyPrice component + test
   - Create SubServiceCard component + test
   - Create ServicePageLayout component + test
   - Enhance SiteHeader with currency selector
   - Enhance ApplicationModal with sub-service context

4. **Page Tasks** (can run in parallel after components):
   - Create `/services/relocation-in-turkey.vue`
   - Create `/services/tr-yos-courses.vue`
   - Create `/services/sat-courses.vue`
   - Create `/services/turkish-english-course.vue`
   - Create `/services/document-translations.vue`

5. **Integration Tasks**:
   - Enhance useApplicationModal composable
   - Wire up currency selector in header
   - Test modal integration with sub-service context

6. **Validation Tasks**:
   - Run quickstart validation scenarios
   - Test all 4 locales
   - Performance validation
   - Accessibility audit

**Ordering Strategy**:

- Types → Store → Composables → Components → Pages
- i18n files early (needed for component development)
- Tests alongside implementation (TDD)
- Mark [P] for parallel tasks (independent files)

**Estimated Output**: ~30-35 tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

**Status**: ✅ NO VIOLATIONS

This feature fully complies with the constitution:

- Uses existing architecture patterns
- No new dependencies
- No database changes
- Follows i18n requirements
- Proper component organization
- Nuxt auto-import conventions
- Pinia state management (existing pattern)

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command) - 35 tasks created
- [ ] Phase 4: Implementation complete - NEXT STEP
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved (no unknowns in Technical Context)
- [x] Complexity deviations documented (none - full compliance)

---

---

_Based on Constitution v1.2.0 - See `/memory/constitution.md`_
