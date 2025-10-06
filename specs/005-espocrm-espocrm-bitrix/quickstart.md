# Quickstart: EspoCRM Integration Fixes

**Date**: 2025-10-05  
**Feature**: Fix EspoCRM Integration Issues  
**Estimated Time**: 15 minutes

## Prerequisites

- Docker environment running (`docker-compose up`)
- Node.js 20.x installed
- npm dependencies installed (`npm install`)

## Environment Setup

### Option 1: Test with Bitrix (Default)

```bash
# .env file
CRM_PROVIDER=bitrix
BITRIX_WEBHOOK_URL=https://eduturkish.bitrix24.com/rest/1/token/
```

### Option 2: Test with EspoCRM

```bash
# .env file
CRM_PROVIDER=espocrm
ESPOCRM_API_URL=https://crm.example.com/api/v1
ESPOCRM_API_KEY=your-api-key-here
```

## Quick Verification Steps

### 1. Run Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- tests/contract/crm-provider.contract.test.ts
npm test -- tests/server/services/EspoCrmService.test.ts
npm test -- tests/components/ApplicationModal.test.ts
```

**Expected Result**: All tests pass ✅

### 2. Test CRM Provider Selection

```bash
# Start dev server
npm run dev

# In another terminal, test CRM provider
curl -X POST http://localhost:3000/api/v1/applications \
  -H "Content-Type: application/json" \
  -d '{
    "personal_info": {
      "first_name": "Test",
      "last_name": "User",
      "email": "test@example.com",
      "phone": "+79001234567"
    },
    "education": {
      "level": "bachelor",
      "field": "Computer Science"
    },
    "preferences": {
      "universities": [],
      "programs": [],
      "budget": "Not specified",
      "start_date": "2025"
    },
    "source": "quickstart-test",
    "referral_code": "TEST123"
  }'
```

**Expected Result**:
- Status: 201 Created
- Response contains application ID
- No CRM errors in logs (or graceful error handling)

### 3. Test Messenger Event Routing

```bash
curl -X POST http://localhost:3000/api/v1/messenger-events \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "telegram",
    "referral_code": "TEST123",
    "session": "test-session-123"
  }'
```

**Expected Result**:
- Status: 200 OK (if CRM configured) or 503 (if not configured)
- No 401 errors in logs
- Event routed to correct CRM provider

### 4. Test Error Display in UI

1. Open browser: `http://localhost:3000`
2. Click "Подать заявку" (Submit Application) button
3. Fill form with invalid data (e.g., empty required fields)
4. Click submit

**Expected Result**:
- Error messages display as readable text (not 'true')
- Field-specific errors show at bottom of modal
- General errors show in tooltip above modal
- Tooltip is visible (z-index correct)

### 5. Test Source Validation

```bash
# Test with various source values
for source in "website" "home_questionnaire" "university_detail" "PARTNER123" "custom-source"; do
  echo "Testing source: $source"
  curl -s -X POST http://localhost:3000/api/v1/applications \
    -H "Content-Type: application/json" \
    -d "{
      \"personal_info\": {
        \"first_name\": \"Test\",
        \"last_name\": \"User\",
        \"email\": \"test@example.com\",
        \"phone\": \"+79001234567\"
      },
      \"education\": {
        \"level\": \"bachelor\",
        \"field\": \"Test\"
      },
      \"preferences\": {},
      \"source\": \"$source\"
    }" | jq '.id // .error'
done
```

**Expected Result**:
- All source values accepted
- No "Invalid source" errors
- Returns application ID for each request

## Acceptance Criteria Verification

### ✅ FR-001 to FR-005: CRM Provider Routing

**Test**: Switch `CRM_PROVIDER` between 'bitrix' and 'espocrm'

**Verify**:
- Messenger events route to configured provider
- No 401 errors when EspoCRM configured
- Graceful handling when CRM not configured

**Command**:
```bash
# Check logs for CRM routing
docker-compose logs -f app | grep -i "crm\|bitrix\|espocrm"
```

