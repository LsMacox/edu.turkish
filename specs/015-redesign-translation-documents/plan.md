# Implementation Plan: Redesign Translation Documents Service Page

**Branch**: `015-redesign-translation-documents` | **Date**: 2025-01-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/015-redesign-translation-documents/spec.md`

**Note**: This template is filled in by the `/plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Redesign the document-translations service page to improve conversion rates by replacing complex sub-service listings with a streamlined structure: hero section with educational copy, 7 service cards without prices (data-driven from database metadata), interactive price calculator with "Submit Application" button, process steps (How It Works), trust factors (Why Choose Us), and final CTA. Primary goal is transparency in pricing and simplified user journey to application submission.

## Technical Context

**Language/Version**: TypeScript 5.9, Vue 3.5, Nuxt 4.1  
**Primary Dependencies**: Nuxt 4, Vue 3, Pinia, Prisma 6, @nuxtjs/i18n, @nuxtjs/tailwindcss, Vitest  
**Storage**: MySQL (via Prisma ORM), Directus (CMS for dynamic content)  
**Testing**: Vitest for unit/integration tests, contract tests for data structures  
**Target Platform**: SSR web application (Nuxt server + client)
**Project Type**: Web application (Nuxt full-stack)
**Performance Goals**: Page load <3s on 3G, calculator updates <100ms, conversion rate +15% within 30 days  
**Constraints**: Mobile-first responsive design (320px-1440px), all 4 locales (en/ru/kk/tr) fully supported, SEO-optimized SSR  
**Scale/Scope**: Single service page redesign, ~7 new components, seed data updates, i18n updates for 4 locales

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

✅ **Structure & Architecture**: Follows repository layout - UI in `app/`, server in `server/`, Prisma in `prisma/`, i18n in `i18n/locales/`
✅ **Data Flow**: Components → Pinia stores → API endpoints → Repositories (no direct repository calls from frontend)
✅ **Imports**: Uses ~ and ~~ aliases as defined in tsconfig.json
✅ **Content & Localization**: All 4 locales (en/ru/kk/tr) will be updated, static strings in i18n/, dynamic from Directus
✅ **Data Access**: Database changes via Prisma schema and migrations, repositories in `server/repositories/`
✅ **UI & Styling**: Unified Tailwind config, design tokens centralized, ESLint/Prettier/TypeScript required
✅ **Component Structure**: Feature components in `app/components/features/`, shared in `app/components/shared/`
✅ **Auto-Import**: Components auto-imported per nuxt.config.ts, explicit imports only for external libs/types/server code
✅ **Runtime Config**: All variables declared in nuxt.config.ts runtimeConfig
✅ **Code Minimalism**: Minimal comments, pragmatic validations, concise implementations

**No constitutional violations identified.** Feature aligns with all core principles.

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

```
app/
├── pages/
│   └── services/
│       └── document-translations.vue  # Main page component (modify)
├── components/
│   ├── features/
│   │   ├── ServiceInfoCard.vue        # NEW: Service cards without prices
│   │   ├── FinalCTASection.vue        # NEW: Bottom call-to-action
│   │   ├── PriceCalculatorSection.vue # MODIFY: Add submit button
│   │   ├── HowItWorksSection.vue      # UPDATE: 4 process steps
│   │   └── ServicesWhyChooseUsSection.vue # UPDATE: 5 trust factors
│   └── shared/
│       └── (existing shared components)
└── composables/
    └── useCurrency.ts                 # Exchange rate conversion (existing)

server/
├── api/
│   └── v1/
│       └── services/
│           └── [slug].ts              # Fetches ServiceCategory with metadata
├── repositories/
│   └── ServiceRepository.ts           # Database access layer (existing)
└── types/
    └── api/
        └── services.ts                # ServiceCategory type definitions

prisma/
├── schema.prisma                      # ServiceCategory + ServiceCategoryTranslation schema
├── migrations/                        # Database migrations (if schema changes)
└── seed/
    └── services.ts                    # UPDATE: Add metadata for document-translations

i18n/
└── locales/
    ├── en/
    │   └── services.json              # UPDATE: Add document-translations keys
    ├── ru/
    │   └── services.json              # UPDATE: Add document-translations keys
    ├── kk/
    │   └── services.json              # UPDATE: Add document-translations keys
    └── tr/
        └── services.json              # UPDATE: Add document-translations keys

tests/
├── components/
│   └── features/
│       ├── ServiceInfoCard.test.ts     # NEW: Test service cards
│       ├── PriceCalculatorSection.test.ts # UPDATE: Test submit button
│       └── FinalCTASection.test.ts     # NEW: Test CTA section
├── contract/
│   └── service-metadata.contract.test.ts # NEW: Validate metadata structure
└── unit/
    └── calculator-price.test.ts        # NEW: Test price calculations
```

**Structure Decision**: Nuxt 4 full-stack web application. Frontend components in `app/`, server API and repositories in `server/`, database schema in `prisma/`, translations in `i18n/locales/`. This matches the existing repository structure and constitutional requirements (Section I).

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
