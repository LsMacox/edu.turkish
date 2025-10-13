# Quickstart: Enhanced Service Pages Implementation

**Feature**: Enhanced Service Pages for Document Translation  
**Branch**: `011-`  
**Date**: 2025-10-12

## Overview

This guide provides step-by-step instructions for implementing the enhanced service pages feature. Follow these phases in order for a systematic rollout.

## Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Repository cloned and dependencies installed (`pnpm install`)
- Development environment running (`pnpm dev`)
- Basic familiarity with Vue 3, Nuxt 3, and Tailwind CSS

## Project Context

**Tech Stack**:

- **Framework**: Nuxt 4.1 (Vue 3.5, TypeScript 5.9)
- **Styling**: Tailwind CSS 3.x
- **Icons**: @nuxt/icon with Iconify (mdi, ph collections)
- **i18n**: @nuxtjs/i18n 10.1
- **Testing**: Vitest 3.2, @testing-library/vue 8.1

**Key Directories**:

- Components: `app/components/`
- Pages: `app/pages/services/`
- Types: `app/types/`
- i18n: `i18n/locales/{locale}/services/`
- Tests: `tests/`

## Implementation Phases

### Phase 1: Add Delivery Timeframes to Service Cards

**Goal**: Display delivery time below price in all service cards

#### Step 1.1: Update TypeScript Types

Add to `app/types/services.ts`:

```typescript
// Add this interface (or extend existing SubService)
export interface SubServiceWithDelivery {
  id: SubServiceId
  name: string
  description: string
  deliveryTime: string // NEW
  pricing: Record<Currency, string>
}
```

#### Step 1.2: Update SubServiceCard Component

Edit `app/components/features/services/SubServiceCard.vue`:

```vue
<script setup lang="ts">
interface Props {
  subServiceId: SubServiceId
  name: string
  description: string
  pricing: Record<Currency, string>
  deliveryTime: string // NEW
}

const props = defineProps<Props>()
// ... existing code
</script>

<template>
  <div
    class="sub-service-card border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
  >
    <div class="flex flex-col h-full">
      <!-- Existing header -->
      <div class="mb-4">
        <h3 class="text-xl font-bold text-secondary mb-2">{{ name }}</h3>
        <p class="text-gray-600 text-sm leading-relaxed">{{ description }}</p>
      </div>

      <!-- Price and CTA -->
      <div class="mt-auto space-y-4">
        <div class="flex items-baseline justify-between">
          <span class="text-sm text-gray-500">Price</span>
          <CurrencyPrice :pricing="pricing" size="lg" />
        </div>

        <!-- NEW: Delivery timeframe -->
        <div class="text-sm text-gray-600">
          <span class="font-medium">{{ $t('services.common.deliveryTime') }}:</span>
          {{ deliveryTime }}
        </div>

        <button
          type="button"
          class="w-full bg-primary text-white rounded-lg py-3 px-4 font-semibold hover:bg-red-600 active:bg-red-700 transition-colors"
          @click="handleApply"
        >
          {{ $t('cta.apply') }}
        </button>
      </div>
    </div>
  </div>
</template>
```

#### Step 1.3: Add i18n Content

Create/update `i18n/locales/ru/services/common.json`:

```json
{
  "common": {
    "deliveryTime": "Срок"
  }
}
```

Repeat for all locales: `en`, `tr`, `kk`.

**English** (`i18n/locales/en/services/common.json`):

```json
{
  "common": {
    "deliveryTime": "Timeline"
  }
}
```

**Turkish** (`i18n/locales/tr/services/common.json`):

```json
{
  "common": {
    "deliveryTime": "Süre"
  }
}
```

**Kazakh** (`i18n/locales/kk/services/common.json`):

```json
{
  "common": {
    "deliveryTime": "Мерзімі"
  }
}
```

#### Step 1.4: Add Delivery Times to Service Data

Update each service's i18n file (example: `i18n/locales/ru/services/document-translations.json`):

