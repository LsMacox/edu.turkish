# API Contract: EspoCRM Webhook Endpoints

**Version**: 1.0.0  
**Date**: 2025-10-12

## Overview

This document defines the API contracts for EspoCRM webhook endpoints that receive notifications for new leads and call activities.

---

## Endpoint 1: Lead Webhook

### Request

**Method**: `POST`  
**Path**: `/api/webhooks/espocrm/lead`  
**Query Parameters**:
- `token` (required): Webhook authentication token

**Headers**:
```
Content-Type: application/json
```

**Body Schema**:
```json
{
  "entityType": "Lead",
  "event": "create",
  "entity": {
    "id": "string (required)",
    "name": "string (required)",
    "firstName": "string (optional)",
    "lastName": "string (optional)",
    "phoneNumber": "string (optional)",
    "emailAddress": "string (optional)",
    "accountName": "string (optional)",
    "status": "string (required)",
    "source": "string (optional)",
    "description": "string (optional)",
    "assignedUserId": "string (optional)",
    "assignedUserName": "string (optional)",
    "teamsIds": ["string"] (optional),
    "teamsNames": {"teamId": "teamName"} (optional),
    "createdAt": "ISO 8601 datetime (required)",
    "modifiedAt": "ISO 8601 datetime (required)"
  },
  "timestamp": "ISO 8601 datetime (required)",
  "userId": "string (optional)",
  "userName": "string (optional)"
}
```

**Example Request**:
```json
{
  "entityType": "Lead",
  "event": "create",
  "entity": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Иван Петров",
    "firstName": "Иван",
    "lastName": "Петров",
    "phoneNumber": "+7 999 123 45 67",
    "emailAddress": "ivan.petrov@example.com",
    "accountName": "ООО Компания",
    "status": "New",
    "source": "Website",
    "description": "Интересуется программой MBA",
    "assignedUserId": "user123",
    "assignedUserName": "Анна Смирнова",
    "teamsIds": ["team-abc-123"],
    "teamsNames": {
      "team-abc-123": "Отдел продаж"
    },
    "createdAt": "2025-10-12T10:30:00+03:00",
    "modifiedAt": "2025-10-12T10:30:00+03:00"
  },
  "timestamp": "2025-10-12T10:30:00+03:00",
  "userId": "user123",
  "userName": "Анна Смирнова"
}
```

