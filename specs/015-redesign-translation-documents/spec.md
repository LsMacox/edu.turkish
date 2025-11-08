# Feature Specification: Redesign Translation Documents Service Page

**Feature Branch**: `015-redesign-translation-documents`  
**Created**: 2025-01-08  
**Status**: Draft  
**Input**: Redesign translation documents service page with new structure: hero section, service cards without prices, price calculator with application button, process steps, and why choose us section

## Clarifications

### Session 2025-01-08

- Q: В калькуляторе есть вариант "Остальное" с `priceUsd: null` в метаданных. Как должен вести себя интерфейс при выборе этой опции? → A: Показать "По запросу", кнопка "Подать заявку" активна, в модалку передаётся "price: by_request"
- Q: В спецификации указано, что нужно создать 7 карточек услуг с описаниями, но не уточнено, откуда брать эти описания. Как должны генерироваться описания для карточек? → A: Хранить в metadata базы данных (ServiceCategory.metadata.serviceCards)
- Q: В спецификации указано, что нужно обновить существующий `PriceCalculatorSection` компонент, добавив кнопку "Подать заявку". Как должна интегрироваться эта кнопка с существующим интерфейсом калькулятора? → A: Модифицировать PriceCalculatorSection, чтобы он всегда показывал кнопку применения
- Q: В спецификации указано, что нужно обновить секцию "Why Choose Us" до 5 факторов, но не уточнено, откуда брать эти данные. Где должны храниться данные для секции "Почему выбирают нас"? → A: В i18n файлах как статичный контент (services.document-translations.whyChooseUs.factors)
- Q: Спецификация упоминает fallback стратегию (FR-031), но детали не уточнены. Как должна работать fallback логика для отсутствующих данных? → A: Если metadata.serviceCards отсутствует - не показывать секцию карточек вообще

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Quick Price Estimation (Priority: P1)

A prospective student or client needs to quickly understand the cost of translating their documents for university admission or residence permit application in Turkey. They want to select their document type (passport, diploma, etc.), choose urgency level, and see an estimated price before committing.

**Why this priority**: Price transparency is the primary decision factor for 80%+ of users. Without immediate price visibility, users bounce to competitors.

**Independent Test**: Can be fully tested by visiting the page, selecting document type and urgency in the calculator, observing price update, and clicking "Submit Application" button. Delivers immediate value by showing price estimates and opening application modal.

**Acceptance Scenarios**:

1. **Given** user is on document-translations page, **When** they select "Загранпаспорт" + "Стандарт (1-3 days)", **Then** calculator shows "от 20$" with "Submit Application" button
2. **Given** user selects "Диплом" + "Срочно (до 3 часов)", **When** they calculate, **Then** price shows "от 55$" (45$ base + 10$ urgency surcharge)
3. **Given** user clicks "Submit Application" in calculator, **When** modal opens, **Then** service context includes selected document type and urgency level

---

### User Story 2 - Service Discovery and Selection (Priority: P2)

A user browsing the site wants to understand what types of documents can be translated and the key features of each service. They need clear descriptions without being overwhelmed by pricing details initially.

**Why this priority**: Service clarity drives conversion. Users need to understand offerings before committing to price discussions.

**Independent Test**: Can be tested by viewing service cards section and confirming all 7 document types are displayed with descriptions and icons. No prices shown on cards (prices only in calculator).

**Acceptance Scenarios**:

1. **Given** user scrolls to service cards section, **When** they view the cards, **Then** they see 7 cards (Attestat/Diploma, School Certificates, Passport/ID, Criminal Records, Power of Attorney, Financial Documents, Other)
2. **Given** user reads a service card, **When** they examine it, **Then** card shows icon, title, description (automatically generated), but NO price
3. **Given** user is on mobile, **When** viewing cards, **Then** cards are responsive and stack vertically on small screens

---

### User Story 3 - Process Understanding (Priority: P2)

A user who has never used translation services in Turkey wants to understand the step-by-step process: how to submit documents, what happens during translation, and how they receive the final notarized document.

**Why this priority**: Process transparency reduces uncertainty and increases trust, directly impacting conversion rates.

