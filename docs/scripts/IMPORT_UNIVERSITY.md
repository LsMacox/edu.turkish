## Назначение

CLI `scripts/import-university.ts` импортирует/обновляет один университет и все связанные сущности из JSON-файла.

## Предварительные требования

- Node.js 18+
- Настроенный `DATABASE_URL`
- Prisma Client сгенерирован: `npm run db:generate`

## Как передать файл

Скрипт принимает абсолютный или относительный путь к JSON-файлу первым позиционным аргументом.

Примеры:

```bash
# Через npm-скрипт
npm run import:university -- /absolute/path/university.json --upsert-by=slug

# Напрямую через tsx/npx
npx tsx scripts/import-university.ts ./app/assets/json/universities/atlas_university.json --upsert-by=title
```

- `--upsert-by=slug|title` — по какому полю искать существующий университет (по умолчанию: `slug`).
- Путь может быть относительным к текущей директории запуска или абсолютным.

## Структура входного JSON

Полная схема входных данных приведена в описании и примере в ответе ассистента, а также соответствует проверкам в `scripts/import-university.ts`.
Основные разделы (все блоки опциональны, кроме базовых полей университета):

- Базовые поля университета: `locale`, `countryCode`, `title`, `description`, `slug`, `city`, `foundedYear`, `type`, `tuitionRange`, `totalStudents`, `internationalStudents`, `hasAccommodation`, `heroImage`, `image`, `about`, `strong_programs` (заполняет таблицу FeaturedProgram)
  - Примечание: данные рейтинга теперь переводимые и задаются через `key_info_texts.ranking_text` (и его переводы) вместо числовых полей.
- `translation`: дополнительный перевод университета (опциональный объект с вложенными `about`, `strong_programs`, `key_info_texts`)
- `programs`: академические программы; каждая запись поддерживает `translation`
- `directions`: список `slug` направлений для связи через `university_directions`
- `campus_life.facilities`: инфраструктура кампуса + `translation`
- `campus_life.gallery`: медиа-галерея + `translation`
- `admission.requirements`: требования к поступлению + `translation`
- `admission.documents`: необходимые документы + `translation`
- `admission.dates`: важные даты/дедлайны + `translation`
- `admission.scholarships`: стипендии + `translation`

Ниже — укороченный пример JSON, покрывающий все ключевые разделы и соответствующий проверкам в `scripts/import-university.ts`:

