# Design System Documentation

## Overview

edu.turkish uses a unified design token system for consistent UI across the application.
- **Types** are defined in `app/types/ui/`
- **Token implementations** (class mappings) are in `app/composables/ui/tokens/`

## Key Principles

1. **Single Source of Truth** - Types in `types/ui/`, implementations in `composables/ui/tokens/`
2. **Type-Safe Access** - TypeScript ensures correct token usage
3. **Semantic Naming** - Use meaning-based names (e.g., `success`, `error`) not visual names (`green`, `red`)

---

## Size System

### Size Types (from `types/ui/common.ts`)

```typescript
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type Size5 = Exclude<Size, '2xl'>           // xs-xl (5 sizes)
type Size3 = 'sm' | 'md' | 'lg'             // 3-size scale
type SizeCompact = 'xs' | 'sm' | 'md'       // Compact scale
type StatusSize = 'xs' | 'sm' | 'md'        // Status badges
type FormSize = 'sm' | 'md' | 'lg'          // Form elements
type WithNone<T> = T | 'none'               // Adds 'none' option
```

### Usage Examples

| Component | Size Prop Type |
|-----------|---------------|
| `BaseCard` | `WithNone<Size5>` for padding/shadow |
| `BaseButton` | `Size5` |
| `BaseIconButton` | `Size5` |
| `BaseIconBox` | `Size5` |
| `BaseBadge` | `Size5` |
| `BaseStatusBadge` | `SizeCompact` |
| `BaseSection` | `Size3 \| 'xl'` |

---

## Color Tokens

### Semantic Colors

```typescript
type SemanticColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
```

### Status Colors (for status badges, callouts)

```typescript
type StatusColor = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
```

### Available Mappings (from `composables/ui/tokens/colors.ts`)

| Import | Purpose |
|--------|---------|
| `SEMANTIC_TEXT_COLORS` | Text color classes (`text-primary`, etc.) |
| `SEMANTIC_BG_COLORS` | Solid background classes |
| `SEMANTIC_BG_SOFT_COLORS` | Soft/light background classes |
| `SEMANTIC_BADGE_COLORS` | Badge colors by variant (solid/soft/outline/gradient) |
| `SEMANTIC_COLOR_TOKENS` | Full color tokens with `bg`, `bgSoft`, `border`, `text`, `solid`, `ring` |

---

## Border Tokens

### Border Color Types

```typescript
type BorderColor = 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error' | 'info'
```

### Semantic Borders (from `composables/ui/tokens/borders.ts`)

```vue
<script setup>
import { BORDER_COLOR_CLASSES } from '~/composables/ui/tokens'
</script>

<template>
  <div :class="['border', BORDER_COLOR_CLASSES.success]">...</div>
</template>
```

### Border Accent (Left Border)

```vue
<script setup>
import { BORDER_ACCENT_CLASSES } from '~/composables/ui/tokens'
</script>

<template>
  <!-- Instead of: border-l-4 border-l-green-500 -->
  <div :class="BORDER_ACCENT_CLASSES.success">...</div>
</template>
```

---

## Status Badge Component

Use `BaseStatusBadge` for check marks, numbered indicators, and status icons.

```vue
<template>
  <!-- Check mark -->
  <BaseStatusBadge icon="ph:check" color="success" />
  
  <!-- Number badge -->
  <BaseStatusBadge text="1" color="primary" />
  
  <!-- Soft variant (light background) -->
  <BaseStatusBadge icon="mdi:info" color="info" variant="soft" />
</template>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string` | - | Icon name |
| `text` | `string` | - | Text content |
| `color` | `StatusColor` | `'success'` | Color scheme |
| `size` | `SizeCompact` (`'xs' \| 'sm' \| 'md'`) | `'sm'` | Badge size |
| `variant` | `'solid' \| 'soft'` | `'solid'` | Visual style |

### Programmatic Usage

```typescript
import { getStatusBadgeClasses } from '~/composables/ui/tokens'

const classes = getStatusBadgeClasses('success', 'sm', 'solid')
// Returns: { container: '...', icon: '...' }
```

---

## Callout/Alert Boxes

Use `CALLOUT_CLASSES` for info boxes with left border accent:

