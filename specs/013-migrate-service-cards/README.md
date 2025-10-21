# Service Cards Migration - Implementation Plan

**Branch**: `013-migrate-service-cards`  
**Status**: Planning Complete - Ready for Implementation  
**Estimated Effort**: 26 hours (3-4 days)

## Overview

Migrate service card data from i18n JSON files to database with multi-locale translations, USD-based pricing, and dynamic currency conversion via external API.

## Documentation Structure

```
specs/013-migrate-service-cards/
├── README.md                    # This file - overview and navigation
├── spec.md                      # Feature specification with user stories
├── plan.md                      # Implementation plan with technical context
├── research.md                  # Phase 0: API selection, schema design, risks
├── data-model.md                # Phase 1: Entity definitions and relationships
├── quickstart.md                # Phase 1: Step-by-step implementation guide
└── contracts/
    ├── api-contracts.md         # API endpoint contracts and types
    └── repository-contracts.md  # Repository method contracts and tests
```

## Quick Navigation

### For Product/Business

- **User Stories**: See `spec.md` → User Scenarios & Testing
- **Success Criteria**: See `spec.md` → Success Criteria
- **Timeline**: 3-4 days development + testing

### For Developers

- **Getting Started**: Read `quickstart.md` for step-by-step guide
- **Database Schema**: See `data-model.md` → Entity Definitions
- **API Contracts**: See `contracts/api-contracts.md`
- **Repository Contracts**: See `contracts/repository-contracts.md`

### For Architects

- **Technical Decisions**: See `research.md` → Research Questions
- **Architecture**: See `plan.md` → Technical Context
- **Data Model**: See `data-model.md` → ERD and relationships

## Key Decisions

| Decision            | Choice                  | Rationale                                                               |
| ------------------- | ----------------------- | ----------------------------------------------------------------------- |
| Exchange Rate API   | exchangerate-api.io     | Best free tier (1,500 req/month), sufficient for hourly updates         |
| Currency Conversion | Client-side             | User preference in localStorage, instant switching, reduced server load |
| Base Currency       | USD                     | Standard for international pricing, simplifies conversion logic         |
| Cache Duration      | 1 hour                  | Balances freshness with API rate limits                                 |
| Translation Pattern | `*_translations` tables | Consistent with existing University/Blog patterns                       |
| Metadata Storage    | JSON field              | Flexible for category-specific content without schema changes           |

## Implementation Phases

### ✅ Phase 0: Research (Complete)

- Exchange rate API evaluation
- Database schema design
- Migration strategy planning
- Risk assessment

### ✅ Phase 1: Design (Complete)

- Entity relationship diagram
- API endpoint contracts
- Repository method contracts
- Step-by-step implementation guide

### 🔄 Phase 2: Tasks (Next)

Run `/tasks` command to generate actionable task breakdown

### ⏳ Phase 3: Implementation (Pending)

Run `/implement` command to execute tasks

## Architecture Summary

**Data Flow**:

```
i18n JSON (Russian)
    ↓ (one-time migration)
Database (4 tables)
    ↓ (API endpoints)
Client (Pinia stores)
    ↓ (reactive conversion)
UI Components
```

**New Components**:

- 4 Prisma models (ServiceCategory, ServiceCategoryTranslation, SubService, SubServiceTranslation, ExchangeRate)
- 2 Repositories (ServiceRepository, ExchangeRateRepository)
- 1 Service (ExchangeRateService)
- 3 API endpoints (/api/v1/services/categories, /api/v1/services/:slug, /api/v1/exchange-rates)
- 1 Pinia store (exchangeRates)
- 1 Composable (useServices)
- 1 Seeder script (services.ts)

**Modified Components**:

- Service pages (5 files) - fetch from API instead of i18n
- SubServiceCard.vue - dynamic currency conversion
- i18n JSON files (4 locales) - remove service data, keep common UI strings

## Testing Strategy

**Coverage Goals**:

- Repositories: 90%+
- Services: 90%+
- Composables: 80%+
- Components: 70%+

**Test Layers**:

1. Contract tests - API response shapes
2. Repository tests - Data access logic
3. Component tests - UI rendering and interaction
4. Integration tests - End-to-end flows

## Migration Safety

**Zero Downtime Strategy**:

1. Add database tables (non-breaking)
2. Seed data from i18n
3. Add API endpoints (unused initially)
4. Update pages to use API
5. Verify all functionality
6. Clean up i18n files
7. Remove old code paths

**Rollback Plan**:

- Keep i18n files until verification complete
- Database migration can be rolled back
- Git revert for code changes
- Feature flag for switching between implementations

## Success Metrics

- [ ] All 5 service categories load in all 4 locales
- [ ] Currency conversion accurate within 1%
- [ ] Exchange rate API calls < 24/day (hourly cache)
- [ ] Page load time < 2 seconds
- [ ] Zero data loss during migration
- [ ] i18n files reduced by 80%+
- [ ] All tests passing
- [ ] No console errors in production

## Next Steps

1. **Generate Tasks**: Run `/tasks` to create detailed task breakdown
2. **Review Tasks**: Verify task dependencies and estimates
3. **Start Implementation**: Run `/implement` or execute tasks manually
4. **Test Thoroughly**: Run test suite after each phase
5. **Deploy to Staging**: Verify in staging environment
6. **Production Deploy**: Deploy with monitoring

## Support

**Questions?**

- Technical: Review `data-model.md` and `contracts/`
- Implementation: Follow `quickstart.md` step-by-step
- Issues: Check `research.md` → Technical Risks & Mitigations

**Resources**:

- Prisma Docs: https://www.prisma.io/docs
- exchangerate-api.io: https://www.exchangerate-api.com/docs
- Nuxt Docs: https://nuxt.com/docs
- Pinia Docs: https://pinia.vuejs.org
