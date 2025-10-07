# Quickstart: Verify Import Standardization

**Feature**: 004-standardize-imports-to  
**Purpose**: Validate that all imports follow Nuxt 4 conventions after refactoring

## Prerequisites

- Node.js and npm installed
- Repository cloned and dependencies installed (`npm install`)
- On branch `004-standardize-imports-to`

## Validation Steps

### 1. Verify No Unnecessary Imports

Check that auto-importable items are not explicitly imported in app/ code:

```bash
# Should return 0 results (or only in tests/)
grep -r "import.*from 'vue'" app/
grep -r "import.*useRouter" app/
grep -r "import.*useRoute" app/
grep -r "import.*ref\|computed\|watch" app/
```

**Expected**: No matches in `app/` directory (tests/ may have explicit imports).

### 2. Verify Consistent Alias Usage

Check that all explicit imports use `~/` alias:

```bash
# Should return 0 results
grep -r "from '\.\." app/ server/ tests/ | grep -v node_modules
grep -r "from '@/" app/ server/ tests/ | grep -v node_modules
```

**Expected**: No relative imports (`../`) or `@/` aliases.

### 3. TypeScript Validation

Ensure TypeScript compilation succeeds:

```bash
# Nuxt will type-check during dev/build
npm run dev
# Wait for "Nuxt is ready" message, then Ctrl+C
```

**Expected**: No TypeScript errors in console.

### 4. ESLint Validation

Run linter to catch import issues:

```bash
npm run lint
```

**Expected**: Exit code 0, no import-related errors.

### 5. Test Suite Validation

Run full test suite to ensure no breakage:

```bash
npm run test
```

**Expected**: All tests pass (same count as before refactoring).

### 6. Vitest Configuration Check

Verify vite-tsconfig-paths is configured:

```bash
grep -A 5 "plugins:" vitest.config.ts
```

**Expected**: Should see `tsconfigPaths()` in plugins array.

### 7. Build Validation

Ensure production build succeeds:

```bash
npm run build
```

**Expected**: Build completes without errors.

### 8. Manual Smoke Test

Start dev server and verify key pages:

```bash
npm run dev
```

Visit:

- http://localhost:3000/ru (home page)
- http://localhost:3000/ru/universities (universities listing)
- http://localhost:3000/ru/about (about page)

**Expected**: All pages load without console errors.

## Success Criteria

✅ All validation steps pass  
✅ No TypeScript errors  
✅ No ESLint errors  
✅ All Vitest tests pass  
✅ Dev server starts successfully  
✅ Production build succeeds  
✅ No console errors in browser

## Rollback Procedure

If validation fails:

```bash
git checkout main
git branch -D 004-standardize-imports-to
```

Then investigate failures and retry refactoring.

## Common Issues

**Issue**: Tests fail with "Cannot find module '~/...'"  
**Solution**: Ensure `vite-tsconfig-paths` is in vitest.config.ts plugins

**Issue**: TypeScript errors about missing imports  
**Solution**: Some items may need explicit imports (types, lib/, server/)

**Issue**: Components not rendering  
**Solution**: Check that component names match file names (Nuxt auto-import convention)

## Completion

Once all validation steps pass, the refactoring is complete and ready for code review.
