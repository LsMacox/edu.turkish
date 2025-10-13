# Feature Specification: Enhanced Service Page Content Blocks

**Feature Branch**: `012-x-30-60`  
**Created**: 2025-01-13  
**Status**: Draft  
**Input**: User description: "Add structured content blocks to service pages for Relocation to Turkey, TR-YÖS Courses, SAT Courses, Turkish/English Courses, and Document Translations"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Relocation Service Transparency (Priority: P1)

A prospective student who has been accepted to a Turkish university visits the "Relocation to Turkey" service page to understand what support they will receive, what they need to do themselves, and what risks are covered.

**Why this priority**: This is the highest-value service with the most complexity and client anxiety. Clear communication of responsibilities, timeline, and risk mitigation directly impacts conversion and reduces support burden.

**Independent Test**: Can be fully tested by visiting `/services/relocation-in-turkey` and verifying all new sections render with i18n content across all 4 locales (en/ru/kk/tr).

**Acceptance Scenarios**:

1. **Given** user visits relocation service page, **When** they scroll down, **Then** they see "Who Is This For?" section with 3 qualifying criteria
2. **Given** user reads "Expected Results" section, **When** they review the list, **Then** they see 5 concrete deliverables with curator support duration (30/60 days)
3. **Given** user views "30-Day Plan" section, **When** they read the timeline, **Then** they see 4 weekly milestones with clear activities
4. **Given** user checks "We Do / You Do" section, **When** they compare columns, **Then** they understand responsibility boundaries
5. **Given** user reads "Risks & Mitigation" section, **When** they review each risk, **Then** they see proactive measures for visa rejections, rental errors, bank limits, and residence permit delays
6. **Given** user scrolls to FAQ, **When** they expand questions, **Then** they find answers about income statements, address changes, and family relocation

---

### User Story 2 - TR-YÖS Course Program Clarity (Priority: P1)

A student preparing for TR-YÖS exam visits the course page to understand the program structure, take a diagnostic test, and see proof of results.

**Why this priority**: TR-YÖS is a critical exam for university admission. Clear program structure and diagnostic testing directly impact enrollment conversion.

**Independent Test**: Can be fully tested by visiting `/services/tr-yos-courses`, taking the diagnostic test, and verifying all program sections display correctly.

**Acceptance Scenarios**:

1. **Given** user visits TR-YÖS course page, **When** they read "Course Goal" section, **Then** they see target score ranges by package tier
2. **Given** user sees "20-Minute Diagnostic" section, **When** they click "Take Test" button, **Then** they are directed to diagnostic test with package recommendation
3. **Given** user reviews "Program Content" section, **When** they read the curriculum, **Then** they see theory (math, logic), practice (N mock exams), error analysis with feedback, and task bank materials
4. **Given** user checks "Format & Schedule" section, **When** they review options, **Then** they see online/offline, group/individual, duration, homework, and inter-session support details
5. **Given** user views "Student Results" section, **When** they read case studies, **Then** they see mini-cases like "42 to 68 in 8 weeks" with admission proof screenshots
6. **Given** user scrolls to FAQ, **When** they expand questions, **Then** they find answers about exam registration, retakes, and lesson rescheduling

---

### User Story 3 - SAT Course Digital Focus (Priority: P1)

A student targeting US/international universities visits the SAT course page to understand Digital SAT preparation, take a diagnostic, and see target scores.

**Why this priority**: SAT is critical for international admissions. Digital SAT focus and clear target scores differentiate the offering.

**Independent Test**: Can be fully tested by visiting `/services/sat-courses`, taking the diagnostic, and verifying all sections render with score targets.

**Acceptance Scenarios**:

1. **Given** user visits SAT course page, **When** they read "Target Results" section, **Then** they see score packages: 1200+, 1350+, 1450+ with Digital SAT focus
2. **Given** user sees "Start with Diagnostic" section, **When** they click "SAT Diagnostic" button, **Then** they receive an individual study plan
3. **Given** user reviews "Program Content" section, **When** they read curriculum, **Then** they see Math, Reading & Writing sections, weekly mock tests with timing, section-specific strategies, and progress trackers
4. **Given** user checks "Format" section, **When** they review details, **Then** they see enrollment schedule, duration, recorded session access, and task bank
5. **Given** user views "Case Studies" section, **When** they read examples, **Then** they see score report screenshots and admission letters
6. **Given** user scrolls to FAQ, **When** they expand questions, **Then** they find answers about attempt limits, date changes, and TOEFL/IELTS requirements

