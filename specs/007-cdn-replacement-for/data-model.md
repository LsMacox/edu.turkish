# Data Model: CDN Asset Delivery

**Date**: 2025-10-09  
**Feature**: CDN Asset Delivery

## Overview

This feature is primarily a **client-side transformation utility** with no database entities or API contracts. The data model describes configuration and transformation logic.

## Configuration Schema

### Runtime Configuration

**Location**: `nuxt.config.ts` → `runtimeConfig.public`

```typescript
interface RuntimeConfig {
  public: {
    cdnUrl: string  // CDN base URL, e.g., 'https://cdn.edu-turkish.com'
  }
}
```

**Environment Variable**: `NUXT_PUBLIC_CDN_URL`

**Validation**:
- Must be valid URL or empty string
- No trailing slash
- HTTPS in production (recommended)

**Default**: `''` (empty string, CDN disabled)

## Transformation Logic

### Input/Output Types

```typescript
/**
 * Asset path input - can be absolute or relative
 */
type AssetPath = string  // e.g., '/images/logo.png' or 'images/logo.png'

/**
 * CDN URL output - fully qualified URL
 */
type CdnUrl = string  // e.g., 'https://cdn.edu-turkish.com/images/logo.png'

/**
 * Transform asset path to CDN URL
 */
function transformToCdn(path: AssetPath, cdnBaseUrl: string): CdnUrl
```

### Transformation Rules

1. **Normalization**:
   - Remove `/public/` prefix if present
   - Remove leading `/` if present
   - Preserve query parameters and hash

2. **Validation**:
   - If `cdnBaseUrl` is empty → return original path
   - If path is already absolute URL → return as-is

3. **Construction**:
   - Result: `${cdnBaseUrl}/${normalizedPath}`
   - Ensure no double slashes

### Examples

| Input | CDN Base URL | Output |
|-------|--------------|--------|
| `/images/universities/logo.png` | `https://cdn.edu-turkish.com` | `https://cdn.edu-turkish.com/images/universities/logo.png` |
| `images/reviews/photo.jpg` | `https://cdn.edu-turkish.com` | `https://cdn.edu-turkish.com/images/reviews/photo.jpg` |
| `/public/videos/tour.mp4` | `https://cdn.edu-turkish.com` | `https://cdn.edu-turkish.com/videos/tour.mp4` |
| `/images/logo.png?v=123` | `https://cdn.edu-turkish.com` | `https://cdn.edu-turkish.com/images/logo.png?v=123` |
| `https://other-cdn.com/image.png` | `https://cdn.edu-turkish.com` | `https://other-cdn.com/image.png` (unchanged) |
| `/images/logo.png` | `` (empty) | `/images/logo.png` (unchanged) |

## API Surface

### Utility Function

**File**: `~/utils/cdn.ts`

```typescript
/**
 * Transform asset path to CDN URL
 * @param path - Asset path (absolute or relative)
 * @param cdnBaseUrl - CDN base URL from runtime config
 * @returns CDN URL or original path if CDN disabled
 */
export function toCdnUrl(path: string, cdnBaseUrl: string): string
```

**Characteristics**:
- Pure function (no side effects)
- Idempotent (same input → same output)
- SSR-safe (no DOM/window access)

### Composable

**File**: `~/composables/useCdn.ts`

```typescript
/**
 * CDN transformation composable
 * @returns Object with cdnUrl transformation function
 */
export function useCdn() {
  const config = useRuntimeConfig()
  
  return {
    /**
     * Transform asset path to CDN URL
     * @param path - Asset path
     * @returns CDN URL
     */
    cdnUrl: (path: string) => string
  }
}
```

**Usage**:
```vue
<script setup>
const { cdnUrl } = useCdn()
const logoUrl = cdnUrl('/images/universities/logo.png')
</script>

<template>
  <img :src="cdnUrl('/images/universities/logo.png')" />
  <NuxtImg :src="cdnUrl('/images/reviews/photo.jpg')" />
</template>
```

## State Management

**No Pinia store needed** - this is a stateless transformation utility.

## Database Schema

**No database changes** - this feature is client-side only.

## External Dependencies

### Existing

- `useRuntimeConfig()` - Nuxt built-in
- `@nuxt/image` - Already installed, no changes needed

### New

- None (uses existing Nuxt APIs)

## Validation Rules

### Path Validation

- ✅ Must be string
- ✅ Can be empty (returns empty)
- ✅ Can contain query params (`?key=value`)
- ✅ Can contain hash (`#section`)
- ✅ Can have special characters (URL-encoded by browser)

### CDN Base URL Validation

- ✅ Must be valid URL or empty string
- ✅ Should not have trailing slash
- ✅ Should use HTTPS in production
- ⚠️ HTTP allowed in development

## Edge Cases

| Case | Behavior |
|------|----------|
| Empty path | Returns empty string |
| Empty CDN URL | Returns original path |
| Already CDN URL | Returns as-is (no double transformation) |
| Relative path | Normalized and prefixed with CDN URL |
| Absolute path | Normalized and prefixed with CDN URL |
| Query parameters | Preserved in output |
| Hash fragment | Preserved in output |
| Special characters | Preserved (browser handles encoding) |

## Testing Strategy

### Unit Tests

**File**: `tests/utils/cdn.test.ts`

```typescript
describe('toCdnUrl', () => {
  it('transforms absolute path to CDN URL')
  it('transforms relative path to CDN URL')
  it('removes /public/ prefix')
  it('preserves query parameters')
  it('preserves hash fragment')
  it('returns original path when CDN disabled')
  it('returns as-is for already absolute URLs')
  it('handles empty inputs')
  it('handles special characters')
})
```

### Composable Tests

**File**: `tests/composables/useCdn.test.ts`

```typescript
describe('useCdn', () => {
  it('provides cdnUrl function')
  it('uses runtime config CDN URL')
  it('transforms paths correctly')
  it('works in SSR context')
})
```

## Migration Impact

### Breaking Changes

- ✅ None - this is a new feature

### Required Updates

- ✅ Add `NUXT_PUBLIC_CDN_URL` to `.env.example`
- ✅ Update `nuxt.config.ts` with runtime config
- ✅ Document usage in README or docs

### Optional Updates

- Components can gradually adopt `useCdn()` composable
- No forced migration of existing asset references
