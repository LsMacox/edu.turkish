# Feature Specification: Service Pages with Dropdown Navigation

**Feature Branch**: `008-1-2-3`  
**Created**: 2025-10-12  
**Status**: Ready for Planning  
**Input**: User description: "Наша задача сделать страницы с услугами перечислинами в дропдавн меню при наведении на Услуги. Мои требования: 1) страницы по структуре должны +- быть похоже 2) Не должно быть куча блоков, все минималистично и как нужно 3) Должен соответсвовать принципам проекта (дизайн, компоненты которые используем, стили, общие стили, общие компоненты, структура где это все храним и как разделяем код и прочее) 4) Принцип такой, хочу чтобы на каждой странице с услугой было описания услуги или услуг по вот этой основной услуге, стоимость этой услуги, и подача заявки по этой услуге (и чтоб после подачи заявки, к нам в crm приходило для какой именно услуги подавалась заявка)."

---

## User Scenarios & Testing

### Primary User Story

A prospective student visits the website to learn about available services. They hover over the "Services" menu item in the navigation and see a dropdown list of all available services. They click on a specific service (e.g., "TR-YÖS Courses") and are taken to a dedicated page that lists multiple sub-services under that main service category. Each sub-service has its own description and pricing. The user can click "Apply" on any sub-service, which opens the application modal popup. In the modal, the "Who are you?" section shows that the user is applying for that specific sub-service. When they submit the application, the CRM system receives the application with information about which specific sub-service the user is interested in.

### Acceptance Scenarios

1. **Given** a user is on any page of the website, **When** they hover over the "Services" navigation item, **Then** a dropdown menu appears showing all available services (Relocation in Turkey, TR-YÖS Courses, SAT Courses, Turkish & English Course, Document Translations)

2. **Given** the services dropdown is open, **When** the user clicks on a specific service, **Then** they are navigated to that service's dedicated page

3. **Given** a user is on a service page, **When** they view the page, **Then** they see a minimalist layout with multiple sub-services listed, each with its own description, pricing information, and "Apply" button

4. **Given** a user is viewing a service page, **When** they select a currency from the header dropdown (KZT, TRY, RUB, or USD), **Then** the pricing information updates to show the price in the selected currency

5. **Given** a user has selected a currency, **When** they navigate to a different service page, **Then** the pricing continues to display in their selected currency

6. **Given** a user clicks "Apply" on a specific sub-service, **When** the application modal opens, **Then** the modal displays which sub-service the user is applying for in the preferences/"Who are you?" section

7. **Given** a user fills out the application form in the modal, **When** they submit the form, **Then** the application is sent to the CRM with the specific sub-service identifier included in the source/source_description fields

8. **Given** a user submits an application for a specific sub-service, **When** the CRM receives the data, **Then** the CRM record clearly indicates which sub-service the application is for

9. **Given** a user is viewing different service pages, **When** they navigate between them, **Then** all pages follow a consistent structure and design pattern with sub-services listed

10. **Given** a user clicks "Apply" on different sub-services, **When** the modal opens, **Then** the modal correctly identifies which sub-service is being applied for each time

### Edge Cases

- What happens when a user submits an application without selecting any additional preferences?
- How does the system handle service pages when accessed directly via URL (not through dropdown)?
- What happens if the CRM integration fails when submitting a service-specific application?
- How are service pages displayed on mobile devices with the dropdown menu?
- What happens if a user has not selected a currency - which currency is shown by default?
- How does the currency selector interact with the existing language selector in the header?
- What happens when a user changes language - does the selected currency persist?

## Requirements

### Functional Requirements

