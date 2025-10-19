# Feature Specification: Migrate Service Cards to Database with Translations and Dynamic Currency

**Feature Branch**: `013-migrate-service-cards`  
**Created**: 2025-01-14  
**Status**: Draft  
**Input**: User description: "Migrate service cards to database with translations, store prices in USD, fetch exchange rates via API, convert prices dynamically on client based on selected currency, remove obsolete i18n entries, seed existing Russian locale data, and enable future service additions for fixed service categories"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Service Prices in Preferred Currency (Priority: P1)

A visitor browses service pages and sees prices automatically converted to their preferred currency (KZT, TRY, RUB, or USD) based on real-time exchange rates from an external API.

**Why this priority**: This is the core user-facing functionality. Without dynamic currency conversion, the entire feature provides no value to end users.

**Independent Test**: Can be fully tested by visiting any service page, selecting different currencies from the currency selector, and verifying that prices update correctly based on current exchange rates.

**Acceptance Scenarios**:

1. **Given** a visitor is on the Turkish-English course page with USD selected, **When** they switch to RUB, **Then** all service card prices update to show RUB amounts calculated from USD base prices using current exchange rates
2. **Given** a visitor selects KZT as their currency, **When** they navigate to the TR-YÖS courses page, **Then** all prices display in KZT with the ₸ symbol
3. **Given** a visitor has USD selected, **When** they view any service card, **Then** the price shows the exact USD amount stored in the database without conversion
4. **Given** the exchange rate API is unavailable, **When** a visitor views prices, **Then** fallback exchange rates are used and prices still display correctly

---

### User Story 2 - Multilingual Service Content (Priority: P1)

A visitor can view service information (titles, descriptions, details) in their preferred language (en, ru, kk, tr) with all content dynamically loaded from the database translations table.

**Why this priority**: Multilingual support is essential for the target audience (students from Kazakhstan, Russia, Turkey, and international students). Without translations, the service is unusable for non-Russian speakers.

**Independent Test**: Can be tested by switching between locales and verifying that all service content (service categories, sub-services, descriptions) displays in the selected language.

**Acceptance Scenarios**:

1. **Given** a visitor has Russian locale selected, **When** they visit the relocation services page, **Then** all service titles, descriptions, and metadata display in Russian
2. **Given** a visitor switches from Russian to Turkish, **When** the page reloads, **Then** all service content updates to Turkish translations
3. **Given** a new service is added with translations for all four locales, **When** a visitor views the service in any locale, **Then** the appropriate translation displays
4. **Given** a translation is missing for a specific locale, **When** a visitor views that service, **Then** a fallback to English is displayed

---

### User Story 3 - Admin Adds New Services (Priority: P2)

An administrator can add new services and sub-services to existing service categories through database operations, with support for translations and USD-based pricing.

**Why this priority**: This enables content management and future scalability. While important, the system can function with seeded data initially.

**Independent Test**: Can be tested by adding a new sub-service record via Prisma Studio or seed script, verifying it appears on the appropriate service page with correct translations and pricing.

**Acceptance Scenarios**:

1. **Given** an admin adds a new sub-service to the "document-translations" category with USD price 75, **When** a visitor views the document translations page, **Then** the new service appears with the correct price converted to their selected currency
2. **Given** an admin adds translations for a new service in all four locales, **When** visitors view the service in different languages, **Then** each sees their locale-specific translation
3. **Given** an admin updates the USD price of an existing service, **When** visitors refresh the page, **Then** they see updated prices in their selected currency based on the new USD amount

---

### User Story 4 - Seamless Migration from i18n to Database (Priority: P2)

The system migrates all existing service data from i18n JSON files to the database without data loss, maintaining all current functionality while removing obsolete i18n entries.

**Why this priority**: This ensures a smooth transition without breaking existing functionality. It's a prerequisite for the new system but doesn't directly add user value.

**Independent Test**: Can be tested by comparing service pages before and after migration, verifying that all services, prices, and content remain identical (except for dynamic currency conversion improvements).

**Acceptance Scenarios**:

1. **Given** all Russian locale service data from i18n files, **When** the migration seed script runs, **Then** all services are created in the database with Russian translations
2. **Given** the migration is complete, **When** i18n service entries are removed, **Then** service pages continue to function without errors
3. **Given** existing service pages used hardcoded pricing objects, **When** they are refactored to use database data, **Then** all prices display correctly with no visual differences

---

### Edge Cases

