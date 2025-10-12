# Research: EspoCRM Telegram Notifications

**Feature**: EspoCRM Webhook Integration with Telegram Notifications  
**Date**: 2025-10-12

## Research Questions

### 1. EspoCRM Webhook Payload Structure

**Question**: What is the structure of EspoCRM webhook payloads for Lead and Call entities?

**Decision**: EspoCRM webhooks send POST requests with JSON payload containing:
- Entity type (Lead, Call)
- Entity data (all fields)
- Event type (create, update, delete)
- Timestamp

**Rationale**: 
- EspoCRM webhooks are configurable per entity
- Payload includes full entity data
- We need to parse entity-specific fields (teams, assigned user, etc.)

**Alternatives Considered**:
- Polling EspoCRM API: Rejected - webhooks are more real-time and efficient
- Using EspoCRM's built-in notifications: Rejected - doesn't support Telegram

**Implementation Notes**:
- Create TypeScript interfaces for Lead and Call webhook payloads
- Handle both entity types with separate endpoints for clarity
- Validate payload structure before processing

---

### 2. Telegram Bot API for Channel Messages

**Question**: How to send messages to Telegram channels using Bot API?

**Decision**: Use Telegram Bot API's `sendMessage` method with channel ID as chat_id.

**Rationale**:
- Bot must be added as admin to the channel
- Channel ID format: `-100{channel_id}` for public/private channels
- Supports Markdown/HTML formatting for rich messages
- Simple HTTP POST request, no SDK needed

**Alternatives Considered**:
- Telegram SDK (node-telegram-bot-api): Rejected - adds unnecessary dependency, simple fetch is sufficient
- Telegram CLI: Rejected - not suitable for server automation

**Implementation Notes**:
```typescript
// Send message to channel
POST https://api.telegram.org/bot{token}/sendMessage
{
  "chat_id": "-100{channel_id}",
  "text": "Message text",
  "parse_mode": "HTML"
}
```

---

### 3. Token-Based Webhook Authentication

**Question**: How to implement simple token-based authentication for EspoCRM webhooks?

**Decision**: Use shared secret token in request header or query parameter.

**Rationale**:
- EspoCRM allows custom headers in webhook configuration
- Simple to implement and validate
- Sufficient security for internal system communication
- No complex signature verification needed

**Alternatives Considered**:
- HMAC signature: Rejected - overly complex for internal use
- IP whitelist: Rejected - not flexible for cloud deployments
- No authentication: Rejected - security risk

**Implementation Notes**:
- Store token in environment variable: `NUXT_ESPOCRM_WEBHOOK_TOKEN`
- Validate token in middleware before processing webhook
- Return 401 Unauthorized if token invalid
- Use header: `X-Webhook-Token` or query param: `?token=xxx`

---

### 4. Queue Integration with Existing BullMQ Infrastructure

**Question**: How to extend existing CRM queue for Telegram notifications?

**Decision**: Create separate queue for Telegram notifications, reuse Redis connection.

**Rationale**:
- Existing queue is for CRM operations (createLead, logActivity)
- Telegram notifications are different concern (outbound messaging)
- Separate queue allows independent scaling and monitoring
- Reuse Redis connection for efficiency

**Alternatives Considered**:
- Extend existing CRM queue: Rejected - mixes concerns, harder to maintain
- Direct Telegram API calls without queue: Rejected - no retry logic, blocks webhook response
- New Redis instance: Rejected - unnecessary resource overhead

**Implementation Notes**:
```typescript
// New queue: 'telegram-notifications'
const queue = new Queue('telegram-notifications', {
  connection: getRedisClient(),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 }
  }
})
```

---

### 5. Message Formatting for Telegram

**Question**: What information should be included in Telegram notifications?

**Decision**: Format messages with business-relevant fields only, using HTML formatting.

**Rationale**:
- Consultants need quick overview without technical details
- HTML formatting provides better readability (bold, links)
- Different formats for leads vs calls
- Include timestamp, source, contact info, key details

**Alternatives Considered**:
- Plain text: Rejected - less readable
- Markdown: Rejected - HTML is more reliable in Telegram
- Include all fields: Rejected - too verbose, includes technical IDs

**Implementation Notes**:

**Lead Notification Format**:
```
🆕 Новый лид

👤 Имя: {firstName} {lastName}
📱 Телефон: {phone}
📧 Email: {email}
🏫 Университет: {university}
📚 Программа: {program}
🌐 Источник: {source}
⏰ Время: {timestamp}
```

**Call Activity Format**:
```
📞 Новый звонок

👤 Контакт: {contactName}
📱 Телефон: {phone}
⏱ Длительность: {duration}
📝 Результат: {outcome}
💬 Заметки: {notes}
⏰ Время: {timestamp}
```

---

### 6. Team Filtering Logic

**Question**: How to filter notifications by EspoCRM team membership?

**Decision**: Check if entity's assigned team ID matches configured `ESPOCRM_ASSIGNED_TEAM_ID`.

**Rationale**:
- EspoCRM entities have `teamsIds` array field
- Simple array inclusion check
- Configured via environment variable for flexibility
- Fail open (send notification) if team not specified

**Alternatives Considered**:
- Check assigned user: Rejected - team-based is more flexible
- Multiple team support: Deferred - YAGNI, can add later if needed
- Fail closed (skip if no team): Rejected - user wants simplified approach