- **FR-001**: System MUST display a dropdown menu when users hover over the "Services" navigation item
- **FR-002**: Dropdown menu MUST list all available services: Relocation in Turkey, TR-YÖS Courses, SAT Courses, Turkish & English Course, Document Translations
- **FR-003**: Each service in the dropdown MUST link to its dedicated page
- **FR-004**: Each service page MUST display multiple sub-services under the main service category
- **FR-004a**: Each sub-service MUST have its own description content
- **FR-004b**: Each sub-service MUST have its own pricing information in all supported currencies
- **FR-005**: Each sub-service MUST have an "Apply" button that opens the application modal
- **FR-006**: When the application modal opens from a sub-service, it MUST display which sub-service the user is applying for
- **FR-007**: All service pages MUST follow a consistent structure and layout
- **FR-008**: Service pages MUST use a minimalist design approach without excessive content blocks
- **FR-009**: When a user submits an application from the modal, the system MUST include the specific sub-service identifier in the application data
- **FR-010**: The CRM system MUST receive the sub-service identifier when an application is submitted
- **FR-010a**: The application modal MUST show the sub-service name in the preferences section (similar to "Who are you?" section)
- **FR-011**: All service content (descriptions, pricing) MUST be available in all supported languages (en, ru, kk, tr)
- **FR-012**: Service pages MUST be accessible via clean URLs (e.g., /services/tr-yos-courses)
- **FR-013**: The dropdown menu MUST highlight the currently active service when viewing a service page
- **FR-014**: Service pages MUST be responsive and work on mobile, tablet, and desktop devices
- **FR-015**: System MUST provide a currency selector in the header with options for KZT (Tenge), TRY (Lira), RUB (Ruble), and USD (Dollar)
- **FR-016**: When a user selects a currency, all pricing information on service pages MUST update to display prices in the selected currency
- **FR-017**: The selected currency preference MUST persist across page navigation
- **FR-018**: Each sub-service MUST have pricing defined for all four supported currencies (KZT, TRY, RUB, USD)
- **FR-019**: The application modal MUST use the existing popup component that is already used elsewhere on the site
- **FR-020**: The application modal MUST pre-populate or display the selected sub-service in the user preferences section

### Non-Functional Requirements

- **NFR-001**: Service pages MUST follow the project's design system and component architecture
- **NFR-002**: Service pages MUST use existing shared components where applicable
- **NFR-003**: Service pages MUST maintain consistent styling with the rest of the website
- **NFR-004**: Page load time for service pages MUST be comparable to other pages on the site

### Key Entities

- **Service Category**: A main service category shown in the navigation dropdown. Categories are: Relocation in Turkey, TR-YÖS Courses, SAT Courses, Turkish & English Course, Document Translations

- **Sub-Service**: A specific service offering under a main category, with attributes including sub-service name, description, pricing information in multiple currencies (KZT, TRY, RUB, USD), and unique identifier. Each service category page displays multiple sub-services.

- **Service Application**: An application submitted for a specific sub-service, containing all standard application fields plus a sub-service identifier (via source/source_description) to track which sub-service the user is interested in. The application modal displays the selected sub-service in the preferences section.

- **Currency Preference**: User's selected currency for viewing prices, persisted across the session. Supported currencies: KZT (Tenge), TRY (Lira), RUB (Ruble), USD (Dollar)

### Design Decisions

- **Pricing Display**: Prices will be shown in multiple currencies (KZT, TRY, RUB, USD) with a currency selector in the header. The displayed price updates based on the selected currency.
- **Content Management**: Service and sub-service descriptions and all text content will be managed through i18n localization files.
- **Application Modal**: The existing application modal popup component will be reused. When opened from a sub-service, it will display which sub-service the user is applying for in the preferences section.
- **Service Tracking**: The existing `source` and `source_description` fields in the application data will be used to track which sub-service the application is for.
- **Page Structure**: Each service category page will list multiple sub-services in a minimalist layout. Each sub-service will have: description, pricing (in selected currency), and an "Apply" button.
- **Sub-Service Examples**:
  - TR-YÖS Courses might include: Basic TR-YÖS Preparation, Advanced TR-YÖS Preparation, Individual Tutoring
  - Document Translations might include: Diploma Translation, Transcript Translation, Passport Translation
  - Relocation might include: Visa Support, Housing Assistance, Bank Account Opening

---

## Review & Acceptance Checklist

### Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---
