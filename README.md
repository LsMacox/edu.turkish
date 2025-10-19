# edu.turkish — платформа для поиска университетов Турции

Nuxt 4‑приложение с каталогом вузов, заявками и интеграциями c CRM. Витрина и сервер работают как единый проект: Nuxt обрабатывает клиентскую часть и API, Prisma отвечает за данные в MySQL, а переводы и контент управляются через Directus.

## Основные возможности

- Каталог университетов с фильтрами, карточками и подробными страницами
- Подача заявок с отправкой лидов в CRM (Bitrix24 или EspoCRM)
- Встроенные отзывы, FAQ и статистика
- Мультиязычность (ru, en, kk, tr) с проверками качества переводов
- Адаптивный интерфейс на Tailwind CSS

## Технологический стек

- **Frontend**: Nuxt 4, Vue 3, TypeScript, Tailwind CSS, Pinia
- **Backend**: Nuxt Server API, Prisma ORM, BullMQ + Redis
- **Инфраструктура**: Docker Compose (MySQL, Redis, Directus, EspoCRM, Caddy), GitHub Actions
- **Тестирование**: Vitest и Testing Library

## Требования

- Node.js 18+ (для локальной разработки)
- Docker и Docker Compose 2+ (для БД, Directus и сервисов интеграций)
- npm или pnpm для управления зависимостями

## Быстрый старт

1. Клонируйте репозиторий и установите зависимости:
   ```bash
   git clone <repository-url>
   cd edu.turkish
   npm install
   ```
2. Создайте файл окружения и обновите значения под своё окружение:
   ```bash
   cp .env.example .env
   ```
   Для локального запуска Nuxt `DATABASE_URL` должен указывать на `127.0.0.1` или `localhost`, а не на `mysql`.
3. Запустите инфраструктуру (MySQL, Redis и, при необходимости, Directus/EspoCRM):
   ```bash
   docker compose up -d mysql redis directus espocrm
   ```
   Админ-инструменты:
   - база данных: http://localhost:8080 (Adminer)
   - Directus: http://localhost:8055 (если контейнер запущен)
4. Накатите схему и тестовые данные:
   ```bash
   npx prisma db push
   npx tsx prisma/seed/seed.ts
   ```
   Если предпочитаете выполнять команды внутри Docker, сначала поднимите контейнер приложения (`docker compose up -d app`) и используйте `npm run db:push`, `npm run db:seed` и другие скрипты из раздела ниже.
5. Запустите режим разработки Nuxt:
   ```bash
   npm run dev
   ```
   Приложение будет доступно на http://localhost:3000.

## Скрипты npm

| Команда                                                              | Назначение                                                                       |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `npm run dev`                                                        | локальный режим разработки Nuxt                                                  |
| `npm run build` / `npm run preview`                                  | продакшн-сборка и предпросмотр                                                   |
| `npm run lint` / `npm run lint:fix`                                  | проверка ESLint и автоисправление                                                |
| `npm run format` / `npm run format:check`                            | форматирование Prettier                                                          |
| `npm run test` / `npm run test:watch`                                | запуск тестов Vitest                                                             |
| `npm run translate`                                                  | LLM‑перевод недостающих локализаций (см. `docs/scripts/TRANSLATE.md`)            |
| `npm run import:university`                                          | импорт/обновление университета из JSON (см. `docs/scripts/IMPORT_UNIVERSITY.md`) |
| `npm run i18n:check`                                                 | проверка качества переводов (см. `docs/scripts/I18N_CHECK.md`)                   |
| `npm run directus:schema:snapshot` / `npm run directus:schema:apply` | экспорт и применение схемы Directus                                              |

### Работа с базой данных через Docker

Скрипты `npm run db:*` обращаются к контейнеру `app` (`docker compose exec app …`). Перед их использованием убедитесь, что контейнер запущен:

```bash
docker compose up -d app mysql redis
```

Доступные команды:

