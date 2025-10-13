# Implementation Plan: Enhanced Service Pages for Document Translation

**Branch**: `011-` | **Date**: 2025-10-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/011-/spec.md`

## Summary

Enhance the existing service pages (particularly document translation services) by adding new sections to improve user experience and increase conversion rates. The enhancement includes: updating intro block content to be more engaging, adding delivery timeframes to service cards, implementing a "How it works" section with 3-4 steps, adding a "Why choose us" section with three trust factors, and integrating trust indicators throughout the page. This is primarily a frontend content and layout enhancement using existing Nuxt 3, Vue 3, and Tailwind CSS infrastructure.

## Technical Context

**Language/Version**: TypeScript 5.9, Node.js (via Nuxt 4.1)  
**Primary Dependencies**: Nuxt 4.1, Vue 3.5, Tailwind CSS 3, @nuxtjs/i18n 10.1, @nuxt/icon 2.0  
**Storage**: Directus CMS for content, Prisma/MySQL for data (not required for this feature)  
**Testing**: Vitest 3.2, @testing-library/vue 8.1, @nuxt/test-utils 3.19  
**Target Platform**: Web (SSR + Client), multi-locale (ru, en, tr, kk)  
**Project Type**: Web application (Nuxt 3 full-stack)  
**Performance Goals**: Page load time <2s, smooth scrolling, responsive on all devices  
**Constraints**: Must maintain i18n support for 4 locales, preserve existing SSR/prerender capabilities  
**Scale/Scope**: 5 service pages to enhance, ~4 new Vue components, ~20 i18n translation keys per locale

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Constitution Status**: Template constitution found but not customized for this project.

Since the constitution file contains only template placeholders, we'll proceed with standard web application best practices:

✅ **Component-Based Architecture**: Each new section (HowItWorks, WhyChooseUs, TrustIndicators) will be standalone, reusable Vue components  
✅ **Accessibility**: All new components will include proper ARIA labels, keyboard navigation, semantic HTML  
✅ **Internationalization**: All text content will be externalized to i18n files for all 4 supported locales  
✅ **Testing**: Unit tests for each new component, integration tests for modified pages  
✅ **Responsive Design**: Mobile-first approach using Tailwind CSS utilities  
✅ **Performance**: No additional dependencies required, leverage existing icon library (@nuxt/icon)

**Re-evaluation Post-Design**: Will verify that no unnecessary complexity or dependencies were introduced.

## Project Structure

### Documentation (this feature)

```
specs/011-/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (minimal - data structures only)
└── checklists/
    └── requirements.md  # Already created
```

### Source Code (repository root)

```
app/
├── components/
│   ├── features/
│   │   └── services/
│   │       ├── ServicePageLayout.vue         # MODIFY: Add new section slots
│   │       ├── SubServiceCard.vue            # MODIFY: Add delivery timeframe
│   │       ├── HowItWorksSection.vue         # CREATE: Process steps section
│   │       ├── WhyChooseUsSection.vue        # CREATE: Trust factors section
│   │       ├── ProcessStep.vue               # CREATE: Single process step component
│   │       ├── TrustFactor.vue               # CREATE: Single trust factor component
│   │       └── TrustIndicatorBadge.vue       # CREATE: Decorative trust badge
│   └── shared/
│       └── BaseSectionHeader.vue             # EXISTING: Used by ServicePageLayout
│
├── pages/
│   └── services/
│       ├── document-translations.vue         # MODIFY: Add new sections
│       ├── relocation-in-turkey.vue          # MODIFY: Add new sections
│       ├── turkish-english-course.vue        # MODIFY: Add new sections
│       ├── tr-yos-courses.vue                # MODIFY: Add new sections
│       └── sat-courses.vue                   # MODIFY: Add new sections
│
└── types/
    └── services.ts                           # MODIFY: Add new types

i18n/
└── locales/
    ├── ru/
    │   └── services/
    │       ├── common.json                   # MODIFY: Add shared service content
    │       └── document-translations.json    # MODIFY: Add delivery timeframes
    ├── en/
    │   └── services/
    │       └── [same structure]
    ├── kk/
    │   └── services/
    │       └── [same structure]
    └── tr/
        └── services/
            └── [same structure]

tests/
├── components/
│   └── features/
│       └── services/
│           ├── HowItWorksSection.spec.ts     # CREATE: Component tests
│           ├── WhyChooseUsSection.spec.ts    # CREATE: Component tests
│           ├── ProcessStep.spec.ts           # CREATE: Component tests
│           ├── TrustFactor.spec.ts           # CREATE: Component tests
│           ├── TrustIndicatorBadge.spec.ts   # CREATE: Component tests
│           └── SubServiceCard.spec.ts        # MODIFY: Test timeframe display
└── integration/
    └── service-pages.spec.ts                 # CREATE: E2E tests for enhanced pages
```

**Structure Decision**: This is a web application using Nuxt 3's standard directory structure. Components follow the feature-based organization pattern already established in the codebase. Service-related components are grouped under `app/components/features/services/`. Internationalization files follow the existing locale structure with JSON files organized by feature area.

## Complexity Tracking

_No Constitution violations detected - all enhancements use existing patterns and infrastructure._
