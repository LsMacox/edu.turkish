import type { ZodError, ZodIssue } from 'zod'
import type { ValidationErrorResponse, FieldErrorIssue } from '~~/server/types/api'

const mapZodCodeToErrorCode = (issue: ZodIssue): string => {
  if (issue.message && issue.message !== issue.code) {
    return issue.message
  }

  switch (issue.code) {
    case 'too_small':
      return (issue as any).minimum === 1 ? 'required' : 'min_length'
    case 'too_big':
      return 'max_length'
    case 'invalid_type':
      return 'required'
    case 'custom':
      return issue.message || 'invalid'
    default:
      if ('validation' in issue && issue.validation === 'email') return 'invalid_email'
      return 'invalid_format'
  }
}

const extractMeta = (issue: ZodIssue): Record<string, any> | undefined => {
  const meta: Record<string, any> = {}

  if (issue.code === 'too_small') {
    if ('minimum' in issue) meta.min = issue.minimum
  }
  if (issue.code === 'too_big') {
    if ('maximum' in issue) meta.max = issue.maximum
  }

  return Object.keys(meta).length > 0 ? meta : undefined
}

export const formatZodError = (error: ZodError): ValidationErrorResponse => {
  const fieldErrors: Record<string, FieldErrorIssue[]> = {}

  for (const issue of error.issues) {
    const path = issue.path.join('.')
    const code = mapZodCodeToErrorCode(issue)
    const meta = extractMeta(issue)

    if (!fieldErrors[path]) {
      fieldErrors[path] = []
    }

    fieldErrors[path].push({
      code,
      ...(meta && { meta }),
    })
  }

  return {
    error: 'ValidationError',
    fieldErrors,
    traceId: Math.random().toString(36).substring(2, 12),
  }
}

export const createNonFieldError = (code: string, meta?: Record<string, any>): ValidationErrorResponse => {
  return {
    error: 'ValidationError',
    nonFieldErrors: [{ code, ...(meta && { meta }) }],
    traceId: Math.random().toString(36).substring(2, 12),
  }
}
