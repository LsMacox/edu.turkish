# Research: Enhanced Service Page Content Blocks

**Phase**: 0 (Research)  
**Date**: 2025-01-13  
**Status**: Complete

## Objective

Research existing patterns for service page components, i18n structure, and design system to ensure new content blocks integrate seamlessly.

## Existing Patterns Analysis

### 1. Service Page Structure

**Current Pattern** (`ServicePageLayout.vue`):

- Uses named slots for flexible content injection
- Existing slots: `sub-services`, `how-it-works`, `why-choose-us`, `trust-indicators`
- Conditional rendering via `v-if="$slots['slot-name']"`
- Consistent spacing with Tailwind utility classes

**Findings**:

- ✅ Slot-based architecture supports adding new sections without breaking changes
- ✅ Conditional rendering prevents empty sections
- ✅ Consistent spacing pattern: `mt-12` or `mt-16` between sections

### 2. i18n Structure

**Current Pattern** (`i18n/locales/{locale}/services.json`):

```json
{
  "services": {
    "common": {
      "deliveryTime": "...",
      "price": "...",
      "howItWorks": { "title": "...", "steps": [...] },
      "whyChooseUs": { "title": "...", "factors": [...] },
      "trustIndicators": { ... }
    },
    "service-name": {
      "title": "...",
      "subtitle": "...",
      "subServices": {
        "sub-service-id": {
          "name": "...",
          "description": "...",
          "pricing": { "KZT": "...", "TRY": "...", "RUB": "...", "USD": "..." }
        }
      }
    }
  }
}
```

**Findings**:

- ✅ Flat structure with service-specific keys under `services.{service-name}`
- ✅ Common/shared content under `services.common`
- ✅ Arrays for repeating items (steps, factors, etc.)
- ✅ Pricing always includes all 4 currencies (KZT, TRY, RUB, USD)
- ⚠️ Need to decide: service-specific sections vs. common sections for new content

**Decision**: Use service-specific keys for unique content (e.g., `services.relocation-in-turkey.whoIsThisFor`) and common keys for reusable patterns (e.g., `services.common.faq`).

### 3. Component Patterns

**Current Pattern** (from `SubServiceCard.vue`, `HowItWorksSection.vue`):

- Props-based components with TypeScript interfaces
- i18n via `useI18n()` composable: `const { t, tm } = useI18n()`
- Array iteration: `tm()` for getting raw array, then `map()` with index to build typed objects
- Computed properties for reactive i18n data
- Tailwind for styling (no scoped CSS)

**Example**:

```typescript
const steps = computed(() => {
  const raw = (tm('services.common.howItWorks.steps') || []) as unknown[]
  return raw.map((_, index) => ({
    title: t(`services.common.howItWorks.steps.${index}.title`) as string,
    description: t(`services.common.howItWorks.steps.${index}.description`) as string,
    icon: t(`services.common.howItWorks.steps.${index}.icon`) as string,
  }))
})
```

**Findings**:

- ✅ Consistent pattern for handling i18n arrays
- ✅ Type safety via explicit type assertions
- ✅ Computed properties ensure reactivity on locale change
- ✅ Icon strings reference iconify collections (e.g., `mdi:calendar-check`)

### 4. Testing Patterns

**Current Pattern** (from `tests/components/`):

- Vitest + @vue/test-utils + @testing-library/vue
- i18n mocking via `createI18n()` with test messages
- Component mounting with `mount()` or `render()`
- Assertions on rendered text, attributes, and structure
- Contract tests for i18n key completeness across locales

**Example** (from `services-i18n.contract.test.ts`):

```typescript
describe('services i18n contract', () => {
  it('should have consistent pricing keys across all locales', () => {
    // Verify all services have pricing in all currencies
  })
})
```

**Findings**:

- ✅ Contract tests ensure i18n consistency
- ✅ Component tests verify rendering and behavior
- ✅ Test setup uses realistic i18n structure
- ⚠️ Need to extend contract tests for new sections

### 5. Design System

**Current Pattern** (Tailwind + custom tokens):

- Utility-first Tailwind classes
- Responsive breakpoints: `md:` (768px), `lg:` (1024px)
- Spacing scale: `gap-4`, `gap-6`, `mt-12`, `mt-16`
- Grid layouts: `grid gap-6 md:grid-cols-2 lg:grid-cols-3`
- Typography: Default Nuxt/Tailwind typography
- Icons: `@nuxt/icon` with iconify collections (mdi, ph)

