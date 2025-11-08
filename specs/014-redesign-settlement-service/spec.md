# Feature Specification: Redesign Settlement Service Page

**Feature Branch**: `014-redesign-settlement-service`  
**Created**: 2025-01-08  
**Status**: Draft  
**Input**: User description: "Redesign settlement service page with two pricing tiers, benefits section, risks section, and FAQ"

## Clarifications

### Session 2025-01-08

- Q: VIP пакет содержит все услуги Standard + дополнительные VIP или только VIP услуги? → A: Все 9 услуг из Standard + 4 дополнительные VIP услуги (всего 13 услуг)
- Q: На карточках пакетов должна быть кнопка для подачи заявки? → A: Да, на каждой карточке кнопка "Заказать"
- Q: Визуальное оформление секций "Почему должны брать услугу у нас?" и "Риски"? → A: Разные визуализации - один блок с иконкой/иллюстрацией + текст, другой как карточка с фоном/градиентом (дизайнер решает распределение)
- Q: Порядок секций на странице (сверху вниз)? → A: Hero → Пакеты → Почему мы → Риски → FAQ
- Q: Отображение карточек пакетов на мобильных устройствах? → A: Аккордеон (сворачиваемые секции), по умолчанию открыты

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - View Two-Tier Settlement Packages (Priority: P1)

As a prospective student planning to move to Turkey, I want to see two clear settlement service packages (Standard and VIP) with their included services and pricing, so I can choose the one that fits my needs and budget.

**Why this priority**: This is the core value proposition of the redesigned page. Without clear package presentation, users cannot make informed decisions.

**Independent Test**: Can be fully tested by navigating to `/services/relocation-in-turkey` and verifying both packages are displayed with all their features and prices.

**Acceptance Scenarios**:

1. **Given** I am on the settlement service page, **When** I scroll to the packages section, **Then** I see two large cards: "Обустройство по Турции" ($1500) and "Вип обустройство по Турции" ($2000)
2. **Given** I view the Standard package card, **When** I read the features, **Then** I see all 9 services listed (document translation, university enrollment guarantee, accommodation, airport transfer, final registration, student pass, residence permit, Denklik belgesi, tax number)
3. **Given** I view the VIP package card, **When** I read the features, **Then** I see all 13 services listed (9 from Standard + 4 VIP: apartment search, utilities setup, address registration, bank account opening)

---

### User Story 2 - Understand Benefits and Risks (Priority: P2)

As a prospective student, I want to understand why I should use Edu Turkish's settlement service and what risks I'm avoiding, so I can feel confident in my decision to use the service.

**Why this priority**: Trust-building content is critical for conversion, but secondary to showing what's actually offered.

**Independent Test**: Can be tested by verifying the "Why Choose Us" and "Risks" sections display the specified content with creative visualization.

**Acceptance Scenarios**:

1. **Given** I am on the settlement service page, **When** I scroll to the benefits section, **Then** I see the "Почему должны брать услугу у нас?" section with the trust-building message about modern, trustworthy service
2. **Given** I view the risks section, **When** I read the content, **Then** I see the warning about common mistakes and how Edu Turkish has been helping students since 2018
3. **Given** I view both sections, **When** I examine the design, **Then** I see creative visual presentation that makes the content engaging

---

### User Story 3 - Get Answers to Common Questions (Priority: P3)

As a prospective student, I want to find answers to frequently asked questions about the settlement service, so I can make an informed decision without contacting support.

**Why this priority**: FAQ reduces support burden and helps conversion, but users can still contact support if needed.

**Independent Test**: Can be tested by verifying the FAQ section displays all 9 questions with answers in all supported languages.

**Acceptance Scenarios**:

1. **Given** I am on the settlement service page, **When** I scroll to the FAQ section, **Then** I see all 9 questions about process duration, payment, cities, partial services, self-service risks, etc.
2. **Given** I switch to a different language (en/kk/tr), **When** I view the FAQ section, **Then** all questions and answers are properly translated
3. **Given** I click on an FAQ item, **When** the answer expands, **Then** I can read the full detailed answer

### Edge Cases

