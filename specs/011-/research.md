# Research: Enhanced Service Pages

**Feature**: Enhanced Service Pages for Document Translation  
**Date**: 2025-10-12  
**Status**: Complete

## Overview

This document consolidates research findings and design decisions for enhancing service pages with new content sections and improved information architecture.

## Research Areas

### 1. Icon Library Selection

**Decision**: Use existing `@nuxt/icon` with Iconify collections (mdi, ph)

**Rationale**:

- Already integrated in the project (`@nuxt/icon` v2.0.0)
- Two icon collections already available: Material Design Icons (mdi) and Phosphor (ph)
- Consistent with existing usage throughout the codebase (e.g., `ServicesSection.vue`, `SiteHeader.vue`)
- No additional dependencies needed
- Server-side rendering compatible
- Excellent performance with tree-shaking

**Alternatives considered**:

- **Custom SVG icons**: Rejected - requires design work and maintenance overhead
- **Font Awesome**: Rejected - would add unnecessary dependency when mdi/ph already cover needs
- **Heroicons via @nuxt/icon**: Possible but unnecessary, existing collections sufficient

**Icon Selections**:

- **How It Works Section**:
  - Step 1 (Upload): `mdi:upload` or `ph:upload-simple`
  - Step 2 (Clarify): `mdi:message-text` or `ph:chat-circle-dots`
  - Step 3 (Translate): `mdi:translate` or `ph:translate`
  - Step 4 (Deliver): `mdi:check-circle` or `ph:check-circle`
- **Why Choose Us Section**:
  - Licensed translators: `mdi:certificate` or `ph:certificate`
  - University acceptance: `mdi:school` or `ph:graduation-cap`
  - Multilingual support: `mdi:web` or `ph:globe`

- **Trust Indicators**:
  - Working since: `mdi:calendar-check` or `ph:calendar-check`
  - Documents count: `mdi:file-document-multiple` or `ph:files`

### 2. Component Architecture Pattern

**Decision**: Create atomic, reusable components with clear single responsibilities

**Rationale**:

- Follows existing patterns in codebase (e.g., `BaseFeatureCard`, `SubServiceCard`)
- Enables testing in isolation
- Promotes reusability across different service pages
- Easier maintenance and updates
- Consistent with Vue 3 Composition API best practices

**Component Breakdown**:

1. **HowItWorksSection.vue** (Container)
   - Manages overall section layout
   - Accepts array of process steps via props or composable
   - Responsive grid for steps
   - Props: `title`, `steps` (array)

2. **ProcessStep.vue** (Atomic)
   - Displays single process step
   - Props: `stepNumber`, `title`, `description`, `icon`
   - Numbered circle with icon
   - Accessible with proper ARIA labels

3. **WhyChooseUsSection.vue** (Container)
   - Manages trust factors layout
   - Grid of 3 trust factors
   - Props: `title`, `factors` (array)

4. **TrustFactor.vue** (Atomic)
   - Displays single trust factor
   - Props: `title`, `description`, `icon`
   - Icon with text content
   - Accessible markup

5. **TrustIndicatorBadge.vue** (Atomic)
   - Small decorative badge for trust metrics
   - Props: `text`, `icon` (optional)
   - Can be positioned inline or as standalone element

**Alternatives considered**:

- **Monolithic sections**: Rejected - harder to test and maintain
- **Slots-only approach**: Rejected - less convenient for content editors, harder to ensure consistency

### 3. Content Management Strategy

**Decision**: Use i18n JSON files for all text content, with structured data format

**Rationale**:

- Consistent with existing project i18n setup (`@nuxtjs/i18n`)
- Already using nested JSON structure for service content
- Supports all 4 locales (ru, en, tr, kk)
- Content can be updated without code changes
- Translators can work with JSON files directly

**Content Structure Example**:

```json
{
  "services": {
    "common": {
      "howItWorks": {
        "title": "Как это работает",
        "steps": [
          {
            "title": "Загружаете документ",
            "description": "Отправьте нам скан или фото документа через форму на сайте"
          },
          {
            "title": "Мы уточняем детали",
            "description": "Наш менеджер свяжется с вами для уточнения требований"
          },
          {
            "title": "Переводим и заверяем",
            "description": "Лицензированные переводчики выполняют перевод с нотариальным заверением"
          },
          {
            "title": "Получаете готовый файл",
            "description": "Высылаем электронную версию и при необходимости оригинал курьером"
          }
        ]
      },
      "whyChooseUs": {
        "title": "Почему выбирают нас",
        "factors": [
          {
            "title": "Лицензированные переводчики",
            "description": "Все наши специалисты имеют официальную аккредитацию"
          },
          {
            "title": "Переводы принимают турецкие вузы",
            "description": "Работаем со всеми крупными университетами Турции"
          },
          {
            "title": "Поддержка на русском, турецком и английском",
            "description": "Общайтесь с нами на удобном языке"
          }
        ]
      },
      "trustIndicators": {
        "workingSince": "Работаем с 2019 года",
        "documentsCount": "1000+ переведённых документов"
      }
    },
    "document-translations": {
      "title": "Профессиональный перевод документов",
      "subtitle": "Перевод документов для поступления, работы и переезда в Турцию",
      "subServices": {
        "passport-translation": {
          "name": "...",
          "description": "...",
          "deliveryTime": "1–2 дня",
          "pricing": {...}
        }
      }
    }
  }
}
```

