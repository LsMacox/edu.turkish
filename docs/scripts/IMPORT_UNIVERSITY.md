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
npx tsx scripts/import-university.ts ./app/assets/json/universities/technica_university.json --upsert-by=title
```

- `--upsert-by=slug|title` — по какому полю искать существующий университет (по умолчанию: `slug`).
- Путь может быть относительным к текущей директории запуска или абсолютным.

## Структура входного JSON

Полная схема входных данных приведена в описании и примере в ответе ассистента, а также соответствует проверкам в `scripts/import-university.ts`.
Основные разделы (все блоки опциональны, кроме базовых полей университета):

- Базовые поля университета: `title`, `description`, `slug`, `city`, `foundedYear`, `type`, `tuitionMin/Max`, `currency`, `totalStudents`, `internationalStudents`, `hasAccommodation`, `heroImage`, `image`, `about`, `strongPrograms`, `campusGallery`, `multilingualSlugs`
  - Примечание: данные рейтинга теперь переводимые и должны задаваться через переводы (`ranking_text`, `key_info_texts.ranking`) вместо числовых полей.
- `translations`: массив переводов университета
- `languages`: массив языков обучения (создаёт записи `university_languages`)
- `programs`: академические программы + `translations`
- `directions`: направления + `translations` и связка через `university_directions` (создаёт направление, если отсутствует)
- `facilities`: инфраструктура + `translations`
- `dormitories`: общежития + `translations`
- `requirements`: требования к поступлению + `translations`
- `documents`: необходимые документы + `translations`
- `dates`: важные даты/дедлайны + `translations`
- `scholarships`: стипендии + `translations`
- `reviews`: отзывы + `translations`

См. также пример полного JSON в документации/переписке или используйте ранее предоставленный шаблон.

## Поведение

- Университет апдейтится по `slug` (или `title` при `--upsert-by=title`).
- Переводы и связанные сущности создаются, если отсутствуют; уже существующие уникальные пары (id+locale) обновляются через upsert.
- Направления (`study_directions`) автоматически создаются по `slug`, если их не было.

## Пакетный импорт всех JSON из каталога (bash, скопируйте в терминал)

Скопируйте и выполните в терминале (импортирует все `.json` из `app/assets/json/universities`):

```bash
#!/usr/bin/env bash
set -euo pipefail

UPSERT_BY="${UPSERT_BY:-slug}"
DIR="./app/assets/json/universities"

shopt -s nullglob
files=("$DIR"/*.json)
shopt -u nullglob

if (( ${#files[@]} == 0 )); then
  echo "No JSON files found in $DIR" >&2
fi

echo "Found ${#files[@]} JSON file(s) in $DIR; upsert-by=$UPSERT_BY"
failures=()
for f in "${files[@]}"; do
  echo "\n— Importing: $f"
  if ! npm run -s import:university -- "$f" --upsert-by="$UPSERT_BY"; then
    echo "Failed: $f" >&2
    failures+=("$f")
  fi
done

echo "\nSummary: $(( ${#files[@]} - ${#failures[@]} )) succeeded, ${#failures[@]} failed"
if (( ${#failures[@]} > 0 )); then
  printf '%s\n' "Failed files:" >&2
  for f in "${failures[@]}"; do printf ' - %s\n' "$f" >&2; done
fi
```

Примечания:
- По умолчанию апдейт идёт по `slug`. Чтобы обновлять по названию, выполните: `UPSERT_BY=title bash -c "$(cat <<'BASH' ; <вставьте скрипт выше> ; BASH)"` или просто перед запуском экспортируйте `UPSERT_BY=title`.


