# CDN Asset Delivery - Usage Examples

## Basic Component Usage

### Simple Image

```vue
<script setup>
const { cdnUrl } = useCdn()
</script>

<template>
  <img :src="cdnUrl('/images/universities/logo.png')" alt="University Logo" />
</template>
```

### With Nuxt Image

```vue
<script setup>
const { cdnUrl } = useCdn()
</script>

<template>
  <NuxtImg 
    :src="cdnUrl('/images/reviews/student.jpg')" 
    alt="Student Review"
    width="400"
    height="300"
  />
</template>
```

### Video Element

```vue
<script setup>
const { cdnUrl } = useCdn()
</script>

<template>
  <video :src="cdnUrl('/videos/reviews/campus-tour.mp4')" controls />
</template>
```

## Dynamic Paths with Reactive Data

### University Logo

```vue
<script setup>
const { cdnUrl } = useCdn()

interface University {
  id: number
  name: string
  logo: string
}

const university = ref<University>({
  id: 1,
  name: 'Istanbul University',
  logo: '/images/universities/istanbul-university.jpg'
})
</script>

<template>
  <div>
    <h2>{{ university.name }}</h2>
    <img :src="cdnUrl(university.logo)" :alt="university.name" />
  </div>
</template>
```

### Dynamic Image Gallery

```vue
<script setup>
const { cdnUrl } = useCdn()

const images = ref([
  '/images/reviews/student-1.jpg',
  '/images/reviews/student-2.jpg',
  '/images/reviews/student-3.jpg',
])
</script>

<template>
  <div class="gallery">
    <img 
      v-for="(image, index) in images" 
      :key="index"
      :src="cdnUrl(image)" 
      :alt="`Review ${index + 1}`"
    />
  </div>
</template>
```

## Usage in Composables

### Custom Composable

```typescript
// ~/composables/useUniversity.ts
export function useUniversity(id: number) {
  const { cdnUrl } = useCdn()
  
  const university = ref({
    id,
    name: '',
    logo: '/images/universities/default.png'
  })
  
  const logoUrl = computed(() => cdnUrl(university.value.logo))
  
  return {
    university,
    logoUrl
  }
}
```

### Usage in Component

```vue
<script setup>
const { university, logoUrl } = useUniversity(1)
</script>

<template>
  <div>
    <img :src="logoUrl" :alt="university.name" />
  </div>
</template>
```

## Edge Cases

### Query Parameters

```vue
<script setup>
const { cdnUrl } = useCdn()

// Version parameter for cache busting
const imageWithVersion = cdnUrl('/images/logo.png?v=123')
// Result: 'https://cdn.edu-turkish.com/images/logo.png?v=123'

// Multiple parameters
const imageWithParams = cdnUrl('/images/logo.png?v=123&size=large')
// Result: 'https://cdn.edu-turkish.com/images/logo.png?v=123&size=large'
</script>

<template>
  <img :src="imageWithVersion" alt="Logo" />
</template>
```

### Special Characters

```vue
<script setup>
const { cdnUrl } = useCdn()

// Cyrillic characters
const cyrillicImage = cdnUrl('/images/файл.png')
// Result: 'https://cdn.edu-turkish.com/images/файл.png'

// Spaces (will be URL-encoded by browser)
const imageWithSpaces = cdnUrl('/images/my logo.png')
// Result: 'https://cdn.edu-turkish.com/images/my logo.png'
</script>
```

### Hash Fragments

```vue
<script setup>
const { cdnUrl } = useCdn()

const imageWithHash = cdnUrl('/images/sprite.png#icon-home')
// Result: 'https://cdn.edu-turkish.com/images/sprite.png#icon-home'
</script>
```

### Already Absolute URLs

```vue
<script setup>
const { cdnUrl } = useCdn()

// External URL - returned as-is
const externalImage = cdnUrl('https://other-cdn.com/image.png')
// Result: 'https://other-cdn.com/image.png'

// Data URL - returned as-is
const dataUrl = cdnUrl('data:image/png;base64,iVBORw0KGgoAAAANS')
// Result: 'data:image/png;base64,iVBORw0KGgoAAAANS'
</script>
```

