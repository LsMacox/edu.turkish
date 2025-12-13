# Системная инструкция: проект edu.turkish

## Обзор

**edu.turkish** — Nuxt 4 приложение для поиска университетов Турции. Включает каталог вузов, систему заявок, CRM-интеграции. Архитектура: SSR + Nitro API, мультиязычность (ru/en/kk/tr).

### Точки входа (entry points)

| Что                          | Где              | Примечание                                                                                                 |
| ---------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------- |
| Nuxt конфиг                  | `nuxt.config.ts` | `ssr: true`, подключение модулей, `routeRules`, `runtimeConfig`, prerender-хук `nitro:config`              |
| Модульные части Nuxt конфига | `config/*.ts`    | `config/modules.ts`, `config/i18n.ts`, `config/route-rules.ts`, `config/runtime.ts`, `config/prerender.ts` |
| Backend API (Nitro)          | `server/api/**`  | File-based routing (см. раздел ниже)                                                                       |

---

## Структура директорий

### `/app` — Фронтенд (Nuxt)

| Путь           | Назначение                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------- |
| `app.vue`      | Корневой компонент                                                                                |
| `assets/`      | CSS (Tailwind), JSON-данные                                                                       |
| `components/`  | Vue-компоненты: `features/` (бизнес-фичи), `layout/` (шапка/подвал), `shared/` (переиспользуемые) |
| `composables/` | Vue 3 composables (бизнес-логика)                                                                 |
| `layouts/`     | Layout-шаблоны страниц                                                                            |
| `pages/`       | Страницы (автороутинг Nuxt)                                                                       |
| `plugins/`     | Nuxt-плагины                                                                                      |
| `stores/`      | Pinia stores                                                                                      |
| `types/`       | TypeScript типы: `features/` (application, blog, services), `ui/`, `i18n.d.ts`                    |

### `/server` — Backend (API)

| Путь            | Назначение                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------------------- |
| `api/health/`   | Health checks                                                                                                        |
| `api/v1/`       | Версионированные эндпоинты: applications, blog, universities, programs, reviews, exchange-rates, directions, content |
| `api/webhooks/` | Вебхуки (CRM, EspoCRM)                                                                                               |
| `services/`     | Бизнес-логика: ExchangeRateService, application/, crm/, queue/, telegram/                                            |
| `repositories/` | Слой данных: UniversityRepository, BlogRepository, ApplicationRepository, ReviewRepository, factory.ts               |
| `utils/`        | Хелперы: prisma.ts, locale.ts, api/pagination.ts, validation.ts, sanitize.ts                                         |
| `middleware/`   | i18n-api.ts, referral.ts, restrict-host.ts                                                                           |
| `plugins/`      | Фоновые задачи: crm-worker.ts, sitemap.ts, telegram-worker.ts                                                        |
| `mappers/`      | Маппинг данных (application, blog, faq)                                                                              |

#### Конвенции роутинга Nitro (`/server/api`)

Nuxt/Nitro использует **file-based routing**: путь и HTTP-метод определяются по имени файла.

| Пример файла                               | HTTP | URL                          |
| ------------------------------------------ | ---- | ---------------------------- |
| `server/api/v1/statistics.get.ts`          | GET  | `/api/v1/statistics`         |
| `server/api/v1/applications/index.post.ts` | POST | `/api/v1/applications`       |
| `server/api/v1/universities/index.get.ts`  | GET  | `/api/v1/universities`       |
| `server/api/v1/universities/[id].get.ts`   | GET  | `/api/v1/universities/:id`   |
| `server/api/health/telegram-queue.get.ts`  | GET  | `/api/health/telegram-queue` |

Файла `index.ts` для handler’ов обычно нет — важно использовать суффиксы `.get.ts`, `.post.ts` и т.д.

#### Реальные группы API v1 (фактически в репозитории)

`server/api/v1/`:

- **applications**
- **blog** (саброуты `blog/articles`)
- **content**
- **directions**
- **exchange-rates**
- **programs**
- **reviews**
- **universities**
- **statistics** (single-file endpoint)

### `/lib` — Общий код (backend + frontend)

