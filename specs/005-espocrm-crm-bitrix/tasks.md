# Tasks: EspoCRM Integration with CRM Abstraction Layer

**Input**: Design documents from `/specs/005-espocrm-crm-bitrix/`  
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Summary

This task list implements a CRM abstraction layer with EspoCRM integration, Redis-backed retry queue, and Docker infrastructure. All tasks follow TDD principles and constitutional requirements.

**Tech Stack**: TypeScript 5.x, Node.js 22, Nuxt 3, Prisma, Redis (BullMQ), EspoCRM, Docker, Caddy  
**No Database Changes**: Service-layer only, no Prisma migrations needed  
**No UI Changes**: Backend/infrastructure only, no i18n updates required

## Phase 3.1: Setup & Dependencies

- [x] **T001** Install Redis queue dependencies: `npm install bullmq ioredis && npm install -D @types/ioredis`
- [x] **T002** Create CRM types directory structure: `server/types/crm/` with `provider.ts`, `operations.ts`, `index.ts`
- [x] **T003** Create CRM services directory structure: `server/services/crm/` and `server/services/queue/`
- [x] **T004** [P] Configure Redis client utility in `server/utils/redis.ts`
- [x] **T005** [P] Configure CRM provider config utility in `server/utils/crm-config.ts`

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests

- [x] **T006** [P] Contract test: CRM Provider Interface in `tests/contract/crm-provider.contract.test.ts` (Vitest)
  - Test all ICRMProvider methods (createLead, updateLead, logActivity, createMinimalLeadFromActivity, testConnection)
  - Verify interface compliance for both Bitrix and EspoCRM implementations
  - Assert proper error handling and timeout behavior

- [x] **T007** [P] Contract test: EspoCRM API in `tests/contract/espocrm-api.test.ts` (Vitest)
  - Test POST /Lead endpoint with valid/invalid data
  - Test PUT /Lead/{id} endpoint
  - Test POST /Activity endpoint
  - Verify API key authentication
  - Assert field mapping (referralCodeC, userTypeC, etc.)

### Integration Tests

- [x] **T008** [P] Integration test: Lead creation flow in `tests/integration/crm-lead-creation.test.ts`
  - Test application submission → CRM lead creation
  - Verify all required fields populated correctly
  - Test with both Bitrix and EspoCRM providers
  - Assert field mapping works correctly

- [x] **T009** [P] Integration test: Messenger activity logging in `tests/integration/crm-messenger-activity.test.ts`
  - Test messenger click → activity logged in CRM
  - Test minimal lead creation from messenger event
  - Verify UTM parameters and session data captured
  - Test with telegram, whatsapp, instagram channels

- [x] **T010** [P] Integration test: Queue retry logic in `tests/integration/crm-queue-retry.test.ts`
  - Test CRM failure → job queued in Redis
  - Test retry with exponential backoff
  - Test max retries → dead letter queue
  - Verify queue persistence across restarts

- [x] **T011** [P] Integration test: CRM provider switching in `tests/integration/crm-provider-switch.test.ts`
  - Test switching from Bitrix to EspoCRM via config
  - Verify operations route to correct provider
  - Test backward compatibility maintained

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Type Definitions

- [x] **T012** [P] Create CRM provider types in `server/types/crm/provider.ts`
  - Define `CRMProviderConfig` interface
  - Define `FieldMappingConfig` interface
  - Export types

- [x] **T013** [P] Create CRM operation types in `server/types/crm/operations.ts`
  - Define `LeadData` interface with validation schema
  - Define `ActivityData` interface with validation schema
  - Define `CRMResult` interface
  - Define `CRMQueueJob` interface
  - Add Zod schemas for validation

- [x] **T014** Create CRM types index in `server/types/crm/index.ts`
  - Export all types from provider.ts and operations.ts

### CRM Abstraction Layer