```vue
<script setup>
import { CALLOUT_CLASSES } from '~/composables/ui/tokens'
</script>

<template>
  <div :class="[CALLOUT_CLASSES.success.container, 'card-padding-sm']">
    <Icon name="ph:info" :class="CALLOUT_CLASSES.success.icon" />
    <p :class="CALLOUT_CLASSES.success.text">Good news message</p>
  </div>
</template>
```

### Callout Colors (`CalloutColor`)

- `primary` - Brand color accent
- `success` - Green accent for positive messages
- `warning` - Yellow accent for warnings
- `error` - Red accent for errors
- `info` - Blue accent for information
- `neutral` - Gray accent for general info

---

## Ring Tokens

Use `RING_CLASSES` for focus states and selection indicators:

```vue
<script setup>
import { RING_CLASSES } from '~/composables/ui/tokens'
</script>

<template>
  <div :class="['avatar-md', RING_CLASSES.default]">
    <img ... />
  </div>
</template>
```

### Available Rings (`RingColor`)

- `default` - Gray ring (for avatars)
- `primary` - Primary color ring (for selected states)
- `white` - White ring (for dark backgrounds)
- `success` - Green ring
- `error` - Red ring

---

## Shadow Tokens

### Semantic Shadows

```typescript
type ShadowSemantic = 'none' | 'button' | 'card' | 'elevated' | 'hover'
```

### Usage (from `composables/ui/tokens/colors.ts`)

```vue
<script setup>
import { SEMANTIC_SHADOW_CLASSES, SEMANTIC_SHADOW_INTERACTIVE } from '~/composables/ui/tokens'
</script>

<template>
  <!-- Static shadow -->
  <div :class="SEMANTIC_SHADOW_CLASSES.card">...</div>
  
  <!-- Interactive with hover -->
  <div :class="SEMANTIC_SHADOW_INTERACTIVE.card">...</div>
</template>
```

### Size-based Shadows

```typescript
import { SHADOW_SIZE_MAP } from '~/composables/ui/tokens'

// SHADOW_SIZE_MAP: none | xs | sm | md | lg | xl
```

---

## Spacing Tokens

### Component Spacing Classes (from `composables/ui/tokens/spacing.ts`)

| Constant | CSS Classes |
|----------|-------------|
| `COMPONENT_SPACE_CLASSES` | `space-component-{xs,sm,md,lg,xl}` |
| `COMPONENT_GAP_CLASSES` | `gap-component-{xs,sm,md,lg,xl}` |
| `COMPONENT_MB_CLASSES` | `mb-component-{xs,sm,md,lg,xl}` |
| `COMPONENT_MT_CLASSES` | `mt-component-{xs,sm,md,lg,xl}` |
| `COMPONENT_PT_CLASSES` | `pt-component-{xs,sm,md,lg,xl}` |

### Card Padding

| Constant | CSS Classes |
|----------|-------------|
| `CARD_PADDING_CLASSES` | `card-padding-xs`, `card-padding-sm`, `card-padding`, `card-padding-lg`, `card-padding-xl` |

### Section Padding

| Constant | CSS Classes |
|----------|-------------|
| `SECTION_PADDING_CLASSES` | `section-py-sm`, `section-py`, `section-py-lg`, `section-py-xl` |

---

## Typography Tokens

### Semantic Text Classes (from `composables/ui/tokens/typography.ts`)

| Typography Map | Sizes | Properties |
|----------------|-------|------------|
| `HERO_TYPOGRAPHY` | default | `title`, `subtitle` |
| `SECTION_TYPOGRAPHY_MAP` | sm, md, lg | `title`, `subtitle` |
| `CARD_TYPOGRAPHY_MAP` | sm, md, lg | `title`, `subtitle`, `body` |
| `BODY_TYPOGRAPHY_MAP` | sm, md, lg | `text` |
| `LABEL_TYPOGRAPHY_MAP` | sm, md, lg | `text` |

### Example CSS Classes

| CSS Class | Usage |
|-----------|-------|
| `text-hero` | Page main headers |
| `text-section-title` | Section headers (md) |
| `text-section-title-sm/lg` | Section headers (sm/lg) |
| `text-card-title` | Card titles |
| `text-body` | Body text |
| `text-body-sm` | Small text |

### Semantic Text Colors (`SEMANTIC_TEXT_CLASSES`)

