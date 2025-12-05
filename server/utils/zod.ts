import type { ZodError } from 'zod'

export const formatZodError = (error: ZodError) => {
  const fieldErrors: Record<string, { code: string }[]> = {}

  for (const issue of error.issues) {
    const path = issue.path.join('.')
    fieldErrors[path] ??= []
    fieldErrors[path].push({ code: issue.message })
  }

  return { error: 'ValidationError', fieldErrors }
}
