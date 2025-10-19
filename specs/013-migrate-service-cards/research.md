# Phase 0: Research - Service Cards Migration

**Feature**: Migrate Service Cards to Database with Translations and Dynamic Currency  
**Date**: 2025-01-14  
**Status**: Complete

## Research Questions

### 1. Exchange Rate API Selection

**Question**: Which exchange rate API should we use for real-time currency conversion?

**Options Evaluated**:

| API | Free Tier | Rate Limits | Currencies | Latency | Reliability |
|-----|-----------|-------------|------------|---------|-------------|
| exchangerate-api.io | 1,500 req/month | 50 req/day | All major | ~200ms | High |
| fixer.io | 100 req/month | Limited | 170+ | ~150ms | High |
| currencyapi.com | 300 req/month | 10 req/day | 150+ | ~180ms | Medium |
| Open Exchange Rates | 1,000 req/month | Unlimited | 200+ | ~250ms | High |

**Recommendation**: **exchangerate-api.io**
- **Rationale**: Best free tier (1,500 requests), sufficient for hourly updates (720/month)
- **Endpoint**: `https://api.exchangerate-api.io/v4/latest/USD`
- **Response format**: JSON with all conversion rates from USD base
- **Caching strategy**: Cache for 1 hour, fallback to last known rates on failure

**Fallback Rates** (hardcoded, updated quarterly):
```typescript
const FALLBACK_RATES = {
  KZT: 450.0,  // 1 USD = 450 KZT
  TRY: 32.0,   // 1 USD = 32 TRY
  RUB: 90.0,   // 1 USD = 90 RUB
  USD: 1.0,
}
```

### 2. Database Schema Design

**Question**: How should we structure service tables to support translations and future extensibility?

**Design Principles**:
- Follow existing `*_translations` pattern (UniversityTranslation, etc.)
- Separate category metadata from sub-service data
- Store only USD prices in database
- Support optional fields (deliveryTimeDays, metadata JSON)
- Enable soft deletes with `isActive` flag

**Schema Decision**:

```prisma
model ServiceCategory {
  id           Int      @id @default(autoincrement())
  slug         String   @unique @db.VarChar(100)
  order        Int      @default(0)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  translations ServiceCategoryTranslation[]
  subServices  SubService[]
  
  @@map("service_categories")
  @@index([slug])
  @@index([isActive, order])
}

model ServiceCategoryTranslation {
  id                Int      @id @default(autoincrement())
  serviceCategoryId Int
  locale            String   @db.VarChar(5)
  title             String   @db.VarChar(255)
  subtitle          String?  @db.Text
  slug              String   @db.VarChar(255)
  metadata          Json?    // Page-specific content (FAQ, features, etc.)
  
  serviceCategory   ServiceCategory @relation(fields: [serviceCategoryId], references: [id], onDelete: Cascade)
  
  @@unique([serviceCategoryId, locale])
  @@map("service_category_translations")
  @@index([locale])
}

model SubService {
  id                Int      @id @default(autoincrement())
  serviceCategoryId Int
  slug              String   @db.VarChar(100)
  priceUsd          Decimal  @db.Decimal(10, 2)
  deliveryTimeDays  Int?
  order             Int      @default(0)
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  serviceCategory   ServiceCategory @relation(fields: [serviceCategoryId], references: [id], onDelete: Cascade)
  translations      SubServiceTranslation[]
  
  @@unique([serviceCategoryId, slug])
  @@map("sub_services")
  @@index([serviceCategoryId, isActive, order])
}

model SubServiceTranslation {
  id           Int      @id @default(autoincrement())
  subServiceId Int
  locale       String   @db.VarChar(5)
  name         String   @db.VarChar(255)
  description  String   @db.Text
  
  subService   SubService @relation(fields: [subServiceId], references: [id], onDelete: Cascade)
  
  @@unique([subServiceId, locale])
  @@map("sub_service_translations")
  @@index([locale])
}

model ExchangeRate {
  id             Int      @id @default(autoincrement())
  baseCurrency   String   @db.VarChar(3) @default("USD")
  targetCurrency String   @db.VarChar(3)
  rate           Decimal  @db.Decimal(12, 6)
  fetchedAt      DateTime @default(now())
  expiresAt      DateTime
  
  @@unique([baseCurrency, targetCurrency])
  @@map("exchange_rates")
  @@index([expiresAt])
}
```

**Rationale**:
- `ServiceCategory` stores fixed categories (document-translations, etc.)
- `ServiceCategoryTranslation.metadata` as JSON for flexible page content
- `SubService.priceUsd` as Decimal for precision
- Unique constraints prevent duplicates
- Indexes optimize common queries (by locale, by category, by active status)

### 3. Migration Strategy

**Question**: How do we migrate existing i18n data without downtime or data loss?

**Migration Phases**:

**Phase 1: Additive Changes**
1. Add new database tables (migration)
2. Seed data from Russian locale i18n
3. Add API endpoints alongside existing pages
4. Deploy with both systems active

**Phase 2: Cutover**
5. Update service pages to use database API
6. Test all locales and currencies
7. Verify no regressions

**Phase 3: Cleanup**
8. Remove service data from i18n JSON (keep common UI strings)
9. Remove old code paths
10. Monitor for issues

**Data Mapping** (Russian locale → Database):