**Independent Test**: Can be tested by scrolling to "How It Works" section and confirming 4 steps are clearly displayed with icons and descriptions matching the specified process.

**Acceptance Scenarios**:

1. **Given** user views "How It Works" section, **When** they read steps, **Then** they see 4 steps: (1) Upload Document, (2) We Clarify Details, (3) Translate & Notarize, (4) Receive Final Document
2. **Given** step content is displayed, **When** user reads step 1, **Then** description clarifies "Send documents online (PDF/photo) - no need to bring originals in person"
3. **Given** user reads step 3, **When** examining notarization details, **Then** text states "Licensed translators (yeminli tercüman) perform translation with notarial certification"

---

### User Story 4 - Trust Building (Priority: P3)

A user researching translation services wants assurance that the translations will be accepted by Turkish government institutions and universities. They look for credibility markers.

**Why this priority**: Trust is essential for service businesses, but comes after understanding what's offered and how much it costs.

**Independent Test**: Can be tested by viewing "Why Choose Us" section and confirming 5 trust factors are displayed with icons and descriptions.

**Acceptance Scenarios**:

1. **Given** user scrolls to "Why Choose Us" section, **When** they read factors, **Then** they see 5 points: Licensed translators, Accepted by all Turkish institutions, Online service without office visit, Pre-certification review, Rush service available
2. **Given** user reads trust factor #1, **When** examining credentials, **Then** text states "Only accredited translators (yeminli tercüman) with official certification work on documents"
3. **Given** user completes page review, **When** they reach bottom CTA, **Then** they see call-to-action: "Want fast and error-free document translation for admission or residence permit? Contact us now - we'll check your documents and advise which translation type you need"

---

### User Story 5 - Mobile-First Experience (Priority: P3)

A user browsing from mobile device wants all sections to be fully responsive and readable on small screens without horizontal scrolling or illegible text.

**Why this priority**: 60%+ of traffic comes from mobile. Poor mobile experience directly reduces conversions.

**Independent Test**: Can be tested by opening page on mobile device (or responsive mode) and confirming all sections render correctly without layout breaks.

**Acceptance Scenarios**:

1. **Given** user opens page on mobile (< 768px), **When** viewing hero section, **Then** title and subtitle are readable without text overflow
2. **Given** calculator is displayed on mobile, **When** user interacts with selectors, **Then** dropdowns are touch-friendly and price updates are visible
3. **Given** service cards are shown on mobile, **When** scrolling through them, **Then** cards stack vertically with proper spacing

---

### Edge Cases

- What happens when calculator has no urgency selected (standard should be default)?
- What happens if user's locale doesn't have all translation keys (fallback to Russian)?
- What happens when `metadata.serviceCards` is missing from database (skip service cards section entirely, render other sections normally)?
- What happens when `metadata.calculator` is missing (system error - calculator cannot function without pricing data)?
- What happens when user selects "Остальное" document type (show "По запросу" text, button remains active, pass "price: by_request" to modal)?
- What happens on extremely small screens (<320px) - do cards remain readable?
- What happens if exchange rates fail to load (show USD prices as fallback)?

## Requirements _(mandatory)_

### Functional Requirements

#### Content Structure

- **FR-001**: System MUST display hero section with new title "Нотариально заверенные переводы документов в Турции" and 3-paragraph description about licensed translators and government acceptance
- **FR-002**: System MUST display 7 service cards without prices: Attestat/Diploma, School Certificates, Passport/ID, Criminal Records, Power of Attorney, Financial Documents, Other
- **FR-003**: System MUST read service card data (title, description, icon) from `ServiceCategory.metadata.serviceCards` array in database
- **FR-004**: System MUST remove existing SubServiceCard components that show prices and delivery times
- **FR-005**: System MUST remove existing UniversityRequirementsSection, SampleDocumentsSection, and TrustIndicatorBadge components

#### Price Calculator