```bash
npm run db:push        # применить Prisma schema (dev)
npm run db:seed        # заполнить тестовыми данными
npm run db:migrate     # создать и применить миграцию (dev)
npm run db:deploy      # применить миграции на проде
npm run db:studio      # открыть Prisma Studio
```

## Управление услугами

Данные об услугах (курсы, переводы документов и т.д.) хранятся в базе данных с поддержкой мультиязычности и динамической конвертации валют.

### Архитектура

- **База данных**: Услуги и их переводы хранятся в таблицах `service_categories`, `sub_services` и связанных `*_translations`
- **API**: Эндпоинты `/api/v1/services/*` предоставляют данные с учётом локали
- **Курсы валют**: Автоматическое обновление через exchangerate-api.io с кэшированием на 1 час
- **Fallback**: При недоступности API используются резервные курсы валют

### Добавление новой услуги

Используйте Prisma Studio или SQL для добавления услуг:

```bash
npm run db:studio
```

1. Создайте запись в `SubService` с ценой в USD
2. Добавьте переводы для всех 4 локалей (en, ru, kk, tr) в `SubServiceTranslation`
3. Услуга автоматически появится на соответствующей странице

**Подробная инструкция**: `specs/013-migrate-service-cards/admin-guide.md`

### Курсы валют

- **Автообновление**: Каждый час с exchangerate-api.io
- **Кэширование**: Клиент (Pinia) + сервер (база данных)
- **Резервные курсы**: KZT: 450, TRY: 32, RUB: 90, USD: 1.0
- **API**: GET `/api/v1/exchange-rates` возвращает актуальные курсы

## Локализация

- Структура переводов: `i18n/locales/{lang}/{pages,components,...}.json`
- Поддерживаемые языки: `ru`, `en`, `kk`, `tr`
- Рекомендации по ключам и плейсхолдерам описаны в [docs/I18N.md](docs/I18N.md)
- Для проверки консистентности используйте `npm run i18n:check`
- **Услуги**: Переводы услуг хранятся в БД, статические UI-строки — в `i18n/locales/*/services.json`

## CDN для статических ресурсов

Приложение поддерживает доставку статических ресурсов через CDN. Для использования:

1. Установите переменную окружения `NUXT_PUBLIC_CDN_URL`:

   ```bash
   NUXT_PUBLIC_CDN_URL=https://cdn.edu-turkish.com
   ```

2. Используйте composable `useCdn()` в компонентах:

   ```vue
   <script setup>
   const { cdnUrl } = useCdn()
   </script>

   <template>
     <img :src="cdnUrl('/images/universities/logo.png')" alt="Logo" />
     <NuxtImg :src="cdnUrl('/images/reviews/photo.jpg')" alt="Review" />
   </template>
   ```

3. Подробные примеры использования: `specs/007-cdn-replacement-for/EXAMPLES.md`
4. Руководство по настройке: `specs/007-cdn-replacement-for/quickstart.md`

**Примечание**: Оставьте `NUXT_PUBLIC_CDN_URL` пустым для отключения CDN (ресурсы будут загружаться из `/public/`)

## Документация

- [Руководство по вкладу](docs/CONTRIBUTING.md)
- [Работа с переводами](docs/I18N.md)
- [Управление услугами](specs/013-migrate-service-cards/admin-guide.md)
- [Скрипт автоматического перевода](docs/scripts/TRANSLATE.md)
- [Проверка качества переводов](docs/scripts/I18N_CHECK.md)
- [Импорт университета](docs/scripts/IMPORT_UNIVERSITY.md)
- [Удаление университета](docs/scripts/DELETE_UNIVERSITY.md)
- [Снапшоты Directus](contrib/directus/README.md)

## Переменные окружения

Подробный список смотрите в `.env.example`. Ключевые группы:

