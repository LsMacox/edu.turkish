# Contract: CRM Provider Interface

**Version**: 1.0.0  
**Date**: 2025-10-05

## Overview

Defines the contract that all CRM providers (Bitrix, EspoCRM) must implement to ensure consistent behavior across the application.

## Interface Contract

### ICrmProvider

```typescript
interface ICrmProvider {
  /**
   * Create a lead in the CRM system from application data
   * 
   * @param data - Application request data
   * @returns Promise with lead creation result
   * @throws Never - Must catch all errors and return { success: false, error }
   */
  createLead(data: ApplicationRequest): Promise<CrmResult>
  
  /**
   * Log a messenger event (social media click) in the CRM system
   * 
   * @param payload - Messenger event data
   * @returns Promise with event logging result
   * @throws Never - Must catch all errors and return { success: false, error }
   */
  logMessengerEvent(payload: MessengerEventPayload): Promise<CrmResult>
  
  /**
   * Test connection to the CRM system
   * 
   * @returns Promise with connection test result
   * @throws Never - Must catch all errors and return { success: false, error }
   */
  testConnection(): Promise<ConnectionResult>
}
```

## Type Contracts

### CrmResult

```typescript
interface CrmResult {
  success: boolean
  id?: number | string  // Lead or Activity ID from CRM
  error?: string        // Error message if success is false
}
```

**Invariants**:
- If `success === true`, then `id` MUST be present
- If `success === false`, then `error` MUST be present
- `id` can be number (Bitrix) or string (EspoCRM UUID)

### ConnectionResult

```typescript
interface ConnectionResult {
  success: boolean
  error?: string
}
```

**Invariants**:
- If `success === false`, then `error` MUST be present

## Behavioral Contracts

### createLead()

**Preconditions**:
- `data.personal_info.first_name` must be non-empty string
- `data.personal_info.phone` must be non-empty string
- `data.source` must be non-empty string

**Postconditions**:
- Returns `{ success: true, id }` if lead created successfully
- Returns `{ success: false, error }` if creation failed
- Never throws exceptions
- Execution time < 20 seconds (with retries)

**Side Effects**:
- Creates lead in external CRM system
- Logs errors to console on failure
- Does NOT modify local database

### logMessengerEvent()

**Preconditions**:
- `payload.channel` must be non-empty string
- `payload.referralCode` must be non-empty string

**Postconditions**:
- Returns `{ success: true, id }` if event logged successfully
- Returns `{ success: false, error }` if logging failed
- Never throws exceptions
- Execution time < 10 seconds (with retries)

**Side Effects**:
- Creates activity/event in external CRM system
- Logs errors to console on failure
- Does NOT modify local database

### testConnection()

**Preconditions**:
- CRM configuration must be set in environment variables

**Postconditions**:
- Returns `{ success: true }` if connection successful
- Returns `{ success: false, error }` if connection failed
- Never throws exceptions
- Execution time < 12 seconds

**Side Effects**:
- Makes API call to CRM system
- Logs errors to console on failure
- Does NOT create any data in CRM

## Error Handling Contract

All methods MUST:
1. Catch ALL exceptions internally
2. Return structured error result instead of throwing
3. Log errors to console for debugging
4. Include descriptive error messages in result

Example:
```typescript
async createLead(data: ApplicationRequest): Promise<CrmResult> {
  try {
    // ... implementation ...
    return { success: true, id: leadId }
  } catch (error: any) {
    console.error('Error creating lead:', error)
    return {
      success: false,
      error: error.message || 'Unknown error'
    }
  }
}
```

## Timeout Contract

All methods MUST implement timeouts:
- `createLead()`: 20 seconds (includes retries)
- `logMessengerEvent()`: 10 seconds (includes retries)
- `testConnection()`: 12 seconds

Timeout implementation:
```typescript
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), timeoutMs)

try {
  const response = await fetch(url, { signal: controller.signal })
  clearTimeout(timeout)
  // ... process response ...
} catch (error) {
  clearTimeout(timeout)
  if (error.name === 'AbortError') {
    return { success: false, error: 'Request timeout' }
  }
  throw error
}
```

## Retry Contract

Methods SHOULD implement retry logic for transient failures:
- `createLead()`: 2 retries with 1 second delay
- `logMessengerEvent()`: 1 retry with 1 second delay
- `testConnection()`: 1 retry with 1 second delay

Retry conditions:
- Network timeout (AbortError)
- 5xx server errors
- Connection refused

Do NOT retry:
- 4xx client errors (except 429 rate limit)
- Invalid configuration
- Authentication failures

## Configuration Contract

Each provider MUST validate its configuration on instantiation:

```typescript
class EspoCrmService implements ICrmProvider {
  constructor(config: EspoCrmConfig) {
    if (!config.apiUrl || !config.apiKey) {
      throw new Error('EspoCRM configuration incomplete')
    }
    this.config = config
  }
}
```

## Factory Contract

The factory MUST:
1. Read `CRM_PROVIDER` environment variable
2. Default to 'bitrix' if not set
3. Validate provider configuration before returning instance
4. Throw error if configuration invalid

```typescript
class CrmProviderFactory {
  static create(): ICrmProvider {
    const provider = process.env.CRM_PROVIDER?.toLowerCase() || 'bitrix'
    
    if (provider === 'espocrm') {
      const config = getEspoCrmConfig()
      return new EspoCrmService(config)
    }
    
    const config = getBitrixConfig()
    return new BitrixService(config)
  }
}
```

## Testing Contract

All implementations MUST have:
1. Unit tests for each method
2. Contract tests verifying interface compliance
3. Integration tests with mocked HTTP responses
4. Error scenario tests (timeout, network failure, invalid response)

Minimum test coverage: 80% for service classes

## Backward Compatibility Contract

- Existing `BitrixService` MUST continue to work unchanged
- Default behavior (no `CRM_PROVIDER` set) MUST use Bitrix
- No breaking changes to `ApplicationRequest` or `MessengerEventPayload` types
- API endpoints MUST maintain same request/response format

---

**Contract Version**: 1.0.0  
**Breaking Changes**: None (new feature)  
**Deprecations**: None
