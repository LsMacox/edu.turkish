# Research: EspoCRM Integration with CRM Abstraction Layer

**Feature**: 005-espocrm-crm-bitrix  
**Date**: 2025-10-04

## Research Questions & Findings

### 1. EspoCRM API Integration

**Decision**: Use EspoCRM REST API with API key authentication

**Rationale**:

- EspoCRM provides a well-documented REST API for CRUD operations on leads, contacts, and activities
- API key authentication is simpler than OAuth for server-to-server communication
- Supports all required operations: create lead, update lead, create activity
- JSON-based request/response format aligns with existing Bitrix integration

**Alternatives Considered**:

- OAuth 2.0: More complex, unnecessary for server-to-server
- Direct database access: Violates encapsulation, breaks on EspoCRM updates
- Webhooks: Not needed for our push-only use case

**Implementation Notes**:

- Base URL: `http://espocrm:8080/api/v1/` (internal Docker network)
- Authentication: `X-Api-Key` header
- Endpoints: `/Lead`, `/Activity`, `/Contact`
- Field mapping required for custom fields

### 2. Redis Queue for Retry Logic

**Decision**: Use BullMQ (Redis-based queue) for retry logic with exponential backoff

**Rationale**:

- BullMQ is production-ready, well-maintained, and TypeScript-native
- Built-in retry logic with exponential backoff
- Persistent queue survives application restarts
- Job scheduling and delayed retries out of the box
- Good observability (job status, failed jobs, etc.)

**Alternatives Considered**:

- Custom Redis implementation: Reinventing the wheel, error-prone
- Database-backed queue: Slower, adds DB load
- In-memory queue: Lost on restart (rejected per requirements)

**Implementation Notes**:

- Install: `npm install bullmq ioredis`
- Queue name: `crm-operations`
- Retry strategy: 3 attempts with exponential backoff (1s, 5s, 25s)
- Dead letter queue for permanently failed jobs

### 3. CRM Abstraction Pattern

**Decision**: Strategy pattern with factory for provider selection

**Rationale**:

- Strategy pattern allows runtime provider switching via configuration
- Factory pattern centralizes provider instantiation logic
- Interface-based design ensures both providers implement same contract
- Minimal code changes when adding new providers

**Alternatives Considered**:

- Adapter pattern: More complex, unnecessary for our use case
- Direct conditional logic: Not scalable, violates Open/Closed principle
- Plugin system: Over-engineered for 2 providers

**Implementation Notes**:

```typescript
interface ICRMProvider {
  createLead(data: LeadData): Promise<CRMResult>
  updateLead(id: string, data: Partial<LeadData>): Promise<CRMResult>
  logActivity(data: ActivityData): Promise<CRMResult>
  testConnection(): Promise<boolean>
}

class CRMFactory {
  static create(provider: 'bitrix' | 'espocrm'): ICRMProvider {
    // Factory logic
  }
}
```

### 4. EspoCRM Docker Deployment

**Decision**: Use official EspoCRM Docker image with MySQL database

**Rationale**:

- Official image maintained by EspoCRM team
- Supports MySQL (already in our stack)
- Environment-based configuration
- Volume persistence for uploads and custom configs

**Alternatives Considered**:

- Build custom image: Maintenance overhead
- PostgreSQL: Adds another database type
- Shared MySQL database: Violates isolation requirement

**Implementation Notes**:

- Image: `espocrm/espocrm:latest`
- Database: Dedicated MySQL database `espocrm_db`
- Volumes: `/var/www/html` for persistence
- Environment vars: `ESPOCRM_DATABASE_*`, `ESPOCRM_ADMIN_*`, `ESPOCRM_SITE_URL`

### 5. Caddy Reverse Proxy Configuration

**Decision**: Add subdomain block to existing Caddyfile

**Rationale**:

- Caddy already handles TLS/HTTPS for main app and Directus
- Simple configuration for additional subdomain
- Automatic HTTPS with Let's Encrypt
- Header forwarding for proper request context

**Alternatives Considered**:

- Separate reverse proxy: Unnecessary complexity
- Direct port exposure: No TLS, security risk
- Nginx: Already using Caddy, no reason to switch

**Implementation Notes**:

```caddyfile
{$CRM_DOMAIN} {
    encode zstd gzip
    reverse_proxy espocrm:8080 {
        header_up X-Forwarded-Proto {scheme}
        header_up X-Forwarded-Host {host}
        header_up Host {host}
    }
}
```

### 6. Field Mapping Strategy

**Decision**: Configuration-based field mapping per CRM provider

**Rationale**:

- Different CRMs have different custom field IDs
- Configuration allows changes without code deployment
- Type-safe mapping with TypeScript
- Centralized in one place for maintainability

**Alternatives Considered**:

- Hard-coded mapping: Not flexible, requires deployment for changes
- Database-stored mapping: Over-engineered, adds query overhead
- Dynamic discovery: Complex, unreliable

**Implementation Notes**:

```typescript
const FIELD_MAPPINGS = {
  bitrix: {
    referralCode: 'UF_CRM_REFERRAL_CODE',
    userType: 'UF_CRM_1234567893',
    // ...
  },
  espocrm: {
    referralCode: 'referralCodeC',
    userType: 'userTypeC',
    // ...
  },
}
```

## Technology Stack Summary

| Component     | Technology | Version    | Purpose           |
| ------------- | ---------- | ---------- | ----------------- |
| CRM System    | EspoCRM    | latest     | Primary CRM       |
| Queue         | BullMQ     | ^5.0.0     | Retry logic       |
| Queue Storage | Redis      | 7-alpine   | Queue persistence |
| Database      | MySQL      | 8.0        | EspoCRM data      |
| Reverse Proxy | Caddy      | 2.8-alpine | HTTPS/subdomain   |
| Runtime       | Node.js    | 22         | Application       |
| Language      | TypeScript | 5.x        | Type safety       |

## Dependencies to Add

```json
{
  "dependencies": {
    "bullmq": "^5.0.0",
    "ioredis": "^5.3.2"
  },
  "devDependencies": {
    "@types/ioredis": "^5.0.0"
  }
}
```

## Environment Variables Required

```bash
# CRM Provider Selection
CRM_PROVIDER=espocrm  # or 'bitrix'

# EspoCRM Configuration
ESPOCRM_URL=http://espocrm:8080
ESPOCRM_API_KEY=your-api-key-here
ESPOCRM_ADMIN_USERNAME=admin
ESPOCRM_ADMIN_PASSWORD=change-me

# EspoCRM Database
ESPOCRM_DB_NAME=espocrm_db
ESPOCRM_DB_USER=espocrm_user
ESPOCRM_DB_PASSWORD=secure-password

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=optional-password

# Caddy
CRM_DOMAIN=crm.edu-turkish.com
```

## Risks & Mitigations

| Risk                   | Impact | Mitigation                    |
| ---------------------- | ------ | ----------------------------- |
| EspoCRM API changes    | High   | Version pin, contract tests   |
| Redis unavailable      | Medium | Graceful degradation, logging |
| Queue overflow         | Low    | Job expiration, monitoring    |
| Field mapping mismatch | Medium | Validation, test coverage     |
| Migration data loss    | High   | Backup strategy, dry-run mode |

## Next Steps (Phase 1)

1. Define data model for CRM entities
2. Create API contracts for CRM operations
3. Generate contract tests
4. Create quickstart guide
5. Update agent context
