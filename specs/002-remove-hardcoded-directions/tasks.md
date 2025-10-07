# Tasks: Remove Hardcoded Study Directions

**Input**: Design documents from `/home/lsmacox/projects/edu.turkish/specs/002-remove-hardcoded-directions/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)

```
1. Load plan.md from feature directory ✅
   → Tech stack: TypeScript/Nuxt 3/Prisma
   → Structure: Nuxt monorepo (app/, server/, prisma/)
2. Load optional design documents ✅
   → data-model.md: StudyDirection entities (no schema changes)
   → contracts/: No new endpoints (refactor only)
   → research.md: Seed strategy, type migration decisions
3. Generate tasks by category ✅
   → Analysis: Extract direction slugs from JSONs
   → Implementation: Create seed, update scripts
   → Cleanup: Remove hardcoded files
   → Validation: Tests and type checks
4. Apply task rules ✅
   → Different files = [P] for parallel
   → Sequential for interdependent tasks
5. Number tasks sequentially (T001-T014) ✅
6. Generate dependency graph ✅
7. Create parallel execution examples ✅
8. Validate task completeness ✅
   → No new contracts (refactor only)
   → No new entities (tables exist)
   → Constitution: i18n removal, Prisma seed only
9. Return: SUCCESS (14 tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

---

## Phase 3.1: Analysis & Data Extraction

**Goal**: Identify which direction slugs are actually used and gather translation data

- [x] **T001** Scan all university JSON files in `app/assets/json/universities/*.json` to extract unique `direction_slug` values from `programs[]` and `directions[]` arrays. Create a list of ~25 unique slugs. Output to temporary file or console for verification.

- [x] **T002** Load existing i18n translation files (`i18n/locales/{en,ru,kk,tr}/directions.json`) and create a mapping structure: `{ [slug]: { en: "...", ru: "...", kk: "...", tr: "..." } }` for all slugs found in T001. Verify all 4 locales have translations for each slug.

- [x] **T003** Validate data completeness: Ensure every slug from T001 has translations in all 4 locales from T002. Report any missing translations. If any are missing, add placeholder translations or source from existing hardcoded data.

---

## Phase 3.2: Implementation

**Goal**: Create seed file and update dependent code

- [x] **T004** [P] Create `prisma/seed/study-directions.ts` with:
  - Import Prisma client
  - Define `DirectionSeedData` type with slug and translations structure
  - Create array of seed data using results from T001-T003
  - Implement `seedStudyDirections(prisma)` function that:
    - Iterates through seed data
    - For each direction: upserts StudyDirection record
    - For each locale: upserts StudyDirectionTranslation with slug, name, description
  - Export the seeder function
  - File path: `/home/lsmacox/projects/edu.turkish/prisma/seed/study-directions.ts`

- [x] **T005** Update `prisma/seed/seed.ts`:
  - Import `seedStudyDirections` from `./study-directions`
  - Add seeding call BEFORE locations (directions should be seeded early)
  - Add console log: `'📚 Seeding study directions...'`
  - Update deletion order in development mode to include study direction tables
  - File path: `/home/lsmacox/projects/edu.turkish/prisma/seed/seed.ts`

- [x] **T006** [P] Update `scripts/import-university.ts`:
  - Remove import of `DirectionSlug` and `ALL_DIRECTIONS` from line 22
  - Remove `DirectionSlugZ` Zod enum definition (line 27)
  - Change `direction_slug: DirectionSlugZ.optional()` to `direction_slug: z.string().optional()` (line 42)
  - Change `directions: z.array(DirectionSlugZ).optional()` to `directions: z.array(z.string()).optional()` (line 210)
  - Remove `getDirectionNames()` function (lines 582-595) and its cache variable
  - Simplify `ensureDirectionAndTranslation()` to not use fallback i18n file reading
  - Update type guards to use `typeof val === 'string'` instead of enum check
  - File path: `/home/lsmacox/projects/edu.turkish/scripts/import-university.ts`

- [x] **T007** [P] Update `app/assets/json/universities/types.ts`:
  - Remove import of `DirectionSlug` and `ALL_DIRECTIONS` from line 10
  - Change `direction_slug?: DirectionSlug` to `direction_slug?: string` (line 225)
  - Change `directions?: DirectionSlug[]` to `directions?: string[]` (line 320)
  - Remove export of `ALLOWED_DIRECTIONS` (line 333)
  - File path: `/home/lsmacox/projects/edu.turkish/app/assets/json/universities/types.ts`

- [x] **T008** [P] Create test file `tests/seed/study-directions.test.ts`:
  - Import Prisma client and test utilities (Vitest)
  - Test: "should seed all directions from university JSONs"
  - Test: "should create translations for all 4 locales"
  - Test: "should have unique slugs per locale"
  - Test: "should match direction slugs used in university files"
  - Use actual database or mock Prisma client
  - File path: `/home/lsmacox/projects/edu.turkish/tests/seed/study-directions.test.ts`

---

## Phase 3.3: Cleanup

**Goal**: Remove hardcoded files and run seed

- [x] **T009** Remove hardcoded TypeScript file:
- - Delete `app/types/directions.ts`
- Verify no other files import from this path (search codebase for `from.*directions` or `@/types/directions`)
- File path: `/home/lsmacox/projects/edu.turkish/app/types/directions.ts`

- [x] **T010** Remove hardcoded i18n direction files:
  - Delete `i18n/locales/en/directions.json`
  - Delete `i18n/locales/ru/directions.json`
  - Delete `i18n/locales/kk/directions.json`
  - Delete `i18n/locales/tr/directions.json`
  - Verify no code references these files
  - File paths: `/home/lsmacox/projects/edu.turkish/i18n/locales/{en,ru,kk,tr}/directions.json`

- [x] **T011** Run database seed and verify:
  - Execute `npm run db:reset` (or `npm run db:seed` if data should be preserved)
  - Verify console output shows study directions seeded successfully
  - Open Prisma Studio (`npx prisma studio`) and verify:
    - `study_directions` table has ~25 records
    - `study_direction_translations` table has ~100 records (25 × 4)
    - Each direction has all 4 locale translations
  - Test import script: `npx tsx scripts/import-university.ts app/assets/json/universities/istanbul_aydin_university.json`

---

## Phase 3.4: Validation

**Goal**: Ensure everything works without hardcoded files

- [x] **T012** Run TypeScript type check:
  - Execute `npm run typecheck` (or `npx tsc --noEmit`)
  - Verify no compilation errors
  - Verify no import errors for removed `DirectionSlug` type
  - Fix any remaining type issues if found
  - Expected: Clean build with 0 errors

- [ ] **T013** Run all existing tests:
  - Execute `npm run test`
  - Verify all tests pass (including new seed test from T008)
  - If any tests fail due to direction-related changes, update them
  - Expected: All tests green

- [ ] **T014** Execute quickstart manual validation:
  - Follow steps in `specs/002-remove-hardcoded-directions/quickstart.md`
  - Start dev server: `npm run dev`
  - Navigate to universities page and verify direction filters work
  - Check university detail pages show correct directions
  - Test locale switching for direction names (en, ru, kk, tr)
  - Verify no console errors
  - Complete all 8 success criteria checkboxes in quickstart.md

---

## Dependencies

```
T001 → T002 → T003 → T004, T006, T007
         ↓
       T005 (depends on T004)
         ↓
T004, T005, T006, T007, T008 → T009, T010 → T011 → T012 → T013 → T014
```

**Critical Path**: T001 → T002 → T003 → T004 → T005 → T011 → T012 → T013 → T014

**Parallel Opportunities**:

- T004, T006, T007, T008 can run in parallel (different files)
- T009, T010 can run in parallel (different files)

---

## Parallel Execution Examples

### Phase 3.2: Implementation Tasks (After T003)

```bash
# Launch T004, T006, T007, T008 together:
Task: "Create prisma/seed/study-directions.ts with seed data and upsert logic"
Task: "Update scripts/import-university.ts to remove DirectionSlug validation"
Task: "Update app/assets/json/universities/types.ts to use string instead of DirectionSlug"
Task: "Create tests/seed/study-directions.test.ts with seed validation tests"

# Then T005 (depends on T004):
Task: "Update prisma/seed/seed.ts to call seedStudyDirections"
```

### Phase 3.3: Cleanup Tasks

```bash
# Launch T009, T010 together:
Task: "Delete app/types/directions.ts"
Task: "Delete i18n/locales/{en,ru,kk,tr}/directions.json files"
```

---

## Notes

- **[P] tasks** = different files, no dependencies, can run in parallel
- **No new API endpoints** - this is a backend refactor only
- **No schema changes** - tables already exist in database
- **No UI changes** - frontend continues to work with same data contracts
- Commit after completing each phase
- Run `npm run typecheck` frequently during implementation

---

## Validation Checklist

_GATE: Checked before marking feature complete_

- [x] All contracts have corresponding tests: N/A (no new contracts)
- [x] All entities have model tasks: N/A (tables already exist)
- [x] All tests come before implementation: ✅ T008 before implementation
- [x] Parallel tasks truly independent: ✅ Different files
- [x] Each task specifies exact file path: ✅ All paths specified
- [x] No task modifies same file as another [P] task: ✅ Verified
- [x] i18n: Removing hardcoded i18n files, using DB translations: ✅ T010
- [x] Prisma: No schema changes, seed file created: ✅ T004, T005
- [x] Directus: N/A (not used for this feature)
- [x] Partner: N/A (no changes to partner flows)

---

## Constitution Compliance

**Per Constitution v1.0.0**:

✅ **Structure**: Work in `prisma/seed/`, `app/types/`, `i18n/locales/`, `scripts/` - all correct paths  
✅ **Data Access**: Using Prisma via seed scripts, no direct SQL  
✅ **i18n**: Removing hardcoded i18n files, migrating to DB `*_translations` table  
✅ **Migrations**: No schema changes needed (tables exist)  
✅ **Quality**: TypeScript checks (T012), tests (T013), manual validation (T014)

---

_Aligned with Constitution v1.0.0 - See `/memory/constitution.md`_
