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


