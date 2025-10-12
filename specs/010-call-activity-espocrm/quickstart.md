# Quickstart Guide: EspoCRM Telegram Notifications

**Feature**: EspoCRM Webhook Integration with Telegram Notifications  
**Date**: 2025-10-12

## Prerequisites

Before starting, ensure you have:

1. ✅ EspoCRM instance with admin access
2. ✅ Telegram bot created via @BotFather
3. ✅ Two Telegram channels created (Leads, Calls)
4. ✅ Bot added as admin to both channels
5. ✅ Redis running (for queue)
6. ✅ Node.js and npm installed

---

## Setup Steps

### 1. Configure Environment Variables

Add the following to your `.env` file:

```bash
# EspoCRM Webhook Configuration
NUXT_ESPOCRM_WEBHOOK_TOKEN=your-secret-token-here-min-32-chars
NUXT_ESPOCRM_ASSIGNED_TEAM_ID=64a1b2c3d4e5f6g7h8i9j0k1

# Telegram Bot Configuration
NUXT_TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
NUXT_TELEGRAM_LEADS_CHANNEL_ID=-1001234567890
NUXT_TELEGRAM_CALLS_CHANNEL_ID=-1001234567891
```

**How to get values**:

- **WEBHOOK_TOKEN**: Generate a secure random string (32+ chars)
  ```bash
  openssl rand -hex 32
  ```

- **ASSIGNED_TEAM_ID**: Get from EspoCRM
  1. Go to Administration → Teams
  2. Open the team you want to filter by
  3. Copy the ID from the URL: `/admin/teams/view/{ID}`

- **BOT_TOKEN**: Get from @BotFather when creating the bot

- **CHANNEL_IDs**: Get channel IDs
  1. Add @userinfobot to your channel
  2. It will show the channel ID (format: `-100xxxxxxxxxx`)
  3. Remove the bot after getting the ID

### 2. Update Runtime Configuration

Edit `nuxt.config.ts` and add to `runtimeConfig`:

```typescript
runtimeConfig: {
  // Add these new variables
  espocrmWebhookToken: process.env.NUXT_ESPOCRM_WEBHOOK_TOKEN || '',
  espocrmAssignedTeamId: process.env.NUXT_ESPOCRM_ASSIGNED_TEAM_ID || '',
  telegramBotToken: process.env.NUXT_TELEGRAM_BOT_TOKEN || '',
  telegramLeadsChannelId: process.env.NUXT_TELEGRAM_LEADS_CHANNEL_ID || '',
  telegramCallsChannelId: process.env.NUXT_TELEGRAM_CALLS_CHANNEL_ID || '',
  
  public: {
    // ... existing config
  }
}
```

### 3. Install Dependencies

No new dependencies needed - feature uses existing packages:
- ✅ BullMQ (already installed)
- ✅ IORedis (already installed)
- ✅ ofetch (already installed)
- ✅ Zod (already installed)

### 4. Start the Application

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm run preview
```

### 5. Configure EspoCRM Webhooks

#### Lead Webhook

1. Go to **Administration → Webhooks**
2. Click **Create Webhook**
3. Configure:
   - **Event**: `Lead.create`
   - **URL**: `https://your-domain.com/api/webhooks/espocrm/lead?token=YOUR_WEBHOOK_TOKEN`
   - **Request Type**: `POST`
   - **Payload**: Select all fields or specific fields you want to send
4. Click **Save**

#### Call Webhook

1. Create another webhook
2. Configure:
   - **Event**: `Call.create`
   - **URL**: `https://your-domain.com/api/webhooks/espocrm/call-activity?token=YOUR_WEBHOOK_TOKEN`
   - **Request Type**: `POST`
   - **Payload**: Select all fields
3. Click **Save**

---

## Testing

### Manual Test: Lead Notification

1. **Create a test lead in EspoCRM**:
   - Go to Leads → Create Lead
   - Fill in:
     - First Name: "Тест"
     - Last Name: "Тестов"
     - Phone: "+7 999 123 45 67"
     - Email: "test@example.com"
     - Status: "New"
     - Assign to team: (select the configured team)
   - Click Save

2. **Check webhook received**:
   ```bash
   # Check server logs
   docker compose logs -f app
   # Should see: "Processing EspoCRM lead webhook..."
   ```

3. **Check queue**:
   ```bash
   # In another terminal
   docker compose exec app npx tsx -e "
   import { Queue } from 'bullmq';
   import { getRedisClient } from './server/utils/redis';
   const q = new Queue('telegram-notifications', { connection: getRedisClient() });
   q.getJobCounts().then(console.log);
   "
   ```

4. **Check Telegram channel**:
   - Open your Leads channel
   - Should see a new message with lead details

### Manual Test: Call Notification

1. **Create a test call in EspoCRM**:
   - Go to Calls → Create Call
   - Fill in:
     - Subject: "Тестовый звонок"
     - Status: "Held"
     - Direction: "Outbound"
     - Related To: (select a lead or contact)
     - Duration: 15 minutes
     - Description: "Тестовое описание"
     - Assign to team: (select the configured team)
   - Click Save

2. **Check Telegram channel**:
   - Open your Calls channel
   - Should see a new message with call details

### Automated Tests

Run the test suite:

```bash
# Run all tests
npm test

# Run specific test file
npm test tests/server/api/webhooks/espocrm/lead.test.ts

# Run with coverage
npm test -- --coverage
```

---

## Verification Checklist

After setup, verify:

- [ ] Environment variables are set in `.env`
- [ ] Runtime config updated in `nuxt.config.ts`
- [ ] Application starts without errors
- [ ] Redis is running and accessible
- [ ] Telegram bot is admin in both channels
- [ ] EspoCRM webhooks are configured with correct URLs
- [ ] Test lead creates notification in Leads channel
- [ ] Test call creates notification in Calls channel
- [ ] Notifications contain correct data
- [ ] Team filtering works (only configured team gets notifications)
- [ ] Failed jobs appear in dead letter queue after 3 retries

