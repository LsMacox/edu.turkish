# Research: CDN Asset Delivery

**Date**: 2025-10-09  
**Feature**: CDN Asset Delivery  
**Status**: Complete

## Research Questions

### 1. How to implement flexible CDN URL transformation in Nuxt?

**Decision**: Utility function + Composable pattern

**Rationale**:

- **Utility function** (`~/utils/cdn.ts`): Pure transformation logic, testable, reusable
- **Composable** (`~/composables/useCdn.ts`): Provides reactive access to runtime config, auto-imported by Nuxt
- **Runtime config**: CDN base URL configurable via `NUXT_PUBLIC_CDN_URL` environment variable

**Alternatives considered**:

- ❌ **Nuxt Image provider**: Too complex, requires custom provider implementation, limited to images only
- ❌ **Middleware**: Overkill for simple URL transformation, adds unnecessary overhead
- ❌ **Plugin**: Not needed, composables are auto-imported and sufficient

### 2. How to handle path transformation logic?

**Decision**: Simple string replacement with validation

**Rationale**:

- Input: `/images/universities/logo.png` or `images/universities/logo.png`
- Normalize: Remove leading `/public/` if present, ensure no leading `/`
- Transform: `${cdnBaseUrl}/${normalizedPath}`
- Output: `https://cdn.edu-turkish.com/images/universities/logo.png`

**Edge cases handled**:

- Query parameters: Preserve `?v=123` → `https://cdn.edu-turkish.com/image.png?v=123`
- Special characters: URL-encode if needed (browser handles automatically)
- Trailing slashes: Normalize to prevent double slashes

**Alternatives considered**:

- ❌ **URL parsing with URL API**: Overkill, adds overhead
- ❌ **Regex-based**: Less readable, harder to maintain
- ✅ **String operations**: Simple, fast, sufficient

### 3. How to integrate with existing @nuxt/image?

**Decision**: Provide CDN URLs to `<NuxtImg>` and `<NuxtPicture>` via `src` prop

**Rationale**:

- @nuxt/image already handles optimization, lazy loading, responsive images
- CDN URLs bypass Nuxt's image optimizer (CDN serves pre-optimized assets)
- Use `provider="none"` or rely on CDN's own optimization

**Implementation**:

```vue
<template>
  <NuxtImg :src="cdnUrl('/images/universities/logo.png')" />
</template>

<script setup>
const { cdnUrl } = useCdn()
</script>
```

**Alternatives considered**:

- ❌ **Custom image component**: Duplicates @nuxt/image functionality
- ❌ **Global image provider**: Requires all images to use CDN (not flexible)
- ✅ **Explicit CDN transformation**: Developer controls when to use CDN

### 4. How to configure CDN base URL?

**Decision**: Runtime config with environment variable override

**Rationale**:

- Declared in `nuxt.config.ts` under `runtimeConfig.public.cdnUrl`
- Default: `''` (empty, CDN disabled by default)
- Override: `NUXT_PUBLIC_CDN_URL=https://cdn.edu-turkish.com`
- Accessible via `useRuntimeConfig().public.cdnUrl` (SSR + client)

**Constitution compliance**:

- ✅ Principle VII: All runtime config explicitly declared
- ✅ `NUXT_PUBLIC_*` prefix for client-accessible variables
- ✅ Sensible default (empty string) documented

**Alternatives considered**:

- ❌ **Hardcoded URL**: Not flexible, violates constitution
- ❌ **Build-time constant**: Cannot change without rebuild
- ✅ **Runtime config**: Flexible, environment-specific, constitutional

### 5. How to handle SSR vs Client rendering?

**Decision**: Same logic works in both contexts

**Rationale**:

- `useRuntimeConfig()` works in SSR and client
- String transformation is pure, no side effects
- No DOM access required

**Testing strategy**:

- Unit tests: Pure utility function
- Composable tests: Mock runtime config
- Integration tests: Verify SSR hydration

### 6. Performance considerations

**Decision**: Zero runtime overhead design

**Rationale**:

- Utility function: O(1) string operations, <1ms
- No watchers, no reactivity (unless needed)
- Composable caches runtime config access
- No network requests (transformation only)

**Measurements**:

- Target: <1ms per transformation
- Expected: ~0.1ms (simple string concat)

### 7. Migration strategy for existing assets

**Decision**: Gradual opt-in migration

**Rationale**:

- No breaking changes: Existing code continues to work
- Developers explicitly use `useCdn()` where needed
- Can migrate component-by-component
- Easy rollback: Remove composable usage

**Migration steps**:

1. Deploy CDN transformation code
2. Update components to use `useCdn()`
3. Verify assets load from CDN
4. Monitor performance

## Technical Decisions Summary

| Aspect                | Decision                     | Rationale                           |
| --------------------- | ---------------------------- | ----------------------------------- |
| **Architecture**      | Utility + Composable         | Separation of concerns, testability |
| **Configuration**     | Runtime config               | Flexibility, environment-specific   |
| **Path Logic**        | String normalization         | Simple, fast, sufficient            |
| **Image Integration** | Pass CDN URLs to @nuxt/image | Reuse existing optimization         |
| **SSR Support**       | Same logic both contexts     | useRuntimeConfig works everywhere   |
| **Performance**       | Zero overhead                | Pure functions, no reactivity       |
| **Migration**         | Gradual opt-in               | No breaking changes                 |

## Constitution Compliance

✅ **Principle I (Structure)**:

- Utility in `~/utils/cdn.ts`
- Composable in `~/composables/useCdn.ts`
- Tests in `tests/utils/` and `tests/composables/`

✅ **Principle VI (Imports)**:

- Composable auto-imported (no manual import needed)
- Utility auto-imported from `~/utils/`
- External libs (none needed)

✅ **Principle VII (Runtime Config)**:

- `cdnUrl` declared in `runtimeConfig.public`
- `NUXT_PUBLIC_CDN_URL` environment variable
- Sensible default (empty string)

✅ **Principle V (Quality)**:

- TypeScript types for all functions
- Vitest tests for utility and composable
- ESLint/Prettier compliant

## Next Steps

Phase 1 will generate:

1. **data-model.md**: CDN configuration schema
2. **contracts/**: API contracts (if needed - likely N/A for client-only feature)
3. **quickstart.md**: Usage examples and verification
4. **Tests**: Contract tests for transformation logic
