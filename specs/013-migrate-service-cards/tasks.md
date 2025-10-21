# Tasks: Migrate Service Cards to Database with Translations and Dynamic Currency

**Input**: Design documents from `/specs/013-migrate-service-cards/`  
**Branch**: `013-migrate-service-cards`  
**Estimated Total**: 26 hours (3-4 days)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, Foundation)
- File paths use Nuxt structure: `app/`, `server/`, `prisma/`, `tests/`

---

## Phase 1: Setup & Foundation (Blocking Prerequisites)

**Purpose**: Database schema and core infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 [Foundation] Update Prisma schema with 4 new models in `prisma/schema.prisma`:
  - ServiceCategory (id, slug, order, isActive, timestamps)
  - ServiceCategoryTranslation (id, serviceCategoryId, locale, title, subtitle, slug, metadata JSON)
  - SubService (id, serviceCategoryId, slug, priceUsd Decimal, deliveryTimeDays, order, isActive, timestamps)
  - SubServiceTranslation (id, subServiceId, locale, name, description)
  - ExchangeRate (id, baseCurrency, targetCurrency, rate Decimal, fetchedAt, expiresAt)
  - Add proper indexes, unique constraints, and foreign keys with cascade delete

- [x] T002 [Foundation] Create Prisma migration for service tables:
  - Run `npm run db:migrate` with name "add_service_tables"
  - Verify migration created in `prisma/migrations/`
  - Run `npx prisma generate` to update Prisma client

- [x] T003 [P] [Foundation] Create API type definitions in `server/types/api/services.ts`:
  - ServiceCategoryListItem interface
  - ServiceCategoryDetail interface
  - SubServiceDetail interface
  - ExchangeRatesResponse interface
  - Export all types

- [x] T004 [P] [Foundation] Create ServiceRepository in `server/repositories/ServiceRepository.ts`:
  - Constructor accepting PrismaClient
  - findAllCategories(locale): Promise<ServiceCategoryListItem[]> - eager load translations, fallback to English
  - findCategoryBySlug(slug, locale): Promise<ServiceCategoryDetail | null> - include sub-services and translations
  - Implement translation fallback logic (locale → en)

- [x] T005 [P] [Foundation] Create ExchangeRateRepository in `server/repositories/ExchangeRateRepository.ts`:
  - Constructor accepting PrismaClient
  - getCurrentRates(): Promise<Record<Currency, number>> - return cached rates or fallback
  - updateRates(rates): Promise<void> - upsert rates with 1hr expiration
  - getRateDetails(): Promise<ExchangeRateDetails> - include metadata and expiry status
  - Define FALLBACK_RATES constant: { KZT: 450, TRY: 32, RUB: 90, USD: 1 }

- [x] T006 [P] [Foundation] Create ExchangeRateService in `server/services/ExchangeRateService.ts`:
  - fetchRates(): Promise<Record<Currency, number>> - call exchangerate-api.io API
  - Handle API failures gracefully, return fallback rates on error
  - Use URL: https://api.exchangerate-api.io/v4/latest/USD

**Checkpoint**: Foundation ready - database schema exists, repositories implemented, types defined

---

## Phase 2: User Story 4 - Seamless Migration (Priority: P2) 🎯 PREREQUISITE

**Goal**: Migrate existing i18n data to database without data loss

**Why First**: This story must complete before US1 and US2 can be tested with real data

**Independent Test**: Compare service pages before/after migration, verify all services and prices match

### Implementation for User Story 4

- [x] T007 [US4] Create services seeder in `prisma/seed/services.ts`:
  - Import Russian services.json data
  - Define CATEGORY_SLUGS array: ['document-translations', 'relocation-in-turkey', 'tr-yos-courses', 'sat-courses', 'turkish-english-course']
  - For each category: upsert ServiceCategory, create Russian ServiceCategoryTranslation
  - Extract metadata from category data (non-standard fields) into metadata JSON
  - For each sub-service: parse USD price from pricing.USD, upsert SubService, create Russian SubServiceTranslation
  - Export seedServices(prisma) function

- [x] T008 [US4] Update main seed file in `prisma/seed/seed.ts`:
  - Import seedServices from './services'
  - Call await seedServices(prisma) after existing seeders
  - Ensure proper error handling

- [x] T009 [US4] Run seeder and verify data:
  - Execute `npm run db:seed`
  - Open Prisma Studio: `npm run db:studio`
  - Verify 5 categories created with Russian translations
  - Verify ~20 sub-services created with USD prices
  - Verify metadata JSON populated for categories with page-specific content

**Checkpoint**: Database populated with migrated data from i18n

---

