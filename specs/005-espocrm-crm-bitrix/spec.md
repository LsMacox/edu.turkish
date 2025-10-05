# Feature Specification: EspoCRM Integration with CRM Abstraction Layer

**Feature Branch**: `005-espocrm-crm-bitrix`  
**Created**: 2025-10-04  
**Status**: Clarified & Ready for Planning  
**Input**: User description: "Интеграция EspoCRM с абстракцией CRM для возможности переключения между Bitrix и EspoCRM"

---

## User Scenarios & Testing

### Primary User Story

As a business administrator, I need the system to send lead and contact information to a CRM system so that our sales team can follow up with potential students. The system must support switching between different CRM providers (currently Bitrix and EspoCRM) without requiring code changes to the application logic.

### Acceptance Scenarios

1. **Given** a user submits an application form on the website, **When** the application is processed, **Then** the lead data must be created in the active CRM system (EspoCRM or Bitrix) with all required fields populated correctly

2. **Given** a user clicks on a messenger link (Telegram/WhatsApp/Instagram) with a referral code, **When** the click event is tracked, **Then** the system must log the messenger activity in the active CRM system

3. **Given** the system uses a CRM abstraction layer, **When** a future migration to a different CRM provider is needed, **Then** the abstraction layer minimizes code changes required for the switch

4. **Given** EspoCRM is deployed in a Docker container, **When** users access the CRM subdomain, **Then** they must be able to access the EspoCRM interface securely via HTTPS

5. **Given** a CRM operation fails (network timeout, invalid credentials, etc.), **When** the error occurs, **Then** the system must log the error, continue processing the user request, and return appropriate feedback without exposing CRM details to the end user

### Edge Cases

- What happens when both CRM systems are unavailable? System must gracefully degrade and queue operations in Redis for retry
- How does the system handle partial data (missing phone or email)? Must validate minimum required fields (name + phone + email + referral code) before sending to CRM
- What happens when CRM custom field mappings differ between Bitrix and EspoCRM? Must have configurable field mapping per CRM provider
- How does the system handle CRM API version changes? Must validate API compatibility on startup
- What happens when switching CRM providers mid-operation? CRM provider switching is a manual migration process, not a runtime dynamic switch. The abstraction layer is designed for future flexibility, not hot-swapping

---

## Requirements

### Functional Requirements

#### CRM Abstraction Layer

- **FR-001**: System MUST provide a unified interface for all CRM operations (create lead, update lead, log activity, test connection) that works identically regardless of the active CRM provider

- **FR-002**: System MUST provide a minimal abstraction layer that allows future CRM provider changes with minimal code modifications, configured via environment variables

- **FR-003**: System MUST map application data fields to CRM-specific fields through a configurable mapping layer that can be customized per CRM provider

- **FR-004**: System MUST validate that all required CRM configuration (API credentials, endpoints, field mappings) is present before allowing CRM operations

- **FR-005**: System MUST handle CRM operation failures gracefully by logging errors, implementing retry logic with exponential backoff using Redis-backed queue, and continuing application flow without blocking user requests

#### EspoCRM Integration

- **FR-006**: System MUST create leads in EspoCRM with all application data including: personal information (name - required, phone - required, email - required), education preferences (field of study, universities), user preferences (user type, language, scholarship needs), and referral tracking (referral code - required, source, UTM parameters)

- **FR-007**: System MUST log messenger click events (Telegram, WhatsApp, Instagram) as activities in EspoCRM with channel information, referral codes, session data, and UTM parameters

- **FR-008**: System MUST create minimal leads from messenger events when a referral code is present but no full application exists

- **FR-009**: System MUST support EspoCRM authentication using API keys for programmatic access, while administrators access the EspoCRM web interface using username and password credentials

- **FR-010**: System MUST map EspoCRM lead fields to match current Bitrix custom field functionality including: source tracking, referral codes, user type, language preference, field of study, and university interest

#### Infrastructure & Deployment

- **FR-011**: System MUST deploy EspoCRM and Redis in Docker containers within the existing docker-compose infrastructure

- **FR-011a**: System MUST use the latest stable version of EspoCRM for deployment

- **FR-012**: System MUST configure reverse proxy (Caddy) to serve EspoCRM on `crm.{domain}` subdomain with HTTPS/TLS encryption

- **FR-013**: System MUST persist EspoCRM data in a dedicated database or volume to prevent data loss on container restart

- **FR-014**: System MUST configure EspoCRM with a dedicated separate database to isolate CRM data from application data

- **FR-015**: System MUST provide health checks for EspoCRM container to ensure availability before routing CRM operations

#### Data Migration & Compatibility

- **FR-016**: System MUST maintain backward compatibility with existing Bitrix integration during the transition period

- **FR-017**: System MUST preserve all existing CRM functionality when switching providers (lead creation, activity logging, field mappings)

- **FR-018**: System MUST document field mapping differences between Bitrix and EspoCRM for business users

- **FR-019**: System MUST provide a test/sandbox mode for CRM operations to validate connectivity and field mappings without affecting production data

#### Configuration & Monitoring

- **FR-020**: System MUST expose configuration options for: active CRM provider, API credentials, endpoint URLs, timeout values, retry policies, and field mappings

- **FR-021**: System MUST log all CRM operations (success and failure) with sufficient detail for debugging and audit purposes

- **FR-022**: System MUST log all CRM operations with sufficient detail for debugging without requiring additional monitoring or alerting infrastructure

### Key Entities

- **CRM Provider**: Represents a CRM system (Bitrix or EspoCRM) with its configuration, authentication credentials, API endpoints, and field mappings

- **Lead**: Represents a potential student with personal information, contact details, education preferences, and source attribution that must be synchronized to the CRM

- **Activity**: Represents a user interaction event (messenger click, form view, etc.) that must be logged in the CRM for tracking and attribution

- **Field Mapping**: Represents the translation between application data fields and CRM-specific custom fields, allowing different mappings per CRM provider

- **CRM Operation**: Represents an action performed against the CRM (create lead, update lead, log activity) with retry logic, timeout handling, and error tracking

---

## Review & Acceptance Checklist

### Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked and resolved
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---

## Clarifications Resolved

### Initial Clarifications
1. **EspoCRM Authentication** (FR-009): ✅ Username/password for web UI, API keys for programmatic access
2. **Database Strategy** (FR-014): ✅ Dedicated separate database for EspoCRM
3. **Testing Strategy** (FR-019): ✅ Test/sandbox mode required for CRM operations
4. **Monitoring Requirements** (FR-022): ✅ Logging only, no additional monitoring infrastructure needed

### Detailed Clarifications (from /clarify workflow)
5. **EspoCRM Subdomain** (FR-012): ✅ `crm.{domain}` subdomain
6. **Retry Queue Strategy** (FR-005, FR-011): ✅ Redis-backed persistent queue with exponential backoff
7. **Minimum Lead Data** (FR-006): ✅ Name + phone + email + referral code (all required)
8. **CRM Switch Behavior** (FR-002): ✅ Manual migration process, not runtime dynamic switching. Abstraction layer provides future flexibility with minimal code changes
9. **EspoCRM Version** (FR-011a): ✅ Latest stable version
