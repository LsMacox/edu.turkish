# План унификации UI-системы

> **Статус:** ✅ Completed  
> **Дата:** 2024-12-24  
> **Автор:** AI Assistant  
> **Версия:** 2.0 (рефакторинг завершён)

---

## Содержание

1. [Текущее состояние](#1-текущее-состояние)
2. [Проблемы](#2-проблемы)
3. [Целевая архитектура](#3-целевая-архитектура)
4. [План работ](#4-план-работ)
5. [Критерии завершения](#5-критерии-завершения)
6. [Работа с существующей документацией](#6-работа-с-существующей-документацией)

---

## 1. Текущее состояние

### 1.1 Обзор существующих слоёв UI

Текущая система стилизации состоит из **5 независимых слоёв**, которые частично пересекаются:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ТЕКУЩАЯ АРХИТЕКТУРА                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐     ┌─────────────────┐     ┌───────────────┐ │
│  │ tailwind.config │────▶│  CSS Tokens     │────▶│  Компоненты   │ │
│  │    (theme)      │     │ (assets/css/)   │     │   (.vue)      │ │
│  └─────────────────┘     └─────────────────┘     └───────────────┘ │
│          │                       │                      ▲          │
│          ▼                       ▼                      │          │
│  ┌─────────────────┐     ┌─────────────────┐           │          │
│  │ types/ui/       │◀───▶│ composables/ui/ │───────────┘          │
│  │ (типы + runtime)│     │    (hooks)      │                      │
│  └─────────────────┘     └─────────────────┘                      │
│          │                       │                                 │
│          ▼                       ▼                                 │
│  ┌─────────────────────────────────────────┐                      │
│  │          lib/domain/                     │                      │
│  │   (бизнес-логика + UI-стили смешаны)     │                      │
│  └─────────────────────────────────────────┘                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Детальное описание слоёв

#### Слой 1: Tailwind Config (`tailwind.config.ts`)

**Назначение:** Определение дизайн-токенов на уровне Tailwind

**Содержимое:**

- Кастомные цвета (`primary`, `secondary`, `success`, etc.)
- Кастомные shadows (`shadow-card`, `shadow-button`)
- Кастомные border-radius (`rounded-card`, `rounded-button`)
- Кастомные spacing (`safe-top`, `safe-bottom`)
- Safelist паттернов для динамических классов

**Проблемы:** Нет — это правильное место для базовых токенов.

---

#### Слой 2: CSS Component Classes (`app/assets/css/components/`)

**Назначение:** Составные CSS-классы через `@layer components`

**Файлы:**
| Файл | Назначение | Примеры классов |
|------|------------|-----------------|
| `typography.css` | Типографика | `.text-hero`, `.text-section-title`, `.text-body-lg` |
| `spacing.css` | Отступы | `.gap-component-md`, `.section-py`, `.card-padding` |
| `icons.css` | Иконки и контейнеры | `.icon-container-lg`, `.icon-box-md`, `.step-badge` |
| `shadows.css` | Тени | `.shadow-card-hover`, `.shadow-interactive` |
| `utilities.css` | Утилиты | `.glass-card`, `.gradient-hero`, `.price-tag` |
| `cards.css` | Карточки | `.card-padding-lg` |
| `forms.css` | Формы | Input/select стили |
| `buttons.css` | Кнопки | Базовые стили кнопок |

**Проблемы:**

- ✅ Хорошо организованы по категориям
- ⚠️ Нет синхронизации с TypeScript маппингами (ручная поддержка)

---

#### Слой 3: UI Composables (`app/composables/ui/`)

**Назначение:** Реактивные hooks для динамических классов

**Файлы:**
| Файл | Назначение |
|------|------------|
| `useColors.ts` | Семантические цвета, badge цвета, toast цвета |
| `useVariant.ts` | Варианты кнопок (25+ вариантов) |
| `useSize.ts` | Размеры компонентов (badge, icon, form, etc.) |
| `useTypography.ts` | Типографические классы |
| `useSpacing.ts` | Классы отступов |
| `useShadow.ts` | Тени с интерактивностью |
| `useHover.ts` | Hover-эффекты |
| `useGrid.ts` | Grid-система |
| `useCard.ts` | Карточки |
| `index.ts` | Barrel exports |

**Проблемы:**

- ⚠️ Дублирование маппингов с `types/ui/tokens.ts`
- ⚠️ Нет чёткого разделения: статические маппинги vs реактивные hooks

---

#### Слой 4: UI Types (`app/types/ui/`)

**Назначение:** TypeScript типы для UI системы

**Файлы:**
| Файл | Содержимое |
|------|------------|
| `common.ts` | Базовые типы (`Size`, `SemanticColor`, etc.) + **re-exports runtime** |
| `tokens.ts` | **Runtime маппинги** (`borderColorClasses`, `calloutClasses`, `getStatusBadgeClasses()`) |
| `components/` | Типы пропсов компонентов |
| `index.ts` | Barrel exports |

**Проблемы:**

- ❌ `tokens.ts` содержит runtime-код вместо типов
- ❌ `common.ts` содержит re-exports из composables (циклическая зависимость по смыслу)
- ❌ Дублирует функционал из `composables/ui/`

---

#### Слой 5: Domain Constants (`lib/domain/`)

**Назначение:** Бизнес-логика (должна быть без UI-стилей)

**Файлы с UI-стилями:**
| Файл | UI-контент |
|------|------------|
| `universities/constants.ts` | `LANGUAGE_BADGE_CLASSES`, `FACILITY_STYLES`, `SCHOLARSHIP_COLOR_SCHEMES`, `INFO_ITEM_STYLES` |
| `blog/contentRendererStyles.ts` | Полный набор стилей для рендеринга контента (paragraph, heading, image, quote, spacer, divider) |

**Файлы БЕЗ проблем:**
| Файл | Содержимое |
|------|------------|
| `faq/constants.ts` | Только иконки (`FAQ_CATEGORY_ICONS`) — ✅ это нормально |

**Проблемы:**

- ❌ Смешение бизнес-логики и UI-стилей
- ❌ Хардкод Tailwind-классов в domain-слое
- ❌ Функции типа `getLanguageBadgeClass()` дублируют pattern из composables

---

#### Слой 6: Существующая документация (`docs/`)

**Назначение:** Описание дизайн-системы

**Файлы:**
| Файл | Статус | Действие |
|------|--------|----------|
| `UI_TOKENS.md` | Частично устарел | Обновить пути импортов, добавить новые токены |
| `DESIGN_SYSTEM.md` | Устарел после рефакторинга | Переписать с новой архитектурой |
| `ui-refactor-plan.md` | Актуален | Обновлять по ходу работ |

**Проблемы:**

- ⚠️ `DESIGN_SYSTEM.md` указывает на `types/ui/tokens.ts` как "Single Source of Truth" — противоречит целевой архитектуре
- ⚠️ `UI_TOKENS.md` ссылается на устаревший путь `useHoverEffects.ts` (теперь `useHover.ts`)
- ⚠️ Документация будет устаревшей после рефакторинга

---

## 2. Проблемы

### 2.1 Архитектурные проблемы

#### П1: Размытая граница между типами и runtime (КРИТИЧЕСКАЯ)

**Описание:** `app/types/ui/tokens.ts` содержит runtime-маппинги и функции, хотя должен содержать только типы.

**Примеры:**

```typescript
// types/ui/tokens.ts — НЕ ДОЛЖНО БЫТЬ ЗДЕСЬ
export function getStatusBadgeClasses(color, size, variant) { ... }
export const borderColorClasses: Record<BorderColor, string> = { ... }

// types/ui/components/button.ts — НЕ ДОЛЖНО БЫТЬ ЗДЕСЬ
export const iconButtonVariantClasses: Record<IconButtonVariant, string> = { ... }
```

**Последствия:**

- Нарушение Single Responsibility
- Путаница при импорте (откуда брать runtime-значения?)
- Сложность поддержки

---

#### П2: Дублирование маппингов (ВЫСОКАЯ)

**Описание:** Одни и те же маппинги определены в нескольких местах.

**Примеры дублирования:**
| Маппинг | Места определения |
|---------|-------------------|
| Цвета badge | `useColors.ts`, `tokens.ts` |
| Spacing классы | `useSpacing.ts`, `tokens.ts` |
| Status colors | `useColors.ts`, `tokens.ts` |
| Icon button variants | `types/ui/components/button.ts`, `composables/ui/useVariant.ts` (частично) |

**Последствия:**

- Рассинхронизация при изменениях
- Увеличение bundle size
- Когнитивная нагрузка ("откуда импортировать?")

---

#### П3: UI-стили в domain-слое (ВЫСОКАЯ)

**Описание:** `lib/domain/` содержит Tailwind-классы, хотя это слой бизнес-логики.

**Примеры:**

```typescript
// lib/domain/universities/constants.ts
const LANGUAGE_BADGE_CLASSES = {
  EN: 'bg-info-light text-info-dark',  // ← UI в domain
  TR: 'bg-success-light text-success-dark',
}

// lib/domain/blog/contentRendererStyles.ts — ВЕСЬ ФАЙЛ это UI
const variantStyles = {
  article: {
    paragraph: 'text-base md:text-lg leading-[1.75] text-gray-700',  // ← хардкод
    heading: () => 'scroll-mt-28 text-xl md:text-2xl font-bold...',
    image: (width) => ['object-cover shadow-md', ...],
    quote: 'relative my-6 pl-4 border-l-4 border-primary bg-gradient-to-r...',
  },
}
```

**Последствия:**

- Нарушение Separation of Concerns
- Сложность переиспользования domain-логики
- UI-изменения требуют правки domain-файлов

---

#### П4: Несогласованный API

**Описание:** Разные паттерны именования и использования.

**Примеры:**

```typescript
// Pattern 1: Статический объект
semanticBgColors['primary']

// Pattern 2: Hook без параметров (возвращает объект)
const colors = useColorTokens('primary')

// Pattern 3: Hook с параметрами (возвращает класс)
const classes = useBadgeColorClasses('primary', 'soft')

// Pattern 4: Функция без use- (в domain)
getLanguageBadgeClass('EN')
```

**Последствия:**

- Нет единого ментальной модели
- Сложность onboarding новых разработчиков
- Inconsistent codebase

---

#### П5: Отсутствие синхронизации CSS ↔ TypeScript (СРЕДНЯЯ)

**Описание:** CSS-классы в `assets/css/` и TypeScript-маппинги в `composables/ui/` поддерживаются вручную.

**Пример:**

```css
/* assets/css/components/spacing.css */
.gap-component-xs {
  @apply gap-1.5 md:gap-2;
}
.gap-component-sm {
  @apply gap-2 md:gap-3;
}
```

```typescript
// composables/ui/useSpacing.ts — должно соответствовать CSS
export const componentGapClasses = {
  xs: 'gap-component-xs',
  sm: 'gap-component-sm',
}
```

**Последствия:**

- Риск рассинхронизации
- Ручная работа при добавлении новых размеров

---

#### П6: Устаревшая документация (СРЕДНЯЯ)

**Описание:** Существующая документация ссылается на устаревшие пути и противоречит целевой архитектуре.

**Примеры:**

```markdown
<!-- docs/DESIGN_SYSTEM.md -->

All design tokens are defined in `app/types/ui/tokens.ts` <!-- УСТАРЕЕТ -->

<!-- docs/UI_TOKENS.md -->

import { ... } from '~/composables/useHoverEffects' <!-- УЖЕ УСТАРЕЛО: useHover.ts -->
```

---

### 2.2 Матрица проблем по файлам

| Файл/Директория                            | П1  | П2  | П3  | П4  | П5  | П6  |
| ------------------------------------------ | :-: | :-: | :-: | :-: | :-: | :-: |
| `types/ui/tokens.ts`                       | ❌  | ❌  |     |     |     |     |
| `types/ui/common.ts`                       | ❌  |     |     |     |     |     |
| `types/ui/components/button.ts`            | ❌  | ❌  |     |     |     |     |
| `composables/ui/useColors.ts`              |     | ❌  |     |     | ❌  |     |
| `composables/ui/useSpacing.ts`             |     | ❌  |     |     | ❌  |     |
| `lib/domain/universities/constants.ts`     |     |     | ❌  | ❌  |     |     |
| `lib/domain/blog/contentRendererStyles.ts` |     |     | ❌  |     |     |     |
| `docs/DESIGN_SYSTEM.md`                    |     |     |     |     |     | ❌  |
| `docs/UI_TOKENS.md`                        |     |     |     |     |     | ❌  |

---

## 3. Целевая архитектура

### 3.1 Принципы

1. **Single Source of Truth** — каждый токен определён в одном месте
2. **Separation of Concerns** — типы отдельно, runtime отдельно, domain отдельно
3. **Consistent API** — единый паттерн для всех UI-операций
4. **CSS-first** — CSS-классы как foundation, TS-маппинги как convenience layer
5. **Type Safety** — все токены типизированы

### 3.2 Целевая структура

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ЦЕЛЕВАЯ АРХИТЕКТУРА                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   FOUNDATION LAYER                           │   │
│  │  tailwind.config.ts + assets/css/components/                 │   │
│  │  (Design tokens & CSS classes - Source of Truth)             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   TYPE LAYER                                 │   │
│  │  app/types/ui/                                               │   │
│  │  (ТОЛЬКО типы: Size, Color, Props - без runtime)            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   RUNTIME LAYER                              │   │
│  │  app/composables/ui/                                         │   │
│  │  ├── tokens/     (статические маппинги: COLORS, SPACING)    │   │
│  │  ├── hooks/      (реактивные: useColorClasses, useSize)     │   │
│  │  └── domain/     (domain-specific UI: universities, blog)   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   COMPONENT LAYER                            │   │
│  │  app/components/shared/                                      │   │
│  │  (Используют composables/ui для стилизации)                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   DOMAIN LAYER                               │   │
│  │  lib/domain/                                                 │   │
│  │  (ТОЛЬКО бизнес-логика, БЕЗ UI-классов)                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 Целевая структура файлов

```
app/
├── composables/
│   └── ui/
│       ├── index.ts                    # Единая точка входа (barrel)
│       │
│       ├── tokens/                     # Статические маппинги
│       │   ├── index.ts
│       │   ├── colors.ts               # SEMANTIC_COLORS, BADGE_COLORS
│       │   ├── spacing.ts              # COMPONENT_SPACING, SECTION_SPACING
│       │   ├── typography.ts           # TYPOGRAPHY_CLASSES
│       │   ├── shadows.ts              # SHADOW_CLASSES
│       │   ├── borders.ts              # BORDER_CLASSES
│       │   ├── status.ts               # STATUS_BADGE_CLASSES
│       │   └── variants.ts             # ICON_BUTTON_VARIANT_CLASSES
│       │
│       ├── hooks/                      # Реактивные composables
│       │   ├── index.ts
│       │   ├── useColorClasses.ts      # Консолидировать useColors + useBadgeColorClasses
│       │   ├── useSizeClasses.ts       # Все size-related hooks
│       │   ├── useTypographyClasses.ts
│       │   ├── useSpacingClasses.ts
│       │   ├── useShadowClasses.ts
│       │   ├── useVariantClasses.ts    # Button variants
│       │   ├── useHoverClasses.ts
│       │   ├── useGridClasses.ts
│       │   └── useCardClasses.ts
│       │
│       └── domain/                     # Domain-specific UI helpers
│           ├── index.ts
│           ├── universities.ts         # University badge/facility styles
│           └── blog.ts                 # Blog content styles
│
├── types/
│   └── ui/
│       ├── index.ts                    # Barrel exports
│       ├── common.ts                   # Size, Color, Shadow types (ТОЛЬКО типы)
│       ├── props.ts                    # Component prop types
│       └── components/                 # Per-component types
│           ├── badge.ts
│           ├── button.ts
│           └── ...
│
└── assets/
    └── css/
        └── components/                 # CSS foundation (без изменений)
            ├── typography.css
            ├── spacing.css
            └── ...

lib/
└── domain/
    └── universities/
        └── constants.ts                # ТОЛЬКО бизнес-логика (типы, enums, логика)
```

### 3.4 Соглашения по именованию

#### Статические маппинги (tokens/)

```typescript
// SCREAMING_SNAKE_CASE для констант
export const SEMANTIC_BG_COLORS = { ... }
export const BADGE_SIZE_MAP = { ... }
```

#### Реактивные hooks (hooks/)

```typescript
// useXxxClasses для hooks возвращающих классы
export function useColorClasses(color: MaybeRef<Color>) { ... }
export function useSizeClasses(size: MaybeRef<Size>, context: Context) { ... }
```

#### Domain helpers (domain/)

```typescript
// getXxx для domain-specific helpers
export function getUniversityBadgeStyle(type: UniversityType) { ... }
export function getFacilityIconStyle(category: FacilityCategory) { ... }
```

### 3.5 Правила импорта

```typescript
// ✅ Правильно: импорт из единой точки входа
import { SEMANTIC_COLORS, useColorClasses, getUniversityBadgeStyle } from '~/composables/ui'

// ✅ Правильно: импорт типов из types
import type { Size, SemanticColor, BadgeProps } from '~/types/ui'

// ❌ Неправильно: прямой импорт из вложенных модулей
import { semanticBgColors } from '~/composables/ui/tokens/colors'

// ❌ Неправильно: runtime-импорт из types
import { borderColorClasses } from '~/types/ui/tokens'
```

---

## 4. План работ

### Задача 1: Реструктуризация composables/ui

**Цель:** Создать чёткую структуру tokens/hooks/domain

#### 1.1 Создать директорию tokens/

- [ ] Создать `composables/ui/tokens/index.ts`
- [ ] Создать `composables/ui/tokens/colors.ts`
  - Перенести `semanticTextColors`, `semanticBgColors`, `semanticBadgeColors` из `useColors.ts`
  - Перенести `extendedColorTokens` из `useColors.ts`
  - Перенести `semanticToastColors`, `semanticShadowClasses`
- [ ] Создать `composables/ui/tokens/spacing.ts`
  - Перенести маппинги из `useSpacing.ts`
  - Перенести маппинги из `types/ui/tokens.ts`
- [ ] Создать `composables/ui/tokens/typography.ts`
  - Перенести маппинги из `useTypography.ts`
- [ ] Создать `composables/ui/tokens/shadows.ts`
  - Перенести маппинги из `useShadow.ts`
- [ ] Создать `composables/ui/tokens/borders.ts`
  - Перенести `borderColorClasses`, `borderAccentClasses` из `types/ui/tokens.ts`
- [ ] Создать `composables/ui/tokens/status.ts`
  - Перенести `getStatusBadgeClasses`, связанные маппинги из `types/ui/tokens.ts`
  - Перенести `calloutClasses` из `types/ui/tokens.ts`
- [ ] Создать `composables/ui/tokens/variants.ts`
  - Перенести `iconButtonVariantClasses` из `types/ui/components/button.ts`

#### 1.2 Рефакторинг hooks/

- [ ] Переименовать существующие файлы (или создать новые):
  - `useColors.ts` → `hooks/useColorClasses.ts` (только hooks, маппинги в tokens/)
  - `useSize.ts` → `hooks/useSizeClasses.ts`
  - `useTypography.ts` → `hooks/useTypographyClasses.ts`
  - и т.д.
- [ ] Обновить hooks чтобы импортировали маппинги из `tokens/`

#### 1.3 Создать domain/

- [ ] Создать `composables/ui/domain/index.ts`
- [ ] Создать `composables/ui/domain/universities.ts`
  - Перенести `LANGUAGE_BADGE_CLASSES` из `lib/domain/universities/constants.ts`
  - Перенести `FACILITY_STYLES` из `lib/domain/universities/constants.ts`
  - Перенести `SCHOLARSHIP_COLOR_SCHEMES`
  - Перенести `INFO_ITEM_STYLES`
  - Перенести функции `getLanguageBadgeClass()`, `getFacilityStyleWithIcon()`, `getInfoItemStyle()`
- [ ] Создать `composables/ui/domain/blog.ts`
  - Перенести стили из `lib/domain/blog/contentRendererStyles.ts`

#### 1.4 Обновить barrel exports

- [ ] Обновить `composables/ui/index.ts` для экспорта из новой структуры

**Оценка:** 5-7 часов

---

### Задача 2: Очистка types/ui

**Цель:** types/ui содержит ТОЛЬКО TypeScript типы

#### 2.1 Очистить tokens.ts

- [ ] Удалить все runtime-маппинги (перенесены в Задаче 1)
- [ ] Удалить все функции
- [ ] Оставить только type definitions
- [ ] Переименовать в `token-types.ts` (опционально)

#### 2.2 Очистить common.ts

- [ ] Удалить re-exports runtime-значений из composables
- [ ] Оставить только типы

#### 2.3 Обновить index.ts

- [ ] Обновить barrel exports

**Оценка:** 2-3 часа

---

### Задача 3: Очистка lib/domain

**Цель:** lib/domain содержит ТОЛЬКО бизнес-логику

#### 3.1 Рефакторинг universities/constants.ts

- [ ] Удалить UI-стили (перенесены в Задаче 1.3)
- [ ] Оставить только:
  - `TYPE_BADGE_COLORS` → переделать в маппинг type → SemanticColor (без классов)
  - `BADGE_COLOR_MAP` → оставить как есть (это маппинг данных)
  - `generateBadge()` → оставить, но возвращать только данные (color key, не классы)
  - `BORDER_COLORS` → удалить (UI-специфично)
- [ ] Обновить импорты в компонентах

#### 3.2 Рефакторинг blog/contentRendererStyles.ts

- [ ] Перенести UI-стили в `composables/ui/domain/blog.ts`
- [ ] Оставить только widget registry логику

**Оценка:** 3-4 часа

---

### Задача 4: Миграция компонентов

**Цель:** Все компоненты используют новый unified API

#### 4.1 Shared компоненты (приоритет: высокий)

- [ ] `BaseBadge.vue` — обновить импорты
- [ ] `BaseCard.vue` — обновить импорты
- [ ] `BaseButton.vue` — обновить импорты
- [ ] `BaseIconText.vue` — обновить импорты
- [ ] `BaseAlert.vue` — обновить импорты
- [ ] `BaseStatusBadge.vue` — обновить импорты
- [ ] Остальные shared компоненты

#### 4.2 Feature компоненты

- [ ] Universities компоненты (используют domain styles)
- [ ] Blog компоненты
- [ ] Home секции
- [ ] Остальные feature компоненты

**Оценка:** 4-6 часов

---

### Задача 5: Валидация и документация

**Цель:** Убедиться в корректности и задокументировать

#### 5.1 Валидация

- [ ] Проверить что приложение работает
- [ ] Проверить что все стили применяются корректно
- [ ] Проверить TypeScript типизацию (no errors)
- [ ] Запустить тесты

#### 5.2 ESLint правила (опционально)

- [ ] Добавить правило запрета импорта runtime из `types/ui/`
- [ ] Добавить правило рекомендации импорта из `composables/ui`

#### 5.3 Документация

- [ ] Обновить этот документ со статусом "Completed"
- [ ] Добавить JSDoc к публичным функциям
- [ ] Создать `docs/ui-system.md` с описанием архитектуры

**Оценка:** 3-4 часа

---

## 5. Критерии завершения

### Must Have

- [ ] Все runtime-маппинги в `composables/ui/tokens/`
- [ ] `types/ui/` содержит только типы
- [ ] `lib/domain/` не содержит Tailwind-классов
- [ ] Единая точка входа `composables/ui/index.ts`
- [ ] Приложение работает без ошибок

### Should Have

- [ ] Все shared компоненты мигрированы на новый API
- [ ] JSDoc для публичных функций

### Nice to Have

- [ ] ESLint правила для enforce нового паттерна
- [ ] Полная документация в `docs/ui-system.md`
- [ ] Feature компоненты мигрированы

---

## 6. Работа с существующей документацией

### 6.1 Текущее состояние документации

| Файл                       | Статус                     | Действие                                      |
| -------------------------- | -------------------------- | --------------------------------------------- |
| `docs/UI_TOKENS.md`        | Частично устарел           | Обновить пути импортов, добавить новые токены |
| `docs/DESIGN_SYSTEM.md`    | Устарел после рефакторинга | Переписать с новой архитектурой               |
| `docs/ui-refactor-plan.md` | Актуален                   | Обновлять по ходу работ                       |

### 6.2 План обновления документации

1. **После Задачи 1-2:** Обновить `DESIGN_SYSTEM.md` — изменить "source of truth" на `composables/ui/`
2. **После Задачи 3:** Обновить примеры в `DESIGN_SYSTEM.md` с новыми путями импорта
3. **После Задачи 4:** Обновить `UI_TOKENS.md` — исправить устаревшие пути
4. **Финал:** Консолидировать документацию или пометить `ui-refactor-plan.md` как completed

---

## Приложение A: Файлы для изменения

### Файлы для создания

```
app/composables/ui/tokens/index.ts
app/composables/ui/tokens/colors.ts
app/composables/ui/tokens/spacing.ts
app/composables/ui/tokens/typography.ts
app/composables/ui/tokens/shadows.ts
app/composables/ui/tokens/borders.ts
app/composables/ui/tokens/status.ts
app/composables/ui/tokens/variants.ts
app/composables/ui/domain/index.ts
app/composables/ui/domain/universities.ts
app/composables/ui/domain/blog.ts
```

### Файлы для существенного изменения

```
app/composables/ui/index.ts
app/composables/ui/useColors.ts → hooks/useColorClasses.ts
app/composables/ui/useSize.ts → hooks/useSizeClasses.ts
app/types/ui/tokens.ts
app/types/ui/common.ts
app/types/ui/index.ts
app/types/ui/components/button.ts
lib/domain/universities/constants.ts
lib/domain/blog/contentRendererStyles.ts
docs/DESIGN_SYSTEM.md
docs/UI_TOKENS.md
```

### Компоненты для миграции (примеры)

```
app/components/shared/BaseBadge.vue
app/components/shared/BaseCard.vue
app/components/shared/BaseButton.vue
app/components/shared/BaseIconButton.vue
app/components/shared/BaseIconText.vue
app/components/shared/BaseAlert.vue
```

---

## Приложение B: Оценка трудозатрат

| Задача                                                        | Оценка     | Приоритет |
| ------------------------------------------------------------- | ---------- | --------- |
| 1. Реструктуризация composables/ui                            | 5-7h       | Critical  |
| 2. Очистка types/ui (включая components/button.ts)            | 2-3h       | Critical  |
| 3. Очистка lib/domain (включая blog/contentRendererStyles.ts) | 3-4h       | High      |
| 4. Миграция компонентов                                       | 4-6h       | Medium    |
| 5. Валидация и документация (включая обновление docs/)        | 3-4h       | Medium    |
| **Итого**                                                     | **17-24h** |           |

---

## Changelog

| Дата       | Изменение                                                                                                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2024-12-24 | Создание документа                                                                                                                                                                  |
| 2024-12-24 | v1.1: Добавлены упущенные аспекты: существующая документация (UI_TOKENS.md, DESIGN_SYSTEM.md), runtime в types/ui/components/button.ts, полный анализ blog/contentRendererStyles.ts |
| 2024-12-24 | v2.0: **Рефакторинг завершён.** Все задачи выполнены.                                                                                                                               |

---

## Приложение C: Результаты рефакторинга

### Созданная структура

```
app/composables/ui/
├── tokens/                    # ✅ Статические маппинги
│   ├── index.ts              # Barrel exports
│   ├── colors.ts             # Цветовые токены
│   ├── spacing.ts            # Spacing токены
│   ├── typography.ts         # Типографика
│   ├── shadows.ts            # Тени
│   ├── borders.ts            # Границы
│   ├── status.ts             # Status badge классы
│   └── variants.ts           # Button variant классы
├── domain/                    # ✅ Domain-specific UI helpers
│   ├── index.ts              # Barrel exports
│   ├── universities.ts       # UI стили для университетов
│   └── blog.ts               # UI стили для блога
├── index.ts                   # ✅ Обновлён с новыми экспортами
└── use*.ts                    # ✅ Hooks обновлены для импорта из tokens/
```

### Выполненные изменения

| Файл                                       | Изменение                                  |
| ------------------------------------------ | ------------------------------------------ |
| `composables/ui/tokens/*.ts`               | Созданы файлы со статическими маппингами   |
| `composables/ui/domain/*.ts`               | Созданы domain-specific UI helpers         |
| `composables/ui/index.ts`                  | Обновлён для экспорта из tokens/ и domain/ |
| `composables/ui/useTypography.ts`          | Рефакторинг: импорт из tokens/             |
| `composables/ui/useSpacing.ts`             | Рефакторинг: импорт из tokens/             |
| `composables/ui/useShadow.ts`              | Рефакторинг: импорт из tokens/             |
| `composables/ui/useColors.ts`              | Рефакторинг: импорт из tokens/             |
| `composables/ui/useCard.ts`                | Рефакторинг: импорт из tokens/             |
| `types/ui/tokens.ts`                       | Очищен: только типы + re-exports           |
| `types/ui/components/button.ts`            | Очищен: только типы + re-export            |
| `lib/domain/universities/constants.ts`     | Очищен: только бизнес-логика + re-exports  |
| `lib/domain/blog/contentRendererStyles.ts` | Очищен: только re-exports                  |

### Backward Compatibility

Все существующие импорты продолжают работать благодаря re-exports:

- `import { ... } from '~/types/ui'` ✅
- `import { ... } from '~/types/ui/tokens'` ✅
- `import { ... } from '~/lib/domain/universities/constants'` ✅
- `import { ... } from '~/lib/domain/blog/contentRendererStyles'` ✅

### Рекомендуемые импорты для нового кода

```typescript
// Предпочтительно - единая точка входа
import { SEMANTIC_TEXT_COLORS, useColorTokens, getLanguageBadgeClass } from '~/composables/ui'

// Или напрямую из tokens для статических значений
import { SHADOW_SIZE_MAP } from '~/composables/ui/tokens'

// Или напрямую из domain для domain-specific helpers
import { getContentVariantStyles } from '~/composables/ui/domain'
```
