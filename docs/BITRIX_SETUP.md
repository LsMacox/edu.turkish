# Настройка Bitrix (кратко и по делу)

Проект автоматически создает лид в Bitrix при отправке заявки (`POST /api/v1/applications`). Ниже — только то, что нужно, чтобы это заработало.

## Переменные окружения

1. **Выберите способ аутентификации.**

   ### Вариант A — Webhook URL (рекомендуемый)
   ```env
   BITRIX_WEBHOOK_URL="https://<domain>.bitrix24.ru/rest/<userId>/<webhook_code>/"
   ```

   Один URL закрывает все вопросы с авторизацией, дополнительные параметры не нужны.

   ### Вариант B — Домен + токен
   ```env
   BITRIX_DOMAIN="<domain>.bitrix24.ru"
   BITRIX_ACCESS_TOKEN="<token>"
   ```

   - Если используете **вебхук без полного URL**, добавьте:
     ```env
     BITRIX_AUTH_MODE=webhook
     BITRIX_USER_ID=<id пользователя, выдавшего вебхук>
     ```
     Тогда сервис соберёт путь `https://<domain>/rest/<userId>/<token>/<method>.json`.
   - Для **OAuth-приложения Bitrix** оставьте `BITRIX_AUTH_MODE` пустым (или задайте `oauth`) — токен подставится как `auth`-параметр.

2. **(Опционально) Настройте, как создаются CRM-активности.**

   Эти переменные управляют полями `OWNER_ID`, `OWNER_TYPE_ID`, `RESPONSIBLE_ID` при вызове `crm.activity.add`. Заполняйте их, если нужно привязывать события из виджета к конкретной сущности и исполнителю.

   ```env
   BITRIX_ACTIVITY_OWNER_ID=<id лида/сделки/контакта>
   BITRIX_ACTIVITY_OWNER_TYPE_ID=1 # 1 — лид, 2 — сделка, 3 — контакт, 4 — компания
   BITRIX_ACTIVITY_RESPONSIBLE_ID=<id ответственного менеджера>
   ```

   - `BITRIX_ACTIVITY_OWNER_ID` — идентификатор CRM-сущности, к которой будет прикреплено дело.
   - `BITRIX_ACTIVITY_OWNER_TYPE_ID` — тип сущности (см. комментарий выше). Указывайте вместе с `OWNER_ID`, чтобы Bitrix знал, к чему привязывать активность.
   - `BITRIX_ACTIVITY_RESPONSIBLE_ID` — сотрудник, на которого назначаем активность (если не указать, Bitrix оставит стандартное значение).

   Если оставить параметры пустыми, сервис не будет отправлять соответствующие поля — Bitrix применит свои значения по умолчанию или вернёт ошибку, если в вашем портале привязка обязательна.

## Проверка

- Проверить конфиг:
```bash
curl http://localhost:3000/api/v1/bitrix/test
```

- Посмотреть, какие данные будут отправлены в лид (ничего не уходит в Bitrix):
```bash
curl -X POST http://localhost:3000/api/v1/bitrix/preview \
  -H "Content-Type: application/json" \
  -d '{
    "personal_info": {"first_name": "Test", "last_name": "Lead", "email": "test@example.com", "phone": "+10000000000"},
    "education": {"level": "bachelor", "field": "engineering"},
    "preferences": {"budget": "до 5000$"},
    "source": "website"
  }'
```

Маршрут `/api/v1/bitrix/preview` принимает тот же payload, что и `POST /api/v1/applications`: блоки `personal_info`,
`education`, `preferences` и `source` обязательны, остальные поля (например, `user_preferences`, `additional_info`,
`referral_code`) — опциональны.

## Частые ошибки

- "Bitrix configuration is missing" — не заданы `BITRIX_WEBHOOK_URL` или связка `BITRIX_DOMAIN` + `BITRIX_ACCESS_TOKEN`.
- 401/403 — проверьте токен/права приложения, корректность домена и срока действия токена.

## Примечания

- Интеграция не блокирует сохранение заявки локально: при ошибке в Bitrix заявка всё равно сохраняется в БД.
- Источник заявки передается в поле `UF_CRM_1234567892`, базовые предпочтения — в `COMMENTS`.
