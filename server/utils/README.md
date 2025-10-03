# Server Utils

Утилиты для серверной части приложения.

## `locale.ts` - Работа с локалями

Централизованные функции для работы с локализацией.

### Функции

#### `normalizeLocale(input?: string | null): NormalizedLocale`
Нормализует код локали и возвращает fallback варианты.
- Извлекает базовый код из `en-US` → `en`
- Возвращает fallback цепочку с `ru` как последним вариантом

```typescript
const { normalized, fallbacks } = normalizeLocale('kk')
// { normalized: 'kk', fallbacks: ['kk', 'ru'] }

const { normalized, fallbacks } = normalizeLocale('en-GB')
// { normalized: 'en', fallbacks: ['en', 'ru'] }
```

#### `resolveLocaleTag(locale: string): string`
Конвертирует код локали в IETF language tag для Intl API.

```typescript
resolveLocaleTag('kk') // 'kk-KZ'
resolveLocaleTag('en') // 'en-GB'
```

#### `pickTranslation<T>(translations, locale): T | null`
Выбирает перевод из массива с fallback логикой.
1. Точное совпадение
2. Русский перевод
3. Первый доступный

```typescript
const translation = pickTranslation(article.translations, 'kk')
```

#### `findTranslation<T>(translations, localeInfo): T | undefined`
Расширенная версия `pickTranslation` - использует fallback цепочку из `NormalizedLocale`.

```typescript
const localeInfo = normalizeLocale('kz')
const translation = findTranslation(review.translations, localeInfo)
```

### Константы

- `SUPPORTED_LOCALES` - поддерживаемые локали: `['en', 'ru', 'kk', 'tr']`
- `DEFAULT_LOCALE` - локаль по умолчанию: `'ru'`

### Использование в репозиториях

```typescript
import { normalizeLocale, pickTranslation, resolveLocaleTag } from '../utils/locale'

// Нормализация локали
const { normalized } = normalizeLocale(userLocale)

// Выбор перевода
const translation = pickTranslation(entity.translations, normalized)

// Форматирование даты
const formatter = new Intl.DateTimeFormat(resolveLocaleTag(locale), options)
```
