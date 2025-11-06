export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ErrorResponse {
  error: ApiError
  validation_errors?: ValidationError[]
  timestamp: string
  path: string
}

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