- **What happens when the exchange rate API fails or times out?**
  - System uses cached/fallback exchange rates stored in the database or configuration
  - Prices still display, but may not reflect the most current rates
  - Error is logged for monitoring

- **What happens when a service has no translation for the current locale?**
  - System falls back to English (default locale)
  - Logs a warning for content team to add missing translation

- **What happens when a visitor's selected currency is not supported?**
  - System defaults to USD
  - Currency selector shows only supported currencies (KZT, TRY, RUB, USD)

- **What happens when USD base price is null or zero?**
  - Service card displays "Contact for pricing" or similar message
  - No conversion is attempted

- **What happens when exchange rate is zero or negative?**
  - System uses fallback rate of 1.0 (treats as USD)
  - Error is logged for investigation

- **What happens when a service category has no sub-services?**
  - Service page displays empty state or hides the sub-services section
  - No errors are thrown

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST store all service prices in USD (base currency) in the database
- **FR-002**: System MUST fetch current exchange rates from an external API (e.g., exchangerate-api.io, fixer.io, or similar)
- **FR-003**: System MUST convert USD prices to the user's selected currency (KZT, TRY, RUB, USD) on the client side
- **FR-004**: System MUST support translations for all service content (titles, descriptions, metadata) in four locales: en, ru, kk, tr
- **FR-005**: System MUST store service translations in a dedicated database table following the existing `*_translations` pattern
- **FR-006**: System MUST maintain five service categories: document-translations, relocation-in-turkey, tr-yos-courses, sat-courses, turkish-english-course
- **FR-007**: System MUST migrate all existing Russian locale service data from i18n JSON files to the database without data loss
- **FR-008**: System MUST remove service-specific entries from i18n JSON files after successful migration (keeping only common UI strings)
- **FR-009**: System MUST cache exchange rates to minimize API calls and ensure performance
- **FR-010**: System MUST provide fallback exchange rates when the external API is unavailable
- **FR-011**: System MUST allow administrators to add new services and sub-services to existing categories
- **FR-012**: System MUST display prices with appropriate currency symbols (₸, ₺, ₽, $) based on selected currency
- **FR-013**: System MUST maintain backward compatibility with existing currency selector and store functionality
- **FR-014**: System MUST format prices according to locale conventions (decimal separators, thousands separators)
- **FR-015**: System MUST support optional delivery time metadata for services (e.g., "2-3 days")

### Key Entities

- **ServiceCategory**: Represents a major service category (e.g., "document-translations", "tr-yos-courses")
  - Attributes: id, slug (unique), order, isActive, createdAt, updatedAt
  - Relationships: has many ServiceCategoryTranslation, has many SubService

- **ServiceCategoryTranslation**: Localized content for service categories
  - Attributes: id, serviceCategoryId, locale (en/ru/kk/tr), title, subtitle, slug, metadata (JSON for page-specific content)
  - Relationships: belongs to ServiceCategory

- **SubService**: Individual service offering within a category
  - Attributes: id, serviceCategoryId, slug (unique within category), priceUsd (Decimal), deliveryTimeDays (optional), order, isActive, createdAt, updatedAt
  - Relationships: belongs to ServiceCategory, has many SubServiceTranslation

- **SubServiceTranslation**: Localized content for sub-services
  - Attributes: id, subServiceId, locale, name, description
  - Relationships: belongs to SubService

- **ExchangeRate**: Cached exchange rates for currency conversion
  - Attributes: id, baseCurrency (always USD), targetCurrency (KZT/TRY/RUB), rate (Decimal), fetchedAt, expiresAt
  - Purpose: Cache API responses and provide fallback rates

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All five service category pages load successfully with database-driven content in all four locales (en, ru, kk, tr)
- **SC-002**: Currency conversion displays accurate prices within 1% of actual exchange rates for all supported currencies
- **SC-003**: Exchange rate API calls are limited to once per hour maximum through effective caching
- **SC-004**: Page load time for service pages remains under 2 seconds with database queries optimized
- **SC-005**: Zero data loss during migration - all existing Russian locale services are successfully seeded into the database
- **SC-006**: i18n JSON files are reduced in size by at least 80% after removing migrated service content
- **SC-007**: New services can be added to the database and appear on service pages within 5 minutes without code changes
- **SC-008**: All existing tests pass after migration with updated test data sources
- **SC-009**: Currency selector continues to work seamlessly with the new database-driven pricing system
- **SC-010**: System gracefully handles exchange rate API failures with fallback rates and no user-facing errors