```json
{
  "document-translations": {
    "title": "Профессиональный перевод документов",
    "subtitle": "Перевод документов для поступления, работы и переезда в Турцию",
    "subServices": {
      "passport-translation": {
        "name": "Перевод паспорта",
        "description": "Нотариально заверенный перевод паспорта",
        "deliveryTime": "1–2 дня", // NEW
        "pricing": {
          "RUB": "2500",
          "TRY": "500",
          "KZT": "12000",
          "USD": "50"
        }
      }
      // ... add deliveryTime to all sub-services
    }
  }
}
```

#### Step 1.5: Update Service Pages

Update each service page to pass `deliveryTime` prop:

Edit `app/pages/services/document-translations.vue`:

```typescript
const subServices = computed(() => {
  const raw = (tm('services.document-translations.subServices') || {}) as Record<string, unknown>
  const ids = Object.keys(raw)

  return ids.map((id) => ({
    id: id as SubServiceId,
    name: t(`services.document-translations.subServices.${id}.name`) as string,
    description: t(`services.document-translations.subServices.${id}.description`) as string,
    deliveryTime: t(`services.document-translations.subServices.${id}.deliveryTime`) as string, // NEW
    pricing: {
      KZT: t(`services.document-translations.subServices.${id}.pricing.KZT`) as string,
      TRY: t(`services.document-translations.subServices.${id}.pricing.TRY`) as string,
      RUB: t(`services.document-translations.subServices.${id}.pricing.RUB`) as string,
      USD: t(`services.document-translations.subServices.${id}.pricing.USD`) as string,
    } as Record<Currency, string>,
  }))
})
```

Update template:

```vue
<SubServiceCard
  v-for="subService in subServices"
  :key="subService.id"
  :sub-service-id="subService.id"
  :name="subService.name"
  :description="subService.description"
  :pricing="subService.pricing"
  :delivery-time="subService.deliveryTime"  <!-- NEW -->
  @apply="handleApply"
/>
```

Repeat for all 5 service pages.

#### Step 1.6: Test

```bash
# Run i18n validation
pnpm i18n:check

# Run type check
pnpm typecheck

# Run dev server and verify visually
pnpm dev

# Navigate to http://localhost:3000/ru/services/document-translations
# Verify delivery time appears below price in all cards
```

---

### Phase 2: Add "How It Works" Section

**Goal**: Create and display process steps section

#### Step 2.1: Create ProcessStep Component

Create `app/components/features/services/ProcessStep.vue`:

```vue
<template>
  <div class="flex flex-col items-center text-center space-y-4">
    <!-- Step Number Circle with Icon -->
    <div class="relative">
      <div
        class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl"
        :aria-label="`Step ${step.stepNumber}`"
      >
        {{ step.stepNumber }}
      </div>
      <div
        class="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center"
      >
        <Icon :name="step.icon" class="text-white text-xl" />
      </div>
    </div>

    <!-- Step Content -->
    <div class="space-y-2">
      <h4 class="font-bold text-lg text-secondary">
        {{ step.title }}
      </h4>
      <p class="text-gray-600 text-sm leading-relaxed max-w-xs">
        {{ step.description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ProcessStep {
  stepNumber: number
  title: string
  description: string
  icon: string
}

interface Props {
  step: ProcessStep
}

defineProps<Props>()
</script>
```

#### Step 2.2: Create HowItWorksSection Component

Create `app/components/features/services/HowItWorksSection.vue`:

```vue
<template>
  <section class="py-12">
    <BaseSectionHeader
      :title="title || $t('services.common.howItWorks.title')"
      align="center"
      margin-bottom="lg"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
      <ProcessStep v-for="step in stepsWithNumbers" :key="step.stepNumber" :step="step" />
    </div>
  </section>
</template>

<script setup lang="ts">
interface ProcessStep {
  stepNumber: number
  title: string
  description: string
  icon: string
}

interface Props {
  title?: string
  steps: Omit<ProcessStep, 'stepNumber'>[]
}

const props = defineProps<Props>()

// Add step numbers to steps
const stepsWithNumbers = computed(() => {
  return props.steps.map((step, index) => ({
    ...step,
    stepNumber: index + 1,
  }))
})
</script>
```

