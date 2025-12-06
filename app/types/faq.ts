/**
 * Structured FAQ answer with optional title and list items
 */
export interface FaqStructuredAnswer {
  title?: string
  items?: string[]
  ordered?: boolean
}

/**
 * FAQ answer can be a simple string or a structured object
 */
export type FaqAnswer = string | FaqStructuredAnswer

/**
 * FAQ item with question and answer
 */
export interface FaqItem {
  question: string
  answer: FaqAnswer
}

/**
 * Type guard to check if answer is a string
 */
export function isStringAnswer(answer: FaqAnswer): answer is string {
  return typeof answer === 'string'
}

/**
 * Type guard to check if answer is structured
 */
export function isStructuredAnswer(answer: FaqAnswer): answer is FaqStructuredAnswer {
  return typeof answer === 'object' && answer !== null
}