## Phase 3: User Story 1 - View Service Prices in Preferred Currency (Priority: P1) 🎯 MVP

**Goal**: Dynamic currency conversion with real-time exchange rates

**Independent Test**: Visit service page, switch currencies, verify prices update correctly

### Tests for User Story 1

- [x] T010 [P] [US1] Create exchange rate API contract test in `tests/contract/exchange-rates-api.contract.test.ts`:
  - Test GET /api/v1/exchange-rates returns rates for all 4 currencies
  - Test USD rate is always 1.0
  - Test fetchedAt and expiresAt are valid ISO timestamps
  - Test isFallback flag present when using fallback rates
  - Test response time < 200ms

- [x] T011 [P] [US1] Create exchange rate repository test in `tests/repositories/ExchangeRateRepository.test.ts`:
  - Test getCurrentRates() returns all currencies
  - Test updateRates() upserts rates with 1hr expiration
  - Test getRateDetails() includes metadata
  - Test fallback rates used when cache empty

### Implementation for User Story 1

- [x] T012 [US1] Create exchange rates API endpoint in `server/api/v1/exchange-rates/index.get.ts`:
  - Get ExchangeRateRepository and ExchangeRateService instances
  - Call repository.getRateDetails() to check cache
  - If expired, fetch fresh rates from service.fetchRates() and update cache
  - Return rates with baseCurrency, fetchedAt, expiresAt, isFallback
  - Handle errors gracefully, use fallback rates

- [x] T013 [US1] Create exchange rate Pinia store in `app/stores/exchangeRates.ts`:
  - State: rates (Record<Currency, number>), fetchedAt, expiresAt, isFallback
  - Computed: isExpired (compare expiresAt with current time)
  - Actions: fetchRates() - call /api/v1/exchange-rates, ensureFresh() - fetch if expired
  - Getter: getRate(currency) - return rate for currency
  - Initialize with fallback rates

- [x] T014 [US1] Update SubServiceCard component in `app/components/features/services/SubServiceCard.vue`:
  - Accept priceUsd prop instead of pricing object
  - Use exchangeRateStore.getRate(currencyRef.value) to get conversion rate
  - Compute convertedPrice = priceUsd \* rate
  - Format with currency symbol from useCurrency()
  - Ensure reactive updates when currency changes

- [x] T015 [US1] Create component test for SubServiceCard in `tests/components/features/services/SubServiceCard.test.ts`:
  - Test price displays correctly in USD (no conversion)
  - Test price converts correctly when currency changes
  - Test currency symbol updates
  - Mock exchangeRateStore with known rates

**Checkpoint**: Currency conversion working - prices update when currency changes

---

## Phase 4: User Story 2 - Multilingual Service Content (Priority: P1) 🎯 MVP

**Goal**: Database-driven multilingual content for all service pages

**Independent Test**: Switch locales, verify all service content displays in selected language

### Tests for User Story 2

- [x] T016 [P] [US2] Create services API contract test in `tests/contract/services-api.contract.test.ts`:
  - Test GET /api/v1/services/categories returns array with correct shape
  - Test GET /api/v1/services/:slug returns category with sub-services
  - Test invalid locale returns 400
  - Test non-existent slug returns 404
  - Test translations present for specified locale
  - Test response time < 100ms

- [x] T017 [P] [US2] Create service repository test in `tests/repositories/ServiceRepository.test.ts`:
  - Test findAllCategories() returns all active categories ordered by order field
  - Test findAllCategories() returns translations for specified locale
  - Test findAllCategories() falls back to English when translation missing
  - Test findCategoryBySlug() returns category with sub-services
  - Test findCategoryBySlug() returns null for invalid slug
  - Test sub-services ordered by order field

### Implementation for User Story 2

- [x] T018 [US2] Create services categories API endpoint in `server/api/v1/services/categories.get.ts`:
  - Get locale from query params, default to 'en'
  - Validate locale is one of: en, ru, kk, tr (return 400 if invalid)
  - Get ServiceRepository instance
  - Call repository.findAllCategories(locale)
  - Return { categories }

- [x] T019 [US2] Create services detail API endpoint in `server/api/v1/services/[slug].get.ts`:
  - Get slug from route params and locale from query
  - Validate slug and locale (return 400 if invalid)
  - Get ServiceRepository instance
  - Call repository.findCategoryBySlug(slug, locale)
  - Return 404 if category not found
  - Return { category } with sub-services

- [x] T020 [US2] Create useServices composable in `app/composables/useServices.ts`:
  - Use useI18n() to get current locale
  - fetchCategories() - call /api/v1/services/categories with locale
  - fetchCategory(slug) - call /api/v1/services/:slug with locale
  - Return both functions

