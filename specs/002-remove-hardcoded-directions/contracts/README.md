# API Contracts

**Feature**: Remove Hardcoded Study Directions

## Overview

This feature is primarily a **backend refactor** with no new API endpoints. The existing endpoints that return direction data will continue to work, but will now fetch from the database instead of hardcoded files.

## Affected Endpoints

### No New Endpoints

This refactor does not introduce new API endpoints. It modifies the data source for existing functionality.

### Potentially Affected Endpoints

If there are existing endpoints that return study directions or university data with directions, they will continue to work with the same contracts but different data sources:

**Example (if exists)**:

```
GET /api/v1/universities?direction={slug}
GET /api/v1/directions
```

These endpoints (if they exist) would:

- Previously: Read from `app/types/directions.ts` or i18n JSON files
- Now: Query `study_directions` and `study_direction_translations` tables via repository

## Data Contracts

### StudyDirection Response (Expected Format)

```typescript
interface StudyDirectionResponse {
  id: number
  slug: string // locale-specific slug
  name: string // locale-specific name
  description?: string // locale-specific description
}
```

### University with Directions (Existing Format)

```typescript
interface UniversityResponse {
  id: number
  // ... other university fields
  directions: StudyDirectionResponse[]
}
```

## Contract Validation

Since this is a refactor without new endpoints, the key validation is:

✅ **Data Shape Consistency**: Response formats must remain identical  
✅ **Slug Continuity**: Direction slugs must match previous hardcoded values  
✅ **Translation Completeness**: All 4 locales (en, ru, kk, tr) must be available  
✅ **Query Compatibility**: Existing filters/queries must continue to work

## Testing Approach

1. **Integration Tests**: Query existing endpoints before and after refactor - responses should match
2. **Seed Validation**: Ensure seeded data matches hardcoded data structure
3. **Type Compatibility**: TypeScript compilation should succeed after type removal

## Notes

- No breaking changes expected
- No API versioning needed
- No OpenAPI schema updates needed (internal refactor only)
- Frontend code should not require changes (same data contracts)
