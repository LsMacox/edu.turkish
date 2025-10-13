# Quickstart: Enhanced Service Page Content Blocks

**Phase**: 1 (Design)  
**Date**: 2025-01-13  
**Status**: Complete

## Development Setup

### Prerequisites

- Node.js 18+ and pnpm installed
- Docker and Docker Compose (for local database)
- Git on branch `012-x-30-60`

### Initial Setup

```bash
# Install dependencies
pnpm install

# Start local services (database, Directus, Redis)
docker compose up -d

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

Visit `http://localhost:3000/services/relocation-in-turkey` to see the service page.

## Development Workflow

### 1. Create a New Section Component

**Location**: `app/components/features/services/sections/`

**Template**:

```vue
<template>
  <div class="mt-16">
    <BaseSectionHeader :title="title" />

    <!-- Section content here -->
    <div class="mt-8">
      <!-- Your content -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { YourSectionProps } from '~/specs/012-x-30-60/contracts/component-props'

const props = withDefaults(defineProps<YourSectionProps>(), {
  title: '',
})

const { t, tm } = useI18n()

// Computed title with i18n fallback
const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

// Example: Load array data
const items = computed(() => {
  const raw = (tm(`${props.keyPrefix}.items`) || []) as unknown[]
  return raw.map((_, index) => ({
    text: t(`${props.keyPrefix}.items.${index}`) as string,
  }))
})
</script>
```

**Key Patterns**:

- Use `BaseSectionHeader` for consistent section titles
- Use `mt-16` for section spacing
- Use computed properties for i18n reactivity
- Use `keyPrefix` prop for flexible i18n keys
- Follow Tailwind utility classes (no scoped CSS)

### 2. Add Section to ServicePageLayout

**File**: `app/components/features/services/ServicePageLayout.vue`

Add new slot:

```vue
<!-- Your New Section -->
<div v-if="$slots['your-section']" class="mt-16">
  <slot name="your-section" />
</div>
```

**Slot Order** (visual hierarchy):

1. Page header
2. Sub-services grid
3. Qualification/targeting sections
4. CTAs (diagnostic tests)
5. Outcomes/results
6. Process/timeline
7. Responsibilities/risks
8. Social proof
9. Pricing/requirements
10. FAQ

### 3. Use Section in Service Page

**File**: `app/pages/services/relocation-in-turkey.vue`

```vue
<template>
  <ServicePageLayout
    :title="t('services.relocation-in-turkey.title')"
    :subtitle="t('services.relocation-in-turkey.subtitle')"
  >
    <!-- Existing sub-services -->
    <template #sub-services>
      <SubServiceCard ... />
    </template>

    <!-- NEW: Your section -->
    <template #your-section>
      <YourSection key-prefix="services.relocation-in-turkey.yourSection" />
    </template>
  </ServicePageLayout>
</template>
```

### 4. Add i18n Keys

**Files**: `i18n/locales/{en,ru,kk,tr}/services.json`

Start with English:

```json
{
  "services": {
    "relocation-in-turkey": {
      "yourSection": {
        "title": "Your Section Title",
        "items": ["Item 1", "Item 2", "Item 3"]
      }
    }
  }
}
```

Then copy structure to other locales with placeholders:

```json
{
  "services": {
    "relocation-in-turkey": {
      "yourSection": {
        "title": "[TO BE TRANSLATED]",
        "items": ["[TO BE TRANSLATED]", "[TO BE TRANSLATED]", "[TO BE TRANSLATED]"]
      }
    }
  }
}
```

### 5. Write Tests

**Location**: `tests/components/features/services/sections/`

**Template**:

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import YourSection from '~/app/components/features/services/sections/YourSection.vue'