**Alternatives considered**:

- **Directus CMS**: Rejected for this feature - unnecessary complexity, content is relatively static
- **Hardcoded content**: Rejected - not maintainable, difficult to translate
- **Separate content files**: Rejected - i18n already provides the structure we need

### 4. Layout Integration Strategy

**Decision**: Extend `ServicePageLayout.vue` with named slots for new sections

**Rationale**:

- Maintains backward compatibility with existing service pages
- Allows gradual rollout (can add sections to one page at a time)
- Preserves existing structure and styling
- Follows Vue slot composition pattern already used in the component

**Layout Structure**:

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

    <!-- NEW: Why Choose Us Section -->
    <div v-if="$slots['why-choose-us']" class="mt-16">
      <slot name="why-choose-us" />
    </div>

    <!-- NEW: Trust Indicators (positioned before CTA) -->
    <div v-if="$slots['trust-indicators']" class="mt-12">
      <slot name="trust-indicators" />
    </div>

    <!-- Optional: CTA Section (if pages need it) -->
    <div v-if="$slots['cta']" class="mt-12">
      <slot name="cta" />
    </div>
  </div>
</template>
```

**Alternatives considered**:

- **Hardcoded sections in layout**: Rejected - less flexible, forces all pages to have all sections
- **Separate service page template**: Rejected - unnecessary duplication
- **Props for section visibility**: Considered but slots provide more flexibility

### 5. Responsive Design Approach

**Decision**: Mobile-first with Tailwind CSS breakpoints, grid-based layouts

**Rationale**:

- Consistent with existing codebase patterns
- Tailwind utilities already in use throughout project
- Mobile-first aligns with user behavior (assumption: many users browse on mobile)
- Grid system handles responsive layouts cleanly

**Breakpoint Strategy**:

- **Mobile (default)**: Stacked single column
- **Tablet (md: 768px)**: 2 columns for cards, maintain stack for process steps
- **Desktop (lg: 1024px)**: 3 columns for cards, 4 columns for process steps
- **Large (xl: 1280px)**: Maintain 3-4 column grid with increased spacing

**Key Responsive Patterns**:

- Process steps: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Trust factors: `grid-cols-1 md:grid-cols-3`
- Service cards: Already responsive `md:grid-cols-2 lg:grid-cols-3`

**Alternatives considered**:

- **Flexbox**: Possible but grid provides better control for equal-height cards
- **Desktop-first**: Rejected - mobile traffic is significant
- **Custom breakpoints**: Rejected - stick to Tailwind defaults for consistency

### 6. Delivery Timeframe Display Format

**Decision**: Add delivery time as a separate line below pricing in `SubServiceCard`

**Rationale**:

- Maintains visual hierarchy (price remains prominent)
- Consistent positioning across all cards
- Easy to scan (users specifically requested this)
- Follows user's example: "Срок: 1–2 дня"

**Display Format**:

- Russian: "Срок: X–Y дней/дня" or "Срок: от X дней"
- English: "Timeline: X–Y days" or "Timeline: from X days"
- Turkish: "Süre: X–Y gün" or "Süre: X günden itibaren"
- Kazakh: "Мерзімі: X–Y күн" or "Мерзімі: X күннен"

**Implementation**:

```vue
<!-- After price, before CTA button -->
<div class="text-sm text-gray-600 mt-2">
  <span class="font-medium">{{ $t('services.common.deliveryTime') }}:</span>
  {{ deliveryTime }}
