# edu.turkish — платформа для поиска университетов Турции

Nuxt 4‑приложение для поиска университетов и подачи заявок. Многоязычная витрина + сервер на базе БД (MySQL + Prisma).

## 🚀 Возможности

- **Каталог университетов** с поиском и фильтрами
- **Мультиязычность** (en, ru, kk, tr)
- **Подача заявок** и отправка лидов в Bitrix
- **Отзывы** и **FAQ**
- **Бэкенд на БД** (MySQL + Prisma)
- **Адаптивный интерфейс** (Tailwind CSS)

## 🛠 Технологии

- **Frontend**: Nuxt 4, Vue 3, TypeScript, Tailwind CSS
- **Backend**: Nuxt Server API, Prisma ORM, MySQL
- **State**: Pinia
- **i18n**: @nuxtjs/i18n
- **Тесты**: Vitest, Testing Library
- **Инфра**: Docker, Docker Compose

## 📋 Требования

- Node.js 18+
- Docker и Docker Compose (для БД)
- npm/pnpm/yarn

## 🚀 Быстрый старт

### 1. Клонирование и установка

```bash
git clone <repository-url>
cd edu.turkish
npm install
```

### 2. Окружение

```bash
cp .env.example .env
```

### 3. База данных

```bash
# Поднять БД (Docker)
npm run docker:up

# Накатить схему и сиды (dev)
npm run setup:dev
```

### 4. Запуск разработки

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:3000`.

## 📚 Документация

- [Настройка сервера](./docs/SERVER_SETUP.md)
- [Bitrix: быстрая настройка](./docs/BITRIX_SETUP.md)
- [Миграции БД (Prisma)](./docs/MIGRATIONS_SETUP.md)
- [Автоматический перевод](./docs/scripts/TRANSLATE.md)
- [Импорт университета](./docs/scripts/IMPORT_UNIVERSITY.md)
- [Удаление университета](./docs/scripts/DELETE_UNIVERSITY.md)

## 🗃️ База данных

Используется MySQL с полноценной схемой и переводами. Основные операции:

```bash
# Операции с БД
npm run db:push      # Накатить схему (dev), без миграций
npm run db:seed      # Засеять примерными данными
npm run db:studio    # GUI
npm run db:migrate   # Создать и применить миграцию (dev)

# Docker
npm run docker:up    # Старт БД
npm run docker:down  # Остановка
npm run docker:logs  # Логи MySQL
```

Для прода используйте `npm run db:deploy`. Подробнее — в разделе «Миграции БД (Prisma)».

## 🌐 API

- `GET /api/v1/universities` — список университетов
- `GET /api/v1/universities/[id]` — детали университета
- `GET /api/v1/reviews` — список отзывов
- `GET /api/v1/statistics` — статистика отзывов
- `GET /api/v1/content/faq` — список FAQ
- `POST /api/v1/applications` — отправка заявки (интеграция с Bitrix)
- `POST /api/v1/reviews` — отправка нового отзыва
- `POST /api/v1/messenger-events` — логирование кликов по мессенджерам в Bitrix ([документация](./docs/MESSENGER_EVENTS.md)).

## 🧪 Тесты

```bash
npm test
npm run test:watch
```

## 🔧 Скрипты разработки

```bash
# Разработка
npm run dev
npm run build
npm run preview

# Качество кода
npm run lint
npm run lint:fix
```

## 📁 Структура проекта

```
edu.turkish/
├── app/                 # Клиентский код
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── pages/
│   └── types/
├── server/              # Серверная логика
│   ├── api/
│   ├── repositories/
│   ├── types/
│   └── utils/
├── prisma/              # Схема и миграции Prisma
│   ├── seed/
│   └── schema.prisma
├── i18n/locales/
├── lib/
└── tests/
```

## 🌍 Локализация

Поддерживаемые языки: **en**, **ru**, **kk**, **tr**. Контент выбирается по языку пользователя.

## 🚀 Деплой

```bash
npm run build
npm run db:deploy   # применить миграции на проде
```

## 🔒 Переменные окружения

Ключевые переменные группируются по подсистемам:

- **База данных и приложение**: `DATABASE_URL`, `NODE_ENV`, `NUXT_SECRET_KEY`.
- **CRM (Bitrix24)**: `BITRIX_WEBHOOK_URL`, `BITRIX_DOMAIN`, `BITRIX_ACCESS_TOKEN`, `BITRIX_AUTH_MODE`, `BITRIX_USER_ID`, `BITRIX_ACTIVITY_OWNER_ID`, `BITRIX_ACTIVITY_OWNER_TYPE_ID`, `BITRIX_ACTIVITY_RESPONSIBLE_ID`.
- **Directus**: `DIRECTUS_KEY`, `DIRECTUS_SECRET`, `DIRECTUS_PUBLIC_URL`, `DIRECTUS_ADMIN_EMAIL`, `DIRECTUS_ADMIN_PASSWORD`, `DIRECTUS_STATIC_TOKEN`, `NUXT_PUBLIC_DIRECTUS_URL`.
- **Аналитика**: `NUXT_PUBLIC_YANDEX_METRIKA_ID`.

> ℹ️ Переменные `SMTP_*`, `API_RATE_LIMIT`, `API_TIMEOUT`, `LOG_FILE_PATH` сохранены в `.env.example` как задел на будущие интеграции (SMTP, лимиты API, файловый лог). Текущее приложение их не считывает, поэтому их настройка не обязательна.

```bash
# База данных и приложение
DATABASE_URL="mysql://user:password@host:3306/database"
NODE_ENV=production
NUXT_SECRET_KEY="your_secret_key"

