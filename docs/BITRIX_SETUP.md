# Настройка Bitrix (кратко и по делу)

Проект автоматически создает лид в Bitrix при отправке заявки (`POST /api/v1/applications`). Ниже — только то, что нужно, чтобы это заработало.

## Переменные окружения

В `.env` укажите один из вариантов аутентификации:

### Вариант A — Webhook URL (рекомендуемый)
```env
BITRIX_WEBHOOK_URL="https://<domain>.bitrix24.ru/rest/<userId>/<webhook_code>/"
```

### Вариант B — Домен + токен
```env
BITRIX_DOMAIN="<domain>.bitrix24.ru"
BITRIX_ACCESS_TOKEN="<token>"

# Необязательно. Укажите, если хотите webhook-стиль без полного URL
# (в этом случае ACCESS_TOKEN — это webhook code, а USER_ID — id пользователя)
# BITRIX_AUTH_MODE=webhook
# BITRIX_USER_ID=1
```

## Проверка

- Проверить конфиг:
```bash
curl http://localhost:3000/api/v1/bitrix/test
```

- Создать тестовый лид (опционально можно передать поля заявки):
```bash
curl -X POST http://localhost:3000/api/v1/bitrix/lead.test \
  -H "Content-Type: application/json" \
  -d '{
    "personal_info": {"first_name": "Test", "last_name": "Lead", "email": "test@example.com", "phone": "+10000000000"},
    "source": "website"
  }'
```

## Частые ошибки

- "Bitrix configuration is missing" — не заданы `BITRIX_WEBHOOK_URL` или связка `BITRIX_DOMAIN` + `BITRIX_ACCESS_TOKEN`.
- 401/403 — проверьте токен/права приложения, корректность домена и срока действия токена.

## Примечания

- Интеграция не блокирует сохранение заявки локально: при ошибке в Bitrix заявка всё равно сохраняется в БД.
- Источник заявки передается в поле `UF_CRM_1234567892`, базовые предпочтения — в `COMMENTS`.
