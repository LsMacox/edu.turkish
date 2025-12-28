/**
 * FAQ Page Schema - faq.json
 */

export interface FaqSchema {
    meta: {
        title: string
        description: string
    }
    title: string
    subtitle: string
    heroImageAlt: string
    searchPlaceholder: string
    searching: string
    /** @placeholder {count} - Number of results, {query} - Search query */
    searchResults: string
    /** @placeholder {query} - Search query */
    noResults: string
    noResultsTitle: string
    /** @placeholder {query} - Search query */
    noResultsMessage: string
    tryThese: string
    showAllQuestions: string
    startSearching: string
    startSearchingMessage: string
    recentSearches: string
    clearHistory: string
    popularSearches: {
        documents: string
        scholarships: string
        exams: string
        language: string
    }
    categories: {
        all: {
            title: string
        }
    }
}
