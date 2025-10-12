# Tasks: EspoCRM Telegram Notifications for Leads and Call Activities

**Input**: Design documents from `/specs/010-call-activity-espocrm/`
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → SUCCESS: Tech stack: TypeScript 5.9, Nuxt 4, BullMQ, Telegram Bot API
2. Load optional design documents:
   → data-model.md: EspoCRM webhook types, Telegram types
   → contracts/: webhook-api.md with 2 endpoints
   → research.md: 7 technical decisions documented
   → quickstart.md: Setup and testing procedures
3. Generate tasks by category:
   → Setup: Runtime config, environment variables
   → Tests: Contract tests, unit tests, integration tests
   → Core: Types, validators, formatters, services, endpoints
   → Integration: Queue worker, Telegram API
   → Polish: Documentation, error handling
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001-T024)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests ✅
   → All types have validation ✅
   → All endpoints implemented ✅
   → Constitution gates satisfied ✅
9. Return: SUCCESS (24 tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

---

## Phase 3.1: Setup & Configuration

- [x] **T001** Update runtime config in `nuxt.config.ts` - Add 5 new environment variables to `runtimeConfig`:
  - `espocrmWebhookToken`
  - `espocrmAssignedTeamId`
  - `telegramBotToken`
  - `telegramLeadsChannelId`
  - `telegramCallsChannelId`

- [x] **T002** [P] Create `.env.example` entries - Add documentation for new environment variables with example values

---

## Phase 3.2: Type Definitions (Foundation)

- [x] **T003** [P] Create EspoCRM webhook types in `server/types/espocrm-webhook.ts`:
  - `EspoCRMWebhookPayload<T>`
  - `EspoCRMLead` interface
  - `EspoCRMCall` interface
  - `EspoCRMLeadWebhook` and `EspoCRMCallWebhook` type aliases

- [x] **T004** [P] Create Telegram notification types in `server/types/telegram.ts`:
  - `TelegramNotificationJob` interface
  - `TelegramSendMessageRequest` interface
  - `TelegramAPIResponse<T>` interface
  - `TelegramMessage` interface
  - `TelegramNotificationResult` interface

---

## Phase 3.3: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.4

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] **T005** [P] Contract test for lead webhook in `tests/server/api/webhooks/espocrm/lead.test.ts`:
  - Test valid lead payload → 200 OK with jobId
  - Test invalid token → 401 Unauthorized
  - Test missing token → 401 Unauthorized
  - Test invalid payload → 400 Bad Request
  - Test wrong event type (update) → 400 Bad Request
  - Test team filtering (match, no match, no filter)

- [x] **T006** [P] Contract test for call webhook in `tests/server/api/webhooks/espocrm/call-activity.test.ts`:
  - Test valid call payload → 200 OK with jobId
  - Test invalid token → 401 Unauthorized
  - Test invalid payload → 400 Bad Request
  - Test wrong event type → 400 Bad Request
  - Test team filtering

- [x] **T007** [P] Unit test for webhook validator in `tests/server/utils/espocrm-webhook-validator.test.ts`:
  - Test `espocrmLeadWebhookSchema` validation (valid/invalid cases)
  - Test `espocrmCallWebhookSchema` validation
  - Test token validation logic
  - Test team filtering logic

- [x] **T008** [P] Unit test for Telegram formatter in `tests/server/utils/telegram-formatter.test.ts`:
  - Test lead message formatting (all fields, optional fields missing)
  - Test call message formatting
  - Test description truncation (200 chars for leads, 300 for calls)
  - Test HTML escaping for special characters
  - Test duration formatting (seconds → MM:SS)
  - Test status/direction translation to Russian
  - Test message length under 4096 chars

- [x] **T009** [P] Unit test for TelegramNotificationService in `tests/server/services/telegram/TelegramNotificationService.test.ts`:
  - Test successful message send
  - Test Telegram API error handling (400, 401, 403, 429)
  - Test network error handling
  - Test retry logic (not implemented in service, handled by queue)

---

## Phase 3.4: Core Implementation (ONLY after tests are failing)

- [x] **T010** [P] Create webhook validator utility in `server/utils/espocrm-webhook-validator.ts`:
  - Import Zod schemas from data-model.md
  - Implement `espocrmLeadWebhookSchema` validation
  - Implement `espocrmCallWebhookSchema` validation
  - Implement `validateWebhookToken(token: string): boolean`
  - Implement `shouldNotifyByTeam(teamsIds: string[] | undefined): boolean`