```jsonc
{
  "locale": "ru",
  "countryCode": "TUR",
  "countryName": "Турция",
  "title": "Пример технологического университета",
  "description": "Частный технологический вуз в Стамбуле, сильный в инженерии и бизнесе.",
  "slug": "example-tech-university",
  "city": "Стамбул",
  "foundedYear": 1998,
  "type": "private",
  "tuitionRange": { "min": 3500, "max": 9000, "currency": "USD" },
  "totalStudents": 12000,
  "internationalStudents": 2200,
  "hasAccommodation": true,
  "hasScholarships": true,
  "heroImage": "/images/universities/example-hero.jpg",
  "image": "/images/universities/example-card.jpg",
  "about": {
    "history": "Основан в 1998 году как технологический институт.",
    "mission": "Готовим инженеров и предпринимателей для глобального рынка.",
    "advantages": [
      "Современные лаборатории и акселератор стартапов",
      { "title": "Карьерный центр", "description": "Оплачиваемые стажировки в Турции и ЕС" },
    ],
  },
  "strong_programs": [
    { "category": "Инженерия", "programs": ["Мехатроника", "Программная инженерия"] },
    { "category": "Бизнес", "programs": ["Цифровой маркетинг"] },
  ],
  "key_info_texts": {
    "languages_note": "Английский, Турецкий",
    "ranking_label": "Рейтинг",
    "ranking_text": "Top-50 в Турции по версии QS Europe 2024",
  },
  "campus_life": {
    "gallery": [
      {
        "kind": "image",
        "url": "https://cdn.example.com/university/campus-day.jpg",
        "title": "Главный кампус",
        "caption": "Вид на кампус днём",
        "translation": {
          "locale": "en",
          "title": "Main campus",
          "caption": "Campus overview",
        },
      },
    ],
    "facilities": [
      {
        "name": "Научная библиотека",
        "description": "24/7 доступ и медиатека",
        "icon": "ph:books",
        "translation": {
          "locale": "en",
          "name": "Science library",
          "description": "24/7 access and media center",
        },
      },
    ],
  },
  "admission": {
    "requirements": [
      {
        "category": "Бакалавриат",
        "requirement": "IELTS 6.0 и GPA 3.0+",
        "translation": {
          "locale": "en",
          "category": "Undergraduate",
          "requirement": "IELTS 6.0 and GPA 3.0+",
        },
      },
    ],
    "documents": [
      {
        "name": "Аттестат",
        "description": "Перевод на английский, нотариальное заверение",
        "format_requirements": ["PDF", "Цветной скан"],
        "translation": {
          "locale": "en",
          "name": "High school diploma",
          "description": "Official translation",
        },
      },
    ],
    "dates": [
      {
        "event": "Дедлайн подачи",
        "date": "2024-07-15",
        "type": "deadline",
        "translation": {
          "locale": "en",
          "event": "Application deadline",
        },
      },
    ],
    "scholarships": [
      {
        "name": "Стипендия успеха",
        "type": "university",
        "coverage_percentage": 50,
        "eligibility_criteria": ["GPA ≥ 3.2", "Мотивационное письмо"],
        "application_deadline": "2024-05-01",
        "translation": {
          "locale": "en",
          "name": "Merit scholarship",
          "eligibility_criteria": ["GPA ≥ 3.2", "Motivation letter"],
        },
      },
    ],
  },
  "programs": [
    {
      "name": "Программная инженерия",
      "description": "4-летняя программа с акцентом на R&D",
      "degree_type": "bachelor",
      "language": "en",
      "duration_years": 4,
      "tuition_per_year": 6000,
      "direction_slug": "software-engineering",
      "translation": {
        "locale": "en",
        "name": "Software Engineering",
        "description": "4-year R&D focused curriculum",
      },
    },
    {
      "name": "Бизнес-аналитика",
      "degree_type": "master",
      "language": "en",
      "duration_years": 2,
      "tuition_per_year": 7000,
      "direction_slug": "management",
    },
  ],
  "directions": ["software-engineering", "management", "data-science"],
  "translation": {
    "locale": "en",
    "title": "Example Tech University",
    "description": "Private tech-focused university in Istanbul.",
    "slug": "example-tech-university-en",
    "about": {
      "history": "Founded in 1998 as a technology institute.",
      "mission": "Preparing engineers and entrepreneurs for global careers.",
      "advantages": [
        "Cutting-edge labs and startup accelerator",
        { "title": "Career center", "description": "Internships across Turkey and the EU" },
      ],
    },
    "strong_programs": [
      { "category": "Engineering", "programs": ["Mechatronics", "Software Engineering"] },
      { "category": "Business", "programs": ["Digital Marketing"] },
    ],
    "key_info_texts": {
      "ranking_text": "Top-50 in Turkey (QS Europe 2024)",
      "languages_note": "English, Turkish",
    },
  },
}
```

## Поведение

- Университет апдейтится по `slug` (или `title` при `--upsert-by=title`).
- Переводы и связанные сущности создаются, если отсутствуют; уже существующие уникальные пары (id+locale) обновляются через upsert.
- Направления (`study_directions`) автоматически создаются по `slug`, если их не было.

## Пакетный импорт всех JSON из каталога (bash, скопируйте в терминал)

Скопируйте и выполните в терминале (импортирует все `.json` из `app/assets/json/universities`):

```bash
#!/usr/bin/env bash
set -e
set -u
set -o pipefail

UPSERT_BY="${UPSERT_BY:-slug}"
DIR="./app/assets/json/universities"

# Enable nullglob for both bash and zsh so unmatched globs produce empty array
if [ -n "${ZSH_VERSION:-}" ]; then
  setopt NULL_GLOB
else
  shopt -s nullglob
fi

files=("$DIR"/*.json)

if (( ${#files[@]} == 0 )); then
  printf 'No JSON files found in %s\n' "$DIR" >&2
fi

printf 'Found %d JSON file(s) in %s; upsert-by=%s\n' "${#files[@]}" "$DIR" "$UPSERT_BY"
failures=()
for f in "${files[@]}"; do
  printf '\n— Importing: %s\n' "$f"
  if ! npm run -s import:university -- "$f" --upsert-by="$UPSERT_BY"; then
    printf 'Failed: %s\n' "$f" >&2
    failures+=("$f")
  fi
done

printf '\nSummary: %d succeeded, %d failed\n' "$(( ${#files[@]} - ${#failures[@]} ))" "${#failures[@]}"
if (( ${#failures[@]} > 0 )); then
  printf '%s\n' "Failed files:" >&2
  for f in "${failures[@]}"; do printf ' - %s\n' "$f" >&2; done
fi
```

Примечания:

- По умолчанию апдейт идёт по `slug`. Чтобы обновлять по названию, выполните: `UPSERT_BY=title bash -c "$(cat <<'BASH' ; <вставьте скрипт выше> ; BASH)"` или просто перед запуском экспортируйте `UPSERT_BY=title`.