- [x] **T015** Create CRM Provider interface in `server/services/crm/CRMProvider.interface.ts`
  - Define `ICRMProvider` interface matching contract
  - Document all methods with JSDoc
  - Include error handling specifications

- [x] **T016** Implement Bitrix CRM Provider in `server/services/crm/BitrixCRMProvider.ts`
  - Refactor existing `BitrixService` to implement `ICRMProvider`
  - Map `LeadData` to Bitrix lead format
  - Map `ActivityData` to Bitrix activity format
  - Implement all interface methods
  - Preserve existing field mappings (UF_CRM_* fields)

- [x] **T017** Implement EspoCRM Provider in `server/services/crm/EspoCRMProvider.ts`
  - Implement `ICRMProvider` interface
  - Map `LeadData` to EspoCRM lead format (firstName, lastName, phoneNumber, emailAddress, custom fields)
  - Map `ActivityData` to EspoCRM activity format
  - Implement API key authentication
  - Handle EspoCRM-specific errors
  - Implement timeout and retry logic

- [x] **T018** Create CRM Factory in `server/services/crm/CRMFactory.ts`
  - Implement factory pattern for provider selection
  - Read `CRM_PROVIDER` from environment
  - Return appropriate provider instance (Bitrix or EspoCRM)
  - Validate provider configuration on creation
  - Cache provider instances

### Queue & Retry Logic

- [x] **T019** Implement Redis Queue service in `server/services/queue/RedisQueue.ts`
  - Initialize BullMQ queue with Redis connection
  - Implement job creation methods
  - Configure retry strategy (3 attempts, exponential backoff: 1s, 5s, 25s)
  - Implement dead letter queue for failed jobs
  - Add job status monitoring methods

- [x] **T020** Implement CRM Queue Worker in `server/services/queue/CRMQueueWorker.ts`
  - Process queued CRM operations
  - Execute operations via CRM Factory
  - Handle success/failure states
  - Implement retry logic
  - Log all operations
  - Move permanently failed jobs to DLQ

### API Endpoint Updates

- [x] **T021** Update application endpoint in `server/api/v1/applications/index.post.ts`
  - Replace direct `BitrixService` calls with `CRMFactory`
  - Queue operation if CRM fails
  - Maintain existing validation and error handling
  - Ensure backward compatibility

- [x] **T022** Update messenger events endpoint in `server/api/v1/messenger-events.post.ts`
  - Replace direct `BitrixService` calls with `CRMFactory`
  - Queue operation if CRM fails
  - Maintain existing payload validation

- [x] **T023** Update messenger redirect routes in `server/routes/go/telegram.ts`, `server/routes/go/whatsapp.ts`, `server/routes/go/instagram.ts`
  - Replace direct `BitrixService` calls with `CRMFactory`
  - Queue minimal lead creation if CRM fails
  - Preserve referral code forwarding logic

- [x] **T024** [P] Create CRM test endpoint in `server/api/v1/crm/test.get.ts`
  - Implement connection test endpoint
  - Return provider name and connection status
  - Use for health checks and debugging

## Phase 3.4: Infrastructure & Docker

- [x] **T025** Add EspoCRM service to `docker-compose.yml`
  - Add `espocrm` service with official image `espocrm/espocrm:latest`
  - Configure environment variables (database, admin credentials, site URL)
  - Add volume for data persistence
  - Configure health check
  - Add dependency on MySQL

- [x] **T026** Add Redis service to `docker-compose.yml`
  - Add `redis` service with `redis:7-alpine` image
  - Configure persistence (AOF or RDB)
  - Add volume for data persistence
  - Configure health check
  - Expose port for debugging (optional)

- [x] **T027** Create EspoCRM database in MySQL init script `contrib/sql/init/03-espocrm.sql`
  - Create `espocrm_db` database
  - Create `espocrm_user` with appropriate permissions
  - Grant privileges on `espocrm_db` to `espocrm_user`