# CRM (Bitrix24)
BITRIX_WEBHOOK_URL="https://your-domain.bitrix24.ru/rest/1/your_webhook_key/"
BITRIX_DOMAIN="your-domain.bitrix24.ru"
BITRIX_ACCESS_TOKEN="your_access_token_here"
BITRIX_AUTH_MODE=webhook
BITRIX_USER_ID=1
BITRIX_ACTIVITY_OWNER_ID=123
BITRIX_ACTIVITY_OWNER_TYPE_ID=1
BITRIX_ACTIVITY_RESPONSIBLE_ID=25

# Directus
DIRECTUS_KEY="local_project_key"
DIRECTUS_SECRET="generated_jwt_secret"
DIRECTUS_PUBLIC_URL="http://localhost:8055"
DIRECTUS_ADMIN_EMAIL="admin@example.com"
DIRECTUS_ADMIN_PASSWORD="ChangeMe123!"
DIRECTUS_STATIC_TOKEN="service_static_token"
NUXT_PUBLIC_DIRECTUS_URL="http://localhost:8055"

# Аналитика
NUXT_PUBLIC_YANDEX_METRIKA_ID="your_metrika_id"
```

- `DATABASE_URL`, `NODE_ENV`, `NUXT_SECRET_KEY` — базовая конфигурация Nuxt-приложения и подключения к MySQL.
- `BITRIX_WEBHOOK_URL` или связка `BITRIX_DOMAIN` + `BITRIX_ACCESS_TOKEN` — авторизация CRM-интеграции Bitrix24.
- `BITRIX_AUTH_MODE`, `BITRIX_USER_ID` — настраивают формат REST-запросов: укажите `webhook`, если используете домен + код вебхука (без полного URL). При OAuth (приложение Bitrix, access token) можно оставить пустыми.
- `BITRIX_ACTIVITY_OWNER_ID`, `BITRIX_ACTIVITY_OWNER_TYPE_ID`, `BITRIX_ACTIVITY_RESPONSIBLE_ID` — управляют тем, к какой сущности CRM привязывается активность (лид/сделка и т.д.) и какому сотруднику она назначается. Задавайте только если дефолтной привязки недостаточно.
- `DIRECTUS_*`, `NUXT_PUBLIC_DIRECTUS_URL` — параметры headless-CMS Directus (админ-доступ и публичный API для Nuxt).
- `NUXT_PUBLIC_YANDEX_METRIKA_ID` — идентификатор счётчика для клиентской аналитики (Яндекс.Метрика).

## 🤝 Вклад

1. Форкните репозиторий
2. Создайте ветку
3. Внесите изменения
4. Добавьте тесты
5. Убедитесь, что тесты проходят
6. Откройте Pull Request

## 📄 Лицензия

MIT License

## 💡 В разработке

- [ ] Аутентификация
- [ ] Продвинутый поиск
- [ ] Уведомления
- [ ] Загрузка документов
- [ ] Чат‑поддержка
- [ ] Мобильное приложение

## 📞 Поддержка

1. Смотрите [настройку сервера](./docs/SERVER_SETUP.md)
2. Проверьте существующие issues
3. Создайте issue при необходимости

---

**Сделано с ❤️ для абитуриентов, выбирающих образование в Турции**

## Деплой (Docker + docker-compose + GitHub Actions)

- Локальный запуск:
  - `docker compose up -d mysql directus`
  - через несколько секунд: `docker compose up --build app`
  - открыть http://localhost:3000 (Nuxt) и http://localhost:8055 (Directus)

- Обязательные переменные окружения:
  - Переменные `DB_*` или `DATABASE_URL`
  - `NUXT_PUBLIC_DIRECTUS_URL` (по умолчанию http://localhost:8055)
  - `ALLOWED_HOSTS` для продакшена (через запятую, напр. `edu-turkish.com,www.edu-turkish.com`)

- Настройка сервера (однократно):
  - установить Docker и docker compose
  - создать каталог проекта и указать `REMOTE_PATH`
  - добавить SSH-ключ в секрет `SSH_PRIVATE_KEY`
  - задать секреты репозитория GitHub: `SERVER_HOST`, `SERVER_USER`, `REMOTE_PATH`, `GIT_REPO`
  - опционально: `DEPLOY_ENV_FILE` — содержимое `.env` для сервера

- CI/CD:
  - При пуше в `main` GitHub Actions подключается по SSH к серверу, подтягивает код, собирает `app` и перезапускает `app mysql directus` через docker compose.

Примечание: В Docker используется Bun (oven/bun) для установки, сборки и рантайма.