**Findings**:

- ✅ Consistent spacing and grid patterns
- ✅ Mobile-first responsive design
- ✅ Icon system supports 1000+ icons
- ✅ No custom CSS needed for new sections

## Component Design Decisions

### Section Components

**Approach**: Create reusable section components that accept i18n key prefixes as props.

**Rationale**:

1. **Reusability**: Multiple services may use similar section types (e.g., FAQ, timeline)
2. **Consistency**: Shared components ensure visual consistency
3. **Testability**: Single component = single test suite
4. **Maintainability**: Changes to section layout affect all instances

**Component List**:

1. `WhoIsThisForSection.vue` - List of qualifying criteria
2. `ExpectedResultsSection.vue` - List of deliverables with optional duration
3. `TimelinePlanSection.vue` - Weekly/phased timeline with activities
4. `ResponsibilityMatrixSection.vue` - Two-column "We Do / You Do" layout
5. `RiskMitigationSection.vue` - Risk scenarios with mitigation strategies
6. `CourseGoalSection.vue` - Target scores/levels with package tiers
7. `DiagnosticTestSection.vue` - CTA button with duration and description
8. `ProgramContentSection.vue` - Curriculum breakdown with icons
9. `FormatScheduleSection.vue` - Course format details (online/offline, schedule, etc.)
10. `StudentResultsSection.vue` - Case studies with before/after metrics
11. `LevelProgressionSection.vue` - CEFR level progression with outcomes
12. `TeachersSection.vue` - Teacher profiles with photos and achievements
13. `PriceCalculatorSection.vue` - Interactive calculator for document pricing
14. `UniversityRequirementsSection.vue` - List of accepted formats and requirements
15. `SampleDocumentsSection.vue` - Gallery of anonymized document samples
16. `ServiceFAQSection.vue` - Accordion-style FAQ list

### ServicePageLayout Slots

**New Slots** (to be added):

- `who-is-this-for`
- `expected-results`
- `timeline-plan`
- `responsibility-matrix`
- `risk-mitigation`
- `course-goal`
- `diagnostic-test`
- `program-content`
- `format-schedule`
- `student-results`
- `level-progression`
- `teachers`
- `price-calculator`
- `university-requirements`
- `sample-documents`
- `faq`

**Slot Ordering** (visual hierarchy):

1. Page header (existing)
2. Sub-services grid (existing)
3. Who Is This For / Course Goal (qualifying/targeting)
4. Diagnostic Test (CTA for courses)
5. Expected Results / Level Progression (outcomes)
6. Timeline Plan (process)
7. Program Content (curriculum)
8. Format & Schedule (logistics)
9. Responsibility Matrix (boundaries)
10. Risk Mitigation (objection handling)
11. Student Results / Teachers (social proof)
12. Price Calculator (pricing transparency)
13. University Requirements (compliance)
14. Sample Documents (proof)
15. How It Works (existing)
16. Why Choose Us (existing)
17. FAQ (final objections)
18. Trust Indicators (existing)

## i18n Schema Design

### Service-Specific Keys

**Relocation to Turkey** (`services.relocation-in-turkey.*`):

```json
{
  "whoIsThisFor": {
    "title": "Who Is This For?",
    "criteria": [
      "You've been accepted and are moving within X weeks",
      "You need visa, housing, bank, residence permit 'turnkey'",
      "You don't want to run around government offices and get fined"
    ]
  },
  "expectedResults": {
    "title": "Expected Results",
    "items": [
      "Visa obtained, legal entry",
      "Rental contract in your name",
      "Turkish bank account opened, card in hand",
      "Residence permit package submitted, status tracking",
      "Curator support for {duration} days after arrival"
    ],
    "durationOptions": ["30", "60"]
  },
  "timelinePlan": {
    "title": "30-Day Plan",
    "weeks": [
      { "number": 1, "activities": "Documents and visa center appointment" },
      { "number": 2, "activities": "Arrival, SIM, tax number" },
      { "number": 3, "activities": "Housing + bank" },
      { "number": 4, "activities": "Residence permit package, submission" }
    ]
  },
  "responsibilityMatrix": {
    "title": "We Do / You Do",
    "weDo": {
      "title": "We Do",
      "items": ["...", "..."]
    },
    "youDo": {
      "title": "You Do",
      "items": ["...", "..."]
    }
  },
  "riskMitigation": {
    "title": "Risks & How We Address Them",
    "risks": [
      { "risk": "Visa rejection", "mitigation": "..." },
      { "risk": "Rental contract errors", "mitigation": "..." },
      { "risk": "Bank limits", "mitigation": "..." },
      { "risk": "Residence permit delays", "mitigation": "..." }
    ]
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "items": [
      { "question": "Can I do it without income statement?", "answer": "..." },
      { "question": "What if my address changes?", "answer": "..." },
      { "question": "Can I bring my family?", "answer": "..." }
    ]
  }
}
```