| CSS Class | Usage |
|-----------|-------|
| `text-content` | Primary content text |
| `text-muted` | Secondary/description text |
| `text-meta` | Metadata (dates, counts) |
| `text-hint` | Subtle hints, placeholders |
| `text-disabled` | Disabled text |

---

## Rounded Tokens

### Rounded Types (from `types/ui/common.ts`)

```typescript
type Rounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
type CardRounded = Rounded
type FormRounded = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
type ButtonRounded = Rounded | 'button'
```

### Custom Border Radius (from `tailwind.config.ts`)

| Class | Value | Usage |
|-------|-------|-------|
| `rounded-card` | 16px | Standard card radius |
| `rounded-card-lg` | 24px | Large cards |
| `rounded-card-inner` | 14px | Inner card elements |
| `rounded-button` | 12px | Button radius |
| `rounded-badge` | 9999px | Pill/badge radius |
| `rounded-icon` | 8px | Icon containers |

---

## Migration Guide

### Before (Hardcoded)

```vue
<div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
  <Icon name="ph:check" class="text-white text-icon-xs" />
</div>

<div class="border-l-4 border-green-500 bg-green-50 p-4">
  <p class="text-green-800">Success message</p>
</div>
```

### After (Using Tokens)

```vue
<script setup>
import { CALLOUT_CLASSES } from '~/composables/ui/tokens'
</script>

<template>
  <BaseStatusBadge icon="ph:check" color="success" size="sm" />

  <div :class="[CALLOUT_CLASSES.success.container, 'card-padding-sm']">
    <p :class="CALLOUT_CLASSES.success.text">Success message</p>
  </div>
</template>
```

---

## Component API Consistency

### BaseCard Props

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `'default' \| 'surface' \| 'bordered'` | Card style |
| `padding` | `WithNone<Size5>` | Internal padding |
| `shadow` | `WithNone<Size5> \| ShadowSemantic` | Shadow depth |
| `rounded` | `CardRounded` | Border radius |
| `hover` | `boolean \| 'lift' \| 'shadow' \| 'scale'` | Hover effect |

### BaseButton Props

| Prop | Type | Description |
|------|------|-------------|
| `variant` | `ButtonVariant` | Button style (primary, secondary, ghost, etc.) |
| `size` | `Size5` | Button size |
| `rounded` | `ButtonRounded` | Border radius |

### BaseBadge Props

| Prop | Type | Description |
|------|------|-------------|
| `color` | `SemanticColor` | Badge color |
| `size` | `Size5` | Badge size |
| `variant` | `'solid' \| 'soft' \| 'outline' \| 'gradient'` | Visual style |

### BaseSection Props

| Prop | Type | Description |
|------|------|-------------|
| `padding` | `Size3 \| 'xl'` | Vertical padding |
| `bg` | `SectionBackground` | Background style |
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '4xl' \| '6xl' \| 'full'` | Container max width |

---

## File Structure

```
app/types/ui/
├── common.ts              # Base types (Size, Color, Rounded, Shadow)
├── tokens.ts              # Token type definitions (BorderColor, StatusColor, etc.)
├── components/            # Component-specific types
│   ├── alert.ts
│   ├── badge.ts
│   ├── button.ts
│   ├── card.ts
│   ├── feature-card.ts
│   ├── form.ts
│   ├── grid.ts
│   ├── list.ts
│   ├── navigation.ts
│   ├── section.ts
│   ├── sidebar.ts
│   ├── table.ts
│   ├── text.ts
│   └── timeline.ts
└── index.ts               # Re-exports all types

app/composables/ui/tokens/
├── borders.ts             # BORDER_COLOR_CLASSES, BORDER_ACCENT_CLASSES
├── colors.ts              # SEMANTIC_*_COLORS, SEMANTIC_COLOR_TOKENS
├── shadows.ts             # SHADOW_SIZE_MAP
├── spacing.ts             # COMPONENT_*_CLASSES, CARD/SECTION_PADDING_CLASSES
├── status.ts              # CALLOUT_CLASSES, RING_CLASSES, ALERT_COLORS, getStatusBadgeClasses()
├── typography.ts          # *_TYPOGRAPHY_MAP, SEMANTIC_TEXT_CLASSES
├── variants.ts            # ICON_BUTTON_VARIANT_CLASSES
└── index.ts               # Re-exports all tokens
```