- What happens when the database doesn't have sub-services for the settlement category?
  - Display fallback content from i18n files
- What happens when a user switches language while viewing the page?
  - All content should re-render with proper translations, including FAQ
- What happens if exchange rates fail to load?
  - Display prices in USD only with appropriate error handling
- What happens if the page is viewed on mobile?
  - Package cards display as accordion (collapsible sections), expanded by default, allowing users to collapse for easier scrolling
- What happens if metadata JSON in database is malformed?
  - Gracefully fall back to default content without breaking the page

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST display two settlement service packages (Standard $1500 and VIP $2000) as large cards spanning the container width
- **FR-002**: System MUST display Standard package with exactly 9 service items as specified
- **FR-003**: System MUST display VIP package with all 9 Standard services PLUS 4 additional VIP services (total 13 services)
- **FR-003a**: Each package card MUST have a "Заказать" (Order) button that opens the application modal with the package pre-selected
- **FR-004**: System MUST remove all existing sections except the hero (title and subtitle):
  - Remove `#who-is-this-for` slot (WhoIsThisForSection component)
  - Remove `#expected-results` slot (ExpectedResultsSection component)
  - Remove `#timeline-plan` slot (TimelinePlanSection component)
  - Remove `#responsibility-matrix` slot (ResponsibilityMatrixSection component)
  - Remove `#risk-mitigation` slot (RiskMitigationSection component)
  - Remove old `#faq` slot (will be replaced with new FAQ)
  - Remove `#sub-services` slot with SubServiceCard loop (will be replaced with package cards)
  - Remove `metadataPath` helper function (no longer needed)
  - Remove database fetch logic (fetchCategory, category data)
- **FR-005**: System MUST display sections in this order: Hero → Package Cards → Why Choose Us → Risks → FAQ
- **FR-006**: System MUST display "Why Choose Us" section with the specified trust-building content
- **FR-007**: System MUST display "Risks" section with the specified warning content
- **FR-008**: System MUST display FAQ section with all 9 questions and answers
- **FR-009**: System MUST support all 4 languages (en, ru, kk, tr) for all new content
- **FR-010**: System MUST use the existing FAQ component for consistency
- **FR-011**: System MUST store only basic package info (name, price, slug) in database (SubService model)
- **FR-012**: System MUST store all content (service lists, FAQ, benefits, risks) in i18n translation files
- **FR-013**: System MUST use different visual styles for Benefits and Risks sections (one with icon/illustration + text layout, other as card with background/gradient), preserving exact text content
- **FR-014**: On mobile devices, package cards MUST display as accordion/collapsible sections, expanded by default

### Key Entities

- **ServiceCategory**: Represents the "relocation-in-turkey" service category
- **SubService**: Stores only basic package info (name, price USD, slug) for Standard and VIP packages
- **i18n files**: Store all static content (service lists, FAQ, benefits, risks) in `/i18n/locales/{lang}/services.json`

### Content Migration

**Remove from i18n** (`services.relocation-in-turkey.*`):
- `whoIsThisFor.*` - entire section
- `expectedResults.*` - entire section
- `timelinePlan.*` - entire section
- `responsibilityMatrix.*` - entire section
- `riskMitigation.*` - entire section (will be replaced with new simpler "risks" section)
- `faq.*` - old FAQ items (will be replaced with new 9 questions)

**Add to i18n** (`services.relocation-in-turkey.*`):
- `packages.standard.*` - Standard package with 9 service items
- `packages.vip.*` - VIP package with 4 additional service items
- `benefits.*` - "Why Choose Us" content
- `risks.*` - New simplified risks section
- `faq.*` - New 9 FAQ items

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Users can view and compare both settlement packages within 10 seconds of page load
- **SC-002**: Page renders correctly in all 4 languages (en, ru, kk, tr) without layout breaks
- **SC-003**: FAQ section reduces support inquiries about settlement services by 30%
- **SC-004**: Benefits and Risks sections increase user confidence, measured by increased application form submissions
- **SC-005**: Page maintains performance with LCP < 2.5s and no layout shifts
- **SC-006**: All content is version-controlled and translatable through i18n files