**TR-YÖS Courses** (`services.tr-yos-courses.*`):

```json
{
  "courseGoal": {
    "title": "Course Goal",
    "description": "We'll prepare you for TR-YÖS to a score sufficient for admission to your faculty.",
    "packages": [
      { "name": "Basic", "targetScore": "50-60" },
      { "name": "Standard", "targetScore": "60-70" },
      { "name": "Premium", "targetScore": "70+" }
    ]
  },
  "diagnosticTest": {
    "title": "20-Minute Diagnostic",
    "description": "Take a quick test to get a personalized package recommendation.",
    "buttonText": "Take Test",
    "buttonUrl": "/diagnostic/tr-yos"
  },
  "programContent": {
    "title": "What's Inside the Program",
    "items": [
      { "title": "Theory", "description": "Mathematics, logic", "icon": "mdi:book-open" },
      { "title": "Practice", "description": "N full mock exams", "icon": "mdi:pencil" },
      {
        "title": "Error Analysis",
        "description": "Personalized feedback",
        "icon": "mdi:chart-line"
      },
      { "title": "Materials", "description": "Task bank and notes", "icon": "mdi:folder" }
    ]
  },
  "formatSchedule": {
    "title": "Format & Schedule",
    "format": "Online/Offline, Group/Individual",
    "duration": "8 weeks",
    "homework": "Yes, with review",
    "support": "Between sessions via chat"
  },
  "studentResults": {
    "title": "Student Results",
    "cases": [{ "before": 42, "after": 68, "duration": "8 weeks", "proof": "/images/case-1.png" }]
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "items": [
      { "question": "How do I register for the exam?", "answer": "..." },
      { "question": "Can I retake?", "answer": "..." },
      { "question": "Can I reschedule lessons?", "answer": "..." }
    ]
  }
}
```

**SAT Courses** (`services.sat-courses.*`):

```json
{
  "courseGoal": {
    "title": "Target Results",
    "description": "Focused on Digital SAT preparation.",
    "packages": [
      { "name": "Foundation", "targetScore": "1200+" },
      { "name": "Advanced", "targetScore": "1350+" },
      { "name": "Elite", "targetScore": "1450+" }
    ]
  },
  "diagnosticTest": {
    "title": "Start with Diagnostic",
    "description": "Get your individual study plan.",
    "buttonText": "SAT Diagnostic",
    "buttonUrl": "/diagnostic/sat"
  },
  "programContent": {
    "title": "Program Content",
    "items": [
      {
        "title": "Math",
        "description": "Algebra, geometry, data analysis",
        "icon": "mdi:calculator"
      },
      {
        "title": "Reading & Writing",
        "description": "Comprehension, grammar, rhetoric",
        "icon": "mdi:text"
      },
      { "title": "Mock Tests", "description": "Weekly timed tests", "icon": "mdi:clock" },
      {
        "title": "Strategies",
        "description": "Time management, section tactics",
        "icon": "mdi:strategy"
      },
      { "title": "Progress Tracking", "description": "Homework trackers", "icon": "mdi:chart-box" }
    ]
  },
  "formatSchedule": {
    "title": "Format",
    "enrollmentSchedule": "New cohorts every month",
    "duration": "12 weeks",
    "recordings": "Access to recorded sessions",
    "taskBank": "Full task bank included"
  },
  "studentResults": {
    "title": "Case Studies",
    "cases": [{ "score": 1420, "proof": "/images/sat-report-1.png", "admission": "MIT" }]
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "items": [
      { "question": "How many attempts do I get?", "answer": "..." },
      { "question": "Can I change my test date?", "answer": "..." },
      { "question": "Do I need TOEFL/IELTS too?", "answer": "..." }
    ]
  }
}
```

**Language Courses** (`services.turkish-english-course.*`):

