# Contract: EspoCRM API Integration

**Version**: 1.0.0  
**Date**: 2025-10-05  
**API Version**: EspoCRM REST API v1

## Overview

Defines the HTTP contract for integrating with EspoCRM REST API, including endpoints, request/response formats, authentication, and error handling.

## Authentication

### API Key Authentication

**Method**: HTTP Header

**Header**:

```
X-Api-Key: {API_KEY}
```

**Configuration**:

- Environment variable: `ESPOCRM_API_KEY`
- Required for all API requests
- Must be included in every request header

## Base URL

**Configuration**: `ESPOCRM_API_URL`

**Format**: `https://{domain}/api/v1`

**Example**: `https://crm.example.com/api/v1`

## Endpoints

### Create Lead

**Endpoint**: `POST /Lead`

**Request Headers**:

```
Content-Type: application/json
X-Api-Key: {API_KEY}
```

**Request Body**:

```json
{
  "name": "string", // Required: Lead name
  "firstName": "string", // Optional: First name
  "lastName": "string", // Optional: Last name
  "emailAddress": "string", // Optional: Email
  "phoneNumber": "string", // Optional: Phone
  "source": "string", // Optional: Lead source
  "description": "string", // Optional: Additional info
  "assignedUserId": "string" // Optional: Assigned user UUID
}
```

**Success Response** (201 Created):

```json
{
  "id": "uuid-string",
  "name": "string",
  "firstName": "string",
  "lastName": "string"
  // ... other fields ...
}
```

**Error Response** (400 Bad Request):

```json
{
  "error": "Validation Failed",
  "message": "Field 'name' is required"
}
```

**Error Response** (401 Unauthorized):

```json
{
  "error": "Unauthorized",
  "message": "Invalid API key"
}
```

**Error Response** (500 Internal Server Error):

```json
{
  "error": "Internal Server Error",
  "message": "Database connection failed"
}
```

### Create Activity

**Endpoint**: `POST /Activity`

**Request Headers**:

```
Content-Type: application/json
X-Api-Key: {API_KEY}
```

**Request Body**:

```json
{
  "name": "string", // Required: Activity name
  "type": "string", // Required: Activity type (e.g., "Call", "Meeting")
  "status": "string", // Required: Status (e.g., "Planned", "Held")
  "dateStart": "ISO8601", // Required: Start date/time
  "dateEnd": "ISO8601", // Optional: End date/time
  "description": "string", // Optional: Activity description
  "parentType": "string", // Optional: Parent entity type (e.g., "Lead")
  "parentId": "string", // Optional: Parent entity UUID
  "assignedUserId": "string" // Optional: Assigned user UUID
}
```

**Success Response** (201 Created):

```json
{
  "id": "uuid-string",
  "name": "string",
  "type": "string"
  // ... other fields ...
}
```

### Get Lead

**Endpoint**: `GET /Lead/{id}`

**Request Headers**:

```
X-Api-Key: {API_KEY}
```

**Path Parameters**:

- `id`: Lead UUID

**Success Response** (200 OK):

```json
{
  "id": "uuid-string",
  "name": "string",
  "firstName": "string",
  "lastName": "string",
  "emailAddress": "string",
  "phoneNumber": "string",
  "source": "string",
  "description": "string",
  "createdAt": "ISO8601",
  "modifiedAt": "ISO8601"
}
```

**Error Response** (404 Not Found):

```json
{
  "error": "Not Found",
  "message": "Lead not found"
}
```

## Field Mapping

### Application to EspoCRM Lead

| Application Field          | EspoCRM Field  | Transformation                   |
| -------------------------- | -------------- | -------------------------------- |
| `personal_info.first_name` | `firstName`    | Direct                           |
| `personal_info.last_name`  | `lastName`     | Direct                           |
| `personal_info.email`      | `emailAddress` | Direct                           |
| `personal_info.phone`      | `phoneNumber`  | Direct                           |
| `source`                   | `source`       | Direct                           |
| `additional_info`          | `description`  | Append preferences               |
| `ref`                      | `description`  | Append as "Referral: {code}"     |
| `preferences.universities` | `description`  | Append as "Universities: {list}" |

**Name Field Construction**:

```typescript
const name = `Application - ${firstName} ${lastName}`
```

### Messenger Event to EspoCRM Activity

