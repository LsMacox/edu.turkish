# Мониторинг Telegram Notifications Queue

## 📊 Доступные инструменты

### 1. Health Check API (основной способ)

```bash
# Проверка статуса
curl https://your-domain.com/api/health/telegram-queue

# Локально
curl http://localhost:3000/api/health/telegram-queue
```

**Ответ:**
```json
{
  "healthy": true,
  "status": "ok",
  "queue": "telegram-notifications",
  "counts": {
    "waiting": 0,
    "active": 2,
    "completed": 1543,
    "failed": 0,
    "delayed": 0
  },
  "recentFailures": [],
  "timestamp": "2025-10-12T10:30:00.000Z"
}
```

**Преимущества:**
- ✅ Не требует SSH доступа
- ✅ Интеграция с мониторингом (Prometheus, Grafana)
- ✅ Работает из любого места
- ✅ Показывает последние ошибки

**Когда использовать:**
- Проверка здоровья системы
- Production мониторинг
- Автоматические healthchecks
- Интеграция с alerting

---

### 2. Bull Board UI (визуальный интерфейс)

**Установка:**

```bash
npm install @bull-board/api @bull-board/express
```

**Настройка** (опционально):

```typescript
// server/api/admin/queues.ts
import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ExpressAdapter } from '@bull-board/express'

const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/admin/queues')

createBullBoard({
  queues: [new BullMQAdapter(getTelegramQueue())],
  serverAdapter,
})
```

**Возможности:**
- ✅ Просмотр всех задач
- ✅ Retry через UI (один клик)
- ✅ Удаление задач
- ✅ Просмотр данных и логов
- ✅ Статистика в реальном времени

---

### 3. Redis CLI (для экспертов)

```bash
docker compose exec redis redis-cli

# Просмотр всех ключей очереди
KEYS bull:telegram-notifications:*

# Количество проваленных задач
ZCARD bull:telegram-notifications:failed

# Список проваленных задач
ZRANGE bull:telegram-notifications:failed 0 -1

# Данные конкретной задачи
GET bull:telegram-notifications:{job-id}
```

---

## 🔄 Как сделать Retry

### ❌ Удалённые скрипты

**Почему удалили все скрипты:**
- `retry-job.ts` - Bull Board делает это лучше
- `queue-status.ts` - Заменён на API endpoint
- `view-failed-jobs.ts` - Заменён на API endpoint + Bull Board

### ✅ Рекомендуемые способы:

#### Способ 1: Bull Board UI (лучший)
1. Установите Bull Board (см. выше)
2. Откройте `/admin/queues`
3. Найдите проваленную задачу
4. Нажмите "Retry" → готово!

#### Способ 2: Через код (автоматический retry)
```typescript
// Система уже делает 3 автоматических retry
// Настроено в server/utils/telegram-queue.ts:
{
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000  // 1s, 2s, 4s
  }
}
```

#### Способ 3: Redis CLI (ручной)
```bash
# Получить ID проваленной задачи
ZRANGE bull:telegram-notifications:failed 0 -1

# Переместить обратно в waiting
# (требует знания внутренней структуры BullMQ)
```

---

## 📈 Мониторинг в Production

### Health Check API (уже реализован)

**Endpoint:** `GET /api/health/telegram-queue`

**Критерии здоровья:**
- ✅ `waiting < 100` - Не более 100 задач в очереди
- ✅ `failed < 10` - Не более 10 проваленных задач
- ✅ `active < 20` - Не более 20 активных задач

### Alerting примеры

**Cron job:**
```bash
*/5 * * * * curl https://your-domain.com/api/health/telegram-queue | \
  jq -e '.healthy == true' || \
  echo "Telegram queue unhealthy!" | mail -s "Alert" admin@example.com
```

**Uptime Kuma / UptimeRobot:**
```
URL: https://your-domain.com/api/health/telegram-queue
Keyword: "healthy":true
Interval: 5 minutes
```

**Prometheus:**
```yaml
- job_name: 'telegram-queue'
  metrics_path: '/api/health/telegram-queue'
  static_configs:
    - targets: ['your-domain.com']
```

---

## 🎯 Резюме

| Задача | Инструмент | Команда |
|--------|-----------|---------|
| Быстрая проверка | Health Check API | `curl /api/health/telegram-queue` |
| Анализ ошибок | Health Check API | Показывает последние 5 ошибок |
| Детальный просмотр | Bull Board UI | Веб-интерфейс |
| Retry задач | Bull Board UI | Один клик в интерфейсе |
| Глубокая отладка | Redis CLI | `docker compose exec redis redis-cli` |
| Production мониторинг | Health Check API | Интеграция с Prometheus/Grafana |

**Главное правило:** 
1. Используйте Health Check API для мониторинга
2. Автоматические retry работают (3 попытки)
3. Bull Board UI для визуального управления
4. Ручной retry нужен крайне редко!