---

### User Story 4 - Language Course Level Progression (Priority: P2)

A prospective student visits Turkish or English course page to determine their current level, understand what they will achieve, and see teaching methodology.

**Why this priority**: Language courses are foundational but less complex than exam prep. Clear level progression and outcome expectations drive enrollment.

**Independent Test**: Can be fully tested by visiting `/services/turkish-english-course`, taking the level test, and verifying all sections display with CEFR levels.

**Acceptance Scenarios**:

1. **Given** user visits language course page, **When** they read "Level Progression" section, **Then** they see CEFR levels (A1→A2, B1→B2) with outcome descriptions
2. **Given** user sees "10-Minute Level Test" section, **When** they click "Determine Level" button, **Then** they take a placement test
3. **Given** user reviews "Learning Format" section, **When** they read details, **Then** they see group size (up to N), individual options, conversation clubs, schedule, platform, and completion certificate
4. **Given** user checks "Methodology & Teachers" section, **When** they read content, **Then** they see 1 paragraph about approach and 3 teacher cards with achievements
5. **Given** user views "Results in N Weeks" section, **When** they read outcomes, **Then** they see concrete skills like "open a bank account" or "pass university interview"
6. **Given** user scrolls to FAQ, **When** they expand questions, **Then** they find answers about absences, freezing, and refunds

---

### User Story 5 - Document Translation Calculator Enhancement (Priority: P3)

A user visits the document translation page to calculate exact pricing, understand university requirements, and see sample translations.

**Why this priority**: This page already exists and functions well. Enhancements are incremental improvements rather than core functionality.

**Independent Test**: Can be fully tested by visiting `/services/document-translations`, using the calculator, and viewing sample documents.

**Acceptance Scenarios**:

1. **Given** user visits document translation page, **When** they use "Price Calculator" section, **Then** they select document type × language × urgency and see exact price
2. **Given** user reviews "University Requirements" section, **When** they read the list, **Then** they see accepted formats, notarization types, and apostille requirements
3. **Given** user views "Sample Pages" section, **When** they browse examples, **Then** they see 2-3 anonymized translation samples

---

### Edge Cases

- What happens when a user's browser language doesn't match any of the 4 supported locales (en/ru/kk/tr)?
  - System falls back to English (default locale)
- What happens when i18n keys are missing for a specific locale?
  - Component should gracefully show the key path or fallback to English
- What happens when diagnostic test buttons are clicked but no test URL is configured?
  - Button should be hidden or disabled if URL is not provided in i18n
- What happens when "N" placeholder values (e.g., group size, duration) are not replaced?
  - These should be clearly marked in i18n files for content team to fill
- What happens when a service page doesn't need all sections (e.g., relocation doesn't need diagnostic test)?
  - Sections should be conditionally rendered based on slot presence (existing pattern)

## Requirements _(mandatory)_

### Functional Requirements

#### Relocation to Turkey Service

- **FR-001**: System MUST display "Who Is This For?" section with 3 qualifying criteria (accepted students, need turnkey support, want to avoid penalties)
- **FR-002**: System MUST display "Expected Results" section with 5 deliverables (visa, rental contract, bank account, residence permit application, curator support with 30/60 day options)
- **FR-003**: System MUST display "30-Day Plan" section with 4 weekly milestones (Week 1: documents & visa appointment, Week 2: arrival & tax number, Week 3: housing & bank, Week 4: residence permit submission)
- **FR-004**: System MUST display "We Do / You Do" section as two-column layout showing responsibility boundaries
- **FR-005**: System MUST display "Risks & Mitigation" section covering visa rejections, rental errors, bank limits, and residence permit delays with proactive measures
- **FR-006**: System MUST display FAQ section with questions about income statements, address changes, and family relocation

#### TR-YÖS Courses Service

