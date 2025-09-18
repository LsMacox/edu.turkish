import type { FAQItem, FAQCategory } from '../types/api'

/**
 * Parse query parameters for universities endpoint
 */
export function parseUniversityFilters(query: Record<string, any>) {
  return {
    q: query.q as string || '',
    city: query.city as string || '',
    langs: Array.isArray(query.langs) ? query.langs : (query.langs ? [query.langs] : []),
    type: query.type as string || '',
    level: query.level as string || '',
    price_min: query.price_min ? Number(query.price_min) : 0,
    price_max: query.price_max ? Number(query.price_max) : 20000,
    sort: query.sort as string || 'pop',
    page: query.page ? Number(query.page) : 1,
    limit: query.limit ? Number(query.limit) : 6
  }
}

/**
 * Parse query parameters for reviews endpoint
 */
export function parseReviewFilters(query: Record<string, any>) {
  return {
    type: query.type as string || 'all',
    featured: query.featured === 'true',
    page: query.page ? Number(query.page) : 1,
    limit: query.limit ? Number(query.limit) : 50
  }
}

/**
 * Parse query parameters for FAQ endpoint
 */
export function parseFAQFilters(query: Record<string, any>) {
  return {
    q: query.q as string || '',
    category: query.category as string || 'all',
    featured: query.featured === 'true',
    limit: query.limit ? Number(query.limit) : 50
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
  const searchTerms = query.split(' ').filter(term => term.length > 1)
  
  return faqs
    .map(faq => {
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
      searchTerms.forEach(term => {
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
    .filter(faq => faq.relevance_score > 0)
    .sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0))
}

/**
 * Get FAQ categories with counts
 */
export function getFAQCategories(faqs: FAQItem[]): FAQCategory[] {
  const categoryMap = new Map<string, number>()
  
  faqs.forEach(faq => {
    const count = categoryMap.get(faq.category) || 0
    categoryMap.set(faq.category, count + 1)
  })
  
  const categories: FAQCategory[] = [
    { key: 'all', name: 'All Questions', count: faqs.length }
  ]
  
  // Add specific categories
  const categoryNames: Record<string, string> = {
    'documents': 'Documents and Application',
    'exams': 'Exams and Testing',
    'admission': 'Admission Process',
    'scholarships': 'Scholarships and Financial Aid',
    'languages': 'Language Requirements'
  }
  
  Array.from(categoryMap.entries()).forEach(([key, count]) => {
    if (categoryNames[key]) {
      categories.push({
        key,
        name: categoryNames[key],
        count
      })
    }
  })
  
  return categories
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit)
  
  return {
    total,
    page: Math.max(1, page),
    limit: Math.max(1, limit),
    totalPages: Math.max(1, totalPages)
  }
}

/**
 * Validate application request data
 */
export function validateApplicationData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data.personal_info?.first_name?.trim()) {
    errors.push('First name is required')
  }
  
  // Last name is optional
  // Email is optional, but if provided validate format
  if (data.personal_info?.email?.trim()) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal_info.email)) {
      errors.push('Invalid email format')
    }
  }
  
  if (!data.personal_info?.phone?.trim()) {
    errors.push('Phone number is required')
  }
  
  if (!data.education?.level?.trim()) {
    errors.push('Education level is required')
  }
  
  // Universities preference is optional
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