describe('YourSection', () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        services: {
          'test-service': {
            yourSection: {
              title: 'Test Title',
              items: ['Item 1', 'Item 2'],
            },
          },
        },
      },
    },
  })

  it('renders title from i18n', () => {
    const wrapper = mount(YourSection, {
      props: {
        keyPrefix: 'services.test-service.yourSection',
      },
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('Test Title')
  })

  it('renders all items', () => {
    const wrapper = mount(YourSection, {
      props: {
        keyPrefix: 'services.test-service.yourSection',
      },
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('Item 1')
    expect(wrapper.text()).toContain('Item 2')
  })

  it('allows title override', () => {
    const wrapper = mount(YourSection, {
      props: {
        keyPrefix: 'services.test-service.yourSection',
        title: 'Override Title',
      },
      global: {
        plugins: [i18n],
      },
    })

    expect(wrapper.text()).toContain('Override Title')
  })
})
```

Run tests:

```bash
pnpm test
```

### 6. Add Contract Test

**File**: `tests/contract/services-i18n.contract.test.ts`

Add validation for your new keys:

```typescript
import { getAllRequiredKeys, REQUIRED_LOCALES } from '~/specs/012-x-30-60/contracts/i18n-keys'

describe('Service page i18n contract', () => {
  it('should have all new section keys in all locales', () => {
    const requiredKeys = getAllRequiredKeys()

    for (const locale of REQUIRED_LOCALES) {
      const services = require(`~/i18n/locales/${locale}/services.json`).services

      // Verify relocation-in-turkey.yourSection exists
      expect(services['relocation-in-turkey'].yourSection).toBeDefined()
      expect(services['relocation-in-turkey'].yourSection.title).toBeDefined()
      expect(services['relocation-in-turkey'].yourSection.items).toBeInstanceOf(Array)
    }
  })
})
```

## Testing Guide

### Unit Tests

Test individual components in isolation:

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test YourSection.test.ts

# Run in watch mode
pnpm test:watch
```

### Contract Tests

Verify i18n completeness across locales:

```bash
pnpm test tests/contract/services-i18n.contract.test.ts
```

### Manual Testing

1. **Locale Switching**: Change language in browser and verify all text updates
2. **Responsive Design**: Test on mobile (375px), tablet (768px), desktop (1280px)
3. **Accessibility**: Tab through page, check ARIA labels, test with screen reader
4. **Performance**: Check Lighthouse scores, ensure no layout shifts

### Visual Regression

Take screenshots before/after changes:

```bash
# TODO: Add visual regression testing setup
```

## Code Quality

### Linting

```bash
# Run ESLint
pnpm lint

# Auto-fix issues
pnpm lint:fix
```

### Formatting

```bash
# Check formatting
pnpm format:check

# Auto-format
pnpm format
```

### Type Checking

```bash
# Run TypeScript compiler
pnpm typecheck
```

### Pre-commit Checklist

- [ ] All tests pass (`pnpm test`)
- [ ] No linting errors (`pnpm lint`)
- [ ] Code is formatted (`pnpm format`)
- [ ] No TypeScript errors (`pnpm typecheck`)
- [ ] i18n keys exist in all 4 locales
- [ ] Component is responsive (mobile/tablet/desktop)
- [ ] Manual testing completed

## Common Patterns

### Loading Array Data from i18n

```typescript
const items = computed(() => {
  const raw = (tm(`${props.keyPrefix}.items`) || []) as unknown[]
  return raw.map((_, index) => ({
    title: t(`${props.keyPrefix}.items.${index}.title`) as string,
    description: t(`${props.keyPrefix}.items.${index}.description`) as string,
  }))
})
```

### Conditional Rendering

```vue
<div v-if="items.length > 0" class="grid gap-4">
  <div v-for="(item, index) in items" :key="index">
    {{ item.title }}
  </div>
</div>
```

### Icons

```vue
<Icon :name="item.icon" class="w-6 h-6 text-primary" />
```

Available collections: `mdi:*`, `ph:*`

### Responsive Grid

```vue
<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <!-- Grid items -->
</div>
```

### Two-Column Layout

```vue
<div class="grid gap-8 md:grid-cols-2">
  <div>
    <h3 class="text-lg font-semibold mb-4">Column 1</h3>
    <!-- Content -->
  </div>
  <div>
    <h3 class="text-lg font-semibold mb-4">Column 2</h3>
    <!-- Content -->
  </div>
</div>
```

### FAQ Accordion

```vue
<details v-for="(item, index) in faqItems" :key="index" class="border-b py-4">
  <summary class="cursor-pointer font-semibold">
    {{ item.question }}
  </summary>
  <p class="mt-2 text-gray-600">
    {{ item.answer }}
  </p>
</details>
```

## Troubleshooting

### i18n Key Not Found

**Error**: `[intlify] Not found 'services.xxx' key in 'en' locale messages.`

**Solution**:

1. Check key path in `i18n/locales/en/services.json`
2. Verify JSON is valid (no trailing commas)
3. Restart dev server (`pnpm dev`)

### Component Not Auto-Imported

**Error**: `Component YourSection is not defined`

**Solution**:

1. Ensure component is in `app/components/` directory
2. Use PascalCase naming (e.g., `YourSection.vue`)
3. Restart dev server

### Test Fails with i18n Error

**Error**: `Cannot read property 't' of undefined`

**Solution**:

1. Add i18n plugin to test setup:

```typescript
global: {
  plugins: [i18n]
}
```

### Tailwind Classes Not Working

**Solution**:

1. Check class name spelling
2. Ensure Tailwind is configured in `nuxt.config.ts`
3. Check if class needs responsive prefix (e.g., `md:grid-cols-2`)

## Resources

- **Nuxt 3 Docs**: https://nuxt.com/docs
- **Vue 3 Docs**: https://vuejs.org/guide/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Iconify**: https://icon-sets.iconify.design/
- **Vitest**: https://vitest.dev/guide/
- **i18n**: https://vue-i18n.intlify.dev/

## Next Steps

1. Review `spec.md` for requirements
2. Review `data-model.md` for i18n schema
3. Review `contracts/` for TypeScript types
4. Start with highest priority sections (P1)
5. Create components incrementally
6. Test each component before moving to next
7. Run `/tasks` command to generate detailed task list

---

**Quickstart Complete**: Ready for implementation phase.
