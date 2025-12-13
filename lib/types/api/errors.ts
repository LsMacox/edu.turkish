/**
 * API Error types for error responses
 */

export interface FieldErrorIssue {
    code: string
    meta?: Record<string, any>
}

export interface ValidationErrorResponse {
    error: string
    fieldErrors?: Record<string, FieldErrorIssue[]>
    nonFieldErrors?: FieldErrorIssue[]
    traceId?: string
}
