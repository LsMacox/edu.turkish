# Quickstart: Import Alias Standardization

**Feature**: Import Alias Standardization  
**Purpose**: Verify that import aliases are correctly configured and enforced

## Prerequisites

- Node.js and npm installed
- Project dependencies installed (`npm install`)
- All configuration files present

## Quick Validation

### 1. Verify Configuration Alignment

Check that all config files have synchronized aliases:

```bash
# Check tsconfig.json
cat tsconfig.json | grep -A 10 '"paths"'

# Check vitest.config.ts
cat vitest.config.ts | grep -A 10 'alias'

# Expected: Both should define ~ and ~~ aliases pointing to same targets
```

**Expected Output**:

- `tsconfig.json` should have `~/*` → `./app/*` and `~~/*` → `./*`
- `vitest.config.ts` should have matching aliases

### 2. Run Tests with New Aliases

Verify that tests can resolve imports correctly:

```bash
npm test
```

**Expected Result**: All tests pass without import resolution errors

### 3. Check for Deprecated Aliases

Search for usage of deprecated aliases:

```bash
# Find files using deprecated @ alias
grep -r "from ['\"]@/" app/ server/ tests/ --include="*.ts" --include="*.vue" | wc -l

# Find files using deprecated @@ or ^ aliases
grep -r "from ['\"]@@/\|from ['\"]\^/" app/ server/ tests/ --include="*.ts" --include="*.vue" | wc -l
```

**Expected Result**: 0 matches (after migration complete)

### 4. Check for Deep Relative Imports

Search for deep relative imports that should use aliases:

```bash
# Find files with ../../ imports
grep -r "from ['\"]\.\.\/\.\./" app/ server/ tests/ --include="*.ts" --include="*.vue" | wc -l
```

**Expected Result**: 0 matches in tests/, minimal in server/ (internal only)

### 5. Verify ESLint Rules

Check that ESLint catches violations:

```bash
npm run lint
```

**Expected Result**: No errors related to import patterns

### 6. Build Verification

Ensure the application builds successfully:

```bash
npm run build
```

**Expected Result**: Build succeeds without import resolution errors

## Manual Test Scenarios

### Scenario 1: App Component Import

**File**: `app/components/features/test/TestComponent.vue`

```vue
<script setup lang="ts">
// ✅ Should work: Import from app using ~
import { useUniversitiesStore } from '~/stores/universities'
import BaseButton from '~/components/shared/BaseButton.vue'

// ✅ Should work: Import from root using ~~
import { contactChannels } from '~~/lib/contact/channels'

// ❌ Should fail ESLint: Deprecated alias
// import { something } from '@/stores/universities'

// ❌ Should fail ESLint: Deep relative import
// import { something } from '../../stores/universities'
</script>
```

**Validation**:

1. Create test component with imports above
2. Run `npm run lint` - should pass for ✅, fail for ❌
3. Run `npm run dev` - component should load without errors

### Scenario 2: Server API Import

**File**: `server/api/v1/test/index.get.ts`

```typescript
// ✅ Should work: Relative import within server
import { UniversityRepository } from '../../../repositories/UniversityRepository'

// ✅ Should work: Import app types using ~
import type { University } from '~/types/domain'

// ✅ Should work: Import from root using ~~
import { prisma } from '~~/lib/prisma'

// ❌ Should fail ESLint: Deprecated alias
// import { something } from '@@/lib/prisma'

export default defineEventHandler(async () => {
  return { status: 'ok' }
})
```

**Validation**:

1. Create test endpoint with imports above
2. Run `npm run lint` - should pass for ✅, fail for ❌
3. Start dev server and hit endpoint - should respond without errors

### Scenario 3: Test File Import

**File**: `tests/features/test-imports.test.ts`

```typescript
import { describe, it, expect } from 'vitest'

// ✅ Should work: Import app code using ~
import { useFormValidation } from '~/composables/useFormValidation'

// ✅ Should work: Import server code using ~~
import { UniversityRepository } from '~~/server/repositories/UniversityRepository'

// ✅ Should work: Import seed using ~~
import { seedStudyDirections } from '~~/prisma/seed/study-directions'

// ❌ Should fail: Relative import
// import { something } from '../../app/composables/useFormValidation'

describe('Import Alias Test', () => {
  it('should resolve imports correctly', () => {
    expect(useFormValidation).toBeDefined()
    expect(UniversityRepository).toBeDefined()
    expect(seedStudyDirections).toBeDefined()
  })
})
```

**Validation**:

1. Create test file with imports above
2. Run `npm test` - should pass
3. Uncomment ❌ line and run lint - should fail

## Acceptance Criteria Checklist

- [ ] **Config Alignment**: `tsconfig.json` and `vitest.config.ts` have matching aliases
- [ ] **Test Resolution**: All tests pass without import errors
- [ ] **No Deprecated Aliases**: Zero usage of `@`, `@@`, `^` in codebase
- [ ] **No Deep Relative**: Zero usage of `../../` in tests, minimal in server
- [ ] **ESLint Enforcement**: ESLint rules catch and prevent violations
- [ ] **Build Success**: Production build completes without errors
- [ ] **Documentation**: README.md includes import alias guidelines

## Troubleshooting

### Issue: Tests fail with "Cannot find module"

**Cause**: `vitest.config.ts` aliases don't match `tsconfig.json`

**Solution**:

```bash
# Verify vitest config has all aliases
cat vitest.config.ts | grep -A 10 'alias'

# Update vitest.config.ts to match tsconfig.json
```

### Issue: ESLint not catching deprecated aliases

**Cause**: ESLint rules not configured

**Solution**:

```bash
# Check eslint.config.mjs for no-restricted-imports rule
cat eslint.config.mjs | grep -A 20 'no-restricted-imports'

# Add missing rules if needed
```

### Issue: Build fails with module resolution errors

**Cause**: Nuxt config not aligned with tsconfig

**Solution**:

```bash
# Regenerate Nuxt types
npm run postinstall

# Verify .nuxt/tsconfig.json includes correct aliases
cat .nuxt/tsconfig.json | grep -A 10 '"paths"'
```

## Success Metrics

After completing this quickstart, you should have:

1. ✅ Zero import resolution errors in tests
2. ✅ Zero usage of deprecated aliases (`@`, `@@`, `^`)
3. ✅ Zero deep relative imports in tests
4. ✅ ESLint rules preventing future violations
5. ✅ Successful production build
6. ✅ All tests passing

## Next Steps

1. Run full test suite: `npm test`
2. Run linter: `npm run lint`
3. Build for production: `npm run build`
4. Review documentation: Check README.md for import guidelines