- **FR-007**: System MUST display "Course Goal" section with target score ranges by package tier
- **FR-008**: System MUST display "20-Minute Diagnostic" section with clickable "Take Test" button
- **FR-009**: System MUST display "Program Content" section with theory (math, logic), practice (N mock exams), error analysis, and materials
- **FR-010**: System MUST display "Format & Schedule" section with online/offline, group/individual, duration, homework, and support details
- **FR-011**: System MUST display "Student Results" section with mini-cases showing score improvements and admission proofs
- **FR-012**: System MUST display FAQ section about exam registration, retakes, and lesson rescheduling

#### SAT Courses Service

- **FR-013**: System MUST display "Target Results" section with score packages (1200+, 1350+, 1450+) and Digital SAT focus
- **FR-014**: System MUST display "Start with Diagnostic" section with clickable "SAT Diagnostic" button
- **FR-015**: System MUST display "Program Content" section with Math, Reading & Writing, weekly mock tests, strategies, and progress trackers
- **FR-016**: System MUST display "Format" section with enrollment schedule, duration, recording access, and task bank
- **FR-017**: System MUST display "Case Studies" section with score report screenshots and admission letters
- **FR-018**: System MUST display FAQ section about attempt limits, date changes, and TOEFL/IELTS requirements

#### Language Courses Service

- **FR-019**: System MUST display "Level Progression" section with CEFR levels (A1→A2, B1→B2) and outcome descriptions
- **FR-020**: System MUST display "10-Minute Level Test" section with clickable "Determine Level" button
- **FR-021**: System MUST display "Learning Format" section with group size, individual options, conversation clubs, schedule, platform, and certificate
- **FR-022**: System MUST display "Methodology & Teachers" section with 1 approach paragraph and 3 teacher cards
- **FR-023**: System MUST display "Results in N Weeks" section with concrete skills (e.g., "open bank account", "pass university interview")
- **FR-024**: System MUST display FAQ section about absences, freezing, and refunds

#### Document Translation Service Enhancement

- **FR-025**: System MUST display "Price Calculator" section with document type × language × urgency selectors
- **FR-026**: System MUST display "University Requirements" section listing accepted formats, notarization types, and apostille requirements
- **FR-027**: System MUST display "Sample Pages" section with 2-3 anonymized translation examples

#### Cross-Service Requirements

- **FR-028**: All new content sections MUST support i18n across all 4 locales (en, ru, kk, tr)
- **FR-029**: All sections MUST be responsive and work on mobile, tablet, and desktop viewports
- **FR-030**: All sections MUST follow existing Tailwind design system and component patterns
- **FR-031**: All sections MUST be conditionally rendered based on slot presence (no empty sections)
- **FR-032**: All diagnostic/test buttons MUST open in new tab or modal (implementation detail TBD)

### Key Entities

- **Service Page Section**: Represents a content block on a service page with title, description, and structured content (lists, columns, cards, etc.)
- **Diagnostic Test**: Represents an interactive assessment with URL/route, duration estimate, and outcome (package recommendation or level placement)
- **Timeline Milestone**: Represents a week or phase in a plan with number, activities, and deliverables
- **Responsibility Matrix**: Represents a two-column layout showing "We Do" vs "You Do" items
- **Risk Mitigation Item**: Represents a risk scenario with description and proactive measures
- **Case Study**: Represents a student success story with before/after metrics and proof (screenshot or testimonial)
- **Teacher Profile**: Represents an instructor with name, photo, and key achievements
- **Price Calculator Input**: Represents user selections for document type, language pair, and urgency level

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All 5 service pages render new content sections without errors in all 4 locales (en/ru/kk/tr)
- **SC-002**: Relocation service page displays all 6 new sections (Who Is This For, Expected Results, 30-Day Plan, We Do/You Do, Risks & Mitigation, FAQ)
- **SC-003**: TR-YÖS and SAT course pages display diagnostic test buttons that are clickable and functional
- **SC-004**: Language course page displays teacher profiles with photos and achievements
- **SC-005**: Document translation page displays price calculator with functional selectors
- **SC-006**: All new sections are responsive and render correctly on mobile (375px), tablet (768px), and desktop (1280px) viewports
- **SC-007**: All new i18n keys are present in all 4 locale files without missing translations
- **SC-008**: All new sections follow existing design system (Tailwind classes, spacing, typography)
- **SC-009**: Page load time does not increase by more than 200ms with new content sections
- **SC-010**: All ESLint, Prettier, and TypeScript checks pass for new/modified files
