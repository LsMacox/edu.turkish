# Implementation Plan: Migrate Service Cards to Database

**Branch**: `013-migrate-service-cards` | **Date**: 2025-01-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/013-migrate-service-cards/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Migrate service card data from i18n JSON files to database with multi-locale translations. Store prices in USD, fetch real-time exchange rates via API, and convert dynamically on client based on user's selected currency. Remove obsolete i18n entries after migration. Seed existing Russian locale data and enable future service additions through database operations.

**Core Goals**:
- Database-driven service content with `*_translations` pattern
- USD base pricing with dynamic currency conversion (KZT, TRY, RUB, USD)
- External exchange rate API integration with caching
- Zero data loss migration from i18n to database
- Maintain backward compatibility with existing currency store

## Technical Context

**Language/Version**: TypeScript 5.9, Node.js (via Nuxt 4.1)  
**Primary Dependencies**: Nuxt 4, Prisma 6.16, Pinia 3, Vue 3.5, @nuxtjs/i18n 10.1  
**Storage**: MySQL (via Prisma ORM)  
**Testing**: Vitest 3.2.4, @nuxt/test-utils, @testing-library/vue  
**Target Platform**: SSR web application (server + client)
**Project Type**: Web application (Nuxt full-stack)  
**Performance Goals**: <2s page load, <100ms API response, exchange rate cache 1hr+  
**Constraints**: Zero downtime migration, backward compatible currency store, SEO-friendly SSR  
**Scale/Scope**: 5 service categories, ~20 sub-services, 4 locales (en/ru/kk/tr), ~1000 daily visitors

**Architecture Patterns**:
- Repository pattern for data access (`server/repositories/`)
- Pinia stores for client state (`app/stores/`)
- Nuxt auto-imports for components and composables
- API routes in `server/api/` with type safety
- Prisma schema with `*_translations` tables
- Alias imports: `~` (app), `~~` (root), `@` (app)

**Existing Currency System**:
- `useCurrencyStore()` - Pinia store with localStorage persistence
- `useCurrency()` - Composable with formatting utilities
- `Currency` type: 'KZT' | 'TRY' | 'RUB' | 'USD'
- Current pricing: hardcoded in i18n JSON per currency

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Status**: ✅ PASS (Constitution file is template-only, no specific gates defined)

**Alignment with Project Standards**:
- ✅ Repository pattern for data access (existing pattern)
- ✅ Pinia stores for state management (existing pattern)
- ✅ Type safety with TypeScript (existing requirement)
- ✅ Prisma migrations for schema changes (existing workflow)
- ✅ Vitest for testing (existing framework)
- ✅ ESLint + Prettier for code quality (existing tooling)
- ✅ i18n multi-locale support (existing capability)

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
app/                              # Client-side code
├── components/
│   ├── features/
│   │   └── services/            # Service-related components
│   │       ├── SubServiceCard.vue
│   │       └── CurrencyPrice.vue
│   └── layout/
├── composables/
│   ├── useCurrency.ts           # Currency formatting utilities
│   └── useServices.ts           # NEW: Service data fetching
├── pages/
│   └── services/                # Service category pages
│       ├── document-translations.vue
│       ├── relocation-in-turkey.vue
│       ├── tr-yos-courses.vue
│       ├── sat-courses.vue
│       └── turkish-english-course.vue
├── stores/
│   ├── currency.ts              # Existing currency store
│   └── exchangeRates.ts         # NEW: Exchange rate cache
└── types/
    ├── currency.ts              # Existing currency types
    └── services.ts              # Existing service types

server/                           # Server-side code
├── api/
│   └── v1/
│       ├── services/            # NEW: Service endpoints
│       │   ├── categories.get.ts
│       │   └── [slug].get.ts
│       └── exchange-rates/      # NEW: Exchange rate endpoints
│           └── index.get.ts
├── repositories/
│   ├── ServiceRepository.ts     # NEW: Service data access
│   └── ExchangeRateRepository.ts # NEW: Rate data access
├── services/
│   └── ExchangeRateService.ts   # NEW: External API integration
├── types/
│   └── api/
│       └── services.ts          # NEW: Service API types
└── utils/
    └── currency.ts              # NEW: Server-side currency utilities

prisma/
├── schema.prisma                # Database schema (updated)
├── migrations/                  # NEW: Service tables migration
└── seed/
    └── services.ts              # NEW: Service data seeder

i18n/locales/                    # Locale files (cleaned up)
├── en/services.json             # Reduced to common UI strings
├── ru/services.json
├── kk/services.json
└── tr/services.json

tests/
├── components/
│   └── features/
│       └── services/            # Component tests
├── composables/
│   ├── useCurrency.test.ts      # Existing tests (updated)
│   └── useServices.test.ts      # NEW: Service composable tests
├── contract/
│   └── services-api.contract.test.ts # NEW: API contract tests
└── repositories/
    └── ServiceRepository.test.ts # NEW: Repository tests
```

**Structure Decision**: Nuxt full-stack web application with clear separation:
- **Client**: `app/` for UI components, pages, composables, and stores
- **Server**: `server/` for API routes, repositories, and business logic
- **Database**: `prisma/` for schema and migrations
- **Tests**: `tests/` mirroring source structure with contract, integration, and unit tests

## Complexity Tracking

_No violations detected - all patterns align with existing architecture._

---

## Progress Tracking

### Phase 0: Research ✅ COMPLETE
- **Output**: `research.md`
- Exchange rate API selection, schema design, migration strategy, testing approach

### Phase 1: Design ✅ COMPLETE
- **Outputs**: `data-model.md`, `contracts/api-contracts.md`, `contracts/repository-contracts.md`, `quickstart.md`
- Entity definitions, API contracts, repository contracts, implementation guide

### Phase 2: Tasks (Next Step)
- **Output**: `tasks.md` (created via `/tasks` command)
- Actionable task breakdown with dependencies and estimates
