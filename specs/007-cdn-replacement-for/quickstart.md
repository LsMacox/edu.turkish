# Quickstart: CDN Asset Delivery

**Feature**: CDN Asset Delivery  
**Date**: 2025-10-09

## Prerequisites

- Nuxt 4.1.3+ installed
- CDN configured and accessible at `https://cdn.edu-turkish.com`
- Assets uploaded to CDN matching `/public/` structure

## Setup

### 1. Configure Runtime Config

Add CDN URL to `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      cdnUrl: process.env.NUXT_PUBLIC_CDN_URL || '',
    },
  },
})
```

### 2. Set Environment Variable

Add to `.env`:

```bash
NUXT_PUBLIC_CDN_URL=https://cdn.edu-turkish.com
```

Add to `.env.example`:

```bash
# CDN Configuration
NUXT_PUBLIC_CDN_URL=https://cdn.edu-turkish.com
```

### 3. Verify Setup

Run the application:

```bash
npm run dev
```

Check runtime config is loaded:

```bash
# In browser console or SSR context
const config = useRuntimeConfig()
console.log(config.public.cdnUrl) // Should output: https://cdn.edu-turkish.com
```

## Usage Examples

### Basic Usage in Components

```vue
<script setup>
const { cdnUrl } = useCdn()
</script>

<template>
  <!-- Simple image -->
  <img :src="cdnUrl('/images/universities/logo.png')" alt="University Logo" />

  <!-- With Nuxt Image -->
  <NuxtImg
    :src="cdnUrl('/images/reviews/student.jpg')"
    alt="Student Review"
    width="400"
    height="300"
  />

  <!-- Video -->
  <video :src="cdnUrl('/videos/reviews/campus-tour.mp4')" controls />
</template>
```

### Dynamic Paths

```vue
<script setup>
const { cdnUrl } = useCdn()

interface University {
  id: number
  logo: string
}

const university = ref<University>({
  id: 1,
  logo: '/images/universities/istanbul-university.jpg'
})
</script>

<template>
  <img :src="cdnUrl(university.logo)" alt="University" />
</template>
```

### In Composables

```typescript
// ~/composables/useUniversity.ts
export function useUniversity(id: number) {
  const { cdnUrl } = useCdn()

  const university = ref({
    id,
    logo: '/images/universities/default.png',
  })

  const logoUrl = computed(() => cdnUrl(university.value.logo))

  return {
    university,
    logoUrl,
  }
}
```

### Utility Function (Direct)

```typescript
// In any TypeScript file
import { toCdnUrl } from '~/utils/cdn'

const config = useRuntimeConfig()
const imageUrl = toCdnUrl('/images/logo.png', config.public.cdnUrl)
// Result: 'https://cdn.edu-turkish.com/images/logo.png'
```

## Verification Steps

### 1. Test Transformation

Create test component `~/components/CdnTest.vue`:

```vue
<script setup>
const { cdnUrl } = useCdn()

const testPaths = [
  '/images/universities/logo.png',
  'images/reviews/photo.jpg',
  '/public/videos/tour.mp4',
  '/images/test.png?v=123',
]
</script>

<template>
  <div>
    <h2>CDN Transformation Test</h2>
    <ul>
      <li v-for="path in testPaths" :key="path">
        <strong>Input:</strong> {{ path }}<br />
        <strong>Output:</strong> {{ cdnUrl(path) }}
      </li>
    </ul>
  </div>
</template>
```

### 2. Verify Network Requests

1. Open browser DevTools → Network tab
2. Load page with CDN assets
3. Verify requests go to `cdn.edu-turkish.com`
4. Check response headers for CDN indicators

### 3. Test SSR Rendering

```bash
# Build for production
npm run build

# Preview
npm run preview
```

View page source - CDN URLs should be in HTML:

```html
<img src="https://cdn.edu-turkish.com/images/universities/logo.png" alt="Logo" />
```

### 4. Test CDN Disabled

```bash
# Remove or empty CDN URL
NUXT_PUBLIC_CDN_URL=

# Run dev server
npm run dev
```

Assets should load from local `/public/` directory.

### 5. Run Tests

```bash
# Run all tests
npm run test

# Run specific contract test
npm run test -- cdn-transformation.contract

# Run with coverage
npm run test -- --coverage
```

Expected output:

```
✓ CDN Transformation Contract (15 tests)
  ✓ Path Normalization Contract (4 tests)
  ✓ Query Parameters Contract (4 tests)
  ✓ CDN Disabled Contract (2 tests)
  ✓ Already Absolute URL Contract (3 tests)
  ✓ Edge Cases Contract (4 tests)
  ✓ Real-World Paths Contract (4 tests)
  ✓ Idempotency Contract (2 tests)
  ✓ Type Safety Contract (2 tests)
```

## Common Issues & Solutions

### Issue: CDN URLs not generated

**Solution**: Check runtime config is set:

```typescript
const config = useRuntimeConfig()
console.log('CDN URL:', config.public.cdnUrl)
```

If empty, verify `NUXT_PUBLIC_CDN_URL` environment variable.

### Issue: Assets return 404 from CDN

**Solution**: Verify assets exist on CDN with correct paths:

```bash
# Test CDN directly
curl -I https://cdn.edu-turkish.com/images/universities/logo.png
```

Ensure CDN mirrors `/public/` structure exactly.

### Issue: Double slashes in URLs

**Solution**: Check CDN base URL has no trailing slash:

```bash
# ✅ Correct
NUXT_PUBLIC_CDN_URL=https://cdn.edu-turkish.com

# ❌ Wrong
NUXT_PUBLIC_CDN_URL=https://cdn.edu-turkish.com/
```

### Issue: Composable not found

**Solution**: Ensure file is in `~/composables/` directory. Nuxt auto-imports from there.

```bash
# Verify file exists
ls app/composables/useCdn.ts
```

Restart dev server if needed:

```bash
npm run dev
```

## Performance Validation

### Expected Metrics

- **Transformation time**: <1ms per call
- **Bundle size impact**: <1KB (utility + composable)
- **Runtime overhead**: Zero (pure functions)

### Measure Performance

```typescript
// In browser console
const { cdnUrl } = useCdn()

console.time('cdn-transform')
for (let i = 0; i < 1000; i++) {
  cdnUrl('/images/test.png')
}
console.timeEnd('cdn-transform')
// Expected: <10ms for 1000 transformations
```

## Migration Checklist

- [ ] CDN configured and accessible
- [ ] Assets uploaded to CDN
- [ ] Runtime config added to `nuxt.config.ts`
- [ ] Environment variable set in `.env`
- [ ] Environment variable documented in `.env.example`
- [ ] Utility function created (`~/utils/cdn.ts`)
- [ ] Composable created (`~/composables/useCdn.ts`)
- [ ] Contract tests passing
- [ ] Components updated to use `useCdn()`
- [ ] Network requests verified in DevTools
- [ ] SSR rendering verified
- [ ] Performance validated
- [ ] Documentation updated

## Next Steps

1. **Gradual Migration**: Update components one by one
2. **Monitor**: Track CDN performance and errors
3. **Optimize**: Add CDN-specific optimizations (compression, caching)
4. **Document**: Update component documentation with CDN usage

## Support

For issues or questions:

- Check contract tests: `specs/007-cdn-replacement-for/contracts/`
- Review research: `specs/007-cdn-replacement-for/research.md`
- See data model: `specs/007-cdn-replacement-for/data-model.md`