#### Step 2.3: Add i18n Content

Update `i18n/locales/ru/services/common.json`:

```json
{
  "common": {
    "deliveryTime": "Срок",
    "howItWorks": {
      "title": "Как это работает",
      "steps": [
        {
          "title": "Загружаете документ",
          "description": "Отправьте нам скан или фото документа через форму на сайте",
          "icon": "mdi:upload"
        },
        {
          "title": "Мы уточняем детали",
          "description": "Наш менеджер свяжется с вами для уточнения требований",
          "icon": "mdi:message-text"
        },
        {
          "title": "Переводим и заверяем",
          "description": "Лицензированные переводчики выполняют перевод с нотариальным заверением",
          "icon": "mdi:translate"
        },
        {
          "title": "Получаете готовый файл",
          "description": "Высылаем электронную версию и при необходимости оригинал курьером",
          "icon": "mdi:check-circle"
        }
      ]
    }
  }
}
```

Translate to EN, TR, KK locales.

#### Step 2.4: Update ServicePageLayout

Edit `app/components/features/services/ServicePageLayout.vue`:

```vue
<template>
  <div class="container section-py">
    <!-- Existing: Page Header -->
    <BaseSectionHeader :title="title" :subtitle="subtitle" />

    <!-- Existing: Sub-Services Grid -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
      <slot name="sub-services" />
    </div>

    <!-- NEW: How It Works Section -->
    <div v-if="$slots['how-it-works']" class="mt-16">
      <slot name="how-it-works" />
    </div>
  </div>
</template>
```

#### Step 2.5: Add Section to Service Pages

Update `app/pages/services/document-translations.vue`:

```vue
<template>
  <ServicePageLayout
    :title="t('services.document-translations.title')"
    :subtitle="t('services.document-translations.subtitle')"
  >
    <template #sub-services>
      <!-- Existing cards -->
    </template>

    <!-- NEW: How It Works -->
    <template #how-it-works>
      <HowItWorksSection :steps="howItWorksSteps" />
    </template>
  </ServicePageLayout>
</template>

<script setup lang="ts">
// ... existing imports and code

// Get how it works steps from i18n
const howItWorksSteps = computed(() => {
  const steps = tm('services.common.howItWorks.steps') as Array<{
    title: string
    description: string
    icon: string
  }>
  return steps
})
</script>
```

Repeat for all service pages.

#### Step 2.6: Test

```bash
pnpm dev
# Verify section appears with 4 steps, icons display correctly
# Test responsive layout on mobile/tablet/desktop
```

---

### Phase 3: Add "Why Choose Us" Section

Follow similar pattern to Phase 2:

1. Create `TrustFactor.vue` component
2. Create `WhyChooseUsSection.vue` component
3. Add i18n content for all locales
4. Update `ServicePageLayout.vue` with new slot
5. Add section to service pages

**Component Structure** (abbreviated):

`app/components/features/services/TrustFactor.vue`:

```vue
<template>
  <div class="flex flex-col items-center text-center space-y-4">
    <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
      <Icon :name="factor.icon" class="text-primary text-3xl" />
    </div>
    <div class="space-y-2">
      <h4 class="font-bold text-lg text-secondary">{{ factor.title }}</h4>
      <p class="text-gray-600 text-sm leading-relaxed max-w-xs">{{ factor.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  factor: { title: string; description: string; icon: string }
}
defineProps<Props>()
</script>
```

`app/components/features/services/WhyChooseUsSection.vue`:

```vue
<template>
  <section class="py-12 bg-gray-50">
    <div class="container">
      <BaseSectionHeader
        :title="title || $t('services.common.whyChooseUs.title')"
        align="center"
        margin-bottom="lg"
      />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <TrustFactor v-for="(factor, index) in factors" :key="index" :factor="factor" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  factors: Array<{ title: string; description: string; icon: string }>
}
defineProps<Props>()
</script>
```

