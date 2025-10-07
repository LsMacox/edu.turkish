# Data Model: EspoCRM Integration Fixes

**Date**: 2025-10-05  
**Feature**: Fix EspoCRM Integration Issues

## Overview

This feature introduces a CRM provider abstraction layer without modifying existing database schema. All changes are at the service/interface level.

## Core Interfaces

### ICrmProvider Interface

**Purpose**: Unified interface for all CRM providers (Bitrix, EspoCRM)

**Fields**:

```typescript
interface ICrmProvider {
  // Create a lead from application data
  createLead(data: ApplicationRequest): Promise<CrmResult>

  // Log messenger event (social media click)
  logMessengerEvent(payload: MessengerEventPayload): Promise<CrmResult>

  // Test CRM connection
  testConnection(): Promise<ConnectionResult>
}
```

**Validation Rules**:

- All methods must handle errors gracefully
- Must not throw exceptions that block primary operations
- Must return structured result objects

**State Transitions**: N/A (stateless service interface)

### CrmResult Type

**Purpose**: Standardized response from CRM operations

**Fields**:

```typescript
interface CrmResult {
  success: boolean
  id?: number | string // Lead/Activity ID from CRM
  error?: string // Error message if failed
}
```

**Validation Rules**:

- `success: true` requires `id` to be present
- `success: false` requires `error` to be present
- `id` can be number (Bitrix) or string (EspoCRM)

### ConnectionResult Type

**Purpose**: CRM connection test result

**Fields**:

```typescript
interface ConnectionResult {
  success: boolean
  error?: string
}
```

### CrmConfig Types

**Purpose**: Configuration for each CRM provider

**Bitrix Configuration**:

```typescript
interface BitrixConfig {
  domain: string
  accessToken: string
  webhookUrl?: string
}
```

**EspoCRM Configuration**:

```typescript
interface EspoCrmConfig {
  apiUrl: string // Base URL for EspoCRM API
  apiKey: string // API authentication key
}
```

**Validation Rules**:

- All fields required (no optional fields for active provider)
- URLs must be valid HTTP/HTTPS
- API keys must be non-empty strings

## Existing Entities (No Changes)

### ApplicationRequest

**Status**: No modifications required

**Current Structure**:

```typescript
interface ApplicationRequest {
  personal_info: {
    first_name: string
    last_name: string
    email: string
    phone: string
    // ... other fields
  }
  education: {
    /* ... */
  }
  preferences: {
    /* ... */
  }
  additional_info?: string
  source: string // ✅ Already accepts any string
  user_preferences?: UserPreferencesDTO
  referral_code?: string
}
```

**Validation Changes**:

- Remove any hidden validation on `source` field
- Accept any non-empty string value
- No enum constraint

### MessengerEventPayload

**Status**: No modifications required

**Current Structure**:

```typescript
interface MessengerEventPayload {
  channel: string // telegram, instagram, whatsapp
  referralCode: string
  session?: string
  utm?: MessengerEventUtm
  metadata?: MessengerEventMetadata
}
```

## Error Response Structure

### Validation Error Response

**Purpose**: Structured error response from API endpoints

**Current Structure**:

```typescript
interface ValidationErrorResponse {
  statusCode: 400
  statusMessage: 'Validation failed'
  data: {
    errors: string[] // Array of error messages
  }
}
```

**Frontend Handling**:

```typescript
// Type guard for validation errors
function isValidationError(error: any): error is ValidationErrorResponse {
  return error?.statusCode === 400 && Array.isArray(error?.data?.errors)
}

// Extract error messages
function getErrorMessage(error: any): string {
  if (isValidationError(error)) {
    return error.data.errors.join('\n')
  }

  if (typeof error?.data?.message === 'string') {
    return error.data.message
  }

  if (typeof error?.message === 'string') {
    return error.message
  }

  return 'An unexpected error occurred. Please try again.'
}
```

## Configuration Model

### CRM Provider Selection

**Environment Variable**: `CRM_PROVIDER`