## Computed Properties

### Reactive CDN URL

```vue
<script setup>
const { cdnUrl } = useCdn()

const imagePath = ref('/images/universities/logo.png')

const imageUrl = computed(() => cdnUrl(imagePath.value))

function changeImage() {
  imagePath.value = '/images/universities/another-logo.png'
}
</script>

<template>
  <div>
    <img :src="imageUrl" alt="University" />
    <button @click="changeImage">Change Image</button>
  </div>
</template>
```

## Direct Utility Usage

### In TypeScript Files

```typescript
import { toCdnUrl } from '~/utils/cdn'

// Get CDN URL from runtime config
const config = useRuntimeConfig()
const imageUrl = toCdnUrl('/images/logo.png', config.public.cdnUrl)
// Result: 'https://cdn.edu-turkish.com/images/logo.png'

// With empty CDN URL (disabled)
const localUrl = toCdnUrl('/images/logo.png', '')
// Result: '/images/logo.png'
```

### In Server Context

```typescript
// server/api/images.ts
import { toCdnUrl } from '~/utils/cdn'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const imagePath = '/images/universities/logo.png'
  const cdnUrl = toCdnUrl(imagePath, config.public.cdnUrl)
  
  return {
    url: cdnUrl
  }
})
```

## Conditional CDN Usage

### Enable/Disable CDN

```vue
<script setup>
const { cdnUrl } = useCdn()
const config = useRuntimeConfig()

const useCdnForImages = computed(() => !!config.public.cdnUrl)

function getImageUrl(path: string) {
  return useCdnForImages.value ? cdnUrl(path) : path
}
</script>

<template>
  <img :src="getImageUrl('/images/logo.png')" alt="Logo" />
</template>
```

## Background Images

### CSS Background

```vue
<script setup>
const { cdnUrl } = useCdn()

const backgroundImage = computed(() => ({
  backgroundImage: `url(${cdnUrl('/images/hero-bg.jpg')})`
}))
</script>

<template>
  <div class="hero" :style="backgroundImage">
    <h1>Welcome</h1>
  </div>
</template>
```

## List Rendering

### Image List

```vue
<script setup>
const { cdnUrl } = useCdn()

const universities = ref([
  { id: 1, name: 'Istanbul University', logo: '/images/universities/istanbul.jpg' },
  { id: 2, name: 'Ankara University', logo: '/images/universities/ankara.jpg' },
  { id: 3, name: 'Izmir University', logo: '/images/universities/izmir.jpg' },
])
</script>

<template>
  <div class="universities">
    <div v-for="uni in universities" :key="uni.id" class="university-card">
      <img :src="cdnUrl(uni.logo)" :alt="uni.name" />
      <h3>{{ uni.name }}</h3>
    </div>
  </div>
</template>
```

## Error Handling

### Fallback Image

```vue
<script setup>
const { cdnUrl } = useCdn()

const imagePath = ref('/images/universities/logo.png')
const fallbackPath = '/images/default-logo.png'

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = cdnUrl(fallbackPath)
}
</script>

<template>
  <img 
    :src="cdnUrl(imagePath)" 
    @error="handleImageError"
    alt="University Logo" 
  />
</template>
```

## Performance Tips

1. **Memoize CDN URLs**: Use `computed()` for reactive paths
2. **Avoid inline transformations**: Transform once, reuse the URL
3. **Use with Nuxt Image**: Combine CDN with image optimization

```vue
<script setup>
const { cdnUrl } = useCdn()

// ✅ Good: Computed property
const logoUrl = computed(() => cdnUrl('/images/logo.png'))

// ❌ Avoid: Inline transformation in template (recalculates on every render)
</script>

<template>
  <!-- ✅ Good -->
  <img :src="logoUrl" alt="Logo" />
  
  <!-- ❌ Avoid (unless path is truly dynamic) -->
  <img :src="cdnUrl('/images/logo.png')" alt="Logo" />
</template>
```
