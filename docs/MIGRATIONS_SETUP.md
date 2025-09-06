# Миграции БД (Prisma): локально и прод

Минимальная инструкция, как создавать и применять миграции для MySQL через Prisma.

## Быстрый старт (локально)

1) Запустить БД (Docker):
```bash
npm run docker:up
```

2) Настроить `.env` (пример):
```env
DATABASE_URL="mysql://user:password@localhost:3306/edu_turkish"
```

3) Создать миграцию из изменений в `prisma/schema.prisma` и применить её к локальной БД:
```bash
# имя миграции укажите в kebab-case
npm run db:migrate -- --name add-new-fields
```

4) (Опционально) Сгенерировать клиент и открыть студию:
```bash
npm run db:generate
npm run db:studio
```

5) (Опционально) Засидить данные:
```bash
npm run db:seed
```

Готово. Локальная схема обновлена, миграции созданы и закоммичены в репозиторий.

### Альтернатива для быстрого поднятия пустой БД
Если миграции не нужны (ранний прототип), можно быстро накатить схему и сиды:
```bash
npm run setup:dev  # docker:up + db:push + db:seed
```
Примечание: `db:push` не создаёт миграции и не используется на проде.

## Прод (production)

1) Убедитесь, что миграции закоммичены в репозиторий (созданы командой выше).

2) На сервере/в CI задать переменные окружения, в т.ч. `DATABASE_URL`.

3) Применить миграции на проде:
```bash
npm run db:deploy   # prisma migrate deploy
```

4) Перезапустить приложение (если нужно) после успешного деплоя миграций.

## Полезные команды

```bash
npm run db:migrate         # создать и применить миграцию (dev)
npm run db:deploy          # применить существующие миграции (prod)
npm run db:generate        # сгенерировать Prisma Client
npm run db:seed            # засеять данные (локально)
npm run db:studio          # Prisma Studio (GUI)
npm run db:migrate:reset   # сбросить локальную БД и применить все миграции с нуля
```

## Коротко о правилах

- В деве меняем `prisma/schema.prisma` → `npm run db:migrate -- --name <change>`.
- В проде НЕ используем `db:push`. Только `npm run db:deploy`.
- Миграции должны быть в git, откаты и повторные прогоны работают штатно.