| Путь              | Назначение                                                                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config/`         | assets.ts, currency.ts, locales.ts                                                                                                                            |
| `domain/`         | Domain-слой: blog/, contact/, faq/                                                                                                                            |
| `i18n/schemas/`   | Схемы валидации переводов                                                                                                                                     |
| `infrastructure/` | prisma.ts, transaction.ts                                                                                                                                     |
| `schemas/`        | Zod-схемы: common.ts, query-params.ts, university.ts, blog.ts, application.ts, review.ts, faq.ts, exchange-rates.ts, crm.ts                                   |
| `types/`          | Общие типы: `entities/` (university, blog, faq, review, program, direction), `api/` (requests, responses, common, errors), `server/` (crm, telegram, webhook) |
| `utils/`          | Вспомогательные утилиты                                                                                                                                       |

### `/prisma` — База данных

| Путь          | Назначение                                      |
| ------------- | ----------------------------------------------- |
| `schema/`     | Prisma-схемы: base.prisma и другие              |
| `migrations/` | Миграции БД                                     |
| `seed/`       | Сиды: blog.ts, faq-categories.ts, faqs.ts и др. |

### `/i18n` — Интернационализация

| Путь          | Назначение          |
| ------------- | ------------------- |
| `locales/en/` | Английские переводы |
| `locales/kk/` | Казахские переводы  |
| `locales/ru/` | Русские переводы    |
| `locales/tr/` | Турецкие переводы   |

### `/config` — Конфигурация Nuxt

| Файл            | Назначение             |
| --------------- | ---------------------- |
| `components.ts` | Автоимпорт компонентов |
| `head.ts`       | SEO, meta-теги         |
| `i18n.ts`       | Настройки i18n         |
| `index.ts`      | Основная конфигурация  |

### `/scripts` — Автоматизация

| Файл                           | Назначение                              |
| ------------------------------ | --------------------------------------- |
| `check-i18n.ts`                | Валидация i18n ключей/локалей           |
| `delete-university.ts`         | Удаление университета                   |
| `delete-all-universities.sh`   | Массовое удаление университетов         |
| `import-university.ts`         | Импорт университета                     |
| `import-all-universities.sh`   | Массовый импорт университетов           |
| `generate-prerender-routes.ts` | Генерация `.nuxt/prerender-routes.json` |
| `translate.ts`                 | Автоперевод (запуск в docker compose)   |

### `/public` — Статика

Изображения, иконки, manifest, robots.txt — доступны напрямую из браузера.

---

## Архитектура

### Слои приложения

```
Request → Middleware → API Handler → Service → Repository → Database
                                         ↓
                                      Mapper → Response
```

### Разделение ответственности

- **Frontend:** `/app` (Vue-компоненты, страницы, stores)
- **Backend:** `/server` (API, сервисы, репозитории)
- **Business Logic:** `/lib/domain`
- **Infrastructure:** `/lib/infrastructure`
- **Shared Types/Schemas:** `/lib/types`, `/lib/schemas`

### Инфраструктура

| Сервис             | Назначение                     |
| ------------------ | ------------------------------ |
| Nuxt App           | Основное приложение            |
| MySQL              | База данных                    |
| Redis              | Кэширование, очереди (BullMQ)  |
| Directus           | CMS для динамического контента |
| EspoCRM / Bitrix24 | CRM-интеграции                 |
| Caddy              | Production-сервер              |

---

## Система типов

### Принцип организации

| Расположение           | Назначение         | Примеры                                   |
| ---------------------- | ------------------ | ----------------------------------------- |
| `/lib/types/entities/` | Domain-модели (БД) | university.ts, blog.ts, faq.ts, review.ts |
| `/lib/types/api/`      | API-контракты      | requests.ts, responses.ts, errors.ts      |
| `/lib/types/server/`   | Серверная логика   | crm.ts, telegram.ts, webhook.ts           |
| `/app/types/features/` | Бизнес-фичи UI     | application/, blog/, services/            |
| `/app/types/ui/`       | UI-компоненты      | button.ts, card.ts, form.ts               |

### Zod-схемы (`/lib/schemas`)

Runtime-валидация для:

- JSON-полей в БД
- API запросов/ответов
- Query-параметров
- Генерации TypeScript типов

---

## i18n: правила работы

### Добавление нового ключа

1. **Схема:** Добавить ключ в `/lib/i18n/schemas/` с namespace
2. **Переводы:** Создать во всех локалях `/i18n/locales/{lang}/`
3. **Валидация:** Запустить `pnpm tsx scripts/check-i18n.ts --all`

Примечание: в `package.json` есть скрипт `i18n:validate`, который является алиасом на `scripts/check-i18n.ts`.

### Использование в компонентах

```typescript
// ✅ Правильно — через namespace-функцию или key-фунцию, переменные c префиксом ns
const filtersNs = namespace('universities.filters')
t(filtersNs('search_label')) // → 'universities.filters.search_label'
t(key('universities.filters.search_label')) // → 'universities.filters.search_label'