### Response

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Webhook received and queued for processing",
  "jobId": "telegram-notification-1697123456789-abc123"
}
```

**Error Responses**:

**401 Unauthorized** (Invalid token):
```json
{
  "success": false,
  "error": "Invalid webhook token"
}
```

**400 Bad Request** (Invalid payload):
```json
{
  "success": false,
  "error": "Invalid webhook payload",
  "details": {
    "field": "entity.emailAddress",
    "message": "Invalid email format"
  }
}
```

**400 Bad Request** (Wrong event type):
```json
{
  "success": false,
  "error": "Only 'create' events are supported",
  "received": "update"
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Failed to queue notification"
}
```

### Business Rules

1. **Authentication**: Token must match `NUXT_ESPOCRM_WEBHOOK_TOKEN`
2. **Event Filter**: Only process `event: "create"`, reject others
3. **Team Filter**: If `NUXT_ESPOCRM_ASSIGNED_TEAM_ID` is set:
   - Check if `entity.teamsIds` includes the configured team ID
   - If no match and `teamsIds` is not empty, skip notification (return 200 but don't queue)
   - If `teamsIds` is empty/null, send notification (simplified approach)
4. **Async Processing**: Queue job immediately, return 200 OK
5. **Idempotency**: Not guaranteed - duplicate webhooks will create duplicate notifications

---

## Endpoint 2: Call Activity Webhook

### Request

**Method**: `POST`  
**Path**: `/api/webhooks/espocrm/call-activity`  
**Query Parameters**:
- `token` (required): Webhook authentication token

**Headers**:
```
Content-Type: application/json
```

**Body Schema**:
```json
{
  "entityType": "Call",
  "event": "create",
  "entity": {
    "id": "string (required)",
    "name": "string (required)",
    "status": "Planned | Held | Not Held (required)",
    "dateStart": "ISO 8601 datetime (optional)",
    "dateEnd": "ISO 8601 datetime (optional)",
    "duration": "number (seconds, optional)",
    "description": "string (optional)",
    "direction": "Outbound | Inbound (optional)",
    "parentType": "string (optional)",
    "parentId": "string (optional)",
    "parentName": "string (optional)",
    "contactId": "string (optional)",
    "contactName": "string (optional)",
    "accountId": "string (optional)",
    "accountName": "string (optional)",
    "assignedUserId": "string (optional)",
    "assignedUserName": "string (optional)",
    "teamsIds": ["string"] (optional),
    "teamsNames": {"teamId": "teamName"} (optional),
    "createdAt": "ISO 8601 datetime (required)",
    "modifiedAt": "ISO 8601 datetime (required)"
  },
  "timestamp": "ISO 8601 datetime (required)",
  "userId": "string (optional)",
  "userName": "string (optional)"
}
```

**Example Request**:
```json
{
  "entityType": "Call",
  "event": "create",
  "entity": {
    "id": "call-123-abc",
    "name": "Звонок с Иваном Петровым",
    "status": "Held",
    "dateStart": "2025-10-12T14:00:00+03:00",
    "dateEnd": "2025-10-12T14:15:00+03:00",
    "duration": 900,
    "description": "Обсудили условия поступления, отправил информацию на email",
    "direction": "Outbound",
    "parentType": "Lead",
    "parentId": "64a1b2c3d4e5f6g7h8i9j0k1",
    "parentName": "Иван Петров",
    "contactId": "contact-456",
    "contactName": "Иван Петров",
    "phoneNumber": "+7 999 123 45 67",
    "assignedUserId": "user123",
    "assignedUserName": "Анна Смирнова",
    "teamsIds": ["team-abc-123"],
    "teamsNames": {
      "team-abc-123": "Отдел продаж"
    },
    "createdAt": "2025-10-12T14:16:00+03:00",
    "modifiedAt": "2025-10-12T14:16:00+03:00"
  },
  "timestamp": "2025-10-12T14:16:00+03:00",
  "userId": "user123",
  "userName": "Анна Смирнова"
}
```

### Response

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Webhook received and queued for processing",
  "jobId": "telegram-notification-1697123456789-xyz789"
}
```

**Error Responses**: Same as Lead webhook endpoint

### Business Rules

Same as Lead webhook, with team filtering applied to Call entities.

---

## Telegram Bot API Contract

### Send Message to Channel

**Method**: `POST`  
**URL**: `https://api.telegram.org/bot{token}/sendMessage`

**Request Body**:
```json
{
  "chat_id": "-100xxxxxxxxxx",
  "text": "Message text with HTML formatting",
  "parse_mode": "HTML",
  "disable_web_page_preview": true,
  "disable_notification": false
}
```

**Success Response** (200 OK):
```json
{
  "ok": true,
  "result": {
    "message_id": 12345,
    "date": 1697123456,
    "chat": {
      "id": -100xxxxxxxxxx,
      "type": "channel",
      "title": "Leads Channel"
    },
    "text": "Message text"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "ok": false,
  "error_code": 400,
  "description": "Bad Request: chat not found"
}
```

---

## Message Format Contracts

### Lead Notification Message

**Format**: HTML  
**Max Length**: 4096 characters (Telegram limit)

**Template**:
```html
🆕 <b>Новый лид</b>

👤 <b>Имя:</b> {firstName} {lastName}
📱 <b>Телефон:</b> {phoneNumber}
📧 <b>Email:</b> {emailAddress}
🏢 <b>Компания:</b> {accountName}
🌐 <b>Источник:</b> {source}
📊 <b>Статус:</b> {status}
📝 <b>Описание:</b> {description}
👨‍💼 <b>Ответственный:</b> {assignedUserName}
⏰ <b>Время:</b> {formattedDateTime}
```