---

### Phase 4: Add Trust Indicator Badges

Create `TrustIndicatorBadge.vue` and integrate similarly.

---

## Testing Strategy

### Unit Tests

Create test files in `tests/components/features/services/`:

**Example**: `ProcessStep.spec.ts`

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProcessStep from '~/components/features/services/ProcessStep.vue'

describe('ProcessStep', () => {
  const mockStep = {
    stepNumber: 1,
    title: 'Test Step',
    description: 'Test description',
    icon: 'mdi:upload',
  }

  it('renders step number', () => {
    const wrapper = mount(ProcessStep, {
      props: { step: mockStep },
    })
    expect(wrapper.text()).toContain('1')
  })

  it('renders title and description', () => {
    const wrapper = mount(ProcessStep, {
      props: { step: mockStep },
    })
    expect(wrapper.text()).toContain('Test Step')
    expect(wrapper.text()).toContain('Test description')
  })

  it('includes accessibility label', () => {
    const wrapper = mount(ProcessStep, {
      props: { step: mockStep },
    })
    expect(wrapper.find('[aria-label="Step 1"]').exists()).toBe(true)
  })
})
```

Run tests:

```bash
pnpm test
```

### Integration Tests

Create `tests/integration/service-pages.spec.ts` to test full page rendering.

### Visual Testing

Manual checklist:

- [ ] All sections display correctly on desktop (1920px)
- [ ] All sections display correctly on tablet (768px)
- [ ] All sections display correctly on mobile (375px)
- [ ] All 4 locales render correctly (ru, en, tr, kk)
- [ ] Icons load and display
- [ ] Hover states work on cards
- [ ] Keyboard navigation works
- [ ] Screen reader announces content correctly

---

## Validation Checklist

Before marking feature complete:

- [ ] All TypeScript types added to `app/types/services.ts`
- [ ] All components created and tested
- [ ] All i18n content added for 4 locales (ru, en, tr, kk)
- [ ] `pnpm i18n:check` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes
- [ ] All 5 service pages updated
- [ ] Visual testing completed for all breakpoints
- [ ] Accessibility testing completed (keyboard, screen reader)
- [ ] Documentation updated

---

## Common Issues & Solutions

### Issue: Icons not displaying

**Solution**: Verify icon name format is correct (`mdi:icon-name` or `ph:icon-name`). Check that `@nuxt/icon` is configured with both collections in `nuxt.config.ts`.

### Issue: i18n keys not resolving

**Solution**: Run `pnpm i18n:check` to identify missing keys. Ensure all locales have the same key structure.

### Issue: TypeScript errors on props

**Solution**: Verify all interfaces are exported and imported correctly. Check that `app/types/services.ts` is in TypeScript path resolution.

### Issue: Components not auto-importing

**Solution**: Check `nuxt.config.ts` components configuration. Components in `~/components/features/services/` should auto-import.

---

## Next Steps After Implementation

1. Deploy to staging environment
2. Conduct QA testing across all locales
3. Measure baseline analytics (time on page, conversion rate)
4. Deploy to production
5. Monitor for 7 days
6. Measure success criteria from spec.md
7. Iterate based on user feedback

---

## Resources

- **Spec**: [spec.md](./spec.md)
- **Data Model**: [data-model.md](./data-model.md)
- **Research**: [research.md](./research.md)
- **Contracts**: [contracts/](./contracts/)
- **Nuxt 3 Docs**: https://nuxt.com/docs
- **@nuxt/icon Docs**: https://nuxt.com/modules/icon
- **Tailwind CSS Docs**: https://tailwindcss.com/docs

---

## Contact

For questions or clarifications about this feature, refer to:

- Feature spec: `specs/011-/spec.md`
- Implementation plan: `specs/011-/plan.md`
