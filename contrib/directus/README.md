# Конфигурация Directus

Эта папка может хранить экспорт снапшотов Directus и заметки по конфигурации.

- Запуск Directus: `docker compose up -d directus`
- Проверка состояния: `curl -sSf http://localhost:8055/server/health`

## Процесс работы со снапшотом схемы

1. Настройте коллекции/связи/права в интерфейсе Directus.
2. Экспортируйте снапшот в `directus/schema.yaml`:

```bash
npm run directus:schema:snapshot
```

3. Закоммитьте `directus/schema.yaml` в репозиторий.

4. Примените снапшот на любом окружении:

```bash
npm run directus:schema:apply
```

Обе команды используют переменные окружения:

- `DIRECTUS_PUBLIC_URL` (по умолчанию http://localhost:8055)
- `DIRECTUS_ADMIN_EMAIL`
- `DIRECTUS_ADMIN_PASSWORD`

Совет: задайте их в `.env`, как показано в корневом `README.md` проекта.