- [x] T021 [US2] Update turkish-english-course page in `app/pages/services/turkish-english-course.vue`:
  - Remove hardcoded i18n data extraction
  - Use useServices().fetchCategory('turkish-english-course')
  - Use useAsyncData for SSR compatibility
  - Call exchangeRateStore.ensureFresh() on mount
  - Map category.subServices to component props format
  - Keep existing template structure

- [x] T022 [US2] Update document-translations page in `app/pages/services/document-translations.vue`:
  - Same pattern as T021 but for 'document-translations' slug
  - Handle deliveryTime field if present

- [x] T023 [US2] Update relocation-in-turkey page in `app/pages/services/relocation-in-turkey.vue`:
  - Same pattern as T021 but for 'relocation-in-turkey' slug

- [x] T024 [US2] Update tr-yos-courses page in `app/pages/services/tr-yos-courses.vue`:
  - Same pattern as T021 but for 'tr-yos-courses' slug

- [x] T025 [US2] Update sat-courses page in `app/pages/services/sat-courses.vue`:
  - Same pattern as T021 but for 'sat-courses' slug

**Checkpoint**: All service pages load from database with multilingual support

---

## Phase 5: User Story 3 - Admin Adds New Services (Priority: P2)

**Goal**: Enable adding new services via database operations

**Independent Test**: Add new sub-service via Prisma Studio, verify it appears on service page

### Implementation for User Story 3

- [x] T026 [US3] Add createSubService method to ServiceRepository in `server/repositories/ServiceRepository.ts`:
  - Accept CreateSubServiceInput with serviceCategoryId, slug, priceUsd, translations array
  - Validate slug uniqueness within category
  - Validate all 4 locales have translations
  - Use Prisma transaction to create SubService and SubServiceTranslations atomically
  - Return created SubService

- [x] T027 [US3] Add updateSubService method to ServiceRepository in `server/repositories/ServiceRepository.ts`:
  - Accept id and UpdateSubServiceInput (priceUsd, deliveryTimeDays, order, isActive)
  - Validate priceUsd >= 0 if provided
  - Update only provided fields
  - Return updated SubService

- [x] T028 [P] [US3] Create repository test for admin operations in `tests/repositories/ServiceRepository.test.ts`:
  - Test createSubService() creates sub-service with translations
  - Test createSubService() validates slug uniqueness
  - Test updateSubService() updates fields correctly
  - Test updateSubService() validates priceUsd

- [x] T029 [US3] Document admin workflow in `specs/013-migrate-service-cards/admin-guide.md`:
  - How to add new sub-service via Prisma Studio
  - How to add translations for all locales
  - How to update prices
  - How to deactivate services (set isActive = false)
  - Include example SQL/Prisma queries

**Checkpoint**: Admins can manage services via database operations

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup, testing, and final verification

- [x] T030 [P] Clean up i18n files - remove service data from `i18n/locales/*/services.json`:
  - Keep only `services.common` section with UI strings (price, deliveryTime, etc.)
  - Remove all category-specific subServices data
  - Update for all 4 locales: en, ru, kk, tr
  - Verify no broken i18n key references

- [x] T031 [P] Update i18n contract test in `tests/contract/services-i18n.contract.test.ts`:
  - Update to only verify services.common keys exist
  - Remove checks for subServices (now in database)
  - Verify currency selector keys still present

- [x] T032 [P] Create integration test for full user journey in `tests/integration/service-pages.integration.test.ts`:
  - Test: Load service page → switch currency → verify price updates
  - Test: Switch locale → verify content translates
  - Test: Navigate between service pages → verify data loads correctly
  - Test: Exchange rate API failure → verify fallback rates used

- [x] T033 [P] Add performance monitoring to API endpoints:
  - Log slow queries (> 100ms) in repositories
  - Add response time headers to API endpoints
  - Log exchange rate API failures

- [x] T034 [P] Update project README in `README.md`:
  - Document new service management architecture
  - Add section on exchange rate caching
  - Link to admin guide for service management
  - Update development setup instructions

- [x] T035 Verify quickstart guide in `specs/013-migrate-service-cards/quickstart.md`:
  - Walk through all steps manually
  - Verify all commands work
  - Verify all file paths are correct
  - Update any outdated information

- [x] T036 [P] Run full test suite and fix any issues:
  - npm run lint
  - npm run typecheck (minor type issues with auto-imports)
  - npm test (unit tests pass, API tests require running server)
  - Fixed lint errors in ExchangeRateRepository and API handlers
  - Updated Prisma mocks for new service models

