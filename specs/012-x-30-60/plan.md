# Implementation Plan: Enhanced Service Page Content Blocks

**Branch**: `012-x-30-60` | **Date**: 2025-01-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/012-x-30-60/spec.md`

**Note**: This template is filled in by the `/plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add structured, conversion-optimized content blocks to 5 service pages (Relocation to Turkey, TR-YÖS Courses, SAT Courses, Turkish/English Courses, Document Translations). Each service gets tailored sections: qualification criteria, expected results, program details, timelines, responsibility matrices, risk mitigation, case studies, diagnostic tests, and FAQs. All content is i18n-enabled across 4 locales (en/ru/kk/tr) and follows the existing Nuxt 3 + Vue 3 + Tailwind design system.

## Technical Context

**Language/Version**: TypeScript 5.9.3, Vue 3.5.22, Nuxt 4.1.3  
**Primary Dependencies**: Nuxt (@nuxtjs/i18n 10.1.0, @nuxtjs/tailwindcss 6.14.0), Pinia 3.0.3, Prisma 6.16.3  
**Storage**: MySQL (via Prisma), i18n JSON files in `i18n/locales/{en,ru,kk,tr}/`  
**Testing**: Vitest 3.2.4, @vue/test-utils 2.4.6, @testing-library/vue 8.1.0  
**Target Platform**: SSR web application (Nuxt server + browser)  
**Project Type**: Web application (Nuxt full-stack)  
**Performance Goals**: < 200ms page load increase, maintain existing Lighthouse scores  
**Constraints**: Must support 4 locales, mobile-first responsive (375px+), no breaking changes to existing pages  
**Scale/Scope**: 5 service pages, ~20-30 new Vue components, ~200-300 i18n keys across 4 locales

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

✅ **No constitution violations**: Project constitution is a template and not yet ratified. Following existing project patterns:

- ✅ Component-based architecture (Vue 3 SFC)
- ✅ i18n-first approach (all text in locale files)
- ✅ Tailwind design system
- ✅ Vitest for testing
- ✅ TypeScript strict mode
- ✅ Pinia for state management
- ✅ Auto-imports for components (Nuxt convention)

## Project Structure

### Documentation (this feature)

```
specs/012-x-30-60/
├── plan.md              # This file
├── research.md          # Phase 0: Component patterns, i18n structure analysis
├── data-model.md        # Phase 1: i18n schema, component props
├── quickstart.md        # Phase 1: Development setup, testing guide
├── contracts/           # Phase 1: Component contracts, i18n key schemas
│   ├── component-props.ts
│   ├── i18n-keys.ts
│   └── section-types.ts
└── tasks.md             # Phase 2: Created by /tasks command
```

### Source Code (repository root)

```
app/
├── components/
│   └── features/
│       └── services/
│           ├── sections/              # NEW: Service page sections
│           │   ├── WhoIsThisForSection.vue
│           │   ├── ExpectedResultsSection.vue
│           │   ├── TimelinePlanSection.vue
│           │   ├── ResponsibilityMatrixSection.vue
│           │   ├── RiskMitigationSection.vue
│           │   ├── CourseGoalSection.vue
│           │   ├── DiagnosticTestSection.vue
│           │   ├── ProgramContentSection.vue
│           │   ├── FormatScheduleSection.vue
│           │   ├── StudentResultsSection.vue
│           │   ├── LevelProgressionSection.vue
│           │   ├── TeachersSection.vue
│           │   ├── PriceCalculatorSection.vue
│           │   ├── UniversityRequirementsSection.vue
│           │   ├── SampleDocumentsSection.vue
│           │   └── ServiceFAQSection.vue
│           ├── ServicePageLayout.vue  # MODIFY: Add new slots
│           └── SubServiceCard.vue     # EXISTING
├── pages/
│   └── services/
│       ├── relocation-in-turkey.vue   # MODIFY: Add new sections
│       ├── tr-yos-courses.vue         # MODIFY: Add new sections
│       ├── sat-courses.vue            # MODIFY: Add new sections
│       ├── turkish-english-course.vue # MODIFY: Add new sections
│       └── document-translations.vue  # MODIFY: Add new sections
└── types/
    └── services.ts                    # MODIFY: Add new types

i18n/
└── locales/
    ├── en/
    │   └── services.json              # MODIFY: Add new keys
    ├── ru/
    │   └── services.json              # MODIFY: Add new keys
    ├── kk/
    │   └── services.json              # MODIFY: Add new keys
    └── tr/
        └── services.json              # MODIFY: Add new keys

tests/
├── components/
│   └── features/
│       └── services/
│           └── sections/              # NEW: Section component tests
│               ├── WhoIsThisForSection.test.ts
│               ├── DiagnosticTestSection.test.ts
│               ├── ResponsibilityMatrixSection.test.ts
│               └── [...other section tests]
└── contract/
    └── services-i18n.contract.test.ts # MODIFY: Add new key validation
```

