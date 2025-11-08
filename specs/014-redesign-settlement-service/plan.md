# Implementation Plan: Redesign Settlement Service Page

**Branch**: `014-redesign-settlement-service` | **Date**: 2025-01-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-redesign-settlement-service/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Redesign the settlement service page (`/services/relocation-in-turkey`) to display two pricing tiers (Standard $1500 and VIP $2000) as large package cards, replace existing sections with simplified Benefits and Risks sections, and add a new FAQ section. The redesign removes database-driven content fetching for sections and consolidates all content into i18n files, keeping only basic package info (name, price, slug) in the SubService database model. All content (service lists, FAQ, benefits, risks) will be stored in i18n translation files for all 4 supported languages (en, ru, kk, tr).

## Technical Context

**Language/Version**: TypeScript 5.x with Nuxt 3 (Vue 3 composition API)  
**Primary Dependencies**: Nuxt 3, Vue 3, Prisma ORM, Pinia, vue-i18n, Tailwind CSS  
**Storage**: PostgreSQL (Prisma schema), i18n JSON files for all static content  
**Testing**: Vitest for unit/integration tests, contract tests for i18n structure  
**Target Platform**: Web application (SSR/CSR with Nuxt 3), responsive design (desktop + mobile)
**Project Type**: Full-stack web application (Nuxt 3 unified structure)  
**Performance Goals**: LCP < 2.5s, no layout shifts, page load < 3s  
**Constraints**: All 4 languages (en, ru, kk, tr) must be supported, mobile accordion for packages, no database fetching for content sections  
**Scale/Scope**: Single service page redesign affecting ~5 components, 4 i18n files, 1 page file, no schema changes needed

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

✅ **Structure & Architecture**: Changes confined to `app/pages/services/`, `app/components/features/services/`, `i18n/locales/`, following existing patterns
✅ **Content & Localization**: All new content will have translations for en, ru, kk, tr in i18n files
✅ **Data Access**: No new database queries needed, will reuse existing ServiceRepository and API endpoints
✅ **UI & Styling**: Will use existing Tailwind utilities and design tokens, no new CSS files
✅ **Imports & Aliases**: Will follow Nuxt auto-import conventions, use `~` and `~~` aliases
✅ **Runtime Config**: No new environment variables needed
✅ **Code Style**: Minimal comments, pragmatic validation, concise implementation

**Compliance**: All constitutional principles are satisfied. No violations or exceptions needed.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
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
├── pages/
│   └── services/
│       └── relocation-in-turkey.vue           # Main page - remove sections, add packages
├── components/
│   ├── features/
│   │   └── services/
│   │       ├── PackageCard.vue                # NEW: Package card component
│   │       ├── SettlementBenefitsSection.vue  # NEW: Benefits section
│   │       ├── SettlementRisksSection.vue     # NEW: Risks section
│   │       ├── ServicePageLayout.vue          # Keep as-is (provides slots)
│   │       └── sections/
│   │           └── ServiceFAQSection.vue      # Keep as-is (reusable)
│   └── ui/
│       └── display/
│           └── FAQ.vue                         # Keep as-is (reusable)
└── composables/
    └── useServices.ts                          # Keep as-is (no changes)

server/
├── api/
│   └── v1/
│       └── services/
│           └── [slug].get.ts                   # Keep as-is (no changes)
└── repositories/
    └── ServiceRepository.ts                    # Keep as-is (no changes)

i18n/
└── locales/
    ├── en/
    │   └── services.json                       # Update: add packages, benefits, risks, faq
    ├── ru/
    │   └── services.json                       # Update: add packages, benefits, risks, faq
    ├── kk/
    │   └── services.json                       # Update: add packages, benefits, risks, faq
    └── tr/
        └── services.json                       # Update: add packages, benefits, risks, faq

tests/
└── components/
    └── features/
        └── services/
            ├── PackageCard.test.ts             # NEW: Test package card
            ├── SettlementBenefitsSection.test.ts # NEW: Test benefits
            └── SettlementRisksSection.test.ts    # NEW: Test risks
```

**Structure Decision**: Nuxt 3 unified structure with `app/` for frontend code, `server/` for API/repositories, `i18n/` for translations, `tests/` for test files. This is a web application following Nuxt 3 conventions with auto-imports and file-based routing.

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