```json
{
  "levelProgression": {
    "title": "Your Level Progression",
    "levels": [
      { "from": "A1", "to": "A2", "outcome": "Basic conversations, daily tasks" },
      { "from": "B1", "to": "B2", "outcome": "Work meetings, academic discussions" }
    ]
  },
  "diagnosticTest": {
    "title": "10-Minute Level Test",
    "description": "Determine your starting level.",
    "buttonText": "Determine Level",
    "buttonUrl": "/diagnostic/language"
  },
  "formatSchedule": {
    "title": "Learning Format",
    "groupSize": "Up to 8 students",
    "individual": "Available",
    "conversationClubs": "Weekly",
    "schedule": "Flexible",
    "platform": "Zoom + learning portal",
    "certificate": "Upon completion"
  },
  "teachers": {
    "title": "Methodology & Teachers",
    "methodology": "Communicative approach with real-world scenarios...",
    "profiles": [
      { "name": "Teacher 1", "photo": "/images/teacher-1.jpg", "achievements": "..." },
      { "name": "Teacher 2", "photo": "/images/teacher-2.jpg", "achievements": "..." },
      { "name": "Teacher 3", "photo": "/images/teacher-3.jpg", "achievements": "..." }
    ]
  },
  "expectedResults": {
    "title": "Results in N Weeks",
    "duration": "12",
    "skills": [
      "Open a bank account",
      "Pass a university interview",
      "Read news articles",
      "Write formal emails"
    ]
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "items": [
      { "question": "What if I miss a class?", "answer": "..." },
      { "question": "Can I freeze my course?", "answer": "..." },
      { "question": "What's your refund policy?", "answer": "..." }
    ]
  }
}
```

**Document Translations** (`services.document-translations.*`):

```json
{
  "priceCalculator": {
    "title": "Price Calculator",
    "documentTypes": ["Diploma", "Transcript", "Passport", "Birth Certificate", "Other"],
    "languages": ["English", "Turkish", "Russian", "Kazakh"],
    "urgency": ["Standard (5 days)", "Express (2 days)", "Rush (24 hours)"],
    "basePrices": {
      "standard": { "KZT": "10000", "TRY": "350", "RUB": "2000", "USD": "20" },
      "express": { "KZT": "15000", "TRY": "525", "RUB": "3000", "USD": "30" },
      "rush": { "KZT": "20000", "TRY": "700", "RUB": "4000", "USD": "40" }
    }
  },
  "universityRequirements": {
    "title": "What Universities Accept",
    "formats": ["Notarized translation", "Apostille + translation", "Consular legalization"],
    "acceptedBy": "All major Turkish universities"
  },
  "sampleDocuments": {
    "title": "Sample Pages",
    "samples": [
      { "type": "Diploma", "image": "/images/sample-diploma.jpg" },
      { "type": "Transcript", "image": "/images/sample-transcript.jpg" },
      { "type": "Passport", "image": "/images/sample-passport.jpg" }
    ]
  }
}
```

## Technical Constraints

1. **i18n Reactivity**: All i18n content must use computed properties to react to locale changes
2. **Type Safety**: All component props must have TypeScript interfaces
3. **Responsive Design**: All sections must work on mobile (375px), tablet (768px), desktop (1280px)
4. **Performance**: Lazy-load images, avoid heavy computations in templates
5. **Accessibility**: Semantic HTML, ARIA labels where needed, keyboard navigation
6. **Testing**: Each component must have unit tests, contract tests for i18n completeness

## Risks & Mitigations

| Risk                                        | Impact                                      | Mitigation                                                   |
| ------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------ |
| i18n key explosion (200+ keys)              | Hard to maintain, easy to miss translations | Use consistent naming convention, create i18n contract tests |
| Component proliferation (16 new components) | Harder to navigate codebase                 | Group in `sections/` subdirectory, clear naming              |
| Content not ready for all locales           | Delays launch                               | Start with English, use placeholders for other locales       |
| Design inconsistency across sections        | Poor UX                                     | Create shared Tailwind classes, design system tokens         |
| Performance degradation with many sections  | Slow page load                              | Lazy-load images, minimize JS bundle, use SSR                |

## Next Steps (Phase 1)

1. Create `data-model.md` with detailed i18n schema and TypeScript types
2. Create `contracts/` with component prop interfaces and i18n key schemas
3. Create `quickstart.md` with development setup and testing guide
4. Update plan.md with Phase 1 completion status

---

**Research Complete**: Ready to proceed to Phase 1 (Design).