// ✅ Правильно — статический ключ
t('universities.filters.search_label')

// ❌ Неправильно — динамический ключ
t(`universities.${dynamicKey}`) // ЗАПРЕЩЕНО
```

**Правила:**

- Только функция `t()` для переводов
- функцию namespace или key обязателено
- Только статические строковые ключи

---

## Composables и компоненты

### Основные composables (`/app/composables`)

| Composable              | Назначение                      |
| ----------------------- | ------------------------------- |
| `useI18nHelpers`        | exists, getOptional, formatDate |
| `useCurrency`           | Работа с валютами               |
| `useCdn`                | CDN-утилиты                     |
| `useFormSubmit`         | Отправка форм с валидацией      |
| `useServerValidation`   | Серверная валидация             |
| `useToast`              | Уведомления                     |
| `useFingerprint`        | Fingerprint пользователя        |
| `useSwiper`             | Swiper-слайдер                  |
| `useSwipeClose`         | Закрытие свайпом                |
| `useInternationalPhone` | Международные телефоны          |

### Базовые компоненты (`/app/components/shared`)

| Компонент                                     | Назначение                   |
| --------------------------------------------- | ---------------------------- |
| `BaseButton`                                  | Кнопки (варианты, состояния) |
| `BaseTextField`                               | Текстовые поля с валидацией  |
| `BaseSelect`                                  | Выпадающие списки            |
| `BaseCard`, `BaseFeatureCard`                 | Карточки контента            |
| `BaseBadge`, `BaseIconBadge`, `BaseStatBadge` | Бейджи                       |
| `BaseCheckbox`                                | Чекбоксы                     |
| `BaseRangeSlider`                             | Слайдеры диапазонов          |
| `BaseSectionHeader`                           | Заголовки секций             |
| `BaseIconText`                                | Иконки с текстом             |
| `FloatingWhatsApp`                            | WhatsApp-виджет              |
| `modals/`                                     | Модальные окна               |

**Принцип:** Используй базовые компоненты. Бизнес-логика — в composables, не в компонентах.

---

## Серверные утилиты

### `/server/utils`

| Утилита             | Функции                                              |
| ------------------- | ---------------------------------------------------- |
| `prisma.ts`         | `decimalToNumber`, `asRecord`, `extractStringRecord` |
| `locale.ts`         | `normalizeLocale`, fallbacks                         |
| `api/pagination.ts` | Пагинация API                                        |
| `validation.ts`     | Валидация данных                                     |
| `sanitize.ts`       | Санитизация входных данных                           |

---

## Куда добавлять новый код

| Что добавляешь     | Куда                                                    |
| ------------------ | ------------------------------------------------------- |
| Новая сущность БД  | `/lib/types/entities/{entity}.ts` + `/prisma/schema/`   |
| Новый API эндпоинт | `/server/api/v1/{resource}/` + типы в `/lib/types/api/` |
| Новый UI-компонент | `/app/components/shared/` + типы в `/app/types/ui/`     |
| Новая бизнес-фича  | `/app/components/features/` + `/app/types/features/`    |
| Новый composable   | `/app/composables/`                                     |
| Новая Zod-схема    | `/lib/schemas/`                                         |
| Новый сервис       | `/server/services/`                                     |
| Новый репозиторий  | `/server/repositories/`                                 |
| Серверная логика   | `/lib/types/server/`                                    |

---

## Проверки перед коммитом

```bash
# 1. Проверка TypeScript типов (ОБЯЗАТЕЛЬНО)
pnpm typecheck

# 2. Проверка ESLint (ОБЯЗАТЕЛЬНО)
pnpm lint

