# Feature Specification: Fix EspoCRM Integration Issues

**Feature Branch**: `005-espocrm-espocrm-bitrix`  
**Created**: 2025-10-05  
**Status**: Draft  
**Input**: User description: "Fix all inconsistencies in EspoCRM integration: 1) Social media messenger events incorrectly attempt to send to Bitrix when EspoCRM is configured, causing 401 errors; 2) Inconsistent validation error display in application modal - backend errors show 'true' in tooltip instead of error message, and field-related errors need to be shown at bottom of modal; 3) Validation error 'Invalid source (valid)' occurs even when all fields are filled correctly."

## Execution Flow (main)

```
1. Parse user description from Input
   ✓ Identified three distinct integration issues
2. Extract key concepts from description
   ✓ Actors: Users submitting applications, System administrators
   ✓ Actions: Submit application, click social media links, view error messages
   ✓ Data: Application form data, messenger event data, validation errors
   ✓ Constraints: CRM provider configuration, error message display
3. For each unclear aspect:
   ✓ All aspects are clear from error logs and code analysis
4. Fill User Scenarios & Testing section
   ✓ Completed
5. Generate Functional Requirements
   ✓ Each requirement is testable
6. Identify Key Entities
   ✓ Application submission, Messenger events, Error messages
7. Run Review Checklist
   ✓ No implementation details in requirements
8. Return: SUCCESS (spec ready for planning)
```

---

## User Scenarios & Testing _(mandatory)_

### Primary User Story

**As a** site visitor submitting an application or clicking social media links,  
**I want** the system to correctly route my data to the configured CRM provider and display clear error messages,  
**So that** my application is properly recorded and I understand any issues that occur.

### Acceptance Scenarios

1. **Given** EspoCRM is configured as the CRM provider, **When** a user clicks a social media messenger link, **Then** the system MUST send the event to EspoCRM (not Bitrix) and no 401 errors should appear in logs.

2. **Given** a user submits an application form, **When** the backend returns validation errors, **Then** the error messages MUST be displayed clearly in the modal (not showing 'true' or undefined values).

3. **Given** a user fills all required fields correctly in the application form, **When** they submit the form, **Then** no "Invalid source" validation error should occur.

4. **Given** backend validation fails with field-specific errors, **When** the error response is received, **Then** field-related error messages MUST be displayed at the bottom of the modal AND in tooltips for the relevant fields.

5. **Given** backend validation fails with general errors, **When** the error response is received, **Then** the error message MUST be displayed in a tooltip positioned above the modal.

### Edge Cases

- What happens when CRM provider is not configured at all? System should gracefully handle and log warning without blocking application submission.
- What happens when both field-specific and general errors occur? System should display both types appropriately.
- What happens when error message is empty or malformed? System should display a generic fallback error message.
- What happens when network request to CRM fails? System should log error but not block application from being saved to database.

## Requirements _(mandatory)_

### Functional Requirements

#### CRM Provider Routing

- **FR-001**: System MUST determine the active CRM provider (Bitrix or EspoCRM) based on configuration.
- **FR-002**: System MUST route messenger events (social media clicks) to the configured CRM provider only.
- **FR-003**: System MUST NOT attempt to send messenger events to Bitrix when EspoCRM is configured.
- **FR-004**: System MUST log messenger events to EspoCRM when EspoCRM is the configured provider.
- **FR-005**: System MUST handle CRM integration failures gracefully without blocking the primary operation (application submission or event logging).

#### Application Validation

- **FR-006**: System MUST validate the 'source' field in application submissions.
- **FR-007**: System MUST accept all valid source values including referral codes, preset sources (website, home_questionnaire, university_detail, etc.).
- **FR-008**: System MUST NOT reject applications with valid source values.
- **FR-009**: System MUST provide clear validation error messages that identify which field failed and why.

#### Error Message Display

- **FR-010**: Application modal MUST display backend validation errors as readable text (not boolean values like 'true').
- **FR-011**: Field-specific validation errors MUST be displayed at the bottom of the application modal.
- **FR-012**: Field-specific validation errors MAY also be displayed in tooltips on the relevant input fields.
- **FR-013**: General validation errors (not tied to specific fields) MUST be displayed in a tooltip positioned above the modal.
- **FR-014**: Error tooltips MUST have higher z-index than the modal to ensure visibility.
- **FR-015**: System MUST display a fallback error message when the backend error is empty, undefined, or malformed.

#### Data Integrity

- **FR-016**: System MUST save application data to the database regardless of CRM integration success/failure.
- **FR-017**: System MUST log CRM integration errors for administrator review without exposing technical details to users.
- **FR-018**: System MUST return appropriate HTTP status codes (400 for validation errors, 201 for successful creation, 500 for server errors).

### Key Entities

- **Application Submission**: User-provided information including personal details, education background, preferences, source identifier, and optional referral code. Must be validated before processing and saved to database.

- **Messenger Event**: Record of user interaction with social media links, including channel name, referral code, session identifier, UTM parameters, and metadata. Must be routed to the correct CRM provider.

- **Validation Error**: Structured error information returned from backend, containing error type (field-specific or general), error message text, and affected field identifiers. Must be displayed appropriately in the UI.

- **CRM Provider Configuration**: System setting that determines which CRM system (Bitrix or EspoCRM) should receive application and event data. Must be checked before routing any CRM operations.

---

## Review & Acceptance Checklist

_GATE: Automated checks run during main() execution_

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

_Updated by main() during processing_

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked (none found)
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---