### ✅ FR-006 to FR-009: Application Validation

**Test**: Submit applications with various source values

**Verify**:
- All valid source values accepted (referral codes, preset values)
- Clear error messages for invalid data
- No "Invalid source (valid)" errors

**Command**: See "Test Source Validation" above

### ✅ FR-010 to FR-015: Error Message Display

**Test**: Trigger validation errors in UI

**Verify**:
- Error messages show as text (not 'true')
- Field errors at bottom of modal
- General errors in tooltip above modal
- Tooltip visible (z-index > modal)
- Fallback message for empty errors

**Manual Test**: See "Test Error Display in UI" above

### ✅ FR-016 to FR-018: Data Integrity

**Test**: Simulate CRM failure

**Verify**:
- Application saved to database even if CRM fails
- Appropriate HTTP status codes returned
- Errors logged for admin review

**Command**:
```bash
# Set invalid CRM config to simulate failure
export ESPOCRM_API_URL=http://invalid-url
export CRM_PROVIDER=espocrm

# Submit application
curl -X POST http://localhost:3000/api/v1/applications \
  -H "Content-Type: application/json" \
  -d '{ ... }'

# Check database
docker-compose exec mysql mysql -u app_user -p edu_turkish \
  -e "SELECT id, status, source FROM Application ORDER BY createdAt DESC LIMIT 1;"
```

**Expected**: Application exists in database despite CRM failure

## Rollback Plan

If issues occur:

1. **Revert CRM provider to Bitrix**:
   ```bash
   # .env
   CRM_PROVIDER=bitrix
   ```

2. **Restart application**:
   ```bash
   docker-compose restart app
   ```

3. **Verify Bitrix integration still works**:
   ```bash
   curl -X POST http://localhost:3000/api/v1/applications ...
   # Check Bitrix for new lead
   ```

## Troubleshooting

### Issue: "CRM integration failed"

**Solution**:
- Check environment variables are set correctly
- Verify API URLs are accessible
- Check API keys are valid
- Review logs: `docker-compose logs app`

### Issue: "Invalid source" error persists

**Solution**:
- Check `validateApplicationData` function in `server/utils/api-helpers.ts`
- Verify no hidden validation in `ApplicationRepository`
- Check Prisma schema for enum constraints

### Issue: Error messages show 'true'

**Solution**:
- Verify `getErrorMessage` function in `ApplicationModal.vue`
- Check error response structure from API
- Add console.log to debug error object

### Issue: Tooltip not visible

**Solution**:
- Check z-index in component styles
- Verify Teleport target exists
- Inspect element in browser DevTools

## Performance Verification

### Response Time Test

```bash
# Install Apache Bench if needed
# sudo apt-get install apache2-utils

# Test application endpoint
ab -n 100 -c 10 -p test-payload.json -T application/json \
  http://localhost:3000/api/v1/applications
```

**Expected**: p95 < 500ms

### Load Test

```bash
# Install k6 if needed
# https://k6.io/docs/getting-started/installation/

k6 run load-test.js
```

**Expected**: 
- No errors under normal load
- CRM failures don't block application submission
- Database writes succeed consistently

## Success Checklist

- [ ] All tests pass
- [ ] CRM provider switches correctly
- [ ] Messenger events route to correct CRM
- [ ] No 401 errors with EspoCRM
- [ ] Source validation accepts all valid values
- [ ] Error messages display correctly
- [ ] Tooltips visible above modal
- [ ] Applications saved despite CRM failures
- [ ] Performance targets met
- [ ] Backward compatibility maintained

## Next Steps

After successful verification:

1. **Deploy to staging**: Test with real EspoCRM instance
2. **Monitor logs**: Watch for integration errors
3. **Gradual rollout**: Start with small percentage of traffic
4. **Full deployment**: Switch all traffic to new implementation

---

**Quickstart Complete**: Feature ready for production deployment ✅
