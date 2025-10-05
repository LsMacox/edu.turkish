# Quickstart: EspoCRM Integration

**Feature**: 005-espocrm-crm-bitrix  
**Date**: 2025-10-04

## Prerequisites

- Docker and docker-compose installed
- Node.js 22+ installed
- Access to the repository
- `.env` file configured

## Setup Steps

### 1. Install Dependencies

```bash
npm install bullmq ioredis
npm install -D @types/ioredis
```

### 2. Configure Environment Variables

Add to `.env`:

```bash
# CRM Provider Selection
CRM_PROVIDER=espocrm

# EspoCRM Configuration
ESPOCRM_URL=http://espocrm:8080
ESPOCRM_API_KEY=your-api-key-here
ESPOCRM_ADMIN_USERNAME=admin
ESPOCRM_ADMIN_PASSWORD=ChangeMe123!
ESPOCRM_SITE_URL=https://crm.edu-turkish.com

# EspoCRM Database
ESPOCRM_DB_NAME=espocrm_db
ESPOCRM_DB_USER=espocrm_user
ESPOCRM_DB_PASSWORD=SecurePassword123!

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# Caddy
CRM_DOMAIN=crm.edu-turkish.com
```

### 3. Start Infrastructure

```bash
# Start all services including EspoCRM and Redis
docker-compose up -d

# Verify services are running
docker-compose ps

# Check EspoCRM logs
docker-compose logs -f espocrm
```

### 4. Configure EspoCRM

1. Access EspoCRM web interface: `https://crm.edu-turkish.com`
2. Login with admin credentials from `.env`
3. Navigate to Administration → API Users
4. Create new API user and generate API key
5. Copy API key to `.env` as `ESPOCRM_API_KEY`

### 5. Create Custom Fields in EspoCRM

Navigate to Administration → Entity Manager → Lead → Fields:

1. **referralCodeC** (Varchar, 50 chars)
2. **userTypeC** (Enum: student, parent)
3. **languageC** (Enum: turkish, english, both)
4. **fieldOfStudyC** (Varchar, 200 chars)
5. **universityC** (Varchar, 200 chars)

### 6. Run Tests

```bash
# Run contract tests
npm run test -- tests/contract/espocrm-api.test.ts

# Run CRM provider tests
npm run test -- tests/server/services/crm/

# Run queue worker tests
npm run test -- tests/server/queue/
```

## Validation Scenarios

### Scenario 1: Create Lead via Application Form

```bash
# Submit application via website
curl -X POST http://localhost:3000/api/v1/applications \
  -H "Content-Type: application/json" \
  -d '{
    "personal_info": {
      "first_name": "Ivan",
      "last_name": "Petrov",
      "phone": "+77001234567",
      "email": "ivan@example.com"
    },
    "referral_code": "PARTNER123",
    "source": "university_detail"
  }'

# Verify in EspoCRM
# 1. Login to https://crm.edu-turkish.com
# 2. Navigate to Leads
# 3. Find lead "Ivan Petrov"
# 4. Verify referralCodeC = "PARTNER123"
```

### Scenario 2: Log Messenger Activity

```bash
# Click messenger link
curl "http://localhost:3000/go/telegram?referral_code=PARTNER123&utm_source=instagram"

# Verify in EspoCRM
# 1. Navigate to Activities
# 2. Find activity "Messenger click: telegram"
# 3. Verify description contains referral code and UTM
```

### Scenario 3: Test CRM Failover with Queue

```bash
# Stop EspoCRM
docker-compose stop espocrm

# Submit application (should queue)
curl -X POST http://localhost:3000/api/v1/applications \
  -H "Content-Type: application/json" \
  -d '{
    "personal_info": {
      "first_name": "Test",
      "last_name": "User",
      "phone": "+77001111111",
      "email": "test@example.com"
    },
    "referral_code": "TEST",
    "source": "test"
  }'

# Check Redis queue
docker-compose exec redis redis-cli
> KEYS bull:crm-operations:*
> HGETALL bull:crm-operations:1

# Restart EspoCRM
docker-compose start espocrm

# Wait for queue worker to process (check logs)
docker-compose logs -f app

# Verify lead created in EspoCRM
```

### Scenario 4: Switch CRM Provider

```bash
# Update .env
CRM_PROVIDER=bitrix

# Restart application
docker-compose restart app

# Submit application
curl -X POST http://localhost:3000/api/v1/applications \
  -H "Content-Type: application/json" \
  -d '{
    "personal_info": {
      "first_name": "Switch",
      "last_name": "Test",
      "phone": "+77002222222",
      "email": "switch@example.com"
    },
    "referral_code": "SWITCH",
    "source": "test"
  }'

# Verify lead created in Bitrix (not EspoCRM)
```

### Scenario 5: Test Connection

```bash
# Test EspoCRM connection
curl http://localhost:3000/api/v1/crm/test

# Expected response:
{
  "success": true,
  "provider": "espocrm",
  "message": "Connection successful"
}
```

## Troubleshooting

### EspoCRM not accessible

```bash
# Check container status
docker-compose ps espocrm

# Check logs
docker-compose logs espocrm

# Verify database connection
docker-compose exec espocrm cat /var/www/html/data/config.php
```

### Redis connection failed

```bash
# Check Redis container
docker-compose ps redis

# Test Redis connection
docker-compose exec redis redis-cli ping
# Should return: PONG
```

### Queue not processing

```bash
# Check queue worker logs
docker-compose logs -f app | grep "CRMQueueWorker"

# Check Redis queue status
docker-compose exec redis redis-cli
> KEYS bull:crm-operations:*
> LLEN bull:crm-operations:wait
```

### API key invalid

```bash
# Regenerate API key in EspoCRM
# 1. Login to EspoCRM
# 2. Administration → API Users
# 3. Select user → Generate New API Key
# 4. Update .env with new key
# 5. Restart app: docker-compose restart app
```

### Field mapping errors

```bash
# Verify custom fields exist in EspoCRM
# Administration → Entity Manager → Lead → Fields

# Check field names match configuration
# server/utils/crm-config.ts

# Test with minimal data first
curl -X POST http://localhost:3000/api/v1/applications \
  -H "Content-Type: application/json" \
  -d '{
    "personal_info": {
      "first_name": "Test",
      "last_name": "Minimal",
      "phone": "+77003333333",
      "email": "minimal@example.com"
    },
    "referral_code": "MIN",
    "source": "test"
  }'
```

## Performance Validation

### Expected Metrics

- Lead creation: < 2 seconds
- Activity logging: < 1 second
- Queue processing: < 1 minute per retry
- Connection test: < 500ms

### Monitoring Commands

```bash
# Monitor queue length
watch -n 5 'docker-compose exec redis redis-cli LLEN bull:crm-operations:wait'

# Monitor failed jobs
docker-compose exec redis redis-cli LLEN bull:crm-operations:failed

# Monitor application logs
docker-compose logs -f app | grep -E "CRM|Queue"
```

## Rollback Procedure

If issues occur, rollback to Bitrix:

```bash
# 1. Update .env
CRM_PROVIDER=bitrix

# 2. Restart application
docker-compose restart app

# 3. Verify Bitrix integration
curl http://localhost:3000/api/v1/crm/test

# 4. Process any queued jobs manually if needed
# (Check Redis queue and create leads manually in Bitrix)
```

## Next Steps

1. Monitor CRM operations in production
2. Set up alerts for failed queue jobs
3. Document custom field mappings for team
4. Create backup/restore procedures for EspoCRM data
5. Plan data migration from Bitrix to EspoCRM (if needed)