---

## Troubleshooting

### Issue: Webhook returns 401 Unauthorized

**Cause**: Invalid webhook token

**Solution**:
1. Check `.env` file has correct `NUXT_ESPOCRM_WEBHOOK_TOKEN`
2. Verify EspoCRM webhook URL includes `?token=YOUR_TOKEN`
3. Restart application after changing `.env`

### Issue: No notification in Telegram

**Possible causes**:

1. **Bot not admin in channel**:
   - Add bot to channel
   - Promote to admin
   - Give "Post Messages" permission

2. **Wrong channel ID**:
   - Verify channel ID format: `-100xxxxxxxxxx`
   - Use @userinfobot to get correct ID

3. **Team filter blocking**:
   - Check if lead/call is assigned to configured team
   - Check `NUXT_ESPOCRM_ASSIGNED_TEAM_ID` matches team in EspoCRM
   - Set to empty string to disable filtering (for testing)

4. **Queue worker not running**:
   ```bash
   # Check if worker is processing jobs
   docker compose logs -f app | grep "telegram-notifications"
   ```

5. **Invalid bot token**:
   - Test token manually:
   ```bash
   curl https://api.telegram.org/bot{YOUR_TOKEN}/getMe
   # Should return bot info
   ```

### Issue: Webhook payload validation fails

**Cause**: EspoCRM sending unexpected data structure

**Solution**:
1. Check server logs for validation error details
2. Compare with expected schema in `contracts/webhook-api.md`
3. Update EspoCRM webhook to send required fields
4. If needed, update validation schema in code

### Issue: Messages not formatted correctly

**Cause**: Missing or malformed data in EspoCRM entity

**Solution**:
1. Check which fields are empty in EspoCRM
2. Formatter skips empty fields - this is expected
3. If critical field is missing, update EspoCRM entity

### Issue: Queue jobs stuck in "pending"

**Cause**: Worker not started or Redis connection issue

**Solution**:
```bash
# Check Redis connection
docker compose exec app npx tsx -e "
import { getRedisClient } from './server/utils/redis';
getRedisClient().ping().then(console.log);
"

# Check worker status
docker compose logs -f app | grep "Queue Worker"
# Should see: "Telegram Queue Worker started"
```

---

## Monitoring

### Check Queue Status

```bash
# Health Check API (recommended)
curl http://localhost:3000/api/health/telegram-queue

# Expected output:
# {
#   "healthy": true,
#   "status": "ok",
#   "queue": "telegram-notifications",
#   "counts": {
#     "waiting": 0,
#     "active": 0,
#     "completed": 123,
#     "failed": 0,
#     "delayed": 0
#   },
#   "recentFailures": [],
#   "timestamp": "2025-10-12T10:30:00.000Z"
# }
```

### Manual Retry (if needed)

```bash
# Option 1: Use Bull Board UI (recommended)
# Install: npm install @bull-board/api @bull-board/express
# Then access via web interface

# Option 2: Via Redis CLI (advanced)
docker compose exec redis redis-cli
> ZRANGE bull:telegram-notifications:failed 0 -1
> # View failed job IDs
```

### View Logs

```bash
# All logs
docker compose logs -f app

# Filter webhook logs
docker compose logs -f app | grep "webhook"

# Filter Telegram logs
docker compose logs -f app | grep "Telegram"

# Filter queue logs
docker compose logs -f app | grep "Queue"
```

---

## Performance Benchmarks

Expected performance:

- **Webhook response time**: < 100ms (just queues job)
- **Notification delivery**: < 5 seconds (including queue processing)
- **Queue throughput**: 10 jobs/second
- **Concurrent workers**: 5
- **Retry delays**: 1s, 2s, 4s (exponential backoff)

---

## Next Steps

After successful setup:

1. ✅ Monitor for a few days to ensure stability
2. ✅ Check dead letter queue for any failed jobs
3. ✅ Adjust team filter if needed
4. ✅ Customize message format if needed (edit `telegram-formatter.ts`)
5. ✅ Set up alerts for DLQ size (future enhancement)

---

## Rollback Plan

If issues occur:

1. **Disable webhooks in EspoCRM**:
   - Go to Administration → Webhooks
   - Uncheck "Active" for both webhooks
   - Click Save

2. **Stop queue worker**:
   ```bash
   # Set environment variable
   DISABLE_TELEGRAM_WORKER=true
   # Restart application
   ```

3. **Clear queue** (if needed):
   ```bash
   docker compose exec app npx tsx -e "
   import { Queue } from 'bullmq';
   import { getRedisClient } from './server/utils/redis';
   const q = new Queue('telegram-notifications', { connection: getRedisClient() });
   await q.drain();
   await q.clean(0, 1000, 'completed');
   await q.clean(0, 1000, 'failed');
   "
   ```

4. **Revert code changes** (if needed):
   ```bash
   git checkout main
   npm run build
   ```

---

## Support

For issues or questions:

1. Check logs first
2. Review troubleshooting section
3. Check contract documentation in `contracts/webhook-api.md`
4. Review implementation in `server/` directory
5. Contact development team

---

## Success Criteria

Feature is working correctly when:

- ✅ New leads in EspoCRM trigger Telegram notifications
- ✅ New calls in EspoCRM trigger Telegram notifications
- ✅ Only leads/calls from configured team send notifications
- ✅ Messages are formatted correctly and readable
- ✅ Failed deliveries retry 3 times
- ✅ No errors in application logs
- ✅ Queue processes jobs within seconds
- ✅ Dead letter queue remains empty (or has only transient failures)