- [x] **T011** [P] Create Telegram message formatter in `server/utils/telegram-formatter.ts`:
  - Implement `formatLeadNotification(lead: EspoCRMLead): string`
  - Implement `formatCallNotification(call: EspoCRMCall): string`
  - Implement helper: `escapeHtml(text: string): string`
  - Implement helper: `formatDuration(seconds: number): string` (MM:SS)
  - Implement helper: `formatDateTime(isoString: string): string` (DD.MM.YYYY HH:mm)
  - Implement helper: `truncateText(text: string, maxLength: number): string`
  - Implement helper: `translateStatus(status: string): string`
  - Implement helper: `translateDirection(direction: string): string`

- [x] **T012** Create TelegramNotificationService in `server/services/telegram/TelegramNotificationService.ts`:
  - Implement `sendNotification(job: TelegramNotificationJob): Promise<TelegramNotificationResult>`
  - Use `ofetch` to call Telegram Bot API `sendMessage`
  - Handle API errors and return structured result
  - Use `useRuntimeConfig()` to get bot token
  - Log all attempts and results

- [x] **T013** Create TelegramQueueWorker in `server/services/queue/TelegramQueueWorker.ts`:
  - Create new BullMQ Worker for `telegram-notifications` queue
  - Reuse Redis connection from `getRedisClient()`
  - Configure: 5 concurrent workers, 10 jobs/second limiter
  - Implement job processor: call TelegramNotificationService
  - Handle success/failure events
  - Log to console (upgrade to structured logging if needed)
  - Export singleton: `getTelegramQueueWorker()` and `closeTelegramQueueWorker()`

- [x] **T014** Create lead webhook endpoint in `server/api/webhooks/espocrm/lead.post.ts`:
  - Validate webhook token from query param `?token=xxx`
  - Parse and validate request body using `espocrmLeadWebhookSchema`
  - Check event type is 'create' (reject update/delete)
  - Apply team filter using `shouldNotifyByTeam()`
  - If should notify: format message, queue Telegram notification job
  - Return 200 OK with jobId immediately
  - Handle errors: 401 (invalid token), 400 (invalid payload), 500 (queue error)

- [x] **T015** Create call activity webhook endpoint in `server/api/webhooks/espocrm/call-activity.post.ts`:
  - Validate webhook token from query param
  - Parse and validate request body using `espocrmCallWebhookSchema`
  - Check event type is 'create'
  - Apply team filter
  - If should notify: format message, queue Telegram notification job
  - Return 200 OK with jobId
  - Handle errors (same as T014)

---

## Phase 3.5: Integration & Queue Setup

- [x] **T016** Create queue initialization in `server/utils/telegram-queue.ts`:
  - Export `getTelegramQueue()` function
  - Create BullMQ Queue instance for `telegram-notifications`
  - Reuse Redis connection
  - Configure default job options: 3 attempts, exponential backoff (1s, 2s, 4s)
  - Configure job retention: completed (24h), failed (7 days)

- [x] **T017** Initialize queue worker on server startup in `server/plugins/telegram-worker.ts`:
  - Create Nitro plugin to start TelegramQueueWorker
  - Call `getTelegramQueueWorker()` on server start
  - Handle graceful shutdown: close worker on server stop
  - Log worker status

---

## Phase 3.6: Polish & Documentation

- [x] **T018** [P] Add error handling and logging improvements:
  - Ensure all errors are logged with context
  - Add structured error types (WebhookValidationError, TelegramAPIError)
  - Improve error messages for troubleshooting

- [x] **T019** [P] Update README.md:
  - Add new environment variables section
  - Link to quickstart.md for setup instructions
  - Document EspoCRM webhook configuration
  - Document Telegram bot setup

- [x] **T020** [P] Create monitoring solution:
  - ~~`scripts/queue-status.ts`~~ - Removed (replaced with API endpoint)
  - ~~`scripts/view-failed-jobs.ts`~~ - Removed (replaced with API endpoint)
  - ~~`scripts/retry-job.ts`~~ - Removed (use Bull Board UI instead)
  - ✅ `server/api/health/telegram-queue.get.ts` - Health check API endpoint

- [ ] **T021** Manual testing checklist (execute quickstart.md):
  - Create test lead in EspoCRM → verify Telegram notification
  - Create test call in EspoCRM → verify Telegram notification
  - Test team filtering (match, no match, no filter)
  - Test invalid webhook token → 401
  - Test invalid payload → 400
  - Test Telegram API failure → retry 3 times → DLQ

---

## Phase 3.7: Integration Tests (End-to-End)

- [ ] **T022** [P] Integration test for full lead flow in `tests/integration/espocrm-lead-notification.test.ts`:
  - Mock EspoCRM webhook POST
  - Verify job queued
  - Mock Telegram API
  - Process job
  - Verify Telegram message sent with correct format

- [ ] **T023** [P] Integration test for full call flow in `tests/integration/espocrm-call-notification.test.ts`:
  - Mock EspoCRM webhook POST
  - Verify job queued
  - Mock Telegram API
  - Process job
  - Verify Telegram message sent

