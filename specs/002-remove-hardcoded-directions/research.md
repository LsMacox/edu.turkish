# Research: Remove Hardcoded Study Directions

**Date**: 2025-10-03  
**Feature**: Remove hardcoded `directions.ts` and migrate to database-driven approach

## Research Tasks

### 1. Current State Analysis

**Question**: What direction slugs are currently hardcoded and which are actually used?

**Findings**:

- **Hardcoded count**: 60 directions in `app/types/directions.ts` (ALL_DIRECTIONS array)
- **Actually used**: ~25 unique direction slugs referenced via `direction_slug` field in university JSON files
- **University files**: 19 JSON files in `app/assets/json/universities/`
- **Translation files**: 4 i18n files (`i18n/locales/{en,ru,kk,tr}/directions.json`) - each with 58 entries

**Decision**: Scan all university JSON files to extract unique `direction_slug` values. Only seed these directions to avoid bloating the database with unused data.

**Rationale**: Minimalist approach - only store what's actually needed. Reduces maintenance burden and query overhead.

---

### 2. Database Schema Review

**Question**: Do the existing Prisma tables support all required functionality?

**Findings**:

- ✅ `study_directions` table exists with auto-increment ID, timestamps
- ✅ `study_direction_translations` table exists with:
  - `directionId` (foreign key)
  - `locale` (varchar 5)
  - `name` (varchar 255)
  - `description` (text, nullable)
  - `slug` (varchar 255)
  - Unique constraint on `[directionId, locale]`
  - Unique constraint on `[locale, slug]` for SEO
- ✅ `university_pivot_study_directions` table exists for many-to-many relationship
- ✅ Import script (`scripts/import-university.ts`) already has `ensureDirectionAndTranslation()` function that creates directions on-demand

**Decision**: No schema changes needed. Use existing tables as-is.

**Rationale**: Tables already support the full feature set. Avoid unnecessary migrations.

---

### 3. Seed Data Strategy

**Question**: How should the seed data be structured and loaded?

**Findings**:

- Current seed files use a pattern: `prisma/seed/*.ts` imported by `seed/seed.ts`
- Existing seeders: `locations.ts`, `faqs.ts`, `faq-categories.ts`, `reviews.ts`, `blog.ts`
- Seed order matters due to foreign key constraints
- Directions should be seeded BEFORE universities (if universities reference them)

**Decision**: Create `prisma/seed/study-directions.ts` with:

1. Scan function to extract unique slugs from university JSONs
2. Translation data structure (en, ru, kk, tr) for each direction
3. Upsert logic to avoid duplicates
4. Integration into main `seed.ts` file

**Rationale**: Follows existing seed pattern. Single source of truth (university JSONs determine which directions exist).

**Alternatives Considered**:

- Manual list: Rejected - prone to drift from actual usage
- Seed all 60: Rejected - includes unused directions

---

### 4. Type System Migration

**Question**: How to handle TypeScript types after removing `DirectionSlug`?

**Findings**:

- `DirectionSlug` type is used in:
  - `app/types/directions.ts` (definition)
  - `app/assets/json/universities/types.ts` (import for `ProgramItem.direction_slug`)
  - `scripts/import-university.ts` (validation with Zod)
- After removal, need runtime validation but not compile-time type

**Decision**:

1. Remove `DirectionSlug` type and `ALL_DIRECTIONS` constant
2. In `types.ts`: Change `direction_slug?: DirectionSlug` to `direction_slug?: string`
3. In `import-university.ts`: Remove DirectionSlug import and Zod enum validation
4. Rely on database uniqueness constraints instead of TypeScript enum

**Rationale**: Database is now the source of truth. Runtime validation via foreign key constraints is sufficient.

**Alternatives Considered**:

- Keep type, generate from DB: Rejected - adds complexity, build-time DB query
- No type at all: Accepted - simpler, DB enforces validity

---

### 5. Translation Migration

**Question**: How to migrate translations from i18n JSON files to database?

**Findings**:

- Current i18n files: `i18n/locales/{locale}/directions.json`
- Format: `{ "slug": "Translated Name", ... }`
- Import script already reads from `i18n/directions.json` at repo root (but this file doesn't exist - it tries to fallback)
- Actually uses translations embedded in `getDirectionNames()` function

**Decision**:

1. Create translation map in seed file using existing i18n JSON data as source
2. Structure: `{ [slug]: { en: "...", ru: "...", kk: "...", tr: "..." } }`
3. After seed runs successfully, delete i18n direction JSON files
4. Update import script to remove references to `i18n/directions.json`

**Rationale**: Preserve existing translations, ensure no data loss during migration.

---

### 6. Import Script Updates

**Question**: What changes are needed in `scripts/import-university.ts`?

**Findings**:

- Line 22: Imports `DirectionSlug` and `ALL_DIRECTIONS`
- Line 27: Creates Zod enum from `ALL_DIRECTIONS`
- Line 42, 225: Uses `DirectionSlug` type
- Lines 540-595: Has `ensureDirectionAndTranslation()` function - already DB-driven!
- Lines 582-594: Loads from `i18n/directions.json` (will fail after we delete it)

**Decision**:

1. Remove imports of `DirectionSlug` and `ALL_DIRECTIONS`
2. Change Zod validation from enum to simple string
3. Remove `getDirectionNames()` function and i18n file reading logic
4. Keep `ensureDirectionAndTranslation()` but simplify it to not rely on fallback names

**Rationale**: Simplify import script. Direction names must exist in DB before import (via seed).

---

## Summary

All research complete. No blockers found.

**Key Decisions**:

1. ✅ No database schema changes needed
2. ✅ Create seed file scanning university JSONs for used directions
3. ✅ Remove TypeScript types, rely on database validation
4. ✅ Migrate i18n translations to seed data structure
5. ✅ Simplify import script

**Ready for Phase 1**: Design data model and create seed structure.
