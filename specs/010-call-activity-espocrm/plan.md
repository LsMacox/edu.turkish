# Implementation Plan: EspoCRM Telegram Notifications for Leads and Call Activities

**Branch**: `010-call-activity-espocrm` | **Date**: 2025-10-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-call-activity-espocrm/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Implement webhook endpoint to receive EspoCRM notifications for new leads and call activities. When a new lead or call activity is created in EspoCRM, the system will:
1. Receive webhook payload from EspoCRM
2. Validate the request using token-based authentication
3. Filter by ESPOCRM_ASSIGNED_TEAM_ID to determine if notification should be sent
4. Queue Telegram notification job with retry logic (3 attempts)
5. Send formatted message to appropriate Telegram channel (leads or calls)

This feature extends the existing CRM integration infrastructure (BullMQ queue, Redis) to support EspoCRM-specific webhook notifications.

## Technical Context

**Language/Version**: TypeScript 5.9, Node.js (Nuxt 4.1.3)
**Primary Dependencies**: Nuxt 4, BullMQ 5.61, IORedis 5.8, Telegram Bot API (via fetch)
**Storage**: Redis (queue), MySQL (Prisma for audit logs if needed)
**Testing**: Vitest 3.2.4, contract tests for webhook endpoint
**Target Platform**: Linux server (Docker)
**Project Type**: Web application (Nuxt SSR with server API)
**Performance Goals**: Handle webhook bursts, process notifications within minutes
**Constraints**: 
- Webhook response must be fast (<500ms) to avoid EspoCRM timeouts
- Queue-based processing for reliability
- 3 retry attempts with exponential backoff
- Only EspoCRM webhooks (not Bitrix)
**Scale/Scope**: 
- 2 webhook endpoints (leads, call activities)
- 2 Telegram channels
- 1 queue worker extension
- ~5-8 new files

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Validation Results**:

✅ **Architecture**: Server-only feature, no UI components. Follows `server/api/`, `server/services/`, `server/types/`, `server/utils/` structure.

✅ **Imports**: Will use `~~/server/*` aliases for server-side code (explicit imports required per constitution).

✅ **Components**: N/A - no UI components in this feature.

✅ **Runtime Config**: New environment variables will be declared in `nuxt.config.ts`:
- `NUXT_ESPOCRM_WEBHOOK_TOKEN` → `runtimeConfig.espocrmWebhookToken`
- `NUXT_ESPOCRM_ASSIGNED_TEAM_ID` → `runtimeConfig.espocrmAssignedTeamId`
- `NUXT_TELEGRAM_BOT_TOKEN` → `runtimeConfig.telegramBotToken`
- `NUXT_TELEGRAM_LEADS_CHANNEL_ID` → `runtimeConfig.telegramLeadsChannelId`
- `NUXT_TELEGRAM_CALLS_CHANNEL_ID` → `runtimeConfig.telegramCallsChannelId`

✅ **i18n**: N/A - no user-facing UI strings (server-side only, Telegram messages in Russian/English based on data).

✅ **Data layer**: No database schema changes required. Uses existing Redis queue infrastructure.

✅ **CMS**: N/A - no Directus integration needed.

✅ **Partner flows**: N/A - no partner attribution in this feature.

✅ **Quality**: Will include ESLint/Prettier/TypeScript checks and Vitest tests for all new code.

**Conclusion**: ✅ PASS - All constitutional requirements satisfied or not applicable.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
server/
├── api/
│   └── webhooks/
│       └── espocrm/
│           ├── lead.post.ts          # Webhook endpoint for new leads
│           └── call-activity.post.ts # Webhook endpoint for call activities
├── services/
│   ├── telegram/
│   │   └── TelegramNotificationService.ts  # Send messages to Telegram
│   └── queue/
│       └── TelegramQueueWorker.ts          # Process Telegram notification jobs
├── types/
│   ├── telegram.ts                   # Telegram-specific types
│   └── espocrm-webhook.ts            # EspoCRM webhook payload types
└── utils/
    ├── espocrm-webhook-validator.ts  # Token validation
    └── telegram-formatter.ts         # Format messages for Telegram