| Event Field    | EspoCRM Field | Transformation                 |
| -------------- | ------------- | ------------------------------ |
| `channel`      | `name`        | `"Messenger click: {channel}"` |
| `channel`      | `type`        | `"Call"` (generic type)        |
| -              | `status`      | `"Held"` (completed)           |
| -              | `dateStart`   | `new Date().toISOString()`     |
| -              | `dateEnd`     | `new Date().toISOString()`     |
| `referralCode` | `description` | `"Referral: {code}"`           |
| `session`      | `description` | Append `"Session: {id}"`       |
| `utm`          | `description` | Append `"UTM: {json}"`         |
| `metadata`     | `description` | Append `"Metadata: {json}"`    |

## Error Handling

### HTTP Status Codes

| Status | Meaning             | Action                           |
| ------ | ------------------- | -------------------------------- |
| 200    | Success             | Process response                 |
| 201    | Created             | Extract ID from response         |
| 400    | Bad Request         | Return validation error          |
| 401    | Unauthorized        | Return auth error, check API key |
| 403    | Forbidden           | Return permission error          |
| 404    | Not Found           | Return not found error           |
| 429    | Rate Limit          | Retry after delay                |
| 500    | Server Error        | Retry with backoff               |
| 502    | Bad Gateway         | Retry with backoff               |
| 503    | Service Unavailable | Retry with backoff               |

### Retry Logic

**Retryable Errors**:

- Network timeout
- 429 Rate Limit (wait 1 second)
- 500, 502, 503 Server Errors

**Non-Retryable Errors**:

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found

**Retry Configuration**:

```typescript
{
  maxRetries: 2,
  retryDelay: 1000,  // 1 second
  timeout: 15000     // 15 seconds
}
```

## Request/Response Examples

### Example: Create Lead from Application

**Request**:

```http
POST /api/v1/Lead HTTP/1.1
Host: crm.example.com
Content-Type: application/json
X-Api-Key: abc123xyz

{
  "name": "Application - Ivan Ivanov",
  "firstName": "Ivan",
  "lastName": "Ivanov",
  "emailAddress": "ivan@example.com",
  "phoneNumber": "+79001234567",
  "source": "website",
  "description": "Source: Main page\nUniversities: Boğaziçi University\nAdditional info: Need campus in center"
}
```

**Response**:

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "507f1f77bcf86cd799439011",
  "name": "Application - Ivan Ivanov",
  "firstName": "Ivan",
  "lastName": "Ivanov",
  "emailAddress": "ivan@example.com",
  "phoneNumber": "+79001234567",
  "source": "website",
  "description": "Source: Main page\nUniversities: Boğaziçi University\nAdditional info: Need campus in center",
  "createdAt": "2025-10-05T15:20:00Z"
}
```

### Example: Create Activity from Messenger Event

**Request**:

```http
POST /api/v1/Activity HTTP/1.1
Host: crm.example.com
Content-Type: application/json
X-Api-Key: abc123xyz

{
  "name": "Messenger click: telegram",
  "type": "Call",
  "status": "Held",
  "dateStart": "2025-10-05T15:20:00Z",
  "dateEnd": "2025-10-05T15:20:00Z",
  "description": "Channel: telegram\nReferral: partner123\nSession: sess_abc123\nUTM: {\"utm_source\":\"facebook\",\"utm_campaign\":\"fall2025\"}"
}
```

**Response**:

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "507f1f77bcf86cd799439012",
  "name": "Messenger click: telegram",
  "type": "Call",
  "status": "Held",
  "dateStart": "2025-10-05T15:20:00Z",
  "dateEnd": "2025-10-05T15:20:00Z",
  "description": "Channel: telegram\nReferral: partner123\nSession: sess_abc123\nUTM: {\"utm_source\":\"facebook\",\"utm_campaign\":\"fall2025\"}",
  "createdAt": "2025-10-05T15:20:00Z"
}
```

## Rate Limiting

**Expected Limits**:

- 100 requests per minute per API key
- 1000 requests per hour per API key

**Handling**:

- Respect `Retry-After` header if present
- Implement exponential backoff for 429 responses
- Log rate limit warnings for monitoring

## Security

**API Key Storage**:

- Store in environment variables only
- Never log API key in plaintext
- Rotate keys periodically

**HTTPS Required**:

- All requests MUST use HTTPS
- Reject HTTP connections

**Data Sanitization**:

- Sanitize all user input before sending to API
- Remove sensitive data from logs
- Validate response data before processing

## Testing

**Mock Responses**:

- Use test fixtures for integration tests
- Mock HTTP client for unit tests
- Verify request headers and body in tests

**Contract Tests**:

- Verify request/response schema compliance
- Test error handling for all status codes
- Validate field mapping transformations

---

**API Version**: v1  
**Last Updated**: 2025-10-05  
**Breaking Changes**: None (new integration)
