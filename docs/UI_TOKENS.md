# UI Design System - Token Reference

## Overview

This document describes the semantic design tokens used in the edu.turkish project.
All tokens are defined in `/app/assets/css/components/` and extended through `tailwind.config.ts`.

---

## Color Tokens

### Text Colors (typography.css)

Use these instead of raw `text-gray-*` classes:

| Token | Tailwind Equivalent | Usage |
|-------|---------------------|-------|
| `text-content` | `text-gray-700` | Primary body text |
| `text-muted` | `text-gray-600` | Secondary content, descriptions |
| `text-meta` | `text-gray-500` | Metadata: dates, reading time |
| `text-hint` | `text-gray-400` | Subtle hints, placeholders |
| `text-disabled` | `text-gray-300` | Disabled/inactive text |

### Background Colors (typography.css)

Use these instead of raw `bg-gray-*` classes:

| Token | Tailwind Equivalent | Usage |
|-------|---------------------|-------|
| `bg-surface` | `bg-gray-50` | Cards, containers on white |
| `bg-surface-elevated` | `bg-gray-100` | Hover states, nested containers |
| `bg-surface-muted` | `bg-gray-200` | Inactive states, skeleton loaders |

---

## Shadow Tokens (shadows.css)

| Token | Usage |
|-------|-------|
| `shadow-elevated` | Hero images, prominent surfaces |
| `shadow-card` | Standard card elevation |
| `shadow-button` | Subtle button shadow |
| `shadow-card-interactive` | Card with hover effect |
| `shadow-button-lift` | Button with hover lift |
| `shadow-dropdown` | Dropdown menus |
| `shadow-floating` | Floating elements (WhatsApp, FABs) |
| `shadow-fixed` | Fixed bottom elements (sticky CTAs) |

---

## Spacing Tokens (spacing.css)

### Section Spacing

| Token | Usage |
|-------|-------|
| `section-py` | Standard section padding (default) |
| `section-py-sm` | Compact section padding |
| `section-py-lg` | Spacious section padding |

### Component Spacing

| Token | Usage |
|-------|-------|
| `space-component-{xs,sm,md,lg,xl}` | Vertical spacing (space-y) |
| `gap-component-{xs,sm,md,lg,xl}` | Horizontal/grid gaps |
| `mb-component-{xs,sm,md,lg,xl}` | Margin bottom |
| `mt-component-{xs,sm,md,lg,xl}` | Margin top |
| `pt-component-{xs,sm,md,lg,xl}` | Padding top |

### Card Padding

| Token | Usage |
|-------|-------|
| `card-padding-sm` | Compact card padding |
| `card-padding` | Standard card padding |
| `card-padding-lg` | Large card padding |
| `card-padding-xl` | Extra large card padding |

---

## Border Radius Tokens (tailwind.config.ts)

| Token | Size | Usage |
|-------|------|-------|
| `rounded-card` | 16px | Standard cards |
| `rounded-card-lg` | 24px | Large cards |
| `rounded-button` | 12px | Buttons, small cards |
| `rounded-badge` | 9999px | Pills, badges |
| `rounded-icon` | 8px | Icon containers |
| `rounded-responsive` | responsive | 12px on mobile, 16px on desktop |
| `rounded-responsive-lg` | responsive | 16px on mobile, 24px on desktop |

---

## Transition Tokens (transitions.css)

| Token | Duration | Usage |
|-------|----------|-------|
| `transition-default` | 300ms | Standard transitions |
| `transition-default-fast` | 200ms | Fast transitions |
| `transition-color` | 200ms | Color-only transitions |
| `transition-scale` | 300ms | Transform/scale transitions |

---

## Typography Tokens (typography.css)

### Headlines

| Token | Usage |
|-------|-------|
| `text-hero` | Page H1 titles |
| `text-hero-subtitle` | Hero section subtitles |
| `text-section-title` | Section H2 titles |
| `text-section-subtitle` | Section subtitles |

### Cards

| Token | Usage |
|-------|-------|
| `text-card-title` | Card headings |
| `text-card-subtitle` | Card subheadings |
| `text-card-body` | Card body text |

### Body

| Token | Usage |
|-------|-------|
| `text-body-lg` | Large body text |
| `text-body` | Standard body text |
| `text-body-sm` | Small body text |

---

## Icon Tokens (icons.css)

### Containers (Circular)

| Token | Size | Usage |
|-------|------|-------|
| `icon-container-sm` | 48px | Small icon containers |
| `icon-container-md` | 64px | Medium icon containers |
| `icon-container-lg` | 80px | Large icon containers |
| `icon-container-xl` | 96px | Extra large containers |

### Boxes (Squared)

| Token | Size | Usage |
|-------|------|-------|
| `icon-box-sm` | 48px | Small icon boxes |
| `icon-box-md` | 64px | Medium icon boxes |
| `icon-box-lg` | 80px | Large icon boxes |
| `icon-box-xl` | 96px | Extra large boxes |

### Icon Font Sizes

| Token | Size | Usage |
|-------|------|-------|
| `text-icon-xs` | 12px | Inline, badges |
| `text-icon-sm` | 16px | Buttons |
| `text-icon` | 20px | Default |
| `text-icon-lg` | 24px | Cards |
| `text-icon-xl` | 30px | Features |
| `text-icon-2xl` | 36px | Section headers |
| `text-icon-3xl` | 48px | Hero icons |

---

## Hover Effects (useHoverEffects.ts)

Import from `useHoverEffects.ts`:

```typescript
import { IMAGE_HOVER_CLASSES, TEXT_HOVER_CLASSES, CARD_HOVER_CLASSES } from '~/composables/useHoverEffects'
```

| Constant | Usage |
|----------|-------|
| `IMAGE_HOVER_CLASSES` | Scale effect on images in `.group` |
| `TEXT_HOVER_CLASSES` | Color transition on titles in `.group` |
| `CARD_HOVER_CLASSES.lift` | Lift effect for cards |
| `CARD_HOVER_CLASSES.shadow` | Shadow-only effect |
| `CARD_HOVER_CLASSES.scale` | Scale effect |

---

## Best Practices

### ✅ Do

- Use semantic tokens instead of raw Tailwind classes
- Use `text-meta` instead of `text-gray-500`
- Use `bg-surface` instead of `bg-gray-50`
- Use `shadow-card` instead of `shadow-md`
- Import hover effects from `useHoverEffects.ts`

### ❌ Don't

- Don't use raw `text-gray-*` classes in feature components
- Don't use raw `bg-gray-*` classes for backgrounds
- Don't write inline shadows like `shadow-[...]`
- Don't define inline hover transitions - use tokens
