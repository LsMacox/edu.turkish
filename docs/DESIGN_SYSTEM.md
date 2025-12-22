# Design System Documentation

## Overview

edu.turkish uses a unified design token system for consistent UI across the application.
All design tokens are defined in `app/types/ui/tokens.ts` and should be used instead of hardcoded Tailwind classes.

## Key Principles

1. **Single Source of Truth** - All design values in `tokens.ts`
2. **Type-Safe Access** - TypeScript ensures correct token usage
3. **Semantic Naming** - Use meaning-based names (e.g., `success`, `error`) not visual names (`green`, `red`)

---

## Size System

### Unified Size Types

```typescript
// Standard size scale - use for most UI elements
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Size with 'none' option for disabling features
type SizeOptional = Size | 'none'

// Compact scale for form elements
type FormSize = 'sm' | 'md' | 'lg'
```

### Usage Examples

| Component | Size Prop Type |
|-----------|---------------|
| `BaseCard` | `SizeOptional` for padding/shadow |
| `BaseButton` | `FormSize` |
| `BaseIconBox` | `Size` |
| `BaseBadge` | `Size` |

---

## Color Tokens

### Semantic Colors

```typescript
type SemanticColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
```

### Extended Colors (for decorative elements)

```typescript
type ExtendedColor = SemanticColor | 'blue' | 'green' | 'emerald' | 'purple' | 'orange' | 'yellow'
```

### Available Mappings

| Import | Purpose |
|--------|---------|
| `semanticTextColors` | Text color classes (`text-primary`, etc.) |
| `semanticBgColors` | Background color classes |
| `semanticBadgeColors` | Badge variant colors |
| `extendedColorTokens` | Full color tokens with `bg`, `text`, `border`, `ring` |

---

## Border Tokens

### Semantic Borders

```typescript
import { borderColorClasses } from '~/types/ui'

// Use:
<div class="border border-success">...</div>  // Green border
<div class="border border-error">...</div>    // Red border
```

### Border Accent (Left Border)

```typescript
import { borderAccentClasses } from '~/types/ui'

// Instead of:
<div class="border-l-4 border-l-green-500">...</div>

// Use:
<div :class="borderAccentClasses.success">...</div>
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
| `size` | `'xs' \| 'sm' \| 'md'` | `'sm'` | Badge size |
| `variant` | `'solid' \| 'soft'` | `'solid'` | Visual style |

---

## Callout/Alert Boxes

Use callout tokens for info boxes with left border accent:

```vue
<template>
  <div :class="[calloutClasses.success.container, 'card-padding-sm']">
    <Icon name="ph:info" :class="calloutClasses.success.icon" />
    <p :class="calloutClasses.success.text">Good news message</p>
  </div>
</template>

<script setup>
import { calloutClasses } from '~/types/ui'
</script>
```

### Callout Colors

- `primary` - Brand color accent
- `success` - Green accent for positive messages
- `warning` - Yellow accent for warnings
- `error` - Red accent for errors
- `info` - Blue accent for information
- `neutral` - Gray accent for general info

---

## Ring Tokens

Use for focus states and selection indicators:

```vue
<template>
  <div :class="['avatar-md', ringClasses.default]">
    <img ... />
  </div>
</template>

<script setup>
import { ringClasses } from '~/types/ui'
</script>
```

### Available Rings

- `default` - Gray ring (for avatars)
- `primary` - Primary color ring (for selected states)
- `white` - White ring (for dark backgrounds)
- `success` - Green ring
- `error` - Red ring

---

## Spacing Tokens

### Component Spacing Classes

| CSS Class | Usage |
|-----------|-------|
| `space-component-{xs,sm,md,lg,xl}` | Vertical spacing between elements |
| `gap-component-{xs,sm,md,lg,xl}` | Grid/flex gaps |
| `mb-component-{xs,sm,md,lg,xl}` | Margin bottom |
| `mt-component-{xs,sm,md,lg,xl}` | Margin top |
| `pt-component-{xs,sm,md,lg,xl}` | Padding top |

### Card Padding

| CSS Class | Approximate Size |
|-----------|------------------|
| `card-padding-sm` | 12-16px |
| `card-padding` | 16-24px |
| `card-padding-lg` | 20-32px |
| `card-padding-xl` | 24-40px |

### Section Padding

| CSS Class | Usage |
|-----------|-------|
| `section-py-sm` | Compact sections |
| `section-py` | Default sections |
| `section-py-lg` | Spacious sections |
| `section-py-xl` | Hero sections |

---

## Typography Tokens

### Semantic Text Classes

| CSS Class | Usage |
|-----------|-------|
| `text-hero` | Page main headers |
| `text-section-title` | Section headers |
| `text-card-title` | Card titles |
| `text-body` | Body text |
| `text-body-sm` | Small text |

### Semantic Text Colors

| CSS Class | Usage |
|-----------|-------|
| `text-content` | Primary content text |
| `text-muted` | Secondary/description text |
| `text-meta` | Metadata (dates, counts) |
| `text-hint` | Subtle hints, placeholders |
| `text-disabled` | Disabled text |

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
<BaseStatusBadge icon="ph:check" color="success" size="sm" />

<div :class="[calloutClasses.success.container, 'card-padding-sm']">
  <p :class="calloutClasses.success.text">Success message</p>
</div>
```

---

## Component API Consistency

All base components with styling props follow this pattern:

| Prop | Type | Description |
|------|------|-------------|
| `padding` | `SizeOptional` | Internal padding |
| `shadow` | `SizeOptional` | Shadow depth |
| `rounded` | Varies | Border radius |
| `color` | `SemanticColor` | Color scheme |
| `size` | `Size` or `FormSize` | Component size |

---

## File Structure

```
app/types/ui/
├── common.ts         # Base types (Size, Color, shadows)
├── tokens.ts         # Unified design tokens (NEW)
├── spacing.ts        # Spacing type definitions
├── card.ts           # Card component types
├── button.ts         # Button component types
└── index.ts          # Re-exports all types
```