**Valid Values**:

- `'bitrix'` (default)
- `'espocrm'`

**Selection Logic**:

```typescript
function getCrmProvider(): 'bitrix' | 'espocrm' {
  const provider = process.env.CRM_PROVIDER?.toLowerCase()
  return provider === 'espocrm' ? 'espocrm' : 'bitrix'
}
```

### Configuration Validation

**Purpose**: Ensure required environment variables are set

**Validation Function**:

```typescript
function validateCrmConfig(): {
  isValid: boolean
  provider: 'bitrix' | 'espocrm'
  errors: string[]
} {
  const provider = getCrmProvider()
  const errors: string[] = []

  if (provider === 'bitrix') {
    if (!process.env.BITRIX_WEBHOOK_URL) {
      errors.push('BITRIX_WEBHOOK_URL is required')
    }
  } else {
    if (!process.env.ESPOCRM_API_URL) {
      errors.push('ESPOCRM_API_URL is required')
    }
    if (!process.env.ESPOCRM_API_KEY) {
      errors.push('ESPOCRM_API_KEY is required')
    }
  }

  return {
    isValid: errors.length === 0,
    provider,
    errors,
  }
}
```

## Component State Model

### ApplicationModal Error State

**Purpose**: Manage error display in application modal

**State Structure**:

```typescript
interface ErrorState {
  hasError: boolean
  message: string
  fieldErrors: Record<string, string> // field name -> error message
  generalError?: string // non-field-specific error
}
```

**State Transitions**:

1. **Initial**: `hasError: false, message: '', fieldErrors: {}`
2. **Submit**: Clear all errors
3. **Validation Error**: Set `hasError: true`, populate `fieldErrors` or `generalError`
4. **Success**: Reset to initial state
5. **Close Modal**: Reset to initial state

**Display Rules**:

- Field errors: Show at bottom of modal + optional tooltip on field
- General errors: Show in tooltip above modal (z-index: 10000)
- Empty/undefined errors: Show fallback message
- Boolean values: Convert to fallback message (fix for 'true' bug)

## Data Flow

### Application Submission Flow

```
User submits form
  ↓
ApplicationModal validates locally
  ↓
POST /api/v1/applications
  ↓
validateApplicationData() - Fix source validation
  ↓
ApplicationRepository.create() - Save to DB
  ↓
CrmProviderFactory.create() - Select provider
  ↓
provider.createLead() - Send to CRM
  ↓
Return success (even if CRM fails)
  ↓
ApplicationModal displays result
```

### Messenger Event Flow

```
User clicks social media link
  ↓
POST /api/v1/messenger-events
  ↓
CrmProviderFactory.create() - Select provider
  ↓
provider.logMessengerEvent() - Send to CRM
  ↓
Return success/failure
  ↓
Redirect to social media
```

## Validation Rules Summary

### Source Field Validation

**Before** (Incorrect):

- Unknown validation causing "Invalid source (valid)" error
- Possibly checking against enum or whitelist

**After** (Correct):

```typescript
function validateApplicationData(data: any): ValidationResult {
  const errors: string[] = []

  // ... other validations ...

  // Source validation: accept any non-empty string
  if (!data.source || typeof data.source !== 'string' || !data.source.trim()) {
    errors.push('Source is required')
  }

  return { isValid: errors.length === 0, errors }
}
```

### Error Message Validation

**Before** (Incorrect):

```typescript
// Shows 'true' instead of message
show(error?.data?.errors, { type: 'error' })
```

**After** (Correct):

```typescript
// Type-safe extraction with fallback
const errorMessage = getErrorMessage(error)
show(errorMessage, { type: 'error' })
```

## No Database Schema Changes

**Important**: This feature requires NO Prisma migrations or schema changes.

**Rationale**:

- All changes are at service/interface level
- Existing `Application` model already supports any string for `source`
- CRM integration is external to database
- Error handling is frontend/API layer concern

---

**Data Model Complete**: All interfaces, types, and validation rules documented.
