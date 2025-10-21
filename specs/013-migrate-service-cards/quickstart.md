# Quickstart Guide - Service Cards Migration

**Feature**: Migrate Service Cards to Database with Translations and Dynamic Currency  
**Date**: 2025-01-14  
**Estimated Time**: 3-4 days

## Implementation Phases

### Phase 1: Database Schema (2 hours)

1. Update `prisma/schema.prisma` with 4 new models
2. Run migration: `npm run db:migrate`
3. Generate Prisma client: `npx prisma generate`

### Phase 2: Repositories & Services (6 hours)

1. Create `ServiceRepository.ts` with findAllCategories, findCategoryBySlug
2. Create `ExchangeRateRepository.ts` with getCurrentRates, updateRates
3. Create `ExchangeRateService.ts` for external API integration
4. Create API types in `server/types/api/services.ts`

### Phase 3: API Endpoints (2 hours)

1. Create `server/api/v1/services/categories.get.ts`
2. Create `server/api/v1/services/[slug].get.ts`
3. Create `server/api/v1/exchange-rates/index.get.ts`
4. Test endpoints with curl/Postman

### Phase 4: Seeder Script (3 hours)

1. Create `prisma/seed/services.ts`
2. Parse Russian i18n data and seed database
3. Run seeder: `npm run db:seed`
4. Verify data in Prisma Studio

### Phase 5: Client Integration (7 hours)

1. Create `app/stores/exchangeRates.ts` for rate caching
2. Create `app/composables/useServices.ts` for data fetching
3. Update service pages to use database API
4. Update `SubServiceCard.vue` for dynamic conversion
5. Test currency switching and price display

### Phase 6: Testing (6 hours)

1. Write repository tests
2. Write API contract tests
3. Write component tests
4. Run full test suite: `npm test`

### Phase 7: i18n Cleanup (2 hours)

1. Remove service data from i18n JSON files
2. Keep only common UI strings
3. Update i18n contract tests
4. Verify no broken references

### Phase 8: Documentation & Deployment (2 hours)

1. Update README with new architecture
2. Document API endpoints
3. Create migration guide
4. Deploy to staging and verify

## Quick Reference

**Key Files**:

- Schema: `prisma/schema.prisma`
- Repositories: `server/repositories/ServiceRepository.ts`
- API: `server/api/v1/services/*.ts`
- Seeder: `prisma/seed/services.ts`
- Store: `app/stores/exchangeRates.ts`
- Composable: `app/composables/useServices.ts`

**Commands**:

```bash
npm run db:migrate      # Create migration
npm run db:seed         # Seed database
npm run db:studio       # View database
npm test                # Run tests
npm run dev             # Start dev server
```

**API Endpoints**:

- GET `/api/v1/services/categories?locale=ru`
- GET `/api/v1/services/turkish-english-course?locale=ru`
- GET `/api/v1/exchange-rates`

**Verification Checklist**:

- [ ] All 5 categories seeded with Russian translations
- [ ] ~20 sub-services seeded with USD prices
- [ ] Exchange rates fetching from API
- [ ] Service pages load from database
- [ ] Currency conversion working correctly
- [ ] All tests passing
- [ ] i18n files cleaned up
- [ ] No console errors

See `data-model.md`, `api-contracts.md`, and `repository-contracts.md` for detailed specifications.