- [x] **T028** Update Caddyfile in `contrib/Caddyfile`
  - Add reverse proxy block for `{$CRM_DOMAIN}`
  - Configure HTTPS/TLS with Let's Encrypt
  - Add header forwarding (X-Forwarded-Proto, X-Forwarded-Host, Host)
  - Add gzip/zstd compression

- [x] **T029** Update environment variables in `.env.example`
  - Add `CRM_PROVIDER` (bitrix|espocrm)
  - Add `ESPOCRM_URL`, `ESPOCRM_API_KEY`
  - Add `ESPOCRM_ADMIN_USERNAME`, `ESPOCRM_ADMIN_PASSWORD`
  - Add `ESPOCRM_DB_NAME`, `ESPOCRM_DB_USER`, `ESPOCRM_DB_PASSWORD`
  - Add `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
  - Add `CRM_DOMAIN`

## Phase 3.5: Unit Tests & Polish

- [ ] **T030** [P] Unit test: CRM Factory in `tests/server/services/crm/CRMFactory.test.ts`
  - Test provider selection based on config
  - Test configuration validation
  - Test error handling for invalid provider

- [ ] **T031** [P] Unit test: Bitrix CRM Provider in `tests/server/services/crm/BitrixCRMProvider.test.ts`
  - Test lead data transformation
  - Test activity data transformation
  - Test field mapping
  - Test error handling

- [ ] **T032** [P] Unit test: EspoCRM Provider in `tests/server/services/crm/EspoCRMProvider.test.ts`
  - Test lead data transformation
  - Test activity data transformation
  - Test field mapping
  - Test API key authentication
  - Test error handling

- [ ] **T033** [P] Unit test: Redis Queue in `tests/server/services/queue/RedisQueue.test.ts`
  - Test job creation
  - Test retry configuration
  - Test DLQ handling

- [ ] **T034** [P] Unit test: CRM Queue Worker in `tests/server/services/queue/CRMQueueWorker.test.ts`
  - Test job processing
  - Test retry logic
  - Test error handling
  - Test DLQ migration

- [ ] **T035** [P] Update README.md with EspoCRM setup instructions
  - Document environment variables
  - Add EspoCRM configuration steps
  - Document custom field setup in EspoCRM
  - Add troubleshooting section

- [ ] **T036** [P] Create EspoCRM field setup documentation in `docs/espocrm-setup.md`
  - Document custom field creation (referralCodeC, userTypeC, etc.)
  - Include screenshots or step-by-step guide
  - Document API key generation

- [ ] **T037** Run ESLint and Prettier on all new files
  - Fix any linting errors
  - Ensure consistent code style
  - Verify TypeScript types are correct

- [ ] **T038** Verify all tests pass
  - Run full test suite: `npm run test`
  - Ensure all contract tests pass
  - Ensure all integration tests pass
  - Ensure all unit tests pass

## Phase 3.6: Validation & Deployment

- [ ] **T039** Manual testing: EspoCRM deployment
  - Start all Docker services: `docker-compose up -d`
  - Access EspoCRM web UI at `https://crm.{domain}`
  - Create custom fields in EspoCRM
  - Generate API key
  - Update `.env` with API key

- [ ] **T040** Manual testing: Lead creation
  - Submit application via website
  - Verify lead created in EspoCRM
  - Verify all fields mapped correctly
  - Check referral code, user type, language, etc.

- [ ] **T041** Manual testing: Messenger activity
  - Click messenger links (telegram, whatsapp, instagram)
  - Verify activities logged in EspoCRM
  - Verify minimal leads created for messenger clicks

- [ ] **T042** Manual testing: Queue retry logic
  - Stop EspoCRM container
  - Submit application (should queue)
  - Verify job in Redis queue
  - Restart EspoCRM
  - Verify job processed and lead created

- [ ] **T043** Manual testing: Provider switching
  - Switch `CRM_PROVIDER` to bitrix in `.env`
  - Restart application
  - Submit application
  - Verify lead created in Bitrix (not EspoCRM)
  - Switch back to espocrm and verify

