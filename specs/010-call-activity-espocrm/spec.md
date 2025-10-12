# Feature Specification: EspoCRM Telegram Notifications for Leads and Call Activities

**Feature Branch**: `010-call-activity-espocrm`  
**Created**: 2025-10-12  
**Status**: Ready for Planning  
**Input**: User description: "Как консультант, я хочу чтобы когда приходит лид или call (activity) в Espocrm, получать уведомление через тг бота в два канала. Один будет для лидов, второй для call (activity), и хочу чтобы отправлялся если только я нахожусь в определенной команде (team из espocrm). Как разработчик, думаю реализовать это через webhooks от espocrm (учти что такая логика нужна пока только для espocrm)"

## Execution Flow (main)

```
1. Parse user description from Input
   → SUCCESS: Feature involves EspoCRM webhook notifications to Telegram
2. Extract key concepts from description
   → Actors: Consultants (team members)
   → Actions: Receive notifications when leads/calls created
   → Data: Lead data, Call activity data, Team membership
   → Constraints: Only notify if user is in specific team
3. For each unclear aspect:
   → RESOLVED: All clarifications received from stakeholder
4. Fill User Scenarios & Testing section
   → SUCCESS: Clear user flow identified
5. Generate Functional Requirements
   → SUCCESS: All requirements testable
6. Identify Key Entities
   → SUCCESS: Lead, Call Activity, Team, Telegram Channel identified
7. Run Review Checklist
   → SUCCESS: All requirements clear and testable
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines

- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

---

## User Scenarios & Testing

### Primary User Story

As a consultant working in a specific EspoCRM team, I want to receive instant Telegram notifications when new leads are created or when call activities are logged, so that I can respond quickly to potential customers and track my team's activities in real-time without constantly checking the CRM system.

### Acceptance Scenarios

1. **Given** a new lead is created in EspoCRM and assigned to a consultant who is a member of the designated team, **When** the lead is saved, **Then** a notification with lead details is sent to the Leads Telegram channel

2. **Given** a new call activity is logged in EspoCRM by a consultant who is a member of the designated team, **When** the call activity is saved, **Then** a notification with call details is sent to the Call Activities Telegram channel

3. **Given** a new lead is created in EspoCRM and assigned to a consultant who is NOT a member of the designated team, **When** the lead is saved, **Then** no notification is sent to any Telegram channel

4. **Given** a new call activity is logged by a consultant who is NOT a member of the designated team, **When** the call activity is saved, **Then** no notification is sent to any Telegram channel

5. **Given** a lead or call activity is created without any team assignment, **When** the record is saved, **Then** notification is sent (simplified approach - no complex filtering)

### Edge Cases

- What happens when the Telegram bot is unavailable or the channel is inaccessible? → System retries up to 3 times, then logs error
- What happens if EspoCRM webhook fails or times out? → Webhook returns error to EspoCRM, notification queued for retry
- How does the system handle rapid creation of multiple leads/calls? → Each notification processed independently through queue

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST receive webhook events from EspoCRM when new leads are created (not updates)
- **FR-002**: System MUST receive webhook events from EspoCRM when new call activities are created (not updates)
- **FR-003**: System MUST filter notifications based on ESPOCRM_ASSIGNED_TEAM_ID configuration
- **FR-004**: System MUST send lead notifications to a dedicated Leads Telegram channel
- **FR-005**: System MUST send call activity notifications to a dedicated Call Activities Telegram channel
- **FR-006**: System MUST include all available business-relevant fields in notifications (excluding technical/internal fields like assignment IDs)
- **FR-007**: System MUST only process webhooks from EspoCRM (not other CRM systems)
- **FR-008**: System MUST validate webhook requests using token-based authentication
- **FR-009**: System MUST handle webhook failures gracefully without blocking EspoCRM operations
- **FR-014**: System MUST retry failed notification deliveries up to 3 times before logging error
- **FR-015**: System MUST use job queue for notification delivery to ensure reliability
- **FR-010**: Notifications MUST be sent promptly (delays under a few minutes are acceptable)
- **FR-011**: System MUST support configuration via ESPOCRM_ASSIGNED_TEAM_ID environment variable
- **FR-012**: System MUST support configuration of Telegram channel identifiers for both leads and calls
- **FR-013**: System MUST log failed notification attempts (successful deliveries do not require persistent audit logs)

### Key Entities

- **Lead**: Represents a potential customer in EspoCRM, contains contact information, source, status, and team assignment
- **Call Activity**: Represents a logged phone call in EspoCRM, contains call details (duration, outcome, notes), associated contact/lead, and user who made the call
- **Team**: Represents a group of users in EspoCRM, used to determine notification eligibility
- **Telegram Channel**: Destination for notifications, separate channels for leads and call activities
- **Notification**: Message sent to Telegram containing formatted information from lead or call activity
- **Webhook Event**: Data payload received from EspoCRM containing entity information and metadata

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
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---

## Clarifications Resolved

1. **Team Configuration**: Filter by ESPOCRM_ASSIGNED_TEAM_ID environment variable ✓
2. **Notification Content**: Include all available business-relevant fields (exclude technical fields like assignment IDs) ✓
3. **Event Scope**: Only new leads/activities, no updates ✓
4. **Multi-Assignment**: Simplified approach - no complex multi-team handling ✓
5. **Security**: Token-based authentication (simple approach) ✓
6. **Performance**: Small delays acceptable (not tens of minutes) ✓
7. **Error Handling**: Retry 3 times via job queue, then log error ✓
8. **Audit Retention**: No persistent audit logs needed ✓
9. **Unassigned Records**: Simplified approach - send notifications ✓
