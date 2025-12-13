/**
 * FAQ answer is a simple string
 */
export type FaqAnswer = string

/**
 * FAQ item with question and flexible answer type (string or structured)
 * Used for client-side rendering with rich answer formatting
 */
export interface FaqItem {
    question: string
    answer: FaqAnswer
}

/**
 * FAQ item from API with simple string answer
 * Used for API responses from database
 */
export interface FaqApiItem {
    id: number
    question: string
    answer: string
    category: string
}

/**
 * FAQ category with item count
 */
export interface FaqCategory {
    key: string
    name: string
    count: number
}