- **FR-006**: System MUST display price calculator with 3 inputs: Document Type, Language Pair, Urgency
- **FR-007**: Document Type options MUST include: Passport (от 20$), School Attestat (от 30$), Diploma (от 45$), Power of Attorney/Consent (от 40$), Financial Documents (от 25$), Other (by request)
- **FR-008**: Language Pair options MUST include: Russian-Turkish, Turkish-Russian (note: expandable to other pairs in future)
- **FR-009**: Urgency options MUST include: Standard (1-3 days, base price), Rush (up to 3 hours, +10$ surcharge)
- **FR-010**: Calculator MUST update price dynamically when user changes selections
- **FR-011**: Calculator MUST display "от X$" format for prices in USD (exchange rates converted via useExchangeRatesStore)
- **FR-012**: Calculator MUST include "Submit Application" button that opens ApplicationModal with selected document type and urgency pre-filled. For "Остальное" document type, pass "price: by_request" to modal context
- **FR-013**: Calculator pricing data MUST come from `ServiceCategory.metadata.calculator` in database (fallback to i18n if metadata is empty)

#### Process Section

- **FR-014**: System MUST display "How It Works" section with 4 steps matching exact text provided by user
- **FR-015**: Each step MUST have icon, title, and description
- **FR-016**: Step 1 text: "Загружаете документ" - "Вы отправляете нам документы онлайн подав заявку (PDF/фото) — не обязательно приносить оригиналы лично"
- **FR-017**: Step 2 text: "Мы уточняем детали" - "Наш менеджер свяжется с вами для уточнения требований"
- **FR-018**: Step 3 text: "Переводим и заверяем" - "Лицензированные переводчики выполняют перевод с нотариальным заверением"
- **FR-019**: Step 4 text: "Получаете готовый файл" - "Готовые переводы отправляем в электронном формате либо бумажном виде на руки, при необходимости — курьером по Турции"

#### Trust Building Section

- **FR-020**: System MUST display "Why Choose Us" section with 5 trust factors
- **FR-021**: Trust Factor 1: "Работают только аккредитованные переводчики" - explanation about yeminli tercüman certification
- **FR-022**: Trust Factor 2: "Переводы принимаются всеми гос. учреждениями Турции" - acceptance guarantee
- **FR-023**: Trust Factor 3: "Возможность онлайн-перевода без визита в офис" - remote service convenience
- **FR-024**: Trust Factor 4: "Проверка и коррекция документа перед заверением" - quality assurance
- **FR-025**: Trust Factor 5: "Срочные переводы — в течение пару часов" - rush service availability

#### Final CTA

- **FR-026**: System MUST display final CTA section with message: "Хотите быстро и без ошибок перевести документы для поступления или ВНЖ? Свяжитесь с нами прямо сейчас - мы проверим ваши документы и подскажем, какой тип перевода вам нужен"
- **FR-027**: Final CTA MUST include "Send Documents" icon/button that opens ApplicationModal

#### Data Management

- **FR-028**: System MUST fetch ServiceCategory data for 'document-translations' from database via `fetchCategory` composable
- **FR-029**: System MUST read calculator configuration from `ServiceCategory.metadata.calculator` structure: `{ documentTypes: [{name, priceUsd}], languagePairs: [string], urgency: [{name, surcharge}] }`
- **FR-030**: System MUST support multi-locale content via i18n keys under `services.document-translations.*`
- **FR-031**: If database `metadata.serviceCards` is missing or empty, system MUST NOT render service cards section (skip it entirely). Other sections (hero, calculator, process, why choose us, final CTA) MUST render normally using i18n data
- **FR-032**: System MUST update seed data in `prisma/seed/` directory to populate ServiceCategoryTranslation metadata for 'document-translations' with calculator config and serviceCards array for all supported locales (en, ru, kk, tr)

#### Styling & Design

- **FR-033**: System MUST follow existing site design system (Tailwind tokens, color palette, typography)
- **FR-034**: Service cards MUST use consistent card component styling (similar to other service pages but without price badges)
- **FR-035**: Calculator MUST use form controls consistent with other calculators on site
- **FR-036**: All sections MUST be responsive and mobile-optimized (tested on 320px, 768px, 1024px, 1440px viewports)

### Key Entities