# 3. Проверка i18n (если менял переводы)
pnpm tsx scripts/check-i18n.ts --all
```

### Runtime config (env)

Основные переменные окружения:

| Переменная                       | Где используется                          | Назначение                                                    |
| -------------------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| `NITRO_ORIGIN` / `NUXT_SITE_URL` | `nuxt.config.ts`                          | Базовый `siteUrl`                                             |
| `NITRO_PRERENDER`                | `nuxt.config.ts` + `config/prerender.ts`  | Включение prerender + подгрузка `.nuxt/prerender-routes.json` |
| `NUXT_ENABLE_REMOTE_IMAGES`      | `nuxt.config.ts` + `config/modules.ts`    | Разрешить удалённые домены для `@nuxt/image`                  |
| `NUXT_PUBLIC_CDN_URL`            | `nuxt.config.ts` + `runtimeConfig.public` | CDN baseUrl (provider `bunny`)                                |
| `NUXT_PUBLIC_DIRECTUS_URL`       | `runtimeConfig.public`                    | URL Directus                                                  |
| `NUXT_ESPOCRM_WEBHOOK_TOKEN`     | `runtimeConfig` (private)                 | Токен вебхука EspoCRM                                         |
| `NUXT_TELEGRAM_BOT_TOKEN`        | `runtimeConfig` (private)                 | Токен Telegram бота                                           |

**Всегда выполняй `pnpm typecheck` и `pnpm lint` после изменений.**

---

## Потоки данных

| Поток          | Путь                                                                |
| -------------- | ------------------------------------------------------------------- |
| SSR-запрос     | User → Nuxt SSR → Prisma → MySQL → Render                           |
| API-запрос     | Client → Server API → Service → Repository → DB → Mapper → Response |
| CRM-интеграция | External → Webhook → Server API → CRM Service → Queue               |
| Фоновые задачи | Event → BullMQ (Redis) → Worker → Service                           |

---

## Конвенции проекта (кратко)

### API

- Версия: `/api/v1/**` → `server/api/v1/**`.
- Ответы:
  - Списки: `{ data, meta }` (например `server/api/v1/universities/index.get.ts`, `server/api/v1/reviews/index.get.ts`).
  - Detail: может быть “голый” объект (например `server/api/v1/universities/[id].get.ts`).
  - Action: может быть `{ success, ... }` (например `server/api/v1/reviews/index.post.ts`).
- Ошибки:
  - `createError({ statusCode, statusMessage, data })`.
  - Валидация: `422` + `ValidationErrorResponse` (`lib/types/api/errors.ts`, `server/utils/validation.ts`).
- Deprecated:
  - Используется `@deprecated` на уровне TS типов (`lib/types/api/responses.ts`).

### UI

- Компоненты: `PascalCase`; базовые — `Base*` в `app/components/shared`.
- Lazy: `LazyXxx` (пример: `app/layouts/default.vue`).
- Tailwind:
  - Классы + `@apply` в `app/assets/css/*.css`.
  - Токены/утилиты: `tailwind.config.ts` + typography classes (`app/assets/css/typography.css`).
- Иконки: `@nuxt/icon` → `<Icon name="mdi:..." />`, коллекции `mdi`/`ph` в `config/modules.ts`.

### Pinia

- Stores: `app/stores`, именование `useXxxStore`, id в `defineStore('<id>', ...)`.
- Persist: вручную через `localStorage` там где нужно (например `app/stores/faq.ts`).
- SSR данные: в страницах через `useAsyncData`, иногда store умеет `ssr` init (например `useUniversitiesStore.initializeFilters`).

### Формы / валидация

- Zod схемы: `lib/schemas/*`.
- Front: `useFormSubmit` + `useServerValidation` (обработка `422`).

### Data fetching

- `$fetch` напрямую.
- SSR/кэш: `useAsyncData(key, ...)`, ключи часто включают `locale` (пример: `app/pages/programs.vue`, `app/pages/faq.vue`).

### i18n

- Interpolation: `t(key, { ... })`.
- Plural: формат строк с `|` (пример: `i18n/locales/ru/universities.json`).
- API locale: middleware `server/middleware/i18n-api.ts` + часто query `lang`.

### Тесты

- `Vitest` (`vitest.config.ts`), тесты в `/tests`.

### SEO

- `useHead`/`useSeoMeta`.
- Canonical: формируется в `app/layouts/default.vue`.
- JSON-LD: FAQ (`app/pages/faq.vue`) + services (`app/composables/useServiceHead.ts`).
- Sitemap: `server/plugins/sitemap.ts`.

### Безопасность

- Host allowlist: `server/middleware/restrict-host.ts` (+ `ALLOWED_HOSTS`).
- Webhook token: `server/api/webhooks/espocrm/lead.post.ts`.
- Санитизация: `server/utils/sanitize.ts`.

### CRM / Queue

- CRM: `server/services/crm/*`.
- BullMQ rate limit: `server/services/queue/CRMQueueWorker.ts` (env `CRM_QUEUE_RATE_*`, `CRM_QUEUE_CONCURRENCY`).

### DB seeds

- Seeds: `prisma/seed/seed.ts`.

### Env

- Пример: `.env.example`.
- Несовпадение имён: `NUXT_PUBLIC_DIRECTUS_URL` (код) vs `NUXT_DIRECTUS_PUBLIC_URL` (`.env.example`).

### Git / PR

- См. `docs/CONTRIBUTING.md`.
