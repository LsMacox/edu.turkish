# Research: Standardize Import Paths to Nuxt 4 Conventions

**Date**: 2025-10-03  
**Feature**: 004-standardize-imports-to

## Research Questions

### 1. Nuxt 4 Auto-Import Behavior

**Question**: Which modules does Nuxt 4 auto-import by default, and which require explicit imports?

**Decision**: Nuxt 4 auto-imports:

- Components from `components/` directory (all subdirectories)
- Composables from `composables/` directory
- Utilities from `utils/` directory
- Vue APIs (ref, computed, watch, etc.)
- Nuxt APIs (useRouter, useRoute, navigateTo, etc.)
- Pinia stores (when using `@pinia/nuxt`)

**Requires explicit imports**:

- Type definitions (TypeScript types/interfaces)
- Modules from `lib/` directory (not auto-imported by default)
- Server-side code (repositories, server utilities)
- Third-party packages
- Constants and enums (unless in `utils/`)

**Rationale**: Nuxt 4's auto-import reduces boilerplate and ensures consistent usage patterns. Explicit imports are needed for types (TypeScript limitation) and non-standard directories.

**Alternatives considered**:

- Disable auto-import entirely: Rejected - loses Nuxt's key DX benefit
- Auto-import everything: Rejected - not possible for types, increases bundle size

**References**:

- Nuxt 4 Auto-imports: https://nuxt.com/docs/guide/concepts/auto-imports
- Nuxt 4 Migration Guide: https://nuxt.com/docs/getting-started/upgrade

---

### 2. Nuxt 4 Alias Configuration

**Question**: How should aliases be configured in Nuxt 4, and what's the relationship with nuxt.config.ts?

**Decision**:

- Nuxt 4 provides `~/` and `@/` aliases by default (both point to project root)
- `#app`, `#imports`, `#build` are internal Nuxt aliases
- Custom aliases can be added via `nuxt.config.ts` → `alias` key
- Nuxt generates `.nuxt/tsconfig.json` automatically with proper path mappings

**Rationale**: Use Nuxt's built-in `~/` alias for consistency with Nuxt ecosystem. The `alias` key in nuxt.config.ts is the official way to extend aliases in Nuxt 4.

**Alternatives considered**:

- Custom tsconfig.json paths: Rejected - Nuxt manages its own TypeScript config
- Using `@/` instead of `~/`: Rejected - `~/` is more explicit about project root

**Configuration approach**:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  alias: {
    // Only add if needed - ~/  is already available
  },
})
```

**References**:

- Nuxt Configuration: https://nuxt.com/docs/api/nuxt-config#alias
- TypeScript Support: https://nuxt.com/docs/guide/concepts/typescript

---

### 3. Vitest Configuration for Nuxt Imports

**Question**: How should Vitest be configured to resolve Nuxt's `~/` alias in test files?

**Decision**: Use `vite-tsconfig-paths` plugin (already in package.json)

**Implementation**:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [vue(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
})
```

**Rationale**: `vite-tsconfig-paths` reads Nuxt's generated `.nuxt/tsconfig.json` and applies the same path mappings to Vitest, ensuring test imports match production imports.

**Alternatives considered**:

- Manual alias configuration in vitest.config.ts: Rejected - duplicates configuration, prone to drift
- Relative imports in tests: Rejected - inconsistent with main codebase
- Mock all imports: Rejected - doesn't test real import resolution

**References**:

- vite-tsconfig-paths: https://github.com/aleclarson/vite-tsconfig-paths
- Vitest Configuration: https://vitest.dev/config/

---

### 4. Import Refactoring Strategy

**Question**: What's the safest approach to refactor imports across 49+ files?

**Decision**: Big-bang refactor with automated validation gates

**Approach**:

1. Audit current imports (grep for `from '~/`)
2. Categorize imports by type (components, composables, types, lib, server)
3. Remove unnecessary imports (auto-imported items)
4. Standardize remaining imports to use `~/` consistently
5. Update vitest.config.ts to add vite-tsconfig-paths
6. Run validation gates: TypeScript, ESLint, Vitest

**Rationale**: Big-bang ensures no mixed patterns during transition. Automated validation catches regressions immediately.

**Alternatives considered**:

- Phased migration: Rejected - creates temporary inconsistency
- Automated codemod: Considered but manual review safer for this scale

**Validation checklist**:

- [ ] `npm run lint` passes
- [ ] TypeScript compilation succeeds (implicit via Nuxt)
- [ ] `npm run test` passes (all Vitest tests)
- [ ] Dev server starts without errors
- [ ] Build succeeds

---

### 5. Edge Cases & Special Considerations

**Question**: What edge cases need special handling?

**Findings**:

**A. Vue component imports in tests**:

- Current: `import BaseButton from '~/components/shared/BaseButton.vue'`
- Keep as-is: Tests need explicit imports (no auto-import in Vitest)

**B. Type imports**:

- Current: `import type { BaseBadgeProps } from '~/types/ui'`
- Keep as-is: TypeScript types always require explicit imports

**C. Server-side imports**:

- Current: `import { prisma } from '~/lib/prisma'`
- Keep as-is: Server code doesn't use auto-import

**D. Composables in components**:

- Current: May have explicit imports like `import { useApplicationModalStore } from '~/stores/applicationModal'`
- Action: Remove - Pinia stores are auto-imported

**E. Vue APIs**:

- Action: Remove - Vue APIs are auto-imported by Nuxt

**Decision**: Keep explicit imports for types, tests, lib/, and server/. Remove explicit imports for components, composables, stores, and Vue APIs in app/ code.

---

## Summary

All research questions resolved. No NEEDS CLARIFICATION remaining.

**Key Decisions**:

1. Leverage Nuxt 4 auto-import for components, composables, stores, Vue APIs
2. Use `~/` alias for all explicit imports (types, lib/, server/, tests)
3. Configure Vitest with `vite-tsconfig-paths` plugin
4. Execute big-bang refactor with comprehensive validation gates
5. Handle edge cases: keep explicit imports in tests, types, and server code

**Ready for Phase 1**: Design & Contracts