- **ServiceCategory (document-translations)**: Main service category storing hero title/subtitle in `translations` table, calculator configuration in `metadata` JSON field
- **ServiceCategoryTranslation**: Stores localized title, subtitle, slug, and metadata (including calculator config) per locale
- **Calculator Metadata Structure**:
  ```json
  {
    "calculator": {
      "documentTypes": [
        { "name": "Загранпаспорт", "priceUsd": 20 },
        { "name": "Школьный аттестат", "priceUsd": 30 },
        { "name": "Диплом", "priceUsd": 45 },
        { "name": "Доверенность/Согласие", "priceUsd": 40 },
        { "name": "Финансовые справки", "priceUsd": 25 },
        { "name": "Остальное", "priceUsd": null }
      ],
      "languagePairs": ["Русский – Турецкий", "Турецкий – Русский"],
      "urgency": [
        { "name": "Стандарт (1-3 дня)", "surcharge": 0 },
        { "name": "Срочно (до 3 часов)", "surcharge": 10 }
      ]
    },
    "serviceCards": [
      {
        "title": "Аттестат / Диплом / Приложение к диплому",
        "description": "Перевод и нотариальное заверение аттестатов, дипломов и приложений для поступления в турецкие университеты",
        "icon": "mdi:certificate"
      },
      {
        "title": "Справки из школы / университета",
        "description": "Академические справки, выписки об оценках и другие документы из учебных заведений",
        "icon": "mdi:school"
      },
      {
        "title": "Паспорт / ID / Свидетельства",
        "description": "Переводы паспортов, удостоверений личности, свидетельств о рождении, браке и других личных документов",
        "icon": "mdi:card-account-details"
      },
      {
        "title": "Справки о несудимости / медицинские справки",
        "description": "Справки об отсутствии судимости, медицинские заключения и другие официальные справки",
        "icon": "mdi:file-document-check"
      },
      {
        "title": "Доверенности/Согласия",
        "description": "Нотариальные доверенности, согласия родителей и другие юридические документы",
        "icon": "mdi:file-sign"
      },
      {
        "title": "Финансовые справки",
        "description": "Банковские выписки, справки о доходах, гарантийные письма и финансовые документы",
        "icon": "mdi:bank"
      },
      {
        "title": "Другое",
        "description": "Любые другие документы, требующие нотариального перевода - оценка стоимости индивидуально",
        "icon": "mdi:file-question"
      }
    ]
  }
  ```
- **Service Cards Data**: 7 document types stored in `ServiceCategory.metadata.serviceCards` array with title, description, and icon fields
- **Process Steps Data**: 4 steps stored in i18n as `services.document-translations.howItWorks.steps[].{title,description,icon}`
- **Why Choose Us Factors Data**: 5 trust factors stored in i18n as `services.document-translations.whyChooseUs.factors[].{title,description,icon}`

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can complete calculator interaction and see price estimate in under 10 seconds
- **SC-002**: "Submit Application" button in calculator opens ApplicationModal with correct pre-filled context (document type, urgency) in 100% of cases
- **SC-003**: All 7 service cards are visible and readable on mobile devices (320px-768px) without horizontal scroll
- **SC-004**: Page loads with hero, service cards, calculator, process, and trust sections all rendering correctly within 3 seconds on 3G connection
- **SC-005**: Calculator price updates in real-time (<100ms) when user changes document type or urgency selections
- **SC-006**: All content is properly localized for all 4 supported locales (en, ru, kk, tr) with no missing translation keys
- **SC-007**: Conversion rate (calculator interaction → application submission) increases by 15%+ compared to old page design within 30 days of deployment

## Technical Implementation Notes

### Data Storage Strategy

**Current Approach:**

- ServiceCategory stores `expressMultiplier` (1.50) and `rushMultiplier` (2.00) in base table
- SubServices store individual service prices in `price_usd` field
- This works for services WITH sub-services (like relocation packages)

**New Approach for Document Translations:**

- ServiceCategory will NOT use SubServices for display (SubServices can be deprecated or used only for internal tracking)
- Instead, create a `metadata` JSON structure in `ServiceCategoryTranslation` table:
  - `metadata.calculator` will store document types with base prices
  - `metadata.serviceCards` will store 7 service card definitions (or use pure i18n)
  - This allows flexible content management without schema changes

**Migration Path:**