</div>
```

**Alternatives considered**:

- **Badge/pill style**: Rejected - might compete visually with price
- **Above price**: Rejected - price should remain most prominent
- **Icon with time**: Considered but text-only is clearer

### 7. Accessibility Requirements

**Decision**: Follow WCAG 2.1 AA standards with semantic HTML and ARIA labels

**Rationale**:

- Legal compliance in many jurisdictions
- Better user experience for all users
- Search engine optimization benefits
- Aligns with modern web standards

**Key Accessibility Features**:

- Semantic HTML5 elements (`<section>`, `<article>`, `<h2>`, etc.)
- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels for icon-only elements
- Keyboard navigation support
- Sufficient color contrast (Tailwind's default grays pass WCAG AA)
- Focus indicators for interactive elements
- Screen reader announcements for dynamic content

**Component-Specific Requirements**:

- **ProcessStep**: `aria-label` for step number, descriptive text
- **TrustFactor**: Meaningful alt text or aria-label for icons
- **HowItWorksSection**: Proper sectioning with `<section>` and heading
- **TrustIndicatorBadge**: Decorative icons marked with `aria-hidden="true"`

**Alternatives considered**:

- **ARIA-only approach**: Rejected - semantic HTML is primary, ARIA supplements
- **Skip accessibility**: Rejected - non-negotiable for modern web applications

### 8. Animation and Motion Strategy

**Decision**: Subtle CSS transitions for hover states, no complex animations initially

**Rationale**:

- Keeps page load fast
- Maintains consistency with existing card hover effects
- Reduces complexity in initial implementation
- Can add scroll animations later if needed

**Planned Transitions**:

- Service card hover: Already implemented (`hover:shadow-lg transition-shadow`)
- Process step hover: Subtle scale or lift effect
- Trust factor hover: Optional gentle highlight
- Trust indicator: No hover effect (decorative only)

**Animation Timing**: Use Tailwind defaults (`transition-all duration-300`)

**Alternatives considered**:

- **Scroll animations** (AOS, Intersection Observer): Deferred to later enhancement
- **Complex icon animations**: Rejected - unnecessary for initial launch
- **Page transitions**: Already handled by Nuxt

## Implementation Priority

Based on feature spec priorities (P1 → P2 → P3):

1. **Phase 1A (P1)**: Service cards with delivery timeframes
2. **Phase 1B (P1)**: How It Works section with process steps
3. **Phase 2 (P2)**: Why Choose Us section with trust factors
4. **Phase 3 (P3)**: Trust indicator badges

## Testing Strategy

### Unit Tests (Vitest + Testing Library)

- Each new component tested in isolation
- Props validation
- i18n key rendering
- Accessibility checks (aria-label presence)

### Integration Tests

- Service page renders all sections
- Correct data flow from i18n to components
- Responsive behavior verification

### Visual Regression (Manual initially)

- Desktop, tablet, mobile viewports
- All 4 locales (ru, en, tr, kk)
- Light/dark mode compatibility (if theme exists)

### Accessibility Testing

- axe-core automated checks
- Keyboard navigation manual testing
- Screen reader testing (NVDA/VoiceOver sample check)

## Performance Considerations

**Bundle Size Impact**: Minimal

- No new dependencies
- Component code: ~3-4 KB total (estimated)
- Icons: Already loaded, no additional overhead

**Runtime Performance**: No concerns

- Static content rendering
- No API calls
- SSR-compatible

**SEO Impact**: Positive

- More semantic content
- Better heading structure
- Improved user engagement metrics expected

## Deployment Considerations

**Rollout Strategy**:

1. Deploy to staging with all service pages enhanced
2. Validate translations in all 4 locales
3. Check responsive behavior
4. Measure baseline metrics (time on page, conversion)
5. Deploy to production
6. Monitor analytics for 7 days
7. Measure success criteria from spec

**Rollback Plan**:

- Changes are additive (new components, extended layouts)
- Can remove new sections via quick code revert
- No database migrations required
- No API changes

**Translation Workflow**:

1. Create Russian content first (primary audience)
2. Professional translation to English, Turkish, Kazakh
3. Content review by native speakers
4. QA verification in all locales

## Open Questions (Resolved)

All clarifications from the spec have been addressed through research:

✅ **Variable delivery timeframes**: Use range format "X–Y дней" or "от X дней" for flexible services  
✅ **Different processes per service**: Single unified "How It Works" is sufficient per spec assumptions  
✅ **Trust metrics updates**: Content in i18n JSON files, easily updated without code changes  
✅ **Services without fixed price**: Display "По запросу" (On request) with delivery time as "Индивидуально" (Individual)

## References

- Existing codebase patterns: `app/components/features/services/`
- i18n documentation: `@nuxtjs/i18n` v10.1
- Icon library: `@nuxt/icon` with Iconify collections
- Tailwind CSS: `tailwindcss` v3.x (via `@nuxtjs/tailwindcss`)
- Accessibility: WCAG 2.1 AA standards

## Next Steps

Proceed to **Phase 1: Design & Contracts**

- Create data-model.md (content data structures)
- Create contracts/ (TypeScript interfaces)
- Create quickstart.md (development guide)
- Update cursor-agent context
