# Research: EspoCRM Integration Fixes

**Date**: 2025-10-05  
**Feature**: Fix EspoCRM Integration Issues

## Research Questions

### 1. CRM Provider Abstraction Pattern

**Decision**: Factory Pattern with Provider Interface

**Rationale**:

- Existing codebase has `BitrixService` class with specific methods
- Need to support multiple CRM providers (Bitrix, EspoCRM) without code duplication
- Factory pattern allows runtime selection based on environment configuration
- Interface ensures consistent API across providers

**Alternatives Considered**:

- **Strategy Pattern**: More complex, requires context object management
- **Direct conditionals**: Would scatter CRM logic across multiple files
- **Adapter Pattern**: Over-engineering for this use case

**Implementation Approach**:

```typescript
interface ICrmProvider {
  createLead(data: ApplicationRequest): Promise<CrmResult>
  logMessengerEvent(payload: MessengerEventPayload): Promise<CrmResult>
  testConnection(): Promise<{ success: boolean; error?: string }>
}

class CrmProviderFactory {
  static create(): ICrmProvider {
    const provider = process.env.CRM_PROVIDER || 'bitrix'
    return provider === 'espocrm' ? new EspoCrmService() : new BitrixService()
  }
}
```

### 2. EspoCRM API Integration

**Decision**: Use EspoCRM REST API v1 with similar structure to BitrixService

**Rationale**:

- EspoCRM provides REST API for lead creation and activity logging
- Similar capabilities to Bitrix (leads, contacts, activities)
- Authentication via API key in headers
- JSON request/response format

**Key Endpoints**:

- `POST /api/v1/Lead` - Create lead
- `POST /api/v1/Activity` - Log activity/event
- `GET /api/v1/Lead/{id}` - Retrieve lead

**Authentication**:

- Header: `X-Api-Key: {API_KEY}`
- Environment variable: `ESPOCRM_API_KEY`
- Base URL: `ESPOCRM_API_URL`

**Alternatives Considered**:

- **EspoCRM PHP SDK**: Requires PHP runtime, not suitable for Node.js
- **GraphQL API**: Not available in EspoCRM

### 3. Source Field Validation Issue

**Decision**: Remove overly restrictive validation, accept any non-empty string

**Rationale**:

- Current validation in `validateApplicationData` doesn't check source field
- Error "Invalid source (valid)" suggests validation happening elsewhere
- Source field accepts: referral codes, preset values (website, home_questionnaire, etc.)
- No enum constraint in Prisma schema or TypeScript types

**Root Cause Analysis**:

- Likely validation in `ApplicationRepository.create()` or database constraint
- Need to trace where "Invalid source (valid)" error originates
- Check for hidden validation in Prisma schema or repository layer

**Fix Approach**:

1. Audit all validation points for source field
2. Ensure source accepts any string value (referral codes are dynamic)
3. Add proper validation only for required/non-empty check

### 4. Error Message Display in Vue Component

**Decision**: Structured error handling with type guards and fallback messages

**Rationale**:

- Current code shows `true` instead of error message (type coercion issue)
- Backend returns `{ errors: string[] }` for validation errors
- Need to distinguish field-specific vs general errors
- Tooltip z-index must be higher than modal (z-[9999] for modal, z-[10000] for tooltip)

**Implementation Pattern**:

```typescript
// Type-safe error extraction
const errorMessage =
  typeof error?.data?.message === 'string'
    ? error.data.message
    : Array.isArray(error?.data?.errors)
      ? error.data.errors.join('\n')
      : 'An unexpected error occurred'

// Fallback for empty/undefined
const displayMessage = errorMessage.trim() || 'Please check your input and try again'
```

**Alternatives Considered**:

- **Error boundary component**: Over-engineering for modal-specific errors
- **Global error handler**: Would affect all components, not just this modal

### 5. Testing Strategy

**Decision**: Contract tests for CRM providers, integration tests for API endpoints, component tests for error display

**Rationale**:

- Contract tests ensure CRM provider interface compliance
- Integration tests verify end-to-end flow with mocked CRM
- Component tests validate error message rendering

**Test Structure**:

```
tests/
├── contract/
│   ├── crm-provider.contract.test.ts    # Interface compliance
│   └── espocrm-api.test.ts              # EspoCRM API contracts
├── server/
│   ├── services/
│   │   ├── CrmProviderFactory.test.ts   # Factory selection logic
│   │   └── EspoCrmService.test.ts       # EspoCRM service methods
│   └── api/
│       └── applications.test.ts         # End-to-end with mocked CRM
└── components/
    └── ApplicationModal.test.ts         # Error display scenarios
```

## Configuration Requirements

### Environment Variables

**New Variables**:

```bash
# CRM Provider Selection
CRM_PROVIDER=espocrm  # or 'bitrix' (default)

# EspoCRM Configuration
ESPOCRM_API_URL=https://crm.example.com
ESPOCRM_API_KEY=your-api-key-here
```

**Existing Variables** (maintain compatibility):

```bash
BITRIX_WEBHOOK_URL=https://eduturkish.bitrix24.com/rest/1/token/
```

### Configuration Validation

Add utility function to validate CRM configuration:

```typescript
export function validateCrmConfig(): boolean {
  const provider = process.env.CRM_PROVIDER || 'bitrix'

  if (provider === 'espocrm') {
    return !!(process.env.ESPOCRM_API_URL && process.env.ESPOCRM_API_KEY)
  }

  return !!process.env.BITRIX_WEBHOOK_URL
}
```

## Dependencies

**No new npm packages required**:

- Use native `fetch` API for HTTP requests (Node.js 18+)
- Existing Vitest for testing
- Existing Vue Test Utils for component tests

## Performance Considerations

**CRM Request Timeouts**:

- Maintain existing 15s timeout for lead creation
- Use 10s timeout for messenger events (lower priority)
- Implement retry logic for network failures (existing in BitrixService)

**Error Handling**:

- CRM failures must not block application submission
- Log errors for admin review
- Return success to user even if CRM integration fails

## Security Considerations

**API Key Storage**:

- Store in environment variables only
- Never expose in client-side code
- Use server-side configuration utilities

**Error Messages**:

- Don't expose internal error details to users
- Log full errors server-side for debugging
- Show generic messages to users

## Migration Path

**Backward Compatibility**:

1. Default to Bitrix if `CRM_PROVIDER` not set
2. Existing Bitrix integration continues to work unchanged
3. No database schema changes required
4. No breaking changes to API contracts

**Rollout Strategy**:

1. Deploy with `CRM_PROVIDER=bitrix` (no change)
2. Test EspoCRM integration in staging
3. Switch to `CRM_PROVIDER=espocrm` when ready
4. Monitor logs for integration errors

## Success Criteria

**Functional**:

- ✅ Messenger events route to configured CRM provider
- ✅ No 401 errors when EspoCRM is configured
- ✅ Application submissions succeed with valid source values
- ✅ Error messages display correctly in modal

**Non-Functional**:

- ✅ <500ms API response time maintained
- ✅ Zero data loss during CRM failures
- ✅ Backward compatible with existing Bitrix integration
- ✅ All tests pass (contract, integration, component)

---

**Research Complete**: All technical decisions documented and ready for Phase 1 design.