1. Update seed file `prisma/seed/services.ts`:
   - Modify `perLocaleMetadata` for 'document-translations' (lines 196-294)
   - Replace existing `priceCalculator` structure with new `calculator` structure
   - Add `serviceCards` array with 7 document types (title, description, icon)
   - Update calculator to match new spec: documentTypes with priceUsd, languagePairs, urgency with surcharge
   - Remove or deprecate old subServices (notarized-translation, apostille-translation, consular-legalization)
   - Keep calculator-standard subService for internal tracking only
2. Run seed script to populate database: `pnpm db:seed` or `npm run db:seed`
3. Verify metadata in database for all locales (en, ru, kk, tr)
4. Update i18n files with new hero text, process steps (howItWorks), and trust factors (whyChooseUs)
5. Update `document-translations.vue` component to:
   - Remove SubServiceCard components
   - Add ServiceInfoCard components reading from metadata.serviceCards
   - Update PriceCalculatorSection with submit button
   - Remove UniversityRequirementsSection, SampleDocumentsSection, TrustIndicatorBadge
   - Add FinalCTASection component
6. Test page render with seeded data

### Component Architecture

**Remove:**

- `SubServiceCard` usage (lines 7-16)
- `UniversityRequirementsSection` (lines 32-37)
- `SampleDocumentsSection` (lines 39-44)
- `TrustIndicatorBadge` (lines 54-60)

**Keep:**

- `ServicePageLayout` wrapper
- `PriceCalculatorSection` (modify to always show "Submit Application" button)
- `HowItWorksSection` (update data)
- `ServicesWhyChooseUsSection` (update data to 5 factors)

**Add:**

- New `ServiceInfoCard` component for 7 document types without prices
- New `FinalCTASection` component for bottom call-to-action

### I18n Structure

Create/update keys under `services.document-translations`:

```
services.document-translations:
  title: "Нотариально заверенные переводы документов в Турции"
  subtitle: "Мы помогаем студентам и клиентам перевести все необходимые документы..."
  serviceCards:
    - title: "Аттестат / Диплом / Приложение к диплому"
      description: "Перевод и нотариальное заверение аттестатов..."
      icon: "mdi:certificate"
    - title: "Справки из школы / университета"
      description: "Академические справки, выписки..."
      icon: "mdi:school"
    [... 5 more cards]
  calculator:
    title: "Калькулятор цены"
    documentTypeLabel: "Тип документа"
    languagePairLabel: "Языковая пара"
    urgencyLabel: "Срочность"
    submitButton: "Подать заявку"
  howItWorks:
    steps:
      - title: "Загружаете документ"
        description: "Вы отправляете нам документы онлайн..."
        icon: "mdi:upload"
      [... 3 more steps]
  whyChooseUs:
    factors:
      - title: "Работают только аккредитованные переводчики"
        description: "Все наши специалисты имеют официальную аккредитацию..."
        icon: "mdi:certificate"
      [... 4 more factors]
  finalCTA:
    title: "Хотите быстро и без ошибок перевести документы..."
    button: "Отправить документы"
    icon: "mdi:send"
```

### Styling Guidelines

- Use existing Tailwind color tokens: `primary`, `secondary`, `accent`
- Service cards: white background, subtle shadow, hover effect (scale/shadow increase)
- Calculator: form controls with clear labels, large touch targets (min 44x44px)
- Icons: use Iconify (mdi:\* icons) for consistency
- Spacing: follow existing section spacing patterns (py-12 md:py-16)
- Typography: h2 for section titles, body text for descriptions
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

### Testing Strategy

1. **Seed Data Tests**: Verify seed script creates ServiceCategoryTranslation records with correct metadata structure for all locales
2. **Unit Tests**: Mock ServiceCategory data, test calculator price calculations (including "Остальное" edge case)
3. **Component Tests**: Test calculator interactions, button clicks, modal opening with correct context data
4. **Integration Tests**: Test full page render with real database data seeded from updated seed files
5. **Visual Regression Tests**: Screenshot tests for hero, cards, calculator, process sections on multiple viewports
6. **Accessibility Tests**: WCAG 2.1 AA compliance (keyboard navigation, screen reader support)
