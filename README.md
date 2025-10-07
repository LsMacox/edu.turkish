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

| Команда | Назначение |
| --- | --- |
| `npm run dev` | локальный режим разработки Nuxt |
| `npm run build` / `npm run preview` | продакшн-сборка и предпросмотр |
| `npm run lint` / `npm run lint:fix` | проверка ESLint и автоисправление |
| `npm run format` / `npm run format:check` | форматирование Prettier |
| `npm run test` / `npm run test:watch` | запуск тестов Vitest |
| `npm run translate` | LLM‑перевод недостающих локализаций (см. `docs/scripts/TRANSLATE.md`) |
| `npm run import:university` | импорт/обновление университета из JSON (см. `docs/scripts/IMPORT_UNIVERSITY.md`) |
| `npm run i18n:check` | проверка качества переводов (см. `docs/scripts/I18N_CHECK.md`) |
| `npm run directus:schema:snapshot` / `npm run directus:schema:apply` | экспорт и применение схемы Directus |

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

## Локализация

- Структура переводов: `i18n/locales/{lang}/{pages,components,...}.json`
- Поддерживаемые языки: `ru`, `en`, `kk`, `tr`
- Рекомендации по ключам и плейсхолдерам описаны в [docs/I18N.md](docs/I18N.md)
- Для проверки консистентности используйте `npm run i18n:check`

## Документация

- [Руководство по вкладу](docs/CONTRIBUTING.md)
- [Работа с переводами](docs/I18N.md)
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
- **Интеграции и инструменты**: `OPENROUTER_API_KEY`, секреты для SMTP/логирования по необходимости

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
