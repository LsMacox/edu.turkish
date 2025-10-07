import type { FAQCategory, FAQItem } from '~~/server/types/api'
import { toPositiveIntegerWithDefault } from '~~/lib/number'

/**
 * Parse query parameters for FAQ endpoint
 */
export function parseFAQFilters(query: Record<string, any>) {
  const lang = typeof query.lang === 'string' ? query.lang.trim() : ''

  return {
    q: (query.q as string) || '',
    category: (query.category as string) || 'all',
    featured: query.featured === 'true',
    limit: toPositiveIntegerWithDefault(query.limit, 50),
    ...(lang ? { lang } : {}),
  }
}

/**
 * Search FAQs by query string with relevance scoring
 * Updated to handle simplified string answers
 */
export function searchFAQs(faqs: FAQItem[], searchQuery: string): FAQItem[] {
  if (!searchQuery.trim()) {
    return faqs
  }

  const query = searchQuery.toLowerCase()
  const searchTerms = query.split(' ').filter((term) => term.length > 1)

  return faqs
    .map((faq) => {
      let score = 0
      const questionLower = faq.question.toLowerCase()
      const answerText = faq.answer.toLowerCase()

      // Exact phrase match in question (highest score)
      if (questionLower.includes(query)) {
        score += 100
      }

      // Exact phrase match in answer (strip HTML tags for search)
      const plainTextAnswer = answerText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')
      if (plainTextAnswer.includes(query)) {
        score += 50
      }

      // Individual term matches
      searchTerms.forEach((term) => {
        if (questionLower.includes(term)) {
          score += 20
        }
        if (plainTextAnswer.includes(term)) {
          score += 10
        }
      })

      // Boost featured items slightly
      if (faq.featured) {
        score += 5
      }

      return { ...faq, relevance_score: score }
    })
    .filter((faq) => faq.relevance_score > 0)
    .sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0))
}

/**
 * Get FAQ categories with counts
 */
export function getFAQCategories(faqs: FAQItem[]): FAQCategory[] {
  const categoryMap = new Map<string, number>()

  faqs.forEach((faq) => {
    const count = categoryMap.get(faq.category) || 0
    categoryMap.set(faq.category, count + 1)
  })

  const categories: FAQCategory[] = [{ key: 'all', name: 'All Questions', count: faqs.length }]

  const categoryNames: Record<string, string> = {
    documents: 'Documents and Application',
    exams: 'Exams and Testing',
    admission: 'Admission Process',
    scholarships: 'Scholarships and Financial Aid',
    languages: 'Language Requirements',
  }

  Array.from(categoryMap.entries()).forEach(([key, count]) => {
    if (categoryNames[key]) {
      categories.push({
        key,
        name: categoryNames[key],
        count,
      })
    }
  })

  return categories
}
