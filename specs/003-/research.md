# Research: Import Alias Standardization

**Feature**: Import Alias Standardization  
**Date**: 2025-10-03  
**Status**: Complete

## Research Questions

### 1. What are Nuxt 4 best practices for import aliases?

**Decision**: Use Nuxt's built-in alias conventions with minimal custom configuration

**Rationale**:

- Nuxt 4 auto-configures standard aliases: `~` and `@` for app directory, `~~` and `@@` for project root
- These aliases are automatically available in both runtime and build contexts
- Nuxt handles TypeScript path mapping internally via `.nuxt/tsconfig.json`
- Custom aliases should only be added when absolutely necessary

**Alternatives Considered**:

- **Custom alias proliferation**: Rejected - creates confusion and maintenance burden
- **Relative imports only**: Rejected - violates constitution and makes refactoring harder
- **Single alias (`@` only)**: Considered but Nuxt convention uses both `~` and `@` interchangeably

**Best Practice**: Standardize on `~` for app imports (primary), keep `~~` for root imports (lib/, prisma/, etc.)

### 2. How should test files import modules?

**Decision**: Tests must use the same aliases as production code, configured in vitest.config.ts

**Rationale**:

- Test imports should mirror production imports for consistency
- Vitest requires explicit alias configuration via `resolve.alias`
- Using `vite-tsconfig-paths` plugin can auto-sync with tsconfig.json but adds complexity
- Manual sync between vitest.config.ts and tsconfig.json is more explicit and reliable

**Current Issue**: vitest.config.ts only defines `~`, `@`, `~~` but missing `@@` and `^`

**Solution**:

1. Align vitest.config.ts aliases with tsconfig.json
2. Update all test imports to use `~` for app code, `~~` for root code
3. Remove relative imports (`../../`) in favor of aliases

**Alternatives Considered**:

- **vite-tsconfig-paths plugin**: Already installed but not configured - could auto-sync aliases
- **Keep relative imports in tests**: Rejected - inconsistent with production code
- **Separate test-only aliases**: Rejected - creates cognitive overhead

### 3. Which aliases should be deprecated?

**Decision**: Deprecate `@`, `@@`, `^` aliases; standardize on `~` and `~~`

**Rationale**:

- Nuxt convention: `~` and `@` are equivalent (both → app/), creating redundancy
- `~~` and `@@` are equivalent (both → root), creating redundancy
- `^` is non-standard and adds no value over `~~`
- Reducing from 5 aliases to 2 eliminates ambiguity

**Migration Path**:

1. Keep all aliases in config during migration (backward compatibility)
2. Update all imports to use `~` (app) and `~~` (root)
3. After migration complete, remove deprecated aliases from configs
4. Add ESLint rule to prevent deprecated alias usage

**Alternatives Considered**:

- **Keep `@` instead of `~`**: Rejected - `~` is more visually distinct from `@prisma/client`
- **Keep all aliases**: Rejected - perpetuates confusion
- **Use only `@`**: Rejected - conflicts with npm scoped packages like `@prisma/client`

### 4. How to handle server imports from app directory?

**Decision**: Server code can import from app using `~/types` for shared types only

**Rationale**:

- Server should primarily use relative imports within server/
- Cross-boundary imports (server → app) should be limited to type definitions
- Constitution allows this pattern: "Shared types in server/types/ and server/types/api/"
- App types (domain models) may be imported by server repositories

**Current Pattern Analysis**:

```typescript
// ✅ Good: Server importing app types
import type { DegreeType } from '~/types/domain'

// ❌ Bad: Server importing app components (violates separation)
import SomeComponent from '~/components/...'

// ✅ Good: Server using relative imports within server/
import { UniversityRepository } from '../repositories/UniversityRepository'
```

**Alternatives Considered**:

- **Duplicate types**: Rejected - creates sync issues
- **Shared types in lib/**: Considered but app/types/ is established pattern
- **Absolute server alias**: Not needed - relative imports work well within server/

### 5. How to enforce alias standards?

**Decision**: Use ESLint rules and documentation

**Rationale**:

- ESLint `no-restricted-imports` can ban deprecated aliases and deep relative imports
- TypeScript compiler will catch invalid imports
- Clear documentation in README.md guides developers

**Implementation**:

```javascript
// eslint.config.mjs
{
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        {
          group: ['@/*'],
          message: 'Use ~ instead of @ for app imports'
        },
        {
          group: ['@@/*', '^/*'],
          message: 'Use ~~ for root imports'
        },
        {
          group: ['**/../../*'],
          message: 'Use aliases instead of deep relative imports'
        }
      ]
    }]
  }
}
```

**Alternatives Considered**:

- **Pre-commit hooks**: Overkill for this project
- **Custom TypeScript transformer**: Too complex
- **Manual code review only**: Not scalable

## Technology Stack Decisions

### Import Alias Configuration

**Final Alias Standard**:

- `~/*` → `./app/*` (primary app alias)
- `~~/*` → `./*` (root directory alias)

**Deprecated (to be removed after migration)**:

- `@/*` → Use `~/*` instead
- `@@/*` → Use `~~/*` instead
- `^/*` → Use `~~/*` instead

### Configuration Files

**tsconfig.json**:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./app/*"],
      "~~/*": ["./*"]
    }
  }
}
```

**vitest.config.ts**:

```typescript
{
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '~~': fileURLToPath(new URL('./', import.meta.url))
    }
  }
}
```

**nuxt.config.ts**: No changes needed (Nuxt auto-configures)

## Import Patterns by Context

### App Code (app/\*)

```typescript
// ✅ Importing within app/
import { useUniversitiesStore } from '~/stores/universities'
import BaseButton from '~/components/shared/BaseButton.vue'
import type { University } from '~/types/domain'

// ✅ Importing from root
import { contactChannels } from '~~/lib/contact/channels'
import { prisma } from '~~/lib/prisma'

// ❌ Avoid
import { something } from '../../stores/universities' // Use alias
import { something } from '@/stores/universities' // Use ~ not @
```

### Server Code (server/\*)

```typescript
// ✅ Importing within server/
import { UniversityRepository } from '../repositories/UniversityRepository'
import type { UniversityQueryParams } from '../types/api'

// ✅ Importing app types
import type { DegreeType } from '~/types/domain'

// ✅ Importing from root
import { prisma } from '~~/lib/prisma'

// ❌ Avoid
import { something } from '../../server/repositories/...' // Use relative
import { something } from '@@/lib/prisma' // Use ~~
```

### Test Files (tests/\*)

```typescript
// ✅ Importing app code
import { useFormValidation } from '~/composables/useFormValidation'
import BaseButton from '~/components/shared/BaseButton.vue'

// ✅ Importing server code
import { UniversityRepository } from '~~/server/repositories/UniversityRepository'

// ✅ Importing from root
import { seedStudyDirections } from '~~/prisma/seed/study-directions'

// ❌ Avoid
import { something } from '../../app/composables/...' // Use ~
import { something } from '../../prisma/seed/...' // Use ~~
```

### Scripts & Seed Files (scripts/, prisma/seed/)

```typescript
// ✅ Importing from root
import { prisma } from '~~/lib/prisma'
import { SUPPORTED_LOCALES } from '~~/lib/locales'

// ✅ Importing app types if needed
import type { University } from '~/types/domain'

// ❌ Avoid
import { something } from '../lib/prisma' // Use ~~ for clarity
```

## Migration Strategy

### Phase 1: Configuration Alignment

1. Update `vitest.config.ts` to include all aliases from `tsconfig.json`
2. Verify all configs are synchronized
3. Run tests to ensure no resolution errors

### Phase 2: Codebase Migration

1. **Priority 1**: Fix test files (highest pain point)
   - Replace `../../` with `~` or `~~`
   - Update imports to use standard aliases
2. **Priority 2**: Fix server files
   - Replace `../../app/` with `~/`
   - Replace `../../lib/` with `~~/lib/`
3. **Priority 3**: Fix app files
   - Replace `@/` with `~/`
   - Replace `@@/` and `^/` with `~~/`

### Phase 3: Enforcement

1. Add ESLint rules to ban deprecated patterns
2. Update documentation
3. Remove deprecated aliases from configs

## Validation Criteria

- [ ] All test files use `~` or `~~` aliases (no relative imports)
- [ ] All server files use consistent patterns
- [ ] All app files use `~` for app imports
- [ ] `vitest.config.ts` aligned with `tsconfig.json`
- [ ] ESLint rules prevent deprecated patterns
- [ ] Documentation updated with import guidelines
- [ ] All tests pass with new import patterns
- [ ] No TypeScript errors
- [ ] Build succeeds

## References

- [Nuxt 3 Auto-imports](https://nuxt.com/docs/guide/concepts/auto-imports)
- [Nuxt 3 TypeScript](https://nuxt.com/docs/guide/concepts/typescript)
- [Vitest Configuration](https://vitest.dev/config/)
- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