```typescript
// i18n structure
{
  "services": {
    "turkish-english-course": {
      "title": "...",
      "subtitle": "...",
      "subServices": {
        "language-turkish-beginner": {
          "name": "...",
          "description": "...",
          "pricing": {
            "USD": "350",
            "RUB": "35,000",
            "KZT": "180,000",
            "TRY": "6,000"
          }
        }
      }
    }
  }
}

// Database structure
ServiceCategory {
  slug: "turkish-english-course",
  translations: [{
    locale: "ru",
    title: "...",
    subtitle: "...",
    slug: "kursy-turetskogo-i-anglijskogo"
  }]
}

SubService {
  slug: "language-turkish-beginner",
  priceUsd: 350.00,  // Use USD as base
  translations: [{
    locale: "ru",
    name: "...",
    description: "..."
  }]
}
```

**Price Conversion Logic**:
- Extract USD price from i18n as base
- Verify other currencies match expected conversion rates
- Log discrepancies for manual review

### 4. Currency Conversion Architecture

**Question**: Where should currency conversion happen - server or client?

**Decision**: **Client-side conversion**

**Rationale**:
- User's currency preference stored in localStorage (client-only)
- Reduces server load (no per-request conversion)
- Enables instant currency switching without API calls
- Exchange rates cached in Pinia store for performance

**Flow**:
1. Server returns USD prices from database
2. Client fetches exchange rates on mount (cached 1hr)
3. Client converts USD → selected currency reactively
4. Currency changes trigger immediate re-render

**Implementation**:
```typescript
// Composable
const { data: rates } = await useFetch('/api/v1/exchange-rates')
const { currency } = useCurrency()

const convertedPrice = computed(() => {
  const usdPrice = props.priceUsd
  const rate = rates.value[currency.value]
  return usdPrice * rate
})
```

### 5. Testing Strategy

**Question**: How do we ensure zero regressions during migration?

**Test Layers**:

**1. Contract Tests** (`tests/contract/services-api.contract.test.ts`)
- Verify API response shapes match types
- Test all locales return translations
- Validate price conversion accuracy

**2. Repository Tests** (`tests/repositories/ServiceRepository.test.ts`)
- Test data fetching with translations
- Test filtering by category, locale, active status
- Test fallback to English when translation missing

**3. Component Tests** (`tests/components/features/services/`)
- Test SubServiceCard renders prices correctly
- Test currency switching updates prices
- Test missing data edge cases

**4. Integration Tests**
- Test full page load with database data
- Test currency conversion end-to-end
- Test exchange rate caching behavior

**5. Visual Regression**
- Screenshot comparison before/after migration
- Verify no UI changes except improved currency accuracy

**Coverage Goals**:
- 90%+ for repositories and services
- 80%+ for composables
- 70%+ for components

## Technical Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Exchange rate API downtime | High | Low | Fallback rates + 1hr cache + error logging |
| Price conversion inaccuracy | Medium | Low | Unit tests with known rates + manual verification |
| Migration data loss | High | Low | Dry-run seeder + backup i18n files + rollback plan |
| Performance degradation | Medium | Medium | Database indexes + query optimization + caching |
| Translation missing | Low | Medium | Fallback to English + logging + admin alerts |

## Dependencies

**External**:
- exchangerate-api.io (free tier, no API key required for basic usage)

**Internal**:
- Existing Prisma setup
- Existing currency store and composable
- Existing repository pattern
- Existing i18n configuration

**New Packages**: None required (all dependencies already in package.json)

## Performance Considerations

**Database Queries**:
- Eager load translations with `include` to avoid N+1
- Index on `locale`, `serviceCategoryId`, `isActive`
- Expected query time: <50ms for category with 5 sub-services

**Exchange Rate Caching**:
- Client-side Pinia store with 1hr TTL
- Server-side database cache with 1hr TTL
- Reduces API calls from ~1000/day to ~24/day

**Page Load Impact**:
- Additional API call for exchange rates (cached)
- Additional API call for services (replaces i18n parsing)
- Net impact: ~0ms (i18n parsing eliminated)

## Open Questions

**Q1**: Should we support admin UI for managing services, or is database-only sufficient?
**A**: Database-only for MVP. Admin UI can be added later if needed (out of scope).

**Q2**: Should we version the API endpoints?
**A**: Yes, use `/api/v1/services` for future compatibility.

**Q3**: Should we support custom exchange rates per service?
**A**: No, use global rates. Custom rates add complexity without clear use case.

**Q4**: Should we log currency conversion events for analytics?
**A**: Out of scope for MVP. Can add later if business needs arise.

## Conclusion

**Recommendation**: Proceed with implementation using:
- exchangerate-api.io for rates
- Client-side conversion with Pinia caching
- Prisma schema with 4 new tables
- Phased migration (additive → cutover → cleanup)
- Comprehensive test coverage at all layers

**Estimated Effort**: 
- Schema + Migration: 2 hours
- Repositories + Services: 4 hours
- API Endpoints: 2 hours
- Client Composables + Store: 3 hours
- Component Updates: 4 hours
- Seeder + Migration Script: 3 hours
- Tests: 6 hours
- i18n Cleanup: 2 hours
- **Total**: ~26 hours (3-4 days)

**Next Phase**: Data Model & Contracts