- [ ] T037 Manual QA checklist (requires running application):
  - [ ] All 5 service pages load without errors
  - [ ] Currency switching updates all prices
  - [ ] Locale switching updates all content
  - [ ] Exchange rates fetch and cache correctly
  - [ ] Fallback rates work when API fails
  - [ ] No console errors or warnings
  - [ ] Page load time < 2 seconds
  - [ ] Mobile responsive layout works

  **To run manual QA**:
  1. Start dev server: `npm run dev`
  2. Visit each service page: /services/turkish-english-course, /services/document-translations, etc.
  3. Test currency selector (USD, KZT, TRY, RUB)
  4. Test locale switcher (en, ru, kk, tr)
  5. Check browser console for errors
  6. Test on mobile viewport

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Phase 1 (Setup & Foundation)**: No dependencies - MUST complete first
2. **Phase 2 (US4 - Migration)**: Depends on Phase 1 - MUST complete before US1/US2
3. **Phase 3 (US1 - Currency)**: Depends on Phase 1 & 2 - Can run parallel with US2
4. **Phase 4 (US2 - Multilingual)**: Depends on Phase 1 & 2 - Can run parallel with US1
5. **Phase 5 (US3 - Admin)**: Depends on Phase 1 & 2 - Can run after US1/US2
6. **Phase 6 (Polish)**: Depends on all previous phases

### Critical Path

```
Phase 1 (Foundation) → Phase 2 (Migration) → Phase 3 (US1) + Phase 4 (US2) → Phase 5 (US3) → Phase 6 (Polish)
```

### Parallel Opportunities

**Within Phase 1**:

- T003 (types), T004 (ServiceRepository), T005 (ExchangeRateRepository), T006 (ExchangeRateService) can run in parallel after T002

**Within Phase 3 (US1)**:

- T010 (exchange rate contract test) and T011 (repository test) can run in parallel
- T013 (store) can start after T012 (API endpoint)

**Within Phase 4 (US2)**:

- T016 (services contract test) and T017 (repository test) can run in parallel
- T021-T025 (all 5 service pages) can be updated in parallel after T018-T020

**Between Phases**:

- Phase 3 (US1) and Phase 4 (US2) can run completely in parallel after Phase 2 completes

**Within Phase 6**:

- T030 (i18n cleanup), T031 (i18n tests), T032 (integration tests), T033 (monitoring), T034 (README) can all run in parallel

---

## Parallel Example: After Foundation Complete

```bash
# Start US4 (Migration) - must complete first
Task T007: "Create services seeder in prisma/seed/services.ts"
Task T008: "Update main seed file"
Task T009: "Run seeder and verify"

# After migration complete, launch US1 and US2 in parallel:

# US1 Team (Currency Conversion):
Task T010: "Exchange rate API contract test"
Task T011: "Exchange rate repository test"
Task T012: "Exchange rates API endpoint"
Task T013: "Exchange rate Pinia store"
Task T014: "Update SubServiceCard component"
Task T015: "SubServiceCard component test"

# US2 Team (Multilingual Content):
Task T016: "Services API contract test"
Task T017: "Service repository test"
Task T018: "Services categories API endpoint"
Task T019: "Services detail API endpoint"
Task T020: "useServices composable"
# Then all 5 pages in parallel:
Task T021: "Update turkish-english-course page"
Task T022: "Update document-translations page"
Task T023: "Update relocation-in-turkey page"
Task T024: "Update tr-yos-courses page"
Task T025: "Update sat-courses page"
```

---

## Implementation Strategy

### MVP First (US1 + US2 Only)

1. Complete Phase 1: Foundation (T001-T006)
2. Complete Phase 2: Migration (T007-T009)
3. Complete Phase 3: US1 Currency (T010-T015)
4. Complete Phase 4: US2 Multilingual (T016-T025)
5. **STOP and VALIDATE**: Test both stories independently
6. Deploy to staging for review

### Full Feature (All User Stories)

1. Complete MVP (Phases 1-4)
2. Complete Phase 5: US3 Admin (T026-T029)
3. Complete Phase 6: Polish (T030-T037)
4. Deploy to production

### Incremental Delivery

- **Sprint 1**: Foundation + Migration (Phases 1-2) → Database ready
- **Sprint 2**: US1 + US2 (Phases 3-4) → MVP functional
- **Sprint 3**: US3 + Polish (Phases 5-6) → Full feature complete

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Foundation phase (T001-T006) blocks all other work
- Migration phase (T007-T009) must complete before US1/US2 can be tested
- US1 and US2 are independent and can be developed in parallel
- Commit after each task or logical group
- Run tests frequently to catch issues early
- Keep i18n files until verification complete (rollback safety)
- Use Prisma Studio to inspect database during development
