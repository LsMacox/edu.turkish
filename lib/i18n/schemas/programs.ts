/**
 * Programs Page Schema - programs.json
 */

export interface ProgramsSchema {
    meta: {
        title: string
        description: string
    }
    list: {
        title: string
        description: string
    }
    hero: {
        title: string
        titleAccent: string
        description: string
        stats: {
            programs: string
            categories: string
            support: string
        }
    }
    learnMore: string
    loading: string
    empty: string
    emptyTitle: string
    error: string
    errorTitle: string
    retry: string
    /** @placeholder {count} - Number of programs */
    categorySubtitle: string
    cta: {
        title: string
        description: string
        universities: string
        contact: string
    }
    detail: {
        fallbackDescription: string
        loading: string
        notFound: string
        error: string
        allPrograms: string
        backToPrograms: string
        tableOfContents: string
        quickFacts: string
        category: string
        published: string
        readingTime: string
        tags: string
        share: {
            title: string
            description: string
            copyLink: string
            copySuccess: string
            copyError: string
        }
    }
}