**Implementation Notes**:
```typescript
function shouldNotify(entity: EspoCRMEntity): boolean {
  const configuredTeamId = useRuntimeConfig().espocrmAssignedTeamId
  
  if (!configuredTeamId) {
    return true // No filter configured, send all
  }
  
  if (!entity.teamsIds || entity.teamsIds.length === 0) {
    return true // No team assigned, send (simplified approach)
  }
  
  return entity.teamsIds.includes(configuredTeamId)
}
```

---

### 7. Error Handling and Retry Strategy

**Question**: How to handle failures in webhook processing and Telegram delivery?

**Decision**: 
- Webhook endpoint: Fast response (200 OK), queue job for async processing
- Queue worker: 3 retry attempts with exponential backoff
- Failed jobs: Log error, move to dead letter queue

**Rationale**:
- Webhook must respond quickly to avoid EspoCRM timeout
- Queue provides reliability and retry logic
- Exponential backoff prevents overwhelming Telegram API
- Dead letter queue for manual inspection of failures

**Alternatives Considered**:
- Synchronous processing: Rejected - slow, blocks webhook
- Unlimited retries: Rejected - can cause infinite loops
- Immediate failure notification: Rejected - too noisy

**Implementation Notes**:
- Webhook returns 200 immediately after queuing
- Worker retries: 1s, 2s, 4s delays
- Log failed jobs with full context for debugging
- Monitor dead letter queue size

---

## Technology Stack Summary

| Component | Technology | Version | Rationale |
|-----------|-----------|---------|-----------|
| Runtime | Node.js + Nuxt | 4.1.3 | Existing project stack |
| Queue | BullMQ | 5.61.0 | Already in use, proven reliable |
| Storage | Redis | via IORedis 5.8 | Queue backend, existing connection |
| HTTP Client | ofetch | 1.4.1 | Nuxt's fetch wrapper, already available |
| Validation | Zod | 4.1.12 | Type-safe schema validation, in use |
| Testing | Vitest | 3.2.4 | Project standard |
| Telegram API | Bot API | Latest | Official, no SDK needed |

---

## Integration Points

### Existing Systems
1. **Redis Queue Infrastructure**: Reuse connection, create new queue
2. **Environment Config**: Add new variables to `nuxt.config.ts`
3. **Type System**: Extend existing CRM types in `server/types/`
4. **Logging**: Use existing console logging pattern (upgrade to structured logging if needed)

### External Systems
1. **EspoCRM**: Webhook source, must configure webhook URLs
2. **Telegram Bot API**: Message delivery, requires bot token and channel IDs

---

## Security Considerations

1. **Webhook Authentication**: Token-based validation prevents unauthorized requests
2. **Token Storage**: Environment variables, never in code
3. **Telegram Bot Token**: Sensitive credential, must be secured
4. **Channel IDs**: Not sensitive but should be configurable
5. **Data Exposure**: Only send business-relevant fields, exclude internal IDs
6. **Rate Limiting**: BullMQ limiter prevents API abuse

---

## Performance Considerations

1. **Webhook Response Time**: <500ms (queue job, return immediately)
2. **Queue Throughput**: 10 jobs/second limit (BullMQ configuration)
3. **Concurrency**: 5 concurrent workers (BullMQ configuration)
4. **Retry Delays**: Exponential backoff (1s, 2s, 4s)
5. **Memory**: Minimal - stateless processing, no caching needed

---

## Monitoring and Observability

1. **Queue Metrics**: Job counts, success/failure rates (BullMQ built-in)
2. **Dead Letter Queue**: Failed jobs for manual review
3. **Logs**: Console logs for each webhook, queue job, and Telegram send
4. **Alerts**: Monitor DLQ size (future enhancement)

---

## Configuration Requirements

### Environment Variables (to be added to `.env` and `nuxt.config.ts`)

```bash
# EspoCRM Webhook Configuration
NUXT_ESPOCRM_WEBHOOK_TOKEN=your-secret-token-here
NUXT_ESPOCRM_ASSIGNED_TEAM_ID=team-id-to-filter

# Telegram Bot Configuration
NUXT_TELEGRAM_BOT_TOKEN=bot-token-from-botfather
NUXT_TELEGRAM_LEADS_CHANNEL_ID=-100xxxxxxxxxx
NUXT_TELEGRAM_CALLS_CHANNEL_ID=-100xxxxxxxxxx
```

### EspoCRM Webhook Setup (Manual Configuration)

1. Navigate to Administration → Webhooks
2. Create webhook for Lead entity:
   - URL: `https://your-domain.com/api/webhooks/espocrm/lead?token={WEBHOOK_TOKEN}`
   - Event: Create
   - Entity: Lead
3. Create webhook for Call entity:
   - URL: `https://your-domain.com/api/webhooks/espocrm/call-activity?token={WEBHOOK_TOKEN}`
   - Event: Create
   - Entity: Call

### Telegram Bot Setup (Manual Configuration)

1. Create bot via @BotFather
2. Get bot token
3. Create two channels (Leads, Calls)
4. Add bot as admin to both channels
5. Get channel IDs (use @userinfobot or API)

---

## Open Questions / Future Enhancements

1. **Message Localization**: Currently Russian only, could support multiple languages based on lead data
2. **Rich Formatting**: Could add buttons, inline keyboards for actions
3. **Structured Logging**: Upgrade from console.log to structured logger (e.g., pino)
4. **Metrics Dashboard**: Visualize queue performance, notification delivery rates
5. **Multiple Teams**: Support filtering by multiple team IDs (currently single team)
6. **Update Notifications**: Currently only "create" events, could add "update" if needed

---

## Research Complete

All technical unknowns have been resolved. Ready to proceed to Phase 1 (Design & Contracts).
