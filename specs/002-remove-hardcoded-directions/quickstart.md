# Quickstart: Remove Hardcoded Study Directions

**Feature**: Remove Hardcoded Study Directions  
**Time**: ~15 minutes to validate  
**Prerequisites**: Local development environment with database running

## Quick Validation Steps

### 1. Pre-Migration State Check (Baseline)

```bash
# Verify current hardcoded files exist
ls -la app/types/directions.ts
ls -la i18n/locales/*/directions.json

# Count hardcoded directions
grep -c "'" app/types/directions.ts | head -1

# Check database (should be empty or have old data)
npx prisma studio
# Navigate to study_directions table and note record count
```

**Expected**: 
- ✅ `directions.ts` exists with 60 direction slugs
- ✅ 4 i18n direction JSON files exist
- ⚠️ Database may have 0 or some study_directions records

---

### 2. Run Database Seed

```bash
# Reset database and run seed (development only)
npm run db:reset

# Or just run seed without reset
npm run db:seed
```

**Expected Output**:
```
🌱 Starting database seeding...
🧹 Clearing existing data...
✅ Existing data cleared
📚 Seeding study directions...
  → Found 25 unique direction slugs in university JSONs
  → Created 25 directions with 100 translations (25 × 4 locales)
✅ Study directions seeded
🗺️ Seeding locations...
...
✅ Database seeding completed!
```

**Validation**:
```bash
# Open Prisma Studio and verify
npx prisma studio
```

Check:
- ✅ `study_directions` table has ~25 records (not 60)
- ✅ `study_direction_translations` table has ~100 records (25 × 4)
- ✅ Each direction has translations in all 4 locales (en, ru, kk, tr)
- ✅ Slugs match those used in university JSON files

---

### 3. Verify Import Script Works

```bash
# Test import script with one university
npx tsx scripts/import-university.ts app/assets/json/universities/istanbul_aydin_university.json

# Check for errors (should succeed)
echo $?  # Should output: 0
```

**Expected**:
- ✅ No TypeScript compilation errors
- ✅ Import completes successfully
- ✅ University-direction links created in `university_pivot_study_directions`

---

### 4. Remove Hardcoded Files

```bash
# Remove hardcoded type file
rm app/types/directions.ts

# Remove i18n direction files
rm i18n/locales/en/directions.json
rm i18n/locales/ru/directions.json
rm i18n/locales/kk/directions.json
rm i18n/locales/tr/directions.json
```

**Validation**:
```bash
# Verify files are gone
ls app/types/directions.ts 2>&1  # Should error: No such file
ls i18n/locales/*/directions.json 2>&1  # Should error: No such file
```

---

### 5. TypeScript Compilation Check

```bash
# Run TypeScript type check
npm run typecheck

# Or build the app
npm run build
```

**Expected**:
- ✅ No compilation errors
- ✅ No import errors for removed `DirectionSlug` type
- ✅ Build succeeds

---

### 6. Run Application

```bash
# Start development server
npm run dev
```

**Manual Browser Test**:
1. Navigate to `http://localhost:3000`
2. Browse to universities page
3. Verify direction filters work (if applicable)
4. Check university detail pages show correct directions
5. Verify multilingual switching works for direction names

**Expected**:
- ✅ App starts without errors
- ✅ Direction data displays correctly
- ✅ No console errors related to directions
- ✅ Locale switching works for direction names

---

### 7. Run Tests

```bash
# Run all tests
npm run test

# Run specific seed tests
npm run test tests/seed/study-directions.test.ts
```

**Expected**:
- ✅ All tests pass
- ✅ Seed validation tests confirm data integrity
- ✅ No regressions in existing tests

---

## Success Criteria

All checkboxes must be ✅:

- [ ] Database seed creates exactly the directions used in university JSONs (no unused directions)
- [ ] All 4 locales (en, ru, kk, tr) have translations for each direction
- [ ] Import script works without hardcoded `DirectionSlug` type
- [ ] TypeScript compilation succeeds after removing `app/types/directions.ts`
- [ ] Application runs and displays direction data correctly
- [ ] Multilingual direction names work in all supported locales
- [ ] No hardcoded direction files remain in codebase
- [ ] All tests pass

---

## Rollback Plan (If Needed)

If validation fails:

```bash
# Restore files from git
git checkout app/types/directions.ts
git checkout i18n/locales/en/directions.json
git checkout i18n/locales/ru/directions.json
git checkout i18n/locales/kk/directions.json
git checkout i18n/locales/tr/directions.json

# Revert code changes
git checkout scripts/import-university.ts
git checkout app/assets/json/universities/types.ts

# Reset database
npm run db:reset

# Restart dev server
npm run dev
```

---

## Time Estimate

| Step | Time | 
|------|------|
| 1. Pre-check | 2 min |
| 2. Seed | 3 min |
| 3. Import test | 2 min |
| 4. Remove files | 1 min |
| 5. TypeCheck | 2 min |
| 6. Manual test | 3 min |
| 7. Run tests | 2 min |
| **Total** | **~15 min** |

---

## Troubleshooting

### Issue: Seed fails with "direction not found"

**Cause**: University JSON references a direction slug not in translation map  
**Fix**: Add missing translation to seed data

### Issue: TypeScript errors after removing `directions.ts`

**Cause**: Some code still imports `DirectionSlug`  
**Fix**: Search codebase for `DirectionSlug` imports and remove/replace them

### Issue: Missing translations in UI

**Cause**: Seed didn't create all 4 locale translations  
**Fix**: Check seed logic ensures all locales are created

### Issue: Import script fails

**Cause**: Trying to validate against removed `ALL_DIRECTIONS` array  
**Fix**: Update import script to remove Zod enum validation