**Structure Decision**: Nuxt 3 web application structure. Components follow the existing `app/components/features/services/` pattern. All new section components are co-located in a `sections/` subdirectory for clarity. i18n keys extend the existing `services.json` structure per locale. Tests mirror the component structure in `tests/components/`.

## Complexity Tracking

_No violations - this section is not applicable._

## Progress Tracking

### Phase 0: Research ✅ COMPLETE

- [x] Analyze existing service page patterns
- [x] Document i18n structure
- [x] Identify component patterns
- [x] Define section types and mapping
- [x] Document design system usage
- [x] Create `research.md`

### Phase 1: Design ✅ COMPLETE

- [x] Define i18n schema for all services
- [x] Create TypeScript type contracts
- [x] Document component props interfaces
- [x] Create section type mappings
- [x] Define data validation strategy
- [x] Create `data-model.md`
- [x] Create `contracts/component-props.ts`
- [x] Create `contracts/i18n-keys.ts`
- [x] Create `contracts/section-types.ts`
- [x] Create `quickstart.md`

### Phase 2: Tasks ⏳ PENDING

- [ ] Run `/tasks` command to generate actionable task list
- [ ] Task list will include:
  - Component creation (16 section components)
  - ServicePageLayout modification (add slots)
  - Service page updates (5 pages)
  - i18n key additions (4 locales × 5 services)
  - Test creation (unit + contract tests)
  - Type updates

## Implementation Notes

**Component Creation Order** (by priority):

1. **P1 - Relocation Service** (6 sections)
   - WhoIsThisForSection
   - ExpectedResultsSection
   - TimelinePlanSection
   - ResponsibilityMatrixSection
   - RiskMitigationSection
   - ServiceFAQSection

2. **P1 - TR-YÖS Courses** (6 sections)
   - CourseGoalSection
   - DiagnosticTestSection
   - ProgramContentSection
   - FormatScheduleSection
   - StudentResultsSection
   - ServiceFAQSection (reuse)

3. **P1 - SAT Courses** (6 sections, mostly reuse from TR-YÖS)
   - CourseGoalSection (reuse)
   - DiagnosticTestSection (reuse)
   - ProgramContentSection (reuse)
   - FormatScheduleSection (reuse)
   - StudentResultsSection (reuse)
   - ServiceFAQSection (reuse)

4. **P2 - Language Courses** (6 sections)
   - LevelProgressionSection
   - DiagnosticTestSection (reuse)
   - FormatScheduleSection (reuse)
   - TeachersSection
   - ExpectedResultsSection (reuse)
   - ServiceFAQSection (reuse)

5. **P3 - Document Translations** (3 sections)
   - PriceCalculatorSection
   - UniversityRequirementsSection
   - SampleDocumentsSection

**Unique Components**: 16 total
**Reusable Components**: 7 (used across multiple services)

**i18n Keys**: ~200-300 keys across 4 locales
**Estimated Effort**:

- Components: 3-4 days
- i18n content: 2-3 days (with translations)
- Testing: 2 days
- Integration: 1 day
- **Total**: 8-10 days

## Next Command

Run `/tasks` to generate detailed, dependency-ordered task list for implementation.