- [ ] **T024** [P] Integration test for error scenarios in `tests/integration/espocrm-error-handling.test.ts`:
  - Test Telegram API failure → retry → DLQ
  - Test invalid webhook token
  - Test team filter blocking notification

---

## Dependencies

**Sequential Dependencies**:
```
T001 (config) → T003, T004 (types)
T003, T004 → T005-T009 (tests)
T005-T009 (tests) → T010-T015 (implementation)
T010 → T014, T015 (endpoints use validator)
T011 → T014, T015 (endpoints use formatter)
T012 → T013 (worker uses service)
T013 → T016 (queue uses worker)
T016 → T017 (plugin uses queue)
T014, T015, T017 → T021 (manual testing)
T010-T017 → T022-T024 (integration tests)
```

**Parallel Groups**:
- T002, T003, T004 can run in parallel
- T005, T006, T007, T008, T009 can run in parallel (all tests)
- T010, T011 can run in parallel (different utilities)
- T018, T019, T020 can run in parallel (polish tasks)
- T022, T023, T024 can run in parallel (integration tests)

---

## Parallel Execution Examples

### Example 1: Type Definitions (after T001)
```bash
# Launch T003 and T004 together:
Task: "Create EspoCRM webhook types in server/types/espocrm-webhook.ts"
Task: "Create Telegram notification types in server/types/telegram.ts"
```

### Example 2: Write All Tests (after T003, T004)
```bash
# Launch T005-T009 together:
Task: "Contract test for lead webhook in tests/server/api/webhooks/espocrm/lead.test.ts"
Task: "Contract test for call webhook in tests/server/api/webhooks/espocrm/call-activity.test.ts"
Task: "Unit test for webhook validator in tests/server/utils/espocrm-webhook-validator.test.ts"
Task: "Unit test for Telegram formatter in tests/server/utils/telegram-formatter.test.ts"
Task: "Unit test for TelegramNotificationService in tests/server/services/telegram/TelegramNotificationService.test.ts"
```

### Example 3: Utilities (after tests fail)
```bash
# Launch T010 and T011 together:
Task: "Create webhook validator utility in server/utils/espocrm-webhook-validator.ts"
Task: "Create Telegram message formatter in server/utils/telegram-formatter.ts"
```

### Example 4: Polish Tasks
```bash
# Launch T018, T019, T020 together:
Task: "Add error handling and logging improvements"
Task: "Update README.md with new environment variables and setup instructions"
Task: "Create monitoring scripts in scripts/"
```

---

## Validation Checklist

_GATE: Checked before marking tasks complete_

- [x] All contracts have corresponding tests (T005, T006 for webhook-api.md)
- [x] All types have validation (T007 for validator)
- [x] All tests come before implementation (T005-T009 before T010-T017)
- [x] Parallel tasks truly independent (verified file paths)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] i18n: N/A - no user-facing UI strings (server-side only)
- [x] Prisma: N/A - no database schema changes
- [x] Directus: N/A - no dynamic content integration
- [x] Partner: N/A - no partner attribution in this feature
- [x] Components: N/A - no UI components (server-only)
- [x] Aliases: Will use `~~/server/*` for server-side code (explicit imports)
- [x] Runtime Config: T001 declares all variables in `nuxt.config.ts`

---

## Constitutional Compliance

**Architecture**: ✅ Server-only, follows `server/api/`, `server/services/`, `server/types/`, `server/utils/`

**Imports**: ✅ Uses `~~/server/*` aliases (explicit imports for server code)

**Runtime Config**: ✅ T001 adds all variables to `runtimeConfig` in `nuxt.config.ts`

**Data Layer**: ✅ No database changes, uses existing Redis queue

**Quality**: ✅ ESLint/Prettier/TypeScript checks, Vitest tests (T005-T009, T022-T024)

---

## Notes

- **[P] tasks** = different files, no dependencies
- **Verify tests fail** before implementing (T005-T009 before T010-T017)
- **Commit after each task** for clean history
- **No UI components** - this is a server-only feature
- **No database migrations** - uses existing Redis infrastructure
- **Queue worker** must be started on server startup (T017)
- **Environment variables** must be configured before testing (T001, T002)

---

## Success Criteria

Feature is complete when:

- ✅ All 24 tasks completed
- ✅ All tests passing (T005-T009, T022-T024)
- ✅ Manual testing checklist passed (T021)
- ✅ EspoCRM webhooks trigger Telegram notifications
- ✅ Team filtering works correctly
- ✅ Failed jobs retry 3 times then move to DLQ
- ✅ No errors in application logs
- ✅ Documentation updated (T019)

---

_Aligned with Constitution v1.2.0 - See `/memory/constitution.md`_