tests/
├── server/
│   ├── api/
│   │   └── webhooks/
│   │       └── espocrm/
│   │           ├── lead.test.ts
│   │           └── call-activity.test.ts
│   ├── services/
│   │   └── telegram/
│   │       └── TelegramNotificationService.test.ts
│   └── utils/
│       ├── espocrm-webhook-validator.test.ts
│       └── telegram-formatter.test.ts
└── contracts/
    └── espocrm-webhooks.test.ts      # Contract tests for webhook schemas
```

**Structure Decision**: Nuxt 4 web application with server-side API. All webhook endpoints go in `server/api/webhooks/espocrm/`. Services extend existing queue infrastructure. No UI components needed (server-only feature).

## Phase 0: Outline & Research

**Status**: ✅ COMPLETE

**Research Topics Completed**:
1. ✅ EspoCRM webhook payload structure
2. ✅ Telegram Bot API for channel messages
3. ✅ Token-based webhook authentication
4. ✅ Queue integration with existing BullMQ infrastructure
5. ✅ Message formatting for Telegram
6. ✅ Team filtering logic
7. ✅ Error handling and retry strategy

**Key Decisions**:
- Use separate `telegram-notifications` queue (reuse Redis connection)
- HTML formatting for Telegram messages
- Token-based authentication (simple, sufficient)
- Team filtering via `ESPOCRM_ASSIGNED_TEAM_ID` environment variable
- 3 retry attempts with exponential backoff
- Fail open (send notification) if no team filter configured

**Output**: ✅ `research.md` created with all decisions documented

## Phase 1: Design & Contracts

**Status**: ✅ COMPLETE

**Deliverables Created**:

1. ✅ **Data Model** (`data-model.md`):
   - EspoCRM webhook payload types (Lead, Call)
   - Telegram notification types
   - Queue job types extension
   - Field mappings (EspoCRM → Telegram)
   - Validation schemas (Zod)
   - No database schema changes required

2. ✅ **API Contracts** (`contracts/webhook-api.md`):
   - POST `/api/webhooks/espocrm/lead` endpoint
   - POST `/api/webhooks/espocrm/call-activity` endpoint
   - Request/response schemas
   - Error responses (401, 400, 500)
   - Business rules (authentication, team filtering, async processing)
   - Telegram Bot API contract
   - Message format contracts (HTML templates)

3. ✅ **Quickstart Guide** (`quickstart.md`):
   - Setup steps (environment, configuration)
   - EspoCRM webhook configuration
   - Telegram bot setup
   - Manual testing procedures
   - Troubleshooting guide
   - Monitoring commands
   - Rollback plan

4. ✅ **Agent Context Updated**:
   - Ran `update-agent-context.sh windsurf`
   - Added TypeScript 5.9, Nuxt 4, BullMQ, Telegram Bot API
   - Updated `.windsurf/rules/specify-rules.md`

**Output**: ✅ All Phase 1 artifacts complete

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

1. **Type Definitions** (parallel):
   - Create `server/types/espocrm-webhook.ts`
   - Create `server/types/telegram.ts`
   - Extend `server/types/crm/operations.ts`

2. **Utilities** (parallel after types):
   - Create `server/utils/espocrm-webhook-validator.ts` with Zod schemas
   - Create `server/utils/telegram-formatter.ts` with message templates

3. **Services** (parallel after utilities):
   - Create `server/services/telegram/TelegramNotificationService.ts`
   - Create `server/services/queue/TelegramQueueWorker.ts`

4. **API Endpoints** (parallel after services):
   - Create `server/api/webhooks/espocrm/lead.post.ts`
   - Create `server/api/webhooks/espocrm/call-activity.post.ts`

5. **Configuration**:
   - Update `nuxt.config.ts` with runtime config
   - Update `.env.example` with new variables

6. **Tests** (parallel, can start early with TDD):
   - Contract tests for webhook schemas
   - Unit tests for validator
   - Unit tests for formatter
   - Unit tests for TelegramNotificationService
   - Integration tests for webhook endpoints

7. **Documentation**:
   - Update README.md with new environment variables
   - Add setup instructions

**Ordering Strategy**:
- Types first (foundation)
- Utilities depend on types
- Services depend on utilities
- Endpoints depend on services
- Tests can be written in parallel (TDD)
- Configuration can be done early

**Estimated Output**: ~20-25 tasks in dependency order

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_No constitutional violations - this section is not needed._

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command) - 24 tasks created
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (N/A - no violations)

---

---

_Based on Constitution v1.2.0 - See `/memory/constitution.md`_