- **База данных**: `DATABASE_URL`, `SHADOW_DATABASE_URL`, `DB_HOST`, `DB_PORT`, `DB_ROOT_PASS`, `DB_APP_PASS`
- **CRM**: `CRM_PROVIDER`, `BITRIX_WEBHOOK_URL`, `BITRIX_ACCESS_TOKEN`, `ESPOCRM_*`
- **Directus**: `DIRECTUS_PUBLIC_URL`, `DIRECTUS_ADMIN_EMAIL`, `DIRECTUS_ADMIN_PASSWORD`, `DIRECTUS_KEY`, `DIRECTUS_SECRET`, `NUXT_PUBLIC_DIRECTUS_URL`
- **Redis и очереди**: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- **Аналитика**: `NUXT_PUBLIC_YANDEX_METRIKA_ID`
- **CDN**: `NUXT_PUBLIC_CDN_URL` — базовый URL для статических ресурсов (изображения, видео, документы). Оставьте пустым для отключения CDN
- **EspoCRM Webhooks**: `NUXT_ESPOCRM_WEBHOOK_TOKEN`, `NUXT_ESPOCRM_ASSIGNED_TEAM_ID` — для интеграции вебхуков EspoCRM
- **Telegram Bot**: `NUXT_TELEGRAM_BOT_TOKEN`, `NUXT_TELEGRAM_LEADS_CHANNEL_ID`, `NUXT_TELEGRAM_CALLS_CHANNEL_ID` — для уведомлений в Telegram
- **Интеграции и инструменты**: `OPENROUTER_API_KEY`, секреты для SMTP/логирования по необходимости

### Настройка EspoCRM Telegram уведомлений

Для получения уведомлений о новых лидах и звонках из EspoCRM в Telegram:

1. **Создайте Telegram бота** через @BotFather и получите токен
2. **Создайте два канала** (для лидов и звонков) и добавьте бота как администратора
3. **Получите ID каналов** (используйте @userinfobot)
4. **Настройте переменные окружения**:
   ```bash
   NUXT_ESPOCRM_WEBHOOK_TOKEN=<сгенерируйте секретный токен>
   NUXT_ESPOCRM_ASSIGNED_TEAM_ID=<ID команды для фильтрации>
   NUXT_TELEGRAM_BOT_TOKEN=<токен от BotFather>
   NUXT_TELEGRAM_LEADS_CHANNEL_ID=<ID канала для лидов>
   NUXT_TELEGRAM_CALLS_CHANNEL_ID=<ID канала для звонков>
   ```
5. **Настройте вебхуки в EspoCRM**:
   - URL для лидов: `https://your-domain.com/api/webhooks/espocrm/lead?token=YOUR_TOKEN`
   - URL для звонков: `https://your-domain.com/api/webhooks/espocrm/call-activity?token=YOUR_TOKEN`
   - Событие: `Create`

Подробная инструкция: `specs/010-call-activity-espocrm/quickstart.md`

## Деплой

1. Соберите приложение: `npm run build`
2. Примените миграции на целевом окружении: `npm run db:deploy`
3. Поднимите контейнеры нужных сервисов (например, `docker compose up -d app mysql redis directus caddy`)
4. Для настройки HTTPS используйте `contrib/Caddyfile` и переменные `APP_DOMAIN`, `DIRECTUS_DOMAIN`, `CRM_DOMAIN`, `CADDY_ACME_EMAIL`

CI/CD настроен через GitHub Actions: при пуше в `main` workflow подключается к серверу по SSH, обновляет репозиторий и пересобирает сервисы Docker Compose.

## Вклад

Мы рады новым идеям и улучшениям. Перед отправкой Pull Request ознакомьтесь с [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) и убедитесь, что тесты и линтеры проходят успешно.

## Поддержка

- Проверьте документацию и существующие issues
- Создайте issue с минимальным воспроизведением проблемы
- В неотложных случаях свяжитесь с командой через корпоративные каналы

## Лицензия

MIT License. Используйте и адаптируйте проект свободно с указанием авторства.
