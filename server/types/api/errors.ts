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
