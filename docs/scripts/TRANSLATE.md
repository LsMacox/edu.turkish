## Назначение

Скрипт `scripts/translate.ts` автоматически добавляет недостающие переводы для сущностей из БД, используя LLM через OpenRouter (модель: `google/gemini-2.5-flash`).

- **Что делает**: находит записи без перевода для выбранных языков и создаёт новые строки в таблицах переводов.
- **Безопасность**: существующие переводы не перезаписываются; добавляются только отсутствующие локали.

## Предварительные требования

- Node.js 18+
- Настроенная БД и доступный `DATABASE_URL`
- Сгенерированный Prisma Client: `npm run db:generate`
- Заполните ключ API: `OPENROUTER_API_KEY`

Пример установки переменных окружения:

```bash
export DATABASE_URL="mysql://user:password@host:3306/database"
export OPENROUTER_API_KEY=sk-or-...
```

## Поддерживаемые сущности (таблицы переводов)

- **universities**: создаёт в `university_translations` поля `title`, `description`, `city_translated`, `ranking_text`, `key_info_texts` (JSON)
- **reviews**: создаёт в `review_translations` поля `name`, `quote`, `university_name`
- **programs**: создаёт в `program_translations` поля `name`, `description`
- **faqs**: создаёт в `faq_translations` поля `question`, `answer`, `category_name`
- **facilities**: создаёт в `facility_translations` поля `name`, `description`
- **dormitories**: создаёт в `dormitory_translations` поля `name`, `amenities` (JSON)
- **requirements**: создаёт в `requirement_translations` поля `category`, `requirement`, `details`
- **documents**: создаёт в `document_translations` поля `name`, `description`, `format_requirements` (JSON)
- **dates**: создаёт в `date_translations` поле `event`
- **directions**: создаёт в `direction_translations` поля `name`, `description`
- **articles**: создаёт в `blog_article_translations` поля `slug` (уникальный), `title`, `excerpt`, `reading_time`, `hero_kicker`, `hero_subtitle`, `hero_location`, `image_alt`, `hero_image_alt`, `seo_description`, `content` (JSON-массив блоков)
- **all**: запускает перевод последовательно для всех перечисленных выше сущностей

## Логика выбора исходного текста

- **Источник по умолчанию**: `ru` (можно изменить флагом `--source`)
- **Порядок фолбэков** для каждого поля:
  1. перевод с локалью `--source`
  2. любой доступный перевод
  3. базовое поле сущности (если есть)

## Запуск

### Через npm-скрипт

```bash
npm run translate -- <entity> [опции]
```

### Напрямую через tsx / npx

```bash
npx tsx scripts/translate.ts <entity> [опции]
```

Где `<entity>` одна из: `universities`, `reviews`, `programs`, `faqs`, `facilities`, `dormitories`, `requirements`, `documents`, `dates`, `directions`, `articles`, `all`.

Примечание: этот скрипт не принимает файлов. Для импорта данных из JSON используйте отдельный скрипт импорта: см. `docs/scripts/IMPORT_UNIVERSITY.md`.

## Опции

- `--source=<locale>` — исходная локаль. По умолчанию: `ru`.
- `--targets=<list>` — список целевых локалей через запятую. По умолчанию: `kk,en,tr`.
- `--limit=<N>` — ограничение количества записей на выборку (для тестов/поштучной обработки).
- `--dry-run` — режим предварительного просмотра; ничего не пишет в БД, только показывает результат перевода.
- `--concurrency=<1..8>` — количество параллельных задач. По умолчанию: `2`.

Пример: исключение `source` из `targets` происходит автоматически.

## Примеры

- Университеты на казахский и английский из русского:

```bash
npx tsx scripts/translate.ts universities --targets=kk,en --source=ru
```

- Отзывы на английский из русского, не более 50 шт., без записи (просмотр):

```bash
npx tsx scripts/translate.ts reviews --targets=en --source=ru --limit=50 --dry-run
```

- Все сущности на турецкий и английский с повышенной параллельностью:

```bash
npx tsx scripts/translate.ts all --targets=tr,en --source=ru --concurrency=4
```

## Вывод

- В режиме записи логируется, например:

```
[Created] university_translation u=12 ru->en
```

- В `--dry-run` логируется, например:

```
[DryRun][Review 34] => en { name: "...", quote: "...", universityName: "..." }
```

## Поведение и ограничения

- **Только недостающие локали**: для каждой записи вычисляется список `targets`, которых нет в БД. Скрипт создаёт только их.
- **Существующие переводы не меняются**: уникальные индексы на `(entity_id, locale)` предотвращают дубли.
- **JSON-поля** (`amenities`, `format_requirements`):
  - Исходное значение сериализуется в строку -> переводится -> попытка распарсить обратно в JSON.
  - Если парсинг невозможен, значение сохраняется как строка.
- **Троттлинг**: есть небольшая задержка между задачами и управляемая параллельность для снижения риска превышения лимитов API.

## Обработка ошибок

- Если OpenRouter возвращает что-то помимо JSON, скрипт пытается извлечь JSON-блок и распарсить.
- При ошибке парсинга задача падает с сообщением. Запустите с меньшей `--concurrency` или повторите позже.
- Используйте `--dry-run` для предварительного контроля качества перевода.

## Частые проблемы

- **OPENROUTER_API_KEY не задан**: установите переменную окружения перед запуском.
- **Нет соединения с БД**: проверьте `DATABASE_URL`, миграции и состояние контейнера MySQL.
- **Prisma Client не сгенерирован**: выполните `npm run db:generate`.

## Детали интеграции с OpenRouter

- Модель: `google/gemini-2.5-flash`
- Endpoint: `https://openrouter.ai/api/v1/chat/completions`
- Формат промпта: для каждой записи отправляется JSON полей, модель должна вернуть JSON с теми же ключами.
- Учтите возможные расходы и лимиты запросов у OpenRouter.

## Советы по использованию

- Начинайте с `--dry-run`, чтобы проверить качество перевода на небольшом `--limit`.
- Увеличивайте `--concurrency` постепенно (например, до `4`) при стабильной работе.
- Разделяйте большие прогоны по сущностям (например, отдельно `universities`, затем `reviews`).
