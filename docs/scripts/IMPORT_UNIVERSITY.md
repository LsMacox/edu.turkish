# Импорт университета (`scripts/import-university.ts`)

Скрипт загружает университет из JSON-файла и создаёт/обновляет связанные сущности: переводы, программы, направления, кампус, приёмную кампанию, стипендии и медиа. Используется для массового ввода данных и синхронизации с внешними системами.

## Предварительные требования

- Node.js 18+
- Актуальная Prisma schema и клиент (`npx prisma generate`)
- Запущенная БД (`DATABASE_URL` указывает на нужный инстанс)

## Запуск

```bash
# через npm-скрипт
npm run import:university -- ./path/to/university.json --upsert-by=slug

# напрямую
npx tsx scripts/import-university.ts ./app/assets/json/universities/atlas.json --upsert-by=title
```

Параметры:

- Первый аргумент — путь к JSON-файлу (абсолютный или относительный).
- `--upsert-by=slug|title` — поле, по которому искать существующую запись (по умолчанию `slug`).

## Структура входного JSON

Файл содержит один университет. Основные секции:

| Поле                                                                                            | Описание                                                                                         |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `locale`                                                                                        | Язык исходных строк (используется как локаль перевода)                                           |
| `countryCode`, `countryName`                                                                    | Информация о стране (при необходимости создаётся перевод)                                        |
| `title`, `description`, `slug`, `city`, `foundedYear`, `type`                                   | Базовые поля университета                                                                        |
| `tuitionRange`, `totalStudents`, `internationalStudents`, `hasAccommodation`, `hasScholarships` | Числовые и булевые атрибуты                                                                      |
| `about`                                                                                         | Объект с разделами `history`, `mission`, `advantages`                                            |
| `key_info_texts`                                                                                | Текстовые блоки (в том числе `ranking_text`)                                                     |
| `campus_life`                                                                                   | Галерея (`gallery`) и инфраструктура (`facilities`) с переводами                                 |
| `admission`                                                                                     | Требования (`requirements`), документы (`documents`), даты (`dates`), стипендии (`scholarships`) |
| `programs`                                                                                      | Учебные программы c типом степени, языком, длительностью и переводом                             |
| `directions`                                                                                    | Список слагов направлений; создаются при необходимости                                           |
| `translation`                                                                                   | Дополнительный перевод университета (поля аналогичны базовым)                                    |

Каждый элемент коллекций может содержать поле `translation` с `locale` и соответствующими строками. Скрипт создаёт записи в таблицах `*_translations` только если переводов ещё нет.

Ниже приведён сокращённый пример (JSON с комментариями):

```jsonc
{
  "locale": "ru",
  "countryCode": "TUR",
  "title": "Пример технологического университета",
  "description": "Частный технологический вуз в Стамбуле",
  "slug": "example-tech-university",
  "city": "Стамбул",
  "type": "private",
  "tuitionRange": { "min": 3500, "max": 9000, "currency": "USD" },
  "about": {
    "history": "Основан в 1998 году",
    "mission": "Готовим инженеров и предпринимателей",
    "advantages": [
      "Современные лаборатории",
      { "title": "Карьерный центр", "description": "Стажировки в Турции и ЕС" },
    ],
  },
  "strong_programs": [
    { "category": "Инженерия", "programs": ["Мехатроника", "Программная инженерия"] },
  ],
  "key_info_texts": {
    "ranking_label": "Рейтинг",
    "ranking_text": "Top-50 в Турции по версии QS Europe 2024",
  },
  "campus_life": {
    "facilities": [
      {
        "name": "Научная библиотека",
        "description": "24/7 доступ",
        "translation": { "locale": "en", "name": "Science library", "description": "24/7 access" },
      },
    ],
    "gallery": [
      {
        "kind": "image",
        "url": "https://cdn.example.com/campus.jpg",
        "title": "Главный корпус",
        "translation": { "locale": "en", "title": "Main campus" },
      },
    ],
  },
  "admission": {
    "requirements": [
      {
        "category": "Бакалавриат",
        "requirement": "IELTS 6.0",
        "translation": { "locale": "en", "category": "Undergraduate", "requirement": "IELTS 6.0" },
      },
    ],
    "documents": [
      {
        "name": "Аттестат",
        "format_requirements": ["PDF", "Цветной скан"],
        "translation": { "locale": "en", "name": "High school diploma" },
      },
    ],
    "dates": [
      {
        "event": "Дедлайн подачи",
        "date": "2024-07-15",
        "type": "deadline",
        "translation": { "locale": "en", "event": "Application deadline" },
      },
    ],
    "scholarships": [
      {
        "name": "Стипендия успеха",
        "type": "university",
        "coverage_percentage": 50,
        "translation": { "locale": "en", "name": "Merit scholarship" },
      },
    ],
  },
  "programs": [
    {
      "name": "Программная инженерия",
      "degree_type": "bachelor",
      "language": "en",
      "duration_years": 4,
      "tuition_per_year": 6000,
      "direction_slug": "software-engineering",
      "translation": { "locale": "en", "name": "Software Engineering" },
    },
  ],
  "directions": ["software-engineering"],
  "translation": {
    "locale": "en",
    "title": "Example Tech University",
    "description": "Private tech-focused university in Istanbul.",
    "slug": "example-tech-university-en",
  },
}
```

## Поведение

- При `--upsert-by=slug` скрипт ищет перевод в `UniversityTranslation` и определяет исходную запись по `universityId`.
- Если запись существует, связанные сущности обновляются, новые записи создаются (`upsert`).
- Направления (`directions`) создаются автоматически, если их ещё нет.
- Для стран добавляется перевод в `CountryTranslation`, если указан `countryName`.
- Отсутствующие поля можно опускать — валидатор (Zod) применяет `default([])` для коллекций.

## Рекомендации

- Перед импортом подготовьте медиа-файлы и убедитесь, что пути/URL корректны.
- Импорт запускайте в ветке или с бэкапом БД, чтобы при ошибке можно было откатиться.
- После импорта запустите `npm run i18n:check`, чтобы убедиться в консистентности ключей.
- Для массового импорта запускайте скрипт по одному файлу — так проще отлавливать ошибки валидации.