- [ ] **T044** Performance validation
  - Measure CRM operation latency (should be <3s)
  - Measure queue processing time (should be <1min)
  - Verify no memory leaks in queue worker
  - Check Redis memory usage

- [ ] **T045** Final cleanup and documentation
  - Remove any debug logging
  - Update CHANGELOG.md
  - Create migration guide from Bitrix to EspoCRM
  - Document rollback procedure

## Dependencies

### Critical Path
```
T001-T005 (Setup)
  ↓
T006-T011 (Tests - MUST FAIL)
  ↓
T012-T014 (Types)
  ↓
T015-T018 (CRM Abstraction)
  ↓
T019-T020 (Queue)
  ↓
T021-T024 (API Updates)
  ↓
T025-T029 (Infrastructure)
  ↓
T030-T038 (Tests & Polish)
  ↓
T039-T045 (Validation)
```

### Parallel Execution Groups

**Group 1 - Setup** (after T001-T003):
- T004 (Redis client) || T005 (CRM config)

**Group 2 - Contract Tests** (after setup):
- T006 (CRM Provider contract) || T007 (EspoCRM API contract)

**Group 3 - Integration Tests** (after setup):
- T008 (Lead creation) || T009 (Messenger activity) || T010 (Queue retry) || T011 (Provider switch)

**Group 4 - Types** (after tests):
- T012 (Provider types) || T013 (Operation types)

**Group 5 - Unit Tests** (after implementation):
- T030 || T031 || T032 || T033 || T034

**Group 6 - Documentation** (after implementation):
- T035 || T036

## Parallel Execution Examples

### Launch Contract Tests Together
```bash
# T006 and T007 can run in parallel
Task: "Contract test CRM Provider Interface in tests/contract/crm-provider.contract.test.ts"
Task: "Contract test EspoCRM API in tests/contract/espocrm-api.test.ts"
```

### Launch Integration Tests Together
```bash
# T008-T011 can run in parallel
Task: "Integration test lead creation in tests/integration/crm-lead-creation.test.ts"
Task: "Integration test messenger activity in tests/integration/crm-messenger-activity.test.ts"
Task: "Integration test queue retry in tests/integration/crm-queue-retry.test.ts"
Task: "Integration test provider switching in tests/integration/crm-provider-switch.test.ts"
```

### Launch Unit Tests Together
```bash
# T030-T034 can run in parallel
Task: "Unit test CRM Factory in tests/server/services/crm/CRMFactory.test.ts"
Task: "Unit test Bitrix Provider in tests/server/services/crm/BitrixCRMProvider.test.ts"
Task: "Unit test EspoCRM Provider in tests/server/services/crm/EspoCRMProvider.test.ts"
Task: "Unit test Redis Queue in tests/server/services/queue/RedisQueue.test.ts"
Task: "Unit test Queue Worker in tests/server/services/queue/CRMQueueWorker.test.ts"
```

## Validation Checklist

_GATE: Verify before marking complete_

- [x] All contracts have corresponding tests (T006, T007)
- [x] All entities have implementation tasks (CRM providers, queue)
- [x] All tests come before implementation (T006-T011 before T012-T024)
- [x] Parallel tasks are truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] i18n: No UI changes, no i18n updates needed ✅
- [x] Prisma: No schema changes, no migrations needed ✅
- [x] Directus: Not applicable to this feature ✅
- [x] Partner: `/routes/go/*` updated to use CRM abstraction (T023) ✅

## Notes

- **[P] tasks** = Different files, no dependencies, can run in parallel
- **TDD Critical**: Verify all tests (T006-T011) fail before implementing (T012-T024)
- **Commit after each task** for easy rollback
- **No database changes**: This is service-layer and infrastructure only
- **Backward compatible**: Existing Bitrix integration preserved via abstraction
- **Queue persistence**: Redis ensures no data loss on restart

---

_Aligned with Constitution v1.0.0 - See `/memory/constitution.md`_
