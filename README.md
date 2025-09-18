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
- `GET /api/v1/reviews/statistics` — статистика отзывов
- `GET /api/v1/content/faq` — список FAQ
- `POST /api/v1/applications` — отправка заявки (интеграция с Bitrix)

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

## 🔒 Переменные окружения (пример)

```bash
# База данных
DATABASE_URL="mysql://user:password@host:port/database"

# Приложение
NODE_ENV=production
NUXT_SECRET_KEY=your_secret_key
```

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