**Field Rules**:
- If field is empty/null, omit the entire line
- Truncate description to 200 characters if longer
- DateTime format: `DD.MM.YYYY HH:mm`

**Example**:
```
🆕 Новый лид

👤 Имя: Иван Петров
📱 Телефон: +7 999 123 45 67
📧 Email: ivan.petrov@example.com
🏢 Компания: ООО Компания
🌐 Источник: Website
📊 Статус: New
📝 Описание: Интересуется программой MBA
👨‍💼 Ответственный: Анна Смирнова
⏰ Время: 12.10.2025 10:30
```

### Call Activity Notification Message

**Format**: HTML  
**Max Length**: 4096 characters

**Template**:
```html
📞 <b>Новый звонок</b>

👤 <b>Контакт:</b> {contactName or parentName}
📱 <b>Телефон:</b> {phoneNumber}
📊 <b>Статус:</b> {status}
↔️ <b>Направление:</b> {direction}
⏱ <b>Длительность:</b> {formattedDuration}
📝 <b>Заметки:</b> {description}
👨‍💼 <b>Ответственный:</b> {assignedUserName}
⏰ <b>Время:</b> {formattedDateTime}
```

**Field Rules**:
- If field is empty/null, omit the entire line
- Duration format: `MM:SS` (e.g., "15:00" for 900 seconds)
- Direction: "Исходящий" / "Входящий"
- Status: "Запланирован" / "Состоялся" / "Не состоялся"
- Truncate description to 300 characters if longer

**Example**:
```
📞 Новый звонок

👤 Контакт: Иван Петров
📱 Телефон: +7 999 123 45 67
📊 Статус: Состоялся
↔️ Направление: Исходящий
⏱ Длительность: 15:00
📝 Заметки: Обсудили условия поступления, отправил информацию на email
👨‍💼 Ответственный: Анна Смирнова
⏰ Время: 12.10.2025 14:00
```

---

## Contract Testing Requirements

### Webhook Endpoint Tests

1. **Authentication Tests**:
   - ✅ Valid token → 200 OK
   - ✅ Invalid token → 401 Unauthorized
   - ✅ Missing token → 401 Unauthorized

2. **Payload Validation Tests**:
   - ✅ Valid lead payload → 200 OK, job queued
   - ✅ Valid call payload → 200 OK, job queued
   - ✅ Missing required fields → 400 Bad Request
   - ✅ Invalid email format → 400 Bad Request
   - ✅ Wrong entityType → 400 Bad Request
   - ✅ Wrong event type (update/delete) → 400 Bad Request

3. **Team Filter Tests**:
   - ✅ Team matches → notification queued
   - ✅ Team doesn't match → 200 OK but no notification
   - ✅ No team configured → notification queued
   - ✅ Empty teamsIds → notification queued (simplified)

4. **Response Format Tests**:
   - ✅ Success response includes jobId
   - ✅ Error response includes error message
   - ✅ Validation errors include details

### Message Format Tests

1. **Lead Message Tests**:
   - ✅ All fields present → full message
   - ✅ Optional fields missing → fields omitted
   - ✅ Long description → truncated to 200 chars
   - ✅ HTML special characters → properly escaped
   - ✅ Message under 4096 chars

2. **Call Message Tests**:
   - ✅ All fields present → full message
   - ✅ Duration formatted correctly (MM:SS)
   - ✅ Direction translated to Russian
   - ✅ Status translated to Russian
   - ✅ Long description → truncated to 300 chars

---

## Rate Limiting

**Webhook Endpoints**: No rate limiting (trust EspoCRM)  
**Telegram API**: BullMQ limiter - max 10 jobs/second  
**Queue Concurrency**: 5 concurrent workers

---

## Versioning

**Current Version**: 1.0.0  
**Breaking Changes**: None yet  
**Future Considerations**: 
- v1.1: Add support for update events
- v1.2: Add support for multiple teams
- v2.0: Add webhook signature verification (HMAC)
